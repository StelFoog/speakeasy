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
	);
}

export default function Tabs() {
	const user = useSelector(selectUser);
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
		</main>
	);
}
