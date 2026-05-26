// import { useState, useEffect, useRef } from "react";
// import { createPortal } from "react-dom";
// import { translations, getMonthName } from "../translations";

// const CalendarPopup = ({ language, scrolled }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [calendarData, setCalendarData] = useState([]);
//     const [availableYears, setAvailableYears] = useState([]);
//     const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
//     const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
//     const [posterUrl, setPosterUrl] = useState("");
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [posterOpen, setPosterOpen] = useState(false);

//     const btnRef = useRef(null);
//     const dropdownRef = useRef(null);

//     // Fetch calendar data once
//     useEffect(() => {
//         fetch(`/calender.json?v=${new Date().getTime()}`)
//             .then((r) => { if (!r.ok) throw new Error("Network error"); return r.json(); })
//             .then((data) => {
//                 const sorted = data.sort((a, b) => {
//                     const yearDiff = Number(b.year) - Number(a.year);
//                     if (yearDiff !== 0) return yearDiff;
//                     return Number(b.month) - Number(a.month);
//                 });
//                 setCalendarData(sorted);
//                 const years = [...new Set(sorted.map((i) => i.year.toString()))].sort((a, b) => Number(b) - Number(a));
//                 setAvailableYears(years);
//                 if (sorted.length > 0) {
//                     setSelectedYear(sorted[0].year.toString());
//                     setSelectedMonth(sorted[0].month.toString());
//                     setPosterUrl(sorted[0].poster);
//                 }
//                 setIsLoading(false);
//             })
//             .catch(() => {
//                 setError(translations.calendar.error[language]);
//                 setIsLoading(false);
//             });
//     }, [language]);

//     // Reactively update poster on dropdown change
//     useEffect(() => {
//         if (!calendarData.length) return;
//         const entry = calendarData.find(
//             (e) => Number(e.month) === Number(selectedMonth) && e.year.toString() === selectedYear.toString()
//         );
//         setPosterUrl(entry ? entry.poster : "");
//     }, [selectedMonth, selectedYear, calendarData]);

//     // Close dropdown on outside click
//     useEffect(() => {
//         if (!isOpen) return;
//         const handler = (e) => {
//             if (
//                 dropdownRef.current && !dropdownRef.current.contains(e.target) &&
//                 btnRef.current && !btnRef.current.contains(e.target)
//             ) {
//                 setIsOpen(false);
//             }
//         };
//         document.addEventListener("mousedown", handler);
//         return () => document.removeEventListener("mousedown", handler);
//     }, [isOpen]);

//     // Close on Escape
//     useEffect(() => {
//         const handler = (e) => {
//             if (e.key === "Escape") { setIsOpen(false); setPosterOpen(false); }
//         };
//         window.addEventListener("keydown", handler);
//         return () => window.removeEventListener("keydown", handler);
//     }, []);

//     // Compute dropdown position from button anchor
//     const getDropdownStyle = () => {
//         if (!btnRef.current) return {};
//         const rect = btnRef.current.getBoundingClientRect();
//         return {
//             position: "fixed",
//             top: rect.bottom + 8,
//             right: window.innerWidth - rect.right,
//         };
//     };

//     const iconClass = scrolled
//         ? "text-[#461711]"
//         : "text-white";

//     const monthLabel = getMonthName(parseInt(selectedMonth) - 1, language);

//     return (
//         <>
//             {/* ── Calendar Icon Button ── */}
//             <button
//                 ref={btnRef}
//                 onClick={() => setIsOpen((v) => !v)}
//                 aria-label="Event Calendar"
//                 className={`relative p-2.5 rounded-xl transition-all duration-500 group shadow-lg flex items-center justify-center ${scrolled
//                     ? "bg-[#ff7612] text-white hover:bg-[#461711] shadow-[#ff7612]/20"
//                     : "bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-[#ff7612] border border-white/20"
//                     } ${isOpen ? "ring-4 ring-[#ff7612]/30 scale-95" : "hover:-translate-y-1 hover:scale-110"}`}
//             >
//                 <svg className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-500 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
//                         d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                 </svg>

//                 {/* Visual Cue: Pulsing Badge */}
//                 <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
//                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffdb5b] opacity-75"></span>
//                     <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#ffdb5b] border-2 border-white shadow-sm"></span>
//                 </span>
//             </button>

