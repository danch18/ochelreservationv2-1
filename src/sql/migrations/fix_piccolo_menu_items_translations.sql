-- Fix Piccolo Menu Items and Addons Translations

-- ==========================================
-- MENU ITEMS
-- ==========================================

-- PASTA
UPDATE piccolo_menu_items SET
    title_en = 'Penne Arrabbiata',
    title_it = 'Penne all’Arrabbiata',
    title_es = 'Penne all’Arrabbiata',
    description_en = 'Tomato sauce, cherry tomatoes, garlic, extra virgin olive oil, chili pepper, and parsley',
    description_it = 'Sugo di pomodoro, pomodorini, aglio, olio extravergine di oliva, peperoncino e prezzemolo',
    description_es = 'Salsa de tomate, tomates cherry, ajo, aceite de oliva virgen extra, guindilla y perejil'
WHERE title = 'Penne all’ Arrabbiata' OR title = 'Penne all’ arrabbiata';

UPDATE piccolo_menu_items SET
    title_en = 'Penne 4 Cheeses',
    title_it = 'Penne ai 4 Formaggi',
    title_es = 'Penne 4 Quesos',
    description_en = 'Gorgonzola, Asiago, Grana Padano, goat cheese, and fresh cream',
    description_it = 'Gorgonzola, Asiago, Grana Padano, formaggio di capra e panna fresca',
    description_es = 'Gorgonzola, Asiago, Grana Padano, queso de cabra y nata fresca'
WHERE title = 'Penne ai 4 Formaggi' OR title = 'Penne ai 4 formaggi';

UPDATE piccolo_menu_items SET
    title_en = 'Tagliatelle Bolognese',
    title_it = 'Tagliatelle alla Bolognese',
    title_es = 'Tagliatelle a la Boloñesa',
    description_en = 'Tagliatelle with Bolognese sauce',
    description_it = 'Tagliatelle al ragù alla bolognese',
    description_es = 'Tagliatelle con salsa boloñesa'
WHERE title = 'Tagliatelle alla Bolognese' OR title = 'Tagliatelle alla bolognese';

UPDATE piccolo_menu_items SET
    title_en = 'Tagliatelle Carbonara',
    title_it = 'Tagliatelle alla Carbonara',
    title_es = 'Tagliatelle a la Carbonara',
    description_en = 'Tagliatelle, extra virgin olive oil, smoked chicken lardons, pasteurized egg yolk, Grana Padano, and black pepper',
    description_it = 'Tagliatelle, olio extravergine di oliva, pancetta di pollo affumicata, tuorlo d’uovo pastorizzato, Grana Padano e pepe nero',
    description_es = 'Tagliatelle, aceite de oliva virgen extra, lardons de pollo ahumado, yema de huevo pasteurizada, Grana Padano y pimienta negra'
WHERE title = 'Tagliatelle alla carbonara';

UPDATE piccolo_menu_items SET
    title_en = 'Tagliatelle Magnifiko',
    title_it = 'Tagliatelle Magnifiko',
    title_es = 'Tagliatelle Magnifiko',
    description_en = 'Tagliatelle, pink sauce, chicken, button mushrooms, and Grana Padano',
    description_it = 'Tagliatelle, salsa rosa, pollo, funghi champignon e Grana Padano',
    description_es = 'Tagliatelle, salsa rosa, pollo, champiñones y Grana Padano'
WHERE title = 'Tagliatelle MAGNIFIKO';

UPDATE piccolo_menu_items SET
    title_en = 'Tagliatelle Pesto & Burrata',
    title_it = 'Tagliatelle Pesto e Burrata',
    title_es = 'Tagliatelle Pesto y Burrata',
    description_en = 'Pasta, 125g burrata, and basil pesto',
    description_it = 'Pasta, burrata da 125g e pesto di basilico',
    description_es = 'Pasta, burrata de 125g y pesto de albahaca'
WHERE title = 'Tagliatelle pesto e burrata';

UPDATE piccolo_menu_items SET
    title_en = 'Penne Truffle & Chicken',
    title_it = 'Penne Tartufo e Pollo',
    title_es = 'Penne Trufa y Pollo',
    description_en = 'Summer black truffle cream, fresh cream, mushrooms, chicken, and Grana Padano',
    description_it = 'Crema di tartufo nero estivo, panna fresca, funghi, pollo e Grana Padano',
    description_es = 'Crema de trufa negra de verano, nata fresca, champiñones, pollo y Grana Padano'
WHERE title = 'Penne al tartufo e pollo';

UPDATE piccolo_menu_items SET
    title_en = 'Penne Scampi',
    title_it = 'Penne agli Scampi',
    title_es = 'Penne Scampi',
    description_en = 'Shrimp, basil pesto sauce, and fresh cream',
    description_it = 'Gamberi, salsa al pesto di basilico e panna fresca',
    description_es = 'Gambas, salsa de pesto de albahaca y nata fresca'
WHERE title = 'Penne scampi';

UPDATE piccolo_menu_items SET
    title_en = 'Lasagna',
    title_it = 'Lasagna',
    title_es = 'Lasaña',
    description_en = 'Lasagna with Bolognese and béchamel sauce, Grana Padano, mozzarella, oven-baked',
    description_it = 'Lasagna con ragù alla bolognese e besciamella, Grana Padano, mozzarella, gratinata al forno',
    description_es = 'Lasaña con salsa boloñesa y bechamel, Grana Padano, mozzarella, gratinada al horno'
