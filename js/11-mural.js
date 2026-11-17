// ================= MURAL (galeria pública) =================
let muralAba='top',muralCache=[],muralAdmin=false,_admin=null;
async function souAdmin(){if(_admin!==null)return _admin;try{await fb.iniciar();_admin=await fb.api.souAdmin()}catch(e){_admin=false}return _admin}
function escondidosMural(){try{return JSON.parse(ls.get('entrega_mural_esc','{}'))}catch(e){return{}}}
async function publicaMural(){
  const d=tel.dados,el=elosReais(d);if(el.length<2)return toast('Precisa de pelo menos 2 entregas');
  try{await fb.api.muralPublicar(tel.tid,{de:fb.uid,nome:ls.get('entrega_nome','Jogador').slice(0,12),tema:(d.info&&d.info.tema)||'livre',
      inicio:el[0].txt.slice(0,80),fim:el[el.length-1].vis.slice(0,80),nomes:el.map(e=>e.nome).join(', ').slice(0,120),n:el.length,t:Date.now()});
    toast('📊 Publicado no mural!');const b=document.querySelector('[data-a="telMural"]');if(b){b.textContent='✅ NO MURAL';b.disabled=true}}
  catch(e){toast(String(e&&e.message).includes('existe')||String(e&&e.code).includes('PERMISSION')?'Essa roda já está no mural':'⚠️ Não consegui publicar')}
}
function muralTopo(){
  const abas=`<div class="abas" style="grid-template-columns:repeat(2,1fr)"><button class="${muralAba==='top'?'on':''}" data-a="muralAba" data-n="top">🔥 Mais curtidas</button><button class="${muralAba==='novo'?'on':''}" data-a="muralAba" data-n="novo">🆕 Recentes</button></div>`;
  return `<h2>📊 Mural do Telefone Sem Fio</h2><p style="font-size:14px">As frases mais destruídas do jogo. Curta as melhores! ❤️</p>`+abas}
async function telaMural(){
  const topo=muralTopo();
  if(!conversasAtivas())return painel(topo+'<p class="ruim">O mural precisa do servidor.</p><button class="sec" data-a="menu">VOLTAR</button>');
  painel(topo+'<p>Carregando…</p><button class="sec" data-a="menu">VOLTAR</button>');
  try{await fb.iniciar();muralCache=(await fb.api.muralLista(150)).map(x=>limpaObj(x,['inicio','fim','nomes','nome']));muralAdmin=await souAdmin()}catch(e){return painel(topo+'<p class="ruim">Não consegui carregar o mural.</p><button class="sec" data-a="menu">VOLTAR</button>')}
  renderMural();
}
function renderMural(){
  const topo=muralTopo();
  const esc_=escondidosMural(),cont=x=>Object.keys(x.curtidas||{}).length;
  let l=muralCache.filter(x=>!esc_[x.id]);
  l=muralAba==='top'?l.sort((a,b)=>cont(b)-cont(a)||b.t-a.t):l.sort((a,b)=>b.t-a.t);
  const cards=l.slice(0,60).map(x=>{const tm=temaDe(x.tema),eu=!!(x.curtidas||{})[fb.uid];
    return `<div class="mural"><div class="mTema">${tm.e} ${esc(tm.n)} · ${x.n} pessoas</div>
      <div class="mIni">“${esc(x.inicio)}”</div><div class="mSeta">⬇️ virou ⬇️</div><div class="mFim">“${esc(x.fim)}”</div>
      <div class="mPe"><small>${esc(x.nomes)}</small>
      <button class="${eu?'on':''}" data-a="curtir" data-n="${x.id}">❤️ ${cont(x)}</button>
      ${x.de===fb.uid||muralAdmin?`<button data-a="muralApaga" data-n="${x.id}">🗑️${x.de!==fb.uid?' 👑':''}</button>`:''}${x.de!==fb.uid?`<button data-a="muralEsconde" data-n="${x.id}" title="Esconder">🚩</button>`:''}</div></div>`}).join('');
  painel(topo+`<div class="murais">${cards||'<p>Nada no mural ainda. Termine uma roda e publique!</p>'}</div><button class="sec" data-a="menu">VOLTAR</button>`);
}
async function muralAcao(a,n){
  if(a==='muralAba'){muralAba=n;renderMural();return}
  if(a==='curtir'){const x=muralCache.find(m=>m.id===n);if(!x)return;x.curtidas=x.curtidas||{};const ja=!!x.curtidas[fb.uid];
    if(ja)delete x.curtidas[fb.uid];else{x.curtidas[fb.uid]=true;sfx('clique')}renderMural();
    try{await fb.api.muralCurtir(n,!ja)}catch(e){toast('⚠️ Não consegui curtir')}return}
  if(a==='muralEsconde'){const e=escondidosMural();e[n]=1;ls.set('entrega_mural_esc',JSON.stringify(e));renderMural();toast('🚩 Escondido pra você');return}
  if(a==='muralApaga'){try{await fb.api.muralApagar(n);muralCache=muralCache.filter(m=>m.id!==n);renderMural();toast('🗑️ Removido do mural')}catch(e){toast('⚠️ Não consegui apagar')}return}
}
