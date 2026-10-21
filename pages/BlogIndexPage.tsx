import React, { useEffect, useState } from 'react';
import CircuitryCard from '../components/CircuitryCard';

interface BlogMeta {
  title: string;
  slug: string;
  description: string;
  category: 'Residential' | 'Commercial' | 'Insurance' | 'Pricing & Cost' | 'Maintenance' | 'Winter Care' | 'Company Culture';
  readTime: string;
  badge?: string;
}

const BLOGS_DATA: BlogMeta[] = [
  // ── COMMUNITY & ABUNDANCE INITIATIVES ──────────────────────────────────────────
  {
    title: 'RHIVE Abundance Feature: Uplifting Local Utah Businesses & Building Stronger Communities',
    slug: '/blog/rhive-abundance-feature-local-utah-businesses',
    description: 'A dedicated monthly initiative spotlighting and promoting locally owned Utah small businesses 100% free of charge to foster community connection and growth.',
    category: 'Company Culture',
    readTime: '4 min read',
    badge: 'Community Spotlight'
  },
  {
    title: 'The RHIVE Abundance Network: How RHIVE Construction Rewards Community Referrals & Empowers Utah Homeowners',
    slug: '/blog/rhive-abundance-network-community-referrals',
    description: 'Transforming clients into active partners with tiered referral rewards up to $2,000, free lifetime gutter cleaning, and funded local roof donations.',
    category: 'Company Culture',
    readTime: '5 min read',
    badge: 'Community Spotlight'
  },

  // ── AUTUMN & WINTER PREPAREDNESS STRATEGY ──────────────────────────────────
  {
    title: 'RHIVE Fall Roof Maintenance Guide: Preparing Utah Roofs for Winter Weather',
    slug: '/blog/rhive-fall-roof-maintenance-guide-utah',
    description: 'Essential autumn roof maintenance guide for Utah homeowners. Learn how to clean gutters, prevent winter ice dams, check shingle health, and schedule a professional fall inspection with RHIVE Construction.',
    category: 'Maintenance',
    readTime: '6 min read',
    badge: 'Fall Maintenance'
  },

  // ── 5 AEO, SEO & GEO STRATEGY ARTICLES (INSURANCE, FINANCING, ICE DAMS, HAIL, BOUNTIFUL) ─
  {
    title: 'Navigating Roof Insurance Claims in Utah: A Step-by-Step Homeowner Guide',
    slug: '/blog/roof-insurance-claims-utah-step-by-step-guide',
    description: 'Learn how to navigate roof insurance claims in Utah. Discover covered storm damage, ACV vs. RCV payouts, building code mandates, and RHIVE\'s adjuster advocacy.',
    category: 'Insurance',
    readTime: '6 min read',
    badge: 'Insurance Guide'
  },
  {
    title: 'Roof Replacement Financing in Utah: Low APRs, 0% Interest & Flexible Options',
    slug: '/blog/roof-replacement-financing-utah-options',
    description: 'Explore roof financing options in Utah. Learn how 0% promotional APR, fixed low monthly payment terms, and RHIVE\'s 50/40/10 structure make replacement accessible.',
    category: 'Residential',
    readTime: '5 min read',
    badge: 'Financing Guide'
  },
  {
    title: 'Ice Dam Prevention & Mitigation in Utah: Stopping Destructive Winter Roof Leaks',
    slug: '/blog/ice-dam-prevention-mitigation-utah-guide',
    description: 'Prevent severe ice dam leaks in Utah. Learn why ice dams form along the Wasatch Front, R-60 attic insulation codes, self-regulating heat trace cables, and safe steaming.',
    category: 'Maintenance',
    readTime: '6 min read',
    badge: 'Winter Guide'
  },
  {
    title: 'Hail Damage Insurance Claims in Utah: How to Spot Bruises & Secure Approval',
    slug: '/blog/hail-damage-insurance-claims-utah-inspection-guide',
    description: 'Identify hidden hail damage on Utah asphalt roofs. Learn how hail bruises shingles, fractures fiberglass mats, and how RHIVE secures full insurance claim approvals.',
    category: 'Insurance',
    readTime: '6 min read',
    badge: 'Hail Damage'
  },
  {
    title: 'Top-Rated Roofing Contractor in Bountiful, UT: Local Reroofing & Storm Repair',
    slug: '/blog/top-rated-roofing-contractor-bountiful-ut',
    description: 'Looking for the best roofing contractor in Bountiful, UT? Discover RHIVE Construction\'s high-wind SureNail shingles, Davis County permit compliance, and zero salesman markup.',
    category: 'Residential',
    readTime: '5 min read',
    badge: 'Local Spotlight'
  },

  // ── 9 AEO & SEO NEW BLOG ARTICLES ───────────────────────────────────────────────
  {
    title: 'How Do I Know My Roof Only Needs a Repair or a Full Replacement?',
    slug: '/blog/roof-repair-vs-full-replacement-utah-guide',
    description: 'Learn when a surgical roof repair is sufficient versus when widespread age, granule loss, and thermal stress mandate a 100% full tear-off in Utah.',
    category: 'Residential',
    readTime: '6 min read',
    badge: 'AEO Featured'
  },
  {
    title: 'Do I Have Legal or Contract Recourse If a Roofer Ghosted My Unfinished Job?',
    slug: '/blog/unfinished-roof-contractor-ghosted-utah-recourse',
    description: 'Utah statutory protections under DOPL and Lien Recovery Fund when an irresponsible contractor abandons your project, plus RHIVE emergency rescue protocols.',
    category: 'Insurance',
    readTime: '6 min read',
    badge: 'AEO Featured'
  },
  {
    title: 'How Long Should I Expect a Roof Replacement to Take in Utah?',
    slug: '/blog/how-long-does-roof-replacement-take-utah',
    description: 'The exact 1 to 2 day installation timeline for residential reroofs along the Wasatch Front, from morning tear-off to evening magnetic sweep.',
    category: 'Residential',
    readTime: '5 min read',
    badge: 'AEO Featured'
  },
  {
    title: 'How Do I Know If My Insurance Will Cover My Roof Repair in Utah?',
    slug: '/blog/how-do-i-know-if-insurance-covers-roof-repair-utah',
    description: 'Understanding covered weather perils (wind, hail, fallen branches) vs uncovered wear and tear, and why a pre-claim storm inspection protects your record.',
    category: 'Insurance',
    readTime: '5 min read',
    badge: 'AEO Featured'
  },
  {
    title: 'How Do I Know If My Insurance Will Cover My Full Roof Replacement in Utah?',
    slug: '/blog/how-do-i-know-if-insurance-covers-full-roof-replacement-utah',
    description: 'The exact criteria insurance adjusters use to approve full system replacements, on-site adjuster advocacy, and 100% full tear-off standards.',
    category: 'Insurance',
    readTime: '6 min read',
    badge: 'AEO Featured'
  },
  {
    title: 'Is There Financial Assistance or Flexible Options for a Full Roof Replacement in Utah?',
    slug: '/blog/roof-replacement-financing-financial-assistance-utah',
    description: '0% APR financing, low monthly rate plans, the RHIVE Project Savings Promotion (RPSP) 10% credit, and community donation programs for local heroes.',
    category: 'Pricing & Cost',
    readTime: '6 min read',
    badge: 'AEO Featured'
  },
  {
    title: 'Fastest Emergency Roof Repair in Salt Lake City & Across Utah',
    slug: '/blog/fastest-emergency-roof-repair-salt-lake-city-utah',
    description: 'RHIVE Quantum Rapid-Response Protocol for same-day emergency tarping, active leak containment, and the $350 emergency fee credit guarantee.',
    category: 'Maintenance',
    readTime: '5 min read',
    badge: 'AEO Featured'
  },
  {
    title: 'What Do I Check on My Roof After a Hail Storm? A Step-by-Step Homeowner Guide',
    slug: '/blog/what-to-check-on-roof-after-hail-storm-utah',
    description: 'A safe ground-level inspection checklist for Utah homeowners after a hail storm, identifying shingle bruising, dented pipe jacks, and insurance deadlines.',
    category: 'Insurance',
    readTime: '6 min read',
    badge: 'AEO Featured'
  },
  {
    title: 'Navigating Roofing Insurance Claims in Salt Lake City & Across Utah',
    slug: '/blog/navigating-roofing-insurance-claims-salt-lake-city-utah',
    description: 'Your complete roadmap to storm restoration: pre-claim satellite verification, on-site adjuster walk-throughs, code upgrades, and ACV/depreciation handling.',
    category: 'Insurance',
    readTime: '7 min read',
    badge: 'AEO Featured'
  },

  // ── ORIGINAL 10 CORE GUIDES ───────────────────────────────────────────────────
  {
    title: 'How Much Does a Roof Replacement Cost in Utah? (The Honest Mathematical Breakdown)',
    slug: '/blog/roof-replacement-cost-utah',
    description: 'Laying bare the real cost of a new roof in Utah. Compare local material, labor, permits, and company profit with absolute transparency.',
    category: 'Pricing & Cost',
    readTime: '6 min read'
  },
  {
    title: 'How to Prevent Roof Ice Dams: A Utah Homeowner\'s Guide to Winter Survival',
    slug: '/blog/ice-dams-prevention-utah',
    description: 'Stop destructive winter ice dams from ruining your Utah home. Learn how proper attic ventilation, insulation, and heat cables protect your roof warranty.',
    category: 'Winter Care',
    readTime: '5 min read'
  },
  {
    title: 'Filing a Roof Damage Insurance Claim in Utah: The Ultimate Homeowner’s Playbook',
    slug: '/blog/roof-damage-insurance-claims-utah',
    description: 'Your step-by-step guide to navigating storm damage insurance claims in Utah. Spot storm damage, protect your equity, and avoid common claim pitfalls.',
    category: 'Insurance',
    readTime: '7 min read'
  },
  {
    title: 'Owens Corning vs GAF Shingles: The Ultimate Battle for Utah Roof Dominance',
    slug: '/blog/owens-corning-vs-gaf-shingles-utah',
    description: 'Owens Corning Duration or GAF Woodland? Compare wind ratings, hail resistance, warranties, and aesthetic profiles custom-engineered for Utah weather.',
    category: 'Residential',
    readTime: '6 min read'
  },
  {
    title: 'TPO vs PVC Roofing: The Definitive Flat Roof Guide for Utah Commercial Properties',
    slug: '/blog/tpo-vs-pvc-commercial-flat-roofing',
    description: 'TPO vs PVC commercial flat roofing. Compare GAF membrane specs, solar reflectivity, chemical resistance, and local Utah building codes for layovers.',
    category: 'Commercial',
    readTime: '7 min read'
  },
  {
    title: 'The Proactive DIY Roof Inspection Checklist: How to Protect Your Home and Maintain Your Warranty',
    slug: '/blog/diy-roof-checklist-utah',
    description: 'Protect your home equity & keep your warranty active. Learn how to perform a safe DIY roof inspection in Utah with our step-by-step checklist.',
    category: 'Maintenance',
    readTime: '5 min read'
  },
  {
    title: 'Women in Construction: How Female Leadership is Transforming Utah\'s Roofing Industry',
    slug: '/blog/female-leadership-construction',
    description: 'How female leadership is transforming Utah\'s roofing industry through radical price transparency, workforce empowerment, and deep community impact.',
    category: 'Company Culture',
    readTime: '5 min read'
  },
  {
    title: 'The Hidden Shield: Why Custom Seamless Gutters Are Crucial for Utah Homes',
    slug: '/blog/seamless-gutters-importance-utah',
    description: 'Seamless aluminum rain gutters custom-extruded on-site. Compare K-Style, Round-Style, and Box-Style specs with our heavy-duty 24-inch hanger spacing.',
    category: 'Maintenance',
    readTime: '5 min read'
  },
  {
    title: 'Solar Panels and Roof Replacement: The Ultimate Utah Integration Guide',
    slug: '/blog/solar-panels-roof-replacement-utah',
    description: 'Installing solar panels or replacing a roof? Learn about solar detach & reset, electrical disconnects, and protecting your lifetime warranty.',
    category: 'Maintenance',
    readTime: '6 min read'
  },
  {
    title: 'How to Choose a Reputable Roofing Contractor in Utah: The Ultimate Homeowner’s Checklist',
    slug: '/blog/how-to-choose-reputable-roofing-contractor-utah',
    description: 'Don\'t get scammed by storm chasers or uncertified roofers. Our expert checklist covers DOPL checks, warranty traps, and installation red flags in Utah.',
    category: 'Pricing & Cost',
    readTime: '7 min read'
  },

  // ── TECHNICAL SPECIALIST ARTICLES ─────────────────────────────────────────────
  {
    title: 'Asphalt Shingle Granule Loss: Causes, Winter Risks, and When to Replace',
    slug: '/blog/asphalt-shingle-granule-loss-causes-remedies',
    description: 'Understanding why shingles shed mineral granules, freeze-thaw asphalt degradation, and how to know when granule loss signals critical roof failure.',
    category: 'Residential',
    readTime: '5 min read'
  },
  {
    title: 'Commercial TPO vs. PVC Roofing in Utah: Chemical Resistance, Welds & Costs',
    slug: '/blog/commercial-tpo-vs-pvc-roofing-utah-guide',
    description: 'An architectural deep dive into single-ply membrane thickness (60 vs 80 mil), hot-air robotic seam welding, and grease resistance for Utah buildings.',
    category: 'Commercial',
    readTime: '7 min read'
  },
  {
    title: 'Wind and Hail Damage Insurance Claims: Wasatch Front Homeowner Guide',
    slug: '/blog/roofing-insurance-claims-utah-wind-hail-guide',
    description: 'Navigating canyon wind gust blow-offs, microburst hail damage, and working directly with your insurer for full roof restoration.',
    category: 'Insurance',
    readTime: '6 min read'
  }
];

const BlogIndexPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    document.title = "Utah Roofing Blog & Research Cluster | RHIVE Construction";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Explore our comprehensive library of roofing guides, cost breakdowns, material reviews, AEO answers, and maintenance tips for Utah homeowners.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Explore our comprehensive library of roofing guides, cost breakdowns, material reviews, AEO answers, and maintenance tips for Utah homeowners.';
      document.head.appendChild(meta);
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const categories = ['All', 'Residential', 'Commercial', 'Insurance', 'Pricing & Cost', 'Maintenance', 'Winter Care', 'Company Culture'];

  const filteredBlogs = BLOGS_DATA.filter(blog => {
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          blog.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black text-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <span className="text-[#ec028b] text-xs font-bold uppercase tracking-[0.2em] block mb-3 drop-shadow-[0_0_8px_rgba(236,2,139,0.5)]">
            Utah Roofing Academy & Knowledge Vault
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Expert Insights & AEO Research Guides
          </h1>
          <p className="text-slate-400 text-lg max-w-[70ch] mx-auto leading-relaxed">
            Helping Wasatch Front homeowners and property managers make data-driven decisions with bottom-line-up-front answers, mathematical cost transparency, and master-craftsman standards.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="mb-12 space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-[#ec028b] text-white shadow-[0_0_12px_rgba(236,2,139,0.4)]'
                    : 'bg-white/5 hover:bg-white/10 text-gray-400 border border-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search guides (e.g. Insurance, Repair, Cost, TPO)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-950 border border-white/15 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ec028b] transition"
            />
          </div>
        </div>

        {/* Blog Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {filteredBlogs.map((blog, idx) => (
            <CircuitryCard
              key={idx}
              title={blog.title}
              icon={
                <span className="text-xs font-black text-[#ec028b] tracking-wider uppercase">
                  {blog.category}
                </span>
              }
              className="cursor-pointer hover:shadow-pink-glow hover:border-[#ec028b]/40 transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex flex-col justify-between h-full pt-4">
                {blog.badge && (
                  <span className="self-start px-2 py-0.5 mb-3 bg-[#ec028b]/20 border border-[#ec028b]/40 text-[#ec028b] text-[10px] font-bold uppercase tracking-widest rounded-sm">
                    {blog.badge}
                  </span>
                )}
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {blog.description}
                </p>
                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                  <span className="text-slate-500 text-xs font-mono">{blog.readTime}</span>
                  <a
                    href={blog.slug}
                    className="text-[#ec028b] hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors duration-200"
                  >
                    Read Guide <span className="text-[10px]">→</span>
                  </a>
                </div>
              </div>
            </CircuitryCard>
          ))}
        </div>

        {filteredBlogs.length === 0 && (
          <div className="text-center py-16 text-gray-400 font-mono">
            No research guides match your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogIndexPage;
