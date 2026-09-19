# StyleSync Demo Fashion Image Dataset

This submission includes 24 local garment images so the hackathon demo opens with a realistic, populated digital wardrobe instead of broken remote image URLs.

## Included categories
- Shirts and T-shirts
- Polo and knit tops
- Trousers, jeans, chinos and joggers
- Jackets, blazer, trench coat and hoodie
- Sneakers, running shoes, loafers and boots
- Dresses

## Files
All images are stored in `frontend/public/dataset/` and are referenced locally by the React app using paths such as `/dataset/white-cotton-shirt.jpg`.

## Dataset references for future AI/model experiments
The app's data model is compatible with the metadata style used by Fashion Product Images (Small), which contains product images plus gender, master category, subcategory, article type, color, season and usage fields. See the Kaggle dataset and its Hugging Face mirror in the project README.

The bundled 24 images are **demo catalog illustrations generated for this submission**, not a redistribution of the 44k-image Kaggle dataset. They are included so the application is self-contained and reliable for judging/deployment.
