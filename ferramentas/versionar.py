#!/usr/bin/env python3
"""Aplica uma versão única a tudo que o navegador guarda em cache.

O site não tem etapa de build. Este script não gera nada, só troca o ?v= do
CSS, do JS, dos imports entre módulos e dos arquivos de dados, numa passada
só, para as versões não desencontrarem e o navegador não servir metade nova
e metade velha.

    python3 ferramentas/versionar.py 20261103-7

O index.html e as demais páginas não levam ?v=, porque são o endereço que a
pessoa abre. Elas levam a versão numa meta, e o js/versao.js compara essa meta
com o versao.json para recarregar sozinho um HTML que ficou para trás. Por isso
a meta e o versao.json entram nesta mesma passada, senão o guarda desencontra e
recarrega a página para sempre.
"""

import glob
import os
import re
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ALVOS = (
    ('*.html', r'((?:css|js)/[a-z]+\.(?:css|js))(?:\?v=[0-9A-Za-z.-]+)?(?=")'),
    ('js/*.js', r"(\./[a-z]+\.js)(?:\?v=[0-9A-Za-z.-]+)?(?=')"),
    ('*.html', r'(<meta name="versao" content=")[^"]*(?=">)'),
)


def aplicar(versao):
    os.chdir(RAIZ)
    tocados = []

    for padrao_de_arquivo, padrao in ALVOS:
        for caminho in glob.glob(padrao_de_arquivo):
            texto = open(caminho, encoding='utf-8').read()
            if 'name="versao"' in padrao:
                novo = re.sub(padrao, lambda m: f'{m.group(1)}{versao}', texto)
            else:
                novo = re.sub(padrao, lambda m: f'{m.group(1)}?v={versao}', texto)
            if novo != texto:
                open(caminho, 'w', encoding='utf-8').write(novo)
                tocados.append(caminho)

    # A versão dos arquivos de dados é uma constante só, dentro do dados.js.
    texto = open('js/dados.js', encoding='utf-8').read()
    novo = re.sub(r"const VERSAO = '[^']*';", f"const VERSAO = '{versao}';", texto)
    if novo != texto:
        open('js/dados.js', 'w', encoding='utf-8').write(novo)
        if 'js/dados.js' not in tocados:
            tocados.append('js/dados.js')

    # O guarda de versão lê este arquivo sem cache para saber se o HTML
    # guardado pelo navegador ficou para trás.
    with open('versao.json', 'w', encoding='utf-8') as arquivo:
        arquivo.write(f'{{ "versao": "{versao}" }}\n')
    tocados.append('versao.json')

    return tocados


if __name__ == '__main__':
    if len(sys.argv) != 2:
        raise SystemExit('uso: python3 ferramentas/versionar.py <versao>')
    nomes = aplicar(sys.argv[1])
    print(f'versão {sys.argv[1]} aplicada em {len(nomes)} arquivos')
