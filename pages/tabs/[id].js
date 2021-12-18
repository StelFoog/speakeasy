import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Box from '../../components/Box';
import TextInput from '../../components/TextInput';
import { selectUser } from '../../redux/user';
import styles from '../../styles/Tab.module.css';
import { searchDrinks } from '../../util/cocktail';
import { formatDateTime } from '../../util/dates';
import {
	addItemToTab,
	closeTab,
	getTabFromId,
	removeItemFromTab,
	tabWithIdExists,
} from '../../util/db/tabs';

function OpenClosedPill({ closed }) {
	return (
		<span className={`${styles.pill} ${closed ? styles.closed : styles.open}`}>
			{closed ? 'CLOSED' : 'OPEN'}
		</span>
	);
}

function Times({ decorator, time }) {
	return (
		<div className={styles.times}>
			<span className={styles.decorator}>{decorator}</span>
			<span>{formatDateTime(time)}</span>
		</div>
	);
}

function Tab({ pnr, timeOpened, timeClosed, items, closed, addDrink, removeDrink }) {
	return (
		<Box>
			<div className={styles.tabInfo}>
				<span className={styles.member}>{pnr}</span>
				<OpenClosedPill closed={closed} />
			</div>
			<div className={styles.tabInfo}>
				<Times decorator={'Opened:'} time={timeOpened} />
				{closed && <Times decorator={'Closed:'} time={timeClosed} />}
			</div>
			<ul className={styles.itemsList}>
				{items.map((item) => (
					<li key={item.idDrink}>
						<span>{item.strDrink}</span>
						<div>
							<button className={styles.green} onClick={() => addDrink(item.idDrink)}>
								+
							</button>
							<span>{item.amount}</span>
							<button className={styles.red} onClick={() => removeDrink(item.idDrink)}>
								-
							</button>
						</div>
					</li>
				))}
			</ul>
		</Box>
	);
}

function SearchDrink({ query, setQuery, onSearch, drinks, addDrink }) {
	return (
		<Box>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					onSearch();
				}}
			>
				<TextInput value={query} onChange={setQuery} label="Drinks" error={null} />
				<button type="submit" className={styles.searchButton}>
					Search
				</button>
			</form>

			{!!drinks.length && (
				<ul className={styles.searchList}>
					{drinks.map((drink) => (
						<li key={drink.idDrink}>
							<span>{drink.strDrink}</span>
							<button onClick={() => addDrink(drink.idDrink)}>+</button>
						</li>
					))}
				</ul>
			)}
		</Box>
	);
}

export default function TabWithID({ id }) {
	const user = useSelector(selectUser);
	const [tab, setTab] = useState(null);
	const [error, setError] = useState('');

	const [query, setQuery] = useState('');
	const [drinks, setDrinks] = useState([]);

	useEffect(() => {
		getTabFromId(user, id)
			.then((data) => setTab(data))
			.catch((e) => setError(e));
	}, []);

	function search() {
		searchDrinks(query).then((d) => {
			if (d) setDrinks(d);
			else setDrinks([]);
		});
	}

	function addDrink(id) {
		if (!tab.closed) addItemToTab(user, tab.pnr, id).then((items) => setTab({ ...tab, items }));
	}

	function removeDrink(id) {
		if (!tab.closed)
			removeItemFromTab(user, tab.pnr, id).then((items) => setTab({ ...tab, items }));
	}

	function handleCloseTab() {
		if (!tab.closed) closeTab(user, tab.pnr).then((data) => setTab(data));
	}

	if (!tab) return <span>Loading...</span>;
	if (error) return <span>An error has occured</span>;

	return (
		<main>
			<Tab {...tab} addDrink={addDrink} removeDrink={removeDrink} />
			{!tab.closed && (
				<>
					<button className={styles.closeButton} onClick={handleCloseTab}>
						Close Tab
					</button>
					<SearchDrink
						query={query}
						setQuery={setQuery}
						onSearch={search}
						drinks={drinks}
						addDrink={addDrink}
					/>
				</>
			)}
		</main>
	);
}

export async function getServerSideProps({ req, params }) {
	// verifies that a tab with the given id exists, otherwise 404
	const { id } = params;
	const host = req.rawHeaders[1];
	let exists;

	await tabWithIdExists(host, id)
		.then(() => (exists = true))
		.catch(() => (exists = false));

	if (exists) return { props: { id } };
	else return { notFound: true };
}
