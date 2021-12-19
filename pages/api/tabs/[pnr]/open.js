import authorize from '../../../../util/db/authorize';
import { connectToDatabase } from '../../../../util/db';

// Checks that there's not already an open tab and opens one for the given member
export default async function handler(req, res) {
	const { method, headers, query } = req;
	if (method !== 'PUT') return res.status(405).json({ error: `Method ${method} not allowed` });

	const { authorization } = headers;
	if (!authorization) return res.status(401).json({ error: 'Not authorization provided' });
	// Verify authorization
	const { authorized, status, data } = await authorize(authorization);
	if (!authorized) return res.status(status).json(data);

	const { db } = await connectToDatabase();
	const { pnr } = query;

	const member = await db.collection('members').findOne({ pnr });
	if (!member) return res.status(400).json({ error: `No member with pnr ${pnr} exists` });

	const existingTab = await db.collection('tabs').findOne({ pnr, closed: false });
	if (existingTab)
		return res.status(400).json({ error: 'There already exists an open tab for this member' });

	const tab = { pnr, closed: false, timeOpened: new Date(), timeClosed: null, items: [] };

	const result = await db.collection('tabs').insertOne(tab);

	res.status(200).json(result.insertedId);
}
