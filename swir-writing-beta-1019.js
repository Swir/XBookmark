/* SWIR 10.19 BETA — MIX 8/8 CHANNEL WRAPPER
 * Mirrors the proven Color Writing architecture: wrap each Channel instance,
 * not CHNS.Channel.prototype. This is required because Color Writing already
 * installs own sendMessage wrappers on live channels.
 */
(()=>{try{
if(window.__SWIR_MIX1019)return;window.__SWIR_MIX1019=1;
const ON='swir_mix_beta_1019',DECK='swir_mix_deck_1019',LAST='swir_mix_last_1019';
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
try{const x=JSON.parse(localStorage.getItem(DECK)||'[]');if(Array.isArray(x)&&x.length&&x.every(id=>styles.some(s=>s.id===id))&&new Set(x).size===x.length)deck=x}catch(e){}
function saveDeck(){try{localStorage.setItem(DECK,JSON.stringify(deck))}catch(e){}}
function shuffle(){const a=styles.map(s=>s.id);for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}if(lastId&&a[0]===lastId&&a.length>1){const j=1+Math.floor(Math.random()*(a.length-1));[a[0],a[j]]=[a[j],a[0]]}deck=a;saveDeck();return deck}
function ensureDeck(){if(!deck.length)shuffle();return deck}
function peek(){ensureDeck();return byId(deck[0])}
function consume(){ensureDeck();const s=byId(deck.shift());lastId=s.id;lastApplied=s;sendCount++;try{localStorage.setItem(LAST,s.id)}catch(e){}if(deck.length)saveDeck();else shuffle();return s}
function userStyle(){return window.CHNS?.userMessageStyle||null}
function snap(x){return{bold:!!x?.isBoldMsg?.(),italic:!!x?.isItalicMsg?.(),underline:!!x?.isUnderlineMsg?.()}}
function apply(x,s){if(!x)return;x.bold=!!s.bold;x.italic=!!s.italic;x.underline=!!s.underline}
function currentChannel(){try{return CHNS?.channelManager?.getCurrentChannel?.()||null}catch(e){return null}}
function getChannels(){const out=new Set();try{const c=currentChannel();if(c)out.add(c)}catch(e){}try{const cs=CHNS?.channelManager?.channels;if(cs)Object.values(cs).forEach(c=>c&&out.add(c))}catch(e){}return[...out]}
function disableLegacy(){try{localStorage.setItem('swir_mix_write_106','0');localStorage.setItem('swir_mix_stable_10171','0');localStorage.setItem('swir_mix_beta_1018','0');window.SWIR_WRITING106?.setMix?.(false);window.SWIR_MIX_STABLE10171?.setMix?.(false);window.SWIR_MIX1018?.setMix?.(false)}catch(e){}}
function wrapChannel(ch){try{
 if(!ch||typeof ch.sendMessage!=='function'||ch.__swirMix1019Wrapped)return false;
 const original=ch.sendMessage;
 Object.defineProperty(ch,'__swirMix1019Wrapped',{value:true,configurable:true});
 Object.defineProperty(ch,'__swirMix1019Original',{value:original,configurable:true});
 ch.sendMessage=function(input){
  const raw=input&&typeof input.value==='string'?input.value.trim():'';
  if(!mixOn||!raw||raw.startsWith('/'))return original.apply(this,arguments);
  const x=userStyle();if(!x)return original.apply(this,arguments);
  const chosen=peek(),before=snap(x),beforeValue=String(input.value||'');
  let result;
  try{
   apply(x,chosen);
   result=original.apply(this,arguments);
   const sent=String(input?.value??'').trim()===''&&beforeValue.trim()!=='';
   if(sent){consume();setTimeout(render,0)}
   return result;
  }finally{apply(x,before)}
 };
 ch.sendMessage.__swirMix1019=1;
 return true;
}catch(e){console.error('SWIR MIX 10.19 wrap channel',e);return false}}
function install(){disableLegacy();let n=0;getChannels().forEach(ch=>{if(wrapChannel(ch))n++});return n}
function css(){if(document.getElementById('swirMix1019Css'))return;const s=document.createElement('style');s.id='swirMix1019Css';s.textContent=`
/* Color Writing = colors only. Legacy manual B/I/U card stays hidden to avoid 10.6 observer recreation loops. */
#sw106ManualStyles{display:none!important}
#sw106MixCard,#swStableMixCard,#swMix1018Card{display:none!important}
#swMix1019Card{padding:14px;border:1px solid rgba(var(--sw99-rgb,0,229,255),.24);border-radius:13px;background:linear-gradient(135deg,rgba(15,25,39,.76),rgba(8,15,27,.82));margin-bottom:10px}
.swmix1019-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin:10px 0}.swmix1019-style{padding:9px 5px;border-radius:9px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.035);text-align:center}.swmix1019-mark{font-size:14px;font-weight:900;color:var(--sw99-accent,#00e5ff)}.swmix1019-name{font-size:8px;color:var(--sw99-muted,#8198aa);margin-top:3px;line-height:1.2}.swmix1019-note{font-size:9px;color:var(--sw99-muted,#8198aa);line-height:1.45}.swmix1019-status{margin-top:8px;padding:9px;border-radius:9px;background:rgba(0,0,0,.13);border:1px solid rgba(255,255,255,.07);font-size:10px;color:var(--sw99-text,#eef7ff)}#swMix1019Toggle{width:100%;min-height:46px;font-weight:900;border:1px solid rgba(var(--sw99-rgb,0,229,255),.35);border-radius:9px;background:rgba(255,255,255,.05);color:var(--sw99-text,#eef7ff);cursor:pointer}#swMix1019Toggle.on{border-color:#55dfa0;color:#b9ffda;box-shadow:0 0 0 1px #55dfa020}@media(max-width:760px){.swmix1019-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
`;document.head.appendChild(s)}
function card(){const page=document.querySelector('#configPanel .sw10-page[data-page="mix106"]');if(!page)return null;let d=document.getElementById('swMix1019Card');if(!d){d=document.createElement('div');d.id='swMix1019Card';d.innerHTML='<h3>🔀 MIX pisania 8/8 — BETA 10.19</h3><div class="swmix1019-note">MIX działa teraz tą samą architekturą co sprawdzone Kolorowe pisanie: osobny wrapper sendMessage na każdym pokoju i privie. Każda talia wykorzystuje wszystkie 8 kombinacji B / I / U.</div><div class="swmix1019-grid">'+styles.map(s=>`<div class="swmix1019-style"><div class="swmix1019-mark">${s.mark}</div><div class="swmix1019-name">${s.name}</div></div>`).join('')+'</div><button type="button" id="swMix1019Toggle"></button><div id="swMix1019Status" class="swmix1019-status"></div>';page.appendChild(d);d.querySelector('#swMix1019Toggle').onclick=()=>setMix(!mixOn)}return d}
function render(){disableLegacy();const d=card();if(!d)return;const b=d.querySelector('#swMix1019Toggle'),st=d.querySelector('#swMix1019Status'),n=peek(),chs=getChannels(),wrapped=chs.filter(c=>c?.__swirMix1019Wrapped).length;if(b){b.classList.toggle('on',mixOn);b.textContent=mixOn?'MIX 8/8 WŁĄCZONY':'MIX 8/8 WYŁĄCZONY'}if(st)st.innerHTML='<b>Status:</b> '+(mixOn?'AKTYWNY':'WYŁĄCZONY')+'<br>Następny: <b>'+n.name+'</b> ('+n.desc+')'+(lastApplied?'<br>Ostatnio wysłany: <b>'+lastApplied.name+'</b>':'')+'<br><span style="opacity:.72">Talia: '+deck.length+'/8 • wysłane: '+sendCount+' • kanały MIX: '+wrapped+'/'+chs.length+'</span>'}
function setMix(v){mixOn=!!v;try{localStorage.setItem(ON,mixOn?'1':'0')}catch(e){}disableLegacy();if(mixOn&&!deck.length)shuffle();install();render()}
css();disableLegacy();ensureDeck();install();let tries=0;const t=setInterval(()=>{tries++;css();install();card();render();if(tries>180)clearInterval(t)},500);
document.addEventListener('click',e=>{if(e.target?.closest?.('#btnConfig,.sw10-tab[data-tab="mix106"],.sw10-tab[data-tab="kolory106"]'))setTimeout(()=>{css();install();card();render()},20)},true);
window.SWIR_MIX1019={version:'10.19 BETA MIX 8/8 CHANNEL WRAPPER',styles,enabled:()=>mixOn,setMix,next:peek,deck:()=>deck.slice(),channels:getChannels,install,wrapped:()=>getChannels().filter(c=>c?.__swirMix1019Wrapped).length,diagnostics:()=>({enabled:mixOn,channels:getChannels().length,wrapped:getChannels().filter(c=>c?.__swirMix1019Wrapped).length,next:peek(),deck:deck.slice(),lastApplied,sendCount,colorMode:window.SWIR_COLOR_WRITE?.getMode?.()||null})};
console.log('SWIR 10.19 MIX active — channel-instance architecture like Color Writing');
}catch(e){console.error('SWIR MIX 10.19',e)}})();