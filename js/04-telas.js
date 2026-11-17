// ================= PAINEL =================
let aba='conversas';
function painel(html){$('card').innerHTML=html;$('painel').classList.remove('oculta')}
function fechaPainel(){$('painel').classList.add('oculta');document.activeElement&&document.activeElement.blur()}
function erro(t){const e=$('erro');if(e)e.textContent=t}
function rotaHtml(online){
  const seq=ROTAS[J.rota];
  return '<div class="rota">'+seq.map((f,i)=>{
    const minha=online?false:(J.pos<CORTE)===(i<CORTE);
    return `<span class="${i<J.pos?'feita ':''}${minha?'minha':''}">${FASES[f].chefe.emoji}</span>`}).join('')+'</div>';
}
function telaInicio(){
  if(typeof saiLobby==='function')saiLobby();
  if(typeof tel!=='undefined'){tel.tela=null;if(typeof parReveal==='function')parReveal()}
  let corpo='';
  if(aba==='conversas')corpo=htmlConversas();
  if(aba==='telefone')corpo=htmlTelefone();
  if(aba==='online'){
    if(!redeDisponivel())corpo=`<p style="font-size:14px">O modo online funciona no site do jogo, fora do Claude:</p>
      <p><a href="${SITE}" style="color:#5cf0a8;font-weight:800">${SITE}</a></p>`;
    else{
      const hash=(location.hash.match(/^#sala-([A-Z]{4})$/i)||[])[1]||'';
      corpo=`<p style="font-size:14px">Cada um no seu celular, ao mesmo tempo. Um é o <b>Piloto</b> (guia a mensagem quase no escuro) e o outro é o <b>Operador</b> (vê o radar e avisa os perigos). Liguem no WhatsApp ou no Discord pra conversar!</p>
      <label>Seu nome</label><input id="meuNome" maxlength="12" value="${esc(ls.get('entrega_nome','Luis'))}">
      ${htmlPublico()}
      <button data-a="criarSala">🏠 CRIAR SALA</button>
      <label>…ou entre na sala do seu amigo</label>
      <div class="linha"><div style="flex:2"><input id="codSala" maxlength="4" placeholder="ABCD" value="${hash.toUpperCase()}" style="text-transform:uppercase;letter-spacing:4px;font-weight:800"></div>
      <div><button data-a="entrarSala" style="margin:0;height:100%">ENTRAR</button></div></div>
      <div class="erro" id="erro"></div>`;
    }
  }
  if(aba==='enviar')corpo=`
    <p style="font-size:14px">Você escreve e leva a mensagem pelas 3 primeiras fases. Depois manda um <b>código</b> pra outra pessoa terminar. Cada dano estraga letras: ela vai ter que adivinhar o que você escreveu.</p>
    <div class="linha">
      <div><label>Seu nome</label><input id="deQuem" maxlength="12" value="${esc(ls.get('entrega_nome','Luis'))}"></div>
      <div><label>Para quem</label><input id="paraQuem" maxlength="12" value="Maria"></div>
    </div>
    <label>A mensagem</label><input id="texto" maxlength="60" value="Bora jogar hoje à noite?">
    <div class="erro" id="erro"></div>
    <button data-a="enviar">ENVIAR ➤</button>`;
  if(aba==='receber')corpo=`
    <p style="font-size:14px">Alguém te mandou um pacote? Cole aqui o texto que você recebeu.</p>
    <textarea id="codigo" rows="5" placeholder="ENT-..."></textarea>
    <div class="erro" id="erro"></div>
    <button data-a="abrir">ABRIR PACOTE 📦</button>`;
  if(aba==='treino'){corpo=`<p style="font-size:14px">Jogue qualquer fase liberada sozinho.</p><div class="fases">`+
    FASES.map((f,i)=>{const ok=i<=liberado;return `<button class="${ok?'':'bloq '}${i===nivelSel?'sel':''}" data-a="fase" data-n="${i}">${ok?f.chefe.emoji:'🔒'}<small>Fase ${i+1}</small></button>`}).join('')+
    `</div><button data-a="treinar">JOGAR FASE ${nivelSel+1}</button>`}
  painel(`<h1>✉️ ENTREGA!</h1>
    <p>Você é uma <b>mensagem</b> viajando de um celular para o outro.</p>
    <div class="perfil"><a class="lang" href="${LANG_LINK}">${LANG_TXT}</a><span>⭐ ${perfil.pts}</span><button data-a="visual">🎽 Visual</button><button data-a="ranking">🏆 Ranking</button><button data-a="mural">📊 Mural</button><button data-a="som">${AU.mudo?'🔇':'🔊'}</button><button data-a="musica" class="${AU.estiloMusica==='off'?'desl':''}" title="Música">🎵</button></div>
    <button class="lobbyBtn" data-a="lobby">🌍 LOBBY · salas abertas pra entrar</button>
    <div class="abas" style="grid-template-columns:repeat(3,1fr)">
      <button class="${aba==='conversas'?'on':''}" data-a="aba" data-n="conversas">💬<br>Conversa</button>
      <button class="${aba==='telefone'?'on':''}" data-a="aba" data-n="telefone">📞<br>Telefone</button>
      <button class="${aba==='online'?'on':''}" data-a="aba" data-n="online">🎧<br>Online</button>
      <button class="${aba==='enviar'?'on':''}" data-a="aba" data-n="enviar">✍️<br>Enviar</button>
      <button class="${aba==='receber'?'on':''}" data-a="aba" data-n="receber">📦<br>Código</button>
      <button class="${aba==='treino'?'on':''}" data-a="aba" data-n="treino">🎯<br>Treino</button>
    </div>${corpo}
    <div class="dica">Celular: arraste o dedo (melhor deitado). PC: setas / WASD.<br>Pegue 📶, desvie de 🦠 🔥 📧. No chefe, você atira ✓ sozinho.</div>`);
}
// ---- online: salas ----
function telaSalaCriada(){
  if(!net.lobbyId)lobbyPublicaOnline();
  const link=SITE+'#sala-'+net.sala;
  const share=`🎧 Bora jogar ENTREGA comigo! Abre esse link e entra na sala ${net.sala}:\n${link}`;
  painel(`<div class="grande">🏠</div><h2>Sala criada!</h2><p>Passe o código pro seu amigo:</p>
    <div class="sala">${net.sala}</div>
    <textarea id="share" rows="3" readonly>${esc(share)}</textarea>
    <button class="sec" data-a="copiar">📋 COPIAR CONVITE</button>
    <div class="erro" id="erro"></div>
    <p style="font-size:14px;margin-top:10px">⏳ Esperando seu amigo entrar…${lobbyPublico?'<br>🌍 Sua sala está aparecendo no Lobby.':''}</p>
    <button class="sec" data-a="sairOnline">CANCELAR</button>`);
}
let pilotoEscolha='host';
function telaLobbyHost(){
  painel(`<div class="grande">🤝</div><h2 class="ok">${esc(net.outroNome)} entrou!</h2>
    <p style="font-size:14px">Escreva a mensagem. Só ${esc(net.outroNome)} vai ver no final, e vai ter que adivinhar o que sobrou dela.</p>
    <label>A mensagem para ${esc(net.outroNome)}</label><input id="texto" maxlength="60" value="${esc(ls.get('entrega_ultimo','Bora jogar hoje à noite?'))}">
    <label>Quem pilota a fase 1? (vocês trocam a cada fase)</label>
    <div class="papeis">
      <button class="${pilotoEscolha==='host'?'on':''}" data-a="piloto" data-n="host">🕹️ Eu piloto</button>
      <button class="${pilotoEscolha==='guest'?'on':''}" data-a="piloto" data-n="guest">🕹️ ${esc(net.outroNome)}</button>
    </div>
    <div class="erro" id="erro"></div>
    <button data-a="comecarOnline">COMEÇAR ➤</button>
    <button class="sec" data-a="sairOnline">SAIR DA SALA</button>`);
  envia({t:'lobby'});
}
function telaLobbyGuest(){
  painel(`<div class="grande">🤝</div><h2 class="ok">Conectado com ${esc(net.outroNome)}!</h2>
    <p>${esc(net.outroNome)} está escrevendo uma mensagem pra você…<br>Liguem no WhatsApp ou no Discord pra conversar durante o jogo.</p>
    <p style="font-size:14px">🕹️ <b>Piloto:</b> guia a mensagem no escuro e aperta as cores do escudo do chefe.<br>📡 <b>Operador:</b> vê tudo, toca na tela pra marcar perigos e dita o código de cores.</p>
    <button class="sec" data-a="sairOnline">SAIR DA SALA</button>`);
}
function nomePiloto(p){return p===net.role?'Você':net.outroNome}
function telaOnlineFaseOk(chefe){
  const prox=net.piloto==='host'?'guest':'host';
  painel(`<div class="grande">${chefe||'✅'}</div><h2 class="ok">Fase ${J.pos} vencida!</h2>
    ${rotaHtml(true)}
    <p style="font-size:14px">Mensagem ${pctInteiro()}% inteira · ${J.vidas} ✉️ vidas</p>
    <p>Próxima fase: <b>${FASES[ROTAS[J.rota][J.pos]].nome}</b><br>🕹️ Piloto: <b>${esc(nomePiloto(prox))}</b></p>
    <button data-a="proxOnline">PRÓXIMA FASE ➤</button>
    <button class="sec" data-a="sairOnline">SAIR DA SALA</button>`);
}
function telaOnlinePerdeu(motivo){
  painel(`<div class="grande">⚠️</div><h2 class="ruim">A mensagem se perdeu!</h2>
    <p>${motivo==='sinal'?'O sinal acabou':'Ela foi corrompida'} em <b>${FASES[ROTAS[J.rota][J.pos]].nome}</b>.</p>
    <p style="font-size:14px">Dá pra reenviar dessa fase (com o mesmo piloto), mas a mensagem estraga mais.</p>
    <button data-a="reenviarOnline">🔁 REENVIAR</button>
    <button class="sec" data-a="sairOnline">SAIR DA SALA</button>`);
}
function telaOnlineChegou(){
  if(net.role==='guest')return telaChegou(true);
  painel(`<div class="grande">📱</div><h2 class="ok">Entregue!</h2><p>A mensagem chegou ${pctInteiro()}% inteira no celular de ${esc(net.outroNome)}.</p>
    <div class="bolha cinza">${esc(textoEstragado())}</div>
    <p>⏳ Esperando ${esc(net.outroNome)} adivinhar o que você escreveu…</p>`);
}
// ---- telas código/treino ----
function telaPacoteAberto(){
  const seq=ROTAS[J.rota];
  painel(`<div class="grande">📦</div><h2>Pacote de ${esc(J.de)}</h2>
    <p>Uma mensagem ${J.rota==='volta'?'de resposta ':''}para <b>${esc(J.para)}</b> parou no meio do caminho e precisa de você pra chegar.</p>
    ${rotaHtml()}
    <div class="bolha cinza">${esc(textoEstragado())}</div>
    <p style="font-size:14px">${pctInteiro()}% inteira · ${J.vidas} ✉️ vidas · Faltam ${seq.length-J.pos} fases</p>
    <button data-a="continuar">CONTINUAR ENTREGA ➤</button>
    <button class="sec" data-a="menu">MENU</button>`);
}
function telaFaseOk(){
  const f=FASES[ROTAS[J.rota][J.pos-1]];
  painel(`<div class="grande">${f.chefe.emoji}</div><h2>${esc(f.chefe.nome)} derrotado!</h2>
    ${rotaHtml()}
    <div class="bolha cinza">${esc(textoEstragado())}</div>
    <p style="font-size:14px">Mensagem ${pctInteiro()}% inteira · +1 vida (${J.vidas} ✉️)</p>
    <button data-a="continuar">PRÓXIMA FASE ➤</button>
    <button class="sec" data-a="menu">MENU</button>`);
}
function telaPassar(){
  const cod=codifica(J),prox=FASES[ROTAS[J.rota][J.pos]];
  const share=`✉️ ${J.de} te mandou uma mensagem no jogo ENTREGA! Ela chegou até ${prox.nome} e agora só você pode terminar a entrega.\n\nAbra o jogo: ${LINK}\nVá em "📦 Código" e cole isto:\n${cod}`;
  painel(`<div class="grande">📤</div><h2>Sua parte acabou!</h2>
    <p>Agora é com <b>${esc(J.para)}</b>. Mande o pacote pelo WhatsApp ou onde quiser.</p>
    ${rotaHtml()}
    <div class="bolha cinza">${esc(textoEstragado())}</div>
    <p style="font-size:14px">Chegou ${pctInteiro()}% inteira na metade do caminho.</p>
    <textarea id="share" rows="5" readonly>${esc(share)}</textarea>
    <button data-a="copiar">📋 COPIAR PACOTE</button>
    <div class="erro" id="erro"></div>
    <button class="sec" data-a="menu">MENU</button>`);
}
function telaChegou(online){
  painel(`<div class="grande">📱</div><h2 class="ok">Chegou pra você, ${esc(J.para)}!</h2>
    <p>Mas a mensagem de <b>${esc(J.de)}</b> se estragou no caminho:</p>
    <div class="bolha">${esc(textoEstragado())}</div>
    <label>O que você acha que ${esc(J.de)} escreveu?</label>
    <input id="palpite" maxlength="80" value="${esc(textoEstragado().replace(/_/g,''))}">
    <button data-a="${online?'conferirOnline':'conferir'}">CONFERIR ✓✓</button>`);
}
function telaResultado(palpite,online){
  const p=parecido(palpite,J.txt);
  const nota=p>=95?'🏆 Entendeu tudo!':p>=75?'👍 Quase lá!':p>=50?'🤔 Mais ou menos...':'😵 Telefone sem fio total!';
  const pontos=J.pts+p*10;
  const share=`✓✓ Recebi sua mensagem no ENTREGA!\nChegou assim: "${textoEstragado()}"\nEu entendi: "${palpite}"\nAcertei ${p}% (${pontos} pts). Era isso? 😅`;
  J.resultado={palpite,p};
  const quem=online&&net.role==='host'?esc(net.outroNome)+' entendeu':'Você entendeu';
  painel(`<h2>${nota}</h2>
    <p style="font-size:14px">${quem}:</p><div class="bolha cinza">${esc(palpite)}</div>
    <p style="font-size:14px">${esc(J.de)} escreveu de verdade:</p><div class="bolha">${esc(J.txt)} <span class="checks">✓✓</span></div>
    <div class="stats"><div><b>${p}%</b>acerto</div><div><b>${pctInteiro()}%</b>inteira</div><div><b>${pontos}</b>pontos</div></div>
    ${online?`<button data-a="voltaSala">🔁 JOGAR DE NOVO</button><button class="sec" data-a="sairOnline">SAIR DA SALA</button>`:
    `<p style="font-size:14px">Conta pra ${esc(J.de)} se você acertou:</p>
    <textarea id="share" rows="4" readonly>${esc(share)}</textarea>
    <button class="sec" data-a="copiar">📋 COPIAR RESULTADO</button>
    <div class="erro" id="erro"></div>
    <button class="rosa" data-a="responder">↩️ RESPONDER ${esc(J.de.toUpperCase())}</button>
    <button class="sec" data-a="menu">MENU</button>`}`);
}
function telaResponder(){
  painel(`<div class="grande">↩️</div><h2>Responder ${esc(J.de)}</h2>
    <p style="font-size:14px">Sua resposta faz o caminho de volta: começa no seu celular, passa pelo Hacker e pelo Firewall e chega no Wi-Fi da casa de ${esc(J.de)}.</p>
    <label>Sua resposta</label><input id="texto" maxlength="60" placeholder="Bora! Que horas?">
    <div class="erro" id="erro"></div>
    <button class="rosa" data-a="enviarResposta">ENVIAR RESPOSTA ➤</button>
    <button class="sec" data-a="menu">MENU</button>`);
}
function telaPerdeu(motivo){
  const f=FASES[ROTAS[J.rota][J.pos]];
  painel(`<div class="grande">⚠️</div><h2 class="ruim">A mensagem se perdeu!</h2>
    <p>${motivo==='sinal'?'O sinal acabou':'Ela foi corrompida'} em <b>${f.nome}</b>.</p>
    <div class="bolha cinza">${esc(textoEstragado())}</div>
    <p style="font-size:14px">Dá pra reenviar dessa fase, mas cada reenvio estraga mais letras.</p>
    <button data-a="reenviar">🔁 REENVIAR</button>
    <button class="sec" data-a="menu">DESISTIR</button>`);
}
function telaTreinoFim(ok,motivo){
  const b=st.bossNome||st.f.chefe.nome;
  painel(ok?`<div class="grande">${st.bossEmoji}</div><h2 class="ok">${esc(b)} derrotado!</h2>
     <p>${st.n<FASES.length-1?'Fase '+(st.n+2)+' liberada no treino.':'Você zerou todas as fases!'}</p>
     ${st.n<FASES.length-1?'<button data-a="treinoProx">PRÓXIMA FASE ➤</button>':''}
     <button class="sec" data-a="menu">MENU</button>`
    :`<div class="grande">⚠️</div><h2 class="ruim">Não deu!</h2><p>${motivo==='sinal'?'O sinal acabou.':'A mensagem foi corrompida.'}</p>
     <button data-a="treinoDeNovo">TENTAR DE NOVO</button><button class="sec" data-a="menu">MENU</button>`);
}
async function copiar(){
  const ta=$('share');if(!ta)return;
  try{await navigator.clipboard.writeText(ta.value);erro('');const b=document.querySelector('[data-a="copiar"]');if(b)b.textContent='✓ COPIADO!'}
  catch(e){ta.focus();ta.select();erro('Não deu pra copiar sozinho: o texto foi selecionado, copie manualmente.')}
}

$('card').addEventListener('click',e=>{
  const b=e.target.closest('[data-a]');if(!b)return;sfx('clique');const a=b.dataset.a,n=b.dataset.n;
  if(a==='aba'){aba=n;telaInicio()}
  if(a==='fase'){if(+n<=liberado){nivelSel=+n;telaInicio()}}
  if(a==='treinar'||a==='treinoDeNovo'){modo='treino';J=null;jogar(a==='treinar'?nivelSel:st.n)}
  if(a==='treinoProx'){modo='treino';nivelSel=st.n+1;jogar(nivelSel)}
  if(a==='enviar'){
    const de=limpaTexto($('deQuem').value.trim()),para=limpaTexto($('paraQuem').value.trim()),t=limpaEntrada($('texto').value.trim());
    if(!de||!para)return erro('Preencha os dois nomes.');if(t.replace(/ /g,'').length<3)return erro('Escreva uma mensagem um pouco maior.');
    ls.set('entrega_nome',de);J=novaJornada(de,para,t,'ida');modo='jornada';escolheCanal(t,jogarJ,()=>telaInicio());
  }
  if(a==='abrir'){
    const o=decodifica($('codigo').value);if(!o)return erro('Código inválido. Confira se copiou tudo, começando em ENT-');
    if(o.pos>=ROTAS[o.rota].length)return erro('Esse pacote já foi entregue.');
    J=o;modo='jornada';telaPacoteAberto();
  }
  if(a==='continuar')escolheCanal(J.txt,jogarJ,()=>J.pos?telaFaseOk():telaPacoteAberto());
  if(a==='reenviar'){J.falhas++;corromper(perdaPorDano()*2);J.vidas=3;J.sinal=100;jogarJ()}
  if(a==='copiar')copiar();
  if(a==='conferir'){const p=$('palpite').value.trim();if(!p)return;telaResultado(p)}
  if(a==='responder')telaResponder();
  if(a==='enviarResposta'){
    const t=limpaEntrada($('texto').value.trim());if(t.replace(/ /g,'').length<3)return erro('Escreva uma resposta um pouco maior.');
    const rota=J.rota==='ida'?'volta':'ida';J=novaJornada(J.para,J.de,t,rota,J.rodada+1);modo='jornada';jogarJ();
  }
  if(a==='menu')menu();
  if(a.startsWith('tel')){telAcao(a,n);return}
  if(['novaConv','entrarConv','abrirConv','entrarConvLink','tentarChat','cancelarChat','lixoConv','remConv','remConvTudo'].includes(a)){acaoConversa(a,n);return}
  if(a==='canal'){canalAtual=n;ls.set('entrega_canal',n);fechaPainel();if(canalCb)canalCb();return}
  if(a==='rolSorte'){roleta(canalTxt,null);return}
  if(a==='rolJoga'){if(!rolFim)return;canalAtual=rolFim.id;fechaPainel();if(canalCb)canalCb();return}
  if(a==='canalBloq'){toast('🔵 Bluetooth só leva mensagem de até 20 letras');return}
  if(a==='canalVolta'){canalAtual=null;fechaPainel();if(canalVolta)canalVolta();return}
  if(a==='visual')telaVisual();
  if(a==='skin'){const [k,v]=n.split(':');perfil[k]=v;salvaPerfil();telaVisual()}
  if(a==='nada'){const it=[...CORES_ENV,...RASTROS,...CARAS].find(x=>n.endsWith(':'+x.id));if(it)toast('🔒 Precisa de '+it.p+' pontos')}
  if(a==='ranking')telaRanking();
  if(a==='mural'){muralAba='top';telaMural()}
  if(a==='som'){alternaSom();telaInicio()}
  if(a==='musica'){toast(alternaMusica());telaInicio()}
  if(['muralAba','curtir','muralEsconde','muralApaga'].includes(a)){muralAcao(a,n);return}
  if(a.startsWith('lobby')||a==='publico'){lobbyAcao(a,n);return}
  if(a==='rankAba'){rankAba=n;telaRanking()}
  if(a==='rankApaga'){fb.api.rankApagar(n).then(()=>{toast('🗑️ Removido do ranking');telaRanking()}).catch(()=>toast('⚠️ Sem permissão de admin'));return}
  if(a==='copiarId'){const t=fb.uid||'';navigator.clipboard&&navigator.clipboard.writeText(t).then(()=>toast('📋 ID copiado'),()=>toast(t));return}
  // online
  if(a==='criarSala'||a==='entrarSala'){
    net.meuNome=limpaTexto(($('meuNome').value.trim()||'Jogador').slice(0,12));ls.set('entrega_nome',net.meuNome);
    if(a==='criarSala'){erro('Criando sala…');criarSala()}
    else{const c=$('codSala').value.trim().toUpperCase();if(!/^[A-Z]{4}$/.test(c))return erro('O código tem 4 letras.');erro('Entrando…');entrarSala(c)}
  }
  if(a==='piloto'){const t=$('texto').value;pilotoEscolha=n;telaLobbyHost();$('texto').value=t}
  if(a==='comecarOnline'){
    const t=limpaEntrada($('texto').value.trim());if(t.replace(/ /g,'').length<3)return erro('Escreva uma mensagem um pouco maior.');
    ls.set('entrega_ultimo',t);J=novaJornada(net.meuNome,net.outroNome,t,'ida');
    envia({t:'start',J,piloto:pilotoEscolha});comecaOnline(pilotoEscolha);
  }
  if(a==='proxOnline'){const p=net.piloto==='host'?'guest':'host';envia({t:'start',J,piloto:p});comecaOnline(p)}
  if(a==='reenviarOnline'){J.falhas++;corromper(perdaPorDano()*2);J.vidas=3;J.sinal=100;envia({t:'start',J,piloto:net.piloto});comecaOnline(net.piloto)}
  if(a==='conferirOnline'){const p=$('palpite').value.trim();if(!p)return;envia({t:'palpite',palpite:p,p:parecido(p,J.txt)});telaResultado(p,true)}
  if(a==='voltaSala'){envia({t:'sala'});voltaSala()}
  if(a==='sairOnline'){fechaRede();menu()}
});
function voltaSala(){modo='treino';fixo=false;resize();mostraCtrl();if(net.role==='host')telaLobbyHost();else telaLobbyGuest();novo(0);st.estado='parado'}
