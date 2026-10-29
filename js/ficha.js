/**
 * Transforma um conhecimento em ficha. Não sabe carregar nem filtrar.
 *
 * O identificador e o selo da natureza ficam no topo do diálogo, que é fixo, e
 * não se repetem aqui. O que é lista desce para abas, uma de cada vez.
 */

import { referenciaCurta } from './dados.js';

const reduzido = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const tokenDeMovimento = (nome) =>
  getComputedStyle(document.documentElement).getPropertyValue(nome).trim();

function criar(tag, className, texto) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

/* ---------- Classificação, em caixas ---------- */

/** Fecha qualquer nota de atributo aberta, venha o pedido de onde vier. */
function fecharNotas() {
  document.querySelectorAll('.ajuda[data-aberto]').forEach((item) => {
    item.removeAttribute('data-aberto');
    item.querySelector('.ajuda__abrir').setAttribute('aria-expanded', 'false');
  });
}

/* Clicar fora fecha a nota aberta. Um ouvinte só, para a ficha inteira. */
document.addEventListener('click', (evento) => {
  if (!evento.target.closest('.ajuda')) fecharNotas();
});

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

/** Preenche o detalhe que abre para um tipo de ECOS observado. */
function preencherObservacaoTipoEcos(painel, observacao) {
  painel.replaceChildren();
  painel.hidden = !observacao;
  if (!observacao) return;

  painel.append(criar('p', 'tipo-ecos__texto', observacao.descricao));
  if (observacao.exemplos?.length) {
    const exemplos = criar('ul', 'tipo-ecos__exemplos');
    observacao.exemplos.forEach((exemplo) => exemplos.append(criar('li', null, exemplo)));
    painel.append(exemplos);
  }
}

/**
 * Tipos observados podem abrir seu próprio contexto, desde que esse contexto
 * esteja registrado no dado. Tipo sem observação continua uma caixa informativa,
 * não um botão que abriria um painel vazio.
 */
function tiposDeEcosInterativos(definicao, conhecimento) {
  const observados = conhecimento.tipoEcos || [];
  const observacoes = conhecimento.observacoesTipoEcos || {};
  const lista = criar('ul', 'opcoes');
  const painel = criar('div', 'tipo-ecos__painel');
  const controles = [];
  const idPainel = `tipo-ecos-${conhecimento.id}`;
  painel.id = idPainel;
  painel.hidden = true;

  function selecionar(botao, observacao) {
    controles.forEach(({ botao: outro }) => {
      outro.removeAttribute('data-selecionado');
      outro.setAttribute('aria-pressed', 'false');
    });
    botao.setAttribute('data-selecionado', '');
    botao.setAttribute('aria-pressed', 'true');
    preencherObservacaoTipoEcos(painel, observacao);
  }

  definicao.valores.forEach((v) => {
    const aceso = observados.includes(v.valor);
    const observacao = observacoes[v.valor];
    const interativo = aceso && observacao?.descricao;
    const item = criar('li');
    if (aceso) item.setAttribute('data-aceso', '');

    const caixa = criar(interativo ? 'button' : 'span', 'opcao');
    if (interativo) {
      caixa.type = 'button';
      caixa.classList.add('opcao--interativa');
      caixa.setAttribute('aria-controls', idPainel);
      caixa.setAttribute('aria-pressed', 'false');
      caixa.addEventListener('click', () => selecionar(caixa, observacao));
      controles.push({ botao: caixa, observacao });
    }
    caixa.append(
      iconeDoValor(v.valor, aceso),
      criar('span', 'opcao__nome', v.valor),
      criar('span', 'apenas-leitor', aceso ? ', observado' : ', não observado')
    );
    item.append(caixa);
    lista.append(item);
  });

  if (controles.length) selecionar(controles[0].botao, controles[0].observacao);
  return [lista, painel];
}

/**
 * O botão de ajuda da seção. Um por bloco, no canto, em vez de um por atributo,
 * e a nota reúne a pergunta e a referência de cada atributo que o bloco mostra.
 */
