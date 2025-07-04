import os
import numpy as np
import pandas as pd
import spacy
import pickle
from sklearn.neighbors import NearestNeighbors
from src.util import get_all_products

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, '..', 'model.pkl')
products_path = os.path.join(BASE_DIR, '..', 'products.pkl')

embeddings_model = spacy.load("en_core_web_md")

knn = None
products = None

def load_model():
    global knn, products
    with open(model_path, "rb") as f:
        knn = pickle.load(f)
    with open(products_path, "rb") as f:
        products = pickle.load(f)

def make_model_initial():
	products = get_all_products()

	texts = []

	for product in products:
		categ = product.get("category", {}).get("name", "")
		desc = product.get("description", "")
		cond = product.get("condition", "")
		name = product.get("name", "")

		texts.append(categ + ", " + cond + ", " + name + ", " + desc)

	def embed(text):
		return embeddings_model(text).vector

	text_embeddings = np.vstack([embed(text) for text in texts])
	features = np.hstack([text_embeddings])
	result_df = pd.DataFrame(features)

	n_neighbors = len(products)
	knn = NearestNeighbors(n_neighbors=n_neighbors, metric="cosine")
	knn.fit(result_df)

	with open(model_path, "wb") as f:
		pickle.dump(knn, f)

	with open(products_path, "wb") as f:
		pickle.dump(products, f)

	print("Successfully implemented KNN Model!")
