import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Context Providers
import { ThemeProvider } from './contexts/ThemeContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import MobileOptimization from './components/ui/MobileOptimization';

// Pages
import Home from './pages/Home';
import Categories from './pages/Categories';
import Deals from './pages/Deals';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import About from './pages/About';
import Contact from './pages/Contact';
import Reviews from './pages/Reviews';
import Guides from './pages/Guides';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Disclaimer from './pages/Disclaimer';
import AdminLogin from './pages/AdminLogin';
import AdminPasswordReset from './pages/AdminPasswordReset';
import AdminDashboard from './pages/AdminDashboard';

// CSS
import './styles/App.css';

function App() {
  // Mobile optimizations
  useEffect(() => {
    // Add viewport meta tag for mobile optimization
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.head.appendChild(meta);
    }

    // Add mobile-web-app-capable for better PWA experience
    const webAppMeta = document.createElement('meta');
    webAppMeta.name = 'mobile-web-app-capable';
    webAppMeta.content = 'yes';
    document.head.appendChild(webAppMeta);

    // Add apple-mobile-web-app-capable for iOS
    const appleMeta = document.createElement('meta');
    appleMeta.name = 'apple-mobile-web-app-capable';
    appleMeta.content = 'yes';
    document.head.appendChild(appleMeta);

    // Prevent double-tap zoom on iOS
    let lastTouchEnd = 0;
    const preventDoubleTapZoom = (event) => {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    };

    document.addEventListener('touchend', preventDoubleTapZoom, false);

    return () => {
      document.removeEventListener('touchend', preventDoubleTapZoom, false);
    };
  }, []);

  return (
    <ThemeProvider>
      <AdminAuthProvider>
        <MobileOptimization>
          <ErrorBoundary>
            <div className="App bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
              <Helmet>
                <title>ClickMaliClub - Your Ultimate Affiliate Marketing Hub</title>
                <meta name="description" content="Discover the best deals, offers, and opportunities in forex, crypto, betting, SaaS, and more. Your trusted affiliate marketing partner." />
                <meta name="keywords" content="affiliate marketing, forex, crypto, betting, deals, offers, ClickMaliClub" />
              </Helmet>
              
              <Header />
              
              <main className="main-content min-h-screen">
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/categories/:category" element={<Categories />} />
                  <Route path="/deals" element={<Deals />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/reviews" element={<Reviews />} />
                  <Route path="/guides" element={<Guides />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/disclaimer" element={<Disclaimer />} />
                  
                  {/* Admin Routes - These might be causing issues */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/reset-password/:token" element={<AdminPasswordReset />} />
                  <Route 
                    path="/admin/dashboard" 
                    element={
                      <ProtectedAdminRoute>
                        <AdminDashboard />
                      </ProtectedAdminRoute>
                    } 
                  />
                </Routes>
              </main>
              
              <Footer />
            </div>
          </ErrorBoundary>
        </MobileOptimization>
      </AdminAuthProvider>
    </ThemeProvider>
  );
}

export default App;
