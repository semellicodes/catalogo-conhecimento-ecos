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
| `dados/estudos.json` | 18 estudos primários (E01 a E18), com título, autores, ano, país e a lista de tipos de ECOS que o estudo observou |
| `dados/classificacoes.json` | Vocabulário dos atributos, com rótulo, valores, descrição, pergunta e chave da referência |
| `dados/referencias.json` | Citação completa de cada referência, identificada por chave. O valor é texto, ou o par `texto` e `url` quando há DOI ou publicação oficial aberta |
| `dados/meta.json` | Título, fonte e camadas da estrutura |

`conhecimentos[].evidencia` guarda, por identificador de desafio, o estudo que sustenta aquela
relação e o motivo da ligação.

`origem/` armazena materiais históricos e insumos da pesquisa, que não são carregados pela aplicação web. Nenhum módulo JavaScript utiliza diretamente essa pasta.

O arquivo `gerencia-conhecimento.json` contém dados de uma etapa anterior da pesquisa, posteriormente incorporados ao `dados/conhecimentos.json`. A estrutura atual do catálogo utiliza os conhecimentos, suas classificações, atividades de gerência e estudos primários associados.

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
| `imagens/` | Retratos da seção de contato, o mapa conceitual e a ilustração da abertura, cada um nas versões clara e escura |

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
  resumo de `meta.subtitulo` e os botões Explorar o catálogo e Sobre o catálogo. À direita, a
  ilustração do catálogo em camadas. No celular, a ilustração desce abaixo do texto. A explicação
  das naturezas epistemológicas fica concentrada na aba Identificação da seção Estrutura
- A ilustração é imagem, `imagens/catalogo-camadas-claro.png` e `-escuro.png`, uma por tema. Ela
  substituiu um SVG inline de livro aberto com conexões, que era desenhado à mão no `index.html` e
  pintado com `currentColor`. O SVG saiu inteiro, com a regra `.abertura__diagrama` e o token
  `--proporcao-diagrama-abertura`, que existia só para ele
- A troca entre as duas é a mesma do mapa conceitual, duas `img` e o `data-tema` que o `js/tema.js`
  grava na raiz. Não há JavaScript nesta tela e a imagem muda na hora que o interruptor é acionado,
  sem recarregar. O preço é as duas serem baixadas, uns 390KB no total, como já acontece com o mapa
- O painel da abertura não põe fundo, borda nem recuo por cima da ilustração, porque ela já traz
  superfície, cantos e profundidade próprios e seria moldura dentro de moldura. Sobrou do painel o
  recorte dos cantos no `--raio` do catálogo, porque o canto desenhado na imagem não acompanha o
  raio do site, e a sombra que a separa da faixa
- A ilustração vai com altura automática, nunca com `aspect-ratio` nem `object-fit`, para a
  proporção ser a do arquivo e nenhuma das duas versões esticar ou cortar. As duas têm 1200 por
  900, e trocá-las por outras de proporção diferente não pede mexer no CSS
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
- A ficha tem quatro blocos, nesta ordem. Classificação do conhecimento, Exemplos de ECOS em que o
  conhecimento foi observado, o bloco de atividades e Estudos primários associados. O terceiro
  muda de nome conforme a forma da ficha, e no C01 chama-se Atividades associadas à gerência do conhecimento
- Os desafios saíram da ficha. Eles continuam nos dados e no Explorar, que é onde a relação entre
  desafio e conhecimento se lê inteira, nos dois sentidos. Na ficha eram um quinto bloco sobre um
  assunto que a ficha não trata. Saíram com eles o `desafiosRelacionados`, o `linhaDesafio`, o
  `estudosDoDesafio`, o `acessoAosEstudos`, o `iconeDesafio` e o `iconeInformacao`. A
  `meta.ajudas.desafios` continua no arquivo, sem leitor, como os outros campos sem uso
- A natureza saiu da classificação da ficha. Ela já aparece no selo do topo, ao lado do
  identificador, e repeti-la dizia duas vezes a mesma coisa na mesma tela. Ficam o nível e a
  dimensão, que o topo não mostra
- Nenhuma categoria de ECOS começa aberta. A seção abre neutra e quem escolhe o que consultar é
  quem lê, como nas atividades. A ficha é remontada a cada abertura, então o estado não atravessa
  de um conhecimento para o outro
- As vinte fichas usam "Atividades associadas à gerência do conhecimento", com os oito processos. Quem decide
  é o `atividadesAssociadas` do conhecimento, e não uma lista de identificadores escrita no módulo
- O `atividadesAssociadas` tem dois valores, e a diferença é acadêmica, não visual. `true` diz que
  os oito foram conferidos contra os estudos primários daquele conhecimento, e hoje é o caso do C01
  e do C12. `"pendente"` diz que a leitura ainda não foi feita, e é o caso dos outros dezoito
