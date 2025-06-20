import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { validateSession } from "./redux/slices/userSlice";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Inventory from "./pages/Inventory";
import ViewProducts from "./pages/ViewProducts";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import { Provider } from "react-redux";
import store from "./redux/store";
import ViewOffers from "./pages/ViewOffers";
import Search from "./pages/Search";
import NotFoundPage from "./pages/NotFoundPage";

function AppContent() {
	const dispatch = useDispatch();
	const { isLoggedIn } = useSelector((state) => state.user);

	useEffect(() => {
		if (isLoggedIn) {
			dispatch(validateSession());
		}
	}, [dispatch, isLoggedIn]);

	return (
		<Router>
			<Routes>
				<Route
					path="/"
					element={<Navigate to={isLoggedIn ? "/home" : "/login"} replace />}
				/>
				<Route path="/login" element={isLoggedIn ? <Navigate to="/home" replace /> : <Login />} />
				<Route path="/inventory" element={isLoggedIn ? <Inventory /> : <Navigate to="/login" replace />} />
				<Route path="/products" element={isLoggedIn ? <ViewProducts /> : <Navigate to="/login" replace />} />
				<Route path="/offers" element={isLoggedIn ? <ViewOffers /> : <Navigate to="/login" replace />} />
				<Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" replace />} />
				<Route path="/signup" element={isLoggedIn ? <Navigate to="/home" replace /> : <Signup />} />
				<Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" replace />} />
				<Route path="/search" element={isLoggedIn ? <Search /> : <Navigate to="/login" replace />} />
				<Route path="/*" element={<NotFoundPage />} />
			</Routes>
		</Router>
	);
}

function App() {
	return (
		<Provider store={store}>
			<AppContent />
		</Provider>
	);
}

export default App;
