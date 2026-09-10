/* SWIR 10.10 — Ice Light readability pass; Friends logic untouched */
(()=>{try{
if(window.__SWIR_ICE1010)return;window.__SWIR_ICE1010=1;
if(!document.getElementById('swirIce1010Css')){const s=document.createElement('style');s.id='swirIce1010Css';s.textContent=`
html[data-swir-theme99="ice"]{--sw99-text:#16384f!important;--sw99-muted:#4f7186!important}
html[data-swir-theme99="ice"] body,html[data-swir-theme99="ice"] #configPanel{color:#16384f!important;text-shadow:none!important}
html[data-swir-theme99="ice"] #configPanel .sw10-head,html[data-swir-theme99="ice"] #configPanel .sw10-status,html[data-swir-theme99="ice"] #configPanel .sw10-tabs{background:linear-gradient(180deg,#f7fcff,#e5f4fc)!important;border-color:#b9dcec!important}
html[data-swir-theme99="ice"] #configPanel .sw10-title,html[data-swir-theme99="ice"] #configPanel .sw10-title b,html[data-swir-theme99="ice"] #configPanel .sw10-page h2,html[data-swir-theme99="ice"] #configPanel .sw10-page h3,html[data-swir-theme99="ice"] #configPanel .sw10-page h4{color:#075985!important;text-shadow:none!important}
html[data-swir-theme99="ice"] #configPanel .sw10-sub,html[data-swir-theme99="ice"] #configPanel .sw10-note,html[data-swir-theme99="ice"] #configPanel .sw106-note,html[data-swir-theme99="ice"] #configPanel .sw10-stat{color:#4f7186!important;text-shadow:none!important}
html[data-swir-theme99="ice"] #configPanel .sw10-stat strong,html[data-swir-theme99="ice"] #configPanel label,html[data-swir-theme99="ice"] #configPanel p,html[data-swir-theme99="ice"] #configPanel span:not(.sw10-beta){color:#244f68!important;text-shadow:none!important}
html[data-swir-theme99="ice"] #configPanel .sw10-tab{background:#f9fdff!important;color:#315f7a!important;border-color:#bfddea!important;text-shadow:none!important}
html[data-swir-theme99="ice"] #configPanel .sw10-tab.active{background:linear-gradient(135deg,#d8f0fb,#e7e4ff)!important;color:#075985!important;border-color:#159ee8!important;box-shadow:0 0 0 1px #159ee822!important}
html[data-swir-theme99="ice"] #configPanel button:not(.sw10-tab),html[data-swir-theme99="ice"] #configPanel .swir99-theme-btn{background:#f8fcff!important;color:#164b68!important;border-color:#9fcfe5!important;text-shadow:none!important}
html[data-swir-theme99="ice"] #configPanel button:hover{border-color:#159ee8!important;color:#075985!important}
html[data-swir-theme99="ice"] #configPanel input,html[data-swir-theme99="ice"] #configPanel textarea,html[data-swir-theme99="ice"] #configPanel select{background:#fff!important;color:#16384f!important;border-color:#a7cfdf!important}
html[data-swir-theme99="ice"] #swirNotify100 label{background:#f9fdff!important;color:#244f68!important;border-color:#c3deea!important}
html[data-swir-theme99="ice"] [id^="m-options_"],html[data-swir-theme99="ice"] .m-usersList-header,html[data-swir-theme99="ice"] .m-search-box{color:#244f68!important;text-shadow:none!important}
html[data-swir-theme99="ice"] [id^="m-users_"] .m-list-user-item,html[data-swir-theme99="ice"] .m-usersList .m-list-user-item,html[data-swir-theme99="ice"] .m-room-list .m-room{color:#214b64!important;text-shadow:none!important}
html[data-swir-theme99="ice"] .context-menu,html[data-swir-theme99="ice"] .context-menu-list{background:#f8fcff!important;color:#16384f!important;border-color:#9fcfe5!important}
html[data-swir-theme99="ice"] .context-menu-item,html[data-swir-theme99="ice"] .context-menu-item--header{color:#214f68!important;text-shadow:none!important}
html[data-swir-theme99="ice"] .context-menu-item:hover{background:#e0f3fc!important;color:#075985!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] .m-msg-item-system,html[data-swir-theme99="ice"] [id^="m-messages_"] .m-msg-item-info,html[data-swir-theme99="ice"] [id^="m-messages_"] .info-user-login{color:#315f7a!important;text-shadow:none!important}
`;document.head.appendChild(s)}
function refresh(){try{if((document.documentElement.dataset.swirTheme99||localStorage.getItem('swir_theme_99'))==='ice')document.documentElement.dataset.swirIce1010='1';else delete document.documentElement.dataset.swirIce1010}catch(e){}}
refresh();new MutationObserver(refresh).observe(document.documentElement,{attributes:true,attributeFilter:['data-swir-theme99']});document.addEventListener('click',e=>{if(e.target?.closest?.('[data-swir-theme99-btn]'))setTimeout(refresh,0)},true);
window.SWIR_ICE1010={version:'10.10 ICE READABILITY',refresh};console.log('✅ SWIR 10.10 Ice: dark blue/teal text palette on light surfaces');
}catch(e){console.error('SWIR 10.10 Ice',e)}})();
