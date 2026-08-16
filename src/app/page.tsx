'use client';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AboutUs from '@/components/AboutUs';
import FeaturedListings from '@/components/FeaturedListings';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Hero />
        <AboutUs />
        <FeaturedListings />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
