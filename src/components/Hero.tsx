'use client';

import styles from './Hero.module.css';

export default function Hero() {
  const handleScrollToCatalog = () => {
    const catalogElement = document.getElementById('catalog');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.hero}>
      {/* Background Image Overlay */}
      <div className={styles.heroOverlay}></div>

      <div className={`${styles.container} container`}>
        <div className={styles.content}>
          <span className="badge badge-primary">TERPERCAYA SEJAK 2014</span>
          <h1 className={styles.title}>
            SITOMPUL<br />
            <span>MOTOR BEKAS PAHAE</span>
          </h1>
          <p className={styles.subtitle}>
            Menyediakan berbagai pilihan motor bekas berkualitas dengan kondisi prima, surat-surat 100% lengkap dan aman, serta garansi mesin. Kami telah melayani kebutuhan transportasi masyarakat Pahae dan sekitarnya di Tapanuli Utara selama lebih dari 12 tahun.
          </p>

          <div className={styles.storyCard}>
            <p>
              Didirikan pertama kali pada tahun 2014 di showroom sederhana kami di Pahae, kami berkomitmen untuk selalu mengedepankan kejujuran, transparansi kondisi unit, dan kepuasan pelanggan di setiap transaksi.
            </p>
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            <button onClick={handleScrollToCatalog} className="btn btn-primary">
              🏍️ Lihat Katalog Motor
            </button>
            <a
              href="https://wa.me/6281262374426?text=Halo%20Sitompul%20Motor%20Bekas%20Pahae,%20saya%20ingin%20tanya-tanya%20unit%20motor%20yang%20tersedia"
              target="_blank"
              className="btn btn-secondary"
            >
              💬 Hubungi via WhatsApp
            </a>
          </div>

          {/* Stats Bar */}
          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <h3>12+ Tahun</h3>
              <p>Pengalaman & Dedikasi</p>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <h3>100%</h3>
              <p>Jaminan Legalitas Surat</p>
            </div>
            {/* <div className={styles.statDivider}></div> */}
            {/* <div className={styles.statItem}>
              <h3>Ribuan</h3>
              <p>Pelanggan Terlayani</p>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
