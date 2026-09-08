import * as React from "react";
const {useCallback,useEffect,useMemo,useRef,useState}=React;

const STORAGE_KEY="pdq_v4";
const BRANDS=["Bath & Body","Kids Bath & Body","Baby Bath & Body"];
const RESET_BUCKETS=new Set(["Bath & Body|Travel Size","Bath & Body|Mini's","Bath & Body|Standard Size","Kids Bath & Body|Standard Size","Baby Bath & Body|Standard Size"]);
const BRAND_COLORS={"Bath & Body":{hdr:"#3d6b2a",hdrTxt:"#fff",bucketHdr:"#4e7f36",bucketTxt:"#fff",light:"#eaf5e2",border:"#5a9440"},"Kids Bath & Body":{hdr:"#0e6b6b",hdrTxt:"#fff",bucketHdr:"#1a8080",bucketTxt:"#fff",light:"#ddf1f1",border:"#1a9999"},"Baby Bath & Body":{hdr:"#4a3d8a",hdrTxt:"#fff",bucketHdr:"#5c4ea8",bucketTxt:"#fff",light:"#f0edf9",border:"#7060c0"}};
const PALETTE=["#e63946","#f4a261","#2a9d8f","#4361ee","#9b2335","#e9c46a","#7b2d8b","#43aa8b","#f79d65","#264653","#6a994e","#4895ef"];
const GRID=0.25;
const WALL=0.4375;

const PRODUCTS=[
  {id:"th_ms34", brand:"Bath & Body",bucket:"Travel Size",  name:"Mini Shea Sugar Scrub 3.4oz",     cat:"Scrub",      l:2.0,  w:2.0,  wt:0.27},
  {id:"th_mbw33",brand:"Bath & Body",bucket:"Travel Size",  name:"Mini Body Wash 3.3oz",             cat:"Body Wash",  l:1.9,  w:1.9,  wt:0.28},
  {id:"th_mwb34",brand:"Bath & Body",bucket:"Travel Size",  name:"Mini Whipped Butter 3.4oz",        cat:"Body Butter",l:2.88, w:2.88, wt:0.25},
  {id:"th_mso2", brand:"Bath & Body",bucket:"Travel Size",  name:"Mini Shave Oil 2oz",               cat:"Shave",      l:1.25, w:1.25, wt:0.13},
  {id:"th_mfm2", brand:"Bath & Body",bucket:"Travel Size",  name:"Mini Fragrance Mist 2oz",          cat:"Mist",       l:1.3,  w:1.3,  wt:0.14},
  {id:"th_s55",  brand:"Bath & Body",bucket:"Mini's",       name:"Shea Sugar Scrub 5.5oz",           cat:"Scrub",      l:2.88, w:2.88, wt:0.43},
  {id:"th_s8",   brand:"Bath & Body",bucket:"Mini's",       name:"Shea Sugar Scrub 8oz",             cat:"Scrub",      l:3.25, w:3.25, wt:0.63},
  {id:"th_hgl11",brand:"Bath & Body",bucket:"Small/Other",  name:"Hydraglow Body Lotion 11oz",       cat:"Lotion",     l:2.36, w:2.36, wt:0.94},
  {id:"th_s18",  brand:"Bath & Body",bucket:"Standard Size",name:"Shea Sugar Scrub 18oz",            cat:"Scrub",      l:3.69, w:3.69, wt:1.26},
  {id:"th_dms15",brand:"Bath & Body",bucket:"Standard Size",name:"Daily Moisturizing Scrub 15oz",    cat:"Scrub",      l:3.46, w:3.46, wt:1.20},
  {id:"th_bwt18",brand:"Bath & Body",bucket:"Standard Size",name:"Body Wash 18oz (Tumbler)",         cat:"Body Wash",  l:2.9,  w:2.9,  wt:1.40},
  {id:"th_bwp18",brand:"Bath & Body",bucket:"Standard Size",name:"Body Wash 18oz (Pump)",            cat:"Body Wash",  l:2.36, w:2.36, wt:1.41},
  {id:"th_wb84", brand:"Bath & Body",bucket:"Standard Size",name:"Whipped Body Butter 8.4oz",        cat:"Body Butter",l:3.63, w:3.63, wt:0.59},
  {id:"th_so77", brand:"Bath & Body",bucket:"Standard Size",name:"Shave Oil 7.7oz",                  cat:"Shave",      l:1.75, w:1.75, wt:0.59},
  {id:"th_wsb7", brand:"Bath & Body",bucket:"Standard Size",name:"Whipped Shave Butter 7oz",         cat:"Shave",      l:1.91, w:1.91, wt:0.56},
  {id:"th_psfp7",brand:"Bath & Body",bucket:"Standard Size",name:"Pre Shave Foaming Polish 7oz",     cat:"Shave",      l:3.35, w:2.13, wt:0.51},
  {id:"th_ass43",brand:"Bath & Body",bucket:"Standard Size",name:"After Shave Serum 4.3oz",          cat:"Shave",      l:1.65, w:1.65, wt:0.34},
  {id:"th_fm6",  brand:"Bath & Body",bucket:"Standard Size",name:"Fragrance Mist 6oz",               cat:"Mist",       l:1.91, w:1.91, wt:0.53},
  {id:"th_hm52", brand:"Bath & Body",bucket:"Standard Size",name:"Shimmer/Hydrating Mist 5.2oz",     cat:"Mist",       l:2.0,  w:2.0,  wt:0.38},
  {id:"th_bl85", brand:"Bath & Body",bucket:"Standard Size",name:"Body Lotion 8.5oz",                cat:"Lotion",     l:3.3,  w:2.16, wt:0.62},
  {id:"th_hglp", brand:"Bath & Body",bucket:"Standard Size",name:"Hydraglow Body Lotion 18oz (Pump)",cat:"Lotion",     l:2.36, w:2.36, wt:1.41},
  {id:"th_hbs11",brand:"Bath & Body",bucket:"Standard Size",name:"Hydraglow Body Serum 11oz",        cat:"Serum",      l:2.457,w:2.457,wt:0.69},
  {id:"th_bo5",  brand:"Bath & Body",bucket:"Standard Size",name:"Body Oil 5oz",                     cat:"Body Oil",   l:1.5,  w:1.5,  wt:0.42},
  {id:"th_hw11", brand:"Bath & Body",bucket:"Standard Size",name:"Hand Wash 11oz",                   cat:"Hand Wash",  l:2.457,w:2.457,wt:0.85},
  {id:"th_lb52", brand:"Bath & Body",bucket:"Standard Size",name:"Lip Butter 0.52oz",                cat:"Lip",        l:0.75, w:0.75, wt:0.05},
  {id:"th_lm6",  brand:"Bath & Body",bucket:"Standard Size",name:"Lip Mask 0.6oz",                   cat:"Lip",        l:1.625,w:1.625,wt:0.12},
  {id:"th_lo135",brand:"Bath & Body",bucket:"Standard Size",name:"Lip Oil 1.35oz",                   cat:"Lip",        l:1.063,w:1.063,wt:0.09},
  {id:"th_ls35", brand:"Bath & Body",bucket:"Standard Size",name:"Lip Scrub 3.5oz",                  cat:"Lip",        l:0.75, w:0.75, wt:0.05},
  {id:"th_js37", brand:"Bath & Body",bucket:"Standard Size",name:"Jelly Soap 3.7oz",                 cat:"Soap",       l:3.0,  w:3.0,  wt:0.28},
  {id:"th_fs15", brand:"Bath & Body",bucket:"Standard Size",name:"Face Scrub 1.5oz (Trial)",         cat:"Face Scrub", l:1.375,w:1.375,wt:0.12},
  {id:"sp_bw16", brand:"Kids Bath & Body",bucket:"Standard Size",name:"2-in-1 Body Wash 16oz",       cat:"Body Wash",  l:2.75, w:2.75, wt:1.10},
  {id:"sp_bl16", brand:"Kids Bath & Body",bucket:"Standard Size",name:"Body Lotion 16oz",            cat:"Lotion",     l:2.75, w:2.75, wt:1.10},
  {id:"sp_bb20", brand:"Kids Bath & Body",bucket:"Standard Size",name:"Bubble Bath 20oz",            cat:"Bath",       l:2.6,  w:2.6,  wt:1.39},
  {id:"bm_cl165",brand:"Baby Bath & Body",bucket:"Small/Other",  name:"Baby Calming Lotion 16.5oz",  cat:"Baby Lotion",l:3.75, w:1.88, wt:1.30},
  {id:"bm_hbw20",brand:"Baby Bath & Body",bucket:"Standard Size",name:"Baby Hair & Body Wash 20oz",  cat:"Baby Wash",  l:1.95, w:4.15, wt:1.50},
  {id:"bm_bl20", brand:"Baby Bath & Body",bucket:"Standard Size",name:"Baby Lotion 20oz",            cat:"Baby Lotion",l:1.95, w:4.15, wt:1.50},
];

const al = ai => String.fromCharCode(97 + ai);
const isScrub = p => /shea sugar scrub/i.test(p.name);
const isRect = p => Math.max(p.l, p.w) / Math.min(p.l, p.w) > 1.15 || isScrub(p);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const snapv = v => Math.round(v / GRID) * GRID;
const round4 = v => +Number(v).toFixed(4);

