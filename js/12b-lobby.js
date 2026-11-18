// ================= LOBBY (salas públicas) =================
let lobbyFiltro='todas',lobbyLista=[],lobbyDesliga=null,lobbyPublico=ls.get('entrega_publico','1')==='1';
const LOBBY_VALIDADE={telefone:48*3600e3};
function lobbyVivas(){const ag=Date.now();
  return lobbyLista.filter(x=>x&&x.t&&ag-x.t<(LOBBY_VALIDADE[x.tipo]||0)&&!(x.tipo==='telefone'&&(!x.on||(x.feitos||0)>=(x.max||0))))}
async function telaLobbyPublico(){
  tel.tela='lobbyPublico';
  if(!conversasAtivas())return painel('<p class="ruim">O Lobby precisa do servidor.</p><button class="sec" data-a="menu">VOLTAR</button>');
  painel('<h2>🌍 Lobby</h2><p>Procurando salas…</p><button class="sec" data-a="menu">VOLTAR</button>');
  try{await fb.iniciar()}catch(e){return painel('<h2>🌍 Lobby</h2><p class="ruim">Não consegui conectar. Confira a internet.</p><button class="sec" data-a="menu">VOLTAR</button>')}
  const adm=await souAdmin();lobbyAdmin=adm;
  if(lobbyDesliga){try{lobbyDesliga()}catch(e){}}
  lobbyDesliga=fb.api.lobbyOuvir(l=>{lobbyLista=l.map(x=>limpaObj(x,['nome']));if(tel.tela==='lobbyPublico')renderLobby()});
}
let lobbyAdmin=false;
function renderLobby(){
  const todas=lobbyVivas(),l=todas.filter(x=>x.tipo==='telefone').sort((a,b)=>b.t-a.t);
  const abas='';
  const linhas=l.map(x=>{const meu=x.dono===fb.uid;
    if(x.tipo==='telefone'){const tm=temaDe(x.tema),vagas=(x.max||0)-(x.feitos||0);
      return `<div class="sl"><div class="slInfo"><b>📞 Roda de ${esc(x.nome)}</b><small>${tm.e} ${esc(tm.n)} · ${x.feitos||0}/${x.max} na roda · ${vagas} vaga${vagas>1?'s':''}</small></div>
        ${lobbyAdmin||meu?`<button class="slDel" data-a="lobbyApaga" data-n="${x.id}">🗑️</button>`:''}<button data-a="lobbyTel" data-n="${x.tid}">${meu?'ABRIR':'ENTRAR'}</button></div>`}
    return ''}).join('');
  painel(`<h2>🌍 Lobby</h2><p style="font-size:14px">Salas abertas agora. Toque em ENTRAR pra jogar com quem estiver lá!</p>${abas}
    <label>Seu nome</label><input id="meuNome" maxlength="12" value="${esc(ls.get('entrega_nome','Luis'))}">
    <div class="sls">${linhas||'<p>Nenhuma sala aberta agora. Crie uma e espere a galera chegar! 👇</p>'}</div>
    <button class="rosa" data-a="lobbyNovaTel">➕ 📞 CRIAR UMA RODA</button>
    <div class="erro" id="erro"></div>
    <button class="sec" data-a="menu">VOLTAR</button>`);
}
function saiLobby(){if(lobbyDesliga){try{lobbyDesliga()}catch(e){}lobbyDesliga=null}}
async function lobbyAcao(a,n){
  if(a==='lobby'){lobbyFiltro='todas';return telaLobbyPublico()}
  if(a==='lobbyFiltro'){lobbyFiltro=n;return renderLobby()}
  if(a==='lobbyTel'){pegaNome();saiLobby();erro('Conectando…');try{await telAbre(n)}catch(e){erro('Não consegui abrir essa roda.')}return}
  if(a==='lobbyNovaTel'){pegaNome();saiLobby();lobbyPublico=true;aba='telefone';telaInicio();return}
  if(a==='lobbyApaga'){const x=lobbyLista.find(y=>y.id===n);try{await fb.api.lobbyTirar(n);toast('🗑️ Sala tirada do Lobby')}catch(e){toast('⚠️ Sem permissão de admin')}return}
  if(a==='publico'){lobbyPublico=!lobbyPublico;ls.set('entrega_publico',lobbyPublico?'1':'0');const b=document.querySelector('[data-a="publico"]');if(b)b.outerHTML=htmlPublico();return}
}
function htmlPublico(){return `<button class="chk ${lobbyPublico?'on':''}" data-a="publico">${lobbyPublico?'☑️':'⬜'} 🌍 Aparecer no Lobby (qualquer pessoa pode entrar)</button>`}
// ---- publicar / tirar ----
async function lobbyPublicaTel(tid,info,forca){if(!lobbyPublico&&!forca)return;
  try{await fb.api.lobbyPor('t-'+tid,{tipo:'telefone',tid,dono:fb.uid,nome:info.nome,tema:info.tema,max:info.max,feitos:info.dentro||1,on:true,t:Date.now()},true)}catch(e){}}
function lobbyContaTel(tid,n){fb.api.lobbyFeito('t-'+tid,n).catch(()=>{})}
function lobbyAtualizaTel(tid,feitos,max,souDono){
  if(feitos>=max&&souDono)fb.api.lobbyTirar('t-'+tid).catch(()=>{});else fb.api.lobbyFeito('t-'+tid,feitos).catch(()=>{})}