function ajuda(dados, chaves) {
  const raiz = criar('div', 'ajuda');

  const botao = criar('button', 'ajuda__abrir', '?');
  botao.type = 'button';
  botao.setAttribute('aria-expanded', 'false');
  botao.setAttribute('aria-label', 'Sobre esta classificação');

  const nota = criar('div', 'ajuda__nota');
  chaves.forEach((chave) => {
    const definicao = dados.classificacoes[chave];
    const item = criar('div', 'ajuda__item');
    item.append(
      criar('p', 'ajuda__nome', definicao.rotulo),
      criar('p', 'ajuda__pergunta', definicao.pergunta)
    );
    const ref = referenciaCurta(dados, definicao.referencia);
    if (ref) item.append(criar('p', 'ajuda__referencia', ref));
    nota.append(item);
  });

  botao.addEventListener('click', () => {
    const aberto = raiz.hasAttribute('data-aberto');
    fecharNotas();
    if (!aberto) {
      raiz.setAttribute('data-aberto', '');
      botao.setAttribute('aria-expanded', 'true');
    }
  });

  raiz.append(botao, nota);
  return raiz;
}

/** Uma seção da ficha, com título, linha opcional de apoio e ajuda. */
function secao(dados, titulo, chavesDeAjuda, linhaDeApoio) {
  const bloco = criar('section', 'bloco-ficha');
  const topo = criar('header', 'bloco-ficha__topo');
  const textos = criar('div', 'bloco-ficha__textos');
  textos.append(criar('h3', 'bloco-ficha__titulo', titulo));
  if (linhaDeApoio) textos.append(criar('p', 'bloco-ficha__esquema', linhaDeApoio));
  topo.append(textos, ajuda(dados, chavesDeAjuda));
  bloco.append(topo);
  return bloco;
}

/* Os três atributos são a classificação completa que a revisão apresenta para
   cada conhecimento. */
const CLASSIFICACAO = ['natureza', 'nivel', 'dimensao'];

/* Nome do esquema, provisório até o orientador confirmar o definitivo. */
const ESQUEMA = 'Segundo os esquemas adotados na revisão';

/**
 * A classificação é texto, não caixa. Com um valor possível por atributo, a
 * fileira de caixas gastava altura para dizer o que o par rótulo e valor diz em
 * duas linhas, e empurrava as abas para fora da primeira tela no celular.
 */
function classificacao(dados, conhecimento) {
  const bloco = secao(dados, 'Classificação do conhecimento', CLASSIFICACAO, ESQUEMA);

  const grade = criar('dl', 'classificacao');
  CLASSIFICACAO.forEach((chave) => {
    grade.append(
      criar('dt', 'classificacao__rotulo', dados.classificacoes[chave].rotulo),
      criar('dd', 'classificacao__valor', conhecimento[chave] || 'A definir')
    );
  });
  bloco.append(grade);

  if (conhecimento.justificativaClassificacao) {
    const porque = criar('details', 'porque');
    const abrir = criar('summary', 'porque__abrir');
    abrir.append(criar('span', 'porque__seta'), criar('span', null, 'Por que essa classificação?'));
    porque.append(abrir, criar('p', 'porque__texto', conhecimento.justificativaClassificacao));
    bloco.append(porque);
  }
  return bloco;
}

