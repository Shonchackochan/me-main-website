import ResetPassMobile from "./ResetPassMobile";
import ResetPassDesktop from "./ResetPassDesktop";
import { useState } from "react";
import { supabase } from "../../../services/supabase-client";

const ResetPass = () => {

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

    const passwordReset = async () => {
        const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
            redirectTo: `${window.location.origin}/reset-password-step2`,
        });

        if (error) {
            console.log("Reset Password Failed: ", error);
            return;
        }

        console.log("Please check your email");
    }

    // Handlie form submission
    const handleSubmit = (e) => {
        e?.preventDefault();
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError(null);
        passwordReset();
    };

    return (
        <>
            <div className="hidden md:block">
                <ResetPassDesktop form={form} setForm={setForm} error={error} setError={setError} handleSubmit={handleSubmit} />
            </div>
            <div className="block md:hidden">
                <ResetPassMobile form={form} setForm={setForm} error={error} setError={setError} handleSubmit={handleSubmit} />
            </div>
        </>
    );
};

export default ResetPass;