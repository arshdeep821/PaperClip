import numpy as np
import spacy
import src.model as model

embeddings_model = spacy.load("en_core_web_md")

def embed(text):
	return embeddings_model(text).vector

def prepare_input(category, description):
	text = category + ", " + description

	text_embedding = embed(text).reshape(1, -1)

	category_ohe = model.preprocessor.transform([[category]])

	features = np.hstack([text_embedding, category_ohe])

	return features

def get_recommendations(userPreferences):
	if len(userPreferences) == 0:
		return {
			"ids": [product["_id"] for product in model.products]
		}


	all_indices = []
	all_distances = []

	for pref in userPreferences:
		X = prepare_input(pref.category, pref.description)

		distances, indices = model.knn.kneighbors(X)
		all_indices.extend(indices[0])
		all_distances.extend(distances[0])

	combined = list(zip(all_indices, all_distances))
	combined.sort(key=lambda x: x[1])

	seen = set()
	unique_ids = []
	for idx, _ in combined:
		idx = int(idx)

		product_id = model.products[idx]["_id"]

		if product_id not in seen:
			seen.add(product_id)
			unique_ids.append(product_id)

	return {
		"ids": unique_ids
	}
