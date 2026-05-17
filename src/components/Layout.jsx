import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Coins } from 'lucide-react';

export function Layout({ children, lastUpdated }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { label: "Today's Rates", path: '/', icon: '📊' },
        { label: 'Compare', path: '/compare', icon: '📈' },
        { label: 'Analytics', path: '/analytics', icon: '📉' },
        { label: 'My Gold', path: '/mygold', icon: '💰' },
        { label: 'Sold History', path: '/sold', icon: '📋' }
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-bg-secondary">
            {/* Desktop Sidebar */}
            <div className="hidden lg:fixed lg:top-0 lg:left-0 lg:w-64 lg:h-screen lg:bg-gradient-to-b lg:from-primary lg:via-primary lg:to-primary-dark lg:text-white lg:flex lg:flex-col lg:p-6 lg:shadow-lg">
                {/* Logo */}
                <div className="mb-8 pb-6 border-b border-white/20">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gold rounded-lg flex items-center justify-center text-2xl shadow-lg">
                            🪙
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">PNG Gold</h1>
                            <p className="text-xs text-white/70">Tracker</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-white/80">Live Updates</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2 mb-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${isActive(item.path)
                                ? 'bg-white/25 text-white shadow-md border-l-4 border-gold'
                                : 'text-white/70 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Last Updated */}
                {lastUpdated && (
                    <div className="text-xs text-white/80 p-4 bg-white/10 rounded-lg border border-white/20">
                        <div className="font-bold mb-2">Last Updated</div>
                        <div className="font-mono text-white/70">{lastUpdated}</div>
                    </div>
                )}
            </div>

            {/* Mobile Header */}
            <div className="lg:hidden sticky top-0 z-50 bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center text-lg">
                            🪙
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">PNG Gold</h1>
                        </div>
                    </div>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 hover:bg-white/20 rounded-lg transition"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Nav Menu */}
                {mobileMenuOpen && (
                    <div className="border-t border-white/20 bg-primary-dark/50">
                        <div className="flex flex-col p-2 gap-1 max-h-96 overflow-y-auto">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition ${isActive(item.path)
                                        ? 'bg-white text-primary'
                                        : 'text-white hover:bg-white/20'
                                        }`}
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <main className="lg:ml-64 min-h-screen">
                <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto pb-24 lg:pb-0">
                    {children}
                </div>
            </main>
        </div>
    );
}
