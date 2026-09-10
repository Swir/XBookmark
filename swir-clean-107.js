/* SWIR 10.7 BETA — CLEAN REBASE overlay
 * Architecture: frozen 10.0 beta base + this single overlay.
 * Radar 9.7 is not replaced. No automatic code-8 friend synchronization.
 */
(()=>{try{
if(window.__SWIR_CLEAN107)return;window.__SWIR_CLEAN107=1;
const VERSION='10.7 BETA — CLEAN REBASE';
const FRIEND_KEY='czateria_znajomi';
const MIX_KEY='swir_mix_write_107';
const MIX_NEXT='swir_mix_next_107';
const TAB_KEY='swir_custom_tab_107';
const MAX_BULK=10;
const key=s=>String(s||'').trim().toLocaleLowerCase('pl-PL');
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch(e){return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const delay=ms=>new Promise(r=>setTimeout(r,ms));
const radar=()=>window.SWIR_RADAR_DEBUG97||window.SWIR_FRIEND_RADAR;
const userStyle=()=>window.CHNS?.userMessageStyle;
let mixOn=localStorage.getItem(MIX_KEY)==='1';
let mixNext=Number(localStorage.getItem(MIX_NEXT));if(mixNext!==0&&mixNext!==1)mixNext=0;
let lastMix=null;
let bulk={running:false,total:0,done:0,current:'',ok:0,fail:0};

const MIX_STYLES=[
 {id:'bi',name:'B + I',desc:'pogrubienie + kursywa',bold:true,italic:true,underline:false},
 {id:'iu',name:'I + U',desc:'kursywa + podkreślenie',bold:false,italic:true,underline:true}
];

function addCss(){
 if(document.getElementById('swirClean107Css'))return;
 const s=document.createElement('style');s.id='swirClean107Css';s.textContent=`
#configPanel.swir-ui{width:min(920px,94vw)!important;max-width:920px!important;height:min(760px,calc(100dvh - 24px))!important;max-height:calc(100dvh - 24px)!important;min-height:0!important;overflow:hidden!important;padding:0!important;box-sizing:border-box!important}
#configPanel.swir-ui>#swirModTabs100{display:flex!important;flex-direction:column!important;width:100%!important;height:100%!important;min-height:0!important;max-height:100%!important;overflow:hidden!important}
#configPanel.swir-ui>#swirModTabs100>.sw10-head,#configPanel.swir-ui>#swirModTabs100>.sw10-status,#configPanel.swir-ui>#swirModTabs100>.sw10-tabs{flex:0 0 auto!important}
#configPanel.swir-ui>#swirModTabs100>.sw10-pages{display:block!important;flex:1 1 auto!important;min-height:0!important;height:auto!important;overflow:hidden!important}
#configPanel.swir-ui #swirModTabs100 .sw10-page{height:100%!important;min-height:0!important;max-height:100%!important;overflow-y:auto!important;overflow-x:hidden!important;overscroll-behavior:contain!important;scrollbar-gutter:stable!important;padding-bottom:62px!important}
#configPanel.swir-ui #swirModTabs100 .sw10-page::-webkit-scrollbar{width:9px!important}#configPanel.swir-ui #swirModTabs100 .sw10-page::-webkit-scrollbar-track{background:rgba(255,255,255,.035)!important;border-radius:10px!important}#configPanel.swir-ui #swirModTabs100 .sw10-page::-webkit-scrollbar-thumb{background:rgba(var(--swir-rgb,0,229,255),.48)!important;border-radius:10px!important}
.sw107-card{padding:14px!important;border:1px solid rgba(var(--swir-rgb,0,229,255),.15)!important;border-radius:13px!important;background:linear-gradient(135deg,rgba(15,25,39,.72),rgba(8,15,27,.78))!important;box-shadow:0 8px 20px rgba(0,0,0,.16)!important;margin:0 0 10px!important}
.sw107-style-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}.sw107-style-grid button{min-height:43px!important}.sw107-style-grid button.active{border-color:var(--sw99-accent,var(--swir-a,#00e5ff))!important;box-shadow:0 0 0 1px rgba(var(--swir-rgb,0,229,255),.17)!important}
.sw107-preview,.sw107-status{margin-top:8px;padding:9px 10px;border-radius:9px;background:rgba(0,0,0,.13);border:1px solid rgba(255,255,255,.06);font-size:10px;color:var(--sw99-text,#eef7ff)}
.sw107-note{font-size:9px;line-height:1.48;color:var(--sw99-muted,#8198aa);margin-top:8px}.sw107-mix-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}.sw107-pattern{padding:11px;border:1px solid rgba(255,255,255,.07);border-radius:10px;background:rgba(255,255,255,.025)}.sw107-pattern b{display:block;margin-bottom:4px}.sw107-pattern span{font-size:9px;color:var(--sw99-muted,#8198aa)}
#sw107MixToggle{width:100%!important;min-height:46px!important;font-weight:900!important}#sw107MixToggle.on{border-color:#55dfa0!important;color:#b9ffda!important;box-shadow:0 0 0 1px #55dfa020!important}
#friends-panel.swir97 #swirFriends107Bar{padding:8px!important;margin:7px 0!important;border:1px solid rgba(var(--swir-rgb,0,229,255),.20)!important;border-radius:9px!important;background:rgba(var(--swir-rgb,0,229,255),.045)!important}
#swirFriends107Bar .sw107-fstats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px;margin-bottom:6px}.sw107-fstat{text-align:center;padding:5px 3px;border:1px solid rgba(255,255,255,.07);border-radius:7px;background:rgba(0,0,0,.12);font-size:8px;color:var(--sw99-muted,#8298ad)}.sw107-fstat b{display:block;font-size:12px;color:var(--sw99-text,#fff)}
#swirFriends107Bar .sw107-factions{display:grid;grid-template-columns:1fr 1.4fr;gap:5px}#swirFriends107Bar button{min-height:32px!important;padding:5px 7px!important;font-size:9px!important;margin:0!important}#swirFriends107Bar .sw107-bulk.ready{border-color:#55dfa0!important;color:#b9ffda!important}#swirFriends107Bar .sw107-bulk:disabled{opacity:.5!important}
#friends-panel.swir97 .r97s[data-sw107-state=global]{color:#63e6a2!important}#friends-panel.swir97 .r97s[data-sw107-state=live]{color:#72d8ff!important}#friends-panel.swir97 .r97s[data-sw107-state=ready]{color:#ffd071!important}#friends-panel.swir97 .r97s[data-sw107-state=app]{color:#a5b5c3!important}#friends-panel.swir97 .r97s[data-sw107-state=wait]{color:#8399ac!important}
#friends-panel.swir97 .r97a [data-x=c]{min-width:52px!important;font-size:8px!important}
html[data-swir-theme99="ice"] .sw107-card,html[data-swir-theme99="ice"] #friends-panel.swir97 #swirFriends107Bar{background:linear-gradient(180deg,#fff,#edf8ff)!important;color:#17324a!important;border-color:#a8d7f1!important}
html[data-swir-theme99="ice"] .sw107-preview,html[data-swir-theme99="ice"] .sw107-status,html[data-swir-theme99="ice"] .sw107-pattern,html[data-swir-theme99="ice"] .sw107-fstat{background:#fff!important;color:#17324a!important;border-color:#c3deec!important}
html[data-swir-theme99="ice"] .sw107-note,html[data-swir-theme99="ice"] .sw107-pattern span{color:#526f83!important}
html[data-swir-theme99="ice"] #configPanel.swir-ui .sw10-title,html[data-swir-theme99="ice"] #configPanel.swir-ui .sw10-title b,html[data-swir-theme99="ice"] #configPanel.swir-ui .sw10-sub,html[data-swir-theme99="ice"] #configPanel.swir-ui .sw10-stat,html[data-swir-theme99="ice"] #configPanel.swir-ui .sw10-stat strong,html[data-swir-theme99="ice"] #configPanel.swir-ui .sw10-tab,html[data-swir-theme99="ice"] #configPanel.swir-ui .sw10-tab.active,html[data-swir-theme99="ice"] #configPanel.swir-ui .sw10-close,html[data-swir-theme99="ice"] #configPanel.swir-ui .sw10-note,html[data-swir-theme99="ice"] #configPanel.swir-ui .sw10-page p,html[data-swir-theme99="ice"] #configPanel.swir-ui .sw10-page label{color:#17324a!important;text-shadow:none!important}
html[data-swir-theme99="ice"] #configPanel.swir-ui .sw10-tab.active{background:linear-gradient(135deg,#d9f2ff,#e7e4ff)!important;border-color:#159ee8!important}
html[data-swir-theme99="ice"] #configPanel.swir-ui .sw10-search,html[data-swir-theme99="ice"] #configPanel.swir-ui .sw10-page input,html[data-swir-theme99="ice"] #configPanel.swir-ui .sw10-page textarea,html[data-swir-theme99="ice"] #configPanel.swir-ui .sw10-page select{background:#fff!important;color:#17324a!important;border-color:#9ccfe9!important}
@supports not (height:100dvh){#configPanel.swir-ui{height:min(760px,calc(100vh - 24px))!important;max-height:calc(100vh - 24px)!important}}
@media(max-width:760px){#configPanel.swir-ui{width:96vw!important;height:calc(100dvh - 14px)!important;max-height:calc(100dvh - 14px)!important}.sw107-style-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.sw107-mix-grid{grid-template-columns:1fr}#configPanel.swir-ui #swirModTabs100 .sw10-page{padding-bottom:72px!important}}
 `;
 document.head.appendChild(s);
}

function removeImageLab(){
 try{
  document.querySelectorAll('#swirImage92Native,#swirImage92Diag,#swirImage92Info,#swirImageLab,#swir-image-lab').forEach(x=>x.remove());
  document.querySelectorAll('#swirColor92Section h3,#swirColor92Section h4').forEach(h=>{
   if(/image\s*lab|image\s*diagn/i.test(h.textContent||'')){
    const box=h.parentElement;if(box&&box.id!=='swirColor92Section')box.remove();else h.remove();
   }
  });
  try{delete window.SWIR_IMAGE_LAB}catch(e){}
  window.SWIR_IMAGE_LAB=undefined;
 }catch(e){}
}

function shell(){return document.querySelector('#configPanel #swirModTabs100')}
function activateCustom(name){
 const sh=shell();if(!sh)return;
 sh.querySelectorAll('.sw10-tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));
 sh.querySelectorAll('.sw10-page').forEach(p=>p.classList.toggle('active',p.dataset.page===name));
 localStorage.setItem(TAB_KEY,name);
 if(name==='kolory107')renderManual();
 if(name==='mix107')renderMix();
}

function ensureTheme(){
 const sh=shell(),page=sh?.querySelector('.sw10-page[data-page="motywy"]'),api=window.SWIR_UI99||window.SWIR_UI98;
 if(!sh||!page||!api?.themes||!api?.applyTheme)return false;
 let d=document.getElementById('swirTheme99')||document.getElementById('swirTheme98');
 if(!d){try{api.refresh?.()}catch(e){};d=document.getElementById('swirTheme99')||document.getElementById('swirTheme98')}
 if(!d){
  d=document.createElement('div');d.id='swirTheme99';
  d.innerHTML='<h3>🎨 Motyw całego czatu</h3><div class="swir99-theme-grid">'+Object.entries(api.themes).map(([id,t])=>`<button type="button" class="swir99-theme-btn" data-swir-theme99-btn="${esc(id)}">${esc(t.name||id)}</button>`).join('')+'</div><div style="margin-top:7px;font-size:9px;color:var(--sw99-muted,#71869a)">⚡ CLEAN 10.7 — motywy są dostępne od razu.</div>';
 }
 if(d.parentElement!==page)page.prepend(d);
 d.querySelectorAll('[data-swir-theme99-btn]').forEach(b=>{
  if(b.dataset.sw107Theme)return;b.dataset.sw107Theme='1';
  b.addEventListener('click',()=>{api.applyTheme?.(b.dataset.swirTheme99Btn);requestAnimationFrame(()=>{sweepNicks();refreshThemeButtons()})});
 });
 refreshThemeButtons();
 page.querySelectorAll('.sw10-empty').forEach(x=>x.remove());
 return true;
}
function refreshThemeButtons(){
 const cur=document.documentElement.dataset.swirTheme99||localStorage.getItem('swir_theme_99')||localStorage.getItem('swir_theme_98')||'gaming';
 document.querySelectorAll('[data-swir-theme99-btn]').forEach(b=>b.classList.toggle('active',b.dataset.swirTheme99Btn===cur));
}

/* ===== native writing ===== */
function styleState(){
 const x=userStyle();return{bold:!!x?.isBoldMsg?.(),italic:!!x?.isItalicMsg?.(),underline:!!x?.isUnderlineMsg?.()};
}
function persistStyle(k,v){
 try{const s=CHNS?.settingsManager?.getSettings?.();if(k==='bold')s?.setUserFontBold?.(+v);if(k==='italic')s?.setUserFontItalic?.(+v);if(k==='underline')s?.setUserFontUnderline?.(+v)}catch(e){}
}
function setManual(target){
 const x=userStyle();if(!x)return false;
 const cur=styleState();
 try{
  if(cur.bold!==!!target.bold){x.changeTextBoldStyle?.();persistStyle('bold',!!target.bold)}
  if(cur.italic!==!!target.italic){x.changeTextItalicStyle?.();persistStyle('italic',!!target.italic)}
  if(cur.underline!==!!target.underline){x.changeTextUnderlineStyle?.();persistStyle('underline',!!target.underline)}
  renderManual();return true;
 }catch(e){return false}
}
function toggleManual(k){const s=styleState();s[k]=!s[k];return setManual(s)}
function normal(){return setManual({bold:false,italic:false,underline:false})}
function manualCard(){
 const d=document.createElement('div');d.id='sw107ManualStyles';d.className='sw107-card';
 d.innerHTML='<h3>✍️ Styl wiadomości — natywny CZATeria</h3><div class="sw107-style-grid"><button type="button" data-style="bold"><b>B</b> Pogrubienie</button><button type="button" data-style="italic"><i>I</i> Kursywa</button><button type="button" data-style="underline"><u>U</u> Podkreślenie</button><button type="button" data-style="normal">Aa Normalne</button></div><div class="sw107-preview"></div><div class="sw107-note">B/I/U korzysta z oryginalnego <b>userMessageStyle</b> i natywnych pól wiadomości. Tekst, linki i komendy nie są przerabiane.</div>';
 d.querySelector('[data-style=bold]').onclick=()=>toggleManual('bold');
 d.querySelector('[data-style=italic]').onclick=()=>toggleManual('italic');
 d.querySelector('[data-style=underline]').onclick=()=>toggleManual('underline');
 d.querySelector('[data-style=normal]').onclick=normal;
 return d;
}
function renderManual(){
 const d=document.getElementById('sw107ManualStyles');if(!d)return;
 const s=styleState();
 ['bold','italic','underline'].forEach(k=>d.querySelector(`[data-style="${k}"]`)?.classList.toggle('active',s[k]));
 const p=d.querySelector('.sw107-preview');if(p){p.style.fontWeight=s.bold?'800':'400';p.style.fontStyle=s.italic?'italic':'normal';p.style.textDecoration=s.underline?'underline':'none';p.textContent='Podgląd: natywny styl kolejnej wiadomości'}
}
function mixCard(){
 const d=document.createElement('div');d.id='sw107MixCard';d.className='sw107-card';
 d.innerHTML='<h3>🔀 MIX pisania</h3><div class="sw107-note" style="margin-top:0">Naprzemiennie stosuje dwa natywne style. Komendy zaczynające się od <b>/</b> są pomijane, a po wysłaniu wraca Twój ręczny styl.</div><div class="sw107-mix-grid"><div class="sw107-pattern"><b>B + <i>I</i></b><span>Pogrubienie + kursywa</span></div><div class="sw107-pattern"><b><i>I</i> + <u>U</u></b><span>Kursywa + podkreślenie</span></div></div><button type="button" id="sw107MixToggle"></button><div id="sw107MixStatus" class="sw107-status"></div>';
 d.querySelector('#sw107MixToggle').onclick=()=>setMix(!mixOn);return d;
}
function setMix(v){mixOn=!!v;localStorage.setItem(MIX_KEY,mixOn?'1':'0');renderMix()}
function renderMix(){
 const b=document.getElementById('sw107MixToggle'),s=document.getElementById('sw107MixStatus'),next=MIX_STYLES[mixNext];
 if(b){b.classList.toggle('on',mixOn);b.textContent=mixOn?'🟢 MIX WŁĄCZONY — B+I ↔ I+U':'⚪ MIX WYŁĄCZONY'}
 if(s)s.innerHTML='<b>Status:</b> '+(mixOn?'AKTYWNY':'WYŁĄCZONY')+(lastMix?'<br>Ostatnio: <b>'+esc(lastMix.name)+'</b> — '+esc(lastMix.desc):'')+'<br>Następny styl: <b>'+esc(next.name)+'</b> — '+esc(next.desc);
}
function ensureWriting(){
 const sh=shell(),tabs=sh?.querySelector('.sw10-tabs'),pages=sh?.querySelector('.sw10-pages');
 if(!sh||!tabs||!pages||!userStyle())return false;
 removeImageLab();
 let color=document.getElementById('swirColor92Section');if(!color)return false;
 let cp=pages.querySelector('.sw10-page[data-page="kolory107"]');
 if(!cp){cp=document.createElement('div');cp.className='sw10-page';cp.dataset.page='kolory107';pages.appendChild(cp)}
 if(color.parentElement!==cp)cp.appendChild(color);
 color.style.display='block';
 if(!cp.querySelector('#sw107ManualStyles'))cp.appendChild(manualCard());
 let mp=pages.querySelector('.sw10-page[data-page="mix107"]');
 if(!mp){mp=document.createElement('div');mp.className='sw10-page';mp.dataset.page='mix107';pages.appendChild(mp)}
 if(!mp.querySelector('#sw107MixCard'))mp.appendChild(mixCard());
 let ct=tabs.querySelector('.sw10-tab[data-tab="kolory107"]');
 if(!ct){ct=document.createElement('button');ct.type='button';ct.className='sw10-tab';ct.dataset.tab='kolory107';ct.textContent='🌈 Kolorowe pisanie';const mot=tabs.querySelector('[data-tab="motywy"]');tabs.insertBefore(ct,mot||tabs.children[1]||null)}
 let mt=tabs.querySelector('.sw10-tab[data-tab="mix107"]');
 if(!mt){mt=document.createElement('button');mt.type='button';mt.className='sw10-tab';mt.dataset.tab='mix107';mt.textContent='🔀 MIX pisania';ct.insertAdjacentElement('afterend',mt)}
 if(!ct.dataset.sw107Bound){ct.dataset.sw107Bound='1';ct.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();activateCustom('kolory107')},true)}
 if(!mt.dataset.sw107Bound){mt.dataset.sw107Bound='1';mt.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();activateCustom('mix107')},true)}
 const saved=localStorage.getItem(TAB_KEY);if(saved==='kolory107'||saved==='mix107')activateCustom(saved);
 renderManual();renderMix();return true;
}
function installMixHook(){
 const proto=window.CHNS?.Channel?.prototype;if(!proto||typeof proto.sendMessage!=='function')return false;
 if(proto.sendMessage.__swirMix107)return true;
 const original=proto.sendMessage;
 function wrapped(e){
  const raw=String(e?.value||'').trim();
  if(!mixOn||!raw||raw.startsWith('/'))return original.apply(this,arguments);
  const x=userStyle();if(!x)return original.apply(this,arguments);
  const before=styleState(),chosen=MIX_STYLES[mixNext];
  try{
   /* exact internal fields bold/italic/underline were verified in CZATeria source;
      direct temporary assignment avoids changing saved toolbar preferences. */
   x.bold=chosen.bold;x.italic=chosen.italic;x.underline=chosen.underline;
   const result=original.apply(this,arguments);
   lastMix=chosen;mixNext=mixNext===0?1:0;localStorage.setItem(MIX_NEXT,String(mixNext));
   setTimeout(renderMix,0);return result;
  }finally{
   x.bold=before.bold;x.italic=before.italic;x.underline=before.underline;
  }
 }
 wrapped.__swirMix107=1;wrapped.__swirMix107Original=original;proto.sendMessage=wrapped;return true;
}

/* ===== clean nick colors, no glow ===== */
function parseRgb(c){const m=String(c||'').match(/rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/i);return m?[+m[1],+m[2],+m[3]]:null}
function rgbCss(a){return `rgb(${a[0]}, ${a[1]}, ${a[2]})`}
function mixRgb(a,b,t){return a.map((v,i)=>Math.round(v+(b[i]-v)*t))}
function theme(){return document.documentElement.dataset.swirTheme99||'gaming'}
function mapNick(rgb){
 if(!rgb)return theme()==='ice'?[22,91,125]:[117,222,240];
 const hi=Math.max(...rgb),lo=Math.min(...rgb),avg=(rgb[0]+rgb[1]+rgb[2])/3;
 if(theme()==='ice'){
  if(hi<45)return[0,118,138];
  if(avg>215&&hi-lo<40)return[18,105,142];
  if(avg>190)return mixRgb(rgb,[25,75,105],.48);
  if(avg<75)return mixRgb(rgb,[0,118,160],.55);
  return rgb;
 }
 if(hi<45)return[40,220,210];
 if(avg<92)return mixRgb(rgb,[185,225,245],.48);
 return rgb;
}
function nickText(el){return String(el?.childNodes?.[0]?.textContent||el?.textContent||'').replace(/\s*:\s*$/,'').trim()}
function decorateNick(el){
 try{
  if(!el||el.matches('.m-msg-item-image-user-login'))return;
  if(!el.dataset.swir107Native){
   el.style.removeProperty('color');el.style.removeProperty('font-weight');el.style.removeProperty('text-shadow');el.style.removeProperty('animation');el.style.removeProperty('transition');el.style.removeProperty('filter');
   const c=getComputedStyle(el).color;el.dataset.swir107Native=c||'rgb(220,230,240)';
  }
  const rgb=parseRgb(el.dataset.swir107Native),mapped=mapNick(rgb);
  el.dataset.swir99nick='1';el.dataset.swir107nick='1';
  el.style.setProperty('color',rgbCss(mapped),'important');
  el.style.setProperty('font-weight','750','important');
  el.style.setProperty('text-shadow','none','important');
  el.style.setProperty('animation','none','important');
  el.style.setProperty('transition','none','important');
  el.style.setProperty('filter','none','important');
  void nickText(el);
 }catch(e){}
}
function sweepNicks(root=document){if(root?.matches?.('[id^="m-messages_"] .m-msg-item-user-login:not(.m-msg-item-image-user-login)'))decorateNick(root);root.querySelectorAll?.('[id^="m-messages_"] .m-msg-item-user-login:not(.m-msg-item-image-user-login)').forEach(decorateNick)}

/* ===== Friends UX over Radar 9.7 ===== */
function friends(){const a=load(FRIEND_KEY,[]);return Array.isArray(a)?a.filter(Boolean):[]}
function serverState(){try{return radar()?.serverState?.()||{users:{}}}catch(e){return{users:{}}}}
function identity(n){try{return radar()?.identity?.(n)||null}catch(e){return null}}
function channelName(ch){try{return String(ch?.getChannelName?.()||ch?.channelName||'').trim()}catch(e){return''}}
function liveRooms(n){
 const out=new Set();try{
  const cm=CHNS?.channelManager?.channels||{},mgr=CHNS?.connManager;
  Object.values(cm).forEach(ch=>{try{
   const id=ch?.getChannelId?.();if(id==null)return;
   const c=mgr?.getConnectionRelatedWithId?.(id);if(c?.getUserWithName?.(n)){const r=channelName(ch)||String(c?.channelName||'').trim();if(r)out.add(r)}
  }catch(e){}})
 }catch(e){}
 return[...out];
}
function friendSnapshot(){
 const local=friends(),srv=serverState().users||{},rows=local.map(n=>{
  const rec=srv[key(n)]||null,id=Number(identity(n)?.id||0)||0,live=liveRooms(n),rooms=[...new Set((rec?.rooms||[]).filter(Boolean))];
  return{name:n,k:key(n),id,app:!!rec,rooms,live};
 });
 return{rows,total:rows.length,app:rows.filter(x=>x.app).length,global:rows.filter(x=>x.app&&x.rooms.length).length,ready:rows.filter(x=>!x.app&&x.id).length,noid:rows.filter(x=>!x.app&&!x.id).length};
}
function friendStatus(x){
 if(x.app&&x.rooms.length)return{state:'global',text:'🟢 ONLINE GLOBALNIE • '+x.rooms.join(', ')};
 if(x.live.length)return{state:'live',text:'👁 ONLINE LOKALNIE • '+x.live.join(', ')+(x.app?' • APP nie podał teraz rooms[]':x.id?' • ID '+x.id:'')};
 if(x.app)return{state:'app',text:'⚪ APP • brak aktywnego pokoju'};
 if(x.id)return{state:'ready',text:'🟡 GOTOWY DO APP • ID '+x.id+' • kliknij ☁ APP'};
 return{state:'wait',text:'🕒 BRAK ID • SWIR musi zobaczyć nick w otwartym pokoju/privie'};
}
function bulkLabel(s){
 if(bulk.running)return`☁ Synchronizacja ${bulk.done}/${bulk.total} • ${bulk.current||'...'}`;
 return`☁ Synchronizuj gotowych (${s.ready})`;
}
function barHtml(s){return`<div class="sw107-fstats"><div class="sw107-fstat"><b>${s.total}</b>SWIR</div><div class="sw107-fstat"><b>${s.app}</b>APP</div><div class="sw107-fstat"><b>${s.global}</b>GLOBAL</div><div class="sw107-fstat"><b>${s.ready}</b>GOTOWI</div></div><div class="sw107-factions"><button type="button" class="sw107-refresh">📡 Odśwież APP</button><button type="button" class="sw107-bulk ${s.ready?'ready':''}" ${s.ready&&!bulk.running?'':'disabled'}>${esc(bulkLabel(s))}</button></div><div class="sw107-note">GLOBAL wymaga relacji APP i odpowiedzi 159/rooms[]. <b>GOTOWY DO APP</b> znaczy, że Radar zna prawdziwy userId. Synchronizacja jest tylko po Twoim kliknięciu — nic nie dodaje automatycznie przy starcie.</div>`}
async function syncReady(){
 if(bulk.running)return false;
 const s=friendSnapshot(),ready=s.rows.filter(x=>!x.app&&x.id).slice(0,MAX_BULK);
 if(!ready.length){toast107('Brak znajomych gotowych do synchronizacji APP.');return false}
 bulk={running:true,total:ready.length,done:0,current:'',ok:0,fail:0};enhanceFriendsPanel(document.getElementById('friends-panel'));
 for(let i=0;i<ready.length;i++){
  const x=ready[i];bulk.current=x.name;enhanceFriendsPanel(document.getElementById('friends-panel'));
  let ok=false;try{ok=radar()?.syncOne?.(x.name,1)===true}catch(e){}
  ok?bulk.ok++:bulk.fail++;bulk.done=i+1;enhanceFriendsPanel(document.getElementById('friends-panel'));
  if(i<ready.length-1)await delay(8500);
 }
 await delay(4600);try{radar()?.requestServerState?.(1)}catch(e){}
 const msg=`APP sync: ${bulk.ok} OK${bulk.fail?`, ${bulk.fail} pominięto/odrzucono`:''}.`;
 bulk.running=false;bulk.current='';toast107(msg);enhanceFriendsPanel(document.getElementById('friends-panel'));return true;
}
function toast107(m){
 try{let d=document.getElementById('swir107toast');if(!d){d=document.createElement('div');d.id='swir107toast';d.style.cssText='position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:2147483645;background:#081522;color:#eef8ff;border:1px solid var(--sw99-accent,#00e5ff);border-radius:10px;padding:9px 13px;font:11px Segoe UI,Arial;box-shadow:0 12px 34px #0009';document.body.appendChild(d)}d.textContent=m;clearTimeout(d._t);d._t=setTimeout(()=>d.remove(),4200)}catch(e){}
}
function bindFriendBar(bar){
 if(bar.dataset.bound107)return;bar.dataset.bound107='1';
 bar.querySelector('.sw107-refresh')?.addEventListener('click',()=>{try{radar()?.scan?.();const ok=radar()?.requestServerState?.(0);toast107(ok===false?'Radar ma cooldown — spróbuj za chwilę.':'📡 Pobieram świeży stan APP…')}catch(e){}});
 bar.querySelector('.sw107-bulk')?.addEventListener('click',()=>syncReady());
}
function enhanceFriendsPanel(p){
 try{
  if(!p?.classList?.contains('swir97'))return false;
  const s=friendSnapshot(),map=new Map(s.rows.map(x=>[x.k,x]));
  const h=p.querySelector('.r97h');
  if(h&&!h.querySelector('.sw107-badge')){const b=document.createElement('i');b.className='r97b sw107-badge';b.textContent='CLEAN 10.7';h.insertBefore(b,h.querySelector(':scope > span')||null)}
  let bar=p.querySelector('#swirFriends107Bar');
  if(!bar){bar=document.createElement('div');bar.id='swirFriends107Bar';h?.insertAdjacentElement('afterend',bar)}
  if(bar){const html=barHtml(s);if(bar.dataset.html107!==html){bar.dataset.html107=html;bar.innerHTML=html}bindFriendBar(bar)}
  p.querySelectorAll('.r97r').forEach(row=>{
   const n=row.dataset.n||'',x=map.get(key(n)),st=x?friendStatus(x):null,txt=row.querySelector('.r97s');
   if(txt&&st&&txt.dataset.sw107Text!==st.text){txt.dataset.sw107Text=st.text;txt.textContent=st.text;txt.dataset.sw107State=st.state}
   const c=row.querySelector('.r97a [data-x=c]');if(c){c.textContent='☁ APP';c.title='Dodaj tego znajomego do oficjalnej relacji APP, aby 159 mogło zwracać globalne rooms[]'}
  });
  return true;
 }catch(e){return false}
}
function watchFriendsPanel(p){
 if(!p||p.__sw107watch)return;p.__sw107watch=1;let raf=0;
 const mo=new MutationObserver(()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;enhanceFriendsPanel(p)})});
 mo.observe(p,{childList:true,subtree:true});enhanceFriendsPanel(p);
}
function ensureFriendsDashboard(){
 const d=document.getElementById('swirFriendsDash100');if(!d)return;
 const h=d.querySelector('h3');if(h)h.textContent='🧑‍🤝‍🧑 Znajomi — Radar 9.7 / CLEAN 10.7';
 const note=d.querySelector('.sw10-note');if(note)note.innerHTML='Radar 9.7 pozostaje nietknięty. <b>Globalna lokalizacja</b> pochodzi z oficjalnego APP rooms[]. Jeśli masz ID, ale nie APP, użyj synchronizacji ręcznie.';
 const acts=d.querySelector('.sw10-actions');if(acts&&!d.querySelector('#sw107SyncReady')){const b=document.createElement('button');b.id='sw107SyncReady';b.type='button';b.textContent='☁ Synchronizuj gotowych';b.onclick=()=>syncReady();acts.appendChild(b)}
}

