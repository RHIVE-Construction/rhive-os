import React, { useEffect } from 'react';
import CircuitryCard from '../components/CircuitryCard';

interface BlogMeta {
  title: string;
  slug: string;
  description: string;
  category: 'Pricing & Cost' | 'Winter Care' | 'Insurance' | 'Materials' | 'Maintenance' | 'Company Culture';
  readTime: string;
}

const BLOGS_DATA: BlogMeta[] = [
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
    category: 'Materials',
    readTime: '6 min read'
  },
  {
    title: 'TPO vs PVC Roofing: The Definitive Flat Roof Guide for Utah Commercial Properties',
    slug: '/blog/tpo-vs-pvc-commercial-flat-roofing',
    description: 'TPO vs PVC commercial flat roofing. Compare GAF membrane specs, solar reflectivity, chemical resistance, and local Utah building codes for layovers.',
    category: 'Materials',
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
  }
];

const BlogIndexPage: React.FC = () => {
  useEffect(() => {
    document.title = "Utah Roofing Blog & Research Cluster | RHIVE Construction";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Explore our comprehensive library of roofing guides, cost breakdowns, material reviews, and maintenance tips for Utah homeowners.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Explore our comprehensive library of roofing guides, cost breakdowns, material reviews, and maintenance tips for Utah homeowners.';
      document.head.appendChild(meta);
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <span className="text-[#ec028b] text-xs font-bold uppercase tracking-[0.2em] block mb-3 drop-shadow-[0_0_8px_rgba(236,2,139,0.5)]">
            Utah Roofing Academy
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Expert Insights & Local Research
          </h1>
          <p className="text-slate-400 text-lg max-w-[70ch] mx-auto leading-relaxed">
            Helping Wasatch Front homeowners make data-driven decisions about roof systems, costs, and winter protection with complete pricing transparency.
          </p>
        </div>

        {/* Blog Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {BLOGS_DATA.map((blog, idx) => (
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
      </div>
    </div>
  );
};

export default BlogIndexPage;
