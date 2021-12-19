import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Box from '../../components/Box';
import Loader, { SmallLoader } from '../../components/Loader';
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

function Tab({ pnr, timeOpened, timeClosed, items, closed, addDrink, removeDrink, loading }) {
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
			{loading && <SmallLoader style={{ alignSelf: 'center' }} />}
		</Box>
	);
}

function CloseTab({ handleCloseTab }) {
	return (
		<button className={styles.closeButton} onClick={handleCloseTab}>
			Close Tab
		</button>
	);
}

function SearchDrink({ query, setQuery, onSearch, drinks, addDrink, loading }) {
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

			{loading && <SmallLoader style={{ alignSelf: 'center' }} />}

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
	const [loadingTab, setLoadingTab] = useState(false);
	const [error, setError] = useState('');

	const [query, setQuery] = useState('');
	const [drinks, setDrinks] = useState([]);
	const [loadingSearch, setLoadingSearch] = useState(false);

	useEffect(() => {
		setLoadingTab(true);
		getTabFromId(user, id)
			.then((data) => {
				setTab(data);
				setLoadingTab(false);
			})
			.catch((e) => {
				setError(e);
				setLoadingTab(false);
			});
	}, []);

	function search() {
		setLoadingSearch(true);
		searchDrinks(query).then((d) => {
			if (d) setDrinks(d);
			else setDrinks([]);
			setLoadingSearch(false);
		});
	}

	function addDrink(id) {
		if (tab.closed) return;
		setLoadingTab(true);
		addItemToTab(user, tab.pnr, id).then((items) => {
			setTab({ ...tab, items });
			setLoadingTab(false);
		});
	}

	function removeDrink(id) {
		if (tab.closed) return;
		setLoadingTab(true);
		removeItemFromTab(user, tab.pnr, id).then((items) => {
			setTab({ ...tab, items });
			setLoadingTab(false);
		});
	}

	function handleCloseTab() {
		if (tab.closed) return;
		setLoadingTab(true);
		closeTab(user, tab.pnr).then((data) => {
			setTab(data);
			setLoadingTab(false);
		});
	}

	if (!tab) return <Loader />;
	if (error) return <span>An error has occured</span>;

	return (
		<main>
			<Tab {...tab} addDrink={addDrink} removeDrink={removeDrink} loading={loadingTab} />
			{!tab.closed && (
				<>
					<CloseTab handleCloseTab={handleCloseTab} />
					<SearchDrink
						query={query}
						setQuery={setQuery}
						onSearch={search}
						drinks={drinks}
						addDrink={addDrink}
						loading={loadingSearch}
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
