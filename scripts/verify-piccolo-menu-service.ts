
import { piccoloMenuService } from '../src/services/piccoloMenuService';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function verifyMenuData() {
    try {
        console.log('Fetching Piccolo menu data...');
        const menuDataMap = await piccoloMenuService.getAllMenuData();

        console.log(`Fetched ${menuDataMap.size} categories.`);

        const formulasCategory = menuDataMap.get(-1);
        if (formulasCategory) {
            console.log('✅ "Formules" category (ID -1) found.');

            const setMenus = formulasCategory.setMenus;
            if (setMenus && setMenus.length > 0) {
                console.log(`✅ Found ${setMenus.length} Set Menus.`);

                setMenus.forEach(menu => {
                    console.log(`\nSet Menu: ${menu.title} (ID: ${menu.id})`);
                    if (menu.groups && menu.groups.length > 0) {
                        console.log(`  ✅ Has ${menu.groups.length} groups.`);
                        menu.groups.forEach(group => {
                            console.log(`    - Group: ${group.title} (${group.items?.length || 0} items)`);
                        });
                    } else {
                        console.log('  ❌ Start Menu has no groups (unexpected for seeded data).');
                    }
                });
            } else {
                console.log('❌ "Formules" category found but no set menus inside.');
            }
        } else {
            console.log('❌ "Formules" category (ID -1) NOT found.');
        }

    } catch (error) {
        console.error('Error verifying menu data:', error);
    }
}

verifyMenuData();
