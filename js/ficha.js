/**
 * Transforma um conhecimento em ficha. Não sabe carregar nem filtrar.
 *
 * O identificador e o selo da natureza ficam no topo do diálogo, que é fixo, e
 * não se repetem aqui. As relações e os estudos aparecem em seções próprias.
 */

import { referenciaCurta } from './dados.js';

function criar(tag, className, texto) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

/* ---------- Classificação ---------- */

/**
 * Uma fileira de caixas, uma por valor possível do atributo. A que vale fica
 * acesa e as outras apagadas, porque saber que um valor não se aplica também é
 * informação, e esconder a caixa apagaria isso.
 *
 * Serve tanto para o tipo de ECOS, em que pode acender mais de uma, quanto para
 * natureza, nível e dimensão, em que acende exatamente uma. A diferença está só
 * em quantos valores chegam acesos, então é a mesma peça.
 */
const SVG = 'http://www.w3.org/2000/svg';

/* Os tipos de ECOS usam símbolos próprios em traço fino. O corpo do cadeado é
   comum aos dois primeiros e só a alça muda, aberta para um lado ou fechada em
   arco. */
const SIMBOLOS = {
  'Código aberto': ['M6 9V6.5a4 4 0 0 1 7.6-1.7', 'M4.5 9h11v7.5h-11z'],
  'Proprietário': ['M6.5 9V6.5a3.5 3.5 0 0 1 7 0V9', 'M4.5 9h11v7.5h-11z'],
  'Híbrido': ['M10 3.2 17 7l-7 3.8L3 7z', 'M3 11.5 10 15.3l7-3.8', 'M3 15.2 10 19l7-3.8']
};

/**
 * O símbolo do valor. Quando não existe símbolo definido, cai no visto para o
 * valor que vale e no círculo vazio para o que não vale, que é o que serve aos
 * atributos sem desenho próprio.
 */
function iconeDoValor(valor, aceso) {
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', '0 0 20 20');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('class', 'opcao__icone');

  const desenhos = SIMBOLOS[valor];
  if (desenhos) {
    desenhos.forEach((d) => svg.append(traco('path', { d })));
  } else if (aceso) {
    svg.append(traco('path', { d: 'M4.5 10.5 8.2 14.2 15.5 6.4' }));
  } else {
    svg.append(traco('circle', { cx: 10, cy: 10, r: 6 }));
  }
  return svg;
}

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

/** Preenche o detalhe de um tipo de ECOS sem repetir o nome do botão. */
function preencherObservacaoTipoEcos(painel, observacao) {
  painel.replaceChildren();
  painel.hidden = false;

  if (!observacao?.descricao) {
    painel.append(criar('p', 'tipo-ecos__texto', 'Não há exemplos desse tipo de ECOS registrados nas evidências disponíveis para este conhecimento.'));
    return;
  }

  painel.append(criar('p', 'tipo-ecos__texto', observacao.descricao));
  if (observacao.exemplos?.length) {
    const exemplos = criar('ul', 'tipo-ecos__exemplos');
    observacao.exemplos.forEach((exemplo) => exemplos.append(criar('li', null, exemplo)));
    painel.append(exemplos);
  }
  if (observacao.referencias?.length) {
    const referencias = criar('ul', 'tipo-ecos__referencias');
    observacao.referencias.forEach((referencia) => referencias.append(criar('li', null, referencia)));
    painel.append(referencias);
  }
}

/**
 * Os três tipos ficam disponíveis para consulta. Quando não há evidência para
 * aquele tipo, o painel explica a ausência sem criar associação artificial.
 */
function tiposDeEcosInterativos(definicao, conhecimento) {
  const observados = conhecimento.tipoEcos || [];
  const observacoes = conhecimento.observacoesTipoEcos || {};
  const lista = criar('ul', 'opcoes');
  const painel = criar('div', 'tipo-ecos__painel');
  const idPainel = `tipo-ecos-${conhecimento.id}`;
  painel.id = idPainel;
  painel.hidden = true;

  function fechar() {
    lista.querySelectorAll('button').forEach((outro) => {
      outro.removeAttribute('data-selecionado');
      outro.setAttribute('aria-expanded', 'false');
    });
    painel.replaceChildren();
    painel.hidden = true;
  }

  function selecionar(botao, observacao) {
    const estavaAberto = botao.getAttribute('aria-expanded') === 'true';
    fechar();
    if (estavaAberto) return;

    botao.setAttribute('data-selecionado', '');
    botao.setAttribute('aria-expanded', 'true');
    preencherObservacaoTipoEcos(painel, observacao);
  }

  definicao.valores.forEach((v) => {
    const aceso = observados.includes(v.valor);
    const observacao = observacoes[v.valor];
    const item = criar('li');
    if (aceso) item.setAttribute('data-aceso', '');

    const caixa = criar('button', 'opcao opcao--interativa');
    caixa.type = 'button';
    caixa.setAttribute('aria-controls', idPainel);
    caixa.setAttribute('aria-expanded', 'false');
    caixa.addEventListener('click', () => selecionar(caixa, observacao));
    caixa.append(
      iconeDoValor(v.valor, aceso),
      criar('span', 'opcao__nome', v.valor),
      criar('span', 'apenas-leitor', aceso ? ', observado' : ', não observado')
    );
    item.append(caixa);
    lista.append(item);
  });

  return [lista, painel];
}

