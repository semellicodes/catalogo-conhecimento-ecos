/**
 * Alterna a navegação compacta. Em telas amplas os links permanecem visíveis;
 * nas menores, o botão mantém a marca e o tema na mesma linha.
 */

const LIMITE_COMPACTO = matchMedia('(max-width: 71.99rem)');

function iniciarMenu() {
  const cabecalho = document.querySelector('.cabecalho');
  const botao = document.querySelector('#botao-menu');
  const navegacao = document.querySelector('#navegacao-principal');
  if (!cabecalho || !botao || !navegacao) return;

  function fechar() {
    botao.setAttribute('aria-expanded', 'false');
    botao.setAttribute('aria-label', 'Abrir menu de navegação');
    navegacao.hidden = true;
  }

  function abrir() {
    botao.setAttribute('aria-expanded', 'true');
    botao.setAttribute('aria-label', 'Fechar menu de navegação');
    navegacao.hidden = false;
  }

  function sincronizarLargura() {
    if (LIMITE_COMPACTO.matches) fechar();
    else {
      botao.setAttribute('aria-expanded', 'false');
      botao.setAttribute('aria-label', 'Abrir menu de navegação');
      navegacao.hidden = false;
    }
  }

  botao.addEventListener('click', () => {
    if (botao.getAttribute('aria-expanded') === 'true') fechar();
    else abrir();
  });

  navegacao.addEventListener('click', (evento) => {
    if (evento.target.closest('a') && LIMITE_COMPACTO.matches) fechar();
  });

  document.addEventListener('keydown', (evento) => {
    if (evento.key !== 'Escape' || botao.getAttribute('aria-expanded') !== 'true') return;
    fechar();
    botao.focus();
  });

  document.addEventListener('click', (evento) => {
    if (!LIMITE_COMPACTO.matches || botao.getAttribute('aria-expanded') !== 'true') return;
    if (!cabecalho.contains(evento.target)) fechar();
  });

  LIMITE_COMPACTO.addEventListener('change', sincronizarLargura);
  window.addEventListener('resize', sincronizarLargura);
  sincronizarLargura();
}

iniciarMenu();
