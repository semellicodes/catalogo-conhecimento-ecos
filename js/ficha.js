/**
 * Transforma um conhecimento em ficha. Não sabe carregar nem filtrar.
 *
 * O identificador e o selo da natureza ficam no topo do diálogo, que é fixo, e
 * não se repetem aqui. O que é lista desce para abas, uma de cada vez, e o que
 * ainda não foi preenchido vira uma linha de rodapé, não uma caixa no caminho.
 */

import { referenciaCurta, vazio } from './dados.js';

const ATRIBUTOS = ['natureza', 'nivel', 'dimensao', 'tipoEcos', 'acaoGerencia'];
const CURVA_SAIDA = 'cubic-bezier(0.23, 1, 0.32, 1)';
const reduzido = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

/* Os valores que aparecem em fileiras têm símbolos próprios, todos em traço
   fino. Os tipos de ECOS usam cadeados e camadas. Nível e dimensão usam formas
   relacionadas ao escopo e à natureza do conhecimento, em vez do círculo de
   estado genérico. */
const SIMBOLOS = {
  'Código aberto': ['M6 9V6.5a4 4 0 0 1 7.6-1.7', 'M4.5 9h11v7.5h-11z'],
  'Proprietário': ['M6.5 9V6.5a3.5 3.5 0 0 1 7 0V9', 'M4.5 9h11v7.5h-11z'],
  'Híbrido': ['M10 3.2 17 7l-7 3.8L3 7z', 'M3 11.5 10 15.3l7-3.8', 'M3 15.2 10 19l7-3.8'],
  Produto: ['M10 2.8 16 6.1 10 9.5 4 6.1z', 'M4 6.1v7l6 3.4 6-3.4v-7', 'M10 9.5v7'],
  Plataforma: ['M4 5.2 10 2l6 3.2-6 3.2z', 'M4 9.2 10 12.4l6-3.2', 'M4 13.2 10 16.4l6-3.2'],
  Ecossistema: ['M10 3.4v5.2M5.5 11.2 10 8.6l4.5 2.6M5.5 11.2v4.1M14.5 11.2v4.1', 'M10 2a1.4 1.4 0 1 0 0 2.8A1.4 1.4 0 0 0 10 2ZM5.5 14a1.4 1.4 0 1 0 0 2.8A1.4 1.4 0 0 0 5.5 14Zm9 0a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8Z'],
  Técnica: ['M7 7h6v6H7z', 'M10 3v2M10 15v2M3 10h2M15 10h2M5 5l1.4 1.4M14.6 14.6 16 16M15 5l-1.4 1.4M5 15l1.4-1.4'],
  Negócio: ['M4 16V10M10 16V5M16 16V8', 'M3 17h14'],
  Social: ['M7 9a2.2 2.2 0 1 0 0-4.4A2.2 2.2 0 0 0 7 9Zm6 0a2.2 2.2 0 1 0 0-4.4A2.2 2.2 0 0 0 13 9ZM2.8 16c.5-2.5 2-3.7 4.2-3.7s3.7 1.2 4.2 3.7M8.8 16c.5-2.5 2-3.7 4.2-3.7s3.7 1.2 4.2 3.7']
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

/**
 * A caixa fica com o símbolo e o nome. A descrição do valor não entra, porque já
 * vive no glossário do Explorar e no botão de ajuda da seção, e dentro da caixa
 * virava a terceira cópia, que empurrava as abas para fora da tela.
 *
 * Como o símbolo passou a ser do valor, e não do estado, o estado deixou de ter
 * desenho próprio e vai escrito para quem usa leitor de tela.
 */
function fileira(definicao, acesos) {
  const lista = criar('ul', 'opcoes');
  definicao.valores.forEach((v) => {
    const aceso = acesos.includes(v.valor);
    const item = criar('li', 'opcao');
    if (aceso) item.setAttribute('data-aceso', '');
    item.append(
      iconeDoValor(v.valor, aceso),
      criar('span', 'opcao__nome', v.valor),
      criar('span', 'apenas-leitor', aceso ? ', observado' : ', não observado')
    );
    lista.append(item);
  });
  return lista;
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

/* A natureza apresenta a classificação principal. Nível e dimensão ficam nas
   fileiras próprias abaixo dos exemplos de ecossistema, para não repetir os
   mesmos valores e para deixar as escolhas do ECOS visíveis de uma vez. */
const CLASSIFICACAO = ['natureza'];

/* Nome do esquema, provisório até o orientador confirmar o definitivo. */
const ESQUEMA = 'Segundo os esquemas adotados na revisão';

/**
 * A classificação é texto, não caixa. Com um valor possível por atributo, a
 * fileira de caixas gastava altura para dizer o que o par rótulo e valor diz em
 * duas linhas, e empurrava as abas para fora da primeira tela no celular.
 */
function classificacao(dados, conhecimento) {
  const bloco = secao(dados, 'Classificação do conhecimento', CLASSIFICACAO, ESQUEMA);

  const grade = criar('dl', 'classificacao classificacao--unica');
  CLASSIFICACAO.forEach((chave) => {
    grade.append(
      criar('dt', 'classificacao__rotulo', dados.classificacoes[chave].rotulo),
      criar('dd', 'classificacao__valor', conhecimento[chave] || 'A definir')
    );
  });
  bloco.append(grade);

  const porque = criar('details', 'porque');
  const abrir = criar('summary', 'porque__abrir');
  abrir.append(criar('span', 'porque__seta'), criar('span', null, 'Por que essa classificação?'));
  porque.append(
    abrir,
    criar(
      'p',
      conhecimento.justificativaClassificacao ? 'porque__texto' : 'porque__texto porque__texto--pendente',
      conhecimento.justificativaClassificacao || 'A justificativa específica ainda não foi registrada na extração.'
    )
  );
  bloco.append(porque);
  return bloco;
}

/**
 * Os ecossistemas em que o conhecimento foi observado. Lê
 * conhecimentos[].tipoEcos, que diz onde aquele conhecimento foi visto, e não a
 * soma dos estudos, porque um estudo que compara três ecossistemas não autoriza
 * afirmar que o conhecimento apareceu nos três.
 */
/** Uma subdivisão do contexto do ECOS. As três ficam na mesma superfície para
   o leitor comparar os recortes sem atravessar uma pilha de cartões. */
function recorteDoEcos(dados, titulo, chavesDeAjuda, definicao, valores) {
  const bloco = criar('section', 'contexto-ecos__secao');
  const topo = criar('header', 'bloco-ficha__topo');
  topo.append(criar('h3', 'bloco-ficha__titulo', titulo), ajuda(dados, chavesDeAjuda));
  bloco.append(topo, fileira(definicao, valores));
  if (!valores.length) {
    bloco.append(criar('p', 'bloco-ficha__pendente', 'Classificação ainda não registrada na extração.'));
  }
  return bloco;
}

/** Tipo, nível e dimensão formam um único contexto visual do conhecimento no ECOS. */
function contextoDoEcos(dados, conhecimento) {
  const bloco = criar('section', 'bloco-ficha bloco-ficha--contexto');
  const observados = conhecimento.tipoEcos || [];
  bloco.append(
    recorteDoEcos(
      dados,
      'Exemplos de ecossistemas em que esse conhecimento foi observado',
      ['tipoEcos'],
      dados.classificacoes.tipoEcos,
      observados
    ),
    recorteDoEcos(
      dados,
      dados.classificacoes.nivel.rotulo,
      ['nivel'],
      dados.classificacoes.nivel,
      conhecimento.nivel ? [conhecimento.nivel] : []
    ),
    recorteDoEcos(
      dados,
      dados.classificacoes.dimensao.rotulo,
      ['dimensao'],
      dados.classificacoes.dimensao,
      conhecimento.dimensao ? [conhecimento.dimensao] : []
    )
  );
  return bloco;
}

/* Os três campos de gerência, com os rótulos que a ficha usa. Nenhum deles tem
   definição em classificacoes.json, então o rótulo vive aqui, junto do desenho,
   e o conteúdo continua vindo só de dados/. */
const GERENCIA = [
  ['quemPossui', 'Quem possui'],
  ['quemPrecisa', 'Quem precisa'],
  ['comoGerenciar', 'Como gerenciar']
];

const texto = (bruto) => (Array.isArray(bruto) ? bruto.join(', ') : bruto) || '';

/** Um campo de gerência por linha. Vazio vira pendência, nunca texto inventado. */
function gerencia(dados, conhecimento) {
  const bloco = secao(dados, 'Gerência do conhecimento', ['acaoGerencia']);
  const lista = criar('dl', 'gerencia');

  GERENCIA.forEach(([chave, rotulo]) => {
    const conteudo = texto(conhecimento[chave]);
    const valor = criar('dd', 'gerencia__valor', conteudo || 'Ainda não registrado na extração.');
    if (!conteudo) valor.classList.add('gerencia__valor--pendente');
    lista.append(criar('dt', 'gerencia__rotulo', rotulo), valor);
  });

  bloco.append(lista);
  return bloco;
}

/* ---------- Conteúdo das abas ---------- */

/**
 * Uma relação, de solução ou de desafio. A linha continua de uma linha só, e o
 * que sustenta a ligação com este conhecimento fica atrás dela, aberto por quem
 * quiser saber. Trecho literal existe em poucos pares, então só entra quando
 * existe, sem deixar lugar vazio nos demais.
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
    if (evidencia.trecho) porque.append(criar('blockquote', 'relacao__trecho', evidencia.trecho));
    caixa.append(porque);
  }

  item.append(caixa);
  return item;
}

const linhaDesafio = (d, evidencia) =>
  linhaRelacao({ id: d.id, texto: d.desafio, estudos: d.estudos }, evidencia);

/** Os desafios confirmados deste conhecimento, na mesma forma das soluções. */
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

function trechos(conhecimento) {
  const bloco = criar('div', 'trechos');
  conhecimento.trechos.filter(Boolean).forEach((t) => bloco.append(criar('blockquote', 'trecho', t)));
  return bloco;
}

/* ---------- Abas ---------- */

function montarAbas(itens) {
  const raiz = criar('div', 'abas');
  const barra = criar('div', 'abas__barra');
  barra.setAttribute('role', 'tablist');
  const indicador = criar('span', 'abas__indicador');
  const painel = criar('div', 'abas__painel');
  painel.setAttribute('role', 'tabpanel');

  const botoes = itens.map((item, indice) => {
    const botao = criar('button', 'aba');
    botao.type = 'button';
    botao.setAttribute('role', 'tab');
    botao.setAttribute('aria-selected', String(indice === 0));
    botao.append(criar('span', null, item.rotulo), criar('span', 'aba__contagem', String(item.contagem)));
    botao.addEventListener('click', () => trocar(indice));
    return botao;
  });

  function posicionar(indice) {
    const botao = botoes[indice];
    indicador.style.width = `${botao.offsetWidth}px`;
    indicador.style.transform = `translateX(${botao.offsetLeft}px)`;
  }

  function trocar(indice) {
    botoes.forEach((b, i) => b.setAttribute('aria-selected', String(i === indice)));
    painel.replaceChildren(itens[indice].conteudo());
    posicionar(indice);
    if (!reduzido()) {
      painel.animate([{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], {
        duration: 180,
        easing: CURVA_SAIDA
      });
    }
  }

  barra.append(...botoes, indicador);
  painel.replaceChildren(itens[0].conteudo());
  raiz.append(barra, painel);
  /* O indicador só tem medida depois que a barra está no documento. */
  requestAnimationFrame(() => posicionar(0));
  return raiz;
}

/* ---------- Rodapé ---------- */

/** O que falta classificar e o estado das relações, numa linha discreta. */
function pendencias(dados, conhecimento) {
  const partes = [];
  const faltando = ATRIBUTOS.filter((chave) => vazio(conhecimento[chave])).map((chave) =>
    dados.classificacoes[chave].rotulo.toLowerCase()
  );
  if (faltando.length) {
    const nomes =
      faltando.length > 1
        ? `${faltando.slice(0, -1).join(', ')} e ${faltando[faltando.length - 1]}`
        : faltando[0];
    partes.push(`${nomes} a definir`);
  }
  if (!conhecimento.relacoesConfirmadas) {
    partes.push('soluções reunidas por estudo em comum, ainda não confirmadas nos estudos primários');
  }
  if (conhecimento.pendencia) partes.push(conhecimento.pendencia);

  const linha = criar('p', 'pendencias', partes.join(' · '));
  linha.hidden = partes.length === 0;
  return linha;
}

/** Monta a ficha completa e devolve o elemento pronto para inserir. */
export function renderizar(dados, conhecimento) {
  const raiz = criar('div', 'ficha');

  const quantos = {
    desafios: conhecimento.desafiosResolvidos.length,
    estudos: conhecimento.estudosResolvidos.length,
    trechos: conhecimento.trechos.filter(Boolean).length
  };

  raiz.append(
    classificacao(dados, conhecimento),
    contextoDoEcos(dados, conhecimento),
    gerencia(dados, conhecimento),
    montarAbas([
      { rotulo: 'Desafios', contagem: quantos.desafios, conteudo: () => desafios(conhecimento) },
      { rotulo: 'Estudos', contagem: quantos.estudos, conteudo: () => estudos(conhecimento) },
      { rotulo: 'Trechos', contagem: quantos.trechos, conteudo: () => trechos(conhecimento) }
    ]),
    pendencias(dados, conhecimento)
  );
  return raiz;
}
