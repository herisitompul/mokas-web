'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ImageLightbox from './ImageLightbox';
import styles from './AboutUs.module.css';

export default function AboutUs() {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = ['/images/38.png', '/images/39.png', '/images/24.png'];

  // Auto-play interval: slides every 3.5 seconds, pauses when hovered
  useEffect(() => {
    if (images.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3500);

    return () => clearInterval(timer);
  }, [images.length, isHovered]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  return (
    <section className={styles.section} id="why-choose-us">
      <div className="container">
        <div className={styles.grid}>
          {/* Kolom Visual (Foto Showroom Slideshow) */}
          <div className={styles.imageCol}>
            <div 
              className={`${styles.imageWrapper} glass-panel`}
              onClick={() => setIsLightboxOpen(true)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {images.map((img, idx) => (
                <Image
                  key={idx}
                  src={img}
                  alt={`Showroom Sitompul Motor Bekas Pahae - Foto ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={`${styles.image} ${idx === currentImageIndex ? styles.imageVisible : styles.imageHidden}`}
                  priority={idx === 0}
                  unoptimized
                />
              ))}

              {/* Navigation buttons */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className={`${styles.navBtn} ${styles.prevBtn}`}
                    aria-label="Foto sebelumnya"
                  >
                    ‹
                  </button>
                  <button
                    onClick={handleNextImage}
                    className={`${styles.navBtn} ${styles.nextBtn}`}
                    aria-label="Foto berikutnya"
                  >
                    ›
                  </button>
                  
                  {/* Dots Indicator */}
                  <div className={styles.dotsContainer}>
                    {images.map((_, index) => (
                      <span
                        key={index}
                        onClick={(e) => handleDotClick(e, index)}
                        className={`${styles.dot} ${index === currentImageIndex ? styles.activeDot : ''}`}
                      />
                    ))}
                  </div>
                </>
              )}

              <div className={styles.imageOverlay}>
                <span className={styles.zoomIcon}>🔍</span>
                <span className={styles.zoomText}>Klik untuk Memperbesar</span>
              </div>
            </div>
          </div>

          {/* Kolom Deskripsi */}
          <div className={styles.contentCol}>
            <div className={styles.header}>
              <span className="badge badge-secondary">TENTANG KAMI</span>
              <h2 className={styles.title}>Showroom Sitompul Motor Bekas</h2>
              <p className={styles.subtitle}>
                Solusi terpercaya untuk kebutuhan transportasi berkualitas di wilayah Pahae dan sekitarnya sejak 2014.
              </p>
            </div>

            <p className={styles.description}>
              Kami memahami bahwa membeli motor bekas membutuhkan rasa percaya yang tinggi. Oleh karena itu, di <strong>Sitompul Motor Bekas</strong>, kami selalu mengedepankan kejujuran kondisi unit, kelengkapan berkas, dan pelayanan prima. Setiap unit motor yang kami tawarkan telah melalui inspeksi menyeluruh untuk menjamin keamanan dan kenyamanan berkendara Anda.
            </p>

            {/* Daftar Keunggulan */}
            <div className={styles.features}>
              {/* <div className={styles.featureItem}>
                <div className={styles.featureIcon}>🛡️</div>
                <div className={styles.featureText}>
                  <h4>Mesin Bergaransi</h4>
                  <p>Semua unit motor telah melalui inspeksi ketat dan kami berikan jaminan garansi mesin.</p>
                </div>
              </div> */}

              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>📄</div>
                <div className={styles.featureText}>
                  <h4>Surat-surat 100% Aman</h4>
                  <p>STNK, BPKB, dan Faktur lengkap serta dijamin legalitasnya secara hukum.</p>
                </div>
              </div>

              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>🤝</div>
                <div className={styles.featureText}>
                  <h4>Kondisi Transparan</h4>
                  <p>Kelayakan mesin, kondisi fisik, dan riwayat pajak kami jelaskan apa adanya demi kepuasan Anda.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal untuk melihat foto dalam ukuran penuh */}
      <ImageLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={images}
        initialIndex={currentImageIndex}
        title="Showroom Sitompul Motor Bekas Pahae"
      />
    </section>
  );
}
