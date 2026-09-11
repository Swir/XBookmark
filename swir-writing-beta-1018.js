/* SWIR 10.18 BETA — MIX 8/8 SINGLE HOOK
 * Fixes hook competition with legacy 10.6 Writing.
 * Uses all 8 native B/I/U combinations in a shuffled deck.
 */
(()=>{try{
if(window.__SWIR_MIX1018)return;window.__SWIR_MIX1018=1;
const ON='swir_mix_beta_1018',DECK='swir_mix_deck_1018',LAST='swir_mix_last_1018';
const styles=[
 {id:'n',name:'Normalne',desc:'bez B / I / U',bold:false,italic:false,underline:false,mark:'Aa'},
 {id:'b',name:'Pogrubione',desc:'B',bold:true,italic:false,underline:false,mark:'B'},
 {id:'i',name:'Kursywa',desc:'I',bold:false,italic:true,underline:false,mark:'I'},
 {id:'u',name:'Podkreślone',desc:'U',bold:false,italic:false,underline:true,mark:'U'},
 {id:'bi',name:'Pogrubione + kursywa',desc:'B + I',bold:true,italic:true,underline:false,mark:'BI'},
 {id:'bu',name:'Pogrubione + podkreślone',desc:'B + U',bold:true,italic:false,underline:true,mark:'BU'},
 {id:'iu',name:'Kursywa + podkreślone',desc:'I + U',bold:false,italic:true,underline:true,mark:'IU'},
 {id:'biu',name:'Pogrubione + kursywa + podkreślone',desc:'B + I + U',bold:true,italic:true,underline:true,mark:'BIU'}
];
const byId=id=>styles.find(s=>s.id===id)||styles[0];
let mixOn=localStorage.getItem(ON)==='1',deck=[],lastId=localStorage.getItem(LAST)||'',lastApplied=null,sendCount=0;
try{const a=JSON.parse(localStorage.getItem(DECK)||'[]');if(Array.isArray(a)&&a.length&&a.every(id=>styles.some(s=>s.id===id))&&new Set(a).size===a.length)deck=a}catch(e){}
function saveDeck(){try{localStorage.setItem(DECK,JSON.stringify(deck))}catch(e){}}
function shuffle(){const a=styles.map(s=>s.id);for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}if(lastId&&a[0]===lastId&&a.length>1){const j=1+Math.floor(Math.random()*(a.length-1));[a[0],a[j]]=[a[j],a[0]]}deck=a;saveDeck();return deck}
function ensureDeck(){if(!deck.length)shuffle();return deck}
function peek(){ensureDeck();return byId(deck[0])}
function consume(){ensureDeck();const s=byId(deck.shift());lastId=s.id;lastApplied=s;sendCount++;try{localStorage.setItem(LAST,s.id)}catch(e){}if(deck.length)saveDeck();else shuffle();return s}
function styleObj(){return window.CHNS?.userMessageStyle||null}
function snap(x){return{bold:!!(x?.isBoldMsg?.()??x?.bold),italic:!!(x?.isItalicMsg?.()??x?.italic),underline:!!(x?.isUnderlineMsg?.()??x?.underline)}}
function apply(x,s){if(!x)return;x.bold=!!s.bold;x.italic=!!s.italic;x.underline=!!s.underline}
function disableLegacy(){try{localStorage.setItem('swir_mix_write_106','0');window.SWIR_WRITING106?.setMix?.(false)}catch(e){}}
function css(){if(document.getElementById('swirMix1018Css'))return;const s=document.createElement('style');s.id='swirMix1018Css';s.textContent=`#sw106MixCard{display:none!important}#swMix1018Card{padding:14px;border:1px solid rgba(var(--sw99-rgb,0,229,255),.22);border-radius:13px;background:linear-gradient(135deg,rgba(15,25,39,.76),rgba(8,15,27,.82));margin-bottom:10px}.swmix1018-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin:10px 0}.swmix1018-style{padding:9px 5px;border-radius:9px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.035);text-align:center}.swmix1018-mark{font-size:14px;font-weight:900;color:var(--sw99-accent,#00e5ff)}.swmix1018-name{font-size:8px;color:var(--sw99-muted,#8198aa);margin-top:3px;line-height:1.2}.swmix1018-note{font-size:9px;color:var(--sw99-muted,#8198aa);line-height:1.45}.swmix1018-status{margin-top:8px;padding:9px;border-radius:9px;background:rgba(0,0,0,.13);border:1px solid rgba(255,255,255,.07);font-size:10px;color:var(--sw99-text,#eef7ff)}#swMix1018Toggle{width:100%;min-height:46px;font-weight:900;border:1px solid rgba(var(--sw99-rgb,0,229,255),.35);border-radius:9px;background:rgba(255,255,255,.05);color:var(--sw99-text,#eef7ff);cursor:pointer}#swMix1018Toggle.on{border-color:#55dfa0;color:#b9ffda;box-shadow:0 0 0 1px #55dfa020}@media(max-width:760px){.swmix1018-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}`;document.head.appendChild(s)}
function card(){const page=document.querySelector('#configPanel .sw10-page[data-page="mix106"]');if(!page)return null;let d=document.getElementById('swMix1018Card');if(!d){d=document.createElement('div');d.id='swMix1018Card';d.innerHTML='<h3>🔀 MIX pisania 8/8 — BETA 10.18</h3><div class="swmix1018-note">Jedna talia = wszystkie 8 kombinacji B / I / U. Stary MIX 10.6 jest wyłączony, żeby hooki nie walczyły ze sobą.</div><div class="swmix1018-grid">'+styles.map(s=>`<div class="swmix1018-style"><div class="swmix1018-mark">${s.mark}</div><div class="swmix1018-name">${s.name}</div></div>`).join('')+'</div><button type="button" id="swMix1018Toggle"></button><div id="swMix1018Status" class="swmix1018-status"></div>';page.appendChild(d);d.querySelector('#swMix1018Toggle').onclick=()=>setMix(!mixOn)}return d}
function render(){disableLegacy();const d=card();if(!d)return;const b=d.querySelector('#swMix1018Toggle'),st=d.querySelector('#swMix1018Status'),n=peek();if(b){b.classList.toggle('on',mixOn);b.textContent=mixOn?'MIX 8/8 WŁĄCZONY':'MIX 8/8 WYŁĄCZONY'}if(st)st.innerHTML='<b>Status:</b> '+(mixOn?'AKTYWNY':'WYŁĄCZONY')+'<br>Następny: <b>'+n.name+'</b> ('+n.desc+')'+(lastApplied?'<br>Ostatnio wysłany: <b>'+lastApplied.name+'</b>':'')+'<br><span style="opacity:.72">Pozostało w talii: '+deck.length+'/8 • wysłane przez MIX: '+sendCount+'</span>'}
function setMix(v){mixOn=!!v;try{localStorage.setItem(ON,mixOn?'1':'0')}catch(e){}disableLegacy();if(mixOn&&!deck.length)shuffle();render()}
function installHook(){const proto=window.CHNS?.Channel?.prototype;if(!proto||typeof proto.sendMessage!=='function')return false;const cur=proto.sendMessage;if(cur.__swirMix1018)return true;disableLegacy();function wrapped(e){const raw=String(e?.value||'').trim();if(!mixOn||!raw||raw.startsWith('/'))return cur.apply(this,arguments);const x=styleObj();if(!x)return cur.apply(this,arguments);const chosen=peek(),before=snap(x);let result;try{apply(x,chosen);result=cur.apply(this,arguments);if(result!==false){consume();setTimeout(render,0)}return result}finally{apply(x,before)}}
wrapped.__swirMix1018=1;
/* critical: legacy 10.6 installer sees its own marker and will NOT wrap us again */
wrapped.__swirMix106=1;
wrapped.__swirMixStable10171=1;
wrapped.__swirMix1018Original=cur;
proto.sendMessage=wrapped;return true}
function keepHook(){const p=window.CHNS?.Channel?.prototype;if(!p)return false;if(p.sendMessage?.__swirMix1018)return true;return installHook()}
css();disableLegacy();ensureDeck();let tries=0;const t=setInterval(()=>{tries++;css();disableLegacy();card();keepHook();render();if(tries>120)clearInterval(t)},150);
document.addEventListener('click',e=>{if(e.target?.closest?.('#btnConfig,.sw10-tab[data-tab="mix106"]'))setTimeout(()=>{css();disableLegacy();card();keepHook();render()},20)},true);
window.SWIR_MIX1018={version:'10.18 BETA MIX 8/8 SINGLE HOOK',styles,enabled:()=>mixOn,setMix,next:peek,deck:()=>deck.slice(),shuffle:()=>{shuffle();render()},hooked:()=>!!window.CHNS?.Channel?.prototype?.sendMessage?.__swirMix1018,diagnostics:()=>({enabled:mixOn,hooked:!!window.CHNS?.Channel?.prototype?.sendMessage?.__swirMix1018,next:peek(),deck:deck.slice(),lastApplied,sendCount})};
console.log('SWIR 10.18 MIX 8/8 single-hook active');
}catch(e){console.error('SWIR MIX 10.18',e)}})();