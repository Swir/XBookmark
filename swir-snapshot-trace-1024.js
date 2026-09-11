/* SWIR 10.24 BETA — SNAPSHOT TRACE
 * Diagnostic-only overlay. It does not alter packets, ACK core state or MIX.
 * Records every incoming code 159 per WebSocket/connection and flags divergent
 * snapshots arriving close together from different connections.
 */
(()=>{try{
if(window.__SWIR_SNAPSHOT_TRACE1024)return;window.__SWIR_SNAPSHOT_TRACE1024=1;
const K='swir_snapshot_trace_1024';
const hooked=new WeakSet(),ids=new WeakMap();let seq=0,last=null,lastDecision='boot';
const now=()=>Date.now();
const canonical=v=>{let s=String(v??'');try{s=s.normalize('NFC')}catch(e){}return s.replace(/[\u200B-\u200D\u2060\uFEFF]/g,'').replace(/\u00A0/g,' ').replace(/\s+/g,' ').trim().toLocaleLowerCase('pl-PL')};
const load=()=>{try{return JSON.parse(localStorage.getItem(K)||'null')||{events:[],divergences:[]}}catch(e){return{events:[],divergences:[]}}};
const save=d=>{try{localStorage.setItem(K,JSON.stringify(d))}catch(e){}};
function parse(v){try{let p=v?.data??v;if(typeof p==='string')p=JSON.parse(p);return p&&typeof p==='object'?p:null}catch(e){return null}}
function cid(c){if(!c)return 0;if(!ids.has(c))ids.set(c,++seq);return ids.get(c)}
function ws(c){return c?.webSocket||c?.ws||c?.socket||null}
function room(c){try{return String(c?.channelName||c?.getChannelName?.()||c?.channelMain?.getChannelName?.()||'').trim()||'-'}catch(e){return'-'}}
function channelId(c){try{return Number(c?.getChannelId?.()||c?.channelId||c?.channelMain?.getChannelId?.()||0)||0}catch(e){return 0}}
function conns(){const out=[],seen=new Set(),add=c=>{if(c&&!seen.has(c)){seen.add(c);out.push(c)}};try{const m=window.CHNS?.connManager;if(!m)return out;add(m.getFirstConnection?.());add(m.getCurrentConnection?.());Object.values(window.CHNS?.channelManager?.channels||{}).forEach(ch=>{try{add(m.getConnectionRelatedWithId?.(ch?.getChannelId?.()))}catch(e){}})}catch(e){}return out}
function fingerprint(users){return (users||[]).map(u=>canonical(u?.name||u?.username||u?.login||'')).filter(Boolean).sort().join('|')}
function ingest(p,c){if(Number(p?.code)!==159||!Array.isArray(p.users))return;const t=now(),names=p.users.map(u=>String(u?.name||u?.username||u?.login||'').trim()).filter(Boolean),fp=fingerprint(p.users),ev={ts:t,connId:cid(c),room:room(c),channelId:channelId(c),count:names.length,names:names.slice(0,80),fingerprint:fp};const d=load();d.events=Array.isArray(d.events)?d.events:[];d.divergences=Array.isArray(d.divergences)?d.divergences:[];d.events.push(ev);if(d.events.length>120)d.events=d.events.slice(-120);
 if(last&&last.connId!==ev.connId&&t-last.ts<12000&&last.fingerprint!==ev.fingerprint){const div={ts:t,a:{connId:last.connId,room:last.room,count:last.count},b:{connId:ev.connId,room:ev.room,count:ev.count},deltaMs:t-last.ts};d.divergences.push(div);if(d.divergences.length>40)d.divergences=d.divergences.slice(-40);lastDecision='divergent-159';}
 else lastDecision='159-observed';last=ev;save(d)}
function hook(){for(const c of conns()){const w=ws(c);if(!w||hooked.has(w)||typeof w.addEventListener!=='function')continue;hooked.add(w);w.addEventListener('message',e=>{const p=parse(e);if(p)ingest(p,c)})}}
function diagnostics(){hook();const d=load(),core=window.SWIR_FRIENDS_ACK1022?.diagnostics?.()||null,q=window.SWIR_QUEUE1023?.diagnostics?.()||null;const out={version:'10.24 SNAPSHOT TRACE',decision:lastDecision,connections:conns().map(c=>({id:cid(c),room:room(c),channelId:channelId(c),open:Number(ws(c)?.readyState)===1})),events:(d.events||[]).slice(-30),divergences:(d.divergences||[]).slice(-20),core,queue:q};console.log('[SWIR 10.24] snapshot trace',out);return out}
function clear(){save({events:[],divergences:[]});last=null;lastDecision='cleared';return true}
setTimeout(hook,1800);setInterval(hook,1500);
window.SWIR_SNAPSHOT_TRACE1024={version:'10.24 SNAPSHOT TRACE',hook,diagnostics,clear};
console.log('SWIR 10.24 Snapshot Trace active — diagnostic only');
}catch(e){console.error('SWIR 10.24 Snapshot Trace',e)}})();