import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const indexHtmlPath = path.resolve(distDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.error('Error: dist/index.html does not exist. Run vite build first.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

// Commercial Metadata & Head Tags
const canonicalUrl = 'https://www.rhiveconstruction.com/services/commercial-flat-roofing';
const pageTitle = 'Utah Commercial Flat Roofing Contractors | TPO & PVC Systems | RHIVE Construction';
const pageDescription = 'Factory-certified commercial flat roofing contractors in Utah. Specializing in GAF EverGuard® TPO/PVC single-ply systems, 30-year NDL warranties, modified bitumen, and transparent RPSP pricing.';

// Replace Head Tags
let commercialHtml = baseHtml;

// Replace Title
commercialHtml = commercialHtml.replace(
  /<title>.*?<\/title>/i,
  `<title>${pageTitle}</title>`
);

// Replace Description
commercialHtml = commercialHtml.replace(
  /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
  `<meta name="description" content="${pageDescription}" />`
);

// Replace Canonical Link
commercialHtml = commercialHtml.replace(
  /<link\s+rel="canonical"\s+href=".*?"\s+id="canonical-link"\s*\/?>/i,
  `<link rel="canonical" href="${canonicalUrl}" id="canonical-link" />`
);
if (!commercialHtml.includes(canonicalUrl)) {
  commercialHtml = commercialHtml.replace(
    /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i,
    `<link rel="canonical" href="${canonicalUrl}" id="canonical-link" />`
  );
}

// Replace OpenGraph Tags
commercialHtml = commercialHtml.replace(
  /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
  `<meta property="og:title" content="Utah Commercial Flat Roofing Contractors | TPO & PVC Systems" />`
);
commercialHtml = commercialHtml.replace(
  /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i,
  `<meta property="og:url" content="${canonicalUrl}" />`
);
commercialHtml = commercialHtml.replace(
  /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
  `<meta property="og:description" content="${pageDescription}" />`
);

// Replace Entire JSON-LD with Pure Commercial Schema
const commercialJsonLd = `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RoofingContractor",
        "@id": "https://www.rhiveconstruction.com/services/commercial-flat-roofing#organization",
        "name": "RHIVE Construction - Commercial Division",
        "url": "https://www.rhiveconstruction.com/services/commercial-flat-roofing",
        "logo": "https://i.imgur.com/t0VcSgJ.png",
        "image": "https://www.rhiveconstruction.com/images/commercial-tpo-membrane-re-roof-layover-salt-lake-city-utah.webp",
        "telephone": "+1-801-449-1451",
        "email": "office@rhiveconstruction.com",
        "priceRange": "$$$",
        "currenciesAccepted": "USD",
        "paymentAccepted": "Cash, Check, Wire Transfer, Progress Billing, Net 30",
        "description": "Factory-certified commercial flat roofing contractors in Utah. Specializing in GAF EverGuard® TPO/PVC single-ply systems, 30-year NDL warranties, modified bitumen, and transparent RPSP pricing.",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "10437 Shady Plum Way",
          "addressLocality": "South Jordan",
          "addressRegion": "UT",
          "postalCode": "84009",
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 40.5621,
          "longitude": -111.9772
        },
        "areaServed": [
          {"@type": "AdministrativeArea", "name": "Salt Lake County"},
          {"@type": "AdministrativeArea", "name": "Utah County"},
          {"@type": "AdministrativeArea", "name": "Davis County"},
          {"@type": "AdministrativeArea", "name": "Weber County"},
          {"@type": "AdministrativeArea", "name": "Summit County"},
          {"@type": "AdministrativeArea", "name": "Wasatch County"},
          {"@type": "AdministrativeArea", "name": "Tooele County"}
        ]
      },
      {
        "@type": "Service",
        "@id": "https://www.rhiveconstruction.com/services/commercial-flat-roofing#service",
        "name": "Commercial Flat Roofing Contractors Utah",
        "provider": {
          "@id": "https://www.rhiveconstruction.com/services/commercial-flat-roofing#organization"
        },
        "description": "Factory-certified commercial flat roofing contractors in Utah. Specializing in GAF EverGuard® TPO/PVC single-ply systems, 30-year NDL warranties, and transparent RPSP pricing.",
        "serviceType": "Commercial Roofing, Flat Roofing, TPO Roofing, PVC Roofing, Industrial Roofing, Modified Bitumen"
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.rhiveconstruction.com/services/commercial-flat-roofing#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is a GAF No Dollar Limit (NDL) Warranty?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "An NDL Warranty is a premium commercial guarantee where GAF covers 100% of material and labor costs to repair any manufacturing or certified installation defect for up to 30 years with zero financial cap on payouts."
            }
          },
          {
            "@type": "Question",
            "name": "Can we install a TPO or PVC membrane over our existing commercial roof in Utah?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Under Utah building codes (IBC Chapter 15), a single-layer flat roof in dry, sound condition can receive a certified layover. RHIVE conducts core sampling and thermal infrared scans to verify structural qualification, saving tens of thousands in tear-off costs."
            }
          },
          {
            "@type": "Question",
            "name": "What is the primary operational difference between TPO and PVC membranes?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "TPO delivers superior thermal reflection and UV resistance for standard office and warehouse spaces. PVC contains plasticizers making it impervious to animal fats, kitchen grease exhaust, and industrial chemicals, essential for restaurants and processing plants."
            }
          },
          {
            "@type": "Question",
            "name": "How does RHIVE eliminate salesman markups on commercial projects?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We operate using AI-driven aerial diagnostic workflows and salaried technical project managers, eliminating the 10-15% commission paid to sales reps and returning those savings via transparent itemized pricing showing materials, labor, overhead, and profit."
            }
          }
        ]
      }
    ]
  }
  </script>`;

commercialHtml = commercialHtml.replace(
  /<script type="application\/ld\+json">[\s\S]*?<\/script>/i,
  commercialJsonLd
);

// 100% Commercial Semantic Body HTML (Replacing #root inner HTML for pre-render & SEO crawlers)
const commercialBodyContent = `
  <div id="root">
    <div style="font-family: 'Rubik', ui-monospace, sans-serif; background-color: #000000; color: #ffffff; min-height: 100vh; display: flex; flex-direction: column; justify-content: space-between; padding: 2.5rem 2rem; box-sizing: border-box; position: relative;">
      
      <!-- Top Status Header -->
      <header style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(236, 2, 139, 0.2); padding-bottom: 1rem; margin-bottom: 2rem;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <img src="https://i.imgur.com/t0VcSgJ.png" alt="RHIVE Construction Logo" style="height: 32px; width: auto; filter: drop-shadow(0 0 8px rgba(236, 2, 139, 0.6));" />
          <span style="font-weight: 800; letter-spacing: 0.1em; color: #ffffff;">RHIVE COMMERCIAL DIVISION</span>
        </div>
        <div style="color: #ec028b; font-size: 0.8rem; letter-spacing: 0.2em; font-weight: bold;">GAF COMMERCIAL CERTIFIED CONTRACTOR | UTAH &amp; IDAHO</div>
      </header>

      <!-- Main Semantic SEO Content Structure -->
      <main style="flex-grow: 1; max-width: 960px; margin: 0 auto; text-align: left; width: 100%;">
        <div style="display: inline-block; border: 1px solid rgba(236, 2, 139, 0.3); background: rgba(236, 2, 139, 0.1); padding: 0.35rem 1rem; border-radius: 9999px; margin-bottom: 1.25rem; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; color: #ffffff; text-transform: uppercase;">
          Single-Ply TPO &amp; PVC Flat Roofing Specialists
        </div>

        <h1 style="font-size: 2.5rem; font-weight: 900; text-transform: uppercase; color: #ffffff; margin-bottom: 1.25rem; letter-spacing: -0.02em; line-height: 1.15;">
          Utah Commercial Flat Roofing Contractors | TPO &amp; PVC Systems
        </h1>
        
        <p style="font-family: 'EB Garamond', serif; font-style: italic; font-size: 1.35rem; color: #e2ab49; margin-bottom: 2rem; line-height: 1.6; border-left: 3px solid #ec028b; padding-left: 1.25rem;">
          Engineering Superior Flat Roof Systems with Radical Cost Transparency, 30-Year NDL Warranties, and Zero Salesman Markup.
        </p>

        <p style="color: #d1d5db; font-size: 1rem; line-height: 1.7; margin-bottom: 2.5rem; font-family: 'EB Garamond', serif;">
          RHIVE Construction redefines commercial contracting across the Wasatch Front and Western United States. By eliminating physical warehouse bloat and sales commissions, we keep administrative overhead under 10% and pass direct capital efficiency back to property managers, facility directors, and commercial building owners.
        </p>

        <!-- Section 1: Single-Ply & Industrial Systems -->
        <section style="margin-bottom: 2.5rem;">
          <h2 style="font-size: 1.5rem; font-weight: 800; color: #ec028b; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.05em;">
            GAF EverGuard® Single-Ply &amp; Industrial Assemblies
          </h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); padding: 1.25rem; border-radius: 8px;">
              <h3 style="font-size: 1.1rem; font-weight: 700; color: #ffffff; margin-bottom: 0.5rem;">GAF EverGuard® TPO (60 &amp; 80 mil)</h3>
              <p style="color: #9ca3af; font-size: 0.85rem; line-height: 1.6;">Engineered for retail centers, distribution centers, and office parks. White Energy Star-rated reflective membrane lowers cooling loads; hot-air fusion-welded seams form a monolithic waterproof barrier certified up to 120 MPH wind uplift.</p>
            </div>
            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); padding: 1.25rem; border-radius: 8px;">
              <h3 style="font-size: 1.1rem; font-weight: 700; color: #e2ab49; margin-bottom: 0.5rem;">GAF EverGuard® PVC (60 &amp; 80 mil)</h3>
              <p style="color: #9ca3af; font-size: 0.85rem; line-height: 1.6;">Specially plasticized for commercial kitchens, restaurants, food processing plants, and manufacturing facilities requiring extreme resistance to animal fats, greases, jet fuel, and harsh chemical discharges.</p>
            </div>
            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); padding: 1.25rem; border-radius: 8px;">
              <h3 style="font-size: 1.1rem; font-weight: 700; color: #06b6d4; margin-bottom: 0.5rem;">Multi-Ply SBS Modified Bitumen</h3>
              <p style="color: #9ca3af; font-size: 0.85rem; line-height: 1.6;">Heavy-duty redundant waterproofing for intense rooftop foot traffic zones, mechanical equipment platforms, and chemical loading docks, available in low-odor cold adhesive and torch applications.</p>
            </div>
            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); padding: 1.25rem; border-radius: 8px;">
              <h3 style="font-size: 1.1rem; font-weight: 700; color: #ffffff; margin-bottom: 0.5rem;">Commercial Structural Metal</h3>
              <p style="color: #9ca3af; font-size: 0.85rem; line-height: 1.6;">24-gauge Galvalume® standing seam panels with 70% PVDF / Kynar 500® factory finishes for commercial architectural canopies, high-slope entries, and zero-maintenance corporate headquarters.</p>
            </div>
          </div>
        </section>

        <!-- Section 2: Code Layover Analysis -->
        <section style="margin-bottom: 2.5rem;">
          <h2 style="font-size: 1.5rem; font-weight: 800; color: #e2ab49; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.05em;">
            Utah Building Code (IBC Chapter 15) Tear-Off vs. Layover Analysis
          </h2>
          <p style="color: #9ca3af; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1rem;">
            Under active Utah commercial building codes (IBC Chapter 15), properties with a single existing membrane are permitted a certified commercial layover if non-destructive moisture verification confirms the insulation and decking are dry and structurally sound.
          </p>
          <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.1); padding: 1.25rem; border-radius: 8px; margin-bottom: 1.5rem;">
            <ul style="color: #d1d5db; font-size: 0.9rem; line-height: 1.8; margin: 0; padding-left: 1.25rem;">
              <li><strong>Certified Layover Protocol:</strong> Mechanically fastened or adhered over high-density DensDeck® cover boards, saving property owners tens of thousands in landfill fees while retaining 100% eligibility for 30-year GAF NDL warranties.</li>
              <li><strong>Full Tear-Off Protocol:</strong> Mandatory when two or more roofing layers exist or when infrared moisture scans reveal water saturation within existing insulation cores.</li>
            </ul>
          </div>
        </section>

        <!-- Section 3: Commercial Case Studies -->
        <section style="margin-bottom: 2.5rem;">
          <h2 style="font-size: 1.5rem; font-weight: 800; color: #06b6d4; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.05em;">
            Utah Commercial Project Case Studies
          </h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
            <div style="background: rgba(255, 255, 255, 0.02); border-left: 3px solid #ec028b; padding: 1rem;">
              <h3 style="font-size: 1rem; font-weight: 700; color: #ffffff;">Silicon Slopes Tech Campus (Lehi, UT)</h3>
              <p style="color: #9ca3af; font-size: 0.85rem; line-height: 1.5; margin-top: 0.25rem;">52,000 Sq Ft 80-mil TPO re-cover with R-30+ Polyiso upgrade; completed with zero tenant downtime during business hours; backed by 30-Year GAF NDL Guarantee.</p>
            </div>
            <div style="background: rgba(255, 255, 255, 0.02); border-left: 3px solid #e2ab49; padding: 1rem;">
              <h3 style="font-size: 1rem; font-weight: 700; color: #ffffff;">Industrial Logistics Center (West Valley City, UT)</h3>
              <p style="color: #9ca3af; font-size: 0.85rem; line-height: 1.5; margin-top: 0.25rem;">110,000 Sq Ft induction-welded TPO system engineered for 120 MPH wind uplift along the I-215 corridor with 24-ga Kynar perimeter coping.</p>
            </div>
            <div style="background: rgba(255, 255, 255, 0.02); border-left: 3px solid #06b6d4; padding: 1rem;">
              <h3 style="font-size: 1rem; font-weight: 700; color: #ffffff;">Restaurant &amp; Hospitality Center (Salt Lake City, UT)</h3>
              <p style="color: #9ca3af; font-size: 0.85rem; line-height: 1.5; margin-top: 0.25rem;">18,500 Sq Ft grease-resistant 60-mil GAF PVC membrane protecting roof deck from 14 kitchen hood exhaust units with zero chemical degradation.</p>
            </div>
          </div>
        </section>

        <!-- Section 4: Commercial FAQs -->
        <section style="margin-bottom: 2.5rem;">
          <h2 style="font-size: 1.5rem; font-weight: 800; color: #ffffff; margin-bottom: 1rem; text-transform: uppercase;">
            Commercial Roofing Technical FAQs
          </h2>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="background: rgba(255,255,255,0.02); border-left: 2px solid #ec028b; padding: 1rem;">
              <h3 style="font-size: 1rem; font-weight: 600; color: #ffffff; margin-bottom: 0.35rem;">What is a GAF No Dollar Limit (NDL) Warranty?</h3>
              <p style="color: #9ca3af; font-size: 0.85rem; line-height: 1.5;">An NDL Warranty is a premium commercial guarantee where GAF covers 100% of material and labor costs to repair any manufacturing or certified installation defect for up to 30 years with zero financial cap on payouts.</p>
            </div>
            <div style="background: rgba(255,255,255,0.02); border-left: 2px solid #ec028b; padding: 1rem;">
              <h3 style="font-size: 1rem; font-weight: 600; color: #ffffff; margin-bottom: 0.35rem;">Can we install a TPO or PVC membrane over our existing commercial roof in Utah?</h3>
              <p style="color: #9ca3af; font-size: 0.85rem; line-height: 1.5;">Under Utah building codes (IBC Chapter 15), a single-layer flat roof in dry, sound condition can receive a certified layover. RHIVE conducts core sampling and thermal infrared scans to verify structural qualification, saving tens of thousands in tear-off costs.</p>
            </div>
            <div style="background: rgba(255,255,255,0.02); border-left: 2px solid #ec028b; padding: 1rem;">
              <h3 style="font-size: 1rem; font-weight: 600; color: #ffffff; margin-bottom: 0.35rem;">What is the primary operational difference between TPO and PVC membranes?</h3>
              <p style="color: #9ca3af; font-size: 0.85rem; line-height: 1.5;">TPO delivers superior thermal reflection and UV resistance for standard office and warehouse spaces. PVC contains plasticizers making it impervious to animal fats, kitchen grease exhaust, and industrial chemicals, essential for restaurants and processing plants.</p>
            </div>
            <div style="background: rgba(255,255,255,0.02); border-left: 2px solid #ec028b; padding: 1rem;">
              <h3 style="font-size: 1rem; font-weight: 600; color: #ffffff; margin-bottom: 0.35rem;">How does RHIVE eliminate salesman markups on commercial projects?</h3>
              <p style="color: #9ca3af; font-size: 0.85rem; line-height: 1.5;">We operate using AI-driven aerial diagnostic workflows and salaried technical project managers, eliminating the 10-15% commission paid to sales reps and returning those savings via transparent itemized pricing showing materials, labor, overhead (<10%), and profit.</p>
            </div>
          </div>
        </section>

        <!-- Section 5: Regional Service Footprint & Corridors -->
        <section style="margin-bottom: 2.5rem;">
          <h2 style="font-size: 1.5rem; font-weight: 800; color: #06b6d4; margin-bottom: 1rem; text-transform: uppercase;">
            Utah Commercial Corridors &amp; Service Hubs
          </h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; color: #d1d5db; font-size: 0.85rem;">
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); padding: 1rem; border-radius: 6px;">
              <strong style="color: #ec028b; display: block; margin-bottom: 0.25rem;">Silicon Slopes Tech Corridor</strong>
              Lehi, Draper, Alpine, American Fork, Traverse Mountain tech hubs.
            </div>
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); padding: 1rem; border-radius: 6px;">
              <strong style="color: #e2ab49; display: block; margin-bottom: 0.25rem;">Salt Lake Metro Core</strong>
              Salt Lake City Downtown, South Jordan, Sandy, West Valley City, Murray.
            </div>
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); padding: 1rem; border-radius: 6px;">
              <strong style="color: #06b6d4; display: block; margin-bottom: 0.25rem;">I-15 Industrial Spine</strong>
              Business Depot Ogden (BDO), Clearfield Freeport, West Jordan logistics.
            </div>
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); padding: 1rem; border-radius: 6px;">
              <strong style="color: #ffffff; display: block; margin-bottom: 0.25rem;">High Elevation Commercial</strong>
              Park City Kimball Junction, Summit County, Heber Valley.
            </div>
          </div>
        </section>

      </main>

      <!-- Footer Navigation & Sitemap Crawl Links -->
      <footer style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 2rem; margin-top: auto; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1.5rem; font-size: 0.85rem; color: #9ca3af;">
        <nav style="display: flex; flex-wrap: wrap; gap: 0.75rem 1.25rem;">
          <a href="/" style="color: #ffffff; text-decoration: none; font-weight: 500;">Home</a>
          <a href="/services/residential-roof-replacement" style="color: #9ca3af; text-decoration: none;">Residential Roofing</a>
          <a href="/services/commercial-flat-roofing" style="color: #ec028b; text-decoration: none; font-weight: bold;">Commercial Flat Roofing</a>
          <a href="/services/roofing-accessories" style="color: #9ca3af; text-decoration: none;">Roofing Accessories &amp; Gutters</a>
          <a href="/zero-surprises-pricing" style="color: #9ca3af; text-decoration: none;">Zero Surprises Pricing</a>
          <a href="/estimate-tool" style="color: #9ca3af; text-decoration: none;">Instant Drone Estimator</a>
          <a href="/faq" style="color: #9ca3af; text-decoration: none;">FAQ &amp; Knowledge Base</a>
          <a href="/blog" style="color: #9ca3af; text-decoration: none;">Roofing Research &amp; Guides</a>
          <a href="/privacy" style="color: #6b7280; text-decoration: none;">Privacy Policy</a>
          <a href="/terms" style="color: #6b7280; text-decoration: none;">Terms of Service</a>
        </nav>
        <div style="font-weight: 500; color: #9ca3af;">
          Direct Office Dispatch: <a href="tel:8014491451" style="color: #ec028b; text-decoration: none; font-weight: bold;">(801) 449-1451</a>
        </div>
      </footer>

    </div>
  </div>
`;

// Replace <div id="root">...</div> in commercialHtml
commercialHtml = commercialHtml.replace(
  /<div id="root">[\s\S]*?<\/div>\s*<\/body>/i,
  `${commercialBodyContent}\n</body>`
);

// Targets to write:
// 1. dist/services/commercial-flat-roofing/index.html
// 2. dist/services/commercial-flat-roofing.html
// 3. dist/commercial-roofing/index.html
// 4. dist/commercial-roofing.html
const targetFiles = [
  path.resolve(distDir, 'services', 'commercial-flat-roofing', 'index.html'),
  path.resolve(distDir, 'services', 'commercial-flat-roofing.html'),
  path.resolve(distDir, 'commercial-roofing', 'index.html'),
  path.resolve(distDir, 'commercial-roofing.html')
];

targetFiles.forEach(file => {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(file, commercialHtml, 'utf-8');
  console.log(`Generated pre-rendered commercial page: ${path.relative(rootDir, file)}`);
});

console.log('✅ Commercial SEO Prerender Completed Successfully.');
