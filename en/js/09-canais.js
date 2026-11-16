// ================= CAMINHOS DE CONEXÃO =================
const CANAIS=[
 {id:'g4',e:'📶',n:'4G / 5G',v:'Fast',p:'Dead zones: signal drops hard',vel:1.2,dist:1,dreno:1.5,mult:1.1},
 {id:'cabo',e:'🔌',n:'Cable / fiber',v:'Barely loses signal',p:'Narrow path, rats and roadworks',vel:1,dist:1,dreno:.4,mult:.9},
 {id:'wifi',e:'📡',n:'Wi-Fi',v:'Lots of signal to grab',p:'Interference scrambles the controls',vel:1,dist:1,dreno:1,mult:1},
 {id:'sat',e:'🛰️',n:'Satellite',v:'Much shorter path',p:'Delayed controls',vel:1,dist:.6,dreno:1,mult:1.2},
 {id:'bt',e:'🔵',n:'Bluetooth',v:'Short and easy',p:'Only messages up to 20 letters',vel:.85,dist:.5,dreno:.8,mult:.8},
 {id:'radio',e:'📻',n:'Radio / old-school 2G',v:'Nostalgia mode, slow',p:'Static hides the letters',vel:.8,dist:1,dreno:.9,mult:1.4}];
const canalDe=id=>CANAIS.find(c=>c.id===id)||null;
let canalAtual=null,canalCb=null,canalVolta=null;
function detectaCanal(){
  const c=navigator.connection||navigator.mozConnection||navigator.webkitConnection;if(!c)return null;
  const tp=c.type,ef=c.effectiveType;
  if(tp==='wifi')return 'wifi';if(tp==='ethernet')return 'cabo';if(tp==='bluetooth')return 'bt';
  if(tp==='cellular')return (ef==='2g'||ef==='slow-2g')?'radio':'g4';
  if(ef==='2g'||ef==='slow-2g')return 'radio';
  return null}
function escolheCanal(txt,cb,volta,forcado){
  canalCb=cb;canalVolta=volta;
  if(forcado){canalAtual=forcado;toast(canalDe(forcado).e+' You were sent via '+canalDe(forcado).n+'!');return cb()}
  if(ch.aberto)fechaChat();if(tel.tela==='lobby'||tel.tela==='reescrever')tel.tela='canal';
  const real=detectaCanal(),ult=ls.get('entrega_canal',real||'wifi'),letras=partes(txt).filter(ehLetra).length;
  painel(`<h2>Which way will your message go?</h2>
    <p style="font-size:14px">${real?`📍 You are on <b>${canalDe(real).e} ${canalDe(real).n}</b> right now. Going through it: <b>+20% points</b>!`:'Pick the route. Each one has an upside and a danger.'}</p>
    <div class="canais">${CANAIS.map(c=>{const bloq=c.id==='bt'&&letras>20;
      return `<button class="${c.id===ult?'on ':''}${bloq?'bloq':''}" data-a="${bloq?'canalBloq':'canal'}" data-n="${c.id}">
        <b>${c.e} ${c.n}${c.id===real?' 📍':''}</b><small>✅ ${c.v}</small><small>⚠️ ${c.p}</small><small>⭐ x${c.mult}</small></button>`}).join('')}</div>
    <button class="sec" data-a="canalVolta">BACK</button>`);
}
function aplicaCanal(){
  const c=canalDe(canalAtual);st.cv=c;if(!c)return;
  const real=detectaCanal();st.cvReal=real===c.id;
  st.vel*=c.vel;st.distMax*=c.dist;if(st.fila)st.fila.forEach(f=>f.d*=c.dist);
  st.zonaT=3;st.zonas=[];st.interT=4+R()*3;st.inter=0;st.atrasos=[];
  const av=[c.e+' VIA '+c.n.toUpperCase()+': '+c.p.toUpperCase()];if(st.cvReal)av.push('📍 REAL CONNECTION: +20% POINTS');
  st.filaAvisos=[...av,...(st.filaAvisos||[])];
}
function multCanal(){return st.cv?st.cv.mult*(st.cvReal?1.2:1):1}
