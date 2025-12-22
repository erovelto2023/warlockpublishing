import React from 'react';
import { EbookSalesPage } from './EbookSalesPage';

interface EbookTemplateRendererProps {
    contentData: any;
}

export function EbookTemplateRenderer({ contentData }: EbookTemplateRendererProps) {
    return <EbookSalesPage data={contentData} />;
}
