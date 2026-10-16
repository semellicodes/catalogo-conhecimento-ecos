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

/**
 * Cartão do conhecimento. O selo é a natureza epistemológica, e a dimensão fica
 * ao lado do identificador, em mono apagado, para as duas aparecerem sem virar
 * duas etiquetas disputando o mesmo canto.
 *
 * Quem abre a ficha é o link do pé, e não o cartão inteiro, para o cartão não
 * ser um alvo clicável com outro alvo clicável dentro.
 */
function montarCartao(conhecimento, aoAbrir) {
  const item = criar('li');
  const cartao = criar('article', 'cartao');

  const referencia = criar('p', 'cartao__ref');
  referencia.append(
    criar('span', 'codigo-id cartao__id', conhecimento.id),
    criar('span', 'cartao__dimensao', conhecimento.dimensao)
  );

  const topo = criar('div', 'cartao__topo');
  topo.append(
    referencia,
    criar('span', `etiqueta etiqueta--${classeNatureza(conhecimento.natureza)}`, conhecimento.natureza)
  );

  const abrir = criar('a', 'botao cartao__abrir', 'Ver ficha completa');
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

/** Uma estação da trilha. Só é montada quando sobrou conhecimento no grupo. */
function montarEstacao(grupo, conhecimentos, aoAbrir) {
  const estacao = criar('li', 'estacao');

  const marca = criar('div', 'estacao__marca');
  marca.setAttribute('aria-hidden', 'true');
  marca.append(criar('span', 'estacao__ponto'));

  const corpo = criar('div', 'estacao__corpo');
  const titulo = criar('h3', 'estacao__titulo');
  titulo.append(
    criar('span', null, grupo.valor),
    criar('span', 'estacao__contagem', String(conhecimentos.length))
  );
  corpo.append(titulo, criar('p', 'estacao__descricao', grupo.descricao));

  const grade = criar('ul', 'cartoes');
  conhecimentos.forEach((c) => grade.append(montarCartao(c, aoAbrir)));
  corpo.append(grade);

  estacao.append(marca, corpo);
  return estacao;
}

/**
 * Redesenha a trilha inteira. Uma estação por natureza, na ordem recebida, que
 * é a da quantidade. Natureza sem nenhum conhecimento visível não vira estação,
 * então filtrar não deixa estação vazia na tela.
 */
export function renderizar(elemento, conhecimentos, naturezas, aoAbrir) {
  elemento.replaceChildren();
  naturezas.forEach((natureza) => {
    const daNatureza = conhecimentos.filter((c) => c.natureza === natureza.valor);
    if (daNatureza.length) elemento.append(montarEstacao(natureza, daNatureza, aoAbrir));
  });
}
