// ================= SOM (tudo sintetizado na hora, música original gerada) =================
const AU={ctx:null,master:null,mus:null,sfxG:null,mudo:ls.get('entrega_mudo','0')==='1',faixa:null,timer:null,passo:0,prox:0,cfg:null,musG:null};
function auInit(){
  if(AU.ctx||!(window.AudioContext||window.webkitAudioContext))return;
  try{AU.ctx=new (window.AudioContext||window.webkitAudioContext)();
    AU.master=AU.ctx.createGain();AU.master.gain.value=AU.mudo?0:.7;AU.master.connect(AU.ctx.destination);
    AU.sfxG=AU.ctx.createGain();AU.sfxG.gain.value=.55;AU.sfxG.connect(AU.master);
    AU.ruido=AU.ctx.createBuffer(1,AU.ctx.sampleRate,AU.ctx.sampleRate);const d=AU.ruido.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  }catch(e){AU.ctx=null}
}
['pointerdown','keydown','touchstart'].forEach(ev=>addEventListener(ev,()=>{auInit();if(AU.ctx&&AU.ctx.state==='suspended')AU.ctx.resume()},{capture:true,passive:true}));
function alternaSom(){AU.mudo=!AU.mudo;ls.set('entrega_mudo',AU.mudo?'1':'0');if(AU.master)AU.master.gain.setTargetAtTime(AU.mudo?0:.7,AU.ctx.currentTime,.05);
  if(window.speechSynthesis&&AU.mudo)speechSynthesis.cancel();const b=$('btnSom');if(b)b.textContent=AU.mudo?'🔇':'🔊';return AU.mudo}
const mf=m=>440*Math.pow(2,(m-69)/12);
function tom(dest,t,f,dur,tipo='square',vol=.2,f2=null,ataque=.005){
  const c=AU.ctx,o=c.createOscillator(),g=c.createGain();o.type=tipo;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+dur);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+ataque);g.gain.exponentialRampToValueAtTime(.0005,t+dur);o.connect(g);g.connect(dest);o.start(t);o.stop(t+dur+.02)}
function ruido(dest,t,dur,vol=.2,freq=4000,tipo='highpass',freq2=null){
  const c=AU.ctx,s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=AU.ruido;f.type=tipo;f.frequency.setValueAtTime(freq,t);if(freq2)f.frequency.exponentialRampToValueAtTime(freq2,t+dur);
  g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0005,t+dur);s.connect(f);f.connect(g);g.connect(dest);s.start(t,Math.random()*.5);s.stop(t+dur+.02)}
function bumbo(dest,t,vol=.6){tom(dest,t,150,.28,'sine',vol,40,.002)}
function sfx(nome,arg){
  if(!AU.ctx||AU.mudo)return;const t=AU.ctx.currentTime+.01,d=AU.sfxG;
  switch(nome){
    case 'letra':{const k=[0,2,4,7,9,12][(arg||0)%6];tom(d,t,mf(76+k),.09,'square',.12);tom(d,t+.05,mf(83+k),.08,'square',.08);break}
    case 'sinal':tom(d,t,mf(84),.12,'triangle',.25);tom(d,t+.07,mf(91),.18,'triangle',.22);break;
    case 'dano':ruido(d,t,.25,.35,1800,'lowpass',300);tom(d,t,220,.3,'sawtooth',.18,70);break;
    case 'escudo':tom(d,t,mf(88),.25,'triangle',.2,mf(76));ruido(d,t,.15,.15,6000);break;
    case 'alarme':for(let i=0;i<3;i++){tom(d,t+i*.28,mf(81),.12,'square',.14);tom(d,t+i*.28+.14,mf(76),.12,'square',.14)}break;
    case 'explosao':ruido(d,t,.9,.5,2500,'lowpass',120);bumbo(d,t,.7);break;
    case 'vitoria':[72,76,79,84,88].forEach((m,i)=>tom(d,t+i*.08,mf(m),.25,'square',.12));tom(d,t+.42,mf(91),.5,'triangle',.2);break;
    case 'perdeu':[67,63,60,55].forEach((m,i)=>tom(d,t+i*.16,mf(m),.22,'triangle',.22));break;
    case 'clique':tom(d,t,mf(90),.04,'square',.05);break;
  }
}
// ---- música gerada: progressões e melodia procedural ----
const MUSICAS={
  menu:{bpm:92,raiz:57,acordes:[[0,'m'],[-4,'M'],[3,'M'],[-2,'M']],bat:'leve',sem:7},
  fase:{bpm:128,raiz:60,acordes:[[0,'M'],[7,'M'],[9,'m'],[5,'M']],bat:'cheio',sem:3},
  chefe:{bpm:148,raiz:52,acordes:[[0,'m'],[-4,'M'],[-2,'M'],[-5,'M']],bat:'pesado',sem:11},
  reveal:{bpm:104,raiz:62,acordes:[[0,'M'],[-3,'m'],[5,'M'],[7,'M']],bat:'leve',sem:5}};
