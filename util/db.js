import { MongoClient } from 'mongodb';

const { NAME, PASSWORD, CLUSTER, DATABASE } = process.env;

const URL = `mongodb+srv://${NAME}:${PASSWORD}@${CLUSTER}/${DATABASE}?retryWrites=true&w=majority`;

let cached = global.mongodb; // Handle cached connection
if (!cached) cached = global.mongodb = { conn: null, promise: null }; // If nothing is cached create object

export async function connenctToCollection(collection) {
	if (cached.conn) return cached.conn; // return the cached connection

	if (!cached.promise) {
		// create the connection promise
		cached.promise = MongoClient.connect(URL).then((client) => ({
			client,
			collection: client.db(DATABASE).collection(collection),
		}));
	}
	cached.conn = await cached.promise; // wait for promise to resolve
	return cached.conn; // return client and collection
}

export const COLLECTIONS = ['members', 'staff', 'tabs'];
