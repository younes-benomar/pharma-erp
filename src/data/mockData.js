// ============================================================
//  PHARMA-ERP — Mock Data (aligned with DB schema)
//  Switch USE_MOCK to false in src/services/api.js when API is ready
// ============================================================

// ------- F_COLLABORATEUR -------
export const collaborateurs = [
  { co_no: 1, co_nom: 'Benomar',  co_prenom: 'Younes',  co_fonction: 'Responsable Stock',  co_vendeur: 1, co_acheteur: 0, co_telephone: '0661234567', co_email: 'y.benomar@pharma.ma',  co_matricule: 'COL001' },
  { co_no: 2, co_nom: 'El Fassi', co_prenom: 'Sara',    co_fonction: 'Commercial',          co_vendeur: 1, co_acheteur: 0, co_telephone: '0662345678', co_email: 's.elfassi@pharma.ma', co_matricule: 'COL002' },
  { co_no: 3, co_nom: 'Idrissi',  co_prenom: 'Karim',   co_fonction: 'Acheteur',            co_vendeur: 0, co_acheteur: 1, co_telephone: '0663456789', co_email: 'k.idrissi@pharma.ma', co_matricule: 'COL003' },
  { co_no: 4, co_nom: 'Moussaoui',co_prenom: 'Nadia',   co_fonction: 'Admin',               co_vendeur: 0, co_acheteur: 0, co_telephone: '0664567890', co_email: 'n.moussaoui@pharma.ma',co_matricule: 'COL004' },
];

// ------- F_FAMILLE -------
export const familles = [
  { fa_codeFamille: 'ANTALGIQ', fa_intitule: 'Antalgiques',        fa_type: 0, fa_suiviStock: 2 },
  { fa_codeFamille: 'ANTIBIOT', fa_intitule: 'Antibiotiques',      fa_type: 0, fa_suiviStock: 5 },
  { fa_codeFamille: 'COMPLEME', fa_intitule: 'Compléments',        fa_type: 0, fa_suiviStock: 2 },
  { fa_codeFamille: 'COSMETIQ', fa_intitule: 'Cosmétiques',        fa_type: 0, fa_suiviStock: 2 },
  { fa_codeFamille: 'VITAMINES',fa_intitule: 'Vitamines',          fa_type: 0, fa_suiviStock: 2 },
  { fa_codeFamille: 'CARDIOLO', fa_intitule: 'Cardiologie',        fa_type: 0, fa_suiviStock: 2 },
];

// ------- F_DEPOT -------
export const depots = [
  { de_no: 1, de_intitule: 'Maarif'    },
  { de_no: 2, de_intitule: 'Ain Sebaa' },
  { de_no: 3, de_intitule: 'Hay Mohammadi' },
];

// ------- F_ARTICLE -------
export const articles = [
  { ar_ref: 'MED001', ar_design: 'Doliprane 1000mg',    fa_codeFamille: 'ANTALGIQ', ar_prixAch: 15,  ar_prixVen: 22,  ar_prixTTC: 1, ar_suiviStock: 2, ar_codeBarre: '3400936133360', ar_sommeil: 0, ar_nature: 2 },
  { ar_ref: 'MED002', ar_design: 'Amoxicilline 1g',     fa_codeFamille: 'ANTIBIOT', ar_prixAch: 30,  ar_prixVen: 45,  ar_prixTTC: 1, ar_suiviStock: 5, ar_codeBarre: '3401043074773', ar_sommeil: 0, ar_nature: 2 },
  { ar_ref: 'MED003', ar_design: 'Whey Protein 1kg',    fa_codeFamille: 'COMPLEME', ar_prixAch: 250, ar_prixVen: 400, ar_prixTTC: 1, ar_suiviStock: 2, ar_codeBarre: '3760276600123', ar_sommeil: 0, ar_nature: 2 },
  { ar_ref: 'MED004', ar_design: 'Écran Solaire SPF50', fa_codeFamille: 'COSMETIQ', ar_prixAch: 80,  ar_prixVen: 150, ar_prixTTC: 1, ar_suiviStock: 2, ar_codeBarre: '3337875538038', ar_sommeil: 0, ar_nature: 2 },
  { ar_ref: 'MED005', ar_design: 'Vitamine C 1000mg',   fa_codeFamille: 'VITAMINES',ar_prixAch: 20,  ar_prixVen: 45,  ar_prixTTC: 1, ar_suiviStock: 2, ar_codeBarre: '3760001234567', ar_sommeil: 0, ar_nature: 2 },
  { ar_ref: 'MED006', ar_design: 'Sérum Visage Anti-Âge',fa_codeFamille:'COSMETIQ', ar_prixAch: 120, ar_prixVen: 250, ar_prixTTC: 1, ar_suiviStock: 2, ar_codeBarre: '3605532012345', ar_sommeil: 0, ar_nature: 2 },
  { ar_ref: 'MED007', ar_design: 'Amlodipine 5mg',      fa_codeFamille: 'CARDIOLO', ar_prixAch: 12,  ar_prixVen: 28,  ar_prixTTC: 1, ar_suiviStock: 2, ar_codeBarre: '3400928128504', ar_sommeil: 0, ar_nature: 2 },
  { ar_ref: 'MED008', ar_design: 'Ibuprofène 400mg',    fa_codeFamille: 'ANTALGIQ', ar_prixAch: 10,  ar_prixVen: 18,  ar_prixTTC: 1, ar_suiviStock: 2, ar_codeBarre: '3400936522224', ar_sommeil: 0, ar_nature: 2 },
  { ar_ref: 'MED009', ar_design: 'Zinc 15mg',           fa_codeFamille: 'VITAMINES',ar_prixAch: 18,  ar_prixVen: 38,  ar_prixTTC: 1, ar_suiviStock: 2, ar_codeBarre: '3701234567890', ar_sommeil: 1, ar_nature: 2 },
];

