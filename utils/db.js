const { MongoClient } = require('mongodb');

class DBClient {
    constructor() {
        // Initialise les parametres de connexion a MongoDB
        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_PORT || 27017;
        const database = process.env.DB_DATABASE || 'files_manager';

        // FORME L'URL DE COMMEXION A MONGODB A PARTIR DES PARAMETRES CI-DESSUS
        const url = `mongodb://${host}:${port}`;
        this.client = new MongoClient(url, { useUnifiedTopology: true, useUnifiedTopology: true});
        this.dbName = database;

        // ESSAIE DE SE CONNECTER A LA BASE DE DONNEES
        this.client.connect()
            .then(() => {
                console.log('DB connected');
                this.isConnected = true;
            })
            .catch((err) => {
                console.error('DB connection failed:', err);
                this.isConnected = false;
            });
    }

    /*
    * Verifie si la connexion a la base de donnees est active
    * @returns {boolean}  true si le client est connecte sinon false
    */

    isAlive() {
        return this.isConnected;
    }

    /**
     * Retourne le nombre de documents dans la collection 'users'
     * si le client n'est pas connecte retourne 0
     */
    async nbUsers() {
        if (!this.isConnected) {
            return 0;
        }
        try {
            const db = this.client.db(this.dbName);
            return await db.collection('users').countDocuments();
        } catch (err) {
            console.error(err);
            return 0;
        }
    }

    /**
     * Retourne le nombre de documents dans la collection 'files'
     * si le client n'est pas connecte retourne 0
     */

    async nbFiles() {
        if (!this.isConnected) {
            return 0;
        }
        try {
            const db = this.client.db(this.dbName);
            return await db.collection('files').countDocuments();
        } catch (err) {
            console.error(err);
            return 0;
        }
    }
}

// Exporte une instance de la classe DBClient
const dbClient = new DBClient();
module.export = dbClient;