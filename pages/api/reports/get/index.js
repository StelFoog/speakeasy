import { authPnr } from '../../../../util/authParser';
import { connectToDatabase } from '../../../../util/db';
import authorize from '../../../../util/db/authorize';

// gets the user provided in authorization header's data
export default async function handler(req, res) {
	const { method, headers } = req;
	if (method !== 'GET') return res.status(405).json({ error: `Method ${method} not allowed` });

	const { authorization } = headers;
	if (!authorization) return res.status(401).json({ error: 'Not authorization provided' });

	// Verify authorization
	const { authorized, status, data, authedType } = await authorize(authorization);
	if (!authorized) return res.status(status).json(data);

	const ownPnr = authPnr(authorization);

	const { db } = await connectToDatabase();
	const reports = await db
		.collection('reports')
		.find({ pnr: ownPnr })
		.sort({ date: -1 })
		.limit(10)
		.toArray();

	res.status(200).json(reports);
}
