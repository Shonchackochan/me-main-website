import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase-client";
import { FaUser, FaSeedling, FaInstagram, FaGithub, FaLinkedin, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";


const ProfileCard = ({ user, onUserUpdate }) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        bio: user.bio || "",
        instagram: user.socials?.instagram || "",
        github: user.socials?.github || "",
        linkedin: user.socials?.linkedin || "",
        photoFile: null,
        photoPreview: null,
    });
    const [saving, setSaving] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {

            let photoUrl = user.photo;

            // Upload photo if a new one was selected
            if (formData.photoFile) {
                const fileExt = formData.photoFile.name.split('.').pop();
                const fileName = `${user.emailID}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('profile')  //bucket name
                    .upload(fileName, formData.photoFile, { upsert: true });

                if (uploadError) { console.error(uploadError); return; }

                const { data: urlData } = supabase.storage
                    .from('profile')
                    .getPublicUrl(fileName);

                photoUrl = urlData.publicUrl;
            }

            const { error } = await supabase
                .schema('me_dataspace')
                .from('users')
                .update({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    bio: formData.bio,
                    photo: photoUrl,
                    socials: {
                        instagram: formData.instagram,
                        github: formData.github,
                        linkedin: formData.linkedin,
                    }
                })
                .eq('emailID', user.emailID);

            if (error) { console.error(error); return; }

            onUserUpdate({
                ...user,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                bio: formData.bio,
                photo: photoUrl,        
                socials: {
                    instagram: formData.instagram,
                    github: formData.github,
                    linkedin: formData.linkedin,
                }
            });
            setIsEditOpen(false);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFormData(prev => ({
            ...prev,
            photoFile: file,
            photoPreview: URL.createObjectURL(file)
        }));
    };

    useEffect(() => {
        setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            bio: user.bio || "",
            instagram: user.socials?.instagram || "",
            github: user.socials?.github || "",
            linkedin: user.socials?.linkedin || "",
            photoFile: null,
            photoPreview: null,
        });
    }, [user]);

    return (
        <>
            <div className="bg-gradient-to-r from-[#7A4310] to-[#E49E5F] text-white rounded-3xl p-12 flex items-start justify-between">

                {/* Left: Avatar + Info */}
                <div className="flex gap-6 items-center">
                    <div className="w-20 h-20 rounded-full border-4 border-white flex-shrink-0 bg-white/20 flex items-center justify-center">
                        {user.photo ? (
                            <img src={user.photo} alt="Profile" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <FaUser className="text-2xl" />
                        )}
                    </div>
                    <div className="flex flex-col gap-4">
                        <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
                        <p className="text-white/80">{user.emailID}</p>
                        <div>
                            <span className="inline-block mt-2 px-3 py-1 bg-white text-[#7A3A00] rounded-full text-sm">
                                <FaSeedling className="inline text-green-500" />  {user.role}
                            </span>
                        </div>
                    </div>
                </div>
                {/* Right: Edit Profile Button */}
                <div className="flex flex-col gap-12">
                    <button
                        onClick={() => setIsEditOpen(true)}
                        className="px-4 py-2 border border-white rounded-full text-sm font-semibold hover:bg-white/10"
                    >
                        Edit profile
                    </button>
                    <div className="flex gap-4 mt-4 justify-between">
                        <a
                            href={user.socials?.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-80"
                        >
                            <FaInstagram className="text-2xl cursor-pointer" />
                        </a>
                        <a
                            href={user.socials?.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-80"
                        >
                            <FaGithub className="text-2xl cursor-pointer" />
                        </a>
                        <a
                            href={user.socials?.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-80"
                        >
                            <FaLinkedin className="text-2xl cursor-pointer" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Unified Edit Modal */}
            {isEditOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 w-[480px] shadow-lg max-h-[90vh] overflow-y-auto">
                        {/* Photo Upload */}
                        <div className="flex flex-col items-center gap-3 mb-2">
                            <div className="w-20 h-20 rounded-full border-4 border-[#F5EDE0] overflow-hidden bg-gray-100 flex items-center justify-center">
                                {formData.photoPreview || user.photo ? (
                                    <img
                                        src={formData.photoPreview || user.photo}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FaUser className="text-2xl text-gray-400" />
                                )}
                            </div>
                            <label className="cursor-pointer text-sm text-[#A64200] font-semibold hover:underline">
                                Change Photo
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handlePhotoChange}
                                />
                            </label>
                        </div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-[#A64200]">Edit Profile</h2>
                            <button onClick={() => setIsEditOpen(false)} className="text-gray-500 hover:text-black">
                                <FaTimes />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Name */}
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Basic Info</p>
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-[#8A7060] mb-1">First Name</label>
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64200]" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-[#8A7060] mb-1">Last Name</label>
                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64200]" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#8A7060] mb-1">Phone</label>
                                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64200]" />
                            </div>

                            {/* Bio */}
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider pt-2">About</p>
                            <textarea name="bio" value={formData.bio} onChange={handleInputChange}
                                placeholder="Tell us about yourself..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64200] h-28 resize-none" />

                            {/* Socials */}
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider pt-2">Socials</p>
                            {["instagram", "github", "linkedin"].map((platform) => (
                                <div key={platform}>
                                    <label className="block text-sm font-semibold text-[#8A7060] mb-1 capitalize">{platform}</label>
                                    <input type="text" name={platform} value={formData[platform]} onChange={handleInputChange}
                                        placeholder={`https://${platform}.com/...`}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64200]" />
                                </div>
                            ))}

                            <div className="flex gap-3 pt-4">
                                <button onClick={() => setIsEditOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                                    Cancel
                                </button>
                                <button onClick={handleSave} disabled={saving}
                                    className="flex-1 px-4 py-2 bg-[#A64200] text-white rounded-lg hover:bg-[#8B3600] disabled:opacity-50">
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfileCard;