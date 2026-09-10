/* SWIR 10.5 BETA — responsive MOD scrolling + light-theme UI polish */
(()=>{try{
if(window.__SWIR_UI_FIX105)return;window.__SWIR_UI_FIX105=1;
function css(){if(document.getElementById('swirUiFix105Css'))return;const s=document.createElement('style');s.id='swirUiFix105Css';s.textContent=`
#configPanel.swir-ui{
 width:min(920px,94vw)!important;max-width:920px!important;
 height:min(760px,calc(100dvh - 24px))!important;max-height:calc(100dvh - 24px)!important;
 min-height:0!important;overflow:hidden!important;padding:0!important;box-sizing:border-box!important;
}
#configPanel.swir-ui>#swirModTabs100{
 display:flex!important;flex-direction:column!important;flex:1 1 auto!important;
 width:100%!important;height:100%!important;min-height:0!important;max-height:100%!important;
 overflow:hidden!important;box-sizing:border-box!important;
}
#configPanel.swir-ui>#swirModTabs100>.sw10-head,
#configPanel.swir-ui>#swirModTabs100>.sw10-status,
#configPanel.swir-ui>#swirModTabs100>.sw10-tabs{flex:0 0 auto!important}
#configPanel.swir-ui>#swirModTabs100>.sw10-pages{
 display:block!important;flex:1 1 auto!important;min-height:0!important;height:auto!important;
 overflow:hidden!important;position:relative!important;
}
#configPanel.swir-ui #swirModTabs100 .sw10-page{
 height:100%!important;min-height:0!important;max-height:100%!important;
 overflow-y:auto!important;overflow-x:hidden!important;overscroll-behavior:contain!important;
 scrollbar-gutter:stable!important;padding-bottom:48px!important;
}
#configPanel.swir-ui #swirModTabs100 .sw10-page::-webkit-scrollbar{width:9px!important}
#configPanel.swir-ui #swirModTabs100 .sw10-page::-webkit-scrollbar-track{background:rgba(255,255,255,.035)!important;border-radius:10px!important}
#configPanel.swir-ui #swirModTabs100 .sw10-page::-webkit-scrollbar-thumb{background:rgba(var(--swir-rgb,0,229,255),.5)!important;border-radius:10px!important}

/* Ice Light: remove remaining white-on-light UI text from the 10.0 shell. */
html[data-swir-theme99="ice"] #configPanel.swir-ui .sw10-title,
html[data-swir-theme99="ice"] #configPanel.swir-ui .sw10-title b,
html[data-swir-theme99="ice"] #configPanel.swir-ui .sw10-sub,
html[data-swir-theme99="ice"] #configPanel.swir-ui .sw10-stat,
html[data-swir-theme99="ice"] #configPanel.swir-ui .sw10-stat strong,
html[data-swir-theme99="ice"] #configPanel.swir-ui .sw10-tab,
html[data-swir-theme99="ice"] #configPanel.swir-ui .sw10-tab.active,
html[data-swir-theme99="ice"] #configPanel.swir-ui .sw10-close,
html[data-swir-theme99="ice"] #configPanel.swir-ui .sw10-note,
html[data-swir-theme99="ice"] #configPanel.swir-ui .sw10-page p,
html[data-swir-theme99="ice"] #configPanel.swir-ui .sw10-page label{color:#17324a!important;text-shadow:none!important}
html[data-swir-theme99="ice"] #configPanel.swir-ui .sw10-tab.active{background:linear-gradient(135deg,#d9f2ff,#e7e4ff)!important;border-color:#159ee8!important}
html[data-swir-theme99="ice"] #configPanel.swir-ui .sw10-search{background:#fff!important;color:#17324a!important;border-color:#9ccfe9!important}
html[data-swir-theme99="ice"] #configPanel.swir-ui button:not(.swir99-theme-btn){text-shadow:none!important}
html[data-swir-theme99="ice"] #configPanel.swir-ui .sw10-page>div{color:#17324a!important}
html[data-swir-theme99="ice"] #configPanel.swir-ui .sw10-page input,
html[data-swir-theme99="ice"] #configPanel.swir-ui .sw10-page textarea,
html[data-swir-theme99="ice"] #configPanel.swir-ui .sw10-page select{color:#17324a!important;background:#fff!important}

@supports not (height:100dvh){
 #configPanel.swir-ui{height:min(760px,calc(100vh - 24px))!important;max-height:calc(100vh - 24px)!important}
}
@media(max-width:760px){
 #configPanel.swir-ui{width:96vw!important;height:calc(100dvh - 14px)!important;max-height:calc(100dvh - 14px)!important}
 #configPanel.swir-ui #swirModTabs100 .sw10-page{padding-bottom:64px!important}
}
`;document.head.appendChild(s)}
function polish(){try{
 const shell=document.querySelector('#configPanel #swirModTabs100');if(!shell)return false;
 const badge=shell.querySelector('.sw10-beta');if(badge)badge.textContent='10.5 BETA';
 const sub=shell.querySelector('.sw10-sub');if(sub)sub.textContent='Radar / skaner z 10.0 • pełne przewijanie • Ice Contrast 10.5 • szybkie motywy • natywne B/I';
 const fh=document.querySelector('#swirFriendsDash100 h3');if(fh)fh.textContent='🧑‍🤝‍🧑 Znajomi + Friend Radar — silnik 10.0';
 const fn=document.querySelector('#swirFriendsDash100 .sw10-note');if(fn)fn.textContent='Skanowanie znajomych działa dokładnie jak w testowanej 10.0: Radar 9.7 pozostaje nietknięty. Ta zakładka tylko otwiera panel i ręcznie odświeża Radar.';
 document.getElementById('sw104DashSync')?.remove();
 const nh=document.querySelector('#swirNotify100>h3');if(nh)nh.textContent='🔔 Powiadomienia 10.5 BETA — silnik 10.0';
 window.SWIR_THEME_FAST104?.refresh?.();
 window.SWIR_TEXT_STYLE104?.refresh?.();
 window.SWIR_CONTRAST105?.refresh?.();
 return true;
}catch(e){return false}}
css();let tries=0;const t=setInterval(()=>{tries++;if(polish()||tries>55)clearInterval(t)},100);polish();
document.addEventListener('click',e=>{if(e.target?.closest?.('#btnConfig,.sw10-tab,[data-swir-theme99-btn]'))requestAnimationFrame(()=>{polish();window.SWIR_CONTRAST105?.refresh?.()})},true);
window.addEventListener('resize',()=>requestAnimationFrame(polish),{passive:true});
window.SWIR_MOD_UI105={version:'10.5 BETA',openFriends:()=>window.SWIR_RADAR_DEBUG97?.openPanel?.(),refreshFriends:()=>{window.SWIR_RADAR_DEBUG97?.scan?.();window.SWIR_RADAR_DEBUG97?.requestServerState?.(0)},refresh:polish};
console.log('✅ SWIR 10.5 UI FIX aktywny');
}catch(e){console.error('SWIR UI FIX 10.5',e)}})();
