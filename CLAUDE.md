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
| `dados/conhecimentos.json` | 20 conhecimentos (C01 a C20), com atributos, desafios e estudos relacionados, e a evidência de cada relação |
| `dados/desafios.json` | 17 desafios (D01 a D17), com o texto, os estudos e os conhecimentos que os citam |
| `dados/estudos.json` | 18 estudos primários (E01 a E18), com título, autores, ano, país e a lista de tipos de ECOS que o estudo observou |
| `dados/classificacoes.json` | Vocabulário dos atributos, com rótulo, valores, descrição, pergunta e chave da referência |
| `dados/referencias.json` | Citação completa de cada referência, identificada por chave. O valor é texto, ou o par `texto` e `url` quando há DOI ou publicação oficial aberta |
| `dados/meta.json` | Título, fonte e camadas da estrutura |

`conhecimentos[].evidencia` guarda, por identificador de desafio, o estudo que sustenta aquela
relação e o motivo da ligação.

`origem/` guarda o insumo da pesquisa, não dado que o site carrega. Nenhum módulo lê essa pasta.
Está lá `relacoes-confirmadas.json` e `gerencia-conhecimento.json`, este último já fundido em
`conhecimentos.json`.

### Campos ainda pendentes

`tipoEcos` está vazio em todos os conhecimentos e em todos os estudos.

`acaoGerencia` está preenchido nos vinte, de uma a três ações do vocabulário, nunca as três por
padrão. Só o C02 e o C04 recebem as três. A atribuição foi derivada dos verbos do
`praticasGerencia` de cada conhecimento, que é texto literal da planilha de extração, e não de uma
leitura nova dos estudos E01 a E18. Registrar e versionar levam a Criação e registro, disponibilizar
e compartilhar levam a Compartilhamento, e consultar, integrar e apoiar decisão levam a Uso e
aplicação. Cada par continua precisando de conferência contra o artigo primário antes da defesa.
Enquanto um conhecimento estiver sem ação, a ficha diz que ainda não foram atribuídas, em vez de
acender todas.

`recursosConhecimento`, `participacaoCompartilhamento` e `praticasGerencia` estão preenchidos nos
vinte, texto literal da planilha de extração, e são o que o bloco de gerência da ficha mostra. A
origem está em `origem/gerencia-conhecimento.json`, onde ainda se chamam `quemPossui`, `quemPrecisa`
e `comoGerenciar`. Os nomes antigos afirmavam posse do conhecimento e saíram por isso. O texto dos
vinte continua o da planilha e ainda está escrito na moldura antiga, de onde o conhecimento vem e
quem o utiliza, então reescrevê-lo em termos de recursos e de participação é trabalho pendente que
depende da planilha, não do código.

`portador` e `tipoSaber` foram apagados dos vinte. Eram anteriores aos três campos de gerência,
nasceram vazios, nunca apareceram em tela e nenhum módulo os lia. Não voltam.

Existem dois campos de tipo de ECOS, com papéis separados. Não é a mesma informação em dois lugares.

`conhecimentos[].tipoEcos` diz em que ecossistemas **aquele conhecimento** foi observado. É o que a
ficha lê. Enquanto estiver vazio, as três caixas aparecem apagadas.

`conhecimentos[].observacoesTipoEcos` é opcional e usa o nome do tipo de ECOS como chave. Cada valor
tem `descricao` e a lista opcional `exemplos`. Quando existir para um tipo observado, a caixa vira um
botão e abre esse contexto abaixo da fileira. Sem esse dado, a caixa permanece apenas informativa para
não apresentar exemplo inventado.

`estudos[].tipoEcos` diz que tipos de ecossistema **aquele estudo** examinou, e é lista porque um
estudo sozinho pode comparar mais de um, como o E09, que olha um aberto, um fechando e um fechado.
Aparece só na tabela de estudos, como dado do estudo.

Um nunca é somado para dentro do outro. Um estudo que compara três ecossistemas não autoriza afirmar
que o conhecimento tirado dele apareceu nos três, e cada classificação ainda vai precisar de
justificativa escrita.

