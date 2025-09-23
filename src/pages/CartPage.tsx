import { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category?: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('bb_cart') || '[]');
      setCartItems(cart);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCart = (newCart: CartItem[]) => {
    setCartItems(newCart);
    localStorage.setItem('bb_cart', JSON.stringify(newCart));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }

    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    updateCart(updatedCart);
  };

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    updateCart(updatedCart);
  };

  const clearCart = () => {
    updateCart([]);
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Shopping Cart</h1>
              <p className="text-muted-foreground">
                {cartItems.length === 0 ? 'Your cart is empty' : `${getItemCount()} items in your cart`}
              </p>
            </div>
            <Link to="/coffee">
              <Button className="bb-button-secondary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="font-heading text-2xl font-semibold mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">
                Looks like you haven't added any items to your cart yet. Start browsing our collection!
              </p>
              <div className="space-y-4">
                <Link to="/coffee">
                  <Button className="bb-button-primary w-full">
                    Shop Coffee
                  </Button>
                </Link>
                <Link to="/equipment">
                  <Button className="bb-button-secondary w-full">
                    Browse Equipment
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Cart Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="bb-card flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading text-lg font-semibold truncate">{item.name}</h3>
                      {item.category && (
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">£{item.price} each</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 p-0"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        
                        <span 
                          className="w-12 text-center font-medium"
                          aria-label={`Quantity: ${item.quantity}`}
                        >
                          {item.quantity}
                        </span>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 p-0"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Item Total */}
                      <div className="text-right min-w-[80px]">
                        <p className="font-semibold">£{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      
                      {/* Remove Button */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeItem(item.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Clear Cart */}
              <div className="mt-8 flex justify-end">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Cart
                </Button>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bb-card sticky top-4">
                <h2 className="font-heading text-xl font-semibold mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({getItemCount()} items)</span>
                    <span>£{getTotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-muted-foreground">Calculated at checkout</span>
                  </div>
                  
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>£{getTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4">
                    <Button 
                      className="bb-button-primary w-full"
                      disabled
                      title="Checkout functionality coming soon"
                    >
                      Checkout (Coming Soon)
                    </Button>
                    
                    <p className="text-xs text-muted-foreground text-center">
                      Secure checkout with SSL encryption
                    </p>
                  </div>
                </div>
                
                {/* Promotion Code */}
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="font-medium mb-3">Promotion Code</h3>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 border border-border rounded-md text-sm"
                      disabled
                    />
                    <Button size="sm" variant="outline" disabled>
                      Apply
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Try code WELCOME10 for 10% off your first order
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Live Region for Cart Updates */}
      <div 
        id="cartUpdates" 
        className="sr-only" 
        role="status" 
        aria-live="polite"
      ></div>
    </div>
  );
}