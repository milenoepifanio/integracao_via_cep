# Integração via CEP

Biblioteca simples para consultar a API pública ViaCEP (https://viacep.com.br) e utilitários relacionados a CEPs.
Fornece:
- Função `fetchViaCep(cep)` para buscar os dados de endereço por CEP.
- Utilitários: `formatCep`, `isValidCep` e lista de UFs (`BRAZILIAN_STATES`).
- Hook React `useViaCep()` com debounce e estado (loading / error / lastResult) para uso em formulários.
## Conteúdo

- `src/lib/viacep.ts` — implementação das funções de chamada e validação.
- `src/hooks/useViaCep.ts` — hook React para buscas com debounce.
## Instalação

Este repositório é um pacote/implementação local em TypeScript. Para usar localmente no seu projeto, clone este repositório e instale dependências:
```powershell
git clone <repo-url>
cd "Integração via CEP"
npm install
```
Se for consumir os arquivos diretamente em um projeto TypeScript/React, importe os módulos a partir do caminho do projeto ou publique/adapte conforme necessário.
## Uso — Biblioteca (Node / Browser)

Exemplo mínimo usando as funções em `src/lib/viacep.ts`:
```ts
import { fetchViaCep, formatCep, isValidCep } from './src/lib/viacep';

async function exemplo() {
	const cep = '01001-000';

	if (!isValidCep(cep)) {
		console.error('CEP inválido');
		return;
	}

	try {
		const endereco = await fetchViaCep(cep);
		console.log(formatCep(endereco.cep), endereco.logradouro, endereco.bairro, endereco.localidade, endereco.uf);
	} catch (err) {
		console.error('Erro ao buscar CEP:', err);
	}
}

exemplo();
```
Observações:
- `fetchViaCep(cep: string)` retorna uma Promise com o objeto de resposta da API ViaCEP (campos como `cep`, `logradouro`, `bairro`, `localidade`, `uf`, etc.).
- `formatCep` formata strings de CEP para `99999-999`.
- `isValidCep` verifica se o CEP contém 8 dígitos válidos.
## Uso — Hook React (`useViaCep`)

O hook `useViaCep` facilita a integração em formulários, fornecendo debounce, loading e tratamento de erro.
Exemplo básico em um componente React:

```tsx
import React from 'react';
import { useViaCep } from './src/hooks/useViaCep';

export function CepInput() {
	const { loading, error, lastResult, lookup, clearError } = useViaCep(400);

	return (
		<div>
			<input
				placeholder="Digite o CEP"
				onChange={(e) => lookup(e.target.value)}
			/>

			{loading && <p>Buscando...</p>}
			{error && (
				<p>
					Erro: {error} <button onClick={clearError}>Limpar</button>
				</p>
			)}

			{lastResult && (
				<div>
					<p>{lastResult.logradouro}</p>
					<p>{lastResult.bairro} — {lastResult.localidade}/{lastResult.uf}</p>
				</div>
			)}
		</div>
	);
}
```
## API (resumo)

- fetchViaCep(cep: string): Promise<ViaCepResponse>
	- Busca os dados do CEP na API ViaCEP. Lança erro se CEP inválido ou não encontrado.

- formatCep(cep: string): string
	- Formata CEP para `99999-999`.

- isValidCep(cep: string): boolean
	- Verifica se o CEP tem 8 dígitos.

- useViaCep(debounceMs?: number)
	- Hook React que retorna { loading, error, lastResult, lookup, clearError }.

Tipos principais (conforme `src/lib/viacep.ts`):

- ViaCepResponse — objeto com campos: `cep`, `logradouro`, `complemento`, `bairro`, `localidade`, `uf`, `ibge`, `gia`, `ddd`, `siafi`.

## Testes

Este projeto não inclui uma suíte de testes por padrão. Para adicionar testes, recomendamos configurar Jest ou outra ferramenta compatível com TypeScript.

## Contribuição

Contribuições são bem-vindas. Abra uma issue descrevendo o problema ou feature desejada e, em seguida, envie um pull request.

Boas práticas:
- Mantenha as mudanças pequenas e focadas.
- Inclua tipos e testes quando adicionar lógica importante.

## Licença

MIT — consulte o arquivo LICENSE (ou adicione uma licença) se desejar publicar.

## Arquivos úteis no repositório

- `LICENSE.txt` — texto da licença MIT.
- `.gitignore` — regras para ignorar `node_modules`, builds, arquivos de ambiente e configurações de IDE.

## Contato

Se precisar de ajuda com a integração, descreva o cenário (framework, versão do React/Node, se há bundler) ao abrir uma issue.

