import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

// Data for the interactive components
const rhiveSystemParts = [
    {
        name: 'O.C HIP AND RIDGE CAP',
        video: 'https://firebasestorage.googleapis.com/v0/b/video-qr-automator.firebasestorage.app/o/Website%20Media%20Assets%2FParts%20of%20Asphalt%20Roof%2FO.C_%20Hip%20and%20Ridge%20Cap.mp4?alt=media&token=0bfa938c-3a06-44ec-a78f-30671aaf3e3f',
        description: 'Shingles specifically designed to be installed on the hips and ridges of the roof, providing an extra layer of protection and a finished look.',
        packageInfo: 'OURHIVE installs manufacturer-approved hip and ridge cap shingles with a 130 mph wind resistance, designed for longevity and total system performance.',
    },
    {
        name: 'O.C. SKY RUNNER RIDGE VENT',
        video: 'https://firebasestorage.googleapis.com/v0/b/video-qr-automator.firebasestorage.app/o/Website%20Media%20Assets%2FParts%20of%20Asphalt%20Roof%2FO.C.%20SKY%20RUNNER%20RIDGE%20VENT.mp4?alt=media&token=65b17f9d-6685-467e-b125-9bf4c3a05da6',
        description: 'A system of vents that allows for proper airflow in the attic, helping to prevent heat and moisture buildup.',
        packageInfo: 'OURHIVE ensures manufacturer and building code compliance with soffit/deck mounted intake vents and ridge/hip vents for exhaust ventilation.',
    },
    {
        name: 'FIELD SHINGLES',
        video: 'https://firebasestorage.googleapis.com/v0/b/video-qr-automator.firebasestorage.app/o/Website%20Media%20Assets%2FParts%20of%20Asphalt%20Roof%2FCHOOSE%20YOUR%20SHINGLES.mp4?alt=media&token=83e09fa9-9838-4ad6-af76-ff01e440eefe',
        description: "The main shingles that cover the majority of the roof's surface.",
        packageInfo: 'OURHIVE\'s package includes "Performance: Flex: Designer: Premium Designer" shingles with a 130 mph wind rating and a 50-year lifetime warranty.',
        isLink: true,
        href: '/quote'
    },
    {
        name: 'DRIP METAL',
        video: 'https://firebasestorage.googleapis.com/v0/b/video-qr-automator.firebasestorage.app/o/Website%20Media%20Assets%2FParts%20of%20Asphalt%20Roof%2FDRIP%20METAL.mp4?alt=media&token=2ab78b80-2db5-452c-a029-45e27510d9ad',
        description: 'A metal flashing installed at the edges of the roof to prevent water from running down and damaging the fascia and siding.',
        packageInfo: 'OURHIVE installs a 28-gauge steel drip edge around the entire perimeter of the roof per manufacturer specifications.',
    },
    {
        name: 'FULL METAL PIPE FLASHINGS',
        video: 'https://firebasestorage.googleapis.com/v0/b/video-qr-automator.firebasestorage.app/o/Website%20Media%20Assets%2FParts%20of%20Asphalt%20Roof%2FFULL%20METAL%20PIPE%20FLASHINGS.mp4?alt=media&token=c2445f5b-1792-417d-a50d-64510471df34',
        description: 'Flashing materials that seal the areas around vent pipes to prevent leaks.',
        packageInfo: 'OURHIVE uses full metal pipe jacks for lifetime longevity, replacing all jackets, and sealing and painting them to prevent oxidation.',
    },
    {
        name: 'FULL METAL FLASHINGS',
        video: 'https://firebasestorage.googleapis.com/v0/b/video-qr-automator.firebasestorage.app/o/Website%20Media%20Assets%2FParts%20of%20Asphalt%20Roof%2FFULL%20METAL%20FLASHINGS.mp4?alt=media&token=9b49d1fa-8b00-4cc9-9483-a4141251be71',
        description: 'A metal material used to direct water away from critical areas of the roof, such as where the roof meets a wall.',
        packageInfo: 'OURHIVE uses 28-gauge steel flashing along the "roof to wall" areas as needed, including "L Metal" for headwalls and "Step Flashing" for sidewalls.',
    },
    {
        name: 'O.C. PRO ARMOR UNDERLAYMENT',
        video: 'https://firebasestorage.googleapis.com/v0/b/video-qr-automator.firebasestorage.app/o/Website%20Media%20Assets%2FParts%20of%20Asphalt%20Roof%2FO.C.%20PRO%20ARMOR%20UNDERLAYMENT.mp4?alt=media&token=30279028-2eb1-4f34-bdfa-6e8a21443f11',
        description: 'A synthetic barrier that acts as a water-shedding layer beneath the shingles.',
        packageInfo: 'OURHIVE installs a manufacturer-approved synthetic underlayment over the entire field of the roof not already covered by the ice and water shield.',
    },
    {
        name: 'O.C. STARTER STRIP+',
        video: 'https://firebasestorage.googleapis.com/v0/b/video-qr-automator.firebasestorage.app/o/Website%20Media%20Assets%2FParts%20of%20Asphalt%20Roof%2FO.C.%20STARTER%20STRIP%2B.mp4?alt=media&token=d360262a-8f8d-437d-a60d-fba1ae56ce94',
        description: 'A strip of shingles placed along the eaves and rakes to ensure a straight edge and a strong seal against high winds.',
        packageInfo: 'OURHIVE installs starter shingles on all eaves to provide a straight edge and an effective seal against wind uplift.',
    },
    {
        name: 'O.C. WEATHERLOCK ICE & WATER',
        video: 'https://firebasestorage.googleapis.com/v0/b/video-qr-automator.firebasestorage.app/o/Website%20Media%20Assets%2FParts%20of%20Asphalt%20Roof%2FO.C.%20WEATHERLOCK%20ICE%20%26%20WATER.mp4?alt=media&token=a4138b36-6dfc-4169-a2fe-8314fc99feac',
        description: 'A self-adhering, waterproof membrane that provides a critical secondary layer of protection in vulnerable areas of the roof.',
        packageInfo: 'OURHIVE installs a manufacturer-approved self-adhering waterproofing underlayment in key areas like valleys, pipe penetrations, and eaves (24 inches past the internal wall line) to comply with building codes.',
    },
    {
        name: 'O.C. INFLOW INTAKE VENT',
        video: 'https://firebasestorage.googleapis.com/v0/b/video-qr-automator.firebasestorage.app/o/Website%20Media%20Assets%2FParts%20of%20Asphalt%20Roof%2FO.C.%20INFLOW%20INTAKE%20VENT.mp4?alt=media&token=ae599d9c-2d2a-45c0-a62e-29ca3fd54f70',
        description: 'A system of vents that allows for proper airflow in the attic, helping to prevent heat and moisture buildup.',
        packageInfo: 'OURHIVE ensures manufacturer and building code compliance with soffit/deck mounted intake vents and ridge/hip vents for exhaust ventilation.',
    },
    {
        name: 'COMFORT',
        video: 'https://firebasestorage.googleapis.com/v0/b/video-qr-automator.firebasestorage.app/o/Website%20Media%20Assets%2FParts%20of%20Asphalt%20Roof%2Fcomfort.mp4?alt=media&token=c067cd0f-2246-4da9-a054-68117e391361',
        description: 'Attic insulation to improve your home\'s energy efficiency and comfort.',
        packageInfo: 'OURHIVE ensures proper insulation levels to maintain a comfortable temperature in your home and reduce energy costs.',
    },
];

