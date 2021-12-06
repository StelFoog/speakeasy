import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/SideBar.module.css';

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
	const router = useRouter();
	if (router.pathname === '/') return <></>;

	return (
		<ul className={styles.container}>
			{/* Maybe remove ||, added to give some character, but maybe an icon instead */}
			<li className={`selfCenter ${styles.menuHead}`}>|| Speakeasy ||</li>
			<SideBarItem path="test">
				<span className={styles.staffName}>Test</span>
				<span className={styles.staffPnr}>010101-0101</span>
			</SideBarItem>
			<SideBarItem path="example">Example</SideBarItem>
		</ul>
	);
}