`justificativaClassificacao` está preenchido nos vinte com a explicação da natureza epistemológica,
do nível e da dimensão adotados para cada conhecimento. A ficha mostra esse texto no item expansível
"Por que essa classificação?". Os estudos permanecem em sua própria aba.

`conhecimentos[].relacoesConfirmadas` é `true` nos vinte. Os pares de desafio foram conferidos
contra os artigos primários e os que não se sustentaram foram retirados da relação.

Os 22 pares de desafio estão em `conhecimentos[].desafios` e, no outro sentido, em
`desafios[].conhecimentos`. D05, D12 e D16 não se ligam a nenhum conhecimento, porque vêm de estudos
sem conhecimento extraído. Eles não aparecem em ficha nenhuma, e é por isso que o Explorar
lista os dezessete, não só os ligados.

## Páginas

| Arquivo | Função |
|---|---|
| `index.html` | Página única com seções ancoradas, `#inicio` com a faixa de abertura e a tarja de números, `#estrutura` com a lógica de camadas, `#catalogo` com busca, filtros, a grade de cartões e a ficha em diálogo, e `#contato` |
| `catalogo.html` | Só redireciona para `index.html#catalogo`, preservando a busca. Existe para os links antigos não quebrarem |
| `explorar.html` | Glossário dos atributos com a referência de cada esquema e os 17 desafios, cada um com os conhecimentos ligados |
| `sobre.html` | Método de pesquisa. As tabelas de vocabulário saíram para o Explorar. A coluna principal é dividida em dois blocos, abertura e método, só para o cartão de números poder entrar entre eles no celular. No desktop o cartão vai para a segunda coluna por posicionamento explícito e os dois blocos voltam a ler como um |
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
| `js/explorar.js` | Preenche o Explorar, o glossário e os desafios. Item sem conhecimento ligado aparece igual, só sem a lista |
| `js/inicio.js` | Preenche o resumo da abertura, a tarja de números e as camadas |
| `js/referencias.js` | Preenche a página de referências |
| `js/tema.js` | Alterna claro e escuro, grava em `localStorage` na chave `tema` e monta o botão do cabeçalho |
| `js/versao.js` | Recarrega a página uma vez quando o HTML guardado pelo navegador ficou para trás da versão publicada |

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
- A prosa é justificada, como num texto acadêmico. A lista de seletores mora num lugar só, no fim
  de `css/base.css`, porque é decisão tipográfica do site inteiro e não de um componente. Junto
  dela vai `hyphens: auto`, que depende do `lang="pt-BR"` do `html`. Justificar sem hifenizar abre
  rio de espaço entre as palavras, e o português tem palavra longa
- Abaixo de 36rem a prosa volta a ser alinhada à esquerda, com `hyphens: manual`. Em coluna
  estreita o espaço entre as palavras cresce até virar buraco. É o corte que a ficha já usava para
  `.exemplos-ecos__texto` e `.gerencia__valor`, agora valendo para todas
- A exceção de celular da ficha mora em `componentes.css`, não em `base.css`, porque
  `componentes.css` carrega depois e venceria a regra do `base.css` por ordem, já que media query
  não acrescenta especificidade
- Não se justifica a intro centralizada de cada seção, que não é prosa corrida; a lista de
  referências, que a ABNT NBR 6023 manda alinhar à esquerda; a fileira de conhecimentos ligados do
  Explorar, que é etiqueta e não texto; nem as células estreitas do glossário
- O card mostra o identificador no topo e o selo da natureza epistemológica à direita. Abaixo, o
  nome em título, uma prévia visual de até três linhas da descrição e um link "Ver ficha completa"
  no pé. A ficha preserva a descrição completa. A dimensão não aparece no card, só na ficha
- Quem abre a ficha é o link do pé, não o cartão inteiro. Cartão clicável com botão dentro é alvo
  dentro de alvo