/**
 * O botão de ajuda abre uma explicação completa em vez de apertar detalhes em
 * uma nota flutuante ao lado do cartão.
 */
function ajuda(dados, chave) {
  const conteudo = dados.meta.ajudas?.[chave];
  if (!conteudo) return document.createDocumentFragment();

  const raiz = criar('div', 'ajuda');
  const botao = criar('button', 'ajuda__abrir', '?');
  botao.type = 'button';
  botao.setAttribute('aria-label', `Saiba mais sobre ${conteudo.titulo}`);
  botao.addEventListener('click', () => abrirAjuda(dados, conteudo));
  raiz.append(botao);
  return raiz;
}

let fecharAjudaGerenciaAtiva = null;

/** A ajuda da gerência fica junto da seção para não abrir outro diálogo sobre ela. */
function ajudaGerencia(dados) {
  const conteudo = dados.meta.ajudas?.gerencia;
  if (!conteudo) return document.createDocumentFragment();

  const raiz = criar('div', 'ajuda ajuda--contextual');
  const botao = criar('button', 'ajuda__abrir', '?');
  const painel = criar('div', 'ajuda__painel');
  const idPainel = 'ajuda-gerencia-painel';

  botao.type = 'button';
  botao.setAttribute('aria-label', `Saiba mais sobre ${conteudo.titulo}`);
  botao.setAttribute('aria-controls', idPainel);
  botao.setAttribute('aria-expanded', 'false');

  painel.id = idPainel;
  painel.hidden = true;
  painel.setAttribute('role', 'dialog');
  painel.setAttribute('aria-label', conteudo.titulo);
  painel.append(
    criar('strong', 'ajuda__painel-titulo', conteudo.titulo),
    criar('p', 'ajuda__painel-texto', conteudo.texto)
  );

  const referencia = referenciaCurta(dados, conteudo.referencia);
  if (referencia) painel.append(criar('p', 'ajuda__painel-fonte', `Fonte: ${referencia}`));

  const fechar = (devolverFoco = false) => {
    painel.hidden = true;
    botao.setAttribute('aria-expanded', 'false');
    document.removeEventListener('pointerdown', fecharAoClicarFora, true);
    document.removeEventListener('keydown', fecharComTecla, true);
    if (fecharAjudaGerenciaAtiva === fechar) fecharAjudaGerenciaAtiva = null;
    if (devolverFoco) botao.focus();
  };
  const fecharAoClicarFora = (evento) => {
    if (!raiz.contains(evento.target)) fechar();
  };
  const fecharComTecla = (evento) => {
    if (evento.key === 'Escape') {
      evento.preventDefault();
      fechar(true);
    }
  };
  const abrir = () => {
    fecharAjudaGerenciaAtiva?.();
    painel.hidden = false;
    botao.setAttribute('aria-expanded', 'true');
    document.addEventListener('pointerdown', fecharAoClicarFora, true);
    document.addEventListener('keydown', fecharComTecla, true);
    fecharAjudaGerenciaAtiva = fechar;
  };

  botao.addEventListener('click', () => (painel.hidden ? abrir() : fechar()));
  raiz.append(botao, painel);
  return raiz;
}

/** Mantém um único diálogo de ajuda e preenche-o com conteúdo vindo de dados/. */
export function abrirAjuda(dados, conteudo) {
  const dialogo = document.querySelector('#dialogo-ajuda');
  if (!dialogo) return;

  document.querySelector('#dialogo-ajuda-titulo').textContent = conteudo.titulo;
  document.querySelector('#dialogo-ajuda-texto').textContent = conteudo.texto;
  const fonte = document.querySelector('#dialogo-ajuda-fonte');
  const referencia = referenciaCurta(dados, conteudo.referencia);
  fonte.hidden = !referencia;
  fonte.textContent = referencia ? `Fonte: ${referencia}` : '';
  dialogo.showModal();
  /* O diálogo recebe o foco inicial. Assim o contexto é anunciado sem criar
     um destaque visual indevido no botão de fechar. */
  dialogo.focus({ preventScroll: true });
}

