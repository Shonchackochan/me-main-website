// import { useState, useEffect } from "react";
// import { supabase } from "../../services/supabase-client";
// import { FaSpinner, FaChevronRight, FaChevronLeft } from "react-icons/fa";

// const ParticipatedEventsSection = () => {
//     const [participatedEvents, setParticipatedEvents] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [currentPage, setCurrentPage] = useState(0);
//     const EVENTS_PER_PAGE = 2;

//     useEffect(() => {
//         const fetchParticipatedEvents = async () => {
//             try {
//                 setLoading(true);
//                 setError(null);

//                 // Get current logged-in user
//                 const {
//                     data: { user },
//                     error: userError,
//                 } = await supabase.auth.getUser();

//                 if (userError || !user) {
//                     console.error("Auth error:", userError);
//                     setError("Failed to fetch user information");
//                     setLoading(false);
//                     return;
//                 }

//                 // Get user ID from database by email
//                 const { data: userData, error: userDataError } = await supabase
//                     .schema("me_dataspace")
//                     .from("users")
//                     .select("userID")
//                     .eq("emailID", user.email)
//                     .single();

//                 if (userDataError) {
//                     console.error("User lookup error:", userDataError);
//                     setError("User not found");
//                     setLoading(false);
//                     return;
//                 }

//                 if (!userData) {
//                     console.error("User not found in database");
//                     setError("User data not available");
//                     setLoading(false);
//                     return;
//                 }

//                 const userID = userData.userID;

//                 // Fetch participated events 
//                 const { data: participations, error: participationError } = await supabase
//                     .schema("me_dataspace")
//                     .from("event_participation")
//                     .select("event_id, created_at")
//                     .eq("participant_id", userID)
//                     .eq("registered_as", "attended");

//                 if (participationError) {
//                     console.error("Participation fetch error:", participationError);
//                     setError("Failed to fetch participated events");
//                     setLoading(false);
//                     return;
//                 }

//                 if (!participations || participations.length === 0) {
//                     setParticipatedEvents([]);
//                     setLoading(false);
//                     return;
//                 }

//                 // Get event details for all participated events
//                 const eventIds = participations.map((p) => p.event_id);
//                 const { data: events, error: eventsError } = await supabase
//                     .schema("me_dataspace")
//                     .from("events")
//                     .select("eventID, title, description, fromDateTime")
//                     .in("eventID", eventIds);

//                 if (eventsError) {
//                     console.error("Events fetch error:", eventsError);
//                     setError("Failed to fetch event details");
//                     setLoading(false);
//                     return;
//                 }

//                 // Merge participation data with event data
//                 const merged = participations.map((participation) => {
//                     const event = (events || []).find(
//                         (e) => e.eventID === participation.event_id
//                     );
//                     return {
//                         id: participation.event_id,
//                         participatedAt: participation.created_at,
//                         title: event?.title || "Unknown Event",
//                         description: event?.description || "",
//                         date: event?.fromDateTime || null,
//                     };
//                 });

//                 // Sort by participated date (most recent first)
//                 merged.sort(
//                     (a, b) =>
//                         new Date(b.participatedAt) - new Date(a.participatedAt)
//                 );

//                 setParticipatedEvents(merged);
//                 setLoading(false);
//             } catch (err) {
//                 console.error("Unexpected error:", err);
//                 setError("An unexpected error occurred");
//                 setLoading(false);
//             }
//         };

//         fetchParticipatedEvents();
//     }, []);

//     // Pagination logic
//     const totalPages = Math.ceil(participatedEvents.length / EVENTS_PER_PAGE);
//     const paginatedEvents = participatedEvents.slice(
//         currentPage * EVENTS_PER_PAGE,
//         (currentPage + 1) * EVENTS_PER_PAGE
//     );

//     const handleNextPage = () => {
//         if (currentPage < totalPages - 1) {
//             setCurrentPage(currentPage + 1);
//         }
//     };