//             {/* ── Dropdown Picker — portalled to body so it escapes navbar stacking context ── */}
//             {isOpen && createPortal(
//                 <div
//                     ref={dropdownRef}
//                     style={getDropdownStyle()}
//                     className="w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[200]"
//                 >
//                     {/* Header */}
//                     <div className="bg-gradient-to-r from-[#461711] to-[#7a3012] px-5 py-4 flex items-center justify-between">
//                         <div>
//                             <p className="text-white font-bold text-sm tracking-wide" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
//                                 {translations.calendar.title[language]}
//                             </p>
//                             <p className="text-white/60 text-xs mt-0.5" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
//                                 {translations.calendar.subtitle[language]}
//                             </p>
//                         </div>
//                         <button onClick={() => setIsOpen(false)} className="text-white/60 transition-colors p-1">
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                         </button>
//                     </div>

//                     <div className="p-5">
//                         {/* Dropdowns */}
//                         <div className="flex gap-3 mb-4">
//                             <div className="flex-1">
//                                 <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Month</label>
//                                 <select
//                                     value={selectedMonth}
//                                     onChange={(e) => setSelectedMonth(e.target.value)}
//                                     className="w-full px-3 py-2 border-2 border-[#461711] rounded-lg text-sm font-medium text-[#461711] bg-white focus:ring-2 focus:ring-[#ff7612] focus:border-transparent outline-none transition-all"
//                                 >
//                                     {Array.from({ length: 12 }, (_, i) => (
//                                         <option key={i} value={i + 1}>{getMonthName(i, language)}</option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div className="flex-1">
//                                 <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Year</label>
//                                 <select
//                                     value={selectedYear}
//                                     onChange={(e) => setSelectedYear(e.target.value)}
//                                     className="w-full px-3 py-2 border-2 border-[#461711] rounded-lg text-sm font-medium text-[#461711] bg-white focus:ring-2 focus:ring-[#ff7612] focus:border-transparent outline-none transition-all"
//                                 >
//                                     {availableYears.map((y) => (
//                                         <option key={y} value={y}>{y}</option>
//                                     ))}
//                                 </select>
//                             </div>
//                         </div>

//                         {/* Status / Preview */}
//                         {isLoading ? (
//                             <div className="flex items-center justify-center py-6 gap-3">
//                                 <svg className="animate-spin h-6 w-6 text-[#ff7612]" fill="none" viewBox="0 0 24 24">
//                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                                 </svg>
//                                 <span className="text-sm text-gray-500 font-medium">{translations.calendar.loading[language]}</span>
//                             </div>
//                         ) : error ? (
//                             <p className="text-center text-sm text-red-500 py-4">{error}</p>
//                         ) : posterUrl ? (
//                             <button
//                                 onClick={() => { setPosterOpen(true); setIsOpen(false); }}
//                                 className="w-full relative overflow-hidden rounded-xl border-2 border-gray-100 transition-all duration-300 shadow-md"
//                             >
//                                 <img
//                                     src={posterUrl}
//                                     alt={`${monthLabel} ${selectedYear}`}
//                                     className="w-full h-56 object-cover object-top transition-transform duration-500"
//                                 />
//                                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
//                                     <span className="text-white text-xs font-bold flex items-center gap-1.5">
//                                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                                         </svg>
//                                         Click to view full poster
//                                     </span>
//                                 </div>
//                             </button>
//                         ) : (
//                             <div className="text-center py-6">
//                                 <svg className="w-10 h-10 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                                 </svg>
//                                 <p className="text-sm font-semibold text-gray-500">{translations.calendar.noEvents[language]}</p>
//                                 <p className="text-xs text-gray-400 mt-1">{translations.calendar.tryAgain[language]}</p>
//                             </div>
//                         )}
//                     </div>
//                 </div>,
//                 document.body
//             )}

