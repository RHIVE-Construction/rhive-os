import React, { useEffect } from 'react';

const BlogSolarPanelsPage: React.FC = () => {
  useEffect(() => {
    document.title = "Solar Panels & Roof Replacement Guide Utah | RHIVE";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Installing solar panels or replacing a roof? Learn about solar detach & reset, electrical disconnects, and protecting your lifetime warranty.');
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const timelineSteps = [
    {
      step: "01",
      title: "Electrical Disconnect & Safety",
      desc: "A licensed electrician de-energizes your solar system at the inverter and connection points before any tear-off. (ELEC-DET-RES for residential, ELEC-DET-COM for commercial)."
    },
    {
      step: "02",
      title: "Detachment & Staging",
      desc: "Our crews unbolt the photovoltaic modules, detach rails, and stage panels securely on-site (or off-site using SOLAR-PANEL-STORAGE for tight yards)."
    },
    {
      step: "03",
      title: "The Full Roof Replacement",
      desc: "We perform a full deck teardown, replacing rotted plywood, installing 6 feet of Owens Corning WeatherLock® ice/water barrier, and laying shingles."
    },
    {
      step: "04",
      title: "Reset & Re-Commissioning",
      desc: "We reinstall mounting brackets, rails, and panels. The electrician re-energizes connections and runs diagnostics to ensure peak output."
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
            Solar Integration Guide
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Solar Panels and Roof Replacement: The Ultimate Utah Integration Guide
          </h1>
          <p className="text-slate-400 text-sm font-mono">Published: August 19, 2026 • 6 min read</p>
        </div>

        {/* Content Body */}
        <article className="space-y-8 text-base sm:text-lg text-slate-300 leading-relaxed max-w-[70ch] mx-auto">
          <p>
            With over 300 days of sunshine a year, Utah is one of the fastest-growing solar energy markets in the country. Homeowners along the Wasatch Front are rapidly adopting solar panel systems to slash their monthly utility bills, gain energy independence, and reduce their carbon footprint.
          </p>

          <p>
            However, if your home has solar panels and your roof is approaching the end of its typical lifespan (15 to 25 years), you face a unique operational challenge. What happens when you need a roof replacement, but your shingles are covered by an active solar array?
          </p>

          <p>
            Many homeowners assume they can simply hire a standard, uncertified solar company or general contractor to tear around the panels. In reality, <strong>mismatched coordination between roofing and solar installers is a leading cause of early roof leaks and voided manufacturer warranties</strong>.
          </p>

          <p>
            At RHIVE Construction, we operate as a fully coordinated, tech-forward roof integrator. We provide complete, in-house <strong>Solar Panel Detach & Reset (D&R) services</strong> in partnership with licensed electricians. We ensure your solar system and your new roof are engineered to work together under a single, seamless umbrella of protection.
          </p>

          <p>
            Here is our expert guide to navigating <strong>solar panels and roof replacements in Utah</strong>.
          </p>

          <hr className="border-white/10" />

          <h2 className="text-2xl font-bold text-white tracking-tight">1. Why You Must Coordinate Your Solar Detach & Reset</h2>

          <p>
            You cannot install a new roof over existing solar brackets, nor can you safely perform a complete teardown of old shingles with the solar panels in place. The entire system—including the photovoltaic (PV) modules, racking rails, and mounting brackets—must be temporarily removed and then reinstalled.
          </p>

          <p>
            This process is highly technical and requires specialized mechanical and electrical standards:
          </p>

          {/* Timeline / Steps element */}
          <div className="space-y-6 my-8">
            {timelineSteps.map((item, idx) => (
              <div key={idx} className="flex gap-4 p-5 bg-zinc-950 border border-white/5 rounded-md hover:border-white/10 transition-colors">
                <span className="text-[#ec028b] font-mono font-bold text-lg">{item.step}</span>
                <div>
                  <h3 className="text-base font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <hr className="border-white/10" />

          <h2 className="text-2xl font-bold text-white tracking-tight">2. Maintaining Peak Efficiency: Professional Solar Panel Cleaning</h2>

          <p>
            While your solar panels are detached and staged on the ground, it is the absolute best time to address the buildup of regional dust, pollen, and oxidation.
          </p>
          <p>
            Over time, environmental grime acts as a physical barrier, blocking sunlight and reducing your solar system’s overall power output. RHIVE provides a specialized <strong>Solar Panel Performance Restoration Cleaning service</strong>:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-400 text-base">
            <li><strong>Safe Methodology:</strong> We utilize eco-friendly, non-abrasive cleaners and specialized, scratch-free tools to gently lift and wash away stubborn organic grime.</li>
            <li><strong>The Result:</strong> Maximizes your system’s solar absorption and immediately restores your panels to peak electrical efficiency upon their reset.</li>
          </ul>

          <hr className="border-white/10" />

          <h2 className="text-2xl font-bold text-white tracking-tight">3. Permanently Decommissioning: Solar System Cancellation</h2>

          <p>
            If you purchased a home with an old, non-functional, or outdated solar array that you no longer wish to maintain, we provide complete decommissioning services:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-400 text-base">
            <li><strong>System Cancellation (SOLAR-PANEL-CANCEL):</strong> Our licensed electrician safely de-energizes and detaches all electrical conduit lines.</li>
            <li><strong>Hardware Disposal:</strong> Our crew removes all panels, racking, and hardware, and we manage all municipal disposal and waste recycling fees.</li>
            <li><strong>Seamless Re-roofing:</strong> We patch all pre-existing lag-bolt penetrations in your wood deck during the teardown phase, ensuring your new roof is completely monolithic and watertight.</li>
          </ul>

          <hr className="border-white/10" />

          <h2 className="text-2xl font-bold text-white tracking-tight">4. Protecting Your Lifetime Warranty: The "Persons on Roof" Rule</h2>

          <p>
            If you have a new roof installed by RHIVE Construction, your home is secured by our direct <strong>Lifetime No-Leak Workmanship Guarantee</strong>. To prevent uncertified third parties from damaging your shingles and voiding your protection, your agreement is governed by the <strong>Persons on Roof Rule</strong>:
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-slate-400 text-base">
            <li><strong>3-Day Written Notification:</strong> Homeowners must promptly notify RHIVE in writing <strong>within 3 business days of any work being performed on the roof deck</strong>—including adding solar panels, repairing a chimney, or installing a satellite dish.</li>
            <li><strong>The Certification Check:</strong> Once notified, RHIVE will schedule a professional inspection <strong>within 45 days</strong> of the work.</li>
            <li><strong>Worry-Free Compliance:</strong> Our technician verifies that the third-party solar installers used compliant flashing mounts, did not introduce "shiners" or exposed nails, and did not mechanically damage the asphalt shingles—ensuring your Lifetime Warranty remains 100% active and valid.</li>
          </ol>
          <p>
            <em>Warning:</em> Homeowners should avoid roof traffic entirely. Walking on shingle fields, especially in extreme hot or cold temperatures, can loosen protective granules, cause mechanical damage, and immediately void your warranty.
          </p>

          {/* CTA Area */}
          <div className="mt-12 p-8 bg-zinc-950 border border-white/10 rounded-md text-center">
            <h3 className="text-xl font-bold text-white mb-4">Plan Your Solar-Integrated Replacement</h3>
            <p className="text-slate-400 text-sm mb-6 max-w-[50ch] mx-auto">
              Need a safe solar detach-and-reset to facilitate a reroof? Let Utah's tech-forward contracting experts manage the integration.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/estimator"
                className="px-6 py-3 bg-[#ec028b] hover:bg-opacity-90 text-white font-bold text-base rounded shadow-pink-glow transition-all cursor-pointer"
              >
                Configure Solar-Integrated Estimate
              </a>
              <a
                href="tel:4534176637"
                className="px-6 py-3 bg-transparent border border-white/20 hover:border-white text-white font-bold text-base rounded transition-all cursor-pointer"
              >
                📞 Click to Call Tech Office
              </a>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogSolarPanelsPage;
