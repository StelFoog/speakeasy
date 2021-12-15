import '../styles/globals.css';
import { Provider } from 'react-redux';
import SideBar from '../components/SideBar';
import store, { persistor } from '../redux/store';
import {PersistGate} from "redux-persist/integration/react";

function MyApp({ Component, pageProps }) {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<SideBar />
				<Component {...pageProps} />
			</PersistGate>
		</Provider>
	);
}
export default MyApp;
