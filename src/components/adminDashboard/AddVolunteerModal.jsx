import { useState } from "react";
import { FaTimes, FaUserPlus } from "react-icons/fa";
import { supabaseAdmin } from "../../services/supabase-admin";

const AddVolunteerModal = ({ onClose, onSuccess }) => {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async () => {
        if (!form.firstName || !form.email) {
            setError("First name and email are required.");
            return;
        }

        setLoading(true);

        // step 1: create auth account
        const { data, error: signUpError } = await supabaseAdmin.auth.signUp({
            email: form.email,
            password: "MindEmpowered@2025",
            options: {
                data: {
                    firstName: form.firstName,
                    lastName: form.lastName,
                    role: "VOLUNTEER",
                }
            }
        });

        if (signUpError) {
            setError(signUpError.message);
            setLoading(false);
            return;
        }

        // step 2: insert into users table
        // const { error: dbError } = await supabaseAdmin
        //     .schema("me_dataspace")
        //     .from("users")
        //     .insert({
        //         userID: data.user.id,
        //         emailID: form.email,
        //         firstName: form.firstName,
        //         lastName: form.lastName || null,
        //         role: "VOLUNTEER",
        //     });


        setLoading(false);

        // ignore 409 — means data already saved fine
        // if (dbError && dbError.status !== 409) {
        //     setError("Account created but failed to save to database.");
        //     console.error(dbError);
        //     return;
        // }

        // if (dbError && dbError.code !== "23505" && dbError.status !== 409) {
        //     setError("Account created but failed to save to database.");
        //     setLoading(false);
        //     return;
        // }

        onSuccess?.();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">

                {/* close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <FaTimes />
                </button>

                {/* header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-[#C1622A] text-white p-2 rounded-lg">
                        <FaUserPlus size={16} />
                    </div>
                    <div>
                        <h2 className="font-semibold text-gray-800">Add Volunteer</h2>
                        <p className="text-xs text-gray-400">They'll receive an email to confirm their account</p>
                    </div>
                </div>

                {/* fields */}
                <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-gray-500">First Name *</label>
                            <input
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                placeholder="e.g. Maya"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-[#C1622A]"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500">Last Name</label>
                            <input
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                placeholder="e.g. Menon"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-[#C1622A]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-gray-500">Email *</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="e.g. maya@gmail.com"
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-[#C1622A]"
                        />
                    </div>

                    {/* temp password info */}
                    <div className="bg-[#F5F0E8] rounded-lg px-4 py-3">
                        <p className="text-xs text-gray-500">
                            A confirmation email will be sent to the volunteer. They can log in with:
                        </p>
                        <p className="text-xs text-gray-700 font-medium mt-1">
                            Password: <span className="text-[#C1622A]">MindEmpowered@2025</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            They can change it from their dashboard after logging in.
                        </p>
                    </div>

                    {/* error */}
                    {error && (
                        <p className="text-xs text-red-500">{error}</p>
                    )}
                </div>

                {/* submit */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-[#C1622A] text-white py-2 rounded-lg text-sm mt-5 hover:bg-[#a8521f] transition disabled:opacity-50"
                >
                    {loading ? "Adding Volunteer..." : "Add Volunteer"}
                </button>

            </div>
        </div>
    );
};

export default AddVolunteerModal;