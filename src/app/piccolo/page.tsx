'use client';


import { PublicFooter } from '@/components/common/PublicFooter';
import { useTranslation } from '@/contexts/LanguageContext';
import PdfViewer from '@/components/PdfViewer';
import Image from 'next/image';

export default function PiccoloPage() {
    const { t } = useTranslation();
    const pdfPath = '/assets/Menu complet 03-12.pdf';

    return (
        <div className="min-h-screen bg-[#000000] text-white overflow-x-hidden w-full max-w-full flex flex-col">
            {/* Fixed Reservation Button */}
            <div className="fixed bottom-2 right-2 z-[9999] pointer-events-auto flex items-end justify-end">
                <a
                    href="https://widget.thefork.com/en/46f7a53e-30fb-4d0b-a4f3-9242e1455b71?step=date"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-auto px-4 py-3 rounded-full flex items-center justify-center text-[#FFF2CC] text-base font-semibold transform hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap hover:opacity-90 font-forum"
                    style={{ backgroundColor: '#F34A23' }}
                >
                    <Image
                        src="/icons/Ochel logo white.png"
                        alt="Logo"
                        width={24}
                        height={24}
                        className="w-6 h-6 object-contain"
                    />
                    <div className="w-px h-6 bg-[#FFF2CC] mx-3"></div>
                    Réserver une table
                </a>
            </div>

            {/* Main Content */}
            <main className="flex-grow pt-12 px-4 md:px-8 pb-12">
                <div className="max-w-7xl mx-auto flex flex-col items-center">
                    <h1 className="font-eb-garamond text-4xl md:text-6xl text-center mb-4 text-[#FFF2CC]">
                        Piccolo Magnifiko
                    </h1>
                    <div className="mb-4">
                        <Image
                            src="/icons/halal certificate logo.png"
                            alt="Halal Certificate"
                            width={100}
                            height={100}
                            className="object-contain"
                        />
                    </div>
                    <p className="font-forum text-xl text-center mb-8 text-[#EAEAEA]">
                        60 Rue Jean-Baptiste Pigalle, 75009 Paris
                    </p>

                    <div className="w-full max-w-4xl flex flex-col items-center gap-8">
                        {/* PDF Viewer */}
                        <div className="w-full">
                            <PdfViewer file={pdfPath} />
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <PublicFooter />
        </div>
    );
}
