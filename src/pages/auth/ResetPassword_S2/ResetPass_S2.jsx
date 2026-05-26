import ResetPassMobile from "./ResetPassMobile_S2";
import ResetPassDesktop from "./ResetPassDesktop_S2";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { supabase } from "../../../services/supabase-client";

const ResetPass_S2 = () => {

    //form state
    const [form, setForm] = useState({
        newPass: "",
        confirmPass: ""
    });
    

    //validate form data
    const validate = () => {
        // format email validation properly
        const password = form.newPass.trim();
		const confirmPassword = form.confirmPass.trim();
		if (password.length < 8) return 'Password must be at least 8 characters long';
		if (password !== confirmPassword) return 'Passwords do not match';
        return null; // No errors
    };

    const [error, setError] = useState(null); // State to hold validation error messages
    const [recoveryReady, setRecoveryReady] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange(async (event) => {
            if (event === 'PASSWORD_RECOVERY') {
                setRecoveryReady(true);
            }

            if (event === 'SIGNED_OUT') {
                setRecoveryReady(false);
            }
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    // Handlie form submission
    const handleSubmit = async (e) => {
        e?.preventDefault();
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        if (!recoveryReady) {
            setError('Open the password reset link from your email first.');
            return;
        }

        setError(null);

        const { data, error } = await supabase.auth.updateUser({
            password: form.newPass,
        });

        if (error) {
            setError('There was an error updating your password.');
            return;
        }

        alert('Password updated successfully! Please sign in with your new password.');
        navigate('/signin');
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

export default ResetPass_S2;