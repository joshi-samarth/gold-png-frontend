module.exports = {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            colors: {
                // Primary Gradient Blues
                primary: '#2563eb',
                'primary-dark': '#1e40af',
                'primary-light': '#dbeafe',
                'primary-bg': '#f0f9ff',

                // Gold/Amber Accent
                gold: '#f59e0b',
                'gold-dark': '#d97706',
                'gold-light': '#fef3c7',
                'gold-bg': '#fffbeb',

                // Success Green
                success: '#10b981',
                'success-dark': '#059669',
                'success-light': '#d1fae5',
                'success-bg': '#f0fdf4',

                // Danger Red
                danger: '#ef4444',
                'danger-dark': '#dc2626',
                'danger-light': '#fee2e2',
                'danger-bg': '#fef2f2',

                // Neutral
                text: '#1f2937',
                'text-light': '#4b5563',
                'text-muted': '#6b7280',
                'text-subtle': '#9ca3af',
                border: '#e5e7eb',
                'border-light': '#f3f4f6',
                'bg': '#ffffff',
                'bg-secondary': '#f9fafb',
                'bg-tertiary': '#f3f4f6'
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['DM Mono', 'monospace']
            },
            borderRadius: {
                sm: '6px',
                DEFAULT: '12px',
                lg: '16px',
                xl: '20px',
                button: '10px'
            },
            boxShadow: {
                xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                sm: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
                card: '0 4px 12px 0 rgba(0, 0, 0, 0.08)',
                md: '0 8px 16px 0 rgba(0, 0, 0, 0.1)',
                lg: '0 12px 24px 0 rgba(0, 0, 0, 0.12)',
                xl: '0 20px 40px 0 rgba(0, 0, 0, 0.15)'
            },
            spacing: {
                safe: 'max(1.5rem, env(safe-area-inset-bottom))'
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in',
                'slide-up': 'slideUp 0.3s ease-out'
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' }
                }
            }
        }
    },
    plugins: []
};
