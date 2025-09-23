import { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, MapPin, Users, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const eventsData = [
  {
    id: 'latte-art-basics',
    title: 'Latte Art Basics',
    date: '2025-10-12',
    time: '18:00',
    duration: '2 hours',
    location: 'Bean Boutique Roastery',
    address: '123 Coffee Street, London',
    price: '£25',
    maxParticipants: 12,
    currentParticipants: 8,
    description: 'Learn the fundamentals of creating beautiful latte art from our expert baristas. This hands-on workshop covers milk steaming techniques, basic patterns, and tips for consistent results.',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80',
    instructor: 'Sarah Johnson',
    includes: ['All materials', 'Coffee tastings', 'Take-home guide']
  },
  {
    id: 'pour-over-masterclass',
    title: 'Pour-over Masterclass',
    date: '2025-11-05',
    time: '19:00',
    duration: '2.5 hours',
    location: 'Bean Boutique Brew Bar',
    address: '123 Coffee Street, London',
    price: '£30',
    maxParticipants: 10,
    currentParticipants: 6,
    description: 'Master the art of pour-over brewing with different techniques and equipment. Explore various brewing methods, grind sizes, and water temperatures to perfect your home brewing.',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
    instructor: 'Marcus Chen',
    includes: ['V60 and Chemex training', 'Bean samples', 'Brewing equipment discount']
  },
  {
    id: 'cupping-session',
    title: 'Coffee Cupping Session',
    date: '2025-11-18',
    time: '15:00',
    duration: '1.5 hours',
    location: 'Bean Boutique Roastery',
    address: '123 Coffee Street, London',
    price: '£20',
    maxParticipants: 15,
    currentParticipants: 12,
    description: 'Professional coffee cupping session to develop your palate and understand flavor profiles. Learn to identify tasting notes and evaluate coffee quality like a pro.',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=600&q=80',
    instructor: 'Emma Rodriguez',
    includes: ['5 coffee origins', 'Cupping forms', 'Flavor wheel']
  },
  {
    id: 'roasting-workshop',
    title: 'Home Roasting Workshop',
    date: '2025-12-03',
    time: '10:00',
    duration: '3 hours',
    location: 'Bean Boutique Roastery',
    address: '123 Coffee Street, London',
    price: '£45',
    maxParticipants: 8,
    currentParticipants: 3,
    description: 'Learn the art and science of coffee roasting. Understand roast profiles, development techniques, and take home your own freshly roasted beans.',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80',
    instructor: 'David Kim',
    includes: ['Green bean samples', 'Roasted coffee to take home', 'Roasting guide']
  }
];

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  selectedEvent: string;
}