/** Uma seção da ficha, com título, linha opcional de apoio e ajuda. */
function secao(dados, titulo, chaveDaAjuda, linhaDeApoio, controleAjuda) {
  const bloco = criar('section', 'bloco-ficha');
  const topo = criar('header', 'bloco-ficha__topo');
  const textos = criar('div', 'bloco-ficha__textos');
  textos.append(criar('h3', 'bloco-ficha__titulo', titulo));
  if (linhaDeApoio) textos.append(criar('p', 'bloco-ficha__esquema', linhaDeApoio));
  topo.append(textos, controleAjuda || ajuda(dados, chaveDaAjuda));
  bloco.append(topo);
  return bloco;
}

/* Os três atributos são a classificação completa que a revisão apresenta para
   cada conhecimento. */
const CLASSIFICACAO = ['natureza', 'nivel', 'dimensao'];

/**
 * A classificação é texto, não caixa. Com um valor possível por atributo, a
 * fileira de caixas gastava altura para dizer o que o par rótulo e valor diz em
 * duas linhas, e empurrava as seções seguintes para fora da primeira tela no celular.
 */
function classificacao(dados, conhecimento) {
  const bloco = secao(dados, 'Classificação do conhecimento', 'classificacao');

  const grade = criar('dl', 'classificacao');
  CLASSIFICACAO.forEach((chave) => {
    const item = criar('div', 'classificacao__item');
    item.append(
      criar('dt', 'classificacao__rotulo', dados.classificacoes[chave].rotulo),
      criar('dd', 'classificacao__valor', conhecimento[chave] || 'A definir')
    );
    grade.append(item);
  });
  bloco.append(grade);

  if (conhecimento.justificativaClassificacao) {
    const porque = criar('details', 'porque');
    const abrir = criar('summary', 'porque__abrir');
    const texto = criar('p', 'porque__texto', conhecimento.justificativaClassificacao);
    texto.id = `justificativa-classificacao-${conhecimento.id}`;
    abrir.setAttribute('aria-controls', texto.id);
    abrir.setAttribute('aria-expanded', 'false');
    abrir.append(criar('span', 'porque__seta'), criar('span', null, 'Por que essa classificação?'));
    porque.addEventListener('toggle', () => abrir.setAttribute('aria-expanded', String(porque.open)));
    porque.append(abrir, texto);
    bloco.append(porque);
  }
  return bloco;
}

/** Tipo de ECOS é evidencial e independente da classificação principal. */
function tiposDeEcos(dados, conhecimento) {
  const bloco = secao(dados, 'Exemplos de ECOS em que esse conhecimento foi observado', 'tipoEcos');
  bloco.append(...tiposDeEcosInterativos(dados.classificacoes.tipoEcos, conhecimento));
  return bloco;
}

/* Os três campos de gerência não afirmam posse do conhecimento. Eles indicam
   de onde ele tende a vir, quem pode precisar dele e como pode ser cuidado. */
const GERENCIA = [
  ['quemPossui', 'Principais fontes'],
  ['quemPrecisa', 'Principais receptores'],
  ['comoGerenciar', 'Práticas de gerência']
];

const texto = (bruto) => (Array.isArray(bruto) ? bruto.join(', ') : bruto) || '';

/** Um campo de gerência por linha. Campo vazio não produz marcador na ficha. */
function gerencia(dados, conhecimento) {
  const bloco = secao(dados, 'Gerência do conhecimento no ECOS', 'gerencia', undefined, ajudaGerencia(dados));
  const lista = criar('dl', 'gerencia');

  if (dados.meta.gerenciaConhecimento) {
    bloco.append(criar('p', 'gerencia__introducao', dados.meta.gerenciaConhecimento));
  }
  GERENCIA.forEach(([chave, rotulo]) => {
    const conteudo = texto(conhecimento[chave]);
    if (conteudo) lista.append(criar('dt', 'gerencia__rotulo', rotulo), criar('dd', 'gerencia__valor', conteudo));
  });

  bloco.append(lista);
  return bloco;
}

/* ---------- Relações e estudos ---------- */

