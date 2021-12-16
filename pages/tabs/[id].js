import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/user';
import styles from '../../styles/Tab.module.css';
import { getTabFromId, tabWithIdExists } from '../../util/db/tabs';

function Tab({ pnr, timeOpened, items, closed }) {
	return (
		<div className={styles.tabContainer}>
			<div className={styles.tabInfo}>
				<span>{pnr}</span>
				<span>{closed ? 'Closed' : 'Open'}</span>
			</div>
		</div>
	);
}

export default function TabWithID({ id }) {
	const user = useSelector(selectUser);
	const [tab, setTab] = useState(null);
	const [error, setError] = useState('');

	useEffect(() => {
		getTabFromId(user, id)
			.then((data) => setTab(data))
			.catch((e) => setError(e));
	}, []);

	if (!tab) return <span>Loading...</span>;
	if (error) return <span>An error has occured</span>;

	console.log(tab);

	return (
		<main>
			<Tab {...tab} />
		</main>
	);
}

export async function getServerSideProps({ req, params }) {
	const { id } = params;
	const host = req.rawHeaders[1];
	let exists;

	await tabWithIdExists(host, id)
		.then(() => (exists = true))
		.catch(() => (exists = false));

	if (exists) return { props: { id } };
	else return { notFound: true };
}
