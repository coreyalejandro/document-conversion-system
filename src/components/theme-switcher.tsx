'use client';

import { useState } from 'react';
import { Palette, ChevronDown } from 'lucide-react';
import { useTracking } from '@/telemetry/tracking';
import { ThemeType } from '@/types';

interface ThemeSwitcherProps {
  currentTheme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
}

const themes = [
  {
    id: 'material3-dark' as ThemeType,
    name: 'Material 3 Dark',
    description: 'Google Material Design 3 dark theme',
    preview: 'bg-gradient-to-br from-gray-900 to-gray-800',
  },
  {
    id: 'carbon-dark' as ThemeType,
    name: 'IBM Carbon Dark',
    description: 'IBM Carbon design system dark theme',
    preview: 'bg-gradient-to-br from-gray-800 to-gray-900',
  },
  {
    id: 'shadcn-dark' as ThemeType,
    name: 'shadcn/ui Dark',
    description: 'shadcn/ui design system dark theme',
    preview: 'bg-gradient-to-br from-slate-900 to-slate-800',
  },
  {
    id: 'material3-light' as ThemeType,
    name: 'Material 3 Light',
    description: 'Google Material Design 3 light theme',
    preview: 'bg-gradient-to-br from-gray-50 to-gray-100',
  },
  {
    id: 'carbon-light' as ThemeType,
    name: 'IBM Carbon Light',
    description: 'IBM Carbon design system light theme',
    preview: 'bg-gradient-to-br from-gray-100 to-gray-200',
  },
  {
    id: 'shadcn-light' as ThemeType,
    name: 'shadcn/ui Light',
    description: 'shadcn/ui design system light theme',
    preview: 'bg-gradient-to-br from-slate-50 to-slate-100',
  },
];

export function ThemeSwitcher({ currentTheme, onThemeChange }: ThemeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tracking = useTracking();

  const currentThemeData = themes.find(theme => theme.id === currentTheme);

  const handleThemeChange = (theme: ThemeType) => {
    onThemeChange(theme);
    setIsOpen(false);
    
    tracking.trackEvent({
      type: 'user.preference',
      action: 'theme_changed',
      details: {
        oldTheme: currentTheme,
        newTheme: theme,
      },
      sessionId: tracking.getSessionId(),
      userId: tracking.getUserId(),
      documentId: 'system',
    });
  };

  return (
    <div className="theme-switcher">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 bg-card border border-border rounded-lg px-4 py-2 hover:bg-muted/50 transition-colors"
          aria-label="Switch theme"
        >
          <Palette className="h-5 w-5" />
          <span className="hidden sm:block text-sm font-medium">
            {currentThemeData?.name}
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">Choose Theme</h3>
              <div className="grid grid-cols-1 gap-3">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                      currentTheme === theme.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded ${theme.preview} border border-border`} />
                    <div className="flex-1 text-left">
                      <div className="font-medium text-foreground">{theme.name}</div>
                      <div className="text-sm text-muted-foreground">{theme.description}</div>
                    </div>
                    {currentTheme === theme.id && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
