export interface Motorcycle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: 'Matic' | 'Manual' | 'Kopling';
  engineCapacity: number; // in cc
  location: string;
  images: string[];
  status: 'available' | 'booked' | 'sold';
  badge?: string;
  badgeType?: 'primary' | 'secondary' | 'gold' | 'success';
  description: string;
  taxPaidUntil: string; // e.g. "12/2026"
}

export const motorcycles: Motorcycle[] = [
  {
    id: "mokas-001",
    brand: "Yamaha",
    model: "NMAX 155 Connected",
    year: 2023,
    price: 29800000,
    mileage: 8200,
    transmission: "Matic",
    engineCapacity: 155,
    location: "Jakarta Selatan",
    images: [
      "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?q=80&w=800&auto=format&fit=crop"
    ],
    status: "available",
    badge: "KM Rendah",
    badgeType: "secondary",
    description: "Kondisi sangat mulus seperti baru. Tangan pertama dari baru, servis rutin berkala di bengkel resmi Yamaha. Surat-surat lengkap (BPKB, STNK, Faktur), kunci keyless lengkap 2 pcs.",
    taxPaidUntil: "09/2026"
  },
  {
    id: "mokas-002",
    brand: "Honda",
    model: "CBR250RR ABS Dual Channel",
    year: 2021,
    price: 54500000,
    mileage: 14000,
    transmission: "Kopling",
    engineCapacity: 250,
    location: "Tangerang Kota",
    images: [
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=800&auto=format&fit=crop"
    ],
    status: "available",
    badge: "Pajak Panjang",
    badgeType: "primary",
    description: "Motor sport 250cc twin-cylinder terbaik di kelasnya. Modifikasi tipis knalpot slip-on premium (orisinal tersimpan rapi). Bodi mulus bebas jatuh, mesin halus kering standar pabrik.",
    taxPaidUntil: "11/2026"
  },
  {
    id: "mokas-003",
    brand: "Vespa",
    model: "Sprint 150 i-Get ABS",
    year: 2022,
    price: 43200000,
    mileage: 11500,
    transmission: "Matic",
    engineCapacity: 150,
    location: "Jakarta Barat",
    images: [
      "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop"
    ],
    status: "available",
    badge: "Kolektor Item",
    badgeType: "gold",
    description: "Vespa Sprint warna kuning ikonik (Yellow Sole). Bodi kaleng utuh mulus tanpa lecet berarti. Ban depan-belakang masih tebal, kelistrikan normal, CVT halus tidak gredek.",
    taxPaidUntil: "05/2027"
  },
  {
    id: "mokas-004",
    brand: "Honda",
    model: "Beat Street eSP",
    year: 2022,
    price: 14700000,
    mileage: 18200,
    transmission: "Matic",
    engineCapacity: 110,
    location: "Depok",
    images: [
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=800&auto=format&fit=crop"
    ],
    status: "available",
    badge: "Nego Tipis",
    badgeType: "success",
    description: "Motor harian super irit. Kondisi mesin sehat walafiat, starter lancar, bodi pemakaian wajar. Selalu menggunakan bahan bakar Pertamax, siap pakai jarak jauh.",
    taxPaidUntil: "08/2026"
  },
  {
    id: "mokas-005",
    brand: "Kawasaki",
    model: "Ninja ZX-25R ABS SE",
    year: 2022,
    price: 98500000,
    mileage: 4500,
    transmission: "Kopling",
    engineCapacity: 250,
    location: "Jakarta Utara",
    images: [
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop"
    ],
    status: "booked",
    badge: "Inden Rare",
    badgeType: "gold",
    description: "Sensasi motor 4-silinder 250cc dengan suara melengking merdu. Tipe Special Edition (SE) warna hijau Kawasaki khas. Knalpot full system racing premium (part ori ada lengkap), KM sangat low.",
    taxPaidUntil: "10/2026"
  },
  {
    id: "mokas-006",
    brand: "Yamaha",
    model: "WR155R Dual Purpose",
    year: 2022,
    price: 33900000,
    mileage: 9800,
    transmission: "Kopling",
    engineCapacity: 155,
    location: "Bekasi",
    images: [
      "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop"
    ],
    status: "available",
    badge: "Siap Offroad",
    badgeType: "primary",
    description: "Motor adventure tangguh bersuspensi teleskopik besar. Kondisi mesin prima dengan VVA aktif, bodi lecet pemakaian wajar, ban pacul masih tebal. Kelengkapan surat lengkap terjamin.",
    taxPaidUntil: "02/2027"
  }
];
