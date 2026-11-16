// ================= UPDATE =================
function update(dt){
  if(!st)return;
  st.t+=dt;st.banner-=dt;if(st.shake>0)st.shake-=dt;
  for(const p of st.pings)p.v-=dt;st.pings=st.pings.filter(p=>p.v>0);
  if(st.cmd){st.cmd.v-=dt;if(st.cmd.v<=0)st.cmd=null}
  if(st.meuCmd){st.meuCmd.v-=dt;if(st.meuCmd.v<=0)st.meuCmd=null}
  if(st.luz>0)st.luz-=dt;if(st.luzCd>0)st.luzCd-=dt;
  atualizaParts(dt);
  if(st.estado==='espectador'){st.scroll+=150*dt;return}
  if(st.estado==='fim'||st.estado==='parado'){st.scroll+=60*dt;return}
  const correndo=st.estado==='corrida';
  st.scroll+=st.vel*dt*(correndo?1:.45);
  if(st.online)enviaSnap(dt);
  if(st.estado==='chegando'){st.fimT+=dt;st.x+=(W*0.72-st.x)*dt*3;st.y+=(H*.5-st.y)*dt*3;if(st.fimT>1.8)faseVencida();return}
  if(st.estado==='vitoria'){st.fimT+=dt;st.x+=st.vel*dt*1.5;if(st.fimT>1.6)faseVencida();return}

  let ax=0,ay=0;
  if(keys['arrowup']||keys['w'])ay-=1;if(keys['arrowdown']||keys['s'])ay+=1;
  if(keys['arrowleft']||keys['a'])ax-=1;if(keys['arrowright']||keys['d'])ax+=1;
  const inv=st.mimo==='inv',pes=st.mimo==='lento'?.38:1;if(inv){ay=-ay;ax=-ax}
  let tq=toque?{x:toque.x,y:toque.y}:null;
  if(st.cv&&st.cv.id==='sat'){st.atrasos.push({t:st.t,ax,ay,tq});while(st.atrasos.length>1&&st.t-st.atrasos[1].t>=.45)st.atrasos.shift();
    const v=st.atrasos[0];if(st.t-v.t>=.45){ax=v.ax;ay=v.ay;tq=v.tq}else{ax=ay=0;tq=null}}
  if(st.cv&&st.cv.id==='wifi'&&correndo){st.interT-=dt;if(st.interT<=0){st.inter=1.3;st.interT=5+R()*3}
    if(st.inter>0){st.inter-=dt;ax+=(R()-.5)*3;ay+=(R()-.5)*3;if(tq){tq.x+=(R()-.5)*160;tq.y+=(R()-.5)*160}}}
  if(tq){const tx=inv?W-(tq.x+40):tq.x+40,ty=inv?H-(tq.y-50):tq.y-50;st.vx=(tx-st.x)*9*pes;st.vy=(ty-st.y)*9*pes}
  else{st.vx+=ax*1600*dt*pes;st.vy+=ay*1600*dt*pes;st.vx*=Math.pow(.02,dt);st.vy*=Math.pow(.02,dt)}
  const maxX=correndo?W*0.7:W*0.6;
  const cabo=st.cv&&st.cv.id==='cabo'&&correndo,yMin=cabo?H*.28:30,yMax=cabo?H*.72:H-30;
  st.x=Math.max(30,Math.min(maxX,st.x+st.vx*dt));st.y=Math.max(yMin,Math.min(yMax,st.y+st.vy*dt));

  let naZona=false;
  if(st.cv&&st.cv.id==='g4'&&correndo){st.zonaT-=dt;if(st.zonaT<=0&&st.dist<st.distMax*.9){st.zonas.push({x:W+20,w:180+R()*160});st.zonaT=4+R()*3}
    for(const z of st.zonas){z.x-=st.vel*dt;if(st.x>z.x&&st.x<z.x+z.w)naZona=true}st.zonas=st.zonas.filter(z=>z.x+z.w>-20)}
  st.naZona=naZona;
  st.sinal-=((correndo?5+st.n*1.2:3.2)*(st.cv?st.cv.dreno:1)+(naZona?28:0))*dt*(st.online?.8:1);
  if(st.sinal<=0){st.sinal=0;perdeu('sinal');return}
  if(st.inv>0)st.inv-=dt;
  if(R()<.8)st.parts.push(particulaRastro());

  if(st.filaAvisos&&st.filaAvisos.length&&st.banner<=.2){st.bannerTxt=st.filaAvisos.shift();st.banner=2.2}
  if(correndo){
    st.dist+=st.vel*dt;
    if(st.fila){while(st.fila.length&&st.dist+W*0.9>=st.fila[0].d){const l=st.fila.shift(),cb=st.cv&&st.cv.id==='cabo';st.itens.push({k:'letra',x:W+30+R()*60,y:cb?H*.3+R()*H*.4:60+R()*(H-120),r:20,t:R()*6,i:l.i,ch:l.ch,oculta:st.cv&&st.cv.id==='radio'&&R()<.5})}}
    if(st.mimo==='tubarao'&&st.dist<st.distMax*.95){st.tubT=(st.tubT||1.5)-dt;if(st.tubT<=0){st.tubT=1.6+R();st.obs.push({k:'peixe',tub:true,x:W+60,y:60+R()*(H-120),r:22,vx:-200-R()*80})}}
    if(st.fogoSempre){st.fogo-=dt;if(st.fogo<=0){st.meus.push({x:st.x+24,y:st.y,vx:620,fogo:1});st.fogo=.32}}
    if(st.dist<st.distMax*0.95){st.spawn-=dt;if(st.spawn<=0){gerarObstaculo();st.spawn=Math.max(.5,1.25-st.dist/st.distMax*.5-st.n*.08)*(.8+R()*.4)*(st.online?1.15:1)}}
    st.spawnItem-=dt;if(st.spawnItem<=0){gerarItem();st.spawnItem=(1.5+R()*1.1)*(st.cv&&st.cv.id==='wifi'?.5:1)}
    if(st.dist>=st.distMax&&st.obs.length===0){if(st.semChefe){st.estado='chegando';st.fimT=0;st.tiros=[];st.avisos=[]}else iniciaChefe()}
  }else{
    st.spawnItem-=dt;if(st.spawnItem<=0){gerarItem();st.spawnItem=2.2+R()*1.2}
    atualizaChefe(dt);
    if(!st.boss.entrando){st.fogo-=dt;if(st.fogo<=0){st.meus.push({x:st.x+24,y:st.y,vx:620,fogo:st.fogoSempre?1:0});st.fogo=.2}}
    if(st.online)atualizaPad();
  }

  const v=st.vel*(correndo?1:.45);
  for(const o of st.obs){
    o.x-=(o.vel||st.vel)*dt;
    if(o.k==='virus'){o.fase+=dt*2.4;o.y=o.base+Math.sin(o.fase)*o.amp}
    if(o.k==='spam'){o.y+=o.vy*dt;if(o.y<30||o.y>H-30)o.vy*=-1}
    if(o.k==='peixe')o.x+=o.vx*dt;
    if(o.k==='parede'&&o.mov){o.gy+=o.mov*dt;if(o.gy<30||o.gy+o.gap>H-30)o.mov*=-1}
  }
  for(const i of st.itens){i.x-=v*dt;i.t+=dt}
  for(const s of st.tiros){s.x+=s.vx*dt;s.y+=s.vy*dt;s.vida-=dt}
  for(const m of st.meus)m.x+=m.vx*dt;
  for(const a of st.avisos){a.t-=dt;if(a.t<=0)a.ativo+=dt}
  st.obs=st.obs.filter(o=>o.x>-80);st.itens=st.itens.filter(i=>i.x>-40&&!i.pego);
  st.tiros=st.tiros.filter(s=>s.vida>0&&s.x>-30&&s.x<W+30&&s.y>-30&&s.y<H+30);
  st.meus=st.meus.filter(m=>m.x<W+20&&!m.morto);
  st.avisos=st.avisos.filter(a=>a.ativo<.35);

  const pr=15;let bate=false;
  for(const i of st.itens)if(Math.hypot(i.x-st.x,i.y-st.y)<i.r+pr){i.pego=true;
    if(i.k==='letra'){J.c=J.c.filter(x=>x!==i.i);st.letrasPegas++;sfx('letra',st.letrasPegas);explodir(i.x,i.y,'#ffd24d',10);st.pegouT={ch:i.ch,v:.7}}
    else{st.pegos++;sfx('sinal');st.sinal=Math.min(100,st.sinal+22);explodir(i.x,i.y,'#4fc3ff',14)}}
  if(st.fogoSempre&&correndo){for(const m of st.meus)for(const o of st.obs)if(o.k!=='parede'&&!o.morto&&Math.hypot(o.x-m.x,o.y-m.y)<o.r+10){o.morto=m.morto=true;explodir(o.x,o.y,'#ff9a3d',12)}
    st.obs=st.obs.filter(o=>!o.morto);st.meus=st.meus.filter(m=>!m.morto)}
  for(const o of st.obs){
    if(o.k==='parede'){if(st.x+pr>o.x-o.w/2&&st.x-pr<o.x+o.w/2&&(st.y-pr<o.gy||st.y+pr>o.gy+o.gap))bate=true}
    else if(Math.hypot(o.x-st.x,o.y-st.y)<o.r+pr-4)bate=true;
  }
  for(const s of st.tiros)if(Math.hypot(s.x-st.x,s.y-st.y)<s.r+pr-5){bate=true;s.vida=0}
  for(const a of st.avisos)if(a.t<=0&&a.k==='raio'&&Math.abs(st.x-a.x)<a.w/2+pr-4)bate=true;
  const b=st.boss;
  if(b&&!b.entrando){
    if(Math.hypot(b.x-st.x,b.y-st.y)<52+pr)bate=true;
    for(const m of st.meus)if(Math.abs(m.x-b.x)<(b.escudo?72:50)&&Math.abs(m.y-b.y)<(b.escudo?72:56)){
      m.morto=true;
      if(b.escudo){explodir(m.x,m.y,'#9fd8ff',3);continue}
      b.hp-=m.fogo?2:1;b.flash=.08;explodir(m.x,m.y,m.fogo?'#ff9a3d':b.cor,4);
      if(b.hp<=0){derrotaChefe();return}
    }
  }
  if(bate&&st.inv<=0&&st.escudos>0){st.escudos--;sfx('escudo');st.inv=1.2;explodir(st.x,st.y,'#9fd8ff',20);st.banner=1;st.bannerTxt='SHIELD BROKE!';bate=false}
  if(bate&&st.inv<=0){
    st.vidas--;sfx('dano');st.inv=1.4;st.shake=.35;st.sinal=Math.max(0,st.sinal-10);explodir(st.x,st.y,'#ff5577',22);
    if(modo!=='treino'&&J){corromper(perdaPorDano());st.letraT=1.2}
    if(st.vidas<=0){perdeu('dano');return}
  }
}
function derrotaChefe(){sfx('explosao');
  const b=st.boss;
  for(let i=0;i<5;i++)explodir(b.x+(R()-.5)*60,b.y+(R()-.5)*60,i%2?b.cor:'#fff',24);
  st.shake=.6;st.tiros=[];st.obs=[];st.avisos=[];st.boss=null;st.meus=[];
  st.banner=2;st.bannerTxt=b.nome.toUpperCase()+' DEFEATED!';
  st.fimT=0;st.estado=st.ultima?'chegando':'vitoria';
  st.bossNome=b.nome;st.bossEmoji=b.emoji;
  if(st.online)atualizaPad();
}
function faseVencida(){sfx('vitoria');
  st.estado='fim';
  if(modo!=='chat'&&modo!=='telefone')ganhaPontos(120+st.vidas*40+st.pegos*10);
  if(modo==='treino'){
    if(st.n+1>liberado){liberado=Math.min(FASES.length-1,st.n+1);ls.set('entrega_lib',liberado)}
    return telaTreinoFim(true);
  }
  if(modo==='chat')return entregaConcluida();
  if(modo==='telefone')return telefoneConcluido();
  J.pts+=Math.round((300+st.vidas*150+st.pegos*30)*multCanal());
  J.pos++;J.vidas=Math.min(3,st.vidas+1);J.sinal=Math.max(70,st.sinal);
  if(modo==='online'){
    mostraCtrl();envia({t:'fim',ok:true,J,chefe:st.bossEmoji});
    if(J.pos>=ROTAS[J.rota].length)return telaOnlineChegou();
    return telaOnlineFaseOk(st.bossEmoji);
  }
  if(J.pos>=ROTAS[J.rota].length)return telaChegou();
  if(J.pos===CORTE)return telaPassar();
  telaFaseOk();
}
function perdeu(motivo){sfx('perdeu');
  st.estado='fim';
  if(modo==='chat'){setTimeout(()=>telaChatPerdeu(motivo),500);return}
  if(modo==='telefone'){setTimeout(()=>telaTelPerdeu(motivo),500);return}
  if(modo==='online'){mostraCtrl();envia({t:'fim',ok:false,motivo,J});setTimeout(()=>telaOnlinePerdeu(motivo),500);return}
  setTimeout(()=>modo==='jornada'?telaPerdeu(motivo):telaTreinoFim(false,motivo),500);
}
function atualizaParts(dt){for(const q of st.parts){q.x+=q.vx*dt;q.y+=q.vy*dt;q.v-=dt}st.parts=st.parts.filter(q=>q.v>0)}
function explodir(x,y,c,n){for(let i=0;i<n;i++){const a=R()*7,s=80+R()*220;st.parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,v:.5+R()*.4,c,s:3+R()*4})}}

