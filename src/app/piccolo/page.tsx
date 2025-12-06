'use client';


import { Navigation } from '@/components/layout';
import { PublicFooter } from '@/components/common/PublicFooter';
import { useTranslation } from '@/contexts/LanguageContext';
import PdfViewer from '@/components/PdfViewer';
import Image from 'next/image';

export default function PiccoloPage() {
    const { t } = useTranslation();
    const pdfPath = '/assets/Menu complet 03-12.pdf';

    return (
        <div className="min-h-screen bg-[#000000] text-white overflow-x-hidden w-full max-w-full flex flex-col">
            {/* Navigation */}
            <Navigation
                logo={{
                    src: "/icons/MagnifikoLogo.png",
                    alt: "Magnifiko Restaurant",
                    width: 50,
                    height: 17
                }}
            />

            {/* Main Content */}
            <main className="flex-grow pt-32 px-4 md:px-8 pb-12">
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
