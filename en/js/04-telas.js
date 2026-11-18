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
  painel(`<h1 class="logo"><span class="env">✉️</span><span class="txt">ENTREGA!</span></h1>
    <div class="tag">THE MESSAGE'S JOURNEY</div>
    <p>You are a <b>message</b> traveling from one phone to another.</p>
    <div class="perfil topo"><a class="lang" href="${LANG_LINK}">${LANG_TXT}</a><span class="pts">⭐ ${perfil.pts}</span><button data-a="visual">🎽 Visual</button><button data-a="ranking">🏆 Ranking</button><button data-a="mural">📊 Wall</button><button data-a="som">${AU.mudo?'🔇':'🔊'}</button><button data-a="musica" class="${AU.estiloMusica==='off'?'desl':''}" title="Music">🎵</button></div>
    <button class="lobbyBtn" data-a="lobby">🌍 LOBBY · open rooms to join</button>
    <div class="abas modos">
      <button class="${aba==='conversas'?'on':''}" data-a="aba" data-n="conversas">💬<br>Chat</button>
      <button class="${aba==='telefone'?'on':''}" data-a="aba" data-n="telefone">📞<br>Telephone</button>
      <button class="${aba==='enviar'?'on':''}" data-a="aba" data-n="enviar">✍️<br>Send</button>
      <button class="${aba==='receber'?'on':''}" data-a="aba" data-n="receber">📦<br>Code</button>
    </div>${corpo}
    <div class="dica comoJoga">Phone: drag your finger (best in landscape). PC: arrows / WASD.<br>Grab 📶, dodge 🦠 🔥 📧. Against bosses you shoot ✓ automatically.</div>`);
}
// ---- telas código ----
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
    <button data-a="conferir">CHECK ✓✓</button>`);
}
function telaResultado(palpite,online){
  const p=parecido(palpite,J.txt);
  const nota=p>=95?'🏆 Nailed it!':p>=75?'👍 Almost there!':p>=50?'🤔 Kind of...':'😵 Totally garbled!';
  const pontos=J.pts+p*10;
  const share=`✓✓ Got your message on ENTREGA!\nIt arrived like this: "${textoEstragado()}"\nI understood: "${palpite}"\nI got ${p}% right (${pontos} pts). Was that it? 😅`;
  J.resultado={palpite,p};
  const quem='You understood';
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
async function copiar(){
  const ta=$('share');if(!ta)return;
  try{await navigator.clipboard.writeText(ta.value);erro('');const b=document.querySelector('[data-a="copiar"]');if(b)b.textContent='✓ COPIED!'}
  catch(e){ta.focus();ta.select();erro('Could not copy automatically: the text is selected, copy it manually.')}
}

$('card').addEventListener('click',e=>{
  const b=e.target.closest('[data-a]');if(!b)return;sfx('clique');const a=b.dataset.a,n=b.dataset.n;
  if(a==='aba'){aba=n;telaInicio()}
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
});
