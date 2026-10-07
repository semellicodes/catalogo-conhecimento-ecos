/**
 * Desenho decorativo da faixa de abertura. Conhecimento circulando entre atores,
 * representado por nós em volta de um centro, ligados por arcos que passam perto
 * dele. Traço fino, sem preenchimento pesado e sem gradiente. É decoração, então
 * entra com aria-hidden e nenhum dado do catálogo depende dele.
 */

const SVG = 'http://www.w3.org/2000/svg';
const LADO = 200;
const CENTRO = LADO / 2;
const RAIO_NOS = 76;
const NOS = 6;

function forma(tag, atributos) {
  const el = document.createElementNS(SVG, tag);
  Object.entries(atributos).forEach(([nome, valor]) => el.setAttribute(nome, String(valor)));
  return el;
}

const arredondar = (n) => Number(n.toFixed(2));

/** Posição de cada nó, começando no topo e girando no sentido do relógio. */
function posicao(indice) {
  const angulo = (Math.PI * 2 * indice) / NOS - Math.PI / 2;
  return {
    x: arredondar(CENTRO + Math.cos(angulo) * RAIO_NOS),
    y: arredondar(CENTRO + Math.sin(angulo) * RAIO_NOS)
  };
}

/**
 * Arco entre dois nós. O raio cresce com a distância, então ligações vizinhas
 * curvam bastante e ligações opostas quase atravessam o centro.
 */
function arco(de, para, salto) {
  const a = posicao(de);
  const b = posicao(para);
  const raio = arredondar(RAIO_NOS * (0.75 + salto * 0.55));
  return forma('path', {
    d: `M${a.x} ${a.y} A${raio} ${raio} 0 0 1 ${b.x} ${b.y}`,
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': arredondar(2 - salto * 0.45),
    'stroke-linecap': 'round',
    opacity: arredondar(0.85 - salto * 0.18)
  });
}

export function montar(alvo) {
  if (!alvo) return;

  const svg = forma('svg', {
    viewBox: `0 0 ${LADO} ${LADO}`,
    class: 'desenho-ecos',
    'aria-hidden': 'true',
    focusable: 'false'
  });

  /* O que gira é só este grupo, para o giro não arrastar o enquadramento. */
  const giro = forma('g', { class: 'desenho-ecos__giro' });

  /* Dois anéis de apoio, bem apagados, que dão a ideia de órbita. */
  [RAIO_NOS, RAIO_NOS * 0.52].forEach((raio, i) =>
    giro.append(
      forma('circle', {
        cx: CENTRO,
        cy: CENTRO,
        r: arredondar(raio),
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': 0.75,
        opacity: i === 0 ? 0.22 : 0.14
      })
    )
  );

  /* Os arcos. Vizinhos, salteados e opostos, com espessura e opacidade decrescentes. */
  for (let salto = 1; salto <= 3; salto += 1) {
    const voltas = salto === 3 ? NOS / 2 : NOS;
    for (let i = 0; i < voltas; i += 1) giro.append(arco(i, (i + salto) % NOS, salto));
  }

  /* Os nós. Alternam cheio e vazado, para os atores não parecerem todos iguais. */
  for (let i = 0; i < NOS; i += 1) {
    const { x, y } = posicao(i);
    const cheio = i % 2 === 0;
    giro.append(
      forma('circle', {
        cx: x,
        cy: y,
        r: cheio ? 6 : 5,
        fill: cheio ? 'currentColor' : 'var(--cor-faixa)',
        stroke: 'currentColor',
        'stroke-width': cheio ? 0 : 1.6,
        opacity: cheio ? 1 : 0.9
      })
    );
  }

  svg.append(giro);

  /* O centro fica fora do grupo que gira, porque é o ponto de referência. */
  svg.append(
    forma('circle', {
      cx: CENTRO,
      cy: CENTRO,
      r: 11,
      fill: 'var(--cor-faixa)',
      stroke: 'currentColor',
      'stroke-width': 1.8
    }),
    forma('circle', { cx: CENTRO, cy: CENTRO, r: 3.4, fill: 'currentColor' })
  );

  alvo.replaceChildren(svg);
}

montar(document.querySelector('#desenho-abertura'));
