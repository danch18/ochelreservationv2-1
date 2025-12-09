# Multi-Restaurant Setup Documentation

This document explains how the website is structured to support multiple restaurant locations (Magnifiko and Piccolo) with the same design but different content.

## Overview

The website now supports two restaurant locations:
- **Magnifiko** - Main restaurant in Ivry-sur-Seine (root domain)
- **Piccolo** - Second location in Paris (under `/piccolo` path)

## URL Structure

```
magnifiko.fr/                    → Magnifiko Homepage
magnifiko.fr/menu                → Magnifiko Menu
magnifiko.fr/Certifications-halal→ Magnifiko Certifications

magnifiko.fr/piccolo             → Piccolo PDF Menu (CURRENT - Live)
magnifiko.fr/piccolo-next        → Piccolo Homepage (DEVELOPMENT - New full site)
magnifiko.fr/piccolo-next/menu   → Piccolo Menu (DEVELOPMENT)
magnifiko.fr/piccolo-next/certifications → Piccolo Certifications (DEVELOPMENT)
```

**Note:** The `/piccolo-next` routes contain the new full restaurant site. Once content and images are ready, we can switch `/piccolo` to use the full site instead of the PDF.

## File Structure

### Application Routes

```
src/app/
├── page.tsx                           # Magnifiko Homepage
├── (public)/
│   ├── menu/page.tsx                  # Magnifiko Menu
│   └── Certifications-halal/page.tsx  # Magnifiko Certifications
├── piccolo/
│   ├── page.tsx                       # Piccolo PDF Menu (CURRENT - Live)
│   └── page-old-pdf.tsx.backup        # Backup of PDF page
└── piccolo-next/                      # DEVELOPMENT - New full Piccolo site
    ├── page.tsx                       # Piccolo Homepage (Development)
    └── (pages)/
        ├── menu/page.tsx              # Piccolo Menu (Development)
        └── certifications/page.tsx    # Piccolo Certifications (Development)
```

### Configuration Files

**Restaurant Configuration:**
```
src/config/restaurants.ts
```
Contains all restaurant-specific settings:
- Contact information (address, phone, email)
- Hours of operation
- Logo and branding
- Social media links
- SEO metadata
- Feature flags (reservation, delivery, certifications)

**Content Files:**
```
src/data/
├── content-magnifiko.json    # Magnifiko static content
├── content-piccolo.json      # Piccolo static content
└── content.json              # Symlink → content-magnifiko.json (backwards compatibility)
```

### Context Providers

**Restaurant Context:**
```
src/contexts/RestaurantContext.tsx
```
Provides restaurant configuration throughout the app:
- Automatically detects current restaurant from URL path
- Provides `useRestaurant()` hook for accessing restaurant config
- Provides `useRestaurantContent()` hook for content file path

### Image Assets

```
public/
├── images/
│   ├── [Magnifiko images]           # Magnifiko-specific images
│   └── piccolo/                     # Piccolo-specific images
│       ├── menu/
│       │   ├── menu-item/          # Menu item photos
│       │   └── add-ons/            # Add-on photos
│       ├── testimonial/            # Customer testimonials
│       └── README.md               # Image requirements guide
└── icons/
    ├── MagnifikoLogo.png           # Magnifiko logo
    └── piccolo/
        └── PiccoloLogo.png         # Piccolo logo (TODO: Add)
```

## How It Works

### 1. Route-Based Restaurant Detection

The system automatically determines which restaurant to display based on the URL path:

```typescript
// In src/config/restaurants.ts
export function getRestaurantIdFromPath(pathname: string): RestaurantId {
  if (pathname.startsWith('/piccolo')) {
    return 'piccolo';
  }
  return 'magnifiko'; // Default
}
```

### 2. Restaurant-Specific Pages

Each restaurant's pages pass a `restaurantId` prop to shared components:

**Magnifiko Homepage (src/app/page.tsx):**
```tsx
<HomePage /> // Defaults to 'magnifiko'
```