WHERE title = 'Lasagna';

UPDATE piccolo_menu_items SET
    title_en = 'Ravioli Bolognese',
    title_it = 'Ravioli alla Bolognese',
    title_es = 'Raviolis a la Boloñesa',
    description_en = 'Fresh pasta stuffed with ricotta and spinach, Bolognese sauce, and Grana Padano',
    description_it = 'Pasta fresca ripiena di ricotta e spinaci, ragù alla bolognese e Grana Padano',
    description_es = 'Pasta fresca rellena de ricotta y espinacas, salsa boloñesa y Grana Padano'
WHERE title = 'Ravioli alla bolognese';

UPDATE piccolo_menu_items SET
    title_en = 'Truffle Ravioli',
    title_it = 'Ravioli al Tartufo',
    title_es = 'Raviolis de Trufa',
    description_en = 'Fresh pasta stuffed with ricotta and spinach, fresh cream sauce, summer black truffle cream, summer black truffle carpaccio, and Grana Padano',
    description_it = 'Pasta fresca ripiena di ricotta e spinaci, salsa alla panna, crema di tartufo nero estivo, carpaccio di tartufo nero estivo e Grana Padano',
    description_es = 'Pasta fresca rellena de ricotta y espinacas, salsa de nata, crema de trufa negra de verano, carpaccio de trufa negra de verano y Grana Padano'
WHERE title = 'Ravioli al tartufo';


-- MEAT (SCALOPPINA / FILETTO / POLLO)
UPDATE piccolo_menu_items SET
    title_en = 'Lemon Scaloppina',
    title_it = 'Scaloppina al Limone',
    title_es = 'Escalope al Limón',
    description_en = 'Chicken escalope, fresh cream, lemon sauce. Served with penne in lemon sauce',
    description_it = 'Scaloppina di pollo, panna fresca, salsa al limone. Servita con penne al limone',
    description_es = 'Escalope de pollo, nata fresca, salsa de limón. Servido con penne en salsa de limón'
WHERE title = 'Scaloppina al limone';

UPDATE piccolo_menu_items SET
    title_en = 'Normande Scaloppina',
    title_it = 'Scaloppina alla Normanna',
    title_es = 'Escalope Normanda',
    description_en = 'Chicken escalope, fresh cream, and mushrooms. Served with penne in Normande sauce',
    description_it = 'Scaloppina di pollo, panna fresca e funghi. Servita con penne alla normanna',
    description_es = 'Escalope de pollo, nata fresca y champiñones. Servido con penne en salsa normanda'
WHERE title = 'Scaloppina “Normande”';

UPDATE piccolo_menu_items SET
    title_en = 'Chicken Supreme',
    title_it = 'Suprema di Pollo',
    title_es = 'Suprema de Pollo',
    description_en = 'Grilled chicken escalope. Served with penne in tomato sauce',
    description_it = 'Scaloppina di pollo grigliata. Servita con penne al pomodoro',
    description_es = 'Escalope de pollo a la parrilla. Servido con penne en salsa de tomate'
WHERE title = 'Suprema di pollo';

UPDATE piccolo_menu_items SET
    title_en = 'Goat Cheese & Honey Scaloppina',
    title_it = 'Scaloppina Capra e Miele',
    title_es = 'Escalope Queso de Cabra y Miel',
    description_en = 'Chicken escalope, goat cheese, honey, mozzarella, oven-baked. Served with creamy penne',
    description_it = 'Scaloppina di pollo, formaggio di capra, miele, mozzarella, gratinata al forno. Servita con penne alla panna',
    description_es = 'Escalope de pollo, queso de cabra, miel, mozzarella, gratinado al horno. Servido con penne a la crema'
WHERE title = 'Scaloppina “Chèvre Miel”';

UPDATE piccolo_menu_items SET
    title_en = 'Parmigiana',
    title_it = 'Parmigiana',
    title_es = 'Parmesana',
    description_en = 'Chicken escalope, grilled eggplants, tomato sauce, mozzarella, and Grana Padano, oven-baked. Served with penne in tomato sauce',
    description_it = 'Scaloppina di pollo, melanzane grigliate, salsa di pomodoro, mozzarella e Grana Padano, gratinata al forno. Servita con penne al pomodoro',
    description_es = 'Escalope de pollo, berenjenas asadas, salsa de tomate, mozzarella y Grana Padano, gratinado al horno. Servido con penne en salsa de tomate'
WHERE title = 'Parmigiana';

UPDATE piccolo_menu_items SET
    title_en = 'Chicken Béchamel',
    title_it = 'Pollo alla Besciamella',
    title_es = 'Pollo con Bechamel',
    description_en = 'Chicken escalope coated with béchamel and Grana Padano, oven-baked. Served with penne in summer black truffle cream',
    description_it = 'Scaloppina di pollo ricoperta di besciamella e Grana Padano, gratinata al forno. Servita con penne alla crema di tartufo nero estivo',
    description_es = 'Escalope de pollo cubierta con bechamel y Grana Padano, gratinado al horno. Servido con penne en crema de trufa negra de verano'
WHERE title = 'Pollo Besciamella';

