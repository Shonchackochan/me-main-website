import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase-client";
import { FaSpinner } from "react-icons/fa";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .schema("me_dataspace")
        .from("events")
        .select("*")
        .order("fromDateTime", { ascending: true });

      if (error) throw error;

      setEvents(data || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err.message || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  // DELETE EVENT
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this event?");
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .schema("me_dataspace")
        .from("events")
        .delete()
        .eq("eventID", id);

      if (error) throw error;

      setEvents(events.filter((e) => e.eventID !== id));
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event: " + err.message);
    }
  };

  // EVENT STATUS
  const getStatus = (fromDate, toDate) => {
    const now = new Date();
    if (new Date(fromDate) > now) return "Upcoming";
    if (new Date(fromDate) <= now && new Date(toDate) >= now) return "Ongoing";
    return "Completed";
  };

  const formatDateTime = (dt) =>
    dt
      ? new Date(dt).toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "—";

  const formatDate = (dt) =>
    dt
      ? new Date(dt).toLocaleDateString(undefined, { dateStyle: "medium" })
      : "—";

  // COUNTS
  const totalEvents = events.length;
  const ongoingCount = events.filter(
    (e) => getStatus(e.fromDateTime, e.toDateTime) === "Ongoing",
  ).length;
  const upcomingCount = events.filter(
    (e) => getStatus(e.fromDateTime, e.toDateTime) === "Upcoming",
  ).length;
  const completedCount = events.filter(
    (e) => getStatus(e.fromDateTime, e.toDateTime) === "Completed",
  ).length;

  return (
    <div className="p-6 bg-[#F7F2EC] min-h-screen">
      {/* Error State */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p className="font-medium">Error loading events</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchEvents}
            className="mt-2 px-4 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <FaSpinner className="animate-spin text-[#A64200] text-3xl" />
        </div>
      )}

      {/* Statistics */}
      {!loading && (
        <div className="grid grid-cols-4 gap-4 mt-5">
          <div className="bg-white p-4 rounded-xl border-t-4 border-orange-400">
            <p className="text-sm text-gray-500">Total Events</p>
            <h1 className="text-3xl font-bold">{totalEvents}</h1>
          </div>
          <div className="bg-white p-4 rounded-xl border-t-4 border-blue-400">
            <p className="text-sm text-gray-500">Ongoing</p>
            <h1 className="text-3xl font-bold">{ongoingCount}</h1>
          </div>
          <div className="bg-white p-4 rounded-xl border-t-4 border-green-400">
            <p className="text-sm text-gray-500">Upcoming</p>
            <h1 className="text-3xl font-bold">{upcomingCount}</h1>
          </div>
          <div className="bg-white p-4 rounded-xl border-t-4 border-purple-400">
            <p className="text-sm text-gray-500">Completed</p>
            <h1 className="text-3xl font-bold">{completedCount}</h1>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && events.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200 mt-5">
          <p className="text-gray-500 text-lg">No events found</p>
          <p className="text-gray-400 text-sm mt-1">
            Events will appear here once you create them
          </p>
        </div>
      )}

      {/* Events List */}
      {!loading && events.length > 0 && (
        <div className="grid grid-cols-2 gap-5 mt-6 overflow-auto max-h-[70vh]">
          {events.map((event) => {
            const status = getStatus(event.fromDateTime, event.toDateTime);
            const isRegistrationOpen =
              event.reg_deadline && new Date(event.reg_deadline) > new Date();

            return (
              <div
                key={event.eventID}
                className="bg-white rounded-xl overflow-hidden border border-gray-200"
              >
                {/* Top */}
                <div className="flex justify-between p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold text-lg">{event.title}</h2>
                      {/* enabled badge */}
                      {event.enabled !== undefined && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            event.enabled
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {event.enabled ? "Active" : "Disabled"}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {formatDateTime(event.fromDateTime)} →{" "}
                      {formatDateTime(event.toDateTime)}
                    </p>
                  </div>

                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        status === "Ongoing"
                          ? "bg-green-100 text-green-700"
                          : status === "Upcoming"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                </div>
                <div className="px-4 pb-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {/* Banner */}
                  <img
                    src={event.bannerURL}
                    alt={event.bannerAltText}
                    className="w-full h-44 object-cover"
                  />

                  {/* Meta details grid */}
                  <div className="px-4 pb-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    {/* Venue */}
                    {event.venue && (
                      <div>
                        <span className="text-gray-400 text-xs uppercase tracking-wide">
                          Venue
                        </span>
                        <p className="text-gray-700 font-medium truncate">
                          {event.venue}
                        </p>
                      </div>
                    )}

                    {/* Registration Deadline */}
                    {event.reg_deadline && (
                      <div>
                        <span className="text-gray-400 text-xs uppercase tracking-wide">
                          Reg. Deadline
                        </span>
                        <p
                          className={`font-medium ${isRegistrationOpen ? "text-gray-700" : "text-red-500"}`}
                        >
                          {formatDate(event.reg_deadline)}
                          {!isRegistrationOpen && (
                            <span className="ml-1 text-xs font-normal text-red-400">
                              (Closed)
                            </span>
                          )}
                        </p>
                      </div>
                    )}

                    {/* Max Volunteers */}
                    {event.max_volunteers != null && (
                      <div>
                        <span className="text-gray-400 text-xs uppercase tracking-wide">
                          Max Volunteers
                        </span>
                        <p className="text-gray-700 font-medium">
                          {event.max_volunteers}
                        </p>
                      </div>
                    )}
                  </div>
                  
                </div>
                {/* Buttons */}
                <div className="flex gap-3 p-4 pt-2">
                  <button className="flex-1 border rounded-lg py-2 hover:bg-gray-100">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event.eventID)}
                    className="flex-1 border rounded-lg py-2 hover:bg-red-100"
                  >
                    Delete
                  </button>
                  <button className="flex-1 bg-[#C97736] text-white rounded-lg py-2 hover:bg-[#a85f27]">
                    Add Volunteers
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Events;
