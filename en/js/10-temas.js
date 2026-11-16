// ================= TEMAS DA RODADA =================
const TEMAS=[
 {id:'livre',e:'🎲',n:'Free',ex:['the neighbor dog ate my sneakers','my aunt fell off her bike laughing','the street market pastry flew away']},
 {id:'fofoca',e:'🤫',n:'Gossip',ex:['the lady in 302 secretly married the doorman','the history teacher has a dance channel','they say the baker is a millionaire and hides it']},
 {id:'noticia',e:'🗞️',n:'News headline',ex:['scientists discover cats can do online banking','city replaces traffic lights with giant horns','man wins national couch napping championship']},
 {id:'vilao',e:'😈',n:'Villain line',ex:['you will never find the remote control','i hid every left sock in the world','tonight the wi-fi will be mine']},
 {id:'casamento',e:'💍',n:'Marriage proposal',ex:['will you share the last slice of pizza with me forever','marry me and i will do the dishes for life','my heart has a password and you are the password']},
 {id:'vo',e:'👵',n:'Grandma advice',ex:['never leave home without a coat and a banana','eat something you are way too skinny','early to bed means waking up with the rooster']},
 {id:'desculpa',e:'🙈',n:'Lame excuse',ex:['my fish ate my homework notebook','i was late because the elevator got shy','i did not reply because my phone was on vacation']}];
const temaDe=id=>TEMAS.find(t=>t.id===id)||TEMAS[0];
let telTema='livre';
