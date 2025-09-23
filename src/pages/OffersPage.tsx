import { useState, useEffect, useRef } from 'react';
import { Check, Gift, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';

const subscriptionTiers = [
  {
    tier: 'Basic',
    deliveries: '1×250g/month',
    benefits: ['5% off equipment', 'Early event notice'],
    price: '£10/mo',
    popular: false,
    description: 'Perfect for casual coffee drinkers who want to explore new flavors',
    savings: 'Save £12/year vs individual purchases'
  },
  {
    tier: 'Plus',
    deliveries: '2×250g/month',
    benefits: ['10% off equipment', 'Priority booking', 'Free shipping'],
    price: '£18/mo',
    popular: true,
    description: 'Our most popular plan for coffee enthusiasts',
    savings: 'Save £36/year vs individual purchases'
  },
  {
    tier: 'Premium',
    deliveries: '3×250g/month',
    benefits: ['15% off equipment', 'Exclusive tastings', 'Free shipping', 'Monthly brewing guide'],
    price: '£25/mo',
    popular: false,
    description: 'The ultimate experience for serious coffee connoisseurs',
    savings: 'Save £60/year vs individual purchases'
  }
];

const faqData = [
  {
    question: 'How does the subscription work?',
    answer: 'You choose your preferred tier and we deliver freshly roasted coffee to your door every month. You can pause, modify, or cancel your subscription at any time through your account dashboard.'
  },
  {
    question: 'Can I choose which coffees I receive?',
    answer: 'Yes! You can set your flavor preferences in your account, or let our experts surprise you with carefully curated selections. Premium members get access to exclusive single-origin coffees.'
  },
  {
    question: 'What if I don\'t like a coffee?',
    answer: 'We offer a satisfaction guarantee. If you\'re not happy with any coffee, contact us within 7 days and we\'ll send you a replacement or credit your account.'
  },
  {
    question: 'Can I skip a month?',
    answer: 'Absolutely! You can pause your subscription for any month through your account dashboard. Just make sure to pause before the 15th of the month to skip the next delivery.'
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Currently we only ship within the UK. We\'re working on expanding to Europe and will announce when international shipping becomes available.'
  },
  {
    question: 'How fresh is the coffee?',
    answer: 'All coffee is roasted to order within 48 hours of shipping. You\'ll receive beans that are 3-7 days post-roast, which is the optimal window for brewing.'
  }
];

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion && contentRef.current) {
      if (isOpen) {
        gsap.to(contentRef.current, {
          height: 'auto',
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        gsap.to(contentRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    }
  }, [isOpen]);

  return (
    <div className="bb-card">
      <button
        onClick={onToggle}
        className="w-full text-left flex items-center justify-between p-0"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${question.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <h3 className="font-heading text-lg font-semibold pr-4">{question}</h3>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-primary flex-shrink-0" />
        )}
      </button>
      
      <div
        ref={contentRef}
        id={`faq-answer-${question.replace(/\s+/g, '-').toLowerCase()}`}
        className="overflow-hidden"
        style={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
      >
        <div className="pt-4 text-muted-foreground">
          {answer}
        </div>
      </div>
    </div>
  );
}

export default function OffersPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const pricingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate pricing cards on mount
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion && pricingRef.current) {
      const cards = pricingRef.current.querySelectorAll('.pricing-card');
      gsap.set(cards, { opacity: 0, y: 30, scale: 0.95 });
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power2.out',
        delay: 0.3
      });
    }
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bb-gradient-accent text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Special Offers & Subscriptions
            </h1>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Never run out of exceptional coffee with our flexible subscription plans
            </p>
          </div>
        </div>
      </section>

      {/* Promotions Banner */}
      <section className="py-8 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-4 text-center">
            <Gift className="h-6 w-6" />
            <p className="font-medium">
              <strong>Limited Time:</strong> Use code WELCOME10 for 10% off your first month
            </p>
            <Gift className="h-6 w-6" />
          </div>
        </div>
      </section>

      {/* Subscription Pricing */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 bb-text-gradient">
                Choose Your Perfect Plan
              </h2>
              <p className="text-xl text-muted-foreground">
                All plans include freshly roasted, ethically sourced coffee delivered monthly
              </p>
            </div>
            
            <div 
              ref={pricingRef}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {subscriptionTiers.map((plan, index) => (
                <div 
                  key={plan.tier} 
                  className={`pricing-card bb-card relative ${
                    plan.popular 
                      ? 'border-2 border-primary ring-4 ring-primary/20 scale-105' 
                      : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="font-heading text-2xl font-bold mb-2">{plan.tier}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">{plan.price}</span>
                    </div>
                    <p className="text-muted-foreground mb-2">{plan.deliveries}</p>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div>
                      <h4 className="font-semibold mb-3">What's included:</h4>
                      <ul className="space-y-2">
                        {plan.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-center text-sm">
                            <Check className="w-4 h-4 mr-3 text-primary flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-xs font-medium text-primary text-center">
                        {plan.savings}
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bb-button-primary' 
                        : 'bb-button-secondary'
                    }`}
                  >
                    {plan.popular ? 'Start Free Trial' : 'Choose Plan'}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    Cancel anytime • Free shipping • No hidden fees
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl font-bold text-center mb-12 bb-text-gradient">
              Why Subscribe?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="h-8 w-8" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-3">Curated Selection</h3>
                <p className="text-muted-foreground">
                  Our experts hand-pick exceptional coffees from around the world, introducing you to new flavors every month.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-3">Freshness Guaranteed</h3>
                <p className="text-muted-foreground">
                  Coffee roasted to order and shipped within 48 hours. You'll always receive beans at peak freshness.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-3">Exclusive Access</h3>
                <p className="text-muted-foreground">
                  Priority access to limited releases, special events, and equipment discounts available only to subscribers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl font-bold text-center mb-12 bb-text-gradient">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFAQ === index}
                  onToggle={() => toggleFAQ(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bb-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Coffee Journey?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Join thousands of coffee lovers who trust Bean Boutique for their monthly coffee fix. 
            Start with a 14-day free trial and cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg">
              Start Free Trial
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg"
            >
              Learn More
            </Button>
          </div>
          <p className="text-sm text-primary-foreground/70 mt-4">
            No commitment • Cancel anytime • 100% satisfaction guarantee
          </p>
        </div>
      </section>
    </div>
  );
}