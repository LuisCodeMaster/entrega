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
A página `en/index.html` é gerada a partir do `index.html` pelo script `tools/traduz.py`. Depois de mexer no jogo, rode `python3 tools/traduz.py` pra atualizar o inglês.
