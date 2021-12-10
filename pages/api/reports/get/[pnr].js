import { authPnr } from '../../../../util/authParser';
import { connectToDatabase } from '../../../../util/db';
import authorize from '../../../../util/db/authorize';

// gets the user provided in authorization header's data
export default async function handler(req, res) {
	const { method, headers, query } = req;
	if (method !== 'GET') return res.status(405).json({ error: `Method ${method} not allowed` });

	const { authorization } = headers;
	if (!authorization) return res.status(401).json({ error: 'Not authorization provided' });

	// Verify authorization
	const { authorized, status, data, authedType } = await authorize(authorization);
	if (!authorized) return res.status(status).json(data);

	const ownPnr = authPnr(authorization);
	const { pnr } = query;

	if (!(ownPnr === pnr || authedType === 'MANAGER'))
		return res.status(401).json({ error: 'Not allowed to read this data' });

	const { db } = await connectToDatabase();
	const reports = await db
		.collection('reports')
		.find({ pnr: pnr })
		.sort({ date: -1 })
		.limit(10)
		.toArray();

	res.status(200).json(reports);
}
