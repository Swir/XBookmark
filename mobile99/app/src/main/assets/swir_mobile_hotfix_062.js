(function(){
'use strict';
if(window.__SWIR_MOBILE_HOTFIX_062)return;
window.__SWIR_MOBILE_HOTFIX_062=true;

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const KEY_MODE='swir_mobile_color_mode';
const KEY_FIXED='swir_mobile_color_fixed';
const KEY_INDEX='swir_mobile_color_index';
const KEY_LAST='swir_mobile_color_last';
const COLORS=[
 {id:0,name:'Czarny',css:'#111111'},
 {id:1,name:'Jasny niebieski',css:'#59c9ff'},
 {id:2,name:'Granatowy',css:'#5575ff'},
 {id:3,name:'Różowy',css:'#ff6bc8'},
 {id:4,name:'Szary',css:'#a7b0ba'},
 {id:5,name:'Jasny zielony',css:'#7ee787'},
 {id:6,name:'Zielony',css:'#25c66a'},
 {id:7,name:'Jasny pomarańczowy',css:'#ffbd66'},
 {id:8,name:'Pomarańczowy',css:'#ff8d3a'},
 {id:9,name:'Brązowy',css:'#b88762'},
 {id:10,name:'Niebieski',css:'#358cff'},
 {id:11,name:'Czerwony',css:'#ff5c65'}
];
const RAINBOW=[11,8,7,5,6,1,10,2,3];

function get(k,d){try{const v=localStorage.getItem(k);return v===null?d:v}catch(e){return d}}
function set(k,v){try{localStorage.setItem(k,String(v))}catch(e){}}
function mode(){const m=get(KEY_MODE,'off');return ['off','rainbow','random','fixed'].includes(m)?m:'off'}
function fixed(){const n=parseInt(get(KEY_FIXED,'10'),10);return Number.isFinite(n)&&n>=0&&n<=11?n:10}
function color(id){return COLORS.find(c=>c.id===Number(id))||COLORS[10]}
function nextColor(){
 const m=mode();
 if(m==='fixed')return fixed();
 if(m==='rainbow'){
  let i=parseInt(get(KEY_INDEX,'0'),10)||0;
  const id=RAINBOW[((i%RAINBOW.length)+RAINBOW.length)%RAINBOW.length];
  set(KEY_INDEX,i+1);set(KEY_LAST,id);return id;
 }
 if(m==='random'){
  const last=parseInt(get(KEY_LAST,'-1'),10);
  const pool=RAINBOW.filter(x=>x!==last);
  const id=pool[Math.floor(Math.random()*pool.length)];
  set(KEY_LAST,id);return id;
 }
 return null;
}
function setMode(m){if(!['off','rainbow','random','fixed'].includes(m))return false;set(KEY_MODE,m);if(m==='rainbow')set(KEY_INDEX,0);installColor();refreshPanel();return true}
function setFixed(id){id=parseInt(id,10);if(!(id>=0&&id<=11))return false;set(KEY_FIXED,id);setMode('fixed');return true}

function getChannels(){
 const out=new Set();
 try{const c=CHNS?.channelManager?.getCurrentChannel?.();if(c)out.add(c)}catch(e){}
 try{Object.values(CHNS?.channelManager?.channels||{}).forEach(c=>c&&out.add(c))}catch(e){}
 return [...out];
}
function wrapChannel(ch){
 try{
  if(!ch||typeof ch.sendMessage!=='function'||ch.__swirMobileColorWrapped)return false;
  const original=ch.sendMessage;
  Object.defineProperty(ch,'__swirMobileColorWrapped',{value:true,configurable:true});
  ch.sendMessage=function(input){
   const text=input&&typeof input.value==='string'?input.value.trim():'';
   const m=mode();
   if(!text||m==='off'||text.startsWith('/'))return original.apply(this,arguments);
   const id=nextColor();
   if(id===null||!window.CHNS||!CHNS.userMessageStyle)return original.apply(this,arguments);
   const old=CHNS.userMessageStyle.colorId;
   try{
    CHNS.userMessageStyle.colorId=id;
    window.__SWIR_MOBILE_COLOR_LAST_SENT={id,name:color(id).name,ts:Date.now(),mode:m};
    return original.apply(this,arguments);
   }finally{
    CHNS.userMessageStyle.colorId=old;
    setTimeout(refreshPanel,0);
   }
  };
  return true;
 }catch(e){console.error('SWIR MOBILE COLOR wrap',e);return false}
}
function installColor(){let n=0;getChannels().forEach(ch=>{if(wrapChannel(ch))n++});return n}

function cleanupNames(){
 try{
  ['btnConfig','swir-launcher'].forEach(id=>document.getElementById(id)?.remove());
  $$('.swir-launcher,.swir-floating-launcher').forEach(el=>el.remove());
  $$('button,a,li,[role="button"],span,div').forEach(el=>{
   if(!el.isConnected)return;
   const t=(el.textContent||'').replace(/\s+/g,' ').trim();
   if(t==='SWIR MOD'||t==='⚡ SWIR MOD'){
    const parent=(el.children.length===0?el:(el.closest('button,a,[role="button"]')||el));
    parent.remove();return;
   }
   if(t.toUpperCase()==='CHNS'&&el.children.length===0){el.remove()}
  });
  const h=$('#configPanel h2,.swir99-mod-title');
  if(h&&/MOD/i.test(h.textContent||''))h.textContent='⚡ CZATeria Plus';
 }catch(e){}
}

function installCss(){
 let st=$('#swir-mobile-062-style');
 if(!st){st=document.createElement('style');st.id='swir-mobile-062-style';document.head.appendChild(st)}
 st.textContent=`
 #swir-color-mobile-sheet{position:fixed;inset:0;z-index:2147483640;background:#000a;display:flex;align-items:flex-end;justify-content:center;font-family:Arial,sans-serif}
 #swir-color-mobile-sheet .swir-color-box{width:100%;max-height:80vh;overflow:auto;box-sizing:border-box;padding:14px 14px calc(16px + env(safe-area-inset-bottom));background:#0a1723;color:#edf8ff;border-top:1px solid #1ed7ff;border-radius:18px 18px 0 0;box-shadow:0 -14px 45px #000a}
 #swir-color-mobile-sheet .swir-color-head{display:flex;align-items:center;gap:8px;margin-bottom:12px}
 #swir-color-mobile-sheet .swir-color-head b{flex:1;color:#55e7ff;font-size:17px}
 #swir-color-mobile-sheet button{min-height:42px;border-radius:10px;border:1px solid #29475c;background:#122536;color:#edf8ff;font-size:14px;padding:7px 9px}
 #swir-color-mobile-sheet button.active{border-color:#55e7ff;box-shadow:0 0 0 2px #55e7ff22;background:#18364a}
 #swir-color-mobile-sheet .swir-color-modes{display:grid;grid-template-columns:1fr 1fr;gap:8px}
 #swir-color-mobile-sheet .swir-color-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:12px}
 #swir-color-mobile-sheet .swir-color-dot{height:48px;position:relative;overflow:hidden}
 #swir-color-mobile-sheet .swir-color-dot i{display:block;width:18px;height:18px;border-radius:50%;margin:0 auto 3px;border:1px solid #fff8}
 #swir-color-mobile-sheet .swir-color-dot small{display:block;font-size:9px;line-height:1.05}
 #swir-color-status{margin-top:12px;padding:9px;border-radius:10px;border:1px solid #ffffff17;background:#07111b;color:#9db5c8;font-size:11px;line-height:1.45}
 `;
}
function labelMode(){return({off:'Wyłączone',rainbow:'Tęcza — kolejny kolor każdej wiadomości',random:'Losowy kolor każdej wiadomości',fixed:'Stały — '+color(fixed()).name})[mode()]}
function refreshPanel(){
 const root=$('#swir-color-mobile-sheet');if(!root)return;
 root.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode()));
 root.querySelectorAll('[data-color]').forEach(b=>b.classList.toggle('active',mode()==='fixed'&&Number(b.dataset.color)===fixed()));
 const s=$('#swir-color-status');if(s){const last=window.__SWIR_MOBILE_COLOR_LAST_SENT;s.innerHTML='Tryb: <b style="color:#fff">'+labelMode()+'</b>'+(last?'<br>Ostatnio: <b style="color:'+color(last.id).css+'">'+color(last.id).name+'</b>':'')+'<br><span style="opacity:.72">Kolor jest wysyłany natywnie i widzą go inni użytkownicy.</span>'}
}
function openColor(){
 installCss();installColor();$('#swir-color-mobile-sheet')?.remove();
 const root=document.createElement('div');root.id='swir-color-mobile-sheet';
 const box=document.createElement('div');box.className='swir-color-box';
 box.innerHTML='<div class="swir-color-head"><b>🌈 Kolorowe pisanie</b><button data-close style="width:44px">✕</button></div><div class="swir-color-modes"><button data-mode="off">⚪ Wyłącz</button><button data-mode="rainbow">🌈 Tęcza</button><button data-mode="random">🎲 Losowy</button><button data-mode="fixed">🎨 Stały</button></div><div class="swir-color-grid"></div><div id="swir-color-status"></div>';
 root.appendChild(box);document.body.appendChild(root);
 const grid=box.querySelector('.swir-color-grid');
 COLORS.forEach(c=>{const b=document.createElement('button');b.className='swir-color-dot';b.dataset.color=String(c.id);b.innerHTML='<i style="background:'+c.css+'"></i><small>'+c.name+'</small>';b.onclick=()=>setFixed(c.id);grid.appendChild(b)});
 box.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
 box.querySelector('[data-close]').onclick=()=>root.remove();root.onclick=e=>{if(e.target===root)root.remove()};
 refreshPanel();
}

function tick(){cleanupNames();installColor()}
installCss();tick();setTimeout(tick,500);setTimeout(tick,1600);setInterval(tick,2200);
const mo=new MutationObserver(()=>{clearTimeout(window.__swir062t);window.__swir062t=setTimeout(cleanupNames,90)});
mo.observe(document.documentElement||document.body,{childList:true,subtree:true});
window.SWIR_COLOR_MOBILE={version:'0.6.2',colors:COLORS,rainbow:RAINBOW,getMode:mode,setMode,setFixed,install:installColor,open:openColor,status:()=>window.__SWIR_MOBILE_COLOR_LAST_SENT||null};
})();
