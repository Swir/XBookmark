/* SWIR 9.4 — GLOBAL FRIEND SYNC + NEON NICKS + UI POLISH */
(function(){
'use strict';
try{
  if(window._swirPatch94){ console.log('SWIR 9.4 patch już aktywny'); return; }
  window._swirPatch94=true;
  window.SWIR_CLOUD_VERSION='9.4 FRIEND RADAR APP SYNC + NEON UI';

  const K_STATE='swir_friend_server_state';
  const K_STATS='swir_friend_protocol_stats';
  const K_LAST='swir_friend_last_seen';
  const K_IDS='swir_friend_identity_cache';
  const K_LOCAL='czateria_znajomi';
  const errors=[];
  let last85=0;

  const key=n=>String(n||'').trim().toLocaleLowerCase('pl-PL');
  const uniq=a=>[...new Set((a||[]).filter(Boolean))];
  const load=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k)||'');return v&&typeof v==='object'?v:d}catch(e){return d}};
  const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
  const roomNames=a=>uniq((Array.isArray(a)?a:[]).map(r=>typeof r==='string'?r:(r&&r.name)||'').map(x=>String(x).trim()));
  const state=()=>{const s=load(K_STATE,{updatedAt:0,users:{}});if(!s.users||typeof s.users!=='object')s.users={};return s};
  const stats=p=>{const s=load(K_STATS,{});if(p){Object.assign(s,p);save(K_STATS,s)}return s};
  function note(where,e){errors.push({time:new Date().toLocaleTimeString(),where,msg:String(e&&e.message||e)});if(errors.length>30)errors.shift();console.warn('[SWIR 9.4]',where,e)}
  function localFriends(){const x=load(K_LOCAL,[]);return Array.isArray(x)?x.filter(Boolean):[]}
  function rec(n){return state().users[key(n)]||null}
  function serverRooms(n){const r=rec(n);return r&&Array.isArray(r.rooms)?uniq(r.rooms):[]}
  function remember(n,rs,id){
    try{
      const k=key(n), now=Date.now();
      if(rs&&rs.length){const a=load(K_LAST,{});a[k]={nick:String(n),room:rs[0],rooms:uniq(rs),ts:now,id:id||null};save(K_LAST,a)}
      if(Number(id)>0){const ids=load(K_IDS,{});ids[k]={nick:String(n),id:Number(id),ts:now};save(K_IDS,ids)}
    }catch(e){note('remember',e)}
  }
  function identity(n){const x=load(K_IDS,{});return x[key(n)]||null}

  function ingest(packet,source){
    try{
      if(!packet||!Array.isArray(packet.users)||![159,163].includes(Number(packet.code)))return false;
      const now=Date.now();
      const s=Number(packet.code)===159?{updatedAt:now,users:{}}:state();
      packet.users.forEach(u=>{
        if(!u||!u.name)return;
        const rs=roomNames(u.rooms), id=Number(u.id)||null;
        s.users[key(u.name)]={id,name:String(u.name),rooms:rs,ts:now};
        remember(u.name,rs,id);
      });
      s.updatedAt=now;save(K_STATE,s);window._swirFriendServerFresh=true;
      stats(Number(packet.code)===159?{lastCode159:now,lastServerCount:Object.keys(s.users).length,lastStatus:'OK_9.4',captureSource:source}:{lastCode163:now,last163Source:source});
      try{window.dispatchEvent(new CustomEvent('swir-friends-updated',{detail:{source:'swir94',count:Object.keys(s.users).length}}))}catch(e){}
      refreshFriendPanel();
      return true;
    }catch(e){note('ingest',e);return false}
  }
  function parse(x){try{if(!x)return null;if(typeof x==='string')return JSON.parse(x);if(typeof x.data==='string')return JSON.parse(x.data);if(x.data&&typeof x.data==='object')return x.data;if(typeof x==='object')return x}catch(e){}return null}
  function handle(x,src){const p=parse(x);if(p&&[159,163].includes(Number(p.code)))ingest(p,src)}

  function connections(){
    const z=new Set();
    try{
      if(!window.CHNS||!CHNS.connManager)return [];
      try{const c=CHNS.connManager.getFirstConnection&&CHNS.connManager.getFirstConnection();if(c)z.add(c)}catch(e){}
      try{const c=CHNS.connManager.getCurrentConnection&&CHNS.connManager.getCurrentConnection();if(c)z.add(c)}catch(e){}
      try{
        const chans=CHNS.channelManager&&CHNS.channelManager.channels||{};
        Object.keys(chans).forEach(k=>{try{const ch=chans[k],id=ch&&ch.getChannelId&&ch.getChannelId(),c=id!=null&&CHNS.connManager.getConnectionRelatedWithId&&CHNS.connManager.getConnectionRelatedWithId(id);if(c)z.add(c)}catch(e){}});
      }catch(e){}
      try{
        document.querySelectorAll('[id^="m-users_"]').forEach(el=>{const h=String(el.id||'').replace(/^m-users_/,'');try{const ch=CHNS.channelManager.getChannelRelatedWithNameHash&&CHNS.channelManager.getChannelRelatedWithNameHash(h),id=ch&&ch.getChannelId&&ch.getChannelId(),c=id!=null&&CHNS.connManager.getConnectionRelatedWithId&&CHNS.connManager.getConnectionRelatedWithId(id);if(c)z.add(c)}catch(e){}});
      }catch(e){}
    }catch(e){note('connections',e)}
    return [...z];
  }
  function hook(c){
    try{
      if(!c)return;
      const w=c.webSocket;
      if(w&&!w._swir94){w._swir94=true;w.addEventListener('message',e=>handle(e,'websocket94'))}
      if(typeof c.processMessage==='function'&&!c._swir94){const old=c.processMessage;c.processMessage=function(e){try{handle(e,'processMessage94')}catch(x){}return old.apply(this,arguments)};c._swir94=true}
    }catch(e){note('hook',e)}
  }
  function install(){connections().forEach(hook)}

  function request85(feedback,force){
    const say=typeof feedback==='function'?feedback:null;
    try{
      const now=Date.now();if(!force&&now-last85<2500)return false;last85=now;install();
      const cs=connections(),c=cs.find(x=>x&&x.webSocket&&Number(x.webSocket.readyState)===1)||cs[0];
      if(!c){say&&say('Brak aktywnego połączenia.');return false}
      const raw=JSON.stringify({code:85});let ok=false;
      if(typeof c.send==='function')try{ok=c.send(raw)!==false}catch(e){note('send85',e)}
      if(!ok&&c.webSocket&&Number(c.webSocket.readyState)===1)try{c.webSocket.send(raw);ok=true}catch(e){note('ws85',e)}
      if(ok){stats({lastCode85:now,lastStatus:'REQUEST_9.4'});say&&say('📡 Odświeżam globalną listę APP (85 → 159)…');return true}
      say&&say('Nie udało się wysłać 85.');return false;
    }catch(e){note('request85',e);say&&say('Błąd 85: '+e.message);return false}
  }

  function roomNameForConn(c){
    try{return String(c.channelName||c.getChannelName&&c.getChannelName()||'').trim()}catch(e){return ''}
  }
  function liveUser(nick){
    const n=String(nick||'').trim();if(!n)return null;
    for(const c of connections()){
      try{
        if(typeof c.getUserWithName!=='function')continue;
        const u=c.getUserWithName(n);if(!u)continue;
        let id=0;try{id=Number(u.getUcUserId&&u.getUcUserId())||0}catch(e){}
        const registered=!!(u.isRegistered&&u.isRegistered());
        const r=roomNameForConn(c);
        if(id>0)remember(n,r?[r]:[],id);
        return {user:u,connection:c,id,registered,room:r};
      }catch(e){}
    }
    return null;
  }
  function cacheLiveIdentities(){
    try{localFriends().forEach(n=>{const x=liveUser(n);if(x&&x.id>0)remember(n,x.room?[x.room]:[],x.id)})}catch(e){note('cacheIds',e)}
  }
  function meRegistered(){try{const m=CHNS&&CHNS.connManager&&CHNS.connManager.getMeUser&&CHNS.connManager.getMeUser();return!!(m&&m.isRegistered&&m.isRegistered())}catch(e){return false}}

  /* APK 2.6.3: code 8, subcode 4 = ADD friend/enemy; isFriend=true = friend.
     subcode 5 = REMOVE. Wysyłamy wyłącznie normalną akcję "dodaj znajomego". */
  function addToOfficialApp(nick,feedback){
    const say=typeof feedback==='function'?feedback:()=>{};
    try{
      const n=String(nick||'').trim();if(!n){say('Brak nicka.');return false}
      if(rec(n)){say('✅ '+n+' jest już na liście APP.');return true}
      if(!meRegistered()){say('⚠️ Globalna lista APP wymaga zalogowanego, zarejestrowanego nicka.');return false}
      const live=liveUser(n), cached=identity(n);let id=live&&live.id||cached&&Number(cached.id)||0;
      if(!id){say('ℹ️ Nie mam jeszcze ID '+n+'. Musi pojawić się choć raz w którymś otwartym pokoju; SWIR zapamięta ID automatycznie.');return false}
      const c=(live&&live.connection)||connections().find(x=>x&&x.webSocket&&Number(x.webSocket.readyState)===1)||connections()[0];
      if(!c||typeof c.send!=='function'){say('Brak połączenia do synchronizacji APP.');return false}
      const raw=JSON.stringify({code:8,subcode:4,userId:Number(id),username:n,isFriend:true});
      const ok=c.send(raw)!==false;
      if(!ok){say('Nie udało się wysłać normalnej akcji dodania do APP.');return false}
      stats({lastCode8Add:Date.now(),lastCode8Nick:n});
      say('☁️ Dodaję '+n+' do oficjalnej listy APP…');
      setTimeout(()=>request85(say,true),900);
      return true;
    }catch(e){note('addToOfficialApp',e);say('Błąd APP Sync: '+e.message);return false}
  }
  function syncVisibleLocal(feedback){
    const say=typeof feedback==='function'?feedback:()=>{};
    cacheLiveIdentities();
    const todo=localFriends().filter(n=>!rec(n));
    if(!todo.length){say('✅ Wszyscy lokalni znajomi SWIR są już na liście APP.');return {sent:0,waiting:0}}
    let waiting=0;
    todo.forEach((n,i)=>{
      const live=liveUser(n), cached=identity(n), id=live&&live.id||cached&&cached.id;
      if(!id){waiting++;return}
      setTimeout(()=>addToOfficialApp(n,()=>{}),i*180);
    });
    setTimeout(()=>request85(null,true),Math.max(900,todo.length*180+500));
    say('☁️ APP Sync: mam ID dla '+(todo.length-waiting)+' z '+todo.length+'. Brak ID: '+waiting+'.');
    return {sent:todo.length-waiting,waiting};
  }

  function patchRadarApi(){
    try{
      const a=window.SWIR_FRIEND_RADAR;if(!a)return;
      const oldVisible=a.visibleRooms;
      a.requestServerState=request85;
      a.serverRooms=serverRooms;
      a.serverState=state;
      a.isOfficialFriend=n=>!!rec(n);
      a.addToOfficialApp=addToOfficialApp;
      a.syncVisibleLocal=syncVisibleLocal;
      a.identity=identity;
      a.visibleRooms=n=>uniq([...serverRooms(n),...(typeof oldVisible==='function'?oldVisible(n):[])]);
      a.refreshAll=()=>{cacheLiveIdentities();install();request85(null,true)};
    }catch(e){note('patchRadarApi',e)}
  }

  function friendStatusText(){
    const s=state(), st=stats(), app=Object.keys(s.users||{}).length, local=localFriends().length;
    const t=st.lastCode159?new Date(st.lastCode159).toLocaleTimeString():'—';
    return `📱 APP global: ${app} • SWIR lokalni: ${local} • 159: ${t}`;
  }
  function refreshFriendPanel(){
    try{
      const p=document.getElementById('friends-panel');if(!p)return;
      const head=p.firstElementChild;
      if(head){const title=head.firstElementChild;if(title)title.textContent='🧑‍🤝‍🧑 Znajomi — FRIEND RADAR 9.4';
        if(!p.querySelector('#swirAppSync94')){
          const b=document.createElement('button');b.id='swirAppSync94';b.title='Dodaj lokalnych znajomych SWIR do oficjalnej listy APP — wtedy serwer zwraca ich pokoje globalnie';b.textContent='☁ APP';b.style.cssText='background:#10261f;border:1px solid #35f2a4;color:#9affd3;border-radius:8px;padding:5px 9px;cursor:pointer;font-weight:800;box-shadow:0 0 12px #35f2a433';
          const close=head.querySelector('#swirFriendClose');head.insertBefore(b,close||null);
          b.onclick=()=>{const st=p.querySelector('#swirFriendProtocolStatus');syncVisibleLocal(m=>{if(st)st.innerHTML='<b style="color:#9affd3">'+escapeHtml(m)+'</b><br>'+escapeHtml(friendStatusText())})};
        }
      }
      const proto=p.querySelector('#swirFriendProtocolStatus');
      if(proto){
        let hint=p.querySelector('#swir94hint');
        if(!hint){hint=document.createElement('div');hint.id='swir94hint';hint.style.cssText='margin-top:6px;padding-top:6px;border-top:1px solid #ffffff12;color:#91a9bd;line-height:1.45';proto.appendChild(hint)}
        hint.innerHTML='🌍 <b style="color:#72ffc1">APP</b> = serwer zwraca pokoje globalnie. <b style="color:#72cfff">SWIR</b> = lokalny. Kliknij <b style="color:#9affd3">☁ APP</b>, żeby zsynchronizować widocznych/poznanych znajomych z normalną listą aplikacji.<br><span style="color:#71869a">'+escapeHtml(friendStatusText())+'</span>';
      }
      const r=p.querySelector('#swirFriendServerRefresh');if(r&&!r.dataset.swir94){r.dataset.swir94='1';r.onclick=()=>request85(null,true)}
    }catch(e){note('friendPanel',e)}
  }
  function escapeHtml(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}

  const PALETTE=['#00F5FF','#39FF14','#FF4FD8','#FFD166','#B76CFF','#FF8A2A','#7DF9FF','#FF667F','#B8FF5A','#5D9CFF','#FF9DE2','#70FFB1','#F6FF70','#FF5CF4','#58E8FF','#8BFFDB'];
  function hashName(n){let h=2166136261>>>0;for(const ch of String(n||'').toLocaleLowerCase('pl-PL')){h^=ch.codePointAt(0);h=Math.imul(h,16777619)}return h>>>0}
  function neonColor(n){return PALETTE[hashName(n)%PALETTE.length]}
  function cleanNick(t){return String(t||'').replace(/^[+\-~*\s]+/,'').replace(/[:\s]+$/,'').trim()}
  function paintNick(el){
    try{
      if(!el||el.dataset.swirNeon94==='1')return;
      const n=cleanNick(el.textContent);if(!n||n.length>80)return;
      const c=neonColor(n);el.dataset.swirNeon94='1';el.dataset.swirNeonNick=n;
      el.style.setProperty('color',c,'important');
      el.style.setProperty('font-weight','900','important');
      el.style.setProperty('text-shadow',`0 0 4px ${c},0 0 10px ${c}88,0 0 18px ${c}44`,'important');
      el.style.setProperty('letter-spacing','.15px','important');
    }catch(e){}
  }
  function scanNeon(){
    try{
      document.querySelectorAll('[id^="m-messages_"] .m-msg-item-user-login,[id^="m-messages_"] .userName,[id^="m-messages_"] username,[id^="m-messages_"] .info-user-login').forEach(paintNick);
      document.querySelectorAll('[id^="m-users_"] .m-list-user-item > span,.m-usersList .m-list-user-item > span').forEach(paintNick);
    }catch(e){note('neon',e)}
  }
  function installNeonCss(){
    if(document.getElementById('swir-neon-94'))return;
    const st=document.createElement('style');st.id='swir-neon-94';st.textContent=`
      [id^="m-messages_"] .m-msg-item-user-login,[id^="m-messages_"] .userName,[id^="m-messages_"] username,[id^="m-messages_"] .info-user-login{font-weight:900!important;opacity:1!important;filter:saturate(1.22) brightness(1.17)!important}
      [id^="m-users_"] .m-list-user-item>span,.m-usersList .m-list-user-item>span{opacity:1!important;filter:saturate(1.12) brightness(1.10)!important}
      #configPanel.swir-ui{font-family:Inter,"Segoe UI",Arial,sans-serif!important;letter-spacing:0!important}
      #configPanel.swir-ui h2,#configPanel.swir-ui h3,#configPanel.swir-ui h4,#configPanel.swir-ui label,#configPanel.swir-ui button,#configPanel.swir-ui input{font-family:Inter,"Segoe UI",Arial,sans-serif!important}
      #configPanel.swir-ui>h2 span:first-child:before{content:""!important}
      #configPanel.swir-ui>h2{display:flex!important;align-items:center!important;gap:10px!important;white-space:normal!important}
      #configPanel.swir-ui>h2 span:first-child{display:flex!important;align-items:center!important;gap:8px!important;flex-wrap:wrap!important;min-width:0!important}
      #configPanel.swir-ui .swir-ui-badge{display:inline-flex!important;align-items:center!important;white-space:nowrap!important;margin-left:4px!important}
      #configPanel.swir-ui .swir-themebar{display:grid!important;grid-template-columns:1fr repeat(4,minmax(74px,auto))!important;gap:8px!important;align-items:center!important;padding:12px 18px 8px!important}
      #configPanel.swir-ui .swir-dot{width:auto!important;height:34px!important;min-width:74px!important;padding:0 10px!important;border-radius:10px!important;color:#fff!important;font-size:11px!important;font-weight:800!important;text-shadow:0 1px 3px #000!important;box-shadow:inset 0 1px 0 #ffffff28!important}
      #configPanel.swir-ui .swir-themebar .swir-dot[data-theme="cyber"]{background:linear-gradient(135deg,#00eaff,#784dff)!important}
      #configPanel.swir-ui .swir-themebar .swir-dot[data-theme="matrix"]{background:linear-gradient(135deg,#00ff88,#008b54)!important}
      #configPanel.swir-ui .swir-themebar .swir-dot[data-theme="ocean"]{background:linear-gradient(135deg,#36cfff,#2456ff)!important}
      #configPanel.swir-ui .swir-themebar .swir-dot[data-theme="amber"]{background:linear-gradient(135deg,#ffd166,#ff7200)!important}
      @media(max-width:760px){#configPanel.swir-ui .swir-themebar{grid-template-columns:1fr 1fr!important}#configPanel.swir-ui .swir-theme-label{grid-column:1/-1!important}}
    `;document.head.appendChild(st);
  }
  function polishModPanel(){
    try{
      const p=document.getElementById('configPanel');if(!p)return;
      const h=p.querySelector('h2 span:first-child');if(h&&!h.dataset.swir94){h.dataset.swir94='1';
        const badge=h.querySelector('.swir-ui-badge');h.childNodes.forEach(n=>{if(n.nodeType===3)n.textContent=''});
        let main=h.querySelector('.swir-title94');if(!main){main=document.createElement('span');main.className='swir-title94';main.innerHTML='<b style="color:var(--swir-a,#00f5ff);text-shadow:0 0 12px var(--swir-a,#00f5ff)">SWIR //</b> Czateria MOD <span style="color:#8fa6bd">v9.4</span>';h.insertBefore(main,h.firstChild)}
        if(badge)badge.textContent='GAMING UI';
      }
      const bar=p.querySelector('.swir-themebar');if(bar){const names={cyber:'⚡ CYBER',matrix:'☣ MATRIX',ocean:'🌊 OCEAN',amber:'🔥 AMBER'};bar.querySelectorAll('.swir-dot').forEach(b=>{b.textContent=names[b.dataset.theme]||String(b.dataset.theme||'').toUpperCase()})}
      p.querySelectorAll('*').forEach(el=>{if(el.children.length===0&&el.textContent&&el.textContent.includes('9.2 COLOR LAB + IMAGE DIAGNOSTICS'))el.textContent=el.textContent.replace(/9\.2 COLOR LAB \+ IMAGE DIAGNOSTICS/g,'9.4 FRIEND RADAR + NEON UI')});
    }catch(e){note('polishMod',e)}
  }

  function diagnostics(){
    const s=state(),st=stats(),ids=load(K_IDS,{}),cs=connections(),loc=localFriends();
    const o={version:'9.4 FRIEND RADAR APP SYNC + NEON UI',connections:cs.length,openSockets:cs.filter(c=>c&&c.webSocket&&Number(c.webSocket.readyState)===1).length,officialAppFriends:Object.keys(s.users||{}).length,localSwirFriends:loc.length,cachedUserIds:Object.keys(ids).length,last85:st.lastCode85?new Date(st.lastCode85).toLocaleTimeString():'—',last159:st.lastCode159?new Date(st.lastCode159).toLocaleTimeString():'—',lastAppAdd:st.lastCode8Add?new Date(st.lastCode8Add).toLocaleTimeString():'—',errors:errors.length};
    console.table(o);console.table(loc.map(n=>({nick:n,type:rec(n)?'APP + SWIR':'SWIR ONLY',id:(identity(n)||{}).id||'—',rooms:serverRooms(n).join(', ')||'—'})));return o;
  }
  window.SWIR_RADAR_DEBUG={diagnostics,request:request85,reinstall:()=>{install();cacheLiveIdentities();request85(null,true);return diagnostics()},state,rooms:serverRooms,isOfficialFriend:n=>!!rec(n),identity,addToOfficialApp,syncVisibleLocal,cacheLiveIdentities,errors};

  installNeonCss();install();patchRadarApi();cacheLiveIdentities();scanNeon();polishModPanel();refreshFriendPanel();
  setTimeout(()=>request85(null,true),700);
  let lastTab='';
  setInterval(()=>{
    install();patchRadarApi();cacheLiveIdentities();scanNeon();polishModPanel();refreshFriendPanel();
    try{const t=window.CHNS&&CHNS.activemaintabname;if(t&&t!==lastTab){lastTab=t;setTimeout(()=>{cacheLiveIdentities();request85(null,true)},250)}}catch(e){}
  },1800);
  const mo=new MutationObserver(()=>{clearTimeout(window._swir94Mo);window._swir94Mo=setTimeout(()=>{scanNeon();polishModPanel();refreshFriendPanel()},100)});mo.observe(document.body,{childList:true,subtree:true});
  console.log('✅ SWIR 9.4 aktywny — Friend APP Sync + Neon Nicks + UI Polish');
  console.log('🧪 Diagnostyka: SWIR_RADAR_DEBUG.diagnostics()');
}catch(e){console.error('SWIR 9.4 fatal',e)}
})();