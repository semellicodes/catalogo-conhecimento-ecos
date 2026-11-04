/**
 * Preenche a abertura e a explicação da estrutura do catálogo.
 */

import { carregar, rotuloDaReferencia, temVerbete } from './dados.js?v=20261104-49';

const el = (seletor) => document.querySelector(seletor);

function criar(tag, className, texto) {
  const elemento = document.createElement(tag);
  if (className) elemento.className = className;
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
}


/* Só a citação, sem o rótulo "Fonte" na frente. O lugar e o estilo já dizem
   que aquilo é a fonte do cartão.
   
   Cada citação é um item que quebra inteiro, separado por espaço e não por
   ponto e vírgula, senão o separador sobra pendurado no fim da linha quando a
   lista quebra. */
function fonteConceitual(chaves, prefixo) {
  const fonte = criar('p', 'estrutura__fonte-conceitual');
  /* O prefixo existe para a citação que não sustenta o conteúdo ao pé da
     letra, como "Adaptação de", que avisa que os nomes exibidos não são a
     taxonomia literal do artigo. */
  if (prefixo) fonte.append(criar('span', 'estrutura__fonte-prefixo', prefixo));
  const referencias = (chaves || '').split(',').map((chave) => chave.trim()).filter(Boolean);
  referencias.forEach((chave, indice) => {
    const item = criar('span', 'estrutura__fonte-item');
    if (temVerbete(chave)) {
      const link = criar('a', '', rotuloDaReferencia(chave));
      link.href = `referencias.html#referencia-${chave}`;
      item.append(link);
    } else {
      item.append(rotuloDaReferencia(chave));
    }
    /* O ponto e vírgula fica dentro do item anterior, sem espaço antes dele, e
       o item não parte no meio. Assim o separador nunca se descola da citação
       que ele fecha quando a lista quebra. Depois do último não entra. */
    if (indice < referencias.length - 1) {
      item.append(';', criar('span', 'apenas-leitor', ' '));
    }
    fonte.append(item);
  });
  return fonte;
}

const SVG = 'http://www.w3.org/2000/svg';

