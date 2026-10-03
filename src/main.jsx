import React, {useEffect, useMemo, useState} from "react";
import {createRoot} from "react-dom/client";
import {AnimatePresence, motion} from "framer-motion";
import {ArrowLeft, ArrowRight, Check, Heart, ImagePlus, Lock, Mail, Sparkles, X} from "lucide-react";
import "./styles.css";

/* =========================
   PERSONALIZE THIS
========================= */
const ME = "Tanish";
const HER = "Isha"; // 
const REQUEST = "Will you come on this Little Adventure with me?"; 

const intro = {
  title: `Hey ${HER},`,
  subtitle: "I made you a tiny little thing.",
  body: "Not because a normal text wasn't enough… but because you're not exactly a normal friend. ♡"
};

const promises = [
  "I will always make time for our stupid conversations.",
  "I will always show up when matters.",
  "Always Split the Last Slice."
];

const defaultPhotos = [
  {emoji:"🫶🏻", label:"our chaos"},
  {emoji:"🌷", label:"our comfort"},
  {emoji:"🎀", label:"our memories"}
];

function App(){
  const [page,setPage] = useState(0);
  const [photos,setPhotos] = useState(defaultPhotos);
  // Each row is one easy-to-recognize emoji family: flowers, animals, hearts.
  // Start with three simple swaps, one in each themed row.
  const [puzzle,setPuzzle] = useState([1,0,2,4,3,5,7,6,8]);
  const [selectedTile,setSelectedTile] = useState(null);
  const [puzzleSolved,setPuzzleSolved] = useState(false);
  const [envelopeOpen,setEnvelopeOpen] = useState(false);
  const [checks,setChecks] = useState([]);
  const [signed,setSigned] = useState(false);
  const [answer,setAnswer] = useState(null);
  const [showSparkles,setShowSparkles] = useState(false);

  const go=(n)=>setPage(Math.max(0,Math.min(5,n)));

  useEffect(()=>{
    if(page===2 && !puzzleSolved) shuffle();
  },[page]);

  function shuffle(){
    // Reset to the same easy one-swap puzzle instead of scrambling every row.
    setPuzzle([1,0,2,4,3,5,7,6,8]);
    setSelectedTile(null);
    setPuzzleSolved(false);
    setShowSparkles(false);
  }

  function moveTile(i){
    if(puzzleSolved) return;

    // Tap one emoji, then tap another to swap their positions.
    if(selectedTile === null){
      setSelectedTile(i);
      return;
    }
    if(selectedTile === i){
      setSelectedTile(null);
      return;
    }

    const next=[...puzzle];
    [next[selectedTile],next[i]]=[next[i],next[selectedTile]];
    setPuzzle(next);
    setSelectedTile(null);

    if(next.every((value,index)=>value===index)){
      setPuzzleSolved(true);
      setShowSparkles(true);
    }
  }

  function upload(i,e){
    const file=e.target.files?.[0]; if(!file)return;
    const url=URL.createObjectURL(file);
    setPhotos(p=>p.map((x,k)=>k===i?{...x,image:url}:x));
  }

  function toggle(i){
    setChecks(c=>c.includes(i)?c.filter(x=>x!==i):[...c,i]);
  }

  const progress = page/5*100;

  useEffect(() => {
    window.__page = page;
  }, [page]);

  return <div className="stage">
    <div className="grain"/>
    <div className="blush b1"/><div className="blush b2"/>
    <div className="browser-frame">
      <div className="browser-top">
        <div className="traffic"><i/><i/><i/></div>
        <div className="url-pill"><Lock size={10}/> a-little-surprise.com</div>
        <div className="browser-dot"/>
      </div>
      <div className="progress"><motion.div animate={{width:`${Math.max(6,progress)}%`}}/></div>

      <div className="site">
        <AnimatePresence mode="wait">
          {page===0 && <Intro key="0" go={go}/>}
          {page===1 && <Gallery key="1" photos={photos} upload={upload} go={go}/>}
          {page===2 && <Puzzle key="2" tiles={puzzle} solved={puzzleSolved} selectedTile={selectedTile} move={moveTile} shuffle={shuffle} go={go}/>}
          {page===3 && <Envelope key="3" open={envelopeOpen} setOpen={setEnvelopeOpen} go={go}/>}
          {page===4 && <Promises key="4" checks={checks} toggle={toggle} signed={signed} setSigned={setSigned} go={go}/>}
          {page===5 && <Final key="5" answer={answer} setAnswer={setAnswer} go={go}/>}
        </AnimatePresence>
      </div>
    </div>

    <AnimatePresence>
      {showSparkles && <Celebration close={()=>setShowSparkles(false)}/>}
    </AnimatePresence>
  </div>
}

