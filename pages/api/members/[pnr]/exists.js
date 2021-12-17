import authorize from '../../../../util/db/authorize';
import { connectToDatabase } from '../../../../util/db';
import { ObjectId } from 'bson';

// Gets the tab with the given id
export default async function handler(req, res) {
	const { method, query } = req;
	if (method !== 'GET') return res.status(405).json({ error: `Method ${method} not allowed` });

	const id = query.pnr;

	if (id.length !== 24) return res.status(400).json({ error: `Invalid id` });

	// only check if tab exists
	const { db } = await connectToDatabase();

	const memberData = await db.collection('members').findOne({ _id: new ObjectId(id) });
	if (!memberData) return res.status(400).json({ error: "This member doesn't exist" });

	res.status(200).json({ exists: true });
}
