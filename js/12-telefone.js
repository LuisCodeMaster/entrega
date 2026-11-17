// ================= TELEFONE SEM FIO =================
const tel={tid:null,dados:null,desliga:null,tela:null,prev:'',meuTxt:''};
setInterval(()=>{if(tel.tela==='lobby'&&tel.dados&&!document.hidden)telLobby()},8000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&tel.tela==='lobby'&&tel.tid)telAbre(tel.tid).catch(()=>{})});
function listaTels(){let l;try{l=JSON.parse(ls.get('entrega_tels','[]'))}catch(e){l=[]}
  const lim=Date.now()-3*864e5;return l.filter(x=>(x.t||x.vista||Date.now())>lim)}
function infoRoda(t){const h=t.t?new Date(t.t).toLocaleTimeString(LOCALE,{hour:'2-digit',minute:'2-digit'}):'';const d=t.t?new Date(t.t).toLocaleDateString(LOCALE,{day:'2-digit',month:'2-digit'}):'';
  const st=t.estado==='fim'?'🏁 acabou':t.estado==='espera'?`⏳ esperando ${t.dentro||'?'}/${t.max||'?'}`:t.estado==='jogando'?`🎮 jogando ${t.feitos||0}/${t.total||'?'}`:'';
  const tm=t.tema?temaDe(t.tema).e:'';return [st,tm,d&&h?`${d} ${h}`:'',t.criei?'você criou':t.entrei?'você entrou':'você viu'].filter(Boolean).join(' · ')}
