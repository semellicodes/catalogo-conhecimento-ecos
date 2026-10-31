/**
 * Preenche a abertura, as portas de entrada por natureza e a explicação da
 * estrutura do catálogo.
 */

import { carregar } from './dados.js?v=20261031-4';
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
  natureza: [['circle', { cx: 10, cy: 10, r: 6 }], ['path', { d: 'M10 4v12M4 10h12' }]],
  nivel: [['path', { d: 'm4 7 6-3 6 3-6 3zM4 10l6 3 6-3M4 13l6 3 6-3' }]],
  dimensao: [['path', { d: 'M4 16V5M4 16h12M7 13l3-4 3 2 3-5' }]],
  gerencia: [['circle', { cx: 5, cy: 10, r: 2 }], ['circle', { cx: 15, cy: 5, r: 2 }], ['circle', { cx: 15, cy: 15, r: 2 }], ['path', { d: 'm6.8 9 6.4-3.1M6.8 11l6.4 3.1' }]],
  fontes: [['path', { d: 'M4 4.5h5.1c1.4 0 2.5.7 2.5 1.7v9c0-1-1.1-1.7-2.5-1.7H4z' }], ['path', { d: 'M16 4.5h-5.1c-1.4 0-2.5.7-2.5 1.7v9c0-1 1.1-1.7 2.5-1.7H16z' }]],
  receptores: [['circle', { cx: 10, cy: 6.5, r: 3 }], ['path', { d: 'M4.5 16c.8-2.8 2.7-4.2 5.5-4.2s4.7 1.4 5.5 4.2' }]],
  praticas: [['path', { d: 'M4.5 5.5h7M4.5 10h7M4.5 14.5h7' }], ['path', { d: 'm14 5.5 1.2 1.2 2.3-2.3M14 10l1.2 1.2 2.3-2.3M14 14.5l1.2 1.2 2.3-2.3' }]],
  nota: [['circle', { cx: 10, cy: 10, r: 6.5 }], ['path', { d: 'M10 9v4M10 6.5h.01' }]],
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

function definicaoComExemplo(descricao = '') {
  const marcador = 'Incluem, por exemplo,';
  const indice = descricao.indexOf(marcador);
  if (indice < 0) return { descricao };
  return {
    descricao: descricao.slice(0, indice).trim(),
    exemplo: descricao.slice(indice).trim()
  };
}

function cabecalhoComIcone(icone, titulo, classe) {
  const cabecalho = criar('header', classe);
  const simbolo = criar('span', 'estrutura__icone');
  simbolo.append(iconeEstrutura(icone));
  cabecalho.append(simbolo, criar('h3', `${classe}-titulo`, titulo));
  return cabecalho;
}

function blocoConhecimento(valor) {
  const bloco = criar('section', 'estrutura__natureza');
  const { descricao, exemplo } = definicaoComExemplo(valor.descricao);
  const cabecalho = cabecalhoComIcone(iconeDaNatureza(valor.valor), valor.tituloPorta || valor.valor, 'estrutura__natureza-cabecalho');
  const conteudo = criar('div', 'estrutura__natureza-conteudo');
  const definicao = criar('div', 'estrutura__natureza-definicao');
  definicao.append(
    criar('p', 'estrutura__rotulo', 'Definição'),
    criar('p', 'estrutura__natureza-texto', descricao)
  );
  conteudo.append(definicao);
  if (exemplo) {
    const exemplos = criar('div', 'estrutura__natureza-exemplos');
    exemplos.append(
      criar('p', 'estrutura__rotulo', 'Exemplos'),
      criar('p', 'estrutura__natureza-texto', exemplo)
    );
    conteudo.append(exemplos);
  }
  bloco.append(cabecalho, conteudo);
  return bloco;
}

function composicaoConhecimento(valores) {
  const composicao = criar('article', 'estrutura__composicao-conhecimento');
  valores.forEach((valor) => composicao.append(blocoConhecimento(valor)));
  return composicao;
}

