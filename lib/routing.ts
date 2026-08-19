// Maps clean URL pathnames to page IDs (SEO friendly)
export const PATH_TO_PAGE_MAP: Record<string, string> = {
    '/': 'P-00-V3',
    '/v2': 'P-00-V2',
    '/current-site': 'P-00a',
    '/web2': 'P-00b',
    '/about': 'P-01',
    '/services': 'P-02',
    '/services/asphalt-roofing': 'P-02a',
    '/services/asphalt-roofing/performance': 'P-02a-1',
    '/services/asphalt-roofing/flex': 'P-02a-2',
    '/services/asphalt-roofing/designer': 'P-02a-3',
    '/services/asphalt-roofing/premium': 'P-02a-4',
    '/services/asphalt-roofing/spec': 'P-02a-SPEC',
    '/scope-of-work': 'P-Scope',
    '/services/membrane-roofing': 'P-02b',
    '/services/membrane-roofing/tpo-60': 'P-02b-1',
    '/services/membrane-roofing/tpo-80': 'P-02b-2',
    '/services/membrane-roofing/pvc': 'P-02b-3',
    '/services/gutters': 'P-02c',
    '/services/ice-management': 'P-02d',
    '/services/roof-components': 'P-02e',
    '/process': 'P-03',
    '/financing': 'P-04',
    '/contact': 'P-05',
    '/login': 'P-06',
    '/reset-password': 'P-07',
    '/contractor-signup': 'P-09',
    '/careers': 'P-10',
    '/apply': 'P-11',
    '/estimate': 'P-12',
    '/insurance': 'P-13',
    '/maintenance': 'P-14',
    '/insurance-faq': 'P-15',
    '/landing': 'P-Landing',
    '/sign-verify': 'CUSTOMER-SIGN-VERIFY',
    '/map': 'INTERNAL-BPM',
    '/services/residential-roof-replacement': 'P-SEO-RESIDENTIAL',
    '/services/commercial-flat-roofing':     'P-SEO-COMMERCIAL',
    '/services/roofing-accessories':         'P-SEO-ACCESSORIES',
    '/zero-surprises-pricing':                'P-SEO-PRICING',
    '/service-areas/sandy-ut':               'P-SEO-SANDY',
    '/service-areas/west-jordan-ut':         'P-SEO-WESTJORDAN',
    '/service-areas/salt-lake-city-ut':      'P-SEO-SLC',
    '/faq':                                  'P-SEO-FAQ',
    '/blog':                                 'P-SEO-BLOG-INDEX',
    '/blog/roof-replacement-cost-utah':      'P-SEO-BLOG-1',
    '/blog/ice-dams-prevention-utah':        'P-SEO-BLOG-2',
    '/blog/roof-damage-insurance-claims-utah': 'P-SEO-BLOG-3',
    '/blog/owens-corning-vs-gaf-shingles-utah': 'P-SEO-BLOG-4',
    '/blog/tpo-vs-pvc-commercial-flat-roofing': 'P-SEO-BLOG-5',
    '/blog/diy-roof-checklist-utah':          'P-SEO-BLOG-6',
    '/blog/female-leadership-construction':   'P-SEO-BLOG-7',
    '/blog/seamless-gutters-importance-utah': 'P-SEO-BLOG-8',
    '/blog/solar-panels-roof-replacement-utah': 'P-SEO-BLOG-9',
    '/blog/how-to-choose-reputable-roofing-contractor-utah': 'P-SEO-BLOG-10',
};

