/* SWIR 9.7 PREPATCH — blocks only legacy SWIR-core friend traffic, never native CZATeria traffic */
(function(){
'use strict';
try{
  if(window.__SWIR_PREPATCH97)return;
  window.__SWIR_PREPATCH97=true;
  const isFriendPacket=data=>{
    try{let p=data;if(typeof p==='string')p=JSON.parse(p);if(!p||typeof p!=='object')return false;const code=Number(p.code);return code===85||(code===8&&[4,5].includes(Number(p.subcode)));}catch(e){return false}
  };
  const fromLegacyCore=()=>{try{return String((new Error()).stack||'').includes('swir-core.js')}catch(e){return false}};

  if(window.CHNS&&CHNS.Connection&&CHNS.Connection.prototype&&typeof CHNS.Connection.prototype.send==='function'&&!CHNS.Connection.prototype.send.__swir97Guard){
    const original=CHNS.Connection.prototype.send;
    function guardedSend(data){
      if(isFriendPacket(data)&&fromLegacyCore()){
        console.debug('[SWIR 9.7] zatrzymano stary automatyczny Friend Protocol z swir-core.js');
        return false;
      }
      return original.apply(this,arguments);
    }
    guardedSend.__swir97Guard=true;guardedSend.__swir97Original=original;
    CHNS.Connection.prototype.send=guardedSend;
  }

  if(!WebSocket.prototype.send.__swir97Guard){
    const nativeSend=WebSocket.prototype.send;
    function guardedWsSend(data){
      if(isFriendPacket(data)&&fromLegacyCore()){
        console.debug('[SWIR 9.7] zatrzymano direct WebSocket Friend Protocol ze starego rdzenia');
        return;
      }
      return nativeSend.apply(this,arguments);
    }
    guardedWsSend.__swir97Guard=true;guardedWsSend.__swir97Original=nativeSend;
    WebSocket.prototype.send=guardedWsSend;
  }
  console.log('🛡️ SWIR 9.7 PREPATCH: blokowany jest wyłącznie legacy friend traffic z swir-core.js');
}catch(e){console.error('SWIR 9.7 prepatch',e)}
})();
