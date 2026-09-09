/* SWIR 9.9.1 STABLE — frozen 9.9 + tested R5 color visibility */
(()=>{try{
if(window.__SWIR_STABLE991_BOOT)return;window.__SWIR_STABLE991_BOOT=1;
const CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@';
const BASE='8ef1a5773f98780094c65042c2e622852ea6eb29';
const R5='bc9e2430ca1f858029c7e0808b499ce947dfc88c';
function add(src,onload){const s=document.createElement('script');s.src=src;s.onload=onload||null;s.onerror=()=>console.error('SWIR 9.9.1 STABLE load fail',src);document.head.appendChild(s)}
add(CDN+BASE+'/swir.js?stable991='+Date.now(),()=>{let n=0;const t=setInterval(()=>{n++;if(window.SWIR_UI99||n>40){clearInterval(t);window.SWIR_CLOUD_VERSION='9.9.1 STABLE — ORIGINAL COLORS + VISIBILITY';add(CDN+R5+'/swir-nick-message-colors-beta-r5.js?v=stable991')}},200)});
}catch(e){console.error('SWIR 9.9.1 STABLE bootstrap',e)}})();
