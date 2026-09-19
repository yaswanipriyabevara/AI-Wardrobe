# Testing

The backend uses Node's built-in test runner, so no additional test framework is required.

From `backend/`:

```powershell
npm.cmd test
```

Current automated coverage includes:

- maximum of three outfit recommendations;
- every recommendation contains a top, bottom and shoes;
- cold-weather layering when an appropriate outerwear item exists;
- occasion/formality filtering.

Manual demo checks are documented in `PLAN.md`: 375px mobile layout, empty wardrobe states, denied geolocation, backend unavailable mode and invalid image input.
