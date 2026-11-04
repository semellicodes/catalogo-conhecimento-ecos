import { carregar } from './dados.js?v=20261104-36';

const el = (seletor) => document.querySelector(seletor);

async function iniciar() {
  if (!el('#sobre-conhecimentos')) return;

  try {
    const dados = await carregar();
    el('#sobre-conhecimentos').textContent = String(dados.conhecimentos.length);
    el('#sobre-estudos').textContent = String(dados.meta.totalEstudos);
  } catch (erro) {
    console.error(erro);
  }
}

iniciar();
