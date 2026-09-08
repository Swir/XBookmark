/* SWIR 9.6 PREPATCH — anti-flood safety gate for friend protocol */
(function(){
'use strict';
try{
  if(window.__SWIR_PREPATCH96)return;
  window.__SWIR_PREPATCH96=true;
  const nativeSend=WebSocket.prototype.send;
  window.__SWIR_NATIVE_WS_SEND96=nativeSend;
  function friendPacket(data){
    try{
      let p=data;
      if(typeof p==='string')p=JSON.parse(p);
      if(!p||typeof p!=='object')return false;
      const code=Number(p.code);
      if(code===85)return true;
      return code===8&&Number(p.subcode)===4&&p.isFriend===true;
    }catch(e){return false}
  }
  WebSocket.prototype.send=function(data){
    try{
      if(friendPacket(data)&&!(Number(window.__SWIR_ALLOW_FRIEND_SEND96)>0)){
        console.debug('[SWIR 9.6] zablokowano automatyczny pakiet Friend Protocol — tryb PASSIVE');
        return;
      }
    }catch(e){}
    return nativeSend.apply(this,arguments);
  };
  console.log('🛡️ SWIR 9.6 PREPATCH: Friend Protocol działa tylko po ręcznej akcji');
}catch(e){console.error('SWIR 9.6 prepatch',e)}
})();
