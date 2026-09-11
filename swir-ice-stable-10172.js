/* SWIR 10.17.2 STABLE — ICE v2
 * Visual-only overlay. Does not touch Friends protocol, sockets, nick DOM or writing transport.
 * Goal: readable light theme with strong separation and preserved 12 message colors.
 */
(()=>{try{
if(window.__SWIR_ICE_STABLE10172)return;window.__SWIR_ICE_STABLE10172=1;
function install(){
 if(document.getElementById('swirIceStable10172Css'))return;
 const s=document.createElement('style');s.id='swirIceStable10172Css';s.textContent=`
html[data-swir-theme99="ice"],html[data-swir-theme99="ice"] body{background:linear-gradient(180deg,#9fd4f3 0%,#c9e9fa 45%,#e2f5ff 100%)!important;color:#14344a!important}
html[data-swir-theme99="ice"] body,html[data-swir-theme99="ice"] #Czat,html[data-swir-theme99="ice"] .m-tabs-main-container,html[data-swir-theme99="ice"] .m-tab{color:#14344a!important}

/* room tabs / top chrome */
html[data-swir-theme99="ice"] [id$="-nav"],html[data-swir-theme99="ice"] [id*="-nav-"]{background:#a7d9f4!important;border-color:#6eb7df!important}
html[data-swir-theme99="ice"] [id$="-nav"] li a,html[data-swir-theme99="ice"] [id*="-nav-"] li a{background:#dff3ff!important;color:#174966!important;border-color:#89c5e5!important;text-shadow:none!important;opacity:1!important}
html[data-swir-theme99="ice"] [id$="-nav"] li a.active,html[data-swir-theme99="ice"] [id*="-nav-"] li a.active{background:#123c58!important;color:#fff!important;border-color:#0e334d!important}

/* message area */
html[data-swir-theme99="ice"] [id^="m-messages_"]{background:linear-gradient(180deg,#f9fdff,#edf8ff)!important;color:#17364b!important;border:1px solid #5aaedf!important;box-shadow:0 10px 28px rgba(18,91,136,.17)!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] .m-msg-item{color:#17364b!important;opacity:1!important;filter:none!important;text-shadow:none!important;border-bottom-color:rgba(65,141,184,.10)!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] .m-msg-item:nth-child(odd){background:rgba(213,239,253,.30)!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] .m-msg-item:nth-child(even){background:rgba(255,255,255,.55)!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] .m-msg-item span:not([data-col]):not(.m-msg-item-user-login),html[data-swir-theme99="ice"] [id^="m-messages_"] .m-topic-intro,html[data-swir-theme99="ice"] [id^="m-messages_"] .m-topic-message,html[data-swir-theme99="ice"] [id^="m-messages_"] .m-msg-item-user-left,html[data-swir-theme99="ice"] [id^="m-messages_"] .m-msg-item-info{color:#244b64!important;opacity:1!important;text-shadow:none!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] a{color:#006fae!important;opacity:1!important;text-decoration-color:#64b7df!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] .m-msg-item-user-login{opacity:1!important;filter:saturate(1.18) contrast(1.12)!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] .m-msg-item img{opacity:1!important;filter:none!important}

/* preserve native 12 message colors with enough contrast on light background */
html[data-swir-theme99="ice"] [id^="m-messages_"] [data-col="0"]{color:#172a38!important;opacity:1!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] [data-col="1"]{color:#0878bd!important;opacity:1!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] [data-col="2"]{color:#3046a8!important;opacity:1!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] [data-col="3"]{color:#c02d7a!important;opacity:1!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] [data-col="4"]{color:#536878!important;opacity:1!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] [data-col="5"]{color:#238466!important;opacity:1!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] [data-col="6"]{color:#08783d!important;opacity:1!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] [data-col="7"]{color:#c7641d!important;opacity:1!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] [data-col="8"]{color:#b94a12!important;opacity:1!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] [data-col="9"]{color:#7c4c2d!important;opacity:1!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] [data-col="10"]{color:#1269d0!important;opacity:1!important}
html[data-swir-theme99="ice"] [id^="m-messages_"] [data-col="11"]{color:#c92738!important;opacity:1!important}

/* user/room lists */
html[data-swir-theme99="ice"] [id^="m-users_"],html[data-swir-theme99="ice"] .m-usersList,html[data-swir-theme99="ice"] [id^="m-rooms_"],html[data-swir-theme99="ice"] .m-room-list,html[data-swir-theme99="ice"] [id^="m-room-list-"]{background:linear-gradient(180deg,#d8f0fd,#bee3f7)!important;color:#16374d!important;border-color:#64b1dc!important}
html[data-swir-theme99="ice"] .m-usersList-header,html[data-swir-theme99="ice"] [id^="m-options_"],html[data-swir-theme99="ice"] .m-search-box{background:linear-gradient(90deg,#146f9f,#249bc9)!important;color:#fff!important;border-color:#0b5e89!important}
html[data-swir-theme99="ice"] .m-list-user-item,html[data-swir-theme99="ice"] .m-room-list .m-room{background:#f8fcff!important;color:#173b51!important;border-color:#afd7eb!important;opacity:1!important}
html[data-swir-theme99="ice"] .m-list-user-item:nth-child(even),html[data-swir-theme99="ice"] .m-room-list .m-room:nth-child(even){background:#e5f5fe!important}
html[data-swir-theme99="ice"] .m-room-list .m-category{background:#8ecbea!important;color:#103e59!important;font-weight:900!important;border-color:#5eacd5!important}

/* inputs */
html[data-swir-theme99="ice"] [id^="m-textMessage-"],html[data-swir-theme99="ice"] .m-search-primary,html[data-swir-theme99="ice"] input[type="text"]{background:#fff!important;color:#16364c!important;border-color:#5fb0dd!important;caret-color:#0b77b3!important}
html[data-swir-theme99="ice"] [id^="m-textMessage-"]::placeholder,html[data-swir-theme99="ice"] .m-search-primary::placeholder,html[data-swir-theme99="ice"] input[type="text"]::placeholder{color:#6d8799!important;opacity:1!important}

/* MOD */
html[data-swir-theme99="ice"] #configPanel{background:linear-gradient(180deg,#dff3ff 0%,#c2e6f8 100%)!important;color:#17374d!important;border:1px solid #168ac4!important;box-shadow:0 18px 55px rgba(15,77,116,.30)!important}
html[data-swir-theme99="ice"] #configPanel h2{background:linear-gradient(90deg,#0d6698,#168ab9,#28a5cc)!important;color:#fff!important;border:0!important;border-radius:10px!important;padding:9px 11px!important}
html[data-swir-theme99="ice"] #configPanel h2 *{color:inherit!important;text-shadow:none!important}
html[data-swir-theme99="ice"] #configPanel .sw10-tabs{background:#9fd5ef!important;border:1px solid #67b4da!important;border-radius:11px!important;padding:6px!important}
html[data-swir-theme99="ice"] #configPanel .sw10-tab{background:#eaf8ff!important;color:#24536d!important;border-color:#89c5e2!important}
html[data-swir-theme99="ice"] #configPanel .sw10-tab.active{background:linear-gradient(135deg,#104d72,#0f7fab)!important;color:#fff!important;border-color:#0b4b6d!important;box-shadow:0 4px 12px rgba(13,78,113,.24)!important}
html[data-swir-theme99="ice"] #configPanel .sw10-page{color:#17374d!important}
html[data-swir-theme99="ice"] #configPanel .sw106-card,html[data-swir-theme99="ice"] #configPanel #swirTheme99,html[data-swir-theme99="ice"] #configPanel #swStableMixCard{background:linear-gradient(180deg,#f9fdff,#e3f4fd)!important;color:#17374d!important;border-color:#83c4e2!important;box-shadow:0 6px 16px rgba(30,105,145,.10)!important}
html[data-swir-theme99="ice"] #configPanel h3{color:#0878b3!important}
html[data-swir-theme99="ice"] #configPanel label,html[data-swir-theme99="ice"] #configPanel .sw106-note,html[data-swir-theme99="ice"] #configPanel .swmix8-note,html[data-swir-theme99="ice"] #configPanel .swmix8-name{color:#41687f!important;opacity:1!important}
html[data-swir-theme99="ice"] .swir99-theme-btn{background:#e9f7ff!important;color:#25536c!important;border-color:#8dc7e3!important}
html[data-swir-theme99="ice"] .swir99-theme-btn.active{background:#0d78ae!important;color:#fff!important;border-color:#075f8c!important}
html[data-swir-theme99="ice"] .sw106-preview,html[data-swir-theme99="ice"] #sw106MixStatus,html[data-swir-theme99="ice"] .sw106-pattern,html[data-swir-theme99="ice"] .swmix8-style,html[data-swir-theme99="ice"] .swmix8-status{background:#f8fcff!important;color:#17374d!important;border-color:#a3d2e8!important}
html[data-swir-theme99="ice"] .swmix8-mark{color:#076fa8!important}

/* Friends panel — visual only */
html[data-swir-theme99="ice"] #friends-panel.swir-rooms1017{background:linear-gradient(180deg,#dff3ff,#c2e5f6)!important;color:#17374d!important;border-color:#168ac4!important;box-shadow:0 18px 55px rgba(15,77,116,.28)!important}
html[data-swir-theme99="ice"] #friends-panel.swir-rooms1017 .rrh{background:linear-gradient(90deg,#0d6698,#229bc7)!important;color:#fff!important;border-radius:9px!important;padding:8px!important}
html[data-swir-theme99="ice"] #friends-panel.swir-rooms1017 .rrh button{background:#f8fcff!important;color:#145779!important;border-color:#9bd4eb!important}
html[data-swir-theme99="ice"] #friends-panel.swir-rooms1017 .rrinfo{background:#cfeafa!important;color:#345f77!important;border:1px solid #94cce5!important}
html[data-swir-theme99="ice"] #friends-panel.swir-rooms1017 .rrrow{background:#f8fcff!important;border:1px solid #acd7e9!important;border-radius:8px!important;padding:8px!important;margin:5px 0!important}
html[data-swir-theme99="ice"] #friends-panel.swir-rooms1017 .rrnick{color:#143b54!important}
html[data-swir-theme99="ice"] #friends-panel.swir-rooms1017 .rrrooms.full{color:#087048!important}
html[data-swir-theme99="ice"] #friends-panel.swir-rooms1017 .rrrooms.wait{color:#596f7e!important}
html[data-swir-theme99="ice"] #friends-panel.swir-rooms1017 .rradd{background:#c2e5f6!important}
`;
 document.head.appendChild(s);
}
function repaint(){
 if(document.documentElement.dataset.swirTheme99!=='ice')return;
 try{document.querySelectorAll('[id^="m-messages_"] .m-msg-item').forEach(x=>{x.style.opacity='1'});}catch(e){}
}
install();repaint();
new MutationObserver(()=>{install();repaint()}).observe(document.documentElement,{attributes:true,attributeFilter:['data-swir-theme99']});
document.addEventListener('click',e=>{if(e.target?.closest?.('[data-swir-theme99-btn],#btnConfig'))setTimeout(repaint,30)},true);
window.SWIR_ICE_STABLE10172={version:'10.17.2 STABLE ICE v2',refresh:()=>{install();repaint()}};
console.log('SWIR 10.17.2 ICE v2 active');
}catch(e){console.error('SWIR ICE 10.17.2',e)}})();