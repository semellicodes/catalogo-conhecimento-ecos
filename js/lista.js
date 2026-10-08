/**
 * Transforma conhecimentos na trilha por nível. Não sabe filtrar nem carregar,
 * recebe a lista já filtrada e os níveis já resolvidos.
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

/** Cartão baixo. O ponto dá a natureza, o identificador e o nome dão o resto. */
function montarCartao(conhecimento, aoAbrir) {
  const item = criar('li');
  const cartao = criar('a', 'cartao');
  cartao.href = `?id=${conhecimento.id}`;

  const ponto = criar('span', `cartao__ponto cartao__ponto--${classeNatureza(conhecimento.natureza)}`);
  ponto.setAttribute('aria-hidden', 'true');

  /* A natureza não aparece escrita no cartão, então vai para quem usa leitor de tela. */
  const natureza = criar('span', 'apenas-leitor', `${conhecimento.natureza}. `);

  cartao.append(
    ponto,
    criar('span', 'codigo-id cartao__id', conhecimento.id),
    natureza,
    criar('span', 'cartao__nome', conhecimento.nome)
  );
  cartao.addEventListener('click', (evento) => {
    evento.preventDefault();
    aoAbrir(conhecimento.id);
  });

  item.append(cartao);
  return item;
}

/** Uma estação da trilha. Só é montada quando sobrou conhecimento no nível. */
function montarEstacao(nivel, conhecimentos, aoAbrir) {
  const estacao = criar('li', 'estacao');

  const marca = criar('div', 'estacao__marca');
  marca.setAttribute('aria-hidden', 'true');
  marca.append(criar('span', 'estacao__ponto'));

  const corpo = criar('div', 'estacao__corpo');
  const titulo = criar('h3', 'estacao__titulo');
  titulo.append(
    criar('span', null, nivel.valor),
    criar('span', 'estacao__contagem', String(conhecimentos.length))
  );
  corpo.append(titulo, criar('p', 'estacao__descricao', nivel.descricao));

  const grade = criar('ul', 'cartoes');
  conhecimentos.forEach((c) => grade.append(montarCartao(c, aoAbrir)));
  corpo.append(grade);

  estacao.append(marca, corpo);
  return estacao;
}

/**
 * Redesenha a trilha inteira. A ordem das estações é a ordem dos valores em
 * classificacoes.json, e nível sem conhecimento não vira estação.
 */
export function renderizar(elemento, conhecimentos, niveis, aoAbrir) {
  elemento.replaceChildren();
  niveis.forEach((nivel) => {
    const doNivel = conhecimentos.filter((c) => c.nivel === nivel.valor);
    if (doNivel.length) elemento.append(montarEstacao(nivel, doNivel, aoAbrir));
  });
}

/** Legenda das cores da natureza, montada a partir da própria classificação. */
export function renderizarLegenda(elemento, naturezas) {
  elemento.replaceChildren(
    ...naturezas.map((n) => {
      const item = criar('li', 'legenda__item');
      const ponto = criar('span', `legenda__ponto legenda__ponto--${classeNatureza(n.valor)}`);
      ponto.setAttribute('aria-hidden', 'true');
      item.append(ponto, criar('span', null, n.valor));
      return item;
    })
  );
}
