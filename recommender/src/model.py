import os
import numpy as np
import pandas as pd
import spacy
import pickle
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import OneHotEncoder
from src.util import get_all_products

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, '..', 'model.pkl')
products_path = os.path.join(BASE_DIR, '..', 'products.pkl')
preprocessor_path = os.path.join(BASE_DIR, '..', 'preprocessor.pkl')
features_path = os.path.join(BASE_DIR, '..', 'features.pkl')

embeddings_model = spacy.load("en_core_web_md")

knn = None
products = None
preprocessor = None
features_map = None

def load_model():
    global knn, products, preprocessor, features_map

    with open(model_path, "rb") as f:
        knn = pickle.load(f)
    with open(products_path, "rb") as f:
        products = pickle.load(f)
    with open(preprocessor_path, "rb") as f:
        preprocessor = pickle.load(f)
    with open(features_path, "rb") as f:
        features_map = pickle.load(f)

def embed(text):
	return embeddings_model(text).vector

def make_model_initial():
	products = get_all_products()

	categories = []
	id_embedding_map = {}
	id_list = []

	for product in products:
		id = product.get("_id", "")
		categ = product.get("category", {}).get("name", "")
		desc = product.get("description", "")
		cond = product.get("condition", "")
		name = product.get("name", "")

		full_text = categ + ", " + cond + ", " + name + ", " + desc
		embedded_text = embed(full_text)

		id_embedding_map[id] = embedded_text
		id_list.append(id)
		categories.append([categ])

	text_embeddings = np.vstack([id_embedding_map[id] for id in id_list])

	encoder = OneHotEncoder(sparse_output=False, handle_unknown="ignore")
	category_ohe = encoder.fit_transform(categories)

	features = np.hstack([text_embeddings, category_ohe])
	features_map = {id_list[i]: features[i] for i in range(len(id_list))}

	result_df = pd.DataFrame(features)

	n_neighbors = len(products)
	knn = NearestNeighbors(n_neighbors=n_neighbors, metric="cosine")
	knn.fit(result_df)

	with open(model_path, "wb") as f:
		pickle.dump(knn, f)

	with open(products_path, "wb") as f:
		pickle.dump(products, f)

	with open(preprocessor_path, "wb") as f:
		pickle.dump(encoder, f)

	with open(features_path, "wb") as f:
		pickle.dump(features_map, f)

	print("Successfully implemented KNN Model!")

def refresh_model(features_map, features, products):
	result_df = pd.DataFrame(features)

	n_neighbors = len(products)
	knn = NearestNeighbors(n_neighbors=n_neighbors, metric="cosine")
	knn.fit(result_df)

	with open(model_path, "wb") as f:
		pickle.dump(knn, f)

	with open(products_path, "wb") as f:
		pickle.dump(products, f)

	with open(features_path, "wb") as f:
		pickle.dump(features_map, f)
