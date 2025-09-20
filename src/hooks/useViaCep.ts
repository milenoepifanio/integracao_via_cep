import { useState, useCallback, useRef } from 'react';
import { fetchViaCep, ViaCepResponse } from '../lib/viacep';

export interface UseViaCepReturn {
  loading: boolean;
  error: string | null;
  lastResult: ViaCepResponse | null;
  lookup: (cep: string) => Promise<void>;
  clearError: () => void;
}

/**
 * Hook para buscar dados de endereço via ViaCEP com debounce
 * @param debounceMs - Tempo de debounce em milissegundos (padrão: 400ms)
 * @returns Objeto com estado e funções para busca de CEP
 */
export function useViaCep(debounceMs: number = 400): UseViaCepReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<ViaCepResponse | null>(null);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const lookup = useCallback(async (cep: string) => {
    // Limpar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Limpar erro anterior
    setError(null);

    // Se CEP está vazio ou incompleto, não fazer busca
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length < 8) {
      setLastResult(null);
      return;
    }

    // Aplicar debounce
    timeoutRef.current = setTimeout(async () => {
      setLoading(true);
      
      try {
        const result = await fetchViaCep(cep);
        setLastResult(result);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar CEP';
        setError(errorMessage);
        setLastResult(null);
      } finally {
        setLoading(false);
      }
    }, debounceMs);
  }, [debounceMs]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    lastResult,
    lookup,
    clearError
  };
}
