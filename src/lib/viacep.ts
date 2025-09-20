/**
 * Utilitário para integração com a API gratuita da ViaCEP
 * https://viacep.com.br/ws/{CEP}/json/
 */

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export interface ViaCepError {
  erro: true;
}

/**
 * Busca dados de endereço pelo CEP na API ViaCEP
 * @param cep - CEP no formato 99999-999 ou 99999999
 * @returns Promise com os dados do endereço ou erro
 */
export async function fetchViaCep(cep: string): Promise<ViaCepResponse> {
  // Sanitizar CEP - remover caracteres não numéricos
  const cleanCep = cep.replace(/\D/g, '');
  
  // Validar se tem 8 dígitos
  if (cleanCep.length !== 8) {
    throw new Error('CEP deve ter 8 dígitos');
  }
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    
    const data: ViaCepResponse | ViaCepError = await response.json();
    
    // Verificar se a API retornou erro
    if ('erro' in data && data.erro) {
      throw new Error('CEP não encontrado');
    }
    
    return data as ViaCepResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erro ao buscar CEP. Tente novamente.');
  }
}

/**
 * Formata CEP para exibição (99999-999)
 * @param cep - CEP com ou sem formatação
 * @returns CEP formatado
 */
export function formatCep(cep: string): string {
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length <= 5) {
    return cleanCep;
  }
  return cleanCep.replace(/(\d{5})(\d{3})/, '$1-$2');
}

/**
 * Valida se o CEP está no formato correto
 * @param cep - CEP para validar
 * @returns true se válido, false caso contrário
 */
export function isValidCep(cep: string): boolean {
  const cleanCep = cep.replace(/\D/g, '');
  return cleanCep.length === 8 && /^\d{8}$/.test(cleanCep);
}

/**
 * Lista de UFs brasileiras para validação
 */
export const BRAZILIAN_STATES = [
  { code: 'AC', name: 'Acre' },
  { code: 'AL', name: 'Alagoas' },
  { code: 'AP', name: 'Amapá' },
  { code: 'AM', name: 'Amazonas' },
  { code: 'BA', name: 'Bahia' },
  { code: 'CE', name: 'Ceará' },
  { code: 'DF', name: 'Distrito Federal' },
  { code: 'ES', name: 'Espírito Santo' },
  { code: 'GO', name: 'Goiás' },
  { code: 'MA', name: 'Maranhão' },
  { code: 'MT', name: 'Mato Grosso' },
  { code: 'MS', name: 'Mato Grosso do Sul' },
  { code: 'MG', name: 'Minas Gerais' },
  { code: 'PA', name: 'Pará' },
  { code: 'PB', name: 'Paraíba' },
  { code: 'PR', name: 'Paraná' },
  { code: 'PE', name: 'Pernambuco' },
  { code: 'PI', name: 'Piauí' },
  { code: 'RJ', name: 'Rio de Janeiro' },
  { code: 'RN', name: 'Rio Grande do Norte' },
  { code: 'RS', name: 'Rio Grande do Sul' },
  { code: 'RO', name: 'Rondônia' },
  { code: 'RR', name: 'Roraima' },
  { code: 'SC', name: 'Santa Catarina' },
  { code: 'SP', name: 'São Paulo' },
  { code: 'SE', name: 'Sergipe' },
  { code: 'TO', name: 'Tocantins' }
] as const;

/**
 * Valida se a UF é válida 
 * @param uf - UF para validar
 * @returns true se válida, false caso contrário
 */
export function isValidUf(uf: string): boolean {
  return BRAZILIAN_STATES.some(state => state.code === uf.toUpperCase());
}