- A faixa de abertura compõe em duas colunas no desktop. À esquerda ficam o olho KM4SECO, título,
  resumo de `meta.subtitulo` e o botão Entrar no catálogo. À direita, uma peça visual abstrata
  original em tom verde, com os três números integrados em colunas de mesma largura. No celular, a
  peça visual desce abaixo do texto. A explicação das naturezas epistemológicas fica concentrada na
  aba Conhecimento da seção Estrutura
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
- A contagem de cada natureza fica nos filtros, e as definições completas ficam na aba Conhecimento
  da seção Estrutura e no glossário do Explorar. Por isso o grupo não precisa de cabeçalho repetindo
  essas informações
- O diálogo da ficha tem 760px de largura e 86% da altura da janela. Topo e rodapé ficam parados e
  só o miolo rola. O topo leva o identificador, o selo da natureza, o fechar em ✕ redondo, o nome e
  a descrição, para quem desce até os estudos continuar vendo de qual conhecimento é a ficha
- O miolo que rola usa `--cor-miolo`, um tom além do fundo da página, para manter a ficha como uma
  superfície distinta do conteúdo que ficou atrás dela
- A ficha usa superfícies para classificação, exemplos de ecossistema, gerência e abas, sem cartões
  internos repetidos
- A ordem dos blocos é classificação, exemplos de ecossistema, gerência do conhecimento e as abas
- Natureza, nível e dimensão aparecem juntos na classificação, como rótulo em cima e valor embaixo,
  em três colunas no desktop e empilhados no celular
- Tipo de ECOS aparece na ficha mesmo antes do preenchimento, porque é atributo complementar do TCC II,
  vindo do TCC I e pedido pelo orientador. Enquanto estiver vazio, as três caixas ficam apagadas. Quando
  houver valores, a caixa fica acesa quando vale e apagada quando não.
  Nenhum valor some, porque saber que um valor não se aplica também é informação, e ali pode acender mais de uma
- A caixa leva o símbolo do valor e o nome, nada mais. Cadeado aberto para código aberto, cadeado
  fechado para proprietário e camadas empilhadas para híbrido. Como o símbolo passou a ser do valor,
  o estado vai escrito para quem usa leitor de tela, não só no fundo da caixa
- Cada bloco da ficha tem título em acento e um botão de ajuda no canto. A ajuda é uma por seção,
  não uma por atributo, e traz a explicação dos atributos do bloco
- Cartão em fileira segue sempre o mesmo padrão em toda a seção Estrutura. A fileira iguala a
  altura dos cartões, o espaçamento interno é o mesmo e a fonte é empurrada para o pé, senão as
  linhas de fonte terminam desencontradas quando os textos têm tamanhos diferentes. Vale para as
  quatro abas, para não divergir de uma para outra
- A altura igual numa fileira vem de `align-items: stretch`, que é o padrão da grade e deixa a
  linha crescer com o conteúdo. Nunca de `height: 100%` no filho nem de `grid-auto-rows: 1fr`, que
  travam a altura e fazem a última linha do texto vazar o bloco
- A fonte é uma lista que quebra inteira, cada citação um item que não parte no meio. O ponto e
  vírgula fica preso ao item anterior, sem espaço antes dele, e não entra depois do último. O
  espaço entre as citações é o `gap` da lista, e o espaço do texto vai em `apenas-leitor`, para
  quem copia a linha receber a pontuação certa
- A Estrutura tem três etapas, Ponto de Partida, Atributos e Base de Evidências. A Gerência do
  conhecimento era a etapa 3 e deixou de ser etapa própria, porque é atributo do conhecimento e
  não uma fase seguinte da leitura. O conteúdo dela virou o segundo bloco dos Atributos, e a
  antiga Base de Evidências, que era a 4, passou a ser a 3
- A navegação é montada a partir de `estruturaCatalogo.abas`, então quem define quantas etapas
  existem é o arquivo de dados. O `criadores` do `inicio.js` casa por `id`, e um `id` sem
  construtor quebra a aba. Os três hoje são `conhecimento`, `atributos` e `evidencias`