/* ===== notifications / header cleanup ===== */
function cleanNotify(){
 try{
  const api=window.SWIR_NOTIFY100;if(api?.settings?.().vip)api.set?.('vip','');
  const vip=document.getElementById('sn100vip');if(vip)vip.remove();
  const h=document.querySelector('#swirNotify100>h3');if(h)h.textContent='🔔 Powiadomienia 10.7 — sprawdzony silnik 10.0';
 }catch(e){}
}
function labels(){
 const sh=shell();if(!sh)return false;
 const b=sh.querySelector('.sw10-beta');if(b)b.textContent='10.7 BETA';
 const sub=sh.querySelector('.sw10-sub');if(sub)sub.textContent='CLEAN REBASE • zamrożona baza 10.0 • Radar 9.7 • jedna warstwa 10.7';
 cleanNotify();ensureFriendsDashboard();return true;
}

function diagnostics(){
 const f=friendSnapshot(),s=styleState();
 const out={version:VERSION,base10:!!window.SWIR_NOTIFY100,tabs:!!shell(),radar:radar()?.version||'BRAK',theme:document.documentElement.dataset.swirTheme99||'?',friends:f.total,app:f.app,global:f.global,readyToApp:f.ready,noId:f.noid,writing:s,mix:mixOn,processedNicks:document.querySelectorAll('[data-swir107nick="1"]').length,imageLab:!!window.SWIR_IMAGE_LAB};
 console.table(out);return out;
}
function refresh(){
 addCss();removeImageLab();labels();ensureTheme();ensureWriting();installMixHook();sweepNicks();const p=document.getElementById('friends-panel');if(p?.classList?.contains('swir97'))watchFriendsPanel(p);refreshThemeButtons();return diagnostics();
}

