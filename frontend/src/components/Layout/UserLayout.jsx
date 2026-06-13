import { Outlet } from 'react-router-dom';
import Footer from '../Common/Footer';
import Header from '../Common/Header';
import Chatbox from '../Common/Chatbox';

const UserLayout = () => {
	return (
		<>
			<Header />
			<Outlet />
			<Footer />
			<Chatbox />
		</>
	);
};

export default UserLayout;