function rectFitsEllipse(rx, ry, x, y, l, w) {
  const cx = x + l / 2 - rx, cy = y + w / 2 - ry;
  return [[cx-l/2,cy-w/2],[cx+l/2,cy-w/2],[cx+l/2,cy+w/2],[cx-l/2,cy+w/2]]
    .every(([px,py]) => (px*px)/(rx*rx) + (py*py)/(ry*ry) <= 1);
}
function overlaps(a, b, prods) {
  const pa = prods.find(x => x.id === a.pid), pb = prods.find(x => x.id === b.pid);
  if (!pa || !pb) return false;
  return !(a.x+pa.l <= b.x || a.x >= b.x+pb.l || a.y+pa.w <= b.y || a.y >= b.y+pb.w);
}
function hasCollision(cand, pls, prods, ignoreId) {
  return pls.some(pl => pl.id !== ignoreId && !pl.invalid && overlaps(cand, pl, prods));
}
function shelfWt(pls, prods) {
  return pls.filter(p => !p.invalid).reduce((s, pl) => {
    const p = prods.find(x => x.id === pl.pid);
    return s + (p ? p.wt : 0) * (pl.layers || 1);
  }, 0);
}
function makeShelf(n, prev) {
  const outer = prev&&prev.outer ? {...prev.outer} : {l:12,w:8};
  const oi = prev&&prev.oi ? {...prev.oi} : {l:"12",w:"8"};
  const tray = prev&&prev.tray ? {...prev.tray} : {l:round4(12-WALL),w:round4(8-WALL)};
  const ti = prev&&prev.ti ? {...prev.ti} : {l:String(round4(12-WALL)),w:String(round4(8-WALL))};
  return {id:"sh_"+Date.now()+"_"+n,name:"Shelf "+n,wtLimitI:"",spacingI:"0",pls:[],layoutStats:{cols:0,rows:0},qtys:{},shape:(prev&&prev.shape)||"rect",outer,oi,tray,ti};
}
function buildColorMap(shelf, prods) {
  const q = shelf.qtys || {};
  const ap = prods.filter(p => q[p.id] && q[p.id].asst > 0)
    .sort((a,b) => ((q[a.id]||{}).order||999) - ((q[b.id]||{}).order||999));
  const map = {}; let i = 0;
  ap.forEach(p => { const n=(q[p.id]||{}).asst||0; for(let ai=0;ai<n;ai++){map[p.id+"|"+ai]=PALETTE[i%PALETTE.length];i++;} });
  return map;
}
function packRect(actives, qtys, tray, gap) {
  const pls = [], cols = [];
  actives.forEach(p => {
    const arr = (qtys[p.id]||{}).eachArr || [];
    arr.forEach((e, ai) => {
      const qty = (e&&e.qty)||0, layers = (e&&e.layers)||1;
      for (let k = 0; k < qty; k++) {
        const matching = cols.filter(c => c.pid === p.id);
        let placed = false;
        for (let m = 0; m < matching.length; m++) {
          const c = matching[m];
          if (c.nextY + p.w <= tray.w + 0.01) {
            pls.push({id:"pl_"+pls.length+"_"+Date.now(),pid:p.id,ai,layers,x:c.x,y:c.nextY,invalid:false});
            c.nextY += p.w + gap; placed = true; break;
          }
        }
        if (placed) continue;
        let x = 0;
        for (let j = 0; j < cols.length; j++) x = Math.max(x, cols[j].x + cols[j].w + gap);
        const fits = x + p.l <= tray.l + 0.01;
        pls.push({id:"pl_"+pls.length+"_"+Date.now(),pid:p.id,ai,layers,x:fits?x:0,y:0,invalid:!fits});
        if (fits) cols.push({pid:p.id,x,w:p.l,nextY:p.w+gap});
      }
    });
  });
  const valid = pls.filter(p => !p.invalid);
  const colSet = {}; valid.forEach(p => { colSet[p.x.toFixed(3)] = 1; });
  return {pls, stats:{cols:Object.keys(colSet).length, rows:valid.length?Math.max(...valid.map(p=>p.y)):0}};
}
function packOval(actives, qtys, tray, gap) {
  const pls = []; let mc = 0, mr = 0;
  actives.forEach(p => {
    const arr = (qtys[p.id]||{}).eachArr || [];
    arr.forEach((e, ai) => {
      const qty = (e&&e.qty)||0, layers = (e&&e.layers)||1;
      for (let k = 0; k < qty; k++) {
        let placed = false;
        for (let c = 0; c < 200 && !placed; c++) {
          const tx = c * (p.l + gap);
          if (tx + p.l > tray.l + 0.01) break;
          for (let r = 0; r < 200 && !placed; r++) {
            const ty = r * (p.w + gap);
            if (ty + p.w > tray.w + 0.01) break;
            const cand = {id:"_",pid:p.id,x:tx,y:ty,invalid:false};
            if (!hasCollision(cand,pls,actives) && rectFitsEllipse(tray.l/2,tray.w/2,tx,ty,p.l,p.w)) {
              pls.push({id:"pl_"+pls.length+"_"+Date.now(),pid:p.id,ai,layers,x:tx,y:ty,invalid:false});
              mc=Math.max(mc,c+1); mr=Math.max(mr,r+1); placed=true;
            }
          }
        }
        if (!placed) pls.push({id:"pl_"+pls.length+"_"+Date.now(),pid:p.id,ai,layers,x:0,y:0,invalid:true});
      }
    });
  });
  return {pls, stats:{cols:mc,rows:mr}};
}
function centerPlacements(pls, prods, tray) {
  const valid = pls.filter(p => !p.invalid);
  if (!valid.length) return pls;
  let x0=Infinity,x1=-Infinity,y0=Infinity,y1=-Infinity;
  valid.forEach(pl => {
    const p = prods.find(x => x.id === pl.pid); if (!p) return;
    x0=Math.min(x0,pl.x); x1=Math.max(x1,pl.x+p.l);
    y0=Math.min(y0,pl.y); y1=Math.max(y1,pl.y+p.w);
  });
  if (!isFinite(x0)) return pls;
  const ox = (x1-x0) <= tray.l ? (tray.l-(x1-x0))/2 - x0 : 0;
  const oy = (y1-y0) <= tray.w ? (tray.w-(y1-y0))/2 - y0 : 0;
  if (!ox && !oy) return pls;
  return pls.map(pl => pl.invalid ? pl : {...pl, x:Math.max(0,pl.x+ox), y:Math.max(0,pl.y+oy)});
}

function Container({shape,outer,tray,scale,innerRef,children,showLabels}) {
  const W=tray.l*scale, H=tray.w*scale, pad=(WALL/2)*scale;
  return (
    <div style={{position:"relative",padding:pad,border:"2.5px solid #000",borderRadius:shape==="oval"?"50%":"6px",background:"#f1f1f1",flexShrink:0}}>
      <div ref={innerRef} style={{position:"relative",width:W,height:H,border:"1px dashed #aaa",borderRadius:shape==="oval"?"50%":"3px",background:"#fff",overflow:"hidden"}}>
        {shape==="rect" && Array.from({length:Math.max(0,Math.floor(tray.l)-1)},(_,i)=>(
          <div key={"v"+i} style={{position:"absolute",left:((i+1)/tray.l*100)+"%",top:0,width:1,height:"100%",background:"#ececec",pointerEvents:"none"}}/>
        ))}
        {shape==="rect" && Array.from({length:Math.max(0,Math.floor(tray.w)-1)},(_,i)=>(
          <div key={"h"+i} style={{position:"absolute",top:((i+1)/tray.w*100)+"%",left:0,height:1,width:"100%",background:"#ececec",pointerEvents:"none"}}/>
        ))}
        {children}
      </div>
      {showLabels && <div style={{position:"absolute",bottom:-19,left:0,width:"100%",textAlign:"center",fontSize:9,color:"#888",pointerEvents:"none"}}>{outer.l}" outer · {tray.l}" inner</div>}
      {showLabels && <div style={{position:"absolute",left:-26,top:0,height:"100%",display:"flex",alignItems:"center",pointerEvents:"none"}}><span style={{fontSize:9,color:"#888",transform:"rotate(-90deg)",whiteSpace:"nowrap"}}>{outer.w}" / {tray.w}"</span></div>}
    </div>
  );
}

function Item({pl,prod,tray,color,selected,fontSize,onMouseDown}) {
  return (
    <div onMouseDown={onMouseDown} style={{position:"absolute",left:(pl.x/tray.l*100)+"%",top:(pl.y/tray.w*100)+"%",width:(prod.l/tray.l*100)+"%",height:(prod.w/tray.w*100)+"%",background:"#fff",border:(selected?3:2)+"px solid "+color,borderRadius:isRect(prod)?"10%":"50%",boxSizing:"border-box",cursor:onMouseDown?"grab":"default",display:"flex",alignItems:"center",justifyContent:"center",userSelect:"none",zIndex:selected?10:1}}>
      <span style={{fontSize,fontWeight:800,color:"#000",lineHeight:1,pointerEvents:"none"}}>{al(pl.ai)}</span>
    </div>
  );
}

function Canvas({shelf,allProds,colorMap,selectedId,onSelect,onMove,snapEnabled}) {
  const tray=shelf.tray||{l:12,w:8};
  const outer=shelf.outer||{l:round4(tray.l+WALL),w:round4(tray.w+WALL)};
  const scale=Math.min(460/outer.l,320/outer.w);
  const W=tray.l*scale, H=tray.w*scale;
  const dragRef=useRef(null), innerRef=useRef(null);

  useEffect(() => {
    const mv = e => {
      const d = dragRef.current;
      if (!d || !innerRef.current) return;
      const p = allProds.find(x => x.id === d.pid);
      if (!p) return;
      const r = innerRef.current.getBoundingClientRect();
      let nx = (e.clientX-r.left)/W*tray.l - d.ox;
      let ny = (e.clientY-r.top)/H*tray.w - d.oy;
      if (snapEnabled) { nx=snapv(nx); ny=snapv(ny); }
      nx=clamp(nx,0,tray.l-p.l); ny=clamp(ny,0,tray.w-p.w);
      const cand = {id:d.id,pid:d.pid,x:nx,y:ny,invalid:false};
      const others = shelf.pls.filter(x => x.id!==d.id && !x.invalid);
      if (hasCollision(cand,others,allProds,d.id)) return;
      if (shelf.shape==="oval" && !rectFitsEllipse(tray.l/2,tray.w/2,nx,ny,p.l,p.w)) return;
      onMove(d.id,nx,ny);
    };
    const mu = () => { dragRef.current = null; };
    window.addEventListener("mousemove",mv);
    window.addEventListener("mouseup",mu);
    return () => { window.removeEventListener("mousemove",mv); window.removeEventListener("mouseup",mu); };
  }, [W,H,tray.l,tray.w,shelf.pls,shelf.shape,allProds,snapEnabled,onMove]);

  return (
    <Container shape={shelf.shape} outer={outer} tray={tray} scale={scale} innerRef={innerRef} showLabels={true}>
      {shelf.pls.filter(pl => !pl.invalid).map(pl => {
        const p = allProds.find(x => x.id === pl.pid);
        if (!p) return null;
        const col = colorMap[pl.pid+"|"+pl.ai] || "#888";
        const fs = Math.max(9, Math.min(16, Math.min(p.l,p.w)*scale/2.5));
        return (
          <Item key={pl.id} pl={pl} prod={p} tray={tray} color={col} selected={pl.id===selectedId} fontSize={fs}
            onMouseDown={e => {
              e.preventDefault(); onSelect(pl.id);
              const r = innerRef.current.getBoundingClientRect();
              dragRef.current = {id:pl.id,pid:pl.pid,ox:(e.clientX-r.left)/W*tray.l-pl.x,oy:(e.clientY-r.top)/H*tray.w-pl.y};
            }}/>
        );
      })}
    </Container>
  );
}

function Thumb({sh,allProds,maxW,maxH}) {
  const tray=sh.tray||{l:12,w:8};
  const outer=sh.outer||{l:round4(tray.l+WALL),w:round4(tray.w+WALL)};
  const scale=Math.min((maxW-40)/outer.l,(maxH-40)/outer.w);
  const cm=sh.colorMap||{};
  return (
    <Container shape={sh.shape} outer={outer} tray={tray} scale={scale} showLabels={true}>
      {(sh.pls||[]).filter(pl => !pl.invalid).map((pl,i) => {
        const p = allProds.find(x => x.id === pl.pid);
        if (!p) return null;
        const col = cm[pl.pid+"|"+pl.ai] || PALETTE[i%PALETTE.length];
        const fs = Math.max(7, Math.min(13, Math.min(p.l,p.w)*scale/2.8));
        return <Item key={pl.id||i} pl={pl} prod={p} tray={tray} color={col} selected={false} fontSize={fs} onMouseDown={null}/>;
      })}
    </Container>
  );
}

