import { useState } from "react";
import { FaGoogle, FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
const SigninDesktop = ({ form, setForm, error, handleSubmit }) => {
    const navigate = useNavigate();

    return (
        <div className="relative h-screen overflow-hidden flex items-center justify-center">
            {/* background gif */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/landing-bg.gif')" }}
            ></div>
            {/* overlay */}
            <div className="absolute inset-0 bg-white/20"></div>
            {/* right panel */}
            <div className="relative z-10 w-full flex items-center justify-center">

                {/* signin card */}
                <div
                    className="bg-white/10 backdrop-blur-lg text-[#A64200] w-[90%] sm:w-[80%] md:w-full max-w-xl px-6 sm:px-10 md:px-16 lg:px-20 py-8 sm:py-10 flex flex-col gap-2 sm:gap-4  md:gap-6 rounded-2xl">
                    <div>
                        {/* back button */}
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-400"
                        >
                            <FaArrowLeft />
                            Back
                        </button>
                        {/* logo */}
                        <div className="flex justify-center">
                            <img src="/brand/logo.jpeg" alt="Logo" className="w-20 sm:w-24 md:w-28 rounded-full" />
                        </div>
                    </div>

                    {/* welcome text */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">Welcome Back</h1>
                    <p className="text-sm sm:text-base text-center">Sign in to your account to continue</p>
                    {/* email field */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email"
                        >
                            Email address
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={form.email}
                            onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                            placeholder="Email"
                            className="w-full rounded-xl bg-white px-4 py-2 text-sm sm:text-base placeholder-[#BBA898] border border-[#A64200] outline-none focus:ring-2 focus:ring-orange-400" />
                    </div>
                    {/* password field */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={form.password}
                            onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                            placeholder="Password"
                            className="w-full rounded-xl bg-white px-4 py-2 text-sm sm:text-base placeholder-[#BBA898] border border-[#A64200] outline-none focus:ring-2 focus:ring-orange-400" />
                    </div>
                    {/*redirect to register page field and forgot password */}
                    <div className="flex flex-col sm:flex-row items-center justify-between">
                        {/* redirect to register page field */}
                        <div >
                            <p><Link to="/register" className="inline-block rounded px-2 py-1  hover:underline focus:outline-none focus:ring-2 focus:ring-orange-400 ">
                                Create an account
                            </Link></p>
                        </div>
                        {/* forgot password */}
                        <div>
                            <p><Link to="/reset-password" className="inline-block rounded px-2 py-1 hover:underline focus:outline-none focus:ring-2 focus:ring-orange-400">
                                Forgot your password?
                            </Link></p>
                        </div>
                    </div>
                    {/* error message */}
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    {/* signin button */}
                    <div>
                        <button
                            onClick={handleSubmit}
                            className="w-full rounded-xl bg-gradient-to-r from-[#A64200] to-[#F0B04C] px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400 text-white">
                            Sign In
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SigninDesktop;
