import { connenctToCollection } from '../../../../util/db';
import authorize from '../../../../util/db/authorize';

function getAuthPnr(authorization) {
	return authorization.split('+')[0];
}

export default async function handler(req, res) {
	const { method, headers } = req;
	if (method !== 'GET') return res.status(405).json({ error: `Method ${method} not allowed` });

	const { authorization } = headers;
	if (!authorization) return res.status(401).json({ error: 'Not authorization provided' });

	const { collection } = await connenctToCollection('staff');

	// Verify authorization
	const { authorized, status, data } = await authorize(authorization, collection);
	if (!authorized) return res.status(status).json(data);

	const staffData = await collection.findOne({ pnr: getAuthPnr(authorization) });

	delete staffData.password;

	res.status(200).json({ data: staffData });
}
