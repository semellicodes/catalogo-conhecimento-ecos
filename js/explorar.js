/**
 * Preenche a página Explorar, nas três partes que ela tem. O glossário dos
 * atributos, que antes vivia no Sobre, as 36 soluções e os 17 desafios.
 *
 * Entram também os que não se ligam a nenhum conhecimento, dez ao todo, porque
 * eles vêm de estudos sem conhecimento extraído e não aparecem em ficha alguma.
 * Se ficassem de fora daqui, não apareceriam em lugar nenhum.
 */

import { carregar, porId, referenciaCurta } from './dados.js';
import { renderizar } from './listagem.js';

const el = (seletor) => document.querySelector(seletor);

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

/** Um atributo por linha, com os valores, a pergunta e a referência do esquema. */
function montarAtributos(dados) {
  const corpo = el('#tabela-atributos');
  corpo.replaceChildren(
    ...Object.values(dados.classificacoes).map((d) =>
      linha(
        d.rotulo,
        celula('td', d.valores.map((v) => v.valor).join(', ')),
        celula('td', d.pergunta),
        celula('td', referenciaCurta(dados, d.referencia) || 'Definido na QP1 da revisão rápida')
      )
    )
  );
}

/** Os tipos de solução segundo Shaw, com quantas soluções caíram em cada um. */
function montarTipos(dados) {
  const contagem = new Map();
  dados.solucoes.forEach((s) => contagem.set(s.tipo, (contagem.get(s.tipo) || 0) + 1));
  el('#tabela-tipos').replaceChildren(
    ...Object.entries(dados.meta.tiposSolucao).map(([tipo, descricao]) =>
      linha(tipo, celula('td', descricao), celula('td', String(contagem.get(tipo) || 0), 'mono'))
    )
  );
}

const resolver = (dados, ids) => ids.map((c) => porId(dados.conhecimentos, c)).filter(Boolean);

function montarSolucoes(dados) {
  const ligadas = renderizar(
    el('#lista-solucoes'),
    dados.solucoes.map((s) => ({
      id: s.id,
      texto: s.nome,
      etiqueta: s.tipo,
      estudos: s.estudos,
      conhecimentos: resolver(dados, s.conhecimentos)
    }))
  );
  el('#resumo-solucoes').textContent =
    `As ${dados.solucoes.length} soluções identificadas na revisão rápida, das quais ${ligadas} apoiam pelo menos um conhecimento.`;

  /* O aviso de que o catálogo não prescreve solução. Enquanto o texto não
     existir em meta.json, a linha não aparece, em vez de um espaço vazio. */
  const aviso = el('#aviso-solucoes');
  aviso.textContent = dados.meta.avisoSolucoes || '';
  aviso.hidden = !dados.meta.avisoSolucoes;
}

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
  if (!el('#lista-solucoes')) return;

  let dados;
  try {
    dados = await carregar();
  } catch (erro) {
    console.error(erro);
    const recado =
      'Não foi possível carregar os dados. Confira se o servidor está no ar e se a página foi aberta pelo endereço dele.';
    el('#resumo-solucoes').textContent = recado;
    el('#resumo-desafios').textContent = recado;
    return;
  }

  montarAtributos(dados);
  montarTipos(dados);
  montarSolucoes(dados);
  montarDesafios(dados);
}

iniciar();
