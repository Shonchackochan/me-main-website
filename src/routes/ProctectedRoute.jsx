import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../services/supabase-client';
import { ROLE_HOME_PATHS, resolveUserRole } from '../services/authRoles';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [user, setUser] = useState(null); 
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

		if (user) {
			const resolvedRole = await resolveUserRole(user);
			setRole(resolvedRole);
		}
      setLoading(false);
    };

    checkUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  
  if (!user) return <Navigate to="/signin" />;

	if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
		return <Navigate to={ROLE_HOME_PATHS[role] || "/signin"} replace />;
	}
  
  return children;
};

export default ProtectedRoute;