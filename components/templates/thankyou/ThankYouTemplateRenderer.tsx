import React from 'react';
import { ThankYouPage } from './ThankYouPage';

interface ThankYouTemplateRendererProps {
    contentData: any;
}

export function ThankYouTemplateRenderer({ contentData }: ThankYouTemplateRendererProps) {
    return <ThankYouPage data={contentData} />;
}
