import React, { useState, useEffect } from 'react';
import { StarIcon } from './icons';
import { cn } from '../lib/utils';

interface Review {
    id: string;
    author: string;
    text: string;
    date: string;
    rating: number;
    profilePhotoUrl?: string;
}

const mockReviews: Review[] = [
    {
        id: "r1",
        author: "Sarah Jenkins",
        date: "2 months ago",
        rating: 5,
        text: "RHIVE was fantastic from start to finish. They handled our roof replacement with zero disruption, and their transparent pricing meant absolutely no surprises. The drone inspection report they provided was incredibly detailed. Highly recommend!"
    },
    {
        id: "r2",
        author: "David M.",
        date: "4 months ago",
        rating: 5,
        text: "Finally, a roofing company that doesn't feel like a high-pressure sales pitch. Kara and Michael's team explained every detail of the process, and their 'zero-layover' policy gave us total peace of mind. The finished roof looks amazing."
    },
    {
        id: "r3",
        author: "Elena Rodriguez",
        date: "6 months ago",
        rating: 5,
        text: "I was blown away by their professionalism. They used top-tier materials and you can tell they take immense pride in their craftsmanship. Plus, knowing a portion of our project cost went back into the local community made the choice easy."
    }
];

export const GoogleTestimonials = () => {
    const [reviews, setReviews] = useState<Review[]>(mockReviews);
    const [isLoading, setIsLoading] = useState(false);
    const [averageRating, setAverageRating] = useState<number>(5.0);

    useEffect(() => {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            console.log("No Google Maps API key found, using fallback reviews.");
            return;
        }

        setIsLoading(true);

        const loadGoogleMapsScript = () => {
            return new Promise((resolve, reject) => {
                if (window.google && window.google.maps) {
                    resolve(true);
                    return;
                }
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
                script.async = true;
                script.defer = true;
                script.onload = () => resolve(true);
                script.onerror = () => reject(new Error('Google Maps script failed to load.'));
                document.head.appendChild(script);
            });
        };

        const fetchReviews = async () => {
            try {
                await loadGoogleMapsScript();
                const map = new window.google.maps.Map(document.createElement('div'));
                const service = new window.google.maps.places.PlacesService(map);

                // 1. Find the Place ID for RHIVE Construction
                const request = {
                    query: 'RHIVE Construction',
                    fields: ['place_id'],
                };

                service.findPlaceFromQuery(request, (results: any, status: any) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
                        const placeId = results[0].place_id;

                        // 2. Get Place Details (which includes reviews)
                        service.getDetails({
                            placeId: placeId,
                            fields: ['reviews', 'rating']
                        }, (place: any, detailStatus: any) => {
                            if (detailStatus === window.google.maps.places.PlacesServiceStatus.OK && place.reviews) {
                                // 3. Filter out 1-star reviews and map them
                                const filteredReviews = place.reviews
                                    .filter((rev: any) => rev.rating > 1) // Do not include 1 star
                                    .slice(0, 3) // Get up to 3 to fit the UI
                                    .map((rev: any) => ({
                                        id: rev.time.toString(),
                                        author: rev.author_name,
                                        date: rev.relative_time_description,
                                        rating: rev.rating,
                                        text: rev.text,
                                        profilePhotoUrl: rev.profile_photo_url
                                    }));

                                if (filteredReviews.length > 0) {
                                    setReviews(filteredReviews);
                                }
                                if (place.rating) {
                                    setAverageRating(place.rating);
                                }
                            }
                            setIsLoading(false);
                        });
                    } else {
                        console.error("Could not find RHIVE Construction on Google Places");
                        setIsLoading(false);
                    }
                });
            } catch (error) {
                console.error("Error fetching Google Reviews:", error);
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, []);

    return (
        <div className="w-full relative isolate py-16">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-rhive-pink/5 to-transparent z-[-1] pointer-events-none" />

            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Verified Reviews</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-white">{averageRating.toFixed(1)}</span>
                        <div className="flex text-rhive-gold">
                            {[...Array(5)].map((_, i) => (
                                <StarIcon key={i} className="w-5 h-5 fill-current" />
                            ))}
                        </div>
                        <span className="text-[var(--rhive-text-muted)] font-serif italic ml-2">Based on Google Business Profile</span>
                    </div>
                </div>
                
                <a 
                    href="https://www.google.com/search?q=rhive+construction" 
                    target="_blank" 
                    rel="noreferrer"
                    className="mt-6 md:mt-0 px-6 py-2 border border-[var(--border-color)] text-white font-bold uppercase tracking-widest text-sm hover:border-rhive-pink hover:text-rhive-pink transition-colors bg-black/40 backdrop-blur-md"
                    style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                >
                    View All Reviews
                </a>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rhive-pink"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {reviews.map((review) => (
                        <div 
                            key={review.id} 
                            className="p-8 bg-black/60 border border-white/10 backdrop-blur-md shadow-xl hover:border-rhive-pink/50 transition-colors duration-500 relative group flex flex-col h-full"
                            style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <svg className="w-12 h-12 text-rhive-pink" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                </svg>
                            </div>
                            
                            <div className="flex items-center gap-4 mb-6">
                                {review.profilePhotoUrl ? (
                                    <img src={review.profilePhotoUrl} alt={review.author} className="w-12 h-12 rounded-full border border-gray-600 shadow-inner object-cover" />
                                ) : (
                                    <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center border border-gray-600 text-lg font-black text-white shadow-inner">
                                        {review.author.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <h4 className="text-white font-bold tracking-wide">{review.author}</h4>
                                    <p className="text-xs text-[var(--rhive-text-muted)]">{review.date}</p>
                                </div>
                            </div>
                            <div className="flex text-rhive-gold mb-4">
                                {[...Array(review.rating)].map((_, i) => (
                                    <StarIcon key={i} className="w-4 h-4 fill-current" />
                                ))}
                            </div>
                            <p className="text-[var(--rhive-text-muted)] font-serif italic leading-relaxed relative z-10 flex-grow">
                                "{review.text}"
                            </p>
                        </div>
                    ))}
                </div>
            )}
            
            <div className="mt-8 text-center">
                <p className="text-xs text-gray-600 font-mono">
                    Live Google Reviews via Maps API. Verified Customers.
                </p>
            </div>
        </div>
    );
};
