import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiMail, FiMessageSquare, FiUser, FiSend, FiMapPin, FiClock, FiPhone } from 'react-icons/fi';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponseMessage({ type: '', text: '' });

    try {
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setResponseMessage({ 
        type: 'success', 
        text: 'Thank you for your message! We\'ll get back to you within 24 hours.' 
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setResponseMessage({ 
        type: 'error', 
        text: 'Failed to send message. Please try again or contact us directly.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: FiMail,
      title: 'Email Us',
      details: 'clickmaliclub@gmail.com',
      description: 'Send us an email anytime'
    },
    {
      icon: FiClock,
      title: 'Response Time',
      details: 'Within 24 hours',
      description: 'We typically respond quickly'
    },
    {
      icon: FiMapPin,
      title: 'Based In',
      details: 'Global Team',
      description: 'Serving customers worldwide'
    }
  ];

  const faqs = [
    {
      question: 'How do you verify the deals you feature?',
      answer: 'We have a rigorous verification process where our team tests each platform, reviews terms and conditions, and ensures all deals are legitimate and up-to-date.'
    },
    {
      question: 'Are there any fees for using ClickMaliClub?',
      answer: 'ClickMaliClub is completely free for users. We earn commissions from our partner companies when you sign up through our links, but this never affects the deals or prices you receive.'
    },
    {
      question: 'How often are deals updated?',
      answer: 'We update our deals daily and monitor them for changes. Our team works around the clock to ensure you always have access to the latest and best offers.'
    },
    {
      question: 'Can I suggest a deal or platform to be featured?',
      answer: 'Absolutely! We welcome suggestions from our community. Please use the contact form above to share any platforms or deals you think we should review.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us - ClickMaliClub</title>
        <meta name="description" content="Get in touch with the ClickMaliClub team. We're here to help with any questions about deals, platforms, or partnerships." />
        <meta name="keywords" content="contact clickmaliclub, support, help, questions, partnerships" />
      </Helmet>
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-secondary-600 py-16">
          <div className="container-custom text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get In Touch
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
              Have questions about our deals? Want to suggest a platform? 
              Need support? We're here to help!
            </p>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                  
                  {responseMessage.text && (
                    <div className={`mb-6 p-4 rounded-lg ${
                      responseMessage.type === 'success' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {responseMessage.text}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <div className="relative">
                          <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Your full name"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <div className="relative">
                          <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="What's this about?"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <div className="relative">
                        <FiMessageSquare className="absolute left-3 top-3 text-gray-400" size={16} />
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={6}
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                          placeholder="Tell us how we can help..."
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <FiSend size={16} />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
                  <div className="space-y-6">
                    {contactInfo.map((info, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <info.icon className="text-primary-600" size={20} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{info.title}</h4>
                          <p className="text-primary-600 font-medium">{info.details}</p>
                          <p className="text-gray-600 text-sm">{info.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-primary-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Quick Response</h3>
                  <p className="text-gray-600 text-sm">
                    For urgent matters or deal-related questions, we typically respond within a few hours during business days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Find quick answers to common questions about ClickMaliClub and our services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partnership CTA */}
        <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600">
          <div className="container-custom text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Interested in Partnership?
            </h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto opacity-90">
              If you represent a company and would like to feature your deals on ClickMaliClub, 
              we'd love to hear from you!
            </p>
            <a 
              href="mailto:clickmaliclub@gmail.com" 
              className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Email Us for Partnerships
            </a>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact;
