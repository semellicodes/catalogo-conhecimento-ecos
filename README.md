# Catálogo de Conhecimento em Ecossistemas de Software

Catálogo dos conhecimentos que precisam ser gerenciados em ECOS, construído a partir dos
resultados de uma revisão rápida da literatura com 18 estudos primários.

Reúne 20 conhecimentos (C01 a C20), 36 soluções (S01 a S36) e os estudos que sustentam cada item.

## Rodar localmente

```
python3 -m http.server
```

Depois abrir `http://localhost:8000`. O servidor é necessário porque os dados são carregados por
`fetch`, que o navegador bloqueia quando a página é aberta direto do sistema de arquivos.

## Publicar

O repositório é estático e não tem etapa de build. Em Settings, Pages, apontar para a branch `main`
e a pasta raiz. O arquivo `.nojekyll` evita que o GitHub Pages ignore arquivos iniciados por
underscore.

## Atualizar o conteúdo

Todo o conteúdo está em `dados/`. Editar o JSON e publicar, sem tocar no código. A estrutura de
cada arquivo e as regras de preenchimento estão em `CLAUDE.md`.

## Pendências

- Confirmar nos estudos primários a relação entre cada conhecimento e as soluções, hoje reunidas por
  estudo em comum, e marcar `relacoesConfirmadas` como `true` conhecimento por conhecimento
- Classificar o tipo de ECOS de cada um dos 18 estudos, segundo Manikas (2016)
- Definir a ação de gerência requerida de cada conhecimento a partir dos verbos das unidades de
  análise da QP1
- Decidir se os desafios (D01 a D17) entram como itens relacionados
