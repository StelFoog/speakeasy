import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Example() {
	return (
		<div className={styles.container}>
			<Head>
				<title>Create Next App</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<h1 className={styles.title}>EXAMPLE</h1>

				<p className={styles.description}>
					This page only exists as an example in the sidebar. Should be removed the second there are
					other pages to replace it.
				</p>

				<p>
					<Link href="/" passHref>
						<a>Go back to index</a>
					</Link>
				</p>

				<p>
					<Link href="/test" passHref>
						<a>Go to test</a>
					</Link>
				</p>
			</main>
		</div>
	);
}
