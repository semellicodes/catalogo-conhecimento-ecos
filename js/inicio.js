/**
 * Preenche a abertura, as portas de entrada por natureza e as camadas da seção
 * de estrutura.
 */

import { carregar } from './dados.js';
import { abrirAjuda } from './ficha.js';

const el = (seletor) => document.querySelector(seletor);

function criar(tag, className, texto) {
  const elemento = document.createElement(tag);
  if (className) elemento.className = className;
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
}

/** A contextualização fica acessível no botão de ajuda, sem alongar a abertura. */
function ajudaDasPortas(dados) {
  const conteudo = dados.meta.ajudas?.portasEntrada;
  const botao = el('#abrir-ajuda-portas');
  if (!conteudo || !botao) return;

  botao.addEventListener('click', () => abrirAjuda(dados, conteudo));
  botao.hidden = false;
}

/**
 * Uma porta de entrada por natureza epistemológica, que é a entrada principal
 * do catálogo. A contagem sai dos próprios conhecimentos e a descrição sai do
 * vocabulário, então nenhuma das duas está escrita aqui.
 *
 * O link leva ao catálogo já filtrado por aquela natureza, pela mesma query
 * string que os filtros usam.
 */
function porta(valor, quantos) {
  const bloco = criar('article', 'porta');
  bloco.append(
    criar('p', 'porta__contagem mono', String(quantos)),
    criar('h3', 'porta__nome', valor.tituloPorta || valor.valor)
  );
  if (valor.descricao) bloco.append(criar('p', 'porta__texto', valor.descricao));

  const link = criar('a', 'porta__link', `Ver os ${quantos}`);
  link.href = `?natureza=${encodeURIComponent(valor.valor)}#catalogo`;
  link.append(criar('span', 'apenas-leitor', ` conhecimentos de natureza ${valor.valor}`));
  bloco.append(link);
  return bloco;
}

/**
 * Uma camada. O número fica na mesma linha do nome, em vez de ocupar uma linha
 * só para si, que é o que inchava o cartão.
 */
function camada(dados) {
  const bloco = document.createElement('article');
  bloco.className = 'camada';

  const topo = document.createElement('p');
  topo.className = 'camada__topo';
  const n = document.createElement('span');
  n.className = 'camada__n';
  n.textContent = String(dados.n).padStart(2, '0');
  const nome = document.createElement('span');
  nome.className = 'camada__nome';
  nome.textContent = dados.nome;
  topo.append(n, nome);

  const texto = document.createElement('p');
  texto.className = 'camada__texto';
  texto.textContent = dados.conteudo;

  const origem = document.createElement('p');
  origem.className = 'camada__origem';
  origem.textContent = dados.origem;

  bloco.append(topo, texto, origem);
  return bloco;
}

async function iniciar() {
  let dados;
  try {
    dados = await carregar();
  } catch (erro) {
    console.error(erro);
    return;
  }

  el('#abertura-resumo').textContent = dados.meta.subtitulo;

  const contar = (valor) => dados.conhecimentos.filter((c) => c.natureza === valor).length;
  el('#portas').replaceChildren(
    ...dados.classificacoes.natureza.valores.map((v) => porta(v, contar(v.valor)))
  );
  ajudaDasPortas(dados);

  const camadas = el('#camadas');
  dados.meta.camadas.forEach((c) => camadas.append(camada(c)));
}

iniciar();
