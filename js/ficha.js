/**
 * Transforma um conhecimento em ficha. Não sabe carregar nem filtrar.
 *
 * O identificador e o selo da natureza ficam no topo do diálogo, que é fixo, e
 * não se repetem aqui. As relações e os estudos aparecem em seções próprias.
 */

import { referenciaCurta } from './dados.js?v=20261106-8';

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
  E01: ['Apple', 'Android', 'SAP', 'Salesforce', 'Oracle'],
  E02: ['PaddlePaddle', 'Apollo', 'openEuler', 'OpenHarmony', 'MindSpore', 'openGauss', 'EdgeGallery'],
  E03: ['Astropy'], E04: ['Nexus Mods'], E05: ['OSDU'], E06: ['SAP Business Technology Platform'],
  E07: ['Oskari', 'Decidim', 'PloneGov'], E08: ['Node.js', 'E-SECO'], E10: ['Ecossistema proprietário do setor de seguros'],
  E11: ['OpenStack'], E12: ['SAP Cloud Platform', 'SAP Developer Community'],
  E13: ['Go', 'npm', 'Bower', 'PyPI', 'RubyGems', 'Packagist', 'Maven'],
  E15: ['Portal do Software Público Brasileiro', '4CMBr'], E16: ['Ecossistema industrial de cidade inteligente'],
  E17: ['Eclipse', 'Eclipse Marketplace'], E18: ['Indústria de software empacotado'],
  'E09:ECOS de Código Aberto': ['WordPress'], 'E09:ECOS Híbrido': ['Magento'], 'E09:ECOS Proprietário': ['Shopify']
};

function ecossistemasDoEstudo(estudo, categoria) {
  return NOMES_ECOSSISTEMAS[`${estudo.id}:${categoria}`] || NOMES_ECOSSISTEMAS[estudo.id] || [];
}

function listarEcossistemas(nomes) {
  return new Intl.ListFormat('pt-BR', { style: 'long', type: 'conjunction' }).format(nomes);
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

    const quantidadeEstudos = new Set(estudos.map((estudo) => estudo.id)).size;
    const quantidadeEcos = new Set(
      estudos.flatMap((estudo) => ecossistemasDoEstudo(estudo, categoria))
    ).size;
    const sujeito = quantidadeEstudos === 1 ? 'O estudo abaixo identificou' : 'Os estudos abaixo identificaram';
    const destino = quantidadeEcos === 1 ? `no seguinte ${categoria}` : `nos seguintes ${categoria}`;
    painel.append(criar('p', 'exemplos-ecos__texto', `Esse conhecimento foi observado em ${categoria}, especialmente em contextos nos quais o conhecimento associado aparece nas práticas, tecnologias ou interações do ecossistema. ${sujeito} esse conhecimento ${destino}:`));
    const listaEstudos = criar('ul', 'exemplos-ecos__lista');
    estudos.forEach((estudo) => {
      const item = criar('li', 'exemplos-ecos__item');
      const ecossistema = criar('strong', '', `${listarEcossistemas(ecossistemasDoEstudo(estudo, categoria))}.`);
      item.append(`${autoresDoEstudo(estudo)} (${estudo.ano}): `, ecossistema, ' ', linkDoEstudo(estudo));
      listaEstudos.append(item);
    });
    painel.append(listaEstudos);
  }

  const ordemCategorias = ['ECOS de Código Aberto', 'ECOS Proprietário', 'ECOS Híbrido'];
  const lista = criar('div', 'exemplos-ecos__categorias');
  /* Nenhuma categoria começa aberta. A seção abre neutra e quem escolhe o que
     consultar é quem lê, como nas atividades. A ficha é remontada a cada
     abertura, então o estado não atravessa de um conhecimento para o outro. */
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
  raiz.append(lista, painel);
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

/* A natureza saiu daqui. Ela já aparece no selo do topo da ficha, ao lado do
   identificador, e repeti-la na classificação dizia duas vezes a mesma coisa
   na mesma tela. Ficam o nível e a dimensão, que o topo não mostra. */
