// eslint-disable-next-line import/no-extraneous-dependencies
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
    const url = 'mongodb://mongo:27017';
    this.client = new MongoClient(url);
    await this.client.connect();
    console.log('Connected successfully to server');
    this.db = this.client.db('scalara');
  }

  public static async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
    }
  }
}