- Um processo sem descrição cai em um de dois avisos. Na ficha revista, "Informação não
  identificada", porque a ausência é achado da revisão. Na pendente, "Revisão pendente", porque
  dizer o contrário afirmaria uma ausência que ninguém procurou. Os dois textos moram em
  `meta.fichaAtividades`
- O cartão cinza é o mesmo nos dois casos. A distinção é do texto do painel, não da cor, porque
  para quem lê o cartão diz só que ali não há descrição
- As duas formas anteriores do bloco continuam no `ficha.js`, a de importância, atores e cápsulas e
  a de recursos, participação e ações, mas nenhuma ficha as alcança desde a migração das vinte.
  Elas saem numa limpeza à parte, quando a revisão dos dezoito estiver fechada
- Os dezoito pendentes ganharam `atividadesGerencia` vazio, que é o ponto de edição. Preencher uma
  atividade é acrescentar ali `{"processo", "descricao", "estudos"}`, com o nome do processo escrito
  igual ao da aba de Atividades. Os oito não se repetem em cada conhecimento, porque a lista e a
  ordem vêm do `meta.json`
- Os campos da gerência antiga continuam nos vinte, `recursosConhecimento`,
  `participacaoCompartilhamento`, `praticasGerencia`, `acaoGerencia`, `importanciaGerencia` e
  `atoresEnvolvidos`, sem leitor. Eles são o insumo da revisão que vem, e por isso não foram
  apagados
- O `acaoGerencia` não foi convertido em atividade de nenhum conhecimento. Ele é outro vocabulário,
  de três valores, derivado dos verbos do `praticasGerencia` e não de uma leitura dos estudos, e
  transformá-lo nos oito processos seria inventar classificação
- A seção nova mostra sempre os oito processos, em duas colunas e quatro linhas, na ordem do
  referencial. Os três com atividade identificada acendem em verde e os cinco sem informação ficam
  neutros, e todos abrem, porque saber que nada foi encontrado na revisão também é informação.
  Nenhum usa `disabled`, senão o aviso de ausência não poderia ser lido
- O cartão de atividade é o mesmo botão das categorias de ECOS, `.exemplos-ecos__categoria`, então
  altura, canto, recuo, ícone, tipografia, hover e foco vêm de lá sem uma linha a mais. Só a grade
  é própria, porque são oito em duas colunas e as categorias são três
- No celular as duas fileiras ficam em duas colunas e a altura passa a ser decidida pelo rótulo
  mais longo. "ECOS de Código Aberto" quebra em mais linhas que "Identificação", então os cartões
  de atividade ficam mais baixos que os de exemplo. O desenho é o mesmo, inclusive a altura mínima
- O painel abre abaixo da grade inteira, nunca dentro de uma célula, para a fileira não mudar de
  altura nem de posição quando ele aparece. Um por vez, nenhum aberto de início, e o segundo clique
  no mesmo cartão recolhe
- O texto do painel vai alinhado à esquerda e sem hifenizar. São parágrafos longos numa caixa
  estreita, e a justificação abria vão entre as palavras
- A procedência fecha a atividade identificada, num rodapé compacto com separador fino, ícone de
  livro, o rótulo e os identificadores em caixinhas. Os links são os mesmos que a seção de exemplos
  já usa, com o endereço vindo de `dados/estudos.json`. Nenhum endereço é escrito no módulo, e o
  processo sem informação não leva rodapé
- A frase de ausência diz que nada foi identificado nos estudos analisados, nunca que a atividade
  não ocorre. Ela mora em `meta.fichaAtividades`, com `{atividade}` e `{conhecimento}` trocados na
  hora. O `{conhecimento}` lê o `nomeEmFrase` do conhecimento, que traz o nome com a preposição
  certa, e cai no nome em caixa baixa quando o campo não existe
- A lista dos oito e a ordem deles vêm da aba de Atividades da Estrutura, num lugar só, para a
  ficha e a camada nunca divergirem
- As descrições das atividades do C01 foram ampliadas a partir das curtas já revistas. Elas nomeiam
  o conhecimento na primeira frase, dizem como a atividade ocorre e para que serve, e nenhuma
  acrescenta prática, tecnologia, ator ou resultado que o texto aprovado não sustentasse. Os pares
  de estudo continuam os de antes, E03 e E08 na Identificação, E03 no Compartilhamento e E03 e E08
  na Aplicação
- Duas expressões da primeira redação ampliada saíram por extrapolarem o texto revisto, "compartilhar
  experiências técnicas" no Compartilhamento e "evolução dos componentes" na Aplicação. O que ficou
  é o que as descrições curtas, a importância e os atores já sustentavam
- O número de atividades com descrição varia por conhecimento, porque só entram os processos que as
  evidências sustentam. O C01 tem três e o C12 tem quatro
