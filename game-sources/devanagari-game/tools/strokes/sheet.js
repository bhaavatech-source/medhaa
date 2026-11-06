const { chromium } = require('playwright');
const fs=require('fs');
const data=JSON.parse(fs.readFileSync(process.argv[2]||'segments.json','utf8'));
const pick=(process.argv[3]||'').split('');
const cols=['#e11d48','#2563eb','#16a34a','#d97706','#7c3aed','#0891b2','#db2777','#65a30d','#ea580c','#4f46e5','#0d9488','#be123c','#9333ea','#ca8a04','#1d4ed8'];
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1500,height:900}});
const L=pick.length?pick:Object.keys(data);
const cells=L.map(ch=>{const v=data[ch];
 const segs=(v.segs||[]).map((s,i)=>{const pts=s.map(q=>q.join(',')).join(' ');const m=s[Math.floor(s.length/2)];const e=s[0];
  return `<polyline points="${pts}" fill="none" stroke="${cols[i%cols.length]}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="${e[0]}" cy="${e[1]}" r="1.4" fill="${cols[i%cols.length]}"/>
  <text x="${m[0]+1.5}" y="${m[1]-1.5}" font-size="6" font-family="sans-serif" font-weight="bold" fill="${cols[i%cols.length]}">${i}</text>`}).join('');
 const hl=v.headline?`<line x1="${v.headline[0]}" x2="${v.headline[1]}" y1="${v.headline[2]}" y2="${v.headline[2]}" stroke="#000" stroke-width="1" stroke-dasharray="2 1"/>`:'';
 return `<div style="display:inline-block;margin:3px;text-align:center;font:14px sans-serif"><svg viewBox="0 0 120 105" width="230" height="200" style="background:#fff;border:1px solid #ddd">
 <text x="10" y="80" font-family="FreeSans" font-size="100" fill="#e5e5e5">${ch}</text>${hl}${segs}</svg><br>${ch}</div>`}).join('');
await p.setContent(`<body style="margin:0;width:1500px">${cells}</body>`);
await p.screenshot({path:process.argv[4]||'sheet.png',fullPage:true});await b.close();})();
