import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Divider,
    Box,
    Typography,
    Chip
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Chat as ChatIcon,
    People as PeopleIcon,
    Assessment as AssessmentIcon,
    Settings as SettingsIcon,
    Help as HelpIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const DRAWER_WIDTH = 260;

const Sidebar = ({ open, onClose, variant = 'temporary' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { usuario } = useAuth();

    const menuItems = [
        {
            text: 'Dashboard',
            icon: <DashboardIcon />,
            path: '/dashboard',
            badge: null
        },
        {
            text: 'Meus Chats',
            icon: <ChatIcon />,
            path: '/chats',
            badge: 5 // Mock - substituir por número real de chats ativos
        },
        {
            text: 'Contatos',
            icon: <PeopleIcon />,
            path: '/contatos',
            badge: null,
            gerente: true // Apenas para gerentes
        },
        {
            text: 'Relatórios',
            icon: <AssessmentIcon />,
            path: '/relatorios',
            badge: null,
            gerente: true // Apenas para gerentes
        }
    ];

    const menuSecundario = [
        {
            text: 'Configurações',
            icon: <SettingsIcon />,
            path: '/configuracoes'
        },
        {
            text: 'Ajuda',
            icon: <HelpIcon />,
            path: '/ajuda'
        },
        {
            text: 'Sobre',
            icon: <InfoIcon />,
            path: '/sobre'
        }
    ];

    const handleNavegar = (path) => {
        navigate(path);
        if (variant === 'temporary') {
            onClose();
        }
    };

    const estaAtivo = (path) => location.pathname === path;

    const podeVerItem = (item) => {
        if (item.gerente && usuario?.tipo !== 'gerente') {
            return false;
        }
        return true;
    };

    const conteudo = (
        <>
            <Toolbar />
            
            {/* Informações do Usuário (Mobile) */}
            {variant === 'temporary' && (
                <Box
                    sx={{
                        p: 2,
                        bgcolor: 'primary.main',
                        color: 'white',
                        display: { md: 'none' }
                    }}
                >
                    <Typography variant="subtitle1" fontWeight={600}>
                        {usuario?.nome}
                    </Typography>
                    <Typography variant="caption">
                        {usuario?.email}
                    </Typography>
                </Box>
            )}

            <Box sx={{ overflow: 'auto', height: '100%' }}>
                {/* Menu Principal */}
                <List sx={{ px: 1, pt: 2 }}>
                    {menuItems.filter(podeVerItem).map((item) => (
                        <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => handleNavegar(item.path)}
                                selected={estaAtivo(item.path)}
                                sx={{
                                    borderRadius: 2,
                                    '&.Mui-selected': {
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        '&:hover': {
                                            bgcolor: 'primary.dark'
                                        },
                                        '& .MuiListItemIcon-root': {
                                            color: 'white'
                                        }
                                    }
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: estaAtivo(item.path) ? 'white' : 'inherit',
                                        minWidth: 40
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontSize: 14,
                                        fontWeight: estaAtivo(item.path) ? 600 : 500
                                    }}
                                />
                                {item.badge && (
                                    <Chip
                                        label={item.badge}
                                        size="small"
                                        color={estaAtivo(item.path) ? 'secondary' : 'default'}
                                        sx={{ height: 20, fontSize: 11 }}
                                    />
                                )}
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                <Divider sx={{ mx: 2, my: 2 }} />

                {/* Menu Secundário */}
                <List sx={{ px: 1 }}>
                    {menuSecundario.map((item) => (
                        <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => handleNavegar(item.path)}
                                selected={estaAtivo(item.path)}
                                sx={{
                                    borderRadius: 2,
                                    '&.Mui-selected': {
                                        bgcolor: 'action.selected'
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontSize: 14,
                                        fontWeight: estaAtivo(item.path) ? 600 : 400
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                {/* Footer (Versão) */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        p: 2,
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="caption" color="text.secondary">
                        Versão 1.0.0
                    </Typography>
                </Box>
            </Box>
        </>
    );

    return (
        <>
            {/* Desktop Drawer (Permanent) */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                        borderRight: '1px solid',
                        borderColor: 'divider'
                    }
                }}
            >
                {conteudo}
            </Drawer>

            {/* Mobile Drawer (Temporary) */}
            <Drawer
                variant="temporary"
                open={open}
                onClose={onClose}
                ModalProps={{
                    keepMounted: true // Melhor performance no mobile
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box'
                    }
                }}
            >
                {conteudo}
            </Drawer>
        </>
    );
};

export default Sidebar;