import { Outlet } from 'react-router-dom';
import Footer from '../Common/Footer';
import Header from '../Common/Header';

const UserLayout = () => {
	return (
		<>
			<Header />
			<Outlet />
			<Footer />
		</>
	);
};

export default UserLayout;
