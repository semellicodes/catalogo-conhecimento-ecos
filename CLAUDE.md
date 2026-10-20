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
| `dados/conhecimentos.json` | 20 conhecimentos (C01 a C20), com atributos, os identificadores de soluções, desafios e estudos, e a evidência de cada relação |
| `dados/solucoes.json` | 36 soluções (S01 a S36), com tipo segundo Shaw (2003), avaliação quando reportada e os conhecimentos que apoiam |
| `dados/desafios.json` | 17 desafios (D01 a D17), com o texto, os estudos e os conhecimentos que os citam |
| `dados/estudos.json` | 18 estudos primários (E01 a E18), com título, autores, ano, país e a lista de tipos de ECOS que o estudo observou |
| `dados/classificacoes.json` | Vocabulário dos atributos, com rótulo, valores, descrição, pergunta e chave da referência |
| `dados/referencias.json` | Citação completa de cada referência, identificada por chave |
| `dados/meta.json` | Título, fonte, camadas da estrutura e tipos de solução |

A relação entre conhecimento e solução é de muitos para muitos e está registrada nos dois sentidos,
em `conhecimentos[].solucoes` e em `solucoes[].conhecimentos`. Ao mudar uma ponta, mudar a outra.

`conhecimentos[].evidencia` guarda, por identificador de desafio, o estudo que sustenta aquela
relação, o motivo e o trecho literal do artigo. O trecho existe em poucos pares, então o campo pode
vir vazio e a ficha só mostra o que existe. Esses textos são literais do artigo e da planilha de
conferência, nunca reescritos.

A evidência das 56 relações de solução foi retirada daqui e guardada em
`origem/evidencia-solucoes.json`, quando a solução saiu da ficha. `conhecimentos[].solucoes`
continua, porque é a outra ponta da relação que o Explorar usa.

`origem/` guarda o insumo da pesquisa, não dado que o site carrega. Nenhum módulo lê essa pasta.
Está lá `relacoes-confirmadas.json`, `evidencia-solucoes.json` e `gerencia-conhecimento.json`, este
último já fundido em `conhecimentos.json`.

### Campos ainda pendentes

`tipoEcos` e `acaoGerencia` estão vazios em todos os conhecimentos, e `tipoEcos` está vazio em todos
os estudos.

`quemPossui`, `quemPrecisa` e `comoGerenciar` estão preenchidos nos vinte, texto literal da planilha
de extração, e são o que o bloco de gerência da ficha mostra. A origem está em
`origem/gerencia-conhecimento.json`.

`portador` e `tipoSaber` continuam vazios nos vinte e não aparecem em tela nenhuma. São anteriores
aos três campos acima e podem estar sobrando. Não apagar sem confirmar. São as atividades pendentes antes do preenchimento. Enquanto estiverem vazios, o filtro
correspondente aparece com o aviso de atributo não preenchido.

Existem dois campos de tipo de ECOS, com papéis separados. Não é a mesma informação em dois lugares.

`conhecimentos[].tipoEcos` diz em que ecossistemas **aquele conhecimento** foi observado. É o que a
ficha lê. Enquanto estiver vazio, as três caixas aparecem apagadas e o bloco diz que a classificação
está pendente.

`estudos[].tipoEcos` diz que tipos de ecossistema **aquele estudo** examinou, e é lista porque um
estudo sozinho pode comparar mais de um, como o E09, que olha um aberto, um fechando e um fechado.
Aparece só na tabela de estudos, como dado do estudo.

Um nunca é somado para dentro do outro. Um estudo que compara três ecossistemas não autoriza afirmar
que o conhecimento tirado dele apareceu nos três, e cada classificação ainda vai precisar de
justificativa escrita.

`justificativaClassificacao` está vazio nos vinte. Quando tiver texto, a ficha mostra o item
"Por que essa classificação?" dentro do bloco de classificação. Vazio, o item não aparece.

`conhecimentos[].relacoesConfirmadas` é `true` nos vinte. Os 138 pares candidatos foram conferidos
contra os artigos primários e sobraram 78, sendo 56 de solução e 22 de desafio. O que não se sustentou
no artigo saiu dos dois sentidos da relação.