- As duas formas têm ajuda própria, `gerencia` e `gerenciaComponentes`, porque uma descreve
  recursos, participação e ações e a outra descreve importância, atores e atividades. A antiga sai
  quando a última ficha for revista
- As atividades aparecem em cápsulas, uma por processo identificado. Só entram os processos que as
  evidências sustentam. Nenhum aparece apagado para completar a lista, porque ausência de evidência
  não é evidência de ausência, e a aba de Atividades já diz que não se pressupõe que todos estejam
  presentes
- A cápsula reusa o desenho das categorias de ECOS, verde no texto, fundo neutro e borda discreta,
  e muda só o canto, totalmente arredondado, e a seta que diz que ela abre. O verde é da interação,
  não da natureza epistemológica, então a cor do explícito não entra ali
- A cápsula declara as duas coisas no seletor composto, `.exemplos-ecos__categoria.atividade-gerencia`,
  porque a regra das categorias vem depois no arquivo e venceria por ordem num seletor de classe só
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
  cinco abas, para não divergir de uma para outra
- A altura igual numa fileira vem de `align-items: stretch`, que é o padrão da grade e deixa a
  linha crescer com o conteúdo. Nunca de `height: 100%` no filho nem de `grid-auto-rows: 1fr`, que
  travam a altura e fazem a última linha do texto vazar o bloco
- A fonte é uma lista que quebra inteira, cada citação um item que não parte no meio. O ponto e
  vírgula fica preso ao item anterior, sem espaço antes dele, e não entra depois do último. O
  espaço entre as citações é o `gap` da lista, e o espaço do texto vai em `apenas-leitor`, para
  quem copia a linha receber a pontuação certa
- A Estrutura tem cinco etapas, Identificação, Classificação, Exemplos, Atividades e Base de
  evidências, na ordem do mapa conceitual. A introdução da seção, no `index.html`, nomeia as cinco
  por escrito, e mexer numa etapa pede conferir aquela frase. A 1 chamava-se Ponto de Partida e a 4 chamava-se
  Gerência do conhecimento. Os exemplos de ECOS saíram da Classificação e viraram a etapa 3, porque
  descrevem como o ecossistema se organiza e não como o conhecimento se classifica
- A navegação é montada a partir de `estruturaCatalogo.abas`, então quem define quantas etapas
  existem é o arquivo de dados. O `criadores` do `inicio.js` casa por `id`, e um `id` sem
  construtor quebra a aba. Os cinco hoje são `conhecimento`, `classificacao`, `exemplos`,
  `gerencia` e `evidencias`. O `id` guarda o nome de origem de cada etapa, e renomear uma aba é
  trocar o `rotulo`, não o `id`, que é a chave do construtor e do `aria-controls`
- As colunas da fileira de abas vêm do número de abas, por `grid-auto-flow: column`, e não de uma
  contagem escrita no CSS. Acrescentar ou tirar uma etapa é editar `meta.json`. Abaixo de 40rem são
  duas colunas, e com cinco abas a última fica sozinha na terceira linha
- O botão de aba é grade centrada em todas as larguras. Com cinco etapas o rótulo mais longo quebra
  em duas linhas antes do celular, e sem o centro vertical ele subia enquanto os de uma linha
  ficavam no meio
- A Classificação repete o arranjo da Identificação, e é de propósito. Cartão verde, divisor,
  e os cartões, todos itens da mesma grade. Quem olha a aba 2 depois da 1 reconhece a forma antes
  de ler, e o paralelo diz que as duas apresentam critérios
- A aba tem dois cartões, Nível no ECOS e Dimensão do ECOS, que dividem a linha no desktop. A
  introdução do cartão verde remete à aba Identificação, porque a natureza epistemológica foi
  apresentada lá e não se repete aqui
- A aba 3 repete o arranjo das outras, cartão verde com o nome e a apresentação do assunto, e
  abaixo o cartão de conteúdo com os três tipos, na largura inteira. Ela já teve um cartão só, que
  trazia tudo junto, e passou ao padrão da camada por orientação do professor
- O cartão de conteúdo da aba 3 não repete título nem introdução, porque é o único da aba e o
  verde logo acima já os traz. O `cartaoDeEstrutura` passou a tratar os dois como opcionais, e sem
  cabeçalho a lista é o primeiro filho do cartão e perde o vão de cima, senão sobraria uma banda
  vazia acima da linha da primeira categoria
- O rótulo exibido de um valor pode diferir do valor do vocabulário. Quando a troca vale para o
  catálogo inteiro ela mora no próprio vocabulário, em `rotulosExibicao`, e a Estrutura e a ficha
  leem do mesmo campo. É o caso de "Técnica", que lê "Arquitetural (Técnica)" nos dois lugares
