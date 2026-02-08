# Dev Journal (5–10 bullets)

## Development Issues & Solutions

- **Tailwind CSS v4 not applying styles**: Classes weren't working. Discovered v4 uses CSS-based config instead of JS file. Fixed by adding `@import "tailwindcss"` to CSS and removing old config file.

- **File upload validation too loose**: Users could upload wrong file types (e.g., JPG as 3D Model). Added strict file extension validation with clear error messages per category.

- **Modal cramped 3D viewer**: Initial design used modal which was too small for 3D manipulation. Restructured to use separate page route (`/asset/:id`) for better UX and shareability.

- **Video thumbnails were generic icons**: Initially used placeholder icons. Implemented Canvas API extraction of first video frame as thumbnail for professional appearance.

- **Blob URLs expire after refresh**: Uploaded assets disappeared on page reload. Documented limitation clearly - in production would use persistent storage (S3, etc.), but for assessment demo, blob URLs are intentional for simplicity.
