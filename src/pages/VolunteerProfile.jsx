// import Header from "../components/profile/Header";
// import ProfileCard from "../components/profile/ProfileCard";
// import AboutSection from "../components/profile/AboutSection";
// import SkillsSection from "../components/profile/SkillsSection";
// import UpcomingEventsSection from "../components/profile/UpcomingEventsSection";
// import ParticipatedEventsSection from "../components/profile/ParticipatedEventsSection";
// import { supabase } from "../services/supabase-client";
// import { useState, useEffect } from "react";

// const VolunteerProfile = () => {

//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const { data: { user: authUser } } = await supabase.auth.getUser();

//                 if (!authUser?.email) {
//                     console.log('No auth user found');
//                     setLoading(false);
//                     return;
//                 }

//                 // Query by email instead of userID
//                 const { data, error } = await supabase
//                     .schema('me_dataspace')
//                     .from('users')
//                     .select('*')
//                     .eq('emailID', authUser.email)  //  Use email
//                     .single();

//                 if (error) {
//                     console.log('Error fetching user:', error.message);
//                     setLoading(false);
//                     return;
//                 }

//                 setUser(data);
//             } catch (err) {
//                 console.error('Exception:', err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchUser();
//     }, []);

//     if (loading) return <div > loading </div>; 
//     if (!user) return <div>User not found</div>

//     return (
//         <div className="min-h-screen bg-[#F5EDE0] overflow-x-hidden">
//             <Header user={user} bgcolour="bg-[#FAF7F2]" tcolour="text-[#A64200]" logout="block" />
//             <main className="flex flex-col lg:flex-row lg:items-start lg:justify-center gap-6 px-4 py-6">
//                 <div className="w-full lg:w-2/3 lg:max-w-4xl mx-auto space-y-6 p-0 lg:p-6">
//                     <ProfileCard user={user} onUserUpdate={setUser} />
//                     <AboutSection user={user} onUserUpdate={setUser} />
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <SkillsSection user={user} />
//                         <ParticipatedEventsSection user={user} />

//                     </div>
//                 </div>
//                 <aside className="w-full lg:w-1/3 lg:max-w-md mx-auto p-0 lg:p-6">
//                     <UpcomingEventsSection user={user} />

//                 </aside>
//             </main>
//         </div>
//     );
// };

// export default VolunteerProfile;



import Header from "../components/profile/Header";
import ProfileCard from "../components/profile/ProfileCard";
import AboutSection from "../components/profile/AboutSection";
import SkillsSection from "../components/profile/SkillsSection";
import UpcomingEventsSection from "../components/profile/UpcomingEventsSection";
import ParticipatedEventsSection from "../components/profile/ParticipatedEventsSection";
import { supabase } from "../services/supabase-client";
import { useState, useEffect } from "react";

const VolunteerProfile = () => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data: { user: authUser } } = await supabase.auth.getUser();

                if (!authUser?.email) {
                    console.log('No auth user found');
                    setLoading(false);
                    return;
                }

                // Query by email instead of userID
                const { data, error } = await supabase
                    .schema('me_dataspace')
                    .from('users')
                    .select('*')
                    .eq('emailID', authUser.email)  //  Use email
                    .single();

                if (error) {
                    console.log('Error fetching user:', error.message);
                    setLoading(false);
                    return;
                }

                setUser(data);
            } catch (err) {
                console.error('Exception:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) return <div>loading</div>; 
    if (!user) return <div>User not found</div>

    return (
        <div className="min-h-screen bg-[#F5EDE0] flex flex-col overflow-hidden">
            {/* Fixed Header */}
            <Header user={user} bgcolour="bg-[#FAF7F2]" tcolour="text-[#A64200]" logout="block" />
            
            {/* Main Content - Scrollable */}
            <main className="flex-1 overflow-y-auto">
                <div className="flex flex-col lg:flex-row gap-6 px-4 py-6 max-w-7xl mx-auto">
                    {/* Left Column - Main Content */}
                    <div className="w-full lg:flex-1 space-y-6">
                        <ProfileCard user={user} onUserUpdate={setUser} />
                        <AboutSection user={user} onUserUpdate={setUser} />
                        
                        {/* Skills and Participated Events Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SkillsSection user={user} />
                            <ParticipatedEventsSection user={user} />
                        </div>
                    </div>

                    {/* Right Sidebar - Upcoming Events */}
                    <aside className="w-full lg:w-1/3 flex-shrink-0">
                        <UpcomingEventsSection user={user} />
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default VolunteerProfile;
