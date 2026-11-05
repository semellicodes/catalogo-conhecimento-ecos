/**
 * Transforma um conhecimento em ficha. Não sabe carregar nem filtrar.
 *
 * O identificador e o selo da natureza ficam no topo do diálogo, que é fixo, e
 * não se repetem aqui. As relações e os estudos aparecem em seções próprias.
 */

import { referenciaCurta } from './dados.js?v=20261105-26';

function criar(tag, className, texto) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

function iconeLinkExterno() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 16 16');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('class', 'estudo__icone-link');
  svg.append(
    traco('path', { d: 'M9 2h5v5M14 2 7.5 8.5' }),
    traco('path', { d: 'M12 9.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3.5' })
  );
  return svg;
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

function iconeEcossistema() {
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', '0 0 20 20');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('class', 'exemplos-ecos__icone');
  svg.append(
    traco('circle', { cx: 5, cy: 10, r: 2 }),
    traco('circle', { cx: 14.5, cy: 5, r: 2 }),
    traco('circle', { cx: 14.5, cy: 15, r: 2 }),
    traco('path', { d: 'm6.8 9 5.8-3M6.8 11l5.8 3' })
  );
  return svg;
}

function linkDoEstudo(estudo) {
  const link = criar('a', 'exemplos-ecos__referencia', estudo.id);
  link.href = estudo.url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label', `Acessar publicação ${estudo.id}`);
  link.append(iconeLinkExterno());
  return link;
}

/* Um ícone por ação, no mesmo traço dos de tipo de ECOS. Pena para criação e
   registro, troca entre dois pontos para compartilhamento e engrenagem em
   movimento para uso e aplicação. */
function iconeAcaoGerencia(acao) {
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', '0 0 20 20');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('class', 'exemplos-ecos__icone-categoria');

  if (acao === 'Criação e registro') {
    svg.append(traco('path', { d: 'M13.5 3.5 16.5 6.5 7 16H4v-3l9.5-9.5Z' }), traco('path', { d: 'M12 5 15 8' }));
  } else if (acao === 'Compartilhamento') {
    svg.append(
      traco('path', { d: 'M4 7h9M10.5 4.5 13 7l-2.5 2.5' }),
      traco('path', { d: 'M16 13H7M9.5 10.5 7 13l2.5 2.5' })
    );
  } else {
    svg.append(traco('circle', { cx: 10, cy: 10, r: 2.6 }), traco('path', { d: 'M10 3v2M10 15v2M3 10h2M15 10h2M5 5l1.5 1.5M13.5 13.5 15 15M15 5l-1.5 1.5M6.5 13.5 5 15' }));
  }
  return svg;
}

function iconeCategoriaEcos(categoria) {
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', '0 0 20 20');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('class', 'exemplos-ecos__icone-categoria');

  if (categoria === 'ECOS de Código Aberto') {
    svg.append(traco('path', { d: 'm7 5-4 5 4 5M13 5l4 5-4 5M11.5 3l-3 14' }));
  } else if (categoria === 'ECOS Híbrido') {
    svg.append(
      traco('path', { d: 'm10 3 6 3.5-6 3.5L4 6.5 10 3Z' }),
      traco('path', { d: 'm4 10 6 3.5 6-3.5' }),
      traco('path', { d: 'm4 13.5 6 3.5 6-3.5' })
    );
  } else {
    svg.append(traco('rect', { x: 4.5, y: 8, width: 11, height: 8, rx: 1.5 }), traco('path', { d: 'M7 8V6a3 3 0 0 1 6 0v2' }));
  }
  return svg;
}