export default function EventsPage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    selectedEvent: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    // Initialize map
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([51.5074, -0.1278], 15);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance.current);

      // Add marker for Bean Boutique
      L.marker([51.5074, -0.1278])
        .addTo(mapInstance.current)
        .bindPopup('<b>Bean Boutique</b><br>123 Coffee Street, London')
        .openPopup();
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.firstName.trim() || formData.firstName.length < 2 || formData.firstName.length > 40) {
      newErrors.firstName = 'First name must be 2-40 characters';
    }

    if (!formData.lastName.trim() || formData.lastName.length < 2 || formData.lastName.length > 40) {
      newErrors.lastName = 'Last name must be 2-40 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.selectedEvent) {
      newErrors.selectedEvent = 'Please select an event';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const selectedEvent = eventsData.find(event => event.id === formData.selectedEvent);
      const subject = encodeURIComponent(`Workshop Signup - ${selectedEvent?.title || 'Event'}`);
      const body = encodeURIComponent(
        `Hello,\n\nI would like to register for the following workshop:\n\n` +
        `Event: ${selectedEvent?.title}\n` +
        `Date: ${selectedEvent?.date}\n` +
        `Time: ${selectedEvent?.time}\n` +
        `Price: ${selectedEvent?.price}\n\n` +
        `Name: ${formData.firstName} ${formData.lastName}\n` +
        `Email: ${formData.email}\n\n` +
        `Thank you!`
      );

      // Create mailto link
      const mailtoLink = `mailto:events@beanboutique.example?subject=${subject}&body=${body}`;
      
      // Open email client
      window.location.href = mailtoLink;

      setIsSubmitted(true);
      
      // Reset form
      setFormData({ firstName: '', lastName: '', email: '', selectedEvent: '' });
      
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bb-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Events & Workshops
            </h1>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Learn from expert baristas and expand your coffee knowledge
            </p>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl font-bold text-center mb-12 bb-text-gradient">
              Upcoming Workshops
            </h2>
            
            <div className="space-y-8">
              {eventsData.map((event) => (
                <div key={event.id} className="bb-card">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                      <img
                        src={event.image}
                        alt={`${event.title} workshop`}
                        className="w-full h-48 lg:h-full object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="lg:col-span-2">
                      <div className="flex flex-col h-full">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="font-heading text-2xl font-semibold">{event.title}</h3>
                            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                              {event.price}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              {formatDate(event.date)}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              {event.time} ({event.duration})
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              {event.location}
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-2" />
                              {event.currentParticipants}/{event.maxParticipants} spots
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground mb-4">{event.description}</p>
                          
                          <div className="mb-4">
                            <p className="text-sm font-medium mb-2">Instructor: {event.instructor}</p>
                            <div>
                              <p className="text-sm font-medium mb-1">Includes:</p>
                              <ul className="text-sm text-muted-foreground">
                                {event.includes.map((item, index) => (
                                  <li key={index} className="flex items-center">
                                    <Check className="w-3 h-3 mr-2 text-primary" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="text-sm text-muted-foreground">
                            {event.maxParticipants - event.currentParticipants > 0 ? (
                              <span className="text-success">
                                {event.maxParticipants - event.currentParticipants} spots available
                              </span>
                            ) : (
                              <span className="text-destructive">Fully booked</span>
                            )}
                          </div>
                          <Button
                            onClick={() => setFormData(prev => ({ ...prev, selectedEvent: event.id }))}
                            className="bb-button-primary"
                            disabled={event.maxParticipants - event.currentParticipants === 0}
                          >
                            {event.maxParticipants - event.currentParticipants > 0 ? 'Register Now' : 'Waitlist'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bb-card">
              <h2 className="font-heading text-2xl font-bold text-center mb-8">
                Workshop Registration
              </h2>
              
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-success text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold mb-4">Registration Sent!</h3>
                  <p className="text-muted-foreground mb-6">
                    Your email client should have opened with a pre-filled registration email. 
                    Please send it to complete your registration.
                  </p>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    className="bb-button-secondary"
                  >
                    Register for Another Event
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Event Selection */}
                  <div>
                    <Label htmlFor="selectedEvent">Select Workshop *</Label>
                    <select
                      id="selectedEvent"
                      value={formData.selectedEvent}
                      onChange={(e) => handleInputChange('selectedEvent', e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">Choose a workshop...</option>
                      {eventsData.map((event) => (
                        <option 
                          key={event.id} 
                          value={event.id}
                          disabled={event.maxParticipants - event.currentParticipants === 0}
                        >
                          {event.title} - {formatDate(event.date)} - {event.price}
                          {event.maxParticipants - event.currentParticipants === 0 ? ' (Fully booked)' : ''}
                        </option>
                      ))}
                    </select>
                    {errors.selectedEvent && (
                      <p className="mt-1 text-sm text-destructive">{errors.selectedEvent}</p>
                    )}
                  </div>

                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Your first name"
                        className={errors.firstName ? 'border-destructive' : ''}
                        required
                        minLength={2}
                        maxLength={40}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-destructive">{errors.firstName}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Your last name"
                        className={errors.lastName ? 'border-destructive' : ''}
                        required
                        minLength={2}
                        maxLength={40}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-destructive">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                      className={errors.email ? 'border-destructive' : ''}
                      required
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>

                  {/* Privacy Notice */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Privacy Notice:</strong> Your information is only used for workshop registration 
                      and communication. We do not store or share your personal data with third parties.
                    </p>
                  </div>

                  {/* Honeypot */}
                  <input
                    type="text"
                    name="website"
                    style={{ display: 'none' }}
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bb-button-primary w-full"
                  >
                    {isSubmitting ? 'Processing...' : 'Register for Workshop'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Location Map */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl font-bold text-center mb-8 bb-text-gradient">
              Find Us
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="font-heading text-xl font-semibold mb-4">Bean Boutique Location</h3>
                <div className="space-y-3 text-muted-foreground">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 mr-3 mt-1 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Bean Boutique</p>
                      <p>123 Coffee Street</p>
                      <p>London, SW1A 1AA</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-3 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Opening Hours</p>
                      <p>Mon-Fri: 7:00 AM - 7:00 PM</p>
                      <p>Sat-Sun: 8:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
                
                <a
                  href="#"
                  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-10 bb-button-secondary"
                >
                  Skip map
                </a>
              </div>
              
              <div className="h-64 lg:h-80 rounded-lg overflow-hidden shadow-medium">
                <div 
                  ref={mapRef} 
                  className="w-full h-full"
                  tabIndex={0}
                  role="application"
                  aria-label="Interactive map showing Bean Boutique location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}