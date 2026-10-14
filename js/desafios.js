/**
 * Monta a listagem dos desafios na página inicial. Não filtra e não abre ficha,
 * porque desafio não tem ficha. É só a lista do que a revisão identificou.
 *
 * Entram os dezessete, inclusive os que não se ligam a nenhum conhecimento, que
 * vêm de estudos sem conhecimento extraído e por isso não aparecem em ficha
 * nenhuma. Se ficassem de fora daqui, não apareceriam em lugar algum.
 */

import { carregar } from './dados.js';

const el = (seletor) => document.querySelector(seletor);

function criar(tag, className, texto) {
  const elemento = document.createElement(tag);
  if (className) elemento.className = className;
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
}

function montarDesafio(desafio) {
  const item = criar('li', 'desafio');
  item.append(criar('span', 'codigo-id', desafio.id));

  const corpo = criar('div', 'desafio__corpo');
  corpo.append(criar('p', 'desafio__texto', desafio.desafio));

  const meta = criar('p', 'desafio__meta');
  meta.append(criar('span', null, desafio.estudos.join(', ')));
  /* Sem conhecimento ligado, a segunda parte não entra e não sobra espaço. */
  if (desafio.conhecimentos.length) {
    meta.append(criar('span', 'desafio__ligados', desafio.conhecimentos.join(', ')));
  }
  corpo.append(meta);

  item.append(corpo);
  return item;
}

async function iniciar() {
  const lista = el('#lista-desafios');
  if (!lista) return;

  let dados;
  try {
    dados = await carregar();
  } catch (erro) {
    console.error(erro);
    el('#contagem-desafios').textContent = 'não foi possível carregar os desafios';
    return;
  }

  lista.replaceChildren(...dados.desafios.map(montarDesafio));
  const ligados = dados.desafios.filter((d) => d.conhecimentos.length).length;
  el('#contagem-desafios').textContent =
    `${dados.desafios.length} desafios, ${ligados} ligados a algum conhecimento`;
}

iniciar();
