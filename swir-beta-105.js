/* SWIR 10.5 BETA — 10.0 Friend Radar workflow + viewport UI + Ice contrast */
(()=>{try{
if(window.__SWIR_BETA105_BOOT)return;window.__SWIR_BETA105_BOOT=1;
const current=(document.currentScript&&document.currentScript.src)||'';
const m=current.match(/\/gh\/Swir\/XBookmark@([^/]+)\//);
const selfRef=m&&m[1]?m[1]:'main';
const CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@';
const BASE99='8ef1a5773f98780094c65042c2e622852ea6eb29';
const WORKING10='0ed4f9710a435444b8299a03cf6181785c3c66e6';
const SAFE104='f4889bec729f080f193abbaa71376cfb8ae7ade3';
function add(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=()=>resolve(src);s.onerror=()=>{console.error('SWIR 10.5 load fail',src);reject(new Error('load fail: '+src))};document.head.appendChild(s)})}
function waitReady(){return new Promise(resolve=>{let n=0;const t=setInterval(()=>{n++;if(((window.SWIR_UI99||window.SWIR_UI98)&&window.SWIR_RADAR_DEBUG97)||n>45){clearInterval(t);resolve()}},180)})}
(async()=>{
 await add(CDN+BASE99+'/swir.js?beta105='+Date.now());
 await waitReady();
 // Keep the exact 10.0 notification + MOD shell path that tested best with Friend Radar.
 await add(CDN+WORKING10+'/swir-notify-100-beta.js?v=105');
 await add(CDN+WORKING10+'/swir-mod-tabs-100-beta.js?v=105');
 await add(CDN+WORKING10+'/swir-mod-tabs-100-polish.js?v=105');
 // Independent UI features; none of these replaces or wraps Friend Radar.
 await Promise.allSettled([
   add(CDN+SAFE104+'/swir-theme-fast-104.js?v=105'),
   add(CDN+SAFE104+'/swir-text-style-104.js?v=105'),
   add(CDN+selfRef+'/swir-contrast-105.js?v='+Date.now())
 ]);
 await add(CDN+selfRef+'/swir-ui-fix-105.js?v='+Date.now());
 window.SWIR_CLOUD_VERSION='10.5 BETA — RADAR 10.0 + FULL SCROLL + ICE CONTRAST';
 console.log('✅ SWIR 10.5 BETA gotowy — Friend Radar workflow z 10.0 zachowany');
})().catch(e=>console.error('SWIR 10.5 bootstrap',e));
}catch(e){console.error('SWIR 10.5 BETA bootstrap',e)}})();