- Quando a troca é só de uma aba, ela mora na aba, em `rotulos`, e o `cartaoDeEstrutura` aplica.
  Hoje é uma, "Proprietário" lê "Código fechado" nos Exemplos, e a ficha continua dizendo "ECOS
  Proprietário", que é o nome da caixa dela
- O dado nunca muda, nos dois casos. Os filtros, a ordenação e os arquivos seguem com o valor
  original, e quem troca é só a exibição
- A justificativa da classificação destaca em negrito o nível e a dimensão deste conhecimento. Quem
  decide o que destacar são os próprios valores, e não marcação escrita no texto, para `dados/`
  seguir sem marcação dentro. Entram o rótulo de exibição e o valor bruto, porque as justificativas
  escritas antes da troca dizem "a dimensão Técnica" e sem o bruto ficariam sem destaque. Quando os
  dois servem vence o mais longo, para o rótulo inteiro ficar em negrito
- Conferido nas vinte, cada justificativa recebe exatamente dois destaques, o nível e a dimensão, e
  todas as ocorrências vêm anunciadas por "nível" ou "dimensão" na frase. Nenhum termo é destacado
  fora desse papel
- Os três cartões usam o mesmo construtor, `cartaoDeEstrutura`. O que muda é de onde vem o
  texto e se as categorias leem em coluna ou em fileira, e isso é decisão de grade, não de
  componente. Três desenhos para a mesma coisa fariam a aba parecer três seções
- A categoria é item do cartão, não cartão dentro de cartão. Quem separa uma da outra é uma linha
  fina, não uma superfície. A numeração é o `counter` do `ol`, no `::before` do título, apagada, e
  não pastilha nem ícone
- O `cartaoDeEstrutura` serve às quatro abas. A Classificação usa os dois cartões com categorias,
  os Exemplos usam um sem título nem introdução, a Gerência usa dois sem categorias e um com os
  oito processos, e a Base de evidências usa os dois sem nenhuma. Cabeçalho, introdução, lista,
  citação e rodapé são todos opcionais, e cada um só é montado quando o dado existe
- O cartão aceita `referencias`, que vira citação com link. O `rodape`, que era texto solto na
  mesma linha, saiu com os dois cartões da Gerência que o declaravam
- Nível e Dimensão tiram título, introdução e citação do próprio vocabulário, de `rotulo`, `funcao`
  e `referencia`, que é onde o nome do atributo já mora. Só o ícone vem da aba, porque é decisão de
  interface e não parte da classificação
- O nome e a apresentação dos Exemplos de ECOS moram no `cartaoIntroducao` da aba 3, e não no
  vocabulário, porque o `rotulo` "Tipo de ECOS observado" nomeia o campo da ficha e não esta
  etapa. O `tiposEcos` ficou com a chave do vocabulário, o ícone, a citação e os rótulos de
  exibição. O `funcao` do `tipoEcos` continua no arquivo sem leitor
- Os dois cartões da fileira têm a mesma altura e as duas citações fecham na mesma linha. A altura
  igual vem de `align-items: stretch` na grade da aba, que sobrescreve o `start` da grade base, e a
  citação é empurrada para o pé com `margin-top: auto`
- A natureza epistemológica não se repete na Classificação. Ela é a Identificação inteira, e
  retomá-la aqui era
  a redundância que a reestruturação desfez
- A prosa dos cartões da Estrutura é justificada nas cinco abas, com `hyphens: none` em vez do
  `auto` da regra global. A decisão é a mesma do site, a receita é que difere, porque em coluna de
  meia tela a hifenização partia palavra no meio. Os quatro seletores saíram da lista do
  `base.css` e têm regra própria em `paginas.css`, num lugar só
- `word-break` e `overflow-wrap` ficam no valor padrão, escritos na regra de propósito. Nenhum
  texto do catálogo tem palavra longa o bastante para transbordar, e `break-word` reintroduziria a
  quebra no meio da palavra
- A justificação dos cartões vale em todas as larguras, inclusive no celular. É a exceção ao corte
  de 36rem que o resto da prosa do site usa, por decisão da autora, pela consistência da camada
- Abaixo de 36rem, e só ali, a hifenização automática volta. Sem ela a justificação em coluna de
  220px abria vão de até 99px entre as palavras. Com ela o maior vão caiu para 37px a 320px e para
  23px a 390px, na mesma faixa do desktop. Quem decide onde a palavra parte é o navegador, pelas
  regras do português, porque as cinco páginas declaram `lang="pt-BR"`
- O dicionário do navegador acerta quase sempre, "manu-tenção", "arquite-tura", "desen-volvido",
  mas não é infalível. O "relaci-onado" que aparece a 320px parte dentro da sílaba. É o preço de
  hifenizar automaticamente, e não há como corrigir caso a caso sem escrever `&shy;` no conteúdo,
  o que poria marcação dentro de `dados/`