UPDATE piccolo_menu_items SET
    title_en = 'Filet Mignon (Mushroom, Green Pepper or Gorgonzola)',
    title_it = 'Filetto (Funghi, Pepe Verde o Gorgonzola)',
    title_es = 'Solomillo (Champiñones, Pimienta Verde o Gorgonzola)',
    description_en = '200g beef fillet, fresh cream, choice of sauce: mushroom, green pepper, or Gorgonzola. Served with tagliatelle in the same sauce',
    description_it = 'Filetto di manzo 200g, panna fresca, salsa a scelta: funghi, pepe verde o Gorgonzola. Servito con tagliatelle alla stessa salsa',
    description_es = 'Filete de ternera 200g, nata fresca, salsa a elegir: champiñones, pimienta verde o Gorgonzola. Servido con tagliatelle en la misma salsa'
WHERE title LIKE 'Filetto (funghi%';

UPDATE piccolo_menu_items SET
    title_en = 'Black Truffle Filet',
    title_it = 'Filetto al Tartufo Nero',
    title_es = 'Solomillo a la Trufa Negra',
    description_en = '200g beef fillet, fresh cream, summer black truffle cream, summer black truffle carpaccio. Served with truffle tagliatelle',
    description_it = 'Filetto di manzo 200g, panna fresca, crema di tartufo nero estivo, carpaccio di tartufo nero estivo. Servito con tagliatelle al tartufo',
    description_es = 'Filete de ternera 200g, nata fresca, crema de trufa negra de verano, carpaccio de trufa negra de verano. Servido con tagliatelle a la trufa'
WHERE title = 'Filetto al tartufo nero';


-- FISH
UPDATE piccolo_menu_items SET
    title_en = 'Grilled Salmon',
    title_it = 'Salmone alla Griglia',
    title_es = 'Salmón a la Parrilla',
    description_en = 'Fresh salmon steak. Served with tagliatelle in pink sauce',
    description_it = 'Trancio di salmone fresco. Servito con tagliatelle in salsa rosa',
    description_es = 'Filete de salmón fresco. Servido con tagliatelle en salsa rosa'
WHERE title = 'Salmone alla griglia';


-- SIDE DISHES TEXT
UPDATE piccolo_menu_items SET
    title_en = 'SIDE DISH INDICATED ON THE PLATE OR',
    title_it = 'CONTORNO INDICATO SUL PIATTO O',
    title_es = 'GUARNICIÓN INDICADA EN EL PLATO O',
    description_en = 'Homemade sautéed potatoes OR sautéed vegetables OR mixed salad',
    description_it = 'Patate saltate fatte in casa O verdure saltate O insalata mista',
    description_es = 'Patatas salteadas caseras O verduras salteadas O ensalada mixta'
WHERE title LIKE 'ACCOMPAGNEMENT INDIQUÉ%';


-- PIZZA / PINSA ROMANA
UPDATE piccolo_menu_items SET
    title_en = 'Margherita',
    title_it = 'Margherita',
    title_es = 'Margarita',
    description_en = 'Tomato sauce, fior di latte mozzarella, oregano, and basil',
    description_it = 'Salsa di pomodoro, mozzarella fior di latte, origano e basilico',
    description_es = 'Salsa de tomate, mozzarella fior di latte, orégano y albahaca'
WHERE title = 'MARGHERITA';

UPDATE piccolo_menu_items SET
    title_en = 'Goat Cheese & Honey',
    title_it = 'Capra e Miele',
    title_es = 'Queso de Cabra y Miel',
    description_en = 'Fresh cream, fior di latte mozzarella, goat cheese, honey, arugula, and walnuts',
    description_it = 'Panna fresca, mozzarella fior di latte, formaggio di capra, miele, rucola e noci',
    description_es = 'Nata fresca, mozzarella fior di latte, queso de cabra, miel, rúcula y nueces'
WHERE title = 'CHÈVRE MIEL';

UPDATE piccolo_menu_items SET
    title_en = 'Regina',
    title_it = 'Regina',
    title_es = 'Regina',
    description_en = 'Tomato sauce, fior di latte mozzarella, turkey ham, mushrooms, oregano, and basil',
    description_it = 'Salsa di pomodoro, mozzarella fior di latte, prosciutto di tacchino, funghi, origano e basilico',
    description_es = 'Salsa de tomate, mozzarella fior di latte, jamón de pavo, champiñones, orégano y albahaca'
WHERE title = 'REGINA';

UPDATE piccolo_menu_items SET
    title_en = 'Tuna',
    title_it = 'Tonno',
    title_es = 'Atún',
    description_en = 'Tomato sauce, fior di latte mozzarella, tuna, peppers, candied onions, olives, oregano, and basil',
    description_it = 'Salsa di pomodoro, mozzarella fior di latte, tonno, peperoni, cipolle candite, olive, origano e basilico',
    description_es = 'Salsa de tomate, mozzarella fior di latte, atún, pimientos, cebollas confitadas, aceitunas, orégano y albahaca'
WHERE title = 'TONNO';

UPDATE piccolo_menu_items SET
    title_en = 'Diavola',
    title_it = 'Diavola',
    title_es = 'Diábola',
    description_en = 'Tomato sauce, fior di latte mozzarella, beef pepperoni, oregano, and basil',
    description_it = 'Salsa di pomodoro, mozzarella fior di latte, salame piccante di manzo, origano e basilico',
    description_es = 'Salsa de tomate, mozzarella fior di latte, pepperoni de ternera, orégano y albahaca'
WHERE title = 'DIAVOLA';

