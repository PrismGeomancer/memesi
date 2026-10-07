(() => {
  'use strict';
  const D=window.MEMESI_DATA;
  const KEY='memesi_demo_v3';
  const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
  const initial={round:D.currentRound,submissions:D.submissions.map(x=>({...x})),words:D.platform.words,memes:D.platform.memes,online:D.platform.online,sound:false,generated:[],activities:[]};
  let state;
  try { state={...initial,...JSON.parse(localStorage.getItem(KEY)||'{}')}; } catch(e){state={...initial};}
  state.submissions=(state.submissions||initial.submissions).map(x=>({...x,score:Number(x.score)}));
  const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const toast=(msg)=>{const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),1800)};

  // Crude scene painter: every archive scene has a distinct arrangement and prop language.
  const P={bg:'#11110f',cream:'#f3e9d2',acid:'#b6ff4a',green:'#6f9f3d',orange:'#ff8a35',red:'#ff4d4d',gray:'#77776f',blue:'#41536b'};
  function paint(canvas,scene,caption=''){
    const c=canvas.getContext('2d'); const w=canvas.width,h=canvas.height; c.imageSmoothingEnabled=false;
    const seed=[...scene].reduce((a,ch)=>a+ch.charCodeAt(0),0); const q=(x,y,ww,hh,col)=>{c.fillStyle=col;c.fillRect(x|0,y|0,ww|0,hh|0)};
    const line=(x1,y1,x2,y2,col,lw=3)=>{c.strokeStyle=col;c.lineWidth=lw;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke()};
    const text=(t,x,y,size=10,col=P.cream,align='left')=>{c.fillStyle=col;c.font=`bold ${size}px monospace`;c.textAlign=align;c.fillText(t,x,y)};
    const face=(x,y,col=P.orange,mood='flat')=>{q(x,y,34,30,col);q(x+7,y+8,5,6,P.bg);q(x+23,y+8,5,6,P.bg);q(x+10,y+21,mood==='sad'?14:14,3,P.bg);if(mood==='sad'){q(x+9,y+18,3,3,P.bg);q(x+23,y+18,3,3,P.bg)}};
    q(0,0,w,h,['#101820','#221813','#162016','#1f171f'][seed%4]);
    for(let y=0;y<h;y+=8) q(0,y,w,1,'#ffffff0b');
    const floor=()=>{q(0,h*.72,w,h*.28,'#24241f');for(let x=0;x<w;x+=28)line(x,h*.72,x-20,h,'#38382f',1);line(0,h*.72,w,h*.72,P.gray,2)};
    const monitor=(x,y,ww=54,hh=42)=>{q(x,y,ww,hh,P.cream);q(x+5,y+5,ww-10,hh-12,'#172515');line(x+10,y+hh-18,x+ww-12,y+12,P.red,3);q(x+ww*.38,y+hh,ww*.24,7,P.gray)};
    const chart=(x,y,ww,hh,col=P.acid)=>{line(x,y+hh,x+ww*.2,y+hh*.7,col,4);line(x+ww*.2,y+hh*.7,x+ww*.45,y+hh*.8,col,4);line(x+ww*.45,y+hh*.8,x+ww*.62,y+hh*.2,col,4);line(x+ww*.62,y+hh*.2,x+ww,y,col,4)};
    floor();
    switch(scene){
      case'office':q(18,16,88,28,P.gray);text('UNEMPLOYMENT',62,34,8,P.bg,'center');face(42,54,P.cream,'sad');q(23,86,78,10,P.orange);monitor(116,50,70,52);q(110,105,92,10,P.gray);text('APPLY',61,110,8,P.red,'center');break;
      case'bedroom':q(12,30,63,74,P.blue);q(18,72,50,26,P.cream);face(105,50,P.orange,'sad');q(108,83,28,34,P.blue);q(148,66,43,58,P.red);face(153,71,P.cream);q(117,91,15,13,P.acid);text('MOM',170,120,8,P.bg,'center');break;
      case'kebab':q(0,25,w,18,P.red);text('LIQUIDATED',w/2,39,11,P.cream,'center');face(42,69,P.orange);q(34,99,50,24,P.cream);q(113,52,17,60,P.orange);q(108,54,27,6,P.green);q(103,112,37,7,P.cream);text('KEBAB',59,116,8,P.bg,'center');break;
      case'casino':q(14,18,70,20,P.orange);text('CASINO',49,33,10,P.bg,'center');q(20,91,160,48,P.green);face(56,52,P.orange,'sad');face(134,48,P.cream);q(86,104,14,10,P.acid);q(101,110,8,8,P.red);q(112,102,9,9,P.cream);break;
      case'nightshop':q(0,0,w,24,P.blue);text('OPEN 24H',w/2,18,9,P.acid,'center');face(27,58,P.green,'sad');q(20,88,54,35,P.gray);monitor(110,47,73,55);chart(119,58,53,28);q(0,125,w,12,P.orange);break;
      case'monitors':for(let i=0;i<6;i++)monitor(10+(i%3)*67,18+Math.floor(i/3)*58,59,42);face(88,104,P.gray);q(77,131,58,13,P.cream);break;
      case'dungeon':q(0,20,w,9,P.gray);for(let x=15;x<w;x+=45){q(x,29,11,80,P.gray);q(x-6,25,23,9,P.gray)}face(82,64,P.cream,'sad');q(72,94,52,42,P.blue);q(130,73,13,55,P.orange);text('DEBT',101,120,9,P.red,'center');break;
      case'candle':q(16,83,96,55,P.cream);q(44,50,42,35,P.red);q(58,103,15,35,P.gray);q(138,17,34,117,P.acid);q(127,34,11,100,P.green);q(172,7,10,127,P.green);text('↑',155,30,18,P.bg,'center');break;
      case'briefcase':face(81,35,P.cream);q(65,66,64,57,P.blue);q(40,92,120,45,P.orange);q(48,100,104,30,P.bg);text('MEME',100,121,15,P.acid,'center');q(76,85,48,7,P.cream);break;
      case'garage':q(0,12,w,16,P.gray);q(19,31,7,90,P.gray);q(174,31,7,90,P.gray);q(35,87,132,31,P.red);q(54,71,78,22,P.red);q(48,112,24,18,P.bg);q(132,112,24,18,P.bg);text('LAMBO?',101,107,9,P.cream,'center');break;
      case'printer':face(25,56,P.orange);q(19,86,50,34,P.cream);q(108,52,73,55,P.gray);q(119,28,51,42,P.cream);text('TAX',145,50,10,P.red,'center');for(let i=0;i<4;i++)q(119+i*8,112+i*4,52-i*12,4,P.cream);break;
      case'pizza':q(20,55,90,62,P.orange);q(28,64,74,44,P.cream);text('PIZZA',65,91,12,P.red,'center');q(145,22,8,9,P.acid);q(132,35,34,5,P.acid);q(120,49,57,5,P.acid);text('WIFI',148,72,8,P.acid,'center');break;
      case'coffee':q(29,72,54,45,P.cream);q(81,81,20,26,P.cream);for(let i=0;i<3;i++)line(43+i*12,67,50+i*12,44,P.gray,2);monitor(117,36,72,56);chart(125,50,55,25,P.red);text('3:00',151,116,10,P.orange,'center');break;
      case'button':face(39,45,P.cream,'sad');q(31,77,51,55,P.blue);q(120,62,62,62,P.red);q(128,70,46,46,'#a01717');text('SELL',151,98,10,P.cream,'center');q(87,80,22,12,P.orange);line(98,86,126,86,P.orange,5);break;
      case'grocery':q(18,71,91,42,P.gray);q(26,113,10,10,P.cream);q(88,113,10,10,P.cream);q(38,76,34,28,P.orange);q(75,81,25,23,P.acid);q(129,26,49,49,P.cream);q(137,34,33,33,P.bg);line(112,76,153,48,P.orange,4);break;
      case'mod':monitor(18,39,83,63);face(123,48,P.cream,'sad');q(113,79,56,48,P.gray);q(174,44,10,70,P.orange);q(161,38,36,20,P.orange);text('BAN',59,75,10,P.red,'center');break;
      case'bridge':q(0,92,w,13,P.gray);for(let x=5;x<w;x+=22)q(x,105,12,16,P.orange);face(55,54,P.cream);q(48,82,49,18,P.cream);q(108,58,42,48,P.gray);text('FEE',129,86,8,P.red,'center');line(0,137,w,137,P.blue,7);break;
      case'interview':q(20,87,160,16,P.orange);face(42,41,P.cream);face(127,41,P.cream);q(36,72,49,28,P.blue);q(121,72,49,28,P.blue);q(87,76,28,18,P.cream);text('CV',101,90,8,P.bg,'center');break;
      case'vampire':q(17,21,54,92,P.red);face(27,38,P.cream);q(23,68,44,50,P.bg);q(123,46,16,64,P.cream);q(99,68,64,16,P.cream);chart(91,43,88,70,P.acid);break;
      case'microwave':q(29,39,145,83,P.gray);q(39,49,96,63,P.bg);q(142,52,19,19,P.orange);q(142,82,19,19,P.orange);face(67,68,P.orange,'sad');for(let x=43;x<132;x+=7)q(x,55,3,3,P.acid);text('ALPHA',87,106,8,P.acid,'center');break;
      default:face(w/2-17,h/2-15,P.orange,'sad');text('MEME NOT FOUND',w/2,h-17,9,P.red,'center');
    }
    for(let i=0;i<18;i++) q((seed*(i+3)*17)%w,(seed*(i+7)*11)%h,2,2,i%2?P.acid:P.red);
    if(caption){q(0,h-22,w,22,P.cream);text(caption.toUpperCase().slice(0,34),w/2,h-7,Math.max(7,Math.min(11,w/(caption.length*.72))),P.bg,'center')}
  }
  window.paintMeme=paint;
  $$('canvas[data-scene]').forEach(c=>paint(c,c.dataset.scene));

  function beep(type='click'){
    if(!state.sound)return; try{const A=window.AudioContext||window.webkitAudioContext;beep.ctx=beep.ctx||new A();const o=beep.ctx.createOscillator(),g=beep.ctx.createGain();o.type=type==='boost'?'square':'sawtooth';o.frequency.value={click:180,submit:440,boost:620,reveal:880,warning:110}[type]||220;g.gain.setValueAtTime(.06,beep.ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,beep.ctx.currentTime+.12);o.connect(g).connect(beep.ctx.destination);o.start();o.stop(beep.ctx.currentTime+.13)}catch(e){}
  }
  function updateStats(){$('#stat-memes').textContent=state.memes;$('#stat-words').textContent=state.words;$('#online-count').textContent=state.online;$('#watching-count').textContent=state.online;$('#round-num').textContent=String(state.round).padStart(3,'0')}
  function sorted(){return [...state.submissions].sort((a,b)=>b.score-a.score)}
  function renderBoard(bump=''){
    const list=$('#leaderboard');const arr=sorted();list.innerHTML=arr.map((s,i)=>`<li class="${i<3?'top ':''}${s.word===bump?'bump':''}" data-word="${esc(s.word)}"><span class="rank">${String(i+1).padStart(2,'0')}</span><span class="word">${esc(s.word)}</span><span class="score">${s.score}</span><button class="boost" data-word="${esc(s.word)}">BOOST</button></li>`).join('');
    $('#machine-inputs').innerHTML=arr.slice(0,3).map((s,i)=>`<div class="machine-input" data-slot="INPUT 0${i+1}"><span>${esc(s.word)}</span></div>`).join('');
    $$('.boost',list).forEach(btn=>btn.addEventListener('click',()=>boost(btn.dataset.word)));
  }
  function boost(word){const item=state.submissions.find(s=>s.word===word);if(!item)return;const before=sorted().findIndex(s=>s.word===word);const add=[7,12,18,24,42][Math.floor(Math.random()*5)];item.score+=add;const after=sorted().findIndex(s=>s.word===word);save();renderBoard(word);beep('boost');addActivity(`you boosted ${word} +${add}${after<before?' // RANK UP':''}`);toast(`${word} +${add}`)}
  function addActivity(msg){state.activities=(state.activities||[]).slice(-8);state.activities.push(msg);save();renderActivity()}
  function renderActivity(){const base=[...D.activities.slice(0,4),...(state.activities||[])].slice(-10);$('#activity-log').innerHTML=base.map(x=>`<p>${esc(x.replace('{online}',state.online))}</p>`).join('');$('#activity-log').scrollTop=9999}
  function submitWord(raw,source='you'){
    const word=String(raw||'').trim().toUpperCase().replace(/[^A-Z0-9 _-]/g,'').slice(0,24);const zone=$('.submit-zone');
    if(!word){toast('THE MACHINE NEEDS A WORD');return false}if(word==='RUG'){$('#submit-msg').textContent='SUBMISSION REJECTED. TOO REAL.';zone.classList.add('shake');setTimeout(()=>zone.classList.remove('shake'),600);beep('warning');return false}
    const existing=state.submissions.find(s=>s.word===word);if(existing){existing.score+=17;addActivity(`${source} found ${word} already inside. +17`)}else{const score=20+Math.floor(Math.random()*58);state.submissions.push({word,score,user:source});state.words++;addActivity(`new submission: ${word}`)}
    save();updateStats();renderBoard(word);beep('submit');$('#submit-msg').textContent=`ACCEPTED: ${word}. THE MACHINE REGRETS THIS.`;zone.classList.add('shake');setTimeout(()=>zone.classList.remove('shake'),600);toast(`${word} ENTERED THE PIT`);return true
  }
  $('#submit-form').addEventListener('submit',e=>{e.preventDefault();if(submitWord($('#word-input').value)){$('#word-input').value=''}});

  let seconds=D.countdownSeconds;
  function tick(){seconds--;if(seconds<=0){completeRound(true);seconds=D.countdownSeconds}const m=Math.floor(seconds/60),s=seconds%60;$('#countdown').textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;if(seconds<10)beep('warning')}
  setInterval(tick,1000);
  function generateScene(words){const all=D.rounds;const exact=all.find(r=>r.words.every(w=>words.includes(w)));return exact||all[(state.round+words.join('').length)%all.length]}
  function completeRound(auto=false){const top=sorted().slice(0,3),words=top.map(x=>x.word),result=generateScene(words),machine=$('#machine-panel'),process=$('#process'),btn=$('#generate-btn');if(machine.classList.contains('processing'))return;machine.classList.add('processing');btn.disabled=true;const lines=['READING INTERNET...','UNDERSTANDING HUMOR...','FAILED. TRYING AGAIN...','ADDING BRAINROT...','REMOVING CONTEXT...','MEME DETECTED.'];let i=0;const timer=setInterval(()=>{process.querySelector('span').textContent=lines[i];process.querySelector('i').style.width=`${12+i*17}%`;i++;if(i===lines.length){clearInterval(timer);setTimeout(()=>reveal(words,top,result,auto),350)}},430)}
  $('#generate-btn').addEventListener('click',()=>completeRound(false));
  function reveal(words,top,result,auto){const dialog=$('#reveal-modal');$('#reveal-content').innerHTML=`<p class="section-code">ROUND COMPLETE</p><h2>MEME #${String(state.round).padStart(3,'0')}</h2><div class="word-tags">${words.map(w=>`<span>${esc(w)}</span>`).join('')}</div><canvas id="reveal-canvas" width="480" height="340"></canvas><p class="caption">${esc(result.caption)}</p><p>CREATED FROM: ${words.map(esc).join(' + ')}</p><div class="reveal-actions"><button class="pixel-btn" id="save-meme">SAVE MEME</button><button class="pixel-btn" id="copy-link">COPY LINK</button><button class="pixel-btn primary" id="next-round">NEXT ROUND</button></div>`;
    const canvas=$('#reveal-canvas');paint(canvas,result.scene,result.caption);machineDone();dialog.showModal();beep('reveal');state.generated.push({round:state.round,words,scene:result.scene,caption:result.caption});state.memes++;save();updateStats();
    $('#save-meme').onclick=()=>{const a=document.createElement('a');a.download=`memesi-${state.round}.png`;a.href=canvas.toDataURL('image/png');a.click();toast('MEME SAVED. WHY?')};
    $('#copy-link').onclick=()=>copy(location.href.split('#')[0]+`#round-${state.round}`,'FAKE PERMALINK COPIED');
    $('#next-round').onclick=()=>{dialog.close();startNextRound()};
    if(auto)addActivity(`ROUND #${String(state.round).padStart(3,'0')} completed while nobody was ready`)
  }
  function machineDone(){const m=$('#machine-panel');m.classList.remove('processing');$('#generate-btn').disabled=false;$('#process span').textContent='STATUS: QUESTIONABLE';$('#process i').style.width='8%'}
  function startNextRound(){state.round++;state.submissions=state.submissions.map((s,i)=>({...s,score:Math.max(20,Math.round(s.score*.38)+(i%4)*7)})).sort(()=>Math.random()-.5).slice(0,10);seconds=D.countdownSeconds;save();updateStats();renderBoard();addActivity(`ROUND #${String(state.round).padStart(3,'0')} is now accepting bad ideas`)}

  function renderArchive(){const grid=$('#archive-grid');grid.innerHTML=D.rounds.map(r=>`<button class="archive-card" data-round="${r.round}"><canvas width="200" height="150" data-scene="${r.scene}"></canvas><div class="card-copy"><span class="round-id">ROUND #${String(r.round).padStart(3,'0')}</span><h3>${r.words.join(' + ')}</h3><p>“${esc(r.caption)}”</p></div></button>`).join('');$$('canvas',grid).forEach(c=>paint(c,c.dataset.scene));$$('.archive-card',grid).forEach(b=>b.onclick=()=>openArchive(+b.dataset.round))}
  function openArchive(n){const r=D.rounds.find(x=>x.round===n);const d=$('#meme-modal');$('#modal-content').innerHTML=`<div class="modal-grid"><div><canvas id="modal-canvas" width="400" height="300"></canvas><div class="caption">${esc(r.caption)}</div></div><div class="modal-data"><p class="section-code">ROUND #${String(r.round).padStart(3,'0')}</p><h2>${r.words.join(' + ')}</h2><p>${esc(r.output)}</p><h3>WINNING INPUTS</h3><table class="round-table">${r.words.map((w,i)=>`<tr><td>${esc(w)} <small>by ${esc(r.contributors[i])}</small></td><td>${r.scores[i]}</td></tr>`).join('')}</table><p><b>CONTRIBUTORS:</b><br>${[...new Set(r.contributors)].map(esc).join(' / ')}</p></div></div>`;paint($('#modal-canvas'),r.scene);d.showModal();beep()}
  $$('dialog').forEach(d=>{$('.modal-close',d).onclick=()=>d.close();d.addEventListener('click',e=>{if(e.target===d)d.close()})});

  function renderScores(){const ol=$('#highscores');ol.innerHTML=D.users.slice(0,15).map((u,i)=>`<li><button data-user="${u.name}"><span class="pos">${String(i+1).padStart(2,'0')}</span><span>${esc(u.name)}</span><span class="wins">${u.wins} WIN${u.wins===1?'':'S'}</span></button></li>`).join('');$$('button',ol).forEach(b=>b.onclick=()=>showProfile(b.dataset.user,b))}
  function showProfile(name,button){const u=D.users.find(x=>x.name===name);$$('#highscores button').forEach(b=>b.classList.toggle('active',b===button));$('#profile-card').innerHTML=`<span class="pixel-avatar">${esc(name.slice(0,2).toUpperCase())}</span><p class="section-code">PLAYER FILE</p><h3>${esc(name)}</h3><dl><div><dt>WORDS SUBMITTED</dt><dd>${u.words}</dd></div><div><dt>WINNING WORDS</dt><dd>${u.wins}</dd></div><div><dt>MEMES CONTRIBUTED TO</dt><dd>${u.memes}</dd></div><div><dt>TOTAL BOOSTS RECEIVED</dt><dd>${u.boosts}</dd></div></dl><p>KNOWN OFFENCES</p><div class="winning">${u.winning.length?u.winning.join(' / '):'NONE YET. SUSPICIOUS.'}</div>`;beep()}
  function copy(value,msg){if(navigator.clipboard?.writeText)navigator.clipboard.writeText(value).then(()=>toast(msg)).catch(()=>fallback());else fallback();function fallback(){const t=document.createElement('textarea');t.value=value;document.body.append(t);t.select();document.execCommand('copy');t.remove();toast(msg)}}
  $('#copy-ca').onclick=()=>{copy(D.contract,'CA COPIED. CHECK TWICE.');beep()};
  $('#sound-toggle').onclick=()=>{state.sound=!state.sound;save();$('#sound-toggle').textContent=`SOUND: ${state.sound?'ON':'OFF'}`;beep();toast(state.sound?'BEEPING ENABLED':'SILENCE RESTORED')};
  $('#reset-demo').onclick=()=>{if(confirm('Erase local submissions, boosts and generated memes?')){localStorage.removeItem(KEY);location.reload()}};

  let memerClicks=0,logoClicks=0;
  $$('[data-memer]').forEach(m=>m.addEventListener('click',()=>{memerClicks++;beep();if(memerClicks===5){$$('[data-memer]').forEach(x=>x.classList.add('angry'));toast('STOP FUCKING CLICKING ME.');setTimeout(()=>$$('[data-memer]').forEach(x=>x.classList.remove('angry')),1800)}}));
  $('#logo').addEventListener('click',()=>{logoClicks++;if(logoClicks===10){toast('MEMER-01 GAINS CONSCIOUSNESS');setTimeout(()=>toast('NEVERMIND.'),1300)}});
  const konami=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let ki=0;
  addEventListener('keydown',e=>{ki=e.key===konami[ki]?ki+1:0;if(ki===konami.length){document.body.classList.add('super');beep('reveal');setTimeout(()=>document.body.classList.remove('super'),2200);ki=0}});

  function fakeLife(){const drift=Math.random();if(drift<.22){state.online=Math.max(10,Math.min(30,state.online+(Math.random()<.5?-1:1)));updateStats()}const msgs=D.activities;addActivity(msgs[Math.floor(Math.random()*msgs.length)].replace('{online}',state.online));if(Math.random()<.18){const pool=['ALIMONY','RAMEN','BOSS','AIRFRYER','DAD','BILLS'];const word=pool[Math.floor(Math.random()*pool.length)];if(!state.submissions.some(s=>s.word===word)){state.submissions.push({word,score:20+Math.floor(Math.random()*34),user:'anon'});renderBoard();save()}}if(Math.random()<.25){const item=state.submissions[Math.floor(Math.random()*state.submissions.length)];item.score+=3+Math.floor(Math.random()*14);renderBoard(item.word);save()}if(Math.random()<.025)toast('WARNING: MEME QUALITY DETECTED. CORRECTING...')}
  setInterval(fakeLife,12000+Math.random()*5000);
  if(document.modelContext?.registerTool){try{document.modelContext.registerTool({name:'submit_word',title:'Submit a word',description:'Submit one word to the current Meme SI round and update the visible battle.',inputSchema:{type:'object',properties:{word:{type:'string',maxLength:24}},required:['word'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute:({word})=>{if(typeof word!=='string'||!word.trim())throw new Error('A word is required');const ok=submitWord(word,'web_agent');if(!ok)throw new Error('Submission rejected');return{accepted:true,word:word.trim().toUpperCase(),round:state.round}}})}catch(e){}
  }
  updateStats();renderBoard();renderActivity();renderArchive();renderScores();$('#sound-toggle').textContent=`SOUND: ${state.sound?'ON':'OFF'}`;
})();
