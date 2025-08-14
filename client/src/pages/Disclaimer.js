import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FiAlertTriangle, FiInfo, FiShield } from 'react-icons/fi';

const Disclaimer = () => {
  return (
    <>
      <Helmet>
        <title>Disclaimer - ClickMaliClub</title>
        <meta name="description" content="Important disclaimers regarding risk, affiliate relationships, and information provided by ClickMaliClub." />
      </Helmet>
      
      <div className="min-h-screen py-16">
        <div className="container-custom max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Disclaimer
            </h1>
            
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> August 14, 2025
            </p>

            {/* Risk Warning */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <div className="flex items-start">
                <FiAlertTriangle className="w-6 h-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-bold text-red-800 mb-2">Risk Warning</h2>
                  <p className="text-red-700">
                    Trading forex, cryptocurrencies, and other financial instruments involves substantial risk of loss and is not suitable for all investors. You should carefully consider your financial situation, level of experience, and risk appetite before making any trading decisions. Past performance is not indicative of future results.
                  </p>
                </div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. General Information</h2>
              <p className="text-gray-700 mb-4">
                The information provided on ClickMaliClub is for general informational and educational purposes only. It should not be considered as personalized financial, investment, trading, or professional advice. Always consult with qualified financial advisors before making any investment decisions.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. No Financial Advice</h2>
              <p className="text-gray-700 mb-4">
                ClickMaliClub does not provide financial, investment, or trading advice. We are not licensed financial advisors, and our content should not be interpreted as such. Any information, guides, reviews, or recommendations are for educational purposes only and should not be the sole basis for any financial decisions.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Affiliate Relationships</h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <div className="flex items-start">
                  <FiInfo className="w-6 h-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-blue-800 mb-2">Affiliate Disclosure</h3>
                    <p className="text-blue-700">
                      ClickMaliClub participates in affiliate marketing programs. We may receive compensation when you click on links or sign up for services through our platform. This compensation helps us maintain and improve our services at no additional cost to you.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-4">
                Our affiliate relationships may influence which products or services we feature, but they do not affect our editorial content or recommendations. We strive to provide honest, unbiased information about all featured platforms and services.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Third-Party Platforms and Services</h2>
              <p className="text-gray-700 mb-4">
                ClickMaliClub is not responsible for the actions, content, products, or services of third-party platforms that we link to or recommend. Each platform has its own terms of service, privacy policies, and business practices. We encourage you to review these carefully before engaging with any third-party service.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.1 Forex and Trading Platforms</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>All forex and financial trading involves significant risk of loss</li>
                <li>Leverage can amplify both profits and losses</li>
                <li>Market conditions can change rapidly and unpredictably</li>
                <li>Past performance does not guarantee future results</li>
                <li>Only trade with money you can afford to lose</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.2 Cryptocurrency Platforms</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Cryptocurrency markets are highly volatile and speculative</li>
                <li>Digital assets are subject to regulatory changes</li>
                <li>There is risk of total loss of investment</li>
                <li>Cryptocurrency transactions may be irreversible</li>
                <li>Security risks including hacking and technical failures exist</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.3 Betting and Gambling Platforms</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Gambling involves risk of monetary loss</li>
                <li>Betting can be addictive and should be done responsibly</li>
                <li>Only bet with money you can afford to lose</li>
                <li>Seek help if gambling becomes a problem</li>
                <li>Age and jurisdiction restrictions may apply</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Accuracy of Information</h2>
              <p className="text-gray-700 mb-4">
                While we strive to provide accurate and up-to-date information, we cannot guarantee the completeness, reliability, or accuracy of all content on our platform. Information about offers, bonuses, terms, and conditions may change without notice. Always verify current terms directly with the service provider.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Regulatory Compliance</h2>
              <p className="text-gray-700 mb-4">
                Financial services and trading regulations vary by country and jurisdiction. It is your responsibility to ensure that any trading or investment activities you engage in comply with the laws and regulations of your jurisdiction. Some services may not be available in certain countries.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Personal Responsibility</h2>
              <p className="text-gray-700 mb-4">
                You are solely responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Conducting your own research and due diligence</li>
                <li>Understanding the risks associated with any financial activity</li>
                <li>Complying with applicable laws and regulations</li>
                <li>Making informed decisions based on your personal financial situation</li>
                <li>Seeking professional advice when needed</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                ClickMaliClub, its owners, employees, and affiliates shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of our platform or any third-party services accessed through our links. This includes, but is not limited to, financial losses, trading losses, or any other damages.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Updates and Changes</h2>
              <p className="text-gray-700 mb-4">
                This disclaimer may be updated from time to time to reflect changes in our practices or applicable laws. We encourage you to review this page periodically for the most current information.
              </p>

              {/* Contact Section */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
                <div className="flex items-start">
                  <FiShield className="w-6 h-6 text-gray-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Questions or Concerns?</h2>
                    <p className="text-gray-700 mb-4">
                      If you have any questions about this disclaimer or our practices, please contact us:
                    </p>
                    <ul className="list-none text-gray-700">
                      <li><strong>Email:</strong> clickmaliclub@gmail.com</li>
                      <li><strong>Website:</strong> <a href="/contact" className="text-primary-600 hover:text-primary-700">Contact Form</a></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Final Warning */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
                <div className="flex items-start">
                  <FiAlertTriangle className="w-6 h-6 text-yellow-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-yellow-800 mb-2">Remember</h3>
                    <p className="text-yellow-700">
                      Never invest more than you can afford to lose. Always do your own research and consider seeking advice from qualified financial professionals before making any investment decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Disclaimer;
