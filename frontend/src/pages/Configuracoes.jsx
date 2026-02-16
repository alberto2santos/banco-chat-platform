import { useState } from 'react';
import {
    Container,
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Switch,
    FormControlLabel,
    Divider,
    Alert
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const Configuracoes = () => {
    const { usuario } = useAuth();
    const [dados, setDados] = useState({
        nome: usuario?.nome || '',
        email: usuario?.email || '',
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: ''
    });
    const [notificacoes, setNotificacoes] = useState({
        email: true,
        push: false,
        som: true
    });
    const [mensagem, setMensagem] = useState('');

    const handleChange = (e) => {
        setDados({
            ...dados,
            [e.target.name]: e.target.value
        });
    };

    const handleNotificacoesChange = (e) => {
        setNotificacoes({
            ...notificacoes,
            [e.target.name]: e.target.checked
        });
    };

    const handleSalvar = () => {
        setMensagem('Configurações salvas com sucesso!');
        setTimeout(() => setMensagem(''), 3000);
    };

    return (
        <Container maxWidth="md">
            <Box py={4}>
                <Typography variant="h4" gutterBottom>
                    ⚙️ Configurações
                </Typography>

                {mensagem && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        {mensagem}
                    </Alert>
                )}

                {/* Dados Pessoais */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        👤 Dados Pessoais
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <TextField
                        fullWidth
                        label="Nome"
                        name="nome"
                        value={dados.nome}
                        onChange={handleChange}
                        margin="normal"
                    />

                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={dados.email}
                        onChange={handleChange}
                        margin="normal"
                    />
                </Paper>

                {/* Alterar Senha */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        🔐 Alterar Senha
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <TextField
                        fullWidth
                        label="Senha Atual"
                        name="senhaAtual"
                        type="password"
                        value={dados.senhaAtual}
                        onChange={handleChange}
                        margin="normal"
                    />

                    <TextField
                        fullWidth
                        label="Nova Senha"
                        name="novaSenha"
                        type="password"
                        value={dados.novaSenha}
                        onChange={handleChange}
                        margin="normal"
                    />

                    <TextField
                        fullWidth
                        label="Confirmar Nova Senha"
                        name="confirmarSenha"
                        type="password"
                        value={dados.confirmarSenha}
                        onChange={handleChange}
                        margin="normal"
                    />
                </Paper>

                {/* Notificações */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        🔔 Notificações
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={notificacoes.email}
                                onChange={handleNotificacoesChange}
                                name="email"
                            />
                        }
                        label="Notificações por Email"
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={notificacoes.push}
                                onChange={handleNotificacoesChange}
                                name="push"
                            />
                        }
                        label="Notificações Push"
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={notificacoes.som}
                                onChange={handleNotificacoesChange}
                                name="som"
                            />
                        }
                        label="Som de Notificação"
                    />
                </Paper>

                {/* Botão Salvar */}
                <Box textAlign="right">
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleSalvar}
                    >
                        Salvar Alterações
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Configuracoes;