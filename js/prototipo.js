/**
 * Protótipo da ficha. Monta três versões da mesma ficha com os mesmos dados,
 * para comparar densidade e hierarquia antes de escolher uma. É descartável,
 * nenhum módulo do catálogo depende deste arquivo.
 */

import { carregar, conhecimentoCompleto, referenciaCurta, vazio } from './dados.js';
import * as lista from './lista.js';

const ATRIBUTOS = ['natureza', 'nivel', 'dimensao', 'tipoEcos', 'acaoGerencia'];

const CURVA_SAIDA = 'cubic-bezier(0.23, 1, 0.32, 1)';
const reduzido = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function criar(tag, className, texto) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

const textoAtributo = (bruto) => (Array.isArray(bruto) ? bruto.join(', ') : bruto);

/* ---------- Peças compartilhadas pelas três versões ---------- */

/**
 * Um atributo preenchido. O valor fica visível, a descrição e a referência
 * ficam na nota, que abre ao passar o mouse ou ao acionar o botão de informação.
 */
function atributoCompacto(dados, conhecimento, chave) {
  const definicao = dados.classificacoes[chave];
  const valor = textoAtributo(conhecimento[chave]);
  const opcao = definicao.valores.find((v) => v.valor === valor);
  const ref = referenciaCurta(dados, definicao.referencia);

  const raiz = criar('span', 'atr');
  raiz.append(
    criar('span', 'atr__nome', definicao.rotulo),
    criar('span', 'atr__valor', valor)
  );

  const botao = criar('button', 'atr__info');
  botao.type = 'button';
  botao.setAttribute('aria-expanded', 'false');
  botao.setAttribute('aria-label', `Sobre ${definicao.rotulo.toLowerCase()}`);
  botao.textContent = 'i';

  const nota = criar('span', 'atr__nota');
  if (opcao && opcao.descricao) nota.append(criar('span', 'atr__descricao', opcao.descricao));
  nota.append(criar('span', 'atr__pergunta', definicao.pergunta));
  if (ref) nota.append(criar('span', 'atr__referencia', ref));

  botao.addEventListener('click', () => {
    const aberto = raiz.hasAttribute('data-aberto');
    document.querySelectorAll('.atr[data-aberto]').forEach((outro) => {
      outro.removeAttribute('data-aberto');
      outro.querySelector('.atr__info').setAttribute('aria-expanded', 'false');
    });
    if (!aberto) {
      raiz.setAttribute('data-aberto', '');
      botao.setAttribute('aria-expanded', 'true');
    }
  });

  raiz.append(botao, nota);
  return raiz;
}

/** Os atributos já preenchidos, numa linha só. */
function tiraAtributos(dados, conhecimento, className = 'tira') {
  const tira = criar('div', className);
  ATRIBUTOS.filter((chave) => !vazio(conhecimento[chave])).forEach((chave) =>
    tira.append(atributoCompacto(dados, conhecimento, chave))
  );
  return tira;
}

/** Uma solução por linha. Identificador, nome e a origem à direita. */
function linhaSolucao(solucao) {
  const item = criar('li', 'solucao');
  item.append(
    criar('span', 'codigo-id', solucao.id),
    criar('span', 'solucao__nome', solucao.nome)
  );
  const meta = criar('span', 'solucao__meta');
  meta.append(criar('span', 'solucao__estudos', solucao.estudos.join(', ')));
  if (solucao.avaliada) meta.append(criar('span', 'marca-avaliada', 'avaliada'));
  item.append(meta);
  return item;
}

/** As soluções agrupadas por tipo, na ordem em que os tipos estão em meta. */
function solucoesAgrupadas(dados, conhecimento) {
  const bloco = criar('div', 'grupos');
  const ordem = Object.keys(dados.meta.tiposSolucao);
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

  ordem
    .filter((tipo) => porTipo.has(tipo))
    .forEach((tipo) => {
      const grupo = criar('section', 'grupo');
      const titulo = criar('h4', 'grupo__titulo');
      titulo.append(
        criar('span', null, tipo),
        criar('span', 'grupo__contagem', String(porTipo.get(tipo).length))
      );
      const ul = criar('ul', 'solucoes');
      porTipo.get(tipo).forEach((s) => ul.append(linhaSolucao(s)));
      grupo.append(titulo, ul);
      bloco.append(grupo);
    });
  return bloco;
}

