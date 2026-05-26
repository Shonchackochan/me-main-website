import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase-client";
import { FaSpinner, FaTimes, FaUsers, FaClock } from "react-icons/fa";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [volunteerCounts, setVolunteerCounts] = useState({});
  const [filter, setFilter] = useState("All");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  const [showVolunteersModal, setShowVolunteersModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredVolunteers, setRegisteredVolunteers] = useState([]);
  const [volunteersLoading, setVolunteersLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchVolunteerCounts = async (eventsList) => {
    try {
      const { data, error } = await supabase
        .schema("me_dataspace")
        .from("event_participation")
        .select("event_id")
        .eq("registered_as", "registered");
      if (error) throw error;
      const counts = {};
      eventsList.forEach((event) => {
        counts[event.eventID] = (data || []).filter(
          (r) => r.event_id === event.eventID,
        ).length;
      });
      setVolunteerCounts(counts);
    } catch (err) {
      console.error("Error fetching volunteer counts:", err);
    }
  };

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
      if (data) fetchVolunteerCounts(data);
    } catch (err) {
      setError(err.message || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      const { error } = await supabase
        .schema("me_dataspace")
        .from("events")
        .delete()
        .eq("eventID", id);
      if (error) throw error;
      setEvents(events.filter((e) => e.eventID !== id));
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    const pad = (n) => String(n).padStart(2, "0");
    const toDateStr = (d) =>
      d
        ? `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
        : "";
    const toTimeStr = (d) =>
      d ? `${pad(d.getHours())}:${pad(d.getMinutes())}` : "";
    const fromDT = event.fromDateTime ? new Date(event.fromDateTime) : null;
    const toDT = event.toDateTime ? new Date(event.toDateTime) : null;
    setEditFormData({
      title: event.title || "",
      description: event.description || "",
      agenda: event.agenda || "",
      venue: event.venue || "",
      max_participants: event.max_participants ?? "",
      max_volunteers: event.max_volunteers ?? "",
      bannerURL: event.bannerURL || "",
      bannerFile: null,
      reg_deadline: event.reg_deadline ? event.reg_deadline.split("T")[0] : "",
      fromDate: toDateStr(fromDT),
      fromTime: toTimeStr(fromDT),
      toDate: toDateStr(toDT),
      toTime: toTimeStr(toDT),
      enabled: event.enabled ?? true,
    });
    setEditError(null);
    setShowEditModal(true);
  };

  const handleEditInput = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBannerFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) =>
      setEditFormData((p) => ({
        ...p,
        bannerURL: ev.target.result,
        bannerFile: file,
      }));
    reader.readAsDataURL(file);
  };

  const uploadBanner = async (file, eventID) => {
    const ext = file.name.split(".").pop();
    const fileName = `event_banner_${eventID}_${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("events")
      .upload(fileName, file);
    if (error) throw new Error("Upload failed: " + error.message);
    return supabase.storage.from("events").getPublicUrl(fileName).data
      .publicUrl;
  };

  const handleSaveEdit = async () => {
    if (!editFormData.title.trim()) {
      setEditError("Title is required.");
      return;
    }
    setEditLoading(true);
    setEditError(null);
    try {
      let bannerURL = editingEvent.bannerURL || null;
      if (editFormData.bannerFile)
        bannerURL = await uploadBanner(
          editFormData.bannerFile,
          editingEvent.eventID,
        );
      else if (
        editFormData.bannerURL &&
        !editFormData.bannerURL.startsWith("data:")
      )
        bannerURL = editFormData.bannerURL;

      const fromDateTime = new Date(
        `${editFormData.fromDate}T${editFormData.fromTime}`,
      ).toISOString();
      const toDateTime = new Date(
        `${editFormData.toDate}T${editFormData.toTime}`,
      ).toISOString();

      const updates = {
        title: editFormData.title.trim(),
        description: editFormData.description.trim(),
        agenda: editFormData.agenda.trim() || null,
        venue: editFormData.venue.trim() || null,
        max_participants:
          editFormData.max_participants !== ""
            ? parseInt(editFormData.max_participants)
            : null,
        max_volunteers:
          editFormData.max_volunteers !== ""
            ? parseInt(editFormData.max_volunteers)
            : null,
        bannerURL,
        reg_deadline: editFormData.reg_deadline || null,
        fromDateTime,
        toDateTime,
        enabled: editFormData.enabled,
      };

      const { error } = await supabase
        .schema("me_dataspace")
        .from("events")
        .update(updates)
        .eq("eventID", editingEvent.eventID);
      if (error) throw error;
      setEvents(
        events.map((e) =>
          e.eventID === editingEvent.eventID ? { ...e, ...updates } : e,
        ),
      );
      setShowEditModal(false);
    } catch (err) {
      setEditError(err.message || "Failed to update");
    } finally {
      setEditLoading(false);
    }
  };

  const handleViewVolunteers = async (event) => {
    setSelectedEvent(event);
    setRegisteredVolunteers([]);
    setVolunteersLoading(true);
    setShowVolunteersModal(true);
    try {
      const { data: participations, error: pErr } = await supabase
        .schema("me_dataspace")
        .from("event_participation")
        .select("id, participant_id, created_at")
        .eq("event_id", event.eventID)
        .eq("registered_as", "registered");
      if (pErr) throw pErr;
      if (!participations?.length) {
        setVolunteersLoading(false);
        return;
      }
      const ids = participations.map((p) => p.participant_id);
      const { data: users, error: uErr } = await supabase
        .schema("me_dataspace")
        .from("users")
        .select("userID, firstName, lastName, emailID, photo")
        .in("userID", ids);
      if (uErr) throw uErr;
      setRegisteredVolunteers(
        participations.map((p) => {
          const user = (users || []).find((u) => u.userID === p.participant_id);
          return {
            participationId: p.id,
            registeredAt: p.created_at,
            ...(user || { firstName: "Unknown", lastName: "", emailID: "—" }),
          };
        }),
      );
    } catch (err) {
      alert("Failed to fetch volunteers: " + err.message);
    } finally {
      setVolunteersLoading(false);
    }
  };

  const getStatus = (from, to) => {
    const now = new Date();
    if (new Date(from) > now) return "Upcoming";
    if (new Date(from) <= now && new Date(to) >= now) return "Ongoing";
    return "Completed";
  };

  const getDay = (dt) => (dt ? new Date(dt).getDate() : "");
  const getMonth = (dt) =>
    dt ? new Date(dt).toLocaleString("default", { month: "short" }) : "";
  const formatTime = (dt) =>
    dt
      ? new Date(dt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";
  const formatDate = (dt) =>
    dt
      ? new Date(dt).toLocaleDateString(undefined, { dateStyle: "medium" })
      : "—";

  const statusStyle = (s) =>
    s === "Ongoing"
      ? "text-green-600"
      : s === "Upcoming"
        ? "text-yellow-500"
        : "text-gray-400";

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
  const filteredEvents =
    filter === "All"
      ? events
      : events.filter(
          (e) => getStatus(e.fromDateTime, e.toDateTime) === filter,
        );

  const inputCls =
    "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C97736]";

  return (
    <div className="p-6 bg-[#F7F2EC] min-h-screen">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p className="font-medium">Error loading events</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchEvents}
            className="mt-2 px-4 py-1 bg-red-600 text-white rounded text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-12">
          <FaSpinner className="animate-spin text-[#A64200] text-3xl" />
        </div>
      )}

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-4 gap-4 mt-5">
          {[
            {
              label: "Total Events",
              count: totalEvents,
              color: "border-orange-400",
            },
            { label: "Ongoing", count: ongoingCount, color: "border-blue-400" },
            {
              label: "Upcoming",
              count: upcomingCount,
              color: "border-green-400",
            },
            {
              label: "Completed",
              count: completedCount,
              color: "border-purple-400",
            },
          ].map(({ label, count, color }) => (
            <div
              key={label}
              className={`bg-white p-4 rounded-xl border-t-4 ${color}`}
            >
              <p className="text-sm text-gray-500">{label}</p>
              <h1 className="text-3xl font-bold">{count}</h1>
            </div>
          ))}
        </div>
      )}

      {/* Filter Tabs */}
      {!loading && (
        <div className="flex gap-2 mt-5 bg-white rounded-xl px-4 py-2 border border-gray-100">
          {["All", "Ongoing", "Upcoming", "Completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                filter === f
                  ? "bg-[#F7F2EC] text-gray-700 border border-gray-200"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && filteredEvents.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200 mt-5">
          <p className="text-gray-500">
            No {filter !== "All" ? filter.toLowerCase() + " " : ""}events found
          </p>
        </div>
      )}

      {/* 2-column card grid */}
      {!loading && filteredEvents.length > 0 && (
        <div className="grid grid-cols-2 gap-5 mt-5 overflow-y-auto max-h-[60vh] pr-1">
          {filteredEvents.map((event) => {
            const status = getStatus(event.fromDateTime, event.toDateTime);
            const volunteerCount = volunteerCounts[event.eventID] || 0;

            return (
              <div
                key={event.eventID}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                {/* Card Header: date badge + title + status */}
                <div className="flex items-center justify-between px-4 pt-4 pb-2">
                  <div className="flex items-center gap-3">
                    {/* Date badge */}
                    <div className="flex flex-col items-center justify-center bg-[#F7F2EC] rounded-lg w-12 h-12 flex-shrink-0">
                      <span className="text-lg font-bold text-[#A64200] leading-none">
                        {getDay(event.fromDateTime)}
                      </span>
                      <span className="text-[10px] font-semibold text-gray-500 uppercase">
                        {getMonth(event.fromDateTime)}
                      </span>
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-800 text-base leading-tight">
                        {event.title}
                      </h2>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <FaClock size={10} />
                        <span>{formatTime(event.fromDateTime)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-xs font-semibold flex items-center gap-1 ${statusStyle(status)}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current inline-block"></span>
                      {status}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <FaUsers size={10} />
                      {volunteerCount}
                      {event.max_volunteers
                        ? `/${event.max_volunteers}`
                        : ""}{" "}
                      volunteers
                    </span>
                  </div>
                </div>

                {/* Card Body: thumbnail + description side by side */}
                <div className="flex gap-3 px-4 pb-3">
                  {event.bannerURL ? (
                    <img
                      src={event.bannerURL}
                      alt={event.title}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-300 text-xs">
                      No image
                    </div>
                  )}
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-4 flex-1">
                    {event.description}
                  </p>
                </div>

                {/* Card Footer: action buttons */}
                <div className="flex border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(event)}
                    className="flex-1 py-2.5 text-sm text-gray-600 hover:bg-gray-50 font-medium transition border-r border-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event.eventID)}
                    className="flex-1 py-2.5 text-sm text-gray-600 hover:bg-red-50 hover:text-red-500 font-medium transition border-r border-gray-100"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleViewVolunteers(event)}
                    className="flex-1 py-2.5 text-sm text-white bg-[#C97736] hover:bg-[#a85f27] font-medium transition"
                  >
                    View Volunteers
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Edit Event
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={18} />
              </button>
            </div>
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {editError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {editError}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Banner
                </label>
                {editFormData.bannerURL && (
                  <img
                    src={editFormData.bannerURL}
                    alt="preview"
                    className="w-full h-28 object-cover rounded-lg border border-gray-200 mb-2"
                  />
                )}
                <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-lg cursor-pointer hover:bg-gray-200">
                  Change Banner
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBannerFileChange}
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Title *
                </label>
                <input
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditInput}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditInput}
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Venue
                </label>
                <input
                  name="venue"
                  value={editFormData.venue}
                  onChange={handleEditInput}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Start Date & Time
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    name="fromDate"
                    value={editFormData.fromDate}
                    onChange={handleEditInput}
                    className={`${inputCls} flex-1`}
                  />
                  <input
                    type="time"
                    name="fromTime"
                    value={editFormData.fromTime}
                    onChange={handleEditInput}
                    className={`${inputCls} flex-1`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  End Date & Time
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    name="toDate"
                    value={editFormData.toDate}
                    onChange={handleEditInput}
                    className={`${inputCls} flex-1`}
                  />
                  <input
                    type="time"
                    name="toTime"
                    value={editFormData.toTime}
                    onChange={handleEditInput}
                    className={`${inputCls} flex-1`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Registration Deadline
                </label>
                <input
                  type="date"
                  name="reg_deadline"
                  value={editFormData.reg_deadline}
                  onChange={handleEditInput}
                  className={inputCls}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Max Participants
                  </label>
                  <input
                    type="number"
                    name="max_participants"
                    value={editFormData.max_participants}
                    onChange={handleEditInput}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Max Volunteers
                  </label>
                  <input
                    type="number"
                    name="max_volunteers"
                    value={editFormData.max_volunteers}
                    onChange={handleEditInput}
                    className={inputCls}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowEditModal(false)}
                disabled={editLoading}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-600 text-sm hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={editLoading}
                className="flex-1 py-2 bg-[#C97736] text-white rounded-lg text-sm hover:bg-[#a85f27] flex items-center justify-center gap-2"
              >
                {editLoading ? (
                  <>
                    <FaSpinner className="animate-spin" size={13} /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Volunteers Modal */}
      {showVolunteersModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Registered Volunteers
                </h2>
                <p className="text-sm text-gray-500">{selectedEvent.title}</p>
              </div>
              <button
                onClick={() => setShowVolunteersModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={18} />
              </button>
            </div>
            <div className="p-5 flex-1 overflow-y-auto">
              {volunteersLoading ? (
                <div className="flex justify-center py-8">
                  <FaSpinner className="animate-spin text-[#C97736] text-2xl" />
                </div>
              ) : registeredVolunteers.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No volunteers registered yet.
                </p>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-gray-400">
                    {registeredVolunteers.length} volunteer
                    {registeredVolunteers.length !== 1 ? "s" : ""}
                  </p>
                  {registeredVolunteers.map((v) => (
                    <div
                      key={v.participationId}
                      className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg bg-gray-50"
                    >
                      {v.photo ? (
                        <img
                          src={v.photo}
                          alt="profile"
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#C97736] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {v.firstName?.charAt(0)}
                          {v.lastName?.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-sm">
                          {v.firstName} {v.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {v.emailID}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(v.registeredAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-5 border-t border-gray-200">
              <button
                onClick={() => setShowVolunteersModal(false)}
                className="w-full py-2 bg-[#C97736] text-white rounded-lg text-sm hover:bg-[#a85f27]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
