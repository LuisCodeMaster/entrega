// ================= PAINEL =================
let aba='conversas';
function painel(html){const p=$('painel'),c=$('card'),abrindo=p.classList.contains('oculta');c.innerHTML=html;p.classList.remove('oculta');
  if(abrindo){c.classList.remove('entra');void c.offsetWidth;c.classList.add('entra')}}
function fechaPainel(){$('painel').classList.add('oculta');document.activeElement&&document.activeElement.blur()}
function erro(t){const e=$('erro');if(e)e.textContent=t}
function rotaHtml(online){
  const seq=ROTAS[J.rota];
  return '<div class="rota">'+seq.map((f,i)=>{
    const minha=online?false:(J.pos<CORTE)===(i<CORTE);
    return `<span class="${i<J.pos?'feita ':''}${minha?'minha':''}">${FASES[f].chefe.emoji}</span>`}).join('')+'</div>';
}
function telaInicio(){
  if(typeof saiLobby==='function')saiLobby();
  if(typeof tel!=='undefined'){tel.tela=null;if(typeof parReveal==='function')parReveal()}
  let corpo='';
  if(aba==='conversas')corpo=htmlConversas();
  if(aba==='telefone')corpo=htmlTelefone();
  if(aba==='enviar')corpo=`
    <p style="font-size:14px">Você escreve e leva a mensagem pelas 3 primeiras fases. Depois manda um <b>código</b> pra outra pessoa terminar. Cada dano estraga letras: ela vai ter que adivinhar o que você escreveu.</p>
    <div class="linha">
      <div><label>Seu nome</label><input id="deQuem" maxlength="12" value="${esc(ls.get('entrega_nome','Luis'))}"></div>
      <div><label>Para quem</label><input id="paraQuem" maxlength="12" value="Maria"></div>
    </div>
    <label>A mensagem</label><input id="texto" maxlength="60" value="Bora jogar hoje à noite?">
    <div class="erro" id="erro"></div>
    <button data-a="enviar">ENVIAR ➤</button>`;
  if(aba==='receber')corpo=`
    <p style="font-size:14px">Alguém te mandou um pacote? Cole aqui o texto que você recebeu.</p>
    <textarea id="codigo" rows="5" placeholder="ENT-..."></textarea>
    <div class="erro" id="erro"></div>
    <button data-a="abrir">ABRIR PACOTE 📦</button>`;
  painel(`<h1 class="logo"><span class="env">✉️</span><span class="txt">ENTREGA!</span></h1>
    <div class="tag">A JORNADA DA MENSAGEM</div>
    <p>Você é uma <b>mensagem</b> viajando de um celular para o outro.</p>
    <div class="perfil topo"><a class="lang" href="${LANG_LINK}">${LANG_TXT}</a><span class="pts">⭐ ${perfil.pts}</span><button data-a="visual">🎽 Visual</button><button data-a="ranking">🏆 Ranking</button><button data-a="mural">📊 Mural</button><button data-a="som">${AU.mudo?'🔇':'🔊'}</button><button data-a="musica" class="${AU.estiloMusica==='off'?'desl':''}" title="Música">🎵</button></div>
    <button class="lobbyBtn" data-a="lobby">🌍 LOBBY · salas abertas pra entrar</button>
    <div class="abas modos">
      <button class="${aba==='conversas'?'on':''}" data-a="aba" data-n="conversas">💬<br>Conversa</button>
      <button class="${aba==='telefone'?'on':''}" data-a="aba" data-n="telefone">📞<br>Telefone</button>
      <button class="${aba==='enviar'?'on':''}" data-a="aba" data-n="enviar">✍️<br>Enviar</button>
      <button class="${aba==='receber'?'on':''}" data-a="aba" data-n="receber">📦<br>Código</button>
    </div>${corpo}
    <div class="dica comoJoga">Celular: arraste o dedo (melhor deitado). PC: setas / WASD.<br>Pegue 📶, desvie de 🦠 🔥 📧. No chefe, você atira ✓ sozinho.</div>`);
}
// ---- telas código ----
function telaPacoteAberto(){
  const seq=ROTAS[J.rota];
  painel(`<div class="grande">📦</div><h2>Pacote de ${esc(J.de)}</h2>
    <p>Uma mensagem ${J.rota==='volta'?'de resposta ':''}para <b>${esc(J.para)}</b> parou no meio do caminho e precisa de você pra chegar.</p>
    ${rotaHtml()}
    <div class="bolha cinza">${esc(textoEstragado())}</div>
    <p style="font-size:14px">${pctInteiro()}% inteira · ${J.vidas} ✉️ vidas · Faltam ${seq.length-J.pos} fases</p>
    <button data-a="continuar">CONTINUAR ENTREGA ➤</button>
    <button class="sec" data-a="menu">MENU</button>`);
}
function telaFaseOk(){
  const f=FASES[ROTAS[J.rota][J.pos-1]];
  painel(`<div class="grande">${f.chefe.emoji}</div><h2>${esc(f.chefe.nome)} derrotado!</h2>
    ${rotaHtml()}
    <div class="bolha cinza">${esc(textoEstragado())}</div>
    <p style="font-size:14px">Mensagem ${pctInteiro()}% inteira · +1 vida (${J.vidas} ✉️)</p>
    <button data-a="continuar">PRÓXIMA FASE ➤</button>
    <button class="sec" data-a="menu">MENU</button>`);
}
function telaPassar(){
  const cod=codifica(J),prox=FASES[ROTAS[J.rota][J.pos]];
  const share=`✉️ ${J.de} te mandou uma mensagem no jogo ENTREGA! Ela chegou até ${prox.nome} e agora só você pode terminar a entrega.\n\nAbra o jogo: ${LINK}\nVá em "📦 Código" e cole isto:\n${cod}`;
  painel(`<div class="grande">📤</div><h2>Sua parte acabou!</h2>
    <p>Agora é com <b>${esc(J.para)}</b>. Mande o pacote pelo WhatsApp ou onde quiser.</p>
    ${rotaHtml()}
    <div class="bolha cinza">${esc(textoEstragado())}</div>
    <p style="font-size:14px">Chegou ${pctInteiro()}% inteira na metade do caminho.</p>
    <textarea id="share" rows="5" readonly>${esc(share)}</textarea>
    <button data-a="copiar">📋 COPIAR PACOTE</button>
    <div class="erro" id="erro"></div>
    <button class="sec" data-a="menu">MENU</button>`);
}
function telaChegou(online){
  painel(`<div class="grande">📱</div><h2 class="ok">Chegou pra você, ${esc(J.para)}!</h2>
    <p>Mas a mensagem de <b>${esc(J.de)}</b> se estragou no caminho:</p>
    <div class="bolha">${esc(textoEstragado())}</div>
    <label>O que você acha que ${esc(J.de)} escreveu?</label>
    <input id="palpite" maxlength="80" value="${esc(textoEstragado().replace(/_/g,''))}">
    <button data-a="conferir">CONFERIR ✓✓</button>`);
}
function telaResultado(palpite,online){
  const p=parecido(palpite,J.txt);
  const nota=p>=95?'🏆 Entendeu tudo!':p>=75?'👍 Quase lá!':p>=50?'🤔 Mais ou menos...':'😵 Telefone sem fio total!';
  const pontos=J.pts+p*10;
  const share=`✓✓ Recebi sua mensagem no ENTREGA!\nChegou assim: "${textoEstragado()}"\nEu entendi: "${palpite}"\nAcertei ${p}% (${pontos} pts). Era isso? 😅`;
  J.resultado={palpite,p};
  const quem='Você entendeu';
  painel(`<h2>${nota}</h2>
    <p style="font-size:14px">${quem}:</p><div class="bolha cinza">${esc(palpite)}</div>
    <p style="font-size:14px">${esc(J.de)} escreveu de verdade:</p><div class="bolha">${esc(J.txt)} <span class="checks">✓✓</span></div>
    <div class="stats"><div><b>${p}%</b>acerto</div><div><b>${pctInteiro()}%</b>inteira</div><div><b>${pontos}</b>pontos</div></div>
    ${online?`<button data-a="voltaSala">🔁 JOGAR DE NOVO</button><button class="sec" data-a="sairOnline">SAIR DA SALA</button>`:
    `<p style="font-size:14px">Conta pra ${esc(J.de)} se você acertou:</p>
    <textarea id="share" rows="4" readonly>${esc(share)}</textarea>
    <button class="sec" data-a="copiar">📋 COPIAR RESULTADO</button>
    <div class="erro" id="erro"></div>
    <button class="rosa" data-a="responder">↩️ RESPONDER ${esc(J.de.toUpperCase())}</button>
    <button class="sec" data-a="menu">MENU</button>`}`);
}
function telaResponder(){
  painel(`<div class="grande">↩️</div><h2>Responder ${esc(J.de)}</h2>
    <p style="font-size:14px">Sua resposta faz o caminho de volta: começa no seu celular, passa pelo Hacker e pelo Firewall e chega no Wi-Fi da casa de ${esc(J.de)}.</p>
    <label>Sua resposta</label><input id="texto" maxlength="60" placeholder="Bora! Que horas?">
    <div class="erro" id="erro"></div>
    <button class="rosa" data-a="enviarResposta">ENVIAR RESPOSTA ➤</button>
    <button class="sec" data-a="menu">MENU</button>`);
}
function telaPerdeu(motivo){
  const f=FASES[ROTAS[J.rota][J.pos]];
  painel(`<div class="grande">⚠️</div><h2 class="ruim">A mensagem se perdeu!</h2>
    <p>${motivo==='sinal'?'O sinal acabou':'Ela foi corrompida'} em <b>${f.nome}</b>.</p>
    <div class="bolha cinza">${esc(textoEstragado())}</div>
    <p style="font-size:14px">Dá pra reenviar dessa fase, mas cada reenvio estraga mais letras.</p>
    <button data-a="reenviar">🔁 REENVIAR</button>
    <button class="sec" data-a="menu">DESISTIR</button>`);
}
async function copiar(){
  const ta=$('share');if(!ta)return;
  try{await navigator.clipboard.writeText(ta.value);erro('');const b=document.querySelector('[data-a="copiar"]');if(b)b.textContent='✓ COPIADO!'}
  catch(e){ta.focus();ta.select();erro('Não deu pra copiar sozinho: o texto foi selecionado, copie manualmente.')}
}