//             {/* ── Full-size Poster Lightbox — portalled to body, truly centred ── */}
//             {posterOpen && posterUrl && createPortal(
//                 <div
//                     className="fixed inset-0 z-[300] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
//                     onClick={() => setPosterOpen(false)}
//                 >
//                     <div
//                         className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
//                         style={{ maxHeight: "92vh" }}
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         {/* Lightbox header */}
//                         <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#461711] to-[#7a3012] flex-shrink-0">
//                             <div>
//                                 <p className="text-white font-bold" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
//                                     {monthLabel} {selectedYear}
//                                 </p>
//                                 <p className="text-white/60 text-xs">{translations.calendar.title[language]}</p>
//                             </div>
//                             <button
//                                 onClick={() => setPosterOpen(false)}
//                                 className="p-2 text-white/60 rounded-full transition-colors"
//                                 aria-label="Close poster"
//                             >
//                                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                 </svg>
//                             </button>
//                         </div>
//                         {/* Scrollable poster */}
//                         <div className="overflow-y-auto flex-1">
//                             <img
//                                 src={posterUrl}
//                                 alt={`${monthLabel} ${selectedYear}`}
//                                 className="w-full h-auto block"
//                             />
//                         </div>
//                     </div>
//                 </div>,
//                 document.body
//             )}
//         </>
//     );
// };

// export default CalendarPopup;







// import { useState, useEffect, useRef } from "react";
// import { createPortal } from "react-dom";
// import { translations, getMonthName } from "../translations";
// import { supabase } from "../services/supabase-client";

// const CalendarPopup = ({ language, scrolled }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [calendarData, setCalendarData] = useState([]);
//     const [availableYears, setAvailableYears] = useState([]);
//     const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
//     const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
//     const [posterUrl, setPosterUrl] = useState("");
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [posterOpen, setPosterOpen] = useState(false);

//     const btnRef = useRef(null);
//     const dropdownRef = useRef(null);

//     // Fetch calendar data from Supabase
//     useEffect(() => {
//         const fetchCalendarData = async () => {
//             try {
//                 setIsLoading(true);
//                 setError(null);

//                 console.log("🔄 Fetching calendar data from Supabase...");

//                 // Test: Try direct table access without schema
//                 const { data, error: fetchError } = await supabase
//                     .from("event_calendars")
//                     .select("id, cal_url, cal_month, cal_year, published_at")
//                     .order("cal_year", { ascending: false })
//                     .order("cal_month", { ascending: false });

//                 console.log("✅ Supabase Response:", { data, fetchError });

//                 if (fetchError) {
//                     console.error("❌ Supabase Error Details:", {
//                         message: fetchError.message,
//                         code: fetchError.code,
//                         details: fetchError.details,
//                         hint: fetchError.hint,
//                     });
//                     throw new Error(`Supabase Error: ${fetchError.message}`);
//                 }

//                 if (!data || data.length === 0) {
//                     console.warn("⚠️ No calendar data found in Supabase");
//                     setError("No calendar events available");
//                     setIsLoading(false);
//                     return;
//                 }

//                 console.log("📊 Raw Data Sample:", data[0]);

//                 // Transform data to match expected format
//                 const transformedData = data.map(item => ({
//                     id: item.id,
//                     month: String(item.cal_month),
//                     year: String(item.cal_year),
//                     poster: item.cal_url,
//                     published_at: item.published_at,
//                 }));

//                 console.log("🔄 Transformed Data Sample:", transformedData[0]);

//                 setCalendarData(transformedData);

//                 // Extract unique years and sort descending
//                 const years = [...new Set(transformedData.map((i) => i.year))].sort((a, b) => Number(b) - Number(a));
//                 console.log("📅 Available Years:", years);
//                 setAvailableYears(years);

//                 // Set default selection to the most recent entry
//                 if (transformedData.length > 0) {
//                     setSelectedYear(transformedData[0].year);
//                     setSelectedMonth(transformedData[0].month);
//                     setPosterUrl(transformedData[0].poster);
//                     console.log("✨ Default Selection:", {
//                         year: transformedData[0].year,
//                         month: transformedData[0].month,
//                         posterUrl: transformedData[0].poster,
//                     });
//                 }

//                 setIsLoading(false);
//             } catch (err) {
//                 console.error("💥 Fetch Error:", err);
//                 setError(translations.calendar.error[language] || "Failed to load calendar data");
//                 setIsLoading(false);
//             }
//         };

