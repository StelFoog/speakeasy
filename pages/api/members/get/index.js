import authorize from '../../../../util/db/authorize';
import { connectToDatabase } from '../../../../util/db';
import { boolean } from 'boolean';

// Returns a list of all members or, if otherwise specified, only members who are inside or are not inside
export default async function handler(req, res) {
	const { method, headers, query } = req;
	if (method !== 'GET') return res.status(405).json({ error: `Method ${method} not allowed` });

	const { authorization } = headers;
	if (!authorization) return res.status(401).json({ error: 'Not authorization provided' });

	// Verify authorization
	const { authorized, status, data } = await authorize(authorization);
	if (!authorized) return res.status(status).json(data);

	const { db } = await connectToDatabase();

	const inside = ['true', 'false'].includes(query.inside) ? boolean(query.inside) : null;
	const members = await db
		.collection('members')
		.find(inside !== null ? { inside } : {})
		.toArray();

	res.status(200).json(members);
}
