/**
 * Preenche a tabela de atributos e os tipos de solução na página Sobre.
 */

import { carregar, referenciaCurta } from './dados.js';

const el = (seletor) => document.querySelector(seletor);

async function iniciar() {
  let dados;
  try {
    dados = await carregar();
  } catch (erro) {
    console.error(erro);
    return;
  }

  const atributos = el('#tabela-atributos');
  Object.keys(dados.classificacoes).forEach((chave) => {
    const d = dados.classificacoes[chave];
    const linha = document.createElement('tr');
    const nome = document.createElement('th');
    nome.scope = 'row';
    nome.textContent = d.rotulo;
    const valores = document.createElement('td');
    valores.textContent = d.valores.map((v) => v.valor).join(', ');
    const pergunta = document.createElement('td');
    pergunta.textContent = d.pergunta;
    const ref = document.createElement('td');
    ref.textContent = referenciaCurta(dados, d.referencia) || 'Definido na QP1 da revisão rápida';
    linha.append(nome, valores, pergunta, ref);
    atributos.append(linha);
  });

  const tipos = el('#tabela-tipos');
  const contagem = new Map();
  dados.solucoes.forEach((s) => contagem.set(s.tipo, (contagem.get(s.tipo) || 0) + 1));
  Object.entries(dados.meta.tiposSolucao).forEach(([tipo, descricao]) => {
    const linha = document.createElement('tr');
    const nome = document.createElement('th');
    nome.scope = 'row';
    nome.textContent = tipo;
    const texto = document.createElement('td');
    texto.textContent = descricao;
    const quantidade = document.createElement('td');
    quantidade.className = 'mono';
    quantidade.textContent = contagem.get(tipo) || 0;
    linha.append(nome, texto, quantidade);
    tipos.append(linha);
  });
}

iniciar();