- A aba de Atributos tem dois blocos empilhados, exemplos de ECOS primeiro e gerência depois. Os
  dois têm a mesma superfície, para lerem como partes de uma seção só e não como duas abas
  coladas. Cada um abre com título, introdução, uma linha fina e a chamada que apresenta as
  categorias, e fecha com a fonte
- O painel de Atributos não tem cabeçalho. O nome da etapa já está no botão da aba, e o
  `aria-labelledby` aponta para ele, então o painel continua com nome acessível sem o `h3`. Quem
  decide isso é o `tituloPainel`, que as outras duas abas declaram e essa não. Sem ele o `painel`
  não monta cabeçalho nenhum
- No lugar do cabeçalho vai uma nota curta, em `nota`, que é o primeiro item da grade e não um
  bloco antes dela. Entrando na grade, ela herda sozinha a largura e o vão vertical dos dois
  cartões, sem precisar repetir medida nenhuma. É discreta de propósito, fundo de acento suave,
  borda fina, sem ícone nem título, e alinhada à esquerda mesmo com a prosa do site justificada
- O painel de Atributos usa o mesmo recuo das outras abas. Ele chegou a ter um recuo menor, de
  quando abria direto nos cartões e a moldura do painel só somava respiro ao que eles já traziam.
  Com a nota no topo, o recuo menor deixava o texto colado na borda
- O bloco de exemplos de ECOS tem três cartões lado a lado, numerados. A numeração é o `counter`
  do `ol`, no `::before` do título, apagada, e não pastilha nem ícone. A tipologia é a de Manikas,
  e a relação de cada modelo com a circulação do conhecimento é contextualização da literatura de
  gerência de conhecimento, por isso a fonte traz `manikas2016` e `kauschinger2024`, sem atribuir
  tudo ao primeiro
- Os dois blocos usam a mesma receita de cartão e a mesma grade, três colunas no desktop, mesmo
  `gap`, mesmo recuo interno e mesma superfície com a linha de acento no topo. Eles chegaram a
  divergir, com o primeiro empilhado e o segundo em fileira, e dois arranjos diferentes na mesma
  seção fazem parecer que são duas lógicas. Mexer na grade de um exige mexer na do outro
- O que distingue os cartões dos dois blocos é só o que abre cada um, número no primeiro e ícone
  no segundo. O resto é igual de propósito
- O bloco de gerência manteve os três cartões lado a lado, os ícones, as etiquetas de ação e a
  nota metodológica, que fecha o bloco abaixo deles
- A natureza aparece uma vez só na Estrutura, no Ponto de Partida, como um dos três atributos.
  Ela já foi definida numa camada e retomada como critério na seguinte, e era essa a redundância
  que a reestruturação desfaz. As três perspectivas são complementares, não etapas de uma
  sequência
- O Ponto de Partida tem duas partes e nada mais. Primeiro um cartão de conceito, com o título,
  o ícone, o parágrafo e a fonte numa composição só. Depois os três cartões de atributo. Não leva
  pergunta de pesquisa, exemplo de conhecimento C01 a C20, número da revisão, faixa divisória
  entre as partes nem parágrafo de encerramento depois dos cartões
- O cartão de conceito é o primeiro item da grade, não um bloco antes dela, então herda sozinho a
  largura e o vão vertical dos três cartões de atributo. É o mesmo arranjo da nota que abre a aba
  de Atributos, e as duas usam o mesmo verde suave para as introduções da Estrutura se
  reconhecerem. O conteúdo dele mora em `cartaoIntroducao`, com `titulo`, `texto` e `referencias`
- A aba 1 também não tem cabeçalho de painel, porque o título vive dentro do cartão. Como as
  outras duas abas, quem decide isso é a ausência do `tituloPainel`. Hoje só a Base de Evidências
  ainda declara um
- São três cartões, não nove. Cada atributo é um cartão e as três categorias dele moram dentro,
  porque o que agrupa as categorias é justamente o atributo. A ordem é natureza epistemológica,
  nível no ECOS e dimensão do ECOS
