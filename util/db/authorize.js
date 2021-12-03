import bcrypt from 'bcrypt';

export default async function (authorization, collection) {
	const [authPnr, authPass] = authorization.split('+');
	const authData = await collection.findOne({ pnr: authPnr });
	if (!authData)
		return { authorized: false, status: 400, data: { error: 'No user with that pnr exists' } };
	if (!bcrypt.compareSync(authPass, authData.password))
		return { authorized: false, status: 400, data: { error: 'Invalid password' } };

	return { authorized: true, authedType: authData.type };
}
