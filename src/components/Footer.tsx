import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} id="contact">
      <div className={`${styles.container} container`}>
        <div className={styles.grid}>
          {/* Brand Info */}
          <div className={styles.infoCol}>
            <Link href="/" className={styles.logo}>
              SITOMPUL<span>MOKAS</span>
            </Link>
            <p className={styles.description}>
              Penyedia layanan jual beli motor bekas berkualitas dan terpercaya di Pahae. Kami menjamin kualitas mesin, legalitas surat-surat, dan pelayanan prima untuk kepuasan Anda.
            </p>
          </div>

          {/* Quick Links */}
          <div className={styles.linksCol}>
            <h3 className={styles.title}>Menu Cepat</h3>
            <ul className={styles.linksList}>
              <li><Link href="/#catalog" className={styles.link}>Katalog Motor</Link></li>
              <li><Link href="/#why-choose-us" className={styles.link}>Tentang Kami</Link></li>
              <li><Link href="/#testimonials" className={styles.link}>Testimoni</Link></li>
              <li><Link href="https://wa.me/6281263374426" target="_blank" className={styles.link}>Jual Motor Anda</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className={styles.contactCol}>
            <h3 className={styles.title}>Hubungi Kami</h3>
            <ul className={styles.contactList}>
              <li>
                <span className={styles.icon}>📍</span>
                <Link 
                  href="https://maps.app.goo.gl/dRsvfMcxY1fA7FQR8" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.addressLink}
                >
                  Usaha Bersama Sitompul - Onan Hasang, Kec. Pahae Julu, Kab. Tapanuli Utara, Prov. Sumatera Utara.
                </Link>
              </li>
              <li>
                <span className={styles.icon}>📞</span>
                <span>+62 812-6337-4426</span>
              </li>
              <li>
                <span className={styles.icon}>🕒</span>
                <span>Senin - Sabtu: 08.00 - 17.00 WIB</span>
              </li>
            </ul>
          </div>

          {/* Social Media & Trust */}
          <div className={styles.socialCol}>
            <h3 className={styles.title}>Ikuti Kami</h3>
            <div className={styles.socialLinks}>
              <Link href="https://web.facebook.com/usaha.bersama.724671" className={styles.socialIcon} aria-label="Facebook">FB</Link>
              {/* <Link href="#" className={styles.socialIcon} aria-label="Instagram">IG</Link> */}
              {/* <Link href="#" className={styles.socialIcon} aria-label="YouTube">YT</Link>
              <Link href="#" className={styles.socialIcon} aria-label="TikTok">TT</Link> */}
            </div>
            <div className={styles.trustBadge}>
              <span className={styles.trustIcon}>🛡️</span>
              <div>
                <p className={styles.trustTitle}>Terverifikasi & Aman</p>
                <p className={styles.trustSubtitle}>100% Legalitas Terjamin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            &copy; {currentYear} Sitompul Motor Bekas Pahae. All Rights Reserved.
          </p>
          <div className={styles.legalLinks}>
            <Link href="#" className={styles.legalLink}>Syarat & Ketentuan</Link>
            <Link href="#" className={styles.legalLink}>Kebijakan Privasi</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
