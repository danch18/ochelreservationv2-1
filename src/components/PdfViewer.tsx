'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
    file: File | string | null;
}

export default function PdfViewer({ file }: PdfViewerProps) {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [scale, setScale] = useState<number>(1.0);
    const [containerWidth, setContainerWidth] = useState<number>(800);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    function changeScale(delta: number) {
        setScale(prevScale => Math.max(0.5, Math.min(2.0, prevScale + delta)));
    }

    if (!file) {
        return (
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-[#4a3f35] rounded-lg bg-[#1F1F1F]">
                <p className="text-[#EAEAEA] font-forum text-lg">No PDF selected</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            {/* Document Container - Scrollable */}
            <div
                className="w-full max-h-[70vh] md:max-h-[800px] overflow-y-auto overflow-x-hidden bg-[#2A2A2A] p-2 md:p-4 rounded-lg border border-[#4a3f35] custom-scrollbar"
            >
                <div className="w-full flex justify-center" ref={(el) => {
                    if (el) {
                        setContainerWidth(el.clientWidth);
                    }
                }}>
                    <Document
                        file={file}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={
                            <div className="text-[#FFF2CC] font-forum text-xl animate-pulse mt-10">
                                Loading PDF...
                            </div>
                        }
                        error={
                            <div className="text-red-400 font-forum text-xl mt-10">
                                Failed to load PDF. Please try again.
                            </div>
                        }
                        className="flex flex-col items-center w-full gap-4"
                    >
                        {numPages && Array.from(new Array(numPages), (el, index) => (
                            <Page
                                key={`page_${index + 1}`}
                                pageNumber={index + 1}
                                scale={scale}
                                renderTextLayer={true}
                                renderAnnotationLayer={true}
                                className="shadow-xl max-w-full mb-4"
                                width={containerWidth ? containerWidth - 32 : 300}
                            />
                        ))}
                    </Document>
                </div>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2 p-2 md:p-3 bg-[#1F1F1F] rounded-lg border border-[#4a3f35]">
                <button
                    type="button"
                    onClick={() => changeScale(-0.1)}
                    className="px-3 md:px-4 py-2 bg-[#4a3f35] text-[#FFF2CC] text-sm md:text-base rounded hover:bg-[#5a4f45] font-forum"
                    title="Zoom Out"
                >
                    -
                </button>
                <span className="text-[#EAEAEA] font-forum w-16 md:w-20 text-center text-sm md:text-base">
                    {Math.round(scale * 100)}%
                </span>
                <button
                    type="button"
                    onClick={() => changeScale(0.1)}
                    className="px-3 md:px-4 py-2 bg-[#4a3f35] text-[#FFF2CC] text-sm md:text-base rounded hover:bg-[#5a4f45] font-forum"
                    title="Zoom In"
                >
                    +
                </button>
            </div>
        </div>
    );
}
