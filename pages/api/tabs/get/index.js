import authorize from '../../../../util/db/authorize';
import { connectToDatabase, TABS_PER_REQUEST } from '../../../../util/db';

// Gets the tab with the given id
export default async function handler(req, res) {
	const { method, headers, query } = req;
	if (method !== 'GET') return res.status(405).json({ error: `Method ${method} not allowed` });

	const { authorization } = headers;
	if (!authorization) return res.status(401).json({ error: 'Not authorization provided' });
	// Verify authorization
	const { authorized, status, data } = await authorize(authorization);
	if (!authorized) return res.status(status).json(data);

	const { db } = await connectToDatabase();
	const { skip = 0 } = query;

	const tabData = await db
		.collection('tabs')
		.find({})
		.project({ items: 0 })
		.sort({ timeOpened: -1 })
		.skip(skip * TABS_PER_REQUEST)
		.limit(TABS_PER_REQUEST)
		.toArray();

	res.status(200).json(tabData);
}
