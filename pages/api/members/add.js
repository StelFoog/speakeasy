import authorize from '../../../util/db/authorize';
import { connectToDatabase } from '../../../util/db';

function validNewMemberObject(member) {
	if (typeof member.name !== 'string') return false;
	if (typeof member.pnr !== 'string' || member.pnr.length !== 10) return false;

	return true;
}

// Checks that there's a body that's a valid member object and then creates the new member if no member with that pnr exists.
export default async function handler(req, res) {
	const { method, headers, body } = req;
	if (method !== 'PUT') return res.status(405).json({ error: `Method ${method} not allowed` });

	const { authorization } = headers;
	if (!authorization) return res.status(401).json({ error: 'Not authorization provided' });

	if (!validNewMemberObject(body)) return res.status(400).json({ error: 'Invalid body data' });

	// Verify authorization
	const { authorized, status, data } = await authorize(authorization);
	if (!authorized) return res.status(status).json(data);

	const { name, pnr } = body;

	const { db } = await connectToDatabase();

	const existingMember = await db.collection('members').findOne({ pnr });
	if (existingMember)
		return res.status(400).json({ error: 'A member with this pnr already exists' });

	const memberData = { name, pnr, inside: false };
	const result = await db.collection('members').insertOne(memberData);

	res.status(200).json({ result });
}
