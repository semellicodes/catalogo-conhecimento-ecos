/**
 * Transforma um conhecimento em ficha. Não sabe carregar nem filtrar.
 *
 * O essencial fica visível sem rolar, no cabeçalho e na tira de atributos, e o
 * que é lista desce para abas, uma de cada vez. O que ainda não foi preenchido
 * vira uma linha de rodapé, não uma caixa no meio do caminho.
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

/**
 * O ícone diz o estado da caixa sem depender da cor, que sozinha não serve a
 * quem não a distingue. Visto quando o valor vale, círculo vazio quando não.
 */
function iconeDeEstado(aceso) {
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', '0 0 20 20');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('class', 'opcao__icone');

  const forma = document.createElementNS(SVG, aceso ? 'path' : 'circle');
  if (aceso) {
    forma.setAttribute('d', 'M4.5 10.5 8.2 14.2 15.5 6.4');
  } else {
    forma.setAttribute('cx', '10');
    forma.setAttribute('cy', '10');
    forma.setAttribute('r', '6');
  }
  forma.setAttribute('fill', 'none');
  forma.setAttribute('stroke', 'currentColor');
  forma.setAttribute('stroke-width', '1.8');
  forma.setAttribute('stroke-linecap', 'round');
  forma.setAttribute('stroke-linejoin', 'round');
  svg.append(forma);
  return svg;
}

/**
 * A caixa fica com o ícone e o nome. A descrição do valor não entra, porque já
 * vive no glossário do Explorar e no botão de ajuda do rótulo, e dentro da caixa
 * virava a terceira cópia, que empurrava as abas para fora da tela.
 */
function fileira(definicao, acesos) {
  const lista = criar('ul', 'opcoes');
  definicao.valores.forEach((v) => {
    const aceso = acesos.includes(v.valor);
    const item = criar('li', 'opcao');
    if (aceso) item.setAttribute('data-aceso', '');
    item.append(iconeDeEstado(aceso), criar('span', 'opcao__nome', v.valor));
    lista.append(item);
  });
  return lista;
}

/**
 * O botão de ajuda do cartão. Um por bloco, no canto, em vez de um por atributo,
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

/** O cartão de um bloco da ficha, com o título e a ajuda no canto. */
function cartao(dados, titulo, chavesDeAjuda) {
  const bloco = criar('section', 'bloco-ficha');
  const topo = criar('header', 'bloco-ficha__topo');
  topo.append(criar('h3', 'bloco-ficha__titulo', titulo), ajuda(dados, chavesDeAjuda));
  bloco.append(topo);
  return bloco;
}

/** Um atributo inteiro, rótulo mais fileira de caixas. */
function atributoEmCaixas(dados, conhecimento, chave) {
  const bloco = criar('div', 'atributo-caixas');
  const bruto = conhecimento[chave];
  const acesos = Array.isArray(bruto) ? bruto : [bruto].filter(Boolean);
  bloco.append(
    criar('p', 'atributo-caixas__nome', dados.classificacoes[chave].rotulo),
    fileira(dados.classificacoes[chave], acesos)
  );
  return bloco;
}

/* Os três atributos de classificação, uma fileira cada, um valor aceso por
   fileira porque cada conhecimento tem um valor só de cada um. */
const CLASSIFICACAO = ['natureza', 'nivel', 'dimensao'];

function classificacao(dados, conhecimento) {
  const bloco = cartao(dados, 'Classificação do conhecimento', CLASSIFICACAO);
  CLASSIFICACAO.forEach((chave) => bloco.append(atributoEmCaixas(dados, conhecimento, chave)));

  /* O texto ainda não existe em nenhum conhecimento, então o item só aparece
     quando houver, em vez de abrir para uma barra vazia. */
  if (conhecimento.justificativaClassificacao) {
    const porque = criar('details', 'porque');
    const abrir = criar('summary', 'porque__abrir');
    abrir.append(criar('span', 'porque__seta'), criar('span', null, 'Por que essa classificação?'));
    porque.append(abrir, criar('p', 'porque__texto', conhecimento.justificativaClassificacao));
    bloco.append(porque);
  }
  return bloco;
}

/**
 * Os ecossistemas em que o conhecimento foi observado. Lê
 * conhecimentos[].tipoEcos, que diz onde aquele conhecimento foi visto, e não a
 * soma dos estudos, porque um estudo que compara três ecossistemas não autoriza
 * afirmar que o conhecimento apareceu nos três.
 */
function tiposDeEcos(dados, conhecimento) {
  const observados = conhecimento.tipoEcos || [];
  const bloco = cartao(dados, 'Exemplos de ecossistemas em que esse conhecimento foi observado', ['tipoEcos']);
  bloco.append(fileira(dados.classificacoes.tipoEcos, observados));
  if (!observados.length) {
    bloco.append(criar('p', 'bloco-ficha__pendente', 'Classificação ainda não registrada na extração.'));
  }
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

  const topo = criar('header', 'ficha__topo');
  topo.append(
    criar('p', 'codigo-id', conhecimento.id),
    criar('h2', 'ficha__nome', conhecimento.nome),
    criar('p', 'ficha__descricao', conhecimento.descricao)
  );

  const quantos = {
    desafios: conhecimento.desafiosResolvidos.length,
    estudos: conhecimento.estudosResolvidos.length,
    trechos: conhecimento.trechos.filter(Boolean).length
  };

  raiz.append(
    topo,
    classificacao(dados, conhecimento),
    tiposDeEcos(dados, conhecimento),
    montarAbas([
      { rotulo: 'Desafios', contagem: quantos.desafios, conteudo: () => desafios(conhecimento) },
      { rotulo: 'Estudos', contagem: quantos.estudos, conteudo: () => estudos(conhecimento) },
      { rotulo: 'Trechos', contagem: quantos.trechos, conteudo: () => trechos(conhecimento) }
    ]),
    pendencias(dados, conhecimento)
  );
  return raiz;
}
