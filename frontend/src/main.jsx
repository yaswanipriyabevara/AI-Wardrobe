import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Camera, CalendarPlus, CloudSun, Heart, LogOut, Menu, Plus, Search, Shirt, Sparkles,
  Trash2, Upload, X, BarChart3, ShoppingBag, Pencil, Check, Tag,
  Layers3, Palette, ThermometerSun, BriefcaseBusiness, Eye, Image as ImageIcon
} from 'lucide-react';
import './styles.css';

const KEY = 'stylesync_hackathon_v7';
const img = (name) => `/dataset/${name}`;

const demo = [
  ['White Cotton Shirt','Topwear','White','Solid','Smart Casual','Summer','Light','Cotton','Unisex','white-cotton-shirt.jpg'],
  ['Sky Blue Shirt','Topwear','Blue','Solid','Smart Casual','Summer','Light','Cotton','Unisex','sky-blue-shirt.jpg'],
  ['Black T-Shirt','Topwear','Black','Solid','Casual','All','Light','Cotton','Unisex','black-tshirt.jpg'],
  ['Beige Knit Top','Topwear','Beige','Solid','Smart Casual','Winter','Warm','Knit','Women','beige-knit-top.jpg'],
  ['Olive Polo','Topwear','Olive','Solid','Casual','Summer','Light','Cotton','Unisex','olive-polo.jpg'],
  ['Striped Casual Shirt','Topwear','Blue','Striped','Casual','Summer','Light','Cotton','Unisex','striped-shirt.jpg'],
  ['Black Trousers','Bottomwear','Black','Solid','Formal','All','Medium','Polyester','Unisex','black-trousers.jpg'],
  ['Blue Straight Jeans','Bottomwear','Blue','Solid','Casual','All','Medium','Denim','Unisex','blue-jeans.jpg'],
  ['Cream Wide-Leg Pants','Bottomwear','Cream','Solid','Smart Casual','Summer','Light','Cotton','Women','cream-wide-leg.jpg'],
  ['Grey Chinos','Bottomwear','Grey','Solid','Smart Casual','All','Medium','Cotton','Unisex','grey-chinos.jpg'],
  ['Black Jeans','Bottomwear','Black','Solid','Casual','All','Medium','Denim','Unisex','black-jeans.jpg'],
  ['Denim Jacket','Outerwear','Blue','Denim','Casual','Winter','Warm','Denim','Unisex','denim-jacket.jpg'],
  ['Black Blazer','Outerwear','Black','Solid','Formal','All','Medium','Wool Blend','Unisex','black-blazer.jpg'],
  ['Beige Trench Coat','Outerwear','Beige','Solid','Formal','Winter','Warm','Cotton Blend','Unisex','beige-trench.jpg'],
  ['Green Hoodie','Outerwear','Green','Solid','Casual','Winter','Warm','Fleece','Unisex','green-hoodie.jpg'],
  ['White Sneakers','Footwear','White','Solid','Casual','All','Light','Mesh','Unisex','white-sneakers.jpg'],
  ['Black Loafers','Footwear','Black','Solid','Formal','All','Light','Leather','Unisex','black-loafers.jpg'],
  ['Running Shoes','Footwear','Grey','Solid','Casual','All','Light','Mesh','Unisex','running-shoes.jpg'],
  ['Brown Boots','Footwear','Brown','Solid','Smart Casual','Winter','Warm','Leather','Unisex','brown-boots.jpg'],
  ['Black Dress','Dress','Black','Solid','Formal','All','Medium','Crepe','Women','black-dress.jpg'],
  ['Floral Dress','Dress','Pink','Floral','Party','Summer','Light','Cotton','Women','floral-dress.jpg'],
  ['Athleisure Joggers','Bottomwear','Grey','Solid','Casual','All','Medium','Cotton','Unisex','athleisure-joggers.jpg'],
  ['Black Gym Tee','Topwear','Black','Solid','Casual','All','Light','Performance','Unisex','black-gym-tee.jpg'],
  ['Navy Polo','Topwear','Navy','Solid','Smart Casual','Summer','Light','Cotton','Unisex','navy-polo.jpg'],
].map((x, i) => ({
  id: `demo-${i}`, name:x[0], category:x[1], color:x[2], pattern:x[3], formality:x[4], season:x[5], warmth:x[6], material:x[7], fit:x[8], favorite:false, worn:i%5===0, image:img(x[9]), source:'Fashion demo catalog'
}));

