# StyleSync AI — Hackathon Submission

## AI Wardrobe & Outfit Planner

StyleSync AI helps a user maintain a digital wardrobe and make practical outfit decisions using wardrobe metadata, occasion, weather and personal style.

### Included experience

- Login/onboarding with user profile details.
- 24 photo-backed demo garments.
- Garment upload with editable tag suggestions.
- Search, category filters, favorites and delete.
- Weather-aware planner using Open-Meteo.
- College, interview, party, wedding and gym occasions.
- Three owned-item outfit recommendations with explanations.
- Wardrobe gap analysis with shopping-search links.
- Rate My Outfit with practical feedback.
- Color and wear-history insights.
- Responsive mobile UI and graceful offline/demo behavior.
- Standard `.ics` **Save to Calendar** export.

### Backend engineering

- Express route/service separation.
- JWT authentication and scrypt password hashing.
- User-scoped wardrobe/profile/history/rating state.
- Input validation and allow-listed updates.
- Request rate limiting and configurable CORS.
- 8 MB JSON body cap for image workflows.
- Atomic versioned JSON demo storage.
- Optional Supabase/PostgreSQL persistence through the server-side REST API.
- Deterministic AI fallback for reliable demonstrations.
- Automated Node tests for recommendation rules.

### Quality and reliability

The application is intentionally backend-optional for the Vercel demo, while the backend is production-oriented for a separate Render/Railway deployment. This keeps the presentation resilient if an API service or model key is temporarily unavailable.

### Demo story

1. Login.
2. Show the seeded wardrobe.
3. Upload a garment and edit its detected tags.
4. Open Outfit Planner.
5. Select an occasion and load live weather.
6. Show three owned-item looks and explanations.
7. Show wardrobe gaps.
8. Rate an outfit.
9. Open Insights.
10. Export a look to the calendar.
