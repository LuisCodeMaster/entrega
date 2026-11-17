const VERSAO=19;const ARQ_VERSAO='version.json';
const SITE_RAIZ='https://luiscodemaster.github.io/entrega/';const SITE=SITE_RAIZ;const LANG_LINK='en/';const LANG_TXT='🇺🇸 EN';const LOCALE='pt-BR';
const NO_CLAUDE=/claude\.ai|claudeusercontent|anthropic/.test(location.hostname);
const LINK=NO_CLAUDE?'https://claude.ai/artifact/YNVSU23sJdKwRsfFKtAP6f':SITE;
const cv=document.getElementById('c'),ctx=cv.getContext('2d');
let W=800,H=450,DPR=1,SC=1,OX=0,OY=0,fixo=false;
function resize(){
  DPR=Math.min(window.devicePixelRatio||1,2);const iw=innerWidth,ih=innerHeight;
  cv.width=iw*DPR;cv.height=ih*DPR;
  if(fixo){W=800;H=450;SC=Math.min(iw/W,ih/H);OX=(iw-W*SC)/2;OY=(ih-H*SC)/2}
  else{W=iw;H=ih;SC=1;OX=0;OY=0}
}
addEventListener('resize',resize);resize();
const $=id=>document.getElementById(id);
const R=()=>Math.random();
const ls={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:v}catch(e){return d}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
