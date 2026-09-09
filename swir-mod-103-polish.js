/* SWIR 10.3 BETA — final UI labels for Friend Notify Rebuild */
(()=>{try{
if(window.__SWIR_MOD_103_POLISH)return;window.__SWIR_MOD_103_POLISH=1;
function apply(){try{
 const shell=document.querySelector('#configPanel #swirModTabs100');if(!shell)return false;
 const badge=shell.querySelector('.sw10-beta');if(badge)badge.textContent='10.3 BETA';
 const sub=shell.querySelector('.sw10-sub');if(sub)sub.textContent='Friend Notify Rebuild • każdy znajomy bez VIP • APP rooms + live CHNS • Radar 9.7 bez zmian';
 const h=document.querySelector('#swirNotify100>h3');if(h)h.textContent='🔔 Powiadomienia 10.3 BETA';
 document.querySelectorAll('#sn100vip,[data-sn100="friends"],[data-sn100="autoFriend"]').forEach(x=>x.closest?.('label')?.remove?.()||x.remove());
 window.SWIR_MOD_UI103={version:'10.3 BETA — FRIEND NOTIFY REBUILD',openTab:window.SWIR_MOD_UI102?.openTab||window.SWIR_MOD_UI100?.openTab,openFriends:window.SWIR_MOD_UI102?.openFriends,refreshFriends:window.SWIR_MOD_UI102?.refreshFriends,notifyDiagnostics:()=>window.SWIR_NOTIFY103?.diagnostics?.()};
 return true;
}catch(e){return false}}
let tries=0,t=setInterval(()=>{tries++;if(apply()||tries>40)clearInterval(t)},150);apply();
console.log('✅ SWIR 10.3 UI polish aktywny');
}catch(e){console.error('SWIR 10.3 polish',e)}})();
