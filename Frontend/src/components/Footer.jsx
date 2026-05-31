import React from 'react';
import '../App.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-columns">
          <div className="footer-column">
            <h4>ABOUT ZOMATO</h4>
            <ul>
              <li>Who We Are</li>
              <li>Blog</li>
              <li>Work With Us</li>
              <li>Investor Relations</li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>ZOMAVERSE</h4>
            <ul>
              <li>Zomato</li>
              <li>Blinkit</li>
              <li>Feeding India</li>
              <li>Hyperpure</li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>FOR RESTAURANTS</h4>
            <ul>
              <li>Partner With Us</li>
              <li>Apps For You</li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>LEARN MORE</h4>
            <ul>
              <li>Privacy</li>
              <li>Security</li>
              <li>Terms</li>
            </ul>
          </div>

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