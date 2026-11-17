// ================= LOBBY (salas públicas) =================
let lobbyFiltro='todas',lobbyLista=[],lobbyDesliga=null,lobbyPublico=ls.get('entrega_publico','1')==='1';
const LOBBY_VALIDADE={telefone:48*3600e3,online:2*3600e3};
function lobbyVivas(){const ag=Date.now();
  return lobbyLista.filter(x=>x&&x.t&&ag-x.t<(LOBBY_VALIDADE[x.tipo]||0)&&!(x.tipo==='telefone'&&(x.feitos||0)>=(x.max||0)))}
async function telaLobbyPublico(){
  tel.tela='lobbyPublico';
  if(!conversasAtivas())return painel('<p class="ruim">The Lobby needs the server.</p><button class="sec" data-a="menu">BACK</button>');
  painel('<h2>🌍 Lobby</h2><p>Looking for rooms…</p><button class="sec" data-a="menu">BACK</button>');
  try{await fb.iniciar()}catch(e){return painel('<h2>🌍 Lobby</h2><p class="ruim">Could not connect. Check your internet.</p><button class="sec" data-a="menu">BACK</button>')}
  const adm=await souAdmin();lobbyAdmin=adm;
  if(lobbyDesliga){try{lobbyDesliga()}catch(e){}}
  lobbyDesliga=fb.api.lobbyOuvir(l=>{lobbyLista=l.map(x=>limpaObj(x,['nome']));if(tel.tela==='lobbyPublico')renderLobby()});
}
let lobbyAdmin=false;
function renderLobby(){
  const todas=lobbyVivas(),l=todas.filter(x=>lobbyFiltro==='todas'||x.tipo===lobbyFiltro).sort((a,b)=>b.t-a.t);
  const nT=todas.filter(x=>x.tipo==='telefone').length,nO=todas.filter(x=>x.tipo==='online').length;
  const abas=`<div class="abas" style="grid-template-columns:repeat(3,1fr)">${[['todas','🌍 All',todas.length],['telefone','📞 Telephone',nT],['online','🎧 Online',nO]].map(([k,t,c])=>`<button class="${lobbyFiltro===k?'on':''}" data-a="lobbyFiltro" data-n="${k}">${t} (${c})</button>`).join('')}</div>`;
  const linhas=l.map(x=>{const meu=x.dono===fb.uid;
    if(x.tipo==='telefone'){const tm=temaDe(x.tema),vagas=(x.max||0)-(x.feitos||0);
      return `<div class="sl"><div class="slInfo"><b>📞 ${esc(x.nome)}'s round</b><small>${tm.e} ${esc(tm.n)} · ${x.feitos||0}/${x.max} joined · ${vagas} spot${vagas>1?'s':''} left</small></div>
        ${lobbyAdmin&&!meu?`<button class="slDel" data-a="lobbyApaga" data-n="${x.id}">🗑️</button>`:''}<button data-a="lobbyTel" data-n="${x.tid}">${meu?'OPEN':'JOIN'}</button></div>`}
    return `<div class="sl"><div class="slInfo"><b>🎧 ${esc(x.nome)}'s room</b><small>Pilot + Operator · waiting for 1 person</small></div>
      ${lobbyAdmin&&!meu?`<button class="slDel" data-a="lobbyApaga" data-n="${x.id}">🗑️</button>`:''}${meu?'<small style="opacity:.7">your room</small>':`<button data-a="lobbyOnline" data-n="${x.codigo}">JOIN</button>`}</div>`}).join('');
  painel(`<h2>🌍 Lobby</h2><p style="font-size:14px">Rooms open right now. Tap JOIN to play with whoever is there!</p>${abas}
    <label>Your name</label><input id="meuNome" maxlength="12" value="${esc(ls.get('entrega_nome','Luis'))}">
    <div class="sls">${linhas||'<p>No open rooms right now. Create one and wait for people to show up! 👇</p>'}</div>
    <div class="linha"><div><button class="rosa" data-a="lobbyNovaTel">➕ 📞 ROUND</button></div><div><button class="rosa" data-a="lobbyNovaOnline">➕ 🎧 ROOM</button></div></div>
    <div class="erro" id="erro"></div>
    <button class="sec" data-a="menu">VOLTAR</button>`);
}
function saiLobby(){if(lobbyDesliga){try{lobbyDesliga()}catch(e){}lobbyDesliga=null}}
async function lobbyAcao(a,n){
  if(a==='lobby'){lobbyFiltro='todas';return telaLobbyPublico()}
  if(a==='lobbyFiltro'){lobbyFiltro=n;return renderLobby()}
  if(a==='lobbyTel'){pegaNome();saiLobby();erro('Connecting…');try{await telAbre(n)}catch(e){erro('Could not open this round.')}return}
  if(a==='lobbyOnline'){if(!redeDisponivel())return erro('Online mode does not work here.');net.meuNome=pegaNome();saiLobby();aba='online';telaInicio();erro('Entrando…');entrarSala(n);return}
  if(a==='lobbyNovaTel'){pegaNome();saiLobby();lobbyPublico=true;aba='telefone';telaInicio();return}
  if(a==='lobbyNovaOnline'){pegaNome();saiLobby();lobbyPublico=true;aba='online';telaInicio();return}
  if(a==='lobbyApaga'){try{await fb.api.lobbyTirar(n);toast('🗑️ Room removed from the Lobby')}catch(e){toast('⚠️ No admin permission')}return}
  if(a==='publico'){lobbyPublico=!lobbyPublico;ls.set('entrega_publico',lobbyPublico?'1':'0');const b=document.querySelector('[data-a="publico"]');if(b)b.outerHTML=htmlPublico();return}
}
function htmlPublico(){return `<button class="chk ${lobbyPublico?'on':''}" data-a="publico">${lobbyPublico?'☑️':'⬜'} 🌍 Show in the Lobby (anyone can join)</button>`}
// ---- publicar / tirar ----
async function lobbyPublicaTel(tid,info){if(!lobbyPublico)return;
  try{await fb.api.lobbyPor('t-'+tid,{tipo:'telefone',tid,dono:fb.uid,nome:info.nome,tema:info.tema,max:info.max,feitos:1,t:Date.now()})}catch(e){}}
function lobbyContaTel(tid,n){fb.api.lobbyFeito('t-'+tid,n).catch(()=>{})}
function lobbyAtualizaTel(tid,feitos,max,souDono){
  if(feitos>=max&&souDono)fb.api.lobbyTirar('t-'+tid).catch(()=>{});else fb.api.lobbyFeito('t-'+tid,feitos).catch(()=>{})}
async function lobbyPublicaOnline(){if(!lobbyPublico||!conversasAtivas())return;
  try{await fb.iniciar();net.lobbyId='o-'+net.sala;await fb.api.lobbyPor(net.lobbyId,{tipo:'online',codigo:net.sala,dono:fb.uid,nome:net.meuNome||'Player',t:Date.now()},true)}catch(e){net.lobbyId=null}}
function lobbyTiraOnline(){if(net.lobbyId&&fb.pronto){fb.api.lobbyTirar(net.lobbyId).catch(()=>{});net.lobbyId=null}}