UPDATE piccolo_menu_items SET
    title_en = 'Vegetarian',
    title_it = 'Vegetariana',
    title_es = 'Vegetariana',
    description_en = 'Tomato sauce, fior di latte mozzarella, and seasonal vegetables',
    description_it = 'Salsa di pomodoro, mozzarella fior di latte e verdure di stagione',
    description_es = 'Salsa de tomate, mozzarella fior di latte y verduras de temporada'
WHERE title = 'VEGETARIANA';

UPDATE piccolo_menu_items SET
    title_en = 'Vegetarian (Pumpkin)',
    title_it = 'Vegetariana (Zucca)',
    title_es = 'Vegetariana (Calabaza)',
    description_en = 'Pumpkin sauce, fior di latte mozzarella, and seasonal vegetables',
    description_it = 'Crema di zucca, mozzarella fior di latte e verdure di stagione',
    description_es = 'Salsa de calabaza, mozzarella fior di latte y verduras de temporada'
WHERE title = 'VEGETARIANA' AND description LIKE '%potiron%';

UPDATE piccolo_menu_items SET
    title_en = '4 Cheeses (tomato or fresh cream base)',
    title_it = '4 Formaggi (base pomodoro o panna)',
    title_es = '4 Quesos (base tomate o nata)',
    description_en = 'Fior di latte mozzarella, Gorgonzola, Grana Padano, and goat cheese',
    description_it = 'Mozzarella fior di latte, Gorgonzola, Grana Padano e formaggio di capra',
    description_es = 'Mozzarella fior di latte, Gorgonzola, Grana Padano y queso de cabra'
WHERE title LIKE '4 FROMAGGI%'; -- The 'FROMAGGI' typo in source is intentional to match DB

UPDATE piccolo_menu_items SET
    title_en = 'Truffle',
    title_it = 'Tartufo',
    title_es = 'Trufa',
    description_en = 'Fresh cream, summer black truffle cream, fior di latte mozzarella, mushrooms, parmesan shavings, and summer black truffle carpaccio',
    description_it = 'Panna fresca, crema di tartufo nero estivo, mozzarella fior di latte, funghi, scaglie di parmigiano e carpaccio di tartufo nero estivo',
    description_es = 'Nata fresca, crema de trufa negra de verano, mozzarella fior di latte, champiñones, virutas de parmesano y carpaccio de trufa negra de verano'
WHERE title = 'TARTUFO';

UPDATE piccolo_menu_items SET
    title_en = 'Gascone',
    title_it = 'Gascone',
    title_es = 'Gascona',
    description_en = 'Fresh cream, fior di latte mozzarella, burrata, chicken, balsamic cream, mushrooms, Grana Padano shavings, and basil',
    description_it = 'Panna fresca, mozzarella fior di latte, burrata, pollo, crema di aceto balsamico, funghi, scaglie di Grana Padano e basilico',
    description_es = 'Nata fresca, mozzarella fior di latte, burrata, pollo, crema balsámica, champiñones, virutas de Grana Padano y albahaca'
WHERE title = 'GASCONE';

UPDATE piccolo_menu_items SET
    title_en = 'Pastrama',
    title_it = 'Pastrama',
    title_es = 'Pastrama',
    description_en = 'Tomato sauce, fior di latte mozzarella, arugula, cherry tomatoes, pastrami, and Grana Padano shavings',
    description_it = 'Salsa di pomodoro, mozzarella fior di latte, rucola, pomodorini, pastrami e scaglie di Grana Padano',
    description_es = 'Salsa de tomate, mozzarella fior di latte, rúcula, tomates cherry, pastrami y virutas de Grana Padano'
WHERE title = 'PASTRAMA';

UPDATE piccolo_menu_items SET
    title_en = 'Focaccia Magnifiko',
    title_it = 'Focaccia Magnifiko',
    title_es = 'Focaccia Magnifiko',
    description_en = 'Burrata stracciatella, arugula, cherry tomatoes, turkey ham, beef pastrami, and balsamic vinegar cream',
    description_it = 'Stracciatella di burrata, rucola, pomodorini, prosciutto di tacchino, pastrami di manzo e crema di aceto balsamico',
    description_es = 'Stracciatella de burrata, rúcula, tomates cherry, jamón de pavo, pastrami de ternera y crema de vinagre balsámico'
WHERE title = 'FOCACCIA MAGNIFIKO';


-- SALADS / STARTERS
UPDATE piccolo_menu_items SET
    title_en = 'Caesar Salad',
    title_it = 'Insalata Caesar',
    title_es = 'Ensalada César',
    description_en = 'Mixed salad, cherry tomatoes, croutons, Grana Padano shavings, grilled chicken, and balsamic cream',
    description_it = 'Insalata mista, pomodorini, crostini, scaglie di Grana Padano, pollo grigliato e crema di aceto balsamico',
    description_es = 'Ensalada mixta, tomates cherry, picatostes, virutas de Grana Padano, pollo a la parrilla y crema balsámica'
WHERE title = 'Salade césar' OR title = 'Salade César';

UPDATE piccolo_menu_items SET
    title_en = 'Warm Goat Cheese Salad',
    title_it = 'Insalata Capra Calda',
    title_es = 'Ensalada de Queso de Cabra Templado',
    description_en = 'Mixed salad, cherry tomatoes, walnuts, honey, oven-baked goat cheese toasts',
    description_it = 'Insalata mista, pomodorini, noci, miele, crostini di capra caldi gratinati al forno',
    description_es = 'Ensalada mixta, tomates cherry, nueces, miel, tostas de queso de cabra gratinadas al horno'
