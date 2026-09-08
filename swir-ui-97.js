/* SWIR 9.7 UI — CHAT-ONLY NEON + MOBILE BADGE + MOD HEADER */
(()=>{try{
if(window.__SWIR_UI97)return;window.__SWIR_UI97=1;
const pal=['#59e8ff','#75f0bd','#ffd36a','#ff8fd3','#a9a2ff','#ff9c68','#8ee66b','#6fb7ff','#f78686','#d0a0ff','#67f0e1','#f6b0ff'];
const key=n=>String(n||'').trim().toLocaleLowerCase('pl-PL');
function hash(s){let h=2166136261;for(const c of key(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return Math.abs(h)}
function color(n){return pal[hash(n)%pal.length]}
function conns(){let z=new Set();try{let m=CHNS.connManager,c=m.getCurrentConnection?.();c&&z.add(c);c=m.getFirstConnection?.();c&&z.add(c);Object.values(CHNS.channelManager?.channels||{}).forEach(ch=>{try{let x=m.getConnectionRelatedWithId?.(ch?.getChannelId?.());x&&z.add(x)}catch(e){}})}catch(e){}return[...z]}
function mobile(n){for(const c of conns())try{let u=c.getUserWithName?.(n);if(u)return !!(u.isMobile?.()||u.isMobileUser)}catch(e){}return false}
function nickText(el){return String(el?.textContent||'').replace(/\s*:\s*$/,'').trim()}
function decorate(el){try{if(!el||el.dataset.swir97nick==='1')return;let n=nickText(el);if(!n)return;el.dataset.swir97nick='1';el.style.setProperty('color',color(n),'important');el.style.setProperty('font-weight','800','important');el.style.setProperty('text-shadow','0 0 5px currentColor','important');el.style.setProperty('animation','none','important');el.style.setProperty('transition','none','important');if(mobile(n)&&!el.querySelector('.swir-mobile-97')){let b=document.createElement('span');b.className='swir-mobile-97';b.textContent=' 📱';b.title='Użytkownik mobilny';b.style.cssText='font-size:9px;opacity:.62;text-shadow:none!important;filter:none!important';el.appendChild(b)}}catch(e){}}
function sweep(root=document){root.querySelectorAll?.('[id^="m-messages_"] .m-msg-item-user-login').forEach(decorate)}
function mod(){try{let p=document.getElementById('configPanel'),h=p?.querySelector('h2 span:first-child');if(!h||h.dataset.swir97ui)return;h.dataset.swir97ui='1';h.innerHTML='<span style="display:inline-flex;align-items:center;gap:6px;white-space:nowrap"><b style="color:var(--swir-a,#00f5ff);text-shadow:0 0 5px rgba(0,245,255,.18)">SWIR //</b><span>Czateria MOD by Swir</span><span style="font-size:10px;color:#8da0b3">v9.7</span></span><span class="swir-ui-badge">GAMING UI</span>'}catch(e){}}
const st=document.createElement('style');st.id='swir-ui97css';st.textContent='.swir-mobile-97{color:#b9c9d7!important;background:transparent!important}.m-msg-item-user-login[data-swir97nick="1"]{animation:none!important;transition:none!important}';document.head.appendChild(st);
sweep();mod();const mo=new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1){if(n.matches?.('.m-msg-item-user-login'))decorate(n);sweep(n)}clearTimeout(window.__swir97modt);window.__swir97modt=setTimeout(mod,100)});mo.observe(document.body,{childList:true,subtree:true});
window.SWIR_UI97={version:'9.7',refresh:()=>{sweep();mod()},color};console.log('✅ SWIR 9.7 UI: stabilne nicki tylko przy wiadomościach + 📱');
}catch(e){console.error('SWIR UI97',e)}})();
