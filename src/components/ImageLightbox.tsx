'use client';

import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import styles from './ImageLightbox.module.css';

interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[] | string;
  initialIndex?: number;
  title: string;
}

export default function ImageLightbox({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  title,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevInitialIndex, setPrevInitialIndex] = useState(initialIndex);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => {
      clearTimeout(timer);
      setMounted(false);
    };
  }, []);

  // Adjust state during render when props change, avoiding setState inside useEffect
  if (isOpen !== prevIsOpen || initialIndex !== prevInitialIndex) {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
    setPrevIsOpen(isOpen);
    setPrevInitialIndex(initialIndex);
  }

  // Normalize images to always be an array
  const imageList = Array.isArray(images) ? images : [images];

  // Navigation handlers defined with useCallback
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  }, [imageList.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  }, [imageList.length]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && imageList.length > 1) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && imageList.length > 1) {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, imageList.length, handlePrev, handleNext, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      {/* Close Button */}
      <button className={styles.closeBtn} onClick={onClose} aria-label="Tutup Galeri">
        &times;
      </button>

      {/* Navigation Buttons for multi-image */}
      {imageList.length > 1 && (
        <>
          <button
            className={`${styles.navBtn} ${styles.prevBtn}`}
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Foto sebelumnya"
          >
            &#8249;
          </button>
          <button
            className={`${styles.navBtn} ${styles.nextBtn}`}
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Foto berikutnya"
          >
            &#8250;
          </button>
        </>
      )}

      {/* Main Image Area */}
      <div className={styles.imageContainer} onClick={(e) => e.stopPropagation()}>
        <Image
          src={imageList[currentIndex]}
          alt={`${title} - Foto ${currentIndex + 1}`}
          fill
          sizes="90vw"
          className={styles.lightboxImage}
          priority
          unoptimized
        />
      </div>

      {/* Info/Title & Counter Bar */}
      <div className={styles.infoPanel} onClick={(e) => e.stopPropagation()}>
        <span className={styles.title}>{title}</span>
        {imageList.length > 1 && (
          <span className={styles.counter}>
            {currentIndex + 1} / {imageList.length}
          </span>
        )}
      </div>
    </div>,
    document.body
  );
}
