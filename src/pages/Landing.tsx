import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import Preloader from '../components/landing/Preloader';
import HeroSection from '../components/landing/HeroSection';
import TextScrubSection from '../components/landing/TextScrubSection';
import StickyCardsSection from '../components/landing/StickyCardsSection';
import ClientCategories from '../components/landing/ClientCategories';
import ImpactStats from '../components/landing/ImpactStats';
import ExtremeTestimonial from '../components/landing/ExtremeTestimonial';
import CallToAction from '../components/landing/CallToAction';

export default function Landing() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isLoading]);

  return (
    <div className="min-h-screen font-sans selection:bg-teal-500/30 selection:text-teal-900">
      <AnimatePresence>
        {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <main className="relative z-10 flex flex-col">
        <HeroSection />
        <TextScrubSection />
        <ImpactStats />
        <ClientCategories />
        <StickyCardsSection />
        <ExtremeTestimonial />
        <CallToAction />
      </main>
    </div>
  );
}