function salvaTel(tid,d){const l=listaTels().filter(x=>x.tid!==tid),v=listaTels().find(x=>x.tid===tid)||{};l.unshift({...v,tid,...d});ls.set('entrega_tels',JSON.stringify(l.slice(0,30)))}
function elosDe(d){return Object.entries((d&&d.elos)||{}).sort((a,b)=>a[0]<b[0]?-1:1).map(([k,v])=>({k,...limpaObj(v,['txt','vis','recebeu','nome'])}))}
function telOrdem(d){const o=d&&d.info&&d.info.ordem;return o?Object.keys(o).sort((a,b)=>a-b).map(k=>o[k]):null}
function telEstado(d){return (d&&d.info&&d.info.estado)||'jogando'}
function telJogadores(d){return Object.entries((d&&d.jogadores)||{}).map(([uid,v])=>({uid,nome:limpaTexto(v.nome||'?'),t:v.t||0})).sort((a,b)=>a.t-b.t)}
function elosReais(d){return elosDe(d).filter(e=>!e.pulou)}
function telFim(d){if(!d||!d.info)return false;if(d.info.fim)return true;const o=telOrdem(d);return elosDe(d).length>=(o?o.length:d.info.max)}
function telDaVez(d){const o=telOrdem(d);return o?o[elosDe(d).length]||null:null}
const chaveElo=i=>'e'+String(i).padStart(2,'0');
let telMax=5;
function htmlTelefone(){
  if(!conversasAtivas())return '<p class="ruim">O Telefone Sem Fio precisa do servidor das conversas.</p>';
  const hash=(location.hash.match(/^#t-([a-z0-9]{10})$/)||[])[1]||'',ls_=listaTels();
  return `<p style="font-size:14px">A brincadeira de criança: uma frase passa de pessoa em pessoa, e cada um <b>entrega jogando</b>. Quem recebe vê a frase estragada, reescreve do jeito que entendeu e passa adiante. No fim, a revelação vira vídeo pra Short! 🎬</p>
    <label>Seu nome</label><input id="meuNome" maxlength="12" value="${esc(ls.get('entrega_nome','Luis'))}">
    ${hash?`<div class="bolha cinza" style="margin-top:10px">Te chamaram pra um Telefone Sem Fio!</div><button data-a="telAbrir" data-n="${hash}">📞 ENTRAR NA RODA</button>`:''}
    <label>Quantas pessoas na roda?</label>
    <div class="vis" style="grid-template-columns:repeat(6,1fr)">${[3,4,5,6,7,8].map(n=>`<button class="${telMax===n?'on':''}" data-a="telMax" data-n="${n}">${n}</button>`).join('')}</div>
    <label>Tema da rodada</label>
    <div class="temas">${TEMAS.map(t=>`<button class="${telTema===t.id?'on':''}" data-a="telTema" data-n="${t.id}"><b>${t.e}</b>${esc(t.n)}</button>`).join('')}</div>
    <label>A frase que começa tudo</label>
    <div class="linha"><div style="flex:3"><input id="telFrase" maxlength="60" placeholder="${esc(temaDe(telTema).ex[0])}"></div><div><button class="sec" data-a="telSorteia" style="margin:0;height:100%">🎲</button></div></div>
    <div class="erro" id="erro"></div>
    ${htmlPublico()}
    <button data-a="telCriar" ${hash?'class="sec"':''}>📞 CRIAR RODA</button>
    ${ls_.length?'<label>Suas rodas</label><div class="convs">'+ls_.sort((a,b)=>(b.t||0)-(a.t||0)).map(t=>`<div class="convItem"><button data-a="telAbrir" data-n="${t.tid}"><span>📞 ${esc(t.titulo||'Roda')}<small>${infoRoda(t)}</small></span></button><button class="lixo" data-a="telLixo" data-n="${t.tid}">🗑️</button></div>`).join('')+'</div>':''}`;
}
async function telAcao(a,n){
  if(a==='telTema'){const f=$('telFrase').value;telTema=n;telaInicio();$('telFrase').value=f;return}
  if(a==='telSorteia'){const ex=temaDe(telTema).ex;$('telFrase').value=ex[Math.floor(R()*ex.length)];return}
  if(a==='telMural'){publicaMural();return}
  if(a==='telNarra'){narracao=!narracao;ls.set('entrega_narra',narracao?'1':'0');telaRevelacao();return}
  if(a==='telMax'){const f=$('telFrase').value;telMax=+n;telaInicio();$('telFrase').value=f;return}
  if(a==='telLixo'){ls.set('entrega_tels',JSON.stringify(listaTels().filter(x=>x.tid!==n)));telaInicio();toast('Roda removida da lista');return}
  if(a==='telCriar'){
    const nome=pegaNome(),f=limpaEntrada($('telFrase').value.trim());
    if(f.replace(/\s/g,'').length<4)return erro('Escreva uma frase um pouco maior.');
    erro('Criando…');
    try{await fb.iniciar();const tid=novoCid();
      ls.set('entrega_telfrase_'+tid,f);
      await fb.api.telCriar(tid,{criador:fb.uid,nome,max:telMax,tema:telTema,estado:'espera',publico:lobbyPublico,t:Date.now()});await fb.api.telEntrar(tid,nome);tel.publicado=tid;await lobbyPublicaTel(tid,{nome,max:telMax,tema:telTema});
      salvaTel(tid,{titulo:'Roda de '+nome,criei:1});await telAbre(tid,true);
    }catch(e){erro('Não consegui criar a roda. Confira a internet.')}
    return}
  if(a==='telAbrir'){pegaNome();erro('Conectando…');try{await fb.iniciar();await telAbre(n)}catch(e){erro('Não consegui abrir essa roda.')}return}
  if(a==='telVez'){
    const d=tel.dados;if(telFim(d)||elosDe(d).some(e=>e.de===fb.uid))return telLobby();
    if(telOrdem(d)&&telDaVez(d)!==fb.uid){toast('Ainda não é sua vez!');return telLobby()}
    const ok=await fb.api.telVez(tel.tid,ls.get('entrega_nome','Jogador')).catch(()=>false);
    if(!ok){toast('Alguém pegou a vez antes de você!');return telLobby()}
    const el=elosReais(d);tel.prev=el.length?el[el.length-1].vis:'';
    if(!el.length){const f=ls.get('entrega_telfrase_'+tel.tid,'');if(f)return escolheCanal(f,()=>telJoga(f),async()=>{await fb.api.telSoltaVez(tel.tid).catch(()=>{});telLobby()});return telaPrimeiraFrase()}
    telaReescrever();return}
  if(a==='telPrimeira'){const f=limpaEntrada($('telTexto').value.trim());if(f.replace(/\s/g,'').length<4)return erro('Escreva uma frase um pouco maior.');ls.set('entrega_telfrase_'+tel.tid,f);escolheCanal(f,()=>telJoga(f),()=>telaPrimeiraFrase());return}
  if(a==='telEntrarRoda'){const d=tel.dados;if(telJogadores(d).length>=d.info.max)return toast('A roda já encheu!');
    try{await fb.api.telEntrar(tel.tid,ls.get('entrega_nome','Jogador'));lobbyContaTel(tel.tid,telJogadores(d).length+1)}catch(e){toast('⚠️ Não consegui entrar')}return}
  if(a==='telSair'){try{await fb.api.telSair(tel.tid);lobbyContaTel(tel.tid,Math.max(1,telJogadores(tel.dados).length-1))}catch(e){}ls.set('entrega_tels',JSON.stringify(listaTels().filter(x=>x.tid!==tel.tid)));telaInicio();return}
  if(a==='telRecarrega'){try{await telAbre(tel.tid)}catch(e){toast('⚠️ Sem conexão')}return}
  if(a==='telComecar'){telComecar();return}
  if(a==='telPular'){const o=telOrdem(tel.dados),v=telDaVez(tel.dados);if(!o||!v)return;
    try{const nova=o.filter(u=>u!==v),fimJa=elosDe(tel.dados).length>=nova.length;await fb.api.telInfo(tel.tid,fimJa?{ordem:nova,fim:true}:{ordem:nova});await fb.api.telSoltaVez(tel.tid).catch(()=>{});toast('⏭️ Vez pulada')}catch(e){toast('⚠️ Não consegui pular')}return}
  if(a==='telEntregar'){const t=limpaEntrada($('telTexto').value.trim());if(t.replace(/\s/g,'').length<2)return erro('Escreva o que você entendeu.');escolheCanal(t,()=>telJoga(t),()=>{telaReescrever();$('telTexto').value=t});return}
  if(a==='telVolta'){await fb.api.telSoltaVez(tel.tid).catch(()=>{});telLobby();return}
  if(a==='telDesiste'){if(!telOrdem(tel.dados)){await fb.api.telSoltaVez(tel.tid).catch(()=>{});return telLobby()}
    tel.tela='confirma';painel(`<div class="grande">⏭️</div><h2>Pular sua vez?</h2><p>A frase passa pra próxima pessoa do jeito que chegou até você. Você não joga nesta roda.</p>
      <button class="rosa" data-a="telPularEu">⏭️ SIM, PULAR MINHA VEZ</button><button class="sec" data-a="telVoltaVez">NÃO, QUERO JOGAR</button>`);return}
  if(a==='telVoltaVez'){const el=elosReais(tel.dados);tel.prev=el.length?el[el.length-1].vis:'';return el.length?telaReescrever():telaPrimeiraFrase()}
  if(a==='telPularEu'){await telPularEu();return}
  if(a==='telDeNovo'){telJoga(tel.meuTxt);return}
  if(a==='telRevelarJa'){try{await fb.api.telEncerra(tel.tid);fb.api.lobbyTirar('t-'+tel.tid).catch(()=>{})}catch(e){toast('⚠️ Não consegui encerrar')}return}
  if(a==='telLobby'){parReveal();telLobby();return}
  if(a==='telReveal'){telaRevelacao();return}
  if(a==='telVideo'){gravaVideo();return}
  if(a==='telBaixar'){baixaVideo();return}
  if(a==='telShare'){compartilhaVideo();return}
}
async function telAbre(tid,nova){
  if(location.hash)history.replaceState(null,'',location.pathname);
  if(tel.desliga){try{tel.desliga()}catch(e){}}
  tel.publicado=nova?tid:null;tel.tid=tid;tel.dados=null;tel.tela='lobby';
  painel('<p>Carregando a roda…</p>');tel.minhaVezAvisada=false;
  tel.desliga=fb.api.telOuvir(tid,d=>{tel.dados=d;
    if(d&&d.info&&d.info.criador===fb.uid&&telEstado(d)==='espera'&&telJogadores(d).length>=d.info.max)telComecar();
    else if(d&&d.info&&d.info.criador===fb.uid&&telEstado(d)==='espera'&&d.info.publico&&tel.publicado!==tid){tel.publicado=tid;lobbyPublicaTel(tid,{nome:d.info.nome,max:d.info.max,tema:d.info.tema,dentro:telJogadores(d).length},true)}
    if(d&&telEstado(d)==='jogando'&&telDaVez(d)===fb.uid&&!tel.minhaVezAvisada&&!elosDe(d).some(e=>e.de===fb.uid)){tel.minhaVezAvisada=true;sfx('alarme');toast('🎮 É A SUA VEZ!');if(document.hidden)document.title='🎮 Sua vez! — ENTREGA!'}
    if(d&&d.info&&telFim(d)&&d.info.criador===fb.uid)fb.api.lobbyTirar('t-'+tid).catch(()=>{});
    if(d&&d.info){const o=telOrdem(d),js=telJogadores(d);
      salvaTel(tid,{titulo:'Roda de '+d.info.nome,criei:d.info.criador===fb.uid?1:0,entrei:js.some(j=>j.uid===fb.uid)?1:0,
        estado:telFim(d)?'fim':telEstado(d),feitos:elosDe(d).length,total:o?o.length:d.info.max,dentro:js.length,max:d.info.max,tema:d.info.tema,t:d.info.t||Date.now(),vista:Date.now()})}
    if(tel.tela==='lobby')telLobby()});
}
async function telComecar(){const d=tel.dados;if(!d||!d.info||d.info.criador!==fb.uid||telEstado(d)!=='espera'||tel.comecando)return;
  tel.comecando=true;const js=telJogadores(d);const ordem=[fb.uid,...js.map(j=>j.uid).filter(u=>u!==fb.uid)];
  try{await fb.api.telInfo(tel.tid,{estado:'jogando',ordem});fb.api.lobbyTirar('t-'+tel.tid).catch(()=>{})}catch(e){toast('⚠️ Não consegui começar')}tel.comecando=false}
function telaPrimeiraFrase(){tel.tela='primeira';const tm=temaDe(tel.dados.info.tema);
  painel(`<div class="grande">✍️</div><p style="font-size:14px;margin:0">Tema: ${tm.e} ${esc(tm.n)}</p><h2>Escreva a frase que começa tudo</h2>
    <input id="telTexto" maxlength="60" placeholder="${esc(tm.ex[0])}"><div class="erro" id="erro"></div>
    <button data-a="telPrimeira">ENTREGAR ➤</button><button class="sec" data-a="telDesiste">PULAR MINHA VEZ</button>`)}
async function telPularEu(){
  const d=tel.dados,el=elosDe(d),i=el.length;
  if(telFim(d)||el.some(e=>e.de===fb.uid)||(telOrdem(d)&&telDaVez(d)!==fb.uid))return telLobby();
  const reais=elosReais(d),prev=(reais.length?reais[reais.length-1].vis:'').slice(0,80);
  try{await fb.api.telElo(tel.tid,chaveElo(i),{de:fb.uid,nome:ls.get('entrega_nome','Jogador').slice(0,12),pulou:true,recebeu:prev,txt:prev,vis:prev,pct:100,t:Date.now()});
    await fb.api.telSoltaVez(tel.tid).catch(()=>{});
    const total=(telOrdem(d)||[]).length||d.info.max;if(i+1>=total)await fb.api.telEncerra(tel.tid).catch(()=>{});
    toast('⏭️ Você pulou sua vez');telLobby()}
  catch(e){toast('⚠️ Não consegui pular')}
}
function telShareTxt(){const d=tel.dados;if(telEstado(d)==='espera'){const f=d.info.max-telJogadores(d).length;
    return `📞 Telefone Sem Fio no ENTREGA! Cada pessoa entrega a frase jogando e no fim a gente vê como ela chegou 😂\nFalta${f>1?'m':''} ${f} pessoa${f>1?'s':''} pra começar. Entra na roda:\n${SITE}#t-${tel.tid}`}
  const f=d.info.max-elosDe(d).length;
  return `📞 Telefone Sem Fio no ENTREGA! A frase tá passando de pessoa em pessoa e cada um entrega jogando 😂\nFalta${f>1?'m':''} ${f} pessoa${f>1?'s':''}. Entra e joga sua vez:\n${SITE}#t-${tel.tid}`}
function telLobby(){
  tel.tela='lobby';const d=tel.dados;
  if(!d||!d.info)return painel('<p>Carregando a roda…</p><button class="sec" data-a="menu">VOLTAR</button>');
  const eu=fb.uid,criador=d.info.criador===eu,max=d.info.max,tm=temaDe(d.info.tema),estado=telEstado(d),js=telJogadores(d),dentro=js.some(j=>j.uid===eu);
  const topo=`<div class="grande">📞</div><h2>Roda de ${esc(d.info.nome)}</h2><p style="font-size:14px;margin:0">Tema: ${tm.e} <b>${esc(tm.n)}</b></p>`;
  const convite=`<textarea id="share" rows="4" readonly>${esc(telShareTxt())}</textarea><button class="sec" data-a="copiar">📋 COPIAR CONVITE</button><div class="erro" id="erro"></div>`;
  if(estado==='espera'){
    const vagas=Array.from({length:max},(_,i)=>{const j=js[i];return `<div class="vaga ${j?'ok':''}">${j?`🙋 ${esc(j.nome)}${j.uid===eu?' (você)':''}${j.uid===d.info.criador?' 👑':''}`:'⏳ vaga livre'}</div>`}).join('');
    let acao='';
    if(criador)acao=`<p>⏳ Esperando todo mundo entrar… <b>${js.length}/${max}</b><br><small>A roda começa sozinha quando encher.</small></p>${convite}
      ${js.length>=2?`<button class="rosa" data-a="telComecar">▶️ COMEÇAR AGORA COM ${js.length}</button>`:''}`;
    else if(dentro)acao=`<p>✅ Você está na roda! <b>${js.length}/${max}</b><br><small>Espere todo mundo entrar. O jogo avisa quando for sua vez.</small></p>${convite}<button class="sec" data-a="telSair">SAIR DA RODA</button>`;
    else if(js.length<max)acao=`<p><b>${js.length}/${max}</b> pessoas na roda.</p><button data-a="telEntrarRoda">✋ ENTRAR NA RODA</button>`;
    else acao='<p>😕 Essa roda já encheu.</p>';
    return painel(`${topo}<div class="vagas">${vagas}</div>${acao}<button class="sec" data-a="menu">MENU</button>`);
  }
  const el=elosDe(d),fim=telFim(d),joguei=el.some(e=>e.de===eu),ordem=telOrdem(d);
  let lista='',corpo='';
  if(ordem){const nomes=Object.fromEntries(js.map(j=>[j.uid,j.nome]));el.forEach(e=>{nomes[e.de]=e.nome});
    lista='<div class="vagas">'+ordem.map((u,i)=>{const feito=i<el.length,pulou=feito&&el[i].pulou,agora=i===el.length&&!fim;
      return `<div class="vaga ${feito?'ok':''} ${agora?'agora':''}">${pulou?'⏭️':feito?'✅':agora?'🎮':'⏳'} ${i+1}. ${esc(nomes[u]||'?')}${u===eu?' (você)':''}${pulou?' · pulou':''}</div>`}).join('')+'</div>'}
  else{const bolinhas=Array.from({length:max},(_,i)=>`<span class="${i<el.length?'feita':''}">${i<el.length?'✉️':'·'}</span>`).join('');
    lista=`<div class="rota">${bolinhas}</div><p style="font-size:14px">${el.length}/${max} entregas</p>`}
  const vezUid=telDaVez(d),vezNome=vezUid?(js.find(j=>j.uid===vezUid)||{}).nome:null;
  const vez=d.vez&&d.vez.ate>Date.now()&&d.vez.uid!==eu?d.vez:null;
  if(fim&&!elosReais(d).length)corpo='<p>A roda acabou sem nenhuma entrega. 😅</p>';
  else if(fim)corpo=`<p>A roda acabou! Veja como a frase mudou de pessoa em pessoa 👇</p><button data-a="telReveal">🎬 VER REVELAÇÃO</button>`;
  else if(ordem&&vezUid===eu)corpo=`<p class="ok"><b>🎮 É A SUA VEZ!</b></p><button data-a="telVez">🎮 JOGAR MINHA VEZ</button>${criador?'<button class="sec" data-a="telPular">⏭️ PULAR MINHA VEZ</button>':''}`;
  else if(ordem)corpo=`<p>${joguei?'✅ Você já jogou. ':''}Agora é a vez de <b>${esc(vezNome||'?')}</b>…</p>
    ${criador?`<button class="sec" data-a="telPular">⏭️ PULAR ${esc((vezNome||'').toUpperCase())}</button>`:''}`;
  else if(joguei)corpo=`<p>✅ Você já jogou sua vez. ${vez?`<br>🎮 <b>${esc(vez.nome)}</b> está jogando agora…`:'Agora é só esperar e chamar mais gente!'}</p>${convite}`;
  else if(!el.length)corpo=`<p>⏳ Esperando ${esc(d.info.nome)} começar a roda…</p>`;
  else if(vez)corpo=`<p>🎮 <b>${esc(vez.nome)}</b> está jogando agora. Espere a vez dele terminar…</p>`;
  else corpo=`<p>A frase chegou até aqui depois de ${el.length} pessoa${el.length>1?'s':''}. Agora é você!</p><button data-a="telVez">🎮 JOGAR MINHA VEZ</button>`;
  if(!fim&&criador&&el.length>=2)corpo+='<button class="rosa" data-a="telRevelarJa">🎬 ENCERRAR E REVELAR AGORA</button>';
  painel(`${topo}${lista}${corpo}<div class="linha"><div><button class="sec" data-a="telRecarrega">🔄 ATUALIZAR</button></div><div><button class="sec" data-a="menu">MENU</button></div></div>`);
}
function telaReescrever(){
  tel.tela='reescrever';
  const tm=temaDe(tel.dados&&tel.dados.info&&tel.dados.info.tema);
  painel(`<div class="grande">📨</div><p style="font-size:14px;margin:0">Tema: ${tm.e} ${esc(tm.n)}</p><h2>A frase chegou assim:</h2>
    <div class="bolha" style="font-size:22px">${esc(tel.prev)}</div>
    <label>O que você acha que era? Reescreva do seu jeito:</label>
    <input id="telTexto" maxlength="60" value="${esc(tel.prev.replace(/_/g,''))}">
    <p class="dica">Depois você entrega jogando pra próxima pessoa. Pegue as letras!</p>
    <div class="erro" id="erro"></div>
    <button data-a="telEntregar">ENTREGAR ➤</button><button class="sec" data-a="telDesiste">DESISTIR DA VEZ</button>`);
  setTimeout(()=>{const i=$('telTexto');if(i){i.focus();i.select()}},50);
}
function telJoga(txt){
  tel.meuTxt=txt;tel.tela='jogando';
  J=novaJornada(ls.get('entrega_nome','Eu'),'próximo',txt,'ida');
  J.c=letrasJ().map((p,i)=>ehLetra(p)?i:-1).filter(i=>i>=0);
  const ef=efeitosDoTexto(txt),el=elosDe(tel.dados),i=el.length;
  let dist=3000+J.c.length*70;if(ef.includes('pergunta'))dist*=.75;
  fechaChat();modo='telefone';fixo=false;resize();fechaPainel();dados={de:J.de,para:'Próximo'};
  novo(i%FASES.length,{vidas:4+(ef.includes('coracao')?1:0),sinal:100,primeira:true,ultima:true,dist,semChefe:!ef.includes('socorro'),hpMul:.4,rotulo:'📞 PASSANDO A FRASE'});
  Object.assign(st,{comChefe:ef.includes('socorro'),efeitos:ef,mimo:null,mimoEnviar:null,letrasPegas:0,
    fila:J.c.map((ix,k)=>({i:ix,ch:letrasJ()[ix],d:(k+1)/(J.c.length+1)*dist*0.9})),
    escudos:ef.includes('risada')?1:0,fogoSempre:ef.includes('fogo'),
    filaAvisos:['PEGUE AS LETRAS DA FRASE!',...ef.map(k=>EFEITOS[k])]});
  aplicaCanal();
}
async function telefoneConcluido(){
  const el=elosDe(tel.dados),i=el.length;
  if(telFim(tel.dados)||el.some(e=>e.de===fb.uid)||(telOrdem(tel.dados)&&telDaVez(tel.dados)!==fb.uid)){await fb.api.telSoltaVez(tel.tid).catch(()=>{});toast('Essa roda já recebeu sua vez (ou acabou).');return telLobby()}
  const elo={de:fb.uid,nome:ls.get('entrega_nome','Jogador').slice(0,12),recebeu:(tel.prev||'').slice(0,80),txt:J.txt.slice(0,80),vis:textoEstragado().slice(0,80),pct:pctInteiro(),t:Date.now()};if(st.cv)elo.canal=st.cv.id;
  const pts=Math.round((200+st.vidas*120+st.pegos*30+st.letrasPegas*15)*multCanal());
  try{await fb.api.telElo(tel.tid,chaveElo(i),elo);await fb.api.telSoltaVez(tel.tid).catch(()=>{});
    const total=(telOrdem(tel.dados)||[]).length||tel.dados.info.max;
    if(i+1>=total)await fb.api.telEncerra(tel.tid).catch(()=>{});
    if(!telOrdem(tel.dados))lobbyAtualizaTel(tel.tid,i+1,tel.dados.info.max,tel.dados.info.criador===fb.uid);
    ganhaPontos(pts,elo.pct);toast('✓✓ Passou adiante! '+elo.pct+'% inteira');telLobby()}
  catch(e){painel(`<div class="grande">⚠️</div><h2 class="ruim">Não consegui salvar sua vez</h2><p>Pode ser a internet, ou alguém jogou na mesma hora.</p><button data-a="telLobby">VOLTAR PRA RODA</button>`)}
}
function telaTelPerdeu(motivo){
  painel(`<div class="grande">⚠️</div><h2 class="ruim">A frase se perdeu!</h2><p>${motivo==='sinal'?'O sinal acabou':'Ela foi corrompida'} no caminho.</p>
    <button data-a="telDeNovo">🔁 TENTAR DE NOVO</button><button class="sec" data-a="telDesiste">DESISTIR DA VEZ</button>`);
}
// ---------- revelação (canvas) ----------
const VW=720,VH=1280,T_INTRO=2.6,T_ELO=3.8,T_FIM=6.6;let revTema=null,narracao=ls.get('entrega_narra','1')==='1';
function duracaoRev(el){return T_INTRO+el.length*T_ELO+T_FIM}
function quebraLinhas(g,parts,maxW){
  const linhas=[[]];let w=0;const pal=[];let cur=[];
  for(const p of parts){if(p===' '){if(cur.length)pal.push(cur);pal.push([' ']);cur=[]}else cur.push(p)}if(cur.length)pal.push(cur);
  for(const wd of pal){const ww=g.measureText(wd.join('')).width;
    if(wd[0]===' '){if(linhas.at(-1).length){linhas.at(-1).push(' ');w+=g.measureText(' ').width}continue}
    if(w+ww>maxW&&linhas.at(-1).length){while(linhas.at(-1).at(-1)===' ')linhas.at(-1).pop();linhas.push([]);w=0}
    linhas.at(-1).push(...wd);w+=ww}
  return linhas}
function alturaFrase(g,parts,maxW,tam){g.font=`800 ${tam}px "Baloo 2", system-ui, sans-serif`;return quebraLinhas(g,parts,maxW).length*tam*1.25}
function fraseColorida(g,parts,corDe,cx,yTopo,maxW,tam,mostrar=parts.length){
  g.save();g.font=`800 ${tam}px "Baloo 2", system-ui, sans-serif`;g.textBaseline='middle';g.textAlign='left';
  const linhas=quebraLinhas(g,parts,maxW);let idx=0;const lh=tam*1.25;
  linhas.forEach((ln,li)=>{let x=cx-g.measureText(ln.join('')).width/2;
    for(const p of ln){while(idx<parts.length&&parts[idx]!==p)idx++;
      if(idx<mostrar){g.fillStyle=corDe(idx);g.fillText(p,x,yTopo+lh/2+li*lh)}x+=g.measureText(p).width;idx++}});
  g.restore();return linhas.length*lh}
function rotulo(g,txt,y,cor='#bfc8ee',tam=30){g.save();g.textAlign='center';g.textBaseline='middle';g.fillStyle=cor;g.font=`700 ${tam}px "Baloo 2", system-ui`;g.fillText(txt,VW/2,y);g.restore()}
function rrect(g,x,y,w,h,r){g.beginPath();g.roundRect(x,y,w,h,r)}
function desenhaRevelacao(g,t,el){
  const n=el.length,ease=x=>1-Math.pow(1-Math.max(0,Math.min(1,x)),3);
  const bg=g.createLinearGradient(0,0,0,VH);bg.addColorStop(0,'#241a5c');bg.addColorStop(1,'#0b1020');g.fillStyle=bg;g.fillRect(0,0,VW,VH);
  g.fillStyle='rgba(255,255,255,.05)';for(let i=0;i<14;i++){g.beginPath();g.arc((i*151+t*30)%VW,(i*263)%VH,40+(i%4)*25,0,7);g.fill()}
  g.textAlign='center';g.textBaseline='middle';g.fillStyle='#5cf0a8';g.font='800 46px "Baloo 2", system-ui';g.fillText('📞 TELEFONE SEM FIO',VW/2,90);
  // trilha de pessoas
  const passo=Math.min(80,(VW-80)/Math.max(1,n));const x0=VW/2-(n-1)*passo/2;
  const atual=Math.floor((t-T_INTRO)/T_ELO);
  el.forEach((e,i)=>{const x=x0+i*passo,ativo=i===atual,feito=t>T_INTRO+i*T_ELO;
    g.fillStyle=ativo?'#ffd24d':feito?'#5cf0a8':'#2f3d7a';g.beginPath();g.arc(x,160,ativo?28:22,0,7);g.fill();
    g.fillStyle='#0b1020';g.font='800 24px "Baloo 2", system-ui';g.fillText((e.nome||'?')[0].toUpperCase(),x,162);
    if(i<n-1){g.fillStyle='rgba(255,255,255,.3)';g.fillRect(x+24,158,passo-48,4)}});
  if(t<T_INTRO){const a=ease(t/.6);g.globalAlpha=a;
    g.fillStyle='#fff';g.font='800 60px "Baloo 2", system-ui';g.fillText(n+' pessoas',VW/2,520);g.fillText('1 frase',VW/2,600);
    g.font='600 34px "Baloo 2", system-ui';g.fillStyle='#bfc8ee';g.fillText('cada uma entregou jogando…',VW/2,690);
    if(revTema&&revTema.id!=='livre'){g.fillStyle='#ffd24d';g.font='800 40px "Baloo 2", system-ui';g.fillText('tema: '+revTema.e+' '+revTema.n,VW/2,420)}
    desenhaEnvelope(g,VW/2,880+Math.sin(t*5)*18,{cor:CORES_ENV[0],rastro:'padrao',cara:'feliz'},t,{esc:3.4,rot:Math.sin(t*3)*.1});g.globalAlpha=1;return}
  if(atual<n){const e=el[atual],u=t-T_INTRO-atual*T_ELO,entra=ease(u/.45),sai=u>T_ELO-.35?1-ease((u-(T_ELO-.35))/.35):1;
    g.save();g.globalAlpha=Math.min(entra,sai);g.translate((1-entra)*120,0);
    g.fillStyle='rgba(255,255,255,.08)';rrect(g,40,240,VW-80,860,36);g.fill();
    g.fillStyle='#ffd24d';g.font='800 44px "Baloo 2", system-ui';g.fillText(`${atual+1}. ${e.nome}`,VW/2,302);
    if(e.canal&&canalDe(e.canal))rotulo(g,'via '+canalDe(e.canal).e+' '+canalDe(e.canal).n,346,'#8f9ad0',26);
    let y=392;
    if(atual>0&&e.recebeu){rotulo(g,'recebeu assim:',y);y+=30;
      const pr=partes(e.recebeu);y+=fraseColorida(g,pr,i=>pr[i]==='_'?'#ff6b8a':'#8f9ad0',VW/2,y,VW-140,40)+40;
      rotulo(g,'entendeu e escreveu:',y);y+=30}
    else{rotulo(g,'começou com:',y);y+=30}
    const pt=partes(e.txt),pv=partes(e.vis),estraga=ease((u-1.7)/.7);
    const mostrar=Math.floor(Math.min(1,u/1.2)*pt.length);
    const cor=i=>(pv[i]==='_'&&estraga>0)?'#ff4d6d':'#ffffff';
    const alvo=pt.map((p,i)=>(pv[i]==='_'&&estraga>=1)?'_':p);
    y+=fraseColorida(g,alvo,cor,VW/2,y,VW-140,54,mostrar)+50;
    if(u>1.7){g.globalAlpha*=ease((u-1.7)/.5);rotulo(g,e.pct>=100?'✓✓ chegou inteira!':`💥 chegou ${e.pct}% inteira`,Math.min(y,1060),'#ff9ad5',34)}
    g.restore();
    const vx=VW/2+(u>T_ELO-.6?ease((u-(T_ELO-.6))/.6)*500:0);
    desenhaEnvelope(g,vx,1170+Math.sin(t*6)*8,{cor:CORES_ENV[0],rastro:'padrao',cara:'feliz'},t,{esc:2});
    return}
  // final
  const u=t-T_INTRO-n*T_ELO,a=ease(u/.5);g.globalAlpha=a;
  let y=260;rotulo(g,'COMEÇOU ASSIM:',y,'#bfc8ee',34);y+=34;
  const p0=partes(el[0].txt);y+=fraseColorida(g,p0,()=>'#5cf0a8',VW/2,y,VW-120,48)+50;
  rotulo(g,'TERMINOU ASSIM:',y,'#bfc8ee',34);y+=34;
  const pf=partes(el[n-1].vis),hf=alturaFrase(g,pf,VW-120,58),ur=u-1.3;
  if(ur<0){const k=Math.floor(u/.4);g.save();g.textAlign='center';g.textBaseline='middle';g.fillStyle='#ffd24d';g.font='800 '+(90+k*30)+'px "Baloo 2", system-ui';g.fillText('?'.repeat(Math.min(3,k+1)),VW/2,y+hf/2);g.restore();y+=hf}
  else{const pop=1+Math.max(0,.35-ur*.25)*Math.sin(ur*20);
    g.save();g.translate(VW/2,y+hf/2);g.scale(pop,pop);fraseColorida(g,pf,i=>pf[i]==='_'?'#ff6b8a':'#ff9ad5',0,-hf/2,VW-120,58);g.restore();y+=hf;
    g.save();g.textAlign='center';g.textBaseline='middle';g.font='130px serif';g.globalAlpha*=ease(ur/.4);g.fillText('🤣',VW/2,Math.max(y+110,860)+Math.sin(u*6)*12);g.restore()}
  rotulo(g,'Jogue com seus amigos:',1110,'#ffffff',34);rotulo(g,'luiscodemaster.github.io/entrega',1160,'#5cf0a8',32);
  g.globalAlpha=1;
}
let revRaf=null,revT0=0,videoBlob=null,gravando=false,revSom=null,revFalas=[];
function parReveal(){if(revRaf)cancelAnimationFrame(revRaf);revRaf=null;if(revSom){try{revSom.disconnect()}catch(e){}revSom=null}
  revFalas.forEach(clearTimeout);revFalas=[];if(window.speechSynthesis)speechSynthesis.cancel()}
const VOZES=[220,300,180,260,340,200,280,240];
function agendaRevelacao(dest,T0,el){
  const n=el.length,dur=duracaoRev(el),cfg=MUSICAS.reveal,sp=60/cfg.bpm/4,bed=AU.ctx.createGain();bed.gain.value=.85;bed.connect(dest);
  for(let p=0,t=T0;t<T0+dur-T_FIM+1.1;p++,t+=sp)tocaPasso(cfg,p,t,bed,.8);
  tom(dest,T0+.1,mf(79),.3,'triangle',.2);tom(dest,T0+.25,mf(84),.5,'triangle',.2);
  el.forEach((e,i)=>{const s=T0+T_INTRO+i*T_ELO;ruido(dest,s,.4,.12,300,'bandpass',3000);
    vozRobo(dest,s+.05,e.txt,VOZES[i%8],1.2);
    const pv=partes(e.vis),cor=pv.map((p,k)=>p==='_'?k:-1).filter(k=>k>=0);
    cor.forEach((k,j)=>tom(dest,s+1.7+j/Math.max(1,cor.length)*.6,mf(70-(j%5)),.08,'sawtooth',.06,mf(50)));
    if(e.pct>=100)[76,79,84].forEach((m,j)=>tom(dest,s+2.4+j*.07,mf(m),.2,'square',.08));else tom(dest,s+2.4,300,.35,'triangle',.15,120);
    ruido(dest,s+T_ELO-.6,.5,.1,500,'bandpass',4000)});
  const F=T0+T_INTRO+n*T_ELO;
  [0,.4,.8].forEach(x=>bumbo(dest,F+.05+x,.8));
  ruido(dest,F+1.3,1.4,.3,6000,'highpass');bumbo(dest,F+1.3,.9);
  [72,76,79,84,88,91].forEach((m,j)=>tom(dest,F+1.35+j*.07,mf(m),.35,'square',.08));
  vozRobo(dest,F+1.9,el[n-1].vis,150,Math.min(3.2,.09*partes(el[n-1].vis).length));
  return bed}
function falar(txt,vel=1.05){if(!window.speechSynthesis||AU.mudo)return;const u=new SpeechSynthesisUtterance(txt.replace(/_+/g,' ').replace(/\s+/g,' '));
  u.lang=LOCALE;u.rate=vel;u.pitch=.55;speechSynthesis.speak(u)}
function agendaNarracao(el){
  if(!narracao)return;el.forEach((e,i)=>{revFalas.push(setTimeout(()=>falar(e.nome+': '+e.vis),(T_INTRO+i*T_ELO+2.0)*1000))});
  const F=T_INTRO+el.length*T_ELO;revFalas.push(setTimeout(()=>falar('Começou assim: '+el[0].txt,1.15),(F-.1)*1000));
  revFalas.push(setTimeout(()=>falar('Terminou assim: '+el[el.length-1].vis,.95),(F+1.6)*1000))}
function telaRevelacao(){
  tel.tela='reveal';const el=elosReais(tel.dados);if(!el.length)return telLobby();
  painel(`<canvas id="revCv" width="${VW}" height="${VH}" style="width:100%;max-width:300px;aspect-ratio:9/16;border-radius:16px;display:block;margin:0 auto 8px"></canvas>
    <div id="revBtns"><button data-a="telVideo">🎬 GERAR VÍDEO PRO SHORT</button></div>
    <button class="rosa" data-a="telMural">📊 PUBLICAR NO MURAL</button>
    <button class="sec" data-a="telNarra">🗣️ Narração: ${narracao?'ligada':'desligada'}</button>
    <p class="dica">O vídeo sai com música, efeitos e a voz de robô. A narração em voz real só toca aqui na tela; pra ter ela no vídeo, use a gravação de tela.</p>
    <div class="erro" id="erro"></div>
    <button class="sec" data-a="telReveal">🔁 VER DE NOVO</button><button class="sec" data-a="telLobby">VOLTAR</button>`);
  parReveal();revTema=temaDe(tel.dados.info&&tel.dados.info.tema);revT0=performance.now();const dur=duracaoRev(el);
  if(AU.ctx&&!AU.mudo){revSom=AU.ctx.createGain();revSom.connect(AU.master);agendaRevelacao(revSom,AU.ctx.currentTime+.05,el)}
  agendaNarracao(el);
  const f=()=>{const c=$('revCv');if(!c||tel.tela!=='reveal'){revRaf=null;return}
    const t=Math.min(dur,(performance.now()-revT0)/1000);desenhaRevelacao(c.getContext('2d'),t,el);revRaf=requestAnimationFrame(f)};f();
}
function tipoVideo(){const MR=window.MediaRecorder;if(!MR)return null;
  for(const tp of ['video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/mp4','video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'])if(MR.isTypeSupported&&MR.isTypeSupported(tp))return tp;return ''}
async function gravaVideo(){
  if(gravando)return;const tp=tipoVideo();
  const cvTest=document.createElement('canvas');
  if(tp==null||!cvTest.captureStream)return erro('Seu navegador não consegue gravar vídeo. Use a gravação de tela do celular enquanto a revelação passa.');
  const el=elosReais(tel.dados),dur=duracaoRev(el),c=document.createElement('canvas');c.width=VW;c.height=VH;const g=c.getContext('2d');
  parReveal();auInit();let stream=c.captureStream(30),somG=null;
  if(AU.ctx&&AU.ctx.createMediaStreamDestination){if(AU.ctx.state==='suspended')await AU.ctx.resume();
    const dst=AU.ctx.createMediaStreamDestination();somG=AU.ctx.createGain();somG.connect(dst);if(!AU.mudo)somG.connect(AU.master);
    stream=new MediaStream([...stream.getVideoTracks(),...dst.stream.getAudioTracks()])}
  const rec=new MediaRecorder(stream,tp?{mimeType:tp,videoBitsPerSecond:4e6}:{videoBitsPerSecond:4e6}),pedacos=[];
  rec.ondataavailable=e=>{if(e.data.size)pedacos.push(e.data)};
  gravando=true;const box=$('revBtns');
  const fim=new Promise(r=>rec.onstop=r);rec.start(500);const t0=performance.now();
  if(somG)agendaRevelacao(somG,AU.ctx.currentTime+.02,el);const prev=$('revCv');
  await new Promise(res=>{const f=()=>{const t=(performance.now()-t0)/1000;desenhaRevelacao(g,Math.min(t,dur),el);if(prev)prev.getContext('2d').drawImage(c,0,0);
    if(box)box.innerHTML=`<p>🎬 Gravando… ${Math.min(100,Math.round(t/dur*100))}%</p>`;
    if(t>=dur+.4)res();else requestAnimationFrame(f)};f()});
  rec.stop();await fim;gravando=false;if(somG)setTimeout(()=>{try{somG.disconnect()}catch(e){}},300);
  videoBlob=new Blob(pedacos,{type:(rec.mimeType||tp||'video/webm').split(';')[0]});
  const ext=videoBlob.type.includes('mp4')?'mp4':'webm';videoBlob.nome='entrega-telefone-sem-fio.'+ext;
  const podeShare=navigator.canShare&&navigator.canShare({files:[new File([videoBlob],videoBlob.nome,{type:videoBlob.type})]});
  if($('revBtns'))$('revBtns').innerHTML=`<p class="ok">✅ Vídeo pronto (${(videoBlob.size/1048576).toFixed(1)} MB, ${ext.toUpperCase()})</p>
    ${podeShare?'<button data-a="telShare">📤 COMPARTILHAR (YouTube, WhatsApp…)</button>':''}<button class="${podeShare?'sec':''}" data-a="telBaixar">⬇️ BAIXAR VÍDEO</button>
    <p class="dica">O vídeo já tem música e efeitos. Se for usar a narração real, grave a tela.</p>`;
}
function baixaVideo(){if(!videoBlob)return;const a=document.createElement('a');a.href=URL.createObjectURL(videoBlob);a.download=videoBlob.nome;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),60000)}
async function compartilhaVideo(){if(!videoBlob)return;
  try{await navigator.share({files:[new File([videoBlob],videoBlob.nome,{type:videoBlob.type})],title:'Telefone Sem Fio no ENTREGA!',text:'Olha como a frase terminou 🤣 #shorts'})}catch(e){if(e.name!=='AbortError')baixaVideo()}}
