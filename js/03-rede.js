// ================= REDE (online) =================
const net={peer:null,conn:null,role:null,sala:null,ok:false,meuNome:'',outroNome:'',piloto:'host',souPiloto:false,snapT:0};
const SALA_PREFIXO='entrega-msg-sala-';
function novoCodigoSala(){const L='ABCDEFGHJKLMNPQRSTUVWXYZ';let s='';for(let i=0;i<4;i++)s+=L[Math.floor(R()*L.length)];return s}
function redeDisponivel(){return typeof Peer!=='undefined'&&!NO_CLAUDE}
function fechaRede(){lobbyTiraOnline();try{net.conn&&net.conn.close()}catch(e){}try{net.peer&&net.peer.destroy()}catch(e){}Object.assign(net,{peer:null,conn:null,role:null,sala:null,ok:false})}
function criarSala(tent=0){
  fechaRede();net.role='host';net.sala=novoCodigoSala();
  const p=new Peer(SALA_PREFIXO+net.sala);net.peer=p;
  p.on('open',()=>telaSalaCriada());
  p.on('connection',c=>{if(net.conn){c.close();return}ligaConexao(c)});
  p.on('error',e=>{if(e.type==='unavailable-id'&&tent<5)return criarSala(tent+1);erroRede(e)});
  p.on('disconnected',()=>{try{p.reconnect()}catch(e){}});
}
function entrarSala(cod){
  fechaRede();net.role='guest';net.sala=cod;
  const p=new Peer();net.peer=p;
  p.on('open',()=>{const c=p.connect(SALA_PREFIXO+cod,{reliable:true});ligaConexao(c);
    setTimeout(()=>{if(!net.ok&&net.role==='guest'){erro('Não achei a sala '+cod+'. Confira o código e se seu amigo está com a sala aberta.')}},9000)});
  p.on('error',e=>{if(e.type==='peer-unavailable')return erro('Sala '+cod+' não encontrada. Confira o código.');erroRede(e)});
}
function ligaConexao(c){
  net.conn=c;
  c.on('open',()=>{net.ok=true;envia({t:'oi',nome:net.meuNome})});
  c.on('data',recebe);
  c.on('close',()=>{if(net.ok){net.ok=false;conexaoCaiu()}});
  c.on('error',()=>{});
}
function envia(o){try{if(net.conn&&net.conn.open)net.conn.send(o)}catch(e){}}
function erroRede(e){const msg={network:'Sem internet ou servidor de salas fora do ar.','browser-incompatible':'Este navegador não suporta o modo online.','server-error':'Servidor de salas fora do ar, tente de novo.'}[e.type]||('Erro de conexão ('+e.type+').');erro(msg)}
function conexaoCaiu(){
  if(modo==='online'){st.estado='fim';mostraCtrl()}
  painel(`<div class="grande">📵</div><h2 class="ruim">Conexão perdida</h2><p>Perdemos a ligação com ${esc(net.outroNome||'seu amigo')}.</p><button data-a="menu">MENU</button>`);
}
function recebe(m){
  if(m.t==='oi'){net.outroNome=m.nome||'Amigo';if(net.role==='host')lobbyTiraOnline();if(net.role==='host')telaLobbyHost();else telaLobbyGuest();return}
  if(m.t==='lobby'){if(net.role==='guest')telaLobbyGuest(m);return}
  if(m.t==='start'){J=m.J;comecaOnline(m.piloto);return}
  if(m.t==='s'){if(!net.souPiloto&&modo==='online')aplicaSnap(m.d);return}
  if(m.t==='ping'&&net.souPiloto&&st){st.pings.push({x:m.x,y:m.y,v:1.6});return}
  if(m.t==='cmd'&&net.souPiloto&&st){st.cmd={txt:m.txt,v:1.3};return}
  if(m.t==='luz'&&net.souPiloto&&st){st.luz=1.5;return}
  if(m.t==='fim'){J=m.J;if(!net.souPiloto){st.estado='fim';mostraCtrl();
    if(!m.ok)telaOnlinePerdeu(m.motivo);else if(J.pos>=ROTAS[J.rota].length)telaOnlineChegou();else telaOnlineFaseOk(m.chefe)}return}
  if(m.t==='palpite'){if(net.role==='host'){J.resultado={palpite:m.palpite,p:m.p};telaResultado(m.palpite,true)}return}
  if(m.t==='sala'){voltaSala();return}
}
