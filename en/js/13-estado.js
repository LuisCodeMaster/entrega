// ================= ESTADO =================
let st,dados={};
function novo(n,o={}){
  const f=FASES[n];
  st={n,f,x:W*0.22,y:H/2,vx:0,vy:0,dist:0,vel:(220+n*28)*(o.lento?0.85:1),scroll:0,sinal:o.sinal??100,vidas:o.vidas??3,inv:0,
      obs:[],itens:[],parts:[],tiros:[],meus:[],avisos:[],t:0,spawn:1,spawnItem:.8,pegos:0,
      estado:'corrida',banner:2.4,bannerTxt:(o.rotulo||'STAGE '+(n+1))+' — '+f.nome.toUpperCase(),shake:0,fimT:0,
      boss:null,fogo:0,distMax:o.dist||DIST,semChefe:!!o.semChefe,hpMul:o.hpMul||1,primeira:!!o.primeira,ultima:!!o.ultima,online:!!o.online,pings:[],cmd:null,luz:0,lento:!!o.lento};
}
function jogar(n){canalAtual=null;fixo=false;resize();fechaPainel();nivelSel=n;novo(n,{primeira:n===0,ultima:n===FASES.length-1})}
function jogarJ(){
  fixo=false;resize();fechaPainel();
  const seq=ROTAS[J.rota];dados={de:J.de,para:J.para};
  novo(seq[J.pos],{vidas:J.vidas,sinal:J.sinal,primeira:J.pos===0,ultima:J.pos===seq.length-1,rotulo:'LEG '+(J.pos+1)+'/5'});
  aplicaCanal();
}
function menu(){fechaChat();modo='treino';J=null;fixo=false;resize();mostraCtrl();telaInicio();novo(nivelSel);st.estado='parado'}

// ================= CONTROLES ONLINE =================
function mostraCtrl(){
  const emJogo=modo==='online'&&st&&st.estado!=='fim'&&st.estado!=='parado';
  $('ctrlOp').classList.toggle('oculta',!(emJogo&&!net.souPiloto));
  atualizaPad();
}
function atualizaPad(){
  const mostra=modo==='online'&&net.souPiloto&&st&&st.boss&&st.boss.escudo&&!st.boss.entrando&&st.estado==='chefe';
  const pad=$('pad');
  if(mostra&&pad.classList.contains('oculta')){
    pad.innerHTML=CORES.map((c,i)=>`<button data-cor="${i}" style="background:${c}">${NOMES_COR[i]}</button>`).join('');
    pad.classList.remove('oculta');
  }else if(!mostra&&!pad.classList.contains('oculta'))pad.classList.add('oculta');
}
$('pad').addEventListener('pointerdown',e=>{const b=e.target.closest('[data-cor]');if(!b)return;e.preventDefault();apertaCor(+b.dataset.cor)});
$('ctrlOp').addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.luz){if(st.luzCd>0)return;st.luzCd=8;envia({t:'luz'});return}
  envia({t:'cmd',txt:b.dataset.cmd});st.meuCmd={txt:b.dataset.cmd,v:.8};
});
function apertaCor(i){
  const b=st.boss;if(!b||!b.escudo)return;
  b.apertos=(b.apertos||[]);
  if(b.codigo[b.prog]===i){b.prog++;explodir(st.x,st.y,CORES[i],8);
    if(b.prog>=b.codigo.length){b.escudo=false;b.escudoT=b.hp<b.hpMax/2?5:6.5;st.banner=1.2;st.bannerTxt='SHIELD DOWN! SHOOT!'}}
  else{b.prog=0;b.codigo=novoCodigoCor(b);st.shake=.25;st.bannerTxt='WRONG CODE!';st.banner=1}
}
function novoCodigoCor(b){const n=b.hp<b.hpMax/2?4:3;return Array.from({length:n},()=>Math.floor(R()*4))}

// ================= ENTRADA =================
const keys={};let toque=null;
addEventListener('keydown',e=>{const k=e.key.toLowerCase();keys[k]=true;
  if(modo==='online'&&net.souPiloto&&'1234'.includes(k)&&k.length===1)apertaCor(+k-1)});
addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false});
const lx=e=>(e.clientX-OX)/SC,ly=e=>(e.clientY-OY)/SC;
cv.addEventListener('pointerdown',e=>{
  if(modo==='online'&&!net.souPiloto&&st&&st.estado!=='fim'){envia({t:'ping',x:Math.round(lx(e)),y:Math.round(ly(e))});st.pings.push({x:lx(e),y:ly(e),v:1});return}
  toque={id:e.pointerId,x:lx(e),y:ly(e)}});
cv.addEventListener('pointermove',e=>{if(toque&&e.pointerId===toque.id){toque.x=lx(e);toque.y=ly(e)}});
addEventListener('pointerup',e=>{if(toque&&e.pointerId===toque.id)toque=null});
addEventListener('pointercancel',e=>{if(toque&&e.pointerId===toque.id)toque=null});
