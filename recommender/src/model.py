import os
import numpy as np
import pandas as pd
import spacy
import pickle
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.neighbors import NearestNeighbors
from src.util import get_all_products

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, '..', 'model.pkl')
preprocessor_path = os.path.join(BASE_DIR, '..', 'preprocessor.pkl')
products_path = os.path.join(BASE_DIR, '..', 'products.pkl')

embeddings_model = spacy.load("en_core_web_md")

def make_model_initial():
	products = get_all_products()

	categories, descriptions = [], []

	for product in products:
		categories.append(product.get("category", {}).get("name", ""))

		desc = product.get("description", "")
		cond = product.get("condition", "")
		name = product.get("name", "")
		descriptions.append(desc + ", " + cond + ", " + name)

	df = pd.DataFrame({
		"categories": categories,
		"descriptions": descriptions,
	})

	preprocessor = ColumnTransformer(
		transformers=[
			('categories', OneHotEncoder(), ['categories']),
		],
		sparse_threshold=0
	)

	cat_feats = preprocessor.fit_transform(df)
	cat_feats_weighted = cat_feats * 5

	def embed(text):
		return embeddings_model(text).vector

	desc_embeddings = np.vstack([embed(desc) for desc in df['descriptions']])
	combined_features = np.hstack([cat_feats_weighted, desc_embeddings])
	result_df = pd.DataFrame(combined_features)

	n_neighbors = len(products)
	knn = NearestNeighbors(n_neighbors=n_neighbors, metric="cosine")
	knn.fit(result_df)

	with open(model_path, "wb") as f:
		pickle.dump(knn, f)

	with open(preprocessor_path, "wb") as f:
		pickle.dump(preprocessor, f)

	with open(products_path, "wb") as f:
		pickle.dump(products, f)

	print("Successfully implemented KNN Model!")
