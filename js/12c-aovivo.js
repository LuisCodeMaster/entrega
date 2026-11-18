// ================= TELEFONE SEM FIO: ASSISTIR AO VIVO =================
// quem está jogando manda um retrato do jogo 5x por segundo; quem está na roda assiste no próprio celular
const VIVO_HZ=5;
const vivo={t:0,quem:0,fimMandado:true,contaOff:null,
  // quem assiste
  on:false,uid:null,nome:'',ouveOff:null,presOff:null,viu:false,ultT:0,espera:0,perdeu:false,alvo:null};
function vivoComeca(){ // chamado quando eu começo a jogar minha vez
  vivo.t=0;vivo.fimMandado=false;vivo.quem=0;
  if(vivo.contaOff){try{vivo.contaOff()}catch(e){}vivo.contaOff=null}
  if(fb.api&&fb.api.vivoContar)try{vivo.contaOff=fb.api.vivoContar(tel.tid,n=>{const antes=vivo.quem;vivo.quem=n;
    if(n>antes&&st&&modo==='telefone'&&st.estado==='corrida')st.filaAvisos=[...(st.filaAvisos||[]),'👀 '+n+(n>1?' PESSOAS ASSISTINDO':' PESSOA ASSISTINDO')]})}catch(e){}
}
function vivoSnap(){
  const r=Math.round;
  return {u:fb.uid,n:ls.get('entrega_nome','Jogador').slice(0,12),t:Date.now(),
    x:r(st.x),y:r(st.y),d:r(st.dist),dm:r(st.distMax),si:r(st.sinal),vi:st.vidas,e:st.estado,f:st.n,cv:st.cv?st.cv.id:'',vel:r(st.vel),es:st.escudos||0,
    sk:{c:perfil.cor,r:perfil.rastro,f:perfil.cara,a:perfil.ace||'nenhum',s:perfil.selo||'nenhum',ti:perfil.titulo||'novato'},
    tx:textoEstragado().slice(0,80),bt:st.banner>0?st.bannerTxt:'',bn:+Math.max(0,st.banner).toFixed(1),
    o:st.obs.map(o=>o.k==='parede'?['parede',r(o.x),r(o.gy),r(o.gap),o.w,o.emo||'',o.mov||0,r(o.vel||0)]:[o.k,r(o.x),r(o.y),r(o.r),o.emo||'',r(o.vx||0),r(o.vy||0),r(o.vel||0),o.tub?1:0]),
    i:st.itens.map(i=>i.k==='letra'?[r(i.x),r(i.y),i.ch,i.oculta?1:0]:[r(i.x),r(i.y)]),
    a:st.avisos.filter(a=>a.k==='raio').map(a=>[r(a.x),a.w,+a.t.toFixed(2),+a.ativo.toFixed(2)]),
    z:(st.zonas||[]).map(z=>[r(z.x),r(z.w)]),
    q:st.queda>0?1:0,in:st.inter>0?1:0,iv:st.invT>0?1:0,
    ds:st.desafio?[st.desafio.n,+st.desafio.t.toFixed(1)]:0}
}
function vivoTransmite(dt){
  if(modo!=='telefone'||!st||!tel.tid||vivo.fimMandado||!fb.api||!fb.api.vivoMandar)return;
  if(st.estado==='fim'){vivo.fimMandado=true;fb.api.vivoMandar(tel.tid,{u:fb.uid,t:Date.now(),fim:1,ok:st.vidas>0&&st.sinal>0?1:0}).catch(()=>{});
    if(vivo.contaOff){try{vivo.contaOff()}catch(e){}vivo.contaOff=null}return}
  vivo.t-=dt;if(vivo.t>0)return;vivo.t=1/VIVO_HZ;
  fb.api.vivoMandar(tel.tid,vivoSnap()).catch(()=>{});
}

