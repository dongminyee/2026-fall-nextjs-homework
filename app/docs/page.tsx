"use client";

import { useEffect } from 'react';

export default function DocsPage() {
    useEffect(() => {
        const css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.min.css';
        document.head.appendChild(css);

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js';
        script.onload = () => {
            // @ts-expect-error - provided by swagger-ui bundle on window
            if (window.SwaggerUIBundle) {
                // @ts-expect-error - provided by swagger-ui bundle on window
                window.SwaggerUIBundle({ url: '/api/openapi', dom_id: '#swagger-ui' });
            }
        };
        document.body.appendChild(script);

        return () => {
            css.remove();
            script.remove();
        };
    }, []);

    return <div id="swagger-ui" style={{ minHeight: '100vh' }} />;
}
