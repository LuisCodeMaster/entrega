// ================= PERFIL, VISUAL E RANKING =================
const CORES_ENV=[
 {id:'branco',n:'Branco',p:0,c:'#ffffff',l:'#c9d4e8'},{id:'azul',n:'Céu',p:300,c:'#cdeeff',l:'#4fc3ff'},
 {id:'rosa',n:'Chiclete',p:600,c:'#ffd6ee',l:'#ff7ac0'},{id:'menta',n:'Menta',p:900,c:'#cbffe6',l:'#2a9e66'},
 {id:'ouro',n:'Dourado',p:1500,c:'#ffe27a',l:'#c99700'},{id:'neon',n:'Neon',p:3000,c:'#151530',l:'#2df5c0',neon:1},
 {id:'arco',n:'Arco-íris',p:6000,arco:1,l:'#ffffff'}];
const RASTROS=[{id:'padrao',n:'Clássico',p:0},{id:'estrela',n:'Estrelas',p:500},{id:'coracao',n:'Corações',p:1000},
 {id:'fogo',n:'Fogo',p:2000},{id:'arco',n:'Arco-íris',p:4000},{id:'letras',n:'Letrinhas',p:8000}];
const CARAS=[{id:'feliz',n:'Feliz',p:0},{id:'oculos',n:'Óculos',p:400},{id:'bravo',n:'Bravo',p:800},
 {id:'apaixonado',n:'Apaixonado',p:1200},{id:'robo',n:'Robô',p:2500},{id:'coroa',n:'Rei',p:5000}];
