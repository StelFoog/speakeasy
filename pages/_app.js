import '../styles/globals.css';
import { Provider } from 'react-redux';
import SideBar from '../components/SideBar';
import store, { persistor } from '../redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import LoginVerified from '../components/LoginVerified';

function MyApp({ Component, pageProps }) {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<LoginVerified whitelist={['/']}>
					<SideBar />
					<section className={'content'}>
						<Component {...pageProps} />
					</section>
				</LoginVerified>
			</PersistGate>
		</Provider>
	);
}
export default MyApp;