/* one global observer for dynamically created UI/messages */
addCss();removeImageLab();
let raf=0;
const bodyMo=new MutationObserver(ms=>{
 let need=false;
 for(const m of ms)for(const n of m.addedNodes||[])if(n?.nodeType===1){
  if(n.matches?.('.m-msg-item-user-login')||n.querySelector?.('.m-msg-item-user-login'))setTimeout(()=>sweepNicks(n),0);
  const p=n.id==='friends-panel'?n:n.querySelector?.('#friends-panel');if(p?.classList?.contains('swir97'))watchFriendsPanel(p);
  if(n.id==='configPanel'||n.querySelector?.('#configPanel')||n.id==='swirColor92Section')need=true;
 }
 if(need&&!raf)raf=requestAnimationFrame(()=>{raf=0;labels();ensureTheme();ensureWriting();installMixHook();cleanNotify()});
});
bodyMo.observe(document.body,{childList:true,subtree:true});
new MutationObserver(()=>requestAnimationFrame(()=>{sweepNicks();refreshThemeButtons()})).observe(document.documentElement,{attributes:true,attributeFilter:['data-swir-theme99','data-swir-theme98']});
document.addEventListener('click',e=>{
 if(e.target?.closest?.('#btnConfig'))requestAnimationFrame(()=>{labels();ensureTheme();ensureWriting();cleanNotify()});
 if(e.target?.closest?.('[id^="m-op_1_"],[id^="m-op_2_"],[id^="m-op_3_"]'))setTimeout(renderManual,0);
},true);
window.addEventListener('resize',()=>requestAnimationFrame(labels),{passive:true});

/* bounded boot retry only; no permanent polling added by 10.7 */
let tries=0;
(function boot(){
 tries++;const a=labels(),b=ensureTheme(),c=ensureWriting(),d=installMixHook();
 sweepNicks();const p=document.getElementById('friends-panel');if(p?.classList?.contains('swir97'))watchFriendsPanel(p);
 if(!(a&&b&&c&&d)&&tries<50)setTimeout(boot,120);
 else{window.SWIR_CLOUD_VERSION=VERSION;console.log('✅ SWIR 10.7 CLEAN REBASE gotowy',diagnostics())}
})();

window.SWIR_CLEAN107={version:VERSION,refresh,diagnostics,friends:friendSnapshot,syncReady,writing:{state:styleState,setManual,normal,mixEnabled:()=>mixOn,setMix,next:()=>MIX_STYLES[mixNext]}};
}catch(e){console.error('SWIR 10.7 CLEAN REBASE',e)}})();
