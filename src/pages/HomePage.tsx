import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ArrowRight, Coffee, Users, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const highlightsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP animations with reduced motion respect
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
      // Hero text animation
      if (heroRef.current) {
        const heroTitle = heroRef.current.querySelector('.hero-title');
        const heroSubtitle = heroRef.current.querySelector('.hero-subtitle');
        const heroButtons = heroRef.current.querySelector('.hero-buttons');
        
        gsap.set([heroTitle, heroSubtitle, heroButtons], { opacity: 0, y: 30 });
        
        gsap.timeline()
          .to(heroTitle, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
          .to(heroSubtitle, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
          .to(heroButtons, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');
      }

      // Highlights cards animation
      if (highlightsRef.current) {
        const cards = highlightsRef.current.querySelectorAll('.highlight-card');
        gsap.set(cards, { opacity: 0, y: 40, scale: 0.95 });
        
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          delay: 0.8
        });
      }
    }
  }, []);

  const heroSlides = [
    {
      title: 'Ethiopian Gedeb',
      subtitle: 'Discover floral notes of bergamot and jasmine',
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1920&q=80',
      cta: 'Shop Coffee',
      link: '/coffee'
    },
    {
      title: 'Master Pour-Over',
      subtitle: 'Join our upcoming brewing workshop',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1920&q=80',
      cta: 'View Events',
      link: '/events'
    },
    {
      title: 'Premium Equipment',
      subtitle: 'Elevate your home brewing setup',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1920&q=80',
      cta: 'Shop Equipment',
      link: '/equipment'
    },
    {
      title: 'Coffee Subscriptions',
      subtitle: 'Fresh beans delivered monthly',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1920&q=80',
      cta: 'Subscribe Now',
      link: '/offers'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Swiper */}
      <section className="relative h-screen overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          className="h-full"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-full">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className="absolute inset-0 bg-black/40" />
                </div>
                <div className="relative z-10 h-full flex items-center justify-center">
                  <div className="text-center text-white max-w-4xl mx-auto px-4" ref={index === 0 ? heroRef : undefined}>
                    <h1 className="hero-title font-heading text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                      {slide.title}
                    </h1>
                    <p className="hero-subtitle text-xl md:text-2xl mb-8 text-white/90">
                      {slide.subtitle}
                    </p>
                    <div className="hero-buttons">
                      <Link to={slide.link}>
                        <Button className="bb-button-primary text-lg px-8 py-4">
                          {slide.cta}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Highlights Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 bb-text-gradient">
              Discover Excellence
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From single-origin beans to masterful brewing techniques, explore what makes Bean Boutique special.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" ref={highlightsRef}>
            <div className="highlight-card bb-card text-center group cursor-pointer">
              <div className="mb-6">
                <Coffee className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="font-heading text-2xl font-semibold mb-4">New Blends</h3>
                <p className="text-muted-foreground mb-6">
                  Discover our latest single-origin coffees from around the world, each with unique flavor profiles.
                </p>
                <Link to="/coffee">
                  <Button className="bb-button-secondary">
                    Explore Coffee
                  </Button>
                </Link>
              </div>
            </div>

            <div className="highlight-card bb-card text-center group cursor-pointer">
              <div className="mb-6">
                <Users className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="font-heading text-2xl font-semibold mb-4">Workshops</h3>
                <p className="text-muted-foreground mb-6">
                  Learn from expert baristas in our hands-on workshops covering brewing techniques and latte art.
                </p>
                <Link to="/events">
                  <Button className="bb-button-secondary">
                    Book Events
                  </Button>
                </Link>
              </div>
            </div>

            <div className="highlight-card bb-card text-center group cursor-pointer">
              <div className="mb-6">
                <Gift className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="font-heading text-2xl font-semibold mb-4">Subscriptions</h3>
                <p className="text-muted-foreground mb-6">
                  Never run out of great coffee with our flexible subscription plans tailored to your taste.
                </p>
                <Link to="/offers">
                  <Button className="bb-button-secondary">
                    Subscribe
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
                Crafted with <span className="bb-text-gradient">Passion</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                At Bean Boutique, we believe every cup tells a story. From the farmers who grow our beans to the baristas who brew them, we're committed to excellence at every step of the journey.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Our carefully curated selection features beans from sustainable farms, roasted to perfection, and delivered fresh to your door.
              </p>
              <Link to="/coffee">
                <Button className="bb-button-primary">
                  Discover Our Story
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80"
                alt="Coffee roasting process"
                className="rounded-lg shadow-medium w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Teaser */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 bb-text-gradient">
              Upcoming Events
            </h2>
            <p className="text-xl text-muted-foreground">
              Join us for workshops, tastings, and coffee education
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bb-card">
              <h3 className="font-heading text-xl font-semibold mb-2">Latte Art Basics</h3>
              <p className="text-muted-foreground mb-4">October 12, 2025 • 6:00 PM</p>
              <p className="mb-4">Learn the fundamentals of creating beautiful latte art from our expert baristas.</p>
              <p className="font-semibold text-primary">£25</p>
            </div>
            
            <div className="bb-card">
              <h3 className="font-heading text-xl font-semibold mb-2">Pour-over Masterclass</h3>
              <p className="text-muted-foreground mb-4">November 5, 2025 • 7:00 PM</p>
              <p className="mb-4">Master the art of pour-over brewing with different techniques and equipment.</p>
              <p className="font-semibold text-primary">£30</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/events">
              <Button className="bb-button-primary">
                View All Events
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bb-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Stay in the Loop
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Get the latest coffee tips, new arrivals, and exclusive offers delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-foreground"
            />
            <Button className="bg-white text-primary hover:bg-white/90 px-6 py-3">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}