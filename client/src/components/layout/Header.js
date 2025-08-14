import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiHome, FiList, FiTag, FiEdit, FiInfo, FiMail } from 'react-icons/fi';
import logo from '../../assets/logo.png';
import NewsletterModal from '../NewsletterModal';
import ThemeToggle from '../ui/ThemeToggle';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openNewsletterModal = () => {
    setIsNewsletterModalOpen(true);
    setIsMenuOpen(false); // Close mobile menu if open
  };

  const navItems = [
    { path: '/', label: 'Home', icon: FiHome },
    { path: '/categories', label: 'Categories', icon: FiList },
    { path: '/deals', label: 'Deals', icon: FiTag },
    { path: '/blog', label: 'Blog', icon: FiEdit },
    { path: '/about', label: 'About', icon: FiInfo },
    { path: '/contact', label: 'Contact', icon: FiMail },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={logo} 
              alt="ClickMaliClub Logo" 
              className="h-10 w-auto"
            />
            <span className="text-xl font-bold text-gradient">ClickMaliClub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 font-medium"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* CTA Button and Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <button 
              onClick={openNewsletterModal}
              className="btn-primary"
            >
              Join Newsletter
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 p-3 rounded-lg text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              
              {/* Mobile Theme Toggle */}
              <div className="flex items-center justify-between p-3 border-t border-gray-200 dark:border-gray-700 mt-4">
                <span className="text-gray-600 dark:text-gray-300 font-medium">Theme</span>
                <ThemeToggle />
              </div>
              
              <button 
                onClick={openNewsletterModal}
                className="btn-primary mt-4 w-full"
              >
                Join Newsletter
              </button>
            </nav>
          </div>
        )}
      </div>
      
      {/* Newsletter Modal */}
      <NewsletterModal 
        isOpen={isNewsletterModalOpen} 
        onClose={() => setIsNewsletterModalOpen(false)} 
      />
    </header>
  );
};

export default Header;
