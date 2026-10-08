/**
 * Liga os módulos anteriores na página do catálogo.
 */

import { carregar, conhecimentoCompleto, vazio } from './dados.js';
import * as filtros from './filtros.js';
import * as lista from './lista.js';
import * as ficha from './ficha.js';

const el = (seletor) => document.querySelector(seletor);

/* O nível não entra, porque agora é a própria trilha. Os dois últimos ainda não
   têm valor registrado e caem no aviso do rodapé. */
const FACETAS = ['natureza', 'dimensao', 'tipoEcos', 'acaoGerencia'];

/* Abaixo desta largura os filtros moram numa folha por cima, em vez de empurrar
   a trilha para fora da tela. */
const ESTREITO = matchMedia('(max-width: 47.99rem)');

let dados = null;
let estado = filtros.estadoVazio();
/* A ordem de navegação da ficha é a ordem filtrada no momento, não a ordem total. */
let visiveis = [];
let idAberto = null;

/** Uma opção de faceta. Botão de verdade, com o estado em aria-pressed. */
function montarOpcao(chave, opcao, contagem, modificador) {
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.className = modificador ? `chip chip--${modificador}` : 'chip';
  botao.dataset.filtro = chave;
  botao.dataset.valor = opcao.valor;
  botao.setAttribute('aria-pressed', 'false');

  const texto = document.createElement('span');
  texto.textContent = opcao.valor;
  botao.append(texto);

  if (contagem !== undefined) {
    const numero = document.createElement('span');
    numero.className = 'chip__contagem';
    numero.textContent = contagem;
    botao.append(numero);
  }

  botao.addEventListener('click', () => {
    estado[chave] = estado[chave].includes(opcao.valor)
      ? estado[chave].filter((v) => v !== opcao.valor)
      : [...estado[chave], opcao.valor];
    atualizar();
  });
  return botao;
}

/** Botão que zera uma faceta inteira. Fica marcado quando nada está escolhido nela. */
function montarOpcaoTodas(chave, rotulo) {
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.className = 'chip chip--todas';
  botao.dataset.filtro = chave;
  botao.textContent = rotulo;
  botao.setAttribute('aria-pressed', 'true');
  botao.addEventListener('click', () => {
    estado[chave] = [];
    atualizar();
  });
  return botao;
}

/**
 * Uma faceta preenchida vira um grupo da grade. Uma faceta ainda sem nenhum
 * valor registrado não vira grupo, devolve null e é anunciada no rodapé.
 */
function montarGrupoDeFiltros(chave) {
  const definicao = dados.classificacoes[chave];
  const contagens = filtros.contar(dados.conhecimentos, chave);
  if (!definicao.valores.some((v) => contagens.get(v.valor))) return null;

  const grupo = document.createElement('fieldset');
  grupo.className = 'filtros__grupo';

  const titulo = document.createElement('legend');
  titulo.className = 'filtros__titulo';
  titulo.textContent = definicao.rotulo;
  grupo.append(titulo);

  const opcoes = document.createElement('div');
  opcoes.className = 'filtros__opcoes';
  /* A natureza é a entrada principal, então ganha o atalho de zerar e a cor da classificação. */
  const principal = chave === 'natureza';
  if (principal) opcoes.append(montarOpcaoTodas(chave, 'Todas'));
  definicao.valores.forEach((opcao) =>
    opcoes.append(
      montarOpcao(
        chave,
        opcao,
        contagens.get(opcao.valor) || 0,
        principal ? lista.classeNatureza(opcao.valor) : null
      )
    )
  );
  grupo.append(opcoes);
  return grupo;
}

