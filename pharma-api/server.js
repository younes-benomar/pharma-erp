const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────
// CONNEXION BASE DE DONNÉES
// ─────────────────────────────────────────
const db = new sqlite3.Database('./pharma_erp.db', (err) => {
    if (err) console.error("Erreur DB:", err.message);
    else console.log("✅ Connecté à pharma_erp.db");
});

// ─────────────────────────────────────────
// CRÉATION DES 11 TABLES AVEC RELATIONS
// ─────────────────────────────────────────
db.serialize(() => {
    db.run(`PRAGMA foreign_keys = ON`);

    // 1. P_UNITE (pas de FK sortante)
    db.run(`CREATE TABLE IF NOT EXISTS P_UNITE (
        cbIndice    INTEGER PRIMARY KEY,
        U_Intitule  TEXT NOT NULL
    )`);

    // 2. F_COLLABORATEUR (pas de FK sortante)
    db.run(`CREATE TABLE IF NOT EXISTS F_COLLABORATEUR (
        CO_No        INTEGER PRIMARY KEY AUTOINCREMENT,
        CO_Nom       TEXT,
        CO_Prenom    TEXT,
        CO_Fonction  TEXT,
        CO_Vendeur   INTEGER DEFAULT 0,
        CO_Acheteur  INTEGER DEFAULT 0,
        CO_Telephone TEXT,
        CO_Email     TEXT,
        CO_Matricule TEXT
    )`);

    // 3. F_FAMILLE → P_UNITE
    db.run(`CREATE TABLE IF NOT EXISTS F_FAMILLE (
        FA_CodeFamille TEXT PRIMARY KEY,
        FA_Intitule    TEXT,
        FA_Type        INTEGER DEFAULT 0,
        FA_UniteVen    INTEGER,
        FA_SuiviStock  INTEGER DEFAULT 0,
        FA_Central     TEXT,
        FOREIGN KEY (FA_UniteVen) REFERENCES P_UNITE(cbIndice)
    )`);

    // 4. F_COMPTET → F_COLLABORATEUR
    db.run(`CREATE TABLE IF NOT EXISTS F_COMPTET (
        CT_Num       TEXT PRIMARY KEY,
        CT_Intitule  TEXT,
        CT_Type      INTEGER DEFAULT 0,
        CG_NumPrinc  TEXT,
        CT_Qualite   TEXT,
        CT_Contact   TEXT,
        CT_Adresse   TEXT,
        CT_Complement TEXT,
        CT_Ville     TEXT,
        CT_CodeRegion TEXT,
        CT_Identifiant TEXT,
        CT_Telephone TEXT,
        CT_Telecopie TEXT,
        CT_Email     TEXT,
        CT_Site      TEXT,
        CO_No        INTEGER,
        CBCREATION   TEXT,
        CT_Sommeil   INTEGER DEFAULT 0,
        FOREIGN KEY (CO_No) REFERENCES F_COLLABORATEUR(CO_No)
    )`);

    // 5. F_DEPOT (pas de FK sortante)
    db.run(`CREATE TABLE IF NOT EXISTS F_DEPOT (
        DE_NO       INTEGER PRIMARY KEY,
        DE_Intitule TEXT
    )`);

    // 6. F_ARTICLE → F_FAMILLE, P_UNITE
    db.run(`CREATE TABLE IF NOT EXISTS F_ARTICLE (
        AR_Ref         TEXT PRIMARY KEY,
        AR_Design      TEXT,
        FA_CodeFamille TEXT,
        AR_UniteVen    INTEGER,
        AR_PrixAch     REAL DEFAULT 0,
        AR_PrixVen     REAL DEFAULT 0,
        AR_PrixTTC     INTEGER DEFAULT 0,
        AR_SuiviStock  INTEGER DEFAULT 0,
        AR_CodeBarre   TEXT,
        AR_PUNet       REAL DEFAULT 0,
        AR_CoutStd     REAL DEFAULT 0,
        AR_Type        INTEGER DEFAULT 0,
        AR_Nature      INTEGER DEFAULT 0,
        AR_SOMMEIL     INTEGER DEFAULT 0,
        FOREIGN KEY (FA_CodeFamille) REFERENCES F_FAMILLE(FA_CodeFamille),
        FOREIGN KEY (AR_UniteVen)    REFERENCES P_UNITE(cbIndice)
    )`);

    // 7. F_ARTSTOCK → F_ARTICLE, F_DEPOT
    db.run(`CREATE TABLE IF NOT EXISTS F_ARTSTOCK (
        AR_Ref    TEXT,
        AS_QteSto REAL DEFAULT 0,
        DE_NO     INTEGER,
        PRIMARY KEY (AR_Ref, DE_NO),
        FOREIGN KEY (AR_Ref) REFERENCES F_ARTICLE(AR_Ref),
        FOREIGN KEY (DE_NO)  REFERENCES F_DEPOT(DE_NO)
    )`);

    // 8. F_LOTSERIE → F_ARTICLE, F_DEPOT
    db.run(`CREATE TABLE IF NOT EXISTS F_LOTSERIE (
        AR_Ref        TEXT,
        LS_NoSerie    TEXT,
        LS_Peremption TEXT,
        LS_Qte        REAL DEFAULT 0,
        LS_LotEpuise  INTEGER DEFAULT 0,
        LS_QteRestant REAL DEFAULT 0,
        DE_NO         INTEGER,
        PRIMARY KEY (AR_Ref, LS_NoSerie),
        FOREIGN KEY (AR_Ref) REFERENCES F_ARTICLE(AR_Ref),
        FOREIGN KEY (DE_NO)  REFERENCES F_DEPOT(DE_NO)
    )`);

    // 9. F_DOCENTETE → F_COMPTET, F_COLLABORATEUR
    db.run(`CREATE TABLE IF NOT EXISTS F_DOCENTETE (
        DO_Piece        TEXT PRIMARY KEY,
        DO_Domaine      INTEGER DEFAULT 0,
        DO_Type         INTEGER DEFAULT 0,
        DO_Date         TEXT,
        DO_Ref          TEXT,
        DO_Tiers        TEXT,
        CO_No           INTEGER,
        DO_TotalHT      REAL DEFAULT 0,
        DO_TotalHTNet   REAL DEFAULT 0,
        DO_TotalTTC     REAL DEFAULT 0,
        DO_MontantRegle REAL DEFAULT 0,
        FOREIGN KEY (DO_Tiers) REFERENCES F_COMPTET(CT_Num),
        FOREIGN KEY (CO_No)    REFERENCES F_COLLABORATEUR(CO_No)
    )`);

    // 10. F_DOCLIGNE → F_DOCENTETE, F_COMPTET, F_ARTICLE, F_COLLABORATEUR
    db.run(`CREATE TABLE IF NOT EXISTS F_DOCLIGNE (
        DL_No          INTEGER PRIMARY KEY AUTOINCREMENT,
        DO_Domaine     INTEGER DEFAULT 0,
        DO_Type        INTEGER DEFAULT 0,
        CT_Num         TEXT,
        DO_Piece       TEXT,
        DL_PieceBC     TEXT,
        DL_PieceBL     TEXT,
        DO_Date        TEXT,
        DL_DateBC      TEXT,
        DL_DateBL      TEXT,
        DL_Ligne       INTEGER,
        DO_Ref         TEXT,
        AR_Ref         TEXT,
        DL_Design      TEXT,
        DL_Qte         REAL DEFAULT 0,
        DL_QteBC       REAL DEFAULT 0,
        DL_QteBL       REAL DEFAULT 0,
        DL_PrixUnitaire REAL DEFAULT 0,
        CO_No          INTEGER,
        DL_PrixRU      REAL DEFAULT 0,
        DL_CMUP        REAL DEFAULT 0,
        DL_PUTTC       REAL DEFAULT 0,
        DL_Valorise    INTEGER DEFAULT 1,
        DL_NonLivre    INTEGER DEFAULT 0,
        DL_MontantHT   REAL DEFAULT 0,
        DL_MontantTTC  REAL DEFAULT 0,
        PF_Num         TEXT,
        FOREIGN KEY (DO_Piece) REFERENCES F_DOCENTETE(DO_Piece),
        FOREIGN KEY (CT_Num)   REFERENCES F_COMPTET(CT_Num),
        FOREIGN KEY (AR_Ref)   REFERENCES F_ARTICLE(AR_Ref),
        FOREIGN KEY (CO_No)    REFERENCES F_COLLABORATEUR(CO_No)
    )`);

    // 11. F_REGLECH → F_DOCENTETE
    db.run(`CREATE TABLE IF NOT EXISTS F_REGLECH (
        RG_No      INTEGER,
        DR_No      INTEGER,
        DO_Domaine INTEGER DEFAULT 0,
        DO_Type    INTEGER DEFAULT 0,
        DO_Piece   TEXT,
        RC_Montant REAL DEFAULT 0,
        RG_TypeReg INTEGER DEFAULT 0,
        PRIMARY KEY (RG_No, DR_No),
        FOREIGN KEY (DO_Piece) REFERENCES F_DOCENTETE(DO_Piece)
    )`);

    // ─────────────────────────────────────────
    // DONNÉES DE TEST (INSERT OR IGNORE)
    // ─────────────────────────────────────────

    // Unités
    db.run(`INSERT OR IGNORE INTO P_UNITE VALUES (1, 'Unité')`);
    db.run(`INSERT OR IGNORE INTO P_UNITE VALUES (2, 'Boîte')`);
    db.run(`INSERT OR IGNORE INTO P_UNITE VALUES (3, 'Flacon')`);
    db.run(`INSERT OR IGNORE INTO P_UNITE VALUES (4, 'Comprimé')`);

    // Collaborateurs (vendeurs)
    db.run(`INSERT OR IGNORE INTO F_COLLABORATEUR (CO_No,CO_Nom,CO_Prenom,CO_Fonction,CO_Vendeur,CO_Email)
            VALUES (1,'Benali','Youssef','Commercial',1,'y.benali@pharma.ma')`);
    db.run(`INSERT OR IGNORE INTO F_COLLABORATEUR (CO_No,CO_Nom,CO_Prenom,CO_Fonction,CO_Vendeur,CO_Email)
            VALUES (2,'Idrissi','Fatima','Acheteuse',0,'f.idrissi@pharma.ma')`);

    // Familles
    db.run(`INSERT OR IGNORE INTO F_FAMILLE VALUES ('MED','Médicaments',0,2,2,'MED')`);
    db.run(`INSERT OR IGNORE INTO F_FAMILLE VALUES ('PARA','Parapharmacie',0,1,0,'PARA')`);
    db.run(`INSERT OR IGNORE INTO F_FAMILLE VALUES ('CONS','Consommables',0,1,0,'CONS')`);

    // Dépôts
    db.run(`INSERT OR IGNORE INTO F_DEPOT VALUES (1,'Dépôt Principal')`);
    db.run(`INSERT OR IGNORE INTO F_DEPOT VALUES (2,'Dépôt Secondaire')`);

    // Clients / Fournisseurs
    db.run(`INSERT OR IGNORE INTO F_COMPTET VALUES ('CLI-001','Client Comptoir',0,NULL,NULL,'Ahmed Alami',
            'Rue Hassan II','','Casablanca','Grand Casablanca',NULL,'0661000001',NULL,'ahmed@gmail.com',NULL,1,
            date('now'),0)`);
    db.run(`INSERT OR IGNORE INTO F_COMPTET VALUES ('CLI-002','Clinique Avicenne',0,NULL,NULL,'Dr. Laila',
            'Bd Mohammed V','','Rabat','Rabat-Salé',NULL,'0537000002',NULL,'contact@avicenne.ma',NULL,1,
            date('now'),0)`);
    db.run(`INSERT OR IGNORE INTO F_COMPTET VALUES ('FRN-001','Laboratoire Sanofi',1,NULL,NULL,'Directeur Commercial',
            'Zone Industrielle','','Casablanca','Grand Casablanca',NULL,'0522000003',NULL,'sanofi@labo.ma',NULL,2,
            date('now'),0)`);

    // Articles
    db.run(`INSERT OR IGNORE INTO F_ARTICLE (AR_Ref,AR_Design,FA_CodeFamille,AR_UniteVen,AR_PrixAch,AR_PrixVen,AR_SuiviStock,AR_CodeBarre,AR_Nature)
            VALUES ('ART-001','Paracétamol 1000mg Boîte/16cp','MED',2,12.00,18.50,2,'6111234567890',2)`);
    db.run(`INSERT OR IGNORE INTO F_ARTICLE (AR_Ref,AR_Design,FA_CodeFamille,AR_UniteVen,AR_PrixAch,AR_PrixVen,AR_SuiviStock,AR_CodeBarre,AR_Nature)
            VALUES ('ART-002','Amoxicilline 500mg Boîte/24cp','MED',2,35.00,52.00,2,'6111234567891',2)`);
    db.run(`INSERT OR IGNORE INTO F_ARTICLE (AR_Ref,AR_Design,FA_CodeFamille,AR_UniteVen,AR_PrixAch,AR_PrixVen,AR_SuiviStock,AR_CodeBarre,AR_Nature)
            VALUES ('ART-003','Vitamine C 1000mg Effervescent','PARA',3,28.00,42.00,0,'6111234567892',2)`);
    db.run(`INSERT OR IGNORE INTO F_ARTICLE (AR_Ref,AR_Design,FA_CodeFamille,AR_UniteVen,AR_PrixAch,AR_PrixVen,AR_SuiviStock,AR_CodeBarre,AR_Nature)
            VALUES ('ART-004','Gants d\'examen taille M (x100)','CONS',1,55.00,85.00,0,'6111234567893',0)`);
    db.run(`INSERT OR IGNORE INTO F_ARTICLE (AR_Ref,AR_Design,FA_CodeFamille,AR_UniteVen,AR_PrixAch,AR_PrixVen,AR_SuiviStock,AR_CodeBarre,AR_Nature)
            VALUES ('ART-005','Ibuprofène 400mg Boîte/20cp','MED',2,18.00,27.00,2,'6111234567894',2)`);

    // Stock
    db.run(`INSERT OR IGNORE INTO F_ARTSTOCK VALUES ('ART-001',150,1)`);
    db.run(`INSERT OR IGNORE INTO F_ARTSTOCK VALUES ('ART-002',80,1)`);
    db.run(`INSERT OR IGNORE INTO F_ARTSTOCK VALUES ('ART-003',200,1)`);
    db.run(`INSERT OR IGNORE INTO F_ARTSTOCK VALUES ('ART-004',35,2)`);
    db.run(`INSERT OR IGNORE INTO F_ARTSTOCK VALUES ('ART-005',120,1)`);

    // Lots / Série (pour articles avec suivi sérialisé)
    db.run(`INSERT OR IGNORE INTO F_LOTSERIE VALUES ('ART-001','LOT-2025-01','2026-12-31',150,0,150,1)`);
    db.run(`INSERT OR IGNORE INTO F_LOTSERIE VALUES ('ART-002','LOT-2025-02','2027-06-30',80,0,80,1)`);
    db.run(`INSERT OR IGNORE INTO F_LOTSERIE VALUES ('ART-005','LOT-2025-03','2027-03-31',120,0,120,1)`);

    // Documents entête (Factures de vente)
    db.run(`INSERT OR IGNORE INTO F_DOCENTETE VALUES ('FAC-001',0,6,date('now'),NULL,'CLI-001',1,110.50,110.50,132.60,132.60)`);
    db.run(`INSERT OR IGNORE INTO F_DOCENTETE VALUES ('FAC-002',0,6,date('now','-2 days'),NULL,'CLI-002',1,94.00,94.00,112.80,0)`);
    db.run(`INSERT OR IGNORE INTO F_DOCENTETE VALUES ('FAC-003',0,6,date('now','-5 days'),NULL,'CLI-001',1,27.00,27.00,32.40,32.40)`);

    // Lignes de documents
    db.run(`INSERT OR IGNORE INTO F_DOCLIGNE
            (DO_Domaine,DO_Type,CT_Num,DO_Piece,DO_Date,AR_Ref,DL_Design,DL_Qte,DL_PrixUnitaire,CO_No,DL_MontantHT,DL_MontantTTC)
            VALUES (0,6,'CLI-001','FAC-001',date('now'),'ART-001','Paracétamol 1000mg',3,18.50,1,55.50,66.60)`);
    db.run(`INSERT OR IGNORE INTO F_DOCLIGNE
            (DO_Domaine,DO_Type,CT_Num,DO_Piece,DO_Date,AR_Ref,DL_Design,DL_Qte,DL_PrixUnitaire,CO_No,DL_MontantHT,DL_MontantTTC)
            VALUES (0,6,'CLI-001','FAC-001',date('now'),'ART-003','Vitamine C',1,42.00,1,42.00,50.40)`);
    db.run(`INSERT OR IGNORE INTO F_DOCLIGNE
            (DO_Domaine,DO_Type,CT_Num,DO_Piece,DO_Date,AR_Ref,DL_Design,DL_Qte,DL_PrixUnitaire,CO_No,DL_MontantHT,DL_MontantTTC)
            VALUES (0,6,'CLI-002','FAC-002',date('now','-2 days'),'ART-002','Amoxicilline 500mg',2,52.00,1,94.00,112.80)`);
    db.run(`INSERT OR IGNORE INTO F_DOCLIGNE
            (DO_Domaine,DO_Type,CT_Num,DO_Piece,DO_Date,AR_Ref,DL_Design,DL_Qte,DL_PrixUnitaire,CO_No,DL_MontantHT,DL_MontantTTC)
            VALUES (0,6,'CLI-001','FAC-003',date('now','-5 days'),'ART-005','Ibuprofène 400mg',1,27.00,1,27.00,32.40)`);

    // Règlements
    db.run(`INSERT OR IGNORE INTO F_REGLECH VALUES (1,1,0,6,'FAC-001',132.60,0)`);
    db.run(`INSERT OR IGNORE INTO F_REGLECH VALUES (2,2,0,6,'FAC-003',32.40,0)`);
});

