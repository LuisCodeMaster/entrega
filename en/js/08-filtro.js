// ================= FILTRO DE PALAVRÕES =================
// Lista usada só pra censurar. Palavras curtas comparam a palavra inteira; as outras, o começo da palavra.
const PALAVROES_PREFIXO=['porr','caralh','buceta','boceta','piroca','merda','bosta','putaria','arrombad','cuzao','vagabund','xoxota','xereca','punheta','siririca','viadinh','traveco','retardad','estupr','fuck','fuk','shitt','bitch','cunt','pussy','asshole','bastard','slut','whore','nigg','fagg','motherf','fudid','fodid','fuder','foder','desgracad'];
const PALAVROES_EXATOS=['cu','cus','puta','putas','puto','putos','foda','fodas','fode','fodeu','fudeu','viado','viados','bicha','bichas','sapatao','mongol','pqp','vsf','fdp','tnc','vtnc','krl','crl','shit','dick','dicks','cock','cocks','fag','fags','twat','prick'];
function normPalavra(w){return w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')
  .replace(/[4@]/g,'a').replace(/3/g,'e').replace(/[1!|]/g,'i').replace(/0/g,'o').replace(/[5$]/g,'s').replace(/7/g,'t')
  .replace(/[^a-z]/g,'').replace(/(.)\1{2,}/g,'$1$1')}
const junta=w=>w.replace(/(.)\1+/g,'$1'),temDobro=w=>/(.)\1/.test(w);
const _pref=PALAVROES_PREFIXO.map(normPalavra),_exat=new Set(PALAVROES_EXATOS.map(w=>junta(normPalavra(w))));
function ehPalavrao(w){const n=normPalavra(w);if(!n)return false;const j=junta(n);if(_exat.has(j))return true;
  return _pref.some(p=>n.startsWith(p)||(!temDobro(p)&&j.startsWith(p)))}
function limpaTexto(t){
  if(!t)return t;let mudou=false;
  const out=String(t).split(/(\s+)/).map(seg=>{if(!seg.trim()||!ehPalavrao(seg))return seg;mudou=true;
    const ps=partes(seg);let primeira=true;return ps.map(p=>{if(!/[\p{L}\p{N}@$!|]/u.test(p))return p;if(primeira){primeira=false;return p}return '✱'}).join('')}).join('');
  limpaTexto.mudou=mudou;return out}
function limpaEntrada(t){const r=limpaTexto(t);if(limpaTexto.mudou)toast('✱ Swear word censored');return r}
function limpaObj(o,campos){if(!o)return o;const c={...o};for(const k of campos)if(typeof c[k]==='string')c[k]=limpaTexto(c[k]);return c}
