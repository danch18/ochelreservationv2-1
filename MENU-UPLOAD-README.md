# Menu Data Upload Guide

This guide explains how to easily upload menu items to your Supabase database using the JSON-based upload system.

## Files

- `menu-data.json` - JSON file containing all menu data (categories, subcategories, menu items, and addons)
- `upload-menu-data.ts` - TypeScript script that uploads the data to Supabase
- `npm run upload-menu` - Command to run the upload script

## Setup

1. Make sure you have the required environment variables in your `.env.local` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. Install `tsx` if you haven't already:
   ```bash
   npm install -D tsx
   ```

## JSON Structure

The `menu-data.json` file has four main sections:

### 1. Categories
```json
{
  "title": "Entrées",
  "text": "Commencez votre repas avec nos délicieuses entrées",
  "status": "active"
}
```

### 2. Subcategories
```json
{
  "category_title": "Entrées",  // Must match a category title
  "title": "Salades",
  "text": "Fraîches et savoureuses",
  "status": "active"
}
```

### 3. Menu Items
```json
{
  "subcategory_title": "Salades",  // Must match a subcategory title
  "title": "Salade César",
  "text": "Classique",
  "description": "Laitue romaine, croûtons, parmesan, sauce César maison",
  "price": 12.50,
  "is_special": false,
  "status": "active",
  "image_path": null,
  "model_3d_url": null,
  "redirect_3d_url": null,
  "additional_image_url": null
}
```

### 4. Addons
```json
{
  "category_title": "Plats Principaux",  // Optional
  "subcategory_title": null,  // Optional
  "title": "Frites Maison",
  "description": "Portion de frites fraîches",
  "price": 4.50,
  "status": "active",
  "image_path": null
}
```

## How to Use

### Method 1: Edit the JSON file directly

1. Open `menu-data.json`
2. Add, edit, or remove items following the structure above
3. Save the file
4. Run the upload command:
   ```bash
   npm run upload-menu
   ```

### Method 2: Replace the entire file

1. Create a new JSON file with your menu data
2. Replace `menu-data.json` with your file
3. Run the upload command:
   ```bash
   npm run upload-menu
   ```

## Upload Process

The script will:
1. ✅ Upload all categories first
2. ✅ Upload subcategories (linked to categories)
3. ✅ Upload menu items (linked to subcategories)
4. ✅ Upload addons (linked to categories or subcategories)

You'll see progress messages like:
```
🚀 Starting menu data upload...

📁 Uploading categories...
✅ Category "Entrées" uploaded (ID: 1)
✅ Category "Plats Principaux" uploaded (ID: 2)

✨ 2 categories uploaded

📂 Uploading subcategories...
✅ Subcategory "Salades" uploaded (ID: 1)

✨ 1 subcategories uploaded

🍽️  Uploading menu items...
✅ Menu item "Salade César" uploaded (ID: 1)

✨ 1 menu items uploaded

🎉 Menu data upload completed successfully!
```

## Important Notes

1. **Relationships**: The script uses titles to match relationships:
   - Subcategories must reference existing category titles
   - Menu items must reference existing subcategory titles
   - Addons can reference category or subcategory titles

2. **Duplicate Data**: Each time you run the script, it will create new entries. If you want to update existing data, use the admin panel instead.

3. **Image Paths**: Set `image_path`, `model_3d_url`, etc. to `null` if you don't have images yet. You can add them later through the admin panel.

4. **Prices**: Enter prices as numbers (e.g., `12.50`, not `"12.50"`)

5. **Status**: Use `"active"` or `"inactive"` for the status field

## Example Workflow

Let's say you want to add a new dessert:

1. Add a new item to the `menu_items` array in `menu-data.json`:
```json
{
  "subcategory_title": "Pâtisseries",
  "title": "Tiramisu",
  "text": "Italien",
  "description": "Mascarpone, café, cacao",
  "price": 8.00,
  "is_special": false,
  "status": "active",
  "image_path": null,
  "model_3d_url": null,
  "redirect_3d_url": null,
  "additional_image_url": null
}
```

2. Run: `npm run upload-menu`

3. Done! Your new dessert is now in the database.

## Troubleshooting

- **Error: Category not found**: Make sure the `category_title` in subcategories matches exactly (case-sensitive)
- **Error: Subcategory not found**: Make sure the `subcategory_title` in menu items matches exactly
- **Error: Missing environment variables**: Check your `.env.local` file
- **Error: Permission denied**: Make sure you're using the `SUPABASE_SERVICE_ROLE_KEY` (not the anon key)
