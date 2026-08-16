'use client';

import { useState, useMemo, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Motorcycle, motorcycles as mockMotorcycles } from '../data/motorcycles';
import MotorcycleCard from './MotorcycleCard';
import styles from './FeaturedListings.module.css';

export default function FeaturedListings() {
  // Local state for catalog listing and status
  const [motorList, setMotorList] = useState<Motorcycle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Local state for filtering
  const [activeTab, setActiveTab] = useState<'All' | 'Matic' | 'Kopling'>('All');
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('');

  // Fetch data from Supabase or fallback to mock data
  useEffect(() => {
    async function fetchMotorcycles() {
      setIsLoading(true);
      
      if (!isSupabaseConfigured) {
        // Fallback ke data mock jika env belum di-config
        setMotorList(mockMotorcycles);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('motorcycles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          interface DbMotorcycle {
            id: string;
            brand: string;
            model: string;
            year: number;
            price: string | number;
            mileage: number;
            transmission: string;
            engine_capacity: number;
            location: string;
            images: string[];
            status: string;
            badge: string | null;
            badge_type: string | null;
            description: string;
            tax_paid_until: string;
          }

          // Map database snake_case fields ke camelCase typescript model
          const mappedData: Motorcycle[] = data.map((row: DbMotorcycle) => ({
            id: row.id,
            brand: row.brand,
            model: row.model,
            year: row.year,
            price: Number(row.price),
            mileage: row.mileage,
            transmission: row.transmission as 'Matic' | 'Manual' | 'Kopling',
            engineCapacity: row.engine_capacity,
            location: row.location,
            images: row.images || [],
            status: row.status as 'available' | 'booked' | 'sold',
            badge: row.badge || undefined,
            badgeType: (row.badge_type as 'primary' | 'secondary' | 'gold' | 'success') || undefined,
            description: row.description,
            taxPaidUntil: row.tax_paid_until
          }));
          setMotorList(mappedData);
        }
      } catch (err) {
        console.error('Error mengambil data dari Supabase, memuat data mock lokal:', err);
        // Fallback jika terjadi error query (misal tabel belum dibuat)
        setMotorList(mockMotorcycles);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMotorcycles();
  }, []);

  // Filter logic combined
  const filteredMotorcycles = useMemo(() => {
    return motorList.filter((motor) => {
      // 1. Filter by category tab
      if (activeTab === 'Matic' && motor.transmission !== 'Matic') return false;
      if (activeTab === 'Kopling' && motor.transmission !== 'Kopling' && motor.transmission !== 'Manual') return false;

      // 2. Filter by search keyword
      if (search) {
        const query = search.toLowerCase();
        const modelMatch = motor.model.toLowerCase().includes(query);
        const brandMatch = motor.brand.toLowerCase().includes(query);
        const descMatch = motor.description.toLowerCase().includes(query);
        if (!modelMatch && !brandMatch && !descMatch) return false;
      }

      // 3. Filter by brand dropdown
      if (brand && motor.brand !== brand) return false;

      return true;
    });
  }, [motorList, activeTab, search, brand]);

  const handleResetFilters = () => {
    setSearch('');
    setBrand('');
    setActiveTab('All');
  };

  return (
    <section className={styles.section} id="catalog">
      <div className="container">
        {/* Section Header */}
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <span className="badge badge-secondary">Katalog Unit</span>
            <h2 className={styles.title}>Koleksi Mokas Pilihan</h2>
            <p className={styles.subtitle}>
              Setiap unit telah melalui proses inspeksi ketat dan dipastikan prima sebelum dipajang.
            </p>
          </div>

          {/* Filtering and Search Controls Area */}
          <div className={styles.controls}>
            {/* Category Tabs */}
            <div className={`${styles.tabs} glass-panel`}>
              <button
                onClick={() => setActiveTab('All')}
                className={`${styles.tab} ${activeTab === 'All' ? styles.activeTab : ''}`}
              >
                Semua
              </button>
              <button
                onClick={() => setActiveTab('Matic')}
                className={`${styles.tab} ${activeTab === 'Matic' ? styles.activeTab : ''}`}
              >
                Matic
              </button>
              <button
                onClick={() => setActiveTab('Kopling')}
                className={`${styles.tab} ${activeTab === 'Kopling' ? styles.activeTab : ''}`}
              >
                Kopling & Manual
              </button>
            </div>

            {/* Keyword Search & Brand Select */}
            <div className={styles.searchBar}>
              <input
                type="text"
                placeholder="Cari model motor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
              />
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className={styles.brandSelect}
              >
                <option value="">Semua Merek</option>
                <option value="Honda">Honda</option>
                <option value="Yamaha">Yamaha</option>
                <option value="Kawasaki">Kawasaki</option>
                <option value="Vespa">Vespa</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter / Loading Indicator */}
        <div className={styles.resultsBar}>
          {isLoading ? (
            <p className={styles.loadingText}>⌛ Menghubungkan ke database...</p>
          ) : (
            <p>
              Menampilkan <span>{filteredMotorcycles.length}</span> unit motor bekas
            </p>
          )}
        </div>

        {/* Grid Container */}
        {isLoading ? (
          <div className={styles.loadingGrid}>
            <div className={`${styles.spinner} glass-panel`}>
              <div className={styles.doubleBounce1}></div>
              <div className={styles.doubleBounce2}></div>
              <p>Memuat Data Motor...</p>
            </div>
          </div>
        ) : filteredMotorcycles.length > 0 ? (
          <div className={styles.grid}>
            {filteredMotorcycles.map((motor) => (
              <MotorcycleCard key={motor.id} motor={motor} />
            ))}
          </div>
        ) : (
          <div className={`${styles.notFound} glass-panel`}>
            <div className={styles.notFoundIcon}>🏍️❌</div>
            <h3>Motor Tidak Ditemukan</h3>
            <p>
              Maaf, unit motor yang Anda cari tidak cocok dengan filter saat ini. Coba ganti kata kunci atau setel ulang filter pencarian Anda.
            </p>
            <button onClick={handleResetFilters} className="btn btn-primary" style={{ marginTop: '16px' }}>
              Reset Semua Filter
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
