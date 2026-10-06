import React, { useEffect } from 'react';
import { BLOG_POSTS, BlogPost, getBlogPostBySlug } from '../data/blogData';

interface DynamicBlogPostPageProps {
  slug?: string;
}

export const DynamicBlogPostPage: React.FC<DynamicBlogPostPageProps> = ({ slug }) => {
  // If slug is not provided via prop, deduce it from window.location.pathname
  const effectiveSlug = slug || window.location.pathname.replace(/^\/blog\//, '').replace(/\/$/, '');
  const post: BlogPost | undefined = getBlogPostBySlug(effectiveSlug) || BLOG_POSTS.find(p => p.slug === effectiveSlug);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | RHIVE Construction Utah`;

      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', post.description);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = post.description;
        document.head.appendChild(meta);
      }

      // Inject Schema.org JSON-LD Structured Data for Article + FAQPage
      const schemaScriptId = `schema-blog-${post.slug}`;
      let scriptTag = document.getElementById(schemaScriptId) as HTMLScriptElement | null;
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = schemaScriptId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }

      const schemaData = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Article",
            "@id": `https://www.rhiveconstruction.com/blog/${post.slug}#article`,
            "isPartOf": {
              "@type": "WebSite",
              "@id": "https://www.rhiveconstruction.com/#website",
              "name": "RHIVE Construction",
              "url": "https://www.rhiveconstruction.com/"
            },
            "headline": post.title,
            "description": post.description,
            "image": post.image,
            "datePublished": post.publishedDate,
            "dateModified": post.modifiedDate,
            "author": {
              "@type": "Organization",
              "name": post.author.name,
              "url": "https://www.rhiveconstruction.com/"
            },
            "publisher": {
              "@type": "RoofingContractor",
              "name": "RHIVE Construction",
              "url": "https://www.rhiveconstruction.com/",
              "logo": {
                "@type": "ImageObject",
                "url": "https://i.imgur.com/t0VcSgJ.png"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://www.rhiveconstruction.com/blog/${post.slug}`
            }
          },
          {
            "@type": "FAQPage",
            "@id": `https://www.rhiveconstruction.com/blog/${post.slug}#faqpage`,
            "mainEntity": post.faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          },
          {
            "@type": "BreadcrumbList",
            "@id": `https://www.rhiveconstruction.com/blog/${post.slug}#breadcrumb`,
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.rhiveconstruction.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": "https://www.rhiveconstruction.com/blog"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": post.title,
                "item": `https://www.rhiveconstruction.com/blog/${post.slug}`
              }
            ]
          }
        ]
      };

      scriptTag.text = JSON.stringify(schemaData);

      return () => {
        const existingScript = document.getElementById(schemaScriptId);
        if (existingScript) existingScript.remove();
      };
    }
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white py-24 px-4 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Blog Article Not Found</h1>
        <p className="text-gray-400 mb-8">The requested article could not be located in our research vault.</p>
        <a href="/blog" className="px-6 py-3 bg-[#ec028b] text-white font-bold rounded hover:bg-[#ec028b]/80 transition">
          ← Return to Blog Index
        </a>
      </div>
    );
  }

  const formattedDate = new Date(post.publishedDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-400 font-mono">
          <a href="/" className="hover:text-[#ec028b] transition-colors">Home</a>
          <span>/</span>
          <a href="/blog" className="hover:text-[#ec028b] transition-colors">Blog</a>
          <span>/</span>
          <span className="text-gray-300 truncate max-w-xs sm:max-w-md">{post.category}</span>
        </div>

        {/* Back Link */}
        <div className="mb-8">
          <a
            href="/blog"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-[#ec028b] transition-colors bg-white/5 border border-white/10 px-4 py-2 rounded-full"
          >
            ← Back to Blog Index
          </a>
        </div>

        {/* Article Header */}
        <header className="mb-10 border-b border-white/10 pb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-[#ec028b]/20 border border-[#ec028b]/40 text-[#ec028b] text-xs font-bold uppercase tracking-wider rounded-sm">
              {post.category}
            </span>
            <span className="text-xs text-gray-400 font-mono">
              ⏱ {post.readTime}
            </span>
            <span className="text-xs text-gray-400 font-mono">
              📅 {formattedDate}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white via-slate-100 to-gray-300 bg-clip-text text-transparent leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="w-10 h-10 rounded-full bg-[#ec028b]/20 border border-[#ec028b]/40 flex items-center justify-center font-bold text-[#ec028b]">
              RH
            </div>
            <div>
              <p className="font-bold text-white">{post.author.name}</p>
              <p className="text-xs text-gray-400">{post.author.role} • RHIVE Construction Utah</p>
            </div>
          </div>
        </header>

        {/* AEO BLUF (Bottom Line Up Front) Highlight Box */}
        <div className="my-8 p-6 bg-gradient-to-br from-zinc-950 via-black to-zinc-900 border-2 border-[#ec028b] rounded-lg shadow-[0_0_25px_rgba(236,2,139,0.25)] relative overflow-hidden">
          <div className="absolute top-0 right-0 px-3 py-1 bg-[#ec028b] text-black text-[10px] font-black tracking-widest uppercase rounded-bl">
            AEO Direct Answer
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#ec028b]/20 text-[#ec028b] rounded-md border border-[#ec028b]/40 shrink-0 text-xl">
              ⚡
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#ec028b] mb-2 font-mono">
                Bottom Line Up Front (BLUF)
              </h3>
              <p className="text-base sm:text-lg text-white font-medium leading-relaxed">
                {post.bluf}
              </p>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.image && (
          <div className="my-8 rounded-lg overflow-hidden border border-white/10">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-64 sm:h-96 object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Content Sections */}
        <article className="space-y-10 text-base sm:text-lg text-gray-300 leading-relaxed">
          {post.content.map((section, idx) => (
            <section key={idx} className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight border-l-4 border-[#ec028b] pl-4 py-1">
                {section.sectionHeading}
              </h2>

              {/* Direct Answer for AEO Extraction */}
              {section.directAnswer && (
                <div className="p-4 bg-white/5 border border-white/10 rounded-md text-white font-medium text-base">
                  <span className="text-[#ec028b] font-bold mr-2">Key Takeaway:</span>
                  {section.directAnswer}
                </div>
              )}

              {/* Body Paragraphs */}
              {section.bodyParagraphs.map((para, pIdx) => (
                <p key={pIdx} className="text-gray-300 leading-relaxed">
                  {para}
                </p>
              ))}

              {/* Bullet Points */}
              {section.bulletPoints && section.bulletPoints.length > 0 && (
                <ul className="space-y-2.5 my-4 bg-zinc-950/80 p-5 rounded-md border border-white/10">
                  {section.bulletPoints.map((bp, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-3 text-sm sm:text-base text-gray-200">
                      <span className="text-[#ec028b] font-bold mt-0.5 shrink-0">✓</span>
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>

        {/* Utah Local Service Areas Block */}
        <div className="my-12 p-8 bg-zinc-950 border border-white/15 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">📍</span>
            <h3 className="text-xl font-bold text-white tracking-tight">
              RHIVE Construction Certified Utah Service Areas
            </h3>
          </div>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            RHIVE Construction provides comprehensive residential re-roofing, commercial single-ply membranes, rapid storm damage assessments, and emergency leak tarping across the Wasatch Front and surrounding mountain regions:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-6">
            <div className="p-3 bg-black/60 border border-white/10 rounded">
              <h4 className="font-bold text-[#ec028b] mb-1">Salt Lake County</h4>
              <p className="text-xs text-gray-400">Salt Lake City, South Jordan, Sandy, Draper, West Jordan, West Valley City, Herriman, Taylorsville, Midvale, Millcreek, Holladay, Kearns, Magna, Sugar House</p>
            </div>
            <div className="p-3 bg-black/60 border border-white/10 rounded">
              <h4 className="font-bold text-[#ec028b] mb-1">Davis & Weber Counties</h4>
              <p className="text-xs text-gray-400">Bountiful, Layton, Clearfield, North Salt Lake, Ogden</p>
            </div>
            <div className="p-3 bg-black/60 border border-white/10 rounded">
              <h4 className="font-bold text-[#ec028b] mb-1">Summit & Tooele Counties</h4>
              <p className="text-xs text-gray-400">Park City, Tooele, Heber Valley</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
            <div className="text-center sm:text-left">
              <p className="text-xs text-gray-400">Direct Contractor Phone Line</p>
              <a href="tel:4354176637" className="text-lg font-bold text-white hover:text-[#ec028b] transition-colors">
                📞 435-41-ROOFS (435-417-6637)
              </a>
            </div>
            <a
              href="/estimate-tool"
              className="px-6 py-2.5 bg-[#ec028b] hover:bg-[#ec028b]/80 text-white font-bold text-sm rounded transition-all shadow-[0_0_15px_rgba(236,2,139,0.4)]"
            >
              Get Instant Estimate →
            </a>
          </div>
        </div>

        {/* Interactive FAQ Section (Schema-Mapped) */}
        {post.faqs && post.faqs.length > 0 && (
          <section className="my-12 border-t border-white/10 pt-10">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#ec028b] font-mono">
                Frequently Asked Questions
              </span>
              <h3 className="text-2xl font-bold text-white tracking-tight mt-1">
                Got Questions? Here Are Direct Answers
              </h3>
            </div>
            <div className="space-y-4">
              {post.faqs.map((faq, fIdx) => (
                <div key={fIdx} className="p-5 bg-zinc-950 border border-white/10 rounded-md">
                  <h4 className="text-base font-bold text-white mb-2 flex items-start gap-2">
                    <span className="text-[#ec028b] font-mono font-bold">Q:</span>
                    <span>{faq.question}</span>
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed pl-6">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="my-8 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 font-mono mr-2">Tags:</span>
            {post.tags.map((tag, tIdx) => (
              <span key={tIdx} className="px-3 py-1 bg-white/5 border border-white/10 text-xs text-gray-300 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Call to Action Banner */}
        <div className="my-12 p-8 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-[#ec028b]/40 rounded-lg text-center relative overflow-hidden">
          <h3 className="text-2xl font-bold text-white mb-3">
            Ready to Finish On Top?
          </h3>
          <p className="text-sm text-gray-300 max-w-xl mx-auto mb-6">
            Get an itemized mathematical estimate with 100% full tear-off, rotted deck protection, and a Lifetime No-Leak Guarantee.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/estimate-tool"
              className="px-6 py-3 bg-[#ec028b] hover:bg-[#ec028b]/80 text-white font-bold rounded shadow-[0_0_15px_rgba(236,2,139,0.5)] transition-all"
            >
              Start 60-Second Ballpark Estimate
            </a>
            <a
              href="/zero-surprises-pricing"
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold rounded transition-all"
            >
              View Transparent Pricing Math
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicBlogPostPage;
