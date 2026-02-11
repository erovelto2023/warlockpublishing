"use client";

import { useEffect, useRef } from 'react';

interface CodeInjectorProps {
    html: string;
}

export default function CodeInjector({ html }: CodeInjectorProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !html) return;

        // Clear existing content
        containerRef.current.innerHTML = html;

        // Find and execute all scripts within the injected HTML
        // This is necessary because setting innerHTML directly doesn't execute <script> tags
        const scripts = containerRef.current.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');

            // Copy all attributes
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });

            // Copy script content
            newScript.textContent = oldScript.textContent;

            // Replace old script with new one to trigger execution
            oldScript.parentNode?.replaceChild(newScript, oldScript);
        });
    }, [html]);

    return <div ref={containerRef} />;
}