const CLASSIFICACAO = ['nivel', 'dimensao'];

/**
 * A classificação é texto, não caixa. Com um valor possível por atributo, a
 * fileira de caixas gastava altura para dizer o que o par rótulo e valor diz em
 * duas linhas, e empurrava as seções seguintes para fora da primeira tela no celular.
 */
/* O valor que se lê em tela pode diferir do valor do dado, que é o que os
   filtros, a ordenação e os arquivos usam. A troca mora no vocabulário, em
   `rotulosExibicao`, num lugar só, e a Estrutura lê do mesmo campo. Hoje é uma,
   "Técnica" lê "Arquitetural (Técnica)". */
function valorExibido(dados, chave, valor) {
  return dados.classificacoes[chave]?.rotulosExibicao?.[valor] ?? valor;
}

/* A justificativa cita o nível e a dimensão deste conhecimento, e os dois vão
   em negrito. Quem decide o que destacar são os próprios valores exibidos, não
   uma marcação escrita no texto, para `dados/` seguir sem marcação dentro. */
function justificativaComDestaque(dados, conhecimento, texto) {
  /* O valor bruto entra junto do rótulo de exibição, porque as justificativas
     escritas antes da troca dizem "a dimensão Técnica" e continuariam sem
     destaque. Quando os dois servem, vence o mais longo, para o rótulo inteiro
     ficar em negrito e não só o pedaço dentro dos parênteses. */
  const destaques = [...new Set(CLASSIFICACAO
    .flatMap((chave) => [valorExibido(dados, chave, conhecimento[chave]), conhecimento[chave]])
    .filter(Boolean))];
  const paragrafo = criar('p', 'porque__texto');
  let resto = texto;
  while (resto) {
    const achado = destaques
      .map((termo) => ({ termo, posicao: resto.indexOf(termo) }))
      .filter((item) => item.posicao >= 0)
      .sort((a, b) => a.posicao - b.posicao || b.termo.length - a.termo.length)[0];
    if (!achado) break;
    if (achado.posicao) paragrafo.append(resto.slice(0, achado.posicao));
    paragrafo.append(criar('strong', null, achado.termo));
    resto = resto.slice(achado.posicao + achado.termo.length);
  }
  if (resto) paragrafo.append(resto);
  return paragrafo;
}

