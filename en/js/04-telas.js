// ================= PAINEL =================
let aba='conversas';
function painel(html){const p=$('painel'),c=$('card'),abrindo=p.classList.contains('oculta');c.innerHTML=html;p.classList.remove('oculta');
  if(abrindo){c.classList.remove('entra');void c.offsetWidth;c.classList.add('entra')}}
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
    if(!redeDisponivel())corpo=`<p style="font-size:14px">Online mode works on the game website:</p>
      <p><a href="${SITE}" style="color:#5cf0a8;font-weight:800">${SITE}</a></p>`;
    else{
      const hash=(location.hash.match(/^#sala-([A-Z]{4})$/i)||[])[1]||'';
      corpo=`<p style="font-size:14px">Each on your own phone, at the same time. One is the <b>Pilot</b> (guides the message almost in the dark) and the other is the <b>Operator</b> (sees the radar and warns about dangers). Use the in-game signals or a call!</p>
      <label>Your name</label><input id="meuNome" maxlength="12" value="${esc(ls.get('entrega_nome','Luis'))}">
      ${htmlPublico()}
      <button data-a="criarSala">🏠 CREATE ROOM</button>
      <label>…or join your friend's room</label>
      <div class="linha"><div style="flex:2"><input id="codSala" maxlength="4" placeholder="ABCD" value="${hash.toUpperCase()}" style="text-transform:uppercase;letter-spacing:4px;font-weight:800"></div>
      <div><button data-a="entrarSala" style="margin:0;height:100%">JOIN</button></div></div>
      <div class="erro" id="erro"></div>`;
    }
  }
  if(aba==='enviar')corpo=`
    <p style="font-size:14px">You write and carry the message through the first 3 stages. Then send a <b>code</b> so another person finishes the delivery. Every hit breaks letters: they will have to guess what you wrote.</p>
    <div class="linha">
      <div><label>Your name</label><input id="deQuem" maxlength="12" value="${esc(ls.get('entrega_nome','Luis'))}"></div>
      <div><label>To</label><input id="paraQuem" maxlength="12" value="Maria"></div>
    </div>
    <label>The message</label><input id="texto" maxlength="60" value="Wanna play tonight?">
    <div class="erro" id="erro"></div>
    <button data-a="enviar">SEND ➤</button>`;
  if(aba==='receber')corpo=`
    <p style="font-size:14px">Someone sent you a package? Paste the text you got here.</p>
    <textarea id="codigo" rows="5" placeholder="ENT-..."></textarea>
    <div class="erro" id="erro"></div>
    <button data-a="abrir">OPEN PACKAGE 📦</button>`;
  if(aba==='treino'){corpo=`<p style="font-size:14px">Play any unlocked stage on your own.</p><div class="fases">`+
    FASES.map((f,i)=>{const ok=i<=liberado;return `<button class="${ok?'':'bloq '}${i===nivelSel?'sel':''}" data-a="fase" data-n="${i}">${ok?f.chefe.emoji:'🔒'}<small>Stage ${i+1}</small></button>`}).join('')+
    `</div><button data-a="treinar">PLAY STAGE ${nivelSel+1}</button>`}
  painel(`<h1 class="logo"><span class="env">✉️</span><span class="txt">ENTREGA!</span></h1>
    <div class="tag">THE MESSAGE'S JOURNEY</div>
    <p>You are a <b>message</b> traveling from one phone to another.</p>
    <div class="perfil topo"><a class="lang" href="${LANG_LINK}">${LANG_TXT}</a><span class="pts">⭐ ${perfil.pts}</span><button data-a="visual">🎽 Visual</button><button data-a="ranking">🏆 Ranking</button><button data-a="mural">📊 Wall</button><button data-a="som">${AU.mudo?'🔇':'🔊'}</button><button data-a="musica" class="${AU.estiloMusica==='off'?'desl':''}" title="Music">🎵</button></div>
    <button class="lobbyBtn" data-a="lobby">🌍 LOBBY · open rooms to join</button>
    <div class="abas modos" style="grid-template-columns:repeat(3,1fr)">
      <button class="${aba==='conversas'?'on':''}" data-a="aba" data-n="conversas">💬<br>Chat</button>
      <button class="${aba==='telefone'?'on':''}" data-a="aba" data-n="telefone">📞<br>Telephone</button>
      <button class="${aba==='online'?'on':''}" data-a="aba" data-n="online">🎧<br>Online</button>
      <button class="${aba==='enviar'?'on':''}" data-a="aba" data-n="enviar">✍️<br>Send</button>
      <button class="${aba==='receber'?'on':''}" data-a="aba" data-n="receber">📦<br>Code</button>
      <button class="${aba==='treino'?'on':''}" data-a="aba" data-n="treino">🎯<br>Practice</button>
    </div>${corpo}
    <div class="dica comoJoga">Phone: drag your finger (best in landscape). PC: arrows / WASD.<br>Grab 📶, dodge 🦠 🔥 📧. Against bosses you shoot ✓ automatically.</div>`);
}
// ---- online: salas ----
function telaSalaCriada(){
  if(!net.lobbyId)lobbyPublicaOnline();
  const link=SITE+'#sala-'+net.sala;
  const share=`🎧 Let's play ENTREGA together! Open this link and join room ${net.sala}:\n${link}`;
  painel(`<div class="grande">🏠</div><h2>Room created!</h2><p>Give this code to your friend:</p>
    <div class="sala">${net.sala}</div>
    <textarea id="share" rows="3" readonly>${esc(share)}</textarea>
    <button class="sec" data-a="copiar">📋 COPY INVITE</button>
    <div class="erro" id="erro"></div>
    <p style="font-size:14px;margin-top:10px">⏳ Waiting for your friend…${lobbyPublico?'<br>🌍 Your room is showing in the Lobby.':''}</p>
    <button class="sec" data-a="sairOnline">CANCEL</button>`);
}
let pilotoEscolha='host';
function telaLobbyHost(){
  painel(`<div class="grande">🤝</div><h2 class="ok">${esc(net.outroNome)} joined!</h2>
    <p style="font-size:14px">Write the message. Only ${esc(net.outroNome)} will see it at the end, and will have to guess what is left of it.</p>
    <label>The message for ${esc(net.outroNome)}</label><input id="texto" maxlength="60" value="${esc(ls.get('entrega_ultimo','Wanna play tonight?'))}">
    <label>Who pilots stage 1? (you swap every stage)</label>
    <div class="papeis">
      <button class="${pilotoEscolha==='host'?'on':''}" data-a="piloto" data-n="host">🕹️ Me</button>
      <button class="${pilotoEscolha==='guest'?'on':''}" data-a="piloto" data-n="guest">🕹️ ${esc(net.outroNome)}</button>
    </div>
    <div class="erro" id="erro"></div>
    <button data-a="comecarOnline">START ➤</button>
    <button class="sec" data-a="sairOnline">LEAVE ROOM</button>`);
  envia({t:'lobby'});
}
function telaLobbyGuest(){
  painel(`<div class="grande">🤝</div><h2 class="ok">Connected with ${esc(net.outroNome)}!</h2>
    <p>${esc(net.outroNome)} is writing a message for you…<br>Use the in-game signals (or a call) to talk during the game.</p>
    <p style="font-size:14px">🕹️ <b>Pilot:</b> guides the message in the dark and presses the boss shield colors.<br>📡 <b>Operator:</b> sees everything, taps to mark dangers and tells the color code.</p>
    <button class="sec" data-a="sairOnline">LEAVE ROOM</button>`);
}
function nomePiloto(p){return p===net.role?'You':net.outroNome}
function telaOnlineFaseOk(chefe){
  const prox=net.piloto==='host'?'guest':'host';
  painel(`<div class="grande">${chefe||'✅'}</div><h2 class="ok">Stage ${J.pos} cleared!</h2>
    ${rotaHtml(true)}
    <p style="font-size:14px">Message ${pctInteiro()}% intact · ${J.vidas} ✉️ lives</p>
    <p>Next stage: <b>${FASES[ROTAS[J.rota][J.pos]].nome}</b><br>🕹️ Pilot: <b>${esc(nomePiloto(prox))}</b></p>
    <button data-a="proxOnline">NEXT STAGE ➤</button>
    <button class="sec" data-a="sairOnline">LEAVE ROOM</button>`);
}
function telaOnlinePerdeu(motivo){
  painel(`<div class="grande">⚠️</div><h2 class="ruim">The message got lost!</h2>
    <p>${motivo==='sinal'?'The signal ran out':'It got corrupted'} in <b>${FASES[ROTAS[J.rota][J.pos]].nome}</b>.</p>
    <p style="font-size:14px">You can resend from this stage (same pilot), but the message breaks more.</p>
    <button data-a="reenviarOnline">🔁 RESEND</button>
    <button class="sec" data-a="sairOnline">LEAVE ROOM</button>`);
}
function telaOnlineChegou(){
  if(net.role==='guest')return telaChegou(true);
  painel(`<div class="grande">📱</div><h2 class="ok">Delivered!</h2><p>The message arrived ${pctInteiro()}% intact on ${esc(net.outroNome)}'s phone.</p>
    <div class="bolha cinza">${esc(textoEstragado())}</div>
    <p>⏳ Waiting for ${esc(net.outroNome)} to guess what you wrote…</p>`);
}
// ---- telas código/treino ----
function telaPacoteAberto(){
  const seq=ROTAS[J.rota];
  painel(`<div class="grande">📦</div><h2>Package from ${esc(J.de)}</h2>
    <p>A ${J.rota==='volta'?'reply ':''}message for <b>${esc(J.para)}</b> stopped halfway and needs you to arrive.</p>
    ${rotaHtml()}
    <div class="bolha cinza">${esc(textoEstragado())}</div>
    <p style="font-size:14px">${pctInteiro()}% intact · ${J.vidas} ✉️ lives · ${seq.length-J.pos} stages left</p>
    <button data-a="continuar">CONTINUE DELIVERY ➤</button>
    <button class="sec" data-a="menu">MENU</button>`);
}
function telaFaseOk(){
  const f=FASES[ROTAS[J.rota][J.pos-1]];
  painel(`<div class="grande">${f.chefe.emoji}</div><h2>${esc(f.chefe.nome)} defeated!</h2>
    ${rotaHtml()}
    <div class="bolha cinza">${esc(textoEstragado())}</div>
    <p style="font-size:14px">Message ${pctInteiro()}% intact · +1 life (${J.vidas} ✉️)</p>
    <button data-a="continuar">NEXT STAGE ➤</button>
    <button class="sec" data-a="menu">MENU</button>`);
}
function telaPassar(){
  const cod=codifica(J),prox=FASES[ROTAS[J.rota][J.pos]];
  const share=`✉️ ${J.de} sent you a message in the game ENTREGA! It got to ${prox.nome} and now only you can finish the delivery.\n\nOpen the game: ${LINK}\nGo to "📦 Code" and paste this:\n${cod}`;
  painel(`<div class="grande">📤</div><h2>Your part is done!</h2>
    <p>Now it is up to <b>${esc(J.para)}</b>. Send the package on WhatsApp or anywhere.</p>
    ${rotaHtml()}
    <div class="bolha cinza">${esc(textoEstragado())}</div>
    <p style="font-size:14px">It reached halfway ${pctInteiro()}% intact.</p>
    <textarea id="share" rows="5" readonly>${esc(share)}</textarea>
    <button data-a="copiar">📋 COPY PACKAGE</button>
    <div class="erro" id="erro"></div>
    <button class="sec" data-a="menu">MENU</button>`);
}
function telaChegou(online){
  painel(`<div class="grande">📱</div><h2 class="ok">It arrived, ${esc(J.para)}!</h2>
    <p>But <b>${esc(J.de)}</b>'s message got broken on the way:</p>
    <div class="bolha">${esc(textoEstragado())}</div>
    <label>What do you think ${esc(J.de)} wrote?</label>
    <input id="palpite" maxlength="80" value="${esc(textoEstragado().replace(/_/g,''))}">
    <button data-a="${online?'conferirOnline':'conferir'}">CHECK ✓✓</button>`);
}
function telaResultado(palpite,online){
  const p=parecido(palpite,J.txt);
  const nota=p>=95?'🏆 Nailed it!':p>=75?'👍 Almost there!':p>=50?'🤔 Kind of...':'😵 Totally garbled!';
  const pontos=J.pts+p*10;
  const share=`✓✓ Got your message on ENTREGA!\nIt arrived like this: "${textoEstragado()}"\nI understood: "${palpite}"\nI got ${p}% right (${pontos} pts). Was that it? 😅`;
  J.resultado={palpite,p};
  const quem=online&&net.role==='host'?esc(net.outroNome)+' understood':'You understood';
  painel(`<h2>${nota}</h2>
    <p style="font-size:14px">${quem}:</p><div class="bolha cinza">${esc(palpite)}</div>
    <p style="font-size:14px">${esc(J.de)} actually wrote:</p><div class="bolha">${esc(J.txt)} <span class="checks">✓✓</span></div>
    <div class="stats"><div><b>${p}%</b>right</div><div><b>${pctInteiro()}%</b>intact</div><div><b>${pontos}</b>points</div></div>
    ${online?`<button data-a="voltaSala">🔁 PLAY AGAIN</button><button class="sec" data-a="sairOnline">LEAVE ROOM</button>`:
    `<p style="font-size:14px">Tell ${esc(J.de)} if you got it right:</p>
    <textarea id="share" rows="4" readonly>${esc(share)}</textarea>
    <button class="sec" data-a="copiar">📋 COPY RESULT</button>
    <div class="erro" id="erro"></div>
    <button class="rosa" data-a="responder">↩️ REPLY TO ${esc(J.de.toUpperCase())}</button>
    <button class="sec" data-a="menu">MENU</button>`}`);
}
function telaResponder(){
  painel(`<div class="grande">↩️</div><h2>Reply to ${esc(J.de)}</h2>
    <p style="font-size:14px">Your reply takes the way back: it starts on your phone, goes past the Hacker and the Firewall, and arrives at ${esc(J.de)}'s home Wi-Fi.</p>
    <label>Your reply</label><input id="texto" maxlength="60" placeholder="Sure! What time?">
    <div class="erro" id="erro"></div>
    <button class="rosa" data-a="enviarResposta">SEND REPLY ➤</button>
    <button class="sec" data-a="menu">MENU</button>`);
}
function telaPerdeu(motivo){
  const f=FASES[ROTAS[J.rota][J.pos]];
  painel(`<div class="grande">⚠️</div><h2 class="ruim">The message got lost!</h2>
    <p>${motivo==='sinal'?'The signal ran out':'It got corrupted'} in <b>${f.nome}</b>.</p>
    <div class="bolha cinza">${esc(textoEstragado())}</div>
    <p style="font-size:14px">You can resend from this stage, but every resend breaks more letters.</p>
    <button data-a="reenviar">🔁 RESEND</button>
    <button class="sec" data-a="menu">GIVE UP</button>`);
}
function telaTreinoFim(ok,motivo){
  const b=st.bossNome||st.f.chefe.nome;
  painel(ok?`<div class="grande">${st.bossEmoji}</div><h2 class="ok">${esc(b)} defeated!</h2>
     <p>${st.n<FASES.length-1?'Stage '+(st.n+2)+' unlocked in practice.':'You beat every stage!'}</p>
     ${st.n<FASES.length-1?'<button data-a="treinoProx">NEXT STAGE ➤</button>':''}
     <button class="sec" data-a="menu">MENU</button>`
    :`<div class="grande">⚠️</div><h2 class="ruim">Didn't make it!</h2><p>${motivo==='sinal'?'The signal ran out.':'The message got corrupted.'}</p>
     <button data-a="treinoDeNovo">TRY AGAIN</button><button class="sec" data-a="menu">MENU</button>`);
}
async function copiar(){
  const ta=$('share');if(!ta)return;
  try{await navigator.clipboard.writeText(ta.value);erro('');const b=document.querySelector('[data-a="copiar"]');if(b)b.textContent='✓ COPIED!'}
  catch(e){ta.focus();ta.select();erro('Could not copy automatically: the text is selected, copy it manually.')}
}