export default function App() {
  const loaded = (() => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}"); } catch(e) { return {}; } })();
  const [shelves,setShelves]=useState(loaded.shelves&&loaded.shelves.length?loaded.shelves:[makeShelf(1)]);
  const [savedShelves,setSavedShelves]=useState(loaded.savedShelves||[]);
  const [custom,setCustom]=useState(loaded.custom||[]);
  const [activeIdx,setActiveIdx]=useState(0);
  const [showTotal,setShowTotal]=useState(false);
  const [selectedId,setSelectedId]=useState(null);
  const [snapEnabled,setSnapEnabled]=useState(true);
  const [search,setSearch]=useState("");
  const [addOpen,setAddOpen]=useState(false);
  const [cf,setCf]=useState({name:"",cat:"Custom",brand:"Bath & Body",l:"",w:"",wt:""});
  const [editingShelf,setEditingShelf]=useState(null);
  const [orderDrag,setOrderDrag]=useState(null);
  const [orderDragOver,setOrderDragOver]=useState(null);
  const [shelfDrag,setShelfDrag]=useState(null);
  const [shelfDragOver,setShelfDragOver]=useState(null);
  const [collBrands,setCollBrands]=useState(new Set(BRANDS));
  const [collBuckets,setCollBuckets]=useState(new Set(RESET_BUCKETS));
  const [globalWtI,setGlobalWtI]=useState("");
  const [resetPend,setResetPend]=useState(false);
  const [xlsxReady,setXlsxReady]=useState(false);
  const [pdfReady,setPdfReady]=useState(false);
  const resetTimer=useRef(null), saveTimer=useRef(null), wrapRef=useRef(null);

  useEffect(() => {
    if (window.XLSX) { setXlsxReady(true); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    s.onload = () => setXlsxReady(true);
    document.head.appendChild(s);
  }, []);

  useEffect(() => {
    if (window.jspdf) { setPdfReady(true); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    s.onload = () => setPdfReady(true);
    document.head.appendChild(s);
  }, []);

  useEffect(() => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({shelves,savedShelves,custom})); } catch(e) {}
    }, 1200);
  }, [shelves,savedShelves,custom]);

  useEffect(() => { if (selectedId && wrapRef.current) wrapRef.current.focus(); }, [selectedId]);

  const allProds = useMemo(() => PRODUCTS.concat(custom), [custom]);
  const idx = Math.min(activeIdx, shelves.length-1);
  const active = shelves[idx] || shelves[0];
  const tray = active.tray || {l:12,w:8};
  const outer = active.outer || {l:round4(tray.l+WALL),w:round4(tray.w+WALL)};
  const qtys = active.qtys || {};
  const pls = active.pls || [];
  const validPls = pls.filter(p => !p.invalid);
  const invalidPls = pls.filter(p => p.invalid);
  const shown = useMemo(() => allProds.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase())), [allProds,search]);
  const activeProds = useMemo(() => allProds.filter(p => qtys[p.id]&&qtys[p.id].asst>0).sort((a,b) => ((qtys[a.id]||{}).order||999)-((qtys[b.id]||{}).order||999)), [allProds,qtys]);
  const colorMap = useMemo(() => buildColorMap(active,allProds), [active,allProds]);
  const getColor = useCallback((pid,ai) => colorMap[pid+"|"+ai]||"#888", [colorMap]);
  const activeWt = useMemo(() => shelfWt(pls,allProds), [pls,allProds]);
  const wtLim = parseFloat(active.wtLimitI)||null;
  const wtOver = wtLim!==null && activeWt>wtLim;
  const wtPct = wtLim ? Math.min(100,activeWt/wtLim*100) : 0;
  const totalPerLayer = useMemo(() => Object.keys(qtys).reduce((s,k) => s+((qtys[k].eachArr||[]).reduce((a,b) => a+((b&&b.qty)||0),0)),0), [qtys]);
  const totalSavedWt = useMemo(() => savedShelves.reduce((s,sh) => s+(sh.wt||0),0), [savedShelves]);
  const gLim = parseFloat(globalWtI)||null;
  const gOver = gLim!==null && totalSavedWt>gLim;
  const savedSnap = savedShelves.find(s => s.shelfId===active.id)||null;
  const isSaved = !!savedSnap;
  const hasChanges = isSaved && JSON.stringify([active.pls,active.wtLimitI,active.shape,active.tray,active.outer])!==JSON.stringify([savedSnap.pls,savedSnap.wtLimitI,savedSnap.shape,savedSnap.tray,savedSnap.outer]);

  const summaryRows = useMemo(() => {
    const m = {};
    validPls.forEach(pl => { const k=pl.pid+"|"+pl.ai; if(!m[k]) m[k]={count:0,layers:pl.layers||1}; m[k].count++; });
    return Object.keys(m).map(k => {
      const pid=k.split("|")[0], ai=parseInt(k.split("|")[1],10);
      const p=allProds.find(x=>x.id===pid); if(!p) return null;
      const c=m[k].count, ly=m[k].layers;
      return {key:k,pid,ai,name:p.name,prod:p,color:getColor(pid,ai),rows:c,layers:ly,total:c*ly,unitWt:p.wt||0,totalWt:(p.wt||0)*c*ly};
    }).filter(Boolean);
  }, [validPls,allProds,getColor]);

  const totalData = useMemo(() => {
    const byP = {};
    savedShelves.forEach(sh => (sh.pls||[]).filter(p=>!p.invalid).forEach(pl => {
      const p=allProds.find(x=>x.id===pl.pid); if(!p) return;
      if(!byP[pl.pid]) byP[pl.pid]={name:p.name,unitWt:p.wt||0,totalQty:0,totalWt:0};
      byP[pl.pid].totalQty+=pl.layers||1;
      byP[pl.pid].totalWt+=(p.wt||0)*(pl.layers||1);
    }));
    const arr=Object.keys(byP).map(k=>byP[k]).sort((a,b)=>b.totalQty-a.totalQty);
    return {byProd:arr, grandQty:arr.reduce((s,r)=>s+r.totalQty,0), grandWt:arr.reduce((s,r)=>s+r.totalWt,0)};
  }, [savedShelves,allProds]);

  const upd = useCallback(u => setShelves(p => p.map((s,i) => i===idx ? Object.assign({},s,u) : s)), [idx]);
  const tog = (fn,k) => fn(p => { const n=new Set(p); if(n.has(k)) n.delete(k); else n.add(k); return n; });

  const setOuter = (k,raw) => {
    const v=parseFloat(raw);
    const u={oi:Object.assign({},active.oi||{},{[k]:raw})};
    if(!isNaN(v)&&v>0){const inner=round4(v-WALL);u.outer=Object.assign({},outer,{[k]:v});u.tray=Object.assign({},tray,{[k]:inner>0?inner:v});u.ti=Object.assign({},active.ti||{},{[k]:String(inner>0?inner:v)});}
    upd(u);
  };
  const setInner = (k,raw) => {
    const v=parseFloat(raw);
    const u={ti:Object.assign({},active.ti||{},{[k]:raw})};
    if(!isNaN(v)&&v>0) u.tray=Object.assign({},tray,{[k]:v});
    upd(u);
  };

  const setAsst = useCallback((pid,val) => {
    const n=Math.max(0,parseInt(val,10)||0);
    setShelves(prev => prev.map((s,i) => {
      if(i!==idx) return s;
      const q=Object.assign({},s.qtys);
      if(n===0){delete q[pid]; return Object.assign({},s,{qtys:q});}
      const cur=q[pid]||{asst:0,order:Object.keys(q).length+1,eachArr:[]};
      const arr=[]; for(let j=0;j<n;j++) arr.push(cur.eachArr[j]||{qty:0,layers:1});
      q[pid]=Object.assign({},cur,{asst:n,eachArr:arr,order:q[pid]?cur.order:Object.keys(q).length+1});
      return Object.assign({},s,{qtys:q});
    }));
  }, [idx]);

  const setEntry = useCallback((pid,ai,field,val) => {
    const n=field==="layers"?Math.max(1,parseInt(val,10)||1):Math.max(0,parseInt(val,10)||0);
    setShelves(prev => prev.map((s,i) => {
      if(i!==idx) return s;
      const q=Object.assign({},s.qtys);
      const cur=q[pid]||{asst:0,order:1,eachArr:[]};
      const arr=(cur.eachArr||[]).slice();
      arr[ai]=Object.assign({},arr[ai]||{qty:0,layers:1},{[field]:n});
      q[pid]=Object.assign({},cur,{eachArr:arr});
      return Object.assign({},s,{qtys:q});
    }));
  }, [idx]);

  const handleOrderDrop = useCallback(tPid => {
    if(!orderDrag||orderDrag===tPid) return;
    setShelves(prev => prev.map((s,i) => {
      if(i!==idx) return s;
      const q=Object.assign({},s.qtys);
      const ids=Object.keys(q).filter(k=>q[k].asst>0).sort((a,b)=>(q[a].order||999)-(q[b].order||999));
      const re=ids.slice();
      re.splice(ids.indexOf(tPid),0,re.splice(ids.indexOf(orderDrag),1)[0]);
      re.forEach((pid,j)=>{if(q[pid])q[pid]=Object.assign({},q[pid],{order:j+1});});
      return Object.assign({},s,{qtys:q});
    }));
    setOrderDrag(null); setOrderDragOver(null);
  }, [idx,orderDrag]);

  const handleShelfDrop = useCallback(tid => {
    if(!shelfDrag||shelfDrag===tid) return;
    setShelves(prev => {
      const ids=prev.map(s=>s.id), re=prev.slice();
      re.splice(ids.indexOf(tid),0,re.splice(ids.indexOf(shelfDrag),1)[0]);
      setActiveIdx(re.findIndex(s=>s.id===active.id));
      return re;
    });
    setShelfDrag(null); setShelfDragOver(null);
  }, [shelfDrag,active.id]);

  const autoArr = useCallback(() => {
    const sh=shelves[idx];
    const gap=parseFloat(sh.spacingI)||0;
    const t=sh.tray||{l:12,w:8};
    const q=sh.qtys||{};
    const ap=allProds.filter(p=>q[p.id]&&q[p.id].asst>0).sort((a,b)=>((q[a.id]||{}).order||999)-((q[b.id]||{}).order||999));
    const res=sh.shape==="rect"?packRect(ap,q,t,gap):packOval(ap,q,t,gap);
    const final=sh.shape==="rect"?centerPlacements(res.pls,allProds,t):res.pls;
    setShelves(prev=>prev.map((s,i)=>i===idx?Object.assign({},s,{pls:final,layoutStats:res.stats}):s));
    setSelectedId(null);
  }, [shelves,idx,allProds]);

  const snapshot = (sh,when) => ({shelfId:sh.id,name:sh.name,pls:JSON.parse(JSON.stringify(sh.pls)),wt:shelfWt(sh.pls,allProds),wtLimitI:sh.wtLimitI,layoutStats:Object.assign({},sh.layoutStats),colorMap:buildColorMap(sh,allProds),shape:sh.shape,tray:Object.assign({},sh.tray),outer:Object.assign({},sh.outer||{}),savedAt:when});

  const saveShelf = useCallback(() => {
    const sh=shelves[idx]; const snap=snapshot(sh,new Date().toLocaleString());
    setSavedShelves(prev=>prev.some(s=>s.shelfId===sh.id)?prev.map(s=>s.shelfId===sh.id?snap:s):prev.concat([snap]));
  }, [shelves,idx,allProds]);

  const saveAll = useCallback(() => {
    const now=new Date().toLocaleString();
    setSavedShelves(prev=>{
      let next=prev.slice();
      shelves.forEach(sh=>{
        if(!(sh.pls||[]).filter(p=>!p.invalid).length) return;
        const snap=snapshot(sh,now);
        const i=next.findIndex(s=>s.shelfId===sh.id);
        if(i>=0) next[i]=snap; else next=next.concat([snap]);
      });
      return next;
    });
  }, [shelves,allProds]);

  const addShelf = () => { setShelves(p=>{const n=p.concat([makeShelf(p.length+1,p[idx])]);setActiveIdx(n.length-1);return n;});setShowTotal(false);setSelectedId(null); };
  const copyShelf = i => { setShelves(p=>{const src=p[i];const cp=Object.assign({},JSON.parse(JSON.stringify(src)),{id:"sh_"+Date.now()+"_c",name:src.name+" (copy)"});const n=p.slice();n.splice(i+1,0,cp);setActiveIdx(i+1);return n;}); };
  const removeShelf = i => { if(shelves.length===1) return; setShelves(p=>{const n=p.filter((_,j)=>j!==i);setActiveIdx(v=>Math.min(v,n.length-1));return n;}); };
  const removeItem = useCallback(id => { setShelves(prev=>prev.map((s,i)=>i!==idx?s:Object.assign({},s,{pls:s.pls.filter(pl=>pl.id!==id)}))); setSelectedId(null); }, [idx]);
  const moveItem = useCallback((id,nx,ny) => { setShelves(prev=>prev.map((s,i)=>i!==idx?s:Object.assign({},s,{pls:s.pls.map(pl=>pl.id!==id?pl:Object.assign({},pl,{x:nx,y:ny}))}))); }, [idx]);

  const nudge = useCallback((dx,dy) => {
    if(!selectedId) return;
    const sh=shelves[idx]; const pl=sh.pls.find(p=>p.id===selectedId);
    if(!pl||pl.invalid) return;
    const p=allProds.find(x=>x.id===pl.pid); if(!p) return;
    const t=sh.tray||{l:12,w:8};
    const nx=clamp(pl.x+dx,0,t.l-p.l), ny=clamp(pl.y+dy,0,t.w-p.w);
    const cand={id:pl.id,pid:pl.pid,x:nx,y:ny,invalid:false};
    const others=sh.pls.filter(x=>x.id!==pl.id&&!x.invalid);
    if(hasCollision(cand,others,allProds,pl.id)) return;
    if(sh.shape==="oval"&&!rectFitsEllipse(t.l/2,t.w/2,nx,ny,p.l,p.w)) return;
    moveItem(selectedId,nx,ny);
  }, [selectedId,shelves,idx,allProds,moveItem]);

  useEffect(() => {
    const onKey = e => {
      if(["INPUT","SELECT","TEXTAREA"].includes(e.target.tagName)) return;
      if(e.key==="Escape"){setSelectedId(null);return;}
      if((e.key==="Delete"||e.key==="Backspace")&&selectedId){e.preventDefault();removeItem(selectedId);return;}
      if(!["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) return;
      e.preventDefault();
      const d=e.shiftKey?0.5:GRID;
      if(e.key==="ArrowLeft") nudge(-d,0);
      else if(e.key==="ArrowRight") nudge(d,0);
      else if(e.key==="ArrowUp") nudge(0,-d);
      else nudge(0,d);
    };
    window.addEventListener("keydown",onKey);
    return () => window.removeEventListener("keydown",onKey);
  }, [selectedId,nudge,removeItem]);

  const clearWS = () => {
    if(!resetPend){setResetPend(true);clearTimeout(resetTimer.current);resetTimer.current=setTimeout(()=>setResetPend(false),3000);return;}
    clearTimeout(resetTimer.current);setResetPend(false);
    try{localStorage.removeItem(STORAGE_KEY);}catch(e){}
    setShelves([makeShelf(1)]);setSavedShelves([]);setCustom([]);setActiveIdx(0);setShowTotal(false);
    setSelectedId(null);setGlobalWtI("");setSearch("");
    setCollBrands(new Set(BRANDS));setCollBuckets(new Set(RESET_BUCKETS));
  };

  const exportJSON = () => {
    const b=new Blob([JSON.stringify({shelves,savedShelves,custom,globalWtI},null,2)],{type:"application/json"});
    const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="PDQLayout_"+new Date().toISOString().slice(0,10)+".json";document.body.appendChild(a);a.click();document.body.removeChild(a);
  };
  const importJSON = e => {
    const f=e.target.files&&e.target.files[0]; if(!f) return;
    const r=new FileReader();
    r.onload=ev=>{try{const d=JSON.parse(ev.target.result);if(d.shelves&&d.shelves.length)setShelves(d.shelves);if(d.savedShelves)setSavedShelves(d.savedShelves);if(d.custom)setCustom(d.custom);if(d.globalWtI!==undefined)setGlobalWtI(d.globalWtI);setActiveIdx(0);setShowTotal(false);setSelectedId(null);}catch(err){alert("Invalid layout file.");}};
    r.readAsText(f);e.target.value="";
  };
  const exportXLSX = () => {
    const X=window.XLSX; if(!X){alert("Still loading, try again.");return;}
    const wb=X.utils.book_new();
    const dt=new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});
    const rows1=[["PDQ Layout Planner"],["Generated: "+dt],[],["Shelf","Shape","Outer","Inner","Positions","Units","Weight (lbs)","Limit","Status"]];
    savedShelves.forEach(sh=>{const ov=sh.wtLimitI&&sh.wt>parseFloat(sh.wtLimitI);const vp=(sh.pls||[]).filter(p=>!p.invalid);const o=sh.outer||{};rows1.push([sh.name,sh.shape==="oval"?"Basket":"Tray",(o.l||"")+"x"+(o.w||""),(sh.tray?sh.tray.l:"")+"x"+(sh.tray?sh.tray.w:""),vp.length,vp.reduce((s,pl)=>s+(pl.layers||1),0),+sh.wt.toFixed(2),sh.wtLimitI||"-",ov?"OVER":"OK"]);});
    rows1.push([]);rows1.push(["Total","","","",savedShelves.reduce((s,sh)=>s+(sh.pls||[]).filter(p=>!p.invalid).length,0),totalData.grandQty,+totalData.grandWt.toFixed(2),gLim||"-",""]);
    const ws1=X.utils.aoa_to_sheet(rows1);ws1["!cols"]=[{wch:18},{wch:8},{wch:12},{wch:14},{wch:10},{wch:8},{wch:12},{wch:8},{wch:8}];X.utils.book_append_sheet(wb,ws1,"Summary");
    const rows2=[["Product Totals"],["Generated: "+dt],[],["Product","Units","Unit Wt","Total Wt"]];
    totalData.byProd.forEach(r=>rows2.push([r.name,r.totalQty,r.unitWt?+r.unitWt.toFixed(2):"",r.totalWt?+r.totalWt.toFixed(2):""]));
    rows2.push([]);rows2.push(["Grand Total",totalData.grandQty,"",+totalData.grandWt.toFixed(2)]);
    const ws2=X.utils.aoa_to_sheet(rows2);ws2["!cols"]=[{wch:36},{wch:10},{wch:12},{wch:12}];X.utils.book_append_sheet(wb,ws2,"Product Totals");
    X.writeFile(wb,"PDQLayout_"+new Date().toISOString().slice(0,10)+".xlsx");
  };

  const exportPDF = () => {
    const J = window.jspdf;
    if (!J) { alert("PDF library still loading, try again."); return; }
    if (!savedShelves.length) { alert("Save at least one shelf first."); return; }
    const { jsPDF } = J;
    const doc = new jsPDF({ orientation:"landscape", unit:"mm", format:"letter" });
    const PW=279, PH=216, M=15;
    const hr = h => { if(h.length===4) h="#"+h[1]+h[1]+h[2]+h[2]+h[3]+h[3]; return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]; };
    const lt = (r,g,b) => [Math.min(255,r+Math.round((255-r)*0.8)),Math.min(255,g+Math.round((255-g)*0.8)),Math.min(255,b+Math.round((255-b)*0.8))];

    // ── Shelf pages ──────────────────────────────────────────────────────────
    savedShelves.forEach((sh, si) => {
      if (si > 0) doc.addPage();
      const tray=sh.tray||{l:12,w:8};
      const od=sh.outer||{l:round4(tray.l+WALL),w:round4(tray.w+WALL)};
      const vp=(sh.pls||[]).filter(p=>!p.invalid);
      const cm=sh.colorMap||{};

      // Header
      doc.setFont("helvetica","bold"); doc.setFontSize(13); doc.setTextColor(0);
      doc.text(sh.name, M, M+5);
      doc.setFont("helvetica","normal"); doc.setFontSize(7.5); doc.setTextColor(100);
      doc.text(`${sh.shape==="oval"?"Basket":"Tray"}  ·  ${od.l}"x${od.w}" outer  /  ${tray.l}"x${tray.w}" inner  ·  Saved: ${sh.savedAt}`, M, M+11);
      doc.setTextColor(0);

      // Shelf visual
      const vX=M, vY=M+17, vmW=130, vmH=PH-vY-M-12;
      const sc=Math.min(vmW/od.l,vmH/od.w);
      const ow=od.l*sc, oh=od.w*sc, iw=tray.l*sc, ih=tray.w*sc;
      const ix=vX+(ow-iw)/2, iy=vY+(oh-ih)/2;

      doc.setFillColor(241,241,241); doc.setDrawColor(0,0,0); doc.setLineWidth(0.8);
      sh.shape==="oval" ? doc.ellipse(vX+ow/2,vY+oh/2,ow/2,oh/2,"FD") : doc.roundedRect(vX,vY,ow,oh,1.5,1.5,"FD");

      doc.setFillColor(255,255,255); doc.setDrawColor(170,170,170); doc.setLineWidth(0.3);
      doc.setLineDashPattern([1.5,1],0);
      sh.shape==="oval" ? doc.ellipse(vX+ow/2,vY+oh/2,iw/2,ih/2,"FD") : doc.rect(ix,iy,iw,ih,"FD");
      doc.setLineDashPattern([],0);

      if(sh.shape!=="oval"){
        doc.setDrawColor(225,225,225); doc.setLineWidth(0.1);
        for(let ci=1;ci<Math.floor(tray.l);ci++) doc.line(ix+ci*sc,iy,ix+ci*sc,iy+ih);
        for(let ri=1;ri<Math.floor(tray.w);ri++) doc.line(ix,iy+ri*sc,ix+iw,iy+ri*sc);
      }

      vp.forEach(pl => {
        const p=allProds.find(x=>x.id===pl.pid); if(!p) return;
        const col=cm[pl.pid+"|"+pl.ai]||"#888888";
        const [r,g,b]=hr(col); const [lr,lg,lb]=lt(r,g,b);
        const px=ix+pl.x*sc, py=iy+pl.y*sc, pw=p.l*sc, ph=p.w*sc;
        doc.setFillColor(lr,lg,lb); doc.setDrawColor(r,g,b); doc.setLineWidth(0.5);
        isRect(p) ? doc.roundedRect(px,py,pw,ph,0.8,0.8,"FD") : doc.ellipse(px+pw/2,py+ph/2,pw/2,ph/2,"FD");
        const fs=Math.max(5,Math.min(9,Math.min(pw,ph)*0.42));
        doc.setFontSize(fs); doc.setFont("helvetica","bold"); doc.setTextColor(r,g,b);
        doc.text(al(pl.ai), px+pw/2, py+ph/2+fs*0.2, {align:"center"});
      });

      doc.setFontSize(6.5); doc.setFont("helvetica","normal"); doc.setTextColor(120);
      doc.text(`${od.l}" outer  ·  ${tray.l}" inner`, vX+ow/2, vY+oh+4, {align:"center"});

      const units=vp.reduce((s,pl)=>s+(pl.layers||1),0);
      const stripY=vY+oh+10;
      [["POSITIONS",vp.length],["UNITS",units],["WEIGHT",(sh.wt||0).toFixed(2)+" lbs"],["LIMIT",sh.wtLimitI||"–"]].forEach(([lbl,val],i)=>{
        const sx=vX+i*33;
        doc.setFontSize(6); doc.setFont("helvetica","normal"); doc.setTextColor(120);
        doc.text(lbl, sx, stripY);
        doc.setFontSize(11); doc.setFont("helvetica","bold"); doc.setTextColor(0);
        doc.text(String(val), sx, stripY+5.5);
      });

      // Product table
      const tX=M+vmW+8, tW=PW-tX-M;
      let ty=M+17;
      const grp={};
      vp.forEach(pl=>{const k=pl.pid+"|"+pl.ai;if(!grp[k])grp[k]={c:0,ly:pl.layers||1,pid:pl.pid,ai:pl.ai};grp[k].c++;});
      const cW=[tW*0.38,tW*0.08,tW*0.09,tW*0.09,tW*0.1,tW*0.13,tW*0.13];
      const cHdrs=["Product","Asst","Rows","Lyr","Total","Unit wt","Tot wt"];
      doc.setFillColor(50,50,50); doc.rect(tX,ty,tW,5.5,"F");
      doc.setFontSize(6.5); doc.setFont("helvetica","bold"); doc.setTextColor(255);
      let cx=tX+1.5;
      cHdrs.forEach((h,i)=>{ doc.text(h,i===0?cx:cx+cW[i]-1.5,ty+3.8,{align:i===0?"left":"right"}); cx+=cW[i]; });
      ty+=5.5;
      Object.keys(grp).forEach((k,ri)=>{
        const g2=grp[k]; const p=allProds.find(x=>x.id===g2.pid); if(!p) return;
        if(ri%2===0){doc.setFillColor(248,248,248);doc.rect(tX,ty,tW,5.5,"F");}
        const col=cm[k]||PALETTE[ri%PALETTE.length]; const [cr,cg,cb]=hr(col);
        doc.setFillColor(cr,cg,cb); doc.circle(tX+1.8,ty+2.75,1.1,"F");
        doc.setFontSize(6.5); doc.setFont("helvetica","normal"); doc.setTextColor(0);
        cx=tX+4;
        [p.name,al(g2.ai),String(g2.c),String(g2.ly),String(g2.c*g2.ly),p.wt?p.wt.toFixed(2):"–",p.wt?(p.wt*g2.c*g2.ly).toFixed(2):"–"].forEach((v,vi)=>{
          doc.text(v,vi===0?cx:cx+cW[vi]-1.5,ty+3.8,{align:vi===0?"left":"right",maxWidth:cW[vi]-1.5});
          cx+=cW[vi];
        });
        doc.setDrawColor(230,230,230); doc.setLineWidth(0.1); doc.line(tX,ty+5.5,tX+tW,ty+5.5);
        ty+=5.5;
      });
    });

    // ── Summary page ─────────────────────────────────────────────────────────
    doc.addPage();
    doc.setFont("helvetica","bold"); doc.setFontSize(13); doc.setTextColor(0);
    doc.text("All Shelves — Summary", M, M+5);
    const totUnits=savedShelves.reduce((s,sh)=>(sh.pls||[]).filter(p=>!p.invalid).reduce((a,pl)=>a+(pl.layers||1),s),0);
    const totPos=savedShelves.reduce((s,sh)=>s+(sh.pls||[]).filter(p=>!p.invalid).length,0);
    [["Shelves",savedShelves.length],["Positions",totPos],["Units",totUnits],["Total Weight",totalData.grandWt.toFixed(2)+" lbs"]].forEach(([lbl,val],i)=>{
      const bx=M+i*60,bY=M+12;
      doc.setFillColor(245,245,245); doc.roundedRect(bx,bY,56,15,1.5,1.5,"F");
      doc.setFontSize(6.5); doc.setFont("helvetica","normal"); doc.setTextColor(120);
      doc.text(lbl.toUpperCase(),bx+3,bY+4.5);
      doc.setFontSize(11); doc.setFont("helvetica","bold"); doc.setTextColor(0);
      doc.text(String(val),bx+3,bY+12);
    });
    let sy=M+33;
    const sW=PW-M*2;
    const sC=["Shelf","Type","Outer","Inner","Pos","Units","Weight","Limit","Status"];
    const sCW=[sW*0.18,sW*0.08,sW*0.1,sW*0.1,sW*0.08,sW*0.08,sW*0.1,sW*0.08,sW*0.1];
    doc.setFillColor(50,50,50); doc.rect(M,sy,sW,5.5,"F");
    doc.setFontSize(6.5); doc.setFont("helvetica","bold"); doc.setTextColor(255);
    let cx2=M+1;
    sC.forEach((h,i)=>{ doc.text(h,i===0?cx2:cx2+sCW[i]-1,sy+3.8,{align:i===0?"left":"right"}); cx2+=sCW[i]; });
    sy+=5.5; doc.setTextColor(0);
    savedShelves.forEach((sh,i)=>{
      const vp=(sh.pls||[]).filter(p=>!p.invalid);
      const units=vp.reduce((s,pl)=>s+(pl.layers||1),0);
      const ov=sh.wtLimitI&&sh.wt>parseFloat(sh.wtLimitI);
      const o=sh.outer||{};
      if(i%2===0){doc.setFillColor(248,248,248);doc.rect(M,sy,sW,5.5,"F");}
      doc.setFont("helvetica","normal"); doc.setFontSize(6.5); cx2=M+1;
      [sh.name,sh.shape==="oval"?"Basket":"Tray",`${o.l||"?"}x${o.w||"?"}`,`${sh.tray?sh.tray.l:"?"}x${sh.tray?sh.tray.w:"?"}`,String(vp.length),String(units),sh.wt?sh.wt.toFixed(2):"–",sh.wtLimitI||"–",ov?"OVER":"OK"].forEach((v,vi)=>{
        if(vi===8&&ov)doc.setTextColor(192,57,43); else doc.setTextColor(0);
        doc.text(v,vi===0?cx2:cx2+sCW[vi]-1,sy+3.8,{align:vi===0?"left":"right",maxWidth:sCW[vi]-1});
        cx2+=sCW[vi];
      });
      doc.setDrawColor(230,230,230); doc.setLineWidth(0.1); doc.line(M,sy+5.5,M+sW,sy+5.5);
      sy+=5.5;
    });

    // ── Totals page ───────────────────────────────────────────────────────────
    doc.addPage();
    doc.setFont("helvetica","bold"); doc.setFontSize(13); doc.setTextColor(0);
    doc.text("Product Totals — All Shelves", M, M+5);
    [["SKUs",totalData.byProd.length],["Total Units",totalData.grandQty],["Total Weight",totalData.grandWt.toFixed(2)+" lbs"]].forEach(([lbl,val],i)=>{
      const bx=M+i*65,bY=M+12;
      doc.setFillColor(245,245,245); doc.roundedRect(bx,bY,60,15,1.5,1.5,"F");
      doc.setFontSize(6.5); doc.setFont("helvetica","normal"); doc.setTextColor(120);
      doc.text(lbl.toUpperCase(),bx+3,bY+4.5);
      doc.setFontSize(11); doc.setFont("helvetica","bold"); doc.setTextColor(0);
      doc.text(String(val),bx+3,bY+12);
    });
    let ty2=M+33;
    const tW2=PW-M*2;
    const tC2=["Product","Units","Unit Wt (lbs)","Total Wt (lbs)"];
    const tCW2=[tW2*0.55,tW2*0.15,tW2*0.15,tW2*0.15];
    doc.setFillColor(50,50,50); doc.rect(M,ty2,tW2,5.5,"F");
    doc.setFontSize(6.5); doc.setFont("helvetica","bold"); doc.setTextColor(255);
    cx2=M+1;
    tC2.forEach((h,i)=>{ doc.text(h,i===0?cx2:cx2+tCW2[i]-1,ty2+3.8,{align:i===0?"left":"right"}); cx2+=tCW2[i]; });
    ty2+=5.5; doc.setTextColor(0);
    totalData.byProd.forEach((r,i)=>{
      if(i%2===0){doc.setFillColor(248,248,248);doc.rect(M,ty2,tW2,5.5,"F");}
      doc.setFont("helvetica","normal"); doc.setFontSize(6.5); cx2=M+1;
      [r.name,String(r.totalQty),r.unitWt?r.unitWt.toFixed(2):"–",r.totalWt?r.totalWt.toFixed(2):"–"].forEach((v,vi)=>{
        doc.text(v,vi===0?cx2:cx2+tCW2[vi]-1,ty2+3.8,{align:vi===0?"left":"right",maxWidth:tCW2[vi]-1});
        cx2+=tCW2[vi];
      });
      doc.setDrawColor(230,230,230); doc.setLineWidth(0.1); doc.line(M,ty2+5.5,M+tW2,ty2+5.5);
      ty2+=5.5;
    });
    doc.setFillColor(240,240,240); doc.rect(M,ty2,tW2,6,"F");
    doc.setFont("helvetica","bold"); doc.setFontSize(7); doc.setTextColor(0);
    doc.text("Grand Total", M+1, ty2+4);
    cx2=M+tCW2[0]+tCW2[1];
    doc.text(String(totalData.grandQty), cx2-1, ty2+4, {align:"right"});
    cx2+=tCW2[2]+tCW2[3];
    doc.text(totalData.grandWt.toFixed(2), cx2-1, ty2+4, {align:"right"});

    doc.save("PDQLayout_"+new Date().toISOString().slice(0,10)+".pdf");
  };

  const inp={padding:"4px 7px",border:"1px solid #ccc",borderRadius:6,fontSize:12,background:"#fafafa",color:"#111",width:"100%",boxSizing:"border-box",outline:"none"};
  const cell={padding:"5px 8px",fontSize:11,borderBottom:"0.5px solid #e8e8e8",color:"#222",whiteSpace:"nowrap"};
  const hcell=Object.assign({},cell,{fontSize:10,color:"#666",fontWeight:500,background:"#f5f5f5"});
  const hdr=(bg,label)=>(<div style={{padding:"5px 10px",background:bg}}><span style={{fontSize:11,fontWeight:700,color:"#fff",textTransform:"uppercase",letterSpacing:"0.5px"}}>{label}</span></div>);
  const tbtn=(label,onClick,disabled,on)=>(<button onClick={onClick} disabled={!!disabled} style={{padding:"5px 10px",border:"0.5px solid "+(on?"#4361ee":"#ccc"),borderRadius:6,background:on?"#eef0ff":disabled?"transparent":"#f5f5f5",color:disabled?"#aaa":on?"#4361ee":"#333",cursor:disabled?"default":"pointer",fontSize:11,fontWeight:500,opacity:disabled?0.5:1}}>{label}</button>);
  const stepBtn=onClick=>({onClick,style:{width:15,height:15,border:"0.5px solid #ccc",borderRadius:3,background:"#f5f5f5",cursor:"pointer",fontSize:11,padding:0,lineHeight:1}});
  const selPl=pls.find(p=>p.id===selectedId);
  const selProd=selPl?allProds.find(p=>p.id===selPl.pid):null;
  const legend=Object.keys(colorMap).map(k=>{const pid=k.split("|")[0],ai=parseInt(k.split("|")[1],10);const p=allProds.find(x=>x.id===pid);return p?{key:k,color:colorMap[k],prod:p,ai}:null;}).filter(Boolean);

  return (
    <div style={{display:"flex",height:"100vh",background:"#e8e8e8",fontFamily:"system-ui,sans-serif",overflow:"hidden"}}>

      {/* LEFT PANEL */}
      <div style={{width:296,background:"#f0f0f0",borderRight:"1px solid #ccc",display:"flex",flexDirection:"column",overflow:"hidden",flexShrink:0}}>
        <div style={{padding:"10px 12px",background:"#1a1a1a"}}>
          <div style={{fontSize:13,fontWeight:600,color:"#fff"}}>PDQ Layout Planner</div>
          <div style={{fontSize:10,color:"#aaa",marginTop:2}}>Product fitting & arrangement tool</div>
        </div>

        <div style={{margin:"6px 6px 0",borderRadius:8,border:"1.5px solid #bbb",overflow:"hidden",flexShrink:0}}>
          {hdr("#444","Container Type")}
          <div style={{padding:"8px 10px",background:"#fff",borderBottom:"1px solid #e0e0e0"}}>
            <div style={{display:"flex",gap:6}}>
              {[["rect","Tray (rectangle)"],["oval","Basket (oval)"]].map(o=>(
                <button key={o[0]} onClick={()=>upd({shape:o[0],pls:[],layoutStats:{cols:0,rows:0}})} style={{flex:1,padding:"5px 4px",border:"1.5px solid "+(active.shape===o[0]?"#333":"#ccc"),borderRadius:6,background:active.shape===o[0]?"#1a1a1a":"#f5f5f5",color:active.shape===o[0]?"#fff":"#555",cursor:"pointer",fontSize:11,fontWeight:active.shape===o[0]?600:400}}>{o[1]}</button>
              ))}
            </div>
          </div>
          {hdr("#555","Outer Dimensions (in)")}
          <div style={{padding:"8px 10px",background:"#fff",borderBottom:"1px solid #e0e0e0"}}>
            <div style={{display:"flex",gap:6}}>
              {[["l","Length"],["w","Width"]].map(o=>(
                <div key={o[0]} style={{flex:1}}>
                  <div style={{fontSize:9,color:"#777",marginBottom:2,textAlign:"center"}}>{o[1]}</div>
                  <input value={(active.oi||{})[o[0]]||""} onChange={e=>setOuter(o[0],e.target.value)} style={Object.assign({},inp,{textAlign:"center"})}/>
                </div>
              ))}
            </div>
            <div style={{fontSize:8.5,color:"#999",marginTop:4,textAlign:"center"}}>Inner auto-fills at &minus;{WALL}" per dimension</div>
          </div>
          {hdr("#4d4d4d","Inner Dimensions (usable)")}
          <div style={{padding:"8px 10px",background:"#fff",borderBottom:"1px solid #e0e0e0"}}>
            <div style={{display:"flex",gap:6}}>
              {[["l","Length"],["w","Width"]].map(o=>(
                <div key={o[0]} style={{flex:1}}>
                  <div style={{fontSize:9,color:"#777",marginBottom:2,textAlign:"center"}}>{o[1]}</div>
                  <input value={(active.ti||{})[o[0]]||""} onChange={e=>setInner(o[0],e.target.value)} style={Object.assign({},inp,{textAlign:"center",background:"#fffdf0"})}/>
                </div>
              ))}
            </div>
            <div style={{fontSize:8.5,color:"#999",marginTop:4,textAlign:"center"}}>Products fit here · override if non-standard</div>
          </div>
          {hdr("#5c5c5c","Item Spacing (in)")}
          <div style={{padding:"6px 10px",background:"#fff",borderBottom:"1px solid #e0e0e0"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:9,color:"#777",flex:1}}>Gap between items · 0 = flush</span>
              <input value={active.spacingI||""} onChange={e=>upd({spacingI:e.target.value.replace(/[^0-9.]/g,"")})} style={Object.assign({},inp,{width:60,textAlign:"center"})}/>
            </div>
          </div>
          {hdr("#666","Weight Limits (lbs)")}
          <div style={{padding:"8px 10px",background:"#fff",borderBottom:activeWt>0?"1px solid #e0e0e0":"none"}}>
            <div style={{display:"flex",gap:6}}>
              <div style={{flex:1}}>
                <div style={{fontSize:9,color:"#777",marginBottom:2,textAlign:"center"}}>All shelves</div>
                <input value={globalWtI} onChange={e=>setGlobalWtI(e.target.value.replace(/[^0-9.]/g,""))} style={Object.assign({},inp,{textAlign:"center"})}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:9,color:"#777",marginBottom:2,textAlign:"center"}}>{active.name}</div>
                <input value={active.wtLimitI} onChange={e=>upd({wtLimitI:e.target.value.replace(/[^0-9.]/g,"")})} style={Object.assign({},inp,{textAlign:"center"})}/>
              </div>
            </div>
          </div>
          {activeWt>0 && (
            <div style={{padding:"6px 10px",background:"#fafafa"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:10,color:"#666"}}>{active.name}</span>
                <span style={{fontSize:10,fontWeight:600,color:wtOver?"#c0392b":wtPct>85?"#e67e22":"#111"}}>{activeWt.toFixed(2)}{wtLim?" / "+wtLim:""} lbs</span>
              </div>
              {wtLim && <div style={{height:4,background:"#e0e0e0",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:wtPct+"%",background:wtOver?"#e24b4a":wtPct>85?"#ef9f27":"#1d9e75",borderRadius:3}}/></div>}
            </div>
          )}
        </div>

        {activeProds.length > 0 && (
          <div style={{margin:"6px 6px 0",borderRadius:8,border:"1.5px solid #bbb",overflow:"hidden",flexShrink:0}}>
            {hdr("#444","Load Order")}
            <div style={{padding:"4px 6px",background:"#fff"}}>
              {activeProds.map((p,i) => (
                <div key={p.id} draggable onDragStart={()=>setOrderDrag(p.id)} onDragOver={e=>{e.preventDefault();setOrderDragOver(p.id);}} onDragLeave={()=>setOrderDragOver(null)} onDrop={()=>handleOrderDrop(p.id)} onDragEnd={()=>{setOrderDrag(null);setOrderDragOver(null);}}
                  style={{display:"flex",alignItems:"center",gap:5,padding:"3px 5px",borderRadius:5,background:orderDragOver===p.id?"#eef3ff":"transparent",cursor:"grab",opacity:orderDrag===p.id?0.4:1,marginBottom:2}}>
                  <span style={{fontSize:10,fontWeight:600,color:"#777",minWidth:14,textAlign:"right"}}>{i+1}</span>
                  <span style={{fontSize:10,color:"#999"}}>⁇</span>
                  <span style={{fontSize:11,color:"#111",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</span>
                  <div style={{display:"flex",gap:2}}>
                    {Array.from({length:(qtys[p.id]||{}).asst||0},(_,ai) => (
                      <div key={ai} style={{width:7,height:7,borderRadius:isRect(p)?1:"50%",background:"#fff",border:"1.5px solid "+getColor(p.id,ai),boxSizing:"border-box"}}/>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{margin:"6px 6px 0",borderRadius:8,border:"1.5px solid #bbb",overflow:"hidden",flexShrink:0}}>
          {hdr("#555","Search Products")}
          <div style={{padding:"6px 8px",background:"#fff"}}>
            <input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} style={inp}/>
          </div>
        </div>

        <div style={{flex:1,overflowY:"auto",background:"#f0f0f0",paddingBottom:6}}>
          {BRANDS.map(brand => {
            const bc=BRAND_COLORS[brand];
            const bp=shown.filter(p=>p.brand===brand);
            if(!bp.length) return null;
            const bColl=collBrands.has(brand);
            const bkts={};
            bp.forEach(p=>{const b=p.bucket==="Small/Other"?"Standard Size":(p.bucket||"Standard Size");if(!bkts[b])bkts[b]=[];bkts[b].push(p);});
            return (
              <div key={brand} style={{margin:"6px 6px 0",borderRadius:8,border:"2px solid "+bc.border,overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.1)"}}>
                <div onClick={()=>tog(setCollBrands,brand)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 10px",background:bc.hdr,cursor:"pointer"}}>
                  <span style={{fontSize:13,fontWeight:700,color:bc.hdrTxt}}>{brand}</span>
                  <span style={{fontSize:14,color:bc.hdrTxt,transform:bColl?"rotate(-90deg)":"none",display:"inline-block"}}>▾</span>
                </div>
                {!bColl && Object.keys(bkts).sort().map(bucket => {
                  const bKey=brand+"|"+bucket;
                  const bkColl=collBuckets.has(bKey);
                  return (
                    <div key={bucket} style={{margin:5,borderRadius:6,border:"1px solid "+bc.border+"88",overflow:"hidden",background:bc.light}}>
                      <div onClick={()=>tog(setCollBuckets,bKey)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 10px",background:bc.bucketHdr,cursor:"pointer"}}>
                        <span style={{fontSize:12,fontWeight:700,color:bc.bucketTxt,textTransform:"uppercase"}}>{bucket}</span>
                        <span style={{fontSize:12,color:bc.bucketTxt,transform:bkColl?"rotate(-90deg)":"none",display:"inline-block"}}>▾</span>
                      </div>
                      {!bkColl && (
                        <div style={{padding:4}}>
                          {bkts[bucket].slice().sort((a,b)=>a.name.localeCompare(b.name)).map(p => {
                            const q=qtys[p.id]||{asst:0,eachArr:[]};
                            const on=q.asst>0;
                            return (
                              <div key={p.id} style={{marginBottom:3,borderRadius:6,background:on?"#e8f4fd":"#fff",border:"0.5px solid "+(on?"#90caf9":"#e0e0e0"),overflow:"hidden"}}>
                                <div style={{display:"flex",alignItems:"center",padding:"5px 6px",gap:4}}>
                                  <div style={{width:11,height:11,borderRadius:isRect(p)?2:"50%",background:"#fff",flexShrink:0,border:"1.5px solid #bbb",boxSizing:"border-box"}}/>
                                  <div style={{flex:1,minWidth:0}}>
                                    <div style={{fontSize:11,color:"#222",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
                                    <div style={{fontSize:9,color:"#888"}}>{p.l}"x{p.w}" · {p.wt?p.wt.toFixed(2)+" lbs":"-"}</div>
                                  </div>
                                  <input value={q.asst||""} onChange={e=>setAsst(p.id,e.target.value)} style={Object.assign({},inp,{width:38,textAlign:"center",padding:"3px 4px"})}/>
                                </div>
                                {on && (
                                  <div style={{borderTop:"0.5px solid #e0e0e0"}}>
                                    <div style={{display:"flex",padding:"2px 8px 2px 26px",background:"#f5f5f5",gap:4}}>
                                      <div style={{flex:1,fontSize:9,color:"#888",fontWeight:500,textTransform:"uppercase"}}>Assortment</div>
                                      <div style={{width:70,textAlign:"center",fontSize:9,color:"#888",fontWeight:500,textTransform:"uppercase"}}>Qty</div>
                                      <div style={{width:52,textAlign:"center",fontSize:9,color:"#888",fontWeight:500,textTransform:"uppercase"}}>Layers</div>
                                    </div>
                                    {(q.eachArr||[]).map((entry,ai) => {
                                      const qty=(entry&&entry.qty)||0, ly=(entry&&entry.layers)||1;
                                      return (
                                        <div key={ai} style={{display:"flex",alignItems:"center",padding:"3px 6px 3px 8px",borderTop:"0.5px solid #e8e8e8",background:"#fff",gap:4}}>
                                          <div style={{width:9,height:9,borderRadius:isRect(p)?2:"50%",background:"#fff",border:"2px solid "+getColor(p.id,ai),flexShrink:0,boxSizing:"border-box"}}/>
                                          <span style={{fontSize:10,color:"#888",flex:1,marginLeft:4}}>Asst. {al(ai)}</span>
                                          <div style={{display:"flex",alignItems:"center",gap:2,width:70,justifyContent:"center"}}>
                                            <button {...stepBtn(()=>setEntry(p.id,ai,"qty",Math.max(0,qty-1)))}>-</button>
                                            <input value={qty||""} onChange={e=>setEntry(p.id,ai,"qty",e.target.value)} style={Object.assign({},inp,{width:28,textAlign:"center",padding:"3px 2px"})}/>
                                            <button {...stepBtn(()=>setEntry(p.id,ai,"qty",qty+1))}>+</button>
                                          </div>
                                          <div style={{display:"flex",alignItems:"center",gap:2,width:52,justifyContent:"center"}}>
                                            <button {...stepBtn(()=>setEntry(p.id,ai,"layers",Math.max(1,ly-1)))}>-</button>
                                            <input value={ly} onChange={e=>setEntry(p.id,ai,"layers",e.target.value)} style={Object.assign({},inp,{width:22,textAlign:"center",padding:"3px 2px"})}/>
                                            <button {...stepBtn(()=>setEntry(p.id,ai,"layers",ly+1))}>+</button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          <button onClick={()=>setAddOpen(true)} style={{width:"100%",padding:4,border:"0.5px dashed "+bc.border,borderRadius:4,background:"transparent",color:bc.bucketHdr,fontSize:10,cursor:"pointer",marginTop:2}}>+ Add custom product</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div style={{margin:6,borderRadius:8,border:"1.5px solid #bbb",overflow:"hidden",flexShrink:0}}>
          {hdr("#333",active.name+" · "+totalPerLayer+" items")}
          <div style={{padding:"6px 8px",background:"#fff"}}>
            {selProd&&selPl ? (
              <div style={{padding:"4px 7px",borderRadius:6,fontSize:10,display:"flex",alignItems:"center",justifyContent:"space-between",background:"#e3f2fd",border:"0.5px solid #90caf9",color:"#1565c0"}}>
                <div style={{display:"flex",alignItems:"center",gap:5,overflow:"hidden",flex:1}}>
                  <div style={{width:9,height:9,borderRadius:isRect(selProd)?2:"50%",background:"#fff",border:"2px solid "+getColor(selPl.pid,selPl.ai),flexShrink:0,boxSizing:"border-box"}}/>
                  <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{selProd.name} · {al(selPl.ai)} · {selPl.layers||1}L</span>
                </div>
                <button onClick={()=>removeItem(selectedId)} style={{marginLeft:6,padding:"1px 5px",border:"0.5px solid #e57373",borderRadius:3,background:"#ffebee",color:"#c62828",cursor:"pointer",fontSize:9}}>Remove</button>
              </div>
            ) : (
              <div style={{fontSize:10,color:"#888",textAlign:"center"}}>Select item · arrows nudge · Del removes · Esc clears</div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"6px 10px",background:"#fff",borderBottom:"0.5px solid #e0e0e0",display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
          {!showTotal && tbtn("Auto-arrange",autoArr,totalPerLayer===0,false)}
          {!showTotal&&validPls.length>0 && (
            <button onClick={saveShelf} style={{padding:"5px 10px",border:"0.5px solid "+(hasChanges?"#f0ad4e":isSaved?"#81c784":"#ccc"),borderRadius:6,background:hasChanges?"#fff8e1":isSaved?"#e8f5e9":"#f5f5f5",color:hasChanges?"#9a6700":isSaved?"#2e7d32":"#333",cursor:"pointer",fontSize:11,fontWeight:hasChanges?600:400}}>
              {hasChanges?"Update Shelf":isSaved?"Shelf Saved":"Save Shelf"}
            </button>
          )}
          {!showTotal&&shelves.some(s=>(s.pls||[]).filter(p=>!p.invalid).length>0) && tbtn("Save All",saveAll,false,false)}
          {tbtn(snapEnabled?"Snap on":"Free drag",()=>setSnapEnabled(s=>!s),false,snapEnabled)}
          {tbtn("Export XLSX",exportXLSX,!xlsxReady||!savedShelves.length,false)}
          {tbtn("Export PDF",exportPDF,!pdfReady||!savedShelves.length,false)}
          {tbtn("Export Layout",exportJSON,false,false)}
          <label style={{padding:"5px 10px",border:"0.5px solid #ccc",borderRadius:6,background:"#f5f5f5",color:"#333",cursor:"pointer",fontSize:11,fontWeight:500,display:"inline-flex",alignItems:"center"}}>
            Import Layout<input type="file" accept=".json" onChange={importJSON} style={{display:"none"}}/>
          </label>
          <div style={{flex:1}}/>
          {!showTotal && <span style={{fontSize:10,color:"#888"}}>{active.shape==="oval"?"Basket":"Tray"} · {outer.l}x{outer.w} outer</span>}
          <button onClick={clearWS} style={{padding:"5px 8px",border:"0.5px solid "+(resetPend?"#e57373":"#f5c6cb"),borderRadius:6,background:resetPend?"#ffebee":"#fff5f5",color:"#c0392b",cursor:"pointer",fontSize:10}}>{resetPend?"Confirm?":"Reset"}</button>
        </div>

        <div style={{display:"flex",alignItems:"stretch",background:"#fff",borderBottom:"0.5px solid #e0e0e0",overflowX:"auto",flexShrink:0}}>
          {shelves.map((sh,i) => {
            const on=i===idx&&!showTotal;
            return (
              <div key={sh.id} draggable onDragStart={()=>setShelfDrag(sh.id)} onDragOver={e=>{e.preventDefault();setShelfDragOver(sh.id);}} onDragLeave={()=>setShelfDragOver(null)} onDrop={()=>handleShelfDrop(sh.id)} onDragEnd={()=>{setShelfDrag(null);setShelfDragOver(null);}}
                onClick={()=>{setActiveIdx(i);setShowTotal(false);setSelectedId(null);}}
                style={{display:"flex",alignItems:"center",padding:"0 6px 0 10px",borderRight:"0.5px solid #e0e0e0",borderBottom:on?"2px solid #333":"2px solid transparent",background:shelfDragOver===sh.id?"#eef3ff":on?"#f5f5f5":"transparent",cursor:"grab",gap:4}}>
                {editingShelf===sh.id ? (
                  <input autoFocus value={sh.name} onChange={e=>setShelves(p=>p.map((s,j)=>j===i?Object.assign({},s,{name:e.target.value}):s))} onBlur={()=>setEditingShelf(null)} onKeyDown={e=>{if(e.key==="Enter")setEditingShelf(null);}} style={{fontSize:11,border:"0.5px solid #ccc",borderRadius:3,padding:"1px 4px",width:82,outline:"none"}}/>
                ) : (
                  <span onDoubleClick={e=>{e.stopPropagation();setEditingShelf(sh.id);}} style={{fontSize:11,fontWeight:on?500:400,color:on?"#222":"#666",padding:"8px 0",whiteSpace:"nowrap"}}>
                    {sh.name}{savedShelves.some(s=>s.shelfId===sh.id)&&<span style={{marginLeft:3,fontSize:9,color:"#2e7d32"}}>✓</span>}
                  </span>
                )}
                <span style={{fontSize:10,color:"#bbb"}}>⁇</span>
                <button title="Duplicate" onClick={e=>{e.stopPropagation();copyShelf(i);}} style={{width:14,height:14,border:"none",background:"transparent",color:"#bbb",cursor:"pointer",fontSize:11,padding:0}}>⊡</button>
                {shelves.length>1 && <button onClick={e=>{e.stopPropagation();removeShelf(i);}} style={{width:14,height:14,border:"none",background:"transparent",color:"#bbb",cursor:"pointer",fontSize:12,padding:0}}>×</button>}
              </div>
            );
          })}
          <button onClick={addShelf} style={{padding:"0 10px",border:"none",background:"transparent",color:"#aaa",cursor:"pointer",fontSize:18}}>+</button>
          <button onClick={()=>setShowTotal(true)} style={{margin:"4px 8px",padding:"5px 10px",border:"0.5px solid "+(showTotal?"#4361ee":"#ccc"),borderRadius:6,background:showTotal?"#eef0ff":"#f5f5f5",color:showTotal?"#4361ee":"#333",cursor:"pointer",fontSize:11,fontWeight:500,whiteSpace:"nowrap"}}>Summary</button>
        </div>

        {!showTotal&&invalidPls.length>0 && <div style={{padding:"5px 12px",background:"#fff8e1",borderBottom:"0.5px solid #ffe082",fontSize:10,color:"#f57f17"}}><b>{invalidPls.length}</b> item{invalidPls.length>1?"s":""} did not fit and were not placed</div>}
        {!showTotal&&wtOver && <div style={{padding:"5px 12px",background:"#ffebee",borderBottom:"0.5px solid #ef9a9a",fontSize:10,color:"#c62828"}}>Weight limit exceeded — {activeWt.toFixed(2)} lbs of {wtLim} lbs</div>}

        <div style={{flex:1,overflowY:"auto",padding:20,display:"flex",flexDirection:"column",gap:18,alignItems:"center"}}>
          {showTotal ? (
            !savedShelves.length ? (
              <div style={{textAlign:"center",color:"#999",marginTop:80}}>
                <div style={{fontSize:30,opacity:0.3,marginBottom:10}}>Σ</div>
                <div style={{fontSize:13}}>No shelves saved yet.</div>
                <div style={{fontSize:11,marginTop:4,color:"#aaa"}}>Use <b>Save Shelf</b> or <b>Save All</b> to add them here.</div>
              </div>
            ) : (
              <div style={{width:"100%",maxWidth:820,display:"flex",flexDirection:"column",gap:16}}>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                  {[["Shelves",savedShelves.length],["Products",totalData.byProd.length],["Units",totalData.grandQty],["Weight",totalData.grandWt.toFixed(2)+" lbs"]].map(o=>(
                    <div key={o[0]} style={{background:"#f5f5f5",borderRadius:8,padding:10,textAlign:"center"}}>
                      <div style={{fontSize:9,color:"#888",marginBottom:4,textTransform:"uppercase"}}>{o[0]}</div>
                      <div style={{fontSize:16,fontWeight:600,color:gOver&&o[0]==="Weight"?"#c0392b":"#222"}}>{o[1]}</div>
                    </div>
                  ))}
                </div>
                {savedShelves.map(sh => {
                  const vp=(sh.pls||[]).filter(p=>!p.invalid);
                  const grp={};
                  vp.forEach(pl=>{const k=pl.pid+"|"+pl.ai;if(!grp[k])grp[k]={c:0,ly:pl.layers||1,pid:pl.pid,ai:pl.ai};grp[k].c++;});
                  const o=sh.outer||{};
                  return (
                    <div key={sh.shelfId} style={{background:"#fff",borderRadius:8,border:"0.5px solid #e0e0e0",overflow:"hidden"}}>
                      <div style={{padding:"8px 12px",borderBottom:"0.5px solid #e0e0e0",background:"#f5f5f5",fontSize:11,fontWeight:600}}>
                        {sh.name}<span style={{fontSize:9,color:"#888",fontWeight:400}}> · {sh.shape==="oval"?"Basket":"Tray"} · {o.l||"?"}x{o.w||"?"} outer / {sh.tray?sh.tray.l:"?"}x{sh.tray?sh.tray.w:"?"} inner · {sh.savedAt}</span>
                      </div>
                      <div style={{padding:"20px 12px 24px",display:"flex",justifyContent:"center"}}>
                        <Thumb sh={sh} allProds={allProds} maxW={620} maxH={230}/>
                      </div>
                      <table style={{width:"100%",borderCollapse:"collapse"}}>
                        <thead><tr>{["Product","Asst.","Rows","Layers","Total","Unit wt","Total wt"].map(h=>(<th key={h} style={Object.assign({},hcell,{textAlign:h==="Product"?"left":"right"})}>{h}</th>))}</tr></thead>
                        <tbody>
                          {Object.keys(grp).map((k,i)=>{
                            const g=grp[k]; const p=allProds.find(x=>x.id===g.pid); if(!p) return null;
                            const col=(sh.colorMap||{})[k]||PALETTE[i%PALETTE.length];
                            return (
                              <tr key={k} style={{background:i%2?"#fafafa":"transparent"}}>
                                <td style={cell}><span style={{display:"inline-flex",alignItems:"center",gap:6}}><span style={{width:9,height:9,borderRadius:isRect(p)?2:"50%",background:"#fff",border:"2px solid "+col,boxSizing:"border-box",display:"inline-block"}}/>{p.name}</span></td>
                                <td style={Object.assign({},cell,{textAlign:"right"})}>{al(g.ai)}</td>
                                <td style={Object.assign({},cell,{textAlign:"right"})}>{g.c}</td>
                                <td style={Object.assign({},cell,{textAlign:"right"})}>{g.ly}</td>
                                <td style={Object.assign({},cell,{textAlign:"right",fontWeight:500})}>{g.c*g.ly}</td>
                                <td style={Object.assign({},cell,{textAlign:"right",color:"#888"})}>{p.wt?p.wt.toFixed(2):"-"}</td>
                                <td style={Object.assign({},cell,{textAlign:"right",fontWeight:500})}>{p.wt?(p.wt*g.c*g.ly).toFixed(2):"-"}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
                <div style={{background:"#fff",borderRadius:8,border:"0.5px solid #e0e0e0",overflow:"hidden"}}>
                  <div style={{padding:"8px 12px",borderBottom:"0.5px solid #e0e0e0",background:"#f5f5f5",fontSize:11,fontWeight:600}}>Product totals — all saved shelves</div>
                  <table style={{width:"100%",borderCollapse:"collapse"}}>
                    <thead><tr>{["Product","Units","Unit wt","Total wt"].map(h=>(<th key={h} style={Object.assign({},hcell,{textAlign:h==="Product"?"left":"right"})}>{h}</th>))}</tr></thead>
                    <tbody>
                      {totalData.byProd.map((r,i)=>(
                        <tr key={r.name} style={{background:i%2?"#fafafa":"transparent"}}>
                          <td style={cell}>{r.name}</td>
                          <td style={Object.assign({},cell,{textAlign:"right",fontWeight:500})}>{r.totalQty}</td>
                          <td style={Object.assign({},cell,{textAlign:"right",color:"#888"})}>{r.unitWt?r.unitWt.toFixed(2):"-"}</td>
                          <td style={Object.assign({},cell,{textAlign:"right",fontWeight:500})}>{r.totalWt?r.totalWt.toFixed(2):"-"}</td>
                        </tr>
                      ))}
                      <tr style={{background:"#f5f5f5",borderTop:"1px solid #ddd"}}>
                        <td style={Object.assign({},cell,{fontWeight:600})}>Grand total</td>
                        <td style={Object.assign({},cell,{textAlign:"right",fontWeight:600})}>{totalData.grandQty}</td>
                        <td style={cell}></td>
                        <td style={Object.assign({},cell,{textAlign:"right",fontWeight:600,color:gOver?"#c0392b":"#222"})}>{totalData.grandWt.toFixed(2)}{gLim?" / "+gLim:""}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )
          ) : !validPls.length ? (
            <div style={{textAlign:"center",color:"#999",marginTop:60}}>
              <div style={{width:52,height:38,border:"2px solid #ccc",borderRadius:active.shape==="oval"?"50%":6,margin:"0 auto 14px",background:"#fff"}}/>
              <div style={{fontSize:13,lineHeight:1.7,color:"#888"}}>Set assortments and quantities,<br/>then click <b>Auto-arrange</b></div>
              <div style={{fontSize:11,marginTop:8,color:"#aaa"}}>Inner usable area: {tray.l}" x {tray.w}"</div>
            </div>
          ) : (
            <>
              <div ref={wrapRef} tabIndex={0} style={{background:"#fff",borderRadius:8,padding:"12px 34px 30px",border:"0.5px solid #e0e0e0",display:"flex",flexDirection:"column",alignItems:"center",gap:10,outline:"none"}}>
                <div style={{fontSize:10,color:"#888",textAlign:"center"}}>{active.name} · drag to move · arrows nudge · Del removes</div>
                <Canvas shelf={active} allProds={allProds} colorMap={colorMap} selectedId={selectedId} onSelect={setSelectedId} onMove={moveItem} snapEnabled={snapEnabled}/>
              </div>
              {legend.length>0 && (
                <div style={{width:"100%",maxWidth:540,background:"#fff",borderRadius:8,border:"0.5px solid #e0e0e0",padding:"8px 12px"}}>
                  <div style={{fontSize:9,color:"#888",fontWeight:600,textTransform:"uppercase",letterSpacing:0.5,marginBottom:6}}>Legend</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"5px 16px"}}>
                    {legend.map(o=>(
                      <div key={o.key} style={{display:"flex",alignItems:"center",gap:6}}>
                        <span style={{width:11,height:11,borderRadius:isRect(o.prod)?2:"50%",background:"#fff",border:"2px solid "+o.color,boxSizing:"border-box",display:"inline-block"}}/>
                        <span style={{fontSize:10,color:"#444"}}>{o.prod.name} · <b>{al(o.ai)}</b></span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {summaryRows.length>0 && (
                <div style={{width:"100%",maxWidth:540,background:"#fff",borderRadius:8,border:"0.5px solid #e0e0e0",overflow:"hidden"}}>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",padding:"8px 12px",borderBottom:"0.5px solid #e0e0e0",background:"#f5f5f5"}}>
                    {[["Columns",(active.layoutStats||{}).cols||"-"],["Positions",validPls.length],["Units",summaryRows.reduce((s,r)=>s+r.total,0)],["Weight",activeWt.toFixed(2)+" lbs"]].map(o=>(
                      <div key={o[0]} style={{textAlign:"center"}}>
                        <div style={{fontSize:9,color:"#888",marginBottom:2}}>{o[0]}</div>
                        <div style={{fontSize:15,fontWeight:600,color:wtOver&&o[0]==="Weight"?"#c0392b":"#222"}}>{o[1]}</div>
                      </div>
                    ))}
                  </div>
                  <table style={{width:"100%",borderCollapse:"collapse"}}>
                    <thead><tr>{["Product","Asst.","Rows","Layers","Total","Unit wt","Total wt"].map(h=>(<th key={h} style={Object.assign({},hcell,{textAlign:h==="Product"?"left":"right"})}>{h}</th>))}</tr></thead>
                    <tbody>
                      {summaryRows.map((r,i)=>(
                        <tr key={r.key} style={{background:i%2?"#fafafa":"transparent"}}>
                          <td style={cell}><span style={{display:"inline-flex",alignItems:"center",gap:6}}><span style={{width:9,height:9,borderRadius:isRect(r.prod)?2:"50%",background:"#fff",border:"2px solid "+r.color,boxSizing:"border-box",display:"inline-block"}}/>{r.name}</span></td>
                          <td style={Object.assign({},cell,{textAlign:"right"})}>{al(r.ai)}</td>
                          <td style={Object.assign({},cell,{textAlign:"right"})}>{r.rows}</td>
                          <td style={Object.assign({},cell,{textAlign:"right"})}>{r.layers}</td>
                          <td style={Object.assign({},cell,{textAlign:"right",fontWeight:500})}>{r.total}</td>
                          <td style={Object.assign({},cell,{textAlign:"right",color:"#888"})}>{r.unitWt?r.unitWt.toFixed(2):"-"}</td>
                          <td style={Object.assign({},cell,{textAlign:"right",fontWeight:500})}>{r.totalWt?r.totalWt.toFixed(2):"-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {addOpen && (
        <div onClick={()=>setAddOpen(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:10,padding:18,width:262}}>
            <div style={{fontSize:13,fontWeight:600,marginBottom:12}}>Add custom product</div>
            {[["name","Product name"],["cat","Category"],["l","Length (in)"],["w","Width (in)"],["wt","Weight (lbs)"]].map(o=>(
              <input key={o[0]} placeholder={o[1]} value={cf[o[0]]} onChange={e=>setCf(p=>Object.assign({},p,{[o[0]]:e.target.value}))} style={Object.assign({},inp,{marginBottom:6})}/>
            ))}
            <select value={cf.brand} onChange={e=>setCf(p=>Object.assign({},p,{brand:e.target.value}))} style={Object.assign({},inp,{marginBottom:10})}>
              {BRANDS.map(b=>(<option key={b} value={b}>{b}</option>))}
            </select>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <button onClick={()=>setAddOpen(false)} style={{padding:"5px 12px",border:"0.5px solid #ccc",borderRadius:6,background:"transparent",color:"#888",cursor:"pointer",fontSize:12}}>Cancel</button>
              <button onClick={()=>{
                if(!cf.name||!cf.l||!cf.w) return;
                setCustom(p=>p.concat([{id:"c_"+Date.now(),name:cf.name,cat:cf.cat||"Custom",brand:cf.brand||"Bath & Body",bucket:"Standard Size",l:parseFloat(cf.l),w:parseFloat(cf.w),wt:parseFloat(cf.wt)||0}]));
                setCf({name:"",cat:"Custom",brand:"Bath & Body",l:"",w:"",wt:""});
                setAddOpen(false);
              }} style={{padding:"5px 14px",border:"0.5px solid #ccc",borderRadius:6,background:"#f5f5f5",color:"#222",cursor:"pointer",fontSize:12,fontWeight:500}}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
