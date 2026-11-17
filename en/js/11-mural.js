// ================= MURAL (galeria pública) =================
let muralAba='top',muralCache=[],muralAdmin=false,_admin=null;
async function souAdmin(){if(_admin!==null)return _admin;try{await fb.iniciar();_admin=await fb.api.souAdmin()}catch(e){_admin=false}return _admin}
function escondidosMural(){try{return JSON.parse(ls.get('entrega_mural_esc','{}'))}catch(e){return{}}}
async function publicaMural(){
  const d=tel.dados,el=elosReais(d);if(el.length<2)return toast('Needs at least 2 deliveries');
  try{await fb.api.muralPublicar(tel.tid,{de:fb.uid,nome:ls.get('entrega_nome','Jogador').slice(0,12),tema:(d.info&&d.info.tema)||'livre',
      inicio:el[0].txt.slice(0,80),fim:el[el.length-1].vis.slice(0,80),nomes:el.map(e=>e.nome).join(', ').slice(0,120),n:el.length,t:Date.now()});
    toast('📊 Posted to the wall!');const b=document.querySelector('[data-a="telMural"]');if(b){b.textContent='✅ ON THE WALL';b.disabled=true}}
  catch(e){toast(String(e&&e.message).includes('existe')||String(e&&e.code).includes('PERMISSION')?'This round is already on the wall':'⚠️ Could not post')}
}
function muralTopo(){
  const abas=`<div class="abas" style="grid-template-columns:repeat(2,1fr)"><button class="${muralAba==='top'?'on':''}" data-a="muralAba" data-n="top">🔥 Most liked</button><button class="${muralAba==='novo'?'on':''}" data-a="muralAba" data-n="novo">🆕 Recent</button></div>`;
  return `<h2>📊 Broken Telephone Wall</h2><p style="font-size:14px">The most destroyed sentences in the game. Like the best ones! ❤️</p>`+abas}
async function telaMural(){
  const topo=muralTopo();
  if(!conversasAtivas())return painel(topo+'<p class="ruim">The wall needs the server.</p><button class="sec" data-a="menu">BACK</button>');
  painel(topo+'<p>Loading…</p><button class="sec" data-a="menu">BACK</button>');
  try{await fb.iniciar();muralCache=(await fb.api.muralLista(150)).map(x=>limpaObj(x,['inicio','fim','nomes','nome']));muralAdmin=await souAdmin()}catch(e){return painel(topo+'<p class="ruim">Could not load the wall.</p><button class="sec" data-a="menu">BACK</button>')}
  renderMural();
}
function renderMural(){
  const topo=muralTopo();
  const esc_=escondidosMural(),cont=x=>Object.keys(x.curtidas||{}).length;
  let l=muralCache.filter(x=>!esc_[x.id]);
  l=muralAba==='top'?l.sort((a,b)=>cont(b)-cont(a)||b.t-a.t):l.sort((a,b)=>b.t-a.t);
  const cards=l.slice(0,60).map(x=>{const tm=temaDe(x.tema),eu=!!(x.curtidas||{})[fb.uid];
    return `<div class="mural"><div class="mTema">${tm.e} ${esc(tm.n)} · ${x.n} people</div>
      <div class="mIni">“${esc(x.inicio)}”</div><div class="mSeta">⬇️ became ⬇️</div><div class="mFim">“${esc(x.fim)}”</div>
      <div class="mPe"><small>${esc(x.nomes)}</small>
      <button class="${eu?'on':''}" data-a="curtir" data-n="${x.id}">❤️ ${cont(x)}</button>
      ${x.de===fb.uid||muralAdmin?`<button data-a="muralApaga" data-n="${x.id}">🗑️${x.de!==fb.uid?' 👑':''}</button>`:''}${x.de!==fb.uid?`<button data-a="muralEsconde" data-n="${x.id}" title="Hide">🚩</button>`:''}</div></div>`}).join('');
  painel(topo+`<div class="murais">${cards||'<p>Nothing on the wall yet. Finish a round and post it!</p>'}</div><button class="sec" data-a="menu">BACK</button>`);
}
async function muralAcao(a,n){
  if(a==='muralAba'){muralAba=n;renderMural();return}
  if(a==='curtir'){const x=muralCache.find(m=>m.id===n);if(!x)return;x.curtidas=x.curtidas||{};const ja=!!x.curtidas[fb.uid];
    if(ja)delete x.curtidas[fb.uid];else{x.curtidas[fb.uid]=true;sfx('clique')}renderMural();
    try{await fb.api.muralCurtir(n,!ja)}catch(e){toast('⚠️ Could not like')}return}
  if(a==='muralEsconde'){const e=escondidosMural();e[n]=1;ls.set('entrega_mural_esc',JSON.stringify(e));renderMural();toast('🚩 Hidden for you');return}
  if(a==='muralApaga'){try{await fb.api.muralApagar(n);muralCache=muralCache.filter(m=>m.id!==n);renderMural();toast('🗑️ Removed from the wall')}catch(e){toast('⚠️ Could not delete')}return}
}