// Maps page IDs to clean URL pathnames
export const PAGE_TO_PATH_MAP: Record<string, string> = {
    'P-00-V3': '/',
    'P-00': '/',
    'P-00-V2': '/v2',
    'P-00a': '/current-site',
    'P-00b': '/web2',
    'P-01': '/about',
    'P-02': '/services',
    'P-02a': '/services/asphalt-roofing',
    'P-02a-1': '/services/asphalt-roofing/performance',
    'P-02a-2': '/services/asphalt-roofing/flex',
    'P-02a-3': '/services/asphalt-roofing/designer',
    'P-02a-4': '/services/asphalt-roofing/premium',
    'P-02a-SPEC': '/services/asphalt-roofing/spec',
    'P-Scope': '/scope-of-work',
    'P-02b': '/services/membrane-roofing',
    'P-02b-1': '/services/membrane-roofing/tpo-60',
    'P-02b-2': '/services/membrane-roofing/tpo-80',
    'P-02b-3': '/services/membrane-roofing/pvc',
    'P-02c': '/services/gutters',
    'P-02d': '/services/ice-management',
    'P-02e': '/services/roof-components',
    'P-03': '/process',
    'P-04': '/financing',
    'P-05': '/contact',
    'P-06': '/login',
    'P-07': '/reset-password',
    'P-09': '/contractor-signup',
    'P-10': '/careers',
    'P-11': '/apply',
    'P-12': '/estimate',
    'P-13': '/insurance',
    'P-14': '/maintenance',
    'P-15': '/insurance-faq',
    'P-Landing': '/landing',
    'CUSTOMER-SIGN-VERIFY': '/sign-verify',
    'INTERNAL-BPM': '/map',
    'P-SEO-RESIDENTIAL': '/services/residential-roof-replacement',
    'P-SEO-COMMERCIAL':  '/services/commercial-flat-roofing',
    'P-SEO-ACCESSORIES': '/services/roofing-accessories',
    'P-SEO-PRICING':     '/zero-surprises-pricing',
    'P-SEO-SANDY':       '/service-areas/sandy-ut',
    'P-SEO-WESTJORDAN':  '/service-areas/west-jordan-ut',
    'P-SEO-SLC':         '/service-areas/salt-lake-city-ut',
    'P-SEO-FAQ':         '/faq',
    'P-SEO-BLOG-INDEX':  '/blog',
    'P-SEO-BLOG-1':      '/blog/roof-replacement-cost-utah',
    'P-SEO-BLOG-2':      '/blog/ice-dams-prevention-utah',
    'P-SEO-BLOG-3':      '/blog/roof-damage-insurance-claims-utah',
    'P-SEO-BLOG-4':      '/blog/owens-corning-vs-gaf-shingles-utah',
    'P-SEO-BLOG-5':      '/blog/tpo-vs-pvc-commercial-flat-roofing',
    'P-SEO-BLOG-6':      '/blog/diy-roof-checklist-utah',
    'P-SEO-BLOG-7':      '/blog/female-leadership-construction',
    'P-SEO-BLOG-8':      '/blog/seamless-gutters-importance-utah',
    'P-SEO-BLOG-9':      '/blog/solar-panels-roof-replacement-utah',
    'P-SEO-BLOG-10':     '/blog/how-to-choose-reputable-roofing-contractor-utah',
};

/** Convert page ID to its clean URL path or fallback portal path */
export const getPathForPageId = (pageId: string): string => {
    return PAGE_TO_PATH_MAP[pageId] || `/portal/${pageId}`;
};

/** Resolve current browser path and query params to a unique page ID */
export const getPageIdFromPath = (pathname: string, search: string): string => {
    // Normalize path by stripping trailing slash
    const cleanPath = pathname.replace(/\/$/, '') || '/';
    
    // 1. Direct path check
    if (PATH_TO_PAGE_MAP[cleanPath]) {
        return PATH_TO_PAGE_MAP[cleanPath];
    }
    
    // 2. Portal pages (/portal/PAGE_ID)
    const portalMatch = cleanPath.match(/^\/portal\/([A-Z0-9-]+)$/i);
    if (portalMatch) {
        return portalMatch[1].toUpperCase();
    }
    
    // 3. Fallback search query parameter (?page=PAGE_ID)
    const params = new URLSearchParams(search);
    const queryPage = params.get('page');
    if (queryPage) {
        return queryPage;
    }
    
    // 4. Default public homepage V3
    return 'P-00-V3';
};