function rngSem(s){return()=>{s=(s*9301+49297)%233280;return s/233280}}
function preparaMelodia(cfg){if(cfg.mel)return;const r=rngSem(cfg.sem);cfg.mel=[];
  for(let b=0;b<4;b++)for(let p=0;p<16;p+=2)cfg.mel.push(r()<.55?Math.floor(r()*4):-1)}
function triade(q){return q==='m'?[0,3,7]:[0,4,7]}
function tocaPasso(cfg,passo,t,dest,vol=1){
  preparaMelodia(cfg);const sp=60/cfg.bpm/4,bar=Math.floor(passo/16)%4,s=passo%16,[off,q]=cfg.acordes[bar],raiz=cfg.raiz+off,tri=triade(q);
  if(s%8===0||(cfg.bat!=='leve'&&s%8===6))tom(dest,t,mf(raiz-12),sp*3,'triangle',.22*vol);
  if(s%2===0)tom(dest,t,mf(raiz+12+tri[(s/2)%3]),sp*1.6,'square',.035*vol);
  if(s%2===0){const n=cfg.mel[bar*8+s/2];if(n>=0)tom(dest,t,mf(raiz+24+[0,tri[1],tri[2],12][n]),sp*1.8,cfg.bat==='pesado'?'sawtooth':'square',.05*vol)}
  if(cfg.bat!=='leve'&&s%4===0)bumbo(dest,t,.35*vol);else if(cfg.bat==='leve'&&s%8===0)bumbo(dest,t,.2*vol);
  if(cfg.bat!=='leve'&&(s===4||s===12))ruido(dest,t,.12,.12*vol,1500,'bandpass');
  if(s%2===0)ruido(dest,t,.03,(cfg.bat==='leve'?.025:.05)*vol,8000);
}
function musica(nome){
  if(!AU.ctx||AU.faixa===nome)return;AU.faixa=nome;
  if(AU.musG){const g=AU.musG;g.gain.setTargetAtTime(0,AU.ctx.currentTime,.15);setTimeout(()=>g.disconnect(),900)}
  clearInterval(AU.timer);AU.musG=null;if(!nome)return;
  const cfg=MUSICAS[nome],g=AU.ctx.createGain();g.gain.value=.55;g.connect(AU.master);AU.musG=g;AU.passo=0;AU.prox=AU.ctx.currentTime+.08;
  AU.timer=setInterval(()=>{const sp=60/cfg.bpm/4;while(AU.prox<AU.ctx.currentTime+.15){tocaPasso(cfg,AU.passo,AU.prox,g);AU.prox+=sp;AU.passo++}},30);
}
function musicaDesejada(){
  if(tel&&tel.tela==='reveal')return null;
  if(!$('painel').classList.contains('oculta')||ch.aberto||!st||st.estado==='parado')return 'menu';
  if(st.estado==='fim')return null;if(st.estado==='chefe')return 'chefe';return 'fase';
}
// ---- voz de robô (bipes por letra, entra no vídeo) ----
function vozRobo(dest,t,txt,base,dur){
  const ps=partes(txt);const passo=dur/Math.max(1,ps.length);
  ps.forEach((p,i)=>{if(!p.trim())return;const tt=t+i*passo;
    if(p==='_'){ruido(dest,tt,passo*.8,.08,900,'bandpass');return}
    const cod=p.toLowerCase().codePointAt(0),vog='aeiouáéíóúâêôãõ'.includes(p.toLowerCase());
    const f=base*(1+((cod*7)%12)/24)*(vog?1.12:1);
    tom(dest,tt,f,passo*.9,'square',.07,f*(vog?1.05:.9),.004);tom(dest,tt,f*2.01,passo*.7,'sine',.03)});
}
