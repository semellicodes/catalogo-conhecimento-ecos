/**
 * Desenho decorativo da faixa de abertura. Conhecimento circulando entre atores,
 * representado por um anel de nós girando em torno de um cérebro parado.
 *
 * O anel é um disco inclinado num espaço 3D de verdade, com perspective no
 * contêiner, então o nó que passa na frente fica maior que o do fundo. O plano
 * do disco é um SVG, que carrega os anéis e os arcos, e os nós são elementos
 * próprios, contragirados para continuarem redondos de frente para quem olha.
 *
 * Com ponteiro fino o anel também aceita arrasto e as setas do teclado. No toque
 * isso fica de fora, para o desenho não disputar o gesto com a rolagem.
 */

const SVG = 'http://www.w3.org/2000/svg';
const LADO = 200;
const CENTRO = LADO / 2;
const RAIO_NOS = 76;
const NOS = 6;

/* Velocidade do giro contínuo, em graus por segundo. A inclinação do disco é
   visual e mora em tokens.css, como --orbe-inclinacao. */
const VELOCIDADE_BASE = 360 / 140;
/* Quanto um pixel de arrasto vira em graus, e o passo de cada toque na seta. */
const GRAUS_POR_PIXEL = 0.45;
const PASSO_TECLA = 8;
/* Depois que o dedo solta, o impulso vira velocidade extra. O teto evita que um
   arranco vire três voltas, e o atrito é quanto dessa sobra passa de quadro a
   quadro até restar só o giro contínuo. */
const VELOCIDADE_MAXIMA = 220;
const ATRITO = 0.94;

const fino = () => matchMedia('(hover: hover) and (pointer: fine)').matches;
const reduzido = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

function forma(tag, atributos) {
  const el = document.createElementNS(SVG, tag);
  Object.entries(atributos).forEach(([nome, valor]) => el.setAttribute(nome, String(valor)));
  return el;
}

