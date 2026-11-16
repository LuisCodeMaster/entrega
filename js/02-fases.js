// ================= FASES =================
const FASES=[
 {nome:'Wi-Fi de Casa',ceu:['#2b1e5c','#6a3e9e'],tipos:{parede:.25,virus:.5,spam:.25},
  chefe:{nome:'Roteador Travado',emoji:'📡',hp:28,cor:'#9b6bff',fala:'Reinicia... reinicia... REINICIA!'}},
 {nome:'Torre de Celular',ceu:['#0e2a5a','#3f7fc4'],tipos:{parede:.3,virus:.35,spam:.35},
  chefe:{nome:'Torre Sobrecarregada',emoji:'🗼',hp:36,cor:'#ffd24d',fala:'Rede congestionada! ⚡'}},
 {nome:'Cabo Submarino',ceu:['#02142b','#08466b'],tipos:{parede:.2,virus:.3,spam:.15,peixe:.35},
  chefe:{nome:'Tubarão Morde-Cabo',emoji:'🦈',hp:42,cor:'#5aa9e6',fala:'Esse cabo é MEU almoço!'}},
 {nome:'Data Center',ceu:['#0c0f14','#1d2a24'],tipos:{parede:.45,virus:.35,spam:.2},
  chefe:{nome:'Firewall Supremo',emoji:'🛡️',hp:50,cor:'#ff5a3d',fala:'Pacote não autorizado!'}},
 {nome:'Celular de Destino',ceu:['#3a1a3a','#e07a5f'],tipos:{parede:.3,virus:.35,spam:.35},
  chefe:{nome:'O Hacker',emoji:'🕵️',hp:64,cor:'#2df5c0',fala:'Essa mensagem vai ser minha...'}}
];
const CORES=['#ff4d6d','#4fc3ff','#5cf0a8','#ffd24d'];
const NOMES_COR=['VERMELHO','AZUL','VERDE','AMARELO'];
const DIST=3400;
const ROTAS={ida:[0,1,2,3,4],volta:[4,3,2,1,0]};
const CORTE=3;

// ================= JORNADA =================
let J=null,modo='treino',nivelSel=0,liberado=+ls.get('entrega_lib',0);
function novaJornada(de,para,txt,rota,rodada){return {v:1,de,para,txt,rota,rodada:rodada||1,pos:0,c:[],vidas:3,sinal:100,pts:0,falhas:0}}
const SEG=(typeof Intl!=='undefined'&&Intl.Segmenter)?new Intl.Segmenter('pt'):null;
const _pc={};
function partes(t){return _pc[t]||(_pc[t]=SEG?Array.from(SEG.segment(t),x=>x.segment):Array.from(t))}
function letrasJ(){return partes(J.txt)}
const ehLetra=p=>p.trim()!==''&&p!=='✱';
function corromper(qtd){
  const L=letrasJ(),livres=[];L.forEach((p,i)=>{if(ehLetra(p)&&!J.c.includes(i))livres.push(i)});
  for(let k=0;k<qtd&&livres.length;k++){const j=Math.floor(R()*livres.length);J.c.push(livres.splice(j,1)[0])}
}
function nLetras(){return letrasJ().filter(ehLetra).length}
function perdaPorDano(){return Math.max(1,Math.round(nLetras()*0.07))}
function textoEstragado(){return letrasJ().map((p,i)=>J.c.includes(i)?'_':p).join('')}
function pctInteiro(){const n=nLetras();return n?Math.round((1-J.c.length/n)*100):100}
const CH='ENTREGA-PACOTE';
function codifica(o){
  const b=new TextEncoder().encode(JSON.stringify(o));
  for(let i=0;i<b.length;i++)b[i]^=(CH.charCodeAt(i%CH.length)+i*7)&255;
  let s='';b.forEach(x=>s+=String.fromCharCode(x));
  return 'ENT-'+btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
function decodifica(txt){
  const m=String(txt).match(/ENT-([A-Za-z0-9_-]+)/);if(!m)return null;
  try{let b64=m[1].replace(/-/g,'+').replace(/_/g,'/');while(b64.length%4)b64+='=';
    const s=atob(b64),b=new Uint8Array(s.length);
    for(let i=0;i<s.length;i++)b[i]=s.charCodeAt(i)^((CH.charCodeAt(i%CH.length)+i*7)&255);
    const o=JSON.parse(new TextDecoder().decode(b));if(o.v!==1||!o.txt||!ROTAS[o.rota])return null;return o;
  }catch(e){return null}
}
function normal(s){return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9 ]/g,'').replace(/\s+/g,' ').trim()}
function lev(a,b){const d=Array.from({length:a.length+1},(_,i)=>[i]);for(let j=1;j<=b.length;j++)d[0][j]=j;
  for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[a.length][b.length]}
function parecido(a,b){a=normal(a);b=normal(b);const m=Math.max(a.length,b.length);return m?Math.round((1-lev(a,b)/m)*100):100}
