// ================= SOM (tudo sintetizado na hora, música original gerada) =================
const AU={ctx:null,master:null,mus:null,sfxG:null,mudo:ls.get('entrega_mudo','0')==='1',musicaOn:ls.get('entrega_musica','1')==='1',faixa:null,timer:null,passo:0,prox:0,cfg:null,musG:null};
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
// ---- música lo-fi gerada: piano elétrico, batida com balanço e chiado de vinil ----
// acordes com sétima/nona; melodia pentatônica esparsa; 8 compassos por ciclo
const MUSICAS={
  menu:{bpm:72,raiz:53,acordes:[[0,'M7'],[2,'m7'],[4,'m7'],[5,'M7'],[0,'M7'],[-3,'m7'],[2,'m7'],[7,'7']],bat:'nenhuma',sem:7,dens:.25},
  fase:{bpm:80,raiz:55,acordes:[[2,'m7'],[7,'7'],[0,'M7'],[-3,'m7'],[2,'m7'],[7,'7'],[0,'M7'],[0,'M7']],bat:'lofi',sem:3,dens:.35},
  chefe:{bpm:86,raiz:52,acordes:[[0,'m7'],[5,'m7'],[-4,'M7'],[-5,'7'],[0,'m7'],[5,'m7'],[-2,'7'],[-5,'7']],bat:'lofi+',sem:11,dens:.4},
  reveal:{bpm:78,raiz:57,acordes:[[0,'M7'],[-3,'m7'],[5,'M7'],[7,'7'],[0,'M7'],[-3,'m7'],[2,'m7'],[7,'7']],bat:'lofi',sem:5,dens:.3}};
const ACORDES={M7:[0,4,7,11,14],m7:[0,3,7,10,14],'7':[0,4,7,10,14]};
function rngSem(s){return()=>{s=(s*9301+49297)%233280;return s/233280}}
function pentaDe(q){return q==='m7'?[0,3,5,7,10]:[0,2,4,7,9]}
function preparaMelodia(cfg){if(cfg.mel)return;const r=rngSem(cfg.sem);cfg.mel=[];let grau=4;
  for(let b=0;b<8;b++)for(let p=0;p<8;p++){                 // grade de colcheias
    const toca=(p%2===0?r()<cfg.dens:r()<cfg.dens*.35)&&!(b%4===3&&p>=4);
    grau=Math.max(2,Math.min(9,grau+[-1,0,1,-2,2,-1,1][Math.floor(r()*7)]));
    cfg.mel.push(toca?{g:grau,longa:r()<.3}:null)}}
function epiano(dest,t,f,dur,vol){                          // piano elétrico abafado
  const c=AU.ctx,g=c.createGain(),fl=c.createBiquadFilter();fl.type='lowpass';fl.frequency.value=1250;fl.Q.value=.3;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.012);g.gain.setTargetAtTime(vol*.35,t+.03,.25);g.gain.setTargetAtTime(0,t+dur,.18);
  for(const [m,v,tp] of [[1,1,'sine'],[2,.18,'sine'],[3.99,.05,'triangle']]){const o=c.createOscillator(),gg=c.createGain();o.type=tp;o.frequency.setValueAtTime(f*m,t);o.detune.value=(Math.random()-.5)*8;gg.gain.value=v;o.connect(gg);gg.connect(fl);o.start(t);o.stop(t+dur+1)}
  fl.connect(g);g.connect(dest)}
