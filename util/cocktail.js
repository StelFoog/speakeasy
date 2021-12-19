import axios from 'axios';

async function baseCall(query) {
	return axios.get(`https://www.thecocktaildb.com/api/json/v1/1/${query}`);
}

export async function searchDrinks(query) {
	return baseCall(`search.php?s=${query}`)
		.then((res) => res.data.drinks)
		.catch((error) => {
			throw error.message;
		});
}

export async function getDrinkFromId(id) {
	return baseCall(`lookup.php?i=${id}`)
		.then((res) => res.data.drinks && res.data.drinks[0])
		.catch((error) => {
			throw error.message;
		});
}
