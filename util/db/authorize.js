import bcrypt from 'bcrypt';
import { connectToDatabase } from '.';
import authParser from '../authParser';

export default async function (authorization) {
	const [authPnr, authPass] = authParser(authorization);
	const { db } = await connectToDatabase();
	const authData = await db.collection('staff').findOne({ pnr: authPnr });

	if (!authData)
		return { authorized: false, status: 400, data: { error: 'No user with that pnr exists' } };
	if (!bcrypt.compareSync(authPass, authData.password))
		return { authorized: false, status: 400, data: { error: 'Invalid password' } };

	return { authorized: true, authedType: authData.type, authedName: authData.name };
}
