import authorize from '../../../util/db/authorize';
import { connectToDatabase } from '../../../util/db';
import { authPnr } from '../../../util/authParser';

const isoDateRegex = /[0-9]{4}-(1[0-2]|0[1-9])-(3[01]|[12][0-9]|0[1-9])/g;

function validNewReportObject(report) {
	if (typeof report.date !== 'string' || !report.date.match(isoDateRegex)) return false;
	if (typeof report.hours !== 'number' || report.hours < 0) return false;
	if (report.note && typeof report.note !== 'string') return false;

	return true;
}

// Checks that there's a body that's a valid staff object and that the user creating it is a manager. Then creates the new user.
export default async function handler(req, res) {
	const { method, headers, body } = req;
	if (method !== 'PUT' && method !== 'POST')
		return res.status(405).json({ error: `Method ${method} not allowed` });

	const { authorization } = headers;
	if (!authorization) return res.status(401).json({ error: 'Not authorization provided' });

	if (!validNewReportObject(body)) return res.status(400).json({ error: 'Invalid body data' });

	// Verify authorization
	const { authorized, status, data } = await authorize(authorization);
	if (!authorized) return res.status(status).json(data);

	const { date, hours, note } = body;
	const reportingNote = !note || note.length < 1 ? null : note;
	const report = { date, hours, note: reportingNote, pnr: authPnr(authorization) };

	const { db } = await connectToDatabase();

	const existingReport = await db
		.collection('reports')
		.findOne({ pnr: authPnr(authorization), date });
	if (existingReport && method === 'PUT')
		return res.status(400).json({ error: 'A report for this date already exists' });
	if (!existingReport && method === 'POST')
		return res.status(400).json({ error: 'No existing report to update' });

	const result =
		method === 'PUT'
			? await db.collection('reports').insertOne(report)
			: await db.collection('reports').updateOne({ _id: existingReport._id }, { $set: report });

	res.status(200).json({ result });
}
