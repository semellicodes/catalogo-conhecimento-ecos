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
  dados.meta.camadas.forEach((c) => {
    const bloco = document.createElement('article');
    bloco.className = 'camada';
    bloco.innerHTML = '';
    const n = document.createElement('p');
    n.className = 'camada__n';
    n.textContent = `0${c.n} · CAMADA`;
    const nome = document.createElement('h3');
    nome.className = 'camada__nome';
    nome.textContent = c.nome;
    const texto = document.createElement('p');
    texto.className = 'camada__texto';
    texto.textContent = c.conteudo;
    const origem = document.createElement('p');
    origem.className = 'camada__origem';
    origem.textContent = c.origem;
    bloco.append(n, nome, texto, origem);
    camadas.append(bloco);
  });

}

iniciar();
