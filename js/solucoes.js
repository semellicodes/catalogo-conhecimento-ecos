/**
 * Preenche a página de soluções. As trinta e seis identificadas na revisão,
 * inclusive as sete que não apoiam nenhum conhecimento, porque o número é
 * resultado publicado e elas existem na literatura do mesmo jeito.
 */

import { carregar, porId } from './dados.js';
import { renderizar } from './listagem.js';

const el = (seletor) => document.querySelector(seletor);

async function iniciar() {
  const lista = el('#lista-solucoes');
  if (!lista) return;

  let dados;
  try {
    dados = await carregar();
  } catch (erro) {
    console.error(erro);
    el('#resumo-solucoes').textContent =
      'Não foi possível carregar as soluções. Confira se o servidor está no ar e se a página foi aberta pelo endereço dele.';
    return;
  }

  const ligadas = renderizar(
    lista,
    dados.solucoes.map((s) => ({
      id: s.id,
      texto: s.nome,
      etiqueta: s.tipo,
      estudos: s.estudos,
      conhecimentos: s.conhecimentos.map((c) => porId(dados.conhecimentos, c)).filter(Boolean)
    }))
  );

  el('#resumo-solucoes').textContent =
    `As ${dados.solucoes.length} soluções identificadas na revisão rápida, das quais ${ligadas} apoiam pelo menos um conhecimento.`;
}

iniciar();
