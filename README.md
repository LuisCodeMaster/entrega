# ✉️ ENTREGA! — A Jornada da Mensagem

Você é uma **mensagem** viajando de um celular pro outro: Wi-Fi de casa, torre de celular, cabo submarino, data center e o celular de destino — com um chefe no fim de cada fase.

**Jogar:** https://luiscodemaster.github.io/entrega/

## Modos
- 📞 **Telefone Sem Fio:** de 3 a 8 pessoas por link. A frase passa de pessoa em pessoa, cada um entrega jogando e reescreve o que entendeu. No fim, uma revelação animada vira vídeo vertical pra Shorts, com música e voz de robô. Tem temas, mural público com curtidas e ranking.
- 💬 **Conversa:** um chat de verdade com seu amigo, só que cada mensagem tem que ser entregue jogando. Dano estraga letras, e a mensagem fica guardada até ele abrir. Quem recebe pode tentar adivinhar o que foi escrito.
- 🎧 **Online (Piloto + Operador):** dois celulares em tempo real. O piloto guia a mensagem quase no escuro; o operador vê o radar, marca perigos e dita o código de cores que derruba o escudo dos chefes. Os papéis trocam a cada fase.
- ✍️ **Enviar / 📦 Código:** revezamento pelo WhatsApp com um código de pacote. Cada dano estraga letras da mensagem e quem recebe tem que adivinhar o que foi escrito — depois pode responder pelo caminho de volta.
- 🎯 **Treino:** as 5 fases sozinho.

Feito em HTML5 Canvas, num arquivo só. As conversas ficam no Firebase Realtime Database. O online usa [PeerJS](https://peerjs.com/) (WebRTC, conexão direta entre os aparelhos).

## Versão em inglês
A pasta `en/` é gerada a partir dos arquivos em português pelo script `tools/traduz.py`. Depois de mexer no jogo, rode `python3 tools/traduz.py` pra atualizar o inglês.

## Como o código está organizado
| Arquivo | O que tem |
|---|---|
| `index.html` | Estrutura da página e ordem dos scripts |
| `css/estilo.css` | Visual dos menus, chat, botões |
| `js/01-base.js` | Configuração, canvas, utilitários |
| `js/02-fases.js` | As 5 fases, chefes e letras da mensagem |
| `js/03-rede.js` | Modo Online (Piloto + Operador, PeerJS) |
| `js/04-telas.js` | Menus e telas, cliques dos botões |
| `js/05-conversas.js` | Modo Conversa e conexão com o Firebase |
| `js/06-perfil.js` | Pontos, personalização e ranking |
| `js/07-som.js` | Música gerada e efeitos sonoros |
| `js/08-filtro.js` | Filtro de palavrões |
| `js/09-canais.js` | Caminhos de conexão (4G, cabo, Wi-Fi…) |
| `js/10-temas.js` | Temas do Telefone Sem Fio |
| `js/11-mural.js` | Mural público e curtidas |
| `js/12-telefone.js` | Telefone Sem Fio, revelação e vídeo |
| `js/13-estado.js` … `js/17-loop.js` | Motor do jogo: estado, inimigos, física, desenho e laço principal |

Os scripts são carregados em ordem e compartilham as mesmas variáveis. Ao mudar algo, aumente o `?v=` das tags no `index.html` pra forçar o navegador a baixar a versão nova, e rode `python3 tools/traduz.py` pra atualizar a pasta `en/`.

## Admin
Pra virar admin (apagar qualquer item do mural e tirar trapaceiros do ranking), copie seu ID de jogador na tela 🎽 Visual e crie no Firebase, em Realtime Database, o caminho `admins/SEU_ID` com o valor `true`.

## Créditos
A música de fundo "Upbeat Whistle" é de AudioCopper (Pixabay). Veja [CREDITS.md](CREDITS.md).

## Licença
Todos os direitos reservados. Pode jogar e fazer vídeos citando o jogo; não pode copiar nem republicar. Veja o arquivo [LICENSE](LICENSE).
