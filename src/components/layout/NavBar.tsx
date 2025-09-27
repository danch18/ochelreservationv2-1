'use client'

import Link from 'next/link';
import Image from "next/image"
import { useState, useEffect, useRef} from 'react';
import { DATA } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface NavBarProps {
    className?: string;
}

export function NavBar({className=""}:NavBarProps) {
  const menuRef = useRef<HTMLElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const handleButtonClick = () => {
    setIsOpen(!isOpen)
  }
  const {navbar} = DATA
  return (
    <header 
        className={cn(
            className,
            "w-screen"
        )}
     >
      <div 
        className={cn(
            "relative",
            "w-fit rounded-full mx-auto p-[6px]",
            "bg-[#1F1F1F] backdrop-blur-[10px]",
            "flex justify-between items-center gap-4",
            "ring ring-white/30"
        )}
       >
          <div
                className={cn(
                    "flex justify-center items-center gap-3"
                )}
           >
            <div
                className={cn(
                    "relative flex items-center justify-center",
                    "w-10 h-10 rounded-full bg-black",
                    "cursor-pointer group",
                    "ring ring-white/10"
                )}
                onClick={handleButtonClick}
                onMouseLeave={() => setIsOpen(false)}
             >
                <div className="relative w-5 h-3 ">
                    {/* Default Icon */}
                    <Image
                        src="/icons/burgar-menu.svg"
                        alt="menu"
                        fill
                        priority
                        className="transition-opacity duration-500 opacity-100 group-hover:opacity-0"
                    />
                    {/* Hover Icon */}
                    <Image
                        src="/icons/burgar-menu-hover.svg"
                        alt="menu-hover"
                        fill
                        priority
                        className="transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                    />
                </div>
            </div>

            <Link href="/" className="">
               <div className="relative w-13 h-10">
                <Image
                    src="/logo.png"
                    alt="logo"
                    fill
                    priority
                />
                </div>
            </Link>
          </div>
          
          <nav 
            className={cn(
                "flex justify-center items-center gap-5",
                "bg-black rounded-full",
                "ring ring-white/10",
                "px-3 py-2 h-10"
             )}
           >
            {navbar.map((item, idx) => (
                <Link 
                    key={idx}
                    href={item.link} 
                    className={cn(
                        "p-2",
                        "text-[14px] text-white hover:text-amber-600 ",
                        "font-light transition-colors"
                    )}
                 >
                    {item.label}
                </Link>
            ))}
          </nav>
      </div>
      {true && (
        <div
            className={cn(
                "absolute top-full z-20 rounded-md mt-2",
                "left-1/2 -translate-x-1/2",
                "bg-white/50 backdrop-blur-[10px]",
                "flex flex-col items-center justify-center gap-2",
                "ring ring-white/90",
                "min-w-[400px] px-10 py-5"
            )}
         >
            {navbar.map((item, idx) => (
                <Link 
                    key={idx}
                    href={item.link} 
                    className={cn(
                        "p-2",
                        "text-[18px] text-white hover:text-amber-600 ",
                        "font-light transition-colors"
                    )}
                    >
                        {item.label}
                </Link>
            ))}
        </div>
      )}
    </header>
  );
}