//     const handlePreviousPage = () => {
//         if (currentPage > 0) {
//             setCurrentPage(currentPage - 1);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="bg-white rounded-2xl p-6 flex flex-col">
//                 <h2 className="text-2xl font-bold mb-4 text-[#8A7060]">
//                     Participated Events
//                 </h2>
//                 <div className="flex items-center justify-center py-8">
//                     <FaSpinner className="animate-spin text-[#A64200] text-2xl" />
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="bg-white rounded-2xl p-6 flex flex-col">
//                 <h2 className="text-2xl font-bold mb-4 text-[#8A7060]">
//                     Participated Events
//                 </h2>
//                 <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
//                     {error}
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="bg-white rounded-2xl p-6 flex flex-col ">
//             <h2 className="text-2xl font-bold mb-4 text-[#8A7060]">
//                 Participated Events
//             </h2>

//             {participatedEvents.length === 0 ? (
//                 <p className="text-gray-500 text-center py-8">
//                     No participated events yet
//                 </p>
//             ) : (
//                 <>
//                     <div className="space-y-3 flex-1 mb-4">
//                         {paginatedEvents.map((event) => (
//                             <div
//                                 key={event.id}
//                                 className="border rounded-lg p-4 hover:shadow-md transition"
//                             >
//                                 <h3 className="text-md font-bold text-[#A64200]">
//                                     {event.title}
//                                 </h3>
//                                 <p className="text-gray-600 text-sm">
//                                     {event.description}
//                                 </p>
//                                 {event.date && (
//                                     <p className="text-sm text-gray-400 mt-1">
//                                         {new Date(event.date).toLocaleDateString()}
//                                     </p>
//                                 )}
//                             </div>
//                         ))}
//                     </div>

//                     {/* Pagination Controls */}
//                     {totalPages > 1 && (
//                         <div className="flex items-center justify-between border-t pt-4">
//                             <button
//                                 onClick={handlePreviousPage}
//                                 disabled={currentPage === 0}
//                                 className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
//                                     currentPage === 0
//                                         ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                                         : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                                 }`}
//                             >
//                                 <FaChevronLeft size={14} />
//                                 Previous
//                             </button>

//                             <div className="text-sm text-gray-600">
//                                 Page {currentPage + 1} of {totalPages}
//                             </div>

//                             <button
//                                 onClick={handleNextPage}
//                                 disabled={currentPage === totalPages - 1}
//                                 className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
//                                     currentPage === totalPages - 1
//                                         ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                                         : "bg-[#A64200] text-white hover:bg-[#8a3600]"
//                                 }`}
//                             >
//                                 Next
//                                 <FaChevronRight size={14} />
//                             </button>
//                         </div>
//                     )}
//                 </>
//             )}
//         </div>
//     );
// };

// export default ParticipatedEventsSection;


import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase-client";
import { FaSpinner, FaChevronRight, FaChevronLeft } from "react-icons/fa";

