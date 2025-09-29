'use client';

import { Navigation, Footer } from '@/components/layout';
import { cn } from '@/lib';
import MenuDisplay from '@/components/menu/MenuDisplay';

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-white overflow-x-hidden w-full max-w-full font-forum">
      {/* Main Layout - Two Equal Sections */}
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Image Section - Left on desktop, Top on mobile/tablet */}
        <div
          className='flex-1 relative'
        >
          <div 
            className={cn(
              "relative flex flex-col justify-center items-center bg-cover bg-center bg-no-repeat h-[250px] md:h-[300px] lg:h-[900px]" 
            )}
            style={{ backgroundImage: 'url("/images/menu-bg.webp")' }}>
            {/* Navigation positioned at the top center of image section */}
            {/* <div className="absolute top-6 left-full transform -translate-x-full z-10">
              <div className="relative">
                <Navigation
                  logo={{
                    src: "/icons/MagnifikoLogo.png",
                    alt: "Magnifiko Restaurant",
                    width: 50,
                    height: 17
                  }}
                  className="!relative !top-0 !left-0 !transform-none"
                />
              </div>
            </div> */}

            {/* OUR MENU text in the middle */}
            <div className="text-center">
              <h1 className="text-[2.5rem] md:text-[3rem] font-normal tracking-normal text-white">
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

      {/* Footer */}
      <div id="contact">
        <Footer />
      </div>
    </div>
  );
}