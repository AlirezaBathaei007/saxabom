import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Star, Heart, Search, Menu, X, Filter, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

function App() {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState('home');

  // Sample products data
  const products = [
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      price: 299.99,
      originalPrice: 399.99,
      category: 'electronics',
      rating: 4.8,
      reviews: 124,
      description: 'High-quality wireless headphones with noise cancellation',
      image: 'Modern wireless headphones with sleek black design'
    },
    {
      id: 2,
      name: 'Organic Cotton T-Shirt',
      price: 29.99,
      originalPrice: 39.99,
      category: 'clothing',
      rating: 4.6,
      reviews: 89,
      description: 'Comfortable organic cotton t-shirt in various colors',
      image: 'Stylish organic cotton t-shirt in neutral colors'
    },
    {
      id: 3,
      name: 'Smart Fitness Watch',
      price: 199.99,
      originalPrice: 249.99,
      category: 'electronics',
      rating: 4.7,
      reviews: 156,
      description: 'Advanced fitness tracking with heart rate monitor',
      image: 'Modern smartwatch with fitness tracking features'
    },
    {
      id: 4,
      name: 'Artisan Coffee Beans',
      price: 24.99,
      originalPrice: 29.99,
      category: 'food',
      rating: 4.9,
      reviews: 203,
      description: 'Premium single-origin coffee beans, freshly roasted',
      image: 'Premium coffee beans in elegant packaging'
    },
    {
      id: 5,
      name: 'Minimalist Desk Lamp',
      price: 89.99,
      originalPrice: 119.99,
      category: 'home',
      rating: 4.5,
      reviews: 67,
      description: 'Modern LED desk lamp with adjustable brightness',
      image: 'Sleek minimalist desk lamp with LED lighting'
    },
    {
      id: 6,
      name: 'Yoga Mat Pro',
      price: 49.99,
      originalPrice: 69.99,
      category: 'sports',
      rating: 4.8,
      reviews: 142,
      description: 'Non-slip yoga mat with alignment guides',
      image: 'Professional yoga mat with alignment markings'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'food', name: 'Food & Drinks' },
    { id: 'home', name: 'Home & Garden' },
    { id: 'sports', name: 'Sports & Fitness' }
  ];

  // Load cart and favorites from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('saxabom-cart');
    const savedFavorites = localStorage.getItem('saxabom-favorites');
    
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('saxabom-cart', JSON.stringify(cart));
  }, [cart]);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('saxabom-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    toast({
      title: "Added to cart! 🛒",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const toggleFavorite = (product) => {
    setFavorites(prevFavorites => {
      const isFavorite = prevFavorites.some(fav => fav.id === product.id);
      if (isFavorite) {
        toast({
          title: "Removed from favorites",
          description: `${product.name} has been removed from favorites.`,
        });
        return prevFavorites.filter(fav => fav.id !== product.id);
      } else {
        toast({
          title: "Added to favorites! ❤️",
          description: `${product.name} has been added to favorites.`,
        });
        return [...prevFavorites, product];
      }
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleCheckout = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const ProductCard = ({ product }) => {
    const isFavorite = favorites.some(fav => fav.id === product.id);
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -5 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300 group"
      >
        <div className="relative mb-4">
          <img  
            className="w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300" 
            alt={product.name}
           src="https://images.unsplash.com/photo-1671376354106-d8d21e55dddd" />
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              -{discount}%
            </div>
          )}
          <button
            onClick={() => toggleFavorite(product)}
            className="absolute top-2 right-2 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold text-lg text-white group-hover:text-purple-300 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-300 text-sm">{product.description}</p>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-300">({product.reviews})</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-white">${product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
                )}
              </div>
            </div>
            <Button
              onClick={() => addToCart(product)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  const Header = () => (
    <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <motion.h1 
              className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => setCurrentPage('home')}
            >
              SAXABOM
            </motion.h1>
            
            <nav className="hidden md:flex space-x-6">
              {['home', 'products', 'about', 'contact'].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`capitalize font-medium transition-colors ${
                    currentPage === page 
                      ? 'text-purple-400' 
                      : 'text-white hover:text-purple-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
              />
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
            >
              <ShoppingCart className="w-6 h-6 text-white" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartItemsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );

  const HomePage = () => (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h1 className="text-5xl lg:text-7xl font-bold">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Welcome to
                </span>
                <br />
                <span className="text-white">SAXABOM</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Discover amazing products at unbeatable prices. From cutting-edge electronics to stylish fashion, we've got everything you need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => setCurrentPage('products')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105"
                >
                  Shop Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  onClick={() => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })}
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
                >
                  Learn More
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <img  
                  className="w-full h-96 object-cover rounded-2xl shadow-2xl" 
                  alt="Hero shopping image"
                 src="https://images.unsplash.com/photo-1674027392842-29f8354e236c" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Featured Products</h2>
          <p className="text-xl text-gray-300">Handpicked items just for you</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.slice(0, 3).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            onClick={() => setCurrentPage('products')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
          >
            View All Products
          </Button>
        </div>
      </section>
    </div>
  );

  const ProductsPage = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Our Products</h1>
        <p className="text-xl text-gray-300">Discover our amazing collection</p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="sm:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory + searchQuery}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </AnimatePresence>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-gray-300">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );

  const CartSidebar = () => (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setIsCartOpen(false)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-900/95 backdrop-blur-md border-l border-white/20 z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Shopping Cart</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      className="bg-white/10 rounded-xl p-4 border border-white/20"
                    >
                      <div className="flex items-center space-x-4">
                        <img  
                          className="w-16 h-16 object-cover rounded-lg" 
                          alt={item.name}
                         src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{item.name}</h3>
                          <p className="text-purple-300">${item.price}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Minus className="w-4 h-4 text-white" />
                          </button>
                          <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Plus className="w-4 h-4 text-white" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}

                  <div className="border-t border-white/20 pt-4 mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold text-white">Total:</span>
                      <span className="text-2xl font-bold text-purple-300">${cartTotal.toFixed(2)}</span>
                    </div>
                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                    >
                      Checkout
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'products':
        return <ProductsPage />;
      case 'about':
        return (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h1 className="text-4xl font-bold text-white mb-8">About Saxabom</h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Saxabom is your premier destination for quality products at amazing prices. We're committed to providing exceptional customer service and a seamless shopping experience.
            </p>
          </div>
        );
      case 'contact':
        return (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h1 className="text-4xl font-bold text-white mb-8">Contact Us</h1>
            <p className="text-xl text-gray-300 mb-8">
              We'd love to hear from you! Get in touch with our team.
            </p>
            <Button
              onClick={() => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            >
              Send Message
            </Button>
          </div>
        );
      default:
        return <HomePage />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Saxabom - Premium Online Shopping Experience</title>
        <meta name="description" content="Discover amazing products at Saxabom. From electronics to fashion, find everything you need at unbeatable prices with fast shipping." />
        <meta property="og:title" content="Saxabom - Premium Online Shopping Experience" />
        <meta property="og:description" content="Discover amazing products at Saxabom. From electronics to fashion, find everything you need at unbeatable prices with fast shipping." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
        <Header />
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/20 backdrop-blur-md border-b border-white/10"
            >
              <div className="px-4 py-4 space-y-2">
                {['home', 'products', 'about', 'contact'].map((page) => (
                  <button
                    key={page}
                    onClick={() => {
                      setCurrentPage(page);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 rounded-xl capitalize font-medium transition-colors ${
                      currentPage === page 
                        ? 'bg-purple-600 text-white' 
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main>
          {renderPage()}
        </main>

        <CartSidebar />
        <Toaster />

        {/* Footer */}
        <footer className="bg-black/20 backdrop-blur-md border-t border-white/10 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  SAXABOM
                </span>
                <p className="text-gray-300 mt-4">
                  Your trusted partner for quality products and exceptional service.
                </p>
              </div>
              <div>
                <span className="font-semibold text-white">Quick Links</span>
                <div className="mt-4 space-y-2">
                  {['Home', 'Products', 'About', 'Contact'].map((link) => (
                    <p key={link} className="text-gray-300 hover:text-purple-300 cursor-pointer transition-colors">
                      {link}
                    </p>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-semibold text-white">Categories</span>
                <div className="mt-4 space-y-2">
                  {categories.slice(1).map((category) => (
                    <p key={category.id} className="text-gray-300 hover:text-purple-300 cursor-pointer transition-colors">
                      {category.name}
                    </p>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-semibold text-white">Support</span>
                <div className="mt-4 space-y-2">
                  {['Help Center', 'Shipping Info', 'Returns', 'Privacy Policy'].map((link) => (
                    <p key={link} className="text-gray-300 hover:text-purple-300 cursor-pointer transition-colors">
                      {link}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t border-white/10 mt-8 pt-8 text-center">
              <p className="text-gray-300">© 2024 Saxabom. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;