const ParticipatedEventsSection = () => {
    const [participatedEvents, setParticipatedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const EVENTS_PER_PAGE = 2;

    useEffect(() => {
        const fetchParticipatedEvents = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get current logged-in user
                const {
                    data: { user },
                    error: userError,
                } = await supabase.auth.getUser();

                if (userError || !user) {
                    console.error("Auth error:", userError);
                    setError("Failed to fetch user information");
                    setLoading(false);
                    return;
                }

                // Get user ID from database by email
                const { data: userData, error: userDataError } = await supabase
                    .schema("me_dataspace")
                    .from("users")
                    .select("userID")
                    .eq("emailID", user.email)
                    .single();

                if (userDataError) {
                    console.error("User lookup error:", userDataError);
                    setError("User not found");
                    setLoading(false);
                    return;
                }

                if (!userData) {
                    console.error("User not found in database");
                    setError("User data not available");
                    setLoading(false);
                    return;
                }

                const userID = userData.userID;

                // Fetch participated events (registered_as = 'attended')
                const { data: participations, error: participationError } = await supabase
                    .schema("me_dataspace")
                    .from("event_participation")
                    .select("event_id, created_at")
                    .eq("participant_id", userID)
                    .eq("registered_as", "attended");

                if (participationError) {
                    console.error("Participation fetch error:", participationError);
                    setError("Failed to fetch participated events");
                    setLoading(false);
                    return;
                }

                if (!participations || participations.length === 0) {
                    setParticipatedEvents([]);
                    setLoading(false);
                    return;
                }

                // Get event details for all participated events
                const eventIds = participations.map((p) => p.event_id);
                const { data: events, error: eventsError } = await supabase
                    .schema("me_dataspace")
                    .from("events")
                    .select("eventID, title, description, fromDateTime")
                    .in("eventID", eventIds);

                if (eventsError) {
                    console.error("Events fetch error:", eventsError);
                    setError("Failed to fetch event details");
                    setLoading(false);
                    return;
                }

                // Merge participation data with event data
                const merged = participations.map((participation) => {
                    const event = (events || []).find(
                        (e) => e.eventID === participation.event_id
                    );
                    return {
                        id: participation.event_id,
                        participatedAt: participation.created_at,
                        title: event?.title || "Unknown Event",
                        description: event?.description || "",
                        date: event?.fromDateTime || null,
                    };
                });

                // Sort by participated date (most recent first)
                merged.sort(
                    (a, b) =>
                        new Date(b.participatedAt) - new Date(a.participatedAt)
                );

                setParticipatedEvents(merged);
                setLoading(false);
            } catch (err) {
                console.error("Unexpected error:", err);
                setError("An unexpected error occurred");
                setLoading(false);
            }
        };

        fetchParticipatedEvents();
    }, []);

    // Pagination logic
    const totalPages = Math.ceil(participatedEvents.length / EVENTS_PER_PAGE);
    const paginatedEvents = participatedEvents.slice(
        currentPage * EVENTS_PER_PAGE,
        (currentPage + 1) * EVENTS_PER_PAGE
    );

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-6 flex flex-col">
                <h2 className="text-2xl font-bold mb-4 text-[#8A7060]">
                    Participated Events
                </h2>
                <div className="flex items-center justify-center py-8">
                    <FaSpinner className="animate-spin text-[#A64200] text-2xl" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl p-6 flex flex-col">
                <h2 className="text-2xl font-bold mb-4 text-[#8A7060]">
                    Participated Events
                </h2>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-6 flex flex-col h-80">
            <h2 className="text-2xl font-bold mb-4 text-[#8A7060]">
                Participated Events
            </h2>

            {participatedEvents.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                    No participated events yet
                </p>
            ) : (
                <>
                    <div className="space-y-3 mb-4">
                        {paginatedEvents.map((event) => (
                            <div className=" ">
                                <div 
                                key={event.id}
                                className="flex justify-between border rounded-lg p-4 hover:shadow-md transition"
                            >
                                <h3 className="text-md font-bold text-[#A64200]">
                                    {event.title}
                                </h3>
                                {/* <p className="text-gray-600 text-sm line-clamp-1">
                                    {event.description}
                                </p> */}
                                {event.date && (
                                    <p className="text-sm text-gray-400 mt-1">
                                        {new Date(event.date).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t pt-4 gap-2">
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 0}
                                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition flex-shrink-0 ${
                                    currentPage === 0
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                <FaChevronLeft size={12} />
                                Previous
                            </button>

                            <div className="text-xs text-gray-600 whitespace-nowrap">
                                {currentPage + 1} / {totalPages}
                            </div>

                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages - 1}
                                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition flex-shrink-0 ${
                                    currentPage === totalPages - 1
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-[#A64200] text-white hover:bg-[#8a3600]"
                                }`}
                            >
                                Next
                                <FaChevronRight size={12} />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ParticipatedEventsSection;
