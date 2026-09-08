/* SWIR 9.6 — PASSIVE FRIEND RADAR + STABLE CHAT NEON + MOBILE BADGE */
(function(){
'use strict';
try{
  if(window._swirPatch96){console.log('SWIR 9.6 patch już aktywny');return}
  window._swirPatch96=true;
  window.SWIR_CLOUD_VERSION='9.6 PASSIVE RADAR + STABLE CHAT NEON + MOBILE BADGE';

  const K_STATE='swir_friend_server_state',K_STATS='swir_friend_protocol_stats',K_LAST='swir_friend_last_seen',K_IDS='swir_friend_identity_cache',K_LOCAL='czateria_znajomi';
  const pendingCards=new WeakMap(),errors=[];
  let last85=0,lastSync=0;
  const MIN_85=10000,MIN_SYNC=1200;
  try{if(window._swirFriendTracker){clearInterval(window._swirFriendTracker);window._swirFriendTracker=null}}catch(e){}
  function permittedSend(fn){window.__SWIR_ALLOW_FRIEND_SEND96=(Number(window.__SWIR_ALLOW_FRIEND_SEND96)||0)+1;try{return fn()}finally{window.__SWIR_ALLOW_FRIEND_SEND96=Math.max(0,(Number(window.__SWIR_ALLOW_FRIEND_SEND96)||1)-1)}}
  const key=n=>String(n||'').trim().toLocaleLowerCase('pl-PL');
  const uniq=a=>[...new Set((a||[]).filter(Boolean))];
  const load=(k,d)=>{try{const r=localStorage.getItem(k);if(!r)return d;const v=JSON.parse(r);return v!==null&&typeof v==='object'?v:d}catch(e){return d}};
  const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
  const stats=p=>{const s=load(K_STATS,{});if(p){Object.assign(s,p);save(K_STATS,s)}return s};
  const state=()=>{const s=load(K_STATE,{updatedAt:0,users:{}});if(!s.users||typeof s.users!=='object')s.users={};return s};
  const localFriends=()=>{const a=load(K_LOCAL,[]);return Array.isArray(a)?a.filter(Boolean):[]};
  const roomNames=a=>uniq((Array.isArray(a)?a:[]).map(r=>typeof r==='string'?r:(r&&r.name)||'').map(x=>String(x).trim()).filter(Boolean));
  const rec=n=>state().users[key(n)]||null;
  const serverRooms=n=>{const r=rec(n);return r&&Array.isArray(r.rooms)?uniq(r.rooms):[]};
  const identity=n=>load(K_IDS,{})[key(n)]||null;
  const note=(where,e)=>{errors.push({time:new Date().toLocaleTimeString(),where,msg:String(e&&e.message||e)});if(errors.length>30)errors.shift();console.warn('[SWIR 9.6]',where,e)};
  const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

  function remember(n,rooms,id,source){
    try{const name=String(n||'').trim();if(!name)return;const k=key(name),now=Date.now();
      if(rooms&&rooms.length){const a=load(K_LAST,{});a[k]={nick:name,room:rooms[0],rooms:uniq(rooms),ts:now,id:Number(id)||null};save(K_LAST,a)}
      if(Number(id)>0){const ids=load(K_IDS,{});ids[k]={nick:name,id:Number(id),ts:now,source:source||'unknown'};save(K_IDS,ids)}
    }catch(e){note('remember',e)}
  }
  function ingest(packet,source){
    try{if(!packet||!Array.isArray(packet.users)||![159,163].includes(Number(packet.code)))return false;const now=Date.now();const s=Number(packet.code)===159?{updatedAt:now,users:{}}:state();
      packet.users.forEach(u=>{if(!u||!u.name)return;const rs=roomNames(u.rooms),id=Number(u.id)||null;s.users[key(u.name)]={id,name:String(u.name),rooms:rs,ts:now};remember(u.name,rs,id,'code'+packet.code)});
      s.updatedAt=now;save(K_STATE,s);window._swirFriendServerFresh=true;
      stats(Number(packet.code)===159?{lastCode159:now,lastServerCount:Object.keys(s.users).length,lastStatus:'OK_9.6_PASSIVE',captureSource:source}:{lastCode163:now,last163Source:source});
      try{window.dispatchEvent(new CustomEvent('swir-friends-updated',{detail:{source:'swir96',count:Object.keys(s.users).length}}))}catch(e){}
      refreshFriendPanel();return true
    }catch(e){note('ingest',e);return false}
  }
  function parse(x){try{if(!x)return null;if(typeof x==='string')return JSON.parse(x);if(typeof x.data==='string')return JSON.parse(x.data);if(x.data&&typeof x.data==='object')return x.data;if(typeof x==='object')return x}catch(e){}return null}
  function packetLogin(u){return String(u&&((u.login??u.name??u.username??u.userName))||'').trim()}
  function handlePacket(x,src,c){const p=parse(x);if(!p)return;const code=Number(p.code);
    if(code===159||code===163){ingest(p,src);return}
    if(code===183&&Array.isArray(p.cards)){try{pendingCards.set(c,p.cards.map(v=>Number(v&&v.uid)||0));stats({lastCode183:Date.now(),lastCards183:p.cards.length})}catch(e){note('183',e)}return}
    if(code===132&&Array.isArray(p.users)){try{const cards=pendingCards.get(c)||[];p.users.forEach((u,i)=>{const n=packetLogin(u),id=Number(cards[i])||0;if(n&&id>0)remember(n,[],id,'183+132')});setTimeout(harvestConnections,0)}catch(e){note('132',e)}return}
    if(code===184){try{const n=String(p.userName||p.username||'').trim(),id=Number(p.uid)||0;if(n&&id>0)remember(n,[],id,'184')}catch(e){note('184',e)}}
  }

  function connections(){const z=new Set();try{if(!window.CHNS||!CHNS.connManager)return[];
    try{const c=CHNS.connManager.getFirstConnection&&CHNS.connManager.getFirstConnection();if(c)z.add(c)}catch(e){}
    try{const c=CHNS.connManager.getCurrentConnection&&CHNS.connManager.getCurrentConnection();if(c)z.add(c)}catch(e){}
    try{const chs=CHNS.channelManager&&CHNS.channelManager.channels||{};Object.keys(chs).forEach(k=>{try{const ch=chs[k],id=ch&&ch.getChannelId&&ch.getChannelId(),c=id!=null&&CHNS.connManager.getConnectionRelatedWithId&&CHNS.connManager.getConnectionRelatedWithId(id);if(c)z.add(c)}catch(e){}})}catch(e){}
  }catch(e){note('connections',e)}return[...z]}
  function open(c){return!!(c&&c.webSocket&&Number(c.webSocket.readyState)===1)}
  function roomFor(c){try{return String(c.channelName||c.getChannelName&&c.getChannelName()||'').trim()}catch(e){return''}}
  function userId(u){let id=0;try{id=Number(u&&u.getUcUserId&&u.getUcUserId())||0}catch(e){}if(!id)try{id=Number(u&&u.userCardData&&u.userCardData.getUid&&u.userCardData.getUid())||0}catch(e){}return id}
  function harvestUser(u,room,src){try{if(!u)return;const n=String(u.getLogin&&u.getLogin()||u.login||'').trim();if(!n)return;const id=userId(u);if(id>0)remember(n,room?[room]:[],id,src)}catch(e){}}
  function harvestConnections(){try{connections().forEach(c=>{const r=roomFor(c);['meList','closestList','adminsList','honoursList','registeredList','ordinaryList'].forEach(k=>{const a=c&&c[k];if(Array.isArray(a))a.forEach(u=>harvestUser(u,r,'connection.'+k))});localFriends().forEach(n=>{try{const u=c&&c.getUserWithName&&c.getUserWithName(n);if(u)harvestUser(u,r,'getUserWithName')}catch(e){}})})}catch(e){note('harvest',e)}}
  function hook(c){try{if(!c)return;const w=c.webSocket;if(w&&!w._swir96){w._swir96=true;w.addEventListener('message',e=>handlePacket(e,'websocket96',c))}if(typeof c.processMessage==='function'&&!c._swir96){const old=c.processMessage;c.processMessage=function(e){try{handlePacket(e,'processMessage96',this)}catch(x){}const r=old.apply(this,arguments);setTimeout(harvestConnections,0);return r};c._swir96=true}}catch(e){note('hook',e)}}
  function install(){connections().forEach(hook);harvestConnections()}
  function liveUser(nick){const n=String(nick||'').trim();for(const c of connections())try{const u=c&&c.getUserWithName&&c.getUserWithName(n);if(u){const id=userId(u),room=roomFor(c);if(id>0)remember(n,room?[room]:[],id,'liveUser');return{user:u,connection:c,id,room}}}catch(e){}return null}
  function meRegistered(){try{const m=CHNS&&CHNS.connManager&&CHNS.connManager.getMeUser&&CHNS.connManager.getMeUser();return!!(m&&m.isRegistered&&m.isRegistered())}catch(e){return false}}

  /* Sieć 9.6 jest PASYWNA: brak automatycznego 85/8 i brak direct-websocket fallback. */
  function request85(feedback){const say=typeof feedback==='function'?feedback:()=>{};try{const now=Date.now(),remain=MIN_85-(now-last85);if(remain>0){say('⏳ Radar: odczekaj jeszcze '+Math.ceil(remain/1000)+' s przed kolejnym odświeżeniem.');return false}install();const c=connections().find(open)||connections()[0];if(!c||typeof c.send!=='function'){say('Brak aktywnego połączenia.');return false}const ok=permittedSend(()=>c.send(JSON.stringify({code:85}))===true);if(!ok){say('⏳ Klient nie wysłał 85. Nie obchodzę jego limitu — spróbuj później.');return false}last85=now;stats({lastCode85:now,lastStatus:'MANUAL_85_9.6',last85Transport:'Connection.send'});say('📡 Ręczne 85 wysłane. Czekam na 159…');return true}catch(e){note('request85',e);say('Błąd 85: '+e.message);return false}}
  function schedule85(feedback){const delay=Math.max(1800,MIN_85-(Date.now()-last85)+300);setTimeout(()=>request85(feedback),delay)}
  function addOfficial(nick,feedback){const say=typeof feedback==='function'?feedback:()=>{};try{const n=String(nick||'').trim();if(!n)return false;if(rec(n)){say('✅ '+n+' jest już APP.');return true}if(!meRegistered()){say('⚠️ APP Sync wymaga zarejestrowanego własnego nicka.');return false}const now=Date.now();if(now-lastSync<MIN_SYNC){say('⏳ APP Sync: chwila przerwy.');return false}harvestConnections();const live=liveUser(n),cached=identity(n),id=Number(live&&live.id||cached&&cached.id)||0;if(!id){say('ℹ️ Brak ID '+n+'. SWIR zapisze je, gdy użytkownik pojawi się w otwartym pokoju.');return false}const c=(live&&live.connection)||connections().find(open)||connections()[0];if(!c||typeof c.send!=='function'){say('Brak połączenia.');return false}const ok=permittedSend(()=>c.send(JSON.stringify({code:8,subcode:4,userId:id,username:n,isFriend:true}))===true);if(!ok){say('⏳ Klient nie wysłał „Dodaj znajomego”. Nie obchodzę ograniczeń.');return false}lastSync=now;stats({lastCode8Add:now,lastCode8Nick:n,lastCode8UserId:id,lastCode8Transport:'Connection.send'});say('☁️ Dodano żądanie APP dla '+n+'. Radar odświeży listę po bezpiecznej przerwie.');schedule85();return true}catch(e){note('addOfficial',e);say('Błąd APP Sync: '+e.message);return false}}
  function syncLocal(feedback){const say=typeof feedback==='function'?feedback:()=>{};harvestConnections();const todo=localFriends().filter(n=>!rec(n));let ready=[],waiting=[];todo.forEach(n=>(identity(n)&&Number(identity(n).id)?ready:waiting).push(n));if(!ready.length){say('☁ APP: brak nowych znajomych z poznanym ID. Czekam na ID: '+waiting.length+'.');return{sent:0,waiting:waiting.length}}ready.forEach((n,i)=>setTimeout(()=>addOfficial(n,()=>{}),i*1500));say('☁ APP: synchronizuję spokojnie '+ready.length+' znajomych; bez automatycznego floodu. Brak ID: '+waiting.length+'.');return{sent:ready.length,waiting:waiting.length}}

  function patchRadarApi(){try{const a=window.SWIR_FRIEND_RADAR;if(!a)return;const old=a._swir96OldVisible||a.visibleRooms;a._swir96OldVisible=old;a.requestServerState=request85;a.serverRooms=serverRooms;a.serverState=state;a.isOfficialFriend=n=>!!rec(n);a.addToOfficialApp=addOfficial;a.syncVisibleLocal=syncLocal;a.identity=identity;a.visibleRooms=n=>uniq([...serverRooms(n),...(typeof old==='function'?old(n):[])]);a.refreshAll=()=>{install();harvestConnections()};a.diagnostics=diagnostics}catch(e){note('patchApi',e)}}
  function friendStatus(){const s=state(),st=stats();return `PASSIVE • APP: ${Object.keys(s.users||{}).length} • SWIR: ${localFriends().length} • ID: ${Object.keys(load(K_IDS,{})).length} • 159: ${st.lastCode159?new Date(st.lastCode159).toLocaleTimeString():'—'}`}
  function refreshFriendPanel(){try{const p=document.getElementById('friends-panel');if(!p)return;const head=p.firstElementChild;if(head){const title=head.firstElementChild;if(title)title.textContent='🧑‍🤝‍🧑 Znajomi — RADAR 9.6 PASSIVE';let b=p.querySelector('#swirAppSync96');if(!b){p.querySelector('#swirAppSync95')?.remove();p.querySelector('#swirAppSync94')?.remove();b=document.createElement('button');b.id='swirAppSync96';b.textContent='☁ APP';b.title='Ręcznie zsynchronizuj lokalnych znajomych z listą APP';b.style.cssText='background:#10231d;border:1px solid #46dca0;color:#a6f5cf;border-radius:8px;padding:5px 9px;cursor:pointer;font-weight:800';const close=head.querySelector('#swirFriendClose');head.insertBefore(b,close||null);b.onclick=()=>{const st=p.querySelector('#swirFriendProtocolStatus');syncLocal(m=>{if(st)st.innerHTML='<b style="color:#a6f5cf">'+esc(m)+'</b><br><span style="color:#8298ad">'+esc(friendStatus())+'</span>'})}}}
    const proto=p.querySelector('#swirFriendProtocolStatus');if(proto){let hint=p.querySelector('#swir96hint');if(!hint){p.querySelector('#swir95hint')?.remove();p.querySelector('#swir94hint')?.remove();hint=document.createElement('div');hint.id='swir96hint';hint.style.cssText='margin-top:6px;padding-top:6px;border-top:1px solid #ffffff12;color:#91a9bd;line-height:1.45';proto.appendChild(hint)}hint.innerHTML='🛡️ <b style="color:#8cf0c3">Tryb PASSIVE</b>: SWIR sam nic nie wysyła. 📡 i ☁ APP działają tylko po kliknięciu i wyłącznie przez normalny Connection.send.<br><span style="color:#71869a">'+esc(friendStatus())+'</span>'}
    const r=p.querySelector('#swirFriendServerRefresh');if(r&&!r.dataset.swir96){r.dataset.swir96='1';r.title='Ręcznie odśwież APP (85 → 159)';r.onclick=()=>{const st=p.querySelector('#swirFriendProtocolStatus');request85(m=>{if(st)st.textContent=m;setTimeout(refreshFriendPanel,1200)})}}
  }catch(e){note('friendPanel',e)}}

  /* ===== stabilne nicki: tylko autor wiadomości, bez ponownego malowania ===== */
  const COLORS=['#63DDF5','#7BE6A2','#F18BC5','#F1CC72','#B8A3EF','#F39B74','#72C9F2','#F08394','#A8DD7C','#91A9E9','#D99BE9','#75D9BD'];
  function hashName(n){let h=2166136261>>>0;for(const ch of String(n||'').toLocaleLowerCase('pl-PL')){h^=ch.codePointAt(0);h=Math.imul(h,16777619)}return h>>>0}
  function nickColor(n){return COLORS[hashName(n)%COLORS.length]}
  function nickText(el){return String(el&&el.textContent||'').replace(/[:\s]+$/,'').trim()}
  function getUser(n){for(const c of connections())try{const u=c&&c.getUserWithName&&c.getUserWithName(n);if(u)return u}catch(e){}return null}
  function isMobile(n){try{const u=getUser(n);return!!(u&&typeof u.isMobile==='function'&&u.isMobile())}catch(e){return false}}
  function addMobileBadge(el,n){try{if(!isMobile(n))return;const next=el.nextElementSibling;if(next&&next.classList.contains('swir-mobile-badge-96'))return;const b=document.createElement('span');b.className='swir-mobile-badge-96';b.textContent='📱';b.title='Użytkownik mobilny';el.insertAdjacentElement('afterend',b)}catch(e){}}
  function decorateNick(el){if(!el||el.dataset.swirChatNick96==='1')return;const n=nickText(el);if(!n)return;const c=nickColor(n);el.dataset.swirChatNick96='1';el.style.setProperty('--swir-chat-nick',c);el.style.setProperty('--swir-chat-glow',c+'38');addMobileBadge(el,n)}
  function decorateNode(node){try{if(!node||node.nodeType!==1)return;if(node.matches&&node.matches('[id^="m-messages_"] .m-msg-item-user-login'))decorateNick(node);node.querySelectorAll&&node.querySelectorAll('[id^="m-messages_"] .m-msg-item-user-login:not([data-swir-chat-nick96])').forEach(decorateNick)}catch(e){}}
  function decorateExisting(){document.querySelectorAll('[id^="m-messages_"] .m-msg-item-user-login:not([data-swir-chat-nick96])').forEach(decorateNick)}
  function refreshMobileBadges(){document.querySelectorAll('[id^="m-messages_"] .m-msg-item-user-login[data-swir-chat-nick96]').forEach(el=>{if(!(el.nextElementSibling&&el.nextElementSibling.classList.contains('swir-mobile-badge-96')))addMobileBadge(el,nickText(el))})}
  function installNickCss(){document.getElementById('swir-chat-nicks-95')?.remove();document.querySelectorAll('[data-swir-chat-nick95]').forEach(el=>{el.removeAttribute('data-swir-chat-nick95');el.style.removeProperty('color');el.style.removeProperty('font-weight');el.style.removeProperty('text-shadow')});let st=document.getElementById('swir-chat-nicks-96');if(st)return;st=document.createElement('style');st.id='swir-chat-nicks-96';st.textContent=`
    [id^="m-messages_"] .m-msg-item-user-login[data-swir-chat-nick96="1"]{color:var(--swir-chat-nick)!important;font-weight:750!important;text-shadow:0 0 3px var(--swir-chat-glow)!important;animation:none!important;transition:none!important;filter:none!important}
    [id^="m-messages_"] .swir-mobile-badge-96{font-size:9px!important;opacity:.62!important;margin-left:3px!important;margin-right:2px!important;vertical-align:1px!important;text-shadow:none!important;filter:none!important;animation:none!important;color:inherit!important}
  `;document.head.appendChild(st)}

  function polishMod(){try{const p=document.getElementById('configPanel');if(!p)return;const h=p.querySelector('h2 span:first-child');if(h&&!h.dataset.swir96){h.dataset.swir96='1';h.innerHTML='<span style="display:inline-flex;align-items:center;gap:6px;white-space:nowrap"><b style="color:var(--swir-a,#00f5ff);text-shadow:0 0 6px rgba(0,245,255,.22)">SWIR //</b><span>Czateria MOD by Swir</span><span style="font-size:10px;color:#7f94aa">v9.6</span></span><span class="swir-ui-badge">GAMING UI</span>'}}catch(e){note('mod',e)}}
  function diagnostics(){harvestConnections();const s=state(),st=stats(),ids=load(K_IDS,{}),loc=localFriends();const o={version:'9.6 PASSIVE RADAR',networkMode:'PASSIVE / manual only',connections:connections().length,openSockets:connections().filter(open).length,localFriends:loc.length,officialAppFriends:Object.keys(s.users||{}).length,cachedIds:Object.keys(ids).length,last85:st.lastCode85?new Date(st.lastCode85).toLocaleTimeString():'—',last159:st.lastCode159?new Date(st.lastCode159).toLocaleTimeString():'—',lastCode8:st.lastCode8Add?new Date(st.lastCode8Add).toLocaleTimeString():'—',mobileBadges:document.querySelectorAll('.swir-mobile-badge-96').length,errors:errors.length};console.table(o);console.table(loc.map(n=>({nick:n,id:identity(n)&&identity(n).id||'—',type:rec(n)?'APP + SWIR':'SWIR',rooms:serverRooms(n).join(', ')||'—'})));return o}
  window.SWIR_RADAR_DEBUG96={diagnostics,state,ids:()=>load(K_IDS,{}),request85,sync:syncLocal,addOfficial,rooms:serverRooms,errors,isMobile};

  install();patchRadarApi();installNickCss();decorateExisting();refreshFriendPanel();polishMod();
  setInterval(()=>{install();patchRadarApi();refreshFriendPanel();refreshMobileBadges();polishMod()},5000);
  const mo=new MutationObserver(ms=>{ms.forEach(m=>m.addedNodes&&m.addedNodes.forEach(decorateNode));clearTimeout(window._swir96UiTimer);window._swir96UiTimer=setTimeout(()=>{refreshFriendPanel();polishMod()},180)});mo.observe(document.body,{childList:true,subtree:true});
  console.log('✅ SWIR 9.6 — Radar PASSIVE, stabilne nicki, 📱 mobile badge');
}catch(e){console.error('SWIR 9.6 fatal',e)}
})();
