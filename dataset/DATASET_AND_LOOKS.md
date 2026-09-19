# StyleSync AI — Dataset and Look Assets

## Included in this submission

The `frontend/public/dataset/` folder contains a lightweight demo subset of garment assets used by the live UI and eight bundled visual look boards. The app is therefore self-contained for the hackathon demo and does not depend on third-party image hosting.

### Garment attributes
Each demo garment is represented with:
- name
- category: Topwear, Bottomwear, Outerwear, Footwear, Dress, Accessory
- color
- pattern
- formality
- season
- warmth level
- material
- suitable-for group
- local image path

### Visual look boards
`frontend/public/dataset/looks/` contains curated combinations for:
- Campus Casual
- Campus Smart
- Interview Ready
- Weekend Street
- Party Evening
- Layered Winter
- Active Day
- Smart Polo

The look boards are assembled from the local garment assets so the planner can show complete visual combinations rather than text-only recommendations.

## External datasets referenced by the project brief
For model development or a larger training/evaluation run, use the official dataset pages and comply with their licenses/terms:

- Fashion Product Images (Small): https://www.kaggle.com/datasets/paramaggarwal/fashion-product-images-small
- Polyvore Outfits / outfit compatibility data: https://github.com/xthan/polyvore
- DeepFashion / DeepFashion2: https://mmlab.ie.cuhk.edu.hk/projects/DeepFashion.html

The full external datasets are intentionally not bundled into this submission because they are large and have their own distribution/licensing terms.