// ---- sincronização ----
const r0=v=>Math.round(v);
function enviaSnap(dt){
  net.snapT-=dt;if(net.snapT>0)return;net.snapT=1/25;
  const b=st.boss;
  envia({t:'s',d:{x:r0(st.x),y:r0(st.y),vy:r0(st.vy),dist:r0(st.dist),sinal:r0(st.sinal),vidas:st.vidas,estado:st.estado,n:st.n,inv:+st.inv.toFixed(2),
    bannerTxt:st.bannerTxt,banner:+st.banner.toFixed(2),shake:+Math.max(0,st.shake).toFixed(2),fimT:+st.fimT.toFixed(2),primeira:st.primeira,ultima:st.ultima,
    obs:st.obs.map(o=>o.k==='parede'?[0,r0(o.x),r0(o.gy),r0(o.gap),o.w]:[o.k==='virus'?1:o.k==='spam'?2:3,r0(o.x),r0(o.y),r0(o.r)]),
    itens:st.itens.map(i=>[r0(i.x),r0(i.y)]),
    tiros:st.tiros.map(s=>[r0(s.x),r0(s.y),s.r,s.cor]),
    meus:st.meus.map(m=>[r0(m.x),r0(m.y)]),
    avisos:st.avisos.map(a=>a.k==='raio'?[0,r0(a.x),a.w,+a.t.toFixed(2)]:[1,r0(a.y),a.h,+a.t.toFixed(2)]),
    boss:b?{x:r0(b.x),y:r0(b.y),hp:b.hp,hpMax:b.hpMax,emoji:b.emoji,cor:b.cor,nome:b.nome,fala:b.fala,falaT:+b.falaT.toFixed(2),flash:+b.flash.toFixed(2),entrando:b.entrando,
      escudo:b.escudo,codigo:b.codigo,prog:b.prog,escudoT:+(b.escudoT||0).toFixed(1)}:null}});
}
function aplicaSnap(d){
  const tipos=['virus','spam','peixe'];
  const antes=st.vidas;
  Object.assign(st,{x:d.x,y:d.y,vy:d.vy,dist:d.dist,sinal:d.sinal,vidas:d.vidas,n:d.n,f:FASES[d.n],inv:d.inv,bannerTxt:d.bannerTxt,banner:d.banner,
    fimT:d.fimT,primeira:d.primeira,ultima:d.ultima,remEstado:d.estado,
    obs:d.obs.map(o=>o[0]===0?{k:'parede',x:o[1],gy:o[2],gap:o[3],w:o[4]}:{k:tipos[o[0]-1],x:o[1],y:o[2],r:o[3]}),
    itens:d.itens.map(i=>({x:i[0],y:i[1],r:18,t:0})),
    tiros:d.tiros.map(s=>({x:s[0],y:s[1],r:s[2],cor:s[3]})),
    meus:d.meus.map(m=>({x:m[0],y:m[1]})),
    avisos:d.avisos.map(a=>a[0]===0?{k:'raio',x:a[1],w:a[2],t:a[3]}:{k:'faixa',y:a[1],h:a[2],t:a[3]}),
    boss:d.boss});
  if(d.shake>0)st.shake=d.shake;
  if(d.vidas<antes)explodir(d.x,d.y,'#ff5577',18);
  st.snap=true;
}
