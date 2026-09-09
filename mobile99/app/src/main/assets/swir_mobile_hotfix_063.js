(function(){
'use strict';
if(window.__SWIR_MOBILE_HOTFIX_063)return;
window.__SWIR_MOBILE_HOTFIX_063=true;

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];

function installCss(){
 let st=$('#swir-mobile-063-style');
 if(!st){st=document.createElement('style');st.id='swir-mobile-063-style';document.head.appendChild(st)}
 st.textContent=`
 .adv-mobile-wrapper,.adv-login-wrapper,.adv-desktop-wrapper,
 #gora_srodek,#gora_srodek_mobile,#gora_srodek_log,
 [id^="gora_srodek"],[id*="gora_srodek"],
 [class*="adv-mobile"],[class*="advertisement"],[class*="ad-slot"],
 [id*="advertisement"],[id*="ad-slot"],.adsbygoogle{
   display:none!important;visibility:hidden!important;height:0!important;min-height:0!important;
   max-height:0!important;margin:0!important;padding:0!important;border:0!important;
   overflow:hidden!important;pointer-events:none!important;
 }
 body>.adv-mobile-wrapper,body>.adv-login-wrapper,body>[id^="gora_srodek"]{position:absolute!important;left:-99999px!important;top:-99999px!important}
 `;
}

function disableAdvertApi(){
 try{
  const a=window.CHNS&&CHNS.advert;
  if(!a)return;
  try{a.removeMobileAdvert&&a.removeMobileAdvert()}catch(e){}
  try{a.destroyMobileAdvert&&a.destroyMobileAdvert()}catch(e){}
  try{a.addChatAdvert=function(){}}catch(e){}
  try{a.addLoginAdvert=function(){}}catch(e){}
 }catch(e){}
}

function removeAdNodes(){
 const selectors=[
  '.adv-mobile-wrapper','.adv-login-wrapper','.adv-desktop-wrapper',
  '#gora_srodek','#gora_srodek_mobile','#gora_srodek_log',
  '[id^="gora_srodek"]','[class*="adv-mobile"]','[class*="advertisement"]',
  '[id*="advertisement"]','[class*="ad-slot"]','[id*="ad-slot"]','.adsbygoogle'
 ];
 try{$$(selectors.join(',')).forEach(el=>el.remove())}catch(e){}
 try{
  $$('body *').forEach(el=>{
   if(!el.isConnected||el.closest('.m-msg-item,[id^="m-messages_"],#swir-color-mobile-sheet,#swir-mobile-sheet'))return;
   if(el.children.length>2)return;
   const t=(el.textContent||'').replace(/\s+/g,' ').trim().toUpperCase();
   if(t!=='REKLAMA'&&t!=='ADVERTISEMENT'&&t!=='AD')return;
   const r=el.getBoundingClientRect();
   if(r.top>220)return;
   const box=el.closest('.adv-mobile-wrapper,.adv-login-wrapper,[id^="gora_srodek"],[class*="advert"],[id*="advert"],[class*="ad-slot"],[id*="ad-slot"]')||el;
   box.remove();
  });
 }catch(e){}
}

function cleanup(){installCss();disableAdvertApi();removeAdNodes()}
cleanup();
setTimeout(cleanup,250);setTimeout(cleanup,900);setTimeout(cleanup,2200);
setInterval(cleanup,2500);
const mo=new MutationObserver(()=>{clearTimeout(window.__swir063t);window.__swir063t=setTimeout(cleanup,80)});
mo.observe(document.documentElement||document.body,{childList:true,subtree:true});
window.SWIR_MOBILE_ADFIX={version:'0.6.3',cleanup};
})();