//         fetchCalendarData();
//     }, [language]);

//     // Reactively update poster on dropdown change
//     useEffect(() => {
//         if (!calendarData.length) return;
//         const entry = calendarData.find(
//             (e) => Number(e.month) === Number(selectedMonth) && e.year === selectedYear
//         );
//         setPosterUrl(entry ? entry.poster : "");
//     }, [selectedMonth, selectedYear, calendarData]);

//     // Close dropdown on outside click
//     useEffect(() => {
//         if (!isOpen) return;
//         const handler = (e) => {
//             if (
//                 dropdownRef.current && !dropdownRef.current.contains(e.target) &&
//                 btnRef.current && !btnRef.current.contains(e.target)
//             ) {
//                 setIsOpen(false);
//             }
//         };
//         document.addEventListener("mousedown", handler);
//         return () => document.removeEventListener("mousedown", handler);
//     }, [isOpen]);

//     // Close on Escape
//     useEffect(() => {
//         const handler = (e) => {
//             if (e.key === "Escape") { setIsOpen(false); setPosterOpen(false); }
//         };
//         window.addEventListener("keydown", handler);
//         return () => window.removeEventListener("keydown", handler);
//     }, []);

//     // Compute dropdown position from button anchor
//     const getDropdownStyle = () => {
//         if (!btnRef.current) return {};
//         const rect = btnRef.current.getBoundingClientRect();
//         return {
//             position: "fixed",
//             top: rect.bottom + 8,
//             right: window.innerWidth - rect.right,
//         };
//     };

//     const monthLabel = getMonthName(parseInt(selectedMonth) - 1, language);

//     return (
//         <>
//             {/* ── Calendar Icon Button ── */}
//             <button
//                 ref={btnRef}
//                 onClick={() => setIsOpen((v) => !v)}
//                 aria-label="Event Calendar"
//                 className={`relative p-2.5 rounded-xl transition-all duration-500 group shadow-lg flex items-center justify-center ${scrolled
//                     ? "bg-[#ff7612] text-white hover:bg-[#461711] shadow-[#ff7612]/20"
//                     : "bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-[#ff7612] border border-white/20"
//                     } ${isOpen ? "ring-4 ring-[#ff7612]/30 scale-95" : "hover:-translate-y-1 hover:scale-110"}`}
//             >
//                 <svg className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-500 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
//                         d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                 </svg>

//                 {/* Visual Cue: Pulsing Badge */}
//                 <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
//                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffdb5b] opacity-75"></span>
//                     <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#ffdb5b] border-2 border-white shadow-sm"></span>
//                 </span>
//             </button>

//             {/* ── Dropdown Picker — portalled to body so it escapes navbar stacking context ── */}
//             {isOpen && createPortal(
//                 <div
//                     ref={dropdownRef}
//                     style={getDropdownStyle()}
//                     className="w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[200]"
//                 >
//                     {/* Header */}
//                     <div className="bg-gradient-to-r from-[#461711] to-[#7a3012] px-5 py-4 flex items-center justify-between">
//                         <div>
//                             <p className="text-white font-bold text-sm tracking-wide" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
//                                 {translations.calendar.title[language]}
//                             </p>
//                             <p className="text-white/60 text-xs mt-0.5" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
//                                 {translations.calendar.subtitle[language]}
//                             </p>
//                         </div>
//                         <button onClick={() => setIsOpen(false)} className="text-white/60 transition-colors p-1">
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                         </button>
//                     </div>

