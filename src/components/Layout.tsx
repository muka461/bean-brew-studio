import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Coffee, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { WelcomeModal } from './WelcomeModal';

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { label: 'Home', href: '/' },
  { label: 'Coffee', href: '/coffee' },
  { label: 'Equipment', href: '/equipment' },
  { label: 'Cart', href: '/cart' },
  { label: 'Events', href: '/events' },
  { label: 'Offers', href: '/offers' },
];

export function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    // Update cart count from localStorage
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('bb_cart') || '[]');
      const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount();
    
    // Listen for cart updates
    const handleStorageChange = () => updateCartCount();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen bg-background">
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bb-button-primary"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 text-2xl font-heading font-bold bb-text-gradient">
              <Coffee className="h-8 w-8 text-primary" />
              <span>Bean Boutique</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`relative font-medium transition-colors hover:text-primary ${
                    location.pathname === item.href
                      ? 'text-primary'
                      : 'text-foreground/80'
                  } after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left`}
                >
                  {item.label}
                  {item.label === 'Cart' && cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav
              id="mobile-menu"
              className="md:hidden py-4 border-t border-border"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <div className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center justify-between font-medium transition-colors hover:text-primary ${
                      location.pathname === item.href
                        ? 'text-primary'
                        : 'text-foreground/80'
                    }`}
                  >
                    {item.label}
                    {item.label === 'Cart' && cartCount > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" role="main" className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-heading font-semibold text-lg mb-4">Bean Boutique</h3>
              <p className="text-primary-foreground/80">
                Exceptional coffee, curated with care. Bringing you the world's finest beans and brewing equipment.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><Link to="/coffee" className="hover:text-primary-foreground transition-colors">Coffee</Link></li>
                <li><Link to="/equipment" className="hover:text-primary-foreground transition-colors">Equipment</Link></li>
                <li><Link to="/offers" className="hover:text-primary-foreground transition-colors">Subscriptions</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Learn</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><Link to="/events" className="hover:text-primary-foreground transition-colors">Events</Link></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Brewing Guide</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Coffee Education</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="space-y-4">
                <div className="text-primary-foreground/80">
                  <p>hello@beanboutique.example</p>
                  <p>+44 20 1234 5678</p>
                  <p>123 Coffee Street, London</p>
                </div>
                <div className="flex space-x-4">
                  <a 
                    href="https://facebook.com/beanboutique" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                    aria-label="Follow us on Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://instagram.com/beanboutique" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                    aria-label="Follow us on Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://twitter.com/beanboutique" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                    aria-label="Follow us on Twitter"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://youtube.com/beanboutique" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                    aria-label="Subscribe to our YouTube channel"
                  >
                    <Youtube className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
            <p>&copy; 2024 Bean Boutique. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Welcome Modal */}
      <WelcomeModal />
    </div>
  );
}