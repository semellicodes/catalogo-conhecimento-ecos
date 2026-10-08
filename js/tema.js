/**
 * Alterna o tema claro e escuro. O escuro é o padrão da página e o claro só
 * existe por escolha, que fica gravada. A preferência do sistema não entra,
 * porque a faixa de abertura é escura e a página acompanha.
 * O tema em si vive em css/tokens.css. Aqui só entra a decisão de qual vale.
 */

const CHAVE = 'tema';
const CLARO = 'claro';
const ESCURO = 'escuro';
const SVG = 'http://www.w3.org/2000/svg';

const raiz = document.documentElement;

function gravarEscolha(tema) {
  try {
    localStorage.setItem(CHAVE, tema);
  } catch (erro) {
    /* Janela privativa ou armazenamento bloqueado. O tema vale só nesta visita. */
  }
}

/** O tema que está valendo agora. Sem escolha gravada, é o escuro. */
function temaAtual() {
  return raiz.dataset.tema === CLARO ? CLARO : ESCURO;
}

function forma(tag, atributos) {
  const el = document.createElementNS(SVG, tag);
  Object.entries(atributos).forEach(([nome, valor]) => el.setAttribute(nome, valor));
  return el;
}

function moldura(...filhos) {
  const svg = forma('svg', {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '1.6',
    'stroke-linecap': 'round',
    'aria-hidden': 'true',
    focusable: 'false'
  });
  svg.append(...filhos);
  return svg;
}

/** Sol. Um círculo no centro e oito raios iguais. */
function iconeSol() {
  const raios = [];
  for (let i = 0; i < 8; i += 1) {
    const angulo = (Math.PI / 4) * i;
    const seno = Math.sin(angulo);
    const cosseno = Math.cos(angulo);
    const arredondar = (n) => Number(n.toFixed(2));
    raios.push(
      forma('line', {
        x1: arredondar(12 + cosseno * 8.3),
        y1: arredondar(12 + seno * 8.3),
        x2: arredondar(12 + cosseno * 10.6),
        y2: arredondar(12 + seno * 10.6)
      })
    );
  }
  return moldura(forma('circle', { cx: '12', cy: '12', r: '5' }), ...raios);
}

/** Lua. Um recorte crescente, traçado em uma única curva fechada. */
function iconeLua() {
  return moldura(
    forma('path', { d: 'M20 14.7A8.6 8.6 0 0 1 9.3 4 7.4 7.4 0 1 0 20 14.7Z' })
  );
}

/**
 * O interruptor tem os dois ícones sempre à vista, o do tema que está valendo
 * aceso e o outro apagado, e um deslizante que anda de um lado ao outro. Quem
 * manda no visual é o aria-pressed, então não há um segundo estado para o CSS
 * e o leitor de tela discordarem.
 */
function montarInterruptor(botao) {
  const sol = document.createElement('span');
  sol.className = 'interruptor__icone interruptor__icone--sol';
  sol.append(iconeSol());

  const lua = document.createElement('span');
  lua.className = 'interruptor__icone interruptor__icone--lua';
  lua.append(iconeLua());

  const deslizante = document.createElement('span');
  deslizante.className = 'interruptor__deslizante';
  deslizante.setAttribute('aria-hidden', 'true');

  botao.className = 'interruptor';
  botao.replaceChildren(deslizante, sol, lua);
}

/** Atualiza só o que muda com o tema. Os ícones ficam onde estão. */
function marcarEstado(botao) {
  const atual = temaAtual();
  const proximo = atual === ESCURO ? CLARO : ESCURO;
  botao.setAttribute('aria-label', `Mudar para o tema ${proximo}`);
  botao.setAttribute('title', `Mudar para o tema ${proximo}`);
  botao.setAttribute('aria-pressed', String(atual === CLARO));
}

function alternar(botao) {
  const proximo = temaAtual() === ESCURO ? CLARO : ESCURO;
  /* A classe liga a transição de cor só durante a troca, nunca na navegação normal. */
  raiz.classList.add('trocando-tema');
  raiz.dataset.tema = proximo;
  gravarEscolha(proximo);
  marcarEstado(botao);
  setTimeout(() => raiz.classList.remove('trocando-tema'), 300);
}

function iniciar() {
  const botao = document.querySelector('#botao-tema');
  if (!botao) return;
  montarInterruptor(botao);
  marcarEstado(botao);
  botao.addEventListener('click', () => alternar(botao));
}

iniciar();
