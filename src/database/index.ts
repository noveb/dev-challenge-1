import { MongoClient, Db } from 'mongodb';

export default class Database {
  private static db: Db;

  private static client: MongoClient;

  public static async getDb(): Promise<Db> {
    if (!this.db || !this.client) {
      await this.connect();
    }
    return this.db;
  }

  private static async connect(): Promise<void> {
    const url = process.env.DB_URL;

    if (!url) {
      throw new Error('DB env var not set');
    }

    try {
      this.client = new MongoClient(url, {
        tlsCAFile: '/app/src/database/eu-central-1-bundle.pem',
      });
      await this.client.connect();
      console.log('Database ready');
      this.db = this.client.db('fileService');
    } catch (error) {
      console.error('Failed to connect to the database', error);
      throw error;
    }
  }

  public static async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
    }
  }
}
