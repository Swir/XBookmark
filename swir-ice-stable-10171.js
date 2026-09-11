/* SWIR 10.17.1 STABLE — ICE COLOR REWORK
 * Keeps Ice bright, but separates panels, headers, controls and message colors.
 */
(()=>{try{
if(window.__SWIR_ICE_STABLE10171)return;window.__SWIR_ICE_STABLE10171=1;
function install(){if(document.getElementById('swirIceStable10171Css'))return;const s=document.createElement('style');s.id='swirIceStable10171Css';s.textContent=`
html[data-swir-theme99="ice"],html[data-swir-theme99="ice"] body{background:linear-gradient(180deg,#b8def5,#d7effc)!important;color:#15354d!important}
html[data-swir-theme99="ice"] [id^="m-messages_"]{background:linear-gradient(180deg,#fafdff,#eef8ff)!important;color:#16364e!important;border:1px solid #70bde8!important;box-shadow:0 10px 30px rgba(17,88,132,.16)!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] .m-msg-item{color:#17354b!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] .m-msg-item:nth-child(odd){background:rgba(224,244,255,.40)!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] .m-msg-item:nth-child(even){background:rgba(255,255,255,.50)!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] [data-col="0"]{color:#162b3c!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] [data-col="1"]{color:#1478b8!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] [data-col="2"]{color:#3148a5!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] [data-col="3"]{color:#bd347c!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] [data-col="4"]{color:#5d6d7d!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] [data-col="5"]{color:#27886a!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] [data-col="6"]{color:#087b40!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] [data-col="7"]{color:#c96a26!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] [data-col="8"]{color:#b75018!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] [data-col="9"]{color:#7e4d2e!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] [data-col="10"]{color:#176bd1!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] [data-col="11"]{color:#c72b3a!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] .m-msg-item-user-login{filter:saturate(1.2) contrast(1.08)!important;text-shadow:0 0 3px rgba(0,80,130,.12)!important}
html[data-swir-theme99="ice"] [id^="m-users_"],html[data-swir-theme99="ice"] .m-usersList,html[data-swir-theme99="ice"] [id^="m-rooms_"],html[data-swir-theme99="ice"] .m-room-list,html[data-swir-theme99="ice"] [id^="m-room-list-"]{background:linear-gradient(180deg,#dff3ff,#c9e8fa)!important;color:#15354d!important;border-color:#76bde5!important}
html[data-swir-theme99="ice"] .m-usersList-header,html[data-swir-theme99="ice"] [id^="m-options_"],html[data-swir-theme99="ice"] .m-search-box{background:linear-gradient(90deg,#0b76b4,#2197cb)!important;color:#fff!important;border-color:#0b679e!important}
html[data-swir-theme99="ice"] [id^="m-users_"] .m-list-user-item,html[data-swir-theme99="ice"] .m-usersList .m-list-user-item,html[data-swir-theme99="ice"] .m-room-list .m-room{background:#f8fcff!important;color:#18394f!important;border-color:#b1d8ec!important}
html[data-swir-theme99="ice"] [id^="m-users_"] .m-list-user-item:nth-child(even),html[data-swir-theme99="ice"] .m-usersList .m-list-user-item:nth-child(even),html[data-swir-theme99="ice"] .m-room-list .m-room:nth-child(even){background:#e8f6ff!important}
html[data-swir-theme99="ice"] .m-room-list .m-category{background:#a8d7f1!important;color:#154768!important;border-color:#75b9df!important;font-weight:800!important}
html[data-swir-theme99="ice"] [id^="m-textMessage-"],html[data-swir-theme99="ice"] .m-search-primary,html[data-swir-theme99="ice"] [id^="m-users_"] input,html[data-swir-theme99="ice"] .m-usersList input,html[data-swir-theme99="ice"] [id^="m-rooms_"] input{background:#fff!important;color:#16364e!important;border:1px solid #62b4e2!important;box-shadow:inset 0 0 0 1px #d8eef9!important}
html[data-swir-theme99="ice"] [id^="m-textMessage-"]::placeholder,html[data-swir-theme99="ice"] .m-search-primary::placeholder{color:#66869a!important}
html[data-swir-theme99="ice"] #configPanel{background:linear-gradient(180deg,#e9f7ff,#cfeafb)!important;color:#17364d!important;border:1px solid #2b9ed6!important;box-shadow:0 18px 55px rgba(21,89,130,.28)!important}
html[data-swir-theme99="ice"] #configPanel h2{background:linear-gradient(90deg,#0874b3,#2aa5d2)!important;color:#fff!important;border-radius:9px!important;padding:8px 10px!important;border:0!important}
html[data-swir-theme99="ice"] #configPanel h2 *{color:inherit!important}
html[data-swir-theme99="ice"] #configPanel .swir99-logo,html[data-swir-theme99="ice"] #configPanel .swir99-badge{color:#fff!important;border-color:rgba(255,255,255,.48)!important;text-shadow:none!important}
html[data-swir-theme99="ice"] #configPanel .swir99-by,html[data-swir-theme99="ice"] #configPanel .swir99-ver{color:#dff6ff!important;border-color:rgba(255,255,255,.38)!important}
html[data-swir-theme99="ice"] #configPanel .sw10-tabs{background:#b9e1f6!important;border:1px solid #83c3e5!important;border-radius:10px!important;padding:5px!important}
html[data-swir-theme99="ice"] #configPanel .sw10-tab{background:#edf9ff!important;color:#285671!important;border:1px solid #a6d5eb!important}
html[data-swir-theme99="ice"] #configPanel .sw10-tab.active{background:linear-gradient(135deg,#0b79b7,#27a2d1)!important;color:#fff!important;border-color:#08689d!important;box-shadow:0 4px 12px rgba(8,104,157,.20)!important}
html[data-swir-theme99="ice"] #swirTheme99,html[data-swir-theme99="ice"] .sw106-card,html[data-swir-theme99="ice"] #swStableMixCard{background:linear-gradient(180deg,#ffffff,#e9f6fe)!important;color:#17364d!important;border-color:#8fc9e7!important;box-shadow:0 6px 16px rgba(25,97,139,.10)!important}
html[data-swir-theme99="ice"] .swir99-theme-btn{background:#eff9ff!important;color:#26536d!important;border-color:#9bcee8!important}
html[data-swir-theme99="ice"] .swir99-theme-btn.active{background:#1588c4!important;color:#fff!important;border-color:#0d6da3!important}
html[data-swir-theme99="ice"] .sw106-preview,html[data-swir-theme99="ice"] #sw106MixStatus,html[data-swir-theme99="ice"] .sw106-pattern,html[data-swir-theme99="ice"] .swmix8-style,html[data-swir-theme99="ice"] .swmix8-status{background:#f8fcff!important;color:#17364d!important;border-color:#acd5e9!important}
html[data-swir-theme99="ice"] .sw106-pattern b,html[data-swir-theme99="ice"] .swmix8-mark{color:#0877b5!important}
html[data-swir-theme99="ice"] .sw106-pattern span,html[data-swir-theme99="ice"] .sw106-note,html[data-swir-theme99="ice"] .swmix8-note,html[data-swir-theme99="ice"] .swmix8-name{color:#55788e!important}
html[data-swir-theme99="ice"] #swStableMixToggle{background:#dff3ff!important;color:#145071!important;border-color:#66b6df!important}
html[data-swir-theme99="ice"] #swStableMixToggle.on{background:linear-gradient(135deg,#0f9a74,#31b991)!important;color:#fff!important;border-color:#08795a!important}
html[data-swir-theme99="ice"] #friends-panel.swir-rooms1017{background:linear-gradient(180deg,#e7f6ff,#cce9f9)!important;color:#17364d!important;border-color:#2b9ed6!important;box-shadow:0 18px 55px rgba(18,85,125,.28)!important}
html[data-swir-theme99="ice"] #friends-panel.swir-rooms1017 .rrh{background:linear-gradient(90deg,#0873b2,#25a0cf)!important;color:#fff!important;border-radius:9px!important;padding:8px!important}
html[data-swir-theme99="ice"] #friends-panel.swir-rooms1017 .rrh button{background:#fff!important;color:#17618b!important;border-color:#b9e4f7!important}
html[data-swir-theme99="ice"] #friends-panel.swir-rooms1017 .rrinfo{background:#d8effb!important;color:#496d82!important;border:1px solid #a8d3e8!important}
html[data-swir-theme99="ice"] #friends-panel.swir-rooms1017 .rrrow{background:#f9fdff!important;border:1px solid #b7dced!important;border-radius:8px!important;padding:8px!important;margin:5px 0!important}
html[data-swir-theme99="ice"] #friends-panel.swir-rooms1017 .rrrow:nth-of-type(even){background:#e8f6ff!important}
html[data-swir-theme99="ice"] #friends-panel.swir-rooms1017 .rrnick{color:#163b54!important}
html[data-swir-theme99="ice"] #friends-panel.swir-rooms1017 .rrrooms.full{color:#087450!important}
html[data-swir-theme99="ice"] #friends-panel.swir-rooms1017 .rrrooms.wait{color:#6a7480!important}
html[data-swir-theme99="ice"] #friends-panel.swir-rooms1017 .rradd{background:#cce9f9!important}
html[data-swir-theme99="ice"] #friends-panel.swir-rooms1017 .rradd input{background:#fff!important;color:#17364d!important;border-color:#64b4dd!important}
html[data-swir-theme99="ice"] #friends-panel.swir-rooms1017 .rradd button{background:#1688c3!important;color:#fff!important;border-color:#0a6fa8!important}
`;document.head.appendChild(s)}
install();new MutationObserver(()=>install()).observe(document.documentElement,{attributes:true,attributeFilter:['data-swir-theme99']});window.SWIR_ICE_STABLE10171={version:'10.17.1 STABLE ICE COLOR REWORK',refresh:install};console.log('SWIR 10.17.1 ICE Color Rework active');
}catch(e){console.error('SWIR ICE 10.17.1',e)}})();