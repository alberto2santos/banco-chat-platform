/**
 * Valida email
 */
export const validarEmail = (email) => {
    if (!email) return false;
    
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

/**
 * Valida senha (mínimo 6 caracteres)
 */
export const validarSenha = (senha, minimo = 6) => {
    if (!senha) return false;
    return senha.length >= minimo;
};

/**
 * Valida senha forte (letra maiúscula, minúscula, número, caractere especial)
 */
export const validarSenhaForte = (senha) => {
    if (!senha || senha.length < 8) return false;
    
    const temMaiuscula = /[A-Z]/.test(senha);
    const temMinuscula = /[a-z]/.test(senha);
    const temNumero = /[0-9]/.test(senha);
    const temEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);
    
    return temMaiuscula && temMinuscula && temNumero && temEspecial;
};

/**
 * Valida CPF
 */
export const validarCPF = (cpf) => {
    if (!cpf) return false;
    
    const numeros = cpf.replace(/\D/g, '');
    
    if (numeros.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(numeros)) return false;
    
    // Validação dos dígitos verificadores
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(numeros.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digitoVerificador1 = resto === 10 || resto === 11 ? 0 : resto;
    
    if (digitoVerificador1 !== parseInt(numeros.charAt(9))) return false;
    
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(numeros.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digitoVerificador2 = resto === 10 || resto === 11 ? 0 : resto;
    
    return digitoVerificador2 === parseInt(numeros.charAt(10));
};

/**
 * Valida CNPJ
 */
export const validarCNPJ = (cnpj) => {
    if (!cnpj) return false;
    
    const numeros = cnpj.replace(/\D/g, '');
    
    if (numeros.length !== 14) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(numeros)) return false;
    
    // Validação simplificada dos dígitos verificadores
    let tamanho = numeros.length - 2;
    let numeros_base = numeros.substring(0, tamanho);
    let digitos = numeros.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros_base.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(0)) return false;
    
    tamanho = tamanho + 1;
    numeros_base = numeros.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros_base.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    return resultado == digitos.charAt(1);
};

/**
 * Valida telefone brasileiro
 */
export const validarTelefone = (telefone) => {
    if (!telefone) return false;
    
    const numeros = telefone.replace(/\D/g, '');
    
    // Aceita 10 dígitos (fixo) ou 11 dígitos (celular)
    return numeros.length === 10 || numeros.length === 11;
};

/**
 * Valida CEP
 */
export const validarCEP = (cep) => {
    if (!cep) return false;
    
    const numeros = cep.replace(/\D/g, '');
    return numeros.length === 8;
};

/**
 * Valida campo obrigatório
 */
export const validarObrigatorio = (valor) => {
    if (valor === null || valor === undefined) return false;
    if (typeof valor === 'string') return valor.trim().length > 0;
    return true;
};

/**
 * Valida comprimento mínimo
 */
export const validarTamanhoMinimo = (valor, minimo) => {
    if (!valor) return false;
    return valor.length >= minimo;
};

/**
 * Valida comprimento máximo
 */
export const validarTamanhoMaximo = (valor, maximo) => {
    if (!valor) return true; // Se vazio, não valida tamanho máximo
    return valor.length <= maximo;
};

/**
 * Valida número
 */
export const validarNumero = (valor) => {
    return !isNaN(parseFloat(valor)) && isFinite(valor);
};

/**
 * Valida número inteiro
 */
export const validarInteiro = (valor) => {
    return Number.isInteger(Number(valor));
};

/**
 * Valida número positivo
 */
export const validarPositivo = (valor) => {
    return validarNumero(valor) && Number(valor) > 0;
};

/**
 * Valida intervalo de valores
 */
export const validarIntervalo = (valor, minimo, maximo) => {
    if (!validarNumero(valor)) return false;
    const num = Number(valor);
    return num >= minimo && num <= maximo;
};

/**
 * Valida URL
 */
export const validarURL = (url) => {
    if (!url) return false;
    
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

/**
 * Valida data (não pode ser futura)
 */
export const validarDataPassada = (data) => {
    if (!data) return false;
    const dataInformada = new Date(data);
    const hoje = new Date();
    return dataInformada <= hoje;
};

/**
 * Valida data (não pode ser passada)
 */
export const validarDataFutura = (data) => {
    if (!data) return false;
    const dataInformada = new Date(data);
    const hoje = new Date();
    return dataInformada >= hoje;
};

/**
 * Valida formato de data (DD/MM/YYYY)
 */
export const validarFormatoData = (data) => {
    if (!data) return false;
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    return regex.test(data);
};

/**
 * Valida arquivo (extensão e tamanho)
 */
export const validarArquivo = (arquivo, extensoesPermitidas = [], tamanhoMaximoMB = 5) => {
    if (!arquivo) return false;
    
    // Valida extensão
    if (extensoesPermitidas.length > 0) {
        const extensao = arquivo.name.split('.').pop().toLowerCase();
        if (!extensoesPermitidas.includes(extensao)) {
            return { valido: false, erro: 'Extensão não permitida' };
        }
    }
    
    // Valida tamanho
    const tamanhoMaximoBytes = tamanhoMaximoMB * 1024 * 1024;
    if (arquivo.size > tamanhoMaximoBytes) {
        return { valido: false, erro: `Arquivo muito grande (máximo ${tamanhoMaximoMB}MB)` };
    }
    
    return { valido: true };
};

/**
 * Validação de formulário completo
 */
export const validarFormulario = (dados, regras) => {
    const erros = {};
    
    Object.keys(regras).forEach(campo => {
        const valor = dados[campo];
        const regra = regras[campo];
        
        if (regra.obrigatorio && !validarObrigatorio(valor)) {
            erros[campo] = 'Campo obrigatório';
            return;
        }
        
        if (regra.email && !validarEmail(valor)) {
            erros[campo] = 'Email inválido';
            return;
        }
        
        if (regra.senha && !validarSenha(valor, regra.senhaMinimo)) {
            erros[campo] = `Senha deve ter no mínimo ${regra.senhaMinimo || 6} caracteres`;
            return;
        }
        
        if (regra.cpf && !validarCPF(valor)) {
            erros[campo] = 'CPF inválido';
            return;
        }
        
        if (regra.telefone && !validarTelefone(valor)) {
            erros[campo] = 'Telefone inválido';
            return;
        }
        
        if (regra.minimo && !validarTamanhoMinimo(valor, regra.minimo)) {
            erros[campo] = `Mínimo de ${regra.minimo} caracteres`;
            return;
        }
        
        if (regra.maximo && !validarTamanhoMaximo(valor, regra.maximo)) {
            erros[campo] = `Máximo de ${regra.maximo} caracteres`;
            return;
        }
    });
    
    return {
        valido: Object.keys(erros).length === 0,
        erros
    };
};