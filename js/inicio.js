/**
 * Preenche a abertura e a explicação da estrutura do catálogo.
 */

import { carregar, rotuloDaReferencia, temVerbete } from './dados.js?v=20261103-8';

const el = (seletor) => document.querySelector(seletor);

function criar(tag, className, texto) {
  const elemento = document.createElement(tag);
  if (className) elemento.className = className;
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
}


/* Só a citação, sem o rótulo "Fonte" na frente. O lugar e o estilo já dizem
   que aquilo é a fonte do cartão. */
function fonteConceitual(chaves) {
  const fonte = criar('p', 'estrutura__fonte-conceitual');
  const referencias = (chaves || '').split(',').map((chave) => chave.trim()).filter(Boolean);
  referencias.forEach((chave, indice) => {
    if (indice) fonte.append('; ');
    if (!temVerbete(chave)) {
      fonte.append(rotuloDaReferencia(chave));
      return;
    }
    const link = criar('a', '', rotuloDaReferencia(chave));
    link.href = `referencias.html#referencia-${chave}`;
    fonte.append(link);
  });
  return fonte;
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

function definicaoComExemplo(valor) {
  const { descricao = '', exemplos } = valor;
  if (exemplos) return { descricao, exemplo: exemplos };
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
  const { descricao, exemplo } = definicaoComExemplo(valor);
  const cabecalho = cabecalhoComIcone(iconeDaNatureza(valor.valor), valor.valor, 'estrutura__natureza-cabecalho');
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
  } else {
    conteudo.classList.add('estrutura__natureza-conteudo--completo');
  }
  bloco.append(cabecalho, conteudo);
  if (valor.referencia) bloco.append(fonteConceitual(valor.referencia));
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
  const conteudo = criar('div', 'estrutura__evidencia-conteudo');
  conteudo.append(criar('p', 'estrutura__evidencia-texto', descricao));
  if (complemento) conteudo.append(criar('p', 'estrutura__evidencia-complemento', complemento));
  item.append(
    cabecalhoComIcone(icone, titulo, 'estrutura__evidencia-cabecalho'),
    conteudo
  );
  return item;
}

function composicaoEvidencias(dados, definicao) {
  const { cartoes } = definicao;
  const icones = cartoes.icones;
  const composicao = criar('article', 'estrutura__composicao-evidencias');
  const blocos = criar('div', 'estrutura__evidencias-blocos');
  blocos.append(
    linhaEvidencia({ icone: icones.revisao, titulo: cartoes.revisao, descricao: cartoes.revisaoDescricao }),
    linhaEvidencia({ icone: icones.estudos, titulo: cartoes.estudos, descricao: cartoes.estudosDescricao }),
    linhaEvidencia({ icone: icones.rastreabilidade, titulo: cartoes.rastreabilidade, descricao: cartoes.rastreabilidadeDescricao }),
    linhaEvidencia({ icone: icones.desafios, titulo: cartoes.desafios, descricao: cartoes.desafiosDescricao })
  );
  composicao.append(blocos, fonteConceitual(definicao.referencias));
  return composicao;
}

