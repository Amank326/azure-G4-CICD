import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useAICMAnimations = () => {
  useEffect(() => {
    // Hero Text Animation on Load
    gsap.fromTo('.hero-title', 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );

    gsap.fromTo('.hero-subtitle', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power3.out' }
    );

    // Button Hover Effects
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, { scale: 1.05, duration: 0.3 });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { scale: 1, duration: 0.3 });
      });
    });

    // Pill Hover Effects
    document.querySelectorAll('.pill').forEach(pill => {
      pill.addEventListener('mouseenter', () => {
        gsap.to(pill, { 
          backgroundColor: 'rgba(102, 126, 234, 0.25)',
          y: -5,
          duration: 0.3 
        });
      });
      pill.addEventListener('mouseleave', () => {
        gsap.to(pill, { 
          backgroundColor: 'rgba(102, 126, 234, 0.15)',
          y: 0,
          duration: 0.3 
        });
      });
    });

    // Scroll Animations
    ScrollTrigger.create({
      trigger: '.landing-hero-container',
      onUpdate: (self) => {
        gsap.to('.hero-content', {
          opacity: Math.max(0, 1 - self.getVelocity() / 1000),
          duration: 0.3
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
};

export const useMouseFollowBlob = (ref) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return mouse;
};
