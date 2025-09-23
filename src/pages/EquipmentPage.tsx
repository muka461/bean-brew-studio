import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';

const equipmentData = [
  {
    id: 'v60',
    name: 'Hario V60',
    category: 'Brewers',
    tip: 'Use 1:15 ratio at 92–96°C',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80',
    description: 'The iconic pour-over dripper that delivers clean, bright coffee with excellent clarity.'
  },
  {
    id: 'aeropress',
    name: 'AeroPress',
    category: 'Brewers',
    tip: 'Inverted method for richer body',
    price: 24.5,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80',
    description: 'Versatile brewing device that produces smooth, full-bodied coffee with minimal cleanup.'
  },
  {
    id: 'french-press',
    name: 'French Press',
    category: 'Brewers',
    tip: 'Coarse grind, 4-minute steep',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80',
    description: 'Classic immersion brewer for rich, full-bodied coffee with natural oils and sediment.'
  },
  {
    id: 'burr-grinder',
    name: 'Burr Coffee Grinder',
    category: 'Grinders',
    tip: 'Consistent grind for better extraction',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=400&q=80',
    description: 'Professional-grade burr grinder for uniform particle size and optimal flavor extraction.'
  },
  {
    id: 'gooseneck-kettle',
    name: 'Gooseneck Kettle',
    category: 'Kettles',
    tip: 'Perfect pour control for pour-over',
    price: 45.99,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80',
    description: 'Precision pouring kettle with temperature control for perfect extraction.'
  },
  {
    id: 'digital-scale',
    name: 'Digital Coffee Scale',
    category: 'Scales',
    tip: 'Accurate timing and measurements',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=400&q=80',
    description: 'Precision scale with built-in timer for consistent brewing ratios.'
  },
  {
    id: 'espresso-machine',
    name: 'Home Espresso Machine',
    category: 'Espresso',
    tip: '15-bar pressure for perfect crema',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=400&q=80',
    description: 'Semi-automatic espresso machine for café-quality espresso at home.'
  },
  {
    id: 'milk-frother',
    name: 'Milk Frother',
    category: 'Espresso',
    tip: 'Steam wand technique for microfoam',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80',
    description: 'Professional milk frother for silky smooth microfoam and latte art.'
  }
];

const categories = ['All', 'Brewers', 'Grinders', 'Kettles', 'Scales', 'Espresso'];

export default function EquipmentPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredEquipment, setFilteredEquipment] = useState(equipmentData);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredEquipment(equipmentData);
    } else {
      setFilteredEquipment(equipmentData.filter(item => item.category === selectedCategory));
    }
  }, [selectedCategory]);

  useEffect(() => {
    // Animate cards when filter changes
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion && gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.equipment-card');
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
  }, [filteredEquipment]);

  const addToCart = (equipment: typeof equipmentData[0]) => {
    const cart = JSON.parse(localStorage.getItem('bb_cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === equipment.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...equipment, quantity: 1 });
    }
    
    localStorage.setItem('bb_cart', JSON.stringify(cart));
    
    // Dispatch custom event to update cart count
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    // Show success message (you could use a toast here)
    console.log(`Added ${equipment.name} to cart`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bb-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Brewing Equipment
            </h1>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Professional-grade tools for the perfect brew at home
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`${selectedCategory === category ? 'bb-button-primary' : 'bb-button-secondary'}`}
              >
                <Filter className="w-4 h-4 mr-2" />
                {category}
              </Button>
            ))}
          </div>
          
          <div className="text-center mt-4">
            <span className="text-muted-foreground">
              Showing {filteredEquipment.length} {selectedCategory === 'All' ? 'items' : selectedCategory.toLowerCase()}
            </span>
          </div>
        </div>
      </section>

      {/* Equipment Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {filteredEquipment.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="font-heading text-2xl font-semibold mb-4">No equipment found</h3>
              <p className="text-muted-foreground mb-8">
                Try selecting a different category
              </p>
              <Button 
                onClick={() => setSelectedCategory('All')}
                className="bb-button-primary"
              >
                View All Equipment
              </Button>
            </div>
          ) : (
            <div 
              ref={gridRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredEquipment.map((equipment) => (
                <div key={equipment.id} className="equipment-card bb-card group">
                  <div className="relative mb-4 overflow-hidden rounded-lg">
                    <img
                      src={equipment.image}
                      alt={`${equipment.name} brewing equipment`}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-medium">
                      {equipment.category}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-heading text-lg font-semibold">{equipment.name}</h3>
                      <p className="text-sm text-muted-foreground">{equipment.category}</p>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{equipment.description}</p>
                    
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-xs font-medium text-primary mb-1">Pro Tip</p>
                      <p className="text-xs text-muted-foreground">{equipment.tip}</p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="font-semibold text-lg">£{equipment.price}</span>
                      <Button
                        onClick={() => addToCart(equipment)}
                        className="bb-button-primary"
                        size="sm"
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

      {/* Equipment Guide Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 bb-text-gradient">
              Need Help Choosing?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our equipment guide helps you select the perfect brewing setup for your taste preferences and experience level.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bb-card text-center">
                <h3 className="font-heading text-xl font-semibold mb-4">Beginner</h3>
                <p className="text-muted-foreground mb-4">
                  Start with simple, forgiving methods like French Press or AeroPress
                </p>
                <p className="text-sm text-primary font-medium">Budget: £30-50</p>
              </div>
              
              <div className="bb-card text-center">
                <h3 className="font-heading text-xl font-semibold mb-4">Intermediate</h3>
                <p className="text-muted-foreground mb-4">
                  Add precision with V60, scale, and temperature-controlled kettle
                </p>
                <p className="text-sm text-primary font-medium">Budget: £80-150</p>
              </div>
              
              <div className="bb-card text-center">
                <h3 className="font-heading text-xl font-semibold mb-4">Advanced</h3>
                <p className="text-muted-foreground mb-4">
                  Complete setup with espresso machine, burr grinder, and accessories
                </p>
                <p className="text-sm text-primary font-medium">Budget: £300+</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}