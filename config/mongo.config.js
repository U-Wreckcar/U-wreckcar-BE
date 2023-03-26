import { MongoClient } from 'mongodb';

// Replace the following with your Atlas connection string
const url = `${process.env.MONGODB_URI}`;
const client = new MongoClient(url);

export async function run() {
    try {
        await client.connect();
        console.log('Connected correctly to server');
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.stack);
        }
    }
}


const db = client.db(`${process.env.DB_NAME}`);

export default db;
