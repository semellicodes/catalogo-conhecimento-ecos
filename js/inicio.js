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
  classificacao: [['path', { d: 'M4 5h12M4 10h12M4 15h12' }], ['circle', { cx: 7, cy: 5, r: 1 }], ['circle', { cx: 13, cy: 10, r: 1 }], ['circle', { cx: 9, cy: 15, r: 1 }]],
  gerencia: [['circle', { cx: 5, cy: 10, r: 2 }], ['circle', { cx: 15, cy: 5, r: 2 }], ['circle', { cx: 15, cy: 15, r: 2 }], ['path', { d: 'm6.8 9 6.4-3.1M6.8 11l6.4 3.1' }]],
  evidencias: [['path', { d: 'M5 3.5h7l3 3v10H5z' }], ['path', { d: 'M12 3.5v3h3M7.5 10h5M7.5 13h5' }]]
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

function cartaoEstrutura({ icone, titulo, descricao, valores = [] }) {
  const cartao = criar('article', 'estrutura__cartao');
  const simbolo = criar('span', 'estrutura__icone');
  simbolo.append(iconeEstrutura(icone));
  const conteudo = criar('div', 'estrutura__cartao-conteudo');
  conteudo.append(criar('h3', 'estrutura__cartao-titulo', titulo));
  if (descricao) conteudo.append(criar('p', 'estrutura__cartao-texto', descricao));
  if (valores.length) {
    const lista = criar('ul', 'estrutura__valores');
    valores.forEach((valor) => lista.append(criar('li', null, valor)));
    conteudo.append(lista);
  }
  cartao.append(simbolo, conteudo);
  return cartao;
}

function painel(definicao, aba, introducao, cartoes) {
  const raiz = criar('section', 'estrutura__painel');
  raiz.id = `painel-${definicao.id}`;
  raiz.setAttribute('role', 'tabpanel');
  raiz.setAttribute('aria-labelledby', aba.id);
  raiz.tabIndex = 0;
  if (introducao) raiz.append(criar('p', 'estrutura__painel-intro', introducao));
  const grade = criar('div', 'estrutura__grade');
  grade.append(...cartoes);
  raiz.append(grade);
  return raiz;
}

function explicacaoConhecimento(dados, aba, definicao) {
  const valores = dados.classificacoes.natureza.valores;
  return painel(definicao, aba, '', valores.map((valor) => cartaoEstrutura({
    icone: 'conhecimento',
    titulo: valor.tituloPorta || valor.valor,
    descricao: valor.descricao
  })));
}

function explicacaoClassificacao(dados, aba, definicao) {
  const atributos = ['natureza', 'nivel', 'dimensao'];
  return painel(definicao, aba, '', atributos.map((chave) => {
    const atributo = dados.classificacoes[chave];
    return cartaoEstrutura({
      icone: 'classificacao',
      titulo: atributo.rotulo,
      descricao: atributo.pergunta,
      valores: atributo.valores.map((valor) => `${valor.valor} — ${valor.descricao}`)
    });
  }));
}

function explicacaoGerencia(dados, aba, definicao) {
  return painel(definicao, aba, dados.meta.ajudas?.gerencia?.texto || dados.meta.gerenciaConhecimento, definicao.campos.map(({ titulo, descricao }) => cartaoEstrutura({
    icone: definicao.icone, titulo, descricao
  })));
}

function explicacaoEvidencias(dados, aba, definicao) {
  const base = dados.meta.camadas.find((camada) => camada.n === 3);
  return painel(definicao, aba, '', [
    cartaoEstrutura({ icone: definicao.icone, titulo: definicao.cartoes.revisao, descricao: dados.meta.fonte }),
    cartaoEstrutura({ icone: definicao.icone, titulo: definicao.cartoes.estudos, descricao: base?.conteudo, valores: base?.origem ? [base.origem] : [] }),
    cartaoEstrutura({ icone: definicao.icone, titulo: definicao.cartoes.rastreabilidade, descricao: dados.meta.ajudas?.estudos?.texto }),
    cartaoEstrutura({ icone: definicao.icone, titulo: definicao.cartoes.desafios, descricao: dados.meta.ajudas?.desafios?.texto })
  ]);
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