function listaEstudos(conhecimento, className = 'estudos') {
  const ul = criar('ul', className);
  conhecimento.estudosResolvidos.forEach((e) => {
    const li = criar('li', 'estudo');
    li.append(criar('span', 'codigo-id', e.id));
    const corpo = criar('span', 'estudo__corpo');
    corpo.append(
      criar('span', 'estudo__titulo', e.titulo),
      criar('span', 'estudo__meta', `${e.autores} · ${e.ano} · ${e.pais}`)
    );
    li.append(corpo);
    ul.append(li);
  });
  return ul;
}

function listaTrechos(conhecimento) {
  const bloco = criar('div', 'trechos');
  conhecimento.trechos.filter(Boolean).forEach((t) => bloco.append(criar('blockquote', 'trecho', t)));
  return bloco;
}

/** O rodapé discreto. O que falta classificar e o estado das relações. */
function linhaPendencias(dados, conhecimento) {
  const rodape = criar('p', 'pendencias');
  const partes = [];

  const pendentes = ATRIBUTOS.filter((chave) => vazio(conhecimento[chave])).map((chave) =>
    dados.classificacoes[chave].rotulo.toLowerCase()
  );
  if (pendentes.length) {
    const nomes =
      pendentes.length > 1
        ? `${pendentes.slice(0, -1).join(', ')} e ${pendentes[pendentes.length - 1]}`
        : pendentes[0];
    partes.push(`${nomes} a definir`);
  }
  if (!conhecimento.relacoesConfirmadas) partes.push('soluções ainda não confirmadas nos estudos primários');
  if (conhecimento.pendencia) partes.push(conhecimento.pendencia);

  rodape.textContent = partes.join(' · ');
  rodape.hidden = partes.length === 0;
  return rodape;
}

/** Cabeçalho comum, o que o leitor precisa ver sem rolar. */
function cabecalhoFicha(conhecimento) {
  const topo = criar('header', 'ficha-p__topo');
  topo.append(
    criar('p', 'codigo-id', conhecimento.id),
    criar('h3', 'ficha-p__nome', conhecimento.nome),
    criar('p', 'ficha-p__descricao', conhecimento.descricao)
  );
  return topo;
}

const contagens = (c) => ({
  solucoes: c.solucoesResolvidas.length,
  estudos: c.estudosResolvidos.length,
  trechos: c.trechos.filter(Boolean).length
});

/* ---------- Versão A, abas ---------- */

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
    botao.append(criar('span', null, item.rotulo));
    if (item.contagem !== undefined) botao.append(criar('span', 'aba__contagem', String(item.contagem)));
    botao.addEventListener('click', () => trocar(indice));
    return botao;
  });

  function posicionarIndicador(indice) {
    const botao = botoes[indice];
    indicador.style.width = `${botao.offsetWidth}px`;
    indicador.style.transform = `translateX(${botao.offsetLeft}px)`;
  }

  function trocar(indice) {
    botoes.forEach((b, i) => b.setAttribute('aria-selected', String(i === indice)));
    painel.replaceChildren(itens[indice].conteudo());
    posicionarIndicador(indice);
    if (!reduzido()) {
      painel.animate(
        [{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }],
        { duration: 180, easing: CURVA_SAIDA }
      );
    }
  }

  barra.append(...botoes, indicador);
  raiz.append(barra, painel);
  painel.replaceChildren(itens[0].conteudo());
  /* O indicador só tem medida depois que a barra está no documento. */
  requestAnimationFrame(() => posicionarIndicador(botoes.findIndex((b) => b.getAttribute('aria-selected') === 'true')));
  return raiz;
}

function versaoAbas(dados, conhecimento) {
  const n = contagens(conhecimento);
  const raiz = criar('div', 'ficha-p ficha-p--abas');
  raiz.append(cabecalhoFicha(conhecimento), tiraAtributos(dados, conhecimento));
  raiz.append(
    montarAbas([
      { rotulo: 'Soluções', contagem: n.solucoes, conteudo: () => solucoesAgrupadas(dados, conhecimento) },
      { rotulo: 'Estudos', contagem: n.estudos, conteudo: () => listaEstudos(conhecimento) },
      { rotulo: 'Trechos', contagem: n.trechos, conteudo: () => listaTrechos(conhecimento) }
    ])
  );
  raiz.append(linhaPendencias(dados, conhecimento));
  return raiz;
}

