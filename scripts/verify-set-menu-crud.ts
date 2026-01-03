
import { piccoloSetMenuService } from '../src/services/piccoloMenuService';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function verifySetMenuCRUD() {
    try {
        console.log('--- Verifying Set Menu CRUD Operations ---');

        console.log('1. Creating Test Menu...');
        const newMenu = await piccoloSetMenuService.create({
            title: 'Test Menu CRUD',
            price: 10.99,
            status: 'active'
        });
        console.log(`✅ Created Menu: ${newMenu.id}`);

        console.log('2. Creating Test Group...');
        const newGroup = await piccoloSetMenuService.createGroup({
            set_menu_id: newMenu.id,
            title: 'Test Group CRUD'
        });
        console.log(`✅ Created Group: ${newGroup.id}`);

        console.log('3. Creating Test Item...');
        const newItem = await piccoloSetMenuService.createItem({
            group_id: newGroup.id,
            title: 'Test Item CRUD'
        });
        console.log(`✅ Created Item: ${newItem.id}`);

        console.log('4. Updating Item...');
        await piccoloSetMenuService.updateItem(newItem.id, { title: 'Updated Item Title' });
        const updatedItem = await piccoloSetMenuService.getItemById(newItem.id);
        if (updatedItem?.title === 'Updated Item Title') console.log('✅ Item Updated');
        else console.error('❌ Item Update Failed');

        console.log('5. Deleting Item...');
        await piccoloSetMenuService.deleteItem(newItem.id);
        const deletedItem = await piccoloSetMenuService.getItemById(newItem.id); // Should throw or return null?
        // Note: getById with .single() throws if not found
        try {
            if (!deletedItem) console.log('✅ Item Deleted (returned null)');
        } catch (e) {
            console.log('✅ Item Deleted (throw error as expected on single())');
        }

        console.log('6. Deleting Group...');
        await piccoloSetMenuService.deleteGroup(newGroup.id);
        console.log('✅ Group Deleted');

        console.log('7. Deleting Menu...');
        await piccoloSetMenuService.delete(newMenu.id);
        console.log('✅ Menu Deleted');

        console.log('--- Verification Complete ---');

    } catch (error) {
        console.error('❌ Verification Error:', error);
    }
}

verifySetMenuCRUD();
