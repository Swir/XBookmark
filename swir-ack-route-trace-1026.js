/* SWIR 10.26 BETA — ACK ROUTE TRACE
 * Diagnostic-only: verifies whether the post-ACK code 85 request is sent on
 * the same live connection that delivered ACK 8/4. Does not alter protocol,
 * timings, STABLE, or MIX 10.19.
 */
(()=>{try{
if(window.__SWIR_ACK_ROUTE_TRACE1026)return;window.__SWIR_ACK_ROUTE_TRACE1026=1;
const rows=[],MAX=180,ids=new WeakMap();let seq=0,lastAck=null;
const now=()=>Date.now();
function id(w){if(!w)return 0;if(!ids.has(w))ids.set(w,++seq);return ids.get(w)}
function parse(v){try{let p=v?.data??v;if(typeof p==='string')p=JSON.parse(p);return p&&typeof p==='object'?p:null}catch(e){return null}}
function connFor(w){try{const m=window.CHNS?.connManager,cs=[],seen=new Set(),add=c=>{if(c&&!seen.has(c)){seen.add(c);cs.push(c)}};add(m?.getFirstConnection?.());add(m?.getCurrentConnection?.());Object.values(window.CHNS?.channelManager?.channels||{}).forEach(ch=>{try{add(m?.getConnectionRelatedWithId?.(ch?.getChannelId?.()))}catch(e){}});for(const c of cs){const cw=c?.webSocket||c?.ws||c?.socket;if(cw===w)return{room:String(c?.channelName||c?.getChannelName?.()||c?.channelMain?.getChannelName?.()||'-'),channelId:Number(c?.getChannelId?.()||c?.channelId||c?.channelMain?.getChannelId?.()||0)||0}}}catch(e){}return{room:'-',channelId:0}}
function push(x){rows.push({...x,ts:now()});while(rows.length>MAX)rows.shift();try{localStorage.setItem('swir_ack_route_diag_1026',JSON.stringify(rows.slice(-80)))}catch(e){}}
const prevSend=WebSocket.prototype.send;
if(!prevSend.__swirRouteTrace1026){const wrapped=function(data){try{const p=parse(data);if(Number(p?.code)===85){const meta=connFor(this),sid=id(this),dt=lastAck?now()-lastAck.ts:null,same=!!lastAck&&lastAck.socketId===sid;push({type:'OUT_85',socketId:sid,...meta,afterAckMs:dt,sameAsAck:!!same,ack:lastAck?{socketId:lastAck.socketId,room:lastAck.room,channelId:lastAck.channelId,nick:lastAck.nick,id:lastAck.id}:null});if(lastAck&&dt>=0&&dt<8000&&!same)push({type:'ROUTE_MISMATCH',ackSocketId:lastAck.socketId,out85SocketId:sid,ackRoom:lastAck.room,out85Room:meta.room,afterAckMs:dt})}}catch(e){}return prevSend.apply(this,arguments)};wrapped.__swirRouteTrace1026=true;wrapped.__previous=prevSend;WebSocket.prototype.send=wrapped}
const hooked=new WeakSet();
function hook(){try{const sockets=[];document;const m=window.CHNS?.connManager,cs=[],seen=new Set(),add=c=>{if(c&&!seen.has(c)){seen.add(c);cs.push(c)}};add(m?.getFirstConnection?.());add(m?.getCurrentConnection?.());Object.values(window.CHNS?.channelManager?.channels||{}).forEach(ch=>{try{add(m?.getConnectionRelatedWithId?.(ch?.getChannelId?.()))}catch(e){}});for(const c of cs){const w=c?.webSocket||c?.ws||c?.socket;if(!w||hooked.has(w)||typeof w.addEventListener!=='function')continue;hooked.add(w);w.addEventListener('message',ev=>{try{const p=parse(ev);if(Number(p?.code)!==8||Number(p?.subcode)!==4)return;const meta=connFor(w);lastAck={ts:now(),socketId:id(w),...meta,nick:String(p?.username||p?.name||''),id:Number(p?.userId||p?.id||0)||0};push({type:'IN_ACK',...lastAck})}catch(e){}})}}catch(e){}}
setInterval(hook,450);hook();
window.SWIR_ACK_ROUTE_TRACE1026={version:'10.26',diagnostics:()=>({lastAck,rows:[...rows],mismatches:rows.filter(x=>x.type==='ROUTE_MISMATCH').slice(-30),recent85:rows.filter(x=>x.type==='OUT_85').slice(-30)}),clear:()=>{rows.length=0;lastAck=null;try{localStorage.removeItem('swir_ack_route_diag_1026')}catch(e){}}};
console.log('SWIR 10.26 ACK Route Trace ready');
}catch(e){console.error('SWIR 10.26 ACK Route Trace',e)}})();