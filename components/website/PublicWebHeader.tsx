/**
 * PublicWebHeader
 *
 * Context-free website navigation header for public clean-URL pages
 * (e.g. /estimate-tool, /map, future public routes).
 *
 * IMPORTANT: This component intentionally does NOT use:
 *   - useNavigation()  → CRM routing, not available on clean paths
 *   - useMockDB()      → CRM session/auth, not available on clean paths
 *
 * Navigation is handled via window.location.href (hard links) so the
 * CRM and public website remain completely isolated state trees.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../lib/utils';

const NAV_LINKS_LEFT = [
  { label: 'ABOUT US',  href: '/?page=P-01' },
];

const SERVICE_MENU_GROUPS = [
  {
    title: 'Core Roofing Sectors & Materials',
    links: [
      { label: 'All Services Overview', href: '/?page=P-02' },
      { label: 'Residential Roofing (Pitched & Flat)', href: '/services/residential-roof-replacement' },
      { label: 'Commercial Roofing (Low & Steep-Slope)', href: '/services/commercial-flat-roofing' },
      { label: 'Asphalt Shingle Systems', href: '/services/asphalt-roofing' },
      { label: 'Flat & Membrane Systems', href: '/services/membrane-roofing' },
      { label: 'Roofing Accessories & Heat Trace', href: '/services/roofing-accessories' },
    ]
  },
  {
    title: 'Pricing & Transparency',
    links: [
      { label: 'Zero Surprises Pricing', href: '/zero-surprises-pricing' },
    ]
  },
  {
    title: 'Local Service Areas',
    links: [
      { label: 'Sandy Service Area', href: '/service-areas/sandy-ut' },
      { label: 'West Jordan Service Area', href: '/service-areas/west-jordan-ut' },
      { label: 'Salt Lake City Service Area', href: '/service-areas/salt-lake-city-ut' },
      { label: 'Bountiful Service Area', href: '/service-areas/bountiful-ut' },
      { label: 'Clearfield Service Area', href: '/service-areas/clearfield-ut' },
      { label: 'Cottonwood Heights Service Area', href: '/service-areas/cottonwood-heights-ut' },
      { label: 'Draper Service Area', href: '/service-areas/draper-ut' },
      { label: 'Herriman Service Area', href: '/service-areas/herriman-ut' },
      { label: 'Holladay Service Area', href: '/service-areas/holladay-ut' },
      { label: 'Kearns Service Area', href: '/service-areas/kearns-ut' },
      { label: 'Layton Service Area', href: '/service-areas/layton-ut' },
      { label: 'Magna Service Area', href: '/service-areas/magna-ut' },
      { label: 'Midvale Service Area', href: '/service-areas/midvale-ut' },
      { label: 'Millcreek Service Area', href: '/service-areas/millcreek-ut' },
      { label: 'Murray Service Area', href: '/service-areas/murray-ut' },
      { label: 'North Salt Lake Service Area', href: '/service-areas/north-salt-lake-ut' },
      { label: 'Ogden Service Area', href: '/service-areas/ogden-ut' },
      { label: 'Park City Service Area', href: '/service-areas/park-city-ut' },
      { label: 'South Jordan Service Area', href: '/service-areas/south-jordan-ut' },
      { label: 'Sugar House Service Area', href: '/service-areas/sugar-house-ut' },
      { label: 'Taylorsville Service Area', href: '/service-areas/taylorsville-ut' },
      { label: 'Tooele Service Area', href: '/service-areas/tooele-ut' },
      { label: 'West Valley City Service Area', href: '/service-areas/west-valley-city-ut' },
    ]
  }
];

const NAV_LINKS_LEFT_REMAINING = [
  { label: 'FAQ',       href: '/faq' },
  { label: 'BLOGS',     href: '/blog' },
];

const NAV_LINKS_RIGHT = [
  { label: 'PROCESS',   href: '/?page=P-03' },
  { label: 'FINANCING', href: '/?page=P-04' },
  { label: 'CONTACT',   href: '/?page=P-05' },
];

// Explicit homepage URL — avoids sessionStorage overriding to a CRM page
const HOME_URL = '/?page=P-00-V3';

const PublicWebHeader: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isServicesOpen, setIsServicesOpen] = React.useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = React.useState(false);

  const handleNav = (href: string) => {
    window.location.href = href;
  };

  return (
<header className="fixed top-0 left-0 right-0 z-[500] h-12 flex items-center justify-center px-4 md:px-12">
      {/* Keyframe styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pubHeaderSheen {
          0% { transform: translateX(-150%) skewX(-30deg); }
          35%, 100% { transform: translateX(150%) skewX(-30deg); }
        }
        .pub-header-sheen { animation: pubHeaderSheen 7s infinite ease-in-out; }
      `}} />

      {/* Glass chassis */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-black/85 backdrop-blur-md pointer-events-none border-b border-white/10 overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.8)]">
        <div className="absolute inset-y-0 -left-1/2 w-1/3 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pub-header-sheen" />
      </div>

      {/* Center logo notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[320px] h-[95px] bg-black/90 backdrop-blur-xl rounded-b-[36px] pointer-events-none border-x border-b border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.9)] overflow-hidden">
        <div className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pub-header-sheen" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-[1.5px] bg-gradient-to-r from-transparent via-[#ec028b] to-transparent drop-shadow-[0_0_8px_rgba(236,2,139,0.9)]" />
      </div>

      {/* Left nav links */}
      <nav className="hidden lg:flex justify-end items-center gap-6 xl:gap-8 z-10">
        {NAV_LINKS_LEFT.map((link) => (
          <button
            key={link.label}
            onClick={() => handleNav(link.href)}
            className="text-[9px] font-black tracking-[0.18em] uppercase text-slate-300 hover:text-[#ec028b] transition-colors duration-300 cursor-pointer"
          >
            {link.label}
          </button>
        ))}

        {/* Services Dropdown */}
        <div 
          className="relative"
          onMouseEnter={() => setIsServicesOpen(true)}
          onMouseLeave={() => setIsServicesOpen(false)}
        >
          <button
            onClick={() => handleNav('/?page=P-02')}
            className="text-[9px] font-black tracking-[0.18em] uppercase text-slate-300 hover:text-[#ec028b] transition-colors duration-300 flex items-center gap-1 cursor-pointer"
          >
            SERVICES <span className="text-[7px]">▼</span>
          </button>
          {isServicesOpen && (
            <div className="absolute left-0 pt-2 w-72 z-50">
              <div className="bg-black/95 border border-white/10 backdrop-blur-xl shadow-2xl p-4 flex flex-col gap-4 rounded-xl animate-fade-in">
                {SERVICE_MENU_GROUPS.map((group) => (
                  <div key={group.title} className="space-y-1.5 border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <div className="text-[8px] font-mono font-bold uppercase tracking-wider text-[#ec028b]">
                      {group.title}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {group.links.map((link) => (
                        <button
                          key={link.label}
                          onClick={() => {
                            setIsServicesOpen(false);
                            handleNav(link.href);
                          }}
                          className="text-[9px] text-left font-black tracking-[0.15em] uppercase text-slate-300 hover:text-[#ec028b] transition-colors cursor-pointer pl-1 hover:pl-2"
                        >
                          {link.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {NAV_LINKS_LEFT_REMAINING.map((link) => (
          <button
            key={link.label}
            onClick={() => handleNav(link.href)}
            className="text-[9px] font-black tracking-[0.18em] uppercase text-slate-300 hover:text-[#ec028b] transition-colors duration-300 cursor-pointer"
          >
            {link.label}
          </button>
        ))}
      </nav>

      {/* Center spacer */}
      <div className="hidden lg:block w-[340px] xl:w-[360px] shrink-0" />

      {/* Right nav links */}
      <nav className="hidden lg:flex justify-start items-center gap-6 xl:gap-8 z-10">
        {NAV_LINKS_RIGHT.map((link) => (
          <button
            key={link.label}
            onClick={() => handleNav(link.href)}
            className="text-[9px] font-black tracking-[0.18em] uppercase text-slate-300 hover:text-[#ec028b] transition-colors duration-300 cursor-pointer"
          >
            {link.label}
          </button>
        ))}
      </nav>

      {/* Central logo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[280px] h-[110px] flex items-center justify-center z-20 pointer-events-none">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { window.location.href = HOME_URL; }}
          className="relative flex items-center justify-center mt-1 pointer-events-auto"
          title="RHIVE Construction — Home"
        >
          <img
            src="https://i.imgur.com/t0VcSgJ.png"
            alt="RHIVE Construction"
            className="h-[80px] w-auto object-contain transition-opacity duration-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]"
          />
        </motion.button>
      </div>

      {/* Right controls */}
      <div className="absolute right-10 flex items-center gap-4 z-10">
        <div className="h-6 w-[1px] bg-white/20 mr-2" />

        {/* Theme toggle */}
        <button
          id="pub-header-theme-toggle"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="p-2.5 rounded-full hover:text-[#ec028b] transition-all border border-white/10 hover:border-[#ec028b]/50 bg-black/60 text-white/80"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <div className="relative w-5 h-5 flex items-center justify-center">
            <motion.div
              initial={false}
              animate={{ scale: isDark ? 0 : 1, rotate: isDark ? 90 : 0, opacity: isDark ? 0 : 1 }}
              className="absolute"
            >
              <Sun size={20} />
            </motion.div>
            <motion.div
              initial={false}
              animate={{ scale: isDark ? 1 : 0, rotate: isDark ? 0 : -90, opacity: isDark ? 1 : 0 }}
              className="absolute"
            >
              <Moon size={20} />
            </motion.div>
          </div>
        </button>

        {/* Call CTA — prominent for brochure visitors */}
        <motion.a
          id="pub-header-call-cta"
          href="tel:8887448301"
          whileHover={{ scale: 1.1 }}
          className="p-2.5 rounded-full border border-white/10 hover:border-[#ec028b]/50 transition-all text-[#ec028b] bg-black/60"
          title="Call RHIVE Construction"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </motion.a>

        {/* Portal / Login — takes them to CRM login (separate context) */}
        <motion.button
          id="pub-header-portal-btn"
          onClick={() => { window.location.href = '/?page=P-06'; }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2.5 rounded-full border border-white/10 hover:border-[#ec028b]/50 transition-all text-white/70 hover:text-[#ec028b] bg-black/60"
          title="Client Portal — Sign In"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </motion.button>
      </div>

      {/* Mobile hamburger (visible on small screens) */}
      <div className="absolute left-4 flex md:hidden z-10">
        <button
          id="pub-header-mobile-menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 text-white/70 hover:text-[#ec028b] transition-colors"
          aria-label="Open navigation menu"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="absolute top-12 left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 flex flex-col md:hidden z-[499]"
        >
          <button
            onClick={() => { setIsMenuOpen(false); handleNav('/?page=P-01'); }}
            className="w-full text-left px-6 py-4 text-[11px] font-black tracking-[0.18em] uppercase text-slate-300 hover:text-[#ec028b] hover:bg-white/5 transition-colors border-b border-white/5"
          >
            ABOUT US
          </button>

          <button
            onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
            className="w-full text-left px-6 py-4 text-[11px] font-black tracking-[0.18em] uppercase text-slate-300 hover:text-[#ec028b] hover:bg-white/5 transition-colors border-b border-white/5 flex justify-between items-center"
          >
            <span>SERVICES</span>
            <span className="text-[8px]">{isMobileServicesOpen ? '▲' : '▼'}</span>
          </button>

          {isMobileServicesOpen && (
            <div className="bg-white/[0.02] border-b border-white/5">
              {SERVICE_MENU_GROUPS.map((group) => (
                <div key={group.title} className="py-2">
                  <div className="px-8 py-1 text-[8px] font-mono font-bold uppercase tracking-wider text-[#ec028b]">
                    {group.title}
                  </div>
                  {group.links.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => { setIsMenuOpen(false); handleNav(link.href); }}
                      className="w-full text-left pl-10 pr-6 py-2.5 text-[9px] font-black tracking-[0.15em] uppercase text-slate-300 hover:text-[#ec028b] hover:bg-white/5 transition-colors block"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => { setIsMenuOpen(false); handleNav('/faq'); }}
            className="w-full text-left px-6 py-4 text-[11px] font-black tracking-[0.18em] uppercase text-slate-300 hover:text-[#ec028b] hover:bg-white/5 transition-colors border-b border-white/5"
          >
            FAQ
          </button>
          <button
            onClick={() => { setIsMenuOpen(false); handleNav('/blog'); }}
            className="w-full text-left px-6 py-4 text-[11px] font-black tracking-[0.18em] uppercase text-slate-300 hover:text-[#ec028b] hover:bg-white/5 transition-colors border-b border-white/5"
          >
            BLOGS
          </button>
          <button
            onClick={() => { setIsMenuOpen(false); handleNav('/?page=P-03'); }}
            className="w-full text-left px-6 py-4 text-[11px] font-black tracking-[0.18em] uppercase text-slate-300 hover:text-[#ec028b] hover:bg-white/5 transition-colors border-b border-white/5"
          >
            PROCESS
          </button>
          <button
            onClick={() => { setIsMenuOpen(false); handleNav('/?page=P-04'); }}
            className="w-full text-left px-6 py-4 text-[11px] font-black tracking-[0.18em] uppercase text-slate-300 hover:text-[#ec028b] hover:bg-white/5 transition-colors border-b border-white/5"
          >
            FINANCING
          </button>
          <button
            onClick={() => { setIsMenuOpen(false); handleNav('/?page=P-05'); }}
            className="w-full text-left px-6 py-4 text-[11px] font-black tracking-[0.18em] uppercase text-slate-300 hover:text-[#ec028b] hover:bg-white/5 transition-colors border-b border-white/5"
          >
            CONTACT
          </button>

          <a
            href="tel:8887448301"
            className="px-6 py-4 text-[11px] font-black tracking-[0.18em] uppercase text-[#ec028b] hover:bg-white/5 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            📞 CALL US
          </a>
        </motion.div>
      )}
    </header>
  );
};

export default PublicWebHeader;
