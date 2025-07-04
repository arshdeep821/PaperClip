import os
import pickle
import numpy as np
import spacy
import pandas as pd
import src.model as model

embeddings_model = spacy.load("en_core_web_md")

def embed(text):
	return embeddings_model(text).vector

def prepare_input(category, description):
	df = pd.DataFrame({
		"categories": [category]
	})

	cat_feats = model.preprocessor.transform(df)
	cat_feats_weighted = cat_feats * 5  # same weighting as training

	desc_embedding = embed(description).reshape(1, -1)

	combined_features = np.hstack([cat_feats_weighted, desc_embedding])

	return combined_features

def get_recommendations(categories, descriptions):
	all_indices = []
	all_distances = []

	for category, description in zip(categories, descriptions):
		X = prepare_input(category, description)

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
