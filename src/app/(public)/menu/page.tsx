'use client';

import { cn } from '@/lib';
import MenuDisplay from '@/components/menu/MenuDisplay';

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-white overflow-x-hidden w-full max-w-full font-forum">
      {/* Main Layout - Two Equal Sections */}
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Image Section - Left on desktop, Top on mobile/tablet */}
        <div className='flex-1 relative lg:sticky lg:top-0'>
          <div
            className={cn(
              "relative flex flex-col justify-center items-center bg-cover bg-center bg-no-repeat h-[250px] md:h-[300px] lg:h-[900px]"
            )}
            style={{ backgroundImage: 'url("/images/menu-bg.webp")' }}>
            {/* OUR MENU text in the middle */}
            <div className="text-center">
              <h1 className="text-[2.5rem] md:text-[3rem] font-normal tracking-normal text-white" suppressHydrationWarning>
                OUR MENU
              </h1>
            </div>
          </div>
        </div>

        {/* Content Section - Right on desktop, Bottom on mobile/tablet */}
        <div className="flex-1 bg-[#000000] flex flex-col">
          <MenuDisplay />
        </div>
      </div>
    </div>
  );
}