const lookBoards = [
  { id:'college', title:'Campus Casual', occasion:'College', image:img('looks/college-casual.jpg'), items:['Sky Blue Shirt','Blue Straight Jeans','White Sneakers'], reason:'Light cotton layers and sneakers keep the look practical for a warm campus day.' },
  { id:'smart', title:'Campus Smart', occasion:'College / Presentation', image:img('looks/campus-smart.jpg'), items:['White Cotton Shirt','Grey Chinos','Black Loafers'], reason:'A clean smart-casual combination for presentations without over-dressing.' },
  { id:'interview', title:'Interview Ready', occasion:'Interview', image:img('looks/interview-formal.jpg'), items:['Black Blazer','Black Trousers','Black Loafers'], reason:'Structured formal pieces create a consistent interview-ready silhouette.' },
  { id:'street', title:'Weekend Street', occasion:'Party / Casual', image:img('looks/weekend-street.jpg'), items:['Black T-Shirt','Black Jeans','White Sneakers'], reason:'Simple monochrome base with a clean sneaker finish.' },
  { id:'party', title:'Party Evening', occasion:'Party', image:img('looks/party-look.jpg'), items:['Floral Dress','Black Blazer','Black Loafers'], reason:'The floral dress carries the look while the blazer adds structure.' },
  { id:'winter', title:'Layered Winter', occasion:'Winter', image:img('looks/winter-layered.jpg'), items:['Beige Knit Top','Black Jeans','Brown Boots'], reason:'Warm knitwear and boots make this a balanced cold-weather option.' },
  { id:'gym', title:'Active Day', occasion:'Gym', image:img('looks/gym-look.jpg'), items:['Black Gym Tee','Athleisure Joggers','Running Shoes'], reason:'Performance-focused pieces keep the outfit functional for movement.' },
  { id:'polo', title:'Smart Polo', occasion:'Smart Casual', image:img('looks/smart-polo.jpg'), items:['Navy Polo','Cream Wide-Leg Pants','Brown Boots'], reason:'A refined color contrast for a smart-casual day.' },
];

const defaults = () => ({ user:null, wardrobe:demo, history:[], profile:{style:'Smart Casual',avoid:'',comfort:'Balanced'} });
function load(){ try { const raw=localStorage.getItem(KEY); return raw ? JSON.parse(raw) : defaults(); } catch { return defaults(); } }
function save(s){ localStorage.setItem(KEY, JSON.stringify(s)); }
function weatherText(t){ if(t>=30)return 'Hot & humid'; if(t>=24)return 'Warm'; if(t>=18)return 'Mild'; return 'Cool'; }

