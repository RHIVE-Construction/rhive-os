import React, { useState, useMemo } from 'react';
import { Activity, Cpu, Zap, ArrowUpRight, Search, Home, ArrowRight, ChevronDown } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import GlobalBottomCTA from '../components/GlobalBottomCTA';

const maintenanceData = [
    {
        id: "ice-dams",
        name: "Roof Edges & Eaves (Ice Buildup)",
        description: "Heat escaping from the attic melts snow on the roof. The water runs down to the colder edges (eaves), refreezes into a block of ice, and causes water to pool and back up under the shingles, leading to interior leaks.",
        repair: [
        "Safely pull standing snow off the lower edges of the roof using a soft-edged roof rake to stop more water from melting into the ice block.",
        "Never use axes or sharp tools to chop the ice. Instead, place roof-safe ice-melt pucks (specifically calcium chloride, not standard driveway rock salt) inside old pantyhose and lay them across the ice to melt safe drainage channels.",
        "If water has already leaked inside, you'll need to temporarily cover the area with a tarp until the wood dries out and the protective waterproof rubber layer beneath the shingles (often called an Ice & Water shield) can be replaced.",
        "Check your attic for wet fluffy insulation and remove it immediately to prevent mold from spreading."
        ],
        maintenance: [
        "Check your attic insulation. Make sure it is thick enough (usually 14 to 18 inches deep) to keep the heat trapped inside your home instead of leaking up into the cold attic.",
        "Make sure the vents under your roof overhangs (the soffits) aren't blocked by fluffy insulation. Air needs a clear path to flow from the outside edges all the way up to the roof's peak.",
        "Seal any gaps around ceiling lights or attic access doors where warm indoor air might be escaping upward.",
        "As a backup defense, install commercial-grade heated wires (heat trace cables) along the roof edges and inside gutters to keep meltwater flowing."
        ]
    },
    {
        id: "snow-load",
        name: "Main Roof Beams & Structure (Sagging/Snow Load)",
        description: "Heavy, wet snow—especially in mountain towns and along the benches—places immense weight on a roof, occasionally leading to structural stress or sagging.",
        repair: [
        "Get out of the house immediately if you hear loud popping noises from the ceiling or if doors and windows suddenly become hard to open.",
        "Hire professional snow removal teams to safely shovel the roof. The weight must be removed evenly so the house doesn't shift dangerously to one side.",
        "Look inside the attic for any cracked wood beams, bowing support boards, or broken metal connection plates.",
        "Reinforce failing wood beams by attaching extra support boards directly alongside them (always consult a structural expert before attempting this)."
        ],
        maintenance: [
        "Don't wait for damage. Proactively clear your roof after you get about a foot of heavy, wet snow, or two feet of light, fluffy snow.",
        "Keep gutters and drainage paths clear so melting snow doesn't turn into a giant sponge on your roof, which adds massive weight.",
        "If you ever replace your roof, make sure the roofing company uses thick, heavy-duty wood boards (plywood) designed specifically for areas that get heavy snow."
        ]
    },
    {
        id: "freeze-thaw",
        name: "Shingles & Roof Surface (Cracking from Cold/Heat)",
        description: "Utah experiences rapid temperature swings. Moisture seeps into tiny cracks during the day, expands when it freezes at night, and destroys shingles and underlying roof materials.",
        repair: [
        "Find the cracked or out-of-place shingles. Carefully lift the sticky edge of the shingle above it using a flat metal tool (a pry bar).",
        "Pull out the old nails, slide the broken shingle out, and slide a new one in its place.",
        "Because it's cold, the sun won't heat up the new shingle enough to glue it down naturally. You must manually apply a dab of outdoor roofing glue (roofing cement) under the new shingle so the wind doesn't catch it."
        ],
        maintenance: [
        "Make sure water drains off your roof as fast as possible. If water pools in gutters or roof corners, it will freeze, expand, and break things.",
        "Check your roof once a year for 'nail pops'—this is when freezing and thawing physically pushes roofing nails up until they poke through the shingles."
        ]
    },
    {
        id: "chimney-masonry",
        name: "Chimneys (Cracked Brick, Mortar, or Concrete Cap)",
        description: "Chimneys endure extreme weather from all sides. Over time, the concrete cap (crown) on top cracks, and the cement paste (mortar) between the bricks crumbles away, letting water soak directly into your home's structure.",
        repair: [
        "For crumbling mortar between bricks, use a scraping tool to dig out the loose dust and re-pack the gaps with high-grade outdoor chimney cement.",
        "If the thick concrete cap on the very top of the chimney is cracked, fill the cracks with a flexible, weather-proof masonry sealant. Do not use standard window caulking.",
        "If the bricks themselves are flaking away or the chimney is visibly leaning, you must hire a professional mason to rebuild it to prevent a collapse."
        ],
        maintenance: [
        "Spray your entire chimney with a breathable, clear brick-and-masonry water repellent every 5 to 7 years. This stops the bricks from soaking up water and cracking when it freezes.",
        "Ensure you have a metal chimney cap installed over the actual exhaust pipes to keep rain, snow, and birds from falling straight down into your fireplace."
        ]
    },
    {
        id: "avalanche-damage",
        name: "Gutters & Lower Roof (Snow Slides)",
        description: "In high-elevation areas, heavy snow sliding off a pitched roof can rip off gutters, take shingles with it, or damage lower roof sections.",
        repair: [
        "After a major snow slide, check your gutters and any lower roof sections for bent metal or ripped shingles.",
        "Reattach hanging gutters using heavy-duty brackets (the metal clips that hold the gutter to the roof edge), making sure they still tilt slightly toward the drain pipes so water flows correctly.",
        "Replace any torn shingles and glue down the new ones with outdoor roofing glue.",
        "Check the plumbing pipes sticking out of your roof. Heavy sliding snow often bends or cracks these pipes at the base."
        ],
        maintenance: [
        "Install heavy-duty metal snow guards or snow fences continuously along the lower edges of your roof to break up the snow before it slides.",
        "Make sure those snow guards are screwed deep into the solid wood beams of the house, not just into the thin surface wood.",
        "Use a roof rake to pull down excessive snow before it gets heavy enough to trigger a roof avalanche."
        ]
    },
    {
        id: "uv-degradation",
        name: "Shingles (Dry, Brittle or Cracked from Sun)",
        description: "Utah's high altitude means intense UV rays. This bakes asphalt shingles, causing them to dry out, become brittle, and crack prematurely.",
        repair: [
        "Check how brittle the shingles are. If they crack loudly when you gently lift them, the roof is 'cooked' and likely needs to be completely replaced.",
        "For just one or two cracked shingles, cut a flat piece of metal (called flashing), slide it entirely underneath the crack, and glue it in place with outdoor roofing glue.",
        "Never drive a nail straight down through the top of a cracked shingle to hold it flat. That just creates a new hole that will definitely leak."
        ],
        maintenance: [
        "When it's time for a new roof, upgrade to 'rubberized' asphalt shingles. They are much more flexible and resist sun-baking far better than standard stiff shingles.",
        "Consider using top-tier shingles that are specifically built to withstand extreme weather and harsh sun.",
        "Never use a pressure washer to clean your roof. The intense water strips off the protective sandy coating that shields the shingle from the sun."
        ]
    },
    {
        id: "blistering",
        name: "Shingles (Bubbling or Blistering)",
        description: "When poor ventilation traps heat in the attic, the roof bakes from the inside out. This extreme heat causes the asphalt in the shingles to bubble and blister.",
        repair: [
        "Look for blisters that have 'popped' (where you can see the black, sticky core of the shingle). These are practically guaranteed to leak.",
        "Replace the popped shingles one by one. Be very gentle, because the surrounding shingles have also been baking and will be fragile.",
        "If you see a blister that hasn't popped yet, leave it alone! Popping it destroys the shingle's ability to shed water."
        ],
        maintenance: [
        "Balance the airflow in your attic. You want equal amounts of cool outside air entering at the bottom edges (the roof overhangs) and hot air exiting at the very top (the peak).",
        "Go into the attic and move any storage boxes or fluffy insulation that might be blocking the air vents along the edges of the roof.",
        "The best defense is a venting system that runs the entire length of your roof's peak, paired with clear vents under your roof overhangs to constantly flush out hot air."
        ]
    },
    {
        id: "granule-loss",
        name: "Shingles (Bald Spots or Sand Loss)",
        description: "The protective sandy granules on shingles wear off faster here due to the intense sun, hail, and sliding snow, stripping the shingle of its waterproofing and UV protection.",
        repair: [
        "Once the sandy granules are gone, they are gone for good. If you can see the shiny or dark fiberglass skeleton (the inner layer of the shingle), it must be replaced.",
        "Never try to 'paint', spray, or glue sand back onto a bald shingle. This traps moisture inside the roof and immediately voids all warranties."
        ],
        maintenance: [
        "Keep tree branches trimmed at least 6 to 8 feet away from your roof so they don't scrape across the shingles during a windstorm.",
        "If you need to clean moss off your roof, use a low-pressure chemical wash. Pressure washers will blast the protective sandy granules right off.",
        "Look at the bottom of your gutter drain pipes after a rainstorm. If you see a thick pile of sand, your shingles are failing and wearing away."
        ]
    },
    {
        id: "thermal-shock",
        name: "Flat Roofs (Torn or Splitting Rubber)",
        description: "Shifting from a 95-degree summer day to a 50-degree night causes roofing materials (especially flat roofs) to expand and shrink rapidly, eventually tearing the material.",
        repair: [
        "Find the split or tear. Clean the area thoroughly with a specialized liquid cleaner made specifically for rubber or flat roofs.",
        "Paint a chemical primer onto the area around the tear so the patch will stick permanently.",
        "Cut a patch of identical roofing material that is a few inches larger than the tear on all sides.",
        "Stick the patch down using heavy-duty roofing tape or adhesive, and press it flat using a heavy steel hand roller to get all the air bubbles out."
        ],
        maintenance: [
        "Paint flat roofs with a bright white, highly reflective, rubber-like coating. This bounces the sun's rays away and keeps the roof from getting dangerously hot.",
        "Make sure whoever installs your flat roof leaves a little bit of slack in the material at the edges so the building can naturally shrink and expand without ripping it."
        ]
    },
    {
        id: "wind-lift",
        name: "Shingles (Blown Off or Lifted by Wind)",
        description: "Strong canyon winds and downward bursts of wind lift shingles and break their glue bond. Even if the shingle stays on the roof, the wind will blow rain right underneath it.",
        repair: [
        "Look closely at the shingles. If you see a straight horizontal line where the sand is missing, the wind bent that shingle backward and broke its internal structural matting.",
        "Broken or 'creased' shingles must be replaced immediately.",
        "If a shingle lifted up but isn't broken, you can glue it back down yourself. Put three quarter-sized dabs of outdoor roofing glue under the edge and press down firmly."
        ],
        maintenance: [
        "Make sure any new roof is installed using the 'high wind' method, which uses six nails per shingle instead of the standard four.",
        "Ensure nails are driven precisely on the correct line. Nailing too high up on the shingle is the number one reason roofs blow off in a storm.",
        "Install a strip of metal edging (called drip edge) around the entire border of the roof to keep the wind from getting underneath the first row of shingles."
        ]
    },
    {
        id: "hail-damage",
        name: "Shingles & Metal Vents (Dents or Bruises)",
        description: "Summer thunderstorms frequently drop hail that bruises asphalt shingles, dents metal roofs, and cracks clay tiles.",
        repair: [
        "Use sidewalk chalk to mark the 'bruises' on the roof—these look like soft, dark thumbprints where the hail crushed the sandy granules into the shingle.",
        "Carefully remove and replace the bruised shingles, making sure they line up perfectly with the older shingles around them.",
        "For broken clay tiles, use a specialized hook tool (a tile ripper) to pull out the hidden nails, slide the broken pieces out, and glue a new tile into place."
        ],
        maintenance: [
        "Always check your roof after a hailstorm. Damage isn't always easy to see from the ground. A good trick is to look at metal roof vents—if they are dented, your shingles probably took a beating too.",
        "If you live in a hail-prone area, spend the extra money on top-tier 'impact-resistant' shingles or thick metal roofing that will bounce the hail off."
        ]
    },
    {
        id: "ponding-water",
        name: "Flat Roofs (Standing or Pooling Water)",
        description: "Flat or low-slope roofs often suffer from water pooling after heavy monsoon rains or rapid snowmelt. Standing water will break down roofing material very quickly.",
        repair: [
        "Use a push broom to sweep standing water off the roof immediately. This takes the heavy water weight off the structure.",
        "Once the roof is dry, look at the area that was underwater. If it feels squishy or the seams are peeling up, patch it using a flat-roof patching kit.",
        "Clear out any leaves or mud blocking the drains or the side-holes (scuppers) that let water shoot off the edge of the flat roof."
        ],
        maintenance: [
        "Even 'flat' roofs shouldn't be perfectly flat. They need a tiny slope to drain. If yours is totally flat, a roofer can install angled foam boards underneath the surface to create a slight slope.",
        "Make it a habit to clean off your flat roof drains twice a year. Make sure the little metal cages over the drains are attached so golf balls or big leaves don't clog your pipes."
        ]
    },
    {
        id: "ventilation",
        name: "Attic & Roof Vents (Mold or Stuffy Air)",
        description: "A silent killer of Utah roofs. Without airflow, heat builds up in the summer (ruining shingles) and moisture builds up in the winter (causing ice dams and mold).",
        repair: [
        "If you go into your attic and see black mold on the wood ceiling, hire a professional to clean and treat the wood safely.",
        "Have a roofer cut a slit along the very peak of your roof to install an exhaust vent (called a ridge vent) so hot air can escape.",
        "Install cheap foam air channels (called baffles) near the edges of the attic. These keep your fluffy insulation from blocking the fresh air coming in from outside."
        ],
        maintenance: [
        "Make sure your bathroom exhaust fans and clothing dryers blow air all the way out of the house. A lot of older homes just blow that wet air directly into the attic, causing massive mold issues.",
        "Make sure you have just as much air coming in at the bottom of the roof as you do going out at the top. If you have too many exhaust vents, your attic will actually suck the heating and AC right out of your living room."
        ]
    },
    {
        id: "clogged-gutters",
        name: "Gutters & Drain Pipes (Overflowing/Clogged)",
        description: "Fall leaves clog gutters. When spring snowmelt arrives, the water has nowhere to go, so it backs up into the wood trim of your house and rots the roof.",
        repair: [
        "Use a plastic scoop to dig out the wet, rotting leaves. Don't use a metal shovel, or you will scratch the protective paint inside the gutter and it will rust.",
        "Spray a hose down the drain pipes. If they are totally plugged, use a flexible metal drain-clearing tool (a plumber's snake) to pull the blockage out.",
        "Check the wooden boards directly behind the gutters (the fascia boards). If the wood is soft, crumbly, or looks like dark sponge, you need to cut out the rotten wood and replace it."
        ],
        maintenance: [
        "Invest in high-quality metal mesh gutter covers. They let water flow through but keep pine needles, leaves, and seed pods out.",
        "Clean your gutters twice a year: once in late fall after the trees are bare, and once in early spring before the heavy monsoon rains start."
        ]
    },
    {
        id: "failed-flashing",
        name: "Around Chimneys & Walls (Metal Flashing Leaks)",
        description: "Flashing is the flat metal used to seal the corners around chimneys and vents. Extreme weather can cause it to rust, warp, or pull away from the wall, creating a massive leak.",
        repair: [
        "Scrape away all the old, cracked sealant (caulking). Never just squeeze new caulking over old caulking—it won't stick and it will look terrible.",
        "If the metal itself is rusted through, you must pry up the shingles, pull the rusted metal out, and weave brand new, rust-proof metal back into the shingles.",
        "Apply a smooth, solid line of high-grade outdoor roof sealant (not basic bathroom caulk) along the top edge where the metal touches the brick or siding."
        ],
        maintenance: [
        "Walk your roof once a year and look closely at the metal around the chimney. Even the best caulking gets baked by the sun and shrinks away after about 5 to 7 years.",
        "Never trust black roofing tar to fix a leak around a chimney permanently. Always use custom-bent metal to do the job right."
        ]
    },
    {
        id: "leaky-valleys",
        name: "Roof Valleys (Where Two Slopes Meet)",
        description: "The 'V' shape where two parts of a roof meet is called a valley. It channels a massive amount of water. If leaves block it, water will pool and leak directly into your house.",
        repair: [
        "Keep the valley totally clear of leaves and pine needles so water can shoot down it like a waterslide.",
        "If the valley is leaking, it's usually because a roofer put a nail too close to the center crease. You have to pry up the shingles to find the bad nail hole.",
        "When fixing a valley, always stick a thick, waterproof rubber membrane directly onto the wood before laying down the new shingles."
        ],
        maintenance: [
        "Trim back any big trees that hang over your house so they stop dropping sticks and leaves directly into the roof valleys.",
        "Next time you replace your roof, ask for an 'open metal valley'. This means the valley is lined with smooth, visible metal instead of shingles. It flushes water and debris away much faster."
        ]
    },
    {
        id: "skylight-leaks",
        name: "Skylights (Leaking Around the Glass)",
        description: "Snow sits on the skylight glass, melts, and the water easily slips through the worn-out rubber seals around the metal frame.",
        repair: [
        "Clean off all the dirt and grime around the edges of the glass where it meets the metal frame.",
        "Apply a thick, solid line of extreme-weather outdoor silicone caulking that is specifically designed to stick to both glass and metal.",
        "If the leak is coming from underneath the metal frame (not the glass), the whole skylight usually has to be lifted up so the waterproof paper and metal around it can be rebuilt."
        ],
        maintenance: [
        "Look at the bottom edge of the skylight frame. You'll see tiny holes designed to let condensation drip out. Wipe these clean every year so they don't clog with dust.",
        "Keep in mind that most standard dome or glass skylights only last about 15 to 20 years. Once the factory seals inside them dry out and break, you just have to replace the whole unit."
        ]
    },
    {
        id: "failed-boots",
        name: "Plumbing Pipes on Roof (Pipe Jacks / Cracked Rubber Rings)",
        description: "The plumbing pipes sticking out of your roof are sealed with a piece of metal and a tight rubber collar (called a pipe boot or pipe jack). The sun dries out the rubber, it cracks, and water runs straight down the pipe into your ceiling.",
        repair: [
        "The easiest fix is to buy a slide-on rubber repair cover. You literally just slide a new rubber cover right over the old, broken one to create a fresh seal.",
        "If the metal base is totally rusted, you'll have to pry up the shingles, rip the old unit out, and weave a brand new heavy-duty cover back into the roof.",
        "Squeeze a little bit of outdoor silicone caulking around the very top edge where the rubber hugs the plastic pipe, just to be safe."
        ],
        maintenance: [
        "Go on your roof twice a year and look closely at the rubber rings around those pipes. If they look cracked, dry, or are pulling away from the pipe, they are going to leak soon.",
        "You can actually paint the rubber collar with outdoor, UV-resistant paint to protect it from the sun and make it last longer.",
        "When you get a new roof, pay a little extra for heavy-duty lead or thick plastic pipe covers. They last three times longer than cheap standard rubber."
        ]
    },
    {
        id: "pest-infestations",
        name: "Attic & Wood Trim (Animals or Pest Damage)",
        description: "Mice, raccoons, bats, and birds want to be warm during freezing winters. They will easily chew through soft, rotting wood to build a nest in your attic.",
        repair: [
        "Get the animals out humanely first (you usually need to call a wildlife removal expert). Do not trap the animals inside, or they will panic and chew through your ceiling to get out.",
        "Cut out and replace any rotting wood panels that the animals used to chew their way inside.",
        "Stuff small gaps (like around pipes) with steel wool, and then cover the steel wool with expanding spray foam. Mice cannot chew through steel."
        ],
        maintenance: [
        "Install heavy-duty metal wire mesh behind all the air vents on your house. This lets air in but keeps critters out.",
        "Cut back tree branches so they are at least 6 to 8 feet away from the roof. This takes away the 'bridge' that raccoons and squirrels use to get onto your house."
        ]
    },
    {
        id: "wood-rot",
        name: "Wood Beneath Shingles (Soft Spots / Wood Rot)",
        description: "Slow, hidden leaks from ice dams or cracked pipes cause the wood boards underneath your shingles (the roof deck) to rot like a wet sponge, creating dangerous soft spots you could step right through.",
        repair: [
        "Rip off the shingles and the black paper underneath until you expose solid, healthy wood in all directions.",
        "Set a power saw (circular saw) blade so it only cuts exactly as deep as the wood boards (usually about half an inch). If you cut too deep, you'll slice through the main structural beams of your house.",
        "Cut out the rotten wood in a square shape. Make sure the edges of your cut land directly on a wooden support beam so the new piece of wood has something solid to screw into.",
        "Screw down a new piece of wood (plywood), cover it with waterproof rubber paper (underlayment), and put new shingles on top."
        ],
        maintenance: [
        "Fix minor leaks the day you find them. Wood rot only happens when wood stays wet for a long time.",
        "During a heavy rainstorm, grab a flashlight and go into your attic. Look up at the wood ceiling and check for dark, wet stains.",
        "Make sure the protective paper under your shingles is made of modern synthetic material, rather than old-school black paper. Synthetic breathes better and doesn't tear as easily."
        ]
    },
    {
        id: "amateur-repairs",
        name: "Previous Roof Patches (Tar & Amateur Fixes)",
        description: "Using mismatched shingles, slathering black tar everywhere, or ignoring the real problem will fail during the next bad storm, and you'll end up paying a professional double to fix the mess.",
        repair: [
        "Look for black tar smeared directly over shingles. Tar is a terrible band-aid. It dries out, cracks, and actually traps water underneath it, causing wood rot.",
        "You have to completely scrape away the tar, rip out the ruined shingles underneath it, and get down to clean, dry wood.",
        "Properly install new waterproof paper, flat metal strips (flashing), and match the new shingles using the correct overlapping techniques so water naturally flows over them."
        ],
        maintenance: [
        "When fixing a roof yourself, rely on 'mechanical' fixes (like overlapping metal and shingles properly so water naturally slides down) rather than 'chemical' fixes (like squeezing a tube of caulk or black tar over a hole).",
        "Always read the manufacturer's instruction manual (you can find them all online) before nailing a shingle. If you put the nail in the wrong spot, the shingle will eventually fall off."
        ]
    },
    {
        id: "coping-cap",
        name: "Parapet Walls & Edges (Loose Coping Caps)",
        description: "Coping caps are the metal covers that sit on top of the short walls (parapet walls) surrounding flat roofs. They keep rain and snow from rotting the wall from the top down. High winds can loosen them, allowing water to pour directly inside the walls.",
        repair: [
        "Remove the loose metal cover and inspect the wood underneath. If it is soaking wet or crumbly, that wood must be cut out and replaced before putting the metal back.",
        "Apply a thick strip of waterproof rubber tape directly over the top of the wood to act as a backup barrier against water.",
        "Reattach the metal cover using specialized roofing screws with rubber washers built-in, rather than standard nails. Nails will eventually pull out as the metal heats up and expands.",
        "Seal the overlapping joints where two pieces of metal meet with a high-grade outdoor silicone caulking to stop sideways rain from blowing underneath."
        ],
        maintenance: [
        "Walk the outer edge of your flat roof twice a year. Push down on the metal covers—if they wiggle, rattle, or feel loose, they need to be tightened before the next windstorm rips them off.",
        "Check the caulking at the seams where the metal pieces connect. The sun bakes this caulking quickly, so it usually needs to be scraped off and reapplied every 5 to 7 years."
        ]
    },
    {
        id: "vinyl-siding",
        name: "Vinyl Siding (Cracks, Holes, or Melting)",
        description: "Vinyl siding can crack from hail, weed whackers, or extreme cold. It can also warp or melt if intense sunlight reflects off nearby energy-efficient windows.",
        repair: [
        "Find the broken panel. Use a specialized 'zip tool' to hook under the bottom edge of the siding piece directly above it and pull down to unlock it.",
        "Remove the nails holding the broken piece, slide a new matching piece in, and nail it loosely (do not nail it tight, it needs room to expand in the sun).",
        "Use the zip tool to pull the top piece back down and lock it over the new panel."
        ],
        maintenance: [
        "Wash vinyl siding once a year with a soft brush and mild soap.",
        "Never use a high-pressure power washer. High pressure blasts water upward behind the panels, soaking the wood underneath and causing hidden mold in your walls.",
        "Keep barbecue grills and space heaters at least 10 feet away from the house to prevent accidental melting."
        ]
    },
    {
        id: "wood-siding",
        name: "Wood & Hardie Siding (Rot, Peeling, or Cracks)",
        description: "Wood and fiber-cement siding add beauty but require constant upkeep. Moisture trapped behind the boards or failed paint leads to soft, rotting boards and peeling.",
        repair: [
        "Cut out the rotted or crumbling section of the board using an oscillating multi-tool.",
        "Treat any slightly soft but salvageable wood behind it with a liquid wood hardener to restore its strength.",
        "Install a new matching piece of siding, leaving a tiny gap at the edges for expansion.",
        "Fill the gaps with outdoor paintable caulking, and prime and paint the entire piece so water cannot penetrate the raw edges."
        ],
        maintenance: [
        "Inspect your house every spring. If you see peeling paint, scrape it off immediately, sand the area, and apply a fresh coat of exterior primer and paint.",
        "Make sure your lawn sprinklers are not spraying directly onto the side of your house. Constant daily soaking will rot wood siding in a single season."
        ]
    },
    {
        id: "stucco-siding",
        name: "Stucco Siding (Cracks, Chipping, or Water Stains)",
        description: "Stucco is a cement-based exterior finish. While durable, it can crack as the house naturally settles or shifts with extreme temperature changes. If water gets behind these cracks, it causes massive hidden wood rot inside your walls.",
        repair: [
        "For hairline cracks (thinner than a credit card), clean out the dirt and squeeze in a specialized flexible stucco caulking (elastomeric sealant). It acts like a rubber band so the crack won't reopen.",
        "For larger cracks or chunks that have fallen off, use a hammer and chisel to lightly chip away any loose, crumbling stucco until you hit solid material.",
        "Spread a pre-mixed stucco patching compound over the hole using a flat metal tool (a trowel), blending the edges so it matches the bumpy texture around it.",
        "Once the patch is totally dry, paint over it with specialized waterproof outdoor paint to lock the moisture out."
        ],
        maintenance: [
        "Walk around your house twice a year and look for new cracks, especially around the corners of windows and doors where the house shifts the most.",
        "Make sure your lawn sprinklers are absolutely never hitting the stucco. Constant soaking will break down the cement and cause huge, dark water stains.",
        "Keep dirt, mulch, and plants at least 4 to 6 inches below the bottom edge of the stucco. If dirt touches it, the stucco will act like a sponge and suck water straight up from the ground."
        ]
    },
    {
        id: "window-glass",
        name: "Window Glass (Foggy, Cloudy, or Condensation)",
        description: "Modern windows have two panes of glass with insulating gas trapped inside. When the rubber seal around the edge breaks, outside moisture gets sucked in, creating a permanent cloudy or foggy look.",
        repair: [
        "You usually cannot 'defog' a broken window seal with DIY sprays or wiping.",
        "The cheapest and most effective fix is to hire a glass company to replace just the 'Insulated Glass Unit' (the glass sandwich).",
        "This leaves your original window frame perfectly intact in the wall, saving you the massive cost of a full window replacement."
        ],
        maintenance: [
        "Keep the small drainage holes (weep holes) at the very bottom of your window tracks clean and clear of dead bugs and dirt.",
        "If water sits trapped in the bottom of the window frame after a rainstorm, it quickly rots out the rubber seals holding the glass together."
        ]
    },
    {
        id: "window-frames",
        name: "Window Frames & Edges (Drafts or Cracked Caulking)",
        description: "The seal between your window frame and the outside wall relies entirely on a bead of caulking. The sun bakes this caulking until it shrinks and cracks, letting freezing air and rain straight into your walls.",
        repair: [
        "Use a utility knife or a specialized caulking scraper to completely scrape out the old, dry caulking. Do not just squeeze new caulk over the old stuff.",
        "Clean the gap with rubbing alcohol to remove dust and oils.",
        "Apply a thick, continuous line of high-grade outdoor window-and-door sealant (silicone or polyurethane) around the entire frame.",
        "Smooth the caulking line with your finger dipped in soapy water for a perfect, professional seal."
        ],
        maintenance: [
        "Walk around the outside of your house every fall before the snow hits.",
        "Gently poke the caulking around your windows with your finger. If it feels hard as a rock, looks dried out, or is pulling away from the brick or siding, it's time to scrape it off and reapply."
        ]
    }
];

