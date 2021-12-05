import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/SideBar.module.css';

function SideBarItem({ children, path }) {
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
			<SideBarItem path="test">
				<span className={styles.staffName}>Test</span>
				<span className={styles.staffPnr}>010101-0101</span>
			</SideBarItem>
			<SideBarItem path="example">Example</SideBarItem>
		</ul>
	);
}
