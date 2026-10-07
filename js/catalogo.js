/**
 * Liga os módulos anteriores na página do catálogo.
 */

import { carregar, conhecimentoCompleto, vazio } from './dados.js';
import * as filtros from './filtros.js';
import * as lista from './lista.js';
import * as ficha from './ficha.js';

const el = (seletor) => document.querySelector(seletor);

let dados = null;
let estado = filtros.estadoVazio();

function montarGrupoDeFiltros(chave) {
  const definicao = dados.classificacoes[chave];
  const contagens = filtros.contar(dados.conhecimentos, chave);
  const preenchido = definicao.valores.some((v) => contagens.get(v.valor));

  const grupo = document.createElement('fieldset');
  grupo.className = 'filtros__grupo';

  const titulo = document.createElement('legend');
  titulo.className = 'filtros__titulo';
  titulo.textContent = definicao.rotulo;
  grupo.append(titulo);

  if (!preenchido) {
    const aviso = document.createElement('p');
    aviso.className = 'filtros__pendente';
    aviso.textContent = 'Atributo ainda não preenchido na extração.';
    grupo.append(aviso);
    return grupo;
  }

  definicao.valores.forEach((opcao) => {
    const rotulo = document.createElement('label');
    rotulo.className = 'filtros__opcao';

    const caixa = document.createElement('input');
    caixa.type = 'checkbox';
    caixa.value = opcao.valor;
    caixa.checked = estado[chave].includes(opcao.valor);
    caixa.addEventListener('change', () => {
      estado[chave] = caixa.checked
        ? [...estado[chave], opcao.valor]
        : estado[chave].filter((v) => v !== opcao.valor);
      atualizar();
    });

    const texto = document.createElement('span');
    texto.className = 'filtros__rotulo';
    texto.append(caixa, document.createTextNode(opcao.valor));

    const contagem = document.createElement('span');
    contagem.className = 'filtros__contagem';
    contagem.textContent = contagens.get(opcao.valor) || 0;

    rotulo.append(texto, contagem);
    grupo.append(rotulo);
  });

  return grupo;
}

function abrirFicha(id) {
  const completo = conhecimentoCompleto(dados, id);
  if (!completo) return;

  const dialogo = el('#dialogo-ficha');
  const corpo = el('#dialogo-ficha-corpo');
  corpo.replaceChildren(ficha.renderizar(dados, completo));
  el('#dialogo-ficha-id').textContent = `${completo.id} · ${completo.nome}`;
  dialogo.showModal();
  corpo.scrollTop = 0;
  sincronizarUrl(id);
}

function sincronizarUrl(idAberto) {
  const query = filtros.escreverNaUrl(estado, idAberto);
  const url = query ? `?${query}` : location.pathname;
  history.replaceState(null, '', url);
}

function atualizar() {
  const visiveis = filtros.aplicar(dados.conhecimentos, estado);
  lista.renderizar(el('#lista-conhecimentos'), visiveis, abrirFicha);
  el('#contagem').textContent = `${visiveis.length} de ${dados.conhecimentos.length} conhecimentos`;
  el('#limpar').hidden = !filtros.temFiltroAtivo(estado);
  sincronizarUrl(null);
}

function ligarBusca() {
  const campo = el('#busca');
  campo.value = estado.busca;
  let temporizador;
  campo.addEventListener('input', () => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => {
      estado.busca = campo.value;
      atualizar();
    }, 150);
  });
}

function ligarLimpar() {
  el('#limpar').addEventListener('click', () => {
    estado = filtros.estadoVazio();
    el('#busca').value = '';
    el('#painel-filtros')
      .querySelectorAll('input[type="checkbox"]')
      .forEach((c) => {
        c.checked = false;
      });
    atualizar();
  });
}

function ligarDialogo() {
  const dialogo = el('#dialogo-ficha');
  el('#fechar-ficha').addEventListener('click', () => dialogo.close());
  dialogo.addEventListener('close', () => sincronizarUrl(null));
  dialogo.addEventListener('click', (evento) => {
    if (evento.target === dialogo) dialogo.close();
  });
}

async function iniciar() {
  try {
    dados = await carregar();
  } catch (erro) {
    el('#lista-conhecimentos').replaceWith(
      Object.assign(document.createElement('p'), {
        className: 'vazio',
        textContent:
          'Não foi possível carregar os dados do catálogo. Ao abrir as páginas localmente, rode um servidor, por exemplo python3 -m http.server.'
      })
    );
    console.error(erro);
    return;
  }

  const parametros = new URLSearchParams(location.search);
  estado = filtros.lerDaUrl(parametros);

  const painel = el('#painel-filtros');
  filtros.ATRIBUTOS_FILTRAVEIS.forEach((chave) => painel.append(montarGrupoDeFiltros(chave)));

  ligarBusca();
  ligarLimpar();
  ligarDialogo();
  atualizar();

  const idInicial = parametros.get('id');
  if (idInicial) abrirFicha(idInicial);
}

iniciar();
