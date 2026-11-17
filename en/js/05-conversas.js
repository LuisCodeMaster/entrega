// ================= CONVERSAS (mensagens guardadas no Firebase) =================
const FIREBASE_CONFIG={
  apiKey:"AIzaSyDIjAkjHGKqEnTqhiLlKCcKlPB3R1dFzM4",
  authDomain:"entrega-9e707.firebaseapp.com",
  databaseURL:"https://entrega-9e707-default-rtdb.firebaseio.com",
  projectId:"entrega-9e707",
  storageBucket:"entrega-9e707.firebasestorage.app",
  messagingSenderId:"592757076251",
  appId:"1:592757076251:web:729684af9d34090b6623be"
};
const FBV='10.14.1';
const fb={pronto:false,uid:null,api:null,erro:null,
  async iniciar(){
    if(this.pronto)return true;
    if(window.__FB_MOCK){Object.assign(this,window.__FB_MOCK);this.pronto=true;return true}
    if(!FIREBASE_CONFIG)throw new Error('sem-config');
    const base='https://www.gstatic.com/firebasejs/'+FBV+'/';
    const [A,Au,D]=await Promise.all([import(base+'firebase-app.js'),import(base+'firebase-auth.js'),import(base+'firebase-database.js')]);
    const app=A.initializeApp(FIREBASE_CONFIG),auth=Au.getAuth(app);
    const cred=await Au.signInAnonymously(auth);this.uid=cred.user.uid;
    const db=D.getDatabase(app),r=c=>D.ref(db,c);
    this.api={
      entrar:(cid,nome)=>D.set(r(`conversas/${cid}/membros/${this.uid}`),{nome,t:D.serverTimestamp()}),
      enviar:(cid,m)=>D.push(r(`conversas/${cid}/msgs`),{...m,de:this.uid,t:D.serverTimestamp()}),
      ouvir:(cid,cb)=>D.onChildAdded(D.query(r(`conversas/${cid}/msgs`),D.limitToLast(200)),s=>cb(s.key,s.val())),
      ouvirRem:(cid,cb)=>D.onChildRemoved(D.query(r(`conversas/${cid}/msgs`),D.limitToLast(200)),s=>cb(s.key)),
      apagar:(cid,mid)=>D.remove(r(`conversas/${cid}/msgs/${mid}`)),
      minhas:async cid=>{const s=await D.get(r(`conversas/${cid}/msgs`));const a=[];s.forEach(c=>{if(c.val().de===this.uid)a.push(c.key)});return a},
      membros:(cid,cb)=>D.onValue(r(`conversas/${cid}/membros`),s=>cb(s.val()||{})),
      ultima:async cid=>{const s=await D.get(D.query(r(`conversas/${cid}/msgs`),D.limitToLast(1)));let v=null;s.forEach(c=>{v=c.val()});return v},
      rankSalvar:d=>D.set(r(`ranking/${this.uid}`),{...d,t:D.serverTimestamp()}),
      rankMeu:async()=>(await D.get(r(`ranking/${this.uid}`))).val(),
      telCriar:(tid,info)=>D.set(r(`telefones/${tid}/info`),info),
      telEntrar:(tid,nome)=>D.set(r(`telefones/${tid}/jogadores/${this.uid}`),{nome,t:D.serverTimestamp()}),
      telOuvir:(tid,cb)=>D.onValue(r(`telefones/${tid}`),s=>cb(s.val())),
      telVez:async(tid,nome)=>{const res=await D.runTransaction(r(`telefones/${tid}/vez`),cur=>{const ag=Date.now();if(!cur||!cur.ate||cur.ate<ag||cur.uid===this.uid)return {uid:this.uid,nome,ate:ag+240000};return});return res.committed&&res.snapshot.val()&&res.snapshot.val().uid===this.uid},
      telSoltaVez:tid=>D.remove(r(`telefones/${tid}/vez`)),
      telElo:(tid,k,elo)=>D.set(r(`telefones/${tid}/elos/${k}`),elo),
      muralPublicar:(id,d)=>D.set(r(`galeria/${id}`),d),
      muralLista:async n=>{const s=await D.get(D.query(r('galeria'),D.orderByChild('t'),D.limitToLast(n)));const a=[];s.forEach(c=>{a.push({id:c.key,...c.val()})});return a},
      muralCurtir:(id,sim)=>sim?D.set(r(`galeria/${id}/curtidas/${this.uid}`),true):D.remove(r(`galeria/${id}/curtidas/${this.uid}`)),
      muralApagar:id=>D.remove(r(`galeria/${id}`)),
      souAdmin:async()=>(await D.get(r(`admins/${this.uid}`))).val()===true,
      rankApagar:uid=>D.remove(r(`ranking/${uid}`)),
      telEncerra:tid=>D.update(r(`telefones/${tid}/info`),{fim:true}),
      telInfo:(tid,d)=>D.update(r(`telefones/${tid}/info`),d),
      telSair:tid=>D.remove(r(`telefones/${tid}/jogadores/${this.uid}`)),
      // ao vivo: tenta um nó próprio; se as regras não deixarem, usa um irmão dentro de telefones
      vivoMandar:async(tid,snap)=>{const bases=[`aovivo/${tid}`,`telefones/${tid}_vivo`];
        while((this.vivoI||0)<bases.length){const i=this.vivoI||0;try{await D.set(r(bases[i]+'/s'),snap);return true}catch(e){if(!/permission/i.test(e&&(e.code||e.message)||''))throw e;if((this.vivoI||0)===i)this.vivoI=i+1}}return false},
      vivoOuvir:(tid,cb)=>{const offs=[`aovivo/${tid}/s`,`telefones/${tid}_vivo/s`].map(c=>D.onValue(r(c),s=>cb(s.val()),()=>{}));return()=>offs.forEach(f=>f())},
      vivoAssistir:(tid)=>{let feito=null;(async()=>{for(const c of [`aovivo/${tid}/v/${this.uid}`,`telefones/${tid}_vivo/v/${this.uid}`]){try{const ref=r(c);await D.set(ref,true);await D.onDisconnect(ref).remove();feito=ref;return}catch(e){}}})();
        return()=>{if(feito){D.remove(feito).catch(()=>{});D.onDisconnect(feito).cancel().catch(()=>{})}}},
      vivoContar:(tid,cb)=>{const q={};const offs=[`aovivo/${tid}/v`,`telefones/${tid}_vivo/v`].map((c,k)=>D.onValue(r(c),s=>{q[k]=Object.keys(s.val()||{});cb(new Set([...(q[0]||[]),...(q[1]||[])]).size)},()=>{}));return()=>offs.forEach(f=>f())},
      lobbyPor:async(id,d,somePraSempre)=>{const ref=r(`lobby/${id}`);await D.set(ref,d);if(somePraSempre)await D.onDisconnect(ref).remove()},
      lobbyTirar:id=>D.remove(r(`lobby/${id}`)),
      lobbyFeito:(id,n)=>D.set(r(`lobby/${id}/feitos`),n),
      lobbyOuvir:cb=>D.onValue(D.query(r('lobby'),D.orderByChild('t'),D.limitToLast(80)),s=>{const a=[];s.forEach(c=>{a.push({id:c.key,...c.val()})});cb(a)}),
      rankTop:async(campo,n)=>{const s=await D.get(D.query(r('ranking'),D.orderByChild(campo),D.limitToLast(n)));const a=[];s.forEach(c=>{a.push({uid:c.key,...c.val()})});return a.reverse()}
    };
    this.pronto=true;return true;
  }
};
const conversasAtivas=()=>!!(FIREBASE_CONFIG||window.__FB_MOCK);
const ch={cid:null,msgs:[],ids:new Set(),outro:'',membros:{},desliga:[],aberto:false,adivinhando:null};
function listaConvs(){try{return JSON.parse(ls.get('entrega_convs','[]'))}catch(e){return[]}}
function salvaConv(cid,dados){const l=listaConvs().filter(c=>c.cid!==cid);const velho=listaConvs().find(c=>c.cid===cid)||{};l.unshift({...velho,cid,...dados});ls.set('entrega_convs',JSON.stringify(l.slice(0,30)))}
function novoCid(){const L='abcdefghijkmnpqrstuvwxyz23456789';let s='';for(let i=0;i<10;i++)s+=L[Math.floor(R()*L.length)];return s}
function cidDe(txt){const m=String(txt).match(/(?:#c-|^)([a-z0-9]{10})\b/i);return m?m[1].toLowerCase():null}
function htmlConversas(){
  if(!conversasAtivas())return `<p style="font-size:14px">💬 <b>Chat</b>: write a message, deliver it by playing, and it waits until your friend opens it.</p><p class="ruim" style="font-size:14px">The chat server is not connected yet. Use the other tabs for now.</p>`;
  const convs=listaConvs(),hash=(location.hash.match(/^#c-([a-z0-9]{10})$/)||[])[1]||'';
  setTimeout(carregaPrevias,0);
  return `<p style="font-size:14px">Write a message, deliver it by <b>playing</b>, and it shows up on your friend's phone, even if they are offline. Every hit breaks letters!</p>
    <label>Your name</label><input id="meuNome" maxlength="12" value="${esc(ls.get('entrega_nome','Luis'))}">
    ${hash?`<div class="bolha cinza" style="margin-top:10px">You got a chat invite!</div><button data-a="entrarConv" data-n="${hash}">💬 JOIN THE CHAT</button>`:''}
    <button data-a="novaConv" ${hash?'class="sec"':''}>➕ NEW CHAT</button>
    <label>…or paste your friend's invite link</label>
    <div class="linha"><div style="flex:2"><input id="convLink" placeholder="link or code"></div><div><button data-a="entrarConvLink" style="margin:0;height:100%">JOIN</button></div></div>
    <div class="erro" id="erro"></div>
    ${convs.length?'<label>Your chats</label><div class="convs">'+convs.map(c=>`<div class="convItem"><button data-a="abrirConv" data-n="${c.cid}"><span>💬 ${esc(c.outro||'Waiting for friend…')}<small id="prev-${c.cid}">…</small></span><span id="bdg-${c.cid}"></span></button><button class="lixo" data-a="lixoConv" data-n="${c.cid}" title="Delete chat">🗑️</button></div>`).join('')+'</div>':''}`;
}
async function carregaPrevias(){
  try{await fb.iniciar()}catch(e){return}
  for(const c of listaConvs()){
    const el=$('prev-'+c.cid);if(!el)continue;
    try{const u=await fb.api.ultima(c.cid);if(!u){el.textContent='No messages yet';continue}
      el.textContent=(u.de===fb.uid?'You: ':'')+u.vis;
      if(u.de!==fb.uid&&(u.t||0)>(+c.visto||0)){const b=$('bdg-'+c.cid);if(b)b.innerHTML='<span class="badge">new</span>'}
    }catch(e){el.textContent=''}
  }
}
function pegaNome(){const i=$('meuNome');const n=limpaTexto(((i&&i.value.trim())||ls.get('entrega_nome','')||'Player').slice(0,12));ls.set('entrega_nome',n);return n}
async function acaoConversa(a,n){
  if(a==='lixoConv'){const c=listaConvs().find(x=>x.cid===n);
    painel(`<div class="grande">🗑️</div><h2>Delete chat${c&&c.outro?' with '+esc(c.outro):''}?</h2>
      <p style="font-size:14px">"Only from my list" removes the chat here, but your friend still sees everything.<br>"Delete my messages" also deletes everything <b>you</b> sent, for them too. This cannot be undone.</p>
      <div class="erro" id="erro"></div>
      <button class="sec" data-a="remConv" data-n="${n}">Only from my list</button>
      <button class="perigo" data-a="remConvTudo" data-n="${n}">Delete my messages and remove</button>
      <button class="sec" data-a="aba" data-n="conversas">Cancel</button>`);return true}
  if(a==='remConv'||a==='remConvTudo'){
    if(a==='remConvTudo'){erro('Deleting…');try{await fb.iniciar();const ids=await fb.api.minhas(n);for(const id of ids)await fb.api.apagar(n,id)}catch(e){erro('Could not delete the messages. Check your internet.');return true}}
    ls.set('entrega_convs',JSON.stringify(listaConvs().filter(x=>x.cid!==n)));
    if(ch.cid===n){ch.desliga.forEach(f=>{try{f()}catch(e){}});ch.cid=null}
    aba='conversas';telaInicio();toast(a==='remConvTudo'?'🗑️ Chat and your messages deleted':'Chat removed from list');return true}
  if(a==='novaConv'){pegaNome();const cid=novoCid();salvaConv(cid,{outro:'',criei:true});abrirChat(cid,true);return true}
  if(a==='entrarConv'||a==='abrirConv'){pegaNome();abrirChat(n);return true}
  if(a==='entrarConvLink'){pegaNome();const cid=cidDe($('convLink').value.trim());if(!cid){erro('Invalid link. Paste the whole link your friend sent.');return true}abrirChat(cid);return true}
  if(a==='tentarChat'){iniciaEntrega(J.txt,st.mimoEnviar);return true}
  if(a==='cancelarChat'){const mi=st.mimoEnviar;mostraChat();$('chTexto').value=J?J.txt:'';mimoSel=mi;atualizaMimoBtn();return true}
  return false;
}
async function abrirChat(cid,novo){
  if(location.hash)history.replaceState(null,'',location.pathname);
  erro('Connecting…');
  try{await fb.iniciar()}catch(e){erro('Could not reach the chat server. Check your internet and try again.');return}
  ch.desliga.forEach(f=>{try{f()}catch(e){}});
  Object.assign(ch,{cid,msgs:[],ids:new Set(),outro:(listaConvs().find(c=>c.cid===cid)||{}).outro||'',membros:{},desliga:[]});
  salvaConv(cid,{});
  try{await fb.api.entrar(cid,ls.get('entrega_nome','Jogador'))}catch(e){erro('Could not join this chat.');return}
  ch.desliga.push(fb.api.membros(cid,m=>{ch.membros=m;const o=Object.entries(m).find(([u])=>u!==fb.uid);
    if(o){ch.outro=o[1].nome;salvaConv(cid,{outro:ch.outro})}if(ch.aberto)topoChat()}));
  ch.desliga.push(fb.api.ouvirRem(cid,id=>{ch.ids.delete(id);ch.msgs=ch.msgs.filter(m=>m.id!==id);if(ch.menuMsg===id)ch.menuMsg=null;if(ch.aberto)renderMsgs()}));
  ch.desliga.push(fb.api.ouvir(cid,(id,m)=>{if(ch.ids.has(id))return;ch.ids.add(id);ch.msgs.push({id,...limpaObj(m,['txt','vis','nome'])});
    if(ch.aberto){renderMsgs();if(m.de!==fb.uid){marcaVisto();if(document.hidden)document.title='💬 New message — ENTREGA!'}}}));
  mostraChat();if(novo)mostraConvite(true);
}
function mostraChat(){
  modo='chat_menu';fixo=false;resize();fechaPainel();
  ch.aberto=true;$('chat').classList.remove('oculta');topoChat();renderMsgs();marcaVisto();
  if(st)st.estado='parado';
}
function fechaChat(){ch.aberto=false;$('chat').classList.add('oculta')}
function marcaVisto(){const u=ch.msgs.filter(m=>m.de!==fb.uid).pop();if(u)salvaConv(ch.cid,{visto:u.t||Date.now()})}
function topoChat(){
  $('chNome').textContent=ch.outro||'Waiting for friend…';
  $('chSub').textContent=ch.outro?'messages delivered by playing':'tap 🔗 to invite';
}
function mostraConvite(forca){
  const box=$('chConvite');if(!forca&&!box.classList.contains('oculta')){box.classList.add('oculta');return}
  const link=SITE+'#c-'+ch.cid;
  const share=`💬 Let's chat on ENTREGA! Every message has to be delivered by playing 😂\nOpen this link to join our chat:\n${link}`;
  box.innerHTML=`Send this invite to your friend (only once):<textarea id="share" rows="3" readonly>${esc(share)}</textarea><button class="sec" data-c="copiar">📋 COPY INVITE</button><div class="erro" id="erro"></div>`;
  box.classList.remove('oculta');
}
function fmtHora(t){if(!t)return'';const d=new Date(t);return d.toLocaleDateString(LOCALE,{day:'2-digit',month:'2-digit'})+' '+d.toLocaleTimeString(LOCALE,{hour:'2-digit',minute:'2-digit'})}
function ocultas(){try{return JSON.parse(ls.get('entrega_ocultas','{}'))}catch(e){return{}}}
function oculta(mid){const o=ocultas();o[mid]=1;ls.set('entrega_ocultas',JSON.stringify(o))}
function menuMsgHtml(m){
  if(ch.menuMsg!==m.id)return '';
  const minha=m.de===fb.uid,conf=ch.confirma===m.id;
  return `<div class="mMenu">${minha?`<button class="perigo" data-c="${conf?'apagarTodos':'confApagar'}" data-id="${m.id}">${conf?'Sure? Delete':'🗑️ Delete for everyone'}</button>`:''}
    <button data-c="apagarMim" data-id="${m.id}">🙈 Delete for me</button><button data-c="fechaMenu">Cancel</button></div>`;
}
function adivs(){try{return JSON.parse(ls.get('entrega_adiv','{}'))}catch(e){return{}}}
function renderMsgs(){
  const box=$('chLista');const fim=box.scrollHeight-box.scrollTop-box.clientHeight<80;
  if(!ch.msgs.length){box.innerHTML=`<div class="chVazio">No messages yet.<br>Write something below and deliver it by playing! ✉️</div>`;return}
  const ad=adivs(),oc=ocultas();let html='',dia='';
  const vis=ch.msgs.filter(m=>!oc[m.id]);
  if(!vis.length){box.innerHTML=`<div class="chVazio">Nothing to show.<br>Write something below and deliver it by playing! ✉️</div>`;return}
  for(const m of vis){
    const d=m.t?new Date(m.t).toLocaleDateString(LOCALE):'';if(d&&d!==dia){dia=d;html+=`<div class="chData">${d}</div>`}
    const hora=m.t?new Date(m.t).toLocaleTimeString(LOCALE,{hour:'2-digit',minute:'2-digit'}):'';
    const selo=(m.chefe?'👑 ':'')+(m.canal&&canalDe(m.canal)?canalDe(m.canal).e+' ':'')+`✓✓ ${m.pct}%`;
    const mim=m.mimo&&MIMOS[m.mimo]?`<div class="mimo">🎁 ${m.de===fb.uid?'you sent':'sent along'}: ${MIMOS[m.mimo].e} ${MIMOS[m.mimo].n}</div>`:'';
    if(m.de===fb.uid){
      html+=`<div class="m eu"><div class="txt">${esc(m.vis)}</div>${m.vis!==m.txt?`<div class="orig">you wrote: ${esc(m.txt)}</div>`:''}${mim}<div class="meta">${hora} · ${selo} <button class="mais" data-c="menuMsg" data-id="${m.id}">⋯</button></div>${menuMsgHtml(m)}</div>`;
    }else{
      const g=ad[m.id];
      let extra='';
      if(m.vis!==m.txt){
        if(g)extra=`<div class="orig">you understood: ${esc(g.p)}<br>it was: <b>${esc(m.txt)}</b> · ${g.n}% right</div>`;
        else if(ch.adivinhando===m.id)extra=`<input id="palpite" maxlength="80" value="${esc(m.vis.replace(/_/g,''))}"><button data-c="conferir" data-id="${m.id}">CHECK ✓</button>`;
        else extra=`<button data-c="adivinhar" data-id="${m.id}">🤔 Guess</button>`;
      }
      html+=`<div class="m ele"><div class="txt">${esc(m.vis)}</div>${extra}${mim}<div class="meta">${esc(m.nome)} · ${hora} · ${selo} <button class="mais" data-c="menuMsg" data-id="${m.id}">⋯</button></div>${menuMsgHtml(m)}</div>`;
    }
  }
  box.innerHTML=html;if((fim||!box.dataset.vis)&&!ch.menuMsg){box.scrollTop=box.scrollHeight;box.dataset.vis=1}
}
function toast(t){const e=$('toast');e.textContent=t;e.classList.remove('oculta');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.add('oculta'),2600)}
$('chat').addEventListener('click',async e=>{
  const b=e.target.closest('[data-c]');if(!b)return;const c=b.dataset.c;
  if(c==='voltar'){fechaChat();menu();return}
  if(c==='menuMsg'){ch.menuMsg=ch.menuMsg===b.dataset.id?null:b.dataset.id;ch.confirma=null;renderMsgs();return}
  if(c==='fechaMenu'){ch.menuMsg=ch.confirma=null;renderMsgs();return}
  if(c==='confApagar'){ch.confirma=b.dataset.id;renderMsgs();return}
  if(c==='apagarMim'){oculta(b.dataset.id);ch.menuMsg=null;renderMsgs();toast('🙈 Deleted just for you');return}
  if(c==='apagarTodos'){const id=b.dataset.id;ch.menuMsg=ch.confirma=null;
    try{await fb.api.apagar(ch.cid,id);toast('🗑️ Message deleted for everyone')}catch(e){toast('⚠️ Could not delete. Check your internet.')}return}
  if(c==='mimo'){const box=$('chMimos');if(!box.classList.contains('oculta')){box.classList.add('oculta');return}
    box.innerHTML='<div class="tit">Send it along with the message. It affects '+esc(ch.outro||'your friend')+'\'s next delivery!</div>'+
      Object.entries(MIMOS).map(([k,m])=>`<button data-c="escMimo" data-id="${k}" class="${k==='vida'||k==='escudo'?'bom ':''}${mimoSel===k?'on':''}"><b>${m.e}</b>${m.n}</button>`).join('')+
      `<button data-c="escMimo" data-id=""><b>✖️</b>none</button>`;box.classList.remove('oculta');return}
  if(c==='escMimo'){mimoSel=b.dataset.id||null;atualizaMimoBtn();if(mimoSel)toast(MIMOS[mimoSel].e+' goes along with your next message');return}
  if(c==='convidar'){mostraConvite();return}
  if(c==='copiar'){copiar();return}
  if(c==='enviar'){const t=limpaEntrada($('chTexto').value.trim());if(!t.replace(/\s/g,'').length)return;
    if(!ch.outro&&!ch.msgs.length&&!(listaConvs().find(x=>x.cid===ch.cid)||{}).avisei){salvaConv(ch.cid,{avisei:1});toast('Your friend has not joined yet: they will see it when they open the invite');}
    $('chTexto').value='';const mr=mimoRecebido();
    escolheCanal(t,()=>iniciaEntrega(t),()=>{mostraChat();$('chTexto').value=t},mr&&mr.mimo==='sat'?'sat':null);return}
  if(c==='adivinhar'){ch.adivinhando=b.dataset.id;renderMsgs();const i=$('palpite');if(i)i.focus();return}
  if(c==='conferir'){const m=ch.msgs.find(x=>x.id===b.dataset.id),p=$('palpite').value.trim();if(!m||!p)return;
    const n=parecido(p,m.txt),ad=adivs();ad[m.id]={p,n};ls.set('entrega_adiv',JSON.stringify(ad));ch.adivinhando=null;renderMsgs();
    toast(n>=95?'🏆 Nailed it!':n>=75?'👍 Almost!':n>=50?'🤔 Kind of':'😵 Totally garbled!');return}
});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)document.title='Entrega! — The Message Journey'});
$('chTexto').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();document.querySelector('[data-c="enviar"]').click()}});
const EFEITOS={coracao:'❤️ = +1 LIFE',fogo:'🔥 = FIRE SHOT',risada:'😂 = SHIELD',kkk:'LOL = LAUGH BONUS',socorro:'HELP?! A MINI-BOSS HEARD YOU…',pergunta:'❓ QUESTIONS ARE IN A HURRY: SHORT PATH'};
function efeitosDoTexto(t){const l=t.toLowerCase(),e=[];
  if(/❤|♥|💖|💕|💗|😍|🥰/.test(t))e.push('coracao');
  if(/🔥/.test(t))e.push('fogo');
  if(/😂|🤣/.test(t))e.push('risada');
  if(/k{3,}|(ha){2,}|(rs){2,}|lol|lmao/.test(l))e.push('kkk');
  if(/socorro|help/.test(l))e.push('socorro');
  if(/\?/.test(t))e.push('pergunta');
  return e}
