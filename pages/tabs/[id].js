import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
<<<<<<< HEAD
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
=======
import { selectUser } from '../../redux/user';
import styles from '../../styles/Tab.module.css';
import { getTabFromId, tabWithIdExists } from '../../util/db/tabs';

function Tab({ memberPnr, timeOpened, items, closed }) {
	return (
		<div className={styles.tabContainer}>
			<div className={styles.tabInfo}>
				<span>{memberPnr}</span>
				<span>{closed ? 'Closed' : 'Open'}</span>
			</div>
		</div>
>>>>>>> acaff70 (began work on tab page)
	);
}

export default function TabWithID({ id }) {
	const user = useSelector(selectUser);
	const [tab, setTab] = useState(null);
	const [error, setError] = useState('');

<<<<<<< HEAD
	const [query, setQuery] = useState('');
	const [drinks, setDrinks] = useState([]);

=======
>>>>>>> acaff70 (began work on tab page)
	useEffect(() => {
		getTabFromId(user, id)
			.then((data) => setTab(data))
			.catch((e) => setError(e));
	}, []);

<<<<<<< HEAD
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
=======
	if (!tab) return <span>Loading...</span>;
	if (error) return <span>An error has occured</span>;

	console.log(tab);

	return (
		<main>
			<Tab memberPnr={tab.pnr} closed={tab.closed} />
>>>>>>> acaff70 (began work on tab page)
		</main>
	);
}

export async function getServerSideProps({ req, params }) {
<<<<<<< HEAD
	// verifies that a tab with the given id exists, otherwise 404
=======
>>>>>>> acaff70 (began work on tab page)
	const { id } = params;
	const host = req.rawHeaders[1];
	let exists;

	await tabWithIdExists(host, id)
		.then(() => (exists = true))
		.catch(() => (exists = false));

	if (exists) return { props: { id } };
	else return { notFound: true };
}
