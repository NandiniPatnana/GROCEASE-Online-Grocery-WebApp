import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    company: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Blog", href: "/blog" },
      { name: "Press", href: "/press" }
    ],
    services: [
      { name: "Delivery Areas", href: "/delivery" },
      { name: "Pricing", href: "/pricing" },
      { name: "Partner with Us", href: "/partners" },
      { name: "Business Orders", href: "/business" }
    ],
    help: [
      { name: "FAQs", href: "/faqs" },
      { name: "Contact Us", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" }
    ]
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-green-50 to-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Newsletter Signup */}
        <div className="mb-12 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Stay updated with GROCEASE</h3>
              <p className="text-gray-600 mt-1">Get exclusive offers, seasonal recipes, and more!</p>
            </div>
            <div className="flex-1 max-w-md">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="px-4 py-2 w-full border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  aria-label="Email subscription"
                />
                <button 
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-r-md transition duration-200 font-medium"
                  aria-label="Subscribe"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill="#16a34a" />
                <path d="M7 12L10 15L17 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h2 className="text-2xl font-bold text-green-600">GROCEASE</h2>
            </div>
            <p className="text-gray-600">
              Fresh groceries delivered to your doorstep. Quality products, fast delivery, supporting local farmers.
            </p>
            <div className="flex space-x-4 pt-2">
              {/* <a href="#" aria-label="Facebook" className="text-gray-500 hover:text-green-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-500 hover:text-green-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-500 hover:text-green-600 transition-colors">
                <Instagram size={20} />
              </a> */}


              <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-gray-500 hover:text-green-600 transition-colors"
            >
              <Facebook size={20} />
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="text-gray-500 hover:text-green-600 transition-colors"
            >
              <Twitter size={20} />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-gray-500 hover:text-green-600 transition-colors"
            >
              <Instagram size={20} />
            </a>
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone size={16} className="text-green-600" />
                <span>+1 (800) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail size={16} className="text-green-600" />
                <span>support@grocease.com</span>
              </div>
              <div className="flex items-start space-x-2 text-gray-600">
                <MapPin size={16} className="text-green-600 mt-1" />
                <span>123 Fresh Street, Produce City, PC 12345</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-600 hover:text-green-600 transition-colors flex items-center group"
                  >
                    <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-600 hover:text-green-600 transition-colors flex items-center group"
                  >
                    <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Help</h3>
            <ul className="space-y-3">
              {footerLinks.help.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-600 hover:text-green-600 transition-colors flex items-center group"
                  >
                    <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* App Download Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Download our app</h3>
              <p className="text-gray-600 mt-1">Shop groceries on the go with our mobile app</p>
            </div>
            <div className="flex space-x-4">
              {/* <a href="#" className="flex items-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                  <path d="M17.5 12c0-3.04-2.46-5.5-5.5-5.5s-5.5 2.46-5.5 5.5c0 2.76 2.02 5.03 4.66 5.44v-3.82H9.83V12h1.33v-1.16c0-1.31.78-2.04 1.99-2.04.57 0 1.18.1 1.18.1v1.3h-.66c-.65 0-.86.4-.86.82V12h1.46l-.23 1.62h-1.23v3.82c2.64-.41 4.66-2.68 4.66-5.44z" />
                </svg>
                App Store
              </a>
              <a href="#" className="flex items-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-4.56 16H5.5c-.45 0-.67-.54-.35-.85l3.44-3.44-1.06-1.06L4.1 16.09A.7.7 0 0 0 4.5 17h2.94v1zM19.5 7c.45 0 .67.54.35.85l-3.44 3.44 1.06 1.06 3.43-3.44c.33-.33.2-.91-.4-.91h-2.94V7h1.94z" />
                </svg>
                Play Store
              </a> */}


              <a
  href="https://apps.apple.com"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
>
  ...
  App Store
</a>

<a
  href="https://play.google.com/store"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
>
  ...
  Play Store
</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600 text-sm">
              © {currentYear} GROCEASE. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <a href="/privacy" className="text-gray-600 hover:text-green-600 transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-600 hover:text-green-600 transition-colors text-sm">
                Terms of Service
              </a>
              <a href="/cookies" className="text-gray-600 hover:text-green-600 transition-colors text-sm">
                Cookie Policy
              </a>
              <a href="/accessibility" className="text-gray-600 hover:text-green-600 transition-colors text-sm">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;