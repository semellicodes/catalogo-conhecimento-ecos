/**
 * Transforma um conhecimento em ficha. Não sabe carregar nem filtrar.
 */

import { referenciaCurta, vazio } from './dados.js';
import { classeNatureza } from './lista.js';

const ATRIBUTOS = ['natureza', 'nivel', 'dimensao', 'tipoEcos', 'acaoGerencia'];

function criar(tag, className, texto) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

function secao(titulo, ...filhos) {
  const bloco = criar('section', 'ficha__secao');
  bloco.append(criar('h3', 'ficha__titulo-secao', titulo), ...filhos);
  return bloco;
}

function blocoAtributo(dados, conhecimento, chave) {
  const definicao = dados.classificacoes[chave];
  const bruto = conhecimento[chave];
  const valor = Array.isArray(bruto) ? bruto.join(', ') : bruto;

  const bloco = criar('div', 'atributo');
  bloco.append(criar('p', 'atributo__nome', definicao.rotulo.toLowerCase()));

  if (vazio(bruto)) {
    bloco.append(criar('p', 'atributo__valor', 'A definir'));
    bloco.append(criar('p', 'atributo__ajuda', 'Classificação ainda não registrada na extração.'));
  } else {
    const linha = criar('p', 'atributo__valor', valor);
    if (chave === 'natureza') linha.style.color = `var(--cor-${classeNatureza(valor)})`;
    bloco.append(linha);
    const opcao = definicao.valores.find((v) => v.valor === valor);
    if (opcao && opcao.descricao) bloco.append(criar('p', 'atributo__ajuda', opcao.descricao));
  }

  const ref = referenciaCurta(dados, definicao.referencia);
  if (ref) bloco.append(criar('p', 'atributo__referencia', ref));
  return bloco;
}

function itemRelacionado(id, nome, meta) {
  const item = criar('div', 'item-relacionado');
  item.append(criar('span', 'codigo-id', id));
  const corpo = criar('div');
  corpo.append(criar('p', 'item-relacionado__nome', nome));
  if (meta) corpo.append(criar('p', 'item-relacionado__meta', meta));
  item.append(corpo);
  return item;
}

/** Monta a ficha completa e devolve o elemento pronto para inserir. */
export function renderizar(dados, conhecimento) {
  const raiz = criar('div', 'ficha');

  /* Coluna principal */
  const principal = criar('div');
  principal.append(criar('p', 'codigo-id', conhecimento.id));
  principal.append(criar('h2', 'topo__titulo', conhecimento.nome));
  principal.append(criar('p', 'ficha__descricao', conhecimento.descricao));

  if (!conhecimento.relacoesConfirmadas) {
    principal.append(
      criar(
        'p',
        'aviso',
        'As soluções abaixo são relações candidatas, reunidas por estudo em comum. A confirmação nos estudos primários ainda está em andamento.'
      )
    );
  }

  const listaSolucoes = criar('div');
  conhecimento.solucoesResolvidas.forEach((s) =>
    listaSolucoes.append(
      itemRelacionado(
        s.id,
        s.nome,
        `${s.tipo} · ${s.estudos.join(', ')} · ${s.avaliada ? s.avaliacao : 'sem avaliação reportada'}`
      )
    )
  );
  principal.append(
    secao(
      `Soluções relacionadas (${conhecimento.solucoesResolvidas.length})`,
      conhecimento.solucoesResolvidas.length
        ? listaSolucoes
        : criar('p', 'vazio', 'Nenhuma solução foi extraída dos estudos que identificaram este conhecimento.')
    )
  );

  const trechos = criar('div');
  conhecimento.trechos.filter(Boolean).forEach((t) => trechos.append(criar('blockquote', 'trecho', t)));
  if (trechos.childElementCount) principal.append(secao('Trechos de origem', trechos));

  /* Coluna lateral */
  const lateral = criar('div');
  const painelAtributos = criar('div', 'painel');
  painelAtributos.append(criar('h3', 'ficha__titulo-secao', 'Atributos'));
  ATRIBUTOS.forEach((a) => painelAtributos.append(blocoAtributo(dados, conhecimento, a)));
  lateral.append(painelAtributos);

  if (!vazio(conhecimento.portador) || !vazio(conhecimento.tipoSaber)) {
    const complementares = criar('div', 'painel');
    complementares.append(criar('h3', 'ficha__titulo-secao', 'Atributos complementares'));
    if (!vazio(conhecimento.portador)) {
      const b = criar('div', 'atributo');
      b.append(criar('p', 'atributo__nome', 'portador'), criar('p', 'atributo__valor', conhecimento.portador));
      complementares.append(b);
    }
    if (!vazio(conhecimento.tipoSaber)) {
      const b = criar('div', 'atributo');
      b.append(criar('p', 'atributo__nome', 'tipo de saber'), criar('p', 'atributo__valor', conhecimento.tipoSaber));
      complementares.append(b);
    }
    lateral.append(complementares);
  }

  const painelEvidencias = criar('div', 'painel');
  painelEvidencias.append(criar('h3', 'ficha__titulo-secao', 'Base de evidências'));
  const estudos = criar('ul');
  conhecimento.estudosResolvidos.forEach((e) => {
    const li = criar('li', 'atributo');
    li.append(criar('p', 'atributo__nome', `${e.id} · ${e.ano} · ${e.pais}`));
    li.append(criar('p', 'item-relacionado__nome', e.titulo));
    li.append(criar('p', 'atributo__ajuda', e.autores));
    estudos.append(li);
  });
  painelEvidencias.append(estudos);
  lateral.append(painelEvidencias);

  if (conhecimento.pendencia) {
    const pend = criar('div', 'painel');
    pend.append(criar('h3', 'ficha__titulo-secao', 'Pendência registrada'));
    pend.append(criar('p', 'atributo__ajuda', conhecimento.pendencia));
    lateral.append(pend);
  }

  raiz.append(principal, lateral);
  return raiz;
}
