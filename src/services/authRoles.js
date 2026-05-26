import { supabase } from "./supabase-client";

export const ROLE_HOME_PATHS = {
	ADMIN: "/admin/dashboard",
	VOLUNTEER: "/volunteer-profile",
};

export const normalizeRole = (role) => {
	if (typeof role !== "string") return null;
	return role.trim().toUpperCase();
};

export const resolveUserRole = async (authUser) => {
	const metadataRole = normalizeRole(authUser?.user_metadata?.role || authUser?.app_metadata?.role);
	if (metadataRole) return metadataRole;

	const email = authUser?.email;
	if (!email) return null;

	const { data, error } = await supabase
		.schema("me_dataspace")
		.from("users")
		.select("role")
		.eq("emailID", email)
		.limit(1);

	if (error) return null;

	return normalizeRole(data?.[0]?.role);
};