Os 22 pares de desafio estão em `conhecimentos[].desafios` e, no outro sentido, em
`desafios[].conhecimentos`. D05, D12 e D16 não se ligam a nenhum conhecimento, porque vêm de estudos
sem conhecimento extraído. Eles não aparecem em ficha nenhuma, e é por isso que o Explorar
lista os dezessete, não só os ligados.

Sete soluções também não se ligam a nenhum conhecimento, `S02, S03, S04, S23, S27, S28` e `S36`.
Elas continuam em `solucoes.json` porque o 36 é resultado publicado da revisão, e aparecem no
Explorar como as demais, só sem a lista de conhecimentos.

## Páginas

| Arquivo | Função |
|---|---|
| `index.html` | Página única com seções ancoradas, `#inicio` com a faixa de abertura e a tarja de números, `#entrar` com as portas por natureza, `#estrutura` com a lógica de camadas, `#catalogo` com busca, filtros, a grade de cartões e a ficha em diálogo, e `#contato` |
| `catalogo.html` | Só redireciona para `index.html#catalogo`, preservando a busca. Existe para os links antigos não quebrarem |
| `explorar.html` | Glossário dos atributos com a referência de cada esquema, as 36 soluções e os 17 desafios, cada um com os conhecimentos ligados |
| `sobre.html` | Método de pesquisa. As tabelas de vocabulário saíram para o Explorar |
| `referencias.html` | Estudos primários e referências bibliográficas |

## Módulos

| Arquivo | Responsabilidade |
|---|---|
| `js/dados.js` | Único módulo que lê arquivos. Carrega, guarda em cache e resolve identificadores |
| `js/filtros.js` | Filtra e ordena listas. Não conhece o DOM |
| `js/lista.js` | Monta os cards do catálogo |
| `js/ficha.js` | Monta a ficha de um conhecimento |
| `js/catalogo.js` | Liga os módulos na seção `#catalogo`, inclusive o anterior e o próximo da ficha |
| `js/navegacao.js` | Marca o item do cabeçalho conforme a seção visível, com `IntersectionObserver` |
| `js/listagem.js` | Monta um item de listagem. Não lê arquivo e não sabe de qual lista veio |
| `js/explorar.js` | Preenche o Explorar, glossário, soluções e desafios. Item sem conhecimento ligado aparece igual, só sem a lista |
| `js/inicio.js` | Preenche o resumo da abertura, a tarja de números, as portas por natureza e as camadas |
| `js/referencias.js` | Preenche a página de referências |
| `js/tema.js` | Alterna claro e escuro, grava em `localStorage` na chave `tema` e monta o botão do cabeçalho |

Alterar o visual de um card nunca encosta na lógica dos filtros. Os módulos são carregados
nativamente pelo navegador com `type="module"`.

## Estilos

| Arquivo | Conteúdo |
|---|---|
| `css/tokens.css` | Cor, tipografia, espaçamento, medida, raio, sombra e movimento como variáveis. Tema claro e escuro |
| `css/base.css` | Reset e elementos básicos |
| `css/componentes.css` | Cabeçalho, etiqueta, filtro, card, ficha, painel e tabela |
| `css/paginas.css` | Ajustes específicos de cada página |

## Pastas

| Pasta | Conteúdo |
|---|---|
| `dados/` | Os seis arquivos que o site carrega |
| `origem/` | Insumo da pesquisa, não carregado por nenhum módulo |
| `imagens/` | Retratos da seção de contato |

## Convenções de interface

- Mobile primeiro. A grade de cards é uma coluna no celular, duas a partir de 48rem e três a partir de 76rem
- O card mostra o identificador no topo e o selo da natureza epistemológica à direita. Abaixo, o
  nome em título, uma prévia visual de até três linhas da descrição e um link "Ver ficha completa"
  no pé. A ficha preserva a descrição completa. A dimensão não aparece no card, só na ficha
- Quem abre a ficha é o link do pé, não o cartão inteiro. Cartão clicável com botão dentro é alvo
  dentro de alvo
- A faixa de abertura compõe em duas colunas no desktop. À esquerda ficam o olho KM4SECO, título,
  resumo de `meta.subtitulo` e o botão Entrar no catálogo. À direita, uma peça visual abstrata
  original em tom verde, com os três números integrados em colunas de mesma largura. No celular, a
  peça visual desce abaixo do texto. Abaixo da faixa, as portas de entrada por natureza são cartões
  com a contagem, a descrição do vocabulário e o link para o catálogo já filtrado
