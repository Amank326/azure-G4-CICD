import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './AICMFeatures.css';

gsap.registerPlugin(ScrollTrigger);

const AICMFeatures = ({ stats }) => {
  useEffect(() => {
    // Animate feature cards on scroll
    gsap.utils.toArray('.feature-card').forEach((card) => {
      gsap.fromTo(card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const features = [
    {
      icon: '🔍',
      title: 'AI-Powered Search',
      description: 'Intelligent search that understands your content. Find files instantly with natural language queries.'
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Experience sub-second file operations. Optimized for speed and performance at scale.'
    },
    {
      icon: '🔒',
      title: 'Enterprise Security',
      description: 'Military-grade encryption and compliance. Your data is always protected and private.'
    },
    {
      icon: '🌍',
      title: 'Global Access',
      description: 'Access your files from anywhere. Seamless sync across all your devices.'
    },
    {
      icon: '📊',
      title: 'Smart Analytics',
      description: 'Get insights into your data usage. Track trends and optimize storage efficiently.'
    },
    {
      icon: '🚀',
      title: 'Auto Organization',
      description: 'Automatic file categorization and tagging. No manual organization needed.'
    }
  ];

  return (
    <section className="aicm-features-section">
      <div className="features-container">
        <div className="section-header">
          <h2>Why CloudFlow?</h2>
          <p>Everything you need for modern file management</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="features-stats">
          <div className="stat-box">
            <div className="stat-value">{stats.totalFiles}+</div>
            <div className="stat-desc">Files Managed</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{stats.categories}</div>
            <div className="stat-desc">Categories</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{stats.storageUsed} GB</div>
            <div className="stat-desc">Cloud Storage</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AICMFeatures;