function Layout({children,go,back=true}){
  return <motion.main className="screen"
    initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-18}}
    transition={{duration:.42,ease:[.22,1,.36,1]}}>
    {back && <button className="back" onClick={()=>go(Math.max(0,window.__page-1))}><ArrowLeft size={15}/> back</button>}
    {children}
  </motion.main>
}

function Intro({go}){
  return <Layout go={go} back={false}>
    <div className="tiny-label">✦ SOMETHING I MADE FOR YOU ✦</div>
    <div className="hero-badge"><div className="badge-inner"><Heart size={30} fill="currentColor"/></div></div>
    <h1>{intro.title}<br/><em>{intro.subtitle}</em></h1>
    <p className="body">{intro.body}</p>
    <div className="hero-card">
      <span>01</span><div><b>A tiny surprise</b><small>6 little moments · 1 very important question</small></div><Heart size={16}/>
    </div>
    <button className="orange-btn" onClick={()=>go(1)}>Take the little tour <ArrowRight size={17}/></button>
    <p className="micro">made with ♡ by {ME}</p>
  </Layout>
}

function Gallery({photos,upload,go}){
  return <Layout go={go}>
    <div className="tiny-label">FIRST, YOUR FRIENDSHIP DESERVES A FRAME.</div>
    <h2>Our <em>photos.</em></h2>
    <p className="body">You can add your own photos here. I wanted this part to feel like a tiny scrapbook.</p>
    <div className="photos">
      {photos.map((p,i)=><label className={`photo p${i}`} key={i}>
        <input type="file" accept="image/*" onChange={e=>upload(i,e)}/>
        <div className="photo-img">{p.image?<img src={p.image}/>:<><span>{p.emoji}</span><ImagePlus size={16}/><small>add a photo</small></>}</div>
        <b>{p.label}</b>
      </label>)}
    </div>
    <div className="hint"><Sparkles size={14}/> tap any card to personalize it</div>
    <button className="orange-btn" onClick={()=>go(2)}>Next little thing <ArrowRight size={17}/></button>
  </Layout>
}

function Puzzle({tiles,solved,selectedTile,move,shuffle,go}){
  const emojis=["🌸","🌷","🌹","🧸","🐻","🐰","💗","💕","💖"];
  return <Layout go={go}>
    <div className="tiny-label">A TINY EMOJI PUZZLE ✦</div>
    <h2>Put the <em>cuties in order.</em></h2>
    <p className="body">Each row has its own theme: flowers first, cute animals second, hearts last. Tap one emoji, then another to swap them. Three little swaps to make! ♡</p>
    <div className={`puzzle ${solved?"solved":""}`}>
      {tiles.map((t,i)=><button
        key={i}
        className="tile"
        onClick={()=>move(i)}
        aria-label={`Emoji ${emojis[t]}`}
        aria-pressed={selectedTile===i}
        style={{
          outline:selectedTile===i?"3px solid #d97757":undefined,
          outlineOffset:selectedTile===i?"2px":undefined,
          transform:selectedTile===i?"scale(1.06)":undefined,
          boxShadow:selectedTile===i?"0 0 0 5px rgba(217,119,87,.16)":undefined,
          transition:"transform .16s ease, box-shadow .16s ease, outline .16s ease"
        }}
      >
        <span>{emojis[t]}</span>
      </button>)}
    </div>
    <div className="hint"><Sparkles size={14}/> {solved?"Perfect! Flowers, cuties, then hearts.":"Flowers 🌸 → animals 🧸 → hearts 💗"}</div>
    {solved?<div className="success-line"><Check size={15}/> perfect order. you passed.</div>:<button className="text-btn" onClick={shuffle}>reset the easy puzzle</button>}
    <button className="orange-btn puzzle-next" disabled={!solved} onClick={()=>go(3)}>{solved?"Continue to the letter":"Solve the puzzle to continue"} <ArrowRight size={17}/></button>
  </Layout>
}

