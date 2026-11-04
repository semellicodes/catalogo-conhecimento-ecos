/**
 * Preenche a lista de estudos primários e as referências bibliográficas.
 */

import { carregar, temVerbete, citacaoDaReferencia, urlDaReferencia } from './dados.js?v=20261104-63';

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

  /* As que sustentam os conceitos e os esquemas do catálogo, na ordem em que a
     seção Estrutura as apresenta. As três primeiras sustentam a definição de
     conhecimento em ECOS, no Ponto de Partida. */
  const referenciasConceituais = [
    'davenport1998', 'seichter2010', 'viana2015',
    'nonaka1997', 'alavi2001', 'johnson2020', 'kauschinger2021',
    'santos2011', 'santos2012', 'manikas2016',
    'kauschinger2024', 'kauschinger2023', 'zaim2019',
    'cartaxo2018', 'cartaxo2020', 'charmaz2006'
  ];

  /* Quem tem DOI ou publicação oficial aberta ganha o endereço no fim do
     verbete, para a citação da Estrutura levar à obra e não só à âncora. */
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

  const listaConceitual = el('#lista-referencias-conceituais');
  referenciasConceituais.forEach((chave) => adicionarReferencia(listaConceitual, chave));

  const lista = el('#lista-referencias');
  Object.keys(dados.referencias)
    .filter((chave) => temVerbete(chave) && !referenciasConceituais.includes(chave))
    .sort((a, b) => citacaoDaReferencia(dados, a).localeCompare(citacaoDaReferencia(dados, b), 'pt-BR'))
    .forEach((chave) => adicionarReferencia(lista, chave));
}

iniciar();