// ---- quem assiste ----
function vivoAssistir(){
  const d=tel.dados;if(!d||!d.vez||d.vez.uid===fb.uid)return toast('Ninguém está jogando agora');
  if(!fb.api.vivoOuvir)return toast('⚠️ Ao vivo indisponível');
  vivoSai(true);
  Object.assign(vivo,{on:true,uid:d.vez.uid,nome:d.vez.nome||'?',viu:false,ultT:0,espera:0,perdeu:false,alvo:null});
  contaPerfil('assistiu');tel.tela='vivo';fechaPainel();fixo=false;resize();
  novo(0,{semChefe:true});Object.assign(st,{estado:'espectador',vivo:true,remEstado:'corrida',zonas:[],inter:0,queda:0,invT:0,desafio:null,vivoTx:''});
  st.banner=0;
  try{vivo.ouveOff=fb.api.vivoOuvir(tel.tid,vivoRecebe)}catch(e){}
  try{vivo.presOff=fb.api.vivoAssistir(tel.tid)}catch(e){}
  $('vivoBar').classList.remove('oculta');vivoBarra();
}
function vivoBarra(){
  $('vivoTxt').textContent=vivo.perdeu?`💥 ${vivo.nome} se perdeu… esperando tentar de novo`:vivo.viu?`🔴 AO VIVO · ${vivo.nome}${vivo.tit?' · '+vivo.tit:''}`:`⏳ Conectando com ${vivo.nome}…`;
}
function vivoSai(silencio){
  if(vivo.ouveOff){try{vivo.ouveOff()}catch(e){}vivo.ouveOff=null}
  if(vivo.presOff){try{vivo.presOff()}catch(e){}vivo.presOff=null}
  const estava=vivo.on;vivo.on=false;$('vivoBar').classList.add('oculta');
  if(estava&&!silencio){novo(0);st.estado='parado';telLobby()}
}
function vivoRecebe(s){
  if(!vivo.on||!s||s.u!==vivo.uid)return;
  if(s.fim){if(!vivo.viu)return;
    if(s.ok){toast(`✅ ${vivo.nome} entregou a frase!`);vivo.viu=false;setTimeout(()=>{if(vivo.on)vivoSai()},1800)}
    else{vivo.perdeu=true;vivo.ultT=performance.now();vivoBarra();st.remEstado='fim'}
    return}
  if(!vivo.viu&&Date.now()-s.t>60000)return; // retrato velho de outra partida
  const novoJogo=!vivo.viu||vivo.perdeu;vivo.viu=true;vivo.perdeu=false;vivo.ultT=performance.now();vivoBarra();
  if(novoJogo||st.n!==s.f){novo(s.f||0,{semChefe:true});st.banner=0;st.bannerTxt=''}
  const cv=canalDe(s.cv);
  if(s.sk){const k=s.sk;st.vivoSk={cor:achaItem(CORES_ENV,k.c),rastro:RASTROS.some(x=>x.id===k.r)?k.r:'padrao',cara:k.f,ace:k.a,selo:k.s};const tt=tituloDe(k.ti);if(tt!==vivo.tit){vivo.tit=tt;vivoBarra()}}
  Object.assign(st,{estado:'espectador',vivo:true,remEstado:s.e==='chegando'?'chegando':'corrida',dist:s.d,distMax:s.dm||1,sinal:s.si,vidas:s.vi,vel:s.vel||st.vel,escudos:s.es||0,
    cv,vivoTx:s.tx||'',queda:s.q?1:0,inter:s.in?1:0,invT:s.iv?1:0,desafio:s.ds?{n:s.ds[0],t:s.ds[1]}:null,
    obs:(s.o||[]).map(o=>o[0]==='parede'?{k:'parede',x:o[1],gy:o[2],gap:o[3],w:o[4],emo:o[5]||undefined,mov:o[6]||0,vel:o[7]||undefined}
      :{k:o[0],x:o[1],y:o[2],base:o[2],r:o[3],emo:o[4]||undefined,vx:o[5]||0,vy:o[6]||0,vel:o[7]||undefined,tub:!!o[8],fase:0,amp:0}),
    itens:(s.i||[]).map(i=>i.length>2?{k:'letra',x:i[0],y:i[1],ch:i[2],oculta:!!i[3],r:20,t:0}:{x:i[0],y:i[1],r:18,t:0}),
    avisos:(s.a||[]).map(a=>({k:'raio',x:a[0],w:a[1],t:a[2],ativo:a[3]})),
    zonas:(s.z||[]).map(z=>({x:z[0],w:z[1]}))});
  if(s.bt&&(s.bt!==st.bannerTxt||s.bn>st.banner)){st.bannerTxt=s.bt;st.banner=s.bn}
  if(novoJogo){st.x=s.x;st.y=s.y}
  vivo.alvo={x:s.x,y:s.y};
}
function vivoPasso(dt){ // entre um retrato e outro, o jogo continua andando sozinho pra ficar liso
  st.scroll+=st.vel*dt;
  if(vivo.alvo){st.x+=(vivo.alvo.x-st.x)*Math.min(1,dt*10);st.y+=(vivo.alvo.y-st.y)*Math.min(1,dt*10)}
  if(st.remEstado==='corrida'){st.dist=Math.min(st.dist+st.vel*dt,st.distMax*1.6);
    for(const o of st.obs){o.x-=(o.vel||st.vel)*dt;if(o.k==='peixe'){o.x+=o.vx*dt;if(o.vy)o.y+=o.vy*dt}
      if(o.k==='parede'&&o.mov){o.gy+=o.mov*dt;if(o.gy<30||o.gy+o.gap>H-30)o.mov*=-1}}
    for(const i of st.itens){i.x-=st.vel*dt;i.t+=dt}
    for(const z of st.zonas)z.x-=st.vel*dt;
    for(const a of st.avisos){a.t-=dt;if(a.t<=0)a.ativo+=dt}
    if(st.desafio)st.desafio.t=Math.max(0,st.desafio.t-dt)}
  if(R()<.6)st.parts.push(particulaRastro(st.vivoSk?st.vivoSk.rastro:'padrao'));
  // sem notícia: a pessoa saiu, fechou o jogo ou está numa versão antiga
  const sem=(performance.now()-vivo.ultT)/1000;vivo.espera+=dt;
  const d=tel.dados,acabou=d&&(!d.vez||d.vez.uid!==vivo.uid||elosDe(d).some(e=>e.de===vivo.uid));
  if(d&&telOrdem(d)&&telDaVez(d)===fb.uid&&!elosDe(d).some(e=>e.de===fb.uid)&&!(d.vez&&d.vez.uid===vivo.uid&&!vivo.perdeu&&vivo.viu)){toast('🎮 É A SUA VEZ!');vivoSai();return}
  if(vivo.viu&&!vivo.perdeu&&sem>8){toast('📴 A transmissão caiu');vivoSai()}
  else if(vivo.perdeu&&(sem>25||acabou)){vivoSai()}
  else if(!vivo.viu&&vivo.espera>12){toast(acabou?'A vez dessa pessoa já acabou':'📴 Sem transmissão (a pessoa pode estar com uma versão antiga do jogo)');vivoSai()}
}
$('vivoSair').addEventListener('click',()=>vivoSai());