function Envelope({open,setOpen,go}){
  return <Layout go={go}>
    <div className="tiny-label">A LETTER, SEALED JUST FOR YOU.</div>
    <h2>Something I <em>wrote.</em></h2>
    {!open ? <>
      <p className="body">Okay, this is where I stop pretending I am not being dramatic.</p>
      <motion.button className="envelope" whileHover={{y:-7}} whileTap={{scale:.98}} onClick={()=>setOpen(true)}>
        <div className="env-back"/>
        <div className="env-flap"/>
        <div className="seal"><Heart size={22} fill="currentColor"/></div>
        <span>open me</span>
      </motion.button>
      <p className="micro">tap the little seal ♡</p>
    </>:<>
      <motion.article className="letter" initial={{y:25,opacity:0}} animate={{y:0,opacity:1}}>
        <div className="letter-head">A LETTER FOR {HER.toUpperCase()}</div>
        <h3>Dear {HER},</h3>
        <p>Some friendships happen quietly. Then one day you realise that this person has somehow become part of your normal.</p>
        <p>You're one of those people for me. The random conversations, the nonsense, the serious talks, the little memories — I genuinely wouldn't trade them.</p>
        <p>So yes, I made a whole website instead of just sending a message. Is that excessive? Absolutely. Do I regret it? Not even slightly.</p>
        <p className="sign">— {ME} ♡</p>
      </motion.article>
      <button className="orange-btn" onClick={()=>go(4)}>There's one more part <ArrowRight size={17}/></button>
    </>}
  </Layout>
}

function Promises({checks,toggle,signed,setSigned,go}){
  const all=checks.length===promises.length;
  return <Layout go={go}>
    <div className="tiny-label">TICK EACH PROMISE, THEN SIGN.</div>
    <h2>Okay, <em>one thing.</em></h2>
    <p className="body">No giant speech. Just a few things I want you to know.</p>
    <div className="promise-box">
      {promises.map((x,i)=><button key={x} className={checks.includes(i)?"promise checked":"promise"} onClick={()=>toggle(i)}>
        <span className="num">{i+1}</span><span>{x}</span><span className="box">{checks.includes(i)?<Check size={13}/>:null}</span>
      </button>)}
    </div>
    {!signed ? <button className="signature" disabled={!all} onClick={()=>setSigned(true)}>
      <span>Tap to sign</span><b>{all?"♡":"locked"}</b>
    </button> :
      <motion.div className="signed" initial={{scale:.8,opacity:0}} animate={{scale:1,opacity:1}}>
        <span>signed with love</span><strong>{HER} ♡</strong>
      </motion.div>}
    <button className="orange-btn" disabled={!signed} onClick={()=>go(5)}>The actual question <ArrowRight size={17}/></button>
  </Layout>
}

function Final({answer,setAnswer,go}){
  if(answer==="yes") return <Layout go={go}><div className="final yes-final">
    <div className="giant-heart"><Heart size={64} fill="currentColor"/></div>
    <div className="tiny-label">ANSWER RECEIVED ✦</div>
    <h2>Okay… <em>you said yes.</em></h2>
    <p className="body">I knew I liked you for a reason. 😂<br/>Now screenshot this. I need evidence.</p>
    <div className="receipt"><span>OFFICIAL RECORD</span><b>Bestie request: ACCEPTED ✓</b><small>Filed forever under “things that made {ME} smile.”</small></div>
  </div></Layout>;

  if(answer==="maybe") return <Layout go={go}><div className="final">
    <div className="maybe">🥹</div><div className="tiny-label">NO PRESSURE.</div>
    <h2>Take your <em>time.</em></h2>
    <p className="body">The friendship clause remains completely valid. ♡</p>
    <button className="orange-btn" onClick={()=>setAnswer(null)}>Okay, let me answer</button>
  </div></Layout>;

  return <Layout go={go}>
    <div className="tiny-label">THE IMPORTANT PART.</div>
    <div className="question-heart"><Heart size={42} fill="currentColor"/></div>
    <h2>{REQUEST}</h2>
    <p className="body">No tricks. No pressure. Just a very cute website asking a very real question. ♡</p>
    <div className="answers">
      <button className="orange-btn" onClick={()=>setAnswer("yes")}>YES, obviously 🥹</button>
      <button className="cream-btn" onClick={()=>setAnswer("maybe")}>let me think… 🙈</button>
    </div>
    <p className="micro">P.S. I spent an unreasonable amount of time making this.</p>
  </Layout>
}

function Celebration({close}){
  return <motion.div className="celebration" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={close}>
    {Array.from({length:34},(_,i)=><i key={i} style={{"--x":Math.random()*100,"--d":Math.random()*1.5}}>{i%3===0?"♥":"✦"}</i>)}
    <div className="celebrate-card"><Sparkles/><b>YOU DID IT ✦</b><small>the friendship photo has been restored</small><button>continue</button></div>
  </motion.div>
}

createRoot(document.getElementById("root")).render(<App/>);
