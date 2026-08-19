export interface ComponentDetail {
    id: string;
    title: string;
    category: 'Gutters' | 'Ice Management' | 'Chimney' | 'Maintenance' | 'Repair' | 'Roof Details';
    description: string;
    guarantee: {
        installation: string;
        materials: string;
    };
    blueprint: string[];
    standard: string;
    options?: string[];
    optionDescriptions?: Record<string, string>;
    image?: string;
}

export const roofComponents: ComponentDetail[] = [
    {
        id: "architectural-seamless-gutter-systems",
        title: "ARCHITECTURAL SEAMLESS GUTTER SYSTEMS",
        category: "Gutters",
        description: "Complete water management systems engineered to exact architectural specifications. Featuring flawless seamless execution in K-Style, Round, and Box profiles, manufactured instantly on-site.",
        image: "/components/real_seamless_gutter_1773772866806.webp",
        guarantee: {
            installation: "10-Year Craftsmanship Warranty",
            materials: "20-Year Manufacturer Finish"
        },
        blueprint: [
            "System Calibrations: Roll-formed directly onto property boundaries.",
            "Hardware Security: Hidden industrial bracket mounting.",
            "Pitch Optimization: Precise geometric grade fall calculation.",
            "System Flashing: Fully integrated drip-edge interface.",
        ],
        standard: "RHIVE Quality Standard",
        options: [
            "5-Inch Modern K-Style (Residential)",
            "6-Inch Commercial K-Style",
            "5-Inch Designer Half-Round",
            "6-Inch Half-Round Max Flow",
            "5-Inch Minimalist Box Profile",
            "6-Inch Commercial Box",
        ],
        optionDescriptions: {
            "5-Inch Modern K-Style (Residential)": "Maximum Water Management and Aesthetic Value. This is RHIVE's standard gutter solution, engineered for optimal drainage and curb appeal. This seamless K-Style system provides high capacity for residential roof areas, protecting your foundation and landscaping while blending seamlessly with your fascia line.",
            "6-Inch Commercial K-Style": "Commercial Capacity & Ultimate Protection. This is RHIVE's high-capacity gutter solution, engineered specifically for large roof areas, complex drainage, and heavy rainfall zones. This seamless K-Style system features a 6-inch trough and large downspouts to manage maximum water volume, protecting structural integrity and foundation.",
            "5-Inch Designer Half-Round": "Modern Aesthetic & Efficient Flow. This is RHIVE's designer gutter solution, engineered for homes prioritizing a unique, European-style aesthetic. The semi-circular profile ensures highly efficient water flow and easy self-cleaning while providing a distinctive curb appeal.",
            "6-Inch Half-Round Max Flow": "Designer Capacity & Ultimate Flow. This is RHIVE's high-capacity, specialized gutter solution. The 6-inch semi-circular profile is engineered for large roof areas and commercial applications requiring both maximum drainage capacity and a distinct, modern architectural finish.",
            "5-Inch Minimalist Box Profile": "Clean Lines & Architectural Integration. This is RHIVE's standard architectural gutter solution, featuring a sleek, square/box profile ideal for contemporary or mid-century modern homes. This system integrates seamlessly with the roofline, providing efficient capacity with a minimal, deliberate aesthetic.",
            "6-Inch Commercial Box": "Architectural Capacity & Ultimate Integration. This is RHIVE's high-capacity architectural solution, engineered for commercial or high-end residential projects that demand maximum drainage capacity combined with an elite, contemporary box aesthetic.",
        }
    },
    {
        id: "heat-trace---ice-management-system",
        title: "HEAT TRACE - ICE MANAGEMENT SYSTEM",
        category: "Ice Management",
        description: "Proactive Ice Defense & Structural Protection. This system is engineered to actively prevent the formation of destructive ice dams and heavy icicles along your roof eaves and valleys. By maintaining a clear channel for water runoff, this solution eliminates moisture intrusion and protects the structural integrity of your roofline and gutters.",
        image: "/components/heat_trace_1773773528589.webp",
        guarantee: {
            installation: "RHIVE No-Fail System Guarantee - Covers the complete system installation, connectivity, and performance for 2 years (excluding failure due to power surge or damage from external forces).",
            materials: "10-Year Manufacturer Warranty on the cable element against mechanical failure."
        },
        blueprint: [
            "HEAT TRACE CABLE: High-efficiency, commercial-grade, self-regulating heat cable (5W per linear foot, 110V rated). This advanced technology automatically adjusts heat output based on the ambient temperature, ensuring maximum energy efficiency and safety.",
            "CONTROL SYSTEM: Includes a built-in thermostat that senses the required temperature range (typically 35°F to 45°F) and activates the system only when freezing conditions are present and precipitation is occurring, minimizing energy waste.",
            "INSTALLATION: The cable is installed using non-corrosive fasteners and clips (e.g., copper/aluminum clips) in a cascading pattern (or custom pattern) that extends from the gutter line up the roof edge and valleys, ensuring a clear path for meltwater.",
            "ELECTRICAL CONNECTIVITY: The system is connected to the nearest code-compliant, exterior outlet. Hard-wired connection to a dedicated junction box is provided only when explicitly added to the project scope.",
            "SYSTEM TESTING: Full electrical load and temperature activation testing is performed upon installation to verify the system's operational integrity.",
        ],
        standard: "RHIVE Quality Standard",
    },
    {
        id: "velux-daylight-skylight-systems",
        title: "VELUX® DAYLIGHT SKYLIGHT SYSTEMS",
        category: "Roof Details",
        description: "Complete integration of energy-efficient Velux® skylights or sun tunnels. We ensure perfect thermal sealing and watertight execution.",
        image: "/components/real_skylight_1773772893598.webp",
        guarantee: {
            installation: "Standard Guarantee applies.",
            materials: "Standard Warranty applies."
        },
        blueprint: [
            "System Detach: Safe removal of existing lighting unit.",
            "Flashing Integration: Three-layer stepped flashing system.",
            "Unit placement: High-impact resistant daylight system mount.",
            "Final Weatherproofing: Permanent thermal and moisture barrier.",
        ],
        standard: "RHIVE Quality Standard",
        options: [
            "Fixed Curb-Mounted Skylight",
            "Sun Tunnel® Complete Integration",
        ],
        optionDescriptions: {
            "Fixed Curb-Mounted Skylight": "Full System Replacement for Guaranteed Performance. This service provides a complete removal and replacement of an existing skylight. We install a brand new, energy-efficient Velux® fixed curb-mounted skylight and its integrated, three-layer flashing system, ensuring a leak-proof installation backed by the Velux 10-Year \"No Leak\" warranty. SKY_SM (Small): For units up to approx. 24\" x 38\" SKY_MD (Medium): For units up to approx. 30\" x 46\" SKY_LG (Large): For units up to approx. 46\" x 46\"",
            "Sun Tunnel® Complete Integration": "Full System Replacement for Natural Light Restoration. This service provides a complete removal and replacement of an existing sun tunnel. We install a new Velux® Sun Tunnel® system, including the high-impact dome, roof flashing, highly reflective light tunnel, and ceiling diffuser, restoring optimal natural light transmission to your interior spaces. STUNL_SM (Small): 10-Inch Diameter Tunnel STUNL_MD (Medium): 14-Inch Diameter Tunnel",
        }
    },
    {
        id: "architectural-metal-coping-services",
        title: "ARCHITECTURAL METAL COPING SERVICES",
        category: "Roof Details",
        description: "Precision flat roof parapet wall protection. We manage metal coping systems engineered to exceed the strictest high-wind manufacturer requirements.",
        image: "/components/coping_cap_1773773544079.webp",
        guarantee: {
            installation: "Standard Guarantee applies.",
            materials: "Standard Warranty applies."
        },
        blueprint: [
            "Continuous Metal Cleat System: Heavy-gauge galvanized steel anchor cleats are mechanically fastened to the top of the parapet wall, creating a secure, continuous anchor point for the coping cap.",
            "Custom-Fabricated Coping Cap: The coping cap is custom-fabricated from heavy-duty, 24-gauge coated steel and is designed with a snap-on profile that securely locks onto the cleat system, ensuring maximum resistance to wind uplift.",
            "Weatherproof Joint Assembly: Each joint between coping sections is protected by a concealed splice plate and sealed with a high-performance, UV-stable sealant, creating a monolithic, aesthetically clean, and fully weatherproof finish.",
        ],
        standard: "RHIVE Quality Standard",
        options: [
            "Complete New Installation",
            "Detach & Precision Reset",
            "Remove & Custom Replace",
        ],
        optionDescriptions: {
            "Complete New Installation": "Architectural Edge & Warranted Wind Protection. This is our premium, custom-fabricated 2-piece metal coping system, engineered to meet or exceed the strictest manufacturer requirements for high-wind warranties. This system provides superior, long-term defense against wind uplift and water intrusion at the most vulnerable area of a flat roof: the parapet wall.",
            "Detach & Precision Reset": "Preservation of Existing Components with an Enhanced Reinstallation. This service is performed when the existing metal coping caps are in good, serviceable condition. It includes the careful preservation of the original caps and a professional reinstallation that provides a more durable, weather-resistant attachment while maintaining the building's clean exterior aesthetic.",
            "Remove & Custom Replace": "Premium System Upgrade for Unserviceable Components. This service is performed when the existing metal coping caps are damaged, deteriorated, or otherwise unserviceable. It includes the complete disposal of the old components and the installation of our new, 2-piece architectural metal coping system, engineered for maximum wind resistance and a clean, warrantable finish.",
        }
    },
    {
        id: "solar-panel-management-protocol",
        title: "SOLAR PANEL MANAGEMENT PROTOCOL",
        category: "Roof Details",
        description: "Comprehensive coordination for solar panel systems during roof replacement, including safe detachment, storage, resetting, and panel cleaning.",
        image: "/components/solar_panel_1773773558067.webp",
        guarantee: {
            installation: "Service execution warranty applies.",
            materials: "Original solar system warranty maintained."
        },
        blueprint: [
            "System De-energization: Mandatory safety disconnect by certified electrician.",
            "Array Detachment & Storing: Safe systematic array removal.",
            "Reinstallation: Array resetting and precise recalibration.",
            "Network Re-energization: Full electrical and load testing.",
        ],
        standard: "RHIVE Quality Standard",
        options: [
            "Complete Detach & Reset",
            "System Cancellation / Retirement",
            "Solar Array Expert Cleaning",
            "Off-Site Conditioned Storage",
            "Electrical Reconnection Protocol",
        ],
        optionDescriptions: {
            "Complete Detach & Reset": "Safe & Coordinated Solar Panel Management. This is a comprehensive service to facilitate roofing work. Our certified team, in coordination with a licensed electrician, safely detaches your entire solar panel array and racking system, stages it securely on-site during the roofing project, and then professionally resets and reconnects the system once the new roof is complete.",
            "System Cancellation / Retirement": "This service includes the complete and permanent removal of a solar panel system from your roof. The process involves a licensed electrician safely de-energizing the system, followed by our crew removing all panels, racking, and hardware. All components are managed for proper disposal, with associated waste fees included. Note: The proper sealing of roof penetrations is addressed within the scope of the primary roof replacement.",
            "Solar Array Expert Cleaning": "Performance Restoration Service. We restore your solar panels' peak efficiency by professionally cleaning their surfaces. Using eco-friendly, non-abrasive cleaners and specialized tools, we gently remove all accumulated oxidation, dust, grime, and debris that obstruct sunlight, maximizing your system's energy production.",
            "Off-Site Conditioned Storage": "This line item covers the safe and secure staging and storage of your solar panels and racking OFF your property for the duration of the roofing project.",
            "Electrical Reconnection Protocol": "Crew Safety & Code Compliance. This is a mandatory safety service performed by a licensed electrician. To ensure the safety of our roofing crew, the electrician will de-energize your solar panel system at the inverter and all connection points before any roofing work begins. This service includes the re-energizing and functional testing of the system by the electrician upon completion of the roofing project. ELEC-DET-RES: For Residential solar systems. ELEC-DET-COM: For Commercial solar systems.",
        }
    },
    {
        id: "roofline-vegetation-management",
        title: "ROOFLINE VEGETATION MANAGEMENT",
        category: "Roof Details",
        description: "Strategic Structural Protection and Warranty Compliance. We safely cut and clear all vegetation (branches, vines, brush) that touches or overhangs your roof, fascia, or gutters. This service is a critical, proactive measure that stops the most common causes of premature roof failure.",
        image: "/components/vegetation_management_1773773572347.webp",
        guarantee: {
            installation: "Standard Guarantee applies.",
            materials: "Standard Warranty applies."
        },
        blueprint: [
            "We achieve system defense through two core actions:",
            "12-Inch Compliance Zone: We create a minimum 12-inch clearance zone by trimming intrusive vegetation. This is the structural standard necessary to protect your roof membrane from physical abrasion, prevent moisture retention, and keep your manufacturer warranty fully intact across all major brands.",
            "Debris & Water Stop: Eliminating overhang directly stops the continuous drop of leaves, pine needles, and sticks onto your roof, preventing debris accumulation that traps water and accelerates shingle degradation.",
            "This service is focused purely on cutting and structural clearance.",
            "VEGETATION REMOVAL: Precise removal of tree limbs, brush, and vines to achieve the 12-Inch Compliance Zone.",
            "DOCUMENTATION INSPECTION: We will document the condition of the roof surface underneath any previously obscured vegetation. If underlying damage (abrasion, rot, or moisture) is found, the project owner will be updated with clear photo evidence before any repair work is estimated.",
            "DEBRIS DISPOSAL: All cut vegetation, branches, and large trimming debris are responsibly disposed of.",
        ],
        standard: "RHIVE Quality Standard",
    },
    {
        id: "proactive-surface--drain-debris",
        title: "PROACTIVE SURFACE & DRAIN DEBRIS",
        category: "Maintenance",
        description: "Critical removal of bio-matter, leaves, and granular breakdown. Ensuring absolute unhindered water dispersal from roof plane to foundation outlet.",
        image: "/components/roof_debris_1773773622853.webp",
        guarantee: {
            installation: "Complete Flow Guarantee",
            materials: "Surface Scrape Prevention Limit"
        },
        blueprint: [
            "Warranty Compliance: The accumulation of debris is a leading cause of premature roof failure and can void manufacturer warranties. This service is a key step in protecting your investment and ensuring long-term system coverage.",
            "Pitched Roof Integrity (Asphalt Shingles): We eliminate debris that acts like a sponge, holding moisture against shingles and causing algae growth, granule loss, and underlying rot. Our process clears critical water-shedding channels, especially in valleys, to prevent water damming and protect the roof's structural integrity.",
            "Flat Roof Drainage (Commercial Membranes): We ensure positive drainage by clearing the entire field of the roof, with specific focus on drains, scuppers, and crickets. This prevents ponding water—the primary adversary of flat roofs—which leads to membrane degradation, seam failure, and structural load issues.",
            "Surface-Safe Methodology: All removal is performed using non-abrasive, manufacturer-approved methods (such as controlled air blowers and soft-bristled tools) to clear debris without damaging shingle granules or compromising the integrity of the roof membrane.",
            "SAFETY & ASSESSMENT: We begin by establishing a safe work zone and assessing the roof for any pre-existing conditions or hazards.",
            "BULK DEBRIS REMOVAL: All loose debris—including leaves, branches, dirt, and refuse—is systematically removed from the entire roof field. On pitched roofs, we work from the ridge down to ensure a complete clean.",
            "DETAIL CLEANING OF CRITICAL AREAS: We perform precision cleaning of all crucial drainage paths and vulnerable areas, including roof valleys, skylight perimeters, pipe penetrations, HVAC curbs, drains, and scuppers.",
            "DRAINAGE PATH VERIFICATION: After the roof surface is clear, we verify that gutters and downspout openings at the roofline are unobstructed to ensure a clear drainage path from the roof to the ground.",
            "FINAL INSPECTION & DISPOSAL: A final inspection confirms a clear roof. All resulting debris is then managed with care to ensure a clean site upon completion.",
        ],
        standard: "RHIVE Quality Standard",
        options: [
            "Roof Surface Debris Abatement",
            "Gutter & Downspout System Flush",
        ],
        optionDescriptions: {
            "Roof Surface Debris Abatement": "Proactive Maintenance for Peak Performance & Longevity. This is a critical maintenance service engineered to clear all organic and inorganic debris from the roof surface. By systematically removing materials that trap moisture, accelerate degradation, and obstruct drainage, we restore your roof's designed performance, prevent premature failure, and ensure compliance with manufacturer warranty requirements.",
            "Gutter & Downspout System Flush": "Essential Flow Restoration. This service is engineered to restore the full, intended water flow capacity of your gutter and downspout system. We eliminate blockages that cause overflow, preventing water damage to your fascia and foundation. This is a focused maintenance service to ensure your existing system drains effectively.",
        }
    },
    {
        id: "peripheral-component-protection",
        title: "PERIPHERAL COMPONENT PROTECTION",
        category: "Maintenance",
        description: "Targeted defense upgrades and seal maintenance for isolated vertical penetrations and high-risk zones, protecting against thermal shifts and local wildlife.",
        image: "/components/bird_deterrent_1773773610480.webp",
        guarantee: {
            installation: "Standard Guarantee applies.",
            materials: "Standard Warranty applies."
        },
        blueprint: [
            "Service Scope: Focused solely on the cleaning, inspection, and resealing of the existing pipe jack components. This service does not include removal, replacement, or shingle repair.",
            "Surface Preparation: Thorough cleaning and surface prep of the existing pipe boot and pipe to ensure maximum adherence of the new sealant. We remove old, cracked, or degraded sealants to expose a clean bonding surface.",
            "Corrosion Mitigation: For existing metal jacks, any minor surface oxidation is treated to stabilize the component before applying the new sealant.",
            "UV-Rated Sealant Application: Application of a high-performance, Clear UV-Rated Sealant around the base of the pipe collar. This flexible material creates a new, long-term, weather-tight barrier designed specifically to resist breakdown from UV rays and thermal cycling.",
            "System Check: Final inspection to ensure a smooth, contiguous seal has been achieved and to document the condition of the pipe jack and surrounding shingle field.",
        ],
        standard: "RHIVE Quality Standard",
        options: [
            "Pipe Flashing Ge-Cell Reseal",
            "Avian / Bird Deterrent Installation",
        ],
        optionDescriptions: {
            "Pipe Flashing Ge-Cell Reseal": "Proactive Leak Defense Extension. This targeted maintenance service is designed to extend the service life of your existing pipe flashings (pipe jacks/vents). We clean, inspect, and apply our superior clear UV-rated sealant to the vulnerable collar seal, eliminating minor degradation and postponing the need for a full, replacement.",
            "Avian / Bird Deterrent Installation": "Proactive Bird Damage Prevention. A durable, non-harmful barrier system installed to prevent birds from landing, roosting, and nesting in the quoted areas. This system provides critical defense by physically shielding shingles from pecking that can cause leaks and eliminating the buildup of corrosive, acidic droppings that degrade roofing materials.",
        }
    },
    {
        id: "targeted-system-penetration-repairs",
        title: "TARGETED SYSTEM PENETRATION REPAIRS",
        category: "Repair",
        description: "Surgical extraction and superior replacement of localized failed components. Ensures an airtight, watertight geometric seal around high-risk penetrations and storm-damaged fields.",
        image: "/components/shingle_repair_1773773637407.webp",
        guarantee: {
            installation: "Standard Guarantee applies.",
            materials: "Standard Warranty applies."
        },
        blueprint: [
            "Targeted Removal: A surgical removal of only the failed shingles and any compromised adjacent materials is performed to preserve the integrity of the surrounding roof plane.",
            "Material Sourcing & Color Variance Acknowledgment: We source the closest possible match for your existing shingles. However, an exact color match is impossible. This is due to the natural weathering and UV exposure of the existing shingles, combined with unavoidable variations in manufacturer dye lots. This initial color variance is a standard and unavoidable characteristic of any targeted roof repair.",
            "Integrated Weatherproof Bond: A monolithic, weatherproof bond is created through proper nailing and manual sealing, fully integrating the repair into the roof system to resist all future weather conditions.",
            "DAMAGE ASSESSMENT: We inspect the affected area to identify any potential underlying decking damage and define the precise scope required for a permanent repair.",
            "PRECISION INSTALLATION: New shingles are installed with the correct offset and exposure, secured with 6 nails per shingle for maximum wind resistance and system integrity.",
            "FINAL SEALING: A continuous bead of asphalt roof cement is applied to all new and disturbed shingle edges. This critical final step creates an immediate, permanent, water-tight bond that defends against both moisture intrusion and future wind uplift.",
        ],
        standard: "RHIVE Quality Standard",
        options: [
            "Shingle Field Repair & Integration",
            "Pipe Flashing Penetration Replacement",
        ],
        optionDescriptions: {
            "Shingle Field Repair & Integration": "Surgical Repair & Water-Shedding Integrity. This service provides a permanent solution for localized shingle damage. We surgically replace missing, cracked, or compromised shingles to restore your roof's critical water-shedding integrity and seamlessly integrate the repair with the existing roof structure.",
            "Pipe Flashing Penetration Replacement": "Critical Penetration Defense Upgrade. This specialized service focuses on replacing degraded pipe flashings (pipe jacks/vents) with high-performance components and sealing them with superior materials. We eliminate common leak points, ensuring a permanent, water-tight seal designed for extreme longevity.",
        }
    },
    {
        id: "rapid-response-leak-containment",
        title: "RAPID-RESPONSE LEAK CONTAINMENT",
        category: "Repair",
        description: "Immediate emergency interventions utilizing premium synthetic underlayment or thermal fusion to halt water progression before secondary structural damage occurs.",
        image: "/components/proarmor_tarp_realistic_1773797399505.webp",
        guarantee: {
            installation: "Standard Guarantee applies.",
            materials: "Standard Warranty applies."
        },
        blueprint: [
            "Service Scope: Focused entirely on immediate damage control for asphalt shingle systems. The typical minimum coverage area is approximately 30 square feet. This service provides temporary water shedding and does not include any permanent roof repairs or interior damage remediation.",
            "Response Goal: To eliminate active water intrusion and protect your home's structural and interior components until official repairs can begin.",
            "Strategic Underlayment Placement: We utilize high-performance synthetic roofing underlayment—a heavy-duty, UV-resistant material engineered to serve as a temporary tarp layer for up to 90 days. This material is strategically placed and lapped at the source of the identified leak.",
            "Precise Fastening: The underlayment is secured using plastic cap nails placed only in the damaged shingle area that will be fully removed and replaced during the final repair phase. This ensures we do not introduce unnecessary penetrations into undamaged roof sections.",
            "Leak Containment & Water Channeling: The material is strategically lapped with enough spacing to eliminate water intrusion at the identified leak point. It is installed to actively channel water away from the damaged area, guiding runoff toward existing gutter systems or safe disposal points.",
            "Service Scope: Focused entirely on immediate, surgical repair and containment of a localized membrane breach. This service provides a temporary, high-performance waterproof seal and does not include full membrane replacement or comprehensive system repair.",
            "Response Goal: To eliminate active water intrusion at the point of failure and protect the underlying structure and building contents.",
            "We deploy the optimal containment method based on the membrane condition and compatibility:",
            "Method 1: Fusion Heat-Welded Patch",
            "Process: A compatible membrane patch is placed over the compromised area. The failing membrane is cleaned and conditioned to be weldable, and the patch is fusion heat-welded to the existing system, creating the industry's highest standard temporary bond.",
            "Method 2: Adhered Patch with Weld Perimeter",
            "Process: A membrane patch is fully adhered to the failing area using a commercial adhesive (e.g., LV50 Quick Spray). The perimeter of the adhered patch is then fully heat-welded to create an additional layer of perimeter defense, ensuring maximum wind and water resistance.",
            "Method 3: Roll-On Sealant",
            "Process: For aged membranes that are not conducive to welding, the area is thoroughly cleaned and conditioned. A liquid flashing or specialized flexible roof sealant is then rolled onto the compromised area, creating a seamless, fully adhered, waterproof layer of defense.",
            "Minimal Footprint: The repair is limited to the immediate area required to stop the leak, ensuring minimal disruption to the existing field of the roof.",
        ],
        standard: "RHIVE Quality Standard",
        options: [
            "Steep Slope: Synthetic ProArmor Tarping",
            "Low Slope: Membrane Fusion Patch",
        ],
        optionDescriptions: {
            "Steep Slope: Synthetic ProArmor Tarping": "Immediate Defense: Critical Damage Containment. This is a rapid-response service engineered to provide an immediate, temporary seal against water infiltration caused by damage on pitched/asphalt shingle roofs (e.g., storm, debris, high wind blow-off). Our goal is to contain the damage and protect the interior structure while permanent repairs are being arranged.",
            "Low Slope: Membrane Fusion Patch": "Immediate Defense: Critical Membrane Containment. This is a rapid-response service engineered to provide an immediate, temporary, and robust seal against water infiltration caused by breaches in flat roof membranes (TPO, PVC, etc.). We use specialized membrane patches, adhesives, or sealants to protect the structural decking and interior until permanent repairs can be scheduled.",
        }
    },
    {
        id: "comprehensive-chimney-system-overhaul",
        title: "COMPREHENSIVE CHIMNEY SYSTEM OVERHAUL",
        category: "Chimney",
        description: "Engineering-grade restoration for structural, metal, and decorative chimney components. Eliminating complex water entry vectors with absolute certainty.",
        image: "/components/real_chimney_1773772853903.webp",
        guarantee: {
            installation: "Standard Guarantee applies.",
            materials: "Standard Warranty applies."
        },
        blueprint: [
            "Surface Grinding: All failed, cracked, or deteriorated mortar joints on the specified chimney faces are precisely ground out to a uniform depth, creating a clean, stable surface for new mortar.",
            "Professional Repointing: The joints are repointed with a high-strength mortar blend, tooled to create a dense, concave profile that promotes water shedding and ensures maximum durability.",
            "Curing & Sealing: After the new mortar has properly cured, we apply a professional-grade, breathable silane/siloxane masonry sealer to the entire brick surface. This final step provides a transparent, waterproof barrier that protects against water absorption and freeze-thaw cycles while allowing the chimney to breathe.",
        ],
        standard: "RHIVE Quality Standard",
        options: [
            "Masonry Brick Matrix Repointing",
            "Chase Pan Custom Metal Replacement",
            "Chase Pan High-Tech Edge Reseal",
            "Full Decorative Shroud Replacement",
            "Shroud Perimeter Flashing Reseal",
        ],
        optionDescriptions: {
            "Masonry Brick Matrix Repointing": "Structural Restoration & Waterproofing. This is a critical masonry repair that restores the structural integrity and weather resistance of your brick chimney. We address failing mortar joints to prevent water intrusion, which is the primary cause of brick spalling (flaking) and internal water damage.",
            "Chase Pan Custom Metal Replacement": "Permanent Water Diversion for Chimney Chases. This service provides a complete replacement of a failed or rusted metal chimney chase pan (the top cap), eliminating a common and critical leak point on modern chimney structures. A properly installed chase pan is the roof of your chimney, protecting the entire internal structure from water damage.",
            "Chase Pan High-Tech Edge Reseal": "Proactive Leak Defense for Chimney Tops. This is a critical maintenance service focused on resealing the most vulnerable penetration on your chimney chase pan: the storm collar around the flue pipe. We address failing sealant to prevent water from entering the chimney chase, protecting the internal structure from moisture damage and deterioration.",
            "Full Decorative Shroud Replacement": "Custom Architectural Upgrade & Permanent Protection. This service provides a full replacement of a damaged, rusted, or outdated decorative chimney shroud. We install a new, custom-fabricated shroud that enhances your home's curb appeal while providing a durable, long-lasting architectural finish.",
            "Shroud Perimeter Flashing Reseal": "Targeted Leak Prevention at the Chimney Shroud. This service addresses vulnerabilities at the base of your decorative chimney shroud where it meets the metal chase pan. We create a durable, waterproof seal to prevent water from infiltrating the chimney chase through fastener penetrations and the primary perimeter seam.",
        }
    },
];