- Título, nome de categoria, número e citação não são justificados. Não são prosa corrida
- Nível cita `johnson2020` e `kauschinger2021`, dimensão cita `santos2011` e os exemplos citam
  `manikas2016`. O cartão verde não cita nada, porque a decisão de classificar por nível e
  dimensão é deste trabalho e não de um esquema alheio
- O `kauschinger2024` saiu da citação dos exemplos. Ele sustentava a relação entre cada modelo e a
  circulação do conhecimento, que era o enquadramento do texto antigo. O texto novo descreve só o
  modelo de organização, que é Manikas, então a segunda obra passou a citar o que o cartão não diz
- A aba de Atividades apresenta só os oito processos de gerência do conhecimento, por orientação
  do professor. É o arranjo dos Exemplos, cartão verde com o nome e a apresentação e, abaixo, um
  painel único com os oito, que fecha com a citação
- O cartão verde chama-se "Atividades associadas à gerência do conhecimento", o mesmo nome do bloco da ficha
  migrada e da ajuda dele. O C01 já usa os três, e o par fecha quando as vinte forem revistas
- A aba 4 é a exceção à justificação no celular. Abaixo de 36rem a introdução do cartão verde e as
  oito descrições vão alinhadas à esquerda, com `hyphens: manual`. São frases curtas, de duas ou
  três linhas numa coluna de celular, e ali a justificação abria vão de até 23px entre as palavras
  sem ter linha suficiente para a hifenização compensar. Alinhadas à esquerda o maior vão caiu
  para 3,5px, que é o espaço normal de palavra
- A exceção é presa à `.estrutura__grade--gerencia`, dentro da media query que já existia, e as
  outras quatro abas continuam justificadas e hifenizadas no celular. Nenhuma regra global mudou
- Os cartões de Importância de gerenciar esse conhecimento e de Atores envolvidos saíram da aba,
  com os `componentes` do `meta.json`, a grade de duas colunas da Gerência, o `rodape` do
  `cartaoDeEstrutura`, que existia só para o "Estudos primários associados" dos dois, e os ícones
  `nota`, `participacao` e `acoes`, que ficaram sem declarante. Está no histórico se a decisão
  voltar
- Os dois nomes continuam vivos na ficha, nos blocos do C01 e do C12, que esta mudança não toca. A
  reorganização das vinte fichas para os oito processos é trabalho à parte
- Os oito processos são os de `lopes2026`, Identificação, Aquisição, Compartilhamento,
  Armazenamento, Codificação, Criação, Aplicação e Avaliação, com a descrição de cada um
  sintetizada da Tabela 1 do artigo
- Lopes et al. (2026) tratam de gerência do conhecimento em reúso de software. Aqui os oito
  processos são a estrutura de análise que organiza as atividades observadas nos estudos primários
  desta revisão, e o cartão verde diz isso por escrito. Em nenhum ponto o catálogo afirma que os
  autores identificaram essas atividades nos estudos do KM4SECO
- Cada processo ganha superfície e borda, diferente das categorias da Classificação, que só levam
  a linha fina. São oito itens curtos em duas colunas, e sem a caixa a leitura vira uma lista
  indistinta
- O arranjo anterior da Gerência saiu inteiro, com os cartões de Recursos de conhecimento,
  Participação e compartilhamento e Ações de gerência, as etiquetas de ação, a nota metodológica e
  os construtores `blocoGerencia`, `etiquetasDeAcao`, `notaMetodologica`, `aberturaDeBloco` e
  `blocoGerenciaDoEcos`, mais as regras de CSS deles. Está no histórico se a decisão voltar
- A aba descreve componentes que as fichas ainda não mostram. Elas seguem com recursos,
  participação e ações de gerência, e só vão receber importância, atores e atividades depois da
  leitura dos estudos primários. Enquanto isso, a Estrutura e a ficha falam de coisas diferentes,
  e é a única divergência de nome aberta no catálogo
- A natureza aparece uma vez só na Estrutura, na Identificação, como um dos três atributos.
  Ela já foi definida numa camada e retomada como critério na seguinte, e era essa a redundância
  que a reestruturação desfaz. As três perspectivas são complementares, não etapas de uma
  sequência
- A Identificação tem quatro partes, nessa ordem. O cartão de conceito, o divisor, o cartão da
  natureza e os três cartões de categoria. Os dois cartões verdes usam o mesmo `cartaoConceito`,
  com título, ícone, parágrafo e fonte numa composição só. Não leva pergunta de pesquisa, exemplo
  de conhecimento C01 a C20, número da revisão nem parágrafo de encerramento
- O cartão de abertura chama-se "Conhecimento em ECOS". Ele parte do conceito geral, que é
  fundamento de gerência do conhecimento e não achado deste trabalho, e situa o conhecimento no
  ecossistema, distribuído entre atores e artefatos. A sigla aparece ali uma vez, em "Nos ECOS",
  porque o resumo da abertura já a apresentou por extenso na mesma página
