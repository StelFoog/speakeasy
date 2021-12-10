import { connectToDatabase } from '../../../util/db';
import authorize from '../../../util/db/authorize';

// takes an authorization header (format `${pnr}+${password}`) and returns an error if incorrect input or the pnr or password is incorrect. Returns name and type of user if login is successful.
export default async function handler(req, res) {
	const { method, headers } = req;
	if (method !== 'GET') return res.status(405).json({ error: `Method ${method} not allowed` });

	const { authorization } = headers;
	if (!authorization) return res.status(401).json({ error: 'Not authorization provided' });

	// Verify authorization
	const { authorized, status, data, authedType, authedName } = await authorize(authorization);
	if (!authorized) return res.status(status).json(data);

	res.status(200).json({ type: authedType, name: authedName });
}
