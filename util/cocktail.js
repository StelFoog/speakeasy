import axios from 'axios';

async function baseCall(query) {
	return axios.get(`https://www.thecocktaildb.com/api/json/v1/1/${query}`);
}

export async function searchDrinks(query) {
	return baseCall(`search.php?s=${query}`)
		.then((res) => {
			if (res.status !== 200) throw res.statusText;
			return res.data.drinks;
		})
		.catch((reason) => console.error(reason));
}

export async function getDrinkFromId(id) {
	return baseCall(`lookup.php?i=${id}`).then((res) => {
		if (res.status !== 200) throw res.statusText;

		if (res.data.drinks === null) return null;
		else return res.data.drinks[0];
	});
}
