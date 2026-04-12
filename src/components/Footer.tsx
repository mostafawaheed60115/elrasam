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
            <div className="flex items-center gap-4 text-sm text-white/50">
              <p>
                {t('footer.developed_by')}{' '}
                <a
                  href="https://nova-4solutions.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold text-base font-bold hover:text-gold-light transition-colors duration-300 hover:underline"
                >
                  Nova Solutions
                </a>
              </p>
              <span className="text-white/20 text-lg">|</span>
              <a
                href="https://wa.me/201509999283"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/50 hover:text-green-400 transition-colors duration-300"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="text-sm font-semibold">01509999283</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
