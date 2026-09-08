/* XBookmark SWIR Cloud Bootstrap 9.9 */
(function(){try{
  const current=(document.currentScript&&document.currentScript.src)||'';
  const match=current.match(/\/gh\/Swir\/XBookmark@([^/]+)\//);
  const ref=match&&match[1]?match[1]:'main';
  const base='https://cdn.jsdelivr.net/gh/Swir/XBookmark@'+ref+'/';
  const v=Date.now();
  function load(src,ok){const s=document.createElement('script');s.src=base+src+'?v='+v;s.onload=()=>ok&&ok();s.onerror=()=>console.error('SWIR CLOUD: nie udało się załadować '+src+' @ '+ref);document.head.appendChild(s)}
  function patchAlert(){const old=window.alert;window._swirOriginalAlert99=old;window.alert=function(m){try{m=String(m).replace(/9\.2 COLOR LAB \+ IMAGE DIAGNOSTICS/g,'9.9 FINAL POLISH').replace(/MOBILE RADAR 9\.2/g,'FRIEND RADAR 9.7 + UI 9.9')}catch(e){}return old.call(window,m)}}
  function restoreAlert(){if(window._swirOriginalAlert99){window.alert=window._swirOriginalAlert99;delete window._swirOriginalAlert99}}
  load('swir-prepatch-96.js',()=>{
    if(window._swirModIsRunning){load('swir-radar-97.js',()=>load('swir-ui-99.js'));return}
    patchAlert();
    load('swir-core.js',()=>{restoreAlert();load('swir-radar-97.js',()=>load('swir-ui-99.js'))});
    setTimeout(restoreAlert,6000);
  });
}catch(e){console.error('SWIR CLOUD bootstrap 9.9:',e)}})();
