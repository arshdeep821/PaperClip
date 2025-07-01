import requests

BACKEND_API_URL = "http://host.docker.internal:3001"

def get_all_products():
	try:
		response = requests.get(f"{BACKEND_API_URL}/items")
		response.raise_for_status()
		products = response.json()
		return products
	except requests.RequestException as e:
		print(f"Error getting products: {e}")
		return []
