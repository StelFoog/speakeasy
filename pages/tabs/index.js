<<<<<<< HEAD
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/user';
import styles from '../../styles/TabList.module.css';
import { getTabs } from '../../util/db/tabs';

function OpenClosedMark({ closed }) {
	return (
		<div
			className={`${styles.openClosedMark} ${closed ? styles.closed : styles.open}`}
			title={closed ? 'closed' : 'open'}
		/>
	);
}

function TabsList({ tabsCollection, loading, error, handleGetMoreTabs }) {
	return (
		<>
			<ul className={styles.list}>
				{tabsCollection.map((tabs) =>
					tabs.map((tab) => (
						<Link key={tab._id} href={`/tabs/${tab._id}`}>
							<li>
								<div>
									<span>{tab.pnr}</span>
									<OpenClosedMark closed={tab.closed} />
								</div>
								<div>
									{/* Should display dates of the tab */}
									{/* <span>{tab.timeOpened}</span>
								{tab.closed && <span>{tab.timeClosed}</span>} */}
								</div>
							</li>
						</Link>
					))
				)}
			</ul>
			{!!loading && 'Loading...'}
			{!!error && error}
			{!loading && !error && <button onClick={handleGetMoreTabs}>More tabs</button>}
		</>
=======
import { useRouter } from 'next/dist/client/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/user';
import { getTabs } from '../../util/db/tabs';

function TabsList({ tabs }) {
	return (
		<ul>
			{tabs.map((tab) => (
				<li key={tab._id}>{tab.pnr}</li>
			))}
		</ul>
>>>>>>> d6452c4 (added tabs page and added to sidebar)
	);
}

export default function Tabs() {
	const user = useSelector(selectUser);
<<<<<<< HEAD
	const [tabsCollection, setTabsCollection] = useState([]);
	// const [page, setPage] = useState(0);
	const [loading, setLoading] = useState(null);
	// const [noMorePages, setNoMorePages] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		handleGetTabs();
	}, []);

	function handleGetTabs() {
		if (!loading && !error) {
			setLoading(true);
			getTabs(user, tabsCollection.length)
				.then((moreTabs) => {
					setTabsCollection([...tabsCollection, moreTabs]);
					if (moreTabs.length < 10) setError('No more tabs');
					// else setNoMorePages(false);
					setLoading(false);
				})
				.catch(() => {
					setError('There was an issue while getting tabs');
				});
		}
	}

	return (
		<main className={styles.container}>
			<TabsList
				tabsCollection={tabsCollection}
				loading={loading}
				error={error}
				handleGetMoreTabs={handleGetTabs}
				// page={page}
				// setPage={setPage}
				// noMorePages={noMorePages}
			/>
=======
	const [tabs, setTabs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		getTabs(user)
			.then((tabs) => {
				if (tabs.length < 1) {
					setError(
						"There doesn't appear to be any tabs on this page, try reloading the page or going back"
					);
				} else {
					setTabs(tabs);
					setLoading(false);
				}
			})
			.catch(() => setError('An error occured while getting the tabs'));
	}, [page]);

	if (error) return <main>{error}</main>;

	if (loading) return <main>Loading...</main>;

	return (
		<main>
			<TabsList tabs={tabs} />
>>>>>>> d6452c4 (added tabs page and added to sidebar)
		</main>
	);
}
