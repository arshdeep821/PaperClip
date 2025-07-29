import numpy as np
import spacy
import src.model as model
from src.util import get_all_products

embeddings_model = spacy.load("en_core_web_md")

def embed(text):
	return embeddings_model(text).vector

def prepare_user_input(category, description):
	text = category + ", " + description

	text_embedding = embed(text).reshape(1, -1)

	category_ohe = model.preprocessor.transform([[category]])

	features = np.hstack([text_embedding, category_ohe])

	return features

def prepare_item_input(category, description, condition, name):
	text = category + ", " + condition + ", " + name + ", " + description

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
		X = prepare_user_input(pref.category, pref.description)

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

def refresh_model_addition(product):
	features_map = model.features_map
	products = get_all_products()

	id = getattr(product, "id", "")
	categ = getattr(product.category, "name", "") if product.category else ""
	desc = getattr(product, "description", "")
	cond = getattr(product, "condition", "")
	name = getattr(product, "name", "")

	new_feature = prepare_item_input(category=categ, description=desc, condition=cond, name=name)
	features_map[id] = new_feature.flatten()

	features = []
	for prod in products:
		features.append(features_map[prod["_id"]])

	model.refresh_model(features_map=features_map, features=features, products=products)


def refresh_model_update(product):
	features_map = model.features_map
	products = get_all_products()

	id = getattr(product, "id", "")
	categ = getattr(product.category, "name", "") if product.category else ""
	desc = getattr(product, "description", "")
	cond = getattr(product, "condition", "")
	name = getattr(product, "name", "")

	features_map.pop(id, None)

	new_feature = prepare_item_input(category=categ, description=desc, condition=cond, name=name)
	features_map[id] = new_feature.flatten()

	features = []
	for prod in products:
		features.append(features_map[prod["_id"]])

	model.refresh_model(features_map=features_map, features=features, products=products)

def refresh_model_removal(id):
	features_map = model.features_map
	products = get_all_products()

	features_map.pop(id, None)

	features = []
	for prod in products:
		features.append(features_map[prod["_id"]])

	model.refresh_model(features_map=features_map, features=features, products=products)
