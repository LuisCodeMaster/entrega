// ================= LOOP =================
let last=performance.now();
$('btnSom').addEventListener('click',()=>{auInit();alternaSom()});$('btnSom').textContent=AU.mudo?'🔇':'🔊';
// ---- aviso de versão nova: quem estiver com o jogo aberto recebe as correções sem ficar com código velho ----
let versaoNova=false;
async function checaVersao(){if(versaoNova||NO_CLAUDE)return;
  try{const r=await fetch(ARQ_VERSAO+'?t='+Date.now(),{cache:'no-store'});const j=await r.json();
    if(j&&j.v>VERSAO){versaoNova=true;const b=$('novaVersao');b.textContent='✨ Nova versão do jogo! Toque aqui pra atualizar';b.classList.remove('oculta')}}catch(e){}}
$('novaVersao').addEventListener('click',()=>{if(typeof tel!=='undefined'&&tel.tid&&['lobby','reescrever','confirma','primeira'].includes(tel.tela))location.hash='t-'+tel.tid;location.reload()});
setInterval(checaVersao,60000);setTimeout(checaVersao,5000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)checaVersao()});
function loop(t){const dt=Math.min(.033,(t-last)/1000||0);last=t;update(dt);draw();if(AU.ctx)musica(musicaDesejada());{const emJogo=st&&$('painel').classList.contains('oculta')&&!ch.aberto&&st.estado!=='parado';$('btnSom').style.display=emJogo?'':'none'}desenhaPreview(t/1000);requestAnimationFrame(loop)}
if(/^#sala-[A-Z]{4}$/i.test(location.hash))history.replaceState(null,'',location.pathname+location.search);
const pacoteHash=/^#p=ENT-/.test(location.hash)?location.hash.slice(3):null;if(pacoteHash)history.replaceState(null,'',location.pathname+location.search);
if(/^#c-[a-z0-9]{10}$/.test(location.hash))aba='conversas';
if(/^#t-[a-z0-9]{10}$/.test(location.hash)){aba='telefone';const tid=location.hash.slice(3);
  if(listaTels().some(x=>x.tid===tid))setTimeout(async()=>{try{await fb.iniciar();await telAbre(tid)}catch(e){}},300)}
novo(0);st.estado='parado';telaInicio();if(pacoteHash){aba='enviar';abrePacote(decodeURIComponent(pacoteHash))}requestAnimationFrame(loop);