$('card').addEventListener('click',e=>{
  const b=e.target.closest('[data-a]');if(!b)return;sfx('clique');const a=b.dataset.a,n=b.dataset.n;
  if(a==='aba'){aba=n;telaInicio()}
  if(a==='fase'){if(+n<=liberado){nivelSel=+n;telaInicio()}}
  if(a==='treinar'||a==='treinoDeNovo'){modo='treino';J=null;jogar(a==='treinar'?nivelSel:st.n)}
  if(a==='treinoProx'){modo='treino';nivelSel=st.n+1;jogar(nivelSel)}
  if(a==='enviar'){
    const de=limpaTexto($('deQuem').value.trim()),para=limpaTexto($('paraQuem').value.trim()),t=limpaEntrada($('texto').value.trim());
    if(!de||!para)return erro('Fill in both names.');if(t.replace(/ /g,'').length<3)return erro('Write a slightly longer message.');
    ls.set('entrega_nome',de);J=novaJornada(de,para,t,'ida');modo='jornada';escolheCanal(t,jogarJ,()=>telaInicio());
  }
  if(a==='abrir'){
    const o=decodifica($('codigo').value);if(!o)return erro('Invalid code. Make sure you copied everything, starting with ENT-');
    if(o.pos>=ROTAS[o.rota].length)return erro('This package was already delivered.');
    J=o;modo='jornada';telaPacoteAberto();
  }
  if(a==='continuar')escolheCanal(J.txt,jogarJ,()=>J.pos?telaFaseOk():telaPacoteAberto());
  if(a==='reenviar'){J.falhas++;corromper(perdaPorDano()*2);J.vidas=3;J.sinal=100;jogarJ()}
  if(a==='copiar')copiar();
  if(a==='conferir'){const p=$('palpite').value.trim();if(!p)return;telaResultado(p)}
  if(a==='responder')telaResponder();
  if(a==='enviarResposta'){
    const t=limpaEntrada($('texto').value.trim());if(t.replace(/ /g,'').length<3)return erro('Write a slightly longer reply.');
    const rota=J.rota==='ida'?'volta':'ida';J=novaJornada(J.para,J.de,t,rota,J.rodada+1);modo='jornada';jogarJ();
  }
  if(a==='menu')menu();
  if(a.startsWith('tel')){telAcao(a,n);return}
  if(['novaConv','entrarConv','abrirConv','entrarConvLink','tentarChat','cancelarChat','lixoConv','remConv','remConvTudo'].includes(a)){acaoConversa(a,n);return}
  if(a==='canal'){canalAtual=n;ls.set('entrega_canal',n);fechaPainel();if(canalCb)canalCb();return}
  if(a==='rolSorte'){roleta(canalTxt,null);return}
  if(a==='rolJoga'){if(!rolFim)return;canalAtual=rolFim.id;fechaPainel();if(canalCb)canalCb();return}
  if(a==='canalBloq'){toast('🔵 Bluetooth only carries messages up to 20 letters');return}
  if(a==='canalVolta'){canalAtual=null;fechaPainel();if(canalVolta)canalVolta();return}
  if(a==='visual')telaVisual();
  if(a==='skin'){const [k,v]=n.split(':');const L={cor:CORES_ENV,rastro:RASTROS,cara:CARAS,ace:ACESSORIOS,selo:SELOS}[k],it=L&&L.find(x=>x.id===v),tt=k==='titulo'&&TITULOS.find(x=>x.id===v);
    if((it&&perfil.pts>=it.p)||(tt&&tt.ok(perfil))){perfil[k]=v;salvaPerfil();if(k==='titulo')enviaRanking()}telaVisual()}
  if(a==='visAba'){visAba=n;telaVisual()}
  if(a==='visSorteia'){visSorteia();return}
  if(a==='nadaTit'){const t=TITULOS.find(x=>'titulo:'+x.id===n);if(t)toast('🔒 '+t.d)}
  if(a==='nada'){const it=LISTAS_PTS().find(x=>n.endsWith(':'+x.id));if(it)toast('🔒 Needs '+it.p+' points')}
  if(a==='ranking')telaRanking();
  if(a==='mural'){muralAba='top';telaMural()}
  if(a==='som'){alternaSom();telaInicio()}
  if(a==='musica'){toast(alternaMusica());telaInicio()}
  if(['muralAba','curtir','muralEsconde','muralApaga'].includes(a)){muralAcao(a,n);return}
  if(a.startsWith('lobby')||a==='publico'){lobbyAcao(a,n);return}
  if(a==='rankAba'){rankAba=n;telaRanking()}
  if(a==='rankApaga'){fb.api.rankApagar(n).then(()=>{toast('🗑️ Removed from ranking');telaRanking()}).catch(()=>toast('⚠️ No admin permission'));return}
  if(a==='copiarId'){const t=fb.uid||'';navigator.clipboard&&navigator.clipboard.writeText(t).then(()=>toast('📋 ID copied'),()=>toast(t));return}
  // online
  if(a==='criarSala'||a==='entrarSala'){
    net.meuNome=limpaTexto(($('meuNome').value.trim()||'Player').slice(0,12));ls.set('entrega_nome',net.meuNome);
    if(a==='criarSala'){erro('Creating room…');criarSala()}
    else{const c=$('codSala').value.trim().toUpperCase();if(!/^[A-Z]{4}$/.test(c))return erro('The code has 4 letters.');erro('Joining…');entrarSala(c)}
  }
  if(a==='piloto'){const t=$('texto').value;pilotoEscolha=n;telaLobbyHost();$('texto').value=t}
  if(a==='comecarOnline'){
    const t=limpaEntrada($('texto').value.trim());if(t.replace(/ /g,'').length<3)return erro('Write a slightly longer message.');
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
