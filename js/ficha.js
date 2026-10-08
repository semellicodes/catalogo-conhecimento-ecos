/**
 * Transforma um conhecimento em ficha. Não sabe carregar nem filtrar.
 *
 * O essencial fica visível sem rolar, no cabeçalho e na tira de atributos, e o
 * que é lista desce para abas, uma de cada vez. O que ainda não foi preenchido
 * vira uma linha de rodapé, não uma caixa no meio do caminho.
 */

import { referenciaCurta, vazio } from './dados.js';
import { classeNatureza } from './lista.js';

const ATRIBUTOS = ['natureza', 'nivel', 'dimensao', 'tipoEcos', 'acaoGerencia'];
const CURVA_SAIDA = 'cubic-bezier(0.23, 1, 0.32, 1)';
const reduzido = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function criar(tag, className, texto) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

const textoDe = (bruto) => (Array.isArray(bruto) ? bruto.join(', ') : bruto);

/* ---------- Tira de atributos ---------- */

/**
 * Um atributo preenchido. O valor fica à vista e o que explica o valor, a
 * descrição e a referência, sai do botão de informação, por hover ou clique.
 */
function atributo(dados, conhecimento, chave) {
  const definicao = dados.classificacoes[chave];
  const valor = textoDe(conhecimento[chave]);
  const opcao = definicao.valores.find((v) => v.valor === valor);
  const ref = referenciaCurta(dados, definicao.referencia);

  /* Só a natureza carrega a cor da própria classificação, como no cartão. */
  const classeValor =
    chave === 'natureza' ? `atr__valor atr__valor--${classeNatureza(valor)}` : 'atr__valor';

  const raiz = criar('span', 'atr');
  raiz.append(criar('span', 'atr__nome', definicao.rotulo), criar('span', classeValor, valor));

  const botao = criar('button', 'atr__info', 'i');
  botao.type = 'button';
  botao.setAttribute('aria-expanded', 'false');
  botao.setAttribute('aria-label', `Sobre ${definicao.rotulo.toLowerCase()}`);

  const nota = criar('span', 'atr__nota');
  if (opcao && opcao.descricao) nota.append(criar('span', null, opcao.descricao));
  nota.append(criar('span', 'atr__pergunta', definicao.pergunta));
  if (ref) nota.append(criar('span', 'atr__referencia', ref));

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

/** Fecha qualquer nota de atributo aberta, venha o pedido de onde vier. */
function fecharNotas() {
  document.querySelectorAll('.atr[data-aberto]').forEach((atr) => {
    atr.removeAttribute('data-aberto');
    atr.querySelector('.atr__info').setAttribute('aria-expanded', 'false');
  });
}

/* Clicar fora fecha a nota aberta. Um ouvinte só, para a ficha inteira. */
document.addEventListener('click', (evento) => {
  if (!evento.target.closest('.atr')) fecharNotas();
});

/** Só os atributos já preenchidos, numa linha só. */
function tira(dados, conhecimento) {
  const faixa = criar('div', 'tira');
  ATRIBUTOS.filter((chave) => !vazio(conhecimento[chave])).forEach((chave) =>
    faixa.append(atributo(dados, conhecimento, chave))
  );
  return faixa;
}

/* ---------- Conteúdo das abas ---------- */

function linhaSolucao(solucao) {
  const item = criar('li', 'solucao');
  item.append(criar('span', 'codigo-id', solucao.id), criar('span', 'solucao__nome', solucao.nome));
  const meta = criar('span', 'solucao__meta');
  meta.append(criar('span', 'solucao__estudos', solucao.estudos.join(', ')));
  if (solucao.avaliada) meta.append(criar('span', 'marca-avaliada', 'avaliada'));
  item.append(meta);
  return item;
}

/** As soluções agrupadas por tipo, na ordem em que os tipos estão em meta. */
function solucoes(dados, conhecimento) {
  const bloco = criar('div', 'grupos');
  const porTipo = new Map();
  conhecimento.solucoesResolvidas.forEach((s) => {
    if (!porTipo.has(s.tipo)) porTipo.set(s.tipo, []);
    porTipo.get(s.tipo).push(s);
  });

  if (!porTipo.size) {
    bloco.append(
      criar('p', 'vazio', 'Nenhuma solução foi extraída dos estudos que identificaram este conhecimento.')
    );
    return bloco;
  }

  Object.keys(dados.meta.tiposSolucao)
    .filter((tipo) => porTipo.has(tipo))
    .forEach((tipo) => {
      const grupo = criar('section', 'grupo');
      const titulo = criar('h4', 'grupo__titulo');
      titulo.append(criar('span', null, tipo), criar('span', 'grupo__contagem', String(porTipo.get(tipo).length)));
      const lista = criar('ul', 'solucoes');
      porTipo.get(tipo).forEach((s) => lista.append(linhaSolucao(s)));
      grupo.append(titulo, lista);
      bloco.append(grupo);
    });
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
    solucoes: conhecimento.solucoesResolvidas.length,
    estudos: conhecimento.estudosResolvidos.length,
    trechos: conhecimento.trechos.filter(Boolean).length
  };

  raiz.append(
    topo,
    tira(dados, conhecimento),
    montarAbas([
      { rotulo: 'Soluções', contagem: quantos.solucoes, conteudo: () => solucoes(dados, conhecimento) },
      { rotulo: 'Estudos', contagem: quantos.estudos, conteudo: () => estudos(conhecimento) },
      { rotulo: 'Trechos', contagem: quantos.trechos, conteudo: () => trechos(conhecimento) }
    ]),
    pendencias(dados, conhecimento)
  );
  return raiz;
}
