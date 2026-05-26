import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase-client";
import { FaTimes, FaSpinner, FaChevronRight, FaChevronLeft } from "react-icons/fa";

const UpcomingEventsSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registerStatus, setRegisterStatus] = useState(null); // 'success' | 'error' | 'already'
  const [currentPage, setCurrentPage] = useState(0);
  const EVENTS_PER_PAGE = 3;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .schema("me_dataspace")
          .from("events")
          .select("*")
          .gt("fromDateTime", new Date().toISOString())
          .order("fromDateTime", { ascending: true });

        if (error) {
          console.log("Error fetching events:", error);
          setLoading(false);
          return;
        }

        setEvents(data || []);
      } catch (err) {
        console.error("Exception:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleVolunteerClick = (event) => {
    setSelectedEvent(event);
    setShowDetails(true);
    setRegisterStatus(null);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedEvent(null);
    setRegisterStatus(null);
  };

  const handleRegisterAsVolunteer = async () => {
    setRegistering(true);
    setRegisterStatus(null);

    try {
      // Get current logged-in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Auth User error:", userError);
        setRegisterStatus("error");
        setRegistering(false);
        return;
      }

      console.log("Auth User:", user.email);
      console.log("Event ID:", selectedEvent.eventID);

      // Get user info from database by email
      const { data: userData, error: userDataError } = await supabase
        .schema("me_dataspace")
        .from("users")
        .select("userID")
        .eq("emailID", user.email)
        .single();

      if (userDataError) {
        console.error("User lookup error:", userDataError);
        setRegisterStatus("error");
        setRegistering(false);
        return;
      }

      if (!userData) {
        console.error("User not found in database");
        setRegisterStatus("error");
        setRegistering(false);
        return;
      }

      console.log("User data:", userData);

      // FIXED: Check if user is already registered for this event BEFORE inserting
      const { data: existingRegistration, error: checkError } = await supabase
        .schema("me_dataspace")
        .from("event_participation")
        .select("id")
        .eq("participant_id", userData.userID)
        .eq("event_id", selectedEvent.eventID)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 means no rows found, which is what we want
        console.error("Check error:", checkError);
        setRegisterStatus("error");
        setRegistering(false);
        return;
      }

      // If a registration already exists, show already registered message
      if (existingRegistration) {
        console.log("User already registered for this event");
        setRegisterStatus("already");
        setRegistering(false);
        return;
      }

      console.log("Attempting to insert registration...");

      const { data: insertedData, error: insertError } = await supabase
        .schema("me_dataspace")
        .from("event_participation")
        .insert([
          {
            participant_id: userData.userID,
            event_id: selectedEvent.eventID,
            registered_as: "registered",
          },
        ])
        .select();

      if (insertError) {
        console.error("Insert error:", insertError);
        console.error("Error code:", insertError.code);
        console.error("Error message:", insertError.message);
        console.error("Full error object:", JSON.stringify(insertError));

        // Check if error is due to duplicate entry (unique constraint violation)
        if (
          insertError.code === "23505" ||
          insertError.message?.includes("duplicate") ||
          insertError.message?.includes("Duplicate")
        ) {
          console.log("Already registered - duplicate key");
          setRegisterStatus("already");
          setRegistering(false);
          return;
        }

        console.log("Other error - showing error status");
        setRegisterStatus("error");
        setRegistering(false);
        return;
      }

      console.log("Registration successful:", insertedData);
      setRegisterStatus("success");

      setTimeout(() => {
        closeDetails();
      }, 2000);
    } catch (err) {
      console.error("Unexpected error:", err);
      setRegisterStatus("error");
    } finally {
      setRegistering(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(events.length / EVENTS_PER_PAGE);
  const paginatedEvents = events.slice(
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

  if (loading) return <div>Loading events...</div>;

  return (
    <>
      <div className="bg-white rounded-2xl p-6 flex flex-col h-full">
        <h2 className="text-2xl font-bold mb-4 text-[#8A7060]">
          Upcoming Events
        </h2>

        {events.length === 0 ? (
          <p className="text-gray-600">No upcoming events</p>
        ) : (
          <>
            <div className="space-y-4 flex-1 mb-4">
              {paginatedEvents.map((event) => (
                <div
                  key={event.eventID}
                  className="border rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex gap-4">
                    {event.bannerURL && (
                      <img
                        src={event.bannerURL}
                        alt={event.title}
                        className="w-24 h-24 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 flex justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-[#A64200]">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {event.description}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          {new Date(event.fromDateTime).toLocaleDateString()} at{" "}
                          {new Date(event.fromDateTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <button
                        onClick={() => handleVolunteerClick(event)}
                        className="mt-3 px-4 py-2 bg-[#A64200] text-white rounded-xl hover:bg-[#8a3600] transition self-start"
                      >
                        Volunteer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t pt-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    currentPage === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FaChevronLeft size={14} />
                  Previous
                </button>

                <div className="text-sm text-gray-600">
                  Page {currentPage + 1} of {totalPages}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages - 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    currentPage === totalPages - 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-[#A64200] text-white hover:bg-[#8a3600]"
                  }`}
                >
                  Next
                  <FaChevronRight size={14} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Event Details Modal */}
      {showDetails && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-[#A64200]">
                {selectedEvent.title}
              </h2>
              <button
                onClick={closeDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {selectedEvent.bannerURL && (
                <img
                  src={selectedEvent.bannerURL}
                  alt={selectedEvent.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Description
                </h3>
                <p className="text-gray-700">{selectedEvent.description}</p>
              </div>

              {selectedEvent.fullDetails && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    Event Details
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedEvent.fullDetails}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600 text-sm font-medium">
                    Start Date & Time
                  </span>
                  <p className="text-gray-900 font-semibold">
                    {new Date(selectedEvent.fromDateTime).toLocaleDateString()}{" "}
                    at{" "}
                    {new Date(selectedEvent.fromDateTime).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" },
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm font-medium">
                    End Date & Time
                  </span>
                  <p className="text-gray-900 font-semibold">
                    {new Date(selectedEvent.toDateTime).toLocaleDateString()} at{" "}
                    {new Date(selectedEvent.toDateTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {selectedEvent.venue && (
                <div>
                  <span className="text-gray-600 text-sm font-medium">
                    Venue
                  </span>
                  <p className="text-gray-900 font-semibold">
                    {selectedEvent.venue}
                  </p>
                </div>
              )}

              {selectedEvent.reg_deadline && (
                <div>
                  <span className="text-gray-600 text-sm font-medium">
                    Registration Deadline
                  </span>
                  <p className="text-gray-900 font-semibold">
                    {new Date(selectedEvent.reg_deadline).toLocaleDateString()}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {selectedEvent.max_participants != null && (
                  <div>
                    <span className="text-gray-600 text-sm font-medium">
                      Max Participants
                    </span>
                    <p className="text-gray-900 font-semibold">
                      {selectedEvent.max_participants}
                    </p>
                  </div>
                )}
                {selectedEvent.max_volunteers != null && (
                  <div>
                    <span className="text-gray-600 text-sm font-medium">
                      Max Volunteers
                    </span>
                    <p className="text-gray-900 font-semibold">
                      {selectedEvent.max_volunteers}
                    </p>
                  </div>
                )}
              </div>

              {selectedEvent.eventURL && (
                <div>
                  <span className="text-gray-600 text-sm font-medium">
                    Event URL
                  </span>
                  <a
                    href={selectedEvent.eventURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[#A64200] font-semibold hover:underline break-all"
                  >
                    {selectedEvent.eventURL}
                  </a>
                </div>
              )}

              {selectedEvent.agenda && (
                <div>
                  <span className="text-gray-600 text-sm font-medium">
                    Agenda
                  </span>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedEvent.agenda}
                  </p>
                </div>
              )}

              {/* Status Messages */}
              {registerStatus === "success" && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium">
                  ✅ You have successfully registered as a volunteer!
                </div>
              )}
              {registerStatus === "already" && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm font-medium">
                  ⚠️ You are already registered for this event.
                </div>
              )}
              {registerStatus === "error" && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
                  ❌ Registration failed. Please make sure you are logged in and
                  try again.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
              <button
                onClick={closeDetails}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium"
              >
                Close
              </button>
              <button
                onClick={handleRegisterAsVolunteer}
                disabled={
                  registering ||
                  registerStatus === "success" ||
                  registerStatus === "already"
                }
                className={`flex-1 px-4 py-2 rounded-lg transition font-medium text-white flex items-center justify-center gap-2 ${
                  registerStatus === "success" || registerStatus === "already"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#A64200] hover:bg-[#8a3600]"
                }`}
              >
                {registering ? (
                  <>
                    <FaSpinner className="animate-spin" size={14} />
                    Registering...
                  </>
                ) : registerStatus === "success" ? (
                  "✓ Registered"
                ) : registerStatus === "already" ? (
                  "Already Registered"
                ) : (
                  "Register as Volunteer"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpcomingEventsSection;