/* ---------- Versão B, blocos recolhíveis ---------- */

function bloco(titulo, contagem, conteudo, aberto) {
  const detalhe = criar('details', 'bloco');
  detalhe.open = Boolean(aberto);
  const resumo = criar('summary', 'bloco__resumo');
  resumo.append(criar('span', 'bloco__titulo', titulo), criar('span', 'bloco__contagem', String(contagem)));
  detalhe.append(resumo, Object.assign(conteudo, { className: `${conteudo.className} bloco__corpo` }));
  return detalhe;
}

function versaoBlocos(dados, conhecimento) {
  const n = contagens(conhecimento);
  const raiz = criar('div', 'ficha-p ficha-p--blocos');
  raiz.append(cabecalhoFicha(conhecimento), tiraAtributos(dados, conhecimento));
  raiz.append(
    bloco('Soluções relacionadas', n.solucoes, solucoesAgrupadas(dados, conhecimento), true),
    bloco('Estudos de origem', n.estudos, listaEstudos(conhecimento), false),
    bloco('Trechos de origem', n.trechos, listaTrechos(conhecimento), false)
  );
  raiz.append(linhaPendencias(dados, conhecimento));
  return raiz;
}

/* ---------- Versão C, duas colunas com trilho ---------- */

function versaoColunas(dados, conhecimento) {
  const n = contagens(conhecimento);
  const raiz = criar('div', 'ficha-p ficha-p--colunas');

  const principal = criar('div', 'coluna-principal');
  principal.append(cabecalhoFicha(conhecimento));
  const tituloSolucoes = criar('h4', 'secao-titulo');
  tituloSolucoes.append(criar('span', null, 'Soluções relacionadas'), criar('span', 'grupo__contagem', String(n.solucoes)));
  principal.append(tituloSolucoes, solucoesAgrupadas(dados, conhecimento));
  if (n.trechos) principal.append(bloco('Trechos de origem', n.trechos, listaTrechos(conhecimento), false));

  const trilho = criar('aside', 'trilho');
  trilho.append(criar('h4', 'secao-titulo', 'Atributos'), tiraAtributos(dados, conhecimento, 'tira tira--coluna'));
  const tituloEstudos = criar('h4', 'secao-titulo');
  tituloEstudos.append(criar('span', null, 'Estudos'), criar('span', 'grupo__contagem', String(n.estudos)));
  trilho.append(tituloEstudos, listaEstudos(conhecimento, 'estudos estudos--compacta'));

  raiz.append(principal, trilho);
  const rodape = criar('div', 'ficha-p__rodape');
  rodape.append(linhaPendencias(dados, conhecimento));
  raiz.append(rodape);
  return raiz;
}

/* ---------- Molduras, navegação e troca ---------- */

const VERSOES = [
  {
    letra: 'A',
    nome: 'Abas',
    resumo: 'Atributos numa tira, conteúdo em três abas. Só uma lista por vez, altura previsível.',
    montar: versaoAbas
  },
  {
    letra: 'B',
    nome: 'Blocos recolhíveis',
    resumo: 'Tudo numa coluna, com soluções abertas e o resto recolhido. O leitor abre o que quiser.',
    montar: versaoBlocos
  },
  {
    letra: 'C',
    nome: 'Duas colunas',
    resumo: 'Soluções à esquerda, atributos e estudos num trilho à direita que acompanha a rolagem.',
    montar: versaoColunas
  }
];

let dados = null;
let indiceAtual = 0;
const corpos = new Map();

