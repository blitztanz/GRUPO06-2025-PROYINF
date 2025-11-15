import { useUser } from '../context/UserContext';
import { Navigate } from 'react-router-dom';

import PropTypes from 'prop-types';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.tipo)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string)
};