- A ordem dentro do cartão é título, pergunta orientadora, introdução, categorias e fonte. A
  pergunta vem antes da introdução porque é ela que enquadra o que se vai ler
- Há dois campos de pergunta no atributo, de propósito. `pergunta` é a da tabela do Explorar, com
  outra redação e outro papel, e mexer nela mudaria aquela página. `perguntaOrientadora` é só do
  cartão do Ponto de Partida. A `pergunta` de cada categoria também continua, na mesma tabela
- O texto de introdução do cartão mora em `funcao`, um campo só. O atributo chegou a ter `funcao`
  e `introducao` dizendo quase a mesma coisa, e os dois viraram um. Ficou o nome `funcao` porque é
  o que os cinco atributos usam, e um nome só vale mais do que o nome mais bonito em três deles
- `principal` não tem leitor em módulo nenhum. Marca a natureza como entrada principal do
  catálogo, o que é verdade, mas hoje quem decide isso é a ordenação. Está no arquivo, sem uso.
  Não é duplicação, por isso ficou
- Os três cartões dividem a linha no desktop, em três colunas de largura igual. Até 992px
  empilham, porque três colunas de texto longo dariam uns 280px cada e a explicação viraria uma
  palavra por linha. No celular só o respiro interno cede, e nenhum texto encolhe ou some
- O conteúdo é longo e a aba fica alta. É troca aceita de propósito, porque encurtar o texto para
  baixar a altura tiraria o que torna os conceitos compreensíveis para quem nunca viu gerência de
  conhecimento em ECOS
- A introdução do cartão e a explicação de cada categoria são justificadas, como o resto da prosa
  do site, e entram na lista de seletores do `base.css`. A caixa de texto tem uns 280px no
  desktop, e numa coluna dessa largura quem segura a justificação é a hifenização, então o
  `hyphens: auto` não é opcional ali. Abaixo de 36rem as duas voltam para a esquerda, como todas
  as outras
- Nada de carrossel, aba, acordeão, modal, texto escondido com expandir nem rolagem dentro do
  cartão. Toda explicação fica visível sem interação
- `classificacoes.json` guarda dois textos por categoria, com papéis separados. `explicacao` é a
  do cartão do Ponto de Partida e `descricao` é a completa do glossário do Explorar. A `pergunta`
  de cada categoria é a linha "Responde à pergunta" da tabela do Explorar. O `definicaoBreve`, que
  existia só nas três naturezas, foi apagado por ser um terceiro texto sem leitor
- O nome da categoria é um só em todo o site, "Explícito", "Tácito-cognitivo" e "Tácito-técnico".
  Ele aparece no cartão do Ponto de Partida, no selo do cartão do catálogo, nas pastilhas de filtro,
  na classificação da ficha, no glossário do Explorar e na ordenação, e um nome por lugar seria pior
  do que a frase mais completa num deles. A forma longa, "Conhecimentos explícitos", vivia em
  `tituloPorta` sem nenhum módulo ler, e foi apagada. Não volta
- As abas são numeradas, porque a Estrutura é uma progressão e o número diz a ordem de leitura.
  A numeração vem escrita no `rotulo` de cada aba, em `meta.json`, então renumerar é editar ali
- A sigla ECOS é apresentada por extenso uma vez por página, na linha de abertura, e daí em diante
  só a sigla. O Sobre é a exceção, por decisão editorial: ali o subtítulo usa só a sigla, porque
  quem chega nessa página já passou pela inicial. O nome do catálogo, no `title`, na `meta description`, no `h1` da abertura e no
  rodapé, continua por extenso, porque ali é nome próprio e não texto corrido
- A dimensão do ECOS cita só `santos2011`, por decisão da autora. Fica registrado o que a decisão
  anterior dizia, porque a questão não desapareceu. O de 2011 descreve o conteúdo de cada dimensão
  mas chama a primeira de arquitetural, e era o `santos2012` que fazia o recorte em três e usava o
  nome técnica, que é o que este catálogo adota. Conferir antes da defesa
