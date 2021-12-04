import authorize from '../../../util/db/authorize';
import bcrypt from 'bcrypt';
import { connenctToCollection, SALT_ROUNDS, STAFF_TYPES } from '../../../util/db';

function validNewStaffObject(staff) {
	if (typeof staff.name !== 'string') return false;
	if (typeof staff.pnr !== 'string') return false;
	if (typeof staff.plainPassword !== 'string') return false;
	if (!STAFF_TYPES.includes(staff.type)) return false;

	return true;
}

export default async function handler(req, res) {
	const { method, headers, body } = req;
	if (method !== 'PUT') return res.status(405).json({ error: `Method ${method} not allowed` });

	const { authorization } = headers;
	if (!authorization) return res.status(401).json({ error: 'Not authorization provided' });

	if (!validNewStaffObject(body)) return res.status(400).json({ error: 'Invalid body data' });

	const { collection } = await connenctToCollection('staff');

	// Verify authorization
	const { authorized, status, data, authedType } = await authorize(authorization, collection);
	if (!authorized) return res.status(status).json(data);
	if (authedType !== 'MANAGER')
		return res.status(400).json({ error: 'User not authorized to take this action' });

	const { name, pnr, plainPassword, type } = body;
	const userWithPnr = await collection.findOne({ pnr }, { _id: 1 });

	if (!!userWithPnr)
		return res.status(400).json({ error: 'There already exists a staff member with that pnr' });

	const pass = bcrypt.hashSync(plainPassword, SALT_ROUNDS);
	const staffData = { name, pnr, password: pass, type };

	const result = await collection.insertOne(staffData);

	res.status(200).json({ result });
}
