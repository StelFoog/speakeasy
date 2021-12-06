import SideBar from '../components/SideBar';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
	return (
		<>
			<SideBar />
			<Component {...pageProps} />
		</>
	);
}

export default MyApp;
