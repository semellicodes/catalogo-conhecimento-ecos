/**
 * Recarrega a página uma vez quando o HTML guardado pelo navegador ficou para
 * trás da versão publicada.
 *
 * Todo CSS e JS leva ?v=, mas o HTML não, porque é o endereço que a pessoa
 * abre. Quando o navegador serve um HTML antigo, ele pede junto as versões
 * antigas de tudo, e o site parece congelado mesmo com a publicação correta.
 * Sem este guarda, só recarregar sem cache resolvia, e quem usa o catálogo não
 * tem por que saber disso.
 */

const CHAVE = 'versao-recarregada';

/* O sessionStorage falha em janela anônima de alguns navegadores. Uma falha
   dele não pode derrubar o guarda, então lê e escreve sempre protegido. */
const ler = () => {
  try {
    return sessionStorage.getItem(CHAVE);
  } catch (erro) {
    return null;
  }
};

const gravar = (valor) => {
  try {
    if (valor === null) sessionStorage.removeItem(CHAVE);
    else sessionStorage.setItem(CHAVE, valor);
  } catch (erro) {
    /* Sem memória de sessão o guarda recarrega no máximo uma vez por carga,
       porque a condição de saída abaixo continua valendo. */
  }
};

async function versaoPublicada() {
  /* O carimbo de tempo e o no-store são os dois ao mesmo tempo de propósito.
     O no-store trata o cache do navegador e o carimbo trata intermediários que
     ignoram o cabeçalho. */
  const resposta = await fetch(`versao.json?t=${Date.now()}`, { cache: 'no-store' });
  if (!resposta.ok) throw new Error(`versao.json respondeu ${resposta.status}`);
  return (await resposta.json()).versao;
}

async function conferir() {
  const daPagina = document.querySelector('meta[name="versao"]')?.content;
  if (!daPagina) return;

  let publicada;
  try {
    publicada = await versaoPublicada();
  } catch (erro) {
    /* Sem rede ou sem o arquivo, a página serve como está. Um guarda de cache
       nunca pode impedir a leitura do catálogo. */
    return;
  }

  if (!publicada || publicada === daPagina) {
    gravar(null);
    return;
  }

  /* Se já tentou recarregar para esta versão e o HTML continuou velho, para
     por aqui. Insistir viraria laço de recarga. */
  if (ler() === publicada) {
    console.warn(`Página na versão ${daPagina}, publicada ${publicada}. O recarregar não trouxe o HTML novo.`);
    return;
  }

  gravar(publicada);
  location.reload();
}

conferir();
