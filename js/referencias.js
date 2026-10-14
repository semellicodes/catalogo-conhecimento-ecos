/**
 * Preenche a lista de estudos primários e as referências bibliográficas.
 */

import { carregar } from './dados.js';

const el = (seletor) => document.querySelector(seletor);

async function iniciar() {
  let dados;
  try {
    dados = await carregar();
  } catch (erro) {
    console.error(erro);
    return;
  }

  const corpo = el('#tabela-estudos');
  dados.estudos.forEach((e) => {
    const linha = document.createElement('tr');
    /* O tipo de ECOS é lista, porque um estudo pode examinar mais de um. Vazio,
       a célula mostra que está a definir, como nos demais campos pendentes. */
    const tipos = e.tipoEcos.length ? e.tipoEcos.join(', ') : 'A definir';
    const celulas = [e.id, e.titulo, e.autores, e.ano, e.pais, tipos];
    celulas.forEach((valor, indice) => {
      const celula = document.createElement(indice === 0 ? 'th' : 'td');
      if (indice === 0) {
        celula.scope = 'row';
        celula.className = 'mono';
      }
      celula.textContent = valor;
      linha.append(celula);
    });
    corpo.append(linha);
  });

  const lista = el('#lista-referencias');
  Object.keys(dados.referencias)
    .sort((a, b) => dados.referencias[a].localeCompare(dados.referencias[b], 'pt-BR'))
    .forEach((chave) => {
      const item = document.createElement('li');
      item.textContent = dados.referencias[chave];
      lista.append(item);
    });
}

iniciar();
