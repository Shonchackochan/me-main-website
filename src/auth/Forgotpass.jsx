import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const Forgotpass = () => {
    const navigate = useNavigate();

    //form state
    const [form, setForm] = useState({
        email: "",
    });

    //validate form data
    const validate = () => {
        // format email validation properly
        if (!form.email.includes("@")) return 'Enter a valid email address';
        return null; // No errors
    };

    const [error, setError] = useState(null); // State to hold validation error messages

    // Handlie form submission
    const handleSubmit = (e) => {
        e?.preventDefault();
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }
        setError(null);
    };

    return (
        <div className="relative flex h-screen overflow-hidden">
            {/* background gif */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/landing-bg.gif')" }}
            ></div>
            {/* overlay */}
            <div className="absolute inset-0 bg-black/80"></div>
            {/* left panel */}
            <div className="relative z-10 w-1/2 p-6 pt-20">
                <img src="/brand/logo.jpeg" alt="Logo" className="w-28 rounded-full" />
            </div>
            {/* right panel */}
            <div className="relative z-10 w-1/2 text-white flex items-center justify-center">
                {/* sign in card */}
                <div className="bg-white/20 text-white p-10 rounded-xl w-full max-w-md flex flex-col gap-6">
                    <div>
                        {/* back button */}
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-sm font-medium text-white/75 hover:text-white transition outline-none focus:ring-2 focus:ring-orange-400"
                        >
                            <FaArrowLeft />
                            Back
                        </button>
                        {/* heading */}
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#A64200] to-[#F0B04C] bg-clip-text text-transparent leading-tight">Reset Password</h1>
                    </div>
                    {/* email field */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email">Email address</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={form.email}
                            placeholder="Email"
                            onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }) )}
                            className="w-full rounded-xl bg-white/20 px-4 py-2 placeholder-white/50 outline-none focus:ring-2 focus:ring-orange-400" />
                    </div>
                    {/* error message */}
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <button
                    onClick={handleSubmit}
                    className="w-full rounded-xl bg-gradient-to-r from-[#A64200] to-[#F0B04C] px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400">
                        Send Reset Link
                    </button>
                </div>
            </div>
        </div>

    );
};

export default Forgotpass;