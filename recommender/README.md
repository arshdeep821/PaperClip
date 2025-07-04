# Reccomendation Model

### What is this?

This is an API for a KNN-based machine learning reccomendation model.

### Endpoints

POST http://localhost:8001/recommend:

-   Inputs: Expects 'categories' and 'descriptions' in the request body, both lists of strings. Each category should match/relate to the description at the same index. Formatted this way to allow users to have multiple areas of interest. For example a user in their profile should be able to set their preferences to the Technology Category where they want new iphones and used macbook pros, but seperately they should also be able to set that they want Clothes, specfically vintage leather jackets.

-   Outputs: Will output 1 list in the response, 'ids', which represents the object IDs of the products to reccomend to the user, in order of what matches the input to the request (their preferences). The output is sorted from best reccomendation to worst, and currently outputs for all existing products.
