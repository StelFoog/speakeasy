import authorize from '../../../../util/db/authorize';
import { connectToDatabase } from '../../../../util/db';

// Returns data of specified member
export default async function handler(req, res) {
	const { method, headers, query } = req;
	if (method !== 'GET') return res.status(405).json({ error: `Method ${method} not allowed` });

	const { authorization } = headers;
	if (!authorization) return res.status(401).json({ error: 'Not authorization provided' });

	// Verify authorization
	const { authorized, status, data } = await authorize(authorization);
	if (!authorized) return res.status(status).json(data);

	const { db } = await connectToDatabase();

	const { pnr } = query;
	if (pnr.length !== 10) return res.status(400).json({ error: 'Invalid pnr' });

	const memberData = await db.collection('members').findOne({ pnr });
	if (!memberData) return res.status(400).json({ error: 'No such member exists' });

	res.status(200).json(memberData);
}
