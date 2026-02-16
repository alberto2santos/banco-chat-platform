import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Container,
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    
    const [formData, setFormData] = useState({
        email: '',
        senha: ''
    });
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setErro('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErro('');

        const resultado = await login(formData.email, formData.senha);

        if (resultado.sucesso) {
            navigate('/chats');
        } else {
            setErro(resultado.erro);
        }

        setLoading(false);
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        🏦 Comunicação Bancária
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                        Faça login para acessar seus chats
                    </Typography>

                    {erro && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {erro}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            margin="normal"
                            required
                            autoFocus
                            disabled={loading}
                        />

                        <TextField
                            fullWidth
                            label="Senha"
                            name="senha"
                            type="password"
                            value={formData.senha}
                            onChange={handleChange}
                            margin="normal"
                            required
                            disabled={loading}
                        />

                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            size="large"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Entrar'}
                        </Button>

                        <Box textAlign="center">
                            <Typography variant="body2">
                                Não tem uma conta?{' '}
                                <Link to="/registro" style={{ textDecoration: 'none', color: '#1976d2' }}>
                                    Registre-se
                                </Link>
                            </Typography>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;