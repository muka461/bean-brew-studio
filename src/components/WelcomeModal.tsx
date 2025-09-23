import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('bb_visited');
    if (!hasVisited) {
      // Show modal after a brief delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeModal = () => {
    setIsOpen(false);
    localStorage.setItem('bb_visited', 'true');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
    >
      <div className="relative bg-card p-8 rounded-lg max-w-md mx-4 shadow-strong animate-in zoom-in-95 duration-300">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close welcome offer"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="text-center">
          <h2 id="welcome-title" className="font-heading text-2xl font-bold bb-text-gradient mb-4">
            Welcome to Bean Boutique!
          </h2>
          <p className="text-muted-foreground mb-6">
            Get 10% off your first order with code <span className="font-semibold text-primary">WELCOME10</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={closeModal}
              className="bb-button-primary flex-1"
            >
              Start Shopping
            </Button>
            <Button 
              onClick={closeModal}
              variant="outline"
              className="flex-1"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}