import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Inventory from "./pages/Inventory";
import ViewProducts from "./pages/ViewProducts";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import { Provider } from "react-redux";
import store from "./redux/store";
import Search from "./pages/Search";

function App() {
	return (
		<Provider store={store}>
			<Router>
				<Routes>
					<Route
						path="/"
						element={<Navigate to="/login" replace />}
					/>
					<Route path="/login" element={<Login />} />
					<Route path="/inventory" element={<Inventory />} />
					<Route path="/products" element={<ViewProducts />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/home" element={<Home />} />
					<Route path="/search" element={<Search />} />
				</Routes>
			</Router>
		</Provider>
	);
}

export default App;
