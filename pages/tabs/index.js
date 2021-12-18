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
	);
}

export default function Tabs() {
	const user = useSelector(selectUser);
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
		</main>
	);
}
