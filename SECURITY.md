# StyleSync AI — Security Notes

## Implemented safeguards

- JWT authentication protects application API routes.
- Passwords are hashed with Node's built-in `scrypt` rather than stored in plaintext.
- JWTs use HMAC-SHA256 and have a 12-hour expiry.
- Request rate limiting is applied at the API layer.
- CORS is configurable with `FRONTEND_ORIGIN` instead of being hard-coded.
- `x-powered-by` is disabled.
- JSON body size is capped to reduce oversized payload abuse.
- Image payloads, coordinates, profile fields and garment tags are validated.
- Wardrobe updates use an allow-list, preventing arbitrary object-field injection.
- User data is scoped by the authenticated user id.
- JSON demo persistence uses atomic temp-file replacement to reduce corruption risk.
- Production persistence can be switched to Supabase/PostgreSQL using the server-side service key.

## Secrets

Never commit `.env`, API keys, JWT secrets or Supabase service-role keys. Use `.env.example` as the template.
