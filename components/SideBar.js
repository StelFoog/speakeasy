import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/user';
import styles from '../styles/SideBar.module.css';

export const EXCLUDED_PATHS = ['/'];

function SideBarItem({ children, path }) {
	// returns a list item as a next link with correct styling and marked if on the correct path
	const router = useRouter();
	const basePath = router.asPath.split('/')[1];

	return (
		<Link href={`/${path}`} passHref>
			<li className={`${styles.menuItem} ${basePath === path ? styles.selectedItem : ''}`}>
				{children}
			</li>
		</Link>
	);
}

export default function SideBar() {
	const user = useSelector(selectUser);
	const router = useRouter();
	if (EXCLUDED_PATHS.includes(router.pathname)) return <></>;

	return (
		<section>
			<ul className={styles.container}>
				{/* Maybe remove ||, added to give some character, but maybe an icon instead */}
				<li className={`selfCenter ${styles.menuHead}`}>|| Speakeasy ||</li>
				<SideBarItem path="dashboard">
					<span className={styles.staffName}>{user.name}</span>
					<span className={styles.staffPnr}>{user.pnr}</span>
				</SideBarItem>
				<SideBarItem path="members">Members</SideBarItem>
				<SideBarItem path="speakeasy">Inside</SideBarItem>
				<SideBarItem path="tabs">Tabs</SideBarItem>
			</ul>
		</section>
	);
}
