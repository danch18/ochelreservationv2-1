-- Fix missed translation for 4 FORMAGGI (spelled correctly in this item)

UPDATE piccolo_menu_items SET
    title_en = '4 Cheeses (tomato or fresh cream base)',
    title_it = '4 Formaggi (base pomodoro o panna)',
    title_es = '4 Quesos (base tomate o nata)',
    description_en = 'Fior di latte mozzarella, Gorgonzola, Grana Padano, and goat cheese',
    description_it = 'Mozzarella fior di latte, Gorgonzola, Grana Padano e formaggio di capra',
    description_es = 'Mozzarella fior di latte, Gorgonzola, Grana Padano y queso de cabra'
WHERE title LIKE '4 FORMAGGI%';
