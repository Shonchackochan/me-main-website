import { supabase } from "../../services/supabase-client";
import { useState } from "react";
import { FaTimes, FaEdit } from "react-icons/fa";

const AboutSection = ({ user}) => {
    
    return (
        <>
            <div className="bg-white text-[#8A7060] rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">About</h2>
                </div>
                <p className="text-gray-600">
                    {user?.bio || "Add a bio to tell others about yourself..."}
                </p>
            </div>

        </>
    );
};

export default AboutSection;