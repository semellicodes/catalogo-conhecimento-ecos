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
| `js/explorar.js` | Preenche o Explorar, o glossário e os desafios. Item sem conhecimento ligado aparece igual, só sem a lista |
| `js/inicio.js` | Preenche o resumo da abertura, a tarja de números e as camadas |
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
- As quatro camadas da Estrutura têm funções separadas e nessa progressão. Ponto de Partida diz o
  que é conhecimento em ECOS e quais são as três naturezas epistemológicas, só o conceito.
  Atributos diz como os conhecimentos foram caracterizados, por natureza, nível e dimensão, com a
  função de cada atributo e as categorias pelo nome. Gerência diz recursos de conhecimento,
  participação e compartilhamento, e ações de gerência. Base de Evidências diz o que sustenta o
  catálogo
- A natureza aparece nas duas primeiras camadas de propósito, com funções diferentes. No Ponto de
  Partida ela é definida, no Atributos ela é um dos critérios de caracterização. O que não se
  repete é a definição, que existe num lugar só
- O Ponto de Partida não leva pergunta de pesquisa, exemplo de conhecimento C01 a C20, detalhe de
  atributo nem número da revisão. Só o conceito, a frase central e as três definições breves
- `classificacoes.json` guarda três textos por categoria, com papéis separados. `definicaoBreve` é
  a do Ponto de Partida, só nas naturezas, `explicacao` é a da camada de Atributos e `descricao` é
  a completa do glossário do Explorar
- As abas são numeradas, porque a Estrutura é uma progressão e o número diz a ordem de leitura
- A sigla ECOS é apresentada por extenso uma vez por página, na linha de abertura, e daí em diante
  só a sigla. O nome do catálogo, no `title`, na `meta description`, no `h1` da abertura e no
  rodapé, continua por extenso, porque ali é nome próprio e não texto corrido
- A dimensão do ECOS cita `santos2011` e `santos2012`, nessa ordem. O de 2011 descreve o conteúdo
  de cada dimensão mas chama a primeira de arquitetural, e o de 2012 é que faz o recorte em três e
  usa o nome técnica, que é o que este catálogo adota
- O nível no ECOS cita só `johnson2020`, que é quem define os três níveis. O `kauschinger2021`
  continua nas ajudas da ficha, onde sustenta outra coisa
- Cada categoria dos quatro atributos tem `explicacao`, de duas ou três frases, e `pergunta`, a
  linha "Responde à pergunta". As duas são literais dos artigos primários
- As questões de pesquisa do artigo, QP1 a QP4, não aparecem na interface. A pergunta que o site
  mostra é a do trabalho, no topo do Sobre
- A palavra "Fonte" não aparece em cartão nenhum. A citação fica sozinha, com uma exceção, o
  "Adaptação de" do cartão de ações, que avisa que os três nomes exibidos não são a taxonomia
  literal do artigo citado
- A frase central do Ponto de Partida é um divisor, com a linha saindo para os dois lados até a
  borda do bloco e o texto no meio em mono, maiúsculo pequeno, com espaçamento entre letras
- Até 600px o divisor deixa de ser divisor e vira título de faixa, em largura inteira. As duas
  linhas laterais custam a largura de que o texto precisa, e com elas a frase quebrava em quatro
  linhas espremidas entre dois riscos de vinte pixels. O espaçamento entre letras cai para o da
  sigla, porque em mono maiúsculo o do rótulo custa quase um caractere a cada doze
- Tamanho, entrelinha, centralização e `text-wrap: balance` vão no `h4` do divisor, não no `span`
  de dentro. O span é inline, então quem dimensiona cada linha é o strut do bloco, e as três
  propriedades do bloco deixam de valer no span assim que a grade sai
- Os dois cartões de cima da Base de Evidências têm a mesma forma, título, uma linha de descrição e
  dois números grandes lado a lado. Quem cresce para baixo é o par de números, não a descrição,
  senão os números desalinham entre os cartões quando um rótulo quebra em duas linhas
