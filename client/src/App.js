import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Context Providers
import { ThemeProvider } from './contexts/ThemeContext';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';

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

// CSS
import './styles/App.css';

function App() {
  return (
    <ThemeProvider>
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
        </Routes>
      </main>
      
      <Footer />
    </div>
    </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
