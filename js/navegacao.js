/**
 * Marca o item do cabeçalho conforme a seção visível. A rolagem suave e o
 * desvio do cabeçalho fixo ficam no CSS, aqui só entra qual item está ativo.
 */

/* Linha de leitura, logo abaixo do cabeçalho fixo. Vale a seção que a cruzou por último. */
const LINHA = 72;

const links = [...document.querySelectorAll('.navegacao a[data-secao]')];
const secoes = links.map((link) => document.getElementById(link.dataset.secao)).filter(Boolean);

if (secoes.length) {
  let noFim = false;

  function marcar(secao) {
    links.forEach((link) => {
      if (link.dataset.secao === secao) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  function escolher() {
    /* Com o rodapé à vista não há mais o que rolar, então vale a última seção. */
    if (noFim) return marcar(secoes[secoes.length - 1].id);
    const passaram = secoes.filter((s) => s.getBoundingClientRect().top <= LINHA + 1);
    marcar((passaram.length ? passaram[passaram.length - 1] : secoes[0]).id);
  }

  /* A área observada começa na linha de leitura e vai até a base da janela. Como
     as seções são vizinhas, o observador dispara exatamente quando uma sai e a
     seguinte entra, que é quando o ativo pode mudar. */
  const naLinha = new IntersectionObserver(escolher, {
    rootMargin: `-${LINHA}px 0px 0px 0px`,
    threshold: 0
  });
  secoes.forEach((s) => naLinha.observe(s));

  /* Um clique na navegação para exatamente em cima da linha, por causa do
     scroll-margin-top. Nessa borda o observador não tem transição para relatar,
     então o fim da rolagem é quem confirma. Onde scrollend não existe, vale o
     reexame logo depois do quadro seguinte. */
  if ('onscrollend' in window) {
    addEventListener('scrollend', escolher);
  } else {
    addEventListener('hashchange', () => {
      requestAnimationFrame(escolher);
      setTimeout(escolher, 400);
    });
  }

  /* O cruzamento da linha não acontece no fim da página, onde a última seção
     nunca chega ao topo. Quem avisa que chegou ao fim é o rodapé. */
  const rodape = document.querySelector('.rodape');
  if (rodape) {
    new IntersectionObserver(
      ([entrada]) => {
        noFim = entrada.isIntersecting;
        escolher();
      },
      { threshold: 0 }
    ).observe(rodape);
  }

  escolher();
}
