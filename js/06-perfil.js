// ================= PERFIL, VISUAL E RANKING =================
const CORES_ENV=[
 {id:'branco',n:'Branco',p:0,c:'#ffffff',l:'#c9d4e8'},{id:'azul',n:'Céu',p:300,c:'#cdeeff',l:'#4fc3ff'},
 {id:'rosa',n:'Chiclete',p:600,c:'#ffd6ee',l:'#ff7ac0'},{id:'menta',n:'Menta',p:900,c:'#cbffe6',l:'#2a9e66'},
 {id:'ouro',n:'Dourado',p:1500,c:'#ffe27a',l:'#c99700'},{id:'neon',n:'Neon',p:3000,c:'#151530',l:'#2df5c0',neon:1},
 {id:'arco',n:'Arco-íris',p:6000,arco:1,l:'#ffffff'},
 {id:'melancia',n:'Melancia',p:1200,c:'#ff8fa3',l:'#2a9e66',sem:1},
 {id:'gelo',n:'Gelo',p:1800,c:'#e6fbff',l:'#7fd8ff',brilho:1},
 {id:'por',n:'Pôr do sol',p:2400,grad:['#ffb347','#ff5e8a'],l:'#b03a5b'},
 {id:'lava',n:'Lava',p:3500,grad:['#ff4d2e','#ffd24d'],l:'#7a1a0a',anim:1},
 {id:'galaxia',n:'Galáxia',p:4500,grad:['#2b1055','#7597de'],l:'#c9b6ff',estrelas:1},
 {id:'holo',n:'Holográfico',p:9000,holo:1,l:'#ffffff'}];
const RASTROS=[{id:'padrao',n:'Clássico',p:0},{id:'estrela',n:'Estrelas',p:500},{id:'coracao',n:'Corações',p:1000},
 {id:'fogo',n:'Fogo',p:2000},{id:'arco',n:'Arco-íris',p:4000},{id:'letras',n:'Letrinhas',p:8000},
 {id:'bolhas',n:'Bolhas',p:700},
 {id:'notas',n:'Notas musicais',p:1400},
 {id:'folhas',n:'Folhinhas',p:1800},
 {id:'confete',n:'Confete',p:2600},
 {id:'pixel',n:'Pixel',p:3000},
 {id:'raio',n:'Raios',p:5000}];
const CARAS=[{id:'feliz',n:'Feliz',p:0},{id:'oculos',n:'Óculos',p:400},{id:'bravo',n:'Bravo',p:800},
 {id:'apaixonado',n:'Apaixonado',p:1200},{id:'robo',n:'Robô',p:2500},{id:'coroa',n:'Rei',p:5000},
 {id:'piscando',n:'Piscando',p:600},
 {id:'surpreso',n:'Surpreso',p:1000},
 {id:'dormindo',n:'Dorminhoco',p:1600},
 {id:'pirata',n:'Pirata',p:2000},
 {id:'estrela',n:'Olhos de estrela',p:3200},
 {id:'rindo',n:'Chorando de rir',p:4000}];
const ACESSORIOS=[{id:'nenhum',n:'Nenhum',p:0},
 {id:'bone',n:'Boné',p:300},
 {id:'festa',n:'Chapéu de festa',p:700},
 {id:'laco',n:'Laço',p:1100},
 {id:'fone',n:'Fone de ouvido',p:1700},
 {id:'antena',n:'Antena',p:2300},
 {id:'chifres',n:'Chifrinhos',p:2800},
 {id:'aureola',n:'Auréola',p:3600},
 {id:'cartola',n:'Cartola',p:5500}];
const SELOS=[{id:'nenhum',n:'Nenhum',p:0},
 {id:'coracao',n:'❤️ Coração',p:250,e:'❤️'},
 {id:'estrela',n:'⭐ Estrela',p:650,e:'⭐'},
 {id:'raio',n:'⚡ Raio',p:1300,e:'⚡'},
 {id:'fogo',n:'🔥 Fogo',p:1900,e:'🔥'},
 {id:'trevo',n:'🍀 Trevo',p:2600,e:'🍀'},
 {id:'caveira',n:'💀 Caveira',p:3300,e:'💀'},
 {id:'coroa',n:'👑 Coroa',p:7000,e:'👑'}];
