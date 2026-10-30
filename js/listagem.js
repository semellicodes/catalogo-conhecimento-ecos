/**
 * Peça de listagem dos desafios, com identificador, texto, estudos e os
 * conhecimentos ligados.
 *
 * Não conhece arquivo nem filtro. Recebe a lista já resolvida e devolve o DOM.
 */

function criar(tag, className, texto) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

/**
 * Um conhecimento ligado. O identificador basta no texto, porque a lista fica
 * longa, mas o nome vai junto para quem usa leitor de tela, senão o link vira
 * uma sigla sem contexto.
 */
function ligacao(conhecimento) {
  const link = criar('a', 'ligado');
  link.href = `index.html?id=${conhecimento.id}#catalogo`;
  link.append(
    criar('span', null, conhecimento.id),
    criar('span', 'apenas-leitor', `, ${conhecimento.nome}`)
  );
  return link;
}

/** Um item da listagem. As partes que não existem simplesmente não entram. */
function montarItem({ id, texto, etiqueta, estudos, conhecimentos }) {
  const item = criar('li', 'item-listagem');
  item.append(criar('span', 'codigo-id', id));

  const corpo = criar('div', 'item-listagem__corpo');
  const topo = criar('p', 'item-listagem__texto', texto);
  corpo.append(topo);

  const meta = criar('p', 'item-listagem__meta');
  if (etiqueta) meta.append(criar('span', 'item-listagem__etiqueta', etiqueta));
  meta.append(criar('span', null, estudos.join(', ')));
  corpo.append(meta);

  /* Sem conhecimento ligado não entra linha nenhuma, em vez de um rótulo vazio. */
  if (conhecimentos.length) {
    const ligados = criar('p', 'item-listagem__ligados');
    ligados.append(criar('span', 'item-listagem__rotulo', 'Conhecimentos'));
    conhecimentos.forEach((c) => ligados.append(ligacao(c)));
    corpo.append(ligados);
  }

  item.append(corpo);
  return item;
}

/** Desenha a listagem inteira e devolve quantos itens têm alguma ligação. */
export function renderizar(elemento, itens) {
  elemento.replaceChildren(...itens.map(montarItem));
  return itens.filter((i) => i.conhecimentos.length).length;
}
