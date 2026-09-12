/* SWIR 10.28 BETA — ACK ROUTE GUARD
 * Replaces 10.27 global lastAck routing with per-socket ACK candidates.
 * 85 is redirected only when there is exactly one fresh ACK socket.
 * If multiple fresh ACK sockets exist, routing is left unchanged and ambiguity is logged.
 */
(()=>{try{
if(window.__SWIR_ACK_ROUTE_GUARD1028)return;window.__SWIR_ACK_ROUTE_GUARD1028=1;
const rows=[],MAX=220,ids=new WeakMap(),hooked=new WeakSet(),acks=new Map();let seq=0,redirects=0,passes=0,ambiguous=0,fallbacks=0;
const now=()=>Date.now();
function sid(w){if(!w)return 0;if(!ids.has(w))ids.set(w,++seq);return ids.get(w)}
function parse(v){try{let p=v?.data??v;if(typeof p==='string')p=JSON.parse(p);return p&&typeof p==='object'?p:null}catch(e){return null}}
function ws(c){return c?.webSocket||c?.ws||c?.socket||null}
function room(c){try{return String(c?.channelName||c?.getChannelName?.()||c?.channelMain?.getChannelName?.()||'-')}catch(e){return'-'}}
function channel(c){try{return Number(c?.getChannelId?.()||c?.channelId||c?.channelMain?.getChannelId?.()||0)||0}catch(e){return 0}}
function conns(){const out=[],seen=new Set(),add=c=>{if(c&&!seen.has(c)){seen.add(c);out.push(c)}};try{const m=window.CHNS?.connManager;if(!m)return out;add(m.getFirstConnection?.());add(m.getCurrentConnection?.());Object.values(window.CHNS?.channelManager?.channels||{}).forEach(ch=>{try{add(m.getConnectionRelatedWithId?.(ch?.getChannelId?.()))}catch(e){}})}catch(e){}return out}
function push(x){rows.push({...x,ts:now()});while(rows.length>MAX)rows.shift();try{localStorage.setItem('swir_ack_route_guard_diag_1028',JSON.stringify(rows.slice(-100)))}catch(e){}}
function prune(){const t=now();for(const [id,a] of acks)if(!a?.socket||Number(a.socket.readyState)!==1||t-a.ts>12000)acks.delete(id)}
function hook(){for(const c of conns()){const w=ws(c);if(!w||hooked.has(w)||typeof w.addEventListener!=='function')continue;hooked.add(w);w.addEventListener('message',ev=>{try{const p=parse(ev);if(Number(p?.code)!==8||Number(p?.subcode)!==4||p?.isFriend===false)return;const id=sid(w),a={ts:now(),socket:w,socketId:id,room:room(c),channelId:channel(c),nick:String(p?.username||p?.name||''),id:Number(p?.userId||p?.id||0)||0};acks.set(id,a);push({type:'ACK_SOCKET',socketId:id,room:a.room,channelId:a.channelId,nick:a.nick,id:a.id})}catch(e){}})}}
let previous=WebSocket.prototype.send;
if(previous?.__swirRoutePin1027&&previous.__previous)previous=previous.__previous;
if(!WebSocket.prototype.send.__swirRouteGuard1028){const wrapped=function(data){try{const p=parse(data);if(Number(p?.code)===85){prune();const sourceId=sid(this),own=acks.get(sourceId),fresh=[...acks.values()].filter(a=>now()-a.ts>=0&&now()-a.ts<=12000&&Number(a.socket?.readyState)===1);if(own){passes++;push({type:'ROUTE_SAME_SOCKET',socketId:sourceId,ackAgeMs:now()-own.ts,ackRoom:own.room,ackNick:own.nick});return previous.apply(this,arguments)}if(fresh.length===1){const a=fresh[0];redirects++;push({type:'ROUTE_GUARD_PIN',fromSocketId:sourceId,toSocketId:a.socketId,ackAgeMs:now()-a.ts,ackRoom:a.room,ackNick:a.nick});return previous.apply(a.socket,arguments)}if(fresh.length>1){ambiguous++;push({type:'ROUTE_AMBIGUOUS',socketId:sourceId,candidates:fresh.map(a=>({socketId:a.socketId,room:a.room,nick:a.nick,ageMs:now()-a.ts}))});return previous.apply(this,arguments)}fallbacks++;push({type:'ROUTE_NO_FRESH_ACK',socketId:sourceId});}}
catch(e){push({type:'GUARD_ERROR',error:String(e?.message||e)})}return previous.apply(this,arguments)};wrapped.__swirRouteGuard1028=true;wrapped.__previous=previous;WebSocket.prototype.send=wrapped}
setInterval(()=>{hook();prune()},450);hook();
window.SWIR_ACK_ROUTE_GUARD1028={version:'10.28',diagnostics:()=>({redirects,passes,ambiguous,fallbacks,freshAcks:[...acks.values()].map(a=>({socketId:a.socketId,room:a.room,channelId:a.channelId,nick:a.nick,id:a.id,ageMs:now()-a.ts,open:Number(a.socket?.readyState)===1})),rows:[...rows],ambiguities:rows.filter(x=>x.type==='ROUTE_AMBIGUOUS').slice(-30),pins:rows.filter(x=>x.type==='ROUTE_GUARD_PIN').slice(-30)}),clear:()=>{rows.length=0;acks.clear();redirects=passes=ambiguous=fallbacks=0;try{localStorage.removeItem('swir_ack_route_guard_diag_1028')}catch(e){}}};
console.log('SWIR 10.28 ACK Route Guard ready');
}catch(e){console.error('SWIR 10.28 ACK Route Guard',e)}})();