- A classificação epistemológica que vem depois continua geral, e por isso o divisor e os três
  cartões não falam de ECOS. A introdução da aba 2 segue dizendo "definição geral de conhecimento",
  que é o que a primeira frase do cartão traz
- A aba trata só do conceito e da sua classificação epistemológica. Nível no ECOS e dimensão do
  ECOS saíram dela, porque caracterizam o conhecimento e não definem o que ele é. Eles continuam
  na ficha, no bloco de classificação, e nos filtros do catálogo, então não sumiram do site. A
  camada que vai recebê-los ainda não existe
- O cartão de conceito é o primeiro item da grade, não um bloco antes dela, então herda sozinho a
  largura e o vão vertical dos três cartões de atributo. É o mesmo arranjo da nota que abre a aba
  de Atributos, e as duas usam o mesmo verde suave para as introduções da Estrutura se
  reconhecerem. O conteúdo dele mora em `cartaoIntroducao`, com `titulo`, `texto` e `referencias`
- A aba 1 não tem cabeçalho de painel, porque o título vive dentro do cartão. Quem decide isso é a
  ausência do `tituloPainel`, e hoje nenhuma das cinco abas declara um. O construtor do painel
  continua sabendo montá-lo, para quando alguma aba precisar
- Os três cartões são as três categorias da natureza epistemológica, um por categoria, e não um
  por atributo com as categorias dentro. A ordem é Explícito, Tácito-cognitivo e Tácito-técnico
- A ordem dentro do cartão é título, definição e fonte
- Entre o cartão de conceito e os três cartões vai o divisor, uma frase só, centralizada, em caixa
  alta discreta, com uma linha fina saindo para cada lado. Sem fundo, borda, sombra, ícone nem
  cartão. A frase mora em `abas[0].divisor.principal`, em caixa normal, e quem põe em maiúscula é
  o CSS, como nos outros rótulos, para o acento se preservar no dado
- A frase é "Os conhecimentos podem ser classificados por natureza epistemológica". Ela
  anuncia o critério da classificação, e não o resultado dela. A redação anterior dizia o
  resultado, que o conhecimento pode ser explícito ou tácito, e os três cartões logo abaixo já
  dizem isso sozinhos
- O divisor é `h4`, porque anuncia os três cartões e é ponto de navegação para leitor de tela
- Quem diz a hierarquia por escrito é o cartão da natureza, depois do divisor. O conhecimento é
  explícito ou tácito, e o tácito compreende componentes técnicos e cognitivos. Era a pendência
  aberta desde que a segunda linha do divisor saiu, porque os três cartões sozinhos leem como três
  categorias no mesmo nível, e o orientador tinha pedido que a distinção ficasse perceptível
- Os três cartões continuam sendo três, e é de propósito. A hierarquia é conceitual e o catálogo
  classifica os vinte conhecimentos nas três categorias operacionais, que são as mesmas do selo,
  das pastilhas e da ordenação. O cartão da natureza diz como as três se encaixam, e nenhum
  desenho de cartão tenta representar o aninhamento
- A atribuição é separada por afirmação. O cartão de abertura cita `davenport1998`, `seichter2010`
  e `viana2015`, e o cartão da natureza e as três definições citam `alavi2001`. Cada cartão carrega
  a sua, e o divisor não cita nada, porque é frase de passagem e não afirmação com fonte própria
- O cartão de abertura é o único do catálogo que repete as citações dentro do parágrafo, entre
  parênteses, além do rodapé. É pedido da autora, porque ali três obras sustentam afirmações
  diferentes da mesma passagem e o rodapé sozinho não diria qual sustenta qual
- As citações não levam página. A forma curta vem do `js/dados.js`, que guarda autor e ano, e
  nenhum ponto do catálogo mostra página. O "p. 110" das definições das três naturezas fica de
  fora por isso
- O cartão verde é compacto de propósito. O que cede é o respiro, recuo vertical de `--esp-3`,
  vão de `--esp-2` entre cabeçalho, texto e fonte, e entrelinha 1.5 no parágrafo. Nenhum corpo de
  texto encolhe, porque a prioridade declarada da aba é a compreensão dos conceitos
- `perguntaOrientadora` e `funcao` ficaram sem leitor quando o cartão passou a ser por categoria e
  não por atributo. Continuam no arquivo, sem uso. Apagar ou não é decisão da autora
- `principal` não tem leitor em módulo nenhum. Marca a natureza como entrada principal do
  catálogo, o que é verdade, mas hoje quem decide isso é a ordenação. Está no arquivo, sem uso.
  Não é duplicação, por isso ficou
