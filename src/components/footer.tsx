'use client';

import { FileText, Github, Twitter, Mail } from 'lucide-react';
import { useTracking } from '@/telemetry/tracking';

export function Footer() {
  const tracking = useTracking();

  const handleLinkClick = (link: string) => {
    tracking.trackEvent({
      type: 'link.clicked',
      action: 'footer_link_clicked',
      details: {
        link,
      },
      sessionId: tracking.getSessionId(),
      userId: tracking.getUserId(),
      documentId: 'system',
    });
  };

  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">DocConvert</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Interactive Document Conversion System with Continuous Self-Improvement
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-semibold">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#features"
                  onClick={() => handleLinkClick('features')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  onClick={() => handleLinkClick('pricing')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#docs"
                  onClick={() => handleLinkClick('docs')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#api"
                  onClick={() => handleLinkClick('api')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  API
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#help"
                  onClick={() => handleLinkClick('help')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={() => handleLinkClick('contact')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#status"
                  onClick={() => handleLinkClick('status')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  System Status
                </a>
              </li>
              <li>
                <a
                  href="#feedback"
                  onClick={() => handleLinkClick('feedback')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Feedback
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#privacy"
                  onClick={() => handleLinkClick('privacy')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  onClick={() => handleLinkClick('terms')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#cookies"
                  onClick={() => handleLinkClick('cookies')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href="#accessibility"
                  onClick={() => handleLinkClick('accessibility')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Accessibility
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2024 DocConvert. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/coreyalejandro/document-conversion-system"
              onClick={() => handleLinkClick('github')}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com/docconvert"
              onClick={() => handleLinkClick('twitter')}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="mailto:contact@docconvert.com"
              onClick={() => handleLinkClick('email')}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
