-- Fix Typos and Add Translations for Piccolo Menu

-- 1. Fix "Formulllle Midi" typo
UPDATE piccolo_categories
SET title = 'Formule Midi'
WHERE title = 'Formulllle Midi';

UPDATE piccolo_subcategories
SET title = 'Formule Midi - General'
WHERE title = 'Formulllle Midi - General';

-- 2. Update Categories Translations
UPDATE piccolo_categories SET
  title_en = 'Starters',
  title_it = 'Antipasti',
  title_es = 'Entrantes'
WHERE title = 'Antipasti';

UPDATE piccolo_categories SET
  title_en = 'Lunch Formula',
  title_it = 'Formula Pranzo',
  title_es = 'Fórmula Mediodía'
WHERE title = 'Formule Midi';

UPDATE piccolo_categories SET
  title_en = 'Pasta',
  title_it = 'Pasta',
  title_es = 'Pasta'
WHERE title = 'Pasta';

UPDATE piccolo_categories SET
  title_en = 'Main Courses',
  title_it = 'Secondi Piatti',
  title_es = 'Platos Principales'
WHERE title = 'Piatti';

UPDATE piccolo_categories SET
  title_en = 'Pinsa Romana',
  title_it = 'Pinsa Romana',
  title_es = 'Pinsa Romana'
WHERE title = 'Pinsa Romana';

UPDATE piccolo_categories SET
  title_en = 'Drinks',
  title_it = 'Bevande',
  title_es = 'Bebidas'
WHERE title = 'Bevande';

UPDATE piccolo_categories SET
  title_en = 'Desserts',
  title_it = 'Dolci',
  title_es = 'Postres'
WHERE title = 'Dolci';

UPDATE piccolo_categories SET
  title_en = 'Cocktails',
  title_it = 'Cocktail',
  title_es = 'Cócteles'
WHERE title = 'Cocktails';

-- 3. Update Subcategories Translations

-- General matches
UPDATE piccolo_subcategories SET
  title_en = 'Drinks',
  title_it = 'Bevande',
  title_es = 'Bebidas'
WHERE title = 'BOISSONS';

UPDATE piccolo_subcategories SET
  title_en = 'Starters',
  title_it = 'Antipasti',
  title_es = 'Entrantes'
WHERE title = 'ENTRÉES';

UPDATE piccolo_subcategories SET
  title_en = 'Main Courses',
  title_it = 'Secondi Piatti',
  title_es = 'Platos Principales'
WHERE title = 'PLATS';

UPDATE piccolo_subcategories SET
  title_en = 'Salads',
  title_it = 'Insalate',
  title_es = 'Ensaladas'
WHERE title = 'SALADES';

-- Beverages
UPDATE piccolo_subcategories SET
  title_en = 'Hot Drinks',
  title_it = 'Bevande Calde',
  title_es = 'Bebidas Calientes'
WHERE title = 'BEVANDE CALDE';

UPDATE piccolo_subcategories SET
  title_en = 'Cold Drinks',
  title_it = 'Bevande Fresche',
  title_es = 'Bebidas Frías'
WHERE title = 'BEVANDE FRESCHE';

UPDATE piccolo_subcategories SET
  title_en = 'Italian Lemonade 27.5cl',
  title_it = 'Limonata Italiana 27.5cl',
  title_es = 'Limonada Italiana 27.5cl'
WHERE title = 'LIMONADE ITALIENNE 27,5cl';

UPDATE piccolo_subcategories SET
  title_en = 'Italian Juice "YOGA" 100% Fruit 20cl',
  title_it = 'Succo Italiano "YOGA" 100% Frutta 20cl',
  title_es = 'Zumo Italiano "YOGA" 100% Fruta 20cl'
WHERE title = 'JUS ITALIEN « YOGA » 100% FRUITS 20cl';

UPDATE piccolo_subcategories SET
  title_en = 'Syrup 2.5cl',
  title_it = 'Sciroppo 2.5cl',
  title_es = 'Jarabe 2.5cl'
WHERE title = 'SIROP 2,5CL';

-- Food
UPDATE piccolo_subcategories SET
  title_en = 'Gratin',
  title_it = 'Gratinati',
  title_es = 'Gratinados'
WHERE title = 'GRATINATI';

UPDATE piccolo_subcategories SET
  title_en = 'Escalope',
  title_it = 'Scaloppine',
  title_es = 'Escalopes'
WHERE title = 'SCALOPPINA';

UPDATE piccolo_subcategories SET
  title_en = 'Fish',
  title_it = 'Pesce',
  title_es = 'Pescado'
WHERE title = 'PESCE';

UPDATE piccolo_subcategories SET
  title_en = 'Fillet',
  title_it = 'Filetto',
  title_es = 'Filete'
WHERE title = 'FILETTO';

UPDATE piccolo_subcategories SET
  title_en = 'Ravioli',
  title_it = 'Ravioli',
  title_es = 'Raviolis'
WHERE title = 'RAVIOLI';

-- Cocktails
UPDATE piccolo_subcategories SET
  title_en = 'Alcohol-free Cocktails',
  title_it = 'Cocktail Analcolici',
  title_es = 'Cócteles sin Alcohol'
WHERE title = 'COCKTAILS SANS ALCOOL';

-- Special handling for "Entrées à partager" (Starters to share)
UPDATE piccolo_subcategories SET
  title_en = 'Starters to Share',
  title_it = 'Antipasti da Condividere',
  title_es = 'Entrantes para Compartir'
WHERE title = 'ENTRÉES À PARTAGER';
