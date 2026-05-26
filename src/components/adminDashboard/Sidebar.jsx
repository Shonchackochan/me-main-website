import { FaThLarge, FaImages, FaCalendarAlt, FaEnvelope, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase-client";

const Sidebar = () => {

    const navigate = useNavigate();

    //handles logout functionality
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        navigate("/signin");
    };


    const menu = [
        {
            title: "Overview",
            items: [
                {
                    label: "Dashboard",
                    icon: <FaThLarge />,
                    path: "/admin/dashboard",
                },
            ],
        },
        {
            title: "Content",
            items: [
                {
                    label: "Photo Gallery",
                    icon: <FaImages />,
                    path: "/admin/photogallery",
                },
                {
                    label: "Events",
                    icon: <FaCalendarAlt />,
                    path: "/admin/events",
                },
                {
                    label: "News Letter",
                    icon: <FaEnvelope />,
                    path: "/admin/newsletter",
                },
                {
                    label: "Calendar",
                    icon: <FaCalendarAlt />,
                    path: "/admin/calendar",
                },
            ],
        },
        {
            title: "Community",
            items: [
                {
                    label: "Volunteers",
                    icon: <FaUsers />,
                    path: "/admin/volunteers",
                },
            ],
        },
    ];

    return (
        <aside className="w-64 h-screen bg-[#2C1A0E] p-6 flex flex-col gap-8 text-white">
            {/* logo and name */}
            <div className="flex items-center gap-4">
                <div>
                    <img src="/brand/logo.jpeg" alt="logo" className="w-14 rounded-full" />
                </div>
                <div>
                    <h2 className="text-xl font-bold">Mind Empowered</h2>
                    <p className="text-[#E8954A]">Admin Panel</p>
                </div>
            </div>
            {/* menu items */}
            <hr></hr>
            <div>
                {menu.map((section, index) => (
                    <div key={index} className="flex flex-col gap-4">
                        <h3 className="text-sm">{section.title}</h3>
                        <ul>
                            {section.items.map((item, itemIndex) => (
                                <NavLink key={itemIndex} to={item.path} className={({ isActive }) =>
        `flex items-center gap-4 p-2 rounded-lg transition ${
            isActive
                ? "bg-[#C1622A] text-white"
                : "hover:bg-[#C1622A]/60"
        }`
    }>
                                    <span>{item.icon}</span>
                                    <span>{item.label}</span>
                                </NavLink>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            {/* logout */}
            <div className="mt-auto">
                <button className="flex items-center justify-center p-2 bg-[#C1622A]  rounded-lg w-full " onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;