import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formata data para exibição
 */
export const formatarData = (data, formato = 'dd/MM/yyyy') => {
    if (!data) return '';
    
    try {
        const date = typeof data === 'string' ? parseISO(data) : data;
        return format(date, formato, { locale: ptBR });
    } catch (error) {
        console.error('Erro ao formatar data:', error);
        return '';
    }
};

/**
 * Formata data e hora
 */
export const formatarDataHora = (data) => {
    return formatarData(data, 'dd/MM/yyyy HH:mm');
};

/**
 * Formata apenas hora
 */
export const formatarHora = (data) => {
    return formatarData(data, 'HH:mm');
};

/**
 * Formata distância de tempo (ex: "há 5 minutos")
 */
export const formatarDistancia = (data) => {
    if (!data) return '';
    
    try {
        const date = typeof data === 'string' ? parseISO(data) : data;
        return formatDistanceToNow(date, {
            addSuffix: true,
            locale: ptBR
        });
    } catch (error) {
        console.error('Erro ao formatar distância:', error);
        return '';
    }
};

/**
 * Formata data para mensagens (hoje, ontem, ou data)
 */
export const formatarDataMensagem = (data) => {
    if (!data) return '';
    
    try {
        const date = typeof data === 'string' ? parseISO(data) : data;
        const hoje = new Date();
        const ontem = new Date(hoje);
        ontem.setDate(ontem.getDate() - 1);
        
        // Se for hoje, mostra apenas hora
        if (date.toDateString() === hoje.toDateString()) {
            return formatarHora(date);
        }
        
        // Se foi ontem
        if (date.toDateString() === ontem.toDateString()) {
            return `Ontem às ${formatarHora(date)}`;
        }
        
        // Senão, mostra data completa
        return formatarDataHora(date);
        
    } catch (error) {
        console.error('Erro ao formatar data de mensagem:', error);
        return '';
    }
};

/**
 * Formata CPF
 */
export const formatarCPF = (cpf) => {
    if (!cpf) return '';
    
    const numeros = cpf.replace(/\D/g, '');
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Formata telefone
 */
export const formatarTelefone = (telefone) => {
    if (!telefone) return '';
    
    const numeros = telefone.replace(/\D/g, '');
    
    if (numeros.length === 11) {
        return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    
    if (numeros.length === 10) {
        return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    
    return telefone;
};

/**
 * Formata valor monetário
 */
export const formatarMoeda = (valor) => {
    if (valor === null || valor === undefined) return 'R$ 0,00';
    
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
};

/**
 * Formata número com separador de milhares
 */
export const formatarNumero = (numero, casasDecimais = 0) => {
    if (numero === null || numero === undefined) return '0';
    
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: casasDecimais,
        maximumFractionDigits: casasDecimais
    }).format(numero);
};

/**
 * Trunca texto longo
 */
export const truncarTexto = (texto, tamanho = 50) => {
    if (!texto) return '';
    if (texto.length <= tamanho) return texto;
    
    return texto.substring(0, tamanho) + '...';
};

/**
 * Capitaliza primeira letra
 */
export const capitalizarPrimeiraLetra = (texto) => {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
};

/**
 * Capitaliza cada palavra
 */
export const capitalizarPalavras = (texto) => {
    if (!texto) return '';
    
    return texto
        .toLowerCase()
        .split(' ')
        .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
        .join(' ');
};

/**
 * Remove acentos
 */
export const removerAcentos = (texto) => {
    if (!texto) return '';
    
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

/**
 * Formata tamanho de arquivo
 */
export const formatarTamanhoArquivo = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const tamanhos = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + tamanhos[i];
};

/**
 * Gera iniciais do nome
 */
export const gerarIniciais = (nome) => {
    if (!nome) return '?';
    
    const palavras = nome.trim().split(' ');
    
    if (palavras.length === 1) {
        return palavras[0].charAt(0).toUpperCase();
    }
    
    return (palavras[0].charAt(0) + palavras[palavras.length - 1].charAt(0)).toUpperCase();
};