import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Search, ShoppingCart, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Fuse from 'fuse.js';
import gsap from 'gsap';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const coffeeData = [
  {
    id: 'ethiopia-gedeb',
    name: 'Ethiopia Gedeb',
    origin: 'Ethiopia',
    roast: 'Light',
    notes: 'Bergamot, jasmine, peach',
    method: 'Pour-over',
    price: 12.5,
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=400&q=80',
    description: 'A delicate and floral coffee with bright acidity and complex fruit notes.'
  },
  {
    id: 'colombia-huila',
    name: 'Colombia Huila',
    origin: 'Colombia',
    roast: 'Medium',
    notes: 'Caramel, apple, cocoa',
    method: 'Drip',
    price: 11.5,
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=400&q=80',
    description: 'A well-balanced coffee with sweet caramel notes and a smooth finish.'
  },
  {
    id: 'kenya-aa',
    name: 'Kenya AA',
    origin: 'Kenya',
    roast: 'Medium-Light',
    notes: 'Blackcurrant, citrus, honey',
    method: 'AeroPress',
    price: 13.0,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80',
    description: 'Bold and vibrant with distinctive blackcurrant notes and bright acidity.'
  },
  {
    id: 'brazil-santos',
    name: 'Brazil Santos',
    origin: 'Brazil',
    roast: 'Medium-Dark',
    notes: 'Chocolate, nuts, vanilla',
    method: 'Espresso',
    price: 10.5,
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=400&q=80',
    description: 'Rich and full-bodied with chocolatey sweetness, perfect for espresso.'
  },
  {
    id: 'guatemala-antigua',
    name: 'Guatemala Antigua',
    origin: 'Guatemala',
    roast: 'Medium',
    notes: 'Spice, orange, dark chocolate',
    method: 'French Press',
    price: 12.0,
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=400&q=80',
    description: 'Complex and spicy with citrus brightness and chocolate undertones.'
  },
  {
    id: 'costa-rica-tarrazu',
    name: 'Costa Rica Tarrazú',
    origin: 'Costa Rica',
    roast: 'Light-Medium',
    notes: 'Lemon, honey, almond',
    method: 'V60',
    price: 13.5,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80',
    description: 'Bright and clean with citrus acidity and nutty sweetness.'
  }
];

export default function CoffeePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCoffees, setFilteredCoffees] = useState(coffeeData);
  const [resultsCount, setResultsCount] = useState(coffeeData.length);
  const gridRef = useRef<HTMLDivElement>(null);
  const fuse = useRef<Fuse<typeof coffeeData[0]>>();

  useEffect(() => {
    // Initialize Fuse.js for fuzzy search
    fuse.current = new Fuse(coffeeData, {
      keys: ['name', 'origin', 'notes', 'method', 'roast'],
      threshold: 0.35,
      includeScore: true
    });
  }, []);

  useEffect(() => {
    // Animate cards on mount
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion && gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.coffee-card');
      gsap.set(cards, { opacity: 0, y: 30, scale: 0.95 });
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out'
      });
    }
  }, [filteredCoffees]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    
    if (!value.trim()) {
      setFilteredCoffees(coffeeData);
      setResultsCount(coffeeData.length);
      return;
    }

    if (fuse.current) {
      const results = fuse.current.search(value);
      const filtered = results.map(result => result.item);
      
      // Animate search results
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (!prefersReducedMotion && gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.coffee-card');
        
        // Fade out existing cards
        gsap.to(cards, {
          opacity: 0,
          scale: 0.95,
          duration: 0.2,
          onComplete: () => {
            setFilteredCoffees(filtered);
            setResultsCount(filtered.length);
          }
        });
      } else {
        setFilteredCoffees(filtered);
        setResultsCount(filtered.length);
      }
    }
  };

  const addToCart = (coffee: typeof coffeeData[0]) => {
    const cart = JSON.parse(localStorage.getItem('bb_cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === coffee.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...coffee, quantity: 1 });
    }
    
    localStorage.setItem('bb_cart', JSON.stringify(cart));
    
    // Dispatch custom event to update cart count
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    // Show success message (you could use a toast here)
    console.log(`Added ${coffee.name} to cart`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Coffee Selection
            </h1>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Discover exceptional single-origin coffees from around the world
            </p>
          </div>
        </div>
      </section>

      {/* Featured Coffee Carousel */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-center mb-12 bb-text-gradient">
            Featured Beans
          </h2>
          
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
            className="featured-swiper"
          >
            {coffeeData.slice(0, 4).map((coffee) => (
              <SwiperSlide key={coffee.id}>
                <div className="bb-card text-center">
                  <img
                    src={coffee.image}
                    alt={coffee.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-heading text-xl font-semibold mb-2">{coffee.name}</h3>
                  <p className="text-muted-foreground mb-2">{coffee.origin} • {coffee.roast}</p>
                  <p className="text-sm text-muted-foreground mb-4">{coffee.notes}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-lg">£{coffee.price}</span>
                    <Button
                      onClick={() => addToCart(coffee)}
                      className="bb-button-primary"
                      size="sm"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search by name, origin, notes, or brewing method..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
                id="searchProducts"
              />
            </div>
            <div className="mt-4 text-center">
              <span 
                id="resultsCount" 
                className="text-muted-foreground"
                role="status" 
                aria-live="polite"
              >
                Showing {resultsCount} of {coffeeData.length} coffees
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Coffee Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {filteredCoffees.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="font-heading text-2xl font-semibold mb-4">No coffees found</h3>
              <p className="text-muted-foreground mb-8">
                Try adjusting your search terms or browse all our coffees
              </p>
              <Button 
                onClick={() => handleSearch('')}
                className="bb-button-primary"
              >
                View All Coffees
              </Button>
            </div>
          ) : (
            <div 
              ref={gridRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredCoffees.map((coffee) => (
                <div key={coffee.id} className="coffee-card bb-card">
                  <div className="relative mb-4">
                    <img
                      src={coffee.image}
                      alt={`${coffee.name} coffee beans`}
                      className="w-full h-48 object-cover rounded-lg"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-sm font-medium">
                      {coffee.roast}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-heading text-xl font-semibold">{coffee.name}</h3>
                      <p className="text-muted-foreground">{coffee.origin}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-primary mb-1">Tasting Notes</p>
                      <p className="text-sm text-muted-foreground">{coffee.notes}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-primary mb-1">Best for</p>
                      <p className="text-sm text-muted-foreground">{coffee.method}</p>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{coffee.description}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="font-semibold text-xl">£{coffee.price}</span>
                      <Button
                        onClick={() => addToCart(coffee)}
                        className="bb-button-primary"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}