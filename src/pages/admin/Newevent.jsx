import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUpload } from "react-icons/fa";
import { supabase } from "../../services/supabase-client";

const AddEvent = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);

    const [form, setForm] = useState({
        title: "",
        description: "",
        agenda: "",
        eventURL: "",
        bannerAltText: "",
        startDate: "",
        startTime: "",
        endTime: "",
        venue: "",
        maxParticipants: "",
        registrationDeadline: "",
        volunteersNeeded: "",
        contactPerson: "",
    });

    const [volunteers, setVolunteers] = useState([]);
    const [volunteerInput, setVolunteerInput] = useState("");
    const [bannerFile, setBannerFile] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setBannerFile(file);
        setBannerPreview(URL.createObjectURL(file));
    };

    const handleVolunteerKeyDown = (e) => {
        if (e.key === "Enter" && volunteerInput.trim()) {
            e.preventDefault();
            setVolunteers([...volunteers, volunteerInput.trim()]);
            setVolunteerInput("");
        }
    };

    const removeVolunteer = (index) => {
        setVolunteers(volunteers.filter((_, i) => i !== index));
    };

    const handleSubmit = async (status) => {
        setLoading(true);

        try {
            const fromDateTime = new Date(`${form.startDate}T${form.startTime}`).toISOString();
            const toDateTime = new Date(`${form.startDate}T${form.endTime}`).toISOString();

            let bannerURL = null;

            // Upload banner to 'events' bucket
            if (bannerFile) {
                const fileExt = bannerFile.name.split('.').pop();
                const fileName = `banner_${Date.now()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('events')
                    .upload(fileName, bannerFile, { upsert: false });

                if (uploadError) throw uploadError;

                const { data } = supabase.storage
                    .from('events')
                    .getPublicUrl(fileName);

                bannerURL = data.publicUrl;
            }

            const { error } = await supabase
                .schema("me_dataspace")
                .from("events")
                .insert({
                    title: form.title,
                    description: form.description,
                    agenda: form.agenda || null,
                    eventURL: form.eventURL || null,
                    fromDateTime,
                    toDateTime,
                    venue: form.venue || null,
                    max_participants: form.maxParticipants ? parseInt(form.maxParticipants) : null,
                    reg_deadline: form.registrationDeadline || null,
                    max_volunteers: form.volunteersNeeded ? parseInt(form.volunteersNeeded) : null,
                    bannerURL: bannerURL,
                    bannerAltText: form.bannerAltText || form.title,
                    enabled: status === "publish",
                });

            setLoading(false);

            if (!error) {
                navigate("/admin/events");
            } else {
                console.error(error);
                alert("Failed to create event: " + error.message);
            }
        } catch (err) {
            setLoading(false);
            console.error("Error:", err);
            alert("Something went wrong: " + err.message);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F0E8]">

            {/* Topbar */}
            <div className="flex justify-between items-center px-6 py-3 bg-white border-b border-gray-100">
                <div>
                    <h1 className="text-xl font-semibold text-gray-800">Create New Event</h1>
                    <p className="text-xs text-gray-400">Fill in the details below to publish a new event for your community.</p>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-[#C1622A] text-white text-sm px-4 py-2 rounded-lg"
                >
                    Back
                </button>
            </div>

            <div className="p-6 grid grid-cols-3 gap-6">

                {/* Left — Event Details */}
                <div className="col-span-2 flex flex-col gap-6">

                    {/* Step 1 — Event Details Card */}
                    {step === 1 && (
                        <div className="bg-white rounded-xl p-6">
                            <h2 className="font-semibold text-gray-700 mb-4">Event Details</h2>

                            <label className="text-xs text-gray-500">Event Name *</label>
                            <input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="e.g. Starlet"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 mb-4 outline-none focus:border-[#C1622A]"
                            />

                            <label className="text-xs text-gray-500">Short Description *</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Description shown on the event card..."
                                rows={3}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 mb-4 outline-none focus:border-[#C1622A] resize-none"
                            />

                            <label className="text-xs text-gray-500">Full Details / Agenda</label>
                            <textarea
                                name="agenda"
                                value={form.agenda}
                                onChange={handleChange}
                                placeholder="Full event details, schedule, rules, etc."
                                rows={4}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 mb-4 outline-none focus:border-[#C1622A] resize-none"
                            />

                            <label className="text-xs text-gray-500">Event URL</label>
                            <input
                                name="eventURL"
                                value={form.eventURL}
                                onChange={handleChange}
                                placeholder="e.g. https://example.com/event"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 mb-4 outline-none focus:border-[#C1622A]"
                            />

                            {/* Banner Upload */}
                            <label className="text-xs text-gray-500">Event Banner</label>
                            <div className="mt-1 mb-2">
                                <label className="inline-flex items-center gap-2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-700 transition">
                                    <FaUpload size={12} /> Upload Photo
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleBannerChange}
                                    />
                                </label>
                                {bannerFile && (
                                    <p className="text-xs text-gray-400 mt-2">{bannerFile.name}</p>
                                )}
                            </div>

                            {/* Banner Preview */}
                            {bannerPreview && (
                                <div className="mb-4">
                                    <p className="text-xs text-gray-400 mb-1">Preview</p>
                                    <img
                                        src={bannerPreview}
                                        alt="Banner preview"
                                        className="w-full h-40 object-cover rounded-lg border border-gray-200"
                                    />
                                </div>
                            )}

                            <label className="text-xs text-gray-500">Banner Alt Text <span className="text-gray-300">optional</span></label>
                            <input
                                name="bannerAltText"
                                value={form.bannerAltText}
                                onChange={handleChange}
                                placeholder="Short description of the banner image"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 mb-4 outline-none focus:border-[#C1622A]"
                            />

                            <div className="flex justify-end">
                                <button
                                    className="bg-[#C1622A] text-white text-sm px-4 py-2 rounded-lg"
                                    onClick={() => setStep(2)}
                                >
                                    next
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2 — Date, Time & Location Card */}
                    {step === 2 && (
                        <div className="bg-white rounded-xl p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-lg">📅</span>
                                <h2 className="font-semibold text-gray-700">Date, Time & Location</h2>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="text-xs text-gray-500">Start Date *</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={form.startDate}
                                        onChange={handleChange}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-[#C1622A]"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Start Time</label>
                                    <input
                                        type="time"
                                        name="startTime"
                                        value={form.startTime}
                                        onChange={handleChange}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-[#C1622A]"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">End Time</label>
                                    <input
                                        type="time"
                                        name="endTime"
                                        value={form.endTime}
                                        onChange={handleChange}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-[#C1622A]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs text-gray-500">Venue / Location <span className="text-gray-300">optional</span></label>
                                    <input
                                        name="venue"
                                        value={form.venue}
                                        onChange={handleChange}
                                        placeholder="e.g. Community Hall, Kochi"
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-[#C1622A]"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Max Participants</label>
                                    <input
                                        name="maxParticipants"
                                        value={form.maxParticipants}
                                        onChange={handleChange}
                                        placeholder="e.g. 100"
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-[#C1622A]"
                                    />
                                </div>
                            </div>

                            <label className="text-xs text-gray-500">Registration Deadline</label>
                            <input
                                type="date"
                                name="registrationDeadline"
                                value={form.registrationDeadline}
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-[#C1622A]"
                            />

                            <button
                                className="bg-[#C1622A] text-white text-sm px-4 py-2 rounded-lg mt-4"
                                onClick={() => setStep(1)}
                            >
                                previous
                            </button>
                        </div>
                    )}
                </div>

                {/* Right — Volunteers + Actions */}
                <div className="flex flex-col gap-6">

                    {/* Assigned Volunteers */}
                    <div className="bg-white rounded-xl p-6">
                        <h2 className="font-semibold text-gray-700 mb-4">Assigned Volunteers</h2>

                        <label className="text-xs text-gray-500">Add Volunteers</label>
                        <input
                            value={volunteerInput}
                            onChange={(e) => setVolunteerInput(e.target.value)}
                            onKeyDown={handleVolunteerKeyDown}
                            placeholder="Type name and press Enter..."
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 mb-1 outline-none focus:border-[#C1622A]"
                        />
                        <p className="text-[10px] text-gray-400 mb-3">Press Enter after each volunteer name</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {volunteers.map((v, i) => (
                                <span key={i} className="bg-[#F5F0E8] text-[#C1622A] text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                    {v}
                                    <button onClick={() => removeVolunteer(i)} className="text-gray-400 hover:text-red-400">×</button>
                                </span>
                            ))}
                        </div>

                        <label className="text-xs text-gray-500">Volunteers Needed</label>
                        <input
                            name="volunteersNeeded"
                            value={form.volunteersNeeded}
                            onChange={handleChange}
                            placeholder="e.g. 10"
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 mb-4 outline-none focus:border-[#C1622A]"
                        />

                        <label className="text-xs text-gray-500">Contact Person</label>
                        <input
                            name="contactPerson"
                            value={form.contactPerson}
                            onChange={handleChange}
                            placeholder="Coordinator name"
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-[#C1622A]"
                        />
                    </div>

                    {/* Actions */}
                    <div className="bg-white rounded-xl p-6">
                        <h2 className="font-semibold text-gray-700 mb-4">Actions</h2>
                        <button
                            onClick={() => handleSubmit("publish")}
                            disabled={loading}
                            className="w-full bg-[#C1622A] text-white py-2 rounded-lg text-sm mb-3 hover:bg-[#a8521f] transition"
                        >
                            {loading ? "Publishing..." : "Publish Event"}
                        </button>
                        <button
                            onClick={() => handleSubmit("draft")}
                            disabled={loading}
                            className="w-full border border-gray-200 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
                        >
                            Save as Draft
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AddEvent;