function baixoLofi(dest,t,f,dur,vol){const c=AU.ctx,o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(f,t);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.02);g.gain.setTargetAtTime(0,t+dur*.7,dur*.2);o.connect(g);g.connect(dest);o.start(t);o.stop(t+dur+.4)}
function bumboLofi(dest,t,vol){tom(dest,t,110,.22,'sine',vol,45,.003);ruido(dest,t,.02,vol*.15,900,'lowpass')}
function caixaLofi(dest,t,vol){ruido(dest,t,.16,vol,1800,'bandpass');tom(dest,t,190,.08,'triangle',vol*.3,150)}
function chimbalLofi(dest,t,vol){ruido(dest,t,.035,vol,6500,'highpass')}
const VOL_MUSICA=.045;
function tocaPasso(cfg,passo,t,dest,vol=1){
  vol*=VOL_MUSICA;preparaMelodia(cfg);
  const sp=60/cfg.bpm/4,bar=Math.floor(passo/16)%8,s=passo%16,[off,q]=cfg.acordes[bar],raiz=cfg.raiz+off,ac=ACORDES[q],pen=pentaDe(q),bat=60/cfg.bpm;
  const sw=(s%4===2)?sp*.32:0,tt=t+sw;                     // balanço (swing) nas colcheias
  // piano: acorde no tempo 1 e "e do 2", com leve dedilhado
  if(s===0||s===6){const voz=s===0?ac.slice(0,4):[ac[1],ac[2],ac[4]];voz.forEach((iv,k)=>epiano(dest,tt+k*.018,mf(raiz+12+iv),s===0?bat*1.4:bat*2.2,(s===0?.06:.045)*vol/ VOL_MUSICA*VOL_MUSICA))}
  // baixo sincopado
  if(s===0)baixoLofi(dest,t,mf(raiz-12),bat*1.5,.14*vol);
  if(s===10&&cfg.bat!=='nenhuma')baixoLofi(dest,tt,mf(raiz-12+(bar%2?7:0)),bat*.9,.1*vol);
  // melodia esparsa
  if(s%2===0){const n=cfg.mel[bar*8+s/2];if(n){const oit=Math.floor(n.g/5),nota=raiz+12+pen[n.g%5]+12*(oit-1)+12;
    epiano(dest,tt+.01,mf(nota),bat*(n.longa?1.6:.7),.05*vol)}}
  // bateria lo-fi
  if(cfg.bat!=='nenhuma'){const k=vol/VOL_MUSICA*.35;
    if(s===0||s===10)bumboLofi(dest,tt,.45*k);
    if(s===4||s===12)caixaLofi(dest,tt,.16*k);
    if(s%2===0)chimbalLofi(dest,tt,(s%4===0?.05:.03)*k);
    if(cfg.bat==='lofi+'&&s===14)bumboLofi(dest,tt,.3*k)}
  // chiado de vinil
  if(Math.random()<.35)ruido(dest,t+Math.random()*sp,.004,(.02+Math.random()*.03)*vol/VOL_MUSICA*.35,3000,'highpass');
  if(s===0)ruido(dest,t,bat*4,.006*vol/VOL_MUSICA*.35,2500,'bandpass');
}
function musica(nome){
  if(!AU.musicaOn)nome=null;
  if(!AU.ctx||AU.faixa===nome)return;AU.faixa=nome;
  if(AU.musG){const g=AU.musG;g.gain.setTargetAtTime(0,AU.ctx.currentTime,.25);setTimeout(()=>g.disconnect(),1500)}
  clearInterval(AU.timer);AU.musG=null;if(!nome)return;
  const cfg=MUSICAS[nome],g=AU.ctx.createGain();g.gain.setValueAtTime(0,AU.ctx.currentTime);g.gain.linearRampToValueAtTime(.42,AU.ctx.currentTime+1.2);
  g.connect(AU.master);AU.musG=g;AU.passo=0;AU.prox=AU.ctx.currentTime+.08;
  AU.timer=setInterval(()=>{const sp=60/cfg.bpm/4;while(AU.prox<AU.ctx.currentTime+.2){tocaPasso(cfg,AU.passo,AU.prox,g);AU.prox+=sp;AU.passo++}},40);
}
function alternaMusica(){AU.musicaOn=!AU.musicaOn;ls.set('entrega_musica',AU.musicaOn?'1':'0');if(!AU.musicaOn)musica(null);return AU.musicaOn}
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