// ─────────────────────────────────────────────────────────
// ENDPOINTS API — Toutes les Routes
// ─────────────────────────────────────────────────────────

// ── ARTICLES ──
app.get('/api/articles', (req, res) => {
    db.all(`SELECT a.*, f.FA_Intitule as famille_nom, u.U_Intitule as unite_nom
            FROM F_ARTICLE a
            LEFT JOIN F_FAMILLE f ON a.FA_CodeFamille = f.FA_CodeFamille
            LEFT JOIN P_UNITE   u ON a.AR_UniteVen    = u.cbIndice
            WHERE a.AR_SOMMEIL = 0`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/articles/:ref', (req, res) => {
    db.get(`SELECT * FROM F_ARTICLE WHERE AR_Ref = ?`, [req.params.ref], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ message: 'Article introuvable' });
        res.json(row);
    });
});

app.post('/api/articles', (req, res) => {
    const { AR_Ref, AR_Design, FA_CodeFamille, AR_PrixAch, AR_PrixVen, AR_CodeBarre } = req.body;
    db.run(`INSERT INTO F_ARTICLE (AR_Ref,AR_Design,FA_CodeFamille,AR_PrixAch,AR_PrixVen,AR_CodeBarre)
            VALUES (?,?,?,?,?,?)`,
        [AR_Ref, AR_Design, FA_CodeFamille, AR_PrixAch, AR_PrixVen, AR_CodeBarre],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: "Article créé ✅", AR_Ref });
        });
});