- Não existe legenda de cores da natureza. A cor voltou ao cartão pelo selo, mas o selo traz o nome
  escrito dentro dele, então não há cor para decifrar. Legenda só faria falta se a natureza voltasse
  a ser só um ponto colorido
- A navegação do cabeçalho mistura âncora da própria página e link de página. As seções usam
  `scroll-margin-top` por causa do cabeçalho fixo, e a rolagem suave respeita `prefers-reduced-motion`
- A seção de contato existe só na inicial. As outras páginas apontam para `index.html#contato`, em
  vez de repetir o bloco, porque é conteúdo e não navegação
- Os cartões do catálogo vêm agrupados por natureza epistemológica, pela ordenação, sem cabeçalho
  separando um grupo do outro. A sequência dos grupos vem da ordem em
  `classificacoes.json`, da maior quantidade para a menor, hoje Explícito, Tácito-cognitivo e
  Tácito-técnico. Dentro do grupo a ordem é por identificador, e a mesma sequência vale para o
  anterior e o próximo da ficha
- A contagem de cada natureza fica nos filtros e nas portas da abertura, e a descrição fica no
  glossário do Explorar. Por isso o grupo não precisa de cabeçalho repetindo as duas
- O diálogo da ficha tem 760px de largura e 86% da altura da janela. Topo e rodapé ficam parados e
  só o miolo rola. O topo leva o identificador, o selo da natureza, o fechar em ✕ redondo, o nome e
  a descrição, para quem desce até os estudos continuar vendo de qual conhecimento é a ficha
- O miolo que rola usa `--cor-miolo`, um tom além do fundo da página, para manter a ficha como uma
  superfície distinta do conteúdo que ficou atrás dela
- A ordem dos blocos é classificação, exemplos de ecossistema, gerência do conhecimento e as abas
- Natureza, nível e dimensão aparecem como rótulo em cima e valor embaixo, em três colunas no
  desktop e empilhados no celular. Já foram caixas e deixaram de ser, porque com um valor possível
  por atributo a caixa não dizia mais do que o texto diz e empurrava as abas para fora da primeira
  tela no celular. Decidido, não reabrir
- Só o tipo de ECOS continua em caixas, uma por valor possível, acesa quando vale e apagada quando
  não. Nenhum valor some, porque saber que um valor não se aplica também é informação, e ali pode
  acender mais de uma
- A caixa leva o símbolo do valor e o nome, nada mais. Cadeado aberto para código aberto, cadeado
  fechado para proprietário e camadas empilhadas para híbrido. Como o símbolo passou a ser do valor,
  o estado vai escrito para quem usa leitor de tela, não só no fundo da caixa
- Os blocos da ficha são seções de uma mesma superfície, separados por linhas finas, com título em
  acento e um botão de ajuda no canto. A ajuda é uma por seção, não uma por atributo, e reúne a
  pergunta e a referência de cada atributo do bloco
- A descrição de cada valor possível fica no glossário do Explorar e no botão de ajuda da seção,
  nunca dentro da caixa. Dois lugares já é o limite, e dentro da caixa seria o terceiro
- O bloco de gerência mostra quem possui, quem precisa e como gerenciar, um por linha. Esses três
  rótulos não existem em `classificacoes.json`, então moram no `ficha.js`, junto do desenho. O
  conteúdo continua vindo só de `dados/`
- Abaixo do título do bloco de classificação vai o nome do esquema. Está provisório como "Segundo os
  esquemas adotados na revisão", à espera do nome definitivo
- A solução não aparece na ficha. Ela responde a outra questão de pesquisa, e dentro da ficha fazia
  o catálogo parecer que recomenda ferramenta. A lista das 36 fica no Explorar, com a linha de
  `meta.avisoSolucoes` dizendo o que a lista é e o que ela não é
- A entrada principal do catálogo é a natureza do conhecimento
- Busca e filtros acontecem no cliente e vão para a query string, então o link pode ser compartilhado
- O bloco de filtro tem duas linhas. Na primeira, a busca até perto da metade da largura, as
  pastilhas de natureza e o contador no canto. Na segunda, o rótulo da faceta ao lado das pastilhas
  dela, nunca acima. No rodapé do bloco, o aviso das facetas ainda não classificadas, em texto
  menor e apagado. No celular tudo empilha e o bloco inteiro vira folha