function autoresDoEstudo(estudo) {
  const pessoas = estudo.autores.includes(';')
    ? estudo.autores.split(';').map((pessoa) => pessoa.trim())
    : estudo.autores.split(',').map((pessoa) => pessoa.trim());
  const sobrenome = (pessoa) => pessoa.includes(',') ? pessoa.split(',')[0].trim() : pessoa.split(/\s+/).at(-1);
  if (pessoas.length === 1) return sobrenome(pessoas[0]);
  if (pessoas.length === 2) return `${sobrenome(pessoas[0])} e ${sobrenome(pessoas[1])}`;
  return `${sobrenome(pessoas[0])} et al.`;
}

const NOMES_ECOSSISTEMAS = {
  E01: 'Apple, Android, SAP, Salesforce e Oracle',
  E02: 'PaddlePaddle, Apollo, openEuler, OpenHarmony, MindSpore, openGauss e EdgeGallery',
  E03: 'Astropy', E04: 'Nexus Mods', E05: 'OSDU', E06: 'SAP Business Technology Platform',
  E07: 'Oskari, Decidim e PloneGov', E08: 'Node.js e E-SECO', E10: 'Ecossistema proprietário do setor de seguros',
  E11: 'OpenStack', E12: 'SAP Cloud Platform e SAP Developer Community',
  E13: 'Go, npm, Bower, PyPI, RubyGems, Packagist e Maven',
  E15: 'Portal do Software Público Brasileiro e 4CMBr', E16: 'Ecossistema industrial de cidade inteligente',
  E17: 'Eclipse e Eclipse Marketplace', E18: 'Indústria de software empacotado',
  'E09:ECOS de Código Aberto': 'WordPress', 'E09:ECOS Híbrido': 'Magento', 'E09:ECOS Proprietário': 'Shopify'
};

function nomeDoEcossistema(estudo, categoria) {
  return NOMES_ECOSSISTEMAS[`${estudo.id}:${categoria}`] || NOMES_ECOSSISTEMAS[estudo.id];
}

