/* SWIR 10.25 BETA — SNAPSHOT MERGE
 * Conservative per-connection arbitration for code 159.
 * Keeps the 10.22 ACK flow unchanged and merges only fresh snapshots (15s TTL).
 * Goal: prevent a later partial 159 from another socket/room from erasing friends
 * already confirmed by another live connection. No Honour Probe. No MIX changes.
 */
(()=>{try{
if(window.__SWIR_SNAPSHOT_MERGE1025)return;window.__SWIR_SNAPSHOT_MERGE1025=1;
const K_STATE='swir_friend_ack_state_1022';
const K_DIAG='swir_snapshot_merge_diag_1025';
const TTL=15000;
const hooked=new WeakSet(),ids=new WeakMap(),snapshots=new Map();let seq=0,lastDecision='boot',lastMergedAt=0;
const now=()=>Date.now();
const canonical=v=>{let s=String(v??'');try{s=s.normalize('NFC')}catch(e){}return s.replace(/[\u200B-\u200D\u2060\uFEFF]/g,'').replace(/\u00A0/g,' ').replace(/(?:📱|📲|☎)\uFE0F?/gu,'').replace(/\s+/g,' ').trim().replace(/:\s*$/,'').trim()};
const key=v=>canonical(v).toLocaleLowerCase('pl-PL');
const uid=v=>{v=Number(v);return Number.isInteger(v)&&v>0?v:0};
const uniq=a=>[...new Set((a||[]).map(x=>String(x||'').trim()).filter(Boolean))];
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch(e){return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}};
function parse(v){try{let p=v?.data??v;if(typeof p==='string')p=JSON.parse(p);return p&&typeof p==='object'?p:null}catch(e){return null}}
function cid(c){if(!c)return 0;if(!ids.has(c))ids.set(c,++seq);return ids.get(c)}
function ws(c){return c?.webSocket||c?.ws||c?.socket||null}
function isOpen(c){try{return Number(ws(c)?.readyState)===1}catch(e){return false}}
function room(c){try{return String(c?.channelName||c?.getChannelName?.()||c?.channelMain?.getChannelName?.()||'').trim()||'-'}catch(e){return'-'}}
function channelId(c){try{return Number(c?.getChannelId?.()||c?.channelId||c?.channelMain?.getChannelId?.()||0)||0}catch(e){return 0}}
function conns(){const out=[],seen=new Set(),add=c=>{if(c&&!seen.has(c)){seen.add(c);out.push(c)}};try{const m=window.CHNS?.connManager;if(!m)return out;add(m.getFirstConnection?.());add(m.getCurrentConnection?.());Object.values(window.CHNS?.channelManager?.channels||{}).forEach(ch=>{try{add(m.getConnectionRelatedWithId?.(ch?.getChannelId?.()))}catch(e){}})}catch(e){}return out}
function roomsOf(u){return uniq((Array.isArray(u?.rooms)?u.rooms:[]).map(r=>typeof r==='string'?r:r?.name))}
function normalizeUsers(arr,t){const users={};for(const u of Array.isArray(arr)?arr:[]){const n=canonical(u?.name||u?.username||u?.login||'');if(!n)continue;users[key(n)]={name:n,id:uid(u?.id||u?.userId),rooms:roomsOf(u),ts:t}}return users}
function prune(t){for(const [id,s] of snapshots){if(t-s.ts>TTL)snapshots.delete(id)}}
function mergeFresh(t){prune(t);const merged={};const used=[];for(const s of snapshots.values()){if(t-s.ts>TTL)continue;used.push({connId:s.connId,room:s.room,channelId:s.channelId,count:Object.keys(s.users).length,age:t-s.ts});for(const [k,u] of Object.entries(s.users)){const old=merged[k];if(!old){merged[k]={...u,rooms:[...(u.rooms||[])]};continue}merged[k]={name:u.name||old.name,id:u.id||old.id,rooms:uniq([...(old.rooms||[]),...(u.rooms||[])]),ts:Math.max(Number(old.ts||0),Number(u.ts||0))}}}return{users:merged,used}}
function apply(reason){const t=now(),m=mergeFresh(t),count=Object.keys(m.users).length;if(!m.used.length)return false;const before=load(K_STATE,{updatedAt:0,users:{}}),beforeCount=Object.keys(before?.users||{}).length;save(K_STATE,{updatedAt:t,users:m.users});lastMergedAt=t;lastDecision=(count>beforeCount?'merged-expanded':count<beforeCount?'merged-shrunk':'merged-stable');const diag={ts:t,reason,decision:lastDecision,beforeCount,mergedCount:count,sources:m.used};save(K_DIAG,diag);try{window.dispatchEvent(new CustomEvent('swir-ack-friends-updated',{detail:{source:'1025-merge',count,reason}}));window.dispatchEvent(new CustomEvent('swir-primary-friends-updated',{detail:{source:'1025-merge',count,reason}}))}catch(e){}return true}
function ingest(p,c){if(Number(p?.code)!==159||!Array.isArray(p.users))return false;const t=now(),id=cid(c);snapshots.set(id,{ts:t,connId:id,room:room(c),channelId:channelId(c),users:normalizeUsers(p.users,t)});/* Registered after 10.22, so this runs after its replace listener for the same socket and restores the fresh union. */setTimeout(()=>apply('incoming-159'),0);return true}
function hook(){for(const c of conns()){const w=ws(c);if(!w||hooked.has(w)||typeof w.addEventListener!=='function')continue;hooked.add(w);w.addEventListener('message',e=>{const p=parse(e);if(p)ingest(p,c)})}}
function diagnostics(){hook();const t=now(),m=mergeFresh(t),out={version:'10.25 SNAPSHOT MERGE',decision:lastDecision,ttlMs:TTL,lastMergedAt,sources:m.used,mergedCount:Object.keys(m.users).length,mergedUsers:Object.values(m.users).map(u=>({name:u.name,id:u.id,rooms:u.rooms})),last:load(K_DIAG,null),trace:window.SWIR_SNAPSHOT_TRACE1024?.diagnostics?.()||null,core:window.SWIR_FRIENDS_ACK1022?.diagnostics?.()||null,queue:window.SWIR_QUEUE1023?.diagnostics?.()||null};console.log('[SWIR 10.25] snapshot merge',out);return out}
function clear(){snapshots.clear();save(K_DIAG,{ts:now(),decision:'cleared'});lastDecision='cleared';return true}
setTimeout(hook,1700);setInterval(()=>{hook();prune(now())},1500);
window.SWIR_SNAPSHOT_MERGE1025={version:'10.25 SNAPSHOT MERGE',hook,apply,diagnostics,clear};
console.log('SWIR 10.25 Snapshot Merge active — fresh per-connection union, TTL 15s');
}catch(e){console.error('SWIR 10.25 Snapshot Merge',e)}})();