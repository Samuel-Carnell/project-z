import { Route, Routes } from 'react-router';
import { Link } from 'react-router-dom';
import { AppPage } from './app/app.page';

export const Pages = () => (
	<Routes>
		<Route path="/app/*" element={<AppPage />} />
		<Route path="*" element={<Link to="/app/test/kanban">Go to page</Link>} />
	</Routes>
);