$('card').addEventListener('click',e=>{
  const b=e.target.closest('[data-a]');if(!b)return;sfx('clique');const a=b.dataset.a,n=b.dataset.n;
  if(a==='aba'){aba=n;telaInicio()}
  if(a==='enviar'){
    const de=limpaTexto($('deQuem').value.trim()),para=limpaTexto($('paraQuem').value.trim()),t=limpaEntrada($('texto').value.trim());
    if(!de||!para)return erro('Preencha os dois nomes.');if(t.replace(/ /g,'').length<3)return erro('Escreva uma mensagem um pouco maior.');
    ls.set('entrega_nome',de);J=novaJornada(de,para,t,'ida');modo='jornada';escolheCanal(t,jogarJ,()=>telaInicio());
  }
  if(a==='abrir'){
    const o=decodifica($('codigo').value);if(!o)return erro('Código inválido. Confira se copiou tudo, começando em ENT-');
    if(o.pos>=ROTAS[o.rota].length)return erro('Esse pacote já foi entregue.');
    J=o;modo='jornada';telaPacoteAberto();
  }
  if(a==='continuar')escolheCanal(J.txt,jogarJ,()=>J.pos?telaFaseOk():telaPacoteAberto());
  if(a==='reenviar'){J.falhas++;corromper(perdaPorDano()*2);J.vidas=3;J.sinal=100;jogarJ()}
  if(a==='copiar')copiar();
  if(a==='conferir'){const p=$('palpite').value.trim();if(!p)return;telaResultado(p)}
  if(a==='responder')telaResponder();
  if(a==='enviarResposta'){
    const t=limpaEntrada($('texto').value.trim());if(t.replace(/ /g,'').length<3)return erro('Escreva uma resposta um pouco maior.');
    const rota=J.rota==='ida'?'volta':'ida';J=novaJornada(J.para,J.de,t,rota,J.rodada+1);modo='jornada';jogarJ();
  }
  if(a==='menu')menu();
  if(a.startsWith('tel')){telAcao(a,n);return}
  if(['novaConv','entrarConv','abrirConv','entrarConvLink','tentarChat','cancelarChat','lixoConv','remConv','remConvTudo'].includes(a)){acaoConversa(a,n);return}
  if(a==='canal'){canalAtual=n;ls.set('entrega_canal',n);fechaPainel();if(canalCb)canalCb();return}
  if(a==='rolSorte'){roleta(canalTxt,null);return}
  if(a==='rolJoga'){if(!rolFim)return;canalAtual=rolFim.id;fechaPainel();if(canalCb)canalCb();return}
  if(a==='canalBloq'){toast('🔵 Bluetooth só leva mensagem de até 20 letras');return}
  if(a==='canalVolta'){canalAtual=null;fechaPainel();if(canalVolta)canalVolta();return}
  if(a==='visual')telaVisual();
  if(a==='skin'){const [k,v]=n.split(':');const L={cor:CORES_ENV,rastro:RASTROS,cara:CARAS,ace:ACESSORIOS,selo:SELOS}[k],it=L&&L.find(x=>x.id===v),tt=k==='titulo'&&TITULOS.find(x=>x.id===v);
    if((it&&perfil.pts>=it.p)||(tt&&tt.ok(perfil))){perfil[k]=v;salvaPerfil();if(k==='titulo')enviaRanking()}telaVisual()}
  if(a==='visAba'){visAba=n;telaVisual()}
  if(a==='visSorteia'){visSorteia();return}
  if(a==='nadaTit'){const t=TITULOS.find(x=>'titulo:'+x.id===n);if(t)toast('🔒 '+t.d)}
  if(a==='nada'){const it=LISTAS_PTS().find(x=>n.endsWith(':'+x.id));if(it)toast('🔒 Precisa de '+it.p+' pontos')}
  if(a==='ranking')telaRanking();
  if(a==='mural'){muralAba='top';telaMural()}
  if(a==='som'){alternaSom();telaInicio()}
  if(a==='musica'){toast(alternaMusica());telaInicio()}
  if(['muralAba','curtir','muralEsconde','muralApaga'].includes(a)){muralAcao(a,n);return}
  if(a.startsWith('lobby')||a==='publico'){lobbyAcao(a,n);return}
  if(a==='rankAba'){rankAba=n;telaRanking()}
  if(a==='rankApaga'){fb.api.rankApagar(n).then(()=>{toast('🗑️ Removido do ranking');telaRanking()}).catch(()=>toast('⚠️ Sem permissão de admin'));return}
  if(a==='copiarId'){const t=fb.uid||'';navigator.clipboard&&navigator.clipboard.writeText(t).then(()=>toast('📋 ID copiado'),()=>toast(t));return}
});