WHERE title = 'Salade chèvre chaud' OR title = 'Salade Chèvre Chaud';

UPDATE piccolo_menu_items SET
    title_en = 'Homemade Mozza Sticks',
    title_it = 'Mozza Stick Fatti in Casa',
    title_es = 'Palitos de Mozzarella Caseros',
    description_en = 'Breaded mozzarella, served with chef’s sauce',
    description_it = 'Mozzarella impanata, servita con la salsa dello chef',
    description_es = 'Mozzarella empanada, servida con salsa del chef'
WHERE title = 'Mozza Stick Maison';

UPDATE piccolo_menu_items SET
    title_en = 'Goat Cheese Bruschetta',
    title_it = 'Bruschetta Capra e Miele',
    title_es = 'Bruschetta de Queso de Cabra',
    description_en = 'Toasted bread, goat cheese, honey, and walnuts',
    description_it = 'Pane tostato, formaggio di capra, miele e noci',
    description_es = 'Pan tostado, queso de cabra, miel y nueces'
WHERE title = 'Bruschetta chèvre chaud';

UPDATE piccolo_menu_items SET
    title_en = 'Magnifiko Bruschetta',
    title_it = 'Bruschetta Magnifiko',
    title_es = 'Bruschetta Magnifiko',
    description_en = 'Toasted bread, brie, and beef pastrami',
    description_it = 'Pane tostato, brie e pastrami di manzo',
    description_es = 'Pan tostado, brie y pastrami de ternera'
WHERE title = 'Bruschetta MAGNIFIKO';

UPDATE piccolo_menu_items SET
    title_en = 'Fried Calamari',
    title_it = 'Calamari Fritti',
    title_es = 'Calamares Fritos',
    description_en = 'Roman-style fried calamari, served with chef’s sauce',
    description_it = 'Calamari fritti alla romana, serviti con la salsa dello chef',
    description_es = 'Calamares fritos a la romana, servidos con salsa del chef'
WHERE title = 'Calamari Fritti';

UPDATE piccolo_menu_items SET
    title_en = 'Meat Carpaccio',
    title_it = 'Carpaccio di Carne',
    title_es = 'Carpaccio de Carne',
    description_en = 'Beef carpaccio, extra virgin olive oil, arugula, lemon, cherry tomatoes, balsamic cream, and Grana Padano shavings',
    description_it = 'Carpaccio di manzo, olio extravergine di oliva, rucola, limone, pomodorini, crema di aceto balsamico e scaglie di Grana Padano',
    description_es = 'Carpaccio de ternera, aceite de oliva virgen extra, rúcula, limón, tomates cherry, crema balsámica y virutas de Grana Padano'
WHERE title = 'Carpaccio di carne';

UPDATE piccolo_menu_items SET
    title_en = 'Salmon Tartare',
    title_it = 'Tartare di Salmone',
    title_es = 'Tartar de Salmón',
    description_en = 'Fresh salmon and avocado',
    description_it = 'Salmone fresco e avocado',
    description_es = 'Salmón fresco y aguacate'
WHERE title = 'Tartare de saumon';

UPDATE piccolo_menu_items SET
    title_en = 'Burrata Pesto',
    title_it = 'Burrata al Pesto',
    title_es = 'Burrata al Pesto',
    description_en = '125g Burrata, basil pesto, cherry tomatoes, arugula, and balsamic cream',
    description_it = 'Burrata 125g, pesto di basilico, pomodorini, rucola e crema di aceto balsamico',
    description_es = 'Burrata 125g, pesto de albahaca, tomates cherry, rúcula y crema balsámica'
WHERE title = 'Burrata pesto';

UPDATE piccolo_menu_items SET
    title_en = 'Black Truffle Burrata',
    title_it = 'Burrata al Tartufo Nero',
    title_es = 'Burrata a la Trufa Negra',
    description_en = '125g Burrata, cherry tomatoes, summer black truffle cream, arugula, and summer black truffle carpaccio',
    description_it = 'Burrata 125g, pomodorini, crema di tartufo nero estivo, rucola e carpaccio di tartufo nero estivo',
    description_es = 'Burrata 125g, tomates cherry, crema de trufa negra de verano, rúcula y carpaccio de trufa negra de verano'
WHERE title = 'Burrata al tartufo nero';

UPDATE piccolo_menu_items SET
    title_en = 'Burrata Trio',
    title_it = 'Trio di Burrata',
    title_es = 'Trío de Burrata',
    description_en = '3 burratas of 50g: classic, basil pesto, and summer black truffle',
    description_it = '3 burrate da 50g: classica, pesto di basilico e tartufo nero estivo',
    description_es = '3 burratas de 50g: clásica, pesto de albahaca y trufa negra de verano'
WHERE title = 'Trio de burrata';

UPDATE piccolo_menu_items SET
    title_en = 'Charcuterie Board',
    title_it = 'Tagliere di Salumi',
    title_es = 'Tabla de Embutidos',
    description_en = 'Mix of charcuterie, olives, and Italian cheeses',
    description_it = 'Misto di salumi, olive e formaggi italiani',
    description_es = 'Mezcla de embutidos, aceitunas y quesos italianos'
WHERE title = 'PLANCHE DE CHARCUTERIE';

