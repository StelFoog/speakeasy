import { useEffect, useState } from 'react';
import Member from '../components/Member';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/user';
import styles from '../styles/Members.module.css';
import { getMembers } from '../util/db/members';
import { SmallLoader } from '../components/Loader';
import { toast } from 'react-toastify';

function MembersList({ members, loading }) {
	return (
		<main>
			<div className={styles.container}>
				{loading && <SmallLoader style={{ alignSelf: 'center' }} />}
				{members.map(({ _id, name, pnr, inside }) => {
					return (
						<div key={_id}>
							<Member name={name} pnr={pnr} status={inside ? 'INSIDE' : ''} />
						</div>
					);
				})}
			</div>
		</main>
	);
}

export default function Members() {
	const [members, setMembers] = useState([]);
	const [loading, setLoading] = useState(false);
	const user = useSelector(selectUser);
	useEffect(() => {
		setLoading(true);
		getMembers(user)
			.then((data) => {
				setMembers(data);
				setLoading(false);
			})
			.catch((error) => {
				toast.error(error);
				setLoading(false);
			});
	}, []);
	return <MembersList members={members} loading={loading} />;
}
