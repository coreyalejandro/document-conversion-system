'use client';

import { useState } from 'react';
import { Menu, X, FileText, Settings, BarChart3 } from 'lucide-react';
import { useTracking } from '@/telemetry/tracking';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const tracking = useTracking();

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    tracking.trackEvent({
      type: 'ui.interaction',
      action: 'menu_toggled',
      details: {
        isOpen: !isMenuOpen,
      },
      sessionId: tracking.getSessionId(),
      userId: tracking.getUserId(),
      documentId: 'system',
    });
  };

  const handleNavClick = (section: string) => {
    tracking.trackEvent({
      type: 'navigation.clicked',
      action: 'nav_item_clicked',
      details: {
        section,
      },
      sessionId: tracking.getSessionId(),
      userId: tracking.getUserId(),
      documentId: 'system',
    });
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">DocConvert</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              onClick={() => handleNavClick('features')}
              className="text-foreground hover:text-primary transition-colors"
            >
              Features
            </a>
            <a
              href="#docs"
              onClick={() => handleNavClick('docs')}
              className="text-foreground hover:text-primary transition-colors"
            >
              Documentation
            </a>
            <a
              href="#about"
              onClick={() => handleNavClick('about')}
              className="text-foreground hover:text-primary transition-colors"
            >
              About
            </a>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleNavClick('analytics')}
              className="hidden md:flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
            >
              <BarChart3 className="h-5 w-5" />
              <span>Analytics</span>
            </button>
            
            <button
              onClick={() => handleNavClick('settings')}
              className="hidden md:flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={handleMenuToggle}
              className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col space-y-4">
              <a
                href="#features"
                onClick={() => handleNavClick('features')}
                className="text-foreground hover:text-primary transition-colors"
              >
                Features
              </a>
              <a
                href="#docs"
                onClick={() => handleNavClick('docs')}
                className="text-foreground hover:text-primary transition-colors"
              >
                Documentation
              </a>
              <a
                href="#about"
                onClick={() => handleNavClick('about')}
                className="text-foreground hover:text-primary transition-colors"
              >
                About
              </a>
              <div className="flex items-center space-x-2 text-foreground">
                <BarChart3 className="h-5 w-5" />
                <span>Analytics</span>
              </div>
              <div className="flex items-center space-x-2 text-foreground">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