- Os três cartões dividem a linha no desktop, em três colunas de largura igual. Até 992px
  empilham, porque três colunas de texto longo dariam uns 280px cada e a explicação viraria uma
  palavra por linha. No celular só o respiro interno cede, e nenhum texto encolhe ou some
- O conteúdo é longo e a aba fica alta. É troca aceita de propósito, porque encurtar o texto para
  baixar a altura tiraria o que torna os conceitos compreensíveis para quem nunca viu gerência de
  conhecimento em ECOS
- O parágrafo do cartão verde e a explicação de cada categoria são justificados, como o resto da
  prosa do site, e entram na lista de seletores do `base.css`. O cartão verde já esteve de fora,
  alinhado à esquerda como a nota da aba 2, mas é prosa corrida e não nota curta. A caixa de texto tem uns 280px no
  desktop, e numa coluna dessa largura quem segura a justificação é a hifenização, então o
  `hyphens: auto` não é opcional ali. Abaixo de 36rem as duas voltam para a esquerda, como todas
  as outras
- Nada de carrossel, aba, acordeão, modal, texto escondido com expandir nem rolagem dentro do
  cartão. Toda explicação fica visível sem interação
- `classificacoes.json` guarda dois textos por categoria, com papéis separados. `explicacao` é a
  do cartão da Identificação e `descricao` é a completa do glossário do Explorar. A `pergunta`
  de cada categoria é a linha "Responde à pergunta" da tabela do Explorar. O `definicaoBreve`, que
  existia só nas três naturezas, foi apagado por ser um terceiro texto sem leitor
- O nome da categoria é um só em todo o site, "Explícito", "Tácito-cognitivo" e "Tácito-técnico".
  Ele aparece no selo do cartão do catálogo, nas pastilhas de filtro, na classificação da ficha, no
  glossário do Explorar e na ordenação, e um nome por lugar seria pior do que a frase mais completa
  num deles
- O cartão da Identificação chegou a dizer "Conhecimento Explícito", por um `prefixoCategoria` que
  vivia na aba. O prefixo saiu, com o campo e com o parâmetro do `cartaoDeNatureza`, porque o
  divisor logo acima já diz que a aba trata da natureza do conhecimento. O título é o nome da
  categoria, igual em todo o resto do site
- A forma longa "Conhecimentos explícitos", no plural, vivia em `tituloPorta` sem nenhum módulo
  ler, e foi apagada. Não volta
- As abas são numeradas, porque a Estrutura é uma progressão e o número diz a ordem de leitura.
  A numeração vem escrita no `rotulo` de cada aba, em `meta.json`, então renumerar é editar ali
- A revisão é escrita por extenso em toda a interface, "Revisão Rápida da Literatura". A sigla RR
  não aparece em texto visível, e o nome dos campos e das funções não muda por causa disso
- A sigla ECOS é apresentada por extenso uma vez por página, na linha de abertura, e daí em diante
  só a sigla. O Sobre é a exceção, por decisão editorial: ali o subtítulo usa só a sigla, porque
  quem chega nessa página já passou pela inicial. O nome do catálogo, no `title`, na `meta description`, no `h1` da abertura e no
  rodapé, continua por extenso, porque ali é nome próprio e não texto corrido
- Na inicial quem apresenta a sigla é o resumo da abertura, em `meta.subtitulo`. O cartão de
  abertura da aba 1 escreve só "Nos ECOS", porque já é a segunda vez na mesma página. Ele chegou a
  escrever "Nos Ecossistemas de Software (ECOS)", e eram duas apresentações numa página só
- Santos e Werner (2011) apresentam as dimensões Arquitetural, Negócio e Social. O valor no dado
  continua "Técnica", que é o que a ficha, os filtros e a ordenação usam, e quem lê em tela é o
  rótulo "Arquitetural (Técnica)", por decisão do orientador. Como o nome do artigo está escrito
  na própria caixa, o rodapé não precisa mais avisar que a nomenclatura foi adaptada
- Por isso o rodapé do cartão diz só "Santos e Werner (2011)", como todos os outros cartões da
  Estrutura. O `prefixoFonte` saiu da dimensão, e hoje nenhum cartão da Estrutura declara um. O
  mecanismo continua no `fonteConceitual` e as duas regras de CSS dele continuam em
  `paginas.css`, sem declarante, para a ressalva poder voltar sem reescrever componente. Na ficha
  o `prefixoFonte` segue em uso, nas duas ajudas da gerência
- O `santos2012` continua cadastrado, sem citação em tela. Ele discute aspectos técnicos, de
  negócio e de participação da comunidade, mas não apresenta literalmente o mesmo recorte em três,
  então não foi acrescentado ao rodapé. A pendência que pedia conferência nas fontes originais está
  encerrada, porque a leitura foi feita pela autora
