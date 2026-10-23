// Funções utilitárias para validar o formato dos dados informados
// Usadas pelos services antes de salvar no banco

// CPF aceito com máscara (123.456.789-09) ou apenas com os 11 números (12345678909)
const FORMATO_CPF = /^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/;

// E-mail no formato usuario@dominio.extensao, sem espaços
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Data no formato ISO: AAAA-MM-DD
const FORMATO_DATA = /^(\d{4})-(\d{2})-(\d{2})$/;

// Remove tudo que não for número do CPF (pontos, traço e espaços)
export function normalizarCpf(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

// Verifica o formato do CPF e os dois dígitos verificadores
export function cpfValido(cpf: string): boolean {
  if (!FORMATO_CPF.test(cpf)) {
    return false;
  }

  const numeros = normalizarCpf(cpf);

  // CPFs com todos os dígitos iguais (111.111.111-11, etc.) passam no cálculo, mas são inválidos
  if (/^(\d)\1{10}$/.test(numeros)) {
    return false;
  }

  const digitos = numeros.split("").map(Number);

  // Calcula um dígito verificador a partir dos "quantidade" primeiros dígitos
  // Pesos decrescentes a partir de quantidade + 1; resto 10 vira 0
  const calcularDigito = (quantidade: number): number => {
    const soma = digitos
      .slice(0, quantidade)
      .reduce((total, digito, indice) => total + digito * (quantidade + 1 - indice), 0);
    return ((soma * 10) % 11) % 10;
  };

  return calcularDigito(9) === digitos[9] && calcularDigito(10) === digitos[10];
}

// Verifica se o e-mail está em um formato válido
export function emailValido(email: string): boolean {
  return FORMATO_EMAIL.test(email);
}

// Verifica se a data está no formato AAAA-MM-DD e se existe no calendário
// (rejeita, por exemplo, 2023-02-29 e 2024-04-31)
export function dataValida(data: string): boolean {
  const partes = FORMATO_DATA.exec(data);
  if (!partes) {
    return false;
  }

  const [, ano, mes, dia] = partes.map(Number);
  const date = new Date(Date.UTC(ano, mes - 1, dia));

  return (
    date.getUTCFullYear() === ano &&
    date.getUTCMonth() === mes - 1 &&
    date.getUTCDate() === dia
  );
}

// Verifica se a data (AAAA-MM-DD) é posterior ao dia de hoje
// Compara as datas como texto, o que funciona porque o formato ISO é ordenável
export function dataNoFuturo(data: string): boolean {
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  const hoje = `${agora.getFullYear()}-${mes}-${dia}`;

  return data > hoje;
}
