import React, { useEffect, useState } from 'react';

const BlogDiyChecklistPage: React.FC = () => {
  useEffect(() => {
    document.title = "The Proactive DIY Roof Inspection Checklist | RHIVE";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Protect your home equity & keep your warranty active. Learn how to perform a safe DIY roof inspection in Utah with our step-by-step checklist.');
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Interactivity for Checklist items
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleCheck = (idx: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const steps = [
    {
      title: "Step 1: Track Organic Debris and Valleys",
      desc: "Look closely at valleys and fields. Clear leaves, pine needles, or fallen branches using ground tools. Debris traps moisture and voids warranties.",
    },
    {
      title: "Step 2: Establish the \"12-Inch Vegetation Compliance Zone\"",
      desc: "Trim tree branches touching shingles back to a minimum of 12 inches to prevent wind scrape gouging granules and squirrel highway access.",
    },
    {
      title: "Step 3: Spot-Clean Algae, Moss, and Black Streaks",
      desc: "Apply a 10% bleach solution on northern facets. Avoid high-pressure washers, which strip shingle asphalt granules instantly.",
    },
    {
      title: "Step 4: Verify Gutter and Downspout Flow",
      desc: "Clear leaf troughs and verify flow. Ensure hangers are secured tightly at 24-inch intervals to prevent ice load collapse.",
    },
    {
      title: "Step 5: Check Roof Penetrations From Your Attic",
      desc: "Head inside with a flashlight. Look for daylight, musty odors, or wet sheathing around chimney flashing, skylights, and pipe jacks.",
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <div className="mb-12">
          <a
            href="/blog"
            className="text-slate-400 hover:text-[#ec028b] text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-colors duration-200"
          >
            ← Back to Blog
          </a>
        </div>

        {/* Article Header */}
        <div className="mb-12 border-b border-white/10 pb-8">
          <span className="text-[#ec028b] text-xs font-bold uppercase tracking-[0.2em] block mb-3 drop-shadow-[0_0_8px_rgba(236,2,139,0.5)]">
            Maintenance Guide
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            The Proactive DIY Roof Inspection Checklist: How to Protect Your Home and Maintain Your Warranty
          </h1>
          <p className="text-slate-400 text-sm font-mono">Published: August 19, 2026 • 5 min read</p>
        </div>

        {/* Content Body */}
        <article className="space-y-8 text-base sm:text-lg text-slate-300 leading-relaxed max-w-[70ch] mx-auto">
          <p>
            Many homeowners along the Wasatch Front treat their roof like a "set-it-and-forget-it" shield. In reality, a roof is a dynamic structural system that requires regular attention. Utah’s extreme climate—characterized by winter snow accumulation, summer heat bakes, and sudden open-valley wind shears—puts continuous thermal stress on your shingles and flashing.
          </p>

          <p>
            Proactive roof maintenance is essential to maximize the lifespan of your roof and preserve your warranty coverage. Catching minor wear early prevents small, localized breaches from turning into devastating structural rotted decking, ruined drywall, and indoor mold.
          </p>

          <p>
            However, performing a roof check must be handled with extreme care. <strong>Roofing systems are not designed for foot traffic, and homeowners should avoid roof traffic at all costs.</strong> Walking on brittle shingles can cause mechanical damage, rub off protective granules, and void your warranty.
          </p>

          <p>
            This expert <strong>DIY roof inspection checklist</strong> focuses on safe, ground-based observation techniques and basic yard maintenance to keep your home protected and your warranty fully active.
          </p>

          <hr className="border-white/10" />

          <h2 className="text-2xl font-bold text-white tracking-tight">1. Safety First: The "No-Foot-Traffic" Rule</h2>

          <p>
            Before we review the checklist, understand that you do not need to walk on your roof deck to inspect it. Instead, we recommend using a pair of high-powered binoculars from the ground or using high-resolution digital camera zooms.
          </p>
          <p>
            If you ever suspect hidden damage that cannot be viewed safely from the ground, connect with our team. RHIVE provides comprehensive assessments utilizing high-resolution aerial drone imagery and satellite modeling to map your entire roof field without placing a single foot on your shingles.
          </p>

          <hr className="border-white/10" />

          <h2 className="text-2xl font-bold text-white tracking-tight">2. Your 5-Step DIY Roof Maintenance Checklist</h2>

          <p>
            Perform this walkaround inspection twice a year—ideally in the spring and late fall. Click the steps below to track your progress:
          </p>

          {/* Interactive Checklist UI */}
          <div className="space-y-4 my-8">
            {steps.map((step, idx) => (
              <div
                key={idx}
                onClick={() => toggleCheck(idx)}
                className={`p-5 bg-zinc-950 border rounded-md cursor-pointer transition-all duration-300 ${
                  checkedItems[idx]
                    ? 'border-[#ec028b] bg-[#ec028b]/5 shadow-pink-glow-sm'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    checkedItems[idx] ? 'border-[#ec028b] bg-[#ec028b]' : 'border-white/30'
                  }`}>
                    {checkedItems[idx] && (
                      <span className="text-white text-xs font-black">✓</span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{step.title}</h3>
                </div>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed ml-8">{step.desc}</p>
              </div>
            ))}
          </div>

          <hr className="border-white/10" />

          <h2 className="text-2xl font-bold text-white tracking-tight">3. Crucial Rules to Keep Your RHIVE Warranty Active</h2>

          <p>
            If you have a new roof installed by RHIVE Construction, your investment is protected by our industry-leading <strong>Lifetime No-Leak Workmanship Guarantee</strong> alongside premium, non-prorated manufacturer warranties.
          </p>
          <p>
            To protect your coverage, you must adhere to these three essential contractual conditions:
          </p>

          <h3 className="text-xl font-bold text-white tracking-tight">1. The "Persons on Roof" 3-Day Rule</h3>
          <p>
            To prevent uncertified mechanical damage from voiding your protections, <strong>you must notify RHIVE in writing within 3 days of any work being performed on your roof.</strong> This includes solar installations, satellite mounts, skylights, chimney repointing, or hanging Christmas lights.
          </p>
          <p>
            Once notified, RHIVE will inspect within 45 days to verify that no shingles were torn or punctured, keeping your Lifetime Warranty active.
          </p>

          <h3 className="text-xl font-bold text-white tracking-tight">2. Mandatory Biennial Professional Inspections</h3>
          <p>
            While DIY ground checks are valuable, they do not replace a trained eye. To keep your warranty valid over the decades, <strong>RHIVE requires a professional system check every 24 months (biennially).</strong>
          </p>
          <ul className="list-disc pl-6 space-y-1 text-slate-400 text-sm">
            <li>These inspections are provided <strong>completely complimentary</strong> upon your request.</li>
            <li>We check sealants around pipe jacks, review chimney flashing, and verify ventilation.</li>
            <li>Inspections performed by other uncertified contractors do <strong>not</strong> satisfy this warranty requirement.</li>
          </ul>

          <h3 className="text-xl font-bold text-white tracking-tight">3. The 72-Hour Leak Notice Window</h3>
          <p>
            If you discover a leak, wind damage, or fallen branches on your roof deck, <strong>you must notify RHIVE in writing within 72 hours (3 days) of discovery.</strong> This allows our team immediate access to perform surgical repairs before rot spreads.
          </p>

          {/* CTA Area */}
          <div className="mt-12 p-8 bg-zinc-950 border border-white/10 rounded-md text-center">
            <h3 className="text-xl font-bold text-white mb-4">Secure Your Complementary System Inspection</h3>
            <p className="text-slate-400 text-sm mb-6 max-w-[50ch] mx-auto">
              If your roof is older (15+ years) or you need your mandatory biennial check, let our factory-certified team handle the heights safely.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/estimator"
                className="px-6 py-3 bg-[#ec028b] hover:bg-opacity-90 text-white font-bold text-base rounded shadow-pink-glow transition-all cursor-pointer"
              >
                Schedule Free Maintenance Check
              </a>
              <a
                href="tel:4534176637"
                className="px-6 py-3 bg-transparent border border-white/20 hover:border-white text-white font-bold text-base rounded transition-all cursor-pointer"
              >
                📞 Call Sandy Office
              </a>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDiyChecklistPage;