**Piccolo Homepage (src/app/piccolo/page.tsx):**
```tsx
<HomePage restaurantId="piccolo" />
```

### 3. Shared Components with Restaurant Awareness

Components that need restaurant-specific data receive a `restaurantId` prop:

```tsx
// Example: HomePage component
interface HomePageProps {
  restaurantId?: RestaurantId;
}

export default function HomePage({ restaurantId = 'magnifiko' }: HomePageProps) {
  const config = getRestaurantConfig(restaurantId);
  const content = require(`@/data/content-${restaurantId}.json`);

  // Use config and content...
}
```

### 4. Database Menu Items

For menu items stored in the database, you'll need to:

1. Add a `restaurant_id` column to database tables:
   ```sql
   ALTER TABLE categories ADD COLUMN restaurant_id TEXT DEFAULT 'magnifiko' NOT NULL;
   ALTER TABLE subcategories ADD COLUMN restaurant_id TEXT DEFAULT 'magnifiko' NOT NULL;
   ALTER TABLE menu_items ADD COLUMN restaurant_id TEXT DEFAULT 'magnifiko' NOT NULL;
   ALTER TABLE addons ADD COLUMN restaurant_id TEXT DEFAULT 'magnifiko' NOT NULL;
   ```

2. Filter queries by restaurant:
   ```typescript
   // In MenuDisplay component
   const { data } = await supabase
     .from('menu_items')
     .select('*')
     .eq('restaurant_id', restaurantId);
   ```

## Adding Content for Piccolo

### 1. Update Restaurant Configuration

Edit `src/config/restaurants.ts` to update Piccolo's information:
- Phone number
- Email address
- Social media links
- Any other restaurant-specific settings

### 2. Add Images

Upload Piccolo-specific images to `public/images/piccolo/`:
- Homepage images (hero, interior, menu cards, etc.)
- Menu item photos
- Testimonial photos

See `public/images/piccolo/README.md` for complete list of required images.

### 3. Update Content File

Edit `src/data/content-piccolo.json` to customize:
- Hero section text
- About/experience section
- Menu descriptions
- Hours and location text
- Testimonials

### 4. Add Menu Items to Database

When adding menu items via admin panel:
1. Select "Piccolo" restaurant (when restaurant selector is added)
2. Add categories, subcategories, and menu items
3. They will automatically be filtered by `restaurant_id`

### 5. Add Piccolo Logo

Upload Piccolo's logo to:
```
public/icons/piccolo/PiccoloLogo.png
```

Then update the logo path in `src/config/restaurants.ts`:
```typescript
logo: {
  src: '/icons/piccolo/PiccoloLogo.png',
  // ...
}
```

## Shared Components

These components are used by both restaurants (no duplication needed):
- All UI components (`src/components/ui/`)
- Layout components (Navigation, Footer, etc.)
- Reservation system
- Language system (LanguageContext, translations)
- Admin system

## Navigation Links

The navigation automatically shows restaurant-specific links:

**Magnifiko Navigation:**
- Menu → `/menu`
- Certifications → `/Certifications-halal`
- Piccolo → `/piccolo`

**Piccolo Navigation:**
- Menu → `/piccolo/menu`
- Certifications → `/piccolo/certifications`
- Magnifiko → `/` (link back to main restaurant)

## Future: Preloader Screen

When ready to add a preloader screen to choose between restaurants:

1. Create `src/app/restaurant-selector/page.tsx`
2. Add two buttons:
   - "Visit Magnifiko" → navigates to `/`
   - "Visit Piccolo" → navigates to `/piccolo`
3. Store user's choice in localStorage
4. Optionally redirect automatically on future visits

## Database Migration (When Ready)

To separate menu items by restaurant:

1. **Backup existing data:**
   ```bash
   # Export current menu items
   ```

