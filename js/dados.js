/**
 * Único módulo que lê arquivos. Carrega os dados uma vez e resolve
 * os identificadores em objetos completos.
 */

const ARQUIVOS = {
  meta: 'dados/meta.json',
  conhecimentos: 'dados/conhecimentos.json',
  solucoes: 'dados/solucoes.json',
  estudos: 'dados/estudos.json',
  classificacoes: 'dados/classificacoes.json',
  referencias: 'dados/referencias.json'
};

let promessa = null;

/* Um pedido que nunca responde é pior que um que falha, porque a página fica
   presa em Carregando sem dizer nada. É o que acontece ao abrir o site por um
   endereço onde o servidor não está, como localhost no celular. Com prazo, a
   espera vira erro, e erro já tem aviso na tela. */
const PRAZO = 10000;

async function lerJson(caminho) {
  const resposta = await fetch(caminho, { signal: AbortSignal.timeout(PRAZO) });
  if (!resposta.ok) {
    throw new Error(`Não foi possível carregar ${caminho} (${resposta.status})`);
  }
  return resposta.json();
}

/**
 * Carrega todos os arquivos de dados. O que fica guardado é a promessa, não só o
 * resultado, então dois módulos na mesma página compartilham a mesma leitura em
 * vez de disparar dois conjuntos de requisições.
 */
export function carregar() {
  if (!promessa) {
    const chaves = Object.keys(ARQUIVOS);
    promessa = Promise.all(chaves.map((k) => lerJson(ARQUIVOS[k])))
      .then((valores) => Object.fromEntries(chaves.map((k, i) => [k, valores[i]])))
      .catch((erro) => {
        /* Uma falha não pode ficar guardada para sempre, senão não há como tentar de novo. */
        promessa = null;
        throw erro;
      });
  }
  return promessa;
}

export const porId = (lista, id) => lista.find((item) => item.id === id) || null;

/** Devolve o conhecimento com soluções e estudos já resolvidos em objetos. */
export function conhecimentoCompleto(dados, id) {
  const conhecimento = porId(dados.conhecimentos, id);
  if (!conhecimento) return null;
  return {
    ...conhecimento,
    solucoesResolvidas: conhecimento.solucoes.map((s) => porId(dados.solucoes, s)).filter(Boolean),
    estudosResolvidos: conhecimento.estudos.map((e) => porId(dados.estudos, e)).filter(Boolean)
  };
}

/** Devolve a solução com os conhecimentos que ela apoia já resolvidos. */
export function solucaoCompleta(dados, id) {
  const solucao = porId(dados.solucoes, id);
  if (!solucao) return null;
  return {
    ...solucao,
    conhecimentosResolvidos: solucao.conhecimentos.map((c) => porId(dados.conhecimentos, c)).filter(Boolean),
    estudosResolvidos: solucao.estudos.map((e) => porId(dados.estudos, e)).filter(Boolean)
  };
}

/** Texto da referência a partir da chave, ou das chaves separadas por vírgula. */
export function referencia(dados, chaves) {
  if (!chaves) return '';
  return chaves
    .split(',')
    .map((c) => dados.referencias[c.trim()])
    .filter(Boolean)
    .join(' ');
}

/** Rótulo curto da referência, como aparece ao lado de um atributo. */
export function referenciaCurta(dados, chaves) {
  if (!chaves) return '';
  return chaves
    .split(',')
    .map((c) => {
      const texto = dados.referencias[c.trim()];
      if (!texto) return '';
      const autor = texto.split(';')[0].split(',')[0].trim();
      const ano = (texto.match(/\b(19|20)\d{2}\b/) || [''])[0];
      const nome = autor.charAt(0) + autor.slice(1).toLowerCase();
      return ano ? `${nome} (${ano})` : nome;
    })
    .filter(Boolean)
    .join('; ');
}

/** Um valor de atributo que ainda não foi preenchido na extração. */
export const vazio = (valor) =>
  valor === undefined || valor === null || valor === '' ||
  (Array.isArray(valor) && valor.length === 0);