function detectFromFile(file){
  const n=(file?.name||'').toLowerCase();
  const category=n.includes('jean')||n.includes('pant')||n.includes('trouser')||n.includes('jogger')?'Bottomwear':n.includes('shoe')||n.includes('sneaker')||n.includes('boot')||n.includes('loafer')?'Footwear':n.includes('dress')?'Dress':n.includes('jacket')||n.includes('blazer')||n.includes('coat')||n.includes('hoodie')?'Outerwear':n.includes('bag')||n.includes('watch')||n.includes('belt')?'Accessory':'Topwear';
  const colors=['black','white','blue','green','red','beige','grey','gray','brown','pink','navy','cream','olive'];
  const color=colors.find(c=>n.includes(c)) || (category==='Footwear'?'White':'Blue');
  const pattern=n.includes('stripe')?'Striped':n.includes('floral')?'Floral':'Solid';
  const formality=n.includes('blazer')||n.includes('trouser')||n.includes('loafer')?'Formal':n.includes('jogger')||n.includes('gym')?'Casual':'Smart Casual';
  return { category,color,pattern,formality,season:'All',warmth:'Light',material:'Cotton / Mixed',fit:'Unisex' };
}
function outfitFor(items,occasion,temp,style){
  const ok=x=>{
    if(occasion==='gym') return ['Topwear','Bottomwear','Footwear'].includes(x.category)&&x.formality!=='Formal';
    if(occasion==='wedding'||occasion==='interview') return ['Formal','Smart Casual'].includes(x.formality);
    return true;
  };
  const tops=items.filter(x=>['Topwear','Dress'].includes(x.category)).filter(ok);
  const bottoms=items.filter(x=>x.category==='Bottomwear').filter(ok);
  const shoes=items.filter(x=>x.category==='Footwear').filter(ok);
  const results=[];
  for(let i=0;i<Math.min(3,tops.length,bottoms.length,shoes.length);i++){
    const a=tops[i],b=bottoms[i],c=shoes[i];
    results.push({items:[a,b,c],reason:`${a.color} ${a.name.toLowerCase()} works for ${weatherText(temp).toLowerCase()} weather and your ${occasion} plan.`});
  }
  if(!results.length && tops.length) results.push({items:tops.slice(0,3),reason:`A ${style.toLowerCase()} option from your existing wardrobe.`});
  return results;
}

function App(){
  const [s,setS]=useState(load); const [page,setPage]=useState('dashboard'); const [mobile,setMobile]=useState(false); const [toast,setToast]=useState('');
  useEffect(()=>save(s),[s]);
  const update=x=>setS(x); const notify=m=>{setToast(m);setTimeout(()=>setToast(''),2200)};
  if(!s.user) return <Login onSave={u=>{update({...s,user:u});notify('Welcome to StyleSync AI')}}/>;
  const nav=[['dashboard','Dashboard',Sparkles],['wardrobe','My Wardrobe',Shirt],['planner','Outfit Planner',CloudSun],['looks','Looks Gallery',ImageIcon],['gaps','Wardrobe Gaps',ShoppingBag],['rate','Rate My Outfit',Camera],['insights','Insights',BarChart3]];
  return <div className="app">
    <aside className={mobile?'open':''}><div className="brand"><div className="logo"><Sparkles size={20}/></div><div><b>StyleSync</b><small>AI WARDROBE</small></div></div><button className="close" onClick={()=>setMobile(false)}><X/></button>
      <nav>{nav.map(([id,label,I])=><button key={id} className={page===id?'active':''} onClick={()=>{setPage(id);setMobile(false)}}><I size={18}/>{label}</button>)}</nav>
      <div className="sidebox"><b>AI Style Assistant</b><span>● Dataset + rules ready</span></div>
    </aside>
    <div className="content"><header><button className="menu" onClick={()=>setMobile(true)}><Menu/></button><div><strong>Hello, {s.user.name.split(' ')[0]} 👋</strong><small>{s.user.gender} · {s.user.ageGroup}</small></div><button className="logout" onClick={()=>{update({...s,user:null});setPage('dashboard')}}><LogOut size={17}/> Logout</button></header>
      <main>
        {page==='dashboard'&&<Dashboard s={s} setPage={setPage}/>} {page==='wardrobe'&&<Wardrobe s={s} update={update} notify={notify}/>} {page==='planner'&&<Planner s={s} notify={notify}/>} {page==='looks'&&<Looks/>} {page==='gaps'&&<Gaps s={s}/>} {page==='rate'&&<Rate notify={notify}/>} {page==='insights'&&<Insights s={s}/>} 
      </main>
    </div>{toast&&<div className="toast">{toast}</div>}
  </div>
}

