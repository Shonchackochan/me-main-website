import { useRef, useState, useEffect } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { translations } from '../translations';
import { supabase } from "../services/supabase-client";

const Newsletter = ({ language }) => {
  const scrollContainerRef = useRef(null);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);


  const [newsLetter, setNewsLetter] = useState([]);
  const newsletter = newsLetter[0];

  const fetchnewsLetter = async () => {
    try {
      const { data, error } = await supabase
        .schema("me_dataspace")
        .from("newsletters")
        .select("*")
        .order("published_at", { ascending: false });

      if (error) throw error;
      setNewsLetter(data || []);
    } catch (error) {
      console.error('Error fetching newsletters:', error);
      setNewsLetter([]);
    }
  };

  //id, newsletter_url, publish_month, publish_yr
  useEffect(() => {
    fetchnewsLetter();
  }, []);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail('');
    }
  };

  const scroll = (direction) => {
    const scrollAmount = 300;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const manjariFont = language === 'ml' ? { fontFamily: 'Manjari, sans-serif' } : {};

  return (
    <div className="relative overflow-hidden py-10">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-gradient-to-br from-[#ff7612]/10 to-transparent rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-tr from-[#ffdb5b]/10 to-transparent rounded-full blur-3xl opacity-30 pointer-events-none" />

      {/* Header Section */}
      <div className="relative text-center mb-16 px-4">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#461711] mb-6 tracking-tight" style={manjariFont}>
          <span className="relative inline-block">
            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#ff7612] via-[#ffdb5b] to-[#ff7612] bg-[length:200%_auto] animate-gradient-x">
              {translations.newsletter.title[language]}
            </span>
          </span>
        </h2>
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-12 h-1 bg-[#ff7612] rounded-full" />
          <div className="w-3 h-3 bg-[#ffdb5b] rounded-full animate-pulse" />
          <div className="w-12 h-1 bg-[#ff7612] rounded-full" />
        </div>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium" style={manjariFont}>
          {translations.newsletter.subtitle[language]}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch max-w-7xl mx-auto px-4">
        {/* Latest Newsletter - Featured Card */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-md group group/card">
            <div className="relative mb-6 text-center">
              <span className="inline-block px-4 py-1 rounded-full bg-[#461711] text-white text-xs font-bold uppercase tracking-widest mb-2 shadow-sm" style={manjariFont}>
                {translations.newsletter.latestTitle[language]}
              </span>
            </div>

            <div className="relative bg-white p-3 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 group-hover/card:-translate-y-4 group-hover/card:shadow-[0_40px_80px_rgba(70,23,17,0.15)] ring-1 ring-gray-100">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-[#ff7612] to-[#ffdb5b] rounded-full flex items-center justify-center shadow-lg z-10 transform scale-0 group-hover/card:scale-100 transition-transform duration-500 delay-100">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>

              <div className="rounded-[2rem] overflow-hidden aspect-[3/4] relative ring-1 ring-gray-50">
                <PhotoProvider maskOpacity={0.9}>
                  <PhotoView src={newsletter?.newsletter_url}>
                    <div className="relative h-full w-full cursor-pointer overflow-hidden">
                      <img
                        src={newsletter?.newsletter_url}
                        alt={`${months[newsletter?.publish_month - 1]} ${newsletter?.publish_yr}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                    </div>
                  </PhotoView>
                </PhotoProvider>
              </div>
            </div>

            <div className="mt-8 text-center sm:text-left p-6 bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 shadow-sm">
              <h4 className="text-xl font-bold text-[#461711] mb-2" style={manjariFont}>
                {newsletter && newsletter.publish_month ? `${months[newsletter.publish_month - 1]} ${newsletter.publish_yr}` : ""}
              </h4>
              <p className="text-sm text-gray-500 font-medium">
                {newsletter && newsletter.publish_month ? `Published on ${months[newsletter.publish_month - 1]} ${newsletter.publish_yr}` : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Subscription & Form Area */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Main CTA Card */}
          <div className="bg-gradient-to-br from-[#461711] to-[#2a0d0a] rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group/cta flex flex-col justify-center h-full min-h-[400px]">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
              <div className="absolute -top-20 -right-20 w-80 h-80 border-4 border-white rounded-full animate-[ping_10s_linear_infinite]" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 border-2 border-white rounded-full animate-[ping_7s_linear_infinite]" />
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
              <div className="md:col-span-3 space-y-6">
                <h3 className="text-3xl sm:text-4xl font-black text-white leading-[1.1]" style={manjariFont}>
                  {translations.newsletter.formTitle[language]}
                </h3>
                <p className="text-white/80 text-lg leading-relaxed font-medium" style={manjariFont}>
                  {translations.newsletter.formSubtitle[language]}
                </p>

                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div className="relative flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-grow group/input">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={translations.newsletter.formPlaceholder[language]}
                        className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-[#ff7612] transition-all duration-300 translate-z-0 group-hover/input:bg-white/15"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-8 py-4 bg-gradient-to-r from-[#ff7612] to-[#ffdb5b] text-[#461711] font-black rounded-2xl hover:shadow-[0_0_30px_rgba(255,118,18,0.4)] hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
                      style={manjariFont}
                    >
                      {isSubscribed ? (
                        <>
                          <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          Done!
                        </>
                      ) : (
                        translations.newsletter.formButton[language]
                      )}
                    </button>
                  </div>
                  {isSubscribed && (
                    <p className="text-[#ffdb5b] text-sm font-bold animate-fade-in-up">Thank you for subscribing! Check your inbox soon.</p>
                  )}
                </form>
              </div>

              <div className="md:col-span-2 hidden md:flex justify-center items-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 blur-[100px] rounded-full animate-pulse" />
                  <img src="/newsletter-gh.png" alt="Newsletter Graphic" className="w-full max-w-[240px] relative z-10 transition-all duration-500 group-hover/cta:scale-110 group-hover/cta:rotate-3 drop-shadow-2xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Previous Newsletters Carousel */}
          <div className="bg-white/60 backdrop-blur-sm rounded-[2.5rem] p-6 border border-white/80 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-6 px-2">
              <h3 className="text-xl font-bold text-[#461711]" style={manjariFont}>
                {translations.newsletter.previousTitle[language]}
              </h3>
              <div className="flex gap-2">
                <button onClick={() => scroll('left')} className="p-2.5 bg-white rounded-xl shadow-sm hover:shadow-md hover:text-[#ff7612] transition-all active:scale-90 border border-gray-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={() => scroll('right')} className="p-2.5 bg-white rounded-xl shadow-sm hover:shadow-md hover:text-[#ff7612] transition-all active:scale-90 border border-gray-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>

            <div className="relative">
              <PhotoProvider maskOpacity={0.93}>
                <div
                  ref={scrollContainerRef}
                  className="w-full flex items-center overflow-x-auto no-scrollbar pb-2 pt-1"
                >
                  <div className="flex animate-marquee-slower hover:pause group/marquee pb-4">
                    {[...newsLetter.slice(1), ...newsLetter.slice(1)].map((newsletter, index) => (
                      <div key={index} className="flex-shrink-0 mx-3 group/item">
                        <PhotoView src={newsletter?.newsletter_url}>
                          <div className="relative w-28 h-40 sm:w-36 sm:h-48 rounded-2xl overflow-hidden shadow-md transition-all duration-500 group-hover/item:-translate-y-2 group-hover/item:shadow-xl group-hover/item:ring-2 group-hover/item:ring-[#ff7612]/30 cursor-pointer">
                            <img
                              src={newsletter.newsletter_url}
                              alt={`${months[newsletter?.publish_month - 1]} ${newsletter?.publish_yr}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#461711]/80 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-500 flex items-end p-3">
                              <p className="text-[10px] text-white font-bold tracking-wider leading-tight">{months[newsletter.publish_month - 1]} {newsletter.publish_yr}</p>
                            </div>
                          </div>
                        </PhotoView>
                      </div>
                    ))}
                  </div>
                </div>
              </PhotoProvider>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x 6s ease infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes marquee-slower {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-slower {
          animation: marquee-slower 45s linear infinite;
        }
        .hover\\:pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default Newsletter;