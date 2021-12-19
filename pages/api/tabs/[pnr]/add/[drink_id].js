import authorize from '../../../../../util/db/authorize';
import { connectToDatabase } from '../../../../../util/db';
import { getDrinkFromId } from '../../../../../util/cocktail';

async function addItemToItems(idDrink, items) {
	const newItems = [...items];
	for (let i = 0; i < newItems.length; i++) {
		if (newItems[i].idDrink === idDrink) {
			newItems[i].amount++;
			return { newItems };
		}
	}
	const itemData = await getDrinkFromId(idDrink);
	if (!itemData) return { itemError: `No drink with id ${idDrink} exists`, itemStatus: 400 };

	const { strDrink, strDrinkThumb } = itemData;

	newItems.push({ idDrink, strDrink, strDrinkThumb, amount: 1 });
	return { newItems };
}

// Adds a given item to the tab, or if it's already there it increases the amount of the item by one
export default async function handler(req, res) {
	const { method, headers, query } = req;
	if (method !== 'POST') return res.status(405).json({ error: `Method ${method} not allowed` });

	const { authorization } = headers;
	if (!authorization) return res.status(401).json({ error: 'Not authorization provided' });
	// Verify authorization
	const { authorized, status, data } = await authorize(authorization);
	if (!authorized) return res.status(status).json(data);

	const { db } = await connectToDatabase();
	const { pnr, drink_id } = query;

	const member = await db.collection('members').findOne({ pnr });
	if (!member) return res.status(400).json({ error: `No member with pnr ${pnr} exists` });

	const openTab = await db.collection('tabs').findOne({ pnr, closed: false });
	if (!openTab) return res.status(400).json({ error: "Member doesn't have an open tab" });

	const { newItems, itemStatus, itemError } = await addItemToItems(drink_id, openTab.items);
	if (itemError) return res.status(itemStatus).json({ error: itemError });

	const result = await db
		.collection('tabs')
		.updateOne({ _id: openTab._id }, { $set: { items: newItems } });

	res.status(200).json(newItems);
}