/** Os exemplos nascem apenas dos estudos já ligados a cada conhecimento. */
function exemplosDeEcos(conhecimento) {
  const grupos = new Map();
  conhecimento.estudosResolvidos
    .forEach((estudo) => {
      const exemplos = estudo.exemplosEcos || (estudo.categoriaEcos && estudo.contextoEcos
        ? [{ categoria: estudo.categoriaEcos, contexto: estudo.contextoEcos }]
        : []);
      exemplos.forEach((exemplo) => {
        const grupo = grupos.get(exemplo.categoria) || [];
        grupo.push({ ...estudo, contextoEcos: exemplo.contexto });
        grupos.set(exemplo.categoria, grupo);
      });
    });

  const raiz = criar('div', 'exemplos-ecos');
  const painel = criar('div', 'exemplos-ecos__painel');
  const idPainel = `exemplos-ecos-${conhecimento.id}`;
  painel.id = idPainel;
  painel.hidden = true;

  function mostrar(categoria) {
    painel.replaceChildren();
    const estudos = grupos.get(categoria) || [];
    if (!estudos.length) {
      painel.append(criar('p', 'exemplos-ecos__texto', `Nenhum exemplo de ${categoria} foi relatado nos estudos primários associados a esse conhecimento. Isso reflete o escopo da literatura analisada, não a inaplicabilidade do conhecimento a esse tipo de ECOS.`));
      return;
    }

    painel.append(criar('p', 'exemplos-ecos__texto', `Esse conhecimento foi observado em ${categoria}, especialmente em contextos nos quais o conhecimento associado aparece nas práticas, tecnologias ou interações do ecossistema. Os estudos abaixo identificaram esse conhecimento nos seguintes ${categoria}:`));
    const listaEstudos = criar('ul', 'exemplos-ecos__lista');
    estudos.forEach((estudo) => {
      const item = criar('li', 'exemplos-ecos__item');
      const autoria = criar('strong', '', `${autoresDoEstudo(estudo)} (${estudo.ano}): `);
      const ecossistema = criar('strong', '', `${nomeDoEcossistema(estudo, categoria)}.`);
      item.append(autoria, ecossistema, ' ', linkDoEstudo(estudo));
      listaEstudos.append(item);
    });
    painel.append(listaEstudos);
  }

  const ordemCategorias = ['ECOS de Código Aberto', 'ECOS Híbrido', 'ECOS Proprietário'];
  const lista = criar('div', 'exemplos-ecos__categorias');
  lista.setAttribute('role', 'group');
  lista.setAttribute('aria-label', 'Categorias de ECOS observados');
  ordemCategorias.forEach((categoria) => {
    const botao = criar('button', 'exemplos-ecos__categoria');
    botao.type = 'button';
    botao.setAttribute('aria-controls', idPainel);
    botao.setAttribute('aria-expanded', 'false');
    botao.dataset.identificado = String(grupos.has(categoria));
    botao.append(iconeCategoriaEcos(categoria), criar('span', '', categoria));
    botao.addEventListener('click', () => {
      const estavaAberto = botao.getAttribute('aria-expanded') === 'true';
      lista.querySelectorAll('button').forEach((outro) => outro.setAttribute('aria-expanded', 'false'));
      if (estavaAberto) {
        painel.hidden = true;
        return;
      }
      botao.setAttribute('aria-expanded', 'true');
      mostrar(categoria);
      painel.hidden = false;
    });
    lista.append(botao);
  });
  raiz.append(lista);

  raiz.append(painel);
  return raiz;
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

/** Mantém um único diálogo de ajuda e preenche-o com conteúdo vindo de dados/. */
export function abrirAjuda(dados, conteudo) {
  const dialogo = document.querySelector('#dialogo-ajuda');
  if (!dialogo) return;

  document.querySelector('#dialogo-ajuda-titulo').textContent = conteudo.titulo;
  document.querySelector('#dialogo-ajuda-texto').textContent = conteudo.texto;

  /* Toda ajuda fecha com a sua citação. Os autores saem das mesmas chaves que
     o rodapé do bloco já usa, então não há duas listas a manter.

     O prefixo é opcional e existe para a ajuda que não explica um esquema
     alheio, e sim uma síntese deste trabalho. Sem ele a citação aparece
     sozinha, como em todo o resto do catálogo. */
  const fonte = document.querySelector('#dialogo-ajuda-fonte');
  const citacao = referenciaCurta(dados, conteudo.referencia);
  fonte.textContent = citacao
    ? `${conteudo.prefixoFonte ? `${conteudo.prefixoFonte} ` : ''}${citacao}.`
    : '';
  fonte.hidden = !citacao;
  dialogo.showModal();
  /* O diálogo recebe o foco inicial. Assim o contexto é anunciado sem criar
     um destaque visual indevido no botão de fechar. */
  dialogo.focus({ preventScroll: true });
}

/**
 * Uma seção da ficha, com título, linha opcional de apoio e ajuda.
 *
 * A fonte não aparece no pé do bloco. Ela já fecha o painel de ajuda do mesmo
 * bloco, então repetir no pé mostrava a mesma citação duas vezes na mesma
 * seção. Na Estrutura e no Explorar o pé continua, porque lá não há ajuda.
 */
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
  const bloco = secao(dados, 'Exemplos de ECOS em que o conhecimento foi observado', 'tipoEcos');
  bloco.classList.add('bloco-ficha--exemplos');
  bloco.querySelector('.bloco-ficha__titulo').prepend(iconeEcossistema());
  bloco.append(exemplosDeEcos(conhecimento));
  return bloco;
}

/* Os campos de gerência não afirmam posse do conhecimento. Eles dizem por que
   recursos ele circula, quem participa dessa circulação e que ações o apoiam.
   Os rótulos moram aqui porque são do desenho da ficha, não do vocabulário. */
/* O praticasGerencia saiu desta lista. Ele agora aparece dentro do painel de
   cada ação identificada, e mantê-lo também como linha solta mostraria o mesmo
   texto duas vezes no bloco. */
