import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "../styles/Login.module.css";
import PaperClipLogo from "../assets/PaperClip.png";

import { loginUser } from "../redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

function Login() {
	const dispatch = useDispatch();
	const { loading, error } = useSelector((state) => state.user);
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			await dispatch(
				loginUser({
					username: formData.username,
					password: formData.password,
				})
			).unwrap();

			navigate("/products");
		} catch (error) {
			toast.error(error.message || "An error occurred while trying to login");
		}
	};

	const handleCreateAccount = () => {
		navigate("/signup");
	};

	return (
		<div className={styles.loginPage}>
			<div className={styles.loginBox}>
				<div className={styles.loginTitleRow}>
					<img
						src={PaperClipLogo}
						alt="PaperClip Logo"
						className={styles.loginLogo}
					/>
					<h1>PaperClip</h1>
				</div>
				<h2>Welcome Back</h2>
				{error && <div className={styles.error}>{error}</div>}
				<form onSubmit={(e) => handleSubmit(e)}>
					<div className={styles.formSection}>
						<label htmlFor="username">Username</label>
						<input
							type="text"
							id="username"
							name="username"
							value={formData.username}
							onChange={(e) => handleChange(e)}
							style={{ paddingLeft: "10px" }}
							required
						/>
					</div>
					<div className={styles.formSection}>
						<label htmlFor="password">Password</label>
						<input
							type="password"
							id="password"
							name="password"
							value={formData.password}
							onChange={(e) => handleChange(e)}
							style={{ paddingLeft: "10px" }}
							required
						/>
					</div>
					<button
						type="submit"
						className={styles.loginButton}
						disabled={loading}
					>
						{loading ? "Logging in..." : "Login"}
					</button>
				</form>
				<div className={styles.createAccount}>
					<p>Don't have an account?</p>
					<button
						onClick={() => handleCreateAccount()}
						className={styles.createAccountButton}
					>
						Create Account
					</button>
				</div>
			</div>
		</div>
	);
}

export default Login;
