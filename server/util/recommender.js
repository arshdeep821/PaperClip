import fetch from "node-fetch";
import Item from "../models/Item.js";

const MODEL_API_URL = "http://recommender:8001";

const sendRefreshRequest = async (url, body) => {
	try {
		const response = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.error(
				`Model refresh failed (${url}):`,
				errorData.detail || `Status ${response.status}`
			);
		} else {
			console.log(`Model refreshed (${url})`);
		}
	} catch (error) {
		console.error(`Error refreshing model (${url}):`, error);
	}
};

export const refreshModelAddition = (product) => {
	sendRefreshRequest(`${MODEL_API_URL}/model/refresh/addition`, {
		product: {
			id: product._id.toString(),
			name: product.name,
			description: product.description,
			category: product.category.name,
			condition: product.condition,
		},
	});
};

export const refreshModelUpdate = (product) => {
	sendRefreshRequest(`${MODEL_API_URL}/model/refresh/update`, {
		product: {
			id: product._id.toString(),
			name: product.name,
			description: product.description,
			category: product.category.name,
			condition: product.condition,
		},
	});
};

export const refreshModelRemoval = (id) => {
	sendRefreshRequest(`${MODEL_API_URL}/model/refresh/removal`, { id });
};

export const getRecommendationsForUser = async (user) => {
	const { lat, lon, tradingRadius, inventory, userPreferences } = user;

	const recommendedIds = await getRecommendationsFromModel(userPreferences);

	const recommendedProducts = await Promise.all(
		recommendedIds.map(async (id) => {
			return await Item.findById(id).populate({
				path: "owner",
				select: "-password",
			});
		})
	);

	const locFilteredProducts = await removeProductsOutsideRadius(
		recommendedProducts,
		lat,
		lon,
		tradingRadius
	);

	const usersSelfFilteredProducts = removeUsersOwnItems(
		locFilteredProducts,
		inventory
	);

	return usersSelfFilteredProducts;
};

const getRecommendationsFromModel = async (userPrefs) => {
	const userPreferences = [];
	for (const pref of userPrefs) {
		userPreferences.push({
			category: pref.category.name,
			description: pref.description,
		});
	}

	const response = await fetch(`${MODEL_API_URL}/model/recommend`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ userPreferences }),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(
			`An error occurred while getting recomendations: ${errorData}`
		);
	}

	const data = await response.json();

	return data.ids;
};

const removeProductsOutsideRadius = async (
	products,
	lat,
	lon,
	tradingRadius
) => {
	const roughBox = roughDistanceBox(lat, lon, tradingRadius);
	const result = [];

	for (const product of products) {
		const owner = product.owner;
		if (!owner) {
			continue;
		}

		if (
			owner.lat < roughBox.minLat ||
			owner.lat > roughBox.maxLat ||
			owner.lon < roughBox.minLon ||
			owner.lon > roughBox.maxLon
		) {
			continue;
		}

		const dist = exactDistanceCheck(lat, lon, owner.lat, owner.lon);

		if (dist <= tradingRadius) {
			result.push(product);
		}
	}

	return result;
};

// Creates an overestimate box around the city and radius to check if 2 cities are roughly close together (cheap)
const roughDistanceBox = (lat, lon, radius) => {
	const deltaLat = radius / 111; // ~111km per degree of lat
	const deltaLon = radius / (111 * Math.cos((lat * Math.PI) / 180));

	return {
		minLat: lat - deltaLat,
		maxLat: lat + deltaLat,
		minLon: lon - deltaLon,
		maxLon: lon + deltaLon,
	};
};

// Checks the exact distance between 2 cities (expensive) (based on the haversine formula)
const exactDistanceCheck = (lat1, lon1, lat2, lon2) => {
	const earthRadius = 6371; // in km

	const toRad = (deg) => {
		return (deg * Math.PI) / 180;
	};

	const latDiff = toRad(lat2 - lat1);
	const lonDiff = toRad(lon2 - lon1);

	const a =
		Math.sin(latDiff / 2) ** 2 +
		Math.cos(toRad(lat1)) *
			Math.cos(toRad(lat2)) *
			Math.sin(lonDiff / 2) ** 2;

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return earthRadius * c;
};

const removeUsersOwnItems = (products, inventory) => {
	const inventorySet = new Set(inventory.map((id) => id.toString()));

	const filteredProducts = products.filter(
		(product) => !inventorySet.has(product._id.toString())
	);

	return filteredProducts;
};
