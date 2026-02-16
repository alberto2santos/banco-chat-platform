import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from './Common/Loading';

const PrivateRoute = () => {
    const { estaAutenticado, loading } = useAuth();

    if (loading) {
        return <Loading mensagem="Verificando autenticação..." />;
    }

    return estaAutenticado ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;