/* SWIR 10.17.1 STABLE — MIX 8/8
 * Full native B/I/U combination deck.
 * Every deck uses all 8 combinations before reshuffle and never repeats across deck boundary.
 */
(()=>{try{
if(window.__SWIR_MIX_STABLE10171)return;window.__SWIR_MIX_STABLE10171=1;
const ON='swir_mix_stable_10171',DECK='swir_mix_deck_10171',LAST='swir_mix_last_10171';
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
const byId=id=>styles.find(x=>x.id===id)||styles[0];
let mixOn=localStorage.getItem(ON)==='1';
let lastId=localStorage.getItem(LAST)||'';
let deck=[];
try{const x=JSON.parse(localStorage.getItem(DECK)||'[]');if(Array.isArray(x)&&x.length&&x.every(id=>styles.some(s=>s.id===id))&&new Set(x).size===x.length)deck=x}catch(e){}
function shuffle(){let a=styles.map(s=>s.id);for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}if(lastId&&a[0]===lastId&&a.length>1){const j=1+Math.floor(Math.random()*(a.length-1));[a[0],a[j]]=[a[j],a[0]]}deck=a;saveDeck();return deck}
function saveDeck(){try{localStorage.setItem(DECK,JSON.stringify(deck))}catch(e){}}
function ensureDeck(){if(!deck.length)shuffle();return deck}
function next(){ensureDeck();return byId(deck[0])}
function consume(){ensureDeck();const id=deck.shift();lastId=id;localStorage.setItem(LAST,id);if(!deck.length)shuffle();else saveDeck();return byId(id)}
function userStyle(){return window.CHNS?.userMessageStyle}
function snapshot(x){return{bold:!!x?.bold,italic:!!x?.italic,underline:!!x?.underline}}
function apply(x,s){x.bold=!!s.bold;x.italic=!!s.italic;x.underline=!!s.underline}
function restore(x,s){x.bold=!!s.bold;x.italic=!!s.italic;x.underline=!!s.underline}
function disableLegacy(){try{localStorage.setItem('swir_mix_write_106','0');window.SWIR_WRITING106?.setMix?.(false);const old=document.getElementById('sw106MixCard');if(old){old.style.display='none';old.dataset.replacedBy='10.17.1'}}catch(e){}}
function css(){if(document.getElementById('swirMixStable10171Css'))return;const s=document.createElement('style');s.id='swirMixStable10171Css';s.textContent=`#swStableMixCard{padding:14px;border:1px solid rgba(var(--sw99-rgb,0,229,255),.20);border-radius:13px;background:linear-gradient(135deg,rgba(15,25,39,.76),rgba(8,15,27,.82));margin-bottom:10px}.swmix8-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin:10px 0}.swmix8-style{padding:9px 6px;border-radius:9px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.035);text-align:center}.swmix8-mark{font-size:14px;font-weight:900;color:var(--sw99-accent,#00e5ff)}.swmix8-name{font-size:8px;color:var(--sw99-muted,#8198aa);margin-top:3px;line-height:1.2}.swmix8-note{font-size:9px;color:var(--sw99-muted,#8198aa);line-height:1.45}.swmix8-status{margin-top:8px;padding:9px;border-radius:9px;background:rgba(0,0,0,.13);border:1px solid rgba(255,255,255,.07);font-size:10px;color:var(--sw99-text,#eef7ff)}#swStableMixToggle{width:100%;min-height:46px;font-weight:900;border:1px solid rgba(var(--sw99-rgb,0,229,255),.35);border-radius:9px;background:rgba(255,255,255,.05);color:var(--sw99-text,#eef7ff);cursor:pointer}#swStableMixToggle.on{border-color:#55dfa0;color:#b9ffda;box-shadow:0 0 0 1px #55dfa020}.swmix8-next{color:var(--sw99-accent,#00e5ff);font-weight:900}@media(max-width:760px){.swmix8-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}`;document.head.appendChild(s)}
function card(){let d=document.getElementById('swStableMixCard');if(d)return d;const page=document.querySelector('#configPanel .sw10-page[data-page="mix106"]');if(!page)return null;d=document.createElement('div');d.id='swStableMixCard';d.innerHTML='<h3>🔀 MIX pisania 8/8</h3><div class="swmix8-note">Pełna talia wszystkich kombinacji B / I / U. Każdy styl wystąpi raz zanim talia zostanie ponownie przetasowana.</div><div class="swmix8-grid">'+styles.map(s=>`<div class="swmix8-style"><div class="swmix8-mark">${s.mark}</div><div class="swmix8-name">${s.name}</div></div>`).join('')+'</div><button type="button" id="swStableMixToggle"></button><div class="swmix8-status" id="swStableMixStatus"></div>';page.appendChild(d);d.querySelector('#swStableMixToggle').onclick=()=>setMix(!mixOn);render();return d}
function render(){disableLegacy();const d=card();if(!d)return;const b=d.querySelector('#swStableMixToggle'),st=d.querySelector('#swStableMixStatus'),n=next();if(b){b.classList.toggle('on',mixOn);b.textContent=mixOn?'MIX 8/8 WŁĄCZONY':'MIX 8/8 WYŁĄCZONY'}if(st)st.innerHTML='<b>Status:</b> '+(mixOn?'AKTYWNY':'WYŁĄCZONY')+'<br>Następny styl: <span class="swmix8-next">'+n.name+'</span> ('+n.desc+')<br><span style="opacity:.75">Pozostało w bieżącej talii: '+deck.length+'/8 • brak natychmiastowych powtórek między taliami.</span>'}
function setMix(v){mixOn=!!v;localStorage.setItem(ON,mixOn?'1':'0');disableLegacy();if(mixOn&&!deck.length)shuffle();render()}
function hook(){const proto=window.CHNS?.Channel?.prototype;if(!proto||typeof proto.sendMessage!=='function')return false;if(proto.sendMessage.__swirMixStable10171)return true;disableLegacy();const original=proto.sendMessage;function wrapped(e){const raw=String(e?.value||'').trim();if(!mixOn||!raw||raw.startsWith('/'))return original.apply(this,arguments);const x=userStyle();if(!x)return original.apply(this,arguments);const chosen=next(),before=snapshot(x);let result;try{apply(x,chosen);result=original.apply(this,arguments);if(result!==false){consume();setTimeout(render,0)}return result}finally{restore(x,before)}}wrapped.__swirMixStable10171=1;wrapped.__swirMixStableOriginal=original;proto.sendMessage=wrapped;return true}
css();disableLegacy();ensureDeck();let tries=0,t=setInterval(()=>{tries++;css();disableLegacy();card();hook();render();if((document.getElementById('swStableMixCard')&&window.CHNS?.Channel?.prototype?.sendMessage?.__swirMixStable10171)||tries>100)clearInterval(t)},120);document.addEventListener('click',e=>{if(e.target?.closest?.('#btnConfig,.sw10-tab[data-tab="mix106"]'))setTimeout(()=>{disableLegacy();card();render()},0)},true);window.SWIR_MIX_STABLE10171={version:'10.17.1 STABLE MIX 8/8',styles,enabled:()=>mixOn,setMix,next,deck:()=>deck.slice(),shuffle:()=>{shuffle();render()},refresh:()=>{disableLegacy();card();hook();render()}};console.log('SWIR 10.17.1 MIX 8/8 active');
}catch(e){console.error('SWIR 10.17.1 MIX',e)}})();