let perfil=(()=>{try{return Object.assign({pts:0,entregas:0,somaPct:0,perfeitas:0,cor:'branco',rastro:'padrao',cara:'feliz'},JSON.parse(ls.get('entrega_perfil','{}')))}catch(e){return {pts:0,entregas:0,somaPct:0,perfeitas:0,cor:'branco',rastro:'padrao',cara:'feliz'}}})();
let rankRemoto=null;
function salvaPerfil(){ls.set('entrega_perfil',JSON.stringify(perfil))}
const achaItem=(lista,id)=>lista.find(x=>x.id===id)||lista[0];
function skin(){return {cor:achaItem(CORES_ENV,perfil.cor),rastro:perfil.rastro,cara:perfil.cara}}
function mediaPct(){return perfil.entregas?Math.round(perfil.somaPct/perfil.entregas):0}
async function sincronizaRanking(){
  if(!conversasAtivas())return;
  try{await fb.iniciar();const r=await fb.api.rankMeu();rankRemoto=r?r.pts:0;
    if(r&&r.pts>perfil.pts){Object.assign(perfil,{pts:r.pts,entregas:r.entregas,perfeitas:r.perfeitas,somaPct:r.media*r.entregas});salvaPerfil()}
    else if(perfil.pts>rankRemoto)await enviaRanking();
  }catch(e){}
}
async function enviaRanking(){
  if(!fb.pronto||rankRemoto==null)return;
  const pts=Math.min(perfil.pts,rankRemoto+3000);
  try{await fb.api.rankSalvar({nome:ls.get('entrega_nome','Jogador').slice(0,12),pts,entregas:perfil.entregas,media:mediaPct(),perfeitas:perfil.perfeitas});rankRemoto=pts;
    if(perfil.pts>rankRemoto)setTimeout(enviaRanking,500)}catch(e){}
}
function ganhaPontos(pts,pct){
  const antes=perfil.pts;perfil.pts+=Math.max(0,Math.round(pts));
  if(pct!=null){perfil.entregas++;perfil.somaPct+=pct;if(pct===100)perfil.perfeitas++}
  salvaPerfil();
  const novos=[...CORES_ENV,...RASTROS,...CARAS].filter(x=>x.p>antes&&x.p<=perfil.pts);
  if(novos.length)setTimeout(()=>toast('🎽 Desbloqueou: '+novos.map(x=>x.n).join(', ')+'!'),2700);
  if(rankRemoto==null)sincronizaRanking();else enviaRanking();
}
// ---- desenho do envelope personalizado ----
function coracaoPath(g,x,y,s){g.beginPath();g.moveTo(x,y+s*.35);g.bezierCurveTo(x-s,y-s*.35,x-s*.45,y-s*1.05,x,y-s*.45);g.bezierCurveTo(x+s*.45,y-s*1.05,x+s,y-s*.35,x,y+s*.35);g.closePath()}
function desenhaEnvelope(g,x,y,sk,t,o={}){
  const c=sk.cor;g.save();g.translate(x,y);g.rotate(o.rot||0);if(o.esc)g.scale(o.esc,o.esc);
  let fill=c.c;
  if(c.arco){fill=g.createLinearGradient(-24,0,24,0);for(let i=0;i<6;i++)fill.addColorStop(i/5,`hsl(${(t*90+i*60)%360},90%,72%)`)}
  g.shadowColor=c.neon?c.l:'#5cf0a8';g.shadowBlur=c.neon?24:18;g.fillStyle=fill;rr2(g,-24,-16,48,32,6);g.fill();g.shadowBlur=0;
  if(c.neon){g.strokeStyle=c.l;g.lineWidth=2;g.stroke()}
  g.strokeStyle=c.l;g.lineWidth=2;g.beginPath();g.moveTo(-24,-14);g.lineTo(0,4);g.lineTo(24,-14);g.stroke();
  const tinta=c.neon?c.l:'#1b2550';g.fillStyle=tinta;g.strokeStyle=tinta;g.lineWidth=2;
  const boca=()=>{g.beginPath();if(o.rindo){g.arc(0,9,6,0,Math.PI);g.fill()}else if(o.serio){g.moveTo(-5,11);g.lineTo(5,11);g.stroke()}else{g.arc(0,9,4,.2,2.9);g.stroke()}};
  const cara=sk.cara;
  if(cara==='oculos'){g.fillStyle='#111';rr2(g,-14,1,11,7,2);g.fill();rr2(g,3,1,11,7,2);g.fill();g.fillRect(-3,3,6,2);g.strokeStyle=tinta;boca()}
  else if(cara==='bravo'){g.beginPath();g.arc(-8,7,2.4,0,7);g.arc(8,7,2.4,0,7);g.fill();g.beginPath();g.moveTo(-13,0);g.lineTo(-4,4);g.moveTo(13,0);g.lineTo(4,4);g.stroke();
    g.beginPath();if(o.rindo){g.arc(0,9,6,0,Math.PI);g.fill()}else{g.arc(0,14,4,3.4,6);g.stroke()}}
  else if(cara==='apaixonado'){g.fillStyle='#ff3d6e';coracaoPath(g,-8,7,5);g.fill();coracaoPath(g,8,7,5);g.fill();g.fillStyle=tinta;boca()}
  else if(cara==='robo'){g.fillStyle=c.neon?c.l:'#00b8d9';g.fillRect(-12,2,7,6);g.fillRect(5,2,7,6);g.strokeStyle=tinta;g.strokeRect(-7,10,14,4);g.beginPath();for(let i=-4;i<=4;i+=4){g.moveTo(i,10);g.lineTo(i,14)}g.stroke()}
  else{g.beginPath();g.arc(-8,6,2.6,0,7);g.arc(8,6,2.6,0,7);g.fill();boca()}
  if(cara==='coroa'){g.fillStyle='#ffd24d';g.strokeStyle='#c99700';g.lineWidth=1.5;g.beginPath();g.moveTo(-12,-16);g.lineTo(-12,-28);g.lineTo(-6,-21);g.lineTo(0,-31);g.lineTo(6,-21);g.lineTo(12,-28);g.lineTo(12,-16);g.closePath();g.fill();g.stroke()}
  g.restore();
}
function rr2(g,x,y,w,h,r){g.beginPath();g.roundRect(x,y,w,h,r)}
function particulaRastro(){
  const r=perfil.rastro,b={x:st.x-22,y:st.y+(R()-.5)*10,vx:-st.vel*.3-R()*60,vy:(R()-.5)*30,v:.6,c:'#5cf0a8',s:3+R()*3};
  if(r==='estrela')Object.assign(b,{e:'✦',c:'#ffe680',s:3+R()*2});
  if(r==='coracao')Object.assign(b,{e:'♥',c:R()<.5?'#ff5c8a':'#ff9ad5',s:3+R()*2});
  if(r==='fogo')Object.assign(b,{c:['#ffd24d','#ff9a3d','#ff4d2e'][Math.floor(R()*3)],vy:-30-R()*50,s:4+R()*4});
  if(r==='arco')Object.assign(b,{c:`hsl(${(st.t*200)%360},90%,65%)`,s:4+R()*3});
  if(r==='letras')Object.assign(b,{e:'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(R()*26)],c:'#e9f3ff',s:3+R()*2});
  return b;
}
// ---- telas ----
async function mostraMeuId(){const e=()=>$('meuId');if(!conversasAtivas())return;
  try{await fb.iniciar();const adm=await souAdmin();if(e())e().innerHTML=`🆔 Seu ID de jogador: <code style="user-select:all">${fb.uid}</code> <span data-a="copiarId" style="cursor:pointer">📋</span>${adm?'<br>👑 Você é admin':''}`}catch(x){}}
function telaVisual(){setTimeout(mostraMeuId,0);
  const sec=(tit,lista,atual,tipo)=>`<label>${tit}</label><div class="vis">`+lista.map(x=>{const ok=perfil.pts>=x.p;
    return `<button class="${ok?'':'bloq '}${atual===x.id?'on':''}" data-a="${ok?'skin':'nada'}" data-n="${tipo}:${x.id}">${ok?'':'🔒 '}${x.n}${ok?'':`<small>${x.p} pts</small>`}</button>`}).join('')+'</div>';
  const prox=[...CORES_ENV,...RASTROS,...CARAS].filter(x=>x.p>perfil.pts).sort((a,b)=>a.p-b.p)[0];
  painel(`<h2>🎽 Visual da mensagem</h2>
    <canvas id="prev" width="320" height="120" style="width:100%;max-width:320px;height:auto;border-radius:14px;background:#0b1020;display:block;margin:6px auto"></canvas>
    <p style="font-size:14px;margin:4px 0">⭐ <b>${perfil.pts}</b> pontos${prox?` · próximo: ${prox.n} com ${prox.p}`:' · tudo desbloqueado!'}</p>
    ${sec('Cor do envelope',CORES_ENV,perfil.cor,'cor')}${sec('Rastro',RASTROS,perfil.rastro,'rastro')}${sec('Carinha',CARAS,perfil.cara,'cara')}
    <p class="dica">Você ganha pontos entregando mensagens nas Conversas e vencendo fases nos outros modos.</p>
    <p class="dica" id="meuId"></p>
    <button class="sec" data-a="menu">VOLTAR</button>`);
}
const prevParts=[];
function desenhaPreview(t){
  const c=$('prev');if(!c||$('painel').classList.contains('oculta'))return;const g=c.getContext('2d');
  g.clearRect(0,0,320,120);const y=60+Math.sin(t*2)*8,x=200;
  const salvo=st;st={x,y,vel:200,t};if(R()<.8)prevParts.push(particulaRastro());st=salvo;
  for(const q of prevParts){q.x+=q.vx/60;q.y+=q.vy/60;q.v-=1/60}while(prevParts.length&&prevParts[0].v<=0)prevParts.shift();
  for(const q of prevParts){g.globalAlpha=Math.max(0,q.v*1.5);g.fillStyle=q.c;if(q.e){g.font=`${q.s*3.4}px serif`;g.textAlign='center';g.fillText(q.e,q.x,q.y)}else g.fillRect(q.x,q.y,q.s,q.s)}
  g.globalAlpha=1;desenhaEnvelope(g,x,y,skin(),t,{esc:1.6});
}
let rankAba='pts';
async function telaRanking(){
  const abas=[['pts','⭐ Pontos'],['media','🎯 Mais inteiras'],['perfeitas','💯 Perfeitas']];
  const topo=`<h2>🏆 Ranking</h2><div class="abas" style="grid-template-columns:repeat(3,1fr)">${abas.map(([k,n])=>`<button class="${rankAba===k?'on':''}" data-a="rankAba" data-n="${k}">${n}</button>`).join('')}</div>`;
  const rodape=`<p class="dica">Você: ⭐ ${perfil.pts} pts · ${perfil.entregas} entregas · ${mediaPct()}% de média · 💯 ${perfil.perfeitas}<br>"Mais inteiras" conta só quem tem 5 entregas ou mais.</p><button class="sec" data-a="menu">VOLTAR</button>`;
  if(!conversasAtivas())return painel(topo+'<p class="ruim">O ranking precisa do servidor das conversas.</p>'+rodape);
  painel(topo+'<p>Carregando…</p>'+rodape);
  try{
    await sincronizaRanking();
    let l=(await fb.api.rankTop(rankAba,rankAba==='media'?100:30)).map(x=>limpaObj(x,['nome']));const adm=await souAdmin();
    if(rankAba==='media')l=l.filter(x=>x.entregas>=5).slice(0,30);
    const val=x=>rankAba==='pts'?x.pts+' pts':rankAba==='media'?x.media+'%':x.perfeitas+' 💯';
    const linhas=l.length?l.map((x,i)=>`<div class="rk ${x.uid===fb.uid?'eu':''}"><b>${['🥇','🥈','🥉'][i]||(i+1)+'º'}</b><span>${esc(x.nome)}${x.uid===fb.uid?' (você)':''}</span><em>${val(x)}</em>${adm&&x.uid!==fb.uid?`<button class="rkDel" data-a="rankApaga" data-n="${x.uid}">🗑️</button>`:''}</div>`).join(''):'<p>Ninguém aqui ainda. Seja o primeiro!</p>';
    if($('painel').classList.contains('oculta'))return;
    painel(topo+`<div class="rks">${linhas}</div>`+rodape);
  }catch(e){painel(topo+'<p class="ruim">Não consegui carregar o ranking. Confira a internet.</p>'+rodape)}
}
