'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import styles from './admin.module.css';

interface Motorcycle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: 'Matic' | 'Manual' | 'Kopling';
  engineCapacity: number;
  location: string;
  images: string[];
  status: 'available' | 'booked' | 'sold';
  badge?: string;
  badgeType?: 'primary' | 'secondary' | 'gold' | 'success';
  description: string;
  taxPaidUntil: string;
}

interface SoldUnit {
  id: string;
  motorModel: string;
  image: string;
}

export default function AdminPage() {
  // Auth State
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');

  // UI Tabs State
  const [activeTab, setActiveTab] = useState<'catalog' | 'sold'>('catalog');

  // Database lists state
  const [motorcyclesList, setMotorcyclesList] = useState<Motorcycle[]>([]);
  const [soldUnitsList, setSoldUnitsList] = useState<SoldUnit[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Modals state
  const [isMotorModalOpen, setIsMotorModalOpen] = useState(false);
  const [isSoldModalOpen, setIsSoldModalOpen] = useState(false);
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Editing state
  const [editingMotorId, setEditingMotorId] = useState<string | null>(null);
  const [editingSoldId, setEditingSoldId] = useState<string | null>(null);
  const [existingMotorImages, setExistingMotorImages] = useState<string[]>([]);
  const [existingSoldImage, setExistingSoldImage] = useState<string>('');

  // Selected files for uploading
  const [selectedMotorFiles, setSelectedMotorFiles] = useState<File[]>([]);
  const [motorFilePreviews, setMotorFilePreviews] = useState<string[]>([]);
  const [selectedSoldFile, setSelectedSoldFile] = useState<File | null>(null);
  const [soldFilePreview, setSoldFilePreview] = useState<string>('');

  const motorFileInputRef = useRef<HTMLInputElement>(null);
  const soldFileInputRef = useRef<HTMLInputElement>(null);

  // Form inputs state (Motorcycles)
  const [motorForm, setMotorForm] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    transmission: 'Matic' as 'Matic' | 'Manual' | 'Kopling',
    engineCapacity: '',
    location: 'Pahae Julu - Onan Hasang',
    status: 'available' as 'available' | 'booked' | 'sold',
    taxPaidUntil: 'ON',
  });

  // Form inputs state (Sold Units)
  const [soldForm, setSoldForm] = useState({
    motorModel: '',
  });

  // Declare interfaces for database records
  interface DbMotorcycle {
    id: string;
    brand: string;
    model: string;
    year: number;
    price: string | number;
    mileage: number;
    transmission: 'Matic' | 'Manual' | 'Kopling';
    engine_capacity: number;
    location: string;
    images: string[];
    status: 'available' | 'booked' | 'sold';
    badge: string | null;
    badge_type: 'primary' | 'secondary' | 'gold' | 'success' | null;
    description: string;
    tax_paid_until: string;
  }

  interface DbSoldUnit {
    id: string;
    motor_model: string;
    image: string;
  }

  const fetchData = useCallback(async () => {
    // Yield execution to the next microtask to avoid calling setState synchronously within the effect
    await Promise.resolve();
    setIsDataLoading(true);
    try {
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured. Admin panel will work in demo fallback mode.');
        setIsDataLoading(false);
        return;
      }

      // Fetch Motorcycles
      const { data: motorData, error: motorError } = await supabase
        .from('motorcycles')
        .select('*')
        .order('created_at', { ascending: false });

      if (motorError) throw motorError;

      if (motorData) {
        const mapped: Motorcycle[] = motorData.map((row: DbMotorcycle) => ({
          id: row.id,
          brand: row.brand,
          model: row.model,
          year: row.year,
          price: Number(row.price),
          mileage: row.mileage,
          transmission: row.transmission,
          engineCapacity: row.engine_capacity,
          location: row.location,
          images: row.images || [],
          status: row.status,
          badge: row.badge || undefined,
          badgeType: row.badge_type || undefined,
          description: row.description,
          taxPaidUntil: row.tax_paid_until,
        }));
        setMotorcyclesList(mapped);
      }

      // Fetch Sold Units
      const { data: soldData, error: soldError } = await supabase
        .from('sold_units')
        .select('*')
        .order('created_at', { ascending: false });

      if (soldError) throw soldError;

      if (soldData) {
        const mappedSold: SoldUnit[] = soldData.map((row: DbSoldUnit) => ({
          id: row.id,
          motorModel: row.motor_model,
          image: row.image,
        }));
        setSoldUnitsList(mappedSold);
      }

    } catch (err) {
      console.error('Error fetching data from Supabase:', err);
      alert('Gagal mengambil data dari database: ' + (err as Error).message);
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  // Check login on mount
  useEffect(() => {
    // Batasi akses admin hanya untuk localhost / IP lokal
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname !== 'localhost' && hostname !== '127.0.0.1' && hostname !== '[::1]') {
        window.location.href = '/';
        return;
      }
    }

    const sessionAuth = sessionStorage.getItem('admin_authenticated');
    if (sessionAuth === 'true') {
      const timer = setTimeout(() => {
        setIsAuthenticated(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  // Fetch Database listings
  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        fetchData();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, fetchData]);

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const systemPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
    
    if (password === systemPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setLoginError('');
    } else {
      setLoginError('Kata sandi salah. Silakan coba lagi.');
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
  };

  // Update unit status directly in list
  const handleStatusChange = async (id: string, newStatus: 'available' | 'booked' | 'sold') => {
    try {
      if (!isSupabaseConfigured) {
        // Local state toggle for demo mode
        setMotorcyclesList((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
        );
        return;
      }

      const { error } = await supabase
        .from('motorcycles')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setMotorcyclesList((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
      );
    } catch (err) {
      alert('Gagal mengubah status: ' + (err as Error).message);
    }
  };

  // Open Edit Modals
  const handleOpenEditMotor = (motor: Motorcycle) => {
    setEditingMotorId(motor.id);
    setMotorForm({
      brand: motor.brand,
      model: motor.model,
      year: motor.year,
      price: String(motor.price),
      transmission: motor.transmission,
      engineCapacity: String(motor.engineCapacity),
      location: motor.location,
      status: motor.status,
      taxPaidUntil: motor.taxPaidUntil,
    });
    setSelectedMotorFiles([]);
    setMotorFilePreviews([]);
    setExistingMotorImages(motor.images || []);
    setFormError('');
    setIsMotorModalOpen(true);
  };

  const handleOpenEditSold = (sold: SoldUnit) => {
    setEditingSoldId(sold.id);
    setSoldForm({ motorModel: sold.motorModel });
    setSelectedSoldFile(null);
    setSoldFilePreview('');
    setExistingSoldImage(sold.image);
    setFormError('');
    setIsSoldModalOpen(true);
  };

  // Delete Motorcycle
  const handleDeleteMotorcycle = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus motor ini?')) return;

    try {
      if (!isSupabaseConfigured) {
        setMotorcyclesList((prev) => prev.filter((m) => m.id !== id));
        return;
      }

      const { error } = await supabase.from('motorcycles').delete().eq('id', id);
      if (error) throw error;

      setMotorcyclesList((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert('Gagal menghapus motor: ' + (err as Error).message);
    }
  };

  // Delete Sold Unit
  const handleDeleteSoldUnit = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus galeri terjual ini?')) return;

    try {
      if (!isSupabaseConfigured) {
        setSoldUnitsList((prev) => prev.filter((s) => s.id !== id));
        return;
      }

      const { error } = await supabase.from('sold_units').delete().eq('id', id);
      if (error) throw error;

      setSoldUnitsList((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert('Gagal menghapus unit terjual: ' + (err as Error).message);
    }
  };

  // Handle file selectors
  const handleMotorFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedMotorFiles((prev) => [...prev, ...files]);
      
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setMotorFilePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeMotorFile = (index: number) => {
    setSelectedMotorFiles((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(motorFilePreviews[index]);
    setMotorFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSoldFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedSoldFile(file);
      
      if (soldFilePreview) {
        URL.revokeObjectURL(soldFilePreview);
      }
      setSoldFilePreview(URL.createObjectURL(file));
    }
  };

  // Helper: Upload file to storage bucket and return Public URL
  const uploadToStorage = async (file: File, bucket: string, folderName: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const cleanFileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${folderName}/${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(`Gagal mengunggah file ${file.name} ke bucket '${bucket}'. Harap pastikan bucket sudah dibuat di Supabase Storage dan diatur ke Public. Error: ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  // Submit Add or Edit Outer
  const handleMotorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const totalImages = existingMotorImages.length + selectedMotorFiles.length;
    if (totalImages === 0) {
      setFormError('Pilih minimal 1 gambar untuk motor ini.');
      return;
    }

    setFormSubmitLoading(true);

    try {
      let uploadedUrls: string[] = [];

      if (!isSupabaseConfigured) {
        // Local demo mode fallback mock URLs
        uploadedUrls = motorFilePreviews;
      } else {
        // 1. Upload new selected images to Storage
        if (selectedMotorFiles.length > 0) {
          const folderName = `${motorForm.brand}-${motorForm.model}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          for (const file of selectedMotorFiles) {
            const url = await uploadToStorage(file, 'motorcycles', folderName);
            uploadedUrls.push(url);
          }
        }
      }

      // Combine existing images that were not deleted, and new uploaded ones
      const finalImages = editingMotorId 
        ? [...existingMotorImages, ...uploadedUrls] 
        : uploadedUrls;

      if (editingMotorId) {
        // --- EDIT MODE ---
        const updatedMotorData = {
          brand: motorForm.brand,
          model: motorForm.model,
          year: Number(motorForm.year),
          price: Number(motorForm.price),
          transmission: motorForm.transmission,
          engine_capacity: Number(motorForm.engineCapacity),
          location: motorForm.location,
          status: motorForm.status,
          tax_paid_until: motorForm.taxPaidUntil,
          images: finalImages,
        };

        if (!isSupabaseConfigured) {
          setMotorcyclesList((prev) =>
            prev.map((m) =>
              m.id === editingMotorId
                ? {
                    ...m,
                    brand: motorForm.brand,
                    model: motorForm.model,
                    year: Number(motorForm.year),
                    price: Number(motorForm.price),
                    transmission: motorForm.transmission,
                    engineCapacity: Number(motorForm.engineCapacity),
                    location: motorForm.location,
                    status: motorForm.status,
                    taxPaidUntil: motorForm.taxPaidUntil,
                    images: finalImages,
                  }
                : m
            )
          );
        } else {
          const { error } = await supabase
            .from('motorcycles')
            .update(updatedMotorData)
            .eq('id', editingMotorId);

          if (error) throw error;

          setMotorcyclesList((prev) =>
            prev.map((m) =>
              m.id === editingMotorId
                ? {
                    ...m,
                    brand: motorForm.brand,
                    model: motorForm.model,
                    year: Number(motorForm.year),
                    price: Number(motorForm.price),
                    transmission: motorForm.transmission,
                    engineCapacity: Number(motorForm.engineCapacity),
                    location: motorForm.location,
                    status: motorForm.status,
                    taxPaidUntil: motorForm.taxPaidUntil,
                    images: finalImages,
                  }
                : m
            )
          );
        }
      } else {
        // --- ADD MODE ---
        const newMotorData = {
          id: `mokas-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          brand: motorForm.brand,
          model: motorForm.model,
          year: Number(motorForm.year),
          price: Number(motorForm.price),
          mileage: 0,
          transmission: motorForm.transmission,
          engine_capacity: Number(motorForm.engineCapacity),
          location: motorForm.location,
          status: motorForm.status,
          badge: null,
          badge_type: null,
          description: '',
          tax_paid_until: motorForm.taxPaidUntil,
          images: finalImages,
        };

        if (!isSupabaseConfigured) {
          // Local demo append
          const demoUnit: Motorcycle = {
            id: `demo-${Date.now()}`,
            brand: motorForm.brand,
            model: motorForm.model,
            year: Number(motorForm.year),
            price: Number(motorForm.price),
            mileage: 0,
            transmission: motorForm.transmission,
            engineCapacity: Number(motorForm.engineCapacity),
            location: motorForm.location,
            images: finalImages,
            status: motorForm.status,
            badge: undefined,
            badgeType: undefined,
            description: '',
            taxPaidUntil: motorForm.taxPaidUntil,
          };
          setMotorcyclesList((prev) => [demoUnit, ...prev]);
        } else {
          const { data, error } = await supabase
            .from('motorcycles')
            .insert([newMotorData])
            .select();

          if (error) throw error;
          
          if (data && data[0]) {
            const inserted: Motorcycle = {
              id: data[0].id,
              brand: data[0].brand,
              model: data[0].model,
              year: data[0].year,
              price: Number(data[0].price),
              mileage: data[0].mileage,
              transmission: data[0].transmission,
              engineCapacity: data[0].engine_capacity,
              location: data[0].location,
              images: data[0].images || [],
              status: data[0].status,
              badge: data[0].badge || undefined,
              badgeType: data[0].badge_type || undefined,
              description: data[0].description,
              taxPaidUntil: data[0].tax_paid_until,
            };
            setMotorcyclesList((prev) => [inserted, ...prev]);
          }
        }
      }

      // Reset form & states
      setMotorForm({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: '',
        transmission: 'Matic',
        engineCapacity: '',
        location: 'Pahae Julu - Onan Hasang',
        status: 'available',
        taxPaidUntil: 'ON',
      });
      setSelectedMotorFiles([]);
      setMotorFilePreviews([]);
      setExistingMotorImages([]);
      setEditingMotorId(null);
      setIsMotorModalOpen(false);
      alert(editingMotorId ? 'Motor berhasil diperbarui!' : 'Motor berhasil ditambahkan!');

    } catch (err) {
      console.error('Error submitting motorcycle:', err);
      setFormError((err as Error).message || 'Terjadi kesalahan saat menyimpan data.');
    } finally {
      setFormSubmitLoading(false);
    }
  };

  // Submit Add or Edit Sold Unit
  const handleSoldSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!selectedSoldFile && !existingSoldImage) {
      setFormError('Pilih 1 gambar untuk unit yang telah terjual.');
      return;
    }

    setFormSubmitLoading(true);

    try {
      let imageUrl = existingSoldImage;

      if (selectedSoldFile) {
        if (!isSupabaseConfigured) {
          imageUrl = soldFilePreview;
        } else {
          // 1. Upload single image to storage bucket 'testimonials'
          const folderName = 'testimonials';
          imageUrl = await uploadToStorage(selectedSoldFile, 'testimonials', folderName);
        }
      }

      if (editingSoldId) {
        // --- EDIT MODE ---
        const updatedSoldData = {
          motor_model: soldForm.motorModel,
          image: imageUrl,
        };

        if (!isSupabaseConfigured) {
          setSoldUnitsList((prev) =>
            prev.map((s) =>
              s.id === editingSoldId
                ? { ...s, motorModel: soldForm.motorModel, image: imageUrl }
                : s
            )
          );
        } else {
          const { error } = await supabase
            .from('sold_units')
            .update(updatedSoldData)
            .eq('id', editingSoldId);

          if (error) throw error;

          setSoldUnitsList((prev) =>
            prev.map((s) =>
              s.id === editingSoldId
                ? { ...s, motorModel: soldForm.motorModel, image: imageUrl }
                : s
            )
          );
        }
      } else {
        // --- ADD MODE ---
        const newSoldData = {
          id: `sold-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          motor_model: soldForm.motorModel,
          image: imageUrl,
        };

        if (!isSupabaseConfigured) {
          const demoSold: SoldUnit = {
            id: `demo-sold-${Date.now()}`,
            motorModel: soldForm.motorModel,
            image: imageUrl,
          };
          setSoldUnitsList((prev) => [demoSold, ...prev]);
        } else {
          const { data, error } = await supabase
            .from('sold_units')
            .insert([newSoldData])
            .select();

          if (error) throw error;

          if (data && data[0]) {
            const inserted: SoldUnit = {
              id: data[0].id,
              motorModel: data[0].motor_model,
              image: data[0].image,
            };
            setSoldUnitsList((prev) => [inserted, ...prev]);
          }
        }
      }

      // Reset form
      setSoldForm({ motorModel: '' });
      setSelectedSoldFile(null);
      setSoldFilePreview('');
      setExistingSoldImage('');
      setEditingSoldId(null);
      setIsSoldModalOpen(false);
      alert(editingSoldId ? 'Galeri unit terjual berhasil diperbarui!' : 'Galeri unit terjual berhasil ditambahkan!');

    } catch (err) {
      console.error('Error submitting sold unit:', err);
      setFormError((err as Error).message || 'Terjadi kesalahan saat menyimpan data.');
    } finally {
      setFormSubmitLoading(false);
    }
  };

  // Renders the Login View
  if (!isAuthenticated) {
    return (
      <div className={styles.adminContainer}>
        <div className={`${styles.loginWrapper} glass-panel`}>
          <div className={styles.loginHeader}>
            <h1>SITOMPUL<span>MOKAS</span></h1>
            <p>Dashboard Pengelolaan Website Motor Bekas</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label htmlFor="passcode">Masukkan Passcode Admin</label>
              <input
                id="passcode"
                type="password"
                className={styles.formInput}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {loginError && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '16px', textAlign: 'left' }}>{loginError}</p>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Masuk ke Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.dashboardWrapper}>
        
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <h1>SITOMPUL<span>MOKAS</span> Admin Panel</h1>
            <p>Kelola daftar motor bekas dan testimoni unit yang telah terjual</p>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Keluar
          </button>
        </div>

        {/* Tab Controls */}
        <div className={styles.tabs}>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`${styles.tabBtn} ${activeTab === 'catalog' ? styles.tabBtnActive : ''}`}
          >
            Katalog Unit ({motorcyclesList.length})
          </button>
          <button
            onClick={() => setActiveTab('sold')}
            className={`${styles.tabBtn} ${activeTab === 'sold' ? styles.tabBtnActive : ''}`}
          >
            Galeri Unit Terjual ({soldUnitsList.length})
          </button>
        </div>

        {/* --- CATALOG TAB VIEW --- */}
        {activeTab === 'catalog' && (
          <div>
            <div className={styles.actionsBar}>
              <button 
                onClick={() => {
                  setEditingMotorId(null);
                  setMotorForm({
                    brand: '',
                    model: '',
                    year: new Date().getFullYear(),
                    price: '',
                    transmission: 'Matic',
                    engineCapacity: '',
                    location: 'Pahae Julu - Onan Hasang',
                    status: 'available',
                    taxPaidUntil: 'ON',
                  });
                  setSelectedMotorFiles([]);
                  setMotorFilePreviews([]);
                  setExistingMotorImages([]);
                  setFormError('');
                  setIsMotorModalOpen(true);
                }} 
                className="btn btn-primary"
              >
                + Tambah Unit Motor
              </button>
            </div>

            {isDataLoading ? (
              <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Memuat katalog motor...</p>
            ) : motorcyclesList.length === 0 ? (
              <div className={styles.emptyState}>Belum ada data motor di katalog. Klik &quot;+ Tambah Unit Motor&quot; untuk mengisi.</div>
            ) : (
              <div className={styles.tableContainer}>
                <table className={styles.adminTable}>
                  <thead>
                    <tr>
                      <th>Gambar</th>
                      <th>Merek & Model</th>
                      <th>Tahun</th>
                      <th>Harga</th>
                      <th>Transmisi</th>
                      <th>Status Unit</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {motorcyclesList.map((motor) => (
                      <tr key={motor.id}>
                        <td>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={motor.images[0] || 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=150'}
                            alt={motor.model}
                            className={styles.listThumbnail}
                          />
                        </td>
                        <td>
                          <strong style={{ display: 'block', fontSize: '1rem' }}>{motor.brand} {motor.model}</strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ID: {motor.id}</span>
                        </td>
                        <td>{motor.year}</td>
                        <td>Rp {motor.price.toLocaleString('id-ID')}</td>
                        <td>{motor.transmission}</td>
                        <td>
                          <select
                            value={motor.status}
                            onChange={(e) => handleStatusChange(motor.id, e.target.value as 'available' | 'booked' | 'sold')}
                            className={styles.statusSelect}
                          >
                            <option value="available">Tersedia</option>
                            <option value="booked">Booked</option>
                            <option value="sold">Terjual</option>
                          </select>
                        </td>
                        <td style={{ display: 'flex', gap: '8px', border: 'none' }}>
                          <button
                            onClick={() => handleOpenEditMotor(motor)}
                            className="btn btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteMotorcycle(motor.id)}
                            className={styles.deleteBtn}
                            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* --- SOLD UNITS TAB VIEW --- */}
        {activeTab === 'sold' && (
          <div>
            <div className={styles.actionsBar}>
              <button 
                onClick={() => {
                  setEditingSoldId(null);
                  setSoldForm({ motorModel: '' });
                  setSelectedSoldFile(null);
                  setSoldFilePreview('');
                  setExistingSoldImage('');
                  setFormError('');
                  setIsSoldModalOpen(true);
                }} 
                className="btn btn-primary"
              >
                + Tambah Galeri Terjual
              </button>
            </div>

            {isDataLoading ? (
              <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Memuat galeri unit terjual...</p>
            ) : soldUnitsList.length === 0 ? (
              <div className={styles.emptyState}>Belum ada galeri unit terjual. Klik &quot;+ Tambah Galeri Terjual&quot; untuk mengisi.</div>
            ) : (
              <div className={styles.tableContainer}>
                <table className={styles.adminTable}>
                  <thead>
                    <tr>
                      <th>Gambar</th>
                      <th>Model Motor</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {soldUnitsList.map((sold) => (
                      <tr key={sold.id}>
                        <td>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={sold.image || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=150'}
                            alt={sold.motorModel}
                            className={styles.listThumbnail}
                          />
                        </td>
                        <td>
                          <strong style={{ fontSize: '1rem' }}>{sold.motorModel}</strong>
                        </td>
                        <td style={{ display: 'flex', gap: '8px', border: 'none' }}>
                          <button
                            onClick={() => handleOpenEditSold(sold)}
                            className="btn btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSoldUnit(sold.id)}
                            className={styles.deleteBtn}
                            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* --- ADD MOTOR MODAL --- */}
        {isMotorModalOpen && (
          <div className={styles.modalOverlay} onClick={() => !formSubmitLoading && setIsMotorModalOpen(false)}>
            <div className={`${styles.modalContent} glass-panel`} onClick={(e) => e.stopPropagation()}>
              <button 
                className={styles.closeModalBtn} 
                onClick={() => !formSubmitLoading && setIsMotorModalOpen(false)}
                disabled={formSubmitLoading}
              >
                &times;
              </button>
              <h2>{editingMotorId ? 'Edit Unit Motor' : 'Tambah Unit Motor Baru'}</h2>
              <form onSubmit={handleMotorSubmit}>
                
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Merek Motor (Merek)</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="Contoh: Honda, Yamaha"
                      value={motorForm.brand}
                      onChange={(e) => setMotorForm({...motorForm, brand: e.target.value})}
                      required
                      disabled={formSubmitLoading}
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Model Motor (Tipe)</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="Contoh: NMAX 155 Connected, CBR150R"
                      value={motorForm.model}
                      onChange={(e) => setMotorForm({...motorForm, model: e.target.value})}
                      required
                      disabled={formSubmitLoading}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Tahun Pembuatan</label>
                    <input
                      type="number"
                      className={styles.formInput}
                      value={motorForm.year}
                      onChange={(e) => setMotorForm({...motorForm, year: Number(e.target.value)})}
                      required
                      disabled={formSubmitLoading}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Harga Cash (Rupiah)</label>
                    <input
                      type="number"
                      className={styles.formInput}
                      placeholder="Contoh: 25000000"
                      value={motorForm.price}
                      onChange={(e) => setMotorForm({...motorForm, price: e.target.value})}
                      required
                      disabled={formSubmitLoading}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Transmisi</label>
                    <select
                      className={styles.formSelect}
                      value={motorForm.transmission}
                      onChange={(e) => setMotorForm({...motorForm, transmission: e.target.value as 'Matic' | 'Manual' | 'Kopling'})}
                      disabled={formSubmitLoading}
                    >
                      <option value="Matic">Matic</option>
                      <option value="Manual">Manual</option>
                      <option value="Kopling">Kopling</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Kapasitas Mesin (CC)</label>
                    <input
                      type="number"
                      className={styles.formInput}
                      placeholder="Contoh: 155, 250"
                      value={motorForm.engineCapacity}
                      onChange={(e) => setMotorForm({...motorForm, engineCapacity: e.target.value})}
                      required
                      disabled={formSubmitLoading}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Lokasi Unit</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={motorForm.location}
                      onChange={(e) => setMotorForm({...motorForm, location: e.target.value})}
                      required
                      disabled={formSubmitLoading}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Status</label>
                    <select
                      className={styles.formSelect}
                      value={motorForm.status}
                      onChange={(e) => setMotorForm({...motorForm, status: e.target.value as 'available' | 'booked' | 'sold'})}
                      disabled={formSubmitLoading}
                    >
                      <option value="available">Tersedia</option>
                      <option value="booked">Booked</option>
                      <option value="sold">Terjual</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Pajak</label>
                    <select
                      className={styles.formSelect}
                      value={motorForm.taxPaidUntil}
                      onChange={(e) => setMotorForm({...motorForm, taxPaidUntil: e.target.value})}
                      disabled={formSubmitLoading}
                    >
                      <option value="ON">Pajak ON</option>
                      <option value="OFF">Pajak OFF</option>
                    </select>
                  </div>

                  {/* Existing Images Manager for Edit Mode */}
                  {editingMotorId && existingMotorImages.length > 0 && (
                    <div className={`${styles.formGroup} ${styles.formFullWidth}`}>
                      <label>Gambar Saat Ini (Klik &times; untuk menghapus gambar tertentu)</label>
                      <div className={styles.previewGrid}>
                        {existingMotorImages.map((url, idx) => (
                          <div key={idx} className={styles.previewItem}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt="existing preview" className={styles.previewImg} />
                            <button
                              type="button"
                              className={styles.removePreviewBtn}
                              onClick={() => setExistingMotorImages(prev => prev.filter((_, i) => i !== idx))}
                              disabled={formSubmitLoading}
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Multi File Upload Dropzone */}
                  <div className={`${styles.formGroup} ${styles.formFullWidth}`}>
                    <label>Unggah Gambar Motor (Pilih Banyak Gambar)</label>
                    <div 
                      className={styles.uploadDropzone} 
                      onClick={() => !formSubmitLoading && motorFileInputRef.current?.click()}
                    >
                      <span className={styles.uploadIcon}>📸</span>
                      <span className={styles.uploadText}>Klik untuk memilih foto-foto motor</span>
                      <span className={styles.uploadSubtext}>Bisa pilih beberapa gambar sekaligus (Format: JPG, PNG)</span>
                      <input
                        type="file"
                        ref={motorFileInputRef}
                        onChange={handleMotorFileChange}
                        multiple
                        accept="image/*"
                        className={styles.fileInput}
                        disabled={formSubmitLoading}
                      />
                    </div>

                    {/* Preview Images Selected */}
                    {motorFilePreviews.length > 0 && (
                      <div className={styles.previewGrid}>
                        {motorFilePreviews.map((url, idx) => (
                          <div key={idx} className={styles.previewItem}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt="preview" className={styles.previewImg} />
                            <button
                              type="button"
                              className={styles.removePreviewBtn}
                              onClick={() => removeMotorFile(idx)}
                              disabled={formSubmitLoading}
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {formError && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '16px' }}>{formError}</p>}

                <div className={styles.formActions}>
                  <button 
                    type="button" 
                    className={styles.btnCancel} 
                    onClick={() => setIsMotorModalOpen(false)}
                    disabled={formSubmitLoading}
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className={styles.btnSave}
                    disabled={formSubmitLoading}
                  >
                    {formSubmitLoading && <span className={styles.loadingSpinner}></span>}
                    {formSubmitLoading ? 'Menyimpan...' : 'Simpan Motor'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- ADD SOLD MODAL --- */}
        {isSoldModalOpen && (
          <div className={styles.modalOverlay} onClick={() => !formSubmitLoading && setIsSoldModalOpen(false)}>
            <div className={`${styles.modalContent} glass-panel`} style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
              <button 
                className={styles.closeModalBtn} 
                onClick={() => !formSubmitLoading && setIsSoldModalOpen(false)}
                disabled={formSubmitLoading}
              >
                &times;
              </button>
              <h2>{editingSoldId ? 'Edit Galeri Terjual' : 'Tambah Galeri Terjual Baru'}</h2>
              <form onSubmit={handleSoldSubmit}>
                
                <div className={styles.formGroup}>
                  <label>Model Motor Terjual</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="Contoh: Honda Beat Street (Maret 2026)"
                    value={soldForm.motorModel}
                    onChange={(e) => setSoldForm({...soldForm, motorModel: e.target.value})}
                    required
                    disabled={formSubmitLoading}
                  />
                </div>

                {/* Existing Testimonial Image for Edit Mode */}
                {editingSoldId && existingSoldImage && !soldFilePreview && (
                  <div className={styles.formGroup}>
                    <label>Gambar Saat Ini</label>
                    <div className={styles.previewGrid} style={{ gridTemplateColumns: 'repeat(1, 150px)' }}>
                      <div className={styles.previewItem}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={existingSoldImage} alt="existing testimonial preview" className={styles.previewImg} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Single File Upload Dropzone */}
                <div className={styles.formGroup}>
                  <label>Unggah Gambar Penyerahan Unit</label>
                  <div 
                    className={styles.uploadDropzone} 
                    onClick={() => !formSubmitLoading && soldFileInputRef.current?.click()}
                  >
                    <span className={styles.uploadIcon}>🤝</span>
                    <span className={styles.uploadText}>Klik untuk memilih foto penyerahan</span>
                    <span className={styles.uploadSubtext}>Disarankan foto rasio lanskap/square (Format: JPG, PNG)</span>
                    <input
                      type="file"
                      ref={soldFileInputRef}
                      onChange={handleSoldFileChange}
                      accept="image/*"
                      className={styles.fileInput}
                      disabled={formSubmitLoading}
                    />
                  </div>

                  {/* Single Image Preview */}
                  {soldFilePreview && (
                    <div className={styles.previewGrid} style={{ gridTemplateColumns: 'repeat(1, 150px)' }}>
                      <div className={styles.previewItem}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={soldFilePreview} alt="preview" className={styles.previewImg} />
                        <button
                          type="button"
                          className={styles.removePreviewBtn}
                          onClick={() => {
                            setSelectedSoldFile(null);
                            URL.revokeObjectURL(soldFilePreview);
                            setSoldFilePreview('');
                          }}
                          disabled={formSubmitLoading}
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {formError && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '16px' }}>{formError}</p>}

                <div className={styles.formActions}>
                  <button 
                    type="button" 
                    className={styles.btnCancel} 
                    onClick={() => setIsSoldModalOpen(false)}
                    disabled={formSubmitLoading}
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className={styles.btnSave}
                    disabled={formSubmitLoading}
                  >
                    {formSubmitLoading && <span className={styles.loadingSpinner}></span>}
                    {formSubmitLoading ? 'Menyimpan...' : 'Simpan Galeri'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