function painel(definicao, aba, introducao, cartoes, classe = '', aviso, avisoDepois = false) {
  const raiz = criar('section', 'estrutura__painel');
  raiz.id = `painel-${definicao.id}`;
  raiz.setAttribute('role', 'tabpanel');
  raiz.setAttribute('aria-labelledby', aba.id);
  raiz.tabIndex = 0;
  const cabecalho = criar('header', 'estrutura__painel-cabecalho');
  const simbolo = criar('span', 'estrutura__painel-icone');
  simbolo.append(iconeEstrutura(iconeDoPainel(definicao)));
  cabecalho.append(simbolo, criar('h3', 'estrutura__painel-titulo', definicao.tituloPainel || definicao.rotulo));
  raiz.append(cabecalho);
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

function categoriaClassificacao(valor, incluirDescricao = true) {
  const item = criar('li', 'estrutura__categoria-classificacao');
  item.append(criar('h4', 'estrutura__categoria-classificacao-titulo', valor.valor));
  if (incluirDescricao) item.append(criar('p', 'estrutura__categoria-classificacao-texto', valor.descricao));
  if (valor.exemplos) {
    const exemplos = criar('p', 'estrutura__categoria-classificacao-exemplos', valor.exemplos);
    exemplos.prepend(criar('span', 'estrutura__categoria-classificacao-rotulo', 'Exemplos'));
    item.append(exemplos);
  }
  if (valor.pergunta) item.append(criar('p', 'estrutura__categoria-classificacao-pergunta', valor.pergunta));
  if (valor.referencia) item.append(fonteConceitual(valor.referencia));
  return item;
}

function atributoClassificacao(chave, atributo) {
  const bloco = criar('section', `estrutura__atributo-classificacao estrutura__atributo-classificacao--${chave}`);
  const cabecalho = cabecalhoComIcone(chave, atributo.rotulo, 'estrutura__atributo-classificacao-cabecalho');
  cabecalho.append(criar('p', 'estrutura__atributo-classificacao-descricao', atributo.introducao));
  const conteudo = criar('div', 'estrutura__atributo-classificacao-conteudo');
  const categorias = criar('ul', 'estrutura__categorias-classificacao');
  atributo.valores.forEach((valor) => categorias.append(categoriaClassificacao(valor)));
  conteudo.append(categorias);
  if (chave !== 'natureza') conteudo.append(criar('p', 'estrutura__atributo-classificacao-pergunta', atributo.pergunta));
  bloco.append(cabecalho, conteudo);
  return bloco;
}

/**
 * A taxonomia ocupa a largura inteira e empilha. A natureza vem primeiro, com
 * os três cartões lado a lado, e nível e dimensão dividem a linha seguinte.
 *
 * Antes isso era a coluna esquerda de um par de colunas, mas a coluna direita
 * acabava depois de três cartões e a esquerda seguia por mais três blocos, então
 * metade da largura ficava vazia enquanto o texto da esquerda se espremia.
 */
function composicaoClassificacao(dados, definicao) {
  const composicao = criar('section', 'estrutura__classificacao-coluna');
  composicao.append(
    criar('h4', 'estrutura__coluna-titulo', definicao.tituloClassificacao),
    criar('p', 'estrutura__coluna-subtitulo', definicao.subtituloClassificacao)
  );
  const atributos = criar('article', 'estrutura__composicao-classificacao');
  const par = criar('div', 'estrutura__atributos-par');
  ['nivel', 'dimensao'].forEach((chave) => {
    par.append(atributoClassificacao(chave, dados.classificacoes[chave]));
  });
  atributos.append(atributoClassificacao('natureza', dados.classificacoes.natureza), par);
  composicao.append(atributos);
  return composicao;
}

function nomeTipoEcos(valor) {
  return {
    'Código aberto': 'ECOS de Código Aberto',
    'Híbrido': 'ECOS Híbrido',
    'Proprietário': 'ECOS Proprietário'
  }[valor] || valor;
}

function composicaoTiposEcos(dados, definicao) {
  const composicao = criar('section', 'estrutura__tipos-ecos');
  composicao.append(
    criar('h4', 'estrutura__coluna-titulo', definicao.tituloTiposEcos),
    criar('p', 'estrutura__tipos-ecos-intro', definicao.introducaoTiposEcos)
  );
  const lista = criar('ul', 'estrutura__tipos-ecos-lista');
  dados.classificacoes.tipoEcos.valores.forEach((valor) => {
    const item = criar('li', 'estrutura__tipo-ecos');
    item.append(
      criar('h5', 'estrutura__tipo-ecos-titulo', nomeTipoEcos(valor.valor)),
      criar('p', 'estrutura__tipo-ecos-texto', valor.descricao)
    );
    if (valor.referencia) item.append(fonteConceitual(valor.referencia));
    lista.append(item);
  });
  composicao.append(lista);
  return composicao;
}

function explicacaoConhecimento(dados, aba, definicao) {
  const valores = dados.classificacoes.natureza.valores;
  const contexto = criar('div', 'estrutura__contexto-academico');
  contexto.append(
    criar('p', 'estrutura__pergunta-pesquisa', definicao.perguntaPesquisa),
    fonteConceitual(definicao.referencias)
  );
  const resultado = painel(definicao, aba, definicao.introducao, [contexto, composicaoConhecimento(valores)], 'estrutura__grade--conhecimento');
  resultado.classList.add('estrutura__painel--conhecimento');
  return resultado;
}

function explicacaoClassificacao(dados, aba, definicao) {
  const atributos = criar('article', 'estrutura__composicao-atributos');
  atributos.append(composicaoClassificacao(dados, definicao), composicaoTiposEcos(dados, definicao));
  const resultado = painel(definicao, aba, definicao.introducao, [atributos], 'estrutura__grade--classificacao');
  resultado.classList.add('estrutura__painel--classificacao');
  return resultado;
}

function explicacaoGerencia(dados, aba, definicao) {
  const composicao = composicaoGerencia(definicao.campos, definicao.nota);
  composicao.append(fonteConceitual(definicao.referencias));
  const resultado = painel(
    definicao,
    aba,
    definicao.introducao,
    [composicao],
    'estrutura__grade--gerencia'
  );
  resultado.classList.add('estrutura__painel--gerencia');
  return resultado;
}

function explicacaoEvidencias(dados, aba, definicao) {
  return painel(definicao, aba, definicao.introducao, [composicaoEvidencias(dados, definicao)], 'estrutura__grade--evidencias');
}

function iconeDoPainel(definicao) {
  return definicao.id === 'evidencias' ? 'revisao' : definicao.icone;
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
  let todosPaineis = [];

  const selecionar = (indice, focar = false) => {
    abas.forEach((aba, atual) => {
      const ativo = atual === indice;
      aba.setAttribute('aria-selected', String(ativo));
      aba.tabIndex = ativo ? 0 : -1;
      todosPaineis[atual].hidden = !ativo;
    });
    if (focar) abas[indice].focus();
  };
  todosPaineis = abas.map((aba, indice) => criadores[definicoes[indice].id](dados, aba, definicoes[indice], selecionar));
  paineis.replaceChildren(...todosPaineis);

  abas.forEach((aba, indice) => {
    aba.addEventListener('click', () => selecionar(indice));
    aba.addEventListener('keydown', (evento) => {
      const deslocamentos = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      if (evento.key in deslocamentos) {
        evento.preventDefault();
        selecionar((indice + deslocamentos[evento.key] + abas.length) % abas.length, true);
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

  abasDaEstrutura(dados);
}

iniciar();