// títulos: ganha fazendo coisas, não com pontos
const TITULOS=[{id:'novato',n:'📮 Carteiro novato',d:'Começo de tudo',ok:p=>true},
 {id:'entregador',n:'📦 Entregador',d:'Faça 5 entregas',ok:p=>p.entregas>=5},
 {id:'veloz',n:'💨 Mensageiro veloz',d:'Faça 25 entregas',ok:p=>p.entregas>=25},
 {id:'perfeito',n:'💯 Perfeccionista',d:'5 entregas perfeitas',ok:p=>p.perfeitas>=5},
 {id:'mestre',n:'🎓 Mestre da entrega',d:'25 entregas perfeitas',ok:p=>p.perfeitas>=25},
 {id:'coelho',n:'🍀 Pé de coelho',d:'Tirar a Fibra 1 Giga na roleta',ok:p=>(p.lendas||0)>=1},
 {id:'azar',n:'💀 Ímã de azar',d:'Cair 5 vezes numa conexão do azar',ok:p=>(p.azares||0)>=5},
 {id:'plateia',n:'👀 Plateia fiel',d:'Assistir ao vivo 5 vezes',ok:p=>(p.assistiu||0)>=5},
 {id:'lenda',n:'👑 Lenda do sinal',d:'Chegue a 10000 pontos',ok:p=>p.pts>=10000}];
const LISTAS_PTS=()=>[...CORES_ENV,...RASTROS,...CARAS,...ACESSORIOS,...SELOS];
function tituloDe(id){const t=TITULOS.find(x=>x.id===id);return t?t.n:''}
function checaTitulos(){const vistos=perfil.titVistos||['novato'];const novos=TITULOS.filter(t=>t.ok(perfil)&&!vistos.includes(t.id));
  if(novos.length){perfil.titVistos=[...vistos,...novos.map(t=>t.id)];salvaPerfil();setTimeout(()=>toast('🏅 Título novo: '+novos.map(t=>t.n).join(', ')+'!'),3600)}}
