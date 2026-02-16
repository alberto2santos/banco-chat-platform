import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Contexts
import { AuthProvider } from './context/AuthContext';

// Layouts
import MainLayout from './components/Layout/MainLayout';

// Pages - Públicas
import Login from './pages/Login';
import Register from './pages/Register';

// Pages - Privadas
import Dashboard from './pages/Dashboard';
import ChatList from './pages/ChatList';
import Configuracoes from './pages/Configuracoes';
import Ajuda from './pages/Ajuda';
import Sobre from './pages/Sobre';
import Relatorios from './pages/Relatorios';
import Contatos from './pages/Contatos';

// Components
import ChatRoom from './components/Chat/ChatRoom';
import PrivateRoute from './components/PrivateRoute';

// Estilos
import './App.css';

// Tema do Material-UI
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0'
        },
        secondary: {
            main: '#dc004e',
            light: '#e33371',
            dark: '#9a0036'
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff'
        }
    },
    typography: {
        fontFamily: [
            'Roboto',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Arial',
            'sans-serif'
        ].join(','),
        h4: {
            fontWeight: 700
        },
        h6: {
            fontWeight: 600
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                    fontWeight: 600
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12
                }
            }
        }
    }
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Rotas Públicas */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/registro" element={<Register />} />

                        {/* Rotas Privadas com Layout */}
                        <Route element={<PrivateRoute />}>
                            <Route element={<MainLayout />}>
                                {/* Dashboard */}
                                <Route path="/dashboard" element={<Dashboard />} />
                                
                                {/* Chats */}
                                <Route path="/chats" element={<ChatList />} />
                                <Route path="/chats/:chatId" element={<ChatRoom />} />
                                
                                {/* Páginas do Sistema */}
                                <Route path="/configuracoes" element={<Configuracoes />} />
                                <Route path="/ajuda" element={<Ajuda />} />
                                <Route path="/sobre" element={<Sobre />} />
                                <Route path="/relatorios" element={<Relatorios />} />
                                <Route path="/contatos" element={<Contatos />} />
                                
                                {/* Perfil (Placeholder) */}
                                <Route
                                    path="/perfil"
                                    element={
                                        <div style={{ padding: 24 }}>
                                            <h2>Meu Perfil</h2>
                                            <p>Página em construção...</p>
                                        </div>
                                    }
                                />

                                {/* Redirect padrão */}
                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                <Route path="*" element={<Navigate to="/dashboard" replace />} />
                            </Route>
                        </Route>
                    </Routes>
                </BrowserRouter>

                {/* Toast Notifications */}
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;