const MIMOS={inv:{e:'😈',n:'reversed controls'},neblina:{e:'🌫️',n:'fog'},tubarao:{e:'🦈',n:'shark swarm'},lento:{e:'🐌',n:'heavy message'},vida:{e:'❤️',n:'extra life'},escudo:{e:'🛡️',n:'shield'},sat:{e:'🛰️',n:'satellite route'}};
let mimoSel=null;
function mimoRecebido(){for(let i=ch.msgs.length-1;i>=0;i--){const m=ch.msgs[i];if(m.de===fb.uid)return null;if(m.mimo&&MIMOS[m.mimo])return m}return null}
function iniciaEntrega(txt,mimoEnviar=mimoSel){
  J=novaJornada(ls.get('entrega_nome','Me'),ch.outro||'Friend',txt,'ida');
  J.c=letrasJ().map((p,i)=>ehLetra(p)?i:-1).filter(i=>i>=0);
  const ef=efeitosDoTexto(txt),mr=mimoRecebido();
  const minhas=ch.msgs.filter(m=>m.de===fb.uid).length,chefeVez=(minhas+1)%4===0;
  const comChefe=chefeVez||ef.includes('socorro');
  let dist=(comChefe?2400:3200)+J.c.length*70;if(ef.includes('pergunta'))dist*=.75;
  const fase=ch.msgs.length%FASES.length;
  fechaChat();modo='chat';fixo=false;resize();fechaPainel();
  dados={de:J.de,para:J.para};
  novo(fase,{vidas:4+(ef.includes('coracao')?1:0)+(mr&&mr.mimo==='vida'?1:0),sinal:100,primeira:true,ultima:true,dist,semChefe:!comChefe,hpMul:chefeVez?.6:.4,
    rotulo:chefeVez?'👑 IMPORTANT MESSAGE':'DELIVERING TO '+(ch.outro||'YOUR FRIEND').toUpperCase()});
  Object.assign(st,{comChefe,efeitos:ef,mimo:mr?mr.mimo:null,mimoEnviar:mimoEnviar||null,letrasPegas:0,
    fila:J.c.map((i,k)=>({i,ch:letrasJ()[i],d:(k+1)/(J.c.length+1)*dist*0.9})),
    escudos:(ef.includes('risada')?1:0)+(mr&&mr.mimo==='escudo'?1:0),fogoSempre:ef.includes('fogo'),
    filaAvisos:['GRAB THE LETTERS OF YOUR MESSAGE!',...(mr?[esc(mr.nome).toUpperCase()+' SENT YOU: '+MIMOS[mr.mimo].e+' '+MIMOS[mr.mimo].n.toUpperCase()+'!']:[]),...ef.map(k=>EFEITOS[k])]});
  mimoSel=null;atualizaMimoBtn();aplicaCanal();
}
function atualizaMimoBtn(){const b=$('btnMimo');if(b)b.textContent=mimoSel?MIMOS[mimoSel].e:'🎁';const box=$('chMimos');if(box)box.classList.add('oculta')}
async function entregaConcluida(){
  const pts=Math.round((200+st.vidas*120+st.pegos*30+st.letrasPegas*15+(st.comChefe?400:0)+(st.efeitos.includes('kkk')?150:0))*multCanal());
  const msg={nome:J.de,txt:J.txt.slice(0,120),vis:textoEstragado().slice(0,120),pct:pctInteiro(),pts,fase:st.n,chefe:!!st.comChefe};if(st.cv)msg.canal=st.cv.id;
  if(st.mimoEnviar)msg.mimo=st.mimoEnviar;
  try{await fb.api.enviar(ch.cid,msg);mostraChat();toast('✓✓ Delivered '+msg.pct+'%! +'+pts+' pts');ganhaPontos(pts,msg.pct)}
  catch(e){mostraChat();$('chTexto').value=J.txt;mimoSel=st.mimoEnviar;atualizaMimoBtn();toast('⚠️ No connection: the message was not sent')}
}
function telaChatPerdeu(motivo){
  painel(`<div class="grande">⚠️</div><h2 class="ruim">The message got lost!</h2>
    <p>${motivo==='sinal'?'The signal ran out':'It got corrupted'} on the way to ${esc(ch.outro||'your friend')}.</p>
    <div class="bolha cinza">${esc(textoEstragado())}</div>
    <p style="font-size:14px">Trying again restarts the delivery (letters too). If you cancel, it goes back to the text box.</p>
    <button data-a="tentarChat">🔁 TRY AGAIN</button>
    <button class="sec" data-a="cancelarChat">CANCEL</button>`);
}