function Login({onSave}){const [u,setU]=useState({name:'',gender:'Women',ageGroup:'Young Adult'});return <div className="login"><div className="loginCard"><div className="logo big"><Sparkles/></div><p className="eyebrow">AI WARDROBE & OUTFIT PLANNER</p><h1>Style your day.<br/><span>Sync your wardrobe.</span></h1><p className="muted">Build a digital closet from clothes you already own and get visual, weather-aware outfit ideas.</p><label>Name<input value={u.name} onChange={e=>setU({...u,name:e.target.value})} placeholder="Enter your name"/></label><label>Gender<select value={u.gender} onChange={e=>setU({...u,gender:e.target.value})}><option>Women</option><option>Men</option><option>Unisex</option></select></label><label>Age group<select value={u.ageGroup} onChange={e=>setU({...u,ageGroup:e.target.value})}><option>Children</option><option>Young Adult</option><option>Adult / Citizen</option><option>Senior Citizen</option></select></label><button className="primary wide" disabled={!u.name.trim()} onClick={()=>onSave(u)}>Enter StyleSync <Sparkles size={17}/></button><small className="privacy">Demo profile is stored locally in your browser.</small></div></div>}

function Dashboard({s,setPage}){return <><div className="hero"><div><p className="eyebrow">YOUR PERSONAL STYLE WORKSPACE</p><h1>Dress smarter with what you already own.</h1><p className="muted">StyleSync turns garment photos into structured wardrobe data, then builds visual looks around weather, occasion and personal style.</p><div className="actions"><button className="primary" onClick={()=>setPage('planner')}><Sparkles size={17}/> Plan today's outfit</button><button className="secondary" onClick={()=>setPage('wardrobe')}><Plus size={17}/> Add clothes</button></div></div><div className="heroArt"><ImageIcon size={74}/><span>PHOTO<br/>TO LOOK</span></div></div><div className="stats"><Stat n={s.wardrobe.length} t="Wardrobe items"/><Stat n={s.wardrobe.filter(x=>x.favorite).length} t="Favorites"/><Stat n={s.history.length} t="Outfits logged"/><Stat n={new Set(s.wardrobe.map(x=>x.color)).size} t="Colors"/></div><div className="sectionHead"><div><p className="eyebrow">COMPLETE FLOW</p><h2>From garment photo to complete look</h2></div></div><div className="flow"><span>01 · Photograph</span><b>→</b><span>02 · Auto-tag</span><b>→</b><span>03 · Match</span><b>→</b><span>04 · Visual look</span></div><div className="quick">{[['wardrobe','Build wardrobe','Upload and auto-tag a clothing photo',Shirt],['planner','Plan an outfit','Weather + occasion + personal style',CloudSun],['looks','Browse looks','See dataset-backed visual combinations',ImageIcon],['rate','Rate my outfit','Get quick feedback before heading out',Camera]].map(([id,t,d,I])=><button key={id} onClick={()=>setPage(id)}><I/><b>{t}</b><span>{d}</span></button>)}</div></>}
function Stat({n,t}){return <div className="stat"><b>{n}</b><span>{t}</span></div>}

function Wardrobe({s,update,notify}){
  const [q,setQ]=useState(''),[cat,setCat]=useState('All'),[show,setShow]=useState(false),[file,setFile]=useState(null),[tags,setTags]=useState(null);
  const cats=['All','Topwear','Bottomwear','Outerwear','Footwear','Dress','Accessory'];
  const items=s.wardrobe.filter(x=>(cat==='All'||x.category===cat)&&`${x.name} ${x.color} ${x.pattern}`.toLowerCase().includes(q.toLowerCase()));
  const choose=e=>{const f=e.target.files?.[0];if(!f)return;if(!f.type.startsWith('image/')){notify('Please choose an image file');return;}if(f.size>6*1024*1024){notify('Image must be smaller than 6 MB');return;}setFile(f);setTags(detectFromFile(f));};
  const add=()=>{if(!file||!tags)return;const url=URL.createObjectURL(file);const item={...tags,id:'u-'+Date.now(),name:file.name.replace(/\.[^.]+$/,''),image:url,favorite:false,worn:0,source:'User upload'};update({...s,wardrobe:[item,...s.wardrobe]});setShow(false);setFile(null);setTags(null);notify('Garment added with editable AI tags');};
  return <><PageTitle eyebrow="DIGITAL WARDROBE" title="My Wardrobe" text="Photograph a garment, review the detected details, and save it to your digital closet." action={<button className="primary" onClick={()=>setShow(true)}><Upload size={17}/> Add clothing</button>}/><div className="toolbar"><div className="search"><Search size={17}/><input placeholder="Search wardrobe..." value={q} onChange={e=>setQ(e.target.value)}/></div>{cats.map(c=><button className={cat===c?'filter active':'filter'} key={c} onClick={()=>setCat(c)}>{c}</button>)}</div><div className="grid">{items.map(x=><Cloth key={x.id} x={x} onDelete={()=>update({...s,wardrobe:s.wardrobe.filter(i=>i.id!==x.id)})} onFav={()=>update({...s,wardrobe:s.wardrobe.map(i=>i.id===x.id?{...i,favorite:!i.favorite}:i)})}/>)}</div>{!items.length&&<Empty text="No garments match this filter yet."/>}
  {show&&<div className="modal"><div className="modalCard large"><button className="modalX" onClick={()=>setShow(false)}><X/></button><p className="eyebrow">AI GARMENT TAGGING</p><h2>Photograph a garment</h2><p className="muted">The demo AI detects garment type, color, pattern and styling attributes. Every field is editable before saving.</p><label className="upload">{file?<img className="uploadPreview" src={URL.createObjectURL(file)} alt="garment preview"/>:<><Upload size={30}/><b>Choose a garment photo</b><span>Use a clear front-facing photo with good light</span></>}<input type="file" accept="image/*" onChange={choose}/></label>{tags&&<TagEditor tags={tags} setTags={setTags}/>}<button className="primary wide" disabled={!file||!tags} onClick={add}><Check size={17}/> Save to my wardrobe</button></div></div>}</>}

function TagEditor({tags,setTags}){const fields=[['category','Garment category',['Topwear','Bottomwear','Outerwear','Footwear','Dress','Accessory']],['color','Color',['Black','White','Blue','Navy','Beige','Cream','Grey','Brown','Green','Olive','Pink','Red']],['pattern','Pattern',['Solid','Striped','Checked','Floral','Printed','Denim']],['formality','Formality',['Casual','Smart Casual','Formal','Party','Sport']],['season','Season',['All','Spring','Summer','Autumn','Winter']],['warmth','Warmth level',['Light','Medium','Warm']],['material','Material',['Cotton','Denim','Wool Blend','Leather','Knit','Performance','Cotton / Mixed']],['fit','Suitable for',['Women','Men','Unisex','Children']]];return <div className="tagPanel"><div className="tagHeading"><Tag size={17}/><b>Detected garment details</b><span>AI preview</span></div><div className="tagGrid">{fields.map(([k,l,opts])=><label key={k}>{l}<select value={tags[k]} onChange={e=>setTags({...tags,[k]:e.target.value})}>{opts.map(o=><option key={o}>{o}</option>)}</select></label>)}</div></div>}
function Cloth({x,onDelete,onFav}){return <div className="cloth"><div className="clothImg">{x.image?<img src={x.image} alt={x.name}/>:<Shirt size={44}/>}<button className="heart" onClick={onFav}>{x.favorite?<Heart fill="currentColor"/>:<Heart/>}</button></div><div className="clothBody"><b>{x.name}</b><span>{x.category} · {x.color} · {x.pattern}</span><div><i>{x.formality}</i><i>{x.season}</i><i>{x.warmth}</i></div><small>{x.material} · {x.fit}</small><button className="delete" onClick={onDelete}><Trash2 size={14}/> Remove</button></div></div>}
function PageTitle({eyebrow,title,text,action}){return <div className="pageTitle"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="muted">{text}</p></div>{action}</div>}

function Planner({s,notify}){const [occasion,setOcc]=useState('college'),[temp,setTemp]=useState(29),[weather,setWeather]=useState(null),[loading,setLoading]=useState(false);const outfits=useMemo(()=>outfitFor(s.wardrobe,occasion,temp,s.profile.style),[s.wardrobe,occasion,temp,s.profile.style]);const saveToCalendar=()=>{const first=outfits[0];if(!first)return notify('Create an outfit before exporting it');const start=new Date();start.setHours(start.getHours()+1,0,0,0);const end=new Date(start.getTime()+60*60*1000);const fmt=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//StyleSync AI//Outfit Planner//EN','BEGIN:VEVENT',`UID:stylesync-${Date.now()}@stylesync-ai`,`DTSTAMP:${fmt(new Date())}`,`DTSTART:${fmt(start)}`,`DTEND:${fmt(end)}`,`SUMMARY:StyleSync — ${occasion} outfit`,`DESCRIPTION:${first.items.map(x=>x.name).join(', ')} — ${first.reason}`,`LOCATION:${s.profile.location||''}`,'END:VEVENT','END:VCALENDAR'].join('\r\n');const blob=new Blob([ics],{type:'text/calendar;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='stylesync-outfit.ics';a.click();URL.revokeObjectURL(url);notify('Calendar file exported')};const locate=()=>{if(!navigator.geolocation)return notify('Geolocation is not available');setLoading(true);navigator.geolocation.getCurrentPosition(async p=>{try{const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${p.coords.latitude}&longitude=${p.coords.longitude}&current=temperature_2m,relative_humidity_2m,weather_code`);const d=await r.json();setTemp(Math.round(d.current.temperature_2m));setWeather(d.current);notify('Live weather loaded from Open-Meteo')}catch{notify('Weather unavailable; using demo temperature')}finally{setLoading(false)}},()=>{setLoading(false);notify('Location permission denied; using demo weather')})};return <><PageTitle eyebrow="WEATHER-AWARE STYLING" title="Outfit Planner" text="Combine your wardrobe with weather, occasion and personal style." action={<div className="titleActions"><button className="secondary" onClick={saveToCalendar}><CalendarPlus size={17}/>Save to Calendar</button><button className="secondary" onClick={locate}><CloudSun size={17}/>{loading?'Loading...':'Use my weather'}</button></div>}/><div className="plannerTop"><div className="weatherCard"><CloudSun size={34}/><div><b>{temp}°C · {weatherText(temp)}</b><span>{weather?'Open-Meteo live forecast':'Demo weather — use location for live forecast'}</span></div></div><label>Occasion<select value={occasion} onChange={e=>setOcc(e.target.value)}>{['college','interview','party','wedding','gym'].map(x=><option key={x}>{x}</option>)}</select></label><label>Temperature<input type="range" min="10" max="40" value={temp} onChange={e=>setTemp(+e.target.value)}/><span>{temp}°C</span></label></div><div className="sectionHead"><div><p className="eyebrow">AI RECOMMENDATIONS</p><h2>Visual looks for {occasion}</h2></div></div><div className="outfitBoards">{outfits.map((o,i)=>{const board=lookBoards.find(l=>l.occasion.toLowerCase().includes(occasion))||lookBoards[i%lookBoards.length];return <div className="outfitBoard" key={i}><img src={board.image} alt={board.title}/><div className="boardBody"><span className="lookBadge">LOOK 0{i+1}</span><h3>{o.items.map(x=>x.name).join(' + ')}</h3><p>{o.reason}</p><div className="outfitItems">{o.items.map(x=><span key={x.id}><img src={x.image} alt=""/>{x.name}</span>)}</div></div></div>})}</div><div className="sectionHead looksSection"><div><p className="eyebrow">REFERENCE LOOKS</p><h2>Curated outfit photo boards</h2></div></div><div className="lookGrid">{lookBoards.slice(0,3).map(l=><LookCard key={l.id} l={l}/>)}</div></>}

function Looks(){return <><PageTitle eyebrow="LOOKBOOK" title="Looks Gallery" text="Visual outfit references built from the local fashion demo catalog. Use them to understand compatible combinations."/><div className="datasetNote"><Layers3 size={22}/><div><b>Photo-backed demo dataset</b><span>Garment images and curated look boards are bundled locally so the hackathon demo does not depend on external image URLs.</span></div></div><div className="lookGrid full">{lookBoards.map(l=><LookCard key={l.id} l={l}/>)}</div></>}
function LookCard({l}){return <article className="lookCard"><img src={l.image} alt={l.title}/><div><span className="lookBadge">{l.occasion}</span><h3>{l.title}</h3><p>{l.reason}</p><div className="lookChips">{l.items.map(x=><span key={x}>{x}</span>)}</div></div></article>}

function Gaps({s}){const names=s.wardrobe.map(x=>x.name.toLowerCase());const gaps=[!names.some(x=>x.includes('loafer')||x.includes('formal shoe'))&&{name:'Formal shoes',why:'Useful for interviews, presentations and weddings.',q:'formal shoes'},!names.some(x=>x.includes('blazer'))&&{name:'Navy blazer',why:'Adds a smart layer for interviews and campus presentations.',q:'navy blazer'},!names.some(x=>x.includes('rain')||x.includes('trench'))&&{name:'Rain jacket',why:'A practical weather layer for wet days.',q:'light rain jacket'},!names.some(x=>x.includes('accessory')||x.includes('belt')||x.includes('watch'))&&{name:'Everyday accessory',why:'A belt or watch can finish otherwise simple looks.',q:'minimal everyday fashion accessory'}].filter(Boolean);return <><PageTitle eyebrow="WARDROBE INTELLIGENCE" title="Wardrobe Gaps" text="Specific essentials to consider buying without duplicating what you own."/><div className="gapIntro"><ShoppingBag size={30}/><div><b>{gaps.length} useful gap{gaps.length!==1?'s':''} detected</b><span>Suggestions use your wardrobe categories and common occasion needs.</span></div></div><div className="gapGrid">{gaps.map(g=><div className="gap" key={g.name}><div className="gapIcon"><ShoppingBag/></div><h3>{g.name}</h3><p>{g.why}</p><a target="_blank" rel="noreferrer" href={`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(g.q+' '+s.user.gender)}`}>Search products ↗</a></div>)}</div>{!gaps.length&&<Empty text="Your wardrobe covers the main essentials in this demo."/>}</>}
function Rate({notify}){const [file,setFile]=useState(null),[done,setDone]=useState(false);return <><PageTitle eyebrow="QUICK FEEDBACK" title="Rate My Outfit" text="Upload what you're wearing and get fast, practical feedback."/><div className="rateBox"><label className="upload bigUpload">{file?<img className="ratePreview" src={URL.createObjectURL(file)} alt="outfit"/>:<><Camera size={42}/><b>Upload outfit photo</b><span>Good lighting works best</span></>}<input type="file" accept="image/*" onChange={e=>{setFile(e.target.files?.[0]);setDone(false)}}/></label><button className="primary" disabled={!file} onClick={()=>{setDone(true);notify('Outfit analysed')}}><Sparkles size={17}/> Analyse outfit</button>{done&&<div className="score"><div><b>8.6</b><span>/ 10</span></div><section><strong>What works</strong><p>Balanced proportions and a coordinated color story.</p><strong>Try this</strong><p>Add one intentional accessory or swap one piece for stronger contrast.</p></section></div>}</div></>}
function Insights({s}){const counts={};s.wardrobe.forEach(x=>counts[x.color]=(counts[x.color]||0)+1);const top=Object.entries(counts).sort((a,b)=>b[1]-a[1]);return <><PageTitle eyebrow="WARDROBE INSIGHTS" title="Your Style Dashboard" text="See what you wear, what you repeat and how balanced your wardrobe is."/><div className="insightGrid"><div className="panel"><h3>Most worn</h3>{s.wardrobe.filter(x=>x.worn).sort((a,b)=>Number(b.worn)-Number(a.worn)).slice(0,5).map(x=><div className="row" key={x.id}><span>{x.name}</span><b>{x.worn?`${x.worn} wears`:'Demo'}</b></div>)}</div><div className="panel"><h3>Color distribution</h3>{top.map(([c,n])=><div className="bar" key={c}><span>{c}</span><div><i style={{width:`${Math.max(8,n/s.wardrobe.length*100)}%`}}/></div><b>{n}</b></div>)}</div></div></>}
function Empty({text}){return <div className="empty"><Sparkles size={28}/><p>{text}</p></div>}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
