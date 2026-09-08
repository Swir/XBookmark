/* XBookmark SWIR Cloud Bootstrap 9.6 */
(function(){try{
  const current=(document.currentScript&&document.currentScript.src)||'';
  const match=current.match(/\/gh\/Swir\/XBookmark@([^/]+)\//);
  const ref=match&&match[1]?match[1]:'main';
  const base='https://cdn.jsdelivr.net/gh/Swir/XBookmark@'+ref+'/';
  const v=Date.now();
  function load(src,ok){const s=document.createElement('script');s.src=base+src+'?v='+v;s.onload=()=>ok&&ok();s.onerror=()=>console.error('SWIR CLOUD: nie udało się załadować '+src+' @ '+ref);document.head.appendChild(s)}
  function patchAlert(){const old=window.alert;window._swirOriginalAlert96=old;window.alert=function(m){try{m=String(m).replace(/9\.2 COLOR LAB \+ IMAGE DIAGNOSTICS/g,'9.6 PASSIVE RADAR + STABLE CHAT NEON').replace(/MOBILE RADAR 9\.2/g,'RADAR 9.6 PASSIVE')}catch(e){}return old.call(window,m)}}
  function restoreAlert(){if(window._swirOriginalAlert96){window.alert=window._swirOriginalAlert96;delete window._swirOriginalAlert96}}
  load('swir-prepatch-96.js',()=>{
    if(window._swirModIsRunning){load('swir-patch-96.js');return}
    patchAlert();
    load('swir-core.js',()=>{restoreAlert();load('swir-patch-96.js')});
    setTimeout(restoreAlert,6000);
  });
}catch(e){console.error('SWIR CLOUD bootstrap 9.6:',e)}})();
