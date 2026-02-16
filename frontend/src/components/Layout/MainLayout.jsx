import { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MainLayout = () => {
    const [sidebarAberta, setSidebarAberta] = useState(false);

    const handleToggleSidebar = () => {
        setSidebarAberta(!sidebarAberta);
    };

    const handleFecharSidebar = () => {
        setSidebarAberta(false);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Navbar */}
            <Navbar onToggleSidebar={handleToggleSidebar} />

            {/* Sidebar */}
            <Sidebar
                open={sidebarAberta}
                onClose={handleFecharSidebar}
                variant="temporary"
            />

            {/* Conteúdo Principal */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minHeight: '100vh',
                    bgcolor: 'background.default'
                }}
            >
                <Toolbar /> {/* Espaçamento da Navbar */}
                <Outlet /> {/* Renderiza as páginas */}
            </Box>
        </Box>
    );
};

export default MainLayout;