//                     <div className="p-5">
//                         {/* Dropdowns */}
//                         <div className="flex gap-3 mb-4">
//                             <div className="flex-1">
//                                 <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Month</label>
//                                 <select
//                                     value={selectedMonth}
//                                     onChange={(e) => setSelectedMonth(e.target.value)}
//                                     className="w-full px-3 py-2 border-2 border-[#461711] rounded-lg text-sm font-medium text-[#461711] bg-white focus:ring-2 focus:ring-[#ff7612] focus:border-transparent outline-none transition-all"
//                                 >
//                                     {Array.from({ length: 12 }, (_, i) => (
//                                         <option key={i} value={i + 1}>{getMonthName(i, language)}</option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div className="flex-1">
//                                 <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Year</label>
//                                 <select
//                                     value={selectedYear}
//                                     onChange={(e) => setSelectedYear(e.target.value)}
//                                     className="w-full px-3 py-2 border-2 border-[#461711] rounded-lg text-sm font-medium text-[#461711] bg-white focus:ring-2 focus:ring-[#ff7612] focus:border-transparent outline-none transition-all"
//                                     disabled={availableYears.length === 0}
//                                 >
//                                     {availableYears.length === 0 ? (
//                                         <option disabled>No years available</option>
//                                     ) : (
//                                         availableYears.map((y) => (
//                                             <option key={y} value={y}>{y}</option>
//                                         ))
//                                     )}
//                                 </select>
//                             </div>
//                         </div>

//                         {/* Status / Preview */}
//                         {isLoading ? (
//                             <div className="flex items-center justify-center py-6 gap-3">
//                                 <svg className="animate-spin h-6 w-6 text-[#ff7612]" fill="none" viewBox="0 0 24 24">
//                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                                 </svg>
//                                 <span className="text-sm text-gray-500 font-medium">{translations.calendar.loading[language]}</span>
//                             </div>
//                         ) : error ? (
//                             <div className="text-center py-6">
//                                 <p className="text-sm text-red-500 font-medium mb-2">{error}</p>
//                                 <p className="text-xs text-gray-400">Check browser console (F12) for detailed error logs</p>
//                             </div>
//                         ) : posterUrl ? (
//                             <button
//                                 onClick={() => { setPosterOpen(true); setIsOpen(false); }}
//                                 className="w-full relative overflow-hidden rounded-xl border-2 border-gray-100 transition-all duration-300 shadow-md"
//                             >
//                                 <img
//                                     src={posterUrl}
//                                     alt={`${monthLabel} ${selectedYear}`}
//                                     className="w-full h-56 object-cover object-top transition-transform duration-500"
//                                 />
//                                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
//                                     <span className="text-white text-xs font-bold flex items-center gap-1.5">
//                                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                                         </svg>
//                                         Click to view full poster
//                                     </span>
//                                 </div>
//                             </button>
//                         ) : (
//                             <div className="text-center py-6">
//                                 <svg className="w-10 h-10 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                                 </svg>
//                                 <p className="text-sm font-semibold text-gray-500">{translations.calendar.noEvents[language]}</p>
//                                 <p className="text-xs text-gray-400 mt-1">{translations.calendar.tryAgain[language]}</p>
//                             </div>
//                         )}
//                     </div>
//                 </div>,
//                 document.body
//             )}

//             {/* ── Full-size Poster Lightbox — portalled to body, truly centred ── */}
//             {posterOpen && posterUrl && createPortal(
//                 <div
//                     className="fixed inset-0 z-[300] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
//                     onClick={() => setPosterOpen(false)}
//                 >
//                     <div
//                         className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
//                         style={{ maxHeight: "92vh" }}
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         {/* Lightbox header */}
//                         <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#461711] to-[#7a3012] flex-shrink-0">
//                             <div>
//                                 <p className="text-white font-bold" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
//                                     {monthLabel} {selectedYear}
//                                 </p>
//                                 <p className="text-white/60 text-xs">{translations.calendar.title[language]}</p>
//                             </div>
//                             <button
//                                 onClick={() => setPosterOpen(false)}
//                                 className="p-2 text-white/60 rounded-full transition-colors"
//                                 aria-label="Close poster"
//                             >
//                                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                 </svg>
//                             </button>
//                         </div>
//                         {/* Scrollable poster */}
//                         <div className="overflow-y-auto flex-1">
//                             <img
//                                 src={posterUrl}
//                                 alt={`${monthLabel} ${selectedYear}`}
//                                 className="w-full h-auto block"
//                             />
//                         </div>
//                     </div>
//                 </div>,
//                 document.body
//             )}
//         </>
//     );
// };

// export default CalendarPopup;








import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { translations, getMonthName } from "../translations";
import { supabase } from "../services/supabase-client";