- O nível no ECOS cita `johnson2020` e `kauschinger2021`, nessa ordem. O Johnson é quem define os
  três níveis
- A `explicacao` das categorias de natureza, nível e dimensão foi reescrita pela autora para o
  Ponto de Partida, e a do `tipoEcos` para o bloco de exemplos da aba de Atributos, as duas em
  texto didático. Nenhuma é mais citação literal dos artigos primários. A `pergunta` continua
  literal
- As questões de pesquisa do artigo, QP1 a QP4, não aparecem na interface. A pergunta que o site
  mostra é a do trabalho, no topo do Sobre
- A palavra "Fonte" não aparece em cartão nenhum. A citação fica sozinha, com uma exceção, o
  "Adaptação de" do cartão de ações, que avisa que os três nomes exibidos não são a taxonomia
  literal do artigo citado
- A Base de Evidências não tem cabeçalho de painel. Abre com uma nota, no mesmo estilo da nota da
  aba de Atributos, e as três abas usam o mesmo arranjo, nota ou cartão como item da grade
- Os três cartões ficam numa grade só, duas colunas a partir de 48rem, com o dos desafios em
  `grid-column: 1 / -1`. Não há invólucro agrupando os dois de cima
- O cartão é coluna flex e o par de números é empurrado para o pé com `margin-top: auto`. Como a
  fileira iguala a altura dos dois cartões e as caixas de indicador têm a mesma altura, encostar
  no pé faz os dois pares começarem na mesma altura, por mais que as descrições tenham
  comprimentos diferentes
- O par de números já teve `flex: 1`, para crescer a partir da descrição. Era o contrário disso, e
  as duas regras brigavam. Em grade com `auto 1fr auto` a folga também não ia para a faixa do
  meio. O subgrid seria o certo, mas no teste o navegador repartia as faixas do pai em partes
  iguais em vez de medi-las pelo conteúdo, então o arranjo ficou em flex
- Cada indicador tem caixa própria, com superfície, borda e raio, para o número ler como dado e
  não como parte do parágrafo acima. O rótulo reserva duas linhas onde os dois cartões dividem a
  fileira, medidas na entrelinha do próprio texto e não em pixel, então rótulo mais longo cresce
  em vez de ser cortado
- A caixa do cartão de desafios não acompanha a largura do cartão, senão vira faixa. Usa
  `--largura-indicador`, e no celular cede para a largura disponível
- A seta de funil entre 1.096 e 18 saiu. Os dois pares de indicadores têm que ler igual, e uma
  seta em um e não no outro quebrava isso
- A escala do cartão de evidências mora na regra base, não na media query de 48rem. Enquanto morou
  lá, abaixo de 768px tudo voltava ao tamanho cheio e o número da métrica chegava a 37px no tablet
  contra 22 no desktop, maior no aparelho menor
- `classificacoes[].funcao` diz o que o atributo identifica, e é a introdução do cartão no Ponto
  de Partida
- A Base de Evidências mostra a revisão, depois as evidências do catálogo e por último os
  desafios, em cartão próprio. Os desafios não viram quarta etapa. O cartão de desafios conta
  associações entre desafio e conhecimento, 22, e o cartão de evidências conta desafios
  distintos, 17. São números diferentes e cada rótulo diz qual é qual
- Só `registrosRecuperados` é escrito em `meta.json`, porque é número do protocolo da revisão. O
  total de estudos, de conhecimentos, de desafios e de associações sai dos próprios dados
- A Base de Evidências tem uma citação só, embaixo dos três cartões, sem link e com os anos do
  Cartaxo juntos, "Cartaxo et al. (2018, 2020); Charmaz (2006)". É referência de método, não
  autoria dos números, e abrir a página de referências dali tiraria a pessoa da leitura
- O `fonteConceitual` aceita `semLink` e `agrupar`. O `agrupar` junta os anos de obras seguidas
  dos mesmos autores, derivando dos mesmos rótulos de `dados.js`, então continua havendo um lugar
  só para a forma abreviada. Só agrupa onde é pedido, porque agrupar sempre mudaria as linhas que
  hoje citam as duas obras do Cartaxo separadas de propósito
