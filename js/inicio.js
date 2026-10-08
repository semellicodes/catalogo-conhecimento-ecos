/**
 * Preenche os números da abertura e as camadas da seção de estrutura.
 */

import { carregar } from './dados.js';

const el = (seletor) => document.querySelector(seletor);

function numero(valor, rotulo) {
  const bloco = document.createElement('div');
  bloco.className = 'numero';
  const v = document.createElement('p');
  v.className = 'numero__valor mono';
  v.textContent = valor;
  const r = document.createElement('p');
  r.className = 'numero__rotulo';
  r.textContent = rotulo;
  bloco.append(v, r);
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
    /* Sem isto a faixa fica com os divisores e nenhum número, e as camadas com
       um buraco, sem nada na tela explicando por quê. */
    const aviso = document.createElement('p');
    aviso.className = 'numero__rotulo';
    aviso.textContent = 'Os números não carregaram.';
    el('#numeros').replaceChildren(aviso);
    return;
  }

  const avaliadas = dados.solucoes.filter((s) => s.avaliada).length;
  el('#numeros').replaceChildren(
    numero(dados.conhecimentos.length, 'conhecimentos catalogados'),
    numero(dados.solucoes.length, 'soluções relacionadas'),
    numero(avaliadas, 'soluções com avaliação reportada'),
    numero(dados.meta.totalEstudos, 'estudos primários')
  );

  const camadas = el('#camadas');
  dados.meta.camadas.forEach((c) => camadas.append(camada(c)));
}

iniciar();