const CalendarPopup = ({ language, scrolled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [calendarData, setCalendarData] = useState([]);
    const [availableYears, setAvailableYears] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [posterUrl, setPosterUrl] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [posterOpen, setPosterOpen] = useState(false);

    const btnRef = useRef(null);
    const dropdownRef = useRef(null);

    // Fetch calendar data from Supabase
    useEffect(() => {
        const fetchCalendarData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                console.log("🔄 Fetching calendar data from Supabase...");

                // Query from me_dataspace schema (same as admin Calendar.jsx)
                const { data, error: fetchError } = await supabase
                    .schema("me_dataspace")
                    .from("event_calendars")
                    .select("id, cal_url, cal_month, cal_year, published_at")
                    .order("cal_year", { ascending: false })
                    .order("cal_month", { ascending: false });

                console.log("✅ Supabase Response:", { data, fetchError });

                if (fetchError) {
                    console.error("❌ Supabase Error Details:", {
                        message: fetchError.message,
                        code: fetchError.code,
                        details: fetchError.details,
                        hint: fetchError.hint,
                    });
                    throw new Error(`Supabase Error: ${fetchError.message}`);
                }

                if (!data || data.length === 0) {
                    console.warn("⚠️ No calendar data found in Supabase");
                    setError("No calendar events available");
                    setIsLoading(false);
                    return;
                }

                console.log("📊 Raw Data Sample:", data[0]);

                // Transform data to match expected format
                const transformedData = data.map(item => ({
                    id: item.id,
                    month: String(item.cal_month),
                    year: String(item.cal_year),
                    poster: item.cal_url,
                    published_at: item.published_at,
                }));

                console.log("🔄 Transformed Data Sample:", transformedData[0]);

                setCalendarData(transformedData);

                // Extract unique years and sort descending
                const years = [...new Set(transformedData.map((i) => i.year))].sort((a, b) => Number(b) - Number(a));
                console.log("📅 Available Years:", years);
                setAvailableYears(years);

                // Set default selection to the most recent entry
                if (transformedData.length > 0) {
                    setSelectedYear(transformedData[0].year);
                    setSelectedMonth(transformedData[0].month);
                    setPosterUrl(transformedData[0].poster);
                    console.log("✨ Default Selection:", {
                        year: transformedData[0].year,
                        month: transformedData[0].month,
                        posterUrl: transformedData[0].poster,
                    });
                }

                setIsLoading(false);
            } catch (err) {
                console.error("💥 Fetch Error:", err);
                setError(translations.calendar.error[language] || "Failed to load calendar data");
                setIsLoading(false);
            }
        };

        fetchCalendarData();
    }, [language]);

    // Reactively update poster on dropdown change
    useEffect(() => {
        if (!calendarData.length) return;
        const entry = calendarData.find(
            (e) => Number(e.month) === Number(selectedMonth) && e.year === selectedYear
        );
        setPosterUrl(entry ? entry.poster : "");
    }, [selectedMonth, selectedYear, calendarData]);

    // Close dropdown on outside click
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(e.target) &&
                btnRef.current && !btnRef.current.contains(e.target)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape") { setIsOpen(false); setPosterOpen(false); }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    // Compute dropdown position from button anchor
    const getDropdownStyle = () => {
        if (!btnRef.current) return {};
        const rect = btnRef.current.getBoundingClientRect();
        return {
            position: "fixed",
            top: rect.bottom + 8,
            right: window.innerWidth - rect.right,
        };
    };

    const monthLabel = getMonthName(parseInt(selectedMonth) - 1, language);

    return (
        <>
            {/* ── Calendar Icon Button ── */}
            <button
                ref={btnRef}
                onClick={() => setIsOpen((v) => !v)}
                aria-label="Event Calendar"
                className={`relative p-2.5 rounded-xl transition-all duration-500 group shadow-lg flex items-center justify-center ${scrolled
                    ? "bg-[#ff7612] text-white hover:bg-[#461711] shadow-[#ff7612]/20"
                    : "bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-[#ff7612] border border-white/20"
                    } ${isOpen ? "ring-4 ring-[#ff7612]/30 scale-95" : "hover:-translate-y-1 hover:scale-110"}`}
            >
                <svg className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-500 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>

                {/* Visual Cue: Pulsing Badge */}
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffdb5b] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#ffdb5b] border-2 border-white shadow-sm"></span>
                </span>
            </button>

            {/* ── Dropdown Picker — portalled to body so it escapes navbar stacking context ── */}
            {isOpen && createPortal(
                <div
                    ref={dropdownRef}
                    style={getDropdownStyle()}
                    className="w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[200]"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#461711] to-[#7a3012] px-5 py-4 flex items-center justify-between">
                        <div>
                            <p className="text-white font-bold text-sm tracking-wide" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                                {translations.calendar.title[language]}
                            </p>
                            <p className="text-white/60 text-xs mt-0.5" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                                {translations.calendar.subtitle[language]}
                            </p>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/60 transition-colors p-1">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="p-5">
                        {/* Dropdowns */}
                        <div className="flex gap-3 mb-4">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Month</label>
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="w-full px-3 py-2 border-2 border-[#461711] rounded-lg text-sm font-medium text-[#461711] bg-white focus:ring-2 focus:ring-[#ff7612] focus:border-transparent outline-none transition-all"
                                >
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <option key={i} value={i + 1}>{getMonthName(i, language)}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Year</label>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="w-full px-3 py-2 border-2 border-[#461711] rounded-lg text-sm font-medium text-[#461711] bg-white focus:ring-2 focus:ring-[#ff7612] focus:border-transparent outline-none transition-all"
                                    disabled={availableYears.length === 0}
                                >
                                    {availableYears.length === 0 ? (
                                        <option disabled>No years available</option>
                                    ) : (
                                        availableYears.map((y) => (
                                            <option key={y} value={y}>{y}</option>
                                        ))
                                    )}
                                </select>
                            </div>
                        </div>

                        {/* Status / Preview */}
                        {isLoading ? (
                            <div className="flex items-center justify-center py-6 gap-3">
                                <svg className="animate-spin h-6 w-6 text-[#ff7612]" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span className="text-sm text-gray-500 font-medium">{translations.calendar.loading[language]}</span>
                            </div>
                        ) : error ? (
                            <div className="text-center py-6">
                                <p className="text-sm text-red-500 font-medium mb-2">{error}</p>
                                <p className="text-xs text-gray-400">Check browser console (F12) for detailed error logs</p>
                            </div>
                        ) : posterUrl ? (
                            <button
                                onClick={() => { setPosterOpen(true); setIsOpen(false); }}
                                className="w-full relative overflow-hidden rounded-xl border-2 border-gray-100 transition-all duration-300 shadow-md"
                            >
                                <img
                                    src={posterUrl}
                                    alt={`${monthLabel} ${selectedYear}`}
                                    className="w-full h-56 object-cover object-top transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                                    <span className="text-white text-xs font-bold flex items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        Click to view full poster
                                    </span>
                                </div>
                            </button>
                        ) : (
                            <div className="text-center py-6">
                                <svg className="w-10 h-10 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm font-semibold text-gray-500">{translations.calendar.noEvents[language]}</p>
                                <p className="text-xs text-gray-400 mt-1">{translations.calendar.tryAgain[language]}</p>
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}

            {/* ── Full-size Poster Lightbox — portalled to body, truly centred ── */}
            {posterOpen && posterUrl && createPortal(
                <div
                    className="fixed inset-0 z-[300] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setPosterOpen(false)}
                >
                    <div
                        className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                        style={{ maxHeight: "92vh" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Lightbox header */}
                        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#461711] to-[#7a3012] flex-shrink-0">
                            <div>
                                <p className="text-white font-bold" style={{ fontFamily: language === 'ml' ? 'Manjari, sans-serif' : 'inherit' }}>
                                    {monthLabel} {selectedYear}
                                </p>
                                <p className="text-white/60 text-xs">{translations.calendar.title[language]}</p>
                            </div>
                            <button
                                onClick={() => setPosterOpen(false)}
                                className="p-2 text-white/60 rounded-full transition-colors"
                                aria-label="Close poster"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        {/* Scrollable poster */}
                        <div className="overflow-y-auto flex-1">
                            <img
                                src={posterUrl}
                                alt={`${monthLabel} ${selectedYear}`}
                                className="w-full h-auto block"
                            />
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default CalendarPopup;