- O bloco de Gerência tem três cartões, cada um com a sua citação no pé e nenhuma citação única no
  pé do bloco. Recursos de conhecimento cita `kauschinger2024`, que define recurso de fronteira do
  conhecimento e lista documentação, portais, treinamentos, exemplos de código, blogs e comunidades.
  Participação e compartilhamento cita `kauschinger2023`, que estuda a comunidade patrocinada e os
  papéis de organização central, desenvolvedores externos e comunidade. Ações de gerência cita
  `zaim2019`, que trabalha com geração, captura, compartilhamento e utilização, e por isso a citação
  leva "Adaptado de", já que os três nomes exibidos condensam esses quatro processos
- O `zaim2019` está cadastrado com o ano do fascículo, volume 17, número 1, de 2019. A
  especificação da reformulação pediu 2018, que é o ano da publicação antecipada no DOI. Ficou
  2019, que é o que a bibliografia traz, para a citação e o verbete não se contradizerem.
  Conferir antes da defesa qual das duas o trabalho adota
- As oito ações genéricas saíram. Não eram taxonomia de ninguém e não tinham descrição. O
  vocabulário agora tem três, Criação e registro, Compartilhamento, e Uso e aplicação
- O mapa conceitual é imagem, `imagens/mapa-conceitual-claro.png` e `-escuro.png`. Mudança de texto
  nas camadas não chega até ele, e a imagem precisa ser refeita à parte para não contradizer os
  painéis
- Na Estrutura a fonte fica no pé de cada cartão, sempre visível, pequena, itálica, apagada e
  separada do corpo por linha fina, sem caixa nem fundo. Repete-se de cartão em cartão de
  propósito, porque fora da ordem de leitura cada cartão tem que se sustentar sozinho. Lá não há
  botão de ajuda, então o pé é o único lugar onde a citação pode estar
- Na ficha é o contrário. O bloco não leva fonte no pé, porque a ajuda daquele mesmo bloco já fecha
  com a citação, e as duas saem da mesma chave de `referencia`. A mesma citação duas vezes dentro
  de uma seção de meia tela é repetição, não reforço. Quem quiser a origem do esquema abre o "?",
  que é o lugar onde a explicação dele também está
- A citação aparece sozinha, sem o rótulo "Fonte" na frente. O lugar e o estilo já dizem o que é
- O rótulo curto de cada referência mora em `js/dados.js`, porque a forma abreviada não sai da
  citação sozinha, "Nonaka e Takeuchi" e "Johnson et al." dependem de quantos autores a obra tem.
  É um lugar só, para a Estrutura e a ficha citarem igual
- O rótulo do `davenport1998` é "Davenport e Prusak (1998)", mas o verbete em `referencias.json`
  traz só "DAVENPORT, T.". Os dois se contradizem e quem está incompleto é o verbete, que precisa
  ganhar o segundo autor. Não foi mexido porque é bibliografia, não código
- Toda ajuda da ficha fecha com a sua citação, nas cinco, e é o único lugar onde a ficha cita. Os
  autores saem das chaves de `referencia` de `meta.ajudas`, um lugar só, que a Estrutura também
  usa. Ajuda sem chave de referência não existe, e se alguma surgir sem, a linha some em vez de
  aparecer vazia
- O `prefixoFonte` em `meta.json` é opcional e só a ajuda da Gerência o declara, com "Síntese do
  KM4SECO elaborada com base em", porque só ela é síntese deste trabalho e não explicação de um
  esquema alheio. Sem ele a citação aparece sozinha, como em todo o resto do catálogo
- A ajuda dos desafios cita `revisaoRapidaManuscrito`, porque os desafios são achado da revisão
  deste trabalho e não de um esquema publicado. Essa chave não tem verbete, então a citação sai
  como texto e não como link
