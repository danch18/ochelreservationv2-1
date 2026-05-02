import { fetchMenuDataServer } from '@/services/fetchMenuDataServer';
import PiccoloMenuPageClient from '@/components/menu/PiccoloMenuPageClient';

export const revalidate = 60;

export default async function PiccoloMenuPage() {
  const initialData = await fetchMenuDataServer('piccolo');

  return <PiccoloMenuPageClient initialData={initialData} />;
}
