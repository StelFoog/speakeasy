import axios from 'axios';

async function baseCall(query) {
	return axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?${query}`);
}

export async function searchDrinks(query) {
	return baseCall(`s=${query}`)
		.then((res) => {
			if (res.status !== 200) throw res.statusText;
			return res.data.drinks;
		})
		.catch((reason) => console.error(reason));
}
