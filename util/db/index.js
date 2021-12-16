import { MongoClient } from 'mongodb';

const { NAME, PASSWORD, CLUSTER, DATABASE } = process.env;

const URL = `mongodb+srv://${NAME}:${PASSWORD}@${CLUSTER}/${DATABASE}?retryWrites=true&w=majority`;

let cached = global.mongodb; // Handle cached connection
if (!cached) cached = global.mongodb = { conn: null, promise: null }; // If nothing is cached create object

export async function connectToDatabase() {
	if (cached.conn) return cached.conn; // return the cached connection

	if (!cached.promise) {
		// create the connection promise
		cached.promise = MongoClient.connect(URL).then((client) => ({
			client,
			db: client.db(DATABASE),
		}));
	}
	cached.conn = await cached.promise; // wait for promise to resolve
	return cached.conn; // return client and collection
}

export async function connectToCollection(collection) {
	const { db } = await connectToDatabase();

	return await db.collection(collection);
}

export const COLLECTIONS = ['members', 'reports', 'staff', 'tabs'];

export const STAFF_TYPES = ['MANAGER', 'SERVICE'];

export const SALT_ROUNDS = 5;

<<<<<<< HEAD
export const TABS_PER_REQUEST = 10;

=======
>>>>>>> 71f9dd171b991c61df5abba867694c483933ae31
export const REPORTS_PER_REQUEST = 10;
