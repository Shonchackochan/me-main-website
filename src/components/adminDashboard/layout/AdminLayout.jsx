import Sidebar from "../Sidebar";
import Header from "../../profile/Header";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
    return (
        <div className="flex overflow-y-auto bg-[#F5F0E8]">
            <Sidebar />
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;