import { carregar, citacaoDaReferencia, urlDaReferencia } from './dados.js?v=20261106-8';
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

    const celulas = [
  e.id,
  e.titulo,
  e.autores,
  e.ano,
  e.pais
];

    celulas.forEach((valor, indice) => {
      const celula = document.createElement(
        indice === 0 ? 'th' : 'td'
      );
      if (indice === 0) {
        celula.scope = 'row';
        celula.className = 'mono';
      }
      if (indice === 1 && e.url) {
        const link = document.createElement('a');

        link.className = 'estudo__link-publicacao';
        link.href = e.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = valor;
        celula.append(link);
      } else {
        celula.textContent = valor;
      }
      linha.append(celula);
    });
    corpo.append(linha);
  });

  const adicionarReferencia = (lista, chave) => {
    const item = document.createElement('li');
    item.id = `referencia-${chave}`;
    item.append(citacaoDaReferencia(dados, chave));
    const url = urlDaReferencia(dados, chave);
    if (url) {
      const link = document.createElement('a');
      link.className = 'lista-referencias__link';
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = url.replace(/^https?:\/\//, '');
      item.append(' ', link);
    }

    lista.append(item);
  };

  const lista = el('#lista-referencias');

  Object.keys(dados.referencias)
    .sort((a, b) =>
      citacaoDaReferencia(dados, a)
        .localeCompare(citacaoDaReferencia(dados, b), 'pt-BR')
    )
    .forEach((chave) => adicionarReferencia(lista, chave));
}

iniciar();
