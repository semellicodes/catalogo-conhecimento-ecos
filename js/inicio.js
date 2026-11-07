import { carregar, rotuloDaReferencia, temVerbete, urlDaReferencia } from './dados.js?v=20261106-8';
let dadosReferencias;
const el = (seletor) => document.querySelector(seletor);

function criar(tag, className, texto) {
  const elemento = document.createElement(tag);
  if (className) elemento.className = className;
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
}

function fonteConceitual(chaves, prefixo) {
  const fonte = criar('p', 'estrutura__fonte-conceitual');

  if (prefixo) {
    fonte.append(criar('span', 'estrutura__fonte-prefixo', prefixo));
  }
  const referencias = (chaves || '')
    .split(',')
    .map((chave) => chave.trim())
    .filter(Boolean);
  referencias.forEach((chave, indice) => {
    const rotulo = rotuloDaReferencia(chave);
    const item = criar('span', 'estrutura__fonte-item');

    if (temVerbete(chave)) {
      const link = criar('a', '', rotulo);
      const url = urlDaReferencia(dadosReferencias, chave);
      link.href = url || `referencias.html#referencia-${chave}`;
      if (url) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
      item.append(link);
    } else {
      item.append(rotulo);
    }
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
  nivel: [['path', { d: 'M4 6h12M6 10h8M8 14h4' }]],
  dimensao: [['circle', { cx: 7.5, cy: 8, r: 4 }], ['circle', { cx: 12.5, cy: 8, r: 4 }], ['circle', { cx: 10, cy: 12.5, r: 4 }]],
  tipos: [['path', { d: 'M3 7.5h4v9H3zM8 4.5h4v12H8zM13 9.5h4v7h-4z' }]],
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

function cartaoDeNatureza(valor) {
  const cartao = criar('article', 'atributo-card');
  cartao.append(
    criar('h4', 'atributo-card__titulo', valor.valor),
    criar('p', 'atributo-card__intro', valor.explicacao)
  );
  if (valor.referencia) cartao.append(fonteConceitual(valor.referencia));
  return cartao;
}

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

function cartaoDeEstrutura(conteudo, valores = [], classe = '') {
  const cartao = criar('article', `estrutura__cartao-atributo ${classe}`.trim());
  const rotulo = (valor) => conteudo.rotulos?.[valor] ?? valor;
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
  return cartao;
}

function cartaoDeAtributo(dados, atributo) {
  const vocabulario = dados.classificacoes[atributo.chave];
  return cartaoDeEstrutura(
    {
      icone: atributo.icone,
      titulo: vocabulario.rotulo,
      introducao: vocabulario.funcao,
      referencias: vocabulario.referencia,

      prefixoFonte: atributo.prefixoFonte,
      rotulos: vocabulario.rotulosExibicao
    },
    vocabulario.valores
  );
}

function cartaoDeExemplos(dados, conteudo) {
  return cartaoDeEstrutura(
    conteudo,
    dados.classificacoes[conteudo.chave].valores,
    'estrutura__cartao-atributo--largo'
  );
}

function cartaoConceito(icone, conteudo) {
  const cartao = criar('article', 'estrutura__cartao-conceito');
  cartao.append(
    cabecalhoComIcone(icone, conteudo.titulo, 'estrutura__conceito-cabecalho'),
    criar('p', 'estrutura__conceito-texto', conteudo.texto)
  );
  if (conteudo.referencias) cartao.append(fonteConceitual(conteudo.referencias));
  return cartao;
}

function explicacaoConhecimento(dados, aba, definicao) {
  const conteudo = [cartaoConceito(definicao.icone, definicao.cartaoIntroducao)];
  if (definicao.divisor) conteudo.push(divisorDeClassificacao(definicao.divisor));

  if (definicao.cartaoNatureza) {
    conteudo.push(cartaoConceito(definicao.cartaoNatureza.icone, definicao.cartaoNatureza));
  }
  conteudo.push(composicaoNaturezas(dados));
  return painel(definicao, aba, '', conteudo, 'estrutura__grade--conhecimento');
}

function explicacaoClassificacao(dados, aba, definicao) {
  const conteudo = [cartaoConceito(definicao.icone, definicao.cartaoIntroducao)];
  if (definicao.divisor) conteudo.push(divisorDeClassificacao(definicao.divisor));
  definicao.atributos.forEach((atributo) => conteudo.push(cartaoDeAtributo(dados, atributo)));
  return painel(definicao, aba, '', conteudo, 'estrutura__grade--classificacao');
}

function explicacaoExemplos(dados, aba, definicao) {
  return painel(definicao, aba, '', [
    cartaoConceito(definicao.icone, definicao.cartaoIntroducao),
    cartaoDeExemplos(dados, definicao.tiposEcos)
  ], 'estrutura__grade--exemplos');
}

function explicacaoGerencia(dados, aba, definicao) {
  const atividades = definicao.atividades;
  return painel(definicao, aba, '', [
    cartaoConceito(definicao.icone, definicao.cartaoIntroducao),
    cartaoDeEstrutura(
      atividades,
      atividades.processos.map((processo) => ({ valor: processo.nome, explicacao: processo.descricao })),
      'estrutura__cartao-atributo--processos'
    )
  ], 'estrutura__grade--gerencia');
}

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
  dadosReferencias = dados;
  el('#abertura-resumo').textContent = dados.meta.subtitulo;
  abasDaEstrutura(dados);
}
iniciar();
