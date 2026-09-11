/* SWIR 10.18 BETA — ICE DARK TEXT
 * No white/near-white nick or message text in Ice.
 * Targets native .m-msg-item-user-message and preserves Nick Integrity DOM.
 */
(()=>{try{
if(window.__SWIR_ICE1018)return;window.__SWIR_ICE1018=1;
const ROOT=document.documentElement,NICK='[id^="m-messages_"] .m-msg-item-user-login';
const nickPal=['#075985','#0f5f55','#5b3b92','#8a3b12','#8b2459','#185fa8','#246b35','#704214','#4c4f87','#8b3030','#0b6574','#6741a5'];
function isIce(){return ROOT.dataset.swirTheme99==='ice'||ROOT.dataset.swirTheme98==='ice'}
function hash(s){let h=2166136261;for(const c of String(s||'').toLocaleLowerCase('pl-PL')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return Math.abs(h)}
function nickText(el){return String(el?.dataset?.swirCanonicalNick||el?.textContent||'').replace(/:\s*$/,'').trim()}
function applyNick(el){try{if(!el)return;if(isIce()){if(!el.dataset.swirIce1018Saved){el.dataset.swirIce1018Saved=el.style.getPropertyValue('color')||'';el.dataset.swirIce1018Priority=el.style.getPropertyPriority('color')||''}const n=nickText(el);el.style.setProperty('color',nickPal[hash(n)%nickPal.length],'important');el.dataset.swirIce1018='1'}else if(el.dataset.swirIce1018==='1'){const old=el.dataset.swirIce1018Saved||'',p=el.dataset.swirIce1018Priority||'';if(old)el.style.setProperty('color',old,p);else el.style.removeProperty('color');delete el.dataset.swirIce1018;delete el.dataset.swirIce1018Saved;delete el.dataset.swirIce1018Priority}}catch(e){}}
function sweep(root=document){try{if(root?.matches?.(NICK))applyNick(root);root?.querySelectorAll?.(NICK).forEach(applyNick)}catch(e){}}
function installCss(){if(document.getElementById('swirIce1018Css'))return;const s=document.createElement('style');s.id='swirIce1018Css';s.textContent=`
html[data-swir-theme99="ice"],html[data-swir-theme99="ice"] body{background:linear-gradient(180deg,#a9d8f3,#d7effc)!important;color:#18384f!important}
html[data-swir-theme99="ice"] [id^="m-messages_"]{background:linear-gradient(180deg,#f7fcff,#e7f5fd)!important;color:#23384a!important;border:1px solid #5cb0dd!important;box-shadow:0 10px 28px rgba(18,87,128,.16)!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] .m-msg-item{color:#23384a!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] .m-msg-item:nth-child(odd){background:rgba(215,239,252,.58)!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] .m-msg-item:nth-child(even){background:rgba(245,251,255,.72)!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] .m-msg-item-user-message{color:#263b4e!important;text-shadow:none!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] .m-msg-item-user-message[data-col="0"]{color:#24384a!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] .m-msg-item-user-message[data-col="1"]{color:#075985!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] .m-msg-item-user-message[data-col="2"]{color:#3730a3!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] .m-msg-item-user-message[data-col="3"]{color:#9d174d!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] .m-msg-item-user-message[data-col="4"]{color:#475569!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] .m-msg-item-user-message[data-col="5"]{color:#0f766e!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] .m-msg-item-user-message[data-col="6"]{color:#166534!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] .m-msg-item-user-message[data-col="7"]{color:#9a3412!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] .m-msg-item-user-message[data-col="8"]{color:#b45309!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] .m-msg-item-user-message[data-col="9"]{color:#6b4423!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] .m-msg-item-user-message[data-col="10"]{color:#1d4ed8!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] .m-msg-item-user-message[data-col="11"]{color:#b91c1c!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] .m-msg-item-user-message *:not(.m-msg-item-user-login):not(img):not(svg):not(path){color:inherit!important;text-shadow:none!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] .m-msg-item-info{color:#35566f!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] .m-msg-item-error{color:#a11b2b!important}
html[data-swir-theme99="ice"] [id^="m-users_"],html[data-swir-theme99="ice"] .m-usersList,html[data-swir-theme99="ice"] [id^="m-rooms_"],html[data-swir-theme99="ice"] .m-room-list,html[data-swir-theme99="ice"] [id^="m-room-list-"]{background:linear-gradient(180deg,#d9effb,#bee1f4)!important;color:#17384f!important;border-color:#65b2dc!important}
html[data-swir-theme99="ice"] [id^="m-users_"] .m-list-user-item,html[data-swir-theme99="ice"] .m-usersList .m-list-user-item,html[data-swir-theme99="ice"] .m-room-list .m-room{background:#f6fbff!important;color:#18384f!important;border-color:#a6d1e7!important}
html[data-swir-theme99="ice"] [id^="m-users_"] .m-list-user-item *,html[data-swir-theme99="ice"] .m-usersList .m-list-user-item *{color:#18384f!important;text-shadow:none!important}
html[data-swir-theme99="ice"] [id^="m-textMessage-"],html[data-swir-theme99="ice"] .m-search-primary{background:#fff!important;color:#17384f!important;border:1px solid #4fa9d8!important;caret-color:#0f5f8e!important}
html[data-swir-theme99="ice"] [id^="m-textMessage-"]::placeholder,html[data-swir-theme99="ice"] .m-search-primary::placeholder{color:#647f91!important}
html[data-swir-theme99="ice"] #configPanel{background:linear-gradient(180deg,#e6f5fd,#c9e8f7)!important;color:#17384f!important;border-color:#218fc7!important}
html[data-swir-theme99="ice"] #configPanel .sw10-page,html[data-swir-theme99="ice"] #configPanel .sw10-page label,html[data-swir-theme99="ice"] #configPanel .sw10-page p{color:#17384f!important}
html[data-swir-theme99="ice"] #configPanel .sw10-tabs{background:#add7ec!important;border-color:#72b9dc!important}
html[data-swir-theme99="ice"] #configPanel .sw10-tab{background:#eaf7fd!important;color:#214d68!important;border-color:#92c8e3!important}
html[data-swir-theme99="ice"] #configPanel .sw10-tab.active{background:linear-gradient(135deg,#096da5,#1d96c8)!important;color:#fff!important;border-color:#075d8f!important}
html[data-swir-theme99="ice"] #swMix1018Card{background:linear-gradient(180deg,#ffffff,#e7f4fb)!important;color:#17384f!important;border-color:#7fbfdf!important}
html[data-swir-theme99="ice"] #swMix1018Card .swmix1018-style,html[data-swir-theme99="ice"] #swMix1018Card .swmix1018-status{background:#f3faff!important;color:#17384f!important;border-color:#a8d4e8!important}
html[data-swir-theme99="ice"] #swMix1018Card .swmix1018-name,html[data-swir-theme99="ice"] #swMix1018Card .swmix1018-note{color:#496c82!important}
html[data-swir-theme99="ice"] #swMix1018Card .swmix1018-mark{color:#086faa!important}
html[data-swir-theme99="ice"] #swMix1018Toggle{background:#d8eef9!important;color:#144968!important;border-color:#5aa9d0!important}
html[data-swir-theme99="ice"] #swMix1018Toggle.on{background:#0f8c68!important;color:#fff!important;border-color:#087354!important}
html[data-swir-theme99="ice"] #friends-panel.swir-rooms1017{background:linear-gradient(180deg,#e1f3fc,#c4e5f5)!important;color:#17384f!important;border-color:#258fc4!important}
html[data-swir-theme99="ice"] #friends-panel.swir-rooms1017 .rrnick{color:#17384f!important}
html[data-swir-theme99="ice"] #friends-panel.swir-rooms1017 .rrrooms.full{color:#0b6d4f!important}
html[data-swir-theme99="ice"] #friends-panel.swir-rooms1017 .rrrooms.wait{color:#5e7280!important}
`;document.head.appendChild(s)}
function audit(){if(!isIce())return{ice:false};const rows=[...document.querySelectorAll('[id^="m-messages_"] .m-msg-item-user-message')],nicks=[...document.querySelectorAll(NICK)];const nearWhite=el=>{try{const m=getComputedStyle(el).color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);return!!m&&+m[1]>220&&+m[2]>220&&+m[3]>220}catch(e){return false}};return{ice:true,messages:rows.length,nicks:nicks.length,whiteMessages:rows.filter(nearWhite).length,whiteNicks:nicks.filter(nearWhite).length}}
installCss();sweep();let raf=0,roots=new Set();new MutationObserver(ms=>{let themeChange=false;for(const m of ms){if(m.type==='attributes')themeChange=true;for(const n of m.addedNodes||[])if(n?.nodeType===1)roots.add(n)}if(raf)return;raf=requestAnimationFrame(()=>{raf=0;if(themeChange)sweep(document);for(const r of roots)sweep(r);roots.clear()})}).observe(document.documentElement,{attributes:true,attributeFilter:['data-swir-theme99','data-swir-theme98'],childList:true,subtree:true});
window.SWIR_ICE1018={version:'10.18 BETA ICE DARK TEXT',refresh:()=>{installCss();sweep();return audit()},audit};
console.log('SWIR 10.18 ICE dark-text active');
}catch(e){console.error('SWIR ICE 10.18',e)}})();