UPDATE piccolo_menu_items SET
    title_en = 'MAGNIFIKO - For 2 people',
    title_it = 'MAGNIFIKO - Per 2 persone',
    title_es = 'MAGNIFIKO - Para 2 personas',
    description_en = 'Fried calamari, mozza stick, mixed bruschetta, burrata trio, and mixed pinsa',
    description_it = 'Calamari fritti, mozza stick, bruschetta mista, trio di burrate e pinsa mista',
    description_es = 'Calamares fritos, palitos de mozzarella, bruschetta mixta, trío de burrata y pinsa mixta'
WHERE title = 'MAGNIFIKO - Pour 2 personnes';

UPDATE piccolo_menu_items SET
    title_en = 'MAGNIFIKO - For 4 people',
    title_it = 'MAGNIFIKO - Per 4 persone',
    title_es = 'MAGNIFIKO - Para 4 personas',
    description_en = 'Charcuterie, Italian cheeses, fried calamari, mozza stick, mixed bruschetta, burrata, mixed pinsa, and salmon tartare',
    description_it = 'Salumi, formaggi italiani, calamari fritti, mozza stick, bruschetta mista, burrata, pinsa mista e tartare di salmone',
    description_es = 'Embutidos, quesos italianos, calamares fritos, palitos de mozzarella, bruschetta mixta, burrata, pinsa mixta y tartar de salmón'
WHERE title = 'MAGNIFIKO - Pour 4 personnes';


-- DESSERTS
UPDATE piccolo_menu_items SET
    title_en = 'Classic Tiramisu',
    title_it = 'Tiramisù Classico',
    title_es = 'Tiramisú Clásico',
    description_en = 'Ladyfingers soaked in coffee, pasteurized egg yolk, mascarpone cream dusted with cocoa',
    description_it = 'Savoiardi inzuppati nel caffè, tuorlo d’uovo pastorizzato, crema al mascarpone spolverata di cacao',
    description_es = 'Bizcochos de soletilla bañados en café, yema de huevo pasteurizada, crema de mascarpone espolvoreada con cacao'
WHERE title = 'Tiramisù Classico';

UPDATE piccolo_menu_items SET
    title_en = 'Pistachio Tiramisu',
    title_it = 'Tiramisù al Pistacchio',
    title_es = 'Tiramisú de Pistacho',
    description_en = 'Soaked ladyfingers, pasteurized egg yolk, mascarpone cream, and pistachio',
    description_it = 'Savoiardi inzuppati, tuorlo d’uovo pastorizzato, crema al mascarpone e pistacchio',
    description_es = 'Bizcochos de soletilla bañados, yema de huevo pasteurizada, crema de mascarpone y pistacho'
WHERE title = 'Tiramisù al Pistacchio';

UPDATE piccolo_menu_items SET
    title_en = 'Gelato (Homemade Ice Cream)',
    title_it = 'Gelato Fatto in Casa',
    title_es = 'Helado Casero',
    description_en = 'Vanilla',
    description_it = 'Vaniglia',
    description_es = 'Vainilla'
WHERE title LIKE 'Gelato (Glace maison)%';

UPDATE piccolo_menu_items SET
    title_en = 'Sicilian Cannolo',
    title_it = 'Cannolo Siciliano',
    title_es = 'Cannolo Siciliano',
    description_en = 'Sicilian pastry filled with sweetened sheep cheese, pistachio chips, and praline',
    description_it = 'Dolce siciliano ripieno di ricotta di pecora zuccherata, granella di pistacchio e pralinato',
    description_es = 'Pastel siciliano relleno de queso de oveja dulce, trozos de pistacho y praliné'
WHERE title = 'Cannolo Sicilien';

UPDATE piccolo_menu_items SET
    title_en = 'Coffee Ice Cream',
    title_it = 'Gelato al Caffè',
    title_es = 'Helado de Café',
    description_en = 'Coffee ice cream and whipped cream',
    description_it = 'Gelato al caffè e panna montata',
    description_es = 'Helado de café y nata montada'
WHERE title = 'Crème glacée au café';

UPDATE piccolo_menu_items SET
    title_en = 'Affogato Coffee',
    title_it = 'Affogato al Caffè',
    title_es = 'Affogato al Café',
    description_en = 'Espresso poured over vanilla ice cream, cream, and pistachio chips',
    description_it = 'Espresso versato su gelato alla vaniglia, panna e granella di pistacchio',
    description_es = 'Espresso vertido sobre helado de vainilla, nata y trozos de pistacho'
WHERE title = 'Affogato Caffè';

UPDATE piccolo_menu_items SET
    title_en = 'Gourmet Coffee or Tea',
    title_it = 'Caffè o Tè Goloso',
    title_es = 'Café o Té Gourmand',
    description_en = 'Coffee or Tea, accompanied by mini homemade desserts',
    description_it = 'Caffè o Tè, accompagnato da mini dolci fatti in casa',
    description_es = 'Café o Té, acompañado de mini postres caseros'
WHERE title = 'Café ou Thé Gourmand';


-- DRINKS / BEVERAGES
UPDATE piccolo_menu_items SET
    title_en = 'San Pellegrino 25cl',
    title_it = 'San Pellegrino 25cl',
    title_es = 'San Pellegrino 25cl'
WHERE title LIKE 'San pellegrino 25CL' OR title LIKE 'SAN PELLEGRINO 25cl';

