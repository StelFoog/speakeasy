import { connectToCollection } from '../../../util/db';
import authorize from '../../../util/db/authorize';

export default async function handler(req, res) {
	const { method, headers } = req;
	if (method !== 'GET') return res.status(405).json({ error: `Method ${method} not allowed` });

	const { authorization } = headers;
	if (!authorization) return res.status(401).json({ error: 'Not authorization provided' });

	const { collection } = await connectToCollection('staff');

	// Verify authorization
	const { authorized, status, data, authedType, authedName } = await authorize(
		authorization,
		collection
	);
	if (!authorized) return res.status(status).json(data);

	res.status(200).json({ type: authedType, name: authedName });
}
