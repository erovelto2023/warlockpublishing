"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function BriefDownloadButton() {
    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Button 
                onClick={handlePrint}
                size="sm" 
                className="bg-slate-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider px-6 flex items-center gap-2 transition-all hover:scale-105 print:hidden"
            >
                <Download size={14} /> Download Brief
            </Button>
            
            {/* Print styles to make the brief look like a strategic PDF */}
            <style jsx global>{`
                @media print {
                    body {
                        background: white !important;
                        color: black !important;
                    }
                    nav, footer, .print-hidden, .random-products-section, .sidebar-content {
                        display: none !important;
                    }
                    .container {
                        width: 100% !important;
                        max-width: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .main-content {
                        width: 100% !important;
                        margin: 0 !important;
                    }
                    .card {
                        border: 1px solid #eee !important;
                        box-shadow: none !important;
                        page-break-inside: avoid;
                    }
                    h1 {
                        font-size: 32pt !important;
                        margin-top: 0 !important;
                    }
                    h2 {
                        font-size: 24pt !important;
                        border-bottom: 2px solid #6366f1 !important;
                        padding-bottom: 5pt !important;
                    }
                    .authority-article {
                        font-size: 12pt !important;
                        line-height: 1.6 !important;
                    }
                }
            `}</style>
        </>
    );
}
