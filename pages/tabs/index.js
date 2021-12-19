import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { SmallLoader } from '../../components/Loader';
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

function TabsList({ tabsCollection, loading, noMoreTabs, handleGetMoreTabs }) {
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
			{!!loading && <SmallLoader />}
			{!!noMoreTabs && noMoreTabs}
			{!loading && !noMoreTabs && !!tabsCollection.length && (
				<button onClick={handleGetMoreTabs}>More tabs</button>
			)}
		</>
	);
}

export default function Tabs() {
	const user = useSelector(selectUser);
	const [tabsCollection, setTabsCollection] = useState([]);
	const [loading, setLoading] = useState(null);
	const [noMoreTabs, setNoMoreTabs] = useState(null);

	useEffect(() => {
		handleGetTabs();
	}, []);

	function handleGetTabs() {
		if (!loading && !noMoreTabs) {
			setLoading(true);
			getTabs(user, tabsCollection.length)
				.then((moreTabs) => {
					setTabsCollection([...tabsCollection, moreTabs]);
					if (moreTabs.length < 10) setNoMoreTabs('No more tabs');
					setLoading(false);
				})
				.catch((error) => {
					toast.error(error);
					setLoading(false);
				});
		}
	}

	return (
		<main className={styles.container}>
			<TabsList
				tabsCollection={tabsCollection}
				loading={loading}
				noMoreTabs={noMoreTabs}
				handleGetMoreTabs={handleGetTabs}
			/>
		</main>
	);
}
