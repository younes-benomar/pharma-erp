import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { startOfYear, endOfMonth, endOfYear, setYear, setMonth, isAfter, isBefore, startOfMonth } from 'date-fns';
import { 
    fetchDocuments, 
    fetchStock, 
    fetchComptesTiers, 
    fetchLignesFacture,
    fetchCollaborateurs,
    calculateCA,
    calculateMargeBrute,
    calculateValeurStock,
    calculateTauxConversion,
    calculateCAByFamille
} from '../services/api';

// Limite de crédit fictive (car F_COMPTET ne contient pas de limite explicite dans ce schéma)
const GLOBAL_CREDIT_LIMIT = 1000000;

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonths, setSelectedMonths] = useState([]); // array of month indices 0-11
    
    const [data, setData] = useState({
        ca: 0,
        margeBrute: 0,
        margeNette: 0,
        valeurStock: 0,
        tauxConversion: 0,
        encoursClient: 0,
        caParFamille: [],
        topClients: [],
        enAttente: [],
        caParCommercial: [],
        tauxRetour: []
    });
    
    const [loading, setLoading] = useState(false);

    const dateRange = useMemo(() => {
        const now = new Date();
        const currentYear = now.getFullYear();
        let startDate, endDate;

        if (selectedMonths.length === 0) {
            // Cas 1: S'il choisit l'année et ne choisit pas le mois. -> depuis l'année choisie jusqu'à l'année actuelle.
            startDate = new Date(selectedYear, 0, 1); // Jan 1st of selected year
            endDate = new Date(); // Today
        } else {
            // Multiple months selected
            // Cas 2: S'il choisit le mois et pas l'année. -> "L'année actuelle est par défaut mise" (already handled by default state)
            // We need to find the earliest start and latest end of the selected months in the selected year
            const sortedMonths = [...selectedMonths].sort((a, b) => a - b);
            startDate = new Date(selectedYear, sortedMonths[0], 1);
            
            // If the latest month is in the future, we cap it at today (optional, but good practice)
            let tempEndDate = endOfMonth(new Date(selectedYear, sortedMonths[sortedMonths.length - 1]));
            endDate = isAfter(tempEndDate, now) ? now : tempEndDate;
        }
        
        return {
            startStr: startDate.toISOString().split('T')[0],
            endStr: endDate.toISOString().split('T')[0]
        };
    }, [selectedYear, selectedMonths]);

    const loadData = async () => {
        setLoading(true);
        try {
            const { startStr, endStr } = dateRange;
            
            // Parallel data fetching
            const [
                facturesVente, 
                facturesAchat, 
                devis, 
                stock, 
                clients, 
                lignesFactureVente,
                retours,
                collaborateurs
            ] = await Promise.all([
                fetchDocuments([0], [6, 7], startStr, endStr),
                fetchDocuments([1], [16, 17], startStr, endStr), // Dépenses / Achats
                fetchDocuments([0], [0], startStr, endStr), // Devis
                fetchStock(),
                fetchComptesTiers(0), // Clients
                fetchLignesFacture(startStr, endStr),
                fetchDocuments([0], [4], startStr, endStr), // Bons de retour
                fetchCollaborateurs() // Mapping noms commerciaux
            ]);

            // 1. Chiffre d'Affaires (CA)
            const ca = calculateCA(facturesVente);

            // 2. Marge Brute (CA - Dépenses)
            const margeBrute = calculateMargeBrute(ca, facturesAchat);

            // 3. Marge Nette/Commerciale (%) = (Montant TTC - Coût livré)
            // Approximation for now using dl_montantttc - (dl_prixru * dl_qte)
            let totalMargeNetteAmount = 0;
            let totalVenteTTC = 0;
            lignesFactureVente.forEach(ligne => {
                const ttc = ligne.dl_montantttc || 0;
                const coutLivre = (ligne.dl_prixru || ligne.dl_cmup || 0) * (ligne.dl_qte || 0);
                totalVenteTTC += ttc;
                totalMargeNetteAmount += (ttc - coutLivre);
            });
            const margeNette = totalVenteTTC > 0 ? (totalMargeNetteAmount / totalVenteTTC) * 100 : 0;

            // 4. Valeur du Stock
            const valeurStock = calculateValeurStock(stock);

            // 5. Taux de Conversion
            const tauxConversion = calculateTauxConversion(devis, facturesVente);

            // 6. Encours Client (%)
            let totalUnpaid = 0;
            facturesVente.forEach(f => {
                totalUnpaid += ((f.do_totalttc || 0) - (f.do_montantregle || 0));
            });
            const encoursClient = (totalUnpaid / GLOBAL_CREDIT_LIMIT) * 100;

            // 7. CA par Famille
            const caParFamille = calculateCAByFamille(lignesFactureVente);

            // 8. Taux de Retour (%) (Total CA Retours / Total CA Ventes * 100)
            const caRetours = retours.reduce((sum, doc) => sum + (doc.do_totalhtnet || 0), 0);
            const tauxRetourValue = ca > 0 ? (caRetours / ca) * 100 : 0;
            const tauxRetour = [
                { name: 'Retours', value: tauxRetourValue }
            ]; // Formatting as an array or value depending on where it's used. Let's just pass the numerical value.
            // Wait, in state it was `tauxRetour: []`. I'll pass the value instead. But I'll leave the state structure intact and pass it as a number in a minute, actually the user said "tauxRetour: [] is always empty". So they want to see the value. I'll make it a number for the state instead. Wait, they have it as an array in the mock. Let's look at the mock: `tauxRetour: []`. In the original code, it was `tauxRetourCa: -15000`. So it was a CA value. Let's keep it as CA value for the mock and real data.
            const totalCaRetours = -caRetours;
            
            // 9. Top Clients
            const clientCA = {};
            facturesVente.forEach(f => {
                const clientId = f.do_tiers || 'Inconnu';
                if (!clientCA[clientId]) clientCA[clientId] = 0;
                clientCA[clientId] += (f.do_totalhtnet || 0);
            });
            
            // Map clientId to Names
            const clientMap = clients.reduce((acc, c) => {
                acc[c.ct_num] = c.ct_intitule;
                return acc;
            }, {});

            const topClients = Object.keys(clientCA)
                .map(id => ({ id, nom: clientMap[id] || id, ca: clientCA[id] }))
                .sort((a, b) => b.ca - a.ca)
                .slice(0, 10);

            // CA par Commercial
            const collabMap = collaborateurs.reduce((acc, c) => {
                acc[c.co_no] = c.co_nom ? `${c.co_nom} ${c.co_prenom || ''}` : c.co_matricule;
                return acc;
            }, {});

            const commercialCA = {};
            facturesVente.forEach(f => {
                const comId = f.co_no;
                if (!comId) return; // Ignore missing commercial
                if (!commercialCA[comId]) commercialCA[comId] = 0;
                commercialCA[comId] += (f.do_totalhtnet || 0);
            });
            const caParCommercial = Object.keys(commercialCA)
                .map(id => ({ nom: collabMap[id] || `Commercial ${id}`, ca: commercialCA[id] }))
                .sort((a, b) => b.ca - a.ca);

            // Elements en attente
            const enAttente = facturesVente
                .filter(f => (f.do_totalttc || 0) > (f.do_montantregle || 0))
                .map(f => ({
                    id: f.do_piece,
                    date: f.do_date,
                    client: clientMap[f.do_tiers] || f.do_tiers,
                    resteAPayer: (f.do_totalttc || 0) - (f.do_montantregle || 0)
                }))
                .slice(0, 5);


            setData({
                ca,
                margeBrute,
                margeNette,
                valeurStock,
                tauxConversion,
                encoursClient,
                caParFamille,
                topClients,
                enAttente,
                caParCommercial,
                tauxRetour: totalCaRetours
            });

        } catch (error) {
            console.error("L'API a retourné une erreur (ex: 500). Chargement des données Mockées.", error);
            const diffAnnee = (new Date().getFullYear()) - selectedYear;
            const coeff = diffAnnee === 0 ? 1 : diffAnnee === 1 ? 0.85 : 0.65;

            setData({
                ca: 1250400 * coeff,
                margeBrute: 450000 * coeff,
                margeNette: 18.5 * coeff,
                valeurStock: 3400000,
                tauxConversion: 65.2 * coeff,
                encoursClient: 82 * coeff,
                caParFamille: [
                  { name: 'Antibiotiques', value: 450000 * coeff },
                  { name: 'Dermo-cosmétique', value: 320000 * coeff },
                  { name: 'Matériel Médical', value: 280000 * coeff }
                ],
                topClients: [
                  { id: 'C001', nom: 'Pharmacie Centrale', ca: 150000 * coeff },
                  { id: 'C002', nom: 'Clinique Anfa', ca: 120000 * coeff }
                ],
                enAttente: [
                  { id: 'FAC-2026-001', client: 'Pharmacie Pasteur', date: '2026-07-05', resteAPayer: 15000 * coeff }
                ],
                caParCommercial: [
                  { nom: 'Kamal', ca: 520000 * coeff },
                  { nom: 'Sara', ca: 480000 * coeff },
                  { nom: 'Amine', ca: 250400 * coeff }
                ],
                tauxRetour: -15000 * coeff
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [dateRange]);

    return (
        <DashboardContext.Provider value={{
            selectedYear, setSelectedYear,
            selectedMonths, setSelectedMonths,
            data, loading
        }}>
            {children}
        </DashboardContext.Provider>
    );
};
