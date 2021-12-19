import authorize from '../../../../../util/db/authorize';
import { connectToDatabase } from '../../../../../util/db';

async function removeItemFromItems(idDrink, items, hard) {
	const newItems = [...items];
	for (let i = 0; i < newItems.length; i++) {
		if (newItems[i].idDrink === idDrink) {
			newItems[i].amount--;
			if (newItems[i].amount <= 0 || hard) newItems.splice(i, 1);
			return { newItems };
		}
	}
	return { itemError: `No drink with id ${idDrink} exists`, itemStatus: 400 };
}

// Removes one of the given item from the tab by decreasing the amount by one, if the amount is zero then the item is removed from the list, or if `hard` is set in the query params it removes the item entierly regarless of how many where in the list to begin with
export default async function handler(req, res) {
	const { method, headers, query } = req;
	if (method !== 'POST') return res.status(405).json({ error: `Method ${method} not allowed` });

	const { authorization } = headers;
	if (!authorization) return res.status(401).json({ error: 'Not authorization provided' });
	// Verify authorization
	const { authorized, status, data } = await authorize(authorization);
	if (!authorized) return res.status(status).json(data);

	const { db } = await connectToDatabase();
	const { pnr, drink_id, hard } = query;

	const member = await db.collection('members').findOne({ pnr });
	if (!member) return res.status(400).json({ error: `No member with pnr ${pnr} exists` });

	const openTab = await db.collection('tabs').findOne({ pnr, closed: false });
	if (!openTab) return res.status(400).json({ error: "Member doesn't have an open tab" });

	const { newItems, itemStatus, itemError } = await removeItemFromItems(
		drink_id,
		openTab.items,
		typeof hard !== 'undefined'
	);
	if (itemError) return res.status(itemStatus).json({ error: itemError });

	const result = await db
		.collection('tabs')
		.updateOne({ _id: openTab._id }, { $set: { items: newItems } });

	res.status(200).json(newItems);
}
