// ================= ROLETA DA CONEXÃO + DESAFIO FINAL =================
const SORTES={
  lenda:{e:'🍀🍀',n:'JACKPOT!',cor:'#5cf0a8',som:'vitoria'},
  sorte:{e:'🍀',n:'LUCKY!',cor:'#5cf0a8',som:'vitoria'},
  normal:{e:'😐',n:'NOTHING SPECIAL',cor:'#ffd24d',som:'sinal'},
  azar:{e:'💀',n:'UNLUCKY!',cor:'#ff6b8a',som:'perdeu'}};
let rolFim=null,rolGiro=0;
function sorteiaCanal(pool){let tot=0;for(const c of pool)tot+=PESO_CANAL[c.id]||0;let r=R()*tot;
  for(const c of pool){r-=PESO_CANAL[c.id]||0;if(r<0)return c}return pool[pool.length-1]}
function roleta(txt,chave){
  if(ch.aberto)fechaChat();if(typeof tel!=='undefined'&&(tel.tela==='lobby'||tel.tela==='reescrever'))tel.tela='canal';
  const letras=partes(txt||'').filter(ehLetra).length,pool=CANAIS.filter(c=>PESO_CANAL[c.id]&&!(c.id==='bt'&&letras>20));
  const salvo=chave?canalDe(ls.get('entrega_rol_'+chave,'')):null,jaTinha=!!(salvo&&pool.includes(salvo));
  rolFim=jaTinha?salvo:sorteiaCanal(pool);if(chave)ls.set('entrega_rol_'+chave,rolFim.id);
  painel(`<h2>🎰 Connection roulette</h2>
    <p style="font-size:14px">Luck decides which way your message goes. A bad connection is worth <b>more points</b>!</p>
    <div class="roleta" id="rol"><span id="rolE">❔</span><b id="rolN">spinning…</b></div><div id="rolRes"></div>`);
  const giro=++rolGiro;
  if(jaTinha)return mostraSorte(true);
  let k=0;const passos=20+Math.floor(R()*5);
  (function passo(){
    if(giro!==rolGiro||!$('rolE'))return;
    const c=k>=passos?rolFim:pool[(k+Math.floor(R()*pool.length))%pool.length];
    $('rolE').textContent=c.e;$('rolN').textContent=c.n;sfx('clique');
    if(k++>=passos)return mostraSorte(false);
    setTimeout(passo,55+k*k*1.1)})();
}
function mostraSorte(jaTinha){
  const c=rolFim,t=SORTES[SORTE_CANAL[c.id]]||SORTES.normal;if(!jaTinha){sfx(t.som);if(SORTE_CANAL[c.id]==='lenda')contaPerfil('lendas');if(SORTE_CANAL[c.id]==='azar')contaPerfil('azares')}
  $('rolE').textContent=c.e;$('rolN').textContent=c.n;$('rol').classList.add('para');
  $('rolRes').innerHTML=`<div class="sorteTxt" style="color:${t.cor}">${t.e} ${t.n}</div>
    ${jaTinha?'<p class="dica">Luck had already decided this turn.</p>':''}
    <p style="font-size:14px;margin:4px 0">✅ ${c.v}<br>⚠️ ${c.p}<br>⭐ points x${c.mult}</p>
    <p class="dica">🏁 At the end of the path there is a surprise challenge for this connection!</p>
    <button data-a="rolJoga">▶ PLAY</button><button class="sec" data-a="canalVolta">BACK</button>`;
}