app.put('/api/articles/:ref', (req, res) => {
    const { AR_Design, AR_PrixAch, AR_PrixVen } = req.body;
    db.run(`UPDATE F_ARTICLE SET AR_Design=?, AR_PrixAch=?, AR_PrixVen=? WHERE AR_Ref=?`,
        [AR_Design, AR_PrixAch, AR_PrixVen, req.params.ref],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Article mis à jour ✅" });
        });
});

// ── FAMILLES ──
app.get('/api/familles', (req, res) => {
    db.all(`SELECT * FROM F_FAMILLE`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// ── TIERS (Clients / Fournisseurs) ──
app.get('/api/tiers', (req, res) => {
    db.all(`SELECT t.*, c.CO_Nom, c.CO_Prenom
            FROM F_COMPTET t
            LEFT JOIN F_COLLABORATEUR c ON t.CO_No = c.CO_No`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/clients', (req, res) => {
    db.all(`SELECT * FROM F_COMPTET WHERE CT_Type = 0 AND CT_Sommeil = 0`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/fournisseurs', (req, res) => {
    db.all(`SELECT * FROM F_COMPTET WHERE CT_Type = 1 AND CT_Sommeil = 0`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// ── STOCK ──
app.get('/api/stock', (req, res) => {
    db.all(`SELECT s.AR_Ref, a.AR_Design, s.AS_QteSto, d.DE_Intitule as depot
            FROM F_ARTSTOCK s
            JOIN F_ARTICLE a ON s.AR_Ref = a.AR_Ref
            JOIN F_DEPOT   d ON s.DE_NO  = d.DE_NO
            ORDER BY s.AS_QteSto DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// ── DÉPÔTS ──
app.get('/api/depots', (req, res) => {
    db.all(`SELECT * FROM F_DEPOT`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// ── LOTS / SÉRIE ──
app.get('/api/lots', (req, res) => {
    db.all(`SELECT l.*, a.AR_Design, d.DE_Intitule as depot
            FROM F_LOTSERIE l
            JOIN F_ARTICLE a ON l.AR_Ref = a.AR_Ref
            JOIN F_DEPOT   d ON l.DE_NO  = d.DE_NO`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// ── DOCUMENTS (Factures, BL, BC...) ──
app.get('/api/documents', (req, res) => {
    db.all(`SELECT e.*, t.CT_Intitule as client_nom,
                   c.CO_Nom || ' ' || c.CO_Prenom as vendeur
            FROM F_DOCENTETE e
            LEFT JOIN F_COMPTET t      ON e.DO_Tiers = t.CT_Num
            LEFT JOIN F_COLLABORATEUR c ON e.CO_No   = c.CO_No
            ORDER BY e.DO_Date DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/factures', (req, res) => {
    db.all(`SELECT e.*, t.CT_Intitule as client_nom
            FROM F_DOCENTETE e
            LEFT JOIN F_COMPTET t ON e.DO_Tiers = t.CT_Num
            WHERE e.DO_Domaine = 0 AND e.DO_Type = 6
            ORDER BY e.DO_Date DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// ── LIGNES DE DOCUMENT ──
app.get('/api/documents/:piece/lignes', (req, res) => {
    db.all(`SELECT dl.*, a.AR_Design as article_nom
            FROM F_DOCLIGNE dl
            LEFT JOIN F_ARTICLE a ON dl.AR_Ref = a.AR_Ref
            WHERE dl.DO_Piece = ?`, [req.params.piece], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// ── RÈGLEMENTS ──
app.get('/api/reglements', (req, res) => {
    db.all(`SELECT r.*, e.DO_Tiers, t.CT_Intitule as client_nom
            FROM F_REGLECH r
            LEFT JOIN F_DOCENTETE e ON r.DO_Piece = e.DO_Piece
            LEFT JOIN F_COMPTET   t ON e.DO_Tiers = t.CT_Num`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// ── COLLABORATEURS ──
app.get('/api/collaborateurs', (req, res) => {
    db.all(`SELECT * FROM F_COLLABORATEUR`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// ── DASHBOARD — Top vendeurs ──
app.get('/api/dashboard/top-vendeurs', (req, res) => {
    db.all(`SELECT c.CO_Nom || ' ' || c.CO_Prenom as vendeur,
                   COUNT(DISTINCT dl.DO_Piece) as nb_factures,
                   SUM(dl.DL_MontantHT) as total_HT
            FROM F_DOCLIGNE dl
            JOIN F_COLLABORATEUR c ON dl.CO_No = c.CO_No
            WHERE dl.DO_Domaine = 0 AND dl.DO_Type = 6
            GROUP BY dl.CO_No
            ORDER BY total_HT DESC
            LIMIT 10`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// ── DASHBOARD — Top articles vendus ──
app.get('/api/dashboard/top-articles', (req, res) => {
    db.all(`SELECT dl.AR_Ref, a.AR_Design,
                   SUM(dl.DL_Qte) as qte_vendue,
                   SUM(dl.DL_MontantHT) as total_HT
            FROM F_DOCLIGNE dl
            JOIN F_ARTICLE a ON dl.AR_Ref = a.AR_Ref
            WHERE dl.DO_Domaine = 0 AND dl.DO_Type = 6
            GROUP BY dl.AR_Ref
            ORDER BY qte_vendue DESC
            LIMIT 10`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// ── DASHBOARD — CA du mois ──
app.get('/api/dashboard/stats', (req, res) => {
    db.get(`SELECT
                COUNT(*) as nb_factures,
                SUM(DO_TotalHT)  as ca_ht,
                SUM(DO_TotalTTC) as ca_ttc,
                SUM(DO_MontantRegle) as total_regle
            FROM F_DOCENTETE
            WHERE DO_Domaine = 0 AND DO_Type = 6
              AND strftime('%Y-%m', DO_Date) = strftime('%Y-%m', 'now')`,
        [], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(row);
        });
});

// ─────────────────────────────────────────
// LANCER LE SERVEUR
// ─────────────────────────────────────────
app.listen(port, () => {
    console.log(`✅ API lancée sur http://localhost:${port}`);
    console.log(`📋 Endpoints disponibles:`);
    console.log(`   GET  /api/articles`);
    console.log(`   GET  /api/familles`);
    console.log(`   GET  /api/clients`);
    console.log(`   GET  /api/fournisseurs`);
    console.log(`   GET  /api/stock`);
    console.log(`   GET  /api/depots`);
    console.log(`   GET  /api/lots`);
    console.log(`   GET  /api/factures`);
    console.log(`   GET  /api/documents/:piece/lignes`);
    console.log(`   GET  /api/reglements`);
    console.log(`   GET  /api/collaborateurs`);
    console.log(`   GET  /api/dashboard/top-vendeurs`);
    console.log(`   GET  /api/dashboard/top-articles`);
    console.log(`   GET  /api/dashboard/stats`);
});