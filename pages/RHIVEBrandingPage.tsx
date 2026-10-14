import React, { useState, useEffect } from 'react';
import { 
  Download, Copy, Check, ExternalLink, ShieldCheck, Sun, Palette, 
  FileText, Shirt, Camera, AlertCircle, ArrowRight, Layers, CheckCircle2,
  Sword, Crosshair, TrendingUp, Cpu, Award, Zap, ChevronRight, HelpCircle
} from 'lucide-react';

interface LogoAsset {
  id: string;
  orderNumber: string;
  tier: 'primary' | 'secondary' | 'crest' | 'badges' | 'app-icons';
  badge: string;
  title: string;
  description: string;
  category: 'primary' | 'secondary' | 'crest' | 'badges' | 'app-icons';
  bgType: 'light' | 'dark' | 'checker';
  pngUrl: string;
  svgUrl?: string;
  previewUrl: string;
  driveFolder: string;
  usage: string;
}

export const RHIVEBrandingPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedAsset, setCopiedAsset] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'guidelines' | 'audit'>('guidelines');

  useEffect(() => {
    // Ensure document, body, and root containers allow unrestricted native vertical scrolling
    const originalRootOverflow = document.getElementById('root')?.style.overflow || '';
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    if (document.getElementById('root')) {
      document.getElementById('root')!.style.overflow = 'auto';
    }
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';

    return () => {
      if (document.getElementById('root')) {
        document.getElementById('root')!.style.overflow = originalRootOverflow;
      }
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, []);

  const copyToClipboard = (text: string, id: string, isHex = false) => {
    navigator.clipboard.writeText(text);
    if (isHex) {
      setCopiedHex(id);
      setTimeout(() => setCopiedHex(null), 2000);
    } else {
      setCopiedAsset(id);
      setTimeout(() => setCopiedAsset(null), 2000);
    }
  };

  // ── ALL 30 PRODUCTION LOGO VERSIONS IN EXACT HIERARCHICAL ORDER ──
  const logos: LogoAsset[] = [
    // ── 1. PRIMARY LOGO SUITE (Master Stacked / Centered Lockups) - 6 Versions in Drive ──
    {
      id: 'primary-black',
      orderNumber: 'PRIMARY 01',
      tier: 'primary',
      badge: 'WHITE CANVAS MASTER',
      title: 'Primary Stacked (Black, Pink & Gold)',
      description: 'Master tricolor crest vertically centered over wordmark on transparent canvas. High-contrast primary mark for white proposals, invoices, and executive letterhead.',
      category: 'primary',
      bgType: 'light',
      pngUrl: '/brand-assets/rhive-primary-black.png',
      svgUrl: '/brand-assets/rhive-primary-black.svg',
      previewUrl: '/brand-assets/rhive-primary-black.png',
      driveFolder: 'A - PRIMARY LOGO',
      usage: 'Master center-aligned headers, printed proposals, invoices, contracts, and formal letterhead.'
    },
    {
      id: 'primary-white',
      orderNumber: 'PRIMARY 02',
      tier: 'primary',
      badge: 'DARK CANVAS INVERTED',
      title: 'Primary Stacked (White, Pink & Gold)',
      description: 'Inverted tricolor crest & wordmark on transparent canvas for dark digital interfaces, vehicle wraps, and evening presentation decks.',
      category: 'primary',
      bgType: 'dark',
      pngUrl: '/brand-assets/rhive-primary-white.png',
      svgUrl: '/brand-assets/rhive-primary-white.svg',
      previewUrl: '/brand-assets/rhive-primary-white.png',
      driveFolder: 'A - PRIMARY LOGO',
      usage: 'Dark mode user interfaces, night presentations, vehicle hoods, and black substrates.'
    },
    {
      id: 'primary-gold',
      orderNumber: 'PRIMARY 03',
      tier: 'primary',
      badge: 'SOVEREIGN GOLD LUXURY',
      title: 'Primary Stacked (Sovereign Gold Edition)',
      description: 'Certified luxury edition for 50-year warranty document headers, executive investor decks, and premium commercial packages.',
      category: 'primary',
      bgType: 'dark',
      pngUrl: '/brand-assets/rhive-primary-gold.png',
      previewUrl: '/brand-assets/rhive-primary-gold.png',
      driveFolder: 'A - PRIMARY LOGO',
      usage: '50-Year warranty certificate headers, VIP owner packages, and certified price lock locks.'
    },
    {
      id: 'primary-pink',
      orderNumber: 'PRIMARY 04',
      tier: 'primary',
      badge: 'NEON PINK CAMPAIGN',
      title: 'Primary Stacked (RHIVE Neon Pink Edition)',
      description: 'Mono-pink vibrant variant for marketing campaigns, high-energy banners, trade show backdrops, and promotional merchandise.',
      category: 'primary',
      bgType: 'checker',
      pngUrl: '/brand-assets/rhive-primary-pink.png',
      previewUrl: '/brand-assets/rhive-primary-pink.png',
      driveFolder: 'A - PRIMARY LOGO',
      usage: 'Promotional marketing materials, digital ad campaigns, and community event banners.'
    },
    {
      id: 'primary-white-bg',
      orderNumber: 'PRIMARY 05',
      tier: 'primary',
      badge: 'WHITE SOLID TILE',
      title: 'Primary Stacked (White Solid Card Tile)',
      description: 'Pre-rendered high-res logo centered on solid white background tile for drag-and-drop presentation slides and social cards.',
      category: 'primary',
      bgType: 'light',
      pngUrl: '/brand-assets/rhive-primary-white-bg.png',
      previewUrl: '/brand-assets/rhive-primary-white-bg.png',
      driveFolder: 'A - PRIMARY LOGO',
      usage: 'Slide decks, partner collateral sheets, and social square posts requiring a solid white canvas.'
    },
    {
      id: 'primary-black-bg',
      orderNumber: 'PRIMARY 06',
      tier: 'primary',
      badge: 'BLACK SOLID TILE',
      title: 'Primary Stacked (Black Solid Card Tile)',
      description: 'Pre-rendered high-res logo centered on solid pitch-black background tile for dark slide decks and social media covers.',
      category: 'primary',
      bgType: 'dark',
      pngUrl: '/brand-assets/rhive-primary-black-bg.png',
      previewUrl: '/brand-assets/rhive-primary-black-bg.png',
      driveFolder: 'A - PRIMARY LOGO',
      usage: 'Dark slide decks, YouTube video thumbnails, and social media banners on black.'
    },

    // ── 2. SECONDARY LOGO SUITE (Horizontal Lockup: Icon on LEFT) - 6 Versions in Drive ──
    {
      id: 'secondary-black',
      orderNumber: 'SECONDARY 01',
      tier: 'secondary',
      badge: 'HORIZONTAL LIGHT NAV',
      title: 'Secondary Horizontal (Black - Icon on Left)',
      description: 'Official wide header lockup: Crest pinned on LEFT, wordmark on RIGHT. Transparent BG for website navigation and vehicle sides.',
      category: 'secondary',
      bgType: 'light',
      pngUrl: '/brand-assets/rhive-secondary-black.png',
      svgUrl: '/brand-assets/rhive-secondary-black.svg',
      previewUrl: '/brand-assets/rhive-secondary-black.png',
      driveFolder: 'B - SECONDARY LOGO',
      usage: 'Desktop & mobile website top headers, vehicle fleet doors, and horizontal print headers.'
    },
    {
      id: 'secondary-white',
      orderNumber: 'SECONDARY 02',
      tier: 'secondary',
      badge: 'HORIZONTAL DARK NAV',
      title: 'Secondary Horizontal (White - Icon on Left)',
      description: 'Inverted wide header lockup: White crest on LEFT, white wordmark on RIGHT. Transparent BG for dark navigation headers.',
      category: 'secondary',
      bgType: 'dark',
      pngUrl: '/brand-assets/rhive-secondary-white.png',
      svgUrl: '/brand-assets/rhive-secondary-white.svg',
      previewUrl: '/brand-assets/rhive-secondary-white.png',
      driveFolder: 'B - SECONDARY LOGO',
      usage: 'Dark mode navigation bars, software HUD header ribbons, and vehicle dark-tint wraps.'
    },
    {
      id: 'secondary-gold',
      orderNumber: 'SECONDARY 03',
      tier: 'secondary',
      badge: 'HORIZONTAL GOLD LUXURY',
      title: 'Secondary Horizontal (Gold - Icon on Left)',
      description: 'Wide horizontal lockup in metallic gold for premium quote headers and official guarantee certs.',
      category: 'secondary',
      bgType: 'dark',
      pngUrl: '/brand-assets/rhive-secondary-gold.png',
      previewUrl: '/brand-assets/rhive-secondary-gold.png',
      driveFolder: 'B - SECONDARY LOGO',
      usage: 'Commercial quote ribbons, certified lifetime warranty ribbons, and corporate bids.'
    },
    {
      id: 'secondary-pink',
      orderNumber: 'SECONDARY 04',
      tier: 'secondary',
      badge: 'HORIZONTAL NEON PINK',
      title: 'Secondary Horizontal (Pink - Icon on Left)',
      description: 'Wide horizontal lockup in RHIVE Neon Pink for marketing footers, digital ads, and active promo strips.',
      category: 'secondary',
      bgType: 'checker',
      pngUrl: '/brand-assets/rhive-secondary-pink.png',
      previewUrl: '/brand-assets/rhive-secondary-pink.png',
      driveFolder: 'B - SECONDARY LOGO',
      usage: 'Website promo notification banners, digital remarketing ads, and marketing footers.'
    },
    {
      id: 'secondary-white-bg',
      orderNumber: 'SECONDARY 05',
      tier: 'secondary',
      badge: 'HORIZONTAL WHITE CARD',
      title: 'Secondary Horizontal (White Solid Card Tile)',
      description: 'Pre-rendered horizontal banner on solid white background tile for document headers and letterheads.',
      category: 'secondary',
      bgType: 'light',
      pngUrl: '/brand-assets/rhive-secondary-white-bg.png',
      previewUrl: '/brand-assets/rhive-secondary-white-bg.png',
      driveFolder: 'B - SECONDARY LOGO',
      usage: 'Email signature banners, invoice header strips, and white document letterhead.'
    },
    {
      id: 'secondary-black-bg',
      orderNumber: 'SECONDARY 06',
      tier: 'secondary',
      badge: 'HORIZONTAL BLACK CARD',
      title: 'Secondary Horizontal (Black Solid Card Tile)',
      description: 'Pre-rendered horizontal banner on solid black background tile for dark navigation headers.',
      category: 'secondary',
      bgType: 'dark',
      pngUrl: '/brand-assets/rhive-secondary-black-bg.png',
      previewUrl: '/brand-assets/rhive-secondary-black-bg.png',
      driveFolder: 'B - SECONDARY LOGO',
      usage: 'Dark navigation bars, video lower-thirds, and dark email signatures.'
    },

    // ── 3. STANDALONE SHIELD CRESTS (Icon Only) - 8 Versions in Drive ──
    {
      id: 'crest-tricolor-black',
      orderNumber: 'CREST 01',
      tier: 'crest',
      badge: 'TRICOLOR MASTER',
      title: 'Authentic Tricolor Crest (Black, Pink & Gold)',
      description: 'Master tricolor hexagon crest with pink "R" and gold accents. For white canvas avatars, badges, and apparel chest marks.',
      category: 'crest',
      bgType: 'light',
      pngUrl: '/brand-assets/rhive-tricolor-crest-black.png',
      svgUrl: '/brand-assets/rhive-tricolor-crest-black.svg',
      previewUrl: '/brand-assets/rhive-tricolor-crest-black.png',
      driveFolder: 'C - SUBMARK',
      usage: 'Apparel chest crest, circular avatar profiles, and document signature watermarks.'
    },
    {
      id: 'crest-tricolor-white',
      orderNumber: 'CREST 02',
      tier: 'crest',
      badge: 'TRICOLOR INVERTED',
      title: 'Authentic Tricolor Crest (White, Pink & Gold)',
      description: 'Inverted master hexagon crest with white frame, pink "R", and gold accents for dark UI and hard hats.',
      category: 'crest',
      bgType: 'dark',
      pngUrl: '/brand-assets/rhive-tricolor-crest-white.png',
      svgUrl: '/brand-assets/rhive-tricolor-crest-white.svg',
      previewUrl: '/brand-assets/rhive-tricolor-crest-white.png',
      driveFolder: 'C - SUBMARK',
      usage: 'Hard hat safety decals, dark software dashboards, and black vehicle emblems.'
    },
    {
      id: 'crest-mono-black',
      orderNumber: 'CREST 03',
      tier: 'crest',
      badge: 'MONOCHROME BLACK',
      title: 'Submark Crest (Pitch Black)',
      description: 'High-contrast monochrome black shield crest on transparent canvas for single-color print runs and stamps.',
      category: 'crest',
      bgType: 'light',
      pngUrl: '/brand-assets/rhive-submark-crest-black.png',
      svgUrl: '/brand-assets/rhive-submark-crest-black.svg',
      previewUrl: '/brand-assets/rhive-submark-crest-black.png',
      driveFolder: 'C - SUBMARK',
      usage: 'Single-color black and white documentation, thermal receipts, and stamps.'
    },
    {
      id: 'crest-mono-white',
      orderNumber: 'CREST 04',
      tier: 'crest',
      badge: 'MONOCHROME WHITE',
      title: 'Submark Crest (Pure White)',
      description: 'High-contrast monochrome white shield crest on transparent canvas for dark overlays.',
      category: 'crest',
      bgType: 'dark',
      pngUrl: '/brand-assets/rhive-submark-crest-white.png',
      svgUrl: '/brand-assets/rhive-submark-crest-white.svg',
      previewUrl: '/brand-assets/rhive-submark-crest-white.png',
      driveFolder: 'C - SUBMARK',
      usage: 'Dark video watermark overlays and dark photography stamps.'
    },
    {
      id: 'crest-mono-gold',
      orderNumber: 'CREST 05',
      tier: 'crest',
      badge: 'METALLIC GOLD',
      title: 'Submark Crest (Sovereign Gold)',
      description: 'Monochrome metallic gold shield crest for luxury finishes and certified warranty collateral.',
      category: 'crest',
      bgType: 'dark',
      pngUrl: '/brand-assets/rhive-submark-crest-gold.png',
      previewUrl: '/brand-assets/rhive-submark-crest-gold.png',
      driveFolder: 'C - SUBMARK',
      usage: 'Gold foil print finishes, luxury warranty folders, and certified quote seals.'
    },
    {
      id: 'crest-mono-pink',
      orderNumber: 'CREST 06',
      tier: 'crest',
      badge: 'NEON PINK SHIELD',
      title: 'Submark Crest (RHIVE Neon Pink)',
      description: 'High-energy monochrome pink shield crest for mobile notifications, favicons, and urgent CTAs.',
      category: 'crest',
      bgType: 'checker',
      pngUrl: '/brand-assets/rhive-submark-crest-pink.png',
      previewUrl: '/brand-assets/rhive-submark-crest-pink.png',
      driveFolder: 'C - SUBMARK',
      usage: 'Mobile app push notification icons, high-visibility warning flags, and active CTAs.'
    },
    {
      id: 'crest-white-bg',
      orderNumber: 'CREST 07',
      tier: 'crest',
      badge: 'WHITE AVATAR TILE',
      title: 'Submark Crest (White Solid Card Tile)',
      description: 'Shield crest centered on solid white background tile for quick avatar integration.',
      category: 'crest',
      bgType: 'light',
      pngUrl: '/brand-assets/rhive-submark-crest-white-bg.png',
      previewUrl: '/brand-assets/rhive-submark-crest-white-bg.png',
      driveFolder: 'C - SUBMARK',
      usage: 'Square avatar profiles across Google Workspace, Slack, and contractor directories.'
    },
    {
      id: 'crest-black-bg',
      orderNumber: 'CREST 08',
      tier: 'crest',
      badge: 'BLACK AVATAR TILE',
      title: 'Submark Crest (Black Solid Card Tile)',
      description: 'Shield crest centered on solid black background tile for dark avatars and profile pictures.',
      category: 'crest',
      bgType: 'dark',
      pngUrl: '/brand-assets/rhive-submark-crest-black-bg.png',
      previewUrl: '/brand-assets/rhive-submark-crest-black-bg.png',
      driveFolder: 'C - SUBMARK',
      usage: 'Dark square avatar profiles across social accounts and GitHub.'
    },

    // ── 4. CIRCULAR BADGES & SEALS - 4 Versions in Drive ──
    {
      id: 'badge-round-black',
      orderNumber: 'BADGE 01',
      tier: 'badges',
      badge: 'INSPECTION STAMP',
      title: 'Inspection Submark Stamp (Black)',
      description: 'Circular certification seal for aerial orthomosaic inspection sign-offs and city permit packages.',
      category: 'badges',
      bgType: 'light',
      pngUrl: '/brand-assets/rhive-badge-round-black.png',
      svgUrl: '/brand-assets/rhive-badge-round-black.svg',
      previewUrl: '/brand-assets/rhive-badge-round-black.png',
      driveFolder: 'C - SUBMARK',
      usage: 'Aerial drone inspection report approvals and building permit submission packages.'
    },
    {
      id: 'badge-round-white',
      orderNumber: 'BADGE 02',
      tier: 'badges',
      badge: 'INVERTED SEAL',
      title: 'Inspection Submark Stamp (White)',
      description: 'Inverted circular certification seal for dark blueprint packages and vehicle decals.',
      category: 'badges',
      bgType: 'dark',
      pngUrl: '/brand-assets/rhive-badge-round-white.png',
      svgUrl: '/brand-assets/rhive-badge-round-white.svg',
      previewUrl: '/brand-assets/rhive-badge-round-white.png',
      driveFolder: 'C - SUBMARK',
      usage: 'Architectural blueprint covers, dark vehicle fleet badges, and site signage.'
    },
    {
      id: 'badge-round-gold',
      orderNumber: 'BADGE 03',
      tier: 'badges',
      badge: '50-YR WARRANTY SEAL',
      title: 'Certified 50-Year Warranty Gold Seal',
      description: 'Official metallic gold warranty medallion for final customer handoffs and lifetime warranty activation.',
      category: 'badges',
      bgType: 'dark',
      pngUrl: '/brand-assets/rhive-badge-round-gold.png',
      previewUrl: '/brand-assets/rhive-badge-round-gold.png',
      driveFolder: 'C - SUBMARK',
      usage: 'Lifetime warranty certificate documents, final owner binders, and certified price locks.'
    },
    {
      id: 'badge-round-pink',
      orderNumber: 'BADGE 04',
      tier: 'badges',
      badge: 'NEON PINK BADGE',
      title: 'Certification Submark Stamp (Pink)',
      description: 'High-energy circular certification seal in neon pink for marketing badges and warranty stickers.',
      category: 'badges',
      bgType: 'checker',
      pngUrl: '/brand-assets/rhive-badge-round-pink.png',
      previewUrl: '/brand-assets/rhive-badge-round-pink.png',
      driveFolder: 'C - SUBMARK',
      usage: 'Marketing warranty badges, yard signs, and physical product guarantee stickers.'
    },

    // ── 5. APP ICONS & FAVICONS - 6 Versions in Drive ──
    {
      id: 'app-icon-black-pink',
      orderNumber: 'APP ICON 01',
      tier: 'app-icons',
      badge: 'MASTER APP LAUNCHER',
      title: 'Master App Icon Tile (2196x2416 - Black)',
      description: 'Official high-resolution master square app launcher tile for iOS, Android, PWA, and Chrome bookmarks.',
      category: 'app-icons',
      bgType: 'checker',
      pngUrl: '/brand-assets/rhive-app-icon-black-pink.png',
      svgUrl: '/brand-assets/rhive-app-icon-black-pink.svg',
      previewUrl: '/brand-assets/rhive-app-icon-black-pink.png',
      driveFolder: 'D - FAVICON',
      usage: 'iOS App Store icon, Google Play launcher, Progressive Web App (PWA) manifest icon.'
    },
    {
      id: 'app-icon-pink-black',
      orderNumber: 'APP ICON 02',
      tier: 'app-icons',
      badge: 'VIBRANT APP TILE',
      title: 'Master App Icon Tile (2196x2416 - Pink)',
      description: 'Vibrant neon pink square app launcher tile with black crest for special edition releases and badges.',
      category: 'app-icons',
      bgType: 'checker',
      pngUrl: '/brand-assets/rhive-app-icon-pink-black.png',
      previewUrl: '/brand-assets/rhive-app-icon-pink-black.png',
      driveFolder: 'D - FAVICON',
      usage: 'Special edition mobile builds, staging server icons, and promotional app shortcuts.'
    },
    {
      id: 'fav-black',
      orderNumber: 'FAVICON 01',
      tier: 'app-icons',
      badge: 'TAB ICON (LIGHT)',
      title: 'Favicon & Tile Mark (Black)',
      description: 'Optimized square favicon in pitch black for web browser tabs, shortcut icons, and small UI stamps.',
      category: 'app-icons',
      bgType: 'light',
      pngUrl: '/brand-assets/rhive-fav-black.png',
      previewUrl: '/brand-assets/rhive-fav-black.png',
      driveFolder: 'D - FAVICON',
      usage: 'Desktop browser favicon for light theme operating systems and Google search result icons.'
    },
    {
      id: 'fav-white',
      orderNumber: 'FAVICON 02',
      tier: 'app-icons',
      badge: 'TAB ICON (DARK)',
      title: 'Favicon & Tile Mark (White)',
      description: 'Optimized square favicon in pure white for dark browser bars and dark UI bookmarks.',
      category: 'app-icons',
      bgType: 'dark',
      pngUrl: '/brand-assets/rhive-fav-white.png',
      previewUrl: '/brand-assets/rhive-fav-white.png',
      driveFolder: 'D - FAVICON',
      usage: 'Desktop browser favicon for dark mode browser bars and dark bookmark shelves.'
    },
    {
      id: 'fav-gold',
      orderNumber: 'FAVICON 03',
      tier: 'app-icons',
      badge: 'VIP SHORTCUT',
      title: 'Favicon & Tile Mark (Sovereign Gold)',
      description: 'Optimized square favicon in metallic gold for premium quote links and customer portal shortcuts.',
      category: 'app-icons',
      bgType: 'dark',
      pngUrl: '/brand-assets/rhive-fav-gold.png',
      previewUrl: '/brand-assets/rhive-fav-gold.png',
      driveFolder: 'D - FAVICON',
      usage: 'VIP customer portal link shortcuts, verified quote URLs, and partner extranets.'
    },
    {
      id: 'fav-pink',
      orderNumber: 'FAVICON 04',
      tier: 'app-icons',
      badge: 'HIGH-VISIBILITY TAB',
      title: 'Favicon & Tile Mark (RHIVE Neon Pink)',
      description: 'Optimized square favicon in neon pink for high-visibility browser tab identification.',
      category: 'app-icons',
      bgType: 'checker',
      pngUrl: '/brand-assets/rhive-fav-pink.png',
      previewUrl: '/brand-assets/rhive-fav-pink.png',
      driveFolder: 'D - FAVICON',
      usage: 'High-visibility browser tabs ensuring immediate customer recognition in crowded tab rows.'
    }
  ];

  const filteredLogos = selectedCategory === 'all' 
    ? logos 
    : logos.filter(l => l.category === selectedCategory);

  // ── CORE BRAND PALETTE: TWO PRIMARY & TWO SECONDARY MAIN COLORS ──
  const primaryColors = [
    { 
      name: 'RHIVE Neon Pink', 
      hex: '#ec028b', 
      rgb: '236, 2, 139', 
      tag: 'Primary Main 01',
      role: 'Primary Brand Identity, High-Energy Interactive Focal Points & Main CTAs (5% Weight)' 
    },
    { 
      name: 'Pitch Black', 
      hex: '#000000', 
      rgb: '0, 0, 0', 
      tag: 'Primary Main 02',
      role: 'Headlines, Primary Typography, High-Contrast Structural Borders (15% Weight)' 
    },
    { 
      name: 'Pure White Canvas', 
      hex: '#FFFFFF', 
      rgb: '255, 255, 255', 
      tag: 'Primary Canvas',
      role: 'Dominant Background Surface (80% Weight), High Legibility & Field Apparel' 
    },
  ];

  const secondaryColors = [
    { 
      name: 'Sovereign Gold', 
      hex: '#e2ab49', 
      rgb: '226, 171, 73', 
      tag: 'Secondary Main 01',
      role: '50-Year Warranty Seals, Certified Quote Locks & Lifetime Guarantees' 
    },
    { 
      name: 'Deep Void Blue', 
      hex: '#08137C', 
      rgb: '8, 19, 124', 
      tag: 'Secondary Main 02',
      role: 'Architectural Structural Foundation, Banking & Commercial Contracts' 
    },
    { 
      name: 'Circuit Slate Gray', 
      hex: '#374151', 
      rgb: '55, 65, 81', 
      tag: 'Secondary Utility',
      role: 'HUD Wireframes, Monospace Telemetry & Technical Borders' 
    },
    { 
      name: 'Priority Dispatch Red', 
      hex: '#DC2626', 
      rgb: '220, 38, 38', 
      tag: 'Emergency Lane 01',
      role: 'Emergency Leak Dispatch (<24hr Urgent Dispatch Lane 01 Only)' 
    },
  ];

  // Chamfer geometry constants (Polygon follows all edges including angles)
  const chamfer24 = 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)';
  const chamfer16 = 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)';

  return (
    <div 
      id="brand-hub-scroll-viewport"
      className="w-full min-h-full bg-slate-100 text-slate-900 font-sans antialiased pb-24 select-text"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b-2 border-slate-300 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded border border-slate-300 bg-slate-100 transition-colors"
            >
              &larr; Back
            </button>
          )}
          <div className="flex items-center gap-3">
            <img 
              src="/brand-assets/rhive-tricolor-crest-black.png" 
              alt="RHIVE" 
              className="w-8 h-8 object-contain"
            />
            <div>
              <h1 className="text-base font-black tracking-tight text-slate-900 uppercase">RHIVE BRAND HUB 2.0</h1>
              <p className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Internal Master Guideline &bull; All 30 Drive Versions Live</p>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs: Brand Guidelines vs. Competitive Audit */}
        <div className="flex items-center gap-2 bg-slate-200/80 p-1 rounded-lg border border-slate-300 font-mono text-xs">
          <button
            onClick={() => setActiveTab('guidelines')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded font-bold transition-all ${
              activeTab === 'guidelines' 
                ? 'bg-white text-slate-900 shadow-sm border border-slate-300' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers size={14} className={activeTab === 'guidelines' ? 'text-[#ec028b]' : ''} />
            <span>Brand Standards &amp; Vault</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded font-bold transition-all ${
              activeTab === 'audit' 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Crosshair size={14} className={activeTab === 'audit' ? 'text-[#ec028b]' : ''} />
            <span>Competitive Brand Audit (HKL &amp; Utah)</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <a 
            href="/RHIVE_Brand_Guide_8.5x11_Master_Presentation.pdf" 
            download="RHIVE_Brand_Guide_8.5x11_Master_Presentation.pdf"
            className="flex items-center gap-2 px-3.5 py-1.5 bg-[#ec028b] hover:bg-[#d0027a] text-white text-xs font-bold rounded shadow transition-colors"
          >
            <Download size={14} />
            <span>Download 8.5x11 Master PDF</span>
          </a>
          <a 
            href="https://drive.google.com/drive/folders/1Y1BClHpBBZrKYtdmmS5dYV0msO57pZiq" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded shadow transition-colors"
          >
            <ExternalLink size={14} />
            <span>RHIVE Brand Drive</span>
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-12">

        {activeTab === 'guidelines' ? (
          <>
            {/* ── TOP SECTION: TWO PRIMARY & TWO SECONDARY MAIN COLORS (WITH DARKER CHAMFER BORDER) ── */}
            <div className="relative p-[2px] bg-slate-400 hover:bg-slate-800 transition-colors shadow-sm" style={{ clipPath: chamfer24 }}>
              <section className="bg-white p-6 sm:p-8" style={{ clipPath: chamfer24 }}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-pink-50 border border-pink-200 text-[#ec028b] text-xs font-mono font-bold uppercase tracking-wider mb-2">
                      <Palette size={14} />
                      <span>Primary Color Discipline // Click Any Swatch to Copy HEX</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
                      OUR TWO PRIMARY &amp; SECONDARY MAIN COLORS
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 font-mono mt-1">
                      Strict 80/15/5 Palette Formula &bull; Pure White Canvas (80%), Pitch Black (15%), RHIVE Neon Pink (5%) + Sovereign Gold &amp; Deep Void Blue Accents.
                    </p>
                  </div>
                  <div className="text-right font-mono text-xs text-slate-400 hidden lg:block">
                    ACTIVE PALETTE V2.0<br />
                    HEX &bull; RGB &bull; CMYK VERIFIED
                  </div>
                </div>

                {/* Two Primary Main Colors */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-mono font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ec028b]"></span>
                      <span>The Two Primary Main Colors (Brand Foundation &amp; Energy)</span>
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400">80/15/5 System Weight</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {primaryColors.map((color) => (
                      <div 
                        key={color.hex}
                        className="relative p-[1.5px] bg-slate-300 hover:bg-[#ec028b] transition-colors shadow-sm cursor-pointer group"
                        style={{ clipPath: chamfer16 }}
                        onClick={() => copyToClipboard(color.hex, color.hex, true)}
                      >
                        <div className="bg-slate-50 group-hover:bg-white p-4 flex items-center justify-between h-full" style={{ clipPath: chamfer16 }}>
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-14 h-14 rounded-lg border-2 border-slate-300 shadow-sm flex items-center justify-center shrink-0" 
                              style={{ backgroundColor: color.hex }}
                            />
                            <div>
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-pink-100 text-[#ec028b]">
                                {color.tag}
                              </span>
                              <div className="font-bold text-sm text-slate-900 group-hover:text-[#ec028b] transition-colors mt-1">{color.name}</div>
                              <div className="text-[11px] text-slate-500 leading-tight mt-0.5">{color.role}</div>
                            </div>
                          </div>
                          <div className="text-right shrink-0 pl-2">
                            <div className="font-mono text-xs font-bold text-slate-900">{color.hex}</div>
                            <div className="text-[10px] font-mono text-slate-400 mt-0.5">RGB: {color.rgb}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-1">
                              {copiedHex === color.hex ? <span className="text-emerald-600 font-bold">COPIED!</span> : 'Click to copy'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Two Secondary Main Colors */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-mono font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#e2ab49]"></span>
                      <span>The Two Secondary Main Colors (Functional Certifications &amp; Architecture)</span>
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400">Guarantees &amp; Infrastructure</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {secondaryColors.map((color) => (
                      <div 
                        key={color.hex}
                        className="relative p-[1.5px] bg-slate-300 hover:bg-slate-700 transition-colors shadow-sm cursor-pointer group"
                        style={{ clipPath: chamfer16 }}
                        onClick={() => copyToClipboard(color.hex, color.hex, true)}
                      >
                        <div className="bg-slate-50 group-hover:bg-white p-3.5 flex items-center justify-between h-full" style={{ clipPath: chamfer16 }}>
                          <div className="flex items-center gap-2.5">
                            <div 
                              className="w-10 h-10 rounded-lg border border-slate-300 shadow-sm shrink-0" 
                              style={{ backgroundColor: color.hex }}
                            />
                            <div>
                              <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                                {color.tag}
                              </span>
                              <div className="font-bold text-xs text-slate-900 mt-0.5">{color.name}</div>
                              <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{color.role}</div>
                            </div>
                          </div>
                          <div className="text-right font-mono text-[11px] font-bold text-slate-800 shrink-0 pl-1">
                            {copiedHex === color.hex ? <span className="text-emerald-600 font-bold">COPIED</span> : color.hex}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Executive Hero */}
            <div className="relative p-[2px] bg-slate-400 hover:bg-slate-800 transition-colors shadow-sm" style={{ clipPath: chamfer24 }}>
              <section className="bg-white p-8 relative overflow-hidden" style={{ clipPath: chamfer24 }}>
                <div className="max-w-3xl space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-pink-50 border border-pink-200 text-[#ec028b] text-xs font-mono font-bold uppercase tracking-wider">
                    <ShieldCheck size={14} />
                    <span>Standard 2.0 // Wasatch Front, UT // (801) 449-1451</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase">
                    FINISH ON TOP.
                  </h2>
                  <p className="text-lg font-serif italic text-slate-600 leading-relaxed">
                    &ldquo;Advanced aerial mapping to manufacturer-certified installation. 100% transparent costs, 100% satisfaction, zero surprises. We challenge an industry known for inflated pricing and poor communication.&rdquo;
                  </p>
                  <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-slate-500">
                    <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> White Canvas Standard</span>
                    <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> 24px Chamfer Cut System</span>
                    <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> Zero Checkbox Rule</span>
                    <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> Warranty Activation Exclusive</span>
                    <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> Hundredths SQ Precision (e.g. 1.00 SQ, 2.22 SQ)</span>
                  </div>
                </div>
              </section>
            </div>

            {/* ── LOGO HIERARCHY RULES: PRIMARY VS. SECONDARY ── */}
            <div className="relative p-[2px] bg-slate-400 shadow-sm" style={{ clipPath: chamfer24 }}>
              <section className="bg-white p-6 sm:p-8" style={{ clipPath: chamfer24 }}>
                <div className="flex items-center gap-2 mb-4">
                  <Award className="text-[#ec028b]" size={20} />
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                    Logo Hierarchy Discipline: How to Identify Primary vs. Secondary Logos
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 rounded bg-slate-50 border border-slate-300">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#ec028b] mb-2">
                      <span className="w-2 h-2 rounded-full bg-[#ec028b]"></span>
                      <span>PRIMARY LOGO SUITE (Stacked / Centered)</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 mb-1">Crest Vertically Centered Over Wordmark</h4>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      The authoritative master mark of RHIVE Construction. Features vertical symmetry with the hexagon shield centered directly above the brand typography.
                    </p>
                    <div className="text-[11px] font-mono text-slate-700 bg-white p-2.5 rounded border border-slate-200">
                      <strong>&bull; WHERE TO USE:</strong> Master proposals, binding legal contracts, invoice headers, formal letterhead, presentation title covers, center chest apparel.
                      <br /><span className="text-rose-600 font-bold">&bull; NEVER USE:</span> In narrow horizontal website navigation headers where vertical height is constrained.
                    </div>
                  </div>

                  <div className="p-4 rounded bg-slate-50 border border-slate-300">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#e2ab49] mb-2">
                      <span className="w-2 h-2 rounded-full bg-[#e2ab49]"></span>
                      <span>SECONDARY LOGO SUITE (Horizontal: Icon on LEFT)</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 mb-1">Crest Pinned on Left, Wordmark on Right</h4>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      The dynamic wide horizontal lockup. Engineered specifically for asymmetric wide viewports, vehicle fleet profiles, and web navigation ribbons.
                    </p>
                    <div className="text-[11px] font-mono text-slate-700 bg-white p-2.5 rounded border border-slate-200">
                      <strong>&bull; WHERE TO USE:</strong> Website top navigation bars, vehicle wrap sides, email signature banners, sponsorship footers, and compact HUD ribbons.
                      <br /><span className="text-rose-600 font-bold">&bull; NEVER USE:</span> In centered formal certificates where vertical architectural balance is required.
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* ── ALL 30 PRODUCTION LOGO VERSIONS IN ORDER (WITH FULL CHAMFER BORDERS) ── */}
            <section className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-300 pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                    <Layers className="text-[#ec028b]" size={20} />
                    <span>All {logos.length} Official Logo Versions in Google Drive (Numbered in Order)</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-1">
                    Directly synchronized from Google Drive folder <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-bold">BRAND ASSETS (1YBJ4oyefvShB1gLcwHhNPVrVd7wJfsBN)</code>.
                  </p>
                </div>

                {/* Category Filter Tabs */}
                <div className="flex flex-wrap items-center gap-1.5 bg-slate-200 p-1.5 rounded-lg border border-slate-300 text-xs font-mono">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1.5 rounded font-bold transition-all ${selectedCategory === 'all' ? 'bg-white text-slate-900 shadow-sm border border-slate-300' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    All in Drive ({logos.length})
                  </button>
                  <button
                    onClick={() => setSelectedCategory('primary')}
                    className={`px-3 py-1.5 rounded font-bold transition-all ${selectedCategory === 'primary' ? 'bg-white text-slate-900 shadow-sm border border-slate-300' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    1. Primary Stacked (6)
                  </button>
                  <button
                    onClick={() => setSelectedCategory('secondary')}
                    className={`px-3 py-1.5 rounded font-bold transition-all ${selectedCategory === 'secondary' ? 'bg-white text-slate-900 shadow-sm border border-slate-300' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    2. Secondary Horizontal (6)
                  </button>
                  <button
                    onClick={() => setSelectedCategory('crest')}
                    className={`px-3 py-1.5 rounded font-bold transition-all ${selectedCategory === 'crest' ? 'bg-white text-slate-900 shadow-sm border border-slate-300' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    3. Standalone Crests (8)
                  </button>
                  <button
                    onClick={() => setSelectedCategory('badges')}
                    className={`px-3 py-1.5 rounded font-bold transition-all ${selectedCategory === 'badges' ? 'bg-white text-slate-900 shadow-sm border border-slate-300' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    4. Circular Badges (4)
                  </button>
                  <button
                    onClick={() => setSelectedCategory('app-icons')}
                    className={`px-3 py-1.5 rounded font-bold transition-all ${selectedCategory === 'app-icons' ? 'bg-white text-slate-900 shadow-sm border border-slate-300' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    5. App Icons &amp; Favs (6)
                  </button>
                </div>
              </div>

              {/* 30 Logo Cards with DUAL-LAYER CHAMFER BORDER FOLLOWING FULL CUT */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLogos.map((logo) => (
                  <div 
                    key={logo.id} 
                    className="relative p-[1.5px] bg-slate-300 hover:bg-slate-800 transition-colors shadow-sm group"
                    style={{ clipPath: chamfer16 }}
                  >
                    <div 
                      className="bg-white p-5 h-full w-full flex flex-col justify-between"
                      style={{ clipPath: chamfer16 }}
                    >
                      <div>
                        {/* Order Number & Badge */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-slate-900 text-white">
                              {logo.orderNumber}
                            </span>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-pink-100 text-[#ec028b]">
                              {logo.badge}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 uppercase">
                            {logo.svgUrl ? 'PNG + SVG' : 'HIGH-RES PNG'}
                          </span>
                        </div>

                        {/* Drive Folder Tag */}
                        <div className="text-[10px] font-mono text-slate-500 mb-2">
                          📁 Drive: <span className="font-bold text-slate-700">{logo.driveFolder}</span>
                        </div>

                        {/* Canvas Container with Chamfer */}
                        <div 
                          className={`h-44 rounded flex items-center justify-center p-6 border mb-4 transition-all ${
                            logo.bgType === 'dark' 
                              ? 'bg-slate-950 border-slate-800' 
                              : logo.bgType === 'checker'
                              ? 'bg-slate-100 border-slate-200 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:12px_12px]'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <img 
                            src={logo.previewUrl} 
                            alt={logo.title} 
                            className="max-h-28 max-w-full object-contain drop-shadow"
                          />
                        </div>

                        <h4 className="font-bold text-sm text-slate-900 mb-1 group-hover:text-[#ec028b] transition-colors">
                          {logo.title}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed mb-2">{logo.description}</p>
                        
                        {/* Usage Guidance */}
                        <div className="p-2 rounded bg-slate-50 border border-slate-200 text-[10px] font-mono text-slate-600 mb-4 leading-normal">
                          <strong>USE:</strong> {logo.usage}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <a 
                            href={logo.pngUrl} 
                            download={`${logo.id}.png`}
                            className="flex-1 py-1.5 px-3 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Download size={13} />
                            <span>Download PNG</span>
                          </a>
                          {logo.svgUrl && (
                            <a 
                              href={logo.svgUrl} 
                              download={`${logo.id}.svg`}
                              className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded flex items-center justify-center gap-1.5 border border-slate-300 transition-colors"
                              title="Download Vector SVG"
                            >
                              <Download size={13} />
                              <span>SVG</span>
                            </a>
                          )}
                        </div>
                        <button 
                          onClick={() => copyToClipboard(window.location.origin + logo.pngUrl, logo.id)}
                          className="w-full py-1.5 px-3 text-xs font-mono font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 rounded flex items-center justify-center gap-1.5 transition-colors"
                        >
                          {copiedAsset === logo.id ? (
                            <>
                              <Check size={13} className="text-emerald-600" />
                              <span className="text-emerald-600 font-bold">Copied URL to Clipboard!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={13} />
                              <span>Copy Public Link</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3: Typography Architecture */}
            <section className="space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <FileText className="text-[#ec028b]" size={20} />
                  <span>Typography System</span>
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-1">Universal web &amp; print font standards mirroring the live site.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative p-[1.5px] bg-slate-300 hover:bg-slate-700 transition-colors shadow-sm" style={{ clipPath: chamfer16 }}>
                  <div className="bg-white p-5 h-full" style={{ clipPath: chamfer16 }}>
                    <div className="text-xs font-mono font-bold text-[#ec028b] uppercase tracking-wider mb-2">01 // Universal Headers &amp; Web</div>
                    <div className="text-3xl font-black text-slate-900 mb-2 font-sans">Rubik Bold</div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      Used across all digital web interfaces, hero banners, buttons, and bold callouts. Eliminates harsh serif stiffness on high-contrast surfaces.
                    </p>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded font-sans text-xs text-slate-800">
                      ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                      abcdefghijklmnopqrstuvwxyz 0123456789
                    </div>
                  </div>
                </div>

                <div className="relative p-[1.5px] bg-slate-300 hover:bg-slate-700 transition-colors shadow-sm" style={{ clipPath: chamfer16 }}>
                  <div className="bg-white p-5 h-full" style={{ clipPath: chamfer16 }}>
                    <div className="text-xs font-mono font-bold text-[#e2ab49] uppercase tracking-wider mb-2">02 // Editorial &amp; Legal</div>
                    <div className="text-3xl font-serif italic text-slate-900 mb-2">EB Garamond</div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      Reserved exclusively for leadership editorial quotes, mission statements, formal contractual fine print, and high-prestige warranty declarations.
                    </p>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded font-serif italic text-sm text-slate-800">
                      &ldquo;Honesty, mathematical precision, and female-led operational excellence.&rdquo;
                    </div>
                  </div>
                </div>

                <div className="relative p-[1.5px] bg-slate-300 hover:bg-slate-700 transition-colors shadow-sm" style={{ clipPath: chamfer16 }}>
                  <div className="bg-white p-5 h-full" style={{ clipPath: chamfer16 }}>
                    <div className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-2">03 // Telemetry &amp; Coordinates</div>
                    <div className="text-3xl font-mono font-bold text-slate-900 mb-2">Space Mono</div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      Used for mathematical equations, pricing multipliers, GPS rooftop coordinates, technical data boundaries, and timestamps.
                    </p>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded font-mono text-xs text-slate-800">
                      PITCH: 6/12 &bull; MULTIPLIER: 1.1180<br />
                      SLOPE: 26.57&deg; &bull; CAD_VERIFY: OK
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Quoting Engine Precision & Square Discipline (Hundredths SQ) */}
            <section className="space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <CheckCircle2 className="text-[#ec028b]" size={20} />
                  <span>Quoting Engine Precision &amp; Square Discipline (Hundredths SQ)</span>
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-1">Multi-variable mathematical calculations replacing single-line contractor guesswork.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative p-[2px] bg-slate-400 hover:bg-slate-800 transition-colors shadow-sm" style={{ clipPath: chamfer24 }}>
                  <div className="bg-white p-6 h-full" style={{ clipPath: chamfer24 }}>
                    <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-3 text-[#ec028b]">
                      Geometric Slope Multipliers &amp; Hundredths SQ Standard
                    </h4>
                    <div className="divide-y divide-slate-100 font-mono text-xs mb-4">
                      <div className="py-2 flex justify-between"><span>0/12 (Flat Membrane / TPO)</span><span className="font-bold text-[#ec028b]">1.0000x</span></div>
                      <div className="py-2 flex justify-between"><span>3/12 Pitch (14.04&deg;)</span><span className="font-bold text-[#ec028b]">1.0308x</span></div>
                      <div className="py-2 flex justify-between"><span>6/12 Pitch (26.57&deg;)</span><span className="font-bold text-[#ec028b]">1.1180x</span></div>
                      <div className="py-2 flex justify-between"><span>9/12 Pitch (36.87&deg;)</span><span className="font-bold text-[#ec028b]">1.2500x</span></div>
                      <div className="py-2 flex justify-between"><span>12/12+ Steep Slope (45&deg;+)</span><span className="font-bold text-[#ec028b]">1.4142x</span></div>
                    </div>
                    
                    <div className="p-3 bg-pink-50 border border-pink-200 rounded text-xs text-slate-800 font-mono">
                      <strong className="text-[#ec028b]">Square Discipline:</strong> All roofing square areas and scope quantities are strictly calculated and displayed to two decimal places (hundredths), e.g., <strong>1.00 SQ</strong> or <strong>2.22 SQ</strong>, ensuring complete billing transparency.
                    </div>

                    <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded font-mono text-[11px] text-slate-600 space-y-1">
                      <div className="font-bold text-slate-800">Sample Residential 2,850 sq ft Audit:</div>
                      <div>&bull; Base Footprint Area: 28.50 SQ</div>
                      <div>&bull; True Surface Area (6/12 Pitch @ 1.1180x): 31.86 SQ</div>
                      <div>&bull; Tear-Off Layer Allowance: 31.86 SQ</div>
                      <div>&bull; Ridge &amp; Hip Linear Allowance: 2.75 SQ</div>
                      <div>&bull; Valley Membrane Protection: 1.25 SQ</div>
                      <div>&bull; Parapet Wall &amp; Flashing: 2.22 SQ</div>
                      <div>&bull; Geometric Waste Allowance (10.00%): 3.81 SQ</div>
                      <div className="font-bold text-[#ec028b] pt-1 border-t border-slate-200">&bull; Total Certified Billable Scope: 41.89 SQ</div>
                    </div>
                  </div>
                </div>

                <div className="relative p-[2px] bg-slate-400 hover:bg-slate-800 transition-colors shadow-sm" style={{ clipPath: chamfer24 }}>
                  <div className="bg-white p-6 h-full" style={{ clipPath: chamfer24 }}>
                    <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-3 text-[#e2ab49]">
                      The 50/40/10 Milestone Settlement Logic
                    </h4>
                    <div className="space-y-3">
                      <div className="p-3 rounded bg-slate-50 border border-slate-200">
                        <div className="text-xs font-mono font-bold text-slate-900">50% MILESTONE 01 // DISPATCH</div>
                        <div className="text-xs text-slate-600 mt-1">Triggers certified Owens Corning material procurement, staging calendar lock, and crew assignment.</div>
                      </div>
                      <div className="p-3 rounded bg-slate-50 border border-slate-200">
                        <div className="text-xs font-mono font-bold text-slate-900">40% MILESTONE 02 // INSTALLATION</div>
                        <div className="text-xs text-slate-600 mt-1">Due immediately upon complete shingle/membrane laydown and initial site clean.</div>
                      </div>
                      <div className="p-3 rounded bg-pink-50 border border-pink-200">
                        <div className="text-xs font-mono font-bold text-[#ec028b]">10% MILESTONE 03 // WARRANTY ACTIVATION</div>
                        <div className="text-xs text-slate-700 mt-1">
                          <strong>Zero punchlist policy:</strong> Only invoiced after the Master Envelope Audit and triple magnetic nail sweep are certified and locked into the digital vault.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5: Team Apparel & Heat Protocol */}
            <section className="space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <Shirt className="text-[#ec028b]" size={20} />
                  <span>Team Apparel &amp; Summer Heat Standards</span>
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-1">Standardized white performance apparel protecting crew health in 135&deg;F+ rooftop heat.</p>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-300 rounded-lg flex items-start gap-3">
                <Sun className="text-amber-600 shrink-0 mt-0.5" size={18} />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <strong>Mandatory Summer Heat Policy:</strong> Black field shirts are strictly purged across Utah and Idaho operations. In rooftop surface temperatures exceeding 135&deg;F–150&deg;F, white technical apparel reflects over 85% of solar radiation to prevent heat exhaustion.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative p-[1.5px] bg-slate-300 hover:bg-slate-700 transition-colors shadow-sm" style={{ clipPath: chamfer16 }}>
                  <div className="bg-white p-6 h-full" style={{ clipPath: chamfer16 }}>
                    <span className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-mono font-bold uppercase">
                      Clean Inspections &amp; Client Meetings
                    </span>
                    <h4 className="text-lg font-black text-slate-900 mt-3 mb-2">White Performance Polo</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Crisp, tailored white technical pique polo. Left chest: high-density embroidered RHIVE hexagonal crest in black/pink. Right sleeve: tonal silver American Flag. Worn for initial client consultations, commercial presentations, and executive site visits.
                    </p>
                  </div>
                </div>

                <div className="relative p-[1.5px] bg-slate-300 hover:bg-slate-700 transition-colors shadow-sm" style={{ clipPath: chamfer16 }}>
                  <div className="bg-white p-6 h-full" style={{ clipPath: chamfer16 }}>
                    <span className="px-2.5 py-1 rounded bg-pink-50 border border-pink-200 text-[#ec028b] text-[10px] font-mono font-bold uppercase">
                      Dirty Work &amp; Rooftop Operations
                    </span>
                    <h4 className="text-lg font-black text-slate-900 mt-3 mb-2">White Hooded Technical Crew</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      UPF 50+ lightweight moisture-wicking sun hoodie. Integrated ergonomic hood provides direct neck and ear protection from solar radiation and attic insulation fibers. Reflective RHIVE lettering across the back for jobsite visibility.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6: Pre-Flight Compliance Gate */}
            <div className="relative p-[2px] bg-slate-400 hover:bg-slate-800 transition-colors shadow-sm" style={{ clipPath: chamfer24 }}>
              <section className="bg-white p-6 sm:p-8 space-y-4" style={{ clipPath: chamfer24 }}>
                <div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                    <ShieldCheck className="text-[#ec028b]" size={18} />
                    <span>Pre-Flight Compliance Checklist (6-Point Gate)</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">Every marketing asset, landing page, and flyer must satisfy all 6 gates before deployment.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                  {[
                    { id: '1', title: 'Geometry', desc: '24px chamfer cuts on cards & buttons. Darker border follows full chamfer. Zero checkboxes.' },
                    { id: '2', title: 'Color Accuracy', desc: 'White (#FFFFFF), Black (#000000), Pink (#ec028b) as primaries. Gold (#e2ab49) & Blue (#08137C) secondary.' },
                    { id: '3', title: 'Typography', desc: 'Rubik on headers, EB Garamond on quotes, Space Mono on telemetry.' },
                    { id: '4', title: 'Estimating Truth', desc: 'Multi-input precision to hundredths (1.00 SQ, 2.22 SQ). No vague lump sums.' },
                    { id: '5', title: 'Completion Verbiage', desc: 'Strictly "10% Upon Warranty Activation". "Punchlist" is permanently banished.' },
                    { id: '6', title: 'Authenticity', desc: 'Zero stock photography. Real Utah & Idaho client homes and crew shots only.' }
                  ].map(gate => (
                    <div key={gate.id} className="p-3 rounded bg-slate-50 border border-slate-300 text-xs">
                      <div className="font-mono font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                        <CheckCircle2 size={13} className="text-[#ec028b]" />
                        <span>Gate 0{gate.id}: {gate.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 leading-normal">{gate.desc}</div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </>
        ) : (
          /* ── COMPETITIVE BRAND ANALYSIS & AUDIT TAB (HKL ROOFING & UTAH COMPETITORS) ── */
          <div className="space-y-12">
            
            {/* Intelligence Header */}
            <div className="relative p-[2px] bg-slate-400 shadow-sm" style={{ clipPath: chamfer24 }}>
              <section className="bg-white p-8" style={{ clipPath: chamfer24 }}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-900 text-white text-xs font-mono font-bold uppercase tracking-wider mb-3">
                  <Crosshair size={14} className="text-[#ec028b]" />
                  <span>Market Intelligence // Wasatch Front Competitive Audit</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                  RHIVE BRAND ANALYSIS &amp; COMPETITIVE AUDIT
                </h2>
                <p className="text-base font-serif italic text-slate-700 leading-relaxed mt-2 max-w-4xl">
                  Deep-dive empirical teardown of top Utah &amp; Mountain West roofing competitors — featuring an exhaustive audit of direct online quoting rival <strong>HKL Roofing</strong> alongside traditional legacy contractors, solar bundlers, and storm chasers.
                </p>
                <div className="mt-4 flex flex-wrap gap-4 text-xs font-mono text-slate-500">
                  <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> Target Competitor: HKL Roofing (hklroofing.com)</span>
                  <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> Legacy Utah: Whitaker Roofing &amp; Shingle Pro</span>
                  <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> Solar Cross-Sell: Mynt Solar &amp; Roofing</span>
                </div>
              </section>
            </div>

            {/* Competitor Teardown #1: HKL Roofing */}
            <div className="relative p-[2px] bg-rose-400 hover:bg-rose-700 transition-colors shadow-sm" style={{ clipPath: chamfer24 }}>
              <section className="bg-white p-6 sm:p-8 space-y-6" style={{ clipPath: chamfer24 }}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-600 uppercase tracking-wider mb-1">
                      <AlertCircle size={14} />
                      <span>Direct Competitor Teardown 01 // Online Quoting Rival</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase">
                      HKL ROOFING (HKLROOFING.COM)
                    </h3>
                    <p className="text-xs font-mono text-slate-500">
                      Operations: Utah, Colorado &amp; Idaho &bull; Positioning: "High Quality Roofing With A Low Price Guarantee"
                    </p>
                  </div>
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded font-mono text-xs text-rose-800">
                    <strong>THEIR PITCH:</strong> "Can Jackie quote your roof? Measure, price, sign, and schedule in one conversation."
                  </div>
                </div>

                {/* HKL Model vs. Vulnerabilities */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-3">
                    <h4 className="font-bold text-xs font-mono uppercase text-slate-700 flex items-center gap-2">
                      <Cpu size={14} className="text-blue-600" />
                      <span>Their Operational &amp; Pricing Architecture</span>
                    </h4>
                    <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                      <li>&bull; <strong>Front-End AI Chatbot ("Jackie"):</strong> Conversational lead capture promising instant address-based pricing without an initial sales visit.</li>
                      <li>&bull; <strong>Generic Home-Size Buckets:</strong> Advertises pricing tiers by home square footage (e.g. 2,000 sq ft, 3,000 sq ft, 4,000 sq ft home).</li>
                      <li>&bull; <strong>Warranty Tier:</strong> Limited Lifetime manufacturer shingle warranty + 10-year workmanship warranty.</li>
                      <li>&bull; <strong>Low Price Guarantee:</strong> Competes heavily on low upfront cost to trigger contract signing.</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-rose-50/60 rounded border border-rose-200 space-y-3">
                    <h4 className="font-bold text-xs font-mono uppercase text-rose-800 flex items-center gap-2">
                      <AlertCircle size={14} className="text-rose-600" />
                      <span>The 4 Fatal Flaws in HKL's Strategy</span>
                    </h4>
                    <ul className="text-xs text-rose-950 space-y-2 leading-relaxed">
                      <li>&bull; <strong>1. The Square-Foot Bucket Trap:</strong> Quoting roofs by living area square footage (e.g. 2,000 sq ft home) is fundamentally deceptive. An 8/12 hip roof on a 2,000 sq ft footprint has over 2,800 sq ft of roof area.</li>
                      <li>&bull; <strong>2. Fine-Print Change Order Loophole:</strong> Their own terms state: <em>"Illustrative asphalt pricing. Your exact price is based on the verified roof and quoted scope. Additional layers, damaged decking, and customer-requested changes may cost more."</em></li>
                      <li>&bull; <strong>3. The 10-Year Workmanship Cap:</strong> Providing only a 10-year workmanship warranty leaves homeowners exposed for 40 years on a 50-year architectural shingle.</li>
                      <li>&bull; <strong>4. Front-Loaded Collection:</strong> Lacks a 50/40/10 milestone holdback, leaving homeowners without leverage when cleanup or punch list disputes arise.</li>
                    </ul>
                  </div>
                </div>

                {/* How RHIVE Wins */}
                <div className="p-5 rounded-lg border" style={{ backgroundColor: '#F8FAFC', borderColor: '#CBD5E1' }}>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase mb-2" style={{ color: '#0F172A' }}>
                    <CheckCircle2 size={16} className="text-[#ec028b]" />
                    <span>RHIVE's Mathematical Counter-Strike</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700">
                    <div>
                      <strong className="text-slate-900 block font-mono">1. True Geometric Photogrammetry</strong>
                      Every quote calculated to exact hundredths (e.g., <strong>28.50 SQ</strong>, <strong>1.00 SQ</strong>, <strong>2.22 SQ</strong>) with exact slope pitch multipliers (1.1180x) and documented tear-off layers.
                    </div>
                    <div>
                      <strong className="text-slate-900 block font-mono">2. 50-Year Sovereign Gold Warranty</strong>
                      5x the workmanship coverage of HKL (50 years vs 10 years) backed by Owens Corning Duration Flex SBS Class 4 impact resistance.
                    </div>
                    <div>
                      <strong className="text-slate-900 block font-mono">3. 50/40/10 Milestone Holdback</strong>
                      Homeowner holds the final 10% until Warranty Activation sign-off and forensic magnetic nail sweep certification.
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Competitor Teardown #2, #3, #4 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Legacy Utah Contractors */}
              <div className="relative p-[1.5px] bg-slate-300 hover:bg-slate-700 transition-colors shadow-sm" style={{ clipPath: chamfer16 }}>
                <div className="bg-white p-5 h-full flex flex-col justify-between" style={{ clipPath: chamfer16 }}>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      Legacy Utah Contractors
                    </span>
                    <h4 className="text-base font-black text-slate-900 mt-2 mb-1">Whitaker Roofing &amp; Traditional</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-3">
                      Established 50–75+ year contractors operating on high-pressure commission salesmen, manual tape measures, and opaque paper lump sums.
                    </p>
                    <div className="space-y-1.5 text-xs text-slate-700 font-mono">
                      <div>&bull; Salesman commission: 25%–35% built into quote</div>
                      <div>&bull; Workmanship warranty: 2–5 years max</div>
                      <div>&bull; Portal access: None (paper contracts)</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono font-bold text-[#ec028b]">
                    RHIVE Advantage: Zero salesmen, 100% transparent TrueCost formulas, real-time homeowner portal.
                  </div>
                </div>
              </div>

              {/* Solar Cross-Sell Bundlers */}
              <div className="relative p-[1.5px] bg-slate-300 hover:bg-slate-700 transition-colors shadow-sm" style={{ clipPath: chamfer16 }}>
                <div className="bg-white p-5 h-full flex flex-col justify-between" style={{ clipPath: chamfer16 }}>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      Solar Bundlers
                    </span>
                    <h4 className="text-base font-black text-slate-900 mt-2 mb-1">Mynt Solar &amp; Roofing Bundlers</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-3">
                      Treats roofing as a secondary financing vehicle to solar PPA contracts. Rooftop tear-off and shingles are subcontracted to lowest bidders.
                    </p>
                    <div className="space-y-1.5 text-xs text-slate-700 font-mono">
                      <div>&bull; Subcontracted crews without envelope certification</div>
                      <div>&bull; Penetration leak risk from solar racking mounts</div>
                      <div>&bull; Multi-month delays waiting for net metering</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono font-bold text-[#ec028b]">
                    RHIVE Advantage: Master envelope roofers, SureNail 130 MPH fastening, dedicated 48hr turnarounds.
                  </div>
                </div>
              </div>

              {/* Storm Chasers & Transient Crews */}
              <div className="relative p-[1.5px] bg-slate-300 hover:bg-slate-700 transition-colors shadow-sm" style={{ clipPath: chamfer16 }}>
                <div className="bg-white p-5 h-full flex flex-col justify-between" style={{ clipPath: chamfer16 }}>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      Storm Chasers
                    </span>
                    <h4 className="text-base font-black text-slate-900 mt-2 mb-1">Rhino, Big Red &amp; Out-of-State</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-3">
                      Door-to-door storm chasing following Wasatch Front hail storms. Lures homeowners with low bids then hits them with change orders upon tear-off.
                    </p>
                    <div className="space-y-1.5 text-xs text-slate-700 font-mono">
                      <div>&bull; Out-of-state license plates &amp; transient labor</div>
                      <div>&bull; 1-year warranty that vanishes by winter</div>
                      <div>&bull; Cheap 3-tab shingles prone to 60 MPH blowoff</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono font-bold text-[#ec028b]">
                    RHIVE Advantage: Permanent Wasatch Front presence, Class 4 SBS hail resistance, lifetime warranty vault.
                  </div>
                </div>
              </div>
            </div>

            {/* Master 10-Point Benchmark Matrix */}
            <div className="relative p-[2px] bg-slate-400 shadow-sm" style={{ clipPath: chamfer24 }}>
              <section className="bg-white p-6 sm:p-8 space-y-4" style={{ clipPath: chamfer24 }}>
                <div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                    <TrendingUp className="text-[#ec028b]" size={20} />
                    <span>Comprehensive 10-Point Competitive Benchmark Matrix</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Direct architectural comparison of RHIVE vs HKL Roofing and traditional Utah competitors.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-200 font-mono text-[11px] uppercase text-slate-600 bg-slate-50">
                        <th className="py-3 px-3">Benchmark Dimension</th>
                        <th className="py-3 px-3 text-[#ec028b] font-black">RHIVE Construction</th>
                        <th className="py-3 px-3 text-rose-700 font-bold">HKL Roofing</th>
                        <th className="py-3 px-3 text-slate-700">Legacy Contractors</th>
                        <th className="py-3 px-3 text-slate-700">Solar Bundlers</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-slate-900">Quoting Precision</td>
                        <td className="py-2.5 px-3 font-bold" style={{ backgroundColor: '#F8FAFC', color: '#0F172A' }}>
                          <span className="text-[#ec028b] font-black mr-1.5">✓</span>40-Variable Solar/CAD to Hundredths (e.g. 28.50 SQ)
                        </td>
                        <td className="py-2.5 px-3 text-rose-600">Broad Home Size Buckets (2,000 / 3,000 / 4,000)</td>
                        <td className="py-2.5 px-3 text-slate-600">Manual Tape Measure &bull; Opaque Lump Sum</td>
                        <td className="py-2.5 px-3 text-slate-600">Blended into Solar PPA Monthly Payment</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-slate-900">Workmanship Warranty</td>
                        <td className="py-2.5 px-3 font-bold" style={{ backgroundColor: '#F8FAFC', color: '#0F172A' }}>
                          <span className="text-[#ec028b] font-black mr-1.5">✓</span>50-Year Sovereign Gold Lifetime
                        </td>
                        <td className="py-2.5 px-3 text-amber-700">10-Year Limited Workmanship</td>
                        <td className="py-2.5 px-3 text-slate-600">2–5 Years Standard</td>
                        <td className="py-2.5 px-3 text-slate-600">Subcontractor Dependent (1–5 Yrs)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-slate-900">Settlement Architecture</td>
                        <td className="py-2.5 px-3 font-bold" style={{ backgroundColor: '#F8FAFC', color: '#0F172A' }}>
                          <span className="text-[#ec028b] font-black mr-1.5">✓</span>50% Deposit / 40% Dry-in / 10% Warranty Activation
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">Standard Progress Billing (No Holdback)</td>
                        <td className="py-2.5 px-3 text-slate-600">50% Down / 50% Completion (Day of Install)</td>
                        <td className="py-2.5 px-3 text-slate-600">Bundled into 25-Year Loan Financing</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-slate-900">Punch List Protocol</td>
                        <td className="py-2.5 px-3 font-bold" style={{ backgroundColor: '#F8FAFC', color: '#0F172A' }}>
                          <span className="text-[#ec028b] font-black mr-1.5">✓</span>100% Permanently Purged &bull; Forensic Vault Sign-Off
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">Standard Contractor Punch List</td>
                        <td className="py-2.5 px-3 text-rose-600">Disputed Final Payment Holdouts</td>
                        <td className="py-2.5 px-3 text-slate-600">Delayed Until Solar Inspection Passed</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-slate-900">Change Order Rate</td>
                        <td className="py-2.5 px-3 font-bold" style={{ backgroundColor: '#F8FAFC', color: '#0F172A' }}>
                          <span className="text-[#ec028b] font-black mr-1.5">✓</span>0.00% Guaranteed Price Lock on Scope
                        </td>
                        <td className="py-2.5 px-3 text-amber-700">Fine Print Clause for Layers &amp; Decking</td>
                        <td className="py-2.5 px-3 text-rose-600">Frequent Day-of-Tear-Off Price Hikes</td>
                        <td className="py-2.5 px-3 text-slate-600">Rerouting Conduit Add-On Fees</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-slate-900">Shingle Specification</td>
                        <td className="py-2.5 px-3 font-bold" style={{ backgroundColor: '#F8FAFC', color: '#0F172A' }}>
                          <span className="text-[#ec028b] font-black mr-1.5">✓</span>Owens Corning Duration Flex SBS Class 4 Impact
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">Standard Architectural Asphalt Shingle</td>
                        <td className="py-2.5 px-3 text-slate-600">Contractor Grade Standard Shingles</td>
                        <td className="py-2.5 px-3 text-slate-600">Economy Shingles to Keep Solar Bids Low</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-slate-900">Nail Fastening Standard</td>
                        <td className="py-2.5 px-3 font-bold" style={{ backgroundColor: '#F8FAFC', color: '#0F172A' }}>
                          <span className="text-[#ec028b] font-black mr-1.5">✓</span>SureNail 6-Nail 130 MPH High-Wind Pattern
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">Standard 4-Nail Pattern</td>
                        <td className="py-2.5 px-3 text-slate-600">Standard 4-Nail Pattern</td>
                        <td className="py-2.5 px-3 text-slate-600">Varies by Subcontractor</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-slate-900">Flashing &amp; Valleys</td>
                        <td className="py-2.5 px-3 font-bold" style={{ backgroundColor: '#F8FAFC', color: '#0F172A' }}>
                          <span className="text-[#ec028b] font-black mr-1.5">✓</span>Hand-Bent Step/Counter Kits + Ice &amp; Water Shield
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">Full Synthetic Underlayment Standard</td>
                        <td className="py-2.5 px-3 text-slate-600">Often Re-uses Existing Rusty Step Flashing</td>
                        <td className="py-2.5 px-3 text-rose-600">Tile/Shingle Cuts Around Solar Mounts</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-slate-900">Team Heat Safety Standard</td>
                        <td className="py-2.5 px-3 font-bold" style={{ backgroundColor: '#F8FAFC', color: '#0F172A' }}>
                          <span className="text-[#ec028b] font-black mr-1.5">✓</span>White Performance UPF 50+ (85%+ Solar Reflective)
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">Standard Crew Attire (Black / Navy)</td>
                        <td className="py-2.5 px-3 text-rose-600">Black Cotton Shirts (Heat Exhaustion Risk)</td>
                        <td className="py-2.5 px-3 text-slate-600">High-Vis Yellow Polyester Vests</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-slate-900">Operational Leadership</td>
                        <td className="py-2.5 px-3 font-bold" style={{ backgroundColor: '#F8FAFC', color: '#0F172A' }}>
                          <span className="text-[#ec028b] font-black mr-1.5">✓</span>Female-Led Precision (Kara Robinson, President)
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">Automated "Jackie" Chatbot Frontend</td>
                        <td className="py-2.5 px-3 text-slate-600">Male-Dominated Traditional Contractor Culture</td>
                        <td className="py-2.5 px-3 text-slate-600">Venture-Backed Solar Financial Sales Reps</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* The 6 Unbreachable Moats */}
            <div className="relative p-[2px] bg-slate-400 shadow-sm" style={{ clipPath: chamfer24 }}>
              <section className="bg-white p-6 sm:p-8 space-y-4" style={{ clipPath: chamfer24 }}>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-[#ec028b]" size={20} />
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                    The 6 Sovereign Moats: Why RHIVE Dominates the Wasatch Front
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {[
                    { title: '1. True Area Math', desc: 'Roofing area calculated to exact hundredths (e.g. 28.50 SQ, 1.00 SQ, 2.22 SQ), exposing the misleading generic square-foot home tiers used by HKL.' },
                    { title: '2. 50-Yr Sovereign Warranty', desc: '5x longer workmanship protection than HKL’s 10-year cap, backed by Owens Corning Platinum Duration Flex SBS.' },
                    { title: '3. 50/40/10 Financial Leverage', desc: 'The homeowner holds 10% until Warranty Activation sign-off; the contentious "punch list" is permanently eliminated.' },
                    { title: '4. Female-Led Operational Rigor', desc: 'Led by President Kara Robinson, delivering meticulous administrative communication that traditional contractors cannot match.' },
                    { title: '5. Thermal Crew Safety Protocol', desc: 'Standardized white UPF 50+ performance apparel reflecting 85%+ solar radiation in 135°F+ Wasatch summer heat.' },
                    { title: '6. Sovereign Quantum OS Stack', desc: 'Integrated 3-Lane Telephony Swarm, photogrammetric CAD verification, and automated digital customer portal.' }
                  ].map((moat, i) => (
                    <div key={i} className="p-3.5 rounded bg-slate-50 border border-slate-300 text-xs">
                      <div className="font-mono font-bold text-slate-900 mb-1 text-[#ec028b]">{moat.title}</div>
                      <div className="text-slate-600 leading-relaxed text-[11px]">{moat.desc}</div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

          </div>
        )}

      </main>
    </div>
  );
};

export default RHIVEBrandingPage;