function blocoGerencia({ titulo, rotulo, descricao, icone }) {
  const bloco = criar('section', 'estrutura__gerencia-item');
  const cabecalho = cabecalhoComIcone(icone, rotulo || titulo, 'estrutura__gerencia-cabecalho');
  bloco.append(cabecalho, criar('p', 'estrutura__gerencia-texto', descricao));
  return bloco;
}

function composicaoGerencia(campos, nota) {
  const composicao = criar('article', 'estrutura__composicao-gerencia');
  campos.forEach((campo) => composicao.append(blocoGerencia(campo)));
  if (nota) composicao.append(notaMetodologica(nota));
  return composicao;
}

function notaMetodologica(texto) {
  const nota = criar('aside', 'estrutura__nota-metodologica');
  const icone = criar('span', 'estrutura__nota-icone');
  icone.append(iconeEstrutura('nota'));
  const conteudo = criar('div', 'estrutura__nota-conteudo');
  conteudo.append(
    criar('p', 'estrutura__rotulo', 'Nota metodológica'),
    criar('p', 'estrutura__nota-texto', texto)
  );
  nota.append(icone, conteudo);
  return nota;
}

function linhaEvidencia({ icone, titulo, descricao, complemento }) {
  const item = criar('section', 'estrutura__evidencia-linha');
  item.append(
    cabecalhoComIcone(icone, titulo, 'estrutura__evidencia-cabecalho'),
    criar('p', 'estrutura__evidencia-texto', descricao)
  );
  if (complemento) item.append(criar('p', 'estrutura__evidencia-complemento', complemento));
  return item;
}

function composicaoEvidencias(dados, definicao) {
  const { cartoes } = definicao;
  const icones = cartoes.icones;
  const base = dados.meta.camadas.find((camada) => camada.n === 3);
  const composicao = criar('article', 'estrutura__composicao-evidencias');
  const origem = criar('section', 'estrutura__evidencia-linha estrutura__evidencia-linha--origem');
  const texto = criar('div', 'estrutura__origem-texto');
  texto.append(
    cabecalhoComIcone(icones.revisao, cartoes.revisao, 'estrutura__evidencia-cabecalho'),
    criar('p', 'estrutura__evidencia-texto', cartoes.revisaoDescricao),
    criar('p', 'estrutura__evidencia-fonte', dados.meta.fonte)
  );
  const estudos = criar('div', 'estrutura__origem-estudos');
  estudos.append(
    criar('p', 'estrutura__rotulo', cartoes.estudos),
    criar('p', 'estrutura__origem-total mono', String(dados.meta.totalEstudos)),
    criar('p', 'estrutura__origem-descricao', cartoes.estudosDescricao),
    criar('p', 'estrutura__origem-fonte', base?.conteudo)
  );
  origem.append(texto, estudos);

  composicao.append(
    origem,
    linhaEvidencia({ icone: icones.rastreabilidade, titulo: cartoes.rastreabilidade, descricao: cartoes.rastreabilidadeDescricao }),
    linhaEvidencia({ icone: icones.desafios, titulo: cartoes.desafios, descricao: cartoes.desafiosDescricao, complemento: cartoes.desafiosComplemento })
  );
  return composicao;
}