const ICONES_ESTRUTURA = {
  conhecimento: [['path', { d: 'M4 4.5h5.1c1.4 0 2.5.7 2.5 1.7v9c0-1-1.1-1.7-2.5-1.7H4z' }], ['path', { d: 'M16 4.5h-5.1c-1.4 0-2.5.7-2.5 1.7v9c0-1 1.1-1.7 2.5-1.7H16z' }]],
  classificacao: [['path', { d: 'M4 5h12M4 10h12M4 15h12' }], ['circle', { cx: 7, cy: 5, r: 1 }], ['circle', { cx: 13, cy: 10, r: 1 }], ['circle', { cx: 9, cy: 15, r: 1 }]],
  gerencia: [['circle', { cx: 5, cy: 10, r: 2 }], ['circle', { cx: 15, cy: 5, r: 2 }], ['circle', { cx: 15, cy: 15, r: 2 }], ['path', { d: 'm6.8 9 6.4-3.1M6.8 11l6.4 3.1' }]],
  recursos: [['path', { d: 'M4 4.5h5.1c1.4 0 2.5.7 2.5 1.7v9c0-1-1.1-1.7-2.5-1.7H4z' }], ['path', { d: 'M16 4.5h-5.1c-1.4 0-2.5.7-2.5 1.7v9c0-1 1.1-1.7 2.5-1.7H16z' }]],
  participacao: [['circle', { cx: 7, cy: 7, r: 2.5 }], ['circle', { cx: 14, cy: 8, r: 2 }], ['path', { d: 'M2.8 16c.5-3 2-4.5 4.2-4.5s3.7 1.5 4.2 4.5M12.2 12.5c2.4-.1 4 1.2 4.5 3.5' }]],
  acoes: [['path', { d: 'M4.5 5.5h7M4.5 10h7M4.5 14.5h7' }], ['path', { d: 'm14 5.5 1.2 1.2 2.3-2.3M14 10l1.2 1.2 2.3-2.3M14 14.5l1.2 1.2 2.3-2.3' }]],
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

function cabecalhoComIcone(icone, titulo, classe) {
  const cabecalho = criar('header', classe);
  const simbolo = criar('span', 'estrutura__icone');
  simbolo.append(iconeEstrutura(icone));
  cabecalho.append(simbolo, criar('h3', `${classe}-titulo`, titulo));
  return cabecalho;
}

/**
 * As três naturezas, no Ponto de Partida. São os mesmos cartões que a aba de
 * atributos usava, com definição, exemplos, pergunta e fonte, porque definir o
 * conceito e a classificação principal na mesma aba é o que a referência faz e
 * o que o próprio artigo faz, que emenda a natureza logo depois da definição.
 */
/* Os três atributos do Ponto de Partida, na ordem em que o catálogo os lê. */
const ATRIBUTOS_PARTIDA = ['natureza', 'nivel', 'dimensao'];

/* A categoria é nome e explicação, sem pergunta própria. A pergunta agora é uma
   por cartão, orientadora do atributo inteiro, e não uma por categoria.

   São dois campos de pergunta de propósito. A `pergunta` do atributo é a da
   tabela do Explorar, com outra redação e outro papel, e mexer nela mudaria
   aquela página. A `perguntaOrientadora` é só deste cartão. */
function categoriaDoAtributo(valor) {
  const item = criar('li', 'atributo-card__categoria');
  item.append(
    criar('h5', 'atributo-card__categoria-nome', valor.valor),
    criar('p', 'atributo-card__categoria-texto', valor.explicacao)
  );
  return item;
}

/**
 * Um cartão por atributo, com as três categorias dentro dele. Não são nove
 * cartões soltos, porque o que agrupa as categorias é justamente o atributo.
 *
 * A ordem dentro do cartão é título, pergunta orientadora, introdução,
 * categorias e fonte. A pergunta vem antes da introdução porque é ela que
 * enquadra o que se vai ler, e a fonte fecha, como em toda a Estrutura.
 */
function cartaoDeAtributo(atributo) {
  const cartao = criar('article', 'atributo-card');
  cartao.append(
    criar('h4', 'atributo-card__titulo', atributo.rotulo),
    criar('p', 'atributo-card__pergunta', atributo.perguntaOrientadora),
    criar('p', 'atributo-card__intro', atributo.funcao)
  );

  const categorias = criar('ul', 'atributo-card__categorias');
  atributo.valores.forEach((valor) => categorias.append(categoriaDoAtributo(valor)));
  cartao.append(categorias);

  if (atributo.referencia) cartao.append(fonteConceitual(atributo.referencia));
  return cartao;
}

/**
 * O Ponto de Partida apresenta o conceito e os três atributos que
 * caracterizam cada conhecimento. A natureza aparece aqui uma vez só, como um
 * dos três, e não mais definida numa camada e retomada como critério na
 * seguinte.
 *
 * Os três cartões dividem a linha no desktop. O conteúdo é longo e a aba fica
 * alta, e é a troca aceita de propósito, porque encurtar o texto para baixar a
 * altura tiraria justamente o que torna os conceitos compreensíveis para quem
 * nunca viu gerência de conhecimento em ECOS.
 *
 * Não há faixa divisória antes dos cartões nem parágrafo depois deles. A aba é
 * conceito, cartões, e termina.
 */
function composicaoAtributos(dados) {
  const composicao = criar('div', 'estrutura__atributos-cards');
  ATRIBUTOS_PARTIDA.forEach((chave) => composicao.append(cartaoDeAtributo(dados.classificacoes[chave])));
  return composicao;
}

/* As etiquetas vêm do vocabulário, nunca escritas aqui, para acompanharem
   sozinhas qualquer mudança na classificação. */
function etiquetasDeAcao(dados) {
  const lista = criar('ul', 'estrutura__acoes-lista');
  dados.classificacoes.acaoGerencia.valores.forEach((valor) =>
    lista.append(criar('li', 'estrutura__acao-gerencia', valor.valor))
  );
  return lista;
}

/**
 * Um cartão da camada. Os três têm a mesma forma, ícone, título, texto e a
 * citação no pé, e o das ações traz ainda as etiquetas.
 */
function blocoGerencia(dados, campo) {
  const bloco = criar('section', 'estrutura__gerencia-item');
  bloco.append(
    cabecalhoComIcone(campo.icone, campo.rotulo, 'estrutura__gerencia-cabecalho'),
    criar('p', 'estrutura__gerencia-texto', campo.descricao)
  );
  if (campo.acoes) bloco.append(etiquetasDeAcao(dados));
  if (campo.referencia) bloco.append(fonteConceitual(campo.referencia, campo.prefixoFonte));
  return bloco;
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

/** Um número grande com o rótulo embaixo, usado nos dois cartões de cima. */
function numeroEvidencia(valor, rotulo) {
  const bloco = criar('div', 'estrutura__numero-evidencia');
  bloco.append(
    criar('p', 'estrutura__numero-evidencia-valor', valor.toLocaleString('pt-BR')),
    criar('p', 'estrutura__numero-evidencia-rotulo', rotulo)
  );
  return bloco;
}

/**
 * Os dois cartões de cima têm a mesma forma, título, uma linha de descrição e
 * dois números grandes lado a lado, para alinharem entre si.
 */
function cartaoEvidencia(icone, titulo, descricao, numeros, comSeta) {
  const bloco = criar('section', 'estrutura__evidencia-linha');
  bloco.append(
    cabecalhoComIcone(icone, titulo, 'estrutura__evidencia-cabecalho'),
    criar('p', 'estrutura__evidencia-texto', descricao)
  );
  const par = criar('div', 'estrutura__par-numeros');
  par.append(numeroEvidencia(...numeros[0]));
  if (comSeta) par.append(criar('span', 'estrutura__funil-seta'));
  par.append(numeroEvidencia(...numeros[1]));
  bloco.append(par);
  return bloco;
}

/**
 * Os desafios, em cartão próprio dentro da base de evidências. A contagem é de
 * associações entre desafio e conhecimento, não de desafios distintos, e por
 * isso o rótulo diz associações.
 */
function blocoDesafios(dados, desafios) {
  const associacoes = dados.conhecimentos.reduce((total, c) => total + (c.desafios?.length || 0), 0);
  const bloco = criar('section', 'estrutura__evidencia-linha estrutura__evidencia-linha--desafios');
  bloco.append(cabecalhoComIcone('desafios', desafios.titulo, 'estrutura__evidencia-cabecalho'));
  const conteudo = criar('div', 'estrutura__evidencia-conteudo');
  conteudo.append(
    criar('p', 'estrutura__evidencia-texto', desafios.descricao),
    numeroEvidencia(associacoes, desafios.rotuloAssociacoes)
  );
  bloco.append(conteudo);
  return bloco;
}

/* Os três cartões numa grade só. O invólucro que agrupava os dois de cima saiu,
   porque a mesma grade resolve, com o cartão dos desafios atravessando as duas
   colunas. Menos um nível de aninhamento e um conjunto de regras a menos. */
function composicaoEvidencias(dados, definicao) {
  const { revisao, resultados } = definicao;
  const composicao = criar('article', 'estrutura__composicao-evidencias');
  composicao.append(
    cartaoEvidencia('revisao', revisao.titulo, revisao.descricao, [
      [revisao.registrosRecuperados, revisao.rotuloRecuperados],
      [dados.estudos.length, revisao.rotuloSelecionados]
    ], true),
    cartaoEvidencia('estudos', resultados.titulo, resultados.descricao, [
      [dados.conhecimentos.length, resultados.rotuloConhecimentos],
      [dados.desafios.length, resultados.rotuloDesafios]
    ], false),
    blocoDesafios(dados, definicao.desafios),
    fonteConceitual(definicao.referencias)
  );
  return composicao;
}

/* O destaque é o trecho que a introdução põe em negrito. Vem de dados/ como
   texto, não como marcação, para o conteúdo continuar fora do código. */
function textoIntroducao(introducao, destaque) {
  const paragrafo = criar('p', 'estrutura__painel-intro');
  const corte = destaque ? introducao.indexOf(destaque) : -1;
  if (corte < 0) {
    paragrafo.textContent = introducao;
    return paragrafo;
  }
  paragrafo.append(
    introducao.slice(0, corte),
    criar('strong', '', destaque),
    introducao.slice(corte + destaque.length)
  );
  return paragrafo;
}

function painel(definicao, aba, introducao, cartoes, classe = '', aviso, avisoDepois = false, destaque) {
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
  if (introducao) raiz.append(textoIntroducao(introducao, destaque));
  const nota = aviso ? criar('p', 'estrutura__aviso', aviso) : null;
  if (nota && !avisoDepois) raiz.append(nota);
  const grade = criar('div', `estrutura__grade ${classe}`.trim());
  grade.append(...cartoes);
  raiz.append(grade);
  if (nota && avisoDepois) raiz.append(nota);
  return raiz;
}

function nomeTipoEcos(valor) {
  return {
    'Código aberto': 'ECOS de Código Aberto',
    'Híbrido': 'ECOS Híbrido',
    'Proprietário': 'ECOS Proprietário'
  }[valor] || valor;
}

/* Os dois blocos da aba abrem igual, com título, introdução, uma linha fina e
   a chamada que apresenta as três categorias. A forma é a mesma para os dois
   lerem como partes de uma seção só. */
function aberturaDeBloco(conteudo, classe) {
  const bloco = criar('section', classe);
  bloco.append(
    criar('h4', 'estrutura__bloco-titulo', conteudo.titulo),
    criar('p', 'estrutura__bloco-intro', conteudo.introducao)
  );
  if (conteudo.chamada) bloco.append(criar('p', 'estrutura__bloco-chamada', conteudo.chamada));
  return bloco;
}

/**
 * Primeiro bloco da aba. Um cartão só, com as três categorias numeradas
 * dentro dele, em leitura vertical. A tipologia é a de Manikas, e a relação de
 * cada modelo com a circulação do conhecimento é contextualização da
 * literatura de gerência de conhecimento, por isso a fonte traz as duas obras.
 */
function blocoTiposEcos(dados, conteudo) {
  const bloco = aberturaDeBloco(conteudo, 'estrutura__tipos-ecos');
  const lista = criar('ol', 'estrutura__tipos-ecos-lista');
  dados.classificacoes.tipoEcos.valores.forEach((valor) => {
    const item = criar('li', 'estrutura__tipo-ecos');
    item.append(
      criar('h5', 'estrutura__tipo-ecos-titulo', nomeTipoEcos(valor.valor)),
      criar('p', 'estrutura__tipo-ecos-texto', valor.explicacao)
    );
    lista.append(item);
  });
  bloco.append(lista);
  if (conteudo.referencias) bloco.append(fonteConceitual(conteudo.referencias));
  return bloco;
}

/* Segundo bloco. Os três cartões de gerência vieram da etapa que existia
   sozinha, com o desenho preservado, e a nota metodológica fecha o bloco. */
function blocoGerenciaDoEcos(dados, conteudo) {
  const bloco = aberturaDeBloco(conteudo, 'estrutura__gerencia-bloco');
  const cartoes = criar('div', 'estrutura__composicao-gerencia');
  conteudo.campos.forEach((campo) => cartoes.append(blocoGerencia(dados, campo)));
  bloco.append(cartoes);
  if (conteudo.nota) bloco.append(notaMetodologica(conteudo.nota));
  return bloco;
}

function explicacaoConhecimento(dados, aba, definicao) {
  const contexto = criar('div', 'estrutura__contexto-academico');
  contexto.append(fonteConceitual(definicao.referencias));
  const resultado = painel(definicao, aba, definicao.introducao, [contexto, composicaoAtributos(dados)], 'estrutura__grade--conhecimento');
  resultado.classList.add('estrutura__painel--conhecimento');
  return resultado;
}

/**
 * A aba reúne os dois blocos, um abaixo do outro, na mesma etapa. A gerência
 * deixou de ser etapa própria porque é atributo do conhecimento, não uma fase
 * seguinte da leitura.
 *
 * O painel não leva introdução própria. Cada bloco já abre com a sua, e um
 * terceiro parágrafo antes deles diria pela terceira vez do que a aba trata.
 */
function explicacaoAtributos(dados, aba, definicao) {
  const resultado = painel(definicao, aba, '', [
    blocoTiposEcos(dados, definicao.tiposEcos),
    blocoGerenciaDoEcos(dados, definicao.gerencia)
  ], 'estrutura__grade--atributos');
  resultado.classList.add('estrutura__painel--atributos');
  return resultado;
}

function explicacaoEvidencias(dados, aba, definicao) {
  const resultado = painel(definicao, aba, definicao.introducao, [composicaoEvidencias(dados, definicao)], 'estrutura__grade--evidencias');
  resultado.classList.add('estrutura__painel--evidencias');
  return resultado;
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

  const criadores = { conhecimento: explicacaoConhecimento, atributos: explicacaoAtributos, evidencias: explicacaoEvidencias };
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
