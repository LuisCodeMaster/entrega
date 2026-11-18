// ================= DESENHO =================
function rr(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
const wrap=(v,m)=>((v%m)+m)%m;
function estadoVisivel(){return st.estado==='espectador'?(st.remEstado||'corrida'):st.estado}
function fundo(){
  const f=st.f,off=st.scroll,ev=estadoVisivel();
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,f.ceu[0]);g.addColorStop(1,f.ceu[1]);
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  const n=st.n;
  if(n===0){ctx.globalAlpha=.12;ctx.strokeStyle='#fff';ctx.lineWidth=3;
    for(let i=0;i<6;i++){const x=wrap(i*260-off*.2,W+260)-130;for(let k=1;k<4;k++){ctx.beginPath();ctx.arc(x,H*.75,k*30,-2.4,-.74);ctx.stroke()}}
    ctx.globalAlpha=1}
  if(n===1){for(let i=0;i<20;i++){ctx.fillStyle='rgba(255,255,255,.5)';ctx.fillRect(wrap(i*97-off*.05,W),(i*53)%(H*.4),2,2)}
    for(let i=0;i<5;i++){const x=wrap(i*340-off*.35,W+340)-170;
      ctx.strokeStyle='rgba(255,255,255,.18)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-30,H);ctx.lineTo(x,H*.45);ctx.lineTo(x+30,H);ctx.moveTo(x-20,H*.75);ctx.lineTo(x+20,H*.75);ctx.stroke();
      ctx.fillStyle='rgba(255,90,90,'+(.4+.4*Math.sin(st.t*4+i))+')';ctx.beginPath();ctx.arc(x,H*.45,5,0,7);ctx.fill()}}
  if(n===2){ctx.fillStyle='rgba(255,255,255,.08)';
    for(let i=0;i<25;i++){const x=wrap(i*83-off*.3,W),y=H-((st.t*40+i*61)%H);ctx.beginPath();ctx.arc(x,y,2+(i%3),0,7);ctx.fill()}
    ctx.strokeStyle='#f2a93b';ctx.lineWidth=10;ctx.beginPath();for(let x=0;x<=W;x+=20)ctx.lineTo(x,H-40+Math.sin((x+off)*.01)*8);ctx.stroke();
    ctx.strokeStyle='#ffd27a';ctx.lineWidth=2;ctx.stroke()}
  if(n===3){for(let i=0;i<8;i++){const x=wrap(i*170-off*.4,W+170)-85;
      ctx.fillStyle='rgba(255,255,255,.05)';ctx.fillRect(x-40,H*.2,80,H*.8);
      for(let j=0;j<10;j++){ctx.fillStyle=(Math.sin(st.t*6+i*3+j*7)>.3)?'rgba(92,240,168,.6)':'rgba(92,240,168,.12)';ctx.fillRect(x-30,H*.24+j*28,6,4)}}}
  if(n===4){for(let i=0;i<12;i++){const x=wrap(i*120-off*.3,W+120)-60,h=80+(i*37)%140;
      ctx.fillStyle='rgba(30,10,30,.5)';ctx.fillRect(x,H-h,90,h);
      ctx.fillStyle='rgba(255,220,120,.5)';for(let j=0;j<h/30-1;j++){ctx.fillRect(x+15,H-h+12+j*28,10,10);ctx.fillRect(x+60,H-h+12+j*28,10,10)}}}
  if(ev==='chefe'){ctx.fillStyle='rgba(255,0,40,'+(.05+.04*Math.sin(st.t*3))+')';ctx.fillRect(0,0,W,H)}
  if(st.primeira&&ev==='corrida'){const sx=W*0.08-st.dist*0.8;if(sx>-120)celular(sx,H/2,dados.de||'Você','#5cf0a8')}
  if(ev==='chegando'){const k=Math.min(1,st.fimT/1.2);celular(W+80-(W*0.2+80)*k,H/2,dados.para||'Destino','#ff9ad5')}
}
function celular(x,y,nome,cor){
  ctx.save();ctx.translate(x,y);
  ctx.fillStyle='#111';rr(-55,-100,110,200,18);ctx.fill();
  ctx.fillStyle='#e9f3ff';rr(-48,-86,96,172,10);ctx.fill();
  ctx.fillStyle=cor;rr(-48,-86,96,26,[10,10,0,0]);ctx.fill();
  ctx.fillStyle='#08321d';ctx.font='700 14px "Baloo 2"';ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillText(nome,0,-68);
  ctx.fillStyle='#ccd';for(let i=0;i<3;i++){rr(-40+(i%2)*20,-50+i*34,56,22,8);ctx.fill()}
  ctx.restore();
}
function mensagem(){
  if(st.escudos>0){ctx.strokeStyle='rgba(159,216,255,'+(.55+.3*Math.sin(st.t*7))+')';ctx.lineWidth=4;ctx.beginPath();ctx.arc(st.x,st.y,36,0,7);ctx.stroke()}
  if(st.pegouT&&st.pegouT.v>0){ctx.globalAlpha=Math.min(1,st.pegouT.v*2);ctx.font='800 22px "Baloo 2", serif';ctx.fillStyle='#ffd24d';ctx.textAlign='center';ctx.fillText('+'+st.pegouT.ch,st.x,st.y-34-(.7-st.pegouT.v)*30);ctx.globalAlpha=1;st.pegouT.v-=1/60}
  if(st.inv>0&&Math.floor(st.t*14)%2)return;
  const rindo=st.efeitos&&st.efeitos.includes('kkk');
  const sk=st.vivo?(st.vivoSk||{cor:CORES_ENV[0],rastro:'padrao',cara:'feliz'}):(modo==='online'&&!net.souPiloto)?{cor:CORES_ENV[0],rastro:'padrao',cara:'feliz'}:skin();
  desenhaEnvelope(ctx,st.x,st.y,sk,st.t,{rot:Math.max(-.35,Math.min(.35,(st.vy||0)*.0012))+(rindo?Math.sin(st.t*22)*.12:0),rindo,serio:estadoVisivel()==='chefe'});
  if(st.letraT>0){ctx.globalAlpha=Math.min(1,st.letraT);ctx.font='800 16px "Baloo 2"';ctx.fillStyle='#ff6b8a';ctx.textAlign='center';ctx.fillText('letras perdidas!',st.x,st.y-30-(1.2-st.letraT)*20);ctx.globalAlpha=1;st.letraT-=1/60}
}
function desenhaObs(){
  for(const o of st.obs){
    if(o.k==='parede'){
      for(const [y0,y1] of [[0,o.gy],[o.gy+o.gap,H]]){
        const g=ctx.createLinearGradient(o.x-o.w/2,0,o.x+o.w/2,0);g.addColorStop(0,'#ff3d2e');g.addColorStop(.5,'#ffb13b');g.addColorStop(1,'#ff3d2e');
        ctx.fillStyle=g;ctx.fillRect(o.x-o.w/2,y0,o.w,y1-y0);
        ctx.fillStyle='rgba(120,20,10,.5)';for(let yy=y0;yy<y1;yy+=22)ctx.fillRect(o.x-o.w/2,yy,o.w,3);
      }
      ctx.font='22px serif';ctx.textAlign='center';ctx.textBaseline='alphabetic';
      ctx.fillText(o.emo||'🔥',o.x,o.gy-6+Math.sin(st.t*10)*2);ctx.fillText(o.emo||'🔥',o.x,o.gy+o.gap+24+Math.sin(st.t*10+1)*2);
    }else{
      ctx.save();ctx.translate(o.x,o.y);
      if(o.k==='virus'&&!o.emo)ctx.rotate(st.t*2);
      if(o.k==='spam'){ctx.fillStyle='rgba(255,60,90,.25)';ctx.beginPath();ctx.arc(0,0,o.r+6,0,7);ctx.fill()}
      ctx.font=(o.r*2)+'px serif';ctx.textAlign='center';ctx.textBaseline='middle';
      if(o.k==='peixe')ctx.scale(-1,1);
      ctx.fillText(o.emo||(o.tub?'🦈':{virus:'🦠',spam:'📧',peixe:'🐟'}[o.k]),0,2);
      if(o.k==='spam'){ctx.font='800 10px "Baloo 2"';ctx.fillStyle='#ff4d6d';ctx.fillText('SPAM',0,o.r+10)}
      ctx.restore();
    }
  }
  for(const i of st.itens){
    if(i.k==='letra'){ctx.save();ctx.translate(i.x,i.y+Math.sin(st.t*3+i.t)*5);ctx.rotate(Math.sin(st.t*2+i.t)*.15);
      ctx.shadowColor='#ffd24d';ctx.shadowBlur=14;ctx.fillStyle='#fff7d6';rr(-17,-19,34,38,8);ctx.fill();ctx.shadowBlur=0;
      ctx.strokeStyle='#ffb13b';ctx.lineWidth=3;ctx.stroke();ctx.fillStyle='#3a2a00';ctx.font='800 24px "Baloo 2", serif';ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText(i.oculta&&Math.hypot(i.x-st.x,i.y-st.y)>110?'?':i.ch,0,2);ctx.restore();continue}
    ctx.save();ctx.translate(i.x,i.y+Math.sin(st.t*4+i.x*.01)*4);
    ctx.fillStyle='rgba(79,195,255,.25)';ctx.beginPath();ctx.arc(0,0,i.r+4,0,7);ctx.fill();
    ctx.strokeStyle='#4fc3ff';ctx.lineWidth=3;ctx.lineCap='round';
    for(let k=1;k<=3;k++){ctx.beginPath();ctx.arc(0,8,k*5.5,-2.4,-.74);ctx.stroke()}
    ctx.fillStyle='#4fc3ff';ctx.beginPath();ctx.arc(0,8,2.5,0,7);ctx.fill();ctx.restore();
  }
}
function desenhaAvisos(){
  for(const a of st.avisos){
    const ativo=a.t<=0,pisca=Math.floor(st.t*12)%2;
    if(a.k==='raio'){
      if(ativo){ctx.fillStyle='rgba(255,240,120,.9)';ctx.fillRect(a.x-a.w/2,0,a.w,H);
        ctx.strokeStyle='#fff';ctx.lineWidth=4;ctx.beginPath();let y=0,x=a.x;ctx.moveTo(x,0);while(y<H){y+=30;x=a.x+(R()-.5)*a.w*.8;ctx.lineTo(x,y)}ctx.stroke()}
      else{ctx.fillStyle=pisca?'rgba(255,230,80,.28)':'rgba(255,230,80,.12)';ctx.fillRect(a.x-a.w/2,0,a.w,H);
        ctx.font='26px serif';ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillText('⚡',a.x,60)}
    }
    if(a.k==='faixa'&&!ativo){ctx.fillStyle=pisca?'rgba(90,170,230,.3)':'rgba(90,170,230,.12)';ctx.fillRect(0,a.y-a.h/2,W,a.h);
      ctx.font='800 18px "Baloo 2"';ctx.fillStyle='#bfe6ff';ctx.textAlign='left';ctx.textBaseline='alphabetic';ctx.fillText('◀◀ CUIDADO',W*0.5,a.y+6)}
  }
}
function desenhaChefe(alpha=1){
  const b=st.boss;if(!b)return;
  ctx.save();ctx.globalAlpha=alpha;ctx.translate(b.x,b.y);
  const pulso=1+Math.sin(st.t*5)*.04;ctx.scale(pulso,pulso);
  ctx.shadowColor=b.cor;ctx.shadowBlur=30;
  ctx.fillStyle=b.flash>0?'#fff':'rgba(20,20,40,.85)';ctx.beginPath();ctx.arc(0,0,58,0,7);ctx.fill();ctx.shadowBlur=0;
  ctx.strokeStyle=b.cor;ctx.lineWidth=5;ctx.stroke();
  ctx.font='64px serif';ctx.textAlign='center';ctx.textBaseline='middle';
  if(st.n===2)ctx.scale(-1,1);
  ctx.fillText(b.emoji,0,4);ctx.restore();
  ctx.save();ctx.globalAlpha=alpha;
  if(b.escudo&&!b.entrando){ // bolha de escudo
    ctx.strokeStyle='rgba(159,216,255,'+(.6+.3*Math.sin(st.t*8))+')';ctx.lineWidth=6;ctx.beginPath();ctx.arc(b.x,b.y,74,0,7);ctx.stroke();
    ctx.fillStyle='rgba(159,216,255,.12)';ctx.fill();
  }
  ctx.fillStyle='#ff2e4d';ctx.beginPath();ctx.arc(b.x-18,b.y-44,5,0,7);ctx.arc(b.x+18,b.y-44,5,0,7);ctx.fill();
  if(b.falaT>0&&!b.entrando){
    ctx.font='700 15px "Baloo 2"';const tw=ctx.measureText(b.fala).width+20;
    const bx=Math.max(10,b.x-tw-40),by=b.y-90;
    ctx.fillStyle='rgba(255,255,255,.95)';rr(bx,by,tw,30,12);ctx.fill();
    ctx.fillStyle='#1b2550';ctx.textAlign='left';ctx.textBaseline='alphabetic';ctx.fillText(b.fala,bx+10,by+20);
  }
  ctx.restore();
}
function desenhaTiros(alpha=1){
  ctx.save();ctx.globalAlpha=alpha;ctx.textAlign='center';ctx.textBaseline='middle';
  for(const s of st.tiros){ctx.fillStyle=s.cor;ctx.shadowColor=s.cor;ctx.shadowBlur=10;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,7);ctx.fill()}
  ctx.shadowBlur=0;ctx.font='800 18px "Baloo 2"';ctx.fillStyle='#5cf0a8';
  for(const m of st.meus)ctx.fillText('✓',m.x,m.y);
  ctx.restore();
}
// escuridão do piloto
function escuridao(){
  const ev=estadoVisivel();
  let raio=ev==='chefe'?135:100;if(st.luz>0)raio+=Math.min(1,st.luz)*520;
  if(ev==='vitoria'||ev==='chegando')raio=900;
  const g=ctx.createRadialGradient(st.x,st.y,raio*.55,st.x,st.y,raio);
  g.addColorStop(0,'rgba(2,3,8,0)');g.addColorStop(1,'rgba(2,3,8,.97)');
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  // pistas fracas: chefe e tiros
  if(st.boss)desenhaChefe(.3);
  desenhaTiros(.14);
  // pings do operador
  for(const p of st.pings){
    const a=Math.min(1,p.v);ctx.strokeStyle='rgba(255,210,77,'+a+')';ctx.lineWidth=4;
    ctx.beginPath();ctx.arc(p.x,p.y,18+(1.6-p.v)*30,0,7);ctx.stroke();
    ctx.fillStyle='rgba(255,210,77,'+a+')';ctx.font='800 22px "Baloo 2"';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('!',p.x,p.y);
    // seta a partir da mensagem
    const ang=Math.atan2(p.y-st.y,p.x-st.x);ctx.save();ctx.translate(st.x+Math.cos(ang)*46,st.y+Math.sin(ang)*46);ctx.rotate(ang);
    ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(-6,-8);ctx.lineTo(-6,8);ctx.closePath();ctx.fill();ctx.restore();
  }
}
// visão do operador: radar + código do escudo
function camadaOperador(){
  ctx.strokeStyle='rgba(92,240,168,.08)';ctx.lineWidth=1;
  for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}
  for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
  // área que o piloto enxerga
  ctx.strokeStyle='rgba(255,255,255,.35)';ctx.setLineDash([6,6]);ctx.lineWidth=2;
  ctx.beginPath();ctx.arc(st.x,st.y,estadoVisivel()==='chefe'?100:75,0,7);ctx.stroke();ctx.setLineDash([]);
  for(const p of st.pings){ctx.strokeStyle='rgba(255,210,77,'+Math.min(1,p.v)+')';ctx.lineWidth=3;ctx.beginPath();ctx.arc(p.x,p.y,18+(1-p.v)*20,0,7);ctx.stroke()}
  const b=st.boss;
  if(b&&b.escudo&&!b.entrando&&b.codigo){
    const n=b.codigo.length,w=n*52+30,x0=(W-w)/2,y0=H-112;
    ctx.fillStyle='rgba(0,0,0,.7)';rr(x0,y0,w,58,14);ctx.fill();
    ctx.font='700 12px "Baloo 2"';ctx.fillStyle='#bfe6ff';ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillText('DITE O CÓDIGO DO ESCUDO',W/2,y0-6);
    b.codigo.forEach((c,i)=>{const cx=x0+30+i*52,cy=y0+29;
      ctx.fillStyle=CORES[c];ctx.globalAlpha=i<b.prog?.25:1;ctx.beginPath();ctx.arc(cx,cy,19,0,7);ctx.fill();ctx.globalAlpha=1;
      if(i===b.prog){ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.stroke()}
      ctx.fillStyle='#000';ctx.font='800 9px "Baloo 2"';ctx.textBaseline='middle';ctx.fillText(NOMES_COR[c].slice(0,3),cx,cy)});
  }else if(b&&!b.escudo&&b.escudoT>0){ctx.font='800 16px "Baloo 2"';ctx.fillStyle='#5cf0a8';ctx.textAlign='center';ctx.fillText('ESCUDO DESLIGADO: '+b.escudoT.toFixed(0)+'s',W/2,H-70)}
  if(st.meuCmd){ctx.globalAlpha=Math.min(1,st.meuCmd.v*2);ctx.font='800 20px "Baloo 2"';ctx.fillStyle='#ffd24d';ctx.textAlign='center';ctx.fillText('enviado: '+st.meuCmd.txt,W/2,H*.42);ctx.globalAlpha=1}
  if(st.luzCd>0){ctx.font='700 12px "Baloo 2"';ctx.fillStyle='#ffd24d';ctx.textAlign='right';ctx.fillText('💡 '+Math.ceil(st.luzCd)+'s',W-14,H-66)}
  if(!st.snap){ctx.font='800 20px "Baloo 2"';ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText('Conectando ao radar…',W/2,H/2)}
}
function hud(){
  const bw=Math.min(W-40,520),bx=(W-bw)/2,by=16,ev=estadoVisivel();
  ctx.textBaseline='alphabetic';
  ctx.fillStyle='rgba(0,0,0,.35)';rr(bx-10,by-6,bw+20,40,14);ctx.fill();
  if(ev==='chefe'&&st.boss){
    const b=st.boss,p=b.hp/b.hpMax;
    ctx.fillStyle='rgba(255,255,255,.15)';rr(bx+36,by+10,bw-50,10,5);ctx.fill();
    ctx.fillStyle=b.escudo&&st.online?'#9fd8ff':b.cor;rr(bx+36,by+10,(bw-50)*p,10,5);ctx.fill();
    ctx.font='18px serif';ctx.textAlign='left';ctx.fillStyle='#fff';ctx.fillText(b.emoji,bx-2,by+22);
  }else{
    const p=Math.min(1,st.dist/st.distMax);
    ctx.fillStyle='rgba(255,255,255,.15)';rr(bx+30,by+10,bw-60,8,4);ctx.fill();
    ctx.fillStyle='#5cf0a8';rr(bx+30,by+10,(bw-60)*p,8,4);ctx.fill();
    ctx.font='700 13px "Baloo 2"';ctx.fillStyle='#fff';ctx.textAlign='left';ctx.fillText(st.vivo?'👀':modo==='chat'?'💬':modo==='telefone'?'📞':J&&modo!=='treino'?(J.pos+1)+'/5':'F'+(st.n+1),bx-4,by+20);
    ctx.font='18px serif';ctx.textAlign='right';ctx.fillText(st.semChefe?'📱':st.f.chefe.emoji,bx+bw+6,by+22);
    ctx.textAlign='center';ctx.fillText('✉️',bx+30+(bw-60)*p,by+12);
  }
  const sy=by+46;ctx.textAlign='left';ctx.font='700 13px "Baloo 2"';
  ctx.fillStyle='rgba(0,0,0,.35)';rr(14,sy,150,28,10);ctx.fill();ctx.fillStyle='#fff';ctx.fillText('SINAL',22,sy+19);if(st.cv){ctx.font='18px serif';ctx.fillText(st.cv.e,170,sy+21);ctx.font='700 13px "Baloo 2"'}
  const cor=st.sinal>50?'#4fc3ff':st.sinal>25?'#ffc14d':'#ff4d6d';
  for(let i=0;i<5;i++){ctx.fillStyle=st.sinal>i*20?cor:'rgba(255,255,255,.15)';ctx.fillRect(72+i*16,sy+20-(i+1)*3.2,11,(i+1)*3.2+2)}
  ctx.fillStyle='rgba(0,0,0,.35)';rr(W-124,sy,110,28,10);ctx.fill();
  ctx.textAlign='right';ctx.font='16px serif';ctx.fillStyle='#fff';
  const vv=Math.max(0,st.vidas);ctx.fillText('✉️'.repeat(vv)+'·'.repeat(Math.max(0,3-vv)),W-22,sy+20);
  if(modo==='online'){ctx.font='800 12px "Baloo 2"';ctx.textAlign='left';ctx.fillStyle=net.souPiloto?'#5cf0a8':'#ffd24d';
    ctx.fillText(net.souPiloto?'🕹️ PILOTO':'📡 OPERADOR · toque pra marcar perigo',14,sy+46)}
  // texto da mensagem (só quem escreveu vê no online)
  if(st.vivo&&st.vivoTx){ctx.font='700 14px "Baloo 2"';const mw=Math.min(W*0.6,ctx.measureText(st.vivoTx).width+24);ctx.fillStyle='rgba(0,0,0,.45)';rr(14,H-44,mw,30,10);ctx.fill();ctx.textAlign='left';ctx.fillStyle='#e9f3ff';ctx.fillText(st.vivoTx,26,H-24)}
  const verTexto=!st.vivo&&J&&(modo==='jornada'||modo==='chat'||modo==='telefone'||(modo==='online'&&net.role==='host'));
  if(verTexto&&!(modo==='online'&&!net.souPiloto)){
    const txt=textoEstragado();ctx.font='700 14px "Baloo 2"';
    const mw=Math.min(W*0.6,ctx.measureText(txt).width+24);
    ctx.fillStyle='rgba(0,0,0,.45)';rr(14,H-44,mw,30,10);ctx.fill();
    ctx.save();ctx.beginPath();ctx.rect(14,H-44,mw,30);ctx.clip();
    ctx.textAlign='left';ctx.fillStyle='#e9f3ff';ctx.fillText(txt,26,H-24);ctx.restore();
  }
  if(st.banner>0){ctx.globalAlpha=Math.min(1,st.banner);ctx.textAlign='center';ctx.font='800 '+(W<500?20:28)+'px "Baloo 2"';
    ctx.fillStyle='#000';ctx.fillText(st.bannerTxt,W/2+2,H*.3+2);ctx.fillStyle='#fff';ctx.fillText(st.bannerTxt,W/2,H*.3);ctx.globalAlpha=1}
  if(st.cmd){ctx.globalAlpha=Math.min(1,st.cmd.v*2);ctx.textAlign='center';ctx.font='800 40px "Baloo 2"';
    ctx.fillStyle='#000';ctx.fillText(st.cmd.txt,W/2+3,H*.45+3);ctx.fillStyle='#ffd24d';ctx.fillText(st.cmd.txt,W/2,H*.45);ctx.globalAlpha=1}
  if(st.sinal<25&&Math.floor(st.t*4)%2&&st.estado!=='fim'){ctx.textAlign='center';ctx.font='800 18px "Baloo 2"';ctx.fillStyle='#ff4d6d';ctx.fillText('SINAL FRACO! PEGUE 📶',W/2,H-60)}
}
function desenhaParts(){for(const q of st.parts){ctx.globalAlpha=Math.max(0,q.v*1.5);ctx.fillStyle=q.c;
  if(q.e){ctx.font=`${q.s*3.4}px serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(q.e,q.x,q.y)}else ctx.fillRect(q.x,q.y,q.s,q.s)}ctx.globalAlpha=1}
function draw(){
  ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle='#05070f';ctx.fillRect(0,0,innerWidth,innerHeight);
  ctx.setTransform(DPR*SC,0,0,DPR*SC,DPR*OX,DPR*OY);
  ctx.save();ctx.beginPath();ctx.rect(0,0,W,H);ctx.clip();
  if(st.shake>0)ctx.translate((R()-.5)*12,(R()-.5)*12);
  fundo();desenhaAvisos();desenhaObs();desenhaChefe();desenhaTiros();desenhaParts();
  if(st.estado!=='fim'&&st.estado!=='parado')mensagem();
  if(modo==='online'&&st.estado!=='fim'){if(net.souPiloto)escuridao();else camadaOperador()}
  if(st.cv&&(st.estado==='corrida'||(st.vivo&&st.remEstado==='corrida'))){const c=st.cv.id;
    if(c==='g4')for(const z of st.zonas){ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(z.x,0,z.w,H);ctx.fillStyle='rgba(255,255,255,.75)';ctx.font='800 18px "Baloo 2"';ctx.textAlign='center';ctx.fillText('📵 ZONA MORTA',z.x+z.w/2,H/2)}
    if(c==='cabo'){ctx.fillStyle='rgba(20,10,0,.55)';ctx.fillRect(0,0,W,H*.26);ctx.fillRect(0,H*.74,W,H*.26);ctx.strokeStyle='#f2a93b';ctx.lineWidth=4;ctx.strokeRect(-5,H*.26,W+10,H*.48)}
    if(c==='wifi'&&st.inter>0){ctx.fillStyle='rgba(255,255,255,.08)';for(let i=0;i<70;i++)ctx.fillRect(R()*W,R()*H,R()*40,2);ctx.fillStyle='#ffd24d';ctx.font='800 18px "Baloo 2"';ctx.textAlign='center';ctx.fillText('📡 INTERFERÊNCIA!',W/2,H*.2)}
    if(c==='radio'){ctx.fillStyle='rgba(120,85,30,.18)';ctx.fillRect(0,0,W,H);ctx.fillStyle='rgba(0,0,0,.12)';for(let y=(st.t*40)%4;y<H;y+=4)ctx.fillRect(0,y,W,1.5)}
    if(st.queda>0){const g=ctx.createRadialGradient(st.x,st.y,60,st.x,st.y,150);g.addColorStop(0,'rgba(2,3,8,0)');g.addColorStop(1,'rgba(2,3,8,.96)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#ff6b8a';ctx.font='800 18px "Baloo 2"';ctx.textAlign='center';ctx.fillText('📴 SEM INTERNET…',W/2,H*.2)}
    if(st.invT>0){ctx.fillStyle='#b48cff';ctx.font='800 16px "Baloo 2"';ctx.textAlign='center';ctx.fillText('🔄 INVERTIDO',st.x,st.y-40)}
    if(st.desafio){const d=st.desafio,bw=Math.min(W-40,360),bx=(W-bw)/2,by=96;ctx.fillStyle='rgba(0,0,0,.5)';rr(bx-8,by-20,bw+16,40,12);ctx.fill();
      ctx.fillStyle='#ffd24d';ctx.font='800 14px "Baloo 2"';ctx.textAlign='center';ctx.fillText('🏁 '+d.n+' · '+Math.ceil(Math.max(0,d.t))+'s',W/2,by-3);
      ctx.fillStyle='rgba(255,255,255,.15)';rr(bx,by+5,bw,7,4);ctx.fill();ctx.fillStyle='#ffd24d';rr(bx,by+5,bw*Math.max(0,d.t/DUR_DESAFIO),7,4);ctx.fill()}
    if(c==='sat'){ctx.fillStyle='rgba(255,255,255,.7)';ctx.font='700 13px "Baloo 2"';ctx.textAlign='center';ctx.fillText('🛰️ atraso de 0,45s',st.x,st.y+40)}}
  if(modo==='chat'&&st.mimo==='neblina'&&st.estado!=='fim'&&st.estado!=='chegando'){const g=ctx.createRadialGradient(st.x,st.y,90,st.x,st.y,200);
    g.addColorStop(0,'rgba(200,210,230,0)');g.addColorStop(1,'rgba(190,200,220,.93)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}
  ctx.restore();
  if(st.estado!=='parado')hud();
  // aviso de celular em pé no online
  $('aviso').classList.toggle('oculta',!(modo==='online'&&innerHeight>innerWidth&&st.estado!=='fim'));
  if(modo==='online')$('aviso').textContent='📱 Deite o celular pra ver melhor';
}
