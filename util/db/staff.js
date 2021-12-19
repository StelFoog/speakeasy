import axios from 'axios';

function instance(pnr, password) {
	return axios.create({
		baseURL: '/api/staff/',
		timeout: 5000,
		timeoutErrorMessage: "Couldn't get a response from the server", // Could maybe be more clear?
		headers: {
			Authorization: `${pnr}+${password}`,
		},
	});
}

export async function login({ pnr, password }) {
	return instance(pnr, password)
		.get('/login')
		.then((res) => ({ ...res.data, pnr, password }))
		.catch((error) => {
			if (error.response) throw error.response.data.error;
			else throw error.message;
		});
}

export async function create({ pnr, password }, staffMember) {
	return instance(pnr, password)
		.put('/create', staffMember)
		.then((res) => res.data.result)
		.catch((error) => {
			if (error.response) throw error.response.data.error;
			else throw error.message;
		});
}

export async function getOwnData({ pnr, password }) {
	return instance(pnr, password)
		.get('/get')
		.then((res) => res.data)
		.catch((error) => {
			if (error.response) throw error.response.data.error;
			else throw error.message;
		});
}

export async function getStaffData({ pnr, password }, staffPnr) {
	return instance(pnr, password)
		.get(`/get/${staffPnr}`)
		.then((res) => res.data)
		.catch((error) => {
			if (error.response) throw error.response.data.error;
			else throw error.message;
		});
}
