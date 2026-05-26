import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const ResetPassDesktop = ({ form, setForm, error, setError, handleSubmit }) => {
    const navigate = useNavigate();


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
                    {/* email field */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-[#7A6A5A]">Email address</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={form.email}
                            placeholder="Email"
                            onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                            className="w-full rounded-xl bg-white px-4 py-2 placeholder-[#BBA898] border border-[#E0D4C4] outline-none focus:ring-2 focus:ring-orange-400" />
                    </div>
                    {/* error message */}
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <button
                        onClick={handleSubmit}
                        className="w-full rounded-xl bg-gradient-to-r from-[#A64200] to-[#F0B04C] px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400 text-white">
                        Send Reset Link
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetPassDesktop;