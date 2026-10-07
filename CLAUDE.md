# Catálogo de Conhecimento em ECOS

Aplicação web estática do catálogo, resultado do TCC II. HTML, CSS e JavaScript puro,
sem framework, sem etapa de build e sem dependência instalada. Hospedagem no GitHub Pages.

## Princípio da organização

Cada informação existe em um único lugar e os demais arquivos apontam para ela por identificador.
Uma correção de texto nunca é repetida em vários pontos, o conteúdo muda sem tocar no código e a
identidade visual muda sem tocar no conteúdo.

## Regras que não podem ser quebradas

- Nunca inventar, completar ou reescrever conteúdo dos arquivos em `dados/`. Faltou informação, o
  campo fica vazio e a interface mostra que está pendente
- Nunca escrever conteúdo do catálogo dentro do HTML ou do JavaScript. Tudo vem de `dados/`
- Nunca introduzir framework, bundler, gerenciador de pacotes ou etapa de build
- Nunca usar cor literal fora de `css/tokens.css`. No restante do CSS só variável

## Arquivos de dados

| Arquivo | Conteúdo |
|---|---|
| `dados/conhecimentos.json` | 20 conhecimentos (C01 a C20), com atributos e os identificadores de soluções e estudos |
| `dados/solucoes.json` | 36 soluções (S01 a S36), com tipo segundo Shaw (2003), avaliação quando reportada e os conhecimentos que apoiam |
| `dados/estudos.json` | 18 estudos primários (E01 a E18), com título, autores, ano, país e tipo de ECOS |
| `dados/classificacoes.json` | Vocabulário dos atributos, com rótulo, valores, descrição, pergunta e chave da referência |
| `dados/referencias.json` | Citação completa de cada referência, identificada por chave |
| `dados/meta.json` | Título, fonte, camadas da estrutura e tipos de solução |

A relação entre conhecimento e solução é de muitos para muitos e está registrada nos dois sentidos,
em `conhecimentos[].solucoes` e em `solucoes[].conhecimentos`. Ao mudar uma ponta, mudar a outra.

### Campos ainda pendentes

`tipoEcos` e `acaoGerencia` estão vazios em todos os conhecimentos, e `tipoEcos` está vazio em todos
os estudos. São as atividades pendentes antes do preenchimento. Enquanto estiverem vazios, o filtro
correspondente aparece com o aviso de atributo não preenchido e a ficha mostra "A definir".

`conhecimentos[].relacoesConfirmadas` está `false` porque as soluções foram reunidas por estudo em
comum e ainda não foram confirmadas nos estudos primários. Enquanto for `false`, a ficha mostra o
aviso de relação candidata. Virar `true` conhecimento por conhecimento, conforme a confirmação.

## Páginas

| Arquivo | Função |
|---|---|
| `index.html` | Apresentação, números gerais, entrada pela natureza e mapa das camadas |
| `catalogo.html` | Listagem com busca e filtros, e a ficha aberta em diálogo |
| `sobre.html` | Método de pesquisa e esquemas de classificação |
| `referencias.html` | Estudos primários e referências bibliográficas |

## Módulos

| Arquivo | Responsabilidade |
|---|---|
| `js/dados.js` | Único módulo que lê arquivos. Carrega, guarda em cache e resolve identificadores |
| `js/filtros.js` | Opera sobre listas. Não conhece o DOM |
| `js/lista.js` | Monta os cards da listagem |
| `js/ficha.js` | Monta a ficha de um conhecimento |
| `js/catalogo.js` | Liga os módulos na página do catálogo |
| `js/inicio.js`, `js/sobre.js`, `js/referencias.js` | Preenchem as demais páginas |

Alterar o visual de um card nunca encosta na lógica dos filtros. Os módulos são carregados
nativamente pelo navegador com `type="module"`.

## Estilos

| Arquivo | Conteúdo |
|---|---|
| `css/tokens.css` | Cor, tipografia, espaçamento e medidas como variáveis. Tema claro e escuro |
| `css/base.css` | Reset e elementos básicos |
| `css/componentes.css` | Cabeçalho, etiqueta, filtro, card, ficha, painel e tabela |
| `css/paginas.css` | Ajustes específicos de cada página |

## Convenções de interface

- Mobile primeiro. O card empilha no celular e vira três colunas a partir de 60rem
- A entrada principal do catálogo é a natureza do conhecimento
- Busca e filtros acontecem no cliente e vão para a query string, então o link pode ser compartilhado
- Alvo de toque de no mínimo 44px, rótulo em todo campo, foco visível e contraste mínimo de 4.5 para 1
- `button`, `a` e `input` de verdade. Nunca `role` ou clique em `div`
- Sem sombra e sem canto arredondado. Separação por linha de 1px

## Escrita

- Português do Brasil
- Sem o caractere traço como pontuação
- Sem dois pontos como pontuação
- Tom direto, sem linguagem de marketing

## Rodar localmente

Abrir os arquivos direto pelo navegador faz o carregamento dos dados ser bloqueado pelo protocolo
de arquivo local. É preciso um servidor, por exemplo `python3 -m http.server`, e abrir
`http://localhost:8000`. No GitHub Pages o comportamento é normal.