// ------- F_ARTSTOCK -------
export const artStock = [
  { ar_ref: 'MED001', as_qtesto: 4,   de_no: 1, seuil_alerte: 10, peremption: '2028-12-01' },
  { ar_ref: 'MED002', as_qtesto: 120, de_no: 1, seuil_alerte: 20, peremption: '2026-07-15' },
  { ar_ref: 'MED003', as_qtesto: 15,  de_no: 2, seuil_alerte: 5,  peremption: '2027-05-10' },
  { ar_ref: 'MED004', as_qtesto: 0,   de_no: 2, seuil_alerte: 5,  peremption: '2028-01-01' },
  { ar_ref: 'MED005', as_qtesto: 50,  de_no: 1, seuil_alerte: 15, peremption: '2027-11-20' },
  { ar_ref: 'MED006', as_qtesto: 8,   de_no: 1, seuil_alerte: 10, peremption: '2026-06-10' },
  { ar_ref: 'MED007', as_qtesto: 60,  de_no: 3, seuil_alerte: 10, peremption: '2027-09-30' },
  { ar_ref: 'MED008', as_qtesto: 3,   de_no: 1, seuil_alerte: 20, peremption: '2027-03-15' },
  { ar_ref: 'MED009', as_qtesto: 25,  de_no: 2, seuil_alerte: 10, peremption: '2026-10-01' },
];

// ------- F_COMPTET (Clients & Fournisseurs) -------
export const comptes = [
  { ct_num: 'CLI001', ct_intitule: 'Pharmacie El Amine',    ct_type: 0, ct_contact: 'M. Amine Kabbaj',  ct_telephone: '0522112233', ct_email: 'contact@elamine.ma',    ct_ville: 'Casablanca', ct_sommeil: 0, co_no: 2 },
  { ct_num: 'CLI002', ct_intitule: 'Pharmacie Safa',        ct_type: 0, ct_contact: 'Mme. Safa Nejjar', ct_telephone: '0522334455', ct_email: 'safa.pharma@gmail.com',  ct_ville: 'Rabat',      ct_sommeil: 0, co_no: 2 },
  { ct_num: 'CLI003', ct_intitule: 'Clinique Atlas',        ct_type: 0, ct_contact: 'Dr. Hamid Tazi',   ct_telephone: '0522556677', ct_email: 'atlas@clinique.ma',      ct_ville: 'Marrakech',  ct_sommeil: 0, co_no: 2 },
  { ct_num: 'CLI004', ct_intitule: 'Centre Médical Nord',   ct_type: 0, ct_contact: 'Mme. Laila Filali',ct_telephone: '0522778899', ct_email: 'nord@cmedical.ma',       ct_ville: 'Fès',        ct_sommeil: 1, co_no: 2 },
  { ct_num: 'FOU001', ct_intitule: 'SOTHEMA Pharma',        ct_type: 1, ct_contact: 'M. Rachid Alami',  ct_telephone: '0537001122', ct_email: 'commandes@sothema.ma',   ct_ville: 'Rabat',      ct_sommeil: 0, co_no: 3 },
  { ct_num: 'FOU002', ct_intitule: 'Cooper Pharma',         ct_type: 1, ct_contact: 'Mme. Zineb Maroc', ct_telephone: '0537223344', ct_email: 'achats@cooper.ma',       ct_ville: 'Casablanca', ct_sommeil: 0, co_no: 3 },
  { ct_num: 'FOU003', ct_intitule: 'Laprophan',             ct_type: 1, ct_contact: 'M. Omar Senhaji',  ct_telephone: '0537445566', ct_email: 'omar@laprophan.ma',      ct_ville: 'Casablanca', ct_sommeil: 0, co_no: 3 },
];

