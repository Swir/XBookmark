/* SWIR 10.16 — ROOMS ONLY PANEL
 * No APP/PC/SWIR/mobile badges. The panel answers one question only: where is this friend?
 * Preferred source: code 159 rooms[]. Fallback: live/open-room observations while server sync is pending.
 */
(()=>{try{
if(window.__SWIR_ROOMS_PANEL1016)return;window.__SWIR_ROOMS_PANEL1016=1;
const L='czateria_znajomi',I='swir_friend_identity_cache_97',S='swir_friend_server_state_97';
const key=n=>String(n||'').trim().toLocaleLowerCase('pl-PL');
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch(e){return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const uniq=a=>[...new Set((a||[]).map(x=>String(x||'').trim()).filter(Boolean))];
const friends=()=>{const a=load(L,[]);return Array.isArray(a)?a.filter(Boolean):[]};
const ids=()=>load(I,{});
const server=()=>{const s=load(S,{updatedAt:0,users:{}});s.users=s.users&&typeof s.users==='object'?s.users:{};return s};
function conns(){const z=new Set();try{const m=window.CHNS?.connManager;if(!m)return[];const a=m.getCurrentConnection?.(),b=m.getFirstConnection?.();a&&z.add(a);b&&z.add(b);Object.values(window.CHNS?.channelManager?.channels||{}).forEach(ch=>{try{const c=m.getConnectionRelatedWithId?.(ch?.getChannelId?.());c&&z.add(c)}catch(e){}})}catch(e){}return[...z]}
function roomName(c){try{return String(c?.channelName||c?.getChannelName?.()||c?.channelMain?.getChannelName?.()||'').trim()}catch(e){return''}}
function localRooms(n){const out=[];for(const c of conns())try{if(c?.getUserWithName?.(n)){const r=roomName(c);if(r)out.push(r)}}catch(e){}const rec=ids()[key(n)];if(rec){if(Array.isArray(rec.rooms))out.push(...rec.rooms);if(rec.room)out.push(rec.room)}return uniq(out)}
function serverRooms(n){const r=server().users[key(n)];return uniq(r?.rooms||[])}
function allRooms(n){const s=serverRooms(n);return s.length?{rooms:s,full:true}:{rooms:localRooms(n),full:false}}
function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function core(){return window.SWIR_FRIENDS_GLOBAL1015||null}
function requestFull(){try{core()?.refresh?.();setTimeout(()=>core()?.syncAll?.(),500)}catch(e){}}
function addFriend(n){n=String(n||'').trim();if(!n)return false;const a=friends();if(!a.some(x=>key(x)===key(n))){a.push(n);save(L,a)}try{core()?.syncOne?.(n);setTimeout(()=>core()?.refresh?.(),2200)}catch(e){}render();return true}
function delFriend(n){save(L,friends().filter(x=>key(x)!==key(n)));render()}
function css(){if(document.getElementById('swirRooms1016Css'))return;const s=document.createElement('style');s.id='swirRooms1016Css';s.textContent=`
#friends-panel.swir-rooms1016{position:absolute!important;width:455px!important;max-width:95vw!important;max-height:600px!important;overflow:auto!important;z-index:9999999!important;background:#08121e!important;color:#eaf5ff!important;border:1px solid var(--swir-a,#00e5ff)!important;border-radius:14px!important;padding:10px!important;box-shadow:0 20px 55px #000a!important;font-family:Arial,sans-serif}
#friends-panel.swir-rooms1016 .rrh{display:flex;align-items:center;gap:8px;color:var(--swir-a,#00e5ff);font-weight:900;font-size:12px}.rrh .rrsp{margin-left:auto}.rrh button,.rradd button,.rrx{background:#122033;color:#eef8ff;border:1px solid #00dfff55;border-radius:7px;padding:6px 8px;cursor:pointer}.rrinfo{font-size:9px;color:#7891a7;background:#060e18;border-radius:8px;padding:7px;margin:8px 0;line-height:1.35}.rrrow{display:flex;gap:8px;align-items:flex-start;padding:9px 2px;border-bottom:1px solid #ffffff12}.rrmain{flex:1;min-width:0}.rrnick{font-size:12px;font-weight:900;color:#eef8ff;word-break:break-word}.rrrooms{font-size:10px;color:#9eb5c8;margin-top:4px;line-height:1.35;word-break:break-word}.rrrooms.full{color:#a9e8c9}.rrrooms.wait{color:#91a9bd}.rradd{display:flex;gap:6px;position:sticky;bottom:-10px;background:#08121e;padding-top:10px}.rradd input{flex:1;min-width:0;background:#050d16;color:#fff;border:1px solid #00dfff55;border-radius:7px;padding:8px}.rrx{border-color:#ff5c8466;color:#ff85a5;padding:5px 8px}
`;document.head.appendChild(s)}
function html(){const st=server(),rows=friends().map(n=>{const d=allRooms(n);let txt='';let cls='wait';if(d.rooms.length){txt=(d.full?'Pokoje: ':'Widoczny teraz: ')+d.rooms.join(', ');cls=d.full?'full':'wait'}else txt='Brak aktualnej lokalizacji — czekam na dane serwera';return `<div class="rrrow" data-n="${esc(n)}"><div class="rrmain"><div class="rrnick">${esc(n)}</div><div class="rrrooms ${cls}">${esc(txt)}</div></div><button class="rrx" data-del="1" title="Usuń znajomego">X</button></div>`}).join('');const age=st.updatedAt?Math.max(0,Math.round((Date.now()-Number(st.updatedAt))/1000)):null;return `<div class="rrh">FRIEND RADAR — POKOJE <span class="rrsp"><button id="rrRefresh1016">ODŚWIEŻ</button><button id="rrClose1016">X</button></span></div><div class="rrinfo">Pokazuję tylko lokalizację. Bez APP / PC / SWIR / telefonu. Pełne wyniki pochodzą z serwerowego <b>159.rooms[]</b>${age!==null?' • ostatni snapshot: '+age+' s temu':''}.</div>${rows||'<div class="rrinfo">Brak znajomych.</div>'}<div class="rradd"><input id="rrInput1016" placeholder="Dodaj znajomego"><button id="rrAdd1016">Dodaj</button></div>`}
function pos(p){try{const b=document.getElementById('friends'),r=b?.getBoundingClientRect?.();if(r){p.style.right=Math.max(8,innerWidth-r.right)+'px';p.style.top=r.bottom+6+'px'}}catch(e){}}
function bind(p){p.querySelector('#rrClose1016')?.addEventListener('click',()=>p.remove());p.querySelector('#rrRefresh1016')?.addEventListener('click',()=>{requestFull();setTimeout(render,400);setTimeout(render,2600)});const inp=p.querySelector('#rrInput1016'),add=()=>{const n=String(inp?.value||'').trim();if(n){addFriend(n);if(inp)inp.value=''}};p.querySelector('#rrAdd1016')?.addEventListener('click',add);inp?.addEventListener('keydown',e=>{if(e.key==='Enter')add()});p.querySelectorAll('.rrrow').forEach(r=>r.querySelector('[data-del]')?.addEventListener('click',()=>delFriend(r.dataset.n)))}
function open(){document.getElementById('friends-panel')?.remove();css();const p=document.createElement('div');p.id='friends-panel';p.className='swir-rooms1016';p.innerHTML=html();document.body.appendChild(p);pos(p);bind(p);requestFull();setTimeout(render,900);setTimeout(render,3000)}
function render(){const p=document.getElementById('friends-panel');if(!p?.classList.contains('swir-rooms1016'))return;const top=p.scrollTop;p.innerHTML=html();bind(p);p.scrollTop=top}
function installButton(){const b=document.getElementById('friends');if(!b)return;b.dataset.r97='1';b.onclick=()=>{const p=document.getElementById('friends-panel');p?.classList.contains('swir-rooms1016')?p.remove():open()}}
installButton();setInterval(()=>{installButton();render()},2200);window.addEventListener('swir-friends-updated',()=>render());
window.SWIR_ROOMS_PANEL1016={version:'10.16 ROOMS ONLY',open,render,allRooms,serverRooms,localRooms,refresh:requestFull,diagnostics(){const out=friends().map(n=>({nick:n,serverRooms:serverRooms(n).join(', '),localRooms:localRooms(n).join(', '),full:serverRooms(n).length>0}));console.table(out);return out}};
console.log('SWIR 10.16 Rooms Only panel active');
}catch(e){console.error('SWIR 10.16 Rooms Only',e)}})();
