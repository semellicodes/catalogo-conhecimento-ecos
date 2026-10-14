/**
 * Preenche a página de desafios. Os dezessete, inclusive os que não se ligam a
 * nenhum conhecimento, que vêm de estudos sem conhecimento extraído e por isso
 * não aparecem em ficha nenhuma. Se ficassem de fora daqui, não apareceriam em
 * lugar algum.
 */

import { carregar, porId } from './dados.js';
import { renderizar } from './listagem.js';

const el = (seletor) => document.querySelector(seletor);

async function iniciar() {
  const lista = el('#lista-desafios');
  if (!lista) return;

  let dados;
  try {
    dados = await carregar();
  } catch (erro) {
    console.error(erro);
    el('#resumo-desafios').textContent =
      'Não foi possível carregar os desafios. Confira se o servidor está no ar e se a página foi aberta pelo endereço dele.';
    return;
  }

  const ligados = renderizar(
    lista,
    dados.desafios.map((d) => ({
      id: d.id,
      texto: d.desafio,
      estudos: d.estudos,
      conhecimentos: d.conhecimentos.map((c) => porId(dados.conhecimentos, c)).filter(Boolean)
    }))
  );

  el('#resumo-desafios').textContent =
    `Os ${dados.desafios.length} desafios identificados na revisão rápida, dos quais ${ligados} estão ligados a pelo menos um conhecimento.`;
}

iniciar();
