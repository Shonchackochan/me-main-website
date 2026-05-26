import { useState } from "react";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const ResetPassDesktop = ({ form, setForm, error, setError, handleSubmit }) => {
    const navigate = useNavigate();
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);


    return (
        <div className="relative h-screen overflow-hidden flex items-center justify-center">
            {/* background gif */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/landing-bg.gif')" }}
            ></div>
            {/* overlay */}
            <div className="absolute inset-0 bg-white/10"></div>

            <div className="relative z-10 w-full flex items-center justify-center">
                {/* sign in card - responsive */}
                <div className="bg-white/10 backdrop-blur-lg text-[#A64200] w-[90%] sm:w-[80%] md:w-full max-w-xl px-6 sm:px-10 md:px-16 lg:px-20 py-8 sm:py-10 flex flex-col gap-4 rounded-2xl">
                    <div>
                        {/* back button */}
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-sm font-medium text-[#A64200]/90 hover:text-[#A64200] transition outline-none focus:ring-2 focus:ring-orange-400"
                        >
                            <FaArrowLeft />
                            Back
                        </button>
                        {/* heading */}
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">Reset Password</h1>
                    </div>
                    {/* password fields */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-[#7A6A5A]">Enter your new password</label>
                        <div className="relative">
                            <input
                            type={showNewPass ? "text" : "password"}
                            name="newPass"
                            id="newPass"
                            value={form.newPass}
                                placeholder="Your New Password"
                                onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                                className="w-full rounded-xl bg-white px-4 py-2 pr-12 placeholder-[#BBA898] border border-[#E0D4C4] outline-none focus:ring-2 focus:ring-orange-400" />
                            <button
                                type="button"
                                onClick={() => setShowNewPass(prev => !prev)}
                                aria-label={showNewPass ? "Hide password" : "Show password"}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A64200] hover:text-[#7A3A00] outline-none"
                            >
                                {showNewPass ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-[#7A6A5A]">Confirm your new password</label>
                        <div className="relative">
                            <input
                            type={showConfirmPass ? "text" : "password"}
                            name="confirmPass"
                            id="confirmPass"
                            value={form.confirmPass}
                                placeholder="Confirm Password"
                                onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                                className="w-full rounded-xl bg-white px-4 py-2 pr-12 placeholder-[#BBA898] border border-[#E0D4C4] outline-none focus:ring-2 focus:ring-orange-400" />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPass(prev => !prev)}
                                aria-label={showConfirmPass ? "Hide password" : "Show password"}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A64200] hover:text-[#7A3A00] outline-none"
                            >
                                {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>
                    {/* error message */}
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <button
                        onClick={handleSubmit}
                        className="w-full rounded-xl bg-gradient-to-r from-[#A64200] to-[#F0B04C] px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400 text-white">
                        Continue Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetPassDesktop;