/**
 * Preenche a abertura, as portas de entrada por natureza e a explicação da
 * estrutura do catálogo.
 */

import { carregar } from './dados.js';
import { abrirAjuda } from './ficha.js';

const el = (seletor) => document.querySelector(seletor);

function criar(tag, className, texto) {
  const elemento = document.createElement(tag);
  if (className) elemento.className = className;
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
}

/** A contextualização fica acessível no botão de ajuda, sem alongar a abertura. */
function ajudaDasPortas(dados) {
  const conteudo = dados.meta.ajudas?.portasEntrada;
  const botao = el('#abrir-ajuda-portas');
  if (!conteudo || !botao) return;

  botao.addEventListener('click', () => abrirAjuda(dados, conteudo));
  botao.hidden = false;
}

/**
 * Uma porta de entrada por natureza epistemológica, que é a entrada principal
 * do catálogo. A contagem sai dos próprios conhecimentos e a descrição sai do
 * vocabulário, então nenhuma das duas está escrita aqui.
 *
 * O link leva ao catálogo já filtrado por aquela natureza, pela mesma query
 * string que os filtros usam.
 */
function porta(valor, quantos) {
  const bloco = criar('article', 'porta');
  bloco.append(
    criar('p', 'porta__contagem mono', String(quantos)),
    criar('h3', 'porta__nome', valor.tituloPorta || valor.valor)
  );
  if (valor.descricao) bloco.append(criar('p', 'porta__texto', valor.descricao));

  const link = criar('a', 'porta__link', `Ver os ${quantos}`);
  link.href = `?natureza=${encodeURIComponent(valor.valor)}#catalogo`;
  link.append(criar('span', 'apenas-leitor', ` conhecimentos de natureza ${valor.valor}`));
  bloco.append(link);
  return bloco;
}

const SVG = 'http://www.w3.org/2000/svg';

const ICONES_ESTRUTURA = {
  conhecimento: [['path', { d: 'M4 4.5h5.1c1.4 0 2.5.7 2.5 1.7v9c0-1-1.1-1.7-2.5-1.7H4z' }], ['path', { d: 'M16 4.5h-5.1c-1.4 0-2.5.7-2.5 1.7v9c0-1 1.1-1.7 2.5-1.7H16z' }]],
  explicito: [['path', { d: 'M5 3.5h7l3 3v10H5z' }], ['path', { d: 'M12 3.5v3h3M7.5 10h5M7.5 13h5' }]],
  cognitivo: [['path', { d: 'M7.5 15.5h5M8 18h4' }], ['path', { d: 'M7 12.5c-1.1-.9-1.8-2.3-1.8-3.8A4.8 4.8 0 0 1 10 4a4.8 4.8 0 0 1 4.8 4.7c0 1.5-.7 2.9-1.8 3.8-.7.6-1 1.2-1 2H8c0-.8-.3-1.4-1-2Z' }]],
  tecnico: [['path', { d: 'm12.8 4.2 3 3-7.6 7.6-3-3z' }], ['path', { d: 'm13.4 3.6 1.8-1.8 3 3-1.8 1.8M5.2 13.8 3.7 15.3l1 1 1.5-1.5' }]],
  classificacao: [['path', { d: 'M4 5h12M4 10h12M4 15h12' }], ['circle', { cx: 7, cy: 5, r: 1 }], ['circle', { cx: 13, cy: 10, r: 1 }], ['circle', { cx: 9, cy: 15, r: 1 }]],
  gerencia: [['circle', { cx: 5, cy: 10, r: 2 }], ['circle', { cx: 15, cy: 5, r: 2 }], ['circle', { cx: 15, cy: 15, r: 2 }], ['path', { d: 'm6.8 9 6.4-3.1M6.8 11l6.4 3.1' }]],
  fontes: [['path', { d: 'M4 4.5h5.1c1.4 0 2.5.7 2.5 1.7v9c0-1-1.1-1.7-2.5-1.7H4z' }], ['path', { d: 'M16 4.5h-5.1c-1.4 0-2.5.7-2.5 1.7v9c0-1 1.1-1.7 2.5-1.7H16z' }]],
  receptores: [['circle', { cx: 10, cy: 6.5, r: 3 }], ['path', { d: 'M4.5 16c.8-2.8 2.7-4.2 5.5-4.2s4.7 1.4 5.5 4.2' }]],
  praticas: [['path', { d: 'M4.5 5.5h7M4.5 10h7M4.5 14.5h7' }], ['path', { d: 'm14 5.5 1.2 1.2 2.3-2.3M14 10l1.2 1.2 2.3-2.3M14 14.5l1.2 1.2 2.3-2.3' }]],
  revisao: [['path', { d: 'M5 3.5h7l3 3v10H5z' }], ['path', { d: 'M12 3.5v3h3M7.5 10h5M7.5 13h5' }]],
  estudos: [['path', { d: 'M4 5.5h12v10H4z' }], ['path', { d: 'M7 3.5v4M13 3.5v4M7 10h6M7 13h4' }]],
  rastreabilidade: [['circle', { cx: 5, cy: 10, r: 2 }], ['circle', { cx: 15, cy: 5, r: 2 }], ['circle', { cx: 15, cy: 15, r: 2 }], ['path', { d: 'm6.8 9 6.4-3.1M6.8 11l6.4 3.1' }]],
  desafios: [['path', { d: 'M10 3.5 17 16.5H3z' }], ['path', { d: 'M10 8v3.5M10 14h.01' }]]
};

function traco(tag, atributos) {
  const forma = document.createElementNS(SVG, tag);
  Object.entries(atributos).forEach(([nome, valor]) => forma.setAttribute(nome, String(valor)));
  forma.setAttribute('fill', 'none');
  forma.setAttribute('stroke', 'currentColor');
  forma.setAttribute('stroke-width', '1.5');
  forma.setAttribute('stroke-linecap', 'round');
  forma.setAttribute('stroke-linejoin', 'round');
  return forma;
}

function iconeEstrutura(nome) {
  const icone = document.createElementNS(SVG, 'svg');
  icone.setAttribute('viewBox', '0 0 20 20');
  icone.setAttribute('aria-hidden', 'true');
  icone.setAttribute('focusable', 'false');
  ICONES_ESTRUTURA[nome].forEach(([tag, atributos]) => icone.append(traco(tag, atributos)));
  return icone;
}

function cartaoEstrutura({ icone, titulo, descricao, valores = [], exemplo, nota, classe = '' }) {
  const cartao = criar('article', `estrutura__cartao ${classe}`.trim());
  const simbolo = criar('span', 'estrutura__icone');
  simbolo.append(iconeEstrutura(icone));
  const conteudo = criar('div', 'estrutura__cartao-conteudo');
  conteudo.append(criar('h3', 'estrutura__cartao-titulo', titulo));
  if (descricao) conteudo.append(criar('p', 'estrutura__cartao-texto', descricao));
  if (exemplo) {
    const blocoExemplo = criar('div', 'estrutura__exemplo');
    blocoExemplo.append(
      criar('h4', 'estrutura__exemplo-titulo', 'Exemplos'),
      criar('p', 'estrutura__exemplo-texto', exemplo)
    );
    conteudo.append(blocoExemplo);
  }
  if (valores.length) {
    const lista = criar('ul', 'estrutura__valores');
    valores.forEach((valor) => lista.append(criar('li', null, valor)));
    conteudo.append(lista);
  }
  if (nota) conteudo.append(criar('p', 'estrutura__cartao-nota', nota));
  cartao.append(simbolo, conteudo);
  return cartao;
}

function definicaoComExemplo(descricao = '') {
  const marcador = 'Incluem, por exemplo,';
  const indice = descricao.indexOf(marcador);
  if (indice < 0) return { descricao };
  return {
    descricao: descricao.slice(0, indice).trim(),
    exemplo: descricao.slice(indice).trim()
  };
}

function painel(definicao, aba, introducao, cartoes, classe = '', aviso, avisoDepois = false) {
  const raiz = criar('section', 'estrutura__painel');
  raiz.id = `painel-${definicao.id}`;
  raiz.setAttribute('role', 'tabpanel');
  raiz.setAttribute('aria-labelledby', aba.id);
  raiz.tabIndex = 0;
  if (introducao) raiz.append(criar('p', 'estrutura__painel-intro', introducao));
  const nota = aviso ? criar('p', 'estrutura__aviso', aviso) : null;
  if (nota && !avisoDepois) raiz.append(nota);
  const grade = criar('div', `estrutura__grade ${classe}`.trim());
  grade.append(...cartoes);
  raiz.append(grade);
  if (nota && avisoDepois) raiz.append(nota);
  return raiz;
}

function iconeDaNatureza(valor) {
  return {
    'Explícito': 'explicito',
    'Tácito-cognitivo': 'cognitivo',
    'Tácito-técnico': 'tecnico'
  }[valor] || 'conhecimento';
}

function subbloco(valor) {
  const item = criar('li', 'estrutura__subbloco');
  item.append(
    criar('h4', 'estrutura__subbloco-titulo', valor.valor),
    criar('p', 'estrutura__subbloco-texto', valor.descricao)
  );
  return item;
}

function cartaoAtributo(atributo, classe = '') {
  const cartao = cartaoEstrutura({
    icone: 'classificacao',
    titulo: atributo.rotulo,
    descricao: atributo.pergunta,
    classe: `estrutura__cartao--atributo ${classe}`.trim()
  });
  const conteudo = cartao.querySelector('.estrutura__cartao-conteudo');
  const blocos = criar('ul', 'estrutura__subblocos');
  atributo.valores.forEach((valor) => blocos.append(subbloco(valor)));
  conteudo.append(blocos);
  return cartao;
}

function explicacaoConhecimento(dados, aba, definicao) {
  const valores = dados.classificacoes.natureza.valores;
  return painel(definicao, aba, '', valores.map((valor) => {
    const texto = definicaoComExemplo(valor.descricao);
    return cartaoEstrutura({
      icone: iconeDaNatureza(valor.valor),
      titulo: valor.tituloPorta || valor.valor,
      ...texto
    });
  }), 'estrutura__grade--conhecimento');
}

function explicacaoClassificacao(dados, aba, definicao) {
  const atributos = ['natureza', 'nivel', 'dimensao'];
  return painel(definicao, aba, '', atributos.map((chave) => cartaoAtributo(
    dados.classificacoes[chave], chave === 'natureza' ? 'estrutura__cartao--atributo-principal' : ''
  )), 'estrutura__grade--classificacao');
}

function explicacaoGerencia(dados, aba, definicao) {
  return painel(
    definicao,
    aba,
    dados.meta.gerenciaConhecimento,
    definicao.campos.map(({ titulo, descricao, icone }) => cartaoEstrutura({ icone, titulo, descricao })),
    'estrutura__grade--gerencia',
    dados.meta.ajudas?.gerencia?.texto,
    true
  );
}

function explicacaoEvidencias(dados, aba, definicao) {
  const base = dados.meta.camadas.find((camada) => camada.n === 3);
  const icones = definicao.cartoes.icones;
  return painel(definicao, aba, '', [
    cartaoEstrutura({ icone: icones.revisao, titulo: definicao.cartoes.revisao, descricao: dados.meta.fonte }),
    cartaoEstrutura({ icone: icones.estudos, titulo: definicao.cartoes.estudos, descricao: base?.conteudo }),
    cartaoEstrutura({ icone: icones.rastreabilidade, titulo: definicao.cartoes.rastreabilidade, descricao: dados.meta.ajudas?.estudos?.texto }),
    cartaoEstrutura({ icone: icones.desafios, titulo: definicao.cartoes.desafios, descricao: dados.meta.ajudas?.desafios?.texto })
  ], 'estrutura__grade--evidencias');
}

function abasDaEstrutura(dados) {
  const navegacao = el('#estrutura-abas');
  const paineis = el('#estrutura-paineis');
  const definicoes = dados.meta.estruturaCatalogo?.abas;
  if (!navegacao || !paineis || !definicoes?.length) return;

  const abas = definicoes.map((definicao, indice) => {
    const aba = criar('button', 'estrutura__aba', definicao.rotulo);
    aba.id = `aba-${definicao.id}`;
    aba.type = 'button';
    aba.setAttribute('role', 'tab');
    aba.setAttribute('aria-selected', String(indice === 0));
    aba.setAttribute('aria-controls', `painel-${definicao.id}`);
    aba.tabIndex = indice === 0 ? 0 : -1;
    return aba;
  });
  navegacao.replaceChildren(...abas);

  const criadores = { conhecimento: explicacaoConhecimento, classificacao: explicacaoClassificacao, gerencia: explicacaoGerencia, evidencias: explicacaoEvidencias };
  const todosPaineis = abas.map((aba, indice) => criadores[definicoes[indice].id](dados, aba, definicoes[indice]));
  paineis.replaceChildren(...todosPaineis);

  const selecionar = (indice, focar = false) => {
    abas.forEach((aba, atual) => {
      const ativo = atual === indice;
      aba.setAttribute('aria-selected', String(ativo));
      aba.tabIndex = ativo ? 0 : -1;
      todosPaineis[atual].hidden = !ativo;
    });
    if (focar) abas[indice].focus();
  };
  abas.forEach((aba, indice) => {
    aba.addEventListener('click', () => selecionar(indice));
    aba.addEventListener('keydown', (evento) => {
      const teclas = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      if (evento.key in teclas) {
        evento.preventDefault();
        selecionar((indice + teclas[evento.key] + abas.length) % abas.length, true);
      }
      if (evento.key === 'Home') { evento.preventDefault(); selecionar(0, true); }
      if (evento.key === 'End') { evento.preventDefault(); selecionar(abas.length - 1, true); }
    });
  });
  selecionar(0);
}

async function iniciar() {
  let dados;
  try {
    dados = await carregar();
  } catch (erro) {
    console.error(erro);
    return;
  }

  el('#abertura-resumo').textContent = dados.meta.subtitulo;

  const contar = (valor) => dados.conhecimentos.filter((c) => c.natureza === valor).length;
  el('#portas').replaceChildren(
    ...dados.classificacoes.natureza.valores.map((v) => porta(v, contar(v.valor)))
  );
  ajudaDasPortas(dados);

  abasDaEstrutura(dados);
}

iniciar();
