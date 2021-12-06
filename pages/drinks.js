import { useState } from 'react';
import { searchDrinks } from '../util/cocktail';

export default function Drinks(props) {
	const [query, setQuery] = useState('');

	const [result, setResult] = useState(null);

	async function search() {
		searchDrinks(query)
			.then((drinks) => setResult(drinks))
			.catch((e) => {
				console.error(e);
				setResult(null);
			});
	}

	return (
		<>
			<main>
				<h1>Drinks</h1>
				<input onChange={(e) => setQuery(e.target.value)} />
				<button disabled={query.length < 1} onClick={search}>
					ClickMe
				</button>
				{result !== null && (
					<div>
						<span>Results:</span>
						{result.length < 1 ? (
							<span>No drinks found</span>
						) : (
							result.map(({ strDrink, id }) => <h4 key={id}>{strDrink}</h4>)
						)}
					</div>
				)}
			</main>
		</>
	);
}
