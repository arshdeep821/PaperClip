import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Signup.module.css";
import PaperClipLogo from "../assets/PaperClip.png";

function Signup() {
	const [formData, setFormData] = useState({
		username: "",
		password1: "",
		password2: "",
	});
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState, // keep previous state
			[name]: value, // override previous state value, name can be username or password, value is the value of the input
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// TODO: Implement signup logic here
		console.log("Signup:", formData);
		navigate("/login");
	};

	const handleAccountCreated = () => {
		navigate("/login");
	};

	return (
		<div className={styles.page}>
			<div className={styles.box}>
				<div className={styles.titleRow}>
					<img
						src={PaperClipLogo}
						alt="PaperClip Logo"
						className={styles.logo}
					/>
					<h1>PaperClip</h1>
				</div>
				<h2>Create an Account</h2>
				<form onSubmit={(e) => handleSubmit(e)}>
					<div className={styles.formSection}>
						<label htmlFor="username">Username</label>
						<input
							type="text"
							id="username"
							name="username"
							value={formData.username}
							onChange={(e) => handleChange(e)}
							required
						/>
					</div>
					<div className={styles.formSection}>
						<label htmlFor="password1">Create a Password</label>
						<input
							type="password"
							id="password1"
							name="password1"
							value={formData.password1}
							onChange={(e) => handleChange(e)}
							required
						/>
					</div>
					<div className={styles.formSection}>
						<label htmlFor="password2">
							Re-enter your Password
						</label>
						<input
							type="password"
							id="password2"
							name="password2"
							value={formData.password2}
							onChange={(e) => handleChange(e)}
							required
						/>
					</div>
					<button type="submit" className={styles.button}>
						Login
					</button>
				</form>
				<div className={styles.loginHyperlink}>
					<p>Already have an Account?</p>
					<button
						onClick={() => handleAccountCreated()}
						className={styles.loginHyperlinkButton}
					>
						Login
					</button>
				</div>
			</div>
		</div>
	);
}

export default Signup;
