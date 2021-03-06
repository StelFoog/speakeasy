import styles from '../styles/Home.module.css';
import Head from 'next/head';
import TextInput from '../components/TextInput';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/user';
import { login } from '../util/db/staff';
import { SmallLoader } from '../components/Loader';
import { toast } from 'react-toastify';

function LoginForm({ pnr, setPnr, password, setPassword, handleSubmit, loading }) {
	return (
		<>
			<form
				onSubmit={(event) => {
					event.preventDefault();
					handleSubmit();
				}}
			>
				<TextInput
					label="Personal ID Number"
					value={pnr}
					onChange={setPnr}
					error={(!pnr || pnr.length !== 10) && 'Required'}
					fullWidth
				/>
				<TextInput
					label="Password"
					value={password}
					onChange={setPassword}
					error={!password && 'Required'}
					fullWidth
					type="password"
				/>
				<br />
				{!loading && (
					<button type="submit" disabled={!pnr || !password || pnr.length !== 10}>
						Login
					</button>
				)}
				{loading && <SmallLoader style={{ margin: '0 auto' }} />}
			</form>
		</>
	);
}

export default function Index() {
	const [password, setPassword] = useState('');
	const [pnr, setPnr] = useState('');
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const dispatch = useDispatch();

	function handleSubmit() {
		setLoading(true);
		login({ pnr, password })
			.then((user) => {
				dispatch(setUser(user));
				setLoading(false);
				router.push('/dashboard');
			})
			.catch((error) => {
				toast.error(error);
				setLoading(false);
			});
	}

	return (
		<div className={styles.container}>
			<Head>
				<title>SpeakEasy</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className={styles.main}>
				<h1 className={styles.title}>Welcome to SpeakEasy</h1>
				<div className={styles.description}>
					<LoginForm
						pnr={pnr}
						password={password}
						setPassword={setPassword}
						setPnr={setPnr}
						handleSubmit={handleSubmit}
						loading={loading}
					/>
				</div>
			</main>
		</div>
	);
}
