import { useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const RegistrationDesktop = ({ form, setForm, error, handleSubmit, onRegisterStep2 }) => {

	const [step, setStep] = useState(1);//track current step of registration
	const [photoPreview, setPhotoPreview] = useState(null);
	const [photoFile, setPhotoFile] = useState(null);
	const [localError, setLocalError] = useState(null);
	const [step2Error, setStep2Error] = useState(null);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState(null);
	const snackbarTimeoutRef = useRef(null);

	const showSnackbar = (message) => {
		setSnackbarMessage(message);

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

	const validate = () => {
		// format email validation properly
		if (!form.firstName.trim()) return 'First name is required';
		if (!form.lastName.trim()) return 'Last name is required';
		if (!form.email.includes("@")) return 'Enter a valid email address';
		if (!form.phone.trim()) return 'Phone number is required';
		
		// Validate phone number - must be at least 10 digits
		const phoneDigitsOnly = form.phone.replace(/\D/g, '');
		if (phoneDigitsOnly.length < 10) return 'Phone number must have at least 10 digits';
		if (phoneDigitsOnly.length > 10) return 'Phone number must not exceed 10 digits';
		if (!/^\d+[-.\s]?\d+[-.\s]?\d+/.test(phoneDigitsOnly)) return 'Enter a valid phone number';
		
		const password = form.password.trim();
		const confirmPassword = form.confirmPassword.trim();
		
		// Password validation - must be at least 8 characters
		if (password.length < 8) return 'Password must be at least 8 characters long';
		
		// Password must contain at least one uppercase letter
		if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
		
		// Password must contain at least one digit
		if (!/[0-9]/.test(password)) return 'Password must contain at least one digit';
		
		// Password must contain at least one special character
		if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return 'Password must contain at least one special character (!@#$%^&*)';
		
		if (password !== confirmPassword) return 'Passwords do not match';
		return null; // No errors
	};

	const validateStep2 = () => {
		// Photo upload validation
		if (!photoFile) return 'Please upload a profile photo';

		// GitHub URL validation - only validate if provided
		if (form.github && form.github.trim()) {
			if (!form.github.includes('github.com')) return 'Please enter a valid GitHub profile URL (must include github.com)';
			try {
				new URL(form.github);
			} catch (e) {
				return 'Please enter a valid GitHub profile URL';
			}
		}

		// LinkedIn URL validation - only validate if provided
		if (form.linkedin && form.linkedin.trim()) {
			if (!form.linkedin.includes('linkedin.com')) return 'Please enter a valid LinkedIn profile URL (must include linkedin.com)';
			try {
				new URL(form.linkedin);
			} catch (e) {
				return 'Please enter a valid LinkedIn profile URL';
			}
		}

		return null; // No errors
	};

	const handleNext = () => {
		const validationError = validate();
		if (validationError) {
			setLocalError(validationError);
			showSnackbar(validationError);
			return;
		}
		setLocalError(null);
		setStep(2);
	};

	const handlePhotoUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			setPhotoFile(file);
			const reader = new FileReader();
			reader.onload = (event) => {
				setPhotoPreview(event.target.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const triggerPhotoUpload = () => {
		document.getElementById("photoInput").click();
	};

	const navigate = useNavigate();

	return (
		<>
			{snackbarMessage && (
				<div
					role="alert"
					aria-live="assertive"
					className="fixed bottom-6 left-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2 rounded-2xl bg-red-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-2xl"
				>
					{snackbarMessage}
				</div>
			)}
			{step === 1 && (
				<div className="relative flex min-h-screen overflow-x-hidden overflow-y-auto lg:h-screen lg:overflow-hidden">
					<div
						className="absolute inset-0 bg-cover bg-center bg-no-repeat"
						style={{ backgroundImage: "url('/landing-bg.gif')" }}
					></div>
					{/* overlay */}
					<div className="absolute inset-0 bg-black/80"></div>
					{/* left panel */}
					<div className="relative z-10 hidden w-1/2 p-6 pt-20 lg:block">
						{/* background gif */}
						<div
							className="absolute inset-0 bg-cover bg-center bg-no-repeat"
							style={{ backgroundImage: "url('/landing-bg.gif')" }}
						></div>
						<img src="/brand/logo.jpeg" alt="Logo" className="w-28 rounded-full" />
					</div>
					{/* right panel */}
					<div className="relative z-10 mx-auto my-6 flex w-[94%] max-w-2xl flex-col items-start justify-center gap-4 rounded-2xl bg-[#FAF6F1] p-6 sm:w-[88%] sm:gap-5 sm:p-8 md:my-8 md:p-10 lg:my-0 lg:h-full lg:w-1/2 lg:max-w-none lg:gap-6 lg:rounded-none lg:p-20">
						<div className="w-full flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-evenly ">

							{/* heading */}
							<h1 className="font-playfairdisplay bg-[#1A0D00] bg-clip-text text-3xl font-normal leading-[120%] text-transparent sm:text-4xl lg:h-[98px] lg:w-[565px] lg:text-[48px]">
								Register as a Volunteer
							</h1>
							{/* back button */}
							<button
								onClick={() => navigate(-1)}
								className="
							inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#7A3A00] hover:bg-[#8B3D00] text-white text-sm font-semibold tracking-wide uppercase
							transition-all duration-300 shadow-md hover:scale-105 outline-none focus:ring-2
							focus:ring-orange-400 self-start lg:absolute lg:right-10 lg:top-14"
							>
								<FaArrowLeft />
								Back
							</button>
						</div>

						{/* name container */}
						<div className="flex w-full flex-col gap-4 sm:flex-row">
							{/* first name */}
							<div className="flex w-full flex-col gap-2">
								<label htmlFor="firstName" className="text-[#7A6A5A]">
									First Name
								</label>
								<input
									type="text"
									name="firstName"
									id="firstName"
									value={form.firstName}
									onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
									placeholder="Your first name"
									className="w-full rounded-xl bg-[#FAF6F1] border border-[#E0D4C4] px-4 py-2 placeholder-[#BBA898] outline-none focus:ring-2 focus:ring-orange-400" />
							</div>
							{/* last name */}
							<div className="flex w-full flex-col gap-2">
								<label htmlFor="lastName" className="text-[#7A6A5A]">
									Last Name
								</label>
								<input
									id="lastName"
									type="text"
									name="lastName"
									value={form.lastName}
									onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
									placeholder="Your last name"
									className="w-full rounded-xl bg-[#FAF6F1] border border-[#E0D4C4] px-4 py-2 placeholder-[#BBA898] outline-none focus:ring-2 focus:ring-orange-400" />
							</div>
						</div>

						{/* email address container */}
						<div className="flex w-full flex-col gap-2">
							<label htmlFor="email" className="text-[#7A6A5A]">
								Email address
							</label>
							<input
								type="email"
								name="email"
								id="email"
								value={form.email}
								onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
								placeholder="Your email"
								className="w-full rounded-xl bg-[#FAF6F1] border border-[#E0D4C4] px-4 py-2 placeholder-[#BBA898] outline-none focus:ring-2 focus:ring-orange-400" />
						</div>

						{/* phone number container */}
						<div className="flex w-full flex-col gap-2">
							<label htmlFor="phone" className="text-[#7A6A5A]">
								Phone Number
							</label>
							<input
								type="text"
								name="phone"
								id="phone"
								value={form.phone}
								onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
								placeholder="Your phone number"
								className="w-full rounded-xl bg-[#FAF6F1] border border-[#E0D4C4] px-4 py-2 placeholder-[#BBA898] outline-none focus:ring-2 focus:ring-orange-400" />
						</div>

						{/* password container */}
						<div className="flex w-full flex-col gap-2">
							<label htmlFor="password" className="text-[#7A6A5A]">
								Password
							</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									name="password"
									id="password"
									value={form.password}
									onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
									placeholder="Create a password"
									className="w-full rounded-xl bg-[#FAF6F1] border border-[#E0D4C4] px-4 py-2 pr-12 placeholder-[#BBA898] outline-none focus:ring-2 focus:ring-orange-400" />
								<button
									type="button"
									onClick={() => setShowPassword(prev => !prev)}
									aria-label={showPassword ? "Hide password" : "Show password"}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A3A00] hover:text-[#A64200] outline-none"
								>
									{showPassword ? <FaEyeSlash /> : <FaEye />}
								</button>
							</div>
						</div>

						{/* confirm password container */}
						<div className="flex w-full flex-col gap-2">
							<label htmlFor="confirmPassword" className="text-[#7A6A5A]">
								Confirm Password
							</label>
							<div className="relative">
								<input
									type={showConfirmPassword ? "text" : "password"}
									name="confirmPassword"
									id="confirmPassword"
									value={form.confirmPassword}
									onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
									placeholder="Confirm your password"
								className="w-full rounded-xl bg-[#FAF6F1] border border-[#E0D4C4] px-4 py-2 pr-12 placeholder-[#BBA898] outline-none focus:ring-2 focus:ring-orange-400" />
								<button
									type="button"
									onClick={() => setShowConfirmPassword(prev => !prev)}
									aria-label={showConfirmPassword ? "Hide password" : "Show password"}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A3A00] hover:text-[#A64200] outline-none"
								>
									{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
								</button>
							</div>
				</div>

				{/* form error message */}
				{localError && <p className="text-red-400 text-sm font-semibold">{localError}</p>}

				{/* next button */}
				<button
					onClick={handleNext}
						className="w-full rounded-xl bg-[#7A3A00] px-4 py-2 hover:bg-[#8B3D00] text-white text-sm font-semibold tracking-wide uppercase transition-all duration-300
					shadow-lg hover:scale-105 outline-none ">Next</button>
					</div>
				</div>
			)}

			{/* second form */}
			{step === 2 && (
				<div className="relative flex min-h-screen overflow-x-hidden overflow-y-auto lg:h-screen lg:overflow-hidden">
					<div
						className="absolute inset-0 bg-cover bg-center bg-no-repeat"
						style={{ backgroundImage: "url('/landing-bg.gif')" }}
					></div>
					{/* overlay */}
					<div className="absolute inset-0 bg-black/80"></div>
					{/* left panel */}
					<div className="relative z-10 hidden w-1/2 p-6 pt-20 lg:block">
						{/* background gif */}
						<div
							className="absolute inset-0 bg-cover bg-center bg-no-repeat"
							style={{ backgroundImage: "url('/landing-bg.gif')" }}
						></div>
						<img src="/brand/logo.jpeg" alt="Logo" className="w-28 rounded-full" />
					</div>
					{/* right panel */}
					<div className="relative z-10 mx-auto my-6 flex w-[94%] max-w-2xl flex-col items-start justify-center gap-4 rounded-2xl bg-[#FAF6F1] p-6 sm:w-[88%] sm:gap-5 sm:p-8 md:my-8 md:p-10 lg:my-0 lg:h-full lg:w-1/2 lg:max-w-none lg:gap-6 lg:rounded-none lg:p-20">
						<div className="w-full flex items-center justify-between">
							{/* heading */}
							<h1 className="font-playfairdisplay bg-[#1A0D00] bg-clip-text text-3xl font-normal leading-[120%] text-transparent sm:text-4xl lg:h-[58px] lg:w-[565px] lg:text-[48px]">
								Complete Your Profile
							</h1>
							{/* back button */}
							<button
								onClick={() => setStep(1)}
								className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7A3A00] hover:bg-[#8B3D00] text-white text-xs font-semibold tracking-wide uppercase transition-all duration-300 shadow-md hover:scale-105 outline-none focus:ring-2 focus:ring-orange-400 sm:px-6 sm:py-3 sm:text-sm lg:absolute lg:right-10 lg:top-14"
							>
								<FaArrowLeft />
								Back
							</button>

						</div>

						{/* Upload Section */}
						<div className="w-full">
							<label className="text-[#7A6A5A] font-semibold mb-2 block">
								Upload Your Photo
							</label>

							{photoPreview && (
								<div className="mb-4">
									<img
										src={photoPreview}
										alt="Preview"
										className="w-32 h-32 rounded-xl object-cover border border-[#E0D4C4]"
									/>
								</div>
							)}

							<input
								id="photoInput"
								type="file"
								accept="image/*"
								onChange={handlePhotoUpload}
								className="hidden"
							/>

							<button
								onClick={triggerPhotoUpload}
								type="button"
								className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7A3A00] hover:bg-[#8B3D00] text-white text-sm font-semibold transition-all duration-300"
							>
								{photoPreview ? 'Change Photo' : 'Upload Photo'}
							</button>
						</div>

						{/* Github */}
						<div className="w-full">
							<div className="flex items-center gap-2 mb-2">
								<label className="text-[#7A6A5A] font-semibold">
									Github Profile
								</label>
								<span className="text-[#BBA898] text-sm">
									Optional
								</span>
							</div>
							<input
								type="text"
								name="github"
								value={form.github || ''}
								onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
								placeholder="Profile URL"
								className="w-full rounded-xl bg-[#FAF6F1] border border-[#E0D4C4] px-4 py-2 placeholder-[#BBA898] text-[#1A0D00] outline-none focus:ring-2 focus:ring-orange-400"
							/>
						</div>

						{/* Linkedin */}
						<div className="w-full">
							<div className="flex items-center gap-2 mb-2">
								<label className="text-[#7A6A5A] font-semibold">
									Linkedin Profile
								</label>
								<span className="text-[#BBA898] text-sm">
									Optional
								</span>
							</div>
							<input
								type="text"
								name="linkedin"
								value={form.linkedin || ''}
								onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
								placeholder="Profile URL"
								className="w-full rounded-xl bg-[#FAF6F1] border border-[#E0D4C4] px-4 py-2 placeholder-[#BBA898] text-[#1A0D00] outline-none focus:ring-2 focus:ring-orange-400"
							/>
						</div>

						{/* Bio */}
						<div className="w-full">
							<div className="flex items-center gap-2 mb-2">
								<label className="text-[#7A6A5A] font-semibold">
									Profile Bio
								</label>
								<span className="text-[#BBA898] text-sm">
									Optional
								</span>
							</div>
							<textarea
								name="bio"
								rows="4"
								value={form.bio || ''}
								onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
								placeholder="Tell more about yourself"
								className="w-full rounded-xl bg-[#FAF6F1] border border-[#E0D4C4] px-4 py-2 placeholder-[#BBA898] text-[#1A0D00] outline-none resize-none focus:ring-2 focus:ring-orange-400"
							></textarea>
						</div>

						{/* Register Button */}
						<button
							onClick={() => {
								const validationError = validateStep2();
								if (validationError) {
									setStep2Error(validationError);
									showSnackbar(validationError);
									return;
								}
								setStep2Error(null);
								onRegisterStep2(photoFile);
							}}
							className="w-full rounded-xl bg-[#7A3A00] px-4 py-2 hover:bg-[#8B3D00] text-white text-sm font-semibold tracking-wide uppercase transition-all duration-300 shadow-lg hover:scale-105 outline-none"
						>
							Register
						</button>

						{/* form error message */}
						{step2Error && <p className="text-red-400 text-sm font-semibold">{step2Error}</p>}
					</div>
				</div>
			)}
		</>
	);
};

export default RegistrationDesktop;