function caixa(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

const arredondar = (n) => Number(n.toFixed(2));

/** Ângulo de cada nó no plano do disco, começando no topo. */
const anguloDoNo = (indice) => (360 * indice) / NOS - 90;

function posicao(indice) {
  const radianos = (anguloDoNo(indice) * Math.PI) / 180;
  return {
    x: arredondar(CENTRO + Math.cos(radianos) * RAIO_NOS),
    y: arredondar(CENTRO + Math.sin(radianos) * RAIO_NOS)
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

/** O plano do disco. Dois anéis de apoio e os arcos entre os nós. */
function plano() {
  const svg = forma('svg', {
    viewBox: `0 0 ${LADO} ${LADO}`,
    class: 'orbe__plano',
    'aria-hidden': 'true',
    focusable: 'false'
  });

  [RAIO_NOS, RAIO_NOS * 0.52].forEach((raio, i) =>
    svg.append(
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

  for (let salto = 1; salto <= 3; salto += 1) {
    const voltas = salto === 3 ? NOS / 2 : NOS;
    for (let i = 0; i < voltas; i += 1) svg.append(arco(i, (i + salto) % NOS, salto));
  }
  return svg;
}

/* Contorno do cérebro, simétrico em relação ao eixo vertical. Os giros são
   sugeridos por ondulações do próprio contorno, sem detalhe demais. */
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

/** O cérebro fica fora do disco, de frente e parado enquanto os nós giram. */
function cerebro() {
  const svg = forma('svg', {
    viewBox: `0 0 ${LADO} ${LADO}`,
    class: 'cerebro',
    'aria-hidden': 'true',
    focusable: 'false'
  });

  svg.append(
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
    svg.append(
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
  return svg;
}

/**
 * Os nós. Cada um é posicionado no plano do disco, e o ponto dentro dele desfaz
 * o giro e a inclinação, então continua um círculo de frente para quem olha
 * mesmo com o disco deitado.
 */
function nos() {
  const lista = [];
  for (let i = 0; i < NOS; i += 1) {
    const no = caixa(i % 2 === 0 ? 'no' : 'no no--vazado');
    no.style.setProperty('--angulo', `${anguloDoNo(i)}deg`);
    no.append(caixa('no__ponto'));
    lista.push(no);
  }
  return lista;
}

/**
 * Mantém o giro andando e devolve como empurrá-lo. O empurrão do arrasto vira
 * velocidade extra, que o atrito consome até sobrar só o giro contínuo, que é
 * o que faz a soltura não ter emenda com o gesto.
 */
function animar(cena) {
  let giro = 0;
  let extra = 0;
  let anterior = null;
  const base = () => (reduzido() ? 0 : VELOCIDADE_BASE);

  const escrever = () => cena.style.setProperty('--giro', `${arredondar(giro)}deg`);

  function quadro(agora) {
    const dt = anterior === null ? 0 : Math.min((agora - anterior) / 1000, 0.1);
    anterior = agora;
    giro += (base() + extra) * dt;
    extra *= ATRITO;
    escrever();
    requestAnimationFrame(quadro);
  }
  requestAnimationFrame(quadro);

  return {
    empurrar(graus) {
      giro += graus;
      escrever();
    },
    lancar(grausPorSegundo) {
      extra = Math.max(-VELOCIDADE_MAXIMA, Math.min(VELOCIDADE_MAXIMA, grausPorSegundo));
    }
  };
}

/** Arrasto do mouse. Devolve a velocidade de soltura para o giro continuar nela. */
function ligarArrasto(cena, motor) {
  let arrastando = false;
  let ultimoX = 0;
  let ultimoInstante = 0;
  let velocidade = 0;

  cena.addEventListener('pointerdown', (evento) => {
    if (evento.pointerType !== 'mouse') return;
    arrastando = true;
    velocidade = 0;
    ultimoX = evento.clientX;
    ultimoInstante = evento.timeStamp;
    motor.lancar(0);
    cena.setPointerCapture(evento.pointerId);
    cena.classList.add('cena--arrastando');
  });

  cena.addEventListener('pointermove', (evento) => {
    if (!arrastando) return;
    const dx = evento.clientX - ultimoX;
    const dt = Math.max(evento.timeStamp - ultimoInstante, 1) / 1000;
    ultimoX = evento.clientX;
    ultimoInstante = evento.timeStamp;
    const graus = dx * GRAUS_POR_PIXEL;
    velocidade = graus / dt;
    motor.empurrar(graus);
  });

  const soltar = (evento) => {
    if (!arrastando) return;
    arrastando = false;
    cena.releasePointerCapture(evento.pointerId);
    cena.classList.remove('cena--arrastando');
    motor.lancar(velocidade);
  };
  cena.addEventListener('pointerup', soltar);
  cena.addEventListener('pointercancel', soltar);
}

/**
 * Quem pode arrastar também precisa poder girar pelo teclado, e o desenho deixa
 * de ser puramente decorativo, então ganha foco, rótulo e sai do aria-hidden.
 */
function ligarControle(cena, motor) {
  cena.tabIndex = 0;
  cena.setAttribute('role', 'img');
  cena.setAttribute(
    'aria-label',
    'Ilustração do ecossistema, um anel de nós girando em torno de um cérebro. Arraste ou use as setas para girar.'
  );
  cena.removeAttribute('aria-hidden');

  ligarArrasto(cena, motor);

  cena.addEventListener('keydown', (evento) => {
    const passo = { ArrowLeft: -PASSO_TECLA, ArrowRight: PASSO_TECLA }[evento.key];
    if (passo === undefined) return;
    evento.preventDefault();
    motor.empurrar(passo);
  });
}

export function montar(alvo) {
  if (!alvo) return;

  alvo.classList.add('cena');

  const orbe = caixa('orbe');
  orbe.append(plano(), ...nos());
  alvo.replaceChildren(orbe, cerebro());

  const motor = animar(alvo);
  if (fino()) ligarControle(alvo, motor);
}

montar(document.querySelector('#desenho-abertura'));
