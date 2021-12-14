import styles from '../styles/Home.module.css';
import Head from 'next/head';
import ErrorText from "../components/ErrorText";
import RequiredTextView from "../components/RequiredText"
import {useState} from 'react';
import {useRouter} from 'next/router';
import {useDispatch} from 'react-redux';
import {setUser} from '../redux/user';

function LoginForm({pnr, setPnr, password, setPassword, handleSubmit}) {
    return (<>
        <form onSubmit={(event) => {
            event.preventDefault()
            handleSubmit();
        }}>
            <label htmlFor="pnr">
                Personal ID Number {' '}
                <input id="pnr" placeholder="YYMMDDXXXX" type="text" maxLength={10} minLength={10}
                       onChange={(change) => {
                           setPnr(change.target.value)
                       }}/>
                {(!pnr || pnr.length !== 10) && <RequiredTextView/>}
            </label>
            <br/>
            <label htmlFor="password">
                Password {' '}
                <input id="password" placeholder="Password" type="password" required
                       onChange={(change) => {
                           setPassword(change.target.value)
                       }}/>
                {!password && <RequiredTextView/>}
            </label>
            <br/>
            <button type="submit"
                    disabled={!pnr || !password && pnr.length !== 10}>
                Login
            </button>
        </form>
    </>)
}

export default function Index() {
    const [password, setPassword] = useState('');
    const [pnr, setPnr] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const dispatch = useDispatch();

    function handleSubmit() {
        fetch('/api/staff/login', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${pnr}+${password}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                const {error, type, name} = data;
                if (!error) {
                    dispatch(setUser({name, pnr, password, type}));
                    router.push('drinks');
                } else {
                    setError(error);
                    setTimeout(() => {
                        setError('');
                    }, 5000);
                }
            })
            .catch((err) => console.log(err.statusText));
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>SpeakEasy</title>
                <meta name="description" content="Generated by create next app"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className={styles.main}>
                <h1 className={styles.title}>Welcome to SpeakEasy</h1>
                <div className={styles.description}>
                    <LoginForm pnr={pnr} password={password} setPassword={setPassword} setPnr={setPnr}
                               handleSubmit={handleSubmit}>
                    </LoginForm>
                    <ErrorText isDisabled={!error} error={error}/>
                </div>
            </main>
        </div>
    );
}
