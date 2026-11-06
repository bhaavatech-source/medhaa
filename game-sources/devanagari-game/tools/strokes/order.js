// Draw ordered strokes: numbered start dots + arrows, colour by order
const { chromium } = require('playwright'); const fs=require('fs');
const data=JSON.parse(fs.readFileSync('strokes.json','utf8'));
const pick=(process.argv[2]||'').split('');
const cols=['#e11d48','#2563eb','#16a34a','#d97706','#7c3aed','#0891b2','#db2777','#65a30d','#ea580c'];
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1500,height:900}});
const L=pick.length?pick:Object.keys(data);
const cells=L.map(ch=>{const v=data[ch];
 const s=v.strokes.map((st,i)=>{const c=cols[i%cols.length];const pts=st.pts;const a=pts[0];
   const k=Math.max(1,Math.floor(pts.length*0.6));const m=pts[Math.min(k,pts.length-1)],m0=pts[Math.max(0,Math.min(k,pts.length-1)-1)];
   const ang=Math.atan2(m[1]-m0[1],m[0]-m0[0])*180/Math.PI;
   return `<polyline points="${pts.map(q=>q.join(',')).join(' ')}" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/>
   <g transform="translate(${m[0]},${m[1]}) rotate(${ang})"><path d="M-3,-2.5 L1.5,0 L-3,2.5" fill="none" stroke="#000" stroke-width="1"/></g>
   <circle cx="${a[0]}" cy="${a[1]}" r="3.6" fill="${c}" stroke="#fff" stroke-width=".8"/><text x="${a[0]}" y="${a[1]+1.8}" font-size="5" text-anchor="middle" font-family="sans-serif" font-weight="bold" fill="#fff">${i+1}</text>`}).join('');
 return `<div style="display:inline-block;margin:3px;text-align:center;font:16px FreeSans"><svg viewBox="-6 -4 112 104" width="230" height="214" style="background:#fff;border:1px solid #ddd">
 <line x1="-6" x2="106" y1="22.3" y2="22.3" stroke="#fcc" stroke-width=".4"/><line x1="-6" x2="106" y1="76" y2="76" stroke="#ccf" stroke-width=".4"/>
 <text x="1" y="80" font-family="FreeSans" font-size="100" fill="#eee">${ch}</text>${s}</svg><br>${ch}</div>`}).join('');
await p.setContent(`<body style="margin:0;width:1500px">${cells}</body>`);
await p.screenshot({path:process.argv[3]||'order.png',fullPage:true});await b.close();})();
