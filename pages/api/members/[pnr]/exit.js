import authorize from '../../../../util/db/authorize';
import { connectToDatabase } from '../../../../util/db';

// Checks that the user exists and that they are currently inside, then marks them as outside
export default async function handler(req, res) {
	const { method, headers, query } = req;
	if (method !== 'POST') return res.status(405).json({ error: `Method ${method} not allowed` });

	const { authorization } = headers;
	if (!authorization) return res.status(401).json({ error: 'Not authorization provided' });

	// Verify authorization
	const { authorized, status, data } = await authorize(authorization);
	if (!authorized) return res.status(status).json(data);

	const { db } = await connectToDatabase();

	const { pnr } = query;
	const memberData = await db.collection('members').findOne({ pnr });
	if (!memberData) return res.status(400).json({ error: 'No such member exists' });
	if (memberData.inside === false)
		return res.status(400).json({ error: 'Member is already outside' });

	const result = await db
		.collection('members')
		.updateOne({ _id: memberData._id }, { $set: { inside: false } });

	res.status(200).json({ result });
}
