/* SWIR 10.10 — FULL MIX: all 8 combinations of native Bold / Italic / Underline */
(()=>{try{
if(window.__SWIR_WRITING1010)return;window.__SWIR_WRITING1010=1;
const ON='swir_mix_write_1010',DECK='swir_mix_deck_1010',LAST='swir_mix_last_1010';
const styles=[
 {id:'n', name:'Cienkie', desc:'normalne / bez B-I-U', bold:false,italic:false,underline:false},
 {id:'b', name:'Grube', desc:'pogrubione', bold:true,italic:false,underline:false},
 {id:'i', name:'Ukośne', desc:'kursywa', bold:false,italic:true,underline:false},
 {id:'u', name:'Podkreślone', desc:'podkreślenie', bold:false,italic:false,underline:true},
 {id:'bi',name:'Ukośne grube',desc:'pogrubienie + kursywa',bold:true,italic:true,underline:false},
 {id:'bu',name:'Grube podkreślone',desc:'pogrubienie + podkreślenie',bold:true,italic:false,underline:true},
 {id:'iu',name:'Ukośne podkreślone',desc:'kursywa + podkreślenie',bold:false,italic:true,underline:true},
 {id:'biu',name:'Ukośne grube i podkreślone',desc:'pogrubienie + kursywa + podkreślenie',bold:true,italic:true,underline:true}
];
const byId=id=>styles.find(x=>x.id===id)||styles[0];
const u=()=>window.CHNS?.userMessageStyle;
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let mixOn=localStorage.getItem(ON)==='1';
let lastId=localStorage.getItem(LAST)||'';let lastStyle=lastId?byId(lastId):null;
function validDeck(a){return Array.isArray(a)&&a.length>0&&a.every(id=>styles.some(s=>s.id===id))&&new Set(a).size===a.length}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function newDeck(avoid=''){const a=shuffle(styles.map(x=>x.id));if(a.length>1&&a[0]===avoid){const j=1+Math.floor(Math.random()*(a.length-1));[a[0],a[j]]=[a[j],a[0]]}return a}
let deck;try{deck=JSON.parse(localStorage.getItem(DECK)||'null')}catch(e){deck=null}if(!validDeck(deck))deck=newDeck(lastId);
function save(){localStorage.setItem(ON,mixOn?'1':'0');localStorage.setItem(DECK,JSON.stringify(deck));if(lastId)localStorage.setItem(LAST,lastId);else localStorage.removeItem(LAST)}
function next(){if(!deck.length)deck=newDeck(lastId);return byId(deck[0])}
function setMix(v){mixOn=!!v;if(mixOn)deck=newDeck(lastId);save();render()}
function reshuffle(){deck=newDeck(lastId);save();render()}
function css(){if(document.getElementById('swirWriting1010Css'))return;const s=document.createElement('style');s.id='swirWriting1010Css';s.textContent=`
#sw106MixCard{display:none!important}#sw1010MixCard{padding:14px!important;border:1px solid rgba(var(--sw99-rgb,0,229,255),.18)!important;border-radius:13px!important;background:linear-gradient(135deg,rgba(15,25,39,.72),rgba(8,15,27,.78))!important;margin-bottom:10px!important}.sw1010-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin:10px 0}.sw1010-style{padding:9px 10px;border:1px solid rgba(255,255,255,.075);border-radius:9px;background:rgba(255,255,255,.025);font-size:10px}.sw1010-style b{display:block;margin-bottom:2px}.sw1010-style span{font-size:8px;opacity:.72}.sw1010-actions{display:grid;grid-template-columns:1fr auto;gap:7px}.sw1010-actions button{min-height:44px!important}.sw1010-status{margin-top:9px;padding:9px 10px;border-radius:9px;border:1px solid rgba(255,255,255,.07);background:rgba(0,0,0,.13);font-size:10px;line-height:1.45}#sw1010MixToggle.on{border-color:#37b779!important;box-shadow:0 0 0 1px #37b77922!important}@media(max-width:760px){.sw1010-grid{grid-template-columns:1fr}.sw1010-actions{grid-template-columns:1fr}}
html[data-swir-theme99="ice"] #sw1010MixCard{background:linear-gradient(180deg,#fff,#edf8ff)!important;border-color:#a8d7f1!important;color:#16384f!important}html[data-swir-theme99="ice"] .sw1010-style,html[data-swir-theme99="ice"] .sw1010-status{background:#fff!important;border-color:#b8d9eb!important;color:#244f68!important}
`;document.head.appendChild(s)}
function card(){const d=document.createElement('div');d.id='sw1010MixCard';d.innerHTML=`<h3>🔀 MIX pisania — pełne B / I / U</h3><div style="font-size:9px;opacity:.78;line-height:1.45">Każdy cykl wykorzystuje wszystkie 8 kombinacji dokładnie raz. Kolejność jest tasowana, a dwa identyczne style nie wystąpią pod rząd.</div><div class="sw1010-grid">${styles.map(s=>`<div class="sw1010-style"><b>${s.bold?'<strong>B</strong> ':''}${s.italic?'<i>I</i> ':''}${s.underline?'<u>U</u> ':''}${!s.bold&&!s.italic&&!s.underline?'Aa ':''}${esc(s.name)}</b><span>${esc(s.desc)}</span></div>`).join('')}</div><div class="sw1010-actions"><button type="button" id="sw1010MixToggle"></button><button type="button" id="sw1010Shuffle">🔀 Przetasuj</button></div><div id="sw1010MixStatus" class="sw1010-status"></div>`;d.querySelector('#sw1010MixToggle').onclick=()=>setMix(!mixOn);d.querySelector('#sw1010Shuffle').onclick=reshuffle;return d}
function ensureUI(){css();const page=document.querySelector('#configPanel #swirModTabs100 .sw10-page[data-page="mix106"]');if(!page)return false;let d=document.getElementById('sw1010MixCard');if(!d){d=card();page.insertBefore(d,page.firstChild)}render();return true}
function render(){const b=document.getElementById('sw1010MixToggle'),s=document.getElementById('sw1010MixStatus');if(b){b.classList.toggle('on',mixOn);b.textContent=mixOn?'🟢 PEŁNY MIX WŁĄCZONY':'⚪ PEŁNY MIX WYŁĄCZONY'}if(s){const n=next();s.innerHTML='<b>Status:</b> '+(mixOn?'AKTYWNY':'WYŁĄCZONY')+(lastStyle?'<br>Ostatnia: <b>'+esc(lastStyle.name)+'</b> — '+esc(lastStyle.desc):'')+'<br>Następna: <b>'+esc(n.name)+'</b> — '+esc(n.desc)+'<br>Pozostało w tym cyklu: <b>'+deck.length+'/8</b><br><span style="opacity:.72">Kolor wiadomości pozostaje niezależny od MIX-u.</span>'}}
function install(){const proto=window.CHNS?.Channel?.prototype;if(!proto||typeof proto.sendMessage!=='function')return false;if(proto.sendMessage.__swirMix1010)return true;
 try{window.SWIR_WRITING106?.setMix?.(false)}catch(e){}
 const legacy=proto.sendMessage;
 function wrapped(e){const raw=String(e?.value||'').trim();if(!mixOn||!raw||raw.startsWith('/'))return legacy.apply(this,arguments);const x=u();if(!x)return legacy.apply(this,arguments);const chosen=next(),before={bold:!!x.bold,italic:!!x.italic,underline:!!x.underline};let result,sent=false;try{x.bold=chosen.bold;x.italic=chosen.italic;x.underline=chosen.underline;result=legacy.apply(this,arguments);sent=String(e?.value||'').trim()==='';return result}finally{x.bold=before.bold;x.italic=before.italic;x.underline=before.underline;if(sent){lastStyle=chosen;lastId=chosen.id;deck.shift();if(!deck.length)deck=newDeck(lastId);save();setTimeout(render,0)}}}
 wrapped.__swirMix1010=1;wrapped.__swirMix106=1;wrapped.__swirMix106Original=legacy.__swirMix106Original||legacy;wrapped.__swirMix1010Legacy=legacy;proto.sendMessage=wrapped;return true}
css();let n=0;const t=setInterval(()=>{n++;const a=ensureUI(),b=install();if(a&&b&&n>8)clearInterval(t);if(n>100)clearInterval(t)},120);ensureUI();install();let raf=0;new MutationObserver(()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;ensureUI();install()})}).observe(document.body,{childList:true,subtree:true});
window.SWIR_WRITING1010={version:'10.10 FULL MIX 8',styles,mixEnabled:()=>mixOn,setMix,reshuffle,next,refresh:()=>{ensureUI();install();render()}};
console.log('✅ SWIR 10.10 Writing: all 8 B/I/U combinations, shuffled without repetition');
}catch(e){console.error('SWIR 10.10 Writing',e)}})();
