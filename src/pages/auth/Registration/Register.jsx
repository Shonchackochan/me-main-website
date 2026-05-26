import  RegistrationDesktop  from './RegistrationDesktop';
import { useEffect, useRef, useState } from 'react';
import { supabase } from "../../../services/supabase-client";

const Register = () => {

	// form state
	const [form, setForm] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		password: "",
		confirmPassword: "",
		github: "",
		linkedin: "",
		bio: ""
	});

	const [error, setError] = useState(null);
	const [snackbarMessage, setSnackbarMessage] = useState(null);
	const [snackbarVariant, setSnackbarVariant] = useState("error");
	const snackbarTimeoutRef = useRef(null);

	const showSnackbar = (message) => {
		showSnackbarWithVariant(message, "error");
	};

	const showSnackbarWithVariant = (message, variant = "error") => {
		setSnackbarMessage(message);
		setSnackbarVariant(variant);

		if (snackbarTimeoutRef.current) {
			clearTimeout(snackbarTimeoutRef.current);
		}

		snackbarTimeoutRef.current = window.setTimeout(() => {
			setSnackbarMessage(null);
		}, 4000);
	};

	useEffect(() => {
		return () => {
			if (snackbarTimeoutRef.current) {
				clearTimeout(snackbarTimeoutRef.current);
			}
		};
	}, []);

	const registerForm = async (photoFile) => {
		try {
			let photoUrl = null;

			// Upload photo to Supabase Storage if provided
			if (photoFile) {
				const cleanFileName = photoFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");

				const fileName = `${Date.now()}_${cleanFileName}`;
				const { data, error } = await supabase.storage
					.from('profile')
					.upload(`users/${fileName}`, photoFile);

				if (error) {
					const message = "Failed to upload photo. Please try again.";
					setError(message);
					showSnackbar(message);
					return error;
				}

				// Get public URL of uploaded photo
				const { data: { publicUrl } } = supabase.storage
					.from('profile')
					.getPublicUrl(`users/${fileName}`);

				photoUrl = publicUrl;
				console.log("Photo uploaded successfully:", photoUrl);
			}

			// Prepare user data - trim all strings
			const userData = {
				firstName: form.firstName.trim(),
				lastName: form.lastName.trim(),
				phone: form.phone.trim(),
				socials: {
					github: form.github?.trim() || null,
					linkedin: form.linkedin?.trim() || null
				},
				photo: photoUrl,
				bio: form.bio?.trim() || null,
				role: "VOLUNTEER"
			};

			const { data, error } = await supabase.auth.signUp({
				email: form.email.trim(),
				password: form.password,
				options: {
					data: userData
				}
			});

			if (error) {
				// Duplicate email check
				if (
					error.message.includes("User already registered") ||
					error.message.includes("already exists")
				) {
					const message = "User already exists with this email address.";
					setError(message);
						showSnackbarWithVariant(message, "error");
						window.setTimeout(() => {
							window.location.href = "/signin";
						}, 1800);

					return error;
				}

				const message = `Registration failed: ${error.message}`;
				setError(message);
				showSnackbar(message);
				return error;
			}

			setError(null);
			showSnackbarWithVariant("Registration successful! Redirecting to sign in...", "success");
			window.setTimeout(() => {
				window.location.href = "/signin";
			}, 1800);

			return null;
		} catch (err) {
			const message = "An unexpected error occurred. Please try again.";
			setError(message);
			showSnackbar(message);
			return err;
		}
	}

	// Function to validate the form data before submission
	const validate = () => {
		if (!form.firstName.trim()) return 'First name is required';
		if (!form.lastName.trim()) return 'Last name is required';
		if (!form.email.includes("@")) return 'Enter a valid email address';
		if (!form.phone.trim()) return 'Phone number is required';
		const password = form.password.trim();
		const confirmPassword = form.confirmPassword.trim();
		if (password.length < 8) return 'Password must be at least 8 characters long';
		if (password !== confirmPassword) return 'Passwords do not match';
		return null;
	};

	// Handle form submission - Step 1 (validation only)
	const handleSubmit = async (e) => {
		e?.preventDefault();
		const validationError = validate();
		if (validationError) {
			setError(validationError);
			showSnackbar(validationError);
			return;
		}
		setError(null);
	};

	// Handle form submission - Step 2 (with photo)
	const handleRegisterStep2 = async (photoFileData) => {
		
		const result = await registerForm(photoFileData);
		if (result) {
			const message = result?.message || "Registration failed. Please try again.";
			showSnackbar(message);
		}
	};

	return (
		<>
			{snackbarMessage && (
				<div
					role="alert"
					aria-live="assertive"
					className={`fixed bottom-6 left-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2 rounded-2xl px-4 py-3 text-center text-sm font-semibold text-white shadow-2xl ${snackbarVariant === "success" ? "bg-emerald-600" : "bg-red-600"}`}
				>
					{snackbarMessage}
				</div>
			)}
			<div className="block">
				<RegistrationDesktop form={form} setForm={setForm} error={error} handleSubmit={handleSubmit} onRegisterStep2={handleRegisterStep2} />
			</div>
		</>
	);
};

export default Register;