2. **Run migration:**
   ```sql
   -- Add restaurant_id columns with default value
   ALTER TABLE categories ADD COLUMN restaurant_id TEXT DEFAULT 'magnifiko' NOT NULL;
   ALTER TABLE subcategories ADD COLUMN restaurant_id TEXT DEFAULT 'magnifiko' NOT NULL;
   ALTER TABLE menu_items ADD COLUMN restaurant_id TEXT DEFAULT 'magnifiko' NOT NULL;
   ALTER TABLE addons ADD COLUMN restaurant_id TEXT DEFAULT 'magnifiko' NOT NULL;
   ```

3. **Update service files:**
   - Modify `src/services/menuService.ts` to filter by `restaurant_id`
   - Add restaurant selector to admin interface

4. **Add Piccolo menu items:**
   - Use admin panel to add new menu items
   - Set `restaurant_id` to 'piccolo'

## Important Notes

### Current State
- ✅ File structure is organized and ready
- ✅ Configuration system is in place
- ✅ Piccolo pages are created (home, menu, certifications)
- ✅ Content files are separated
- ✅ Image directories are created
- ⚠️ Piccolo content uses placeholder text (needs customization)
- ⚠️ Piccolo images are not yet uploaded
- ⚠️ Database still shared (no `restaurant_id` column yet)
- ⚠️ Components need to be updated to use `restaurantId` prop

### Safe for Production
Yes! The current implementation is safe because:
- Magnifiko routes are unchanged (/, /menu, /Certifications-halal)
- Magnifiko uses existing content and images
- Piccolo is isolated under `/piccolo` path
- No database changes yet (backward compatible)

### Next Steps
1. Upload Piccolo-specific images
2. Customize Piccolo content in `content-piccolo.json`
3. Update shared components to accept and use `restaurantId` prop
4. Test Piccolo pages thoroughly
5. When ready: Add database migration for menu separation

## Troubleshooting

**Issue: Piccolo pages show broken images**
- Solution: Upload images to `public/images/piccolo/` or temporarily copy from Magnifiko's folder

**Issue: Piccolo shows Magnifiko's menu items**
- Expected: Database doesn't have `restaurant_id` filter yet
- Solution: Run database migration when ready

**Issue: Navigation shows wrong logo**
- Check: Restaurant config in `src/config/restaurants.ts`
- Verify: Logo file exists at specified path

**Issue: Content doesn't update**
- Check: Correct content file is being loaded (`content-piccolo.json` vs `content-magnifiko.json`)
- Verify: Component is receiving correct `restaurantId` prop

## Switching from /piccolo-next to /piccolo

When you're ready to make the new full Piccolo site live at `/piccolo`:

1. **Backup the current PDF page** (already done - it's saved as `page-old-pdf.tsx.backup`)

2. **Update the pages:**
   ```bash
   # Delete current PDF page
   rm src/app/piccolo/page.tsx

   # Move piccolo-next pages to piccolo
   mv src/app/piccolo-next/page.tsx src/app/piccolo/page.tsx
   mv src/app/piccolo-next/(pages) src/app/piccolo/

   # Remove piccolo-next directory
   rm -rf src/app/piccolo-next
   ```

3. **Update restaurant IDs in the moved files:**
   - Change `restaurantId="piccolo-next"` to `restaurantId="piccolo"`
   - Update function names from `PiccoloNext*` to `Piccolo*`

4. **Update configuration:**
   - Remove `'piccolo-next'` from RestaurantId type in `src/config/restaurants.ts`
   - Remove the `piccolo-next` configuration object
   - Update `getRestaurantIdFromPath` to remove piccolo-next handling

5. **Test thoroughly:**
   - Visit `/piccolo` - should show the new full homepage
   - Visit `/piccolo/menu` - should show the menu page
   - Visit `/piccolo/certifications` - should show certifications

6. **Commit and deploy**

## Support

For questions or issues with the multi-restaurant setup, check:
1. This documentation file
2. Restaurant configuration: `src/config/restaurants.ts`
3. Content files: `src/data/content-*.json`
4. Restaurant context: `src/contexts/RestaurantContext.tsx`