/* Os ícones descrevem visualmente o tipo de dificuldade. A chave vem do dado
   do desafio, para que a escolha não se misture à relação científica. */
const ICONES_DESAFIOS = {
  search: [['circle', { cx: 8.5, cy: 8.5, r: 4 }], ['path', { d: 'm11.5 11.5 4.5 4.5' }]],
  'user-search': [
    ['circle', { cx: 7.5, cy: 6.5, r: 2.5 }], ['path', { d: 'M3.5 16c.4-2.7 1.9-4 4-4 1 0 1.9.3 2.6.9' }],
    ['circle', { cx: 15, cy: 14, r: 2.5 }], ['path', { d: 'm16.8 15.8 2 2' }]
  ],
  'share-2': [
    ['circle', { cx: 5, cy: 10, r: 2 }], ['circle', { cx: 15.5, cy: 4.5, r: 2 }], ['circle', { cx: 15.5, cy: 15.5, r: 2 }],
    ['path', { d: 'm6.8 9 6.8-3.6M6.8 11l6.8 3.6' }]
  ],
  scale: [
    ['path', { d: 'M10 3v13M4 6h12M6 6l-2.2 5h4.4L6 6Zm8 0-2.2 5h4.4L14 6ZM4 17h12' }]
  ],
  'circle-alert': [
    ['circle', { cx: 10, cy: 10, r: 7 }], ['path', { d: 'M10 6.5v4M10 13.5h.01' }]
  ],
  history: [
    ['path', { d: 'M4 9a6 6 0 1 1 1.6 4.1M4 5v4h4M10 6.5V10l2.5 1.5' }]
  ],
  'users-round': [
    ['circle', { cx: 7, cy: 7, r: 2.5 }], ['circle', { cx: 14, cy: 8, r: 2 }],
    ['path', { d: 'M2.8 16c.5-3 2-4.5 4.2-4.5s3.7 1.5 4.2 4.5M12.2 12.5c2.4-.1 4 1.2 4.5 3.5' }]
  ],
  'columns-2': [
    ['rect', { x: 3, y: 4, width: 14, height: 12, rx: 1 }], ['path', { d: 'M10 4v12' }]
  ],
  'lock-keyhole': [
    ['rect', { x: 4.5, y: 9, width: 11, height: 8, rx: 1 }], ['path', { d: 'M6.5 9V6.7a3.5 3.5 0 0 1 7 0V9M10 12v2.5' }]
  ],
  'graduation-cap': [
    ['path', { d: 'm2.5 8 7.5-4 7.5 4-7.5 4-7.5-4ZM5 9.3v4.2c2.7 1.7 7.3 1.7 10 0V9.3M17.5 8v4' }]
  ],
  gauge: [
    ['path', { d: 'M4 15a6 6 0 0 1 12 0M10 11l3-2M6 16h8' }], ['circle', { cx: 10, cy: 11, r: 1 }]
  ],
  handshake: [
    ['path', { d: 'm3 10 3-3 2.5 2.2L11 7l3 3-2 2 1.2 1.2a1.4 1.4 0 0 1-2 2L10 14l-.8.8a1.4 1.4 0 0 1-2-2L6 11.6l-1.2 1.2a1.4 1.4 0 0 1-2-2L4 9.6' }]
  ],
  'file-warning': [
    ['path', { d: 'M6 3h5l3 3v11H6zM11 3v3h3M10 9v3M10 14h.01' }]
  ],
  'message-circle': [
    ['path', { d: 'M16 9a6 6 0 0 1-6 6 6.7 6.7 0 0 1-2.7-.6L4 16l1.1-3A6 6 0 1 1 16 9Z' }]
  ],
  'file-pen': [
    ['path', { d: 'M6 3h5l3 3v5M11 3v3h3M6 3v14h4M11.5 15.5l4.2-4.2 1.5 1.5-4.2 4.2-2 .5z' }]
  ],
  'messages-square': [
    ['path', { d: 'M3 5h11v8H8l-3 3v-3H3zM9 8h8v8h-2v2l-3-2H9z' }]
  ]
};

function iconeDesafio(nome) {
  const caixa = criar('span', 'relacao__icone');
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', '0 0 20 20');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  (ICONES_DESAFIOS[nome] || ICONES_DESAFIOS['circle-alert'])
    .forEach(([tag, atributos]) => svg.append(traco(tag, atributos)));
  caixa.append(svg);
  return caixa;
}

