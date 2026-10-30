import { carregar } from './dados.js';

const el = (seletor) => document.querySelector(seletor);

async function iniciar() {
  if (!el('#sobre-conhecimentos')) return;

  try {
    const dados = await carregar();
    const atributos = ['natureza', 'nivel', 'dimensao'];
    el('#sobre-conhecimentos').textContent = String(dados.conhecimentos.length);
    el('#sobre-estudos').textContent = String(dados.meta.totalEstudos);
    el('#sobre-atributos').textContent = String(atributos.length);
    el('#sobre-fonte').textContent = dados.meta.fonte;
  } catch (erro) {
    console.error(erro);
    el('#sobre-fonte').textContent = 'Não foi possível carregar os dados da pesquisa.';
  }
}

iniciar();