function moldura(versao) {
  const secao = criar('section', 'moldura');

  const legenda = criar('div', 'moldura__legenda');
  legenda.append(
    criar('p', 'moldura__letra', `Versão ${versao.letra}`),
    criar('h2', 'moldura__nome', versao.nome),
    criar('p', 'moldura__resumo', versao.resumo)
  );

  const janela = criar('div', 'janela');
  const topo = criar('div', 'janela__topo');
  const rotulo = criar('p', 'codigo-id janela__id');
  const fechar = criar('button', 'botao', 'Fechar');
  fechar.type = 'button';
  fechar.disabled = true;
  topo.append(rotulo, fechar);

  const corpo = criar('div', 'janela__corpo');

  const rodape = criar('div', 'janela__rodape');
  const anterior = criar('button', 'botao', 'Anterior');
  anterior.type = 'button';
  const posicao = criar('p', 'janela__posicao');
  const proximo = criar('button', 'botao', 'Próximo');
  proximo.type = 'button';
  anterior.addEventListener('click', () => irPara(-1));
  proximo.addEventListener('click', () => irPara(1));
  rodape.append(anterior, posicao, proximo);

  janela.append(topo, corpo, rodape);
  secao.append(legenda, janela);
  corpos.set(versao.letra, { corpo, rotulo, posicao, anterior, proximo, versao });
  return secao;
}

/** Redesenha as três versões. A direção dá o sentido da transição. */
function desenhar(direcao = 0) {
  const conhecimento = conhecimentoCompleto(dados, dados.conhecimentos[indiceAtual].id);
  corpos.forEach(({ corpo, rotulo, posicao, anterior, proximo, versao }) => {
    corpo.replaceChildren(versao.montar(dados, conhecimento));
    rotulo.textContent = `${conhecimento.id} · ${conhecimento.nome}`;
    posicao.textContent = `${indiceAtual + 1} de ${dados.conhecimentos.length}`;
    anterior.disabled = indiceAtual === 0;
    proximo.disabled = indiceAtual === dados.conhecimentos.length - 1;
    corpo.scrollTop = 0;
    if (direcao && !reduzido()) {
      corpo.animate(
        [
          { opacity: 0, transform: `translateX(${direcao * 10}px)` },
          { opacity: 1, transform: 'none' }
        ],
        { duration: 200, easing: CURVA_SAIDA }
      );
    }
  });
}

function irPara(passo) {
  const alvo = indiceAtual + passo;
  if (alvo < 0 || alvo >= dados.conhecimentos.length) return;
  indiceAtual = alvo;
  document.querySelector('#escolha-conhecimento').value = dados.conhecimentos[alvo].id;
  desenhar(passo);
}

function ligarControles() {
  const selecao = document.querySelector('#escolha-conhecimento');
  dados.conhecimentos.forEach((c, i) => {
    const opcao = document.createElement('option');
    opcao.value = c.id;
    opcao.textContent = `${c.id} · ${c.nome}`;
    if (i === indiceAtual) opcao.selected = true;
    selecao.append(opcao);
  });
  selecao.addEventListener('change', () => {
    const alvo = dados.conhecimentos.findIndex((c) => c.id === selecao.value);
    const passo = Math.sign(alvo - indiceAtual);
    indiceAtual = alvo;
    desenhar(passo);
  });

  document.querySelectorAll('[data-modo]').forEach((botao) => {
    botao.addEventListener('click', () => {
      document.querySelectorAll('[data-modo]').forEach((b) =>
        b.setAttribute('aria-pressed', String(b === botao))
      );
      document.querySelector('#versoes').classList.toggle('versoes--lado', botao.dataset.modo === 'lado');
      corpos.forEach(({ corpo }) => {
        const aba = corpo.querySelector('.aba[aria-selected="true"]');
        if (aba) aba.click();
      });
    });
  });

  /* Fechar a nota de atributo ao clicar fora ou com Escape. */
  const fecharNotas = () =>
    document.querySelectorAll('.atr[data-aberto]').forEach((atr) => {
      atr.removeAttribute('data-aberto');
      atr.querySelector('.atr__info').setAttribute('aria-expanded', 'false');
    });
  document.addEventListener('click', (evento) => {
    if (!evento.target.closest('.atr')) fecharNotas();
  });
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') fecharNotas();
  });
}

async function iniciar() {
  dados = await carregar();
  const alvo = document.querySelector('#versoes');
  VERSOES.forEach((v) => alvo.append(moldura(v)));
  ligarControles();
  desenhar();
  lista.renderizar(document.querySelector('#amostra-cards'), dados.conhecimentos.slice(0, 3), (id) => {
    indiceAtual = dados.conhecimentos.findIndex((c) => c.id === id);
    document.querySelector('#escolha-conhecimento').value = id;
    desenhar(1);
    alvo.scrollIntoView({ behavior: reduzido() ? 'auto' : 'smooth', block: 'start' });
  });
}

iniciar();
