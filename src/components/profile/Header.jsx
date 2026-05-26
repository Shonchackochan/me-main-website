import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase-client";
import { useState, useEffect } from "react";

const Header = ({bgcolour, tcolour, logout}) => {
    const navigate = useNavigate();

    //handles logout functionality
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        navigate("/signin");
    };


    return (
        <>
            <header className={`flex items-center justify-between p-4 ${bgcolour}`}>
                <h1 className={`text-2xl font-semibold ${tcolour}`}>Welcome Back </h1> 
                <button
                    className={`${logout} bg-[#F0B04C] text-white py-2 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 flex items-center gap-2`}
                    onClick={handleLogout}
                >
                    <FaSignOutAlt className="text-[#A64200]" />
                </button>
            </header>
        </>
    );
};

export default Header;