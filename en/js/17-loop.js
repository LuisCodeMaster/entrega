// ================= LOOP =================
let last=performance.now();
$('btnSom').addEventListener('click',()=>{auInit();alternaSom()});$('btnSom').textContent=AU.mudo?'🔇':'🔊';
function loop(t){const dt=Math.min(.033,(t-last)/1000||0);last=t;update(dt);draw();if(AU.ctx)musica(musicaDesejada());{const emJogo=st&&$('painel').classList.contains('oculta')&&!ch.aberto&&st.estado!=='parado';$('btnSom').style.display=emJogo?'':'none'}desenhaPreview(t/1000);requestAnimationFrame(loop)}
if(/^#sala-[A-Z]{4}$/i.test(location.hash))aba='online';
if(/^#c-[a-z0-9]{10}$/.test(location.hash))aba='conversas';
if(/^#t-[a-z0-9]{10}$/.test(location.hash))aba='telefone';
novo(0);st.estado='parado';telaInicio();requestAnimationFrame(loop);
