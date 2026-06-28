import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const footerSections = [
  {
    heading: 'ABOUT ZOMATO',
    links: [
      { label: 'Who We Are', to: '/page/about' },
      { label: 'Blog', to: '/page/blog' },
      { label: 'Work With Us', to: '/page/work-with-us' },
      { label: 'Investor Relations', to: '/page/investor-relations' },
    ],
  },
  {
    heading: 'ZOMAVERSE',
    links: [
      { label: 'Zomato', to: '/page/zomato' },
      { label: 'Blinkit', to: '/page/blinkit' },
      { label: 'Feeding India', to: '/page/feeding-india' },
      { label: 'Hyperpure', to: '/page/hyperpure' },
    ],
  },
  {
    heading: 'FOR RESTAURANTS',
    links: [
      { label: 'Partner With Us', to: '/page/partner-with-us' },
      { label: 'Apps For You', to: '/page/apps-for-you' },
    ],
  },
  {
    heading: 'LEARN MORE',
    links: [
      { label: 'Privacy', to: '/page/privacy' },
      { label: 'Security', to: '/page/security' },
      { label: 'Terms', to: '/page/terms' },
    ],
  },
];

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-columns">
          {footerSections.map((section) => (
            <div className="footer-column" key={section.heading}>
              <h4>{section.heading}</h4>
              <ul>
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="footer-column">
            <h4>SOCIAL LINKS</h4>
            <div className="social-icons">
              <div className="social-placeholder">📱</div>
              <div className="social-placeholder">📱</div>
              <div className="social-placeholder">📱</div>
              <div className="social-placeholder">📱</div>
            </div>
            <div className="app-stores">
              <div className="app-store">App Store</div>
              <div className="app-store">Google Play</div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="language-selector">
          <span>English ▼</span>
        </div>
        <p>
          By continuing past this page, you agree to our Terms of Service, Cookie Policy, 
          Privacy Policy and Content Policies. © 2008-2025 Zomato Ltd.
        </p>
      </div>
    </footer>
  );
}

export default Footer;