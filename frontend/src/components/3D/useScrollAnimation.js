import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const useScrollAnimation = () => {
  const elementRef = useRef();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (isVisible) {
        const scrollPercent = (window.innerHeight - rect.top) / window.innerHeight;

        // Rotate and scale based on scroll
        gsap.to(element, {
          rotationZ: scrollPercent * 360,
          scale: 0.8 + scrollPercent * 0.4,
          opacity: Math.max(0.3, 1 - Math.abs(scrollPercent - 0.5) * 0.6),
          duration: 0,
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return elementRef;
};

export const useMouseFollow = () => {
  const elementRef = useRef();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = (e.clientX - centerX) * 0.1;
      const distY = (e.clientY - centerY) * 0.1;

      gsap.to(element, {
        x: distX,
        y: distY,
        duration: 0.3,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return elementRef;
};

export const use3DScrollTrack = () => {
  const elementRef = useRef();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);

      gsap.to(element, {
        rotationX: scrollPercent * 45,
        rotationY: scrollPercent * 45,
        y: scrollPercent * 50,
        duration: 0.1,
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return elementRef;
};
