import axios from 'axios';

function instance(pnr, password) {
	return axios.create({
		baseURL: '/api/staff/',
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
			throw error.response.data;
		});
}

export async function create({ pnr, password }, staffMember) {
	return instance(pnr, password)
		.put('/create', staffMember)
		.then((res) => res.data.result)
		.catch((error) => {
			throw error.response.data;
		});
}

export async function getOwnData({ pnr, password }) {
	return instance(pnr, password)
		.get('/get')
		.then((res) => res.data)
		.catch((error) => {
			throw error.response.data;
		});
}

export async function getStaffData({ pnr, password }, staffPnr) {
	return instance(pnr, password)
		.get(`/get/${staffPnr}`)
		.then((res) => res.data)
		.catch((error) => {
			throw error.response.data;
		});
}
