
import { piccoloSetMenuService } from '../src/services/piccoloMenuService';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function verifySetMenuReorder() {
    try {
        console.log('--- Verifying Set Menu Reorder Logic ---');

        // 1. Fetch current menus to find two to swap
        console.log('Fetching menus...');
        const menus = await piccoloSetMenuService.getAll();
        if (menus.length < 2) {
            console.log('⚠️ Not enough menus to test reorder. Creating dummies...');
            await piccoloSetMenuService.create({ title: 'Dummy 1', price: 10, status: 'active', order: 1 });
            await piccoloSetMenuService.create({ title: 'Dummy 2', price: 20, status: 'active', order: 2 });
        }

        const freshMenus = await piccoloSetMenuService.getAll();
        const menu1 = freshMenus[0];
        const menu2 = freshMenus[1];

        console.log(`Original Order: ${menu1.title} (${menu1.order}), ${menu2.title} (${menu2.order})`);

        // 2. Simulate Swap
        console.log('Swapping order...');
        await piccoloSetMenuService.updateBulkOrder([
            { id: menu1.id, order: menu2.order },
            { id: menu2.id, order: menu1.order }
        ]);

        // 3. Verify
        const reorderedMenus = await piccoloSetMenuService.getAll();
        const newMenu1 = reorderedMenus.find(m => m.id === menu1.id);
        const newMenu2 = reorderedMenus.find(m => m.id === menu2.id);

        console.log(`New Order: ${newMenu1?.title} (${newMenu1?.order}), ${newMenu2?.title} (${newMenu2?.order})`);

        if (newMenu1?.order === menu2.order && newMenu2?.order === menu1.order) {
            console.log('✅ Reorder successful.');
        } else {
            console.error('❌ Reorder failed.');
        }

        // Cleanup dummies if created (optional, skipping for safety)

    } catch (error) {
        console.error('❌ Verification Error:', error);
    }
}

verifySetMenuReorder();
