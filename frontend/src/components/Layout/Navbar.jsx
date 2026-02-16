import { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Box,
    Badge,
    Divider,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    Menu as MenuIcon,
    Notifications as NotificationsIcon,
    AccountCircle as AccountCircleIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { gerarIniciais } from '../../utils/formatters';

const Navbar = ({ onToggleSidebar }) => {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificacoesAnchor, setNotificacoesAnchor] = useState(null);

    const menuAberto = Boolean(anchorEl);
    const notificacoesAbertas = Boolean(notificacoesAnchor);

    const handleAbrirMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFecharMenu = () => {
        setAnchorEl(null);
    };

    const handleAbrirNotificacoes = (event) => {
        setNotificacoesAnchor(event.currentTarget);
    };

    const handleFecharNotificacoes = () => {
        setNotificacoesAnchor(null);
    };

    const handlePerfil = () => {
        handleFecharMenu();
        navigate('/perfil');
    };

    const handleConfiguracoes = () => {
        handleFecharMenu();
        navigate('/configuracoes');
    };

    const handleLogout = () => {
        handleFecharMenu();
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                {/* Menu Icon (Mobile) */}
                <IconButton
                    color="inherit"
                    edge="start"
                    onClick={onToggleSidebar}
                    sx={{ mr: 2, display: { md: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>

                {/* Logo e Título */}
                <Box display="flex" alignItems="center" flexGrow={1}>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                            fontWeight: 700,
                            letterSpacing: '.1rem',
                            cursor: 'pointer'
                        }}
                        onClick={() => navigate('/dashboard')}
                    >
                        🏦 Banco Chat
                    </Typography>
                    
                    <Box
                        sx={{
                            ml: 2,
                            px: 1,
                            py: 0.5,
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: 1,
                            display: { xs: 'none', sm: 'block' }
                        }}
                    >
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {usuario?.tipo === 'gerente' ? '👔 Gerente' : '👤 Cliente'}
                        </Typography>
                    </Box>
                </Box>

                {/* Ações da Direita */}
                <Box display="flex" alignItems="center" gap={1}>
                    {/* Notificações */}
                    <IconButton
                        color="inherit"
                        onClick={handleAbrirNotificacoes}
                        sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                    >
                        <Badge badgeContent={3} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    {/* Menu do Usuário */}
                    <IconButton
                        onClick={handleAbrirMenu}
                        sx={{ p: 0.5 }}
                    >
                        <Avatar
                            sx={{
                                bgcolor: 'secondary.main',
                                width: 40,
                                height: 40,
                                fontWeight: 600
                            }}
                        >
                            {gerarIniciais(usuario?.nome || 'Usuario')}
                        </Avatar>
                    </IconButton>
                </Box>

                {/* Menu do Usuário */}
                <Menu
                    anchorEl={anchorEl}
                    open={menuAberto}
                    onClose={handleFecharMenu}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                        sx: { width: 250, mt: 1.5 }
                    }}
                >
                    {/* Informações do Usuário */}
                    <Box px={2} py={1.5}>
                        <Typography variant="subtitle1" fontWeight={600}>
                            {usuario?.nome}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                            {usuario?.email}
                        </Typography>
                    </Box>

                    <Divider />

                    {/* Opções do Menu */}
                    <MenuItem onClick={handlePerfil}>
                        <ListItemIcon>
                            <PersonIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Meu Perfil</ListItemText>
                    </MenuItem>

                    <MenuItem onClick={handleConfiguracoes}>
                        <ListItemIcon>
                            <SettingsIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Configurações</ListItemText>
                    </MenuItem>

                    <Divider />

                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                        <ListItemIcon>
                            <LogoutIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        <ListItemText>Sair</ListItemText>
                    </MenuItem>
                </Menu>

                {/* Menu de Notificações */}
                <Menu
                    anchorEl={notificacoesAnchor}
                    open={notificacoesAbertas}
                    onClose={handleFecharNotificacoes}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                        sx: { width: 320, maxHeight: 400, mt: 1.5 }
                    }}
                >
                    <Box px={2} py={1.5}>
                        <Typography variant="h6" fontWeight={600}>
                            Notificações
                        </Typography>
                    </Box>

                    <Divider />

                    {/* Lista de Notificações (Mock) */}
                    <MenuItem onClick={handleFecharNotificacoes}>
                        <Box>
                            <Typography variant="body2" fontWeight={600}>
                                Nova mensagem de João Silva
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Há 5 minutos
                            </Typography>
                        </Box>
                    </MenuItem>

                    <MenuItem onClick={handleFecharNotificacoes}>
                        <Box>
                            <Typography variant="body2" fontWeight={600}>
                                Chat atribuído a você
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Há 20 minutos
                            </Typography>
                        </Box>
                    </MenuItem>

                    <MenuItem onClick={handleFecharNotificacoes}>
                        <Box>
                            <Typography variant="body2" fontWeight={600}>
                                Chat finalizado
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Há 1 hora
                            </Typography>
                        </Box>
                    </MenuItem>

                    <Divider />

                    <MenuItem
                        onClick={handleFecharNotificacoes}
                        sx={{ justifyContent: 'center', color: 'primary.main' }}
                    >
                        <Typography variant="body2" fontWeight={600}>
                            Ver todas
                        </Typography>
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;