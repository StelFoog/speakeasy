import authorize from '../../../../util/db/authorize';
import { connectToDatabase, TABS_PER_REQUEST } from '../../../../util/db';

// Gets the members open tab or a list of their closed tabs
export default async function handler(req, res) {
	const { method, headers, query } = req;
	if (method !== 'GET') return res.status(405).json({ error: `Method ${method} not allowed` });

	const { authorization } = headers;
	if (!authorization) return res.status(401).json({ error: 'Not authorization provided' });
	// Verify authorization
	const { authorized, status, data } = await authorize(authorization);
	if (!authorized) return res.status(status).json(data);

	const { db } = await connectToDatabase();
	const { pnr, closed, all, offset = 0 } = query;

	const member = await db.collection('members').findOne({ pnr });
	if (!member) return res.status(400).json({ error: `No member with pnr ${pnr} exists` });

	if (typeof closed === 'undefined') {
		// get member's open tab
		const openTab = await db.collection('tabs').findOne({ pnr, closed: false });
		if (!openTab) return res.status(400).json({ error: "Member doesn't have an open tab" });

		res.status(200).json(openTab);
	} else {
		// get members closed tabs
		const result =
			typeof all === 'undefined'
				? await db
						.collection('tabs')
						.find({ pnr, closed: true })
						.skip(offset * TABS_PER_REQUEST)
						.limit(TABS_PER_REQUEST)
						.toArray()
				: await db.collection('tabs').find({ pnr, closed: true }).toArray();

		res.status(200).json(result);
	}
}