- A `explicacao` das três naturezas é a definição que o cartão mostra, adaptada de Alavi e Leidner
  (2001) pela autora. A `descricao` do glossário do Explorar continua a redação anterior, e as duas
  dizem a mesma coisa em registros diferentes, uma para o cartão e outra para a tabela. A de `nivel` e `dimensao` continua no arquivo mas não tem
  mais leitor, porque essas duas saíram da aba. A do `tipoEcos` é a do bloco de exemplos da aba de
  Atributos. Nenhuma é citação literal dos artigos primários. A `pergunta` continua literal
- As questões de pesquisa do artigo, QP1 a QP4, não aparecem na interface. A pergunta que o site
  mostra é a do trabalho, no topo do Sobre
- A palavra "Fonte" não aparece em cartão nenhum, e hoje a citação fica sozinha em todos eles. O
  cartão de dimensão já abriu exceção, com "Adaptado de" na frente, e ela saiu quando o rótulo
  "Arquitetural (Técnica)" passou a dizer a mesma coisa dentro da caixa
- Quando houver prefixo, ele e a citação são itens de flex, e o vão entre eles precisa medir um
  espaço de palavra, não um separador de lista, senão o prefixo se solta do nome que ele
  qualifica. A regra é presa ao cartão que tem prefixo, para as duas citações do nível
  continuarem separadas pelo vão de lista
- A Base de evidências tem dois componentes, e só eles, por orientação do professor. Estudos
  primários associados e Referências adicionais. O arranjo é o da Classificação, cartão verde
  atravessando a grade e os dois componentes dividindo a linha abaixo, com a mesma altura
- Não leva divisor. Os dois cartões são os componentes de uma mesma coisa, não as categorias de um
  critério, e um divisor os anunciaria como se fossem
- A aba explica o que cada componente é. Os estudos de cada conhecimento ficam na ficha e os
  verbetes ficam na página de referências, que é onde o dado específico mora. Repetir a lista aqui
  seria uma terceira cópia
- Os dois cartões não levam citação no pé. São componentes da estrutura metodológica deste
  catálogo, e não esquema de um autor, então não há obra para citar
- Os números da revisão saíram da aba, com o cartão da revisão, o das evidências e o dos desafios.
  A aba passou a apresentar os componentes, e não os resultados quantitativos. Saíram com eles o
  `numeroEvidencia`, o `cartaoEvidencia`, o `blocoDesafios`, o `composicaoEvidencias`, o token
  `--largura-indicador` e as regras do arranjo antigo. Estão no histórico se a decisão voltar
- Com os números saiu a citação de método, `cartaxo2018`, `cartaxo2020` e `charmaz2006`, que
  sustentava os dados da revisão e não os componentes. Saíram com ela o `agruparPorAutores`, o
  `semLink` e o `agrupar` do `fonteConceitual`, que existiam só para aquela linha. Os verbetes
  continuam cadastrados e aparecem na página de referências
- O `registrosRecuperados`, o `rotuloRecuperados` e os demais rótulos de indicador saíram do
  `meta.json` junto. Nenhum módulo os lia depois da mudança
- `classificacoes[].funcao` diz o que o atributo identifica, e é a introdução do cartão na
  Identificação
- O `lopes2026` está cadastrado com os sete autores, o título, os anais da 27th European
  Conference on Knowledge Management, 2026, e o DOI. O verbete nasceu incompleto, porque a rede da
  sessão não alcançava o DOI nem o Crossref, e a autora forneceu os dados a partir do PDF. Não tem
  página, porque o PDF não foi consultado para isso
- O vocabulário de `acaoGerencia` tem três valores, Criação e registro, Compartilhamento, e Uso e
  aplicação. Ele não aparece mais na Estrutura, só na ficha. Os oito processos de `lopes2026`, que
  a aba de Atividades apresenta, são outro esquema e não substituem esse vocabulário enquanto a
  ficha não for
  revista
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
- O bloco da ficha, a ajuda dele e, quando existir, o cartão da Estrutura que trata do mesmo
  assunto levam o mesmo nome, palavra por palavra. A ajuda não usa forma curta. Nomes diferentes
  para a mesma coisa fazem parecer que são duas, e o catálogo já teve três redações para os
  exemplos de ECOS, uma na camada, outra no bloco e outra na ajuda
- Os cinco pares hoje são "Classificação do conhecimento", "Exemplos de ECOS em que o conhecimento
  foi observado", "Gerência do conhecimento no ECOS", "Desafios relacionados à Gerência de
  Conhecimento" e "Estudos primários associados". Mexer num exige mexer no outro
- Abaixo do título do bloco de classificação vai o nome do esquema. Está provisório como "Segundo os
  esquemas adotados na revisão", à espera do nome definitivo
- A entrada principal do catálogo é a natureza do conhecimento
- Busca e filtros acontecem no cliente e vão para a query string, então o link pode ser compartilhado
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
