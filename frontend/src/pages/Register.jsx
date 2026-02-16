import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Container,
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
    const navigate = useNavigate();
    const { registro } = useAuth();
    
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        tipo: 'cliente'
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

    const validarFormulario = () => {
        if (formData.nome.length < 3) {
            setErro('Nome deve ter no mínimo 3 caracteres');
            return false;
        }

        if (formData.senha.length < 6) {
            setErro('Senha deve ter no mínimo 6 caracteres');
            return false;
        }

        if (formData.senha !== formData.confirmarSenha) {
            setErro('As senhas não coincidem');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validarFormulario()) {
            return;
        }

        setLoading(true);
        setErro('');

        const { confirmarSenha, ...dadosRegistro } = formData;
        const resultado = await registro(dadosRegistro);

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
                    justifyContent: 'center',
                    py: 3
                }}
            >
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        📝 Criar Conta
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                        Preencha os dados para criar sua conta
                    </Typography>

                    {erro && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {erro}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Nome completo"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            margin="normal"
                            required
                            autoFocus
                            disabled={loading}
                        />

                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            margin="normal"
                            required
                            disabled={loading}
                        />

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Tipo de usuário</InputLabel>
                            <Select
                                name="tipo"
                                value={formData.tipo}
                                onChange={handleChange}
                                label="Tipo de usuário"
                                disabled={loading}
                            >
                                <MenuItem value="cliente">Cliente</MenuItem>
                                <MenuItem value="gerente">Gerente</MenuItem>
                            </Select>
                        </FormControl>

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
                            helperText="Mínimo 6 caracteres"
                        />

                        <TextField
                            fullWidth
                            label="Confirmar senha"
                            name="confirmarSenha"
                            type="password"
                            value={formData.confirmarSenha}
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
                            {loading ? <CircularProgress size={24} /> : 'Criar Conta'}
                        </Button>

                        <Box textAlign="center">
                            <Typography variant="body2">
                                Já tem uma conta?{' '}
                                <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
                                    Faça login
                                </Link>
                            </Typography>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default Register;