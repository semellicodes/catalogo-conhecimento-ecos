/**
 * Liga os módulos anteriores na página do catálogo.
 */

import { carregar, conhecimentoCompleto } from './dados.js?v=20261106-8';
import * as filtros from './filtros.js?v=20261106-8';
import * as lista from './lista.js?v=20261106-8';
import * as ficha from './ficha.js?v=20261106-8';

const el = (seletor) => document.querySelector(seletor);


/* Ícones das classificações do catálogo */
const ICONES_FILTROS = {
  nivel: [
    'M12 2 2 7l10 5 10-5-10-5Z',
    'm2 12 10 5 10-5',
    'm2 17 10 5 10-5'
  ],
  dimensao: [
    'M12 2 3 7v10l9 5 9-5V7l-9-5Z',
    'm3 7 9 5 9-5',
    'M12 12v10'
  ],
  Produto: [
    'M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z',
    'm3.3 7 8.7 5 8.7-5',
    'M12 22V12'
  ],
  Plataforma: [
    'm12 2 9 5-9 5-9-5 9-5Z',
    'm3 12 9 5 9-5',
    'm3 17 9 5 9-5'
  ],
  Ecossistema: [
    'M12 3v6',
    'M5 21v-6',
    'M19 21v-6',
    'M5 15 12 9l7 6',
    'M10 3a2 2 0 1 0 4 0a2 2 0 1 0-4 0',
    'M3 19a2 2 0 1 0 4 0a2 2 0 1 0-4 0',
    'M17 19a2 2 0 1 0 4 0a2 2 0 1 0-4 0'
  ],
  'Técnica': [
    'M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8',
    'M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.8 1.8-.06-.06A1.7 1.7 0 0 0 16 18.4a1.7 1.7 0 0 0-1 1.56V21h-3v-1.04A1.7 1.7 0 0 0 10 18.4a1.7 1.7 0 0 0-1.88.34l-.06.06-1.8-1.8.06-.06A1.7 1.7 0 0 0 6.6 15a1.7 1.7 0 0 0-1.56-1H4v-3h1.04A1.7 1.7 0 0 0 6.6 9a1.7 1.7 0 0 0-.34-1.88L6.2 7.06l1.8-1.8.06.06A1.7 1.7 0 0 0 10 5.6a1.7 1.7 0 0 0 1-1.56V3h3v1.04A1.7 1.7 0 0 0 16 5.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 1.8 1.8-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.56 1H22v3h-1.04A1.7 1.7 0 0 0 19.4 15Z'
  ],
  'Negócio': [
    'M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12H3V7Z',
    'M9 5V3h6v2',
    'M3 12h18',
    'M10 12v2h4v-2'
  ],
  'Social': [
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
    'M9 7a4 4 0 1 0 0 8a4 4 0 1 0 0-8',
    'M22 21v-2a4 4 0 0 0-3-3.87',
    'M16 3.13a4 4 0 0 1 0 7.75'
  ]
};

function criarIconeFiltro(nome) {
  const caminhos = ICONES_FILTROS[nome];
  if (!caminhos) return null;

  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');

  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.7');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');

  caminhos.forEach((d) => {
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', d);
    svg.append(path);
  });

  return svg;
}


/* A natureza é a entrada principal. Nível e dimensão refinam a lista. */
const FACETAS = ['natureza', 'nivel', 'dimensao'];

/* Abaixo desta largura os filtros moram numa folha por cima, em vez de empurrar
   os cartões para fora da tela. */
const ESTREITO = matchMedia('(max-width: 47.99rem)');

let dados = null;
let estado = filtros.estadoVazio();
/* A ordem das naturezas e as estações saem da contagem sobre o catálogo inteiro,
   uma vez só, senão filtrar reordenaria as estações a cada clique. */
let ordemDasNaturezas = [];
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

const icone = chave === 'natureza'
  ? null
  : criarIconeFiltro(opcao.valor);

if (icone) botao.append(icone);
botao.append(texto);

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
 * Uma faceta preenchida vira um grupo, com o rótulo ao lado das pastilhas e não
 * acima delas. Uma faceta sem nenhum valor registrado não vira grupo.
 *
 * O grupo é div com role de grupo, e não fieldset, porque legend dentro de
 * contêiner flex ainda não se comporta igual em todo navegador, e aqui o rótulo
 * precisa ficar na mesma linha das pastilhas.
 *
 * A natureza divide a primeira linha com a busca, e ali o rótulo escrito não
 * caberia sem empurrar as pastilhas para a linha de baixo. Nesse caso ele vira
 * rótulo acessível do grupo, então quem usa leitor de tela continua ouvindo de
 * que faceta são as pastilhas.
 */
function montarGrupoDeFiltros(chave, rotuloVisivel = true) {
  const definicao = dados.classificacoes[chave];
  const contagens = filtros.contar(dados.conhecimentos, chave);
  if (!definicao.valores.some((v) => contagens.get(v.valor))) return null;

  const grupo = document.createElement('div');
  grupo.className = 'filtros__grupo';
  grupo.setAttribute('role', 'group');

  if (rotuloVisivel) {
    const titulo = document.createElement('p');
    titulo.className = 'filtros__titulo';
    titulo.id = `filtro-rotulo-${chave}`;
titulo.textContent = definicao.rotulo;

const icone = criarIconeFiltro(chave);
if (icone) titulo.prepend(icone);

grupo.setAttribute('aria-labelledby', titulo.id);
grupo.append(titulo);
  } else {
    grupo.setAttribute('aria-label', definicao.rotulo);
  }

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

/** Espelha o estado nos botões. Sem valor, o botão representa a faceta inteira vazia. */
function marcarOpcoes() {
  document.querySelectorAll('[data-filtro]').forEach((botao) => {
    const { filtro, valor } = botao.dataset;
    const ativo = valor ? estado[filtro].includes(valor) : estado[filtro].length === 0;
    botao.setAttribute('aria-pressed', String(ativo));
  });
}

const movimentoReduzido = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function tokenDeMovimento(nome) {
  return getComputedStyle(document.documentElement).getPropertyValue(nome).trim();
}

/**
 * Troca de conhecimento sem recarregar o diálogo. O conteúdo entra pelo lado
 * para onde a navegação foi, então anterior e próximo ficam distinguíveis.
 */
function animarTroca(corpo, direcao) {
  if (!direcao || movimentoReduzido()) return;
  const deslocamento = tokenDeMovimento('--deslocamento-troca-ficha');
  const duracao = Number.parseFloat(tokenDeMovimento('--dur-troca-ficha'));
  const sinal = direcao > 0 ? '' : '-';
  corpo.animate(
    [{ opacity: 0, transform: `translateX(${sinal}${deslocamento})` }, { opacity: 1, transform: 'none' }],
    { duration: duracao, easing: tokenDeMovimento('--curva-saida'), fill: 'both' }
  );
}

function mostrarFicha(dialogo) {
  dialogo.classList.add('dialogo-ficha--entrando');

  /* Bloqueia a rolagem da página atrás da ficha. */
  document.documentElement.classList.add('ficha-aberta');

  dialogo.showModal();

  /* Preserva o foco sem deslocar a página. */
  dialogo.focus({ preventScroll: true });

  requestAnimationFrame(() => {
    dialogo.classList.remove('dialogo-ficha--entrando');
  });
}

function abrirFicha(id, direcao = 0) {
  const completo = conhecimentoCompleto(dados, id);
  if (!completo) return;

  const dialogo = el('#dialogo-ficha');
  const corpo = el('#dialogo-ficha-corpo');
  corpo.replaceChildren(ficha.renderizar(dados, completo));
  animarTroca(corpo, direcao);
  el('#dialogo-ficha-id').textContent = completo.id;

/* Tudo que identifica o conhecimento fica no topo parado,
   mantendo o contexto da ficha durante a rolagem. */
const selo = el('#dialogo-ficha-natureza');
selo.className = `etiqueta etiqueta--${lista.classeNatureza(completo.natureza)}`;
selo.textContent = completo.natureza;

el('#dialogo-ficha-nome').textContent = completo.nome;

/* Atualiza e recolhe a descrição ao trocar de conhecimento */
const descricao = el('#dialogo-ficha-descricao');
const botaoExpandir = el('#dialogo-ficha-expandir');

descricao.textContent = completo.descricao;
descricao.classList.remove('ficha__descricao--expandida');

botaoExpandir.setAttribute('aria-expanded', 'false');
el('#dialogo-ficha-expandir-texto').textContent = 'Mostrar mais';

dialogo.setAttribute('aria-label', `${completo.id} · ${completo.nome}`);

idAberto = id;
posicionarNavegacao();

if (!dialogo.open) mostrarFicha(dialogo);

/* Quem rola é o corpo, pois topo e rodapé permanecem fixos. */
corpo.scrollTop = 0;
sincronizarUrl(id);
}

/* Expande e recolhe a descrição da ficha no celular */
document.addEventListener('click', (evento) => {
const botao = evento.target instanceof Element
  ? evento.target.closest('#dialogo-ficha-expandir')
  : null;
  if (!botao) return;

  const descricao = document.getElementById('dialogo-ficha-descricao');
  if (!descricao) return;

  const expandida = descricao.classList.toggle(
    'ficha__descricao--expandida'
  );

  botao.setAttribute('aria-expanded', String(expandida));

  const texto = document.getElementById(
    'dialogo-ficha-expandir-texto'
  );

  if (texto) {
    texto.textContent = expandida ? 'Mostrar menos' : 'Mostrar mais';
  }
});

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
  visiveis = filtros.ordenar(
    filtros.aplicar(dados.conhecimentos, estado),
    ordemDasNaturezas
  );
  lista.renderizar(el('#lista'), visiveis, abrirFicha);
  el('#lista-vazia').hidden = visiveis.length > 0;
  el('#contagem').textContent =
    `${visiveis.length} ${visiveis.length === 1 ? 'conhecimento encontrado' : 'conhecimentos encontrados'}`;
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
      /* Volta para antes dos cartões, que é o que vem logo depois dos filtros. */
      lugarOriginal.insertBefore(painel, el('#lista'));
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
  const ajuda = el('#dialogo-ajuda');
  el('#fechar-ficha').addEventListener('click', () => dialogo.close());
  el('#fechar-ajuda').addEventListener('click', () => ajuda.close());
  ajuda.addEventListener('click', (evento) => {
    if (evento.target === ajuda) ajuda.close();
  });
  el('#ficha-anterior').addEventListener('click', () => irPara(-1));
  el('#ficha-proximo').addEventListener('click', () => irPara(1));
dialogo.addEventListener('close', () => {
  /* Libera a rolagem da página ao fechar a ficha */
  document.documentElement.classList.remove('ficha-aberta');

  idAberto = null;
  sincronizarUrl(null);
});
  dialogo.addEventListener('click', (evento) => {
    if (evento.target === dialogo) dialogo.close();
  });
}

/**
 * Qualquer falha na partida vira aviso na tela. Sem isto a página fica parada
 * em Carregando, sem cartão e sem dizer o que houve, que foi o que aconteceu
 * quando o navegador serviu uma versão antiga de um módulo junto com o HTML novo.
 */
function avisarFalha(mensagem, erro) {
  console.error(erro);
  const aviso = el('#lista-vazia');
  if (aviso) {
    aviso.textContent = mensagem;
    aviso.hidden = false;
  }
  const contagem = el('#contagem');
  if (contagem) contagem.textContent = 'não foi possível montar o catálogo';
}

async function iniciar() {
  try {
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
  } finally {
    /* Se os dados ou a montagem falharem, os filtros continuam visíveis no
       fluxo original; a proteção contra a oscilação nunca pode prendê-los. */
    el('#catalogo')?.dataset.catalogoPronto = '';
  }
}

function montarCatalogo() {
  const parametros = new URLSearchParams(location.search);
  estado = filtros.lerDaUrl(parametros);

  const painel = el('#painel-filtros');
  FACETAS.forEach((chave) => {
    /* A natureza sobe para a linha da busca, porque é a entrada principal. */
    const principal = chave === 'natureza';
    const grupo = montarGrupoDeFiltros(chave, !principal);
    if (!grupo) return;
    (principal ? el('#filtro-natureza') : painel).append(grupo);
  });

  ordemDasNaturezas = dados.classificacoes.natureza.valores.map(({ valor }) => valor);

  ligarBusca();
  ligarLimpar();
  ligarDialogo();
  ligarFolhaDeFiltros();
  atualizar();

  const idInicial = parametros.get('id');
  if (idInicial) abrirFicha(idInicial);
}

iniciar();