/** Tipo de ECOS é evidencial e independente da classificação principal. */
function tiposDeEcos(dados, conhecimento) {
  const bloco = secao(dados, 'Exemplos de ecossistemas em que esse conhecimento foi observado', ['tipoEcos']);
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
  const bloco = secao(dados, 'Gerência do conhecimento no ECOS', ['acaoGerencia']);
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

/* ---------- Conteúdo das abas ---------- */

/**
 * Uma relação de desafio. A linha continua de uma linha só, e o
 * que sustenta a ligação com este conhecimento fica atrás dela, aberto por quem
 * quiser saber.
 */
function linhaRelacao({ id, texto, estudos }, evidencia) {
  const item = criar('li');
  const caixa = criar('details', 'relacao');

  const linha = criar('summary', 'relacao__linha');
  linha.append(criar('span', 'codigo-id', id), criar('span', 'relacao__nome', texto));
  const meta = criar('span', 'relacao__meta');
  meta.append(criar('span', 'relacao__estudos', estudos.join(', ')));
  linha.append(meta);
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
  linhaRelacao({ id: d.id, texto: d.desafio, estudos: d.estudos }, evidencia);

/** Os desafios confirmados deste conhecimento. */
function desafios(conhecimento) {
  const evidencia = conhecimento.evidencia || {};
  const bloco = criar('div', 'relacoes-bloco');
  if (!conhecimento.desafiosResolvidos.length) {
    bloco.append(criar('p', 'vazio', 'Nenhum desafio foi confirmado para este conhecimento.'));
    return bloco;
  }
  const lista = criar('ul', 'relacoes');
  conhecimento.desafiosResolvidos.forEach((d) => lista.append(linhaDesafio(d, evidencia[d.id])));
  bloco.append(lista);
  return bloco;
}

function estudos(conhecimento) {
  const lista = criar('ul', 'estudos');
  conhecimento.estudosResolvidos.forEach((e) => {
    const item = criar('li', 'estudo');
    item.append(criar('span', 'codigo-id', e.id));
    const corpo = criar('span', 'estudo__corpo');
    corpo.append(
      criar('span', 'estudo__titulo', e.titulo),
      criar('span', 'estudo__meta', `${e.autores} · ${e.ano} · ${e.pais}`)
    );
    item.append(corpo);
    lista.append(item);
  });
  return lista;
}

/* ---------- Abas ---------- */

function montarAbas(itens) {
  const raiz = criar('div', 'abas');
  const barra = criar('div', 'abas__barra');
  barra.setAttribute('role', 'tablist');
  const indicador = criar('span', 'abas__indicador');
  const painel = criar('div', 'abas__painel');
  const idPainel = 'ficha-abas-painel';
  painel.id = idPainel;
  painel.setAttribute('role', 'tabpanel');

  const botoes = itens.map((item, indice) => {
    const botao = criar('button', 'aba');
    botao.type = 'button';
    botao.id = `ficha-aba-${indice}`;
    botao.setAttribute('role', 'tab');
    botao.setAttribute('aria-selected', String(indice === 0));
    botao.setAttribute('aria-controls', idPainel);
    botao.tabIndex = indice === 0 ? 0 : -1;
    botao.append(criar('span', null, item.rotulo), criar('span', 'aba__contagem', String(item.contagem)));
    botao.addEventListener('click', () => trocar(indice));
    botao.addEventListener('keydown', (evento) => {
      const atalhos = { ArrowRight: 1, ArrowLeft: -1, Home: -Infinity, End: Infinity };
      if (!(evento.key in atalhos)) return;
      evento.preventDefault();
      const destino = evento.key === 'Home'
        ? 0
        : evento.key === 'End'
          ? botoes.length - 1
          : (indice + atalhos[evento.key] + botoes.length) % botoes.length;
      trocar(destino);
      botoes[destino].focus();
    });
    return botao;
  });

  function posicionar(indice) {
    const botao = botoes[indice];
    indicador.style.width = `${botao.offsetWidth}px`;
    indicador.style.transform = `translateX(${botao.offsetLeft}px)`;
  }

  function trocar(indice) {
    botoes.forEach((b, i) => {
      const ativa = i === indice;
      b.setAttribute('aria-selected', String(ativa));
      b.tabIndex = ativa ? 0 : -1;
    });
    painel.setAttribute('aria-labelledby', botoes[indice].id);
    painel.replaceChildren(itens[indice].conteudo());
    posicionar(indice);
    if (!reduzido()) {
      painel.animate([{ opacity: 0, transform: `translateY(${tokenDeMovimento('--esp-1')})` }, { opacity: 1, transform: 'none' }], {
        duration: Number.parseFloat(tokenDeMovimento('--dur-media')),
        easing: tokenDeMovimento('--curva-saida')
      });
    }
  }

  barra.append(...botoes, indicador);
  painel.setAttribute('aria-labelledby', botoes[0].id);
  painel.replaceChildren(itens[0].conteudo());
  raiz.append(barra, painel);
  /* O indicador só tem medida depois que a barra está no documento. */
  requestAnimationFrame(() => posicionar(0));
  return raiz;
}

/** Monta a ficha completa e devolve o elemento pronto para inserir. */
export function renderizar(dados, conhecimento) {
  const raiz = criar('div', 'ficha');

  const quantos = {
    desafios: conhecimento.desafiosResolvidos.length,
    estudos: conhecimento.estudosResolvidos.length
  };

  const secoes = [
    classificacao(dados, conhecimento),
    tiposDeEcos(dados, conhecimento),
    gerencia(dados, conhecimento),
    montarAbas([
      { rotulo: 'Desafios', contagem: quantos.desafios, conteudo: () => desafios(conhecimento) },
      { rotulo: 'Estudos', contagem: quantos.estudos, conteudo: () => estudos(conhecimento) }
    ])
  ];
  raiz.append(...secoes);
  return raiz;
}
