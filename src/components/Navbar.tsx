'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={`${styles.navbar} glass-panel`}>
      <div className={`${styles.container} container`}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          SITOMPUL<span>MOKAS</span>
        </Link>

        {/* Desktop Menu */}
        <div className={styles.navMenu}>
          <Link href="/#catalog" className={styles.navLink}>Katalog</Link>
          <Link href="/#why-choose-us" className={styles.navLink}>Tentang Kami</Link>
          <Link href="/#testimonials" className={styles.navLink}>Testimoni</Link>
          <Link href="/#contact" className={styles.navLink}>Hubungi Kami</Link>
        </div>

        {/* CTA Button */}
        <div className={styles.navActions}>
          <Link href="https://wa.me/6281263374426?text=Halo%20Sitompul%20Motor%20Bekas%20Pahae,%20saya%20ingin%20menjual%20motor%20saya" target="_blank" className="btn btn-primary">
            Jual Motor
          </Link>
        </div>

        {/* Hamburger Menu (Mobile) */}
        <button className={`${styles.hamburger} ${isOpen ? styles.active : ''}`} onClick={toggleMenu} aria-label="Toggle Menu">
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>

        {/* Mobile Menu Panel */}
        <div className={`${styles.mobileMenu} ${isOpen ? styles.show : ''}`}>
          <Link href="/#catalog" className={styles.mobileNavLink} onClick={toggleMenu}>Katalog</Link>
          <Link href="/#why-choose-us" className={styles.mobileNavLink} onClick={toggleMenu}>Tentang Kami</Link>
          <Link href="/#testimonials" className={styles.mobileNavLink} onClick={toggleMenu}>Testimoni</Link>
          <Link href="/#contact" className={styles.mobileNavLink} onClick={toggleMenu}>Hubungi Kami</Link>
          <div className={styles.mobileCta}>
            <Link href="https://wa.me/6281263374426?text=Halo%20Sitompul%20Motor%20Bekas%20Pahae,%20saya%20ingin%20menjual%20motor%20saya" target="_blank" className="btn btn-primary" style={{ width: '100%' }}>
              Jual Motor
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
