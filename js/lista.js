/**
 * Transforma conhecimentos em elementos da listagem. Não sabe filtrar.
 */

import { vazio } from './dados.js';

export const classeNatureza = (natureza) =>
  ({
    'Explícito': 'explicito',
    'Tácito-cognitivo': 'tacito-cognitivo',
    'Tácito-técnico': 'tacito-tecnico'
  }[natureza] || 'explicito');

function etiqueta(texto, modificador) {
  const span = document.createElement('span');
  span.className = modificador ? `etiqueta etiqueta--${modificador}` : 'etiqueta';
  span.textContent = texto;
  return span;
}

function montarCard(conhecimento, aoAbrir) {
  const natureza = classeNatureza(conhecimento.natureza);
  const card = document.createElement('a');
  card.className = `card card--${natureza}`;
  card.href = `?id=${conhecimento.id}`;
  card.dataset.id = conhecimento.id;

  /* Topo. O identificador de um lado, a natureza do outro. */
  const topo = document.createElement('span');
  topo.className = 'card__topo';
  const id = document.createElement('span');
  id.className = 'codigo-id';
  id.textContent = conhecimento.id;
  topo.append(id, etiqueta(conhecimento.natureza.toLowerCase(), natureza));

  const nome = document.createElement('span');
  nome.className = 'card__nome';
  nome.textContent = conhecimento.nome;

  const descricao = document.createElement('span');
  descricao.className = 'card__descricao';
  descricao.textContent = conhecimento.descricao;

  /* Rodapé. As demais facetas e os estudos que sustentam o conhecimento. */
  const rodape = document.createElement('span');
  rodape.className = 'etiquetas card__rodape';
  rodape.append(etiqueta(conhecimento.nivel.toLowerCase()), etiqueta(conhecimento.dimensao.toLowerCase()));
  if (!vazio(conhecimento.tipoEcos)) {
    conhecimento.tipoEcos.forEach((t) => rodape.append(etiqueta(t.toLowerCase())));
  }
  rodape.append(etiqueta(conhecimento.estudos.join(', ')));

  card.append(topo, nome, descricao, rodape);
  card.addEventListener('click', (evento) => {
    evento.preventDefault();
    aoAbrir(conhecimento.id);
  });
  return card;
}

/** Redesenha a listagem inteira dentro do elemento informado. */
export function renderizar(elemento, conhecimentos, aoAbrir) {
  elemento.replaceChildren();
  if (conhecimentos.length === 0) {
    const aviso = document.createElement('p');
    aviso.className = 'vazio';
    aviso.textContent = 'Nenhum conhecimento corresponde aos filtros aplicados.';
    elemento.append(aviso);
    return;
  }
  conhecimentos.forEach((c) => elemento.append(montarCard(c, aoAbrir)));
}
