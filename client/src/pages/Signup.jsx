import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Country, City } from "country-state-city";
import styles from "../styles/Signup.module.css";
import PaperClipLogo from "../assets/PaperClip.png";

const BACKEND_URL = "http://localhost:3001";
//frontend

const Signup = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		username: "",
		name: "",
		email: "",
		password1: "",
		password2: "",
		country: "",
		city: "",
	});

	const countries = useMemo(() => Country.getAllCountries(), []);
	const [cities, setCities] = useState([]);

	useEffect(() => {
		if (formData.country) {
			const countryObject = countries.find(
				(c) => c.name.toLowerCase() === formData.country.toLowerCase()
			);

			if (countryObject) {
				const isoCode = countryObject.isoCode;
				const cityList = City.getCitiesOfCountry(isoCode);
				setCities(cityList);
				setFormData((prev) => ({ ...prev, city: "" }));
			}
		} else {
			setCities([]);
			setFormData((prev) => ({ ...prev, city: "" }));
		}
	}, [formData.country]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (formData.password1 !== formData.password2) {
			alert("Passwords do not match!");
			return;
		}

		const selectedCity = cities.find(
			(c) => c.name.toLowerCase() === formData.city.toLowerCase()
		);

		const lat = selectedCity?.latitude || null;
		const lon = selectedCity?.longitude || null;

		try {
			const response = await fetch(`${BACKEND_URL}/users`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					username: formData.username,
					name: formData.name,
					email: formData.email,
					password: formData.password1,
					country: formData.country,
					city: formData.city,
					lat,
					lon,
				}),
				credentials: "omit",
			});

			if (!response.ok) {
				const errorData = await response.json();
				alert(
					`Error: ${
						errorData.error ||
						"An error occurred trying to make your account"
					}`
				);
				return;
			}

			const userData = await response.json();

			navigate("/login");
			alert("Account Successfully Created");
		} catch (error) {
			console.error("Error:", error);
			alert("Network error. Please try again.");
		}
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
							style={{ paddingLeft: "10px" }}
							required
						/>
					</div>
					<div className={styles.formSection}>
						<label htmlFor="name">Name</label>
						<input
							type="text"
							id="name"
							name="name"
							value={formData.name}
							onChange={(e) => handleChange(e)}
							style={{ paddingLeft: "10px" }}
							required
						/>
					</div>
					<div className={styles.formSection}>
						<label htmlFor="email">Email</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={(e) => handleChange(e)}
							style={{ paddingLeft: "10px" }}
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
							style={{ paddingLeft: "10px" }}
							required
						/>
					</div>
					<div className={styles.formSection}>
						<label htmlFor="password2">Confirm Password</label>
						<input
							type="password"
							id="password2"
							name="password2"
							value={formData.password2}
							onChange={(e) => handleChange(e)}
							style={{ paddingLeft: "10px" }}
							required
						/>
					</div>
					<div className={styles.formSection}>
						<label htmlFor="country">Country</label>
						<input
							id="country"
							name="country"
							type="text"
							value={formData.country}
							onChange={handleChange}
							list="country-options"
							style={{ paddingLeft: "10px" }}
							required
						/>
						<datalist id="country-options">
							{countries.map((c) => (
								<option key={c.isoCode} value={c.name}>
									{c.name}
								</option>
							))}
						</datalist>
					</div>
					<div className={styles.formSection}>
						<label htmlFor="city">City</label>
						<input
							id="city"
							name="city"
							type="text"
							value={formData.city}
							onChange={handleChange}
							list="city-options"
							style={{ paddingLeft: "10px" }}
							required
						/>
						<datalist id="city-options">
							{cities.map((c) => (
								<option
									key={`${c.name}-${c.latitude}-${c.longitude}`}
									value={c.name}
								/>
							))}
						</datalist>
					</div>
					<button type="submit" className={styles.button}>
						Create Account
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
};

export default Signup;
