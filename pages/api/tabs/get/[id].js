import authorize from '../../../../util/db/authorize';
import { connectToDatabase } from '../../../../util/db';
import { ObjectId } from 'bson';

// Gets the tab with the given id
export default async function handler(req, res) {
	const { method, headers, query } = req;
	if (method !== 'GET') return res.status(405).json({ error: `Method ${method} not allowed` });

	const { id, exists } = query;

	if (id.length !== 24) return res.status(400).json({ error: `Invalid id` });

	if (typeof exists !== 'undefined') {
		// only check if tab exists
		const { db } = await connectToDatabase();

		const tabData = await db.collection('tabs').findOne({ _id: new ObjectId(id) }, { _id: 1 });
		if (!tabData) return res.status(400).json({ error: "This tab doesn't exist" });

		res.status(200).json(tabData);
	} else {
		// get tab data
		const { authorization } = headers;
		if (!authorization) return res.status(401).json({ error: 'Not authorization provided' });
		// Verify authorization
		const { authorized, status, data } = await authorize(authorization);
		if (!authorized) return res.status(status).json(data);

		const { db } = await connectToDatabase();

		const tabData = await db.collection('tabs').findOne({ _id: new ObjectId(id) });
		if (!tabData) return res.status(400).json({ error: "This tab doesn't exist" });

		res.status(200).json(tabData);
	}
}
