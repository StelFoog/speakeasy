// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { connectToCollection } from '../../util/db';

export default async function handler(req, res) {
	const { collection } = await connectToCollection('staff');

	const result = await collection.insertOne({ name: 'John Doe', pnr: '010101XXXX' });

	res.status(200).json({ result });
}
