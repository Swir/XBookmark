/* SWIR 10.27 BETA — ACK ROUTE PIN
 * Narrow routing fix: after a fresh server ACK 8/4, outgoing code 85 is sent
 * through the exact WebSocket that delivered that ACK. Timings stay unchanged.
 * Falls back to the original route if the ACK socket is closed/stale.
 */
(()=>{try{
if(window.__SWIR_ACK_ROUTE_PIN1027)return;window.__SWIR_ACK_ROUTE_PIN1027=1;
const rows=[],MAX=180,ids=new WeakMap(),hooked=new WeakSet();let seq=0,lastAck=null,redirects=0,passes=0;
const now=()=>Date.now();
function sid(w){if(!w)return 0;if(!ids.has(w))ids.set(w,++seq);return ids.get(w)}
function parse(v){try{let p=v?.data??v;if(typeof p==='string')p=JSON.parse(p);return p&&typeof p==='object'?p:null}catch(e){return null}}
function ws(c){return c?.webSocket||c?.ws||c?.socket||null}
function room(c){try{return String(c?.channelName||c?.getChannelName?.()||c?.channelMain?.getChannelName?.()||'-')}catch(e){return'-'}}
function channel(c){try{return Number(c?.getChannelId?.()||c?.channelId||c?.channelMain?.getChannelId?.()||0)||0}catch(e){return 0}}
function conns(){const out=[],seen=new Set(),add=c=>{if(c&&!seen.has(c)){seen.add(c);out.push(c)}};try{const m=window.CHNS?.connManager;if(!m)return out;add(m.getFirstConnection?.());add(m.getCurrentConnection?.());Object.values(window.CHNS?.channelManager?.channels||{}).forEach(ch=>{try{add(m.getConnectionRelatedWithId?.(ch?.getChannelId?.()))}catch(e){}})}catch(e){}return out}
function push(x){rows.push({...x,ts:now()});while(rows.length>MAX)rows.shift();try{localStorage.setItem('swir_ack_route_pin_diag_1027',JSON.stringify(rows.slice(-80)))}catch(e){}}
function hook(){for(const c of conns()){const w=ws(c);if(!w||hooked.has(w)||typeof w.addEventListener!=='function')continue;hooked.add(w);w.addEventListener('message',ev=>{try{const p=parse(ev);if(Number(p?.code)!==8||Number(p?.subcode)!==4||p?.isFriend===false)return;lastAck={ts:now(),socket:w,socketId:sid(w),room:room(c),channelId:channel(c),nick:String(p?.username||p?.name||''),id:Number(p?.userId||p?.id||0)||0};push({type:'ACK_PIN',socketId:lastAck.socketId,room:lastAck.room,channelId:lastAck.channelId,nick:lastAck.nick,id:lastAck.id})}catch(e){}})}}
const previous=WebSocket.prototype.send;
if(!previous.__swirRoutePin1027){const wrapped=function(data){try{const p=parse(data);if(Number(p?.code)===85&&lastAck){const age=now()-lastAck.ts,ackWs=lastAck.socket,ackOpen=Number(ackWs?.readyState)===1;if(age>=0&&age<=20000&&ackOpen){const from=sid(this),to=lastAck.socketId;if(this!==ackWs){redirects++;push({type:'ROUTE_PIN',fromSocketId:from,toSocketId:to,ackAgeMs:age,ackRoom:lastAck.room,ackNick:lastAck.nick});return previous.apply(ackWs,arguments)}passes++;push({type:'ROUTE_OK',socketId:from,ackAgeMs:age,ackRoom:lastAck.room,ackNick:lastAck.nick})}else if(age>20000||!ackOpen){push({type:'ROUTE_FALLBACK',socketId:sid(this),reason:!ackOpen?'ack-socket-closed':'ack-stale',ackAgeMs:age})}}}catch(e){push({type:'PIN_ERROR',error:String(e?.message||e)})}return previous.apply(this,arguments)};wrapped.__swirRoutePin1027=true;wrapped.__previous=previous;WebSocket.prototype.send=wrapped}
setInterval(hook,450);hook();
window.SWIR_ACK_ROUTE_PIN1027={version:'10.27',diagnostics:()=>({lastAck:lastAck?{ts:lastAck.ts,socketId:lastAck.socketId,room:lastAck.room,channelId:lastAck.channelId,nick:lastAck.nick,id:lastAck.id,ageMs:now()-lastAck.ts,open:Number(lastAck.socket?.readyState)===1}:null,redirects,passes,rows:[...rows],pins:rows.filter(x=>x.type==='ROUTE_PIN').slice(-30),fallbacks:rows.filter(x=>x.type==='ROUTE_FALLBACK').slice(-30)}),clear:()=>{rows.length=0;redirects=0;passes=0;lastAck=null;try{localStorage.removeItem('swir_ack_route_pin_diag_1027')}catch(e){}}};
console.log('SWIR 10.27 ACK Route Pin ready');
}catch(e){console.error('SWIR 10.27 ACK Route Pin',e)}})();