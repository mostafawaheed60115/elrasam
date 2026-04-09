import { useLang } from '../contexts/LanguageContext';

export default function Footer() {
  const { t, lang } = useLang();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full relative overflow-hidden">
      {/* Gold accent line */}
      <div className="h-[2px] w-full bg-gold-gradient" />

      <div className="bg-primary text-on-primary py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Top section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-12">
            {/* Brand */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <a href="#" className="flex items-center gap-3 group relative">
                {/* Subtle gold glow behind the logo on hover */}
                <div className="absolute inset-0 bg-gold/5 blur-[40px] rounded-full scale-50 group-hover:scale-[1.8] group-hover:bg-gold/20 transition-all duration-700 pointer-events-none" />
                <img 
                  src="/logo.jpg" 
                  alt={lang === 'ar' ? 'قصر الرسام' : 'El Rasam Palace'} 
                  className="h-28 md:h-40 w-auto object-contain scale-100 group-hover:scale-105 group-hover:-translate-y-2 drop-shadow-[0_4px_15px_rgba(212,175,55,0.15)] group-hover:drop-shadow-[0_15px_35px_rgba(212,175,55,0.5)] group-hover:brightness-110 transition-all duration-500 ease-out relative z-10"
                />
              </a>
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-8">
              <a className="text-xs font-medium tracking-wide uppercase text-white/60 hover:text-gold transition-colors duration-300" href="#">
                {t('footer.privacy')}
              </a>
              <a className="text-xs font-medium tracking-wide uppercase text-white/60 hover:text-gold transition-colors duration-300" href="#">
                {t('footer.terms')}
              </a>
              <a className="text-xs font-medium tracking-wide uppercase text-white/60 hover:text-gold transition-colors duration-300" href="#">
                {t('footer.contact')}
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-white/10 mb-8" />

          {/* Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center">
            <p className="text-xs text-white/40">
              © {currentYear} {lang === 'ar' ? 'قصر الرسام' : 'El Rasam Palace'} — {t('footer.rights')}
            </p>
            <p className="text-xs text-white/40">
              {t('footer.developed_by')}{' '}
              <a
                href="https://nova-4solutions.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold font-bold hover:text-gold-light transition-colors duration-300 hover:underline"
              >
                Nova Solutions
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