function classificacao(dados, conhecimento) {
  const bloco = secao(dados, 'Classificação do conhecimento', 'classificacao');

  const grade = criar('dl', 'classificacao');
  CLASSIFICACAO.forEach((chave) => {
    const item = criar('div', 'classificacao__item');
    item.append(
      criar('dt', 'classificacao__rotulo', dados.classificacoes[chave].rotulo),
      criar('dd', 'classificacao__valor', valorExibido(dados, chave, conhecimento[chave]) || 'A definir')
    );
    grade.append(item);
  });
  bloco.append(grade);

  if (conhecimento.justificativaClassificacao) {
    const porque = criar('details', 'porque');
    const abrir = criar('summary', 'porque__abrir');
    const texto = justificativaComDestaque(dados, conhecimento, conhecimento.justificativaClassificacao);
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
  bloco.append(exemplosDeEcos(conhecimento));
  return bloco;
}

const texto = (bruto) => (Array.isArray(bruto) ? bruto.join(', ') : bruto) || '';

function capsulaDeAtividade(atividade, painel, lista) {
  const botao = criar('button', 'exemplos-ecos__categoria atividade-gerencia');
  botao.type = 'button';
  botao.setAttribute('aria-controls', painel.id);
  botao.setAttribute('aria-expanded', 'false');
  botao.append(criar('span', '', atividade.atividade), criar('span', 'atividade-gerencia__seta'));
  botao.addEventListener('click', () => {
    const estavaAberto = botao.getAttribute('aria-expanded') === 'true';
    lista.querySelectorAll('button').forEach((outro) => outro.setAttribute('aria-expanded', 'false'));
    if (estavaAberto) {
      painel.hidden = true;
      return;
    }
    botao.setAttribute('aria-expanded', 'true');
    painel.replaceChildren(
      criar('p', 'acoes-gerencia__rotulo', atividade.atividade),
      criar('p', 'exemplos-ecos__texto', atividade.descricao)
    );
    if (atividade.estudos?.length) {
      painel.append(criar('p', 'exemplos-ecos__texto exemplos-ecos__texto--estudos',
        `Estudos associados: ${atividade.estudos.join(' e ')}`));
    }
    painel.hidden = false;
  });
  return botao;
}

/**
 * As atividades identificadas para este conhecimento, nas cápsulas.
 *
 * Só entram as atividades que as evidências sustentam. Nenhuma atividade do
 * referencial é exibido apagado para completar a lista, porque ausência de
 * evidência não é evidência de ausência e a aba 3 já diz que não se pressupõe
 * que todos estejam presentes.
 */
function atividadesDeGerencia(conhecimento) {
  const raiz = criar('div', 'acoes-gerencia');
  const painel = criar('div', 'exemplos-ecos__painel');
  painel.id = `atividades-gerencia-${conhecimento.id}`;
  painel.hidden = true;

  const lista = criar('div', 'acoes-gerencia__capsulas');
  lista.setAttribute('role', 'group');
  lista.setAttribute('aria-label', 'Atividades de gerência do conhecimento');
  conhecimento.atividadesGerencia.forEach((atividade) =>
    lista.append(capsulaDeAtividade(atividade, painel, lista)));

  raiz.append(lista, painel);
  return raiz;
}

const ICONES_ATIVIDADE = {
  'Identificação': [['circle', { cx: 9, cy: 9, r: 4.5 }], ['path', { d: 'm12.6 12.6 4 4' }]],
  'Aquisição': [['path', { d: 'M10 3v8M7 8.5 10 11.5 13 8.5' }], ['path', { d: 'M4 14.5h12' }]],
  'Compartilhamento': [['circle', { cx: 5, cy: 10, r: 2 }], ['circle', { cx: 15, cy: 5, r: 2 }],
    ['circle', { cx: 15, cy: 15, r: 2 }], ['path', { d: 'm6.9 9.2 6.2-3.1M6.9 10.8l6.2 3.1' }]],
  'Armazenamento': [['ellipse', { cx: 10, cy: 5.5, rx: 6, ry: 2.3 }],
    ['path', { d: 'M4 5.5v9c0 1.3 2.7 2.3 6 2.3s6-1 6-2.3v-9' }], ['path', { d: 'M4 10c0 1.3 2.7 2.3 6 2.3s6-1 6-2.3' }]],
  'Codificação': [['path', { d: 'M7 5 3 10l4 5M13 5l4 5-4 5' }], ['path', { d: 'M11.3 4 8.7 16' }]],
  'Criação': [['circle', { cx: 10, cy: 10, r: 6.5 }], ['path', { d: 'M10 6.6v6.8M6.6 10h6.8' }]],
  'Aplicação': [['path', { d: 'M3.5 10h8M9 7.3 11.7 10 9 12.7' }], ['path', { d: 'M13.5 4.5h3v11h-3' }]],
  'Avaliação': [['circle', { cx: 10, cy: 10, r: 6.5 }], ['path', { d: 'm7 10.2 2.2 2.2 4-4.6' }]]
};

function iconeAtividade(nomeAtividade) {
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', '0 0 20 20');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('class', 'exemplos-ecos__icone-categoria');
  (ICONES_ATIVIDADE[nomeAtividade] || []).forEach(([tag, atributos]) => svg.append(traco(tag, atributos)));
  return svg;
}

function iconeLivro() {
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', '0 0 20 20');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('class', 'atividades__icone-estudos');
  svg.append(
    traco('path', { d: 'M4 4.5h4.2c1 0 1.8.6 1.8 1.4v9c0-.8-.8-1.4-1.8-1.4H4z' }),
    traco('path', { d: 'M16 4.5h-4.2c-1 0-1.8.6-1.8 1.4v9c0-.8.8-1.4 1.8-1.4H16z' })
  );
  return svg;
}


function rodapeDeEstudos(dados, conhecimento, ids) {
  const rodape = criar('p', 'atividades__estudos');
  const porId = new Map(conhecimento.estudosResolvidos.map((estudo) => [estudo.id, estudo]));
  rodape.append(iconeLivro(), criar('span', 'atividades__estudos-rotulo',
    dados.meta.fichaAtividades?.rotuloEstudos || 'Estudos associados:'));
  ids.forEach((id) => {
    const estudo = porId.get(id);
    rodape.append(estudo?.url ? linkDoEstudo(estudo) : criar('span', 'exemplos-ecos__referencia', id));
  });
  return rodape;
}

/* Quando atividadesGerencia existe como lista, o conhecimento
   já foi revisado, mesmo que nenhuma atividade tenha sido
   identificada nos estudos primários associados.
   Se o campo não existir, a revisão permanece pendente. */
function painelSemInformacao(dados, conhecimento, nomeAtividade) {
  const copia = dados.meta.fichaAtividades || {};
  const revista = Array.isArray(conhecimento.atividadesGerencia);
  const nome = conhecimento.nomeEmFrase || `a ${conhecimento.nome.toLowerCase()}`;
  const modelo = revista ? copia.textoSemInformacao : copia.textoPendente;
  const titulo = revista
    ? (copia.tituloSemInformacao || 'Informação não identificada')
    : (copia.tituloPendente || 'Revisão pendente');
  const texto = (modelo || '')
    .replace('{atividade}', nomeAtividade.toLowerCase())
    .replace('{conhecimento}', nome);
  return [
    criar('p', 'acoes-gerencia__rotulo', titulo),
    criar('p', 'exemplos-ecos__texto atividades__descricao', texto)
  ];
}

/* O painel de uma atividade nasce depois da grade. Em fichas estreitas ele
   pode abrir fora do trecho visível do miolo rolável, sem que a página atrás
   do diálogo deva se mover. */
function revelarPainelDeAtividade(painel) {
  const corpo = painel.closest('.dialogo-ficha__corpo');
  if (!corpo || painel.hidden) return;

  const limitesDoCorpo = corpo.getBoundingClientRect();
  const limitesDoPainel = painel.getBoundingClientRect();
  const recuo = 12;
  const inicioVisivel = limitesDoCorpo.top + recuo;
  const trechoInicial = Math.min(limitesDoPainel.height, 72);
  const inicioConfortavel = limitesDoCorpo.bottom - recuo - trechoInicial;

  /* Se o título e o começo da explicação já cabem no miolo, não desloca a
     leitura. Isso também evita movimento ao trocar entre atividades visíveis. */
  if (limitesDoPainel.top >= inicioVisivel && limitesDoPainel.top <= inicioConfortavel) return;

  const destino = Math.max(
    0,
    corpo.scrollTop + limitesDoPainel.top - inicioVisivel
  );
  if (Math.abs(destino - corpo.scrollTop) < 1) return;
  const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  corpo.scrollTo({
    top: destino,
    behavior: movimentoReduzido ? 'auto' : 'smooth'
  });
}

/* Um cartão por atividade, com o desenho das categorias de ECOS. O que muda é
   só a cor, que vem do data-identificado, e nenhum deles é desabilitado,
   porque o cartão sem informação precisa poder abrir o aviso. */
function cartaoDeAtividade(dados, conhecimento, nomeAtividade, atividade, painel, lista) {
  const botao = criar('button', 'exemplos-ecos__categoria');
  botao.type = 'button';
  botao.setAttribute('aria-controls', painel.id);
  botao.setAttribute('aria-expanded', 'false');
  botao.dataset.identificado = String(Boolean(atividade));
  botao.append(iconeAtividade(nomeAtividade), criar('span', '', nomeAtividade));
  botao.addEventListener('click', () => {
    const estavaAberto = botao.getAttribute('aria-expanded') === 'true';
    lista.querySelectorAll('button').forEach((outro) => outro.setAttribute('aria-expanded', 'false'));
    if (estavaAberto) {
      painel.hidden = true;
      return;
    }
    botao.setAttribute('aria-expanded', 'true');
    if (atividade) {
      painel.replaceChildren(
        criar('p', 'acoes-gerencia__rotulo', nomeAtividade),
        criar('p', 'exemplos-ecos__texto atividades__descricao', atividade.descricao)
      );
      if (atividade.estudos?.length) painel.append(rodapeDeEstudos(dados, conhecimento, atividade.estudos));
    } else {
      painel.replaceChildren(...painelSemInformacao(dados, conhecimento, nomeAtividade));
    }
    painel.hidden = false;
    /* O quadro seguinte mede o painel já aberto. Só atividades sustentadas
       recebem o deslocamento, pois os avisos informativos não precisam tirar
       a pessoa da posição em que estava. */
    if (atividade) requestAnimationFrame(() => revelarPainelDeAtividade(painel));
  });
  return botao;
}

/**
 * Atividades Associadas ao Conhecimento, a seção que substituiu a gerência por
 * componentes nas fichas migradas.
 *
 * As seis atividades aparecem sempre, na ordem do referencial.
 * Os que têm atividade identificada acendem em verde e os outros ficam
 * neutros, e todos abrem, porque saber que nada foi encontrado também é
 * informação. O painel fica abaixo da grade inteira, nunca dentro de uma
 * célula, para a fileira não mudar de altura nem de posição quando abre.
 */
function atividadesAssociadas(dados, conhecimento) {
  const bloco = secao(dados, 'Atividades associadas à gerência do conhecimento', 'atividades');
  const raiz = criar('div', 'exemplos-ecos atividades');
  const painel = criar('div', 'exemplos-ecos__painel atividades__painel');
  painel.id = `atividades-${conhecimento.id}`;
  painel.hidden = true;

  const lista = criar('div', 'atividades__cartoes');
  lista.setAttribute('role', 'group');
  lista.setAttribute('aria-label', 'Atividades associadas à gerência do conhecimento');
  const porAtividade = new Map((conhecimento.atividadesGerencia || [])
    .map((atividade) => [atividade.atividade, atividade]));
  /* A lista das seis e a ordem delas vêm da aba de Atividades da Estrutura,
     num lugar só, para a ficha e a camada nunca divergirem. */
  atividadesDoReferencial(dados).forEach((nomeAtividade) =>
    lista.append(cartaoDeAtividade(dados, conhecimento, nomeAtividade, porAtividade.get(nomeAtividade), painel, lista)));

  raiz.append(lista, painel);
  bloco.append(raiz);
  return bloco;
}

function atividadesDoReferencial(dados) {
  const aba = dados.meta.estruturaCatalogo?.abas?.find((item) => item.id === 'gerencia');
  return (aba?.atividades?.itens || []).map((atividade) => atividade.nome);
}



function gerencia(dados, conhecimento) {
  return atividadesAssociadas(dados, conhecimento);
}


/* ---------- Relações e estudos ---------- */

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

function estudosPrimariosAssociados(dados, conhecimento) {
  const bloco = secao(dados, 'Estudos primários associados', 'estudos');
  bloco.append(estudos(conhecimento));
  return bloco;
}

/** Monta a ficha completa e devolve o elemento pronto para inserir. */
export function renderizar(dados, conhecimento) {
  const raiz = criar('div', 'ficha');

  /* Os desafios saíram da ficha. Eles continuam nos dados e no Explorar, que é
     onde a relação entre desafio e conhecimento se lê inteira, nos dois
     sentidos. Na ficha eram uma sexta seção sobre um assunto que a ficha não
     trata. */
  const secoes = [
    classificacao(dados, conhecimento),
    tiposDeEcos(dados, conhecimento),
    gerencia(dados, conhecimento),
    estudosPrimariosAssociados(dados, conhecimento)
  ];
  raiz.append(...secoes);
  return raiz;
}