/** Uma linha só para as facetas que ainda não têm classificação registrada. */
function anunciarPendentes(rotulos) {
  const aviso = el('#filtros-pendentes');
  aviso.hidden = rotulos.length === 0;
  if (!rotulos.length) return;
  /* Só o primeiro abre a frase em maiúscula. Um rótulo que começa por sigla fica
     como está, para não virar "eCOS". */
  const comecaPorSigla = (t) => t.slice(0, 2) === t.slice(0, 2).toUpperCase();
  const seguinte = (t) => (comecaPorSigla(t) ? t : t.charAt(0).toLowerCase() + t.slice(1));
  const demais = rotulos.slice(1).map(seguinte);
  const nomes = demais.length
    ? `${[rotulos[0], ...demais.slice(0, -1)].join(', ')} e ${demais[demais.length - 1]}`
    : rotulos[0];
  const verbo = rotulos.length > 1 ? 'serão habilitados' : 'será habilitado';
  aviso.textContent = `${nomes} ${verbo} quando a classificação for concluída.`;
}

/** Espelha o estado nos botões. Sem valor, o botão representa a faceta inteira vazia. */
function marcarOpcoes() {
  document.querySelectorAll('[data-filtro]').forEach((botao) => {
    const { filtro, valor } = botao.dataset;
    const ativo = valor ? estado[filtro].includes(valor) : estado[filtro].length === 0;
    botao.setAttribute('aria-pressed', String(ativo));
  });
}

const CURVA_SAIDA = 'cubic-bezier(0.23, 1, 0.32, 1)';
const movimentoReduzido = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Troca de conhecimento sem recarregar o diálogo. O conteúdo entra pelo lado
 * para onde a navegação foi, então anterior e próximo ficam distinguíveis.
 */
function animarTroca(corpo, direcao) {
  if (!direcao || movimentoReduzido()) return;
  corpo.animate(
    [{ opacity: 0, transform: `translateX(${direcao * 10}px)` }, { opacity: 1, transform: 'none' }],
    { duration: 200, easing: CURVA_SAIDA }
  );
}

function abrirFicha(id, direcao = 0) {
  const completo = conhecimentoCompleto(dados, id);
  if (!completo) return;

  const dialogo = el('#dialogo-ficha');
  const corpo = el('#dialogo-ficha-corpo');
  corpo.replaceChildren(ficha.renderizar(dados, completo));
  animarTroca(corpo, direcao);
  el('#dialogo-ficha-id').textContent = `${completo.id} · ${completo.nome}`;
  idAberto = id;
  posicionarNavegacao();
  if (!dialogo.open) dialogo.showModal();
  /* Quem rola é o próprio diálogo, não o corpo, então é nele que o topo é reposto. */
  dialogo.scrollTop = 0;
  sincronizarUrl(id);
}

/** Índice do conhecimento aberto dentro da lista filtrada, ou menos um. */
const posicaoAtual = () => visiveis.findIndex((c) => c.id === idAberto);

function posicionarNavegacao() {
  const indice = posicaoAtual();
  const navegacao = el('#ficha-navegacao');
  const anterior = el('#ficha-anterior');
  const proximo = el('#ficha-proximo');

  /* Aberto por link direto com um filtro que o exclui, não há ordem a seguir. */
  navegacao.hidden = indice === -1;
  if (indice === -1) return;

  el('#ficha-posicao').textContent = `${indice + 1} de ${visiveis.length}`;
  anterior.disabled = indice === 0;
  proximo.disabled = indice === visiveis.length - 1;
}

function irPara(passo) {
  const indice = posicaoAtual();
  if (indice === -1) return;
  const alvo = visiveis[indice + passo];
  if (alvo) abrirFicha(alvo.id, passo);
}

function sincronizarUrl(id) {
  const query = filtros.escreverNaUrl(estado, id);
  /* A âncora da seção é mantida, senão o link compartilhado perde o destino. */
  const url = (query ? `?${query}` : location.pathname) + location.hash;
  history.replaceState(null, '', url);
}

function atualizar() {
  visiveis = filtros.aplicar(dados.conhecimentos, estado);
  lista.renderizar(el('#trilha'), visiveis, dados.classificacoes.nivel.valores, abrirFicha);
  el('#trilha-vazia').hidden = visiveis.length > 0;
  el('#contagem').textContent = `${visiveis.length} de ${dados.conhecimentos.length} conhecimentos`;
  el('#limpar').hidden = !filtros.temFiltroAtivo(estado);
  marcarOpcoes();
  if (idAberto) posicionarNavegacao();
  sincronizarUrl(idAberto);
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
    atualizar();
    el('#busca').focus();
  });
}

/**
 * Em tela estreita o painel de filtros muda de lugar, não de forma. O mesmo
 * elemento é movido para dentro da folha e devolvido ao fluxo quando a tela
 * cresce, então não existe uma segunda cópia dos filtros para manter em dia.
 */
function ligarFolhaDeFiltros() {
  const folha = el('#folha-filtros');
  const corpo = el('#folha-corpo');
  const painel = el('#filtros');
  const lugarOriginal = painel.parentElement;
  const abrir = el('#abrir-filtros');

  const fechar = () => {
    if (folha.open) folha.close();
  };

  function acomodar() {
    if (ESTREITO.matches) {
      corpo.append(painel);
    } else {
      fechar();
      /* Volta para antes da legenda, que é a primeira coisa da trilha. */
      lugarOriginal.insertBefore(painel, el('#legenda'));
    }
  }

  abrir.addEventListener('click', () => {
    folha.showModal();
    abrir.setAttribute('aria-expanded', 'true');
    el('#busca').focus();
  });
  el('#fechar-filtros').addEventListener('click', fechar);
  folha.addEventListener('click', (evento) => {
    if (evento.target === folha) fechar();
  });
  folha.addEventListener('close', () => abrir.setAttribute('aria-expanded', 'false'));
  ESTREITO.addEventListener('change', acomodar);
  acomodar();
}

function ligarDialogo() {
  const dialogo = el('#dialogo-ficha');
  el('#fechar-ficha').addEventListener('click', () => dialogo.close());
  el('#ficha-anterior').addEventListener('click', () => irPara(-1));
  el('#ficha-proximo').addEventListener('click', () => irPara(1));
  dialogo.addEventListener('close', () => {
    idAberto = null;
    sincronizarUrl(null);
  });
  dialogo.addEventListener('click', (evento) => {
    if (evento.target === dialogo) dialogo.close();
  });
}

/**
 * Qualquer falha na partida vira aviso na tela. Sem isto a página fica parada
 * em Carregando, sem trilha e sem dizer o que houve, que foi o que aconteceu
 * quando o navegador serviu uma versão antiga de um módulo junto com o HTML novo.
 */
function avisarFalha(mensagem, erro) {
  console.error(erro);
  const aviso = el('#trilha-vazia');
  if (aviso) {
    aviso.textContent = mensagem;
    aviso.hidden = false;
  }
  const contagem = el('#contagem');
  if (contagem) contagem.textContent = 'não foi possível montar o catálogo';
}

async function iniciar() {
  try {
    dados = await carregar();
  } catch (erro) {
    avisarFalha(
      'Não foi possível carregar os dados do catálogo. Confira se o servidor está no ar e se a página foi aberta pelo endereço dele, por exemplo o IP da máquina quando o acesso vem do celular.',
      erro
    );
    return;
  }

  try {
    montarCatalogo();
  } catch (erro) {
    avisarFalha(
      'O catálogo não pôde ser montado. Se a página acabou de ser atualizada, esvazie o cache do navegador e recarregue. O console tem o erro.',
      erro
    );
  }
}

function montarCatalogo() {
  const parametros = new URLSearchParams(location.search);
  estado = filtros.lerDaUrl(parametros);

  const painel = el('#painel-filtros');
  const pendentes = [];
  FACETAS.forEach((chave) => {
    const grupo = montarGrupoDeFiltros(chave);
    if (grupo) painel.append(grupo);
    else pendentes.push(dados.classificacoes[chave].rotulo);
  });
  anunciarPendentes(pendentes);

  lista.renderizarLegenda(el('#legenda'), dados.classificacoes.natureza.valores);

  ligarBusca();
  ligarLimpar();
  ligarDialogo();
  ligarFolhaDeFiltros();
  atualizar();

  const idInicial = parametros.get('id');
  if (idInicial) abrirFicha(idInicial);
}

iniciar();