- O bloco da ficha, a ajuda dele e, quando existir, o cartão da Estrutura que trata do mesmo
  assunto levam o mesmo nome, palavra por palavra. A ajuda não usa forma curta. Nomes diferentes
  para a mesma coisa fazem parecer que são duas, e o catálogo já teve três redações para os
  exemplos de ECOS, uma na camada, outra no bloco e outra na ajuda
- Os cinco pares hoje são "Classificação do conhecimento", "Exemplos de ECOS em que o conhecimento
  foi observado", "Gerência do conhecimento no ECOS", "Desafios relacionados à Gerência de
  Conhecimento" e "Estudos primários associados". Mexer num exige mexer no outro
- `revisaoRapidaManuscrito` não tem verbete na página de referências, porque o manuscrito não está
  publicado, então quem cita essa chave escreve em texto e não abre link. Quem decide isso é o
  `temVerbete` do `dados.js`, num lugar só
- A descrição de cada valor possível fica no glossário do Explorar e no botão de ajuda da seção,
  nunca dentro da caixa. Dois lugares já é o limite, e dentro da caixa seria o terceiro
- O bloco de gerência da ficha mostra recursos de conhecimento, participação e compartilhamento, e
  ações de gerência, um por linha, com as etiquetas das ações fechando o bloco. O parágrafo genérico
  sobre o que é gerência do conhecimento saiu, porque repetia em cada uma das vinte fichas a
  introdução da camada de Gerência. Ele existe num lugar só, na aba 3 da Estrutura. Esses rótulos não
  existem em `classificacoes.json`, então moram no `ficha.js`, junto do desenho. O conteúdo continua
  vindo só de `dados/`
- Abaixo do título do bloco de classificação vai o nome do esquema. Está provisório como "Segundo os
  esquemas adotados na revisão", à espera do nome definitivo
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
- Depois de uma PR ser fechada com squash, aquela branch morre. O trabalho seguinte começa numa
  branch nova tirada da `main` atualizada. Continuar commitando na branch que já foi espremida
  cria duas histórias concorrentes nos mesmos arquivos, e o conflito que aparece é de git, não de
  conteúdo
- Conflito assim se resolve na linha de comando, nunca pelo editor do GitHub. Branch nova a partir
  da `main`, `git cherry-pick` só dos commits que a `main` ainda não tem, e PR nova

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

## Versão dos arquivos em cache

Todo CSS e JS leva `?v=`, inclusive os imports entre módulos, e os arquivos de dados levam a mesma
versão pela constante `VERSAO` do `js/dados.js`. A versão é uma só para tudo, nunca uma por arquivo.

```
python3 ferramentas/versionar.py 20261104-1
```

O script não gera nada e não é etapa de build. Ele só troca o `?v=` em todos os pontos de uma vez,
porque versão por arquivo desencontra e o navegador passa a servir metade nova e metade velha.

O HTML não leva `?v=`, porque é o endereço que a pessoa abre. Se o navegador guardar o HTML antigo,
ele serve junto as versões antigas de tudo, e o site parece congelado mesmo com a publicação
correta. É o que o `js/versao.js` resolve.

Cada página de conteúdo leva a versão numa `<meta name="versao">` e carrega o `js/versao.js`, que
busca o `versao.json` sem cache e compara. Se a página for mais velha que a publicada, ele recarrega
uma vez. Uma marca em `sessionStorage` impede o laço quando o recarregar não traz HTML novo, e aí
ele só avisa no console. Sem rede, sem o arquivo ou com JSON quebrado, a página serve como está,
porque um guarda de cache nunca pode impedir a leitura do catálogo.

O `catalogo.html` fica de fora, porque só redireciona e o guarda disputaria com o `location.replace`.

A meta e o `versao.json` entram na mesma passada do versionador. Mexer num sem o outro faz o guarda
desencontrar e recarregar para sempre, então nunca editar a meta à mão.

## Rodar localmente

Abrir os arquivos direto pelo navegador faz o carregamento dos dados ser bloqueado pelo protocolo
de arquivo local. É preciso um servidor, por exemplo `python3 -m http.server`, e abrir
`http://localhost:8000`. No GitHub Pages o comportamento é normal.
