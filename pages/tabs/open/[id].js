import { useRouter } from 'next/dist/client/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader, { SmallLoader } from '../../../components/Loader';
import { selectUser } from '../../../redux/user';
import styles from '../../../styles/OpenTab.module.css';
import { getMember, memberWithIdExists } from '../../../util/db/members';
import { getOpenTab, openTab } from '../../../util/db/tabs';

function NoTab({ member, handleOpenTab, loading }) {
	return (
		<div className={styles.container}>
			<span>
				<span title={member.pnr}>{member.name}</span> has no open tab
			</span>
			<button onClick={handleOpenTab}>Open new tab</button>
			{loading && <SmallLoader />}
		</div>
	);
}

export default function OpenTab({ id }) {
	const user = useSelector(selectUser);
	const router = useRouter();
	const [member, setMember] = useState(null);
	const [tab, setTab] = useState(null);
	const [noLoad, setNoLoad] = useState(false);

	useEffect(() => {
		getMember(user, id)
			.then((data) => setMember(data))
			.catch((error) => {
				setNoLoad(true);
				toast.error(error);
			});
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
			.catch((error) => toast.error(error));
	}

	if (noLoad) return <main>Couldn't load member</main>;

	if (member === null || tab === null)
		return (
			<main>
				<Loader />
			</main>
		);

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
