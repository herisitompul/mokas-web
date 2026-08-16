'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import ImageLightbox from './ImageLightbox';
import styles from './Testimonials.module.css';

interface SoldUnit {
  id: string;
  motorModel: string;
  image: string;
}

const mockSoldUnits: SoldUnit[] = [
  {
    id: "sold-001",
    motorModel: "Honda CBR250RR Black Edition",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "sold-002",
    motorModel: "Yamaha NMAX 155 Connected",
    image: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "sold-003",
    motorModel: "Vespa Sprint 150 i-Get ABS",
    image: "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?q=80&w=600&auto=format&fit=crop"
  }
];

export default function Testimonials() {
  const [soldUnitsList, setSoldUnitsList] = useState<SoldUnit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState<SoldUnit | null>(null);

  useEffect(() => {
    async function fetchSoldUnits() {
      setIsLoading(true);

      if (!isSupabaseConfigured) {
        setSoldUnitsList(mockSoldUnits);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('sold_units')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          interface DbSoldUnit {
            id: string;
            motor_model: string;
            image: string;
          }

          const mapped: SoldUnit[] = data.map((row: DbSoldUnit) => ({
            id: row.id,
            motorModel: row.motor_model,
            image: row.image
          }));
          setSoldUnitsList(mapped);
        }
      } catch (err) {
        console.error('Error fetching sold units, using fallback mock data:', err);
        setSoldUnitsList(mockSoldUnits);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSoldUnits();
  }, []);

  return (
    <section className={styles.section} id="testimonials">
      <div className="container">
        {/* Section Header */}
        <div className={styles.header}>
          <span className="badge badge-secondary">Galeri Penjualan</span>
          <h2 className={styles.title}>Unit Mokas yang Telah Terjual</h2>
          <p className={styles.subtitle}>
            Bukti kepuasan pelanggan yang telah mempercayakan pembelian motor bekas berkualitas mereka di Sitompul Motor Bekas Pahae.
          </p>
        </div>

        {/* Sold Units Grid */}
        {!isLoading && soldUnitsList.length > 0 ? (
          <div className={styles.grid}>
            {soldUnitsList.map((item) => (
              <div key={item.id} className={`${styles.card} glass-panel`}>
                <div 
                  className={styles.imageWrapper}
                  onClick={() => setSelectedUnit(item)}
                  style={{ cursor: 'pointer' }}
                >
                  <Image
                    src={item.image}
                    alt={item.motorModel}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                    className={styles.image}
                    unoptimized
                  />
                  <div className={styles.badgeWrapper}>
                    <span className="badge badge-primary">TERJUAL</span>
                  </div>
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.icon}>🏍️</span>
                  <span className={styles.motorName}>{item.motorModel}</span>
                </div>
              </div>
            ))}
          </div>
        ) : isLoading ? (
          <div className={styles.grid}>
            {/* Show local fallback while loading silently, or simple text */}
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', gridColumn: '1 / -1' }}>
              Memuat galeri penjualan...
            </p>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
            Belum ada unit terjual yang terdata.
          </p>
        )}

        {/* Trust Stats Card */}
        <div className={`${styles.trustCTA} glass-panel`}>
          <div className={styles.ctaContent}>
            <h3>Tertarik dengan Unit Pilihan Kami?</h3>
            <p>Konsultasikan kebutuhan motor bekas Anda atau survey langsung ke showroom kami di Pahae.</p>
          </div>
          <div className={styles.ctaActions}>
            <a
              href="https://wa.me/6281263374426?text=Halo%20Sitompul%20Motor,%20saya%20tertarik%20ingin%20tanya%20unit%20motor%20bekas%20yang%20tersedia"
              target="_blank"
              className="btn btn-primary"
            >
              Hubungi Kami Sekarang
            </a>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <ImageLightbox
        isOpen={selectedUnit !== null}
        onClose={() => setSelectedUnit(null)}
        images={selectedUnit ? selectedUnit.image : ''}
        title={selectedUnit ? selectedUnit.motorModel : ''}
      />
    </section>
  );
}
