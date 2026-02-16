import { Alert, AlertTitle, Button, Box } from '@mui/material';

const ErrorMessage = ({ titulo = 'Erro', mensagem, onTentarNovamente }) => {
    return (
        <Box p={3}>
            <Alert
                severity="error"
                action={
                    onTentarNovamente && (
                        <Button color="inherit" size="small" onClick={onTentarNovamente}>
                            Tentar Novamente
                        </Button>
                    )
                }
            >
                <AlertTitle>{titulo}</AlertTitle>
                {mensagem || 'Ocorreu um erro inesperado. Tente novamente.'}
            </Alert>
        </Box>
    );
};

export default ErrorMessage;