- O rótulo da natureza é só acessível, não escrito, porque ali ele não cabe sem empurrar as
  pastilhas para a linha de baixo, e as três pastilhas já dizem de que faceta são
- O grupo de faceta é `div` com `role="group"` e `aria-labelledby`, não `fieldset`, porque `legend`
  dentro de contêiner flex ainda não se comporta igual em todo navegador
- Todos os cartões do catálogo usam `--cor-cartao-catalogo`, quase neutro com verde apenas sugerido.
  O ID, o selo e o link de abertura usam a cor da natureza. O explícito usa violeta para não se
  perder sobre o verde, o tácito-cognitivo usa amarelo e o tácito-técnico usa azul. A cor não
  preenche a superfície inteira nem transforma o link em botão pesado
- Alvo de toque de no mínimo 44px, rótulo em todo campo, foco visível e contraste mínimo de 4.5 para 1
- `button`, `a` e `input` de verdade. Nunca `role` ou clique em `div`
- Canto arredondado com `--raio` em card, painel, diálogo e campo, e `--raio-pilula` em
  etiqueta e chip. Nunca valor solto, sempre a variável
- Profundidade por superfície. No tema claro o card é branco sobre fundo mais frio, com
  `--sombra-1` em repouso e `--sombra-2` no hover. No tema escuro a superfície é mais clara
  que o fundo e quem separa é a borda, então `--sombra-1` é `none`
- O movimento confirma uma ação sem disputar atenção com o conteúdo. Em ponteiro fino, o card
  sobe pouco, sua ação acompanha e a ficha entra por opacidade, escala leve e deslocamento curto.
  No toque não há hover, e `prefers-reduced-motion` remove essas transições
- Etiqueta é pílula preenchida, com o par `--cor-<natureza>-pilula` e
  `--cor-<natureza>-pilula-texto`. Nível e dimensão usam o par neutro
- A faixa de abertura sangra de ponta a ponta e tem superfície própria, com os tokens
  `--cor-faixa`, `--cor-faixa-texto`, `--cor-faixa-suave`, `--cor-faixa-acento` e
  `--cor-faixa-linha`. O conteúdo interno respeita a `.container`

## Fluxo de trabalho

- Nunca commitar direto na `main`. Toda mudança começa com uma branch nova, nomeada por
  assunto, por exemplo `ficha-compacta` ou `hero-abertura`
- Antes de começar qualquer mudança, conferir em que branch está e avisar
- Ao terminar, abrir um Pull Request pela `gh` CLI, com o que mudou e o que precisa ser
  conferido, e esperar a revisão antes de juntar
- A `main` precisa estar sempre em estado apresentável, porque é dela que o GitHub Pages
  publica o site
- Arquivo de experimento e de protótipo nunca vai para a `main`. Fica na branch e é apagado
  antes do merge

## Qualidade de código

- Nada de CSS morto. Ao trocar um layout, as regras do layout antigo saem no mesmo commit
- Nada de valor literal de cor, espaçamento ou tamanho fora de `css/tokens.css`. No restante
  do CSS só variável
- Nada de estilo inline no HTML
- Cada módulo JS mantém uma responsabilidade só. Função que passa de umas 50 linhas se
  quebra em funções menores com nome claro
- Não repetir marcação entre as páginas sem necessidade. Se o mesmo bloco aparece em quatro
  arquivos, avaliar se vale montar por JS a partir de um lugar só
- O cabeçalho e o rodapé são a exceção, ficam repetidos em HTML de propósito. A navegação
  precisa funcionar mesmo se o JS falhar, e isso pesa mais num artefato que vai ser aberto
  na defesa. Decidido, não reabrir
- Comentário só quando explica o porquê de uma decisão, não o que a linha faz

## Escrita

- Português do Brasil
- Sem o caractere traço como pontuação
- Sem dois pontos como pontuação
- Tom direto, sem linguagem de marketing

## Rodar localmente

Abrir os arquivos direto pelo navegador faz o carregamento dos dados ser bloqueado pelo protocolo
de arquivo local. É preciso um servidor, por exemplo `python3 -m http.server`, e abrir
`http://localhost:8000`. No GitHub Pages o comportamento é normal.