const GERENCIA = [
  ['recursosConhecimento', 'Recursos de conhecimento no ECOS'],
  ['participacaoCompartilhamento', 'Participação e compartilhamento no ECOS']
];

const texto = (bruto) => (Array.isArray(bruto) ? bruto.join(', ') : bruto) || '';

/* O painel de uma ação identificada. Duas partes rotuladas, porque o texto da
   prática é um só por conhecimento e não está dividido por ação. Rotular evita
   que ele seja lido como explicação exclusiva daquela ação. */
function painelDaAcao(painel, valor, praticas) {
  painel.append(
    criar('p', 'acoes-gerencia__rotulo', 'Sobre a ação'),
    criar('p', 'exemplos-ecos__texto', valor.descricao)
  );
  if (praticas) {
    painel.append(
      criar('p', 'acoes-gerencia__rotulo', 'Prática de gerência do conhecimento'),
      criar('p', 'exemplos-ecos__texto', praticas)
    );
  }
}

/**
 * As três ações do vocabulário, sempre as três, como cartões que abrem.
 *
 * A identificada acende e abre a descrição da ação mais a prática daquele
 * conhecimento. A não identificada fica apagada, mas continua clicável e diz
 * que não há evidência registrada, sem afirmar que a ação não caberia ali.
 *
 * O desenho e o comportamento são os mesmos de exemplosDeEcos, um painel só
 * que troca de conteúdo e recolhe ao clicar de novo no mesmo cartão.
 */
function acoesDeGerencia(dados, conhecimento) {
  const escolhidas = conhecimento.acaoGerencia || [];
  const praticas = texto(conhecimento.praticasGerencia);
  const raiz = criar('div', 'acoes-gerencia');
  const painel = criar('div', 'exemplos-ecos__painel');
  painel.id = `acoes-gerencia-${conhecimento.id}`;
  painel.hidden = true;

  const lista = criar('div', 'acoes-gerencia__cartoes');
  lista.setAttribute('role', 'group');
  lista.setAttribute('aria-label', 'Ações de gerência do conhecimento');

  dados.classificacoes.acaoGerencia.valores.forEach((valor) => {
    const identificada = escolhidas.includes(valor.valor);
    const botao = criar('button', 'exemplos-ecos__categoria');
    botao.type = 'button';
    botao.setAttribute('aria-controls', painel.id);
    botao.setAttribute('aria-expanded', 'false');
    botao.dataset.identificado = String(identificada);
    botao.append(iconeAcaoGerencia(valor.valor), criar('span', '', valor.valor));
    /* O estado vai escrito, porque quem usa leitor de tela não recebe a cor. */
    botao.append(criar('span', 'apenas-leitor', identificada ? ', identificada' : ', sem evidência registrada'));

    botao.addEventListener('click', () => {
      const estavaAberto = botao.getAttribute('aria-expanded') === 'true';
      lista.querySelectorAll('button').forEach((outro) => outro.setAttribute('aria-expanded', 'false'));
      if (estavaAberto) {
        painel.hidden = true;
        return;
      }
      botao.setAttribute('aria-expanded', 'true');
      painel.replaceChildren();
      if (identificada) {
        painelDaAcao(painel, valor, praticas);
      } else {
        painel.append(criar('p', 'exemplos-ecos__texto',
          `Nenhuma evidência de ${valor.valor} foi identificada para este conhecimento nos estudos primários associados.`));
      }
      painel.hidden = false;
    });
    lista.append(botao);
  });

  raiz.append(lista, painel);
  return raiz;
}