// cada conexão tem 2 desafios finais; sorteia um
const DESAFIOS={
  g4:[{n:'🚇 Subway tunnel',ev:.9,f:d=>{st.zonas.push({x:W+20,w:150+R()*90});gerarItem()}},
      {n:'💸 Carrier promo spam',ev:.6,f:()=>st.obs.push({k:'spam',x:W+40,y:60+R()*(H-120),vy:(R()<.5?-1:1)*(90+R()*90),r:20})}],
  cabo:[{n:'🐀 Rat nest',ev:.55,f:()=>st.obs.push({k:'peixe',emo:'🐀',x:W+60,y:H*.3+R()*H*.4,r:17,vx:-170-R()*120})},
        {n:'🚧 Roadwork',ev:1.7,f:()=>{const gap=Math.max(130,H*.26),gy=H*.28+R()*(H*.44-gap);st.obs.push({k:'parede',emo:'🚧',x:W+40,gy,gap,w:30})}}],
  wifi:[{n:'🍿 Microwave is on',ev:.8,ini:d=>{d.inter=1},f:()=>st.obs.push({k:'peixe',emo:'🍿',x:W+60,y:60+R()*(H-120),r:18,vx:-60-R()*60})},
        {n:'👨‍👩‍👧 Whole family on the Wi-Fi',ev:.6,f:()=>{const y=60+R()*(H-120);st.obs.push({k:'virus',emo:['📺','🎮','📱','💻'][Math.floor(R()*4)],x:W+40,y,base:y,r:20,fase:R()*6,amp:40+R()*50})}}],
  sat:[{n:'☄️ Meteor shower',ev:.5,f:()=>st.obs.push({k:'peixe',emo:'☄️',x:W*.25+R()*W*.8,y:-30,r:18,vx:-30,vy:240+R()*120,vel:st.vel*.4})},
       {n:'🛰️ Space junk',ev:.45,f:()=>st.obs.push({k:'peixe',emo:['🛰️','🔩','🪛'][Math.floor(R()*3)],x:W+60,y:60+R()*(H-120),r:18,vx:-120-R()*80,vy:(R()-.5)*160})}],
  bt:[{n:'🎧 Headphones disconnecting',ev:.7,ini:d=>{d.invCd=1.2},f:()=>st.obs.push({k:'peixe',emo:'🎧',x:W+60,y:60+R()*(H-120),r:18,vx:-90-R()*60})},
      {n:'🔊 Speaker at full blast',ev:1.5,f:()=>{const gap=150,gy=50+R()*(H-100-gap);st.obs.push({k:'parede',emo:'🔊',x:W+40,gy,gap,w:30,mov:R()<.5?-70:70})}}],
  radio:[{n:'⛈️ Radio storm',ev:1.2,f:()=>{st.avisos.push({k:'raio',x:st.x,w:46,t:1,ativo:0});if(R()<.4)st.avisos.push({k:'raio',x:40+R()*(W*.65),w:46,t:.9,ativo:0})}},
         {n:'📢 DJ who never stops talking',ev:.6,f:()=>st.obs.push({k:'spam',emo:'📢',x:W+40,y:60+R()*(H-120),vy:(R()<.5?-1:1)*(70+R()*80),r:20})}],
  vizinho:[{n:'🔌 Neighbor unplugged it',ev:.85,ini:d=>{d.queda=1},f:()=>{const y=60+R()*(H-120);st.obs.push({k:'virus',x:W+40,y,base:y,r:20,fase:R()*6,amp:40})}},
           {n:'🔒 Neighbor changed the password',ev:1.6,f:()=>{const gap=150,gy=50+R()*(H-100-gap);st.obs.push({k:'parede',emo:'🔒',x:W+40,gy,gap,w:30,mov:R()<.5?-60:60})}}],
  giga:[{n:'🚀 Max speed',ev:.5,ini:d=>{d.vel=st.vel;st.vel*=1.6},fim:d=>{st.vel=d.vel},f:()=>{const y=60+R()*(H-120);st.obs.push({k:'virus',x:W+40,y,base:y,r:20,fase:R()*6,amp:30})}},
        {n:'👷 Cable guy',ev:1.1,f:()=>st.obs.push({k:'peixe',emo:'👷',x:W+60,y:60+R()*(H-120),r:20,vx:-80-R()*40,segue:1.1})}]};
const DUR_DESAFIO=7;
function iniciaDesafio(){
  const lista=DESAFIOS[st.cv.id];if(!lista){st.desafioOk=true;return}
  const d={...lista[Math.floor(R()*lista.length)],t:DUR_DESAFIO,cd:.6,invT:0};
  st.desafio=d;st.desafioNome=d.n;if(d.ini)d.ini(d);sfx('alarme');
  st.sinal=Math.max(st.sinal,70);const ajuda=st.vidas<=2&&!(st.escudos>0);if(ajuda)st.escudos=1;
  st.filaAvisos=ajuda?['🛡️ EMERGENCY SHIELD!']:[];
  st.banner=2.4;st.bannerTxt='🏁 FINAL CHALLENGE: '+d.n.toUpperCase();
}
function atualizaDesafio(dt){
  const d=st.desafio;d.t-=dt;d.cd-=dt;
  if(d.inter){d.iT=(d.iT??0)+dt;if(d.iT%2.2<1.2)st.inter=.1}
  d.itT=(d.itT??.4)-dt;if(d.itT<=0){gerarItem();d.itT=1.1}
  if(d.queda){d.qT=(d.qT??.8)-dt;if(d.qT<=0){st.queda=1;d.qT=2.6}}
  if(d.invCd){d.invC=(d.invC??1.5)-dt;if(d.invC<=0){st.invT=1.1;d.invC=2.6;st.banner=.9;st.bannerTxt='🔄 CONTROLS FLIPPED!'}}
  if(d.cd<=0&&d.t>.8){d.f(d);d.cd=d.ev*(.85+R()*.3)}
  if(d.t<=0){if(d.fim)d.fim(d);st.desafio=null;st.desafioOk=true;st.invT=0;st.banner=1.8;st.bannerTxt='✅ CHALLENGE CLEARED!';sfx('sinal')}
}