export const InteractiveRoofAnatomy = () => {
    const defaultVideo = "https://firebasestorage.googleapis.com/v0/b/video-qr-automator.firebasestorage.app/o/Website%20Media%20Assets%2FParts%20of%20Asphalt%20Roof%2FDisplay.mp4?alt=media&token=89cf58bc-8ae3-4d2b-8cf5-09ec0b057f91";
    const [hoveredPart, setHoveredPart] = useState<(typeof rhiveSystemParts)[0] | null>(null);

    const currentVideo = hoveredPart ? hoveredPart.video : defaultVideo;
    const currentDescription = hoveredPart ? hoveredPart.description : "Hover over a component to explore the anatomy of a RHIVE roof system.";
    const currentPackageInfo = hoveredPart ? hoveredPart.packageInfo : "";
    const currentPartName = hoveredPart ? hoveredPart.name : "The RHIVE System";

    const PartButton: React.FC<{ part: (typeof rhiveSystemParts)[0] }> = ({ part }) => {
        const buttonContent = (
            <button
                onMouseEnter={() => setHoveredPart(part)}
                className="w-full text-left p-3 rounded-full border-2 border-primary text-primary font-semibold transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_20px_hsl(var(--primary))] focus:bg-primary focus:text-primary-foreground focus:shadow-[0_0_20px_hsl(var(--primary))]"
            >
                {part.name === 'FIELD SHINGLES' ? 'CHOOSE YOUR SHINGLES' : part.name}
            </button>
        );

        if (part.isLink && part.href) {
            return <a href={part.href} className="block w-full">{buttonContent}</a>;
        }

        return buttonContent;
    };

    return (
        <section className="relative w-full py-24 bg-black select-none">
            <div className="max-w-[1400px] mx-auto px-4 relative z-10 flex flex-col items-center">
                <Card className="bg-transparent backdrop-blur-sm border-none shadow-none mt-12 w-full max-w-[1400px]">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-bold tracking-tighter sm:text-4xl text-white drop-shadow-[0_0_10px_hsl(var(--primary))]">
                            THE RHIVE SYSTEM
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-stretch">
                            <div className="md:order-1 md:col-span-3 flex flex-col">
                                <div className="relative w-full rounded-lg overflow-hidden border-2 border-primary shadow-[0_0_40px_-10px_hsl(var(--primary))] bg-black">
                                    {/* Base video to maintain dimensions */}
                                    <video
                                        src={defaultVideo}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className={`w-full h-auto max-h-[60vh] object-contain p-6 transition-opacity duration-500 ease-in-out ${currentVideo === defaultVideo ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                                    />
                                    {/* Overlay videos */}
                                    {rhiveSystemParts.map(part => (
                                        <video
                                            key={part.name}
                                            src={part.video}
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                            className={`absolute inset-0 w-full h-full object-contain p-6 transition-opacity duration-500 ease-in-out ${currentVideo === part.video ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'}`}
                                        />
                                    ))}
                                </div>
                                <div className="flex-grow mt-4">
                                    <h3 className="text-2xl font-bold text-primary drop-shadow-[0_0_10px_hsl(var(--primary))]">
                                        {currentPartName}
                                    </h3>
                                    {hoveredPart ? (
                                        <div className="mt-4 p-4 rounded-lg border-2 border-primary/50 text-left">
                                            <p className="text-base text-muted-foreground">{currentDescription}</p>
                                            {currentPackageInfo && <p className="text-base mt-2 text-primary-foreground"><strong className="text-primary">OURHIVE Package Includes:</strong> {currentPackageInfo}</p>}
                                        </div>
                                    ) : (
                                        <div className="mt-4 p-4 rounded-lg border-2 border-primary/50 text-left flex flex-col justify-center">
                                            <p className="text-muted-foreground font-semibold flex items-center gap-2"><Info className="h-5 w-5"/> {currentDescription}</p>
                                            <p className="text-base text-muted-foreground/50 mt-2">Engineered for Performance. Installed with Purpose. Guaranteed for Life.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="md:order-2 md:col-span-2 space-y-2 max-h-[70vh] overflow-y-auto pr-2" onMouseLeave={() => setHoveredPart(null)}>
                                {rhiveSystemParts.map(part => <PartButton key={part.name} part={part} />)}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
};

export default InteractiveRoofAnatomy;
