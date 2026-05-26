import { useNavigate } from "react-router-dom";
import { FaCalendarPlus, FaImage, FaUserPlus, FaPaperPlane, FaUsers, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase-client";
import UploadPhotoModal from "../../components/adminDashboard/UploadPhotoModal";
import Header from "../../components/profile/Header";
import AddVolunteerModal from "../../components/adminDashboard/AddVolunteerModal";


const Dashboard = () => {

    const quickActions = [
        { label: "Add Event", icon: FaCalendarPlus, path: "/admin/newevent" },
        { label: "Upload Photo", icon: FaImage, action: () => setShowUpload(true) },
        { label: "Add Volunteer", icon: FaUserPlus, action: () => setShowAddVolunteer(true) },
        { label: "Send Newsletter", icon: FaPaperPlane, path: "/admin/newsletter" },
    ];

    const navigate = useNavigate();

    const [showUpload, setShowUpload] = useState(false);
    const [showAddVolunteer, setShowAddVolunteer] = useState(false);

    const [volunteerCount, setVolunteerCount] = useState(0);
    const [eventCount, setEventCount] = useState(0);
    const [newThisWeek, setNewThisWeek] = useState(0);
    const [upcomingEventsCount, setUpcomingEventsCount] = useState(0);
    const [upcomingEvents, setUpcomingEvents] = useState([]);

    const fetchStats = async () => {
        //today's date in ISO format
        const today = new Date().toISOString();
        // date one week ago
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        // start of the year
        const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString();

        //to count volunteers
        const { count: volunteers } = await supabase
            .schema('me_dataspace')
            .from("users")
            .select("*", { count: "exact", head: true })
            .eq("role", "VOLUNTEER");

        //to count events
        const { count: eventscount } = await supabase
            .schema('me_dataspace')
            .from("events")
            .select("*", { count: "exact", head: true })
            .gte("fromDateTime", startOfYear);

        // to count new volunteers this week
        const { count: weeklyNew } = await supabase
            .schema('me_dataspace')
            .from("users")
            .select("*", { count: "exact", head: true })
            .gte("created_at", oneWeekAgo.toISOString());

        // to count upcoming events
        const { count: upcoming } = await supabase
            .schema('me_dataspace')
            .from("events")
            .select("*", { count: "exact", head: true })
            .gte("fromDateTime", today);

        // to get details of upcoming events    
        const { data: events } = await supabase
            .schema('me_dataspace')
            .from("events")
            .select("eventID, title, fromDateTime, toDateTime")
            .gte("fromDateTime", today)
            .order("fromDateTime", { ascending: true })
            .limit(3);

        setVolunteerCount(volunteers || 0);
        setEventCount(eventscount || 0);
        setNewThisWeek(weeklyNew || 0);
        setUpcomingEventsCount(upcoming || 0);
        setUpcomingEvents(events || []);
    };

    useEffect(() => {
        fetchStats();

    }, []);

    const handlePhotoUpload = async (file) => {
        // unique filename to avoid conflicts
        const fileName = `${Date.now()}-${file.name}`;

        // upload to storage bucket
        const { data, error: uploadError } = await supabase.storage
            .from("gallery")
            .upload(fileName, file);

        if (uploadError) {
            console.error("Upload error:", uploadError);
            return null;
        }

        // get public URL
        const { data: { publicUrl } } = supabase.storage
            .from("gallery")
            .getPublicUrl(fileName);

        return publicUrl;
    };

    return (
        <><Header bgcolour="bg-gradient-to-r from-[#C1622A] to-[#E49E5F]"
            tcolour="text-white" logout="hidden" />

            <div className="p-4">

                {/* Quick Actions */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {quickActions.map(({ label, icon: Icon, path, action }) => (
                        <button
                            key={label}
                            onClick={action || (() => navigate(path))}
                            className="bg-white rounded-xl p-6 flex flex-col items-center gap-2 hover:shadow-md transition"
                        >
                            <div className="bg-[#C1622A] text-white p-3 rounded-lg">
                                <Icon size={20} />
                            </div>
                            <span className="text-sm text-gray-600">{label}</span>
                        </button>
                    ))}
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-6 flex justify-between items-start">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Active Volunteers</p>
                            <h2 className="text-4xl font-bold text-gray-800">{volunteerCount}</h2>
                            <p className="text-green-600 text-xs mt-2">▲ {newThisWeek} joined this week</p>
                        </div>
                        <FaUsers className="text-[#C1622A] text-2xl opacity-40" />
                    </div>
                    <div className="bg-white rounded-xl p-6 flex justify-between items-start">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Events This Year</p>
                            <h2 className="text-4xl font-bold text-gray-800">{eventCount}</h2>
                            <p className="text-green-600 text-xs mt-2">▲ {upcomingEventsCount} upcoming</p>
                        </div>
                        <FaCalendarAlt className="text-[#C1622A] text-2xl opacity-40" />
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white rounded-xl p-6 ">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-700">Upcoming Events</h3>

                    </div>
                    <div className="flex flex-col gap-3 overflow-auto max-h-[70vh]">
                        {upcomingEvents.map((event) => (
                            <div key={event.eventID} className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg">
                                <div className="bg-[#C1622A] text-white text-center rounded-lg px-3 py-1 min-w-[48px]">
                                    <div className="text-lg font-bold leading-tight">
                                        {new Date(event.fromDateTime).getDate()}
                                    </div>
                                    <div className="text-[10px]">
                                        {new Date(event.fromDateTime).toLocaleString("default", { month: "short" }).toUpperCase()}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">{event.title}</p>
                                    <p className="text-xs text-gray-400 flex items-center gap-1">
                                        <FaClock size={10} />
                                        {new Date(event.fromDateTime).toLocaleTimeString("en-US", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Photo upload modal */}
                {showUpload && (
                    <UploadPhotoModal
                        onClose={() => setShowUpload(false)}
                        onSuccess={() => console.log("uploaded!")}
                    />
                )}
                {/* Add Volunteer Modal */}
                {showAddVolunteer && (
                    <AddVolunteerModal
                        onClose={() => setShowAddVolunteer(false)}
                        onSuccess={() => {
                            setShowAddVolunteer(false);
                            fetchStats(); // refresh volunteer count
                        }}
                    />
                )}

            </div>


        </>

    );
};

export default Dashboard;




