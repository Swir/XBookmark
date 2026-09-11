/* SWIR 10.13 — CLEAN RECOVERY
 * Removes SWIR-injected emoji/badges from native nick surfaces and Friend Radar rows.
 * Does NOT alter user-authored message text.
 * Clears only transient 10.12 reliability state; preserves friend lists, userId cache and server state.
 */
(()=>{try{
if(window.__SWIR_CLEAN_RECOVERY1013)return;window.__SWIR_CLEAN_RECOVERY1013=1;
const MSG_NICK='[id^="m-messages_"] .m-msg-item-user-login';
const USER_NICK='[id^="m-users_"] .m-list-user-item,.m-usersList .m-list-user-item';
const SWIR_BADGES='.swir-mobile-99,.swir-mobile-98,.swir-mobile-97,[data-swir-mobile-badge],[class*="swir-mobile"]';
const PHONE_RE=/[📱📲☎️☎]/gu;
let removed=0;
try{localStorage.removeItem('swir_friend_reliability_1012')}catch(e){}
function cleanMessageNick(el){try{
 if(!el?.matches?.(MSG_NICK))return;
 el.querySelectorAll(SWIR_BADGES).forEach(x=>{x.remove();removed++});
 [...el.childNodes].forEach(n=>{
   if(n.nodeType===3&&PHONE_RE.test(n.textContent||'')){
     n.textContent=String(n.textContent||'').replace(PHONE_RE,'').replace(/\s{2,}/g,' ');
     removed++;
   }else if(n.nodeType===1){
     const e=n;
     const swir=e.matches?.('[class^="swir-"],[class*=" swir-"],[data-swir-mobile-badge]');
     const phone=PHONE_RE.test(e.textContent||'');
     if(swir&&phone){e.remove();removed++}
   }
 });
 // Keep the native nick parser safe: no SWIR child decorations inside the login element.
 el.querySelectorAll('[class^="swir-mobile"],[class*=" swir-mobile"],[data-swir-mobile-badge]').forEach(x=>{x.remove();removed++});
 el.dataset.swir1013Clean='1';
}catch(e){}}
function cleanFriendPanel(root=document){try{
 root.querySelectorAll?.('#friends-panel .r97b').forEach(b=>{
   if(PHONE_RE.test(b.textContent||'')){b.remove();removed++}
 });
 root.querySelectorAll?.('#friends-panel [class*="swir-mobile"],#friends-panel [data-swir-mobile-badge]').forEach(x=>{x.remove();removed++});
}catch(e){}}
function scan(root=document){try{
 if(root?.matches?.(MSG_NICK))cleanMessageNick(root);
 root?.querySelectorAll?.(MSG_NICK).forEach(cleanMessageNick);
 cleanFriendPanel(root===document?document:(root?.querySelectorAll?root:document));
}catch(e){}}
if(!document.getElementById('swirClean1013Css')){const s=document.createElement('style');s.id='swirClean1013Css';s.textContent=`
${MSG_NICK} .swir-mobile-99,${MSG_NICK} .swir-mobile-98,${MSG_NICK} .swir-mobile-97,${MSG_NICK} [data-swir-mobile-badge],${MSG_NICK} [class*="swir-mobile"]{display:none!important;visibility:hidden!important;opacity:0!important;width:0!important;height:0!important;margin:0!important;padding:0!important;pointer-events:none!important}
`;document.head.appendChild(s)}
scan();
let queued=false,roots=new Set();
const flush=()=>{queued=false;const a=[...roots];roots.clear();a.forEach(scan);cleanFriendPanel(document)};
new MutationObserver(ms=>{
 for(const m of ms){
   if(m.target?.nodeType===1)roots.add(m.target);
   for(const n of m.addedNodes||[])if(n?.nodeType===1)roots.add(n);
 }
 if(!queued&&roots.size){queued=true;queueMicrotask(flush)}
}).observe(document.body,{childList:true,subtree:true});
document.addEventListener('click',e=>{const n=e.target?.closest?.(MSG_NICK);if(n)cleanMessageNick(n)},true);
document.addEventListener('contextmenu',e=>{const n=e.target?.closest?.(MSG_NICK);if(n)cleanMessageNick(n)},true);
window.SWIR_CLEAN_RECOVERY1013={version:'10.13 CLEAN RECOVERY',scan:()=>scan(),diagnostics(){const leftNick=[...document.querySelectorAll(MSG_NICK)].filter(el=>PHONE_RE.test(el.textContent||'')).length;const leftRadar=[...document.querySelectorAll('#friends-panel .r97b')].filter(el=>PHONE_RE.test(el.textContent||'')).length;const x={removed,leftPhoneInNativeNicks:leftNick,leftPhoneBadgesInRadar:leftRadar,messageTextUntouched:true,reliability1012State:localStorage.getItem('swir_friend_reliability_1012')};console.table(x);return x}};
console.log('✅ SWIR 10.13 CLEAN RECOVERY: nick emoji/badge cleanup active; message text untouched');
}catch(e){console.error('SWIR 10.13 clean recovery',e)}})();
