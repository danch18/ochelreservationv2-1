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
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.1);
    const [containerWidth, setContainerWidth] = useState<number>(800);
    const containerRef = useState<HTMLDivElement | null>(null);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    function changePage(offset: number) {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

    function changeScale(delta: number) {
        setScale(prevScale => Math.max(0.5, Math.min(2.0, prevScale + delta)));
    }

    // Handle resize
    const onResize = (entries: ResizeObserverEntry[]) => {
        const [entry] = entries;
        if (entry) {
            setContainerWidth(entry.contentRect.width);
        }
    };

    if (!file) {
        return (
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-[#4a3f35] rounded-lg bg-[#1F1F1F]">
                <p className="text-[#EAEAEA] font-forum text-lg">No PDF selected</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            {/* Document Container */}
            <div
                ref={(el) => {
                    if (el && el !== containerRef[0]) {
                        // Initialize ResizeObserver
                        const observer = new ResizeObserver(onResize);
                        observer.observe(el);
                        // Store ref and cleanup function if needed (though React handles ref updates)
                        // For simplicity in this functional component, we just let the observer run.
                        // Ideally we'd use useEffect but ref callback is also viable for simple element tracking.
                        // However, let's switch to a cleaner useEffect approach below for the observer.
                    }
                }}
                className="w-full max-w-4xl h-[60vh] md:h-[800px] overflow-y-auto overflow-x-hidden flex justify-center bg-[#2A2A2A] p-2 md:p-4 rounded-lg border border-[#4a3f35] custom-scrollbar"
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
                        className="flex flex-col items-center w-full"
                    >
                        <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            renderTextLayer={true}
                            renderAnnotationLayer={true}
                            className="shadow-xl max-w-full"
                            width={containerWidth ? Math.min(containerWidth, 800) : 300}
                        />
                    </Document>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 p-2 md:p-4 bg-[#1F1F1F] rounded-lg border border-[#4a3f35] w-full md:w-fit max-w-[90vw]">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        disabled={pageNumber <= 1}
                        onClick={previousPage}
                        className="px-2 md:px-4 py-2 bg-[#4a3f35] text-[#FFF2CC] text-sm md:text-base rounded hover:bg-[#5a4f45] disabled:opacity-50 disabled:cursor-not-allowed font-forum"
                    >
                        Previous
                    </button>
                    <span className="text-[#EAEAEA] font-forum text-sm md:text-base whitespace-nowrap">
                        Page {pageNumber || '--'} of {numPages || '--'}
                    </span>
                    <button
                        type="button"
                        disabled={pageNumber >= (numPages || 1)}
                        onClick={nextPage}
                        className="px-2 md:px-4 py-2 bg-[#4a3f35] text-[#FFF2CC] text-sm md:text-base rounded hover:bg-[#5a4f45] disabled:opacity-50 disabled:cursor-not-allowed font-forum"
                    >
                        Next
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => changeScale(-0.1)}
                        className="px-2 md:px-3 py-2 bg-[#4a3f35] text-[#FFF2CC] text-sm md:text-base rounded hover:bg-[#5a4f45] font-forum"
                        title="Zoom Out"
                    >
                        -
                    </button>
                    <span className="text-[#EAEAEA] font-forum w-12 md:w-16 text-center text-sm md:text-base">
                        {Math.round(scale * 100)}%
                    </span>
                    <button
                        type="button"
                        onClick={() => changeScale(0.1)}
                        className="px-2 md:px-3 py-2 bg-[#4a3f35] text-[#FFF2CC] text-sm md:text-base rounded hover:bg-[#5a4f45] font-forum"
                        title="Zoom In"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
}