function iconeInformacao() {
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', '0 0 20 20');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.append(
    traco('circle', { cx: 10, cy: 10, r: 7 }),
    traco('path', { d: 'M10 9v4M10 6.5h.01' })
  );
  return svg;
}

/**
 * Uma relação de desafio. A linha continua de uma linha só, e o
 * que sustenta a ligação com este conhecimento fica atrás dela, aberto por quem
 * quiser saber.
 */
function linhaRelacao({ id, texto, estudos, icone }, evidencia) {
  const item = criar('li');
  const caixa = criar('details', 'relacao');

  const linha = criar('summary', 'relacao__linha');
  const conteudo = criar('span', 'relacao__conteudo');
  const meta = criar('span', 'relacao__meta');
  meta.append(criar('span', 'relacao__estudos', estudos.join(', ')));
  conteudo.append(
    criar('span', 'codigo-id', id),
    criar('span', 'relacao__nome', texto),
    meta
  );
  linha.append(iconeDesafio(icone), conteudo);
  caixa.append(linha);

  if (evidencia) {
    const porque = criar('div', 'relacao__porque');
    if (evidencia.estudo) {
      porque.append(criar('p', 'relacao__confirmacao', `Confirmado em ${evidencia.estudo}`));
    }
    if (evidencia.motivo) porque.append(criar('p', 'relacao__motivo', evidencia.motivo));
    caixa.append(porque);
  }

  item.append(caixa);
  return item;
}

const linhaDesafio = (d, evidencia) =>
  linhaRelacao({ id: d.id, texto: d.desafio, estudos: d.estudos, icone: d.icone }, evidencia);

/** Os desafios confirmados deste conhecimento. */
function desafios(conhecimento) {
  const evidencia = conhecimento.evidencia || {};
  const bloco = criar('div', 'relacoes-bloco');
  if (!conhecimento.desafiosResolvidos.length) {
    const aviso = criar('div', 'relacoes__vazio');
    aviso.setAttribute('role', 'status');
    aviso.append(
      iconeInformacao(),
      criar('p', null, 'Nenhum desafio foi confirmado para este conhecimento.')
    );
    bloco.append(aviso);
    return bloco;
  }
  const lista = criar('ul', 'relacoes');
  conhecimento.desafiosResolvidos.forEach((d) => lista.append(linhaDesafio(d, evidencia[d.id])));
  bloco.append(lista);
  return bloco;
}

function estudos(conhecimento) {
  const vistos = new Set();
  const associados = conhecimento.estudosResolvidos.filter((estudo) => {
    if (vistos.has(estudo.id)) return false;
    vistos.add(estudo.id);
    return true;
  });
  const bloco = criar('div', 'estudos-bloco');
  if (!associados.length) {
    bloco.append(criar('p', 'vazio', 'Nenhum estudo primário foi associado a este conhecimento.'));
    return bloco;
  }

  const lista = criar('ul', 'estudos');
  associados.forEach((e) => {
    const item = criar('li', 'estudo');
    item.append(criar('span', 'codigo-id', e.id));
    const corpo = criar('div', 'estudo__corpo');
    corpo.append(
      criar('span', 'estudo__titulo', e.titulo),
      criar('span', 'estudo__meta', `${e.autores} · ${e.ano}`)
    );
    item.append(corpo);
    if (e.url) {
      const acessar = criar('a', 'botao estudo__acessar', 'Acessar estudo');
      acessar.href = e.url;
      acessar.target = '_blank';
      acessar.rel = 'noreferrer';
      item.dataset.comLink = '';
      item.append(acessar);
    }
    lista.append(item);
  });
  bloco.append(lista);
  return bloco;
}

function desafiosRelacionados(dados, conhecimento) {
  const bloco = secao(dados, 'Desafios identificados na literatura para a gerência do conhecimento', 'desafios');
  bloco.append(desafios(conhecimento));
  return bloco;
}

function estudosPrimariosAssociados(dados, conhecimento) {
  const bloco = secao(dados, 'Estudos primários associados', 'estudos');
  bloco.append(estudos(conhecimento));
  return bloco;
}

/** Monta a ficha completa e devolve o elemento pronto para inserir. */
export function renderizar(dados, conhecimento) {
  const raiz = criar('div', 'ficha');

  const secoes = [
    classificacao(dados, conhecimento),
    tiposDeEcos(dados, conhecimento),
    gerencia(dados, conhecimento),
    desafiosRelacionados(dados, conhecimento),
    estudosPrimariosAssociados(dados, conhecimento)
  ];
  raiz.append(...secoes);
  return raiz;
}
