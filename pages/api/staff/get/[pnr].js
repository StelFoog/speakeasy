import { connenctToCollection } from '../../../../util/db';
import authorize from '../../../../util/db/authorize';

function getAuthPnr(authorization) {
	return authorization.split('+')[0];
}

export default async function handler(req, res) {
	const { method, headers, query } = req;
	if (method !== 'GET') return res.status(405).json({ error: `Method ${method} not allowed` });

	const { authorization } = headers;
	if (!authorization) return res.status(401).json({ error: 'Not authorization provided' });

	const { collection } = await connenctToCollection('staff');

	// Verify authorization
	const { authorized, status, data, authedType } = await authorize(authorization, collection);
	if (!authorized) return res.status(status).json(data);

	const { pnr } = query;
	if (!(getAuthPnr(authorization) === pnr || authedType === 'MANAGER'))
		return res.status(403).json({ error: 'Not authorized' });

	const staffData = await collection.findOne({ pnr });

	if (!staffData) return res.status(400).json({ error: 'No such user exists' });

	delete staffData.password;

	res.status(200).json({ data: staffData });
}