// ------- F_DOCENTETE (Document headers) -------
export const docEntetes = [
  { do_domaine: 0, do_type: 6, do_piece: 'FAV-2026-001', do_date: '2026-06-20', do_ref: 'EXT-4521', do_tiers: 'CLI001', co_no: 2, do_totalHT: 4800,  do_totalTTC: 5760,  do_montantRegle: 5760  },
  { do_domaine: 0, do_type: 6, do_piece: 'FAV-2026-002', do_date: '2026-06-18', do_ref: 'EXT-4520', do_tiers: 'CLI002', co_no: 2, do_totalHT: 2200,  do_totalTTC: 2640,  do_montantRegle: 2640  },
  { do_domaine: 0, do_type: 3, do_piece: 'BLV-2026-011', do_date: '2026-06-22', do_ref: '',         do_tiers: 'CLI003', co_no: 2, do_totalHT: 900,   do_totalTTC: 1080,  do_montantRegle: 0     },
  { do_domaine: 0, do_type: 1, do_piece: 'BCV-2026-007', do_date: '2026-06-23', do_ref: '',         do_tiers: 'CLI001', co_no: 2, do_totalHT: 3500,  do_totalTTC: 4200,  do_montantRegle: 0     },
  { do_domaine: 1, do_type: 16,do_piece: 'FAA-2026-003', do_date: '2026-06-15', do_ref: 'SOTH-889', do_tiers: 'FOU001', co_no: 3, do_totalHT: 12000, do_totalTTC: 14400, do_montantRegle: 14400 },
  { do_domaine: 1, do_type: 12,do_piece: 'BCA-2026-005', do_date: '2026-06-21', do_ref: '',         do_tiers: 'FOU002', co_no: 3, do_totalHT: 7500,  do_totalTTC: 9000,  do_montantRegle: 0     },
  { do_domaine: 1, do_type: 13,do_piece: 'BLA-2026-008', do_date: '2026-06-19', do_ref: 'COOP-210', do_tiers: 'FOU002', co_no: 3, do_totalHT: 6800,  do_totalTTC: 8160,  do_montantRegle: 8160  },
];

// ------- F_DOCLIGNE (Document lines) -------
export const docLignes = [
  { do_piece: 'FAV-2026-001', ar_ref: 'MED001', dl_design: 'Doliprane 1000mg',    dl_qte: 100, dl_prixUnitaire: 22,  dl_montantHT: 2200 },
  { do_piece: 'FAV-2026-001', ar_ref: 'MED005', dl_design: 'Vitamine C 1000mg',   dl_qte: 50,  dl_prixUnitaire: 45,  dl_montantHT: 2250 },
  { do_piece: 'FAV-2026-001', ar_ref: 'MED008', dl_design: 'Ibuprofène 400mg',    dl_qte: 30,  dl_prixUnitaire: 18,  dl_montantHT: 540  },
  { do_piece: 'FAV-2026-002', ar_ref: 'MED002', dl_design: 'Amoxicilline 1g',     dl_qte: 40,  dl_prixUnitaire: 45,  dl_montantHT: 1800 },
  { do_piece: 'FAV-2026-002', ar_ref: 'MED007', dl_design: 'Amlodipine 5mg',      dl_qte: 20,  dl_prixUnitaire: 28,  dl_montantHT: 560  },
  { do_piece: 'BLV-2026-011', ar_ref: 'MED006', dl_design: 'Sérum Visage Anti-Âge',dl_qte: 5,  dl_prixUnitaire: 250, dl_montantHT: 1250 },
  { do_piece: 'FAA-2026-003', ar_ref: 'MED001', dl_design: 'Doliprane 1000mg',    dl_qte: 500, dl_prixUnitaire: 15,  dl_montantHT: 7500 },
  { do_piece: 'FAA-2026-003', ar_ref: 'MED002', dl_design: 'Amoxicilline 1g',     dl_qte: 150, dl_prixUnitaire: 30,  dl_montantHT: 4500 },
];

// ------- Sales chart data -------
export const apiVentesMensuelles = [
  { mois: 'Jan', chiffre_affaire: 12000, benefice: 4000 },
  { mois: 'Fév', chiffre_affaire: 15000, benefice: 5500 },
  { mois: 'Mar', chiffre_affaire: 18000, benefice: 7200 },
  { mois: 'Avr', chiffre_affaire: 14000, benefice: 4800 },
  { mois: 'Mai', chiffre_affaire: 22000, benefice: 9000 },
  { mois: 'Juin',chiffre_affaire: 28000, benefice: 11500 },
];

// Legacy export (used by Dashboard)
export const apiStockInitial = artStock.map(s => {
  const art  = articles.find(a => a.ar_ref  === s.ar_ref);
  const dep  = depots.find(d => d.de_no    === s.de_no);
  const fam  = familles.find(f => f.fa_codeFamille === art?.fa_codeFamille);
  return {
    id:          s.ar_ref,
    nom:         art?.ar_design   ?? s.ar_ref,
    famille:     fam?.fa_intitule ?? '—',
    prix_achat:  art?.ar_prixAch  ?? 0,
    prix_vente:  art?.ar_prixVen  ?? 0,
    quantite:    s.as_qtesto,
    seuil_alerte:s.seuil_alerte,
    peremption:  s.peremption,
    magasin:     dep?.de_intitule ?? '—',
  };
});

export const COULEURS_PIE = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
