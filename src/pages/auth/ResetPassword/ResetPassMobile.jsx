const ResetPassMobile = ({ form, setForm, error, setError, handleSubmit }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-start">
                {/* top panel */}
                <div className="relative w-full h-1/3 overflow-hidden">
                    <img src="/mobile.png" alt="" className="w-full h-full object-cover " />
                    {/* curve */}
                    <div className="absolute -bottom-12 left-0 w-full h-24 bg-white rounded-l-[100%]" />
                </div>
                {/* reset password form */}
                <div className="relative z-10 mx-auto w-[94%] max-w-md bg-white/10 backdrop-blur-lg text-[#A64200] px-6 py-6 rounded-2xl flex flex-col gap-6">
                {/* heading */}
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#A64200] to-[#F0B04C] bg-clip-text text-transparent leading-tight">Reset Password</h1>
                {/* email field */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                        placeholder="Your email address"
                        className="w-full rounded-xl bg-white px-4 py-2 placeholder-[#BBA898] border border-[#E0D4C4] outline-none focus:ring-2 focus:ring-orange-400" />
                </div>

                {/* error message */}
                {error && <p className="text-red-400 text-sm">{error}</p>}

                {/* reset button */}
                <div>
                    <button
                        onClick={handleSubmit}
                        className="w-full rounded-xl bg-gradient-to-r from-[#A64200] to-[#F0B04C] px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400 text-white"

                    >
                        Send Reset Link
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ResetPassMobile;