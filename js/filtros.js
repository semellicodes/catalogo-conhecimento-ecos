/**
 * Trabalha apenas sobre listas. Não conhece a tela nem o DOM.
 */

export const ATRIBUTOS_FILTRAVEIS = ['natureza', 'nivel', 'dimensao', 'tipoEcos', 'acaoGerencia'];

export const estadoVazio = () => ({
  busca: '',
  natureza: [],
  nivel: [],
  dimensao: [],
  tipoEcos: [],
  acaoGerencia: []
});

const normalizar = (texto) =>
  (texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

const comoLista = (valor) => (Array.isArray(valor) ? valor : [valor].filter(Boolean));

function casaAtributo(conhecimento, atributo, selecionados) {
  if (selecionados.length === 0) return true;
  const valores = comoLista(conhecimento[atributo]);
  return valores.some((v) => selecionados.includes(v));
}

function casaBusca(conhecimento, busca) {
  if (!busca.trim()) return true;
  const alvo = normalizar(
    [conhecimento.id, conhecimento.nome, conhecimento.descricao].join(' ')
  );
  return normalizar(busca)
    .split(/\s+/)
    .filter(Boolean)
    .every((termo) => alvo.includes(termo));
}

/** Aplica busca e filtros, devolvendo uma nova lista. */
export function aplicar(conhecimentos, estado) {
  return conhecimentos.filter(
    (c) =>
      casaBusca(c, estado.busca) &&
      ATRIBUTOS_FILTRAVEIS.every((a) => casaAtributo(c, a, estado[a]))
  );
}

/** Quantos conhecimentos da lista têm cada valor do atributo. */
export function contar(conhecimentos, atributo) {
  const contagem = new Map();
  conhecimentos.forEach((c) => {
    comoLista(c[atributo]).forEach((v) => contagem.set(v, (contagem.get(v) || 0) + 1));
  });
  return contagem;
}

/** Lê o estado a partir da query string, para que o link possa ser compartilhado. */
export function lerDaUrl(parametros) {
  const estado = estadoVazio();
  estado.busca = parametros.get('busca') || '';
  ATRIBUTOS_FILTRAVEIS.forEach((a) => {
    const valor = parametros.get(a);
    estado[a] = valor ? valor.split('|').filter(Boolean) : [];
  });
  return estado;
}

/** Escreve o estado em uma query string, omitindo o que está vazio. */
export function escreverNaUrl(estado, idAberto) {
  const parametros = new URLSearchParams();
  if (estado.busca.trim()) parametros.set('busca', estado.busca.trim());
  ATRIBUTOS_FILTRAVEIS.forEach((a) => {
    if (estado[a].length) parametros.set(a, estado[a].join('|'));
  });
  if (idAberto) parametros.set('id', idAberto);
  return parametros.toString();
}

export const temFiltroAtivo = (estado) =>
  Boolean(estado.busca.trim()) || ATRIBUTOS_FILTRAVEIS.some((a) => estado[a].length > 0);