UPDATE piccolo_menu_items SET
    title_en = 'San Pellegrino 75cl',
    title_it = 'San Pellegrino 75cl',
    title_es = 'San Pellegrino 75cl'
WHERE title = 'SAN PELLEGRINO 75cl';

UPDATE piccolo_menu_items SET
    title_en = 'Panna 25cl',
    title_it = 'Panna 25cl',
    title_es = 'Panna 25cl'
WHERE title LIKE 'Panna 25CL' OR title LIKE 'PANNA 25cl';

UPDATE piccolo_menu_items SET
    title_en = 'Panna 75cl',
    title_it = 'Panna 75cl',
    title_es = 'Panna 75cl'
WHERE title = 'PANNA 75cl';

UPDATE piccolo_menu_items SET
    title_en = 'Coca-Cola 33cl',
    title_it = 'Coca-Cola 33cl',
    title_es = 'Coca-Cola 33cl'
WHERE title LIKE 'Coca-Cola 33CL' OR title LIKE 'COCA-COLA 33cl';

UPDATE piccolo_menu_items SET
    title_en = 'Coca-Cola Zero 33cl',
    title_it = 'Coca-Cola Zero 33cl',
    title_es = 'Coca-Cola Zero 33cl'
WHERE title LIKE 'Coca-Cola Zero 33CL' OR title LIKE 'COCA-ZERO 33cl';

UPDATE piccolo_menu_items SET
    title_en = 'Fanta Orange 33cl',
    title_it = 'Fanta Orange 33cl',
    title_es = 'Fanta Naranja 33cl'
WHERE title = 'Fanta orange 33CL';

UPDATE piccolo_menu_items SET
    title_en = 'Fanta Orange 25cl',
    title_it = 'Fanta Orange 25cl',
    title_es = 'Fanta Naranja 25cl'
WHERE title = 'FANTA ORANGE 25cl';

UPDATE piccolo_menu_items SET
    title_en = 'Sprite 33cl',
    title_it = 'Sprite 33cl',
    title_es = 'Sprite 33cl'
WHERE title = 'Sprite 33CL';

UPDATE piccolo_menu_items SET
    title_en = 'Sprite 25cl',
    title_it = 'Sprite 25cl',
    title_es = 'Sprite 25cl'
WHERE title = 'SPRITE 25cl';

UPDATE piccolo_menu_items SET
    title_en = 'Mole Cola',
    title_it = 'Mole Cola',
    title_es = 'Mole Cola'
WHERE title = 'MOLE COLA';

UPDATE piccolo_menu_items SET
    title_en = 'Estathe Peach 25cl',
    title_it = 'Estathé Pesca 25cl',
    title_es = 'Estathé Melocotón 25cl'
WHERE title = 'ESTATHE PECHE 25cl';

UPDATE piccolo_menu_items SET
    title_en = 'Estathe Lemon 25cl',
    title_it = 'Estathé Limone 25cl',
    title_es = 'Estathé Limón 25cl'
WHERE title = 'ESTATHE CITRON 25cl';

UPDATE piccolo_menu_items SET
    title_en = 'Blood Orange',
    title_it = 'Arancia Rossa',
    title_es = 'Naranja Sanguina'
WHERE title = 'Orange sanguine';

UPDATE piccolo_menu_items SET
    title_en = 'Lemon',
    title_it = 'Limone',
    title_es = 'Limón'
WHERE title = 'Citron';

UPDATE piccolo_menu_items SET
    title_en = 'Lemon and Ginger',
    title_it = 'Limone e Zenzero',
    title_es = 'Limón y Jengibre'
WHERE title = 'Citron et gingembre';

UPDATE piccolo_menu_items SET
    title_en = 'Green Mandarin',
    title_it = 'Mandarino Verde',
    title_es = 'Mandarina Verde'
WHERE title = 'Mandarine verte';

UPDATE piccolo_menu_items SET
    title_en = 'Grenadine',
    title_it = 'Granatina',
    title_es = 'Granadina'
WHERE title = 'Grenadine';

UPDATE piccolo_menu_items SET
    title_en = 'Gassosa',
    title_it = 'Gassosa',
    title_es = 'Gaseosa'
WHERE title = 'Gassosa';

UPDATE piccolo_menu_items SET
    title_en = 'Orange',
    title_it = 'Arancia',
    title_es = 'Naranja'
WHERE title = 'Orange';

UPDATE piccolo_menu_items SET
    title_en = 'Pineapple',
    title_it = 'Ananas',
    title_es = 'Piña'
WHERE title = 'Ananas';

UPDATE piccolo_menu_items SET
    title_en = 'Pear',
    title_it = 'Pera',
    title_es = 'Pera'
WHERE title = 'Poire';

UPDATE piccolo_menu_items SET
    title_en = 'Strawberry, Grenadine, Mint, Peach, Lemon',
    title_it = 'Fragola, Granatina, Menta, Pesca, Limone',
    title_es = 'Fresa, Granadina, Menta, Melocotón, Limón'
WHERE title LIKE 'Fraise, Grenadine%';


-- COFFEE
UPDATE piccolo_menu_items SET
    title_en = 'Coffee',
    title_it = 'Caffè',
    title_es = 'Café'
WHERE title = 'Caffè';

UPDATE piccolo_menu_items SET
    title_en = 'Decaffeinated',
    title_it = 'Decaffeinato',
    title_es = 'Descafeinado'
WHERE title = 'Decaffeinato';

