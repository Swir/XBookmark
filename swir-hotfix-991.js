/* SWIR 9.9.1 STABLE HOTFIX — native reply/context-menu compatibility for dark nicks */
(()=>{try{
if(window.__SWIR_HOTFIX991)return;window.__SWIR_HOTFIX991=1;
window.SWIR_HOTFIX_VERSION='9.9.1';
const BAD=['swir-black-chat-text','swir-black-nick'];
function repairNick(el){
 try{
  if(!el||!el.classList?.contains('m-msg-item-user-login'))return;
  BAD.forEach(c=>el.classList.remove(c));
  el.querySelectorAll?.('.swir-mobile-99').forEach(b=>{b.style.pointerEvents='none';b.setAttribute('aria-hidden','true')});
  el.dataset.swir991ReplyFix='1';
 }catch(e){}
}
function sweep(root=document){
 try{
  if(root?.matches?.('.m-msg-item-user-login'))repairNick(root);
  root?.querySelectorAll?.('.m-msg-item-user-login').forEach(repairNick);
 }catch(e){}
}
sweep();
let queued=0;
const mo=new MutationObserver(ms=>{
 let need=false;
 for(const m of ms){
  if(m.type==='attributes'&&m.target?.classList?.contains('m-msg-item-user-login')){need=true;break}
  for(const n of m.addedNodes||[])if(n.nodeType===1&&(n.matches?.('.m-msg-item-user-login')||n.querySelector?.('.m-msg-item-user-login'))){need=true;break}
  if(need)break;
 }
 if(need&&!queued){queued=1;queueMicrotask(()=>{queued=0;sweep()})}
});
mo.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
setInterval(sweep,2500);
window.SWIR_HOTFIX991={version:'9.9.1',repair:sweep,diagnostics(){const all=[...document.querySelectorAll('.m-msg-item-user-login')],broken=all.filter(x=>BAD.some(c=>x.classList.contains(c)));const out={version:'9.9.1',messageNicks:all.length,brokenReplyClasses:broken.length,mobileBadges:document.querySelectorAll('.swir-mobile-99').length};console.table(out);return out}};
console.log('✅ SWIR 9.9.1 HOTFIX: czarne nicki nie psują natywnego Odpowiedz/Priv');
}catch(e){console.error('SWIR 9.9.1 HOTFIX',e)}})();
