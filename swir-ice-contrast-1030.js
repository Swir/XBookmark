/* SWIR 10.30 BETA — ICE READABILITY GUARD
 * Keeps the 10.29 architecture unchanged and only repairs low-contrast text
 * inside the native message stream when the ICE theme is active.
 */
(()=>{try{
if(window.__SWIR_ICE_CONTRAST1030)return;window.__SWIR_ICE_CONTRAST1030=1;
const ROOT=document.documentElement;
const MSG='.m-msg-item-user-message,.m-msg-item-text,.m-msg-item-content';
const ROW='.m-msg-item';
const SKIP='.m-msg-item-user-login,img,svg,path,video,canvas';
const DARK='#17384f';
const INFO='#35566f';
function isIce(){return ROOT.dataset.swirTheme99==='ice'||ROOT.dataset.swirTheme98==='ice'}
function rgb(c){const m=String(c||'').match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);return m?[+m[1],+m[2],+m[3]]:null}
function tooLight(el){try{const c=rgb(getComputedStyle(el).color);if(!c)return false;const [r,g,b]=c;const y=.2126*r+.7152*g+.0722*b;return y>185||(r>205&&g>205&&b>205)}catch(e){return false}}
function force(el,color=DARK){try{if(!el||el.matches?.(SKIP))return;if(tooLight(el)){el.style.setProperty('color',color,'important');el.style.setProperty('text-shadow','none','important');el.style.setProperty('opacity','1','important');el.dataset.swirIceContrast1030='1'}}catch(e){}}
function repairMessage(el){try{if(!isIce()||!el)return;force(el,DARK);el.querySelectorAll?.('*').forEach(n=>{if(n.closest?.('.m-msg-item-user-login'))return;force(n,DARK)})}catch(e){}}
function repairRow(row){try{if(!isIce()||!row)return;row.querySelectorAll?.(MSG).forEach(repairMessage);row.querySelectorAll?.('.m-msg-item-info,.m-msg-item-system,.m-msg-item-error').forEach(n=>force(n,INFO))}catch(e){}}
function sweep(root=document){try{if(!isIce())return;if(root?.matches?.(MSG))repairMessage(root);if(root?.matches?.(ROW))repairRow(root);root?.querySelectorAll?.(MSG).forEach(repairMessage);root?.querySelectorAll?.(ROW).forEach(repairRow)}catch(e){}}
function css(){if(document.getElementById('swirIceContrast1030Css'))return;const s=document.createElement('style');s.id='swirIceContrast1030Css';s.textContent=`
html[data-swir-theme99="ice"] .m-msg-item-user-message,
html[data-swir-theme99="ice"] .m-msg-item-text,
html[data-swir-theme99="ice"] .m-msg-item-content,
html[data-swir-theme98="ice"] .m-msg-item-user-message,
html[data-swir-theme98="ice"] .m-msg-item-text,
html[data-swir-theme98="ice"] .m-msg-item-content{color:${DARK}!important;text-shadow:none!important;opacity:1!important;visibility:visible!important;filter:none!important}
html[data-swir-theme99="ice"] .m-msg-item-user-message *:not(.m-msg-item-user-login),
html[data-swir-theme99="ice"] .m-msg-item-text *:not(.m-msg-item-user-login),
html[data-swir-theme99="ice"] .m-msg-item-content *:not(.m-msg-item-user-login),
html[data-swir-theme98="ice"] .m-msg-item-user-message *:not(.m-msg-item-user-login),
html[data-swir-theme98="ice"] .m-msg-item-text *:not(.m-msg-item-user-login),
html[data-swir-theme98="ice"] .m-msg-item-content *:not(.m-msg-item-user-login){text-shadow:none!important;opacity:1!important;visibility:visible!important}
html[data-swir-theme99="ice"] .m-msg-item-info,html[data-swir-theme99="ice"] .m-msg-item-system,
html[data-swir-theme98="ice"] .m-msg-item-info,html[data-swir-theme98="ice"] .m-msg-item-system{color:${INFO}!important;opacity:1!important}
`;document.head.appendChild(s)}
function audit(){const msgs=[...document.querySelectorAll(MSG)];return{ice:isIce(),messages:msgs.length,lightMessages:msgs.filter(tooLight).length,repaired:document.querySelectorAll('[data-swir-ice-contrast1030="1"]').length}}
css();sweep();
let raf=0,roots=new Set();
new MutationObserver(ms=>{let theme=false;for(const m of ms){if(m.type==='attributes')theme=true;for(const n of m.addedNodes||[])if(n?.nodeType===1)roots.add(n)}if(raf)return;raf=requestAnimationFrame(()=>{raf=0;if(theme)sweep(document);for(const r of roots)sweep(r);roots.clear()})}).observe(ROOT,{attributes:true,attributeFilter:['data-swir-theme99','data-swir-theme98'],childList:true,subtree:true});
document.addEventListener('click',e=>{if(e.target?.closest?.('[data-swir-theme99-btn],[data-swir-theme98-btn],#btnConfig'))setTimeout(()=>sweep(document),30)},true);
window.SWIR_ICE_CONTRAST1030={version:'10.30 BETA ICE READABILITY GUARD',refresh:()=>{css();sweep();return audit()},audit};
console.log('SWIR 10.30 ICE readability guard active');
}catch(e){console.error('SWIR ICE contrast 10.30',e)}})();