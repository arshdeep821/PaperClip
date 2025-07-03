import fetch from "node-fetch";

export const refreshModel = () => {
	fetch("http://recommender:8001/model/refresh", {
		method: "POST",
	  })
		.then(async (response) => {
			if (!response.ok) {
				const errorData = await response.json();
				console.error(
					"Model refresh failed:",
					errorData.detail || `Status ${response.status}`
				);
			} else {
				console.log("Model refreshed");
			}
		})
		.catch((error) => {
			console.error("Error refreshing model:", error);
		});
};
