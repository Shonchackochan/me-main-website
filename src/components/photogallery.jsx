import React, { useState, useMemo, useEffect } from "react";
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { translations } from "../translations";
import { supabase } from "../services/supabase-client";  

const BlurredImage = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-100">
      {/* Placeholder / Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
      )}

      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={`${className} transition-all duration-1000 ease-out ${isLoaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-2xl scale-110"
          }`}
        loading="lazy"
      />
    </div>
  );
};

const Photogallery = ({ language }) => {
  const [visibleCount, setVisibleCount] = useState(12);
  const [isExpanded, setIsExpanded] = useState(false);

  const [photos, setPhotos] = useState([]);


  const fetchPhotos = async () => {
    const { data } = await supabase
      .schema("me_dataspace")
      .from("gallery")
      .select("itemID, storageURL, alt_text, title")
      .order("created_at", { ascending: false });

    setPhotos(data || []);

  };

  useEffect(() => {
    fetchPhotos();
  }, []);


  // Generate random rotations once to keep them stable
  const rotations = useMemo(() =>
    photos.map(() => (Math.random() * 4 - 2).toFixed(2)),
    [photos]);

  const toggleGallery = () => {
    if (isExpanded) {
      setVisibleCount(12);
      document.getElementById('photo-gallery-section')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setVisibleCount(photos.length);
    }
    setIsExpanded(!isExpanded);
  };

  const manjariFont = language === 'ml' ? { fontFamily: 'Manjari, sans-serif' } : {};

  return (
    <section id="photo-gallery-section" className="relative py-24 bg-transparent overflow-hidden">
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/linen-design.png')` }} />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#461711] mb-6" style={manjariFont}>
            {translations.gallery.title[language]}
          </h2>
          <div className="w-24 h-1 bg-[#ff7612] mx-auto rounded-full mb-6" />
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto italic font-medium" style={manjariFont}>
            {translations.gallery.subtitle[language]}
          </p>
        </div>

        <PhotoProvider maskOpacity={0.95}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 sm:gap-12 pb-12">
            {photos.slice(0, visibleCount).map((photo, index) => (
              <div
                key={photo.itemID}
                className="group relative"
                style={{
                  transform: `rotate(${rotations[index]}deg)`,
                  transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
              >
                <div className="hover:!rotate-0 hover:z-20 transition-all duration-500 hover:scale-110">
                  <PhotoView src={photo.storageURL}>
                    <div className="bg-white p-3 shadow-[0_10px_30px_rgba(0,0,0,0.1)] group-hover:shadow-[0_20px_50px_rgba(70,23,17,0.2)] cursor-pointer ring-1 ring-black/5">
                      <div className="aspect-square overflow-hidden rounded-sm">
                        <BlurredImage
                          src={photo.storageURL}
                          alt={photo.alt_text || `Mind Empowered Memory ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                        />
                      </div>

                      {/* Decorative "Tape" effect */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-8 bg-white/40 backdrop-blur-sm shadow-sm rotate-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </PhotoView>
                </div>
              </div>
            ))}
          </div>
        </PhotoProvider>

        <div className="mt-24 text-center">
          <button
            onClick={toggleGallery}
            className="group px-12 py-4 bg-[#ff7612] text-white font-bold rounded-full shadow-lg hover:shadow-[0_10px_25px_rgba(255,118,18,0.4)] hover:-translate-y-1 transition-all duration-300 active:scale-95"
            style={manjariFont}
          >
            <span className="flex items-center gap-3">
              {isExpanded ? (language === 'ml' ? 'കുറച്ചു കാണുക' : 'Back to Top') : (language === 'ml' ? 'ബാക്കി കാണുക' : 'Explore More Memories')}
              <svg className={`w-5 h-5 transition-transform duration-500 ${isExpanded ? 'rotate-180' : 'group-hover:translate-y-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Photogallery;
