/**
 * Transforma conhecimentos na grade de cartões. Não sabe filtrar nem carregar,
 * recebe a lista já filtrada e já ordenada.
 */

export const classeNatureza = (natureza) =>
  ({
    'Explícito': 'explicito',
    'Tácito-cognitivo': 'tacito-cognitivo',
    'Tácito-técnico': 'tacito-tecnico'
  }[natureza] || 'explicito');

function criar(tag, className, texto) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

/**
 * Cartão do conhecimento. O selo é a natureza epistemológica.
 *
 * Quem abre a ficha é o link do pé, e não o cartão inteiro, para o cartão não
 * ser um alvo clicável com outro alvo clicável dentro.
 */
function montarCartao(conhecimento, aoAbrir) {
  const item = criar('li');
  const cartao = criar('article', 'cartao');

  const topo = criar('div', 'cartao__topo');
  topo.append(
    criar('span', 'codigo-id cartao__id', conhecimento.id),
    criar('span', `etiqueta etiqueta--${classeNatureza(conhecimento.natureza)}`, conhecimento.natureza)
  );

  const abrir = criar('a', 'cartao__abrir', 'Ver ficha completa');
  abrir.href = `?id=${conhecimento.id}`;
  /* O nome vai junto para quem usa leitor de tela, senão todos os links da
     página se chamam igual e nenhum diz para onde vai. */
  abrir.append(criar('span', 'apenas-leitor', `, ${conhecimento.nome}`));
  abrir.addEventListener('click', (evento) => {
    evento.preventDefault();
    aoAbrir(conhecimento.id);
  });

  cartao.append(
    topo,
    criar('h4', 'cartao__nome', conhecimento.nome),
    criar('p', 'cartao__descricao', conhecimento.descricao),
    abrir
  );
  item.append(cartao);
  return item;
}

/**
 * Desenha a grade inteira. Os conhecimentos chegam já agrupados por natureza
 * pela ordenação, então o agrupamento continua valendo na sequência dos cartões
 * sem precisar de cabeçalho separando um grupo do outro.
 */
export function renderizar(elemento, conhecimentos, aoAbrir) {
  elemento.replaceChildren(...conhecimentos.map((c) => montarCartao(c, aoAbrir)));
}