export default function MaintenancePage() {
    const { setActivePageId } = useNavigation();
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const filteredData = useMemo(() => {
        if (!searchTerm) return maintenanceData;
        const lower = searchTerm.toLowerCase();
        return maintenanceData.filter(item => 
            item.name.toLowerCase().includes(lower) || 
            item.description.toLowerCase().includes(lower)
        );
    }, [searchTerm]);

    return (
        <div className="flex flex-col relative pb-20 bg-black text-white min-h-screen w-full overflow-x-hidden font-sans">
            {/* Global Background Ambience */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-[50vw] h-[50vh] bg-rhive-pink blur-[150px] opacity-10 rounded-full mix-blend-screen transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-[50vw] h-[50vh] bg-rhive-blue blur-[150px] opacity-20 rounded-full mix-blend-screen transform translate-x-1/3 translate-y-1/3"></div>
            </div>

            {/* Top Navigation / Branding */}
            <nav className="relative z-20 border-b border-gray-900 bg-black/90 backdrop-blur-md px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black border border-gray-800 flex items-center justify-center transform rotate-45 group hover:border-rhive-pink transition-colors">
                        <div className="w-4 h-4 bg-rhive-pink transform -rotate-45 group-hover:scale-110 transition-transform"></div>
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-white leading-none">RHIVE</h1>
                        <p className="font-mono text-xs text-rhive-pink tracking-widest uppercase mt-1">Maintenance Protocol</p>
                    </div>
                </div>
                <div className="hidden md:flex gap-4 font-mono text-sm text-gray-500">
                    <span className="flex items-center gap-2"><Activity className="w-4 h-4 text-rhive-gold" /> SYSTEM_ONLINE</span>
                    <span className="flex items-center gap-2"><Cpu className="w-4 h-4 text-rhive-pink" /> EXPERT_MODE</span>
                </div>
            </nav>

            <main className="relative z-10 flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-10 flex flex-col">
                {/* Header Section */}
                <div className="mb-8 animate-fade-in-slow flex flex-col lg:flex-row gap-8 items-start justify-between">
                    <div className="flex-1">
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-6 text-white leading-tight">
                            Expert DIY <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-rhive-pink to-rhive-gold">Roofing & Exterior Protocols</span>
                        </h2>
                        <p className="text-gray-400 max-w-3xl text-xl md:text-2xl font-serif leading-relaxed">
                            Access internal logic modules for structural diagnostics and preservation. We provide the exact methodologies used by industry professionals to mitigate extreme weather degradation for roofs, siding, and windows.
                        </p>
                    </div>

                    {/* Service Agreements CTA Box */}
                    <div className="w-full lg:w-[400px] flex-shrink-0">
                        <div className="relative flex flex-col group isolate w-full bg-[#050505] border border-gray-800 p-6 shadow-[0_0_20px_rgba(236,2,139,0.05)] hover:shadow-[0_0_25px_rgba(236,2,139,0.15)] transition-all" style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}>
                            {/* Accent Line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rhive-pink to-rhive-gold"></div>
                            
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-rhive-gold/10 border border-rhive-gold/20 rounded-sm">
                                    <Zap className="w-5 h-5 text-rhive-gold" />
                                </div>
                                <h3 className="text-xl font-bold uppercase tracking-widest text-white">Bypass Manual Protocol</h3>
                            </div>
                            
                            <p className="text-gray-400 font-serif text-lg mb-6 leading-relaxed">
                                Skip the ladders and the hassle. Enroll in a RHIVE Service Agreement and let our specialists handle your property's continuous upkeep automatically.
                            </p>
                            
                            <a href="https://www.rhiveconstruction.com/agreements" target="_blank" rel="noopener noreferrer" className="relative w-full py-4 bg-gray-900 border border-gray-700 text-white font-bold uppercase tracking-widest text-sm hover:bg-rhive-pink hover:border-rhive-pink transition-all duration-300 flex items-center justify-center gap-2 group" style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}>
                                View Service Agreements <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Intelligent Search Bar */}
                <div className="mb-10 relative max-w-3xl w-full z-30 animate-fade-in-slow">
                    <div className="relative flex items-center group">
                        <Search className="absolute left-5 w-6 h-6 text-gray-500 group-focus-within:text-rhive-pink transition-colors" />
                        <input 
                            type="text" 
                            className="w-full pl-14 pr-6 py-5 bg-[#050505] border border-gray-800 text-white focus:outline-none focus:border-rhive-pink transition-colors font-sans text-lg md:text-xl shadow-[0_0_15px_rgba(236,2,139,0.05)] focus:shadow-[0_0_20px_rgba(236,2,139,0.2)]" 
                            style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                            placeholder="Search by roof, siding, or window part, symptom, or damage..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Accordion Container */}
                <div className="flex flex-col gap-4 max-w-5xl w-full mb-16">
                    {filteredData.map(item => (
                        <div key={item.id} className="border border-gray-800 bg-[#050505] p-4 cursor-pointer hover:border-rhive-pink/50 transition-colors" onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold">{item.name}</h3>
                                <ChevronDown className={`w-5 h-5 transition-transform ${expandedId === item.id ? 'rotate-180' : ''}`} />
                            </div>
                            {expandedId === item.id && (
                                <div className="mt-4 text-gray-400 font-serif">
                                    <p className="mb-4">{item.description}</p>
                                    <div className="mb-4">
                                        <h4 className="text-rhive-pink font-bold uppercase tracking-widest text-sm mb-2">Repair Protocol</h4>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {item.repair.map((r, i) => <li key={i}>{r}</li>)}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-rhive-gold font-bold uppercase tracking-widest text-sm mb-2">Maintenance Protocol</h4>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {item.maintenance.map((m, i) => <li key={i}>{m}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {filteredData.length === 0 && (
                        <p className="text-gray-500 italic">No matching protocols found.</p>
                    )}
                </div>

                {/* CTA Section */}
                <div className="mt-4 mb-10 w-full relative z-20">
                    <div className="relative flex flex-col group isolate max-w-5xl border border-gray-800 bg-black" style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)' }}>
                        <div className="text-center py-8 px-6">
                            <h3 className="text-3xl md:text-4xl font-bold uppercase mb-4 text-white">System Override Required?</h3>
                            <p className="text-gray-400 font-serif text-lg md:text-xl mb-8 max-w-2xl mx-auto">If the structural damage exceeds safe DIY parameters, initiate the RHIVE protocol. See what the RHIVE experience looks like and get numbers on your project today.</p>
                            
                            <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto" onSubmit={(e) => { e.preventDefault(); setActivePageId('P-12'); }}>
                                <div className="relative flex-grow">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Home className="h-6 w-6 text-gray-600" />
                                    </div>
                                    <input 
                                        type="text" 
                                        className="block w-full pl-12 pr-4 py-5 border border-gray-800 bg-black text-white focus:outline-none focus:ring-1 focus:ring-rhive-pink focus:border-rhive-pink transition-colors font-mono text-base md:text-lg" 
                                        placeholder="ENTER PROJECT ADDRESS..."
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    className="relative px-10 py-5 bg-rhive-pink text-white font-bold uppercase tracking-widest text-base md:text-lg hover:bg-[#c90275] transition-colors flex items-center justify-center gap-3 group shadow-[0_0_15px_rgba(236,2,139,0.3)] hover:shadow-[0_0_20px_rgba(236,2,139,0.5)]"
                                    style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                                >
                                    Initiate <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            {/* Global CTA */}
            <GlobalBottomCTA />
        </div>
    );
}
