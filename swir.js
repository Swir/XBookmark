/* XBookmark SWIR Cloud Bootstrap 9.7 */
(function(){try{
  const current=(document.currentScript&&document.currentScript.src)||'';
  const match=current.match(/\/gh\/Swir\/XBookmark@([^/]+)\//);
  const ref=match&&match[1]?match[1]:'main';
  const base='https://cdn.jsdelivr.net/gh/Swir/XBookmark@'+ref+'/';
  const v=Date.now();
  function load(src,ok){const s=document.createElement('script');s.src=base+src+'?v='+v;s.onload=()=>ok&&ok();s.onerror=()=>console.error('SWIR CLOUD: nie udało się załadować '+src+' @ '+ref);document.head.appendChild(s)}
  function patchAlert(){const old=window.alert;window._swirOriginalAlert97=old;window.alert=function(m){try{m=String(m).replace(/9\.2 COLOR LAB \+ IMAGE DIAGNOSTICS/g,'9.7 FRIEND RADAR REBUILD').replace(/MOBILE RADAR 9\.2/g,'FRIEND RADAR 9.7')}catch(e){}return old.call(window,m)}}
  function restoreAlert(){if(window._swirOriginalAlert97){window.alert=window._swirOriginalAlert97;delete window._swirOriginalAlert97}}
  load('swir-prepatch-96.js',()=>{
    if(window._swirModIsRunning){
      load('swir-patch-96.js',()=>load('swir-radar-97.js'));
      return;
    }
    patchAlert();
    load('swir-core.js',()=>{
      restoreAlert();
      load('swir-patch-96.js',()=>load('swir-radar-97.js'));
    });
    setTimeout(restoreAlert,6000);
  });
}catch(e){console.error('SWIR CLOUD bootstrap 9.7:',e)}})();
