import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook, Send, MessageCircle } from 'react-feather';
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
        { label: 'Prop Firms', path: '/categories/prop-firms' },
        { label: 'Business Resources & Outsourcing', path: '/categories/business-resources' },
        { label: 'Online Education', path: '/categories/education' },
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
    { 
      icon: Instagram, 
      href: 'https://www.instagram.com/clickmaliclub?igsh=MTBqMXg1NXBicjA2MQ==', 
      label: 'Instagram', 
      color: 'hover:text-pink-400' 
    },
    { 
      icon: () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5.76 20.9a6.34 6.34 0 0 0 10.86-4.43V7.83a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.8-.26z"/>
        </svg>
      ), 
      href: 'https://www.tiktok.com/@clickmaliclub?_t=ZM-8yscvlaVjyY&_r=1', 
      label: 'TikTok', 
      color: 'hover:text-pink-500' 
    },
    { 
      icon: () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ), 
      href: 'https://x.com/clickmaliclub?t=7ukkAIXxt9HlUkh0PpkhaQ&s=09', 
      label: 'X (Twitter)', 
      color: 'hover:text-gray-300' 
    },
    { 
      icon: Facebook, 
      href: 'https://www.facebook.com/profile.php?id=61580389871639', 
      label: 'Facebook', 
      color: 'hover:text-blue-400' 
    },
    { 
      icon: () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.219-.359-.219c0-1.495.869-2.611 1.83-2.611.219 0 .399.041.399.399 0 .219-.041.399-.219.938-.219.938-.399 1.830-.399 2.611 0 1.495 1.189 2.611 2.685 2.611 3.158 0 5.286-3.318 5.286-8.604 0-4.499-3.238-7.657-7.858-7.657-5.366 0-8.524 4.019-8.524 8.184 0 1.615.619 3.349 1.396 4.289.155.179.155.339.105.518-.055.199-.179.718-.233.918-.055.199-.199.259-.399.179-1.396-.639-2.273-2.554-2.273-4.749 0-5.925 4.299-11.369 12.402-11.369 6.505 0 11.569 4.639 11.569 10.834 0 6.465-4.079 11.669-9.745 11.669-1.915 0-3.719-.998-4.339-2.193l-1.176 4.499c-.419 1.635-1.635 3.718-2.433 4.979C9.484 23.682 10.734 24 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
        </svg>
      ), 
      href: 'https://pin.it/FRL5cIHPg', 
      label: 'Pinterest', 
      color: 'hover:text-red-400' 
    },
    { 
      icon: Send, 
      href: 'https://t.me/clickmaliclub', 
      label: 'Telegram', 
      color: 'hover:text-blue-400' 
    },
    { 
      icon: () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
        </svg>
      ), 
      href: 'https://whatsapp.com/channel/0029Vb63Aby3gvWaKQGRpx2P', 
      label: 'WhatsApp', 
      color: 'hover:text-green-400' 
    },
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
                <Mail className="w-5 h-5" />
                <span>clickmaliclub@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-5 h-5" />
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
                  {typeof social.icon === 'function' ? (
                    <social.icon />
                  ) : (
                    <social.icon className="w-5 h-5" />
                  )}
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
