// ================= TEMAS DA RODADA =================
const TEMAS=[
 {id:'livre',e:'🎲',n:'Livre',ex:['o cachorro do vizinho comeu meu tênis','minha tia caiu da bicicleta rindo','o pastel de feira saiu voando']},
 {id:'fofoca',e:'🤫',n:'Fofoca',ex:['a vizinha do 302 casou escondida com o porteiro','o professor de história tem um canal de dança','dizem que o padeiro é milionário e não conta']},
 {id:'noticia',e:'🗞️',n:'Notícia de jornal',ex:['cientistas descobrem que gatos sabem fazer pix','prefeitura troca semáforos por buzinas gigantes','homem vence campeonato de soneca no sofá']},
 {id:'vilao',e:'😈',n:'Frase de vilão',ex:['vocês nunca vão encontrar o controle remoto','eu escondi todas as meias esquerdas do mundo','hoje à noite o wi-fi será meu']},
 {id:'casamento',e:'💍',n:'Pedido de casamento',ex:['quer dividir comigo a última coxinha da vida','casa comigo e eu lavo a louça pra sempre','meu coração tem senha e você é a senha']},
 {id:'vo',e:'👵',n:'Conselho de vó',ex:['nunca saia de casa sem um casaco e uma banana','come que tá magrinho demais menino','quem dorme cedo acorda com o galo cantando']},
 {id:'desculpa',e:'🙈',n:'Desculpa esfarrapada',ex:['não fiz a lição porque meu peixe comeu o caderno','cheguei atrasado porque o elevador ficou tímido','não respondi porque meu celular estava de férias']}];
const temaDe=id=>TEMAS.find(t=>t.id===id)||TEMAS[0];
let telTema='livre';
