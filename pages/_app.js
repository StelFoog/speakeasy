import '../styles/globals.css';
import { Provider } from 'react-redux';
import SideBar from '../components/SideBar';
import store, { persistor } from '../redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import LoginVerified from '../components/LoginVerified';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
				<ToastContainer
					position="bottom-right"
					autoClose={5000}
					closeOnClick
					pauseOnFocusLoss
					draggableDirection="x"
					theme="colored"
				/>
			</PersistGate>
		</Provider>
	);
}
export default MyApp;
