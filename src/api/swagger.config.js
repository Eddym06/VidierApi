/**
 * Custom Swagger UI Configuration
 * Modern, professional theme with enhanced UX
 */

const swaggerUiOptions = {
    customCss: `
        /* ====================================
           MODERN SWAGGER UI CUSTOMIZATION
           ==================================== */
        
        /* === Variables CSS === */
        :root {
            --primary-color: #6366f1;
            --primary-dark: #4f46e5;
            --primary-light: #818cf8;
            --success-color: #10b981;
            --error-color: #ef4444;
            --warning-color: #f59e0b;
            --background-color: #f9fafb;
            --card-background: #ffffff;
            --text-primary: #1f2937;
            --text-secondary: #6b7280;
            --border-color: #e5e7eb;
            --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        /* === General Styles === */
        body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            background-attachment: fixed;
        }
        
        .swagger-ui {
            max-width: 1400px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        /* === Header === */
        .swagger-ui .info {
            background: var(--card-background);
            padding: 40px;
            border-radius: 16px;
            box-shadow: var(--shadow-lg);
            margin-bottom: 30px;
            border: 1px solid var(--border-color);
        }
        
        .swagger-ui .info .title {
            font-size: 3rem;
            color: var(--primary-color);
            font-weight: 800;
            margin-bottom: 20px;
            background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .swagger-ui .info .description {
            font-size: 1.1rem;
            line-height: 1.8;
            color: var(--text-secondary);
        }
        
        .swagger-ui .info .description h2 {
            color: var(--primary-dark);
            font-weight: 700;
            margin-top: 30px;
            margin-bottom: 15px;
            font-size: 1.5rem;
        }
        
        .swagger-ui .info .description h3 {
            color: var(--text-primary);
            font-weight: 600;
            margin-top: 25px;
            margin-bottom: 12px;
            font-size: 1.2rem;
        }
        
        .swagger-ui .info .description ul {
            padding-left: 20px;
        }
        
        .swagger-ui .info .description li {
            margin: 8px 0;
        }
        
        /* === Operations === */
        .swagger-ui .opblock {
            background: var(--card-background);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            margin-bottom: 20px;
            box-shadow: var(--shadow);
            transition: all 0.3s ease;
        }
        
        .swagger-ui .opblock:hover {
            box-shadow: var(--shadow-lg);
            transform: translateY(-2px);
        }
        
        .swagger-ui .opblock.is-open {
            box-shadow: var(--shadow-lg);
        }
        
        /* === HTTP Methods === */
        .swagger-ui .opblock.opblock-post {
            border-left: 5px solid var(--success-color);
        }
        
        .swagger-ui .opblock.opblock-get {
            border-left: 5px solid var(--primary-color);
        }
        
        .swagger-ui .opblock.opblock-delete {
            border-left: 5px solid var(--error-color);
        }
        
        .swagger-ui .opblock.opblock-put {
            border-left: 5px solid var(--warning-color);
        }
        
        .swagger-ui .opblock .opblock-summary {
            padding: 20px;
            border: none;
        }
        
        .swagger-ui .opblock .opblock-summary-method {
            font-weight: 700;
            font-size: 0.9rem;
            padding: 8px 16px;
            border-radius: 8px;
            min-width: 80px;
            text-align: center;
        }
        
        .swagger-ui .opblock-post .opblock-summary-method {
            background: var(--success-color);
        }
        
        .swagger-ui .opblock-get .opblock-summary-method {
            background: var(--primary-color);
        }
        
        .swagger-ui .opblock-delete .opblock-summary-method {
            background: var(--error-color);
        }
        
        .swagger-ui .opblock .opblock-summary-path {
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 1rem;
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .swagger-ui .opblock .opblock-summary-description {
            font-size: 0.95rem;
            color: var(--text-secondary);
        }
        
        /* === Tags === */
        .swagger-ui .opblock-tag {
            border-bottom: 3px solid var(--primary-color);
            margin-top: 40px;
            margin-bottom: 20px;
            padding-bottom: 15px;
        }
        
        .swagger-ui .opblock-tag-section {
            background: var(--card-background);
            padding: 30px;
            border-radius: 16px;
            margin-bottom: 30px;
            box-shadow: var(--shadow);
        }
        
        .swagger-ui .opblock-tag span {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--primary-dark);
        }
        
        .swagger-ui .opblock-tag small {
            font-size: 1rem;
            color: var(--text-secondary);
            margin-left: 15px;
        }
        
        /* === Buttons === */
        .swagger-ui .btn {
            border-radius: 8px;
            padding: 10px 20px;
            font-weight: 600;
            transition: all 0.2s ease;
            border: none;
        }
        
        .swagger-ui .btn:hover {
            transform: translateY(-1px);
            box-shadow: var(--shadow);
        }
        
        .swagger-ui .btn.execute {
            background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
            color: white;
            font-size: 1rem;
            padding: 12px 30px;
        }
        
        .swagger-ui .btn.execute:hover {
            background: linear-gradient(135deg, var(--primary-dark), var(--primary-color));
        }
        
        .swagger-ui .btn.try-out__btn {
            background: var(--success-color);
            color: white;
        }
        
        .swagger-ui .btn.cancel {
            background: var(--error-color);
            color: white;
        }
        
        /* === Responses === */
        .swagger-ui .responses-wrapper {
            margin-top: 20px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        .swagger-ui .response-col_status {
            font-weight: 700;
            font-size: 1.1rem;
        }
        
        .swagger-ui .response .response-col_status.response-200 {
            color: var(--success-color);
        }
        
        .swagger-ui .response .response-col_status.response-400,
        .swagger-ui .response .response-col_status.response-404 {
            color: var(--error-color);
        }
        
        /* === Code Blocks === */
        .swagger-ui pre {
            background: #282c34;
            border-radius: 8px;
            padding: 20px;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 0.9rem;
        }
        
        .swagger-ui .highlight-code {
            background: #282c34;
        }
        
        .swagger-ui .microlight {
            color: #abb2bf;
        }
        
        /* === Models === */
        .swagger-ui .model-box {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
        }
        
        .swagger-ui .model-title {
            color: var(--primary-dark);
            font-weight: 600;
        }
        
        .swagger-ui .model {
            font-family: 'Monaco', 'Courier New', monospace;
        }
        
        /* === Parameters === */
        .swagger-ui .parameters {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 15px 0;
        }
        
        .swagger-ui .parameter__name {
            font-weight: 700;
            color: var(--primary-dark);
        }
        
        .swagger-ui .parameter__type {
            color: var(--success-color);
            font-family: 'Monaco', 'Courier New', monospace;
        }
        
        .swagger-ui .parameter__required {
            color: var(--error-color);
            font-weight: 600;
        }
        
        /* === Tables === */
        .swagger-ui table {
            border-radius: 8px;
            overflow: hidden;
        }
        
        .swagger-ui table thead tr th {
            background: var(--primary-color);
            color: white;
            font-weight: 600;
            padding: 15px;
        }
        
        .swagger-ui table tbody tr td {
            padding: 12px 15px;
        }
        
        .swagger-ui table tbody tr:nth-child(even) {
            background: #f8f9fa;
        }
        
        /* === Authorization === */
        .swagger-ui .auth-wrapper {
            background: var(--card-background);
            border-radius: 12px;
            padding: 25px;
            box-shadow: var(--shadow);
        }
        
        .swagger-ui .auth-btn-wrapper {
            padding: 15px 0;
        }
        
        /* === Try it out === */
        .swagger-ui .try-out {
            background: #f0fdf4;
            border-left: 4px solid var(--success-color);
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
        }
        
        /* === Loading === */
        .swagger-ui .loading-container {
            padding: 40px;
            text-align: center;
        }
        
        .swagger-ui .loading-container:before {
            content: "⏳ Cargando documentación...";
            font-size: 1.2rem;
            color: var(--primary-color);
        }
        
        /* === Scrollbar === */
        .swagger-ui ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }
        
        .swagger-ui ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        
        .swagger-ui ::-webkit-scrollbar-thumb {
            background: var(--primary-color);
            border-radius: 10px;
        }
        
        .swagger-ui ::-webkit-scrollbar-thumb:hover {
            background: var(--primary-dark);
        }
        
        /* === Topbar === */
        .swagger-ui .topbar {
            background: linear-gradient(135deg, var(--primary-dark), var(--primary-color));
            padding: 20px 0;
            box-shadow: var(--shadow-lg);
        }
        
        .swagger-ui .topbar .wrapper {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        .swagger-ui .topbar .link {
            display: none;
        }
        
        /* === Dark Mode Support === */
        @media (prefers-color-scheme: dark) {
            :root {
                --background-color: #111827;
                --card-background: #1f2937;
                --text-primary: #f9fafb;
                --text-secondary: #d1d5db;
                --border-color: #374151;
            }
            
            body {
                background: linear-gradient(135deg, #1e3a8a 0%, #581c87 100%);
            }
            
            .swagger-ui .opblock {
                background: var(--card-background);
                border-color: var(--border-color);
            }
            
            .swagger-ui .info {
                background: var(--card-background);
                border-color: var(--border-color);
            }
            
            .swagger-ui .parameters {
                background: #111827;
            }
            
            .swagger-ui .responses-wrapper {
                background: #111827;
            }
            
            .swagger-ui .model-box {
                background: #111827;
            }
            
            .swagger-ui table tbody tr:nth-child(even) {
                background: #111827;
            }
        }
        
        /* === Responsive === */
        @media (max-width: 768px) {
            .swagger-ui .info .title {
                font-size: 2rem;
            }
            
            .swagger-ui .opblock-tag span {
                font-size: 1.5rem;
            }
            
            .swagger-ui {
                padding: 20px 10px;
            }
            
            .swagger-ui .info {
                padding: 25px 20px;
            }
        }
        
        /* === Animations === */
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .swagger-ui .opblock {
            animation: slideIn 0.3s ease-out;
        }
        
        /* === Custom Badges === */
        .swagger-ui .info .description code {
            background: #e0e7ff;
            color: var(--primary-dark);
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 0.9em;
            font-weight: 600;
        }
        
        @media (prefers-color-scheme: dark) {
            .swagger-ui .info .description code {
                background: #312e81;
                color: #c7d2fe;
            }
        }
    `,
    customSiteTitle: "VidierApi API - Documentación Interactiva",
    customfavIcon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎬</text></svg>",
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        syntaxHighlight: {
            activate: true,
            theme: "monokai"
        },
        tryItOutEnabled: true,
        requestSnippetsEnabled: true,
        docExpansion: 'list',
        defaultModelsExpandDepth: 3,
        defaultModelExpandDepth: 3,
        displayOperationId: false,
        showExtensions: true,
        showCommonExtensions: true
    }
};

module.exports = swaggerUiOptions;
