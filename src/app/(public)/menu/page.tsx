import { fetchMenuDataServer } from '@/services/fetchMenuDataServer';
import MagnifikoMenuPageClient from '@/components/menu/MagnifikoMenuPageClient';

export const revalidate = 60;

export default async function MenuPage() {
  const initialData = await fetchMenuDataServer('magnifiko');

  return <MagnifikoMenuPageClient initialData={initialData} />;
}
