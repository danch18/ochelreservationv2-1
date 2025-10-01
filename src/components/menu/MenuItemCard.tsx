'use client';

import { useState } from 'react';
import Image from 'next/image';

interface MenuItemCardProps {
  image: string;
  title: string;
  subtitle?: string;
  price: string;
  hasCamera?: boolean;
  has3D?: boolean;
  model3DUrl?: string;
  additionalImageUrl?: string;
  variant?: 'regular' | 'special';
}

type ModalType = '3d' | 'image' | null;

export default function MenuItemCard({
  image,
  title,
  subtitle,
  price,
  hasCamera = false,
  has3D = false,
  model3DUrl,
  additionalImageUrl,
  variant = 'regular'
}: MenuItemCardProps) {
  const [modalType, setModalType] = useState<ModalType>(null);

  const handleCardClick = () => {
    // Open image modal when card is clicked
    setModalType('image');
  };

  const handleCameraClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setModalType('image');
  };

  const handle3DClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (model3DUrl) {
      setModalType('3d');
    }
  };

  const closeModal = () => {
    setModalType(null);
  };

  const handleRedirect3D = () => {
    if (model3DUrl) {
      window.open(model3DUrl, '_blank');
    }
  };

  const isSpecial = variant === 'special';

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg cursor-pointer transition-opacity hover:opacity-90 ${
          isSpecial
            ? 'bg-[#EFE6D2] text-black'
            : 'bg-[#101010] border border-white/10 text-white'
        }`}
      >
        {/* Image */}
        <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 ${
          isSpecial ? 'border-[3px] border-[#FFD65A]' : 'border-2 border-white/30'
        }`}>
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1">
            <h3 className={`text-base sm:text-lg font-medium font-forum ${
              isSpecial ? 'text-black' : 'text-white'
            }`}>{title}</h3>

            {/* Icons */}
            <div className="flex gap-1 ml-1 sm:ml-2">
              {has3D && (
                <button
                  onClick={handle3DClick}
                  className="w-5 h-5 sm:w-6 sm:h-6 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Image
                    src="/icons/3d.svg"
                    alt="3D View"
                    width={24}
                    height={24}
                    className="w-full h-full cursor-pointer"
                  />
                </button>
              )}
              {hasCamera && (
                <button
                  onClick={handleCameraClick}
                  className="w-5 h-5 sm:w-6 sm:h-6 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Image
                    src="/icons/camera.svg"
                    alt="View Image"
                    width={24}
                    height={24}
                    className="w-full h-full cursor-pointer"
                  />
                </button>
              )}
            </div>
          </div>

          {subtitle && (
            <p className={`text-sm mb-2 font-forum ${
              isSpecial ? 'text-black/70' : 'text-gray-400'
            }`}>{subtitle}</p>
          )}
        </div>

        {/* Price - Always normal variant style */}
        <div className="text-white text-base sm:text-lg font-medium font-forum border border-white/20 bg-[#1F1F1F] rounded px-2 py-1 sm:px-3">
          {price}
        </div>
      </div>

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Background Overlay */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            onClick={closeModal}
          />

          {/* Modal Content - 80% of viewport */}
          <div className="relative bg-[#101010] rounded-lg border border-white/20 w-[80vw] h-[80vh] flex flex-col">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              ✕
            </button>

            {/* Content Area */}
            <div className="w-full h-full p-4 flex flex-col">
              {modalType === '3d' && model3DUrl ? (
                <>
                  {/* 3D Model Embed */}
                  <div className="flex-1 mb-4">
                    <iframe
                      src={model3DUrl}
                      className="w-full h-full rounded-lg"
                      title="3D Model View"
                      allowFullScreen
                    />
                  </div>

                  {/* Redirect Button */}
                  <div className="flex justify-center pb-2">
                    <button
                      onClick={handleRedirect3D}
                      className="px-6 py-3 bg-[#FFD65A] hover:bg-[#FFD65A]/90 text-black font-medium rounded-lg transition-colors cursor-pointer font-forum"
                    >
                      Open in New Tab
                    </button>
                  </div>
                </>
              ) : (
                /* Image Display */
                <div className="w-full h-full flex items-center justify-center">
                  <div className="relative w-full h-full">
                    <Image
                      src={additionalImageUrl || image}
                      alt={title}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
