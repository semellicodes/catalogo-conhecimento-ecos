/**
 * Preenche a abertura e a explicação da estrutura do catálogo.
 */

import { carregar, rotuloDaReferencia, temVerbete } from './dados.js?v=20261106-5';

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
/**
 * A linha de citação de um bloco.
 *
 * `prefixo` existe para a citação que não sustenta o conteúdo ao pé da letra,
 * como "Adaptado de", que avisa que os nomes exibidos não são a taxonomia
 * literal do artigo.
 */
function fonteConceitual(chaves, prefixo) {
  const fonte = criar('p', 'estrutura__fonte-conceitual');
  if (prefixo) fonte.append(criar('span', 'estrutura__fonte-prefixo', prefixo));
  const referencias = (chaves || '').split(',').map((chave) => chave.trim()).filter(Boolean);
  referencias.forEach((chave, indice) => {
    const rotulo = rotuloDaReferencia(chave);
    const item = criar('span', 'estrutura__fonte-item');
    if (temVerbete(chave)) {
      const link = criar('a', '', rotulo);
      link.href = `referencias.html#referencia-${chave}`;
      item.append(link);
    } else {
      item.append(rotulo);
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
  participacao: [['circle', { cx: 7, cy: 7, r: 2.5 }], ['circle', { cx: 14, cy: 8, r: 2 }], ['path', { d: 'M2.8 16c.5-3 2-4.5 4.2-4.5s3.7 1.5 4.2 4.5M12.2 12.5c2.4-.1 4 1.2 4.5 3.5' }]],
  acoes: [['path', { d: 'M4.5 5.5h7M4.5 10h7M4.5 14.5h7' }], ['path', { d: 'm14 5.5 1.2 1.2 2.3-2.3M14 10l1.2 1.2 2.3-2.3M14 14.5l1.2 1.2 2.3-2.3' }]],
  nivel: [['path', { d: 'M4 6h12M6 10h8M8 14h4' }]],
  dimensao: [['circle', { cx: 7.5, cy: 8, r: 4 }], ['circle', { cx: 12.5, cy: 8, r: 4 }], ['circle', { cx: 10, cy: 12.5, r: 4 }]],
  tipos: [['path', { d: 'M3 7.5h4v9H3zM8 4.5h4v12H8zM13 9.5h4v7h-4z' }]],
  nota: [['circle', { cx: 10, cy: 10, r: 6.5 }], ['path', { d: 'M10 9v4M10 6.5h.01' }]],
  evidencias: [['path', { d: 'M3.5 6.5h9v10h-9z' }], ['path', { d: 'M7 3.5h9.5v10' }], ['path', { d: 'M6 10h4M6 13h4' }]],
  revisao: [['path', { d: 'M5 3.5h7l3 3v10H5z' }], ['path', { d: 'M12 3.5v3h3M7.5 10h5M7.5 13h5' }]],
  estudos: [['path', { d: 'M4 5.5h12v10H4z' }], ['path', { d: 'M7 3.5v4M13 3.5v4M7 10h6M7 13h4' }]]
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
/**
 * Um cartão por categoria de natureza epistemológica, com título, definição e
 * fonte.
 *
 * O título é o nome da categoria, igual ao das pastilhas de filtro, do selo do
 * cartão do catálogo e do glossário. O prefixo "Conhecimento" saiu, porque o
 * divisor logo acima já diz que a aba trata da natureza do conhecimento.
 */
function cartaoDeNatureza(valor) {
  const cartao = criar('article', 'atributo-card');
  cartao.append(
    criar('h4', 'atributo-card__titulo', valor.valor),
    criar('p', 'atributo-card__intro', valor.explicacao)
  );
  if (valor.referencia) cartao.append(fonteConceitual(valor.referencia));
  return cartao;
}

/**
 * O divisor entre o conceito e os cartões. Uma frase centralizada, com uma
 * linha fina saindo para cada lado, sem fundo, borda, sombra, ícone nem
 * cartão.
 *
 * É cabeçalho de verdade, porque anuncia os cartões que vêm abaixo e serve de
 * ponto de navegação para quem usa leitor de tela.
 *
 * Vem em caixa normal do dado. A maiúscula é do CSS, como nos outros rótulos
 * do catálogo, e assim o acento se preserva.
 */
function divisorDeClassificacao(conteudo) {
  const divisor = criar('div', 'estrutura__divisor');
  divisor.append(criar('h4', 'estrutura__divisor-texto', conteudo.principal));
  return divisor;
}

function composicaoNaturezas(dados) {
  const composicao = criar('div', 'estrutura__atributos-cards');
  dados.classificacoes.natureza.valores.forEach((valor) =>
    composicao.append(cartaoDeNatureza(valor))
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
  /* Aba sem tituloPainel não leva cabeçalho. O nome da etapa já está no botão
     da aba, e o aria-labelledby aponta para ele, então o painel continua com
     nome acessível sem o h3. */
  if (definicao.tituloPainel) {
    const cabecalho = criar('header', 'estrutura__painel-cabecalho');
    const simbolo = criar('span', 'estrutura__painel-icone');
    simbolo.append(iconeEstrutura(definicao.icone));
    cabecalho.append(simbolo, criar('h3', 'estrutura__painel-titulo', definicao.tituloPainel));
    raiz.append(cabecalho);
  }
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
 * Um cartão de aba da Estrutura. Cabeçalho com ícone, introdução, as
 * categorias numeradas dentro do próprio cartão quando houver, e a citação no
 * pé quando houver.
 *
 * A Classificação usa os três com categorias e a Base de Evidências usa os
 * dois sem nenhuma. O que muda é de onde vem o texto e se as categorias leem
 * em coluna ou em fileira, e isso é decisão de grade, não de componente,
 * senão a Estrutura teria um desenho por aba para a mesma coisa.
 */
function cartaoDeEstrutura(conteudo, valores = [], classe = '') {
  const cartao = criar('article', `estrutura__cartao-atributo ${classe}`.trim());
  /* O rótulo exibido pode diferir do valor do vocabulário, que é o que a ficha,
     os filtros e os dados usam. A aba declara a troca, num lugar só, para a
     Estrutura falar a linguagem do mapa conceitual sem reescrever o dado. */
  const rotulo = (valor) => conteudo.rotulos?.[valor] ?? valor;
  /* Título e introdução são opcionais. A aba dos Exemplos tem um cartão só, e
     o verde acima dela já diz o nome e apresenta o assunto, então repeti-los
     aqui seria o mesmo título duas vezes na mesma tela. */
  if (conteudo.titulo) {
    cartao.append(cabecalhoComIcone(conteudo.icone, conteudo.titulo, 'estrutura__atributo-cabecalho'));
  }
  if (conteudo.introducao) {
    cartao.append(criar('p', 'estrutura__bloco-intro', conteudo.introducao));
  }
  if (valores.length) {
    const lista = criar('ol', 'estrutura__atributo-categorias');
    valores.forEach((valor) => {
      const item = criar('li', 'estrutura__atributo-categoria');
      item.append(
        criar('h5', 'estrutura__atributo-categoria-titulo', rotulo(valor.valor)),
        criar('p', 'estrutura__atributo-categoria-texto', valor.explicacao)
      );
      lista.append(item);
    });
    cartao.append(lista);
  }
  if (conteudo.referencias) {
    cartao.append(fonteConceitual(conteudo.referencias, conteudo.prefixoFonte));
  }
  /* O rodapé diz de onde a informação vem quando a origem é a evidência deste
     trabalho e não uma obra publicada. Usa a mesma linha da citação, para os
     cartões da Estrutura fecharem todos igual. */
  if (conteudo.rodape) {
    const rodape = criar('p', 'estrutura__fonte-conceitual');
    rodape.append(criar('span', 'estrutura__fonte-item', conteudo.rodape));
    cartao.append(rodape);
  }
  return cartao;
}

/* Nível e dimensão tiram título, introdução e citação do próprio vocabulário,
   que é onde o nome do atributo já mora. Só o ícone vem da aba, porque é
   decisão de interface e não parte da classificação. */
function cartaoDeAtributo(dados, atributo) {
  const vocabulario = dados.classificacoes[atributo.chave];
  return cartaoDeEstrutura(
    {
      icone: atributo.icone,
      titulo: vocabulario.rotulo,
      introducao: vocabulario.funcao,
      referencias: vocabulario.referencia,
      /* O prefixo vem da aba, e não do vocabulário, porque é ressalva de
         atribuição e não parte da classificação. O da dimensão avisa que os
         nomes exibidos adaptam a nomenclatura do artigo citado. */
      prefixoFonte: atributo.prefixoFonte,
      rotulos: atributo.rotulos
    },
    vocabulario.valores
  );
}

/* Os exemplos de ECOS são contexto de organização do ecossistema, não um
   atributo de classificação do conhecimento, então viraram etapa própria e o
   cartão ocupa a linha inteira da sua aba. O nome e a apresentação moram no
   cartão verde da aba, e não no vocabulário, porque o rótulo "Tipo de ECOS
   observado" nomeia o campo da ficha e não esta etapa. */
function cartaoDeExemplos(dados, conteudo) {
  return cartaoDeEstrutura(
    conteudo,
    dados.classificacoes[conteudo.chave].valores,
    'estrutura__cartao-atributo--largo'
  );
}

/* O conceito, o título com ícone e a fonte numa composição só. Eram três
   elementos soltos, o cabeçalho do painel, uma caixa de texto e a citação
   abaixo dela, e a separação não dizia nada que a leitura já não dissesse. */
function cartaoConceito(icone, conteudo) {
  const cartao = criar('article', 'estrutura__cartao-conceito');
  cartao.append(
    cabecalhoComIcone(icone, conteudo.titulo, 'estrutura__conceito-cabecalho'),
    criar('p', 'estrutura__conceito-texto', conteudo.texto)
  );
  if (conteudo.referencias) cartao.append(fonteConceitual(conteudo.referencias));
  return cartao;
}

/**
 * O cartão de conceito entra na grade, e não antes dela, para herdar sozinho
 * a largura e o vão vertical dos três cartões de atributo. É o mesmo arranjo
 * da nota que abre a aba de Atributos.
 */
/**
 * A aba vai do conceito à classificação, nessa ordem. Cartão de conceito,
 * divisor que anuncia a classificação, cartão da natureza e os três cartões de
 * categoria.
 *
 * Nível no ECOS e dimensão do ECOS saíram daqui. Eles caracterizam o
 * conhecimento, não definem o que ele é, e a aba agora trata só do conceito e
 * da sua classificação epistemológica.
 */
function explicacaoConhecimento(dados, aba, definicao) {
  const conteudo = [cartaoConceito(definicao.icone, definicao.cartaoIntroducao)];
  if (definicao.divisor) conteudo.push(divisorDeClassificacao(definicao.divisor));
  /* O cartão da natureza diz por escrito que o conhecimento é explícito ou tácito e que o tácito
     se divide em técnico e cognitivo. Sem ele os três cartões abaixo leem como três categorias no
     mesmo nível, que é o que o orientador pediu para desfazer. Ele traz o próprio ícone, porque a
     aba já gastou o dela no cartão de conceito. */
  if (definicao.cartaoNatureza) {
    conteudo.push(cartaoConceito(definicao.cartaoNatureza.icone, definicao.cartaoNatureza));
  }
  conteudo.push(composicaoNaturezas(dados));
  return painel(definicao, aba, '', conteudo, 'estrutura__grade--conhecimento');
}

/**
 * A aba vai do propósito aos critérios, no mesmo arranjo do Ponto de Partida.
 * Cartão de conceito, divisor e os dois cartões de classificação lado a lado.
 *
 * Os exemplos de ECOS saíram para a aba 3. Eles não eram um terceiro critério
 * de classificação do conhecimento, e sim contexto de organização do
 * ecossistema, que agora é etapa própria.
 */
function explicacaoClassificacao(dados, aba, definicao) {
  const conteudo = [cartaoConceito(definicao.icone, definicao.cartaoIntroducao)];
  if (definicao.divisor) conteudo.push(divisorDeClassificacao(definicao.divisor));
  definicao.atributos.forEach((atributo) => conteudo.push(cartaoDeAtributo(dados, atributo)));
  return painel(definicao, aba, '', conteudo, 'estrutura__grade--classificacao');
}

/**
 * A aba 3 repete o arranjo das outras, cartão verde com o nome e a
 * apresentação do assunto, e abaixo o cartão de conteúdo com os três tipos.
 *
 * O cartão de baixo não repete título nem introdução, porque é o único da aba
 * e o verde já os traz. Ele fica com os três tipos e a citação.
 */
function explicacaoExemplos(dados, aba, definicao) {
  return painel(definicao, aba, '', [
    cartaoConceito(definicao.icone, definicao.cartaoIntroducao),
    cartaoDeExemplos(dados, definicao.tiposEcos)
  ], 'estrutura__grade--exemplos');
}

/**
 * A gerência voltou a ser etapa própria. O bloco é o mesmo que vivia no fim da
 * aba de Atributos, com o desenho preservado, só que agora sozinho na sua aba.
 */
/**
 * A aba apresenta os três componentes que organizam a gerência de cada
 * conhecimento. Importância e atores dividem a linha, e as atividades ocupam a
 * linha inteira abaixo, com os oito processos dentro do próprio cartão.
 *
 * Os oito processos vêm do referencial, não das fichas. Nenhum deles é
 * atribuído a conhecimento nenhum aqui, e a introdução do cartão diz por
 * escrito que não se pressupõe que todos estejam presentes.
 */
function explicacaoGerencia(dados, aba, definicao) {
  const conteudo = [cartaoConceito(definicao.icone, definicao.cartaoIntroducao)];
  definicao.componentes.forEach((componente) => conteudo.push(cartaoDeEstrutura(componente)));
  const atividades = definicao.atividades;
  conteudo.push(cartaoDeEstrutura(
    atividades,
    atividades.processos.map((processo) => ({ valor: processo.nome, explicacao: processo.descricao })),
    'estrutura__cartao-atributo--largo estrutura__cartao-atributo--processos'
  ));
  return painel(definicao, aba, '', conteudo, 'estrutura__grade--gerencia');
}

/**
 * A aba tem o cartão verde e os dois componentes que o orientador definiu,
 * estudos primários associados e referências bibliográficas. Sem divisor,
 * porque são os dois componentes da mesma coisa e não um critério anunciando
 * categorias.
 *
 * Ela explica o que cada componente é. Os estudos de cada conhecimento e os
 * verbetes ficam na ficha e na página de referências, que é onde o dado
 * específico mora.
 */
function explicacaoEvidencias(dados, aba, definicao) {
  const conteudo = [cartaoConceito(definicao.icone, definicao.cartaoIntroducao)];
  definicao.componentes.forEach((componente) => conteudo.push(cartaoDeEstrutura(componente)));
  return painel(definicao, aba, '', conteudo, 'estrutura__grade--evidencias');
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

  const criadores = {
    conhecimento: explicacaoConhecimento,
    classificacao: explicacaoClassificacao,
    exemplos: explicacaoExemplos,
    gerencia: explicacaoGerencia,
    evidencias: explicacaoEvidencias
  };
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
