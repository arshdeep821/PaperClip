import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setUser, finishLoading } from "./redux/slices/userSlice";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Inventory from "./pages/Inventory";
import ViewProducts from "./pages/ViewProducts";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import ViewOffers from "./pages/ViewOffers";
import Search from "./pages/Search";
import Users from "./pages/Users";
import NotFoundPage from "./pages/NotFoundPage";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";

const originalFetch = window.fetch;
window.fetch = function (input, init = {}) {
	return originalFetch(input, {
		...init,
		credentials: "include",
	});
};

const RequireAuth = ({ children }) => {
	const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
	if (!isLoggedIn) {
		return <Navigate to="/login" replace />;
	}
	return children;
}

const App = () => {
	const dispatch = useDispatch();
	const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
	const isLoading = useSelector((state) => state.user.isLoading);

	useEffect(() => {
		const checkSession = async () => {
			try {
				const res = await fetch("http://localhost:3001/users/session", {
					credentials: "include",
				});
				if (!res.ok) throw new Error("No session");
				const user = await res.json();
				dispatch(setUser(user));
			} catch {
				dispatch(finishLoading());
			}
		};

		checkSession();
	}, [dispatch]);

	if (isLoading) {
		return <p>Loading...</p>;
	}

	return (
		<Router>
			<Routes>
				<Route
					path="/"
					element={
						isLoggedIn ? (
							<Navigate to="/home" replace />
						) : (
							<Navigate to="/login" replace />
						)
					}
				/>

				<Route
					path="/login"
					element={<Login />}
				/>
				<Route
					path="/signup"
					element={<Signup />}
				/>

				<Route
					path="/home"
					element={
						<RequireAuth>
							<Home />
						</RequireAuth>
					}
				/>
				<Route
					path="/inventory"
					element={
						<RequireAuth>
							<Inventory />
						</RequireAuth>
					}
				/>
				<Route
					path="/products"
					element={
						<RequireAuth>
							<ViewProducts />
						</RequireAuth>
					}
				/>
				<Route
					path="/offers"
					element={
						<RequireAuth>
							<ViewOffers />
						</RequireAuth>
					}
				/>
				<Route
					path="/profile"
					element={
						<RequireAuth>
							<Profile />
						</RequireAuth>
					}
				/>
				<Route
					path="/search"
					element={
						<RequireAuth>
							<Search />
						</RequireAuth>
					}
				/>
				<Route
					path="/users/:username"
					element={
						<RequireAuth>
							<Users />
						</RequireAuth>
					}
				/>
				<Route
					path="/chats"
					element={
						<RequireAuth>
							<Messages />
						</RequireAuth>
					}
				/>
				<Route
					path="/settings"
					element={
						<RequireAuth>
							<Settings />
						</RequireAuth>
					}
				/>

				<Route path="/*" element={<NotFoundPage />} />
			</Routes>
		</Router>
	);
}

export default App;
