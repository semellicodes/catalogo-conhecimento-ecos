/**
 * Preenche a página Explorar, nas três partes que ela tem. O glossário dos
 * atributos, que antes vivia no Sobre, e os 17 desafios. Entram também os que
 * não se ligam a nenhum conhecimento, porque vêm de estudos sem conhecimento
 * extraído e não aparecem em ficha alguma.
 */

import { carregar, porId, referenciaCurta } from './dados.js';
import { renderizar } from './listagem.js';

const el = (seletor) => document.querySelector(seletor);

function abaPeloHash() {
  return window.location.hash.replace('#', '') || 'glossario';
}

function ativarAba(nome, atualizarEndereco = false) {
  const abas = document.querySelectorAll('.explorar__aba');
  const paineis = document.querySelectorAll('.explorar__painel');
  const existe = [...abas].some((aba) => aba.dataset.aba === nome);
  const abaAtiva = existe ? nome : 'glossario';

  abas.forEach((aba) => {
    const ativa = aba.dataset.aba === abaAtiva;
    aba.setAttribute('aria-selected', String(ativa));
    aba.tabIndex = ativa ? 0 : -1;
  });
  paineis.forEach((painel) => {
    painel.hidden = painel.dataset.painel !== abaAtiva;
  });

  if (atualizarEndereco) history.replaceState(null, '', `#${abaAtiva}`);
}

function proximaAba(abas, atual, direcao) {
  const indice = abas.indexOf(atual);
  return abas[(indice + direcao + abas.length) % abas.length];
}

function ligarAbas() {
  const abas = [...document.querySelectorAll('.explorar__aba')];
  if (!abas.length) return;

  ativarAba(abaPeloHash());
  abas.forEach((aba) => {
    aba.addEventListener('click', () => ativarAba(aba.dataset.aba, true));
    aba.addEventListener('keydown', (evento) => {
      const atalhos = { ArrowRight: 1, ArrowLeft: -1, Home: -Infinity, End: Infinity };
      if (!(evento.key in atalhos)) return;
      evento.preventDefault();
      const destino = evento.key === 'Home'
        ? abas[0]
        : evento.key === 'End'
          ? abas.at(-1)
          : proximaAba(abas, aba, atalhos[evento.key]);
      ativarAba(destino.dataset.aba, true);
      destino.focus();
    });
  });
  window.addEventListener('hashchange', () => ativarAba(abaPeloHash()));
}

function celula(tag, texto, className) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  el.textContent = texto;
  return el;
}

function linha(cabecalho, ...celulas) {
  const tr = document.createElement('tr');
  const th = celula('th', cabecalho);
  th.scope = 'row';
  tr.append(th, ...celulas);
  return tr;
}

/**
 * Um atributo por linha. Cada valor possível aparece com a própria descrição,
 * que é onde esse texto passou a viver depois que a trilha deixou de agrupar
 * por tipo de ECOS e as estações pararam de mostrá-lo.
 */
function valores(definicao) {
  const td = document.createElement('td');
  const lista = document.createElement('ul');
  lista.className = 'valores';
  definicao.valores.forEach((v) => {
    const item = document.createElement('li');
    item.className = 'valores__item';
    item.append(celula('span', v.valor, 'valores__nome'));
    if (v.descricao) item.append(celula('span', v.descricao, 'valores__texto'));
    lista.append(item);
  });
  td.append(lista);
  return td;
}

function montarAtributos(dados) {
  const corpo = el('#tabela-atributos');
  corpo.replaceChildren(
    ...Object.values(dados.classificacoes).map((d) =>
      linha(
        d.rotulo,
        valores(d),
        celula('td', d.pergunta),
        celula('td', referenciaCurta(dados, d.referencia) || 'Definido na QP1 da revisão rápida')
      )
    )
  );
}

const resolver = (dados, ids) => ids.map((c) => porId(dados.conhecimentos, c)).filter(Boolean);

function montarDesafios(dados) {
  const ligados = renderizar(
    el('#lista-desafios'),
    dados.desafios.map((d) => ({
      id: d.id,
      texto: d.desafio,
      estudos: d.estudos,
      conhecimentos: resolver(dados, d.conhecimentos)
    }))
  );
  el('#resumo-desafios').textContent =
    `Os ${dados.desafios.length} desafios identificados na revisão rápida, dos quais ${ligados} estão ligados a pelo menos um conhecimento.`;
}

async function iniciar() {
  if (!el('#lista-desafios')) return;

  ligarAbas();

  let dados;
  try {
    dados = await carregar();
  } catch (erro) {
    console.error(erro);
    const recado =
      'Não foi possível carregar os dados. Confira se o servidor está no ar e se a página foi aberta pelo endereço dele.';
    el('#resumo-desafios').textContent = recado;
    return;
  }

  montarAtributos(dados);
  montarDesafios(dados);
}

iniciar();