function painel(definicao, aba, introducao, cartoes, classe = '', aviso, avisoDepois = false) {
  const raiz = criar('section', 'estrutura__painel');
  raiz.id = `painel-${definicao.id}`;
  raiz.setAttribute('role', 'region');
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

function categoriaClassificacao(valor) {
  const item = criar('li', 'estrutura__categoria-classificacao');
  item.append(
    criar('h4', 'estrutura__categoria-classificacao-titulo', valor.valor),
    criar('p', 'estrutura__categoria-classificacao-texto', valor.descricao)
  );
  return item;
}

function atributoClassificacao(chave, atributo) {
  const bloco = criar('section', 'estrutura__atributo-classificacao');
  const cabecalho = cabecalhoComIcone(chave, atributo.rotulo, 'estrutura__atributo-classificacao-cabecalho');
  cabecalho.append(criar('p', 'estrutura__atributo-classificacao-descricao', atributo.pergunta));
  const categorias = criar('ul', 'estrutura__categorias-classificacao');
  atributo.valores.forEach((valor) => categorias.append(categoriaClassificacao(valor)));
  bloco.append(cabecalho, categorias);
  return bloco;
}

function composicaoClassificacao(dados) {
  const composicao = criar('article', 'estrutura__composicao-classificacao');
  ['natureza', 'nivel', 'dimensao'].forEach((chave) => {
    composicao.append(atributoClassificacao(chave, dados.classificacoes[chave]));
  });
  return composicao;
}

function explicacaoConhecimento(dados, aba, definicao) {
  const valores = dados.classificacoes.natureza.valores;
  return painel(definicao, aba, '', [composicaoConhecimento(valores)], 'estrutura__grade--conhecimento');
}

function explicacaoClassificacao(dados, aba, definicao) {
  return painel(definicao, aba, '', [composicaoClassificacao(dados)], 'estrutura__grade--classificacao');
}

function explicacaoGerencia(dados, aba, definicao) {
  const raiz = painel(
    definicao,
    aba,
    dados.meta.gerenciaConhecimento,
    [composicaoGerencia(definicao.campos, definicao.nota)],
    'estrutura__grade--gerencia'
  );
  raiz.classList.add('estrutura__painel--gerencia');
  if (definicao.subtitulo) raiz.insertBefore(criar('h3', 'estrutura__painel-subtitulo', definicao.subtitulo), raiz.firstChild);
  return raiz;
}

function explicacaoEvidencias(dados, aba, definicao) {
  return painel(definicao, aba, '', [composicaoEvidencias(dados, definicao)], 'estrutura__grade--evidencias');
}

function conectoresDoDiagrama() {
  const conectores = document.createElementNS(SVG, 'svg');
  conectores.classList.add('estrutura__conectores');
  conectores.setAttribute('viewBox', '0 0 100 100');
  conectores.setAttribute('preserveAspectRatio', 'none');
  conectores.setAttribute('aria-hidden', 'true');
  [
    'M50 23V35',
    'M50 35H18V43',
    'M50 35H82V43',
    'M18 65V73H50V80',
    'M82 65V73H50'
  ].forEach((d) => conectores.append(traco('path', { d })));
  return conectores;
}

function iconeDoDiagrama(definicao) {
  return definicao.id === 'evidencias' ? 'revisao' : definicao.icone;
}

function noDoDiagrama(definicao, indice) {
  const no = criar('button', `estrutura__no estrutura__no--${definicao.id}`);
  no.type = 'button';
  no.id = `no-${definicao.id}`;
  no.setAttribute('aria-controls', `painel-${definicao.id}`);
  no.setAttribute('aria-pressed', String(indice === 0));
  const icone = criar('span', 'estrutura__no-icone');
  icone.append(iconeEstrutura(iconeDoDiagrama(definicao)));
  no.append(icone, criar('span', 'estrutura__no-rotulo', definicao.rotulo));
  return no;
}

function diagramaDaEstrutura(dados) {
  const diagrama = el('#estrutura-diagrama');
  const paineis = el('#estrutura-paineis');
  const definicoes = dados.meta.estruturaCatalogo?.abas;
  if (!diagrama || !paineis || !definicoes?.length) return;

  const nos = definicoes.map(noDoDiagrama);
  diagrama.replaceChildren(conectoresDoDiagrama(), ...nos);

  const criadores = { conhecimento: explicacaoConhecimento, classificacao: explicacaoClassificacao, gerencia: explicacaoGerencia, evidencias: explicacaoEvidencias };
  const todosPaineis = nos.map((no, indice) => criadores[definicoes[indice].id](dados, no, definicoes[indice]));
  paineis.replaceChildren(...todosPaineis);

  let selecionado = -1;
  const selecionar = (indice) => {
    const proximo = selecionado === indice ? -1 : indice;
    nos.forEach((no, atual) => {
      const ativo = atual === proximo;
      no.setAttribute('aria-pressed', String(ativo));
      todosPaineis[atual].hidden = !ativo;
    });
    selecionado = proximo;
  };
  nos.forEach((no, indice) => no.addEventListener('click', () => selecionar(indice)));
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

  diagramaDaEstrutura(dados);
}

iniciar();
