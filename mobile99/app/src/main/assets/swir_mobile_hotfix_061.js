(function(){
'use strict';
if(window.__SWIR_MOBILE_HOTFIX_061)return;
window.__SWIR_MOBILE_HOTFIX_061=true;

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];

function ensureViewport(){
 let v=document.querySelector('meta[name="viewport"]');
 if(!v){v=document.createElement('meta');v.name='viewport';document.head.appendChild(v)}
 v.content='width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover';
}

function installCss(){
 let st=$('#swir-mobile-hotfix-061-style');
 if(!st){st=document.createElement('style');st.id='swir-mobile-hotfix-061-style';document.head.appendChild(st)}
 st.textContent=`
 html,body{max-width:100%!important;overflow-x:hidden!important;-webkit-text-size-adjust:100%!important}
 body{min-width:0!important;width:100%!important}
 #mainHeader,.m-tabs-main-container,.m-tab,.m-container,.m-textArea,.m-messagesTextArea,[id^="m-messages_"],[id^="m-users_"],.m-usersList{max-width:100%!important;min-width:0!important;box-sizing:border-box!important}

 #m-tab-main-container-1-set{max-width:100%!important;overflow:hidden!important}
 #m-tab-main-container-1-nav{
   display:flex!important;flex-wrap:nowrap!important;align-items:center!important;
   width:100%!important;max-width:100%!important;min-width:0!important;
   overflow-x:auto!important;overflow-y:hidden!important;white-space:nowrap!important;
   -webkit-overflow-scrolling:touch!important;scroll-behavior:smooth!important;
   scrollbar-width:none!important;touch-action:pan-x!important;overscroll-behavior-x:contain!important;
 }
 #m-tab-main-container-1-nav::-webkit-scrollbar{display:none!important}
 #m-tab-main-container-1-nav>li{display:block!important;float:none!important;position:relative!important;flex:0 0 auto!important;max-width:78vw!important}
 #m-tab-main-container-1-nav>li>a{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;max-width:72vw!important}
 #m-tab-main-container-1-nav .button-more-li,#m-more-button,.button-more{display:none!important}
 #m-tab-main-container-1-nav-listed{display:none!important}

 #accessibilityPanelOptions.accessibility-panel--mobile-chat{
   position:static!important;inset:auto!important;transform:none!important;
   width:100%!important;max-width:100%!important;height:auto!important;min-height:0!important;
   margin:4px 0!important;padding:0!important;box-sizing:border-box!important;overflow:hidden!important;
 }
 #accessibilityPanelOptions .accessibility-panel__content{
   display:flex!important;flex-wrap:nowrap!important;align-items:center!important;gap:6px!important;
   width:100%!important;max-width:100%!important;overflow-x:auto!important;overflow-y:hidden!important;
   padding:4px 6px!important;box-sizing:border-box!important;-webkit-overflow-scrolling:touch!important;
   scrollbar-width:none!important;touch-action:pan-x!important;
 }
 #accessibilityPanelOptions .accessibility-panel__content::-webkit-scrollbar{display:none!important}
 #accessibilityPanelOptions .accessibility-panel__label{flex:0 0 auto!important;position:static!important;margin:0!important;padding:0 4px!important;white-space:nowrap!important;font-size:11px!important}
 #accessibilityPanelOptions .accessibility-panel__button{position:static!important;inset:auto!important;transform:none!important;float:none!important;flex:0 0 auto!important;margin:0!important;min-width:42px!important;width:auto!important;max-width:none!important;height:38px!important;min-height:38px!important;padding:0 10px!important;border-radius:9px!important;font-size:13px!important;line-height:38px!important}
 #accessibilityPanelOptions .accessibility-panel__button--contrast{max-width:150px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}

 form#m-sendMessage,.m-sendMessage,[id^="m-sendMessage-"]{max-width:100%!important;min-width:0!important;box-sizing:border-box!important}
 [id^="m-textMessage-"],input.text-input,textarea.text-input{min-width:0!important;max-width:100%!important;box-sizing:border-box!important}
 .button-send,[id^="m-sendMessage-button-"]{min-width:86px!important;max-width:34vw!important;box-sizing:border-box!important}

 #btnConfig,#configPanel,#swirConfigPanel,#swir-launcher,.swir-launcher,.swir-floating-launcher{display:none!important}
 `;
}

function flattenTabs(){
 try{
  const nav=$('#m-tab-main-container-1-nav');
  const listed=$('#m-tab-main-container-1-nav-listed');
  if(!nav)return;
  const more=nav.querySelector('.button-more-li');
  if(listed){
   [...listed.children].forEach(li=>{
    if(!li.classList.contains('empty-first-li'))nav.insertBefore(li,more||null);
   });
   listed.style.setProperty('display','none','important');
  }
  if(more)more.style.setProperty('display','none','important');
  nav.style.setProperty('overflow-x','auto','important');
 }catch(e){}
}

function cleanupDesktopMod(){
 try{
  ['btnConfig','configPanel','swirConfigPanel','swir-launcher'].forEach(id=>document.getElementById(id)?.remove());
  $$('.swir-launcher,.swir-floating-launcher').forEach(x=>x.remove());
  $$('button,div,a').forEach(el=>{
   const t=(el.textContent||'').replace(/\s+/g,' ').trim();
   if((t==='⚡ SWIR MOD'||t==='SWIR MOD')&&getComputedStyle(el).position==='fixed'){
    const box=el.closest('div')||el;box.remove();
   }
  });
 }catch(e){}
}

function fixAccessibility(){
 try{
  const p=$('#accessibilityPanelOptions');
  if(!p)return;
  p.style.setProperty('position','static','important');
  p.style.setProperty('transform','none','important');
  const c=p.querySelector('.accessibility-panel__content');
  if(c){c.style.setProperty('display','flex','important');c.style.setProperty('overflow-x','auto','important')}
 }catch(e){}
}

function fixLayout(){ensureViewport();installCss();flattenTabs();fixAccessibility();cleanupDesktopMod()}
fixLayout();
setTimeout(fixLayout,300);setTimeout(fixLayout,1000);setTimeout(fixLayout,2500);
const mo=new MutationObserver(()=>{clearTimeout(window.__swir061t);window.__swir061t=setTimeout(fixLayout,80)});
mo.observe(document.documentElement||document.body,{childList:true,subtree:true});
window.SWIR_MOBILE_HOTFIX={version:'0.6.1',fixLayout,flattenTabs};
})();
