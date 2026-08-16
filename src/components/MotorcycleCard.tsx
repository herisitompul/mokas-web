'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Motorcycle } from '../data/motorcycles';
import ImageLightbox from './ImageLightbox';
import styles from './MotorcycleCard.module.css';

interface MotorcycleCardProps {
  motor: Motorcycle;
}

export default function MotorcycleCard({ motor }: MotorcycleCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Format price helper (e.g. 29800000 -> Rp. 29,8 Jutaan)
  const formatPrice = (price: number) => {
    if (price < 1000000) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price).replace('Rp', 'Rp.');
    }
    const millions = Math.floor(price / 1000000);
    const remainder = (price % 1000000) / 100000;
    const roundedRemainder = Math.round(remainder);
    
    if (roundedRemainder > 0 && roundedRemainder < 10) {
      return `Rp. ${millions},${roundedRemainder} Jutaan`;
    } else if (roundedRemainder === 10) {
      return `Rp. ${millions + 1} Jutaan`;
    }
    return `Rp. ${millions} Jutaan`;
  };

  // Format mileage helper (e.g. 12500 -> 12.500 km)
  const formatMileage = (km: number) => {
    return new Intl.NumberFormat('id-ID').format(km) + ' km';
  };

  // Build WhatsApp text
  const waText = encodeURIComponent(
    `Halo Sitompul Motor Bekas Pahae, saya tertarik untuk bertanya atau survey unit motor ini:\n\n` +
    `- Model: ${motor.brand} ${motor.model} (${motor.year})\n` +
    `- Harga: ${formatPrice(motor.price)}\n` +
    `- ID Unit: ${motor.id}\n\n` +
    `Apakah unit ini masih tersedia?`
  );

  const waLink = `https://wa.me/6281262374426?text=${waText}`;

  // Badge mapping
  const getBadge = () => {
    if (motor.status === 'sold') {
      return <span className="badge badge-primary">TERJUAL</span>;
    }
    if (motor.status === 'booked') {
      return <span className="badge badge-gold">BOOKED</span>;
    }
    if (motor.badge) {
      const typeClass = motor.badgeType ? `badge-${motor.badgeType}` : 'badge-secondary';
      return <span className={`badge ${typeClass}`}>{motor.badge}</span>;
    }
    return null;
  };

  // Safe image list fallback
  const images = motor.images && motor.images.length > 0 
    ? motor.images 
    : ['https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=800&auto=format&fit=crop'];

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
    <div 
      className={`${styles.card} glass-panel`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slider Image Area */}
      <div 
        className={styles.imageWrapper} 
        onClick={() => setIsLightboxOpen(true)}
        style={{ cursor: 'pointer' }}
      >
        {images.map((img, idx) => (
          <Image
            key={idx}
            src={img}
            alt={`${motor.brand} ${motor.model}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`${styles.image} ${idx === currentImageIndex ? styles.imageVisible : styles.imageHidden}`}
            priority={motor.id === "mokas-001" && idx === 0}
            unoptimized
          />
        ))}

        {/* Show navigation buttons only if there is more than 1 image */}
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

        <div className={styles.badgeWrapper}>
          {getBadge()}
        </div>
      </div>

      {/* Content */}
      <div className={styles.details}>
        <div className={styles.header}>
          <span className={styles.brand}>{motor.brand}</span>
          <h3 className={styles.title}>{motor.model}</h3>
        </div>

        {/* Specs Grid */}
        <div className={styles.specsGrid}>
          <div className={styles.specItem}>
            <span className={styles.specIcon}>📅</span>
            <span className={styles.specValue}>{motor.year}</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specIcon}>⚙️</span>
            <span className={styles.specValue}>{motor.transmission}</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specIcon}>⚡</span>
            <span className={styles.specValue}>{motor.engineCapacity} cc</span>
          </div>
          {motor.mileage > 0 && (
            <div className={styles.specItem}>
              <span className={styles.specIcon}>🛣️</span>
              <span className={styles.specValue}>{formatMileage(motor.mileage)}</span>
            </div>
          )}
        </div>

        {/* Location & Tax Info */}
        <div className={styles.metaRow}>
          <span className={styles.location}>📍 {motor.location}</span>
          <span className={styles.taxInfo}>
            Pajak {motor.taxPaidUntil === 'OFF' || motor.taxPaidUntil === 'Off' || motor.taxPaidUntil === 'off' ? 'OFF' : 'ON'}
          </span>
        </div>

        {/* Divider */}
        <div className={styles.divider}></div>

        {/* Footer row (Price & WhatsApp CTA) */}
        <div className={styles.cardFooter}>
          <div className={styles.priceContainer}>
            <span className={styles.priceLabel}>Buka Harga</span>
            <span className={styles.price}>{formatPrice(motor.price)}</span>
          </div>
          
          {motor.status === 'available' ? (
            <Link href={waLink} target="_blank" className="btn btn-whatsapp" style={{ padding: '10px 16px', fontSize: '0.85rem' }}>
              💬 Chat
            </Link>
          ) : (
            <button className="btn btn-secondary" disabled style={{ padding: '10px 16px', fontSize: '0.85rem', cursor: 'not-allowed' }}>
              Detail
            </button>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      <ImageLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={images}
        initialIndex={currentImageIndex}
        title={`${motor.brand} ${motor.model}`}
      />
    </div>
  );
}
