import axios from 'axios';

function instance(pnr, password) {
	return axios.create({
		baseURL: '/api/reports/',
		timeout: 5000,
		timeoutErrorMessage: "Couldn't get a response from the server", // Could maybe be more clear?
		headers: {
			Authorization: `${pnr}+${password}`,
		},
	});
}

export async function insertReport({ pnr, password }, report) {
	return instance(pnr, password)
		.put('/insert', report)
		.then((res) => res.data.result)
		.catch((error) => {
			if (error.response) throw error.response.data.error;
			else throw error.message;
		});
}

export async function getOwnReports({ pnr, password }, skip = 0) {
	return instance(pnr, password)
		.get('/get', { params: { skip } })
		.then((res) => res.data)
		.catch((error) => {
			if (error.response) throw error.response.data.error;
			else throw error.message;
		});
}

export async function getStaffReports({ pnr, password }, staffPnr, skip = 0) {
	return instance(pnr, password)
		.get(`/get/${staffPnr}`, { params: { skip } })
		.then((res) => res.data)
		.catch((error) => {
			if (error.response) throw error.response.data.error;
			else throw error.message;
		});
}

export async function updateReport({ pnr, password }, report) {
	return instance(pnr, password)
		.post('/insert', report)
		.then((res) => res.data.result)
		.catch((error) => {
			if (error.response) throw error.response.data.error;
			else throw error.message;
		});
}
