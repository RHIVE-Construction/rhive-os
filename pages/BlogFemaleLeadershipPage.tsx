import React, { useEffect } from 'react';

const BlogFemaleLeadershipPage: React.FC = () => {
  useEffect(() => {
    document.title = "Women in Construction: Redefining Roofing | RHIVE";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'How female leadership is transforming Utah\'s roofing industry through radical price transparency, workforce empowerment, and deep community impact.');
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const campaigns = [
    {
      title: "🌸 June: Suicide Prevention Awareness",
      desc: "In honor of Kara's mother, a percentage of every roofing project during June is donated to suicide prevention organizations and crisis lines. We integrate crisis resource materials directly into our customer newsletters.",
    },
    {
      title: "🛠️ May: \"Own Your Tools\" Day",
      desc: "Coinciding with Home Improvement Month, we partner with local centers to host workshops for women, teaching construction basics, home repair, and tool safety to build real hands-on confidence.",
    },
    {
      title: "🎓 March: \"Building Her Future\" Scholarship",
      desc: "Launched during Women's History Month, this program provides academic and vocational scholarships to local women pursuing technical degrees, construction management, or trade certifications.",
    },
    {
      title: "💼 October: \"Build Her Legacy\" Grant",
      desc: "To celebrate National Women's Small Business Month, we award financial grants and provide professional mentorship to local family-owned startups focused on community development.",
    },
    {
      title: "🏡 Year-Round: Free Roofs for Heroes",
      desc: "Through community nomination channels, we gift complete, zero-cost roof replacements to local veterans, teachers, first responders, and families facing extreme hardship along the Wasatch Front.",
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
            Company Culture & Community
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Women in Construction: How Female Leadership is Transforming Utah's Roofing Industry
          </h1>
          <p className="text-slate-400 text-sm font-mono">Published: August 19, 2026 • 5 min read</p>
        </div>

        {/* Content Body */}
        <article className="space-y-8 text-base sm:text-lg text-slate-300 leading-relaxed max-w-[70ch] mx-auto">
          <p>
            For decades, the roofing and construction sectors have operated under a rigid, transactional status quo. Walk onto almost any active jobsite, and you will find an industry that is heavily male-dominated. But more than just demographic disparity, the traditional roofing business has long suffered from systemic cultural challenges: high-pressure sales tactics, opaque "mystery pricing," undervalued crews who cut corners, and a severe lack of consumer trust.
          </p>

          <p>
            At RHIVE Construction, we believe that the people who build our world deserve to be valued, and the homeowners who invest in their properties deserve absolute transparency.
          </p>

          <p>
            As a premier <strong>female-owned and operated roofing company</strong> based in South Jordan, Utah, we are not just installing shingle and flat membrane systems—we are actively redefining what leadership looks like in construction. Co-founded by <strong>Kara Robinson (President)</strong> and <strong>Michael Robinson (CEO)</strong>, RHIVE is fusing advanced AI-driven technology with an empathetic, people-first culture.
          </p>

          <p>
            Here is how female-driven leadership is shaking up the construction landscape, raising regional standards, and building a lasting legacy of hope across our Utah communities.
          </p>

          <hr className="border-white/10" />

          <h2 className="text-2xl font-bold text-white tracking-tight">1. Fostering a Culture Where "Our Hive" Matters</h2>

          <p>
            For Kara Robinson, the drive to build a different kind of construction company is deeply personal.
          </p>
          <p>
            In 2020, Kara lost her mother to suicide—a catastrophic loss that permanently shifted her perspective on life, business, and human connection. Before entering the roofing industry, Kara and her mother worked together in a corporate environment where they witnessed firsthand how easy it was for employees to feel unseen, overworked, and disconnected. Morale suffered because businesses treated people like numbers on a spreadsheet rather than human beings.
          </p>
          <p>
            When Kara founded RHIVE, she set out to honor her mother’s giving spirit by building a business rooted in compassion, safety, and respect.
          </p>
          <p>
            "Roofing, to me, represents more than just shingles and nails," Kara says. "It symbolizes protection, security, and the feeling of home—the very things my mother gave to me. 'Our Hive' is built on the belief that when employees and crews are genuinely valued and supported, they take immense pride in their craftsmanship. That pride is what ultimately delivers a superior, worry-free experience to our customers."
          </p>
          <p>
            At RHIVE, our employee-centric model prioritizes teamwork, professional growth, and physical safety:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-400 text-base">
            <li><strong>Certified Protection:</strong> All of our installers are certified professionals covered by comprehensive workers' compensation, ensuring safe and lawful worksites.</li>
            <li><strong>Empowered Crews:</strong> We pay our crews competitive, stable regional rates, completely rejecting the industry's standard practice of undercutting labor to inflate corporate margins.</li>
            <li><strong>Supportive Environments:</strong> We actively check in on our teams, creating an open-door culture where mental wellness is prioritized alongside physical safety on the roof deck.</li>
          </ul>

          <hr className="border-white/10" />

          <h2 className="text-2xl font-bold text-white tracking-tight">2. Challenging the Status Quo with Radical Transparency</h2>

          <p>
            Traditional construction companies often protect their margins by keeping customers in the dark. They hide administrative waste, sales commissions, and material markups inside single-number, opaque lump-sum bids.
          </p>
          <p>
            Under female leadership, RHIVE is using technology to strip away this legacy bloat and pass the savings directly back to you. Through our partnership with Qubit Turnkey, we operate as a remote-first, highly automated operation. We do not maintain physical warehouses or pay high-pressure salespeople.
          </p>
          <p>
            Because we have optimized our administrative costs to <strong>strictly under 10%</strong>, we can deliver premium, manufacturer-certified roof systems at a price point that makes uncertified, old-school contractors obsolete.
          </p>
          <p>
            Most importantly, we back this efficiency with <strong>complete cost transparency</strong>. Every single residential and commercial quote we deliver features a fully itemized mathematical breakdown:
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-slate-400 text-base">
            <li><strong>Exact Material Costs:</strong> Certified Owens Corning or GAF components.</li>
            <li><strong>Direct Crew Labor:</strong> Fair, competitive wages paid to our installers.</li>
            <li><strong>Lean Operating Overhead:</strong> Municipal permits, disposal fees, and our $2M liability protection.</li>
            <li><strong>Net Company Profit:</strong> Our exact margin, laid bare.</li>
          </ol>

          <hr className="border-white/10" />

          <h2 className="text-2xl font-bold text-white tracking-tight">3. Active Community Advocacy & Giving Back</h2>

          <p>
            At RHIVE, we believe a company must be larger than itself. We don't measure our success solely by annual revenue; we measure it by the positive, compounding impact we leave on the communities that support us.
          </p>
          <p>
            Through our structured community initiatives, we actively champion diversity, trade education, and mental health awareness across Utah and Idaho:
          </p>

          {/* Glowing cards for campaigns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            {campaigns.map((camp, idx) => (
              <div
                key={idx}
                className="p-6 bg-zinc-950 border border-white/10 rounded-md hover:border-[#ec028b]/40 hover:shadow-pink-glow transition-all duration-300"
              >
                <h3 className="text-lg font-bold text-white mb-2">{camp.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{camp.desc}</p>
              </div>
            ))}
          </div>

          <hr className="border-white/10" />

          <h2 className="text-2xl font-bold text-white tracking-tight">The New Standard of Roofing Excellence</h2>
          <p>
            We are proving that you do not have to choose between advanced technology, exceptional craftsmanship, and genuine human compassion. By combining automated precision with an employee-first culture and radical transparency, RHIVE is establishing the new national benchmark for customer satisfaction.
          </p>
          <p>
            When you choose RHIVE, you aren't just buying a roof with a <strong>Lifetime No-Leak Workmanship Guarantee</strong>. You are joining a movement that values honest labor, protects your home's equity, and reinvests in the community we all share.
          </p>

          {/* CTA Area */}
          <div className="mt-12 p-8 bg-zinc-950 border border-white/10 rounded-md text-center">
            <h3 className="text-xl font-bold text-white mb-4">Connect Directly with the Founders</h3>
            <p className="text-slate-400 text-sm mb-6 max-w-[50ch] mx-auto">
              Ready to experience a contractor built on clarity and empathy? Configure your quote online.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/estimator"
                className="px-6 py-3 bg-[#ec028b] hover:bg-opacity-90 text-white font-bold text-base rounded shadow-pink-glow transition-all cursor-pointer"
              >
                Configure Your Transparent Estimate
              </a>
              <a
                href="tel:4534176637"
                className="px-6 py-3 bg-transparent border border-white/20 hover:border-white text-white font-bold text-base rounded transition-all cursor-pointer"
              >
                📞 Call Our Founders
              </a>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogFemaleLeadershipPage;
