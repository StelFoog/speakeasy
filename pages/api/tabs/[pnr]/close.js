import authorize from '../../../../util/db/authorize';
import { connectToDatabase } from '../../../../util/db';

// Checks that the member has an open tab and closes it
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

	const member = await db.collection('members').findOne({ pnr });
	if (!member) return res.status(400).json({ error: `No member with pnr ${pnr} exists` });

	const openTab = await db.collection('tabs').findOne({ pnr, closed: false });
	if (!openTab) return res.status(400).json({ error: "Member doesn't have an open tab" });

	const result = await db
		.collection('tabs')
		.updateOne({ _id: openTab._id }, { $set: { closed: true, timeClosed: new Date() } });

	res.status(200).json({ result });
}
