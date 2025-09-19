import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, List, Tag, Edit, Info, Mail, Lock } from 'react-feather';
import logo from '../../assets/logo.png';
import ThemeToggle from '../ui/ThemeToggle';
import NewsletterModal from '../NewsletterModal';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);
  const { isAuthenticated, logout } = useAdminAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openNewsletterModal = () => {
    setIsNewsletterModalOpen(true);
    setIsMenuOpen(false); // Close mobile menu if open
  };

  const handleAdminLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/categories', label: 'Categories', icon: List },
    { path: '/deals', label: 'Deals', icon: Tag },
    { path: '/blog', label: 'Blog', icon: Edit },
    { path: '/about', label: 'About', icon: Info },
    { path: '/contact', label: 'Contact', icon: Mail },
  ];

  return (
    <>
      <header className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 min-w-fit">
              <img 
                src={logo} 
                alt="ClickMaliClub Logo" 
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold text-gradient">ClickMaliClub</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 flex-1 justify-center">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 font-medium whitespace-nowrap"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center space-x-3 xl:space-x-4 min-w-fit">
              <ThemeToggle />
              
              {/* Admin Section */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <Link 
                    to="/admin/dashboard"
                    className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors duration-200 font-medium text-sm"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <div className="w-px h-4 bg-emerald-300 dark:bg-emerald-600"></div>
                  <button
                    onClick={handleAdminLogout}
                    className="text-emerald-600 dark:text-emerald-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 font-medium text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link 
                  to="/admin/login"
                  className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 text-sm opacity-75 hover:opacity-100 px-2 py-1"
                  title="Admin Access"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin</span>
                </Link>
              )}
              
              <button 
                onClick={openNewsletterModal}
                className="btn-primary whitespace-nowrap"
              >
                Join Newsletter
              </button>
            </div>

            {/* Mobile/Tablet Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
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
                
                {/* Mobile Admin Section */}
                {isAuthenticated ? (
                  <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                    <Link 
                      to="/admin/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 p-3 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors duration-200"
                    >
                      <Lock className="w-5 h-5" />
                      <span className="font-medium">Admin Dashboard</span>
                    </Link>
                    <button
                      onClick={handleAdminLogout}
                      className="flex items-center space-x-2 p-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 w-full text-left"
                    >
                      <X className="w-5 h-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/admin/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 p-3 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 border-t border-gray-200 dark:border-gray-700 mt-4 pt-4"
                  >
                    <Lock className="w-5 h-5" />
                    <span className="font-medium">Admin Login</span>
                  </Link>
                )}
                
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
      </header>
      
      {/* Newsletter Modal - Rendered outside header to avoid z-index conflicts */}
      {isNewsletterModalOpen && (
        <NewsletterModal 
          isOpen={isNewsletterModalOpen} 
          onClose={() => setIsNewsletterModalOpen(false)} 
        />
      )}
    </>
  );
};

export default Header;
