#!/usr/bin/env python3
"""Sobe a versão do jogo em todos os lugares de uma vez e regenera a pasta en/.
Uso: python3 tools/nova_versao.py
- ?v= nas tags de script/css do index.html (o navegador baixa os arquivos novos)
- VERSAO em js/01-base.js e version.json (quem está com o jogo aberto vê o aviso de versão nova)"""
import os, re, subprocess, json
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
base = open(os.path.join(R, 'js/01-base.js'), encoding='utf-8').read()
atual = int(re.search(r'const VERSAO=(\d+);', base).group(1))
nova = atual + 1
open(os.path.join(R, 'js/01-base.js'), 'w', encoding='utf-8').write(base.replace(f'const VERSAO={atual};', f'const VERSAO={nova};'))
idx = open(os.path.join(R, 'index.html'), encoding='utf-8').read()
open(os.path.join(R, 'index.html'), 'w', encoding='utf-8').write(re.sub(r'\?v=\d+', f'?v={nova}', idx))
json.dump({'v': nova}, open(os.path.join(R, 'version.json'), 'w'))
subprocess.run(['python3', os.path.join(R, 'tools/traduz.py')], check=True)
print(f'versão {atual} → {nova}')
