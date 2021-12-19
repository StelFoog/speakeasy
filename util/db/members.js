import axios from 'axios';

function instance(pnr, password) {
	return axios.create({
		baseURL: '/api/members/',
		timeout: 5000,
		timeoutErrorMessage: "Couldn't get a response from the server", // Could maybe be more clear?
		headers: {
			Authorization: `${pnr}+${password}`,
		},
	});
}

export async function addMember({ pnr, password }, member) {
	return instance(pnr, password)
		.put('/add', member)
		.then((res) => res.data.result)
		.catch((error) => {
			if (error.response) throw error.response.data.error;
			else throw error.message;
		});
}

export async function setMemberInside({ pnr, password }, memberPnr) {
	return instance(pnr, password)
		.post(`/${memberPnr}/enter`)
		.then((res) => res.data.result)
		.catch((error) => {
			if (error.response) throw error.response.data.error;
			else throw error.message;
		});
}

export async function setMemberOutside({ pnr, password }, memberPnr) {
	return instance(pnr, password)
		.post(`/${memberPnr}/exit`)
		.then((res) => res.data.result)
		.catch((error) => {
			if (error.response) throw error.response.data.error;
			else throw error.message;
		});
}

export async function getMembers({ pnr, password }, inside = null) {
	return instance(pnr, password)
		.get('/get', { params: { inside } })
		.then((res) => res.data)
		.catch((error) => {
			if (error.response) throw error.response.data.error;
			else throw error.message;
		});
}

export async function getMember({ pnr, password }, memberPnr) {
	return instance(pnr, password)
		.get(`/get/${memberPnr}`)
		.then((res) => res.data)
		.catch((error) => {
			if (error.response) throw error.response.data.error;
			else throw error.message;
		});
}

export async function memberWithIdExists(host, memberId) {
	return axios
		.get(`http://${host}/api/members/${memberId}/exists`)
		.then((res) => res.data)
		.catch((error) => {
			if (error.response) throw error.response.data.error;
			else throw error.message;
		});
}