- `classificacoes[].funcao` diz o que o atributo identifica, e é o que a camada de Atributos mostra
  no lugar de redefinir cada categoria
- A Base de Evidências mostra a progressão da revisão, dos registros recuperados aos estudos
  selecionados, depois os resultados e por último os desafios, em cartão próprio. Os desafios não
  viram quinta camada. A contagem dos desafios é de associações entre desafio e conhecimento, não
  de desafios distintos, e o rótulo diz isso
- Só `registrosRecuperados` é escrito em `meta.json`, porque é número do protocolo da revisão. O
  total de estudos, de conhecimentos e de associações sai dos próprios dados
- A camada de Gerência tem três cartões, cada um com a sua citação no pé e nenhuma citação única no
  pé da camada. Recursos de conhecimento cita `kauschinger2024`, que define recurso de fronteira do
  conhecimento e lista documentação, portais, treinamentos, exemplos de código, blogs e comunidades.
  Participação e compartilhamento cita `kauschinger2023`, que estuda a comunidade patrocinada e os
  papéis de organização central, desenvolvedores externos e comunidade. Ações de gerência cita
  `zaim2019`, que trabalha com geração, captura, compartilhamento e utilização, e por isso a citação
  leva "Adaptação de", já que os três nomes exibidos condensam esses quatro processos
- As oito ações genéricas saíram. Não eram taxonomia de ninguém e não tinham descrição. O
  vocabulário agora tem três, Criação e registro, Compartilhamento, e Uso e aplicação
- O mapa conceitual é imagem, `imagens/mapa-conceitual-claro.png` e `-escuro.png`. Mudança de texto
  nas camadas não chega até ele, e a imagem precisa ser refeita à parte para não contradizer os
  painéis
- A fonte fica no pé de cada cartão, sempre visível, nunca atrás do botão de ajuda e nunca uma só
  no pé do bloco. Mesmo visual em toda a Estrutura, na ficha e no Explorar, pequena, itálica,
  apagada e separada do corpo por linha fina, sem caixa nem fundo. Repete-se de cartão em cartão de
  propósito, porque fora da ordem de leitura cada cartão tem que se sustentar sozinho
- A citação aparece sozinha, sem o rótulo "Fonte" na frente. O lugar e o estilo já dizem o que é
- O rótulo curto de cada referência mora em `js/dados.js`, porque a forma abreviada não sai da
  citação sozinha, "Nonaka e Takeuchi" e "Johnson et al." dependem de quantos autores a obra tem.
  É um lugar só, para a Estrutura e a ficha citarem igual
- O diálogo de ajuda fecha com a citação quando a ajuda declara `prefixoFonte` em `meta.json`.
  Hoje só a da Gerência declara, porque só ela é síntese deste trabalho e não explicação de um
  esquema alheio. Os autores saem das mesmas chaves de `referencia` que o rodapé do bloco usa, para
  não haver duas listas a manter
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
- A coluna esquerda da camada de Atributos chama-se "Classificação dos conhecimentos em ECOS", não
  taxonomia. A classificação combina esquemas de autores diferentes, um por atributo, e chamar o
  conjunto de taxonomia sugeriria um esquema único que não existe. Os nomes de classe no CSS e no
  `inicio.js` ainda dizem `taxonomia`, de quando a coluna tinha esse nome
- A coluna leva um parágrafo só antes dos cartões, e ele acrescenta a fundamentação teórica. O que
  são os três atributos e o que eles permitem identificar em conjunto fica na caixa de introdução
  do painel, num lugar só. A coluna já tentou repetir isso e foi o que se tirou
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
ele serve junto as versões antigas de tudo, e aí só recarregar sem cache resolve. No Safari o
recarregar sem cache não despeja o cache de módulos, para isso é ⌥⌘E.

## Rodar localmente

Abrir os arquivos direto pelo navegador faz o carregamento dos dados ser bloqueado pelo protocolo
de arquivo local. É preciso um servidor, por exemplo `python3 -m http.server`, e abrir
`http://localhost:8000`. No GitHub Pages o comportamento é normal.
