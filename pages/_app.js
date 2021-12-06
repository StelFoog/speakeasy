import '../styles/globals.css'
import { Provider } from "react-redux";
import SideBar from '../components/SideBar';
import store from "../redux/store";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <SideBar />
			<Component {...pageProps} />
    </Provider>
  )
export default MyApp;
