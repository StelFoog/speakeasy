import bcrypt from 'bcrypt';
import { connectToDatabase } from '.';
import authParser from '../authParser';

// takes an authorization header and checks if the user is authorized, if it isn't returns an error, but if it is it returns the users data
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
