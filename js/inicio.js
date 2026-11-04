/**
 * Preenche a abertura e a explicação da estrutura do catálogo.
 */

import { carregar, rotuloDaReferencia, temVerbete } from './dados.js?v=20261104-30';

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
function composicaoNaturezas(dados, definicao) {
  const composicao = criar('article', 'estrutura__composicao-conhecimento');
  const divisor = criar('h4', 'estrutura__divisor');
  divisor.append(criar('span', 'estrutura__divisor-texto', definicao.tituloNaturezas));
  composicao.append(divisor);
  const fileira = criar('ul', 'estrutura__categorias-classificacao estrutura__categorias-classificacao--fileira');
  dados.classificacoes.natureza.valores.forEach((valor) => {
    const item = criar('li', 'estrutura__categoria-classificacao');
    item.append(
      criar('h4', 'estrutura__categoria-classificacao-titulo', valor.valor),
      criar('p', 'estrutura__categoria-classificacao-texto', valor.definicaoBreve)
    );
    if (valor.referencia) item.append(fonteConceitual(valor.referencia));
    fileira.append(item);
  });
  composicao.append(fileira);
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

function composicaoGerencia(dados, definicao) {
  const composicao = criar('article', 'estrutura__composicao-gerencia');
  definicao.campos.forEach((campo) => composicao.append(blocoGerencia(dados, campo)));
  if (definicao.nota) composicao.append(notaMetodologica(definicao.nota));
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

function composicaoEvidencias(dados, definicao) {
  const { revisao, resultados } = definicao;
  const composicao = criar('article', 'estrutura__composicao-evidencias');
  const blocos = criar('div', 'estrutura__evidencias-blocos');
  blocos.append(
    cartaoEvidencia('revisao', revisao.titulo, revisao.descricao, [
      [revisao.registrosRecuperados, revisao.rotuloRecuperados],
      [dados.estudos.length, revisao.rotuloSelecionados]
    ], true),
    cartaoEvidencia('estudos', resultados.titulo, resultados.descricao, [
      [dados.conhecimentos.length, resultados.rotuloConhecimentos],
      [dados.desafios.length, resultados.rotuloDesafios]
    ], false)
  );
  composicao.append(blocos, blocoDesafios(dados, definicao.desafios), fonteConceitual(definicao.referencias));
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

/**
 * Uma seção da taxonomia. Diz o que o atributo identifica, lista as categorias
 * que ele admite e fecha com a fonte do esquema adotado.
 *
 * A pergunta de cada categoria só entra na natureza, que é a entrada principal
 * do catálogo. Em nível e dimensão ela repetiria em miniatura a faixa de
 * perguntas que abre a aba.
 */
function secaoTaxonomia(atributo, comPergunta = false) {
  const bloco = criar('section', 'estrutura__taxonomia-secao');
  const cabecalho = criar('header');
  cabecalho.append(
    criar('h5', 'estrutura__taxonomia-secao-titulo', atributo.rotulo),
    criar('p', 'estrutura__taxonomia-secao-descricao', atributo.funcao)
  );

  const categorias = criar('ul', 'estrutura__categorias-atributo');
  atributo.valores.forEach((valor) => {
    const item = criar('li', 'estrutura__categoria-atributo');
    item.append(
      criar('p', 'estrutura__categoria-atributo-nome', valor.valor),
      criar('p', 'estrutura__categoria-atributo-texto', valor.explicacao)
    );
    if (comPergunta && valor.pergunta) {
      item.append(criar('p', 'estrutura__categoria-atributo-pergunta', valor.pergunta));
    }
    categorias.append(item);
  });

  bloco.append(cabecalho, categorias);
  /* Uma fonte por seção, no pé. Antes era uma por categoria, e as três linhas
     de citação repetidas competiam com o conteúdo que elas sustentam. */
  if (atributo.referencia) bloco.append(fonteConceitual(atributo.referencia));
  return bloco;
}

/**
 * A coluna esquerda, mais larga. As três seções empilham, uma abaixo da outra,
 * porque dividir texto corrido em colunas estreitas era o que quebrava a
 * leitura da aba.
 */
function colunaTaxonomia(dados, definicao) {
  const coluna = criar('section', 'estrutura__classificacao-coluna');
  coluna.append(
    criar('h4', 'estrutura__coluna-titulo', definicao.tituloClassificacao),
    criar('p', 'estrutura__coluna-subtitulo', definicao.subtituloClassificacao)
  );
  const secoes = criar('div', 'estrutura__taxonomia-secoes');
  secoes.append(
    secaoTaxonomia(dados.classificacoes.natureza, true),
    secaoTaxonomia(dados.classificacoes.nivel),
    secaoTaxonomia(dados.classificacoes.dimensao)
  );
  coluna.append(secoes);
  return coluna;
}

function nomeTipoEcos(valor) {
  return {
    'Código aberto': 'ECOS de Código Aberto',
    'Híbrido': 'ECOS Híbrido',
    'Proprietário': 'ECOS Proprietário'
  }[valor] || valor;
}

/**
 * A coluna direita. Só o nome do tipo e uma linha de descrição, porque aqui o
 * papel é mostrar onde o conhecimento foi observado, não classificar.
 */
function colunaTiposEcos(dados, definicao) {
  const atributo = dados.classificacoes.tipoEcos;
  const coluna = criar('section', 'estrutura__tipos-ecos');
  coluna.append(
    criar('h4', 'estrutura__coluna-titulo', definicao.tituloTiposEcos),
    criar('p', 'estrutura__tipos-ecos-intro', definicao.introducaoTiposEcos)
  );
  const lista = criar('ul', 'estrutura__tipos-ecos-lista');
  atributo.valores.forEach((valor) => {
    const item = criar('li', 'estrutura__tipo-ecos');
    item.append(
      criar('h5', 'estrutura__tipo-ecos-titulo', nomeTipoEcos(valor.valor)),
      criar('p', 'estrutura__tipo-ecos-texto', valor.explicacao)
    );
    lista.append(item);
  });
  coluna.append(lista);
  if (definicao.referenciasTiposEcos) coluna.append(fonteConceitual(definicao.referenciasTiposEcos));
  return coluna;
}

function explicacaoConhecimento(dados, aba, definicao) {
  const contexto = criar('div', 'estrutura__contexto-academico');
  contexto.append(fonteConceitual(definicao.referencias));
  const resultado = painel(definicao, aba, definicao.introducao, [contexto, composicaoNaturezas(dados, definicao)], 'estrutura__grade--conhecimento');
  resultado.classList.add('estrutura__painel--conhecimento');
  return resultado;
}

/**
 * A aba vai da introdução geral direto ao detalhamento em duas colunas, a
 * taxonomia à esquerda e os tipos de ECOS observados à direita. A explicação
 * do que são os atributos cabe na introdução, e repeti-la numa faixa logo
 * abaixo era dizer duas vezes a mesma coisa antes do conteúdo começar.
 */
function explicacaoClassificacao(dados, aba, definicao) {
  const colunas = criar('div', 'estrutura__composicao-atributos');
  colunas.append(colunaTaxonomia(dados, definicao), colunaTiposEcos(dados, definicao));
  const resultado = painel(definicao, aba, definicao.introducao, [colunas], 'estrutura__grade--classificacao', undefined, false, definicao.destaqueIntroducao);
  resultado.classList.add('estrutura__painel--classificacao');
  return resultado;
}

function explicacaoGerencia(dados, aba, definicao) {
  const composicao = composicaoGerencia(dados, definicao);
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