function contaPerfil(k){perfil[k]=(perfil[k]||0)+1;salvaPerfil();checaTitulos()}
let perfil=(()=>{try{return Object.assign({pts:0,entregas:0,somaPct:0,perfeitas:0,cor:'branco',rastro:'padrao',cara:'feliz'},JSON.parse(ls.get('entrega_perfil','{}')))}catch(e){return {pts:0,entregas:0,somaPct:0,perfeitas:0,cor:'branco',rastro:'padrao',cara:'feliz'}}})();
let rankRemoto=null;
function salvaPerfil(){ls.set('entrega_perfil',JSON.stringify(perfil))}
const achaItem=(lista,id)=>lista.find(x=>x.id===id)||lista[0];
function skin(){return {cor:achaItem(CORES_ENV,perfil.cor),rastro:perfil.rastro,cara:perfil.cara,ace:perfil.ace||'nenhum',selo:perfil.selo||'nenhum'}}
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
  const d={nome:ls.get('entrega_nome','Jogador').slice(0,12),pts,entregas:perfil.entregas,media:mediaPct(),perfeitas:perfil.perfeitas,titulo:perfil.titulo||'novato'};
  // se as regras do banco não aceitarem o título, salva sem ele
  try{try{await fb.api.rankSalvar(d)}catch(e){delete d.titulo;await fb.api.rankSalvar(d)}rankRemoto=pts;
    if(perfil.pts>rankRemoto)setTimeout(enviaRanking,500)}catch(e){}
}
function ganhaPontos(pts,pct){
  const antes=perfil.pts;perfil.pts+=Math.max(0,Math.round(pts));
  if(pct!=null){perfil.entregas++;perfil.somaPct+=pct;if(pct===100)perfil.perfeitas++}
  salvaPerfil();
  const novos=LISTAS_PTS().filter(x=>x.p>antes&&x.p<=perfil.pts);
  if(novos.length)setTimeout(()=>toast('🎽 Desbloqueou: '+novos.map(x=>x.n).join(', ')+'!'),2700);
  checaTitulos();
  if(rankRemoto==null)sincronizaRanking();else enviaRanking();
}
// ---- desenho do envelope personalizado ----
function coracaoPath(g,x,y,s){g.beginPath();g.moveTo(x,y+s*.35);g.bezierCurveTo(x-s,y-s*.35,x-s*.45,y-s*1.05,x,y-s*.45);g.bezierCurveTo(x+s*.45,y-s*1.05,x+s,y-s*.35,x,y+s*.35);g.closePath()}
function desenhaEnvelope(g,x,y,sk,t,o={}){
  const c=sk.cor;g.save();g.translate(x,y);g.rotate(o.rot||0);if(o.esc)g.scale(o.esc,o.esc);
  let fill=c.c;
  if(c.arco){fill=g.createLinearGradient(-24,0,24,0);for(let i=0;i<6;i++)fill.addColorStop(i/5,`hsl(${(t*90+i*60)%360},90%,72%)`)}
  if(c.holo){fill=g.createLinearGradient(-24,-16,24,16);for(let i=0;i<4;i++)fill.addColorStop(i/3,`hsl(${(t*60+i*80)%360},80%,85%)`)}
  if(c.grad){const k=c.anim?Math.sin(t*3)*12:0;fill=g.createLinearGradient(-24+k,-16,24-k,16);fill.addColorStop(0,c.grad[0]);fill.addColorStop(1,c.grad[1])}
  g.shadowColor=c.neon?c.l:'#5cf0a8';g.shadowBlur=c.neon?24:18;g.fillStyle=fill;rr2(g,-24,-16,48,32,6);g.fill();g.shadowBlur=0;
  if(c.neon){g.strokeStyle=c.l;g.lineWidth=2;g.stroke()}
  if(c.sem){g.fillStyle='#1b2550';for(const [a,b] of [[-15,-6],[-6,10],[14,-8],[16,9],[-17,8]]){g.beginPath();g.ellipse(a,b,1.3,2.2,.3,0,7);g.fill()}}
  if(c.estrelas){g.fillStyle='#fff';for(let i=0;i<7;i++){const a=(i*53)%44-22,b=(i*31)%28-14;g.globalAlpha=.5+.5*Math.sin(t*4+i);g.fillRect(a,b,1.6,1.6)}g.globalAlpha=1}
  if(c.brilho){g.strokeStyle='rgba(255,255,255,.9)';g.lineWidth=1.5;const k=((t*30)%80)-40;g.beginPath();g.moveTo(k,-16);g.lineTo(k-10,16);g.stroke()}
  g.strokeStyle=c.l;g.lineWidth=2;g.beginPath();g.moveTo(-24,-14);g.lineTo(0,4);g.lineTo(24,-14);g.stroke();
  const tinta=c.neon?c.l:'#1b2550';g.fillStyle=tinta;g.strokeStyle=tinta;g.lineWidth=2;
  const boca=()=>{g.beginPath();if(o.rindo){g.arc(0,9,6,0,Math.PI);g.fill()}else if(o.serio){g.moveTo(-5,11);g.lineTo(5,11);g.stroke()}else{g.arc(0,9,4,.2,2.9);g.stroke()}};
  const cara=sk.cara;
  if(cara==='oculos'){g.fillStyle='#111';rr2(g,-14,1,11,7,2);g.fill();rr2(g,3,1,11,7,2);g.fill();g.fillRect(-3,3,6,2);g.strokeStyle=tinta;boca()}
  else if(cara==='bravo'){g.beginPath();g.arc(-8,7,2.4,0,7);g.arc(8,7,2.4,0,7);g.fill();g.beginPath();g.moveTo(-13,0);g.lineTo(-4,4);g.moveTo(13,0);g.lineTo(4,4);g.stroke();
    g.beginPath();if(o.rindo){g.arc(0,9,6,0,Math.PI);g.fill()}else{g.arc(0,14,4,3.4,6);g.stroke()}}
  else if(cara==='apaixonado'){g.fillStyle='#ff3d6e';coracaoPath(g,-8,7,5);g.fill();coracaoPath(g,8,7,5);g.fill();g.fillStyle=tinta;boca()}
  else if(cara==='robo'){g.fillStyle=c.neon?c.l:'#00b8d9';g.fillRect(-12,2,7,6);g.fillRect(5,2,7,6);g.strokeStyle=tinta;g.strokeRect(-7,10,14,4);g.beginPath();for(let i=-4;i<=4;i+=4){g.moveTo(i,10);g.lineTo(i,14)}g.stroke()}
  else if(cara==='piscando'){g.beginPath();g.moveTo(-11,6);g.lineTo(-5,6);g.stroke();g.beginPath();g.arc(8,6,2.6,0,7);g.fill();boca()}
  else if(cara==='surpreso'){g.beginPath();g.arc(-8,5,3.2,0,7);g.arc(8,5,3.2,0,7);g.fill();g.beginPath();g.arc(0,12,3.2,0,7);g.stroke()}
  else if(cara==='dormindo'){g.beginPath();g.arc(-8,5,3,.2,2.9);g.stroke();g.beginPath();g.arc(8,5,3,.2,2.9);g.stroke();g.beginPath();g.arc(0,11,2,0,7);g.stroke();
    g.font='bold 9px sans-serif';g.textAlign='left';g.globalAlpha=.6+.4*Math.sin(t*3);g.fillText('z',18,-18-((t*8)%6));g.font='bold 7px sans-serif';g.fillText('z',24,-24-((t*8)%6));g.globalAlpha=1}
  else if(cara==='pirata'){g.fillStyle='#111';g.beginPath();g.arc(-8,6,4.2,0,7);g.fill();g.strokeStyle='#111';g.lineWidth=1.5;g.beginPath();g.moveTo(-24,-4);g.lineTo(-4,4);g.moveTo(-12,3);g.lineTo(24,-6);g.stroke();
    g.fillStyle=tinta;g.strokeStyle=tinta;g.lineWidth=2;g.beginPath();g.arc(8,6,2.6,0,7);g.fill();g.beginPath();g.arc(2,9,4,.1,2.4);g.stroke()}
  else if(cara==='estrela'){g.fillStyle='#ffd24d';for(const ex of [-8,8]){g.beginPath();for(let i=0;i<10;i++){const r=i%2?2:4.6,a=-Math.PI/2+i*Math.PI/5;g.lineTo(ex+Math.cos(a)*r,6+Math.sin(a)*r)}g.closePath();g.fill()}g.fillStyle=tinta;boca()}
  else if(cara==='rindo'){g.beginPath();g.moveTo(-11,7);g.lineTo(-8,4);g.lineTo(-5,7);g.moveTo(5,7);g.lineTo(8,4);g.lineTo(11,7);g.stroke();g.beginPath();g.arc(0,9,6,0,Math.PI);g.fill();
    g.fillStyle='#4fc3ff';const q=(t*1.5)%1;g.beginPath();g.arc(-14,8+q*8,1.8,0,7);g.arc(14,8+q*8,1.8,0,7);g.fill()}
  else{g.beginPath();g.arc(-8,6,2.6,0,7);g.arc(8,6,2.6,0,7);g.fill();boca()}
  if(cara==='coroa'){g.fillStyle='#ffd24d';g.strokeStyle='#c99700';g.lineWidth=1.5;g.beginPath();g.moveTo(-12,-16);g.lineTo(-12,-28);g.lineTo(-6,-21);g.lineTo(0,-31);g.lineTo(6,-21);g.lineTo(12,-28);g.lineTo(12,-16);g.closePath();g.fill();g.stroke()}
  desenhaAcessorio(g,sk.ace,t);
  const se=SELOS.find(x=>x.id===sk.selo);if(se&&se.e){g.save();g.translate(16,-7);g.rotate(.25);g.font='11px serif';g.textAlign='center';g.textBaseline='middle';g.fillText(se.e,0,0);g.restore()}
  g.restore();
}
function desenhaAcessorio(g,a,t){
  if(!a||a==='nenhum')return;g.save();g.lineWidth=1.5;
  if(a==='bone'){g.fillStyle='#ff4d6d';g.beginPath();g.arc(-2,-16,12,Math.PI,0);g.fill();g.fillRect(6,-18,16,4);g.fillStyle='#fff';g.beginPath();g.arc(-2,-28,2,0,7);g.fill()}
  else if(a==='festa'){g.translate(4,-16);g.rotate(.15);g.fillStyle='#b48cff';g.beginPath();g.moveTo(-9,0);g.lineTo(9,0);g.lineTo(0,-22);g.closePath();g.fill();
    g.strokeStyle='#ffd24d';g.lineWidth=2;g.beginPath();g.moveTo(-6,-6);g.lineTo(6,-6);g.moveTo(-3,-13);g.lineTo(3,-13);g.stroke();g.fillStyle='#ff7ac0';g.beginPath();g.arc(0,-23,3.2,0,7);g.fill()}
  else if(a==='laco'){g.translate(14,-16);g.fillStyle='#ff3d6e';g.beginPath();g.moveTo(0,0);g.lineTo(-10,-7);g.lineTo(-10,7);g.closePath();g.fill();g.beginPath();g.moveTo(0,0);g.lineTo(10,-7);g.lineTo(10,7);g.closePath();g.fill();g.fillStyle='#c4174a';g.beginPath();g.arc(0,0,3,0,7);g.fill()}
  else if(a==='fone'){g.strokeStyle='#2a2f45';g.lineWidth=3;g.beginPath();g.arc(0,-8,25,Math.PI*1.08,Math.PI*1.92);g.stroke();g.fillStyle='#ff4d6d';rr2(g,-29,-12,8,13,3);g.fill();rr2(g,21,-12,8,13,3);g.fill()}
  else if(a==='antena'){g.strokeStyle='#8f9ad0';g.lineWidth=2;g.beginPath();g.moveTo(0,-16);g.lineTo(0,-30);g.stroke();g.fillStyle=Math.sin(t*6)>0?'#5cf0a8':'#ff4d6d';g.shadowColor=g.fillStyle;g.shadowBlur=8;g.beginPath();g.arc(0,-32,3.5,0,7);g.fill()}
  else if(a==='chifres'){g.fillStyle='#e8344e';for(const s of [-1,1]){g.beginPath();g.moveTo(s*8,-16);g.lineTo(s*16,-16);g.lineTo(s*15,-28);g.closePath();g.fill()}}
  else if(a==='aureola'){g.strokeStyle='#ffd24d';g.lineWidth=3;g.shadowColor='#ffe680';g.shadowBlur=10;g.beginPath();g.ellipse(0,-27+Math.sin(t*3)*1.5,13,4,0,0,7);g.stroke()}
  else if(a==='cartola'){g.fillStyle='#15182a';g.fillRect(-15,-19,30,4);g.fillRect(-10,-36,20,18);g.fillStyle='#e8344e';g.fillRect(-10,-23,20,4)}
  g.restore();
}
function rr2(g,x,y,w,h,r){g.beginPath();g.roundRect(x,y,w,h,r)}
function particulaRastro(r=perfil.rastro){
  const b={x:st.x-22,y:st.y+(R()-.5)*10,vx:-st.vel*.3-R()*60,vy:(R()-.5)*30,v:.6,c:'#5cf0a8',s:3+R()*3};
  if(r==='estrela')Object.assign(b,{e:'✦',c:'#ffe680',s:3+R()*2});
  if(r==='coracao')Object.assign(b,{e:'♥',c:R()<.5?'#ff5c8a':'#ff9ad5',s:3+R()*2});
  if(r==='fogo')Object.assign(b,{c:['#ffd24d','#ff9a3d','#ff4d2e'][Math.floor(R()*3)],vy:-30-R()*50,s:4+R()*4});
  if(r==='arco')Object.assign(b,{c:`hsl(${(st.t*200)%360},90%,65%)`,s:4+R()*3});
  if(r==='letras')Object.assign(b,{e:'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(R()*26)],c:'#e9f3ff',s:3+R()*2});
  if(r==='bolhas')Object.assign(b,{e:'○',c:'#9fe8ff',vy:-25-R()*35,s:2+R()*3});
  if(r==='notas')Object.assign(b,{e:R()<.5?'♪':'♫',c:['#b48cff','#ff9ad5','#5cf0a8'][Math.floor(R()*3)],vy:-20-R()*30,s:3+R()*2});
  if(r==='folhas')Object.assign(b,{e:'🍃',s:2+R()*1.5,vy:20+R()*30});
  if(r==='confete')Object.assign(b,{c:`hsl(${Math.floor(R()*360)},90%,65%)`,vy:(R()-.5)*120,s:3+R()*3});
  if(r==='pixel')Object.assign(b,{c:['#5cf0a8','#2a9e66','#b8ffdf'][Math.floor(R()*3)],s:5,vx:-st.vel*.2,vy:0,y:st.y+Math.round((R()-.5)*3)*6});
  if(r==='raio')Object.assign(b,{e:'⚡',s:2.5+R()*1.5});
  return b;
}
// ---- telas ----
async function mostraMeuId(){const e=()=>$('meuId');if(!conversasAtivas())return;
  try{await fb.iniciar();const adm=await souAdmin();if(e())e().innerHTML=`🆔 Seu ID de jogador: <code style="user-select:all">${fb.uid}</code> <span data-a="copiarId" style="cursor:pointer">📋</span>${adm?'<br>👑 Você é admin':''}`}catch(x){}}
let visAba='cor';
const VIS_ABAS=[['cor','🎨 Cor'],['cara','😀 Carinha'],['ace','🎩 Chapéu'],['selo','📮 Selo'],['rastro','✨ Rastro'],['titulo','🏅 Título']];
function telaVisual(){setTimeout(mostraMeuId,0);
  const sec=(lista,atual,tipo)=>`<div class="vis">`+lista.map(x=>{const ok=perfil.pts>=x.p;
    return `<button class="${ok?'':'bloq '}${atual===x.id?'on':''}" data-a="${ok?'skin':'nada'}" data-n="${tipo}:${x.id}">${ok?'':'🔒 '}${x.n}${ok?'':`<small>${x.p} pts</small>`}</button>`}).join('')+'</div>';
  const secTit=()=>`<div class="vis">`+TITULOS.map(x=>{const ok=x.ok(perfil);
    return `<button class="${ok?'':'bloq '}${(perfil.titulo||'novato')===x.id?'on':''}" data-a="${ok?'skin':'nadaTit'}" data-n="titulo:${x.id}">${ok?'':'🔒 '}${x.n}<small>${x.d}</small></button>`}).join('')+'</div>';
  const listas={cor:[CORES_ENV,perfil.cor],cara:[CARAS,perfil.cara],ace:[ACESSORIOS,perfil.ace||'nenhum'],selo:[SELOS,perfil.selo||'nenhum'],rastro:[RASTROS,perfil.rastro]};
  const prox=LISTAS_PTS().filter(x=>x.p>perfil.pts).sort((a,b)=>a.p-b.p)[0];
  const tem=LISTAS_PTS().filter(x=>perfil.pts>=x.p).length,total=LISTAS_PTS().length;
  painel(`<h2>🎽 Visual da mensagem</h2>
    <canvas id="prev" width="320" height="120" style="width:100%;max-width:320px;height:auto;border-radius:14px;background:#0b1020;display:block;margin:6px auto"></canvas>
    <p style="font-size:14px;margin:4px 0;text-align:center">${tituloDe(perfil.titulo||'novato')}</p>
    <p style="font-size:14px;margin:4px 0">⭐ <b>${perfil.pts}</b> pontos${prox?` · próximo: ${prox.n} com ${prox.p}`:' · tudo desbloqueado!'} · 🎒 ${tem}/${total}</p>
    <div class="abas" style="grid-template-columns:repeat(3,1fr)">${VIS_ABAS.map(([k,n])=>`<button class="${visAba===k?'on':''}" data-a="visAba" data-n="${k}">${n}</button>`).join('')}</div>
    ${visAba==='titulo'?secTit():sec(listas[visAba][0],listas[visAba][1],visAba)}
    <button class="rosa" data-a="visSorteia">🎲 VISUAL ALEATÓRIO</button>
    <p class="dica">Você ganha pontos entregando mensagens nas Conversas e vencendo fases nos outros modos.</p>
    <p class="dica" id="meuId"></p>
    <button class="sec" data-a="menu">VOLTAR</button>`);
}
function visSorteia(){
  const pega=l=>{const ok=l.filter(x=>perfil.pts>=x.p);return ok[Math.floor(R()*ok.length)].id};
  Object.assign(perfil,{cor:pega(CORES_ENV),cara:pega(CARAS),ace:pega(ACESSORIOS),selo:pega(SELOS),rastro:pega(RASTROS)});salvaPerfil();sfx('clique');telaVisual();
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
    const linhas=l.length?l.map((x,i)=>`<div class="rk ${x.uid===fb.uid?'eu':''}"><b>${['🥇','🥈','🥉'][i]||(i+1)+'º'}</b><span>${esc(x.nome)}${x.uid===fb.uid?' (você)':''}${tituloDe(x.titulo)?`<small class="rkTit">${tituloDe(x.titulo)}</small>`:''}</span><em>${val(x)}</em>${adm&&x.uid!==fb.uid?`<button class="rkDel" data-a="rankApaga" data-n="${x.uid}">🗑️</button>`:''}</div>`).join(''):'<p>Ninguém aqui ainda. Seja o primeiro!</p>';
    if($('painel').classList.contains('oculta'))return;
    painel(topo+`<div class="rks">${linhas}</div>`+rodape);
  }catch(e){painel(topo+'<p class="ruim">Não consegui carregar o ranking. Confira a internet.</p>'+rodape)}
}
