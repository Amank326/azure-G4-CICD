import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './AICMFooter.css';

gsap.registerPlugin(ScrollTrigger);

const AICMFooter = ({ onGetStarted }) => {
  useEffect(() => {
    // Animate footer on scroll
    gsap.fromTo('.footer-cta',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: '.footer-cta',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );

    // Animate testimonials
    gsap.utils.toArray('.testimonial-card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, x: i % 2 === 0 ? -50 : 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          delay: i * 0.2,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }, []);

  return (
    <footer className="aicm-footer">
      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2>Loved by Teams Worldwide</h2>
          <p>See what CloudFlow users have to say</p>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <p className="quote">
              "CloudFlow transformed how our team manages files. The AI search is absolutely game-changing!"
            </p>
            <div className="author">
              <div className="avatar">AS</div>
              <div>
                <div className="author-name">Alex Smith</div>
                <div className="author-role">CEO, Tech Startup</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <p className="quote">
              "The 3D visualization makes file management fun. Our team loves the sleek interface!"
            </p>
            <div className="author">
              <div className="avatar">JD</div>
              <div>
                <div className="author-name">Jane Doe</div>
                <div className="author-role">Designer, Creative Agency</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <p className="quote">
              "Enterprise-grade security with a consumer-friendly experience. Highly recommended!"
            </p>
            <div className="author">
              <div className="avatar">MJ</div>
              <div>
                <div className="author-name">Mike Johnson</div>
                <div className="author-role">IT Manager, Fortune 500</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="footer-cta">
        <div className="cta-content">
          <h2>Ready to Transform Your File Management?</h2>
          <p>Join thousands of teams using CloudFlow to organize their digital workspace.</p>
          <div className="cta-buttons">
            <button className="btn-cta-primary" onClick={onGetStarted}>
              Start Free Trial
            </button>
            <button className="btn-cta-secondary">
              Schedule Demo
            </button>
          </div>
          <p className="cta-meta">No credit card required • Free for 14 days</p>
        </div>
      </section>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-content">
          <div className="footer-column">
            <h4>CloudFlow</h4>
            <p>Intelligent file management for modern teams.</p>
          </div>
          <div className="footer-column">
            <h4>Product</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#security">Security</a></li>
              <li><a href="#roadmap">Roadmap</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Legal</h4>
            <ul>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#cookies">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-divider"></div>
        <div className="footer-copyright">
          <p>&copy; 2024 CloudFlow. All rights reserved.</p>
          <div className="social-links">
            <a href="#twitter" className="social-icon">𝕏</a>
            <a href="#github" className="social-icon">⚙️</a>
            <a href="#linkedin" className="social-icon">in</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AICMFooter;