UPDATE piccolo_menu_items SET
    title_en = 'Cappuccino',
    title_it = 'Cappuccino',
    title_es = 'Capuchino'
WHERE title = 'Cappuccino';

UPDATE piccolo_menu_items SET
    title_en = 'Cream Coffee',
    title_it = 'Caffè con Panna',
    title_es = 'Café con Nata'
WHERE title = 'Caffè crema';

UPDATE piccolo_menu_items SET
    title_en = 'Macchiato Coffee',
    title_it = 'Caffè Macchiato',
    title_es = 'Café Manchado'
WHERE title = 'Caffè macchiato';

UPDATE piccolo_menu_items SET
    title_en = 'Dammann Tea',
    title_it = 'Tè Dammann',
    title_es = 'Té Dammann'
WHERE title = 'Thé Dammann';

UPDATE piccolo_menu_items SET
    title_en = 'Double Coffee',
    title_it = 'Caffè Doppio',
    title_es = 'Café Doble'
WHERE title = 'Double caffé';


-- COCKTAILS
UPDATE piccolo_menu_items SET
    title_en = 'Classic Virgin Mojito 37cl',
    title_it = 'Virgin Mojito Classico 37cl',
    title_es = 'Virgin Mojito Clásico 37cl',
    description_en = 'Chunky lime, mint leaves, mojito flavor syrup, and sparkling water',
    description_it = 'Lime a pezzi, foglie di menta, sciroppo al gusto mojito e acqua frizzante',
    description_es = 'Lima troceada, hojas de menta, sirope sabor mojito y agua con gas'
WHERE title = 'VIRGIN MOJITO CLASSICO 37cl';

UPDATE piccolo_menu_items SET
    title_en = 'Fruity Virgin Mojito 37cl',
    title_it = 'Virgin Mojito alla Frutta 37cl',
    title_es = 'Virgin Mojito de Frutas 37cl',
    description_en = '1 FLAVOR OF CHOICE: STRAWBERRY, PINEAPPLE, MANGO, PASSION FRUIT. Chunky lime, mint leaves, chosen syrup flavor, and sparkling water',
    description_it = '1 GUSTO A SCELTA: FRAGOLA, ANANAS, MANGO, PASSION FRUIT. Lime a pezzi, foglie di menta, sciroppo al gusto scelto e acqua frizzante',
    description_es = '1 SABOR A ELEGIR: FRESA, PIÑA, MANGO, MARACUYÁ. Lima troceada, hojas de menta, sirope sabor elegido y agua con gas'
WHERE title = 'VIRGIN MOJITO FRUTTA 37cl';

UPDATE piccolo_menu_items SET
    title_en = 'Virgin Colada 44cl',
    title_it = 'Virgin Colada 44cl',
    title_es = 'Virgin Colada 44cl',
    description_en = 'Pineapple juice, coconut cream, and piña colada flavor syrup',
    description_it = 'Succo d’ananas, crema di cocco e sciroppo al gusto piña colada',
    description_es = 'Zumo de piña, crema de coco y sirope sabor piña colada'
WHERE title = 'VIRGIN COLADA 44cl';

UPDATE piccolo_menu_items SET
    title_en = 'Josephine Baker 44cl',
    title_it = 'Josephine Baker 44cl',
    title_es = 'Josephine Baker 44cl',
    description_en = 'Passion fruit juice, mango juice, and coconut cream',
    description_it = 'Succo al frutto della passione, succo di mango e crema di cocco',
    description_es = 'Zumo de maracuyá, zumo de mango y crema de coco'
WHERE title = 'JOSEPHINE BAKER 44cl';


-- ==========================================
-- ADDONS
-- ==========================================

UPDATE piccolo_addons SET
    title_en = 'Avocado',
    title_it = 'Avocado',
    title_es = 'Aguacate'
WHERE title = 'Avocat';

UPDATE piccolo_addons SET
    title_en = 'Grilled Chicken',
    title_it = 'Pollo Grigliato',
    title_es = 'Pollo a la Parrilla'
WHERE title = 'Poulet grillé';

UPDATE piccolo_addons SET
    title_en = 'Burrata',
    title_it = 'Burrata',
    title_es = 'Burrata'
WHERE title = 'Burrata';

UPDATE piccolo_addons SET
    title_en = 'Pastrami',
    title_it = 'Pastrami',
    title_es = 'Pastrami'
WHERE title = 'Pastrami';

UPDATE piccolo_addons SET
    title_en = 'Extra Side Dishes',
    title_it = 'Contorni Extra',
    title_es = 'Guarniciones Extra',
    description_en = 'Creamy penne, sautéed vegetables, homemade sautéed potatoes, or mixed salad',
    description_it = 'Penne alla panna, verdure saltate, patate saltate fatte in casa o insalata mista',
    description_es = 'Penne a la crema, verduras salteadas, patatas salteadas caseras o ensalada mixta'
WHERE title = 'Accompagnements supplémentaires';

UPDATE piccolo_addons SET
    title_en = 'Extra Sauces',
    title_it = 'Salse Extra',
    title_es = 'Salsas Extra',
    description_en = 'Green pepper, mushroom, truffle, or Gorgonzola',
    description_it = 'Pepe verde, funghi, tartufo o Gorgonzola',
    description_es = 'Pimienta verde, champiñones, trufa o Gorgonzola'
WHERE title = 'Sauces supplémentaires';
