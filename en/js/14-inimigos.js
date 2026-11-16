// ================= SPAWN =================
function sorteia(t){let r=R(),a=0;for(const k in t){a+=t[k];if(r<a)return k}return 'virus'}
function gerarObstaculo(){
  if(st.cv&&st.cv.id==='cabo'&&R()<.45){const y=H*.3+R()*H*.4;
    if(R()<.5)st.obs.push({k:'peixe',emo:'🐀',x:W+60,y,r:18,vx:-60-R()*80});else st.obs.push({k:'virus',emo:'🚧',x:W+40,y,base:y,r:22,fase:0,amp:0});return}
  const k=sorteia(st.f.tipos),p=st.dist/st.distMax;
  if(k==='parede'){const gap=Math.max(140,220-p*50-st.n*8)+(st.online?20:0),gy=50+R()*(H-100-gap);st.obs.push({k,x:W+40,gy,gap,w:34})}
  else if(k==='virus'){const y=60+R()*(H-120);st.obs.push({k,x:W+40,y,base:y,r:20+R()*8,fase:R()*6,amp:30+R()*50})}
  else if(k==='spam')st.obs.push({k,x:W+40,y:60+R()*(H-120),vy:(R()<.5?-1:1)*(60+R()*80),r:22});
  else if(k==='peixe')st.obs.push({k,x:W+60,y:60+R()*(H-120),r:18,vx:-80-R()*80});
}
function gerarItem(){st.itens.push({x:W+30,y:50+R()*(H-100),r:18,t:R()*6})}

// ================= CHEFES =================
function iniciaChefe(){sfx('alarme');
  const c=st.f.chefe;st.estado='chefe';st.obs=[];
  const hp=Math.round(c.hp*st.hpMul);st.boss={...c,hp,hpMax:hp,x:W+120,alvoX:W-Math.min(130,W*0.18),y:H/2,t:0,atk:1.8,flash:0,entrando:true,dash:null,falaT:3,sub:0,
           escudo:st.online,prog:0,codigo:null,escudoT:0};
  if(st.online)st.boss.codigo=novoCodigoCor(st.boss);
  st.banner=2.4;st.bannerTxt='⚠ BOSS: '+c.nome.toUpperCase();
}
function mirar(x,y,v){const a=Math.atan2(st.y-y,st.x-x);return[Math.cos(a)*v,Math.sin(a)*v]}
function tiro(x,y,vx,vy,o={}){const k=st.online?.85:1;st.tiros.push({x,y,vx:vx*k,vy:vy*k,r:o.r||9,cor:o.cor||'#ff4d6d',vida:o.vida||8})}
function leque(x,y,n,abert,v,cor){const a0=Math.atan2(st.y-y,st.x-x);for(let i=0;i<n;i++){const a=a0+(i-(n-1)/2)*abert;tiro(x,y,Math.cos(a)*v,Math.sin(a)*v,{cor})}}
function atualizaChefe(dt){
  const b=st.boss;b.t+=dt;b.flash-=dt;b.falaT-=dt;
  if(b.entrando){b.x+=(b.alvoX-b.x)*dt*2.5;if(Math.abs(b.x-b.alvoX)<4)b.entrando=false;return}
  if(st.online&&!b.escudo){b.escudoT-=dt;if(b.escudoT<=0){b.escudo=true;b.prog=0;b.codigo=novoCodigoCor(b);st.banner=1.2;st.bannerTxt='SHIELD IS BACK!'}}
  const furia=b.hp<b.hpMax/2;b.atk-=dt*(furia?1.35:1)*(st.online?.85:1);const id=st.n;
  if(id===0){b.y=H/2+Math.sin(b.t*1.1)*(H*.3);
    if(b.atk<=0){leque(b.x-40,b.y,furia?7:5,.22,260,'#b48cff');b.atk=1.5;
      if(furia){b.sub++;if(b.sub%2===0)for(let i=0;i<10;i++){const a=i/10*Math.PI*2;tiro(b.x,b.y,Math.cos(a)*180,Math.sin(a)*180,{cor:'#e0ccff'})}}}}
  if(id===1){b.y=H/2+Math.sin(b.t*.8)*(H*.2);
    if(b.atk<=0){const n=furia?3:2;
      for(let i=0;i<n;i++){const x=i===0?st.x:40+R()*(W*0.65);st.avisos.push({k:'raio',x,w:46,t:st.online?1.2:.9,ativo:0})}
      tiro(b.x-30,b.y,...mirar(b.x,b.y,300),{cor:'#ffe680'});b.atk=furia?1.5:1.9}}
  if(id===2){
    if(b.dash){const d=b.dash;d.t-=dt;if(d.t<=0){b.x-=900*dt;b.y=d.y;if(b.x<-140){b.x=W+140;b.dash=null;b.voltando=true}}}
    else if(b.voltando){b.x+=(b.alvoX-b.x)*dt*3;b.y+=(H/2-b.y)*dt*2;if(Math.abs(b.x-b.alvoX)<5)b.voltando=false}
    else{b.y+=(st.y-b.y)*dt*1.2;
      if(b.atk<=0){b.sub++;
        const av=st.online?1.15:.85;
        if(b.sub%2===0||furia){b.dash={y:st.y,t:av};st.avisos.push({k:'faixa',y:st.y,h:70,t:av,ativo:0})}
        else for(let i=0;i<5;i++)tiro(b.x-40,b.y,-200-R()*120,(R()-.5)*200,{cor:'#9fe0ff',r:11});
        b.atk=furia?1.6:2.1}}}
  if(id===3){b.y=H/2+Math.sin(b.t*1.4)*(H*.28);
    if(b.atk<=0){b.sub++;
      if(b.sub%2){const gap=(furia?150:180)+(st.online?20:0),gy=40+R()*(H-80-gap);st.obs.push({k:'parede',x:b.x-60,gy,gap,w:30,vel:furia?300:240,mov:furia?(R()<.5?-70:70):0})}
      else leque(b.x-40,b.y,3,.18,330,'#ffae5c');
      b.atk=furia?0.95:1.25}}
  if(id===4){
    if(b.atk<=0){const base=b.t*2.2,k=furia?4:3;
      for(let i=0;i<k;i++){const a=base+i*Math.PI*2/k;tiro(b.x,b.y,Math.cos(a)*200,Math.sin(a)*200,{cor:'#2df5c0'})}
      b.atk=.22;b.cont=(b.cont||0)+1;
      if(b.cont%22===0){const y=60+R()*(H-120);st.obs.push({k:'virus',x:b.x-40,y,base:y,r:22,fase:0,amp:50,vel:260})}
      if(furia&&b.cont%30===0){b.alvoY=70+R()*(H-140);explodir(b.x,b.y,'#2df5c0',20)}}
    if(b.alvoY!=null)b.y+=(b.alvoY-b.y)*dt*6;else b.y=H/2+Math.sin(b.t*.9)*(H*.25)}
}
