import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaInstagram, FaTiktok, FaXTwitter, FaFacebookF, FaPinterest, FaTelegram, FaWhatsapp } from 'react-icons/fa6';
import logo from '../../assets/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Categories',
      links: [
        { label: 'Forex Trading', path: '/categories/forex' },
        { label: 'Crypto Exchange', path: '/categories/crypto' },
        { label: 'Betting Sites', path: '/categories/betting' },
        { label: 'SaaS Tools', path: '/categories/saas' },
        { label: 'Web Hosting', path: '/categories/hosting' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Latest Deals', path: '/deals' },
        { label: 'Blog Articles', path: '/blog' },
        { label: 'Reviews', path: '/reviews' },
        { label: 'Guides', path: '/guides' },
        { label: 'FAQ', path: '/faq' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', path: '/about' },
        { label: 'Contact', path: '/contact' },
        { label: 'Privacy Policy', path: '/privacy' },
        { label: 'Terms of Service', path: '/terms' },
        { label: 'Disclaimer', path: '/disclaimer' },
      ]
    }
  ];

  const socialLinks = [
    { icon: FaInstagram, href: 'https://www.instagram.com/clickmaliclub?igsh=MTBqMXg1NXBicjA2MQ==', label: 'Instagram', color: 'hover:text-pink-400' },
    { icon: FaTiktok, href: 'https://www.tiktok.com/@clickmaliclub?_t=ZM-8yscvlaVjyY&_r=1', label: 'TikTok', color: 'hover:text-red-400' },
    { icon: FaXTwitter, href: 'https://x.com/clickmaliclub?t=7ukkAIXxt9HlUkh0PpkhaQ&s=09', label: 'X (Twitter)', color: 'hover:text-gray-300' },
    { icon: FaFacebookF, href: '#', label: 'Facebook', color: 'hover:text-blue-400' },
    { icon: FaPinterest, href: 'https://pin.it/FRL5cIHPg', label: 'Pinterest', color: 'hover:text-red-500' },
    { icon: FaTelegram, href: 'https://t.me/clickmaliclub', label: 'Telegram', color: 'hover:text-blue-400' },
    { icon: FaWhatsapp, href: '#', label: 'WhatsApp', color: 'hover:text-green-400' },
  ];

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white transition-colors duration-300">
      {/* Main Footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <img 
                src={logo} 
                alt="ClickMaliClub Logo" 
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold text-white">ClickMaliClub</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Your trusted partner in affiliate marketing. Discover the best deals, 
              offers, and opportunities across multiple industries.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <FiMail className="w-5 h-5" />
                <span>clickmaliclub@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <FiMapPin className="w-5 h-5" />
                <span>Global/Worldwide</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md">
            <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
            <p className="text-gray-400 mb-4">
              Get the latest deals and offers delivered to your inbox.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
              />
              <button className="btn-primary">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} ClickMaliClub. All rights reserved.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className={`text-gray-400 ${social.color} transition-colors duration-200`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
