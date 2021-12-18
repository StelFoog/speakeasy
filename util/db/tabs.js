import axios from 'axios';

function instance(pnr, password) {
	return axios.create({
		baseURL: '/api/tabs/',
		headers: {
			Authorization: `${pnr}+${password}`,
		},
	});
}

export async function openTab({ pnr, password }, memberPnr) {
	return instance(pnr, password)
		.put(`/${memberPnr}/open`)
		.then((res) => res.data)
		.catch((error) => {
			throw error.response.data;
		});
}

export async function closeTab({ pnr, password }, memberPnr) {
	return instance(pnr, password)
		.post(`/${memberPnr}/close`)
		.then((res) => res.data)
		.catch((error) => {
			throw error.response.data;
		});
}

export async function getClosedTabs({ pnr, password }, memberPnr, skip = 0) {
	return instance(pnr, password)
		.get(`/${memberPnr}/get`, { params: { closed: '', offset: skip } })
		.then((res) => res.data)
		.catch((error) => {
			throw error.response.data;
		});
}

export async function getOpenTab({ pnr, password }, memberPnr) {
	return instance(pnr, password)
		.get(`/${memberPnr}/get`)
		.then((res) => res.data)
		.catch((error) => {
			throw error.response.data;
		});
}

export async function addItemToTab({ pnr, password }, memberPnr, itemId) {
	return instance(pnr, password)
		.post(`/${memberPnr}/add/${itemId}`)
		.then((res) => res.data)
		.catch((error) => {
			error.response.data;
		});
}

export async function removeItemFromTab({ pnr, password }, memberPnr, itemId) {
	return instance(pnr, password)
		.post(`/${memberPnr}/remove/${itemId}`)
		.then((res) => res.data)
		.catch((error) => {
			error.response.data;
		});
}

export async function getTabFromId({ pnr, password }, tabId) {
	return instance(pnr, password)
		.get(`/get/${tabId}`)
		.then((res) => res.data)
		.catch((error) => {
			throw error.response.data;
		});
}

export async function getTabs({ pnr, password }, skip = 0) {
	return instance(pnr, password)
		.get('/get', { params: { skip } })
		.then((res) => res.data)
		.catch((error) => {
			throw error.response.data;
		});
}

export async function tabWithIdExists(host, tabId) {
	return axios
		.get(`http://${host}/api/tabs/get/${tabId}`, { params: { exists: '' } })
		.then((res) => res.data)
		.catch((error) => {
			throw error;
		});
}