/** Um campo de gerência por linha. Campo vazio não produz marcador na ficha. */
function gerencia(dados, conhecimento) {
  const bloco = secao(dados, 'Gerência do conhecimento no ECOS', 'gerencia');
  const lista = criar('dl', 'gerencia');

  GERENCIA.forEach(([chave, rotulo]) => {
    const conteudo = texto(conhecimento[chave]);
    if (conteudo) lista.append(criar('dt', 'gerencia__rotulo', rotulo), criar('dd', 'gerencia__valor', conteudo));
  });

  /* Os três cartões fecham o bloco, sempre com o rótulo, porque agora são eles
     que trazem a prática de gerência deste conhecimento. */
  const acoes = criar('dd', 'gerencia__valor gerencia__valor--acoes');
  acoes.append(acoesDeGerencia(dados, conhecimento));
  lista.append(criar('dt', 'gerencia__rotulo', 'Ações de gerência'), acoes);

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

function estudosDoDesafio(desafio, conhecimento) {
  return conhecimento.estudosResolvidos
    .filter((estudo) => desafio.estudos.includes(estudo.id));
}

function acessoAosEstudos(desafio, conhecimento) {
  const estudos = estudosDoDesafio(desafio, conhecimento).filter((estudo) => estudo.url);
  if (!estudos.length) return document.createDocumentFragment();

  const acessar = criar('a', 'desafio-card__acessar', estudos.length > 1 ? 'Acessar estudos' : 'Acessar estudo');
  acessar.href = estudos[0].url;
  acessar.target = '_blank';
  acessar.rel = 'noopener noreferrer';
  acessar.setAttribute('aria-label', `${estudos.length > 1 ? 'Acessar estudos associados' : 'Acessar estudo associado'} ao desafio ${desafio.id}`);
  if (estudos.length > 1) acessar.title = 'Abre o primeiro estudo associado; os demais estão listados na seção de estudos primários.';
  acessar.append(iconeLinkExterno());
  return acessar;
}

/** Cada desafio aparece como um cartão de leitura direta, sem repetir evidências. */
function linhaDesafio(desafio, conhecimento) {
  const item = criar('li', 'desafio-card');
  const conteudo = criar('div', 'desafio-card__conteudo');
  const cabecalho = criar('div', 'desafio-card__cabecalho');
  const estudos = estudosDoDesafio(desafio, conhecimento);
  const metadado = [desafio.id, ...estudos.map((estudo) => estudo.id)].join(' · ');
  const explicacao = criar('p', 'desafio-card__descricao', desafio.explicacao || desafio.desafio);
  explicacao.title = explicacao.textContent;
  cabecalho.append(
    criar('span', 'codigo-id', metadado),
    criar('h4', 'desafio-card__titulo', desafio.desafio)
  );
  conteudo.append(
    cabecalho,
    explicacao
  );
  item.append(iconeDesafio(desafio.icone), conteudo, acessoAosEstudos(desafio, conhecimento));
  return item;
}

/** Os desafios confirmados deste conhecimento. */
function desafios(conhecimento) {
  const bloco = criar('div', 'relacoes-bloco');
  if (!conhecimento.desafiosResolvidos.length) {
    const aviso = criar('div', 'relacoes__vazio');
    aviso.setAttribute('role', 'status');
    aviso.append(
      iconeInformacao(),
      criar('p', null, 'Nenhum desafio foi confirmado para esse conhecimento.')
    );
    bloco.append(aviso);
    return bloco;
  }
  const lista = criar('ul', 'relacoes');
  conhecimento.desafiosResolvidos.forEach((d) => lista.append(linhaDesafio(d, conhecimento)));
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
    bloco.append(criar('p', 'vazio', 'Nenhum estudo primário foi associado a esse conhecimento.'));
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
      const acessar = criar('a', 'estudo__acessar', 'Acessar estudo');
      acessar.href = e.url;
      acessar.target = '_blank';
      acessar.rel = 'noopener noreferrer';
      acessar.append(iconeLinkExterno());
      item.dataset.comLink = '';
      item.append(acessar);
    }
    lista.append(item);
  });
  bloco.append(lista);
  return bloco;
}

function desafiosRelacionados(dados, conhecimento) {
  const bloco = secao(dados, 'Desafios relacionados à Gerência de Conhecimento', 'desafios');
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
