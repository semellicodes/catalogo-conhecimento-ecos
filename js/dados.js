/**
 * Único módulo que lê arquivos. Carrega os dados uma vez e resolve
 * os identificadores em objetos completos.
 */

/* Uma versão só para tudo que o navegador guarda em cache, dados, CSS e JS.
   Cada arquivo tinha a sua, elas desencontravam a cada mudança e o navegador
   servia metade nova e metade velha. O ferramentas/versionar.py troca esta
   linha e todas as outras de uma vez. */
const VERSAO = '20261104-62';

const ARQUIVOS = Object.fromEntries(
  ['meta', 'conhecimentos', 'desafios', 'estudos', 'classificacoes', 'referencias'].map(
    (nome) => [nome, `dados/${nome}.json?v=${VERSAO}`]
  )
);

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

/** Devolve o conhecimento com desafios e estudos já resolvidos em objetos. */
export function conhecimentoCompleto(dados, id) {
  const conhecimento = porId(dados.conhecimentos, id);
  if (!conhecimento) return null;
  return {
    ...conhecimento,
    desafiosResolvidos: (conhecimento.desafios || []).map((d) => porId(dados.desafios, d)).filter(Boolean),
    estudosResolvidos: conhecimento.estudos.map((e) => porId(dados.estudos, e)).filter(Boolean)
  };
}

/** Rótulo curto da referência, como aparece ao lado de um atributo. */
/* Rótulo curto de cada referência. A forma abreviada não sai da citação sozinha,
   porque "Nonaka e Takeuchi" e "Johnson et al." dependem de quantos autores a
   obra tem, então o rótulo fica escrito aqui, num lugar só, para a Estrutura e
   a ficha citarem igual. */
const ROTULOS_REFERENCIAS = {
  alavi2001: 'Alavi e Leidner (2001)',
  cartaxo2018: 'Cartaxo et al. (2018)',
  cartaxo2020: 'Cartaxo et al. (2020)',
  charmaz2006: 'Charmaz (2006)',
  davenport1998: 'Davenport e Prusak (1998)',
  johnson2020: 'Johnson et al. (2020)',
  kauschinger2021: 'Kauschinger et al. (2021)',
  /* Os três autores escritos por extenso, e não abreviados em et al., porque
     são três trabalhos de Kauschinger no catálogo e a camada de Gerência cita
     dois deles lado a lado. */
  kauschinger2023: 'Kauschinger, Münch e Schreieck (2023)',
  kauschinger2024: 'Kauschinger, Schreieck e Krcmar (2024)',
  manikas2016: 'Manikas (2016)',
  nonaka1997: 'Nonaka e Takeuchi (1997)',
  /* Sem autor e ano porque o manuscrito não está publicado. Quando sair, troca. */
  revisaoRapidaManuscrito: 'Revisão rápida deste trabalho',
  santos2011: 'Santos e Werner (2011)',
  santos2012: 'Santos et al. (2012)',
  seichter2010: 'Seichter et al. (2010)',
  viana2015: 'Viana e Conte (2015)',
  zaim2019: 'Zaim, Muhammed e Tarim (2019)'
};

export const rotuloDaReferencia = (chave) => ROTULOS_REFERENCIAS[chave] || chave;

/* O manuscrito da revisão fica nos dados como rastreabilidade interna, mas não
   integra a lista pública de referências enquanto não houver publicação. Sem
   verbete não há âncora, então quem cita essa chave escreve em texto, em vez de
   abrir um link que cairia no topo da página de referências. */
const SEM_VERBETE = new Set(['revisaoRapidaManuscrito']);

export const temVerbete = (chave) => !SEM_VERBETE.has(chave);

/* Uma referência é texto ou um par de texto e endereço. O endereço existe para
   as que têm DOI ou publicação oficial aberta, e quem desenha a lista decide se
   abre link. Aqui só se normaliza a forma, num lugar só. */
const verbete = (dados, chave) => {
  const bruto = dados.referencias[chave];
  return typeof bruto === 'string' ? { texto: bruto, url: '' } : bruto || { texto: '', url: '' };
};

export const citacaoDaReferencia = (dados, chave) => verbete(dados, chave).texto;
export const urlDaReferencia = (dados, chave) => verbete(dados, chave).url || '';

export function referenciaCurta(dados, chaves) {
  if (!chaves) return '';
  return chaves
    .split(',')
    .map((c) => {
      const chave = c.trim();
      if (ROTULOS_REFERENCIAS[chave]) return ROTULOS_REFERENCIAS[chave];
      const texto = citacaoDaReferencia(dados, chave);
      if (!texto) return '';
      const autor = texto.split(';')[0].split(',')[0].trim();
      const ano = (texto.match(/\b(19|20)\d{2}\b/) || [''])[0];
      const nome = autor.charAt(0) + autor.slice(1).toLowerCase();
      return ano ? `${nome} (${ano})` : nome;
    })
    .filter(Boolean)
    .join('; ');
}
