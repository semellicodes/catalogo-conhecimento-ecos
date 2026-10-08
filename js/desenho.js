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

/* Contorno do cérebro, simétrico em relação ao eixo vertical. Os giros são
   sugeridos por ondulações do próprio contorno, sem detalhe demais. O
   preenchimento é a cor da faixa, então os arcos que passam atrás não
   atravessam o desenho. */
const CONTORNO =
  'M100 78 C108 72 120 75 122 85 C132 88 133 100 125 106 ' +
  'C126 116 116 122 108 118 C105 122 95 122 92 118 ' +
  'C84 122 74 116 75 106 C67 100 68 88 78 85 C80 75 92 72 100 78 Z';

/* Fissura longitudinal e dois pares de sulcos, espelhados entre os hemisférios. */
const SULCOS = [
  'M100 79 C98 91 102 103 100 118',
  'M110 88 C117 91 118 98 112 102',
  'M90 88 C83 91 82 98 88 102',
  'M112 108 C118 107 120 111 118 114',
  'M88 108 C82 107 80 111 82 114'
];

const TRONCO = 'M100 119 L100 129';

/**
 * O cérebro fica fora do grupo que gira, porque é o ponto de referência.
 * Ele permanece parado enquanto os nós giram em volta.
 */
function cerebro() {
  const grupo = forma('g', { class: 'desenho-ecos__cerebro' });

  grupo.append(
    forma('path', {
      d: CONTORNO,
      fill: 'var(--cor-faixa)',
      stroke: 'currentColor',
      'stroke-width': 1.7,
      'stroke-linejoin': 'round'
    }),
    forma('path', {
      d: TRONCO,
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': 1.7,
      'stroke-linecap': 'round'
    })
  );

  SULCOS.forEach((d) =>
    grupo.append(
      forma('path', {
        d,
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': 1.15,
        'stroke-linecap': 'round',
        opacity: 0.75
      })
    )
  );

  return grupo;
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

  svg.append(cerebro());

  alvo.replaceChildren(svg);
}

montar(document.querySelector('#desenho-abertura'));
