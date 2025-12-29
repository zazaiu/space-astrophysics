import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
export const RoleGuard = ({ children, allowedRoles }) => {
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    if (!isAuthenticated || !user) {
        return _jsx(Navigate, { to: "/login" });
    }
    if (!allowedRoles.includes(user.role)) {
        return _jsx(Navigate, { to: "/" });
    }
    return _jsx(_Fragment, { children: children });
};
