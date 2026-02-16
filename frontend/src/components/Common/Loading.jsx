import { Box, CircularProgress, Typography } from '@mui/material';

const Loading = ({ mensagem = 'Carregando...' }) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            gap={2}
        >
            <CircularProgress size={50} />
            <Typography variant="body1" color="text.secondary">
                {mensagem}
            </Typography>
        </Box>
    );
};

export default Loading;