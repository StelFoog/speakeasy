import { useRouter } from 'next/dist/client/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/user';
import styles from '../../../styles/OpenTab.module.css';
import { getMember, memberWithIdExists } from '../../../util/db/members';
import { getOpenTab, openTab } from '../../../util/db/tabs';

function NoTab({ member, handleOpenTab }) {
	return (
		<div className={styles.container}>
			<span>
				<span title={member.pnr}>{member.name}</span> has no open tab
			</span>
			<button onClick={handleOpenTab}>Open new tab</button>
		</div>
	);
}

export default function OpenTab({ id }) {
	const user = useSelector(selectUser);
	const router = useRouter();
	const [member, setMember] = useState(null);
	const [tab, setTab] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		getMember(user, id)
			.then((d) => setMember(d))
			.catch(() => setError('There was an error getting the member'));
	}, []);

	useEffect(() => {
		if (member)
			getOpenTab(user, member.pnr)
				.then((d) => setTab(d))
				.catch(() => setTab(false));
	}, [member]);

	useEffect(() => {
		if (tab) router.push(`/tabs/${tab._id}`);
	}, [tab]);

	function handleOpenTab() {
		openTab(user, member.pnr)
			.then((id) => router.push(`/tabs/${id}`))
			.catch(() => setError('There was an error opening the new tab'));
	}

	if (error) return <main>{error}</main>;

	if (member === null || tab === null) return <main>Loading...</main>;

	if (tab) return <main>Redirecting...</main>;

	return (
		<main>
			<NoTab member={member} handleOpenTab={handleOpenTab} />
		</main>
	);
}

export async function getServerSideProps({ req, params }) {
	// verifies that a member with the given id exists, otherwise 404
	const { id } = params;
	const host = req.rawHeaders[1];
	let exists;

	await memberWithIdExists(host, id)
		.then(() => (exists = true))
		.catch(() => (exists = false));

	if (exists) return { props: { id } };
	else return { notFound: true };
}
