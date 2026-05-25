import { useState, useEffect } from "react";
import { supabase } from "./supabase";

const BRAND = {
  navy:"#0A1628", navyMid:"#112240", navyLight:"#1B3A6B",
  gold:"#C9A84C", goldLight:"#E8C96B", white:"#FFFFFF",
  offWhite:"#F4F6FA", mist:"#E8EDF5", slate:"#6B7FA3", danger:"#E05A5A",
};

const PERSONALITIES = {
  INTJ:{ title:"Architect",   group:"Analyst",   emoji:"🏛️", summary:"Imaginative and strategic thinkers with a plan for everything.", strengths:["Strategic planning","Independent thinking","High standards","Decisive"], communication:"Prefers direct, logical communication. Values efficiency and depth over small talk.", watchouts:["Can appear cold or distant","May dismiss emotional factors","Perfectionism can slow progress"], creativeSummary:"The chess grandmaster who already sees the endgame. Quiet, precise, and always three moves ahead." },
  INTP:{ title:"Logician",    group:"Analyst",   emoji:"🔬", summary:"Innovative inventors with an unquenchable thirst for knowledge.", strengths:["Analytical thinking","Creative problem solving","Objectivity","Open-mindedness"], communication:"Thoughtful and precise. May pause before responding to think things through.", watchouts:["Can overthink decisions","May struggle with routine tasks","Communication can seem detached"], creativeSummary:"The inventor who disappears down rabbit holes and resurfaces with breakthroughs. Unconventional, brilliant, delightfully weird." },
  ENTJ:{ title:"Commander",   group:"Analyst",   emoji:"⚡",  summary:"Bold, imaginative leaders who always find a way — or make one.", strengths:["Strategic leadership","Decisive action","Confidence","Goal-oriented"], communication:"Direct, assertive, and efficient. Gets to the point fast.", watchouts:["Can be domineering","May not slow down for others","Impatience with inefficiency"], creativeSummary:"Strategic, direct, and always three steps ahead. Best suited for a song with confident boss-energy and a strong hook." },
  ENTP:{ title:"Debater",     group:"Analyst",   emoji:"💡", summary:"Smart and curious thinkers who cannot resist an intellectual challenge.", strengths:["Creative brainstorming","Adaptability","Persuasion","Big-picture thinking"], communication:"Energetic, witty, and loves debate. Enjoys exploring all angles.", watchouts:["Can argue for sport","May lose interest once challenge is solved","Follow-through can be inconsistent"], creativeSummary:"The ideas machine who turns every meeting into a brainstorm. Give them a whiteboard and stand back." },
  INFJ:{ title:"Advocate",    group:"Diplomat",  emoji:"🌿", summary:"Quiet and mystical, yet inspiring and tireless idealists.", strengths:["Deep empathy","Vision","Integrity","Creative insight"], communication:"Thoughtful and meaningful. Values authentic, one-on-one connection.", watchouts:["Can take on too much emotionally","Perfectionistic tendencies","May avoid necessary conflict"], creativeSummary:"The quiet visionary with depth you can't quite measure. Their ideas arrive fully formed, like they downloaded them from the universe." },
  INFP:{ title:"Mediator",    group:"Diplomat",  emoji:"🌸", summary:"Poetic, kind, and altruistic people, always eager to help a good cause.", strengths:["Creativity","Empathy","Authenticity","Passion"], communication:"Expressive and personal. Connects through stories and shared values.", watchouts:["Can be overly idealistic","May struggle with criticism","Difficulty with conflict"], creativeSummary:"The soulful creative who turns a brief into poetry. Deeply passionate, occasionally in their own world, always worth listening to." },
  ENFJ:{ title:"Protagonist", group:"Diplomat",  emoji:"🌟", summary:"Charismatic and inspiring leaders who mesmerise their listeners.", strengths:["Charisma","Empathy","Collaboration","Inspiration"], communication:"Warm, engaging, and deeply people-focused. Makes everyone feel heard.", watchouts:["May overextend helping others","Can be too idealistic","Difficulty saying no"], creativeSummary:"The team's heart and hype person rolled into one. Remembers everyone's birthday, champions every idea, and somehow makes it all happen." },
  ENFP:{ title:"Campaigner",  group:"Diplomat",  emoji:"🎨", summary:"Enthusiastic, creative, and sociable free spirits who can always find a reason to smile.", strengths:["Creativity","Enthusiasm","People skills","Adaptability"], communication:"Energetic, expressive, and warm. Loves connecting ideas and people.", watchouts:["Can lose focus","May struggle with follow-through","Emotionally sensitive to criticism"], creativeSummary:"A walking mood board who makes every campaign feel like a movement. Big ideas, bigger energy, absolutely impossible not to love." },
  ISTJ:{ title:"Logistician", group:"Sentinel",  emoji:"📋", summary:"Practical and fact-minded individuals whose reliability cannot be doubted.", strengths:["Reliability","Attention to detail","Organisation","Dedication"], communication:"Clear, factual, and structured. Prefers written communication for complex topics.", watchouts:["Can be inflexible to change","May struggle with ambiguity","Overly cautious at times"], creativeSummary:"The one who actually reads the brief and delivers it perfectly. Unsung hero energy. The team falls apart without them." },
  ISFJ:{ title:"Defender",    group:"Sentinel",  emoji:"🛡️", summary:"Very dedicated and warm protectors, always ready to defend their loved ones.", strengths:["Reliability","Loyalty","Observation","Supportiveness"], communication:"Warm, considerate, and attentive. Listens carefully and remembers details.", watchouts:["Can struggle to assert needs","May take on too much","Resistance to change"], creativeSummary:"The glue that holds the team together without ever asking for credit. Quietly indispensable. Deserves all the appreciation." },
  ESTJ:{ title:"Executive",   group:"Sentinel",  emoji:"📊", summary:"Excellent administrators, unsurpassed at managing things and people.", strengths:["Organisation","Leadership","Decisiveness","Reliability"], communication:"Direct, clear, and structured. Values clear expectations and outcomes.", watchouts:["Can be rigid","May come across as bossy","Difficulty adapting to rapid change"], creativeSummary:"The project manager everyone secretly needs. Has a Gantt chart for their Gantt chart. Gets things done, full stop." },
  ESFJ:{ title:"Consul",      group:"Sentinel",  emoji:"🤝", summary:"Extraordinarily caring, social, and popular people, always eager to help.", strengths:["Teamwork","Warmth","Social awareness","Loyalty"], communication:"Personable and considerate. Connects people and builds rapport naturally.", watchouts:["Can be approval-seeking","May struggle with difficult truths","Conflict averse"], creativeSummary:"The culture carrier who makes the office feel like a community. Always knows who needs coffee and who needs a pep talk." },
  ISTP:{ title:"Virtuoso",    group:"Explorer",  emoji:"🔧", summary:"Bold and practical experimenters, masters of all kinds of tools.", strengths:["Problem solving","Adaptability","Practicality","Calm under pressure"], communication:"Concise and action-oriented. Prefers practical discussion over theory.", watchouts:["Can appear detached","May resist long-term planning","Risk of boredom with routine"], creativeSummary:"The quiet fixer who shows up, figures it out, and never makes a fuss. Pure competence, no drama." },
  ISFP:{ title:"Adventurer",  group:"Explorer",  emoji:"🎭", summary:"Flexible and charming artists, always ready to explore and experience something new.", strengths:["Creativity","Adaptability","Sensitivity","Artistic vision"], communication:"Gentle, empathetic, and expressive. Often communicates through visuals or action.", watchouts:["Can be conflict-averse","May struggle with long-term plans","Private about feelings"], creativeSummary:"The quiet creative whose work speaks louder than words. Give them a concept and space — what comes back will surprise you." },
  ESTP:{ title:"Entrepreneur",group:"Explorer",  emoji:"🚀", summary:"Smart, energetic, and very perceptive people who enjoy living on the edge.", strengths:["Boldness","Practicality","Observation","Adaptability"], communication:"Direct, energetic, and action-oriented. Engages through doing.", watchouts:["Can rush into decisions","May overlook feelings","Risk tolerance can be high"], creativeSummary:"The one who skips the deck and just does it. High energy, high results, occasionally high chaos. Worth every moment." },
  ESFP:{ title:"Entertainer", group:"Explorer",  emoji:"🎉", summary:"Spontaneous, energetic, and enthusiastic people — life is never boring around them.", strengths:["Enthusiasm","People skills","Spontaneity","Practicality"], communication:"Warm, lively, and inclusive. Brings energy to any conversation.", watchouts:["Can struggle with focus","May avoid difficult conversations","Short-term focus"], creativeSummary:"The walking campaign idea who IS the brand. If the office needs vibes, this person is the playlist." },
};

const QUESTIONS = [
  { id:1,  text:"At the end of a big work event or busy day with people, I feel energised rather than drained.", dimension:"EI", direction:"E" },
  { id:2,  text:"I prefer working through ideas by talking them out with others rather than sitting quietly and thinking.", dimension:"EI", direction:"E" },
  { id:3,  text:"When solving a problem at work, I trust patterns and possibilities over concrete facts and past experience.", dimension:"NS", direction:"N" },
  { id:4,  text:"I get more excited about exploring what could be than refining what already exists.", dimension:"NS", direction:"N" },
  { id:5,  text:"When making a tough decision, logic and objective analysis matter more to me than how people might feel about it.", dimension:"TF", direction:"T" },
  { id:6,  text:"I tend to prioritise getting the best outcome over making sure everyone in the room is comfortable with the process.", dimension:"TF", direction:"T" },
  { id:7,  text:"I feel better when a project has a clear plan, deadline, and defined structure from the start.", dimension:"JP", direction:"J" },
  { id:8,  text:"I prefer to have things decided and settled rather than leaving options open until the last minute.", dimension:"JP", direction:"J" },
  { id:9,  text:"I rarely second-guess my decisions once I have made them — I move forward without much self-doubt.", dimension:"AT", direction:"A" },
  { id:10, text:"I handle criticism or setbacks without taking them too personally — I bounce back quickly.", dimension:"AT", direction:"A" },
  { id:11, text:"In meetings, I am usually one of the first people to speak up or share an idea.", dimension:"EI", direction:"E" },
  { id:12, text:"I prefer a detailed brief and proven approach over figuring things out as we go.", dimension:"NS", direction:"S" },
  { id:13, text:"I find it easier to give honest feedback than to soften the message to spare someone's feelings.", dimension:"TF", direction:"T" },
  { id:14, text:"A last-minute change to a plan feels more stressful than exciting to me.", dimension:"JP", direction:"J" },
  { id:15, text:"I hold myself to very high standards — I often feel I could have done better, even when others are happy with my work.", dimension:"AT", direction:"T" },
];

const COLOUR_ENERGY = {
  RED:    { name:"Fiery Red",       hex:"#D94040", light:"#FDEAEA", emoji:"🔴", desc:"Driven, competitive, direct, decisive" },
  YELLOW: { name:"Sunshine Yellow", hex:"#D4A800", light:"#FFFBEA", emoji:"🟡", desc:"Enthusiastic, creative, sociable, expressive" },
  GREEN:  { name:"Earth Green",     hex:"#3A9E6B", light:"#EAFAF3", emoji:"🟢", desc:"Caring, patient, supportive, harmonious" },
  BLUE:   { name:"Cool Blue",       hex:"#2F6FBF", light:"#EAF1FB", emoji:"🔵", desc:"Analytical, precise, cautious, questioning" },
};

const HP_HOUSES = {
  GRYFFINDOR: { name:"Gryffindor", emoji:"🦁", hex:"#AE0001", light:"#FFF0F0", trait:"Brave, bold, daring and driven." },
  RAVENCLAW:  { name:"Ravenclaw",  emoji:"🦅", hex:"#0E1A6E", light:"#EEF0FF", trait:"Wise, analytical and endlessly curious." },
  HUFFLEPUFF: { name:"Hufflepuff", emoji:"🦡", hex:"#C8960C", light:"#FFFBEA", trait:"Loyal, patient and fair-minded." },
  SLYTHERIN:  { name:"Slytherin",  emoji:"🐍", hex:"#1A472A", light:"#EDFAF3", trait:"Ambitious, resourceful and adaptable." },
};

const HP_DATA = {
  INTJ: { character:"Albus Dumbledore",       house:"RAVENCLAW",  houseReason:"Like Dumbledore, the Architect operates several moves ahead — wielding knowledge and foresight as their greatest tools." },
  INTP: { character:"Luna Lovegood",          house:"RAVENCLAW",  houseReason:"Luna's wonderfully unconventional mind and comfort in intellectual territory others find baffling is pure Logician energy." },
  ENTP: { character:"Fred and George Weasley", house:"RAVENCLAW", houseReason:"The twins relentless inventiveness and love of testing every boundary makes them natural Debaters — ideas first, consequences later." },
  ENTJ: { character:["Minerva McGonagall","Kingsley Shacklebolt","Olympe Maxime","Bartemius Crouch Sr."][Math.floor(Math.random()*4)], house:"GRYFFINDOR", houseReason:"A natural Commander — direct, decisive, and fiercely high-standards. Built to lead from the front." },
  ESTJ: { character:["Percy Weasley","Cornelius Fudge","Amelia Bones","Arthur Weasley"][Math.floor(Math.random()*4)], house:"GRYFFINDOR", houseReason:"The ultimate Executive — structured, reliable, and always making sure everything runs properly." },
  INFP: { character:"Neville Longbottom",     house:"HUFFLEPUFF", houseReason:"Neville leads with heart and quiet conviction. Underestimated, deeply values-driven, and more powerful than anyone expects." },
  ENFJ: { character:"Albus Dumbledore",       house:"GRYFFINDOR", houseReason:"The Protagonist is the ultimate people-leader — inspiring loyalty, seeing potential in everyone, always putting the team first." },
  ENFP: { character:"Rubeus Hagrid",          house:"HUFFLEPUFF", houseReason:"Hagrid's boundless enthusiasm, warm heart and total belief in the underdog is Campaigner energy at its most loveable." },
  ISTJ: { character:"Hermione Granger",       house:"RAVENCLAW",  houseReason:"Hermione's meticulous preparation and unshakeable reliability make her the ultimate Logistician — the one who always does the reading." },
  ISFJ: { character:"Molly Weasley",          house:"HUFFLEPUFF", houseReason:"Molly holds everything together with fierce loyalty and quiet strength. The Defender who goes to any length to protect those she loves." },
  ESTJ: { character:"Arthur Weasley",         house:"GRYFFINDOR", houseReason:"Arthur is structured, dedicated and deeply principled — runs a tight ship while genuinely caring about doing things the right way." },
  ESFJ: { character:"Pomona Sprout",          house:"HUFFLEPUFF", houseReason:"Professor Sprout nurtures everyone around her, builds an inclusive environment and leads through warmth and consistent dedication." },
  ISTP: { character:"Severus Snape",          house:"SLYTHERIN",  houseReason:"Snape is the ultimate Virtuoso — calm, precise, impossible to read, operating on a level of competence most never see coming." },
  ISFP: { character:"Cedric Diggory",         house:"HUFFLEPUFF", houseReason:"Cedric leads through quiet authenticity, creative instinct and genuine decency — never flashy, always impressive." },
  ESTP: { character:"Harry Potter",           house:"GRYFFINDOR", houseReason:"Harry acts first and reflects later. Bold, instinctive, thriving under pressure — the Entrepreneur who makes it up as he goes and wins." },
  ESFP: { character:"Ron Weasley",            house:"GRYFFINDOR", houseReason:"Ron brings the energy, the laughs and the heart. The Entertainer who lifts every room and makes the impossible feel fun." },
};

function getHPData(code, submissionId) {
  const ENTJ_chars = ["Minerva McGonagall","Kingsley Shacklebolt","Olympe Maxime","Bartemius Crouch Sr."];
  const ESTJ_chars = ["Percy Weasley","Cornelius Fudge","Amelia Bones","Arthur Weasley"];
  const idx = submissionId ? submissionId.charCodeAt(0) % 4 : 0;
  if (code === "ENTJ") return { ...HP_DATA["ENTJ"], character: ENTJ_chars[idx] };
  if (code === "ESTJ") return { ...HP_DATA["ESTJ"], character: ESTJ_chars[idx] };
  return HP_DATA[code] || HP_DATA["ENFP"];
}


function getColourEnergy(result) {
  if (!result) return { primary:COLOUR_ENERGY.BLUE, secondary:COLOUR_ENERGY.GREEN, primaryKey:"BLUE", secondaryKey:"GREEN" };
  const isE=result.EI?.dir==="E", isT=result.TF?.dir==="T", isJ=result.JP?.dir==="J", isN=result.NS?.dir==="N";
  let primary, secondary;
  if (isE && isT) primary="RED";
  else if (isE && !isT) primary="YELLOW";
  else if (!isE && !isT) primary="GREEN";
  else primary="BLUE";
  if (isN && isJ) secondary=primary==="RED"?"BLUE":"RED";
  else if (isN && !isJ) secondary=primary==="YELLOW"?"RED":"YELLOW";
  else if (!isN && isJ) secondary=primary==="GREEN"?"BLUE":"GREEN";
  else secondary=primary==="YELLOW"?"GREEN":"YELLOW";
  return { primary:COLOUR_ENERGY[primary], secondary:COLOUR_ENERGY[secondary], primaryKey:primary, secondaryKey:secondary };
}

function scoreAnswers(answers) {
  const dims={EI:[],NS:[],TF:[],JP:[],AT:[]};
  QUESTIONS.forEach(q=>{
    const val=answers[q.id]; if(val===undefined)return;
    dims[q.dimension].push({direction:q.direction,score:(val-1)/4});
  });
  function calcDim(entries,posDir,negDir){
    if(!entries.length)return{pct:50,dir:posDir};
    const avg=entries.reduce((s,e)=>s+(e.direction===posDir?e.score:1-e.score),0)/entries.length;
    const pct=Math.round(avg*100);
    return pct>=50?{pct,dir:posDir}:{pct:100-pct,dir:negDir};
  }
  const EI=calcDim(dims.EI,"E","I"),NS=calcDim(dims.NS,"N","S");
  const TF=calcDim(dims.TF,"T","F"),JP=calcDim(dims.JP,"J","P"),AT=calcDim(dims.AT,"A","T");
  const code=`${EI.dir}${NS.dir}${TF.dir}${JP.dir}`;
  const personality=PERSONALITIES[code]||PERSONALITIES["ENFP"];
  return{code,fullCode:code+(AT.dir==="A"?"-A":"-T"),EI,NS,TF,JP,AT,personality};
}

const ADMIN_PASSWORD="ExpADL@2026";

async function fetchSubmissions(){
  const{data,error}=await supabase.from("submissions").select("*").order("created_at",{ascending:false});
  if(error){console.error(error);return[];}
  return(data||[]).map(s=>({...s,result_data:{...s.result_data,personality:PERSONALITIES[s.result_data?.code]||PERSONALITIES["ENFP"]}}));
}

async function saveSubmission(payload){
  const{error}=await supabase.from("submissions").insert([payload]);
  if(error)throw error;
}

async function removeSubmission(id){
  const{error}=await supabase.from("submissions").delete().eq("id",id);
  if(error)console.error(error);
}

function exportCSV(submissions){
  const H=["Name","Email","Department","Type","Code","E%","N%","T%","J%","A%","Primary Colour","Secondary Colour","HP House","HP Character","Strengths","Communication","Creative Summary","Submitted"];
  const rows=submissions.map(s=>{
    const r=s.result_data,ce=getColourEnergy(r),hp=getHPData(r.code,s.id),house=HP_HOUSES[hp.house];
    return[s.name,s.email,s.department||"—",r.personality.title,r.fullCode,
      r.EI.dir==="E"?r.EI.pct:100-r.EI.pct,r.NS.dir==="N"?r.NS.pct:100-r.NS.pct,
      r.TF.dir==="T"?r.TF.pct:100-r.TF.pct,r.JP.dir==="J"?r.JP.pct:100-r.JP.pct,
      r.AT.dir==="A"?r.AT.pct:100-r.AT.pct,ce.primary.name,ce.secondary.name,
      house.name,hp.character,r.personality.strengths.join("; "),
      r.personality.communication,r.personality.creativeSummary,
      new Date(s.created_at).toLocaleString()];
  });
  const csv=[H,...rows].map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
  const a=Object.assign(document.createElement("a"),{href:URL.createObjectURL(new Blob([csv],{type:"text/csv"})),download:"AEDA_Personality_Results.csv"});
  a.click();
}

function AEDALogo(){
  return(
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <div style={{width:36,height:36,borderRadius:8,background:`linear-gradient(135deg,${BRAND.gold},${BRAND.goldLight})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:14,color:BRAND.navy}}>A</div>
      <span style={{color:BRAND.white,fontWeight:700,fontSize:15,letterSpacing:1.5,textTransform:"uppercase"}}>AEDA</span>
    </div>
  );
}

function TraitBar({label,pct,color}){
  return(
    <div style={{marginBottom:12}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
        <span style={{fontSize:13,color:BRAND.navyMid,fontWeight:600}}>{label}</span>
        <span style={{fontSize:13,color,fontWeight:700}}>{pct}%</span>
      </div>
      <div style={{height:8,background:BRAND.mist,borderRadius:99,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:99}}/>
      </div>
    </div>
  );
}

function ProgressBar({current,total}){
  const pct=(current/total)*100;
  return(
    <div style={{width:"100%",marginBottom:8}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
        <span style={{fontSize:12,color:BRAND.slate}}>Question {current} of {total}</span>
        <span style={{fontSize:12,color:BRAND.gold,fontWeight:600}}>{Math.round(pct)}%</span>
      </div>
      <div style={{height:4,background:"rgba(255,255,255,0.1)",borderRadius:99,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${BRAND.navyLight},${BRAND.gold})`,borderRadius:99,transition:"width 0.4s ease"}}/>
      </div>
    </div>
  );
}
function Landing({onStart,onAdmin}){
  return(
    <div style={{minHeight:"100vh",background:BRAND.navy,display:"flex",flexDirection:"column"}}>
      <nav style={{padding:"20px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid rgba(201,168,76,0.15)`}}>
        <AEDALogo/>
        <span style={{color:BRAND.slate,fontSize:12,letterSpacing:2,textTransform:"uppercase"}}>Team Personality Assessment</span>
      </nav>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 24px",textAlign:"center"}}>
        <div style={{width:120,height:120,borderRadius:"50%",background:`radial-gradient(circle,${BRAND.gold}33 0%,transparent 70%)`,border:`2px solid ${BRAND.gold}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:48,marginBottom:40}}>🧠</div>
        <div style={{maxWidth:640}}>
          <p style={{color:BRAND.gold,fontSize:12,letterSpacing:3,textTransform:"uppercase",marginBottom:16}}>AEDA Marketing Team · 2026</p>
          <h1 style={{color:BRAND.white,fontSize:"clamp(30px,5vw,52px)",fontWeight:900,lineHeight:1.1,marginBottom:20}}>
            Discover Your<br/>
            <span style={{background:`linear-gradient(135deg,${BRAND.gold},${BRAND.goldLight})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Personality Type</span>
          </h1>
          <p style={{color:BRAND.slate,fontSize:17,lineHeight:1.7,marginBottom:40}}>A 15-question assessment designed to reveal how you work, communicate, and thrive. Built exclusively for the AEDA marketing team.</p>
          <div style={{display:"flex",gap:28,justifyContent:"center",flexWrap:"wrap",marginBottom:48}}>
            {[["⏱️","5 minutes"],["❓","15 questions"],["🔒","Private results"],["🎯","16 types"]].map(([icon,label])=>(
              <div key={label} style={{textAlign:"center"}}>
                <div style={{fontSize:22,marginBottom:4}}>{icon}</div>
                <div style={{color:BRAND.slate,fontSize:12,letterSpacing:1}}>{label}</div>
              </div>
            ))}
          </div>
          <button onClick={onStart} style={{background:`linear-gradient(135deg,${BRAND.gold},${BRAND.goldLight})`,color:BRAND.navy,border:"none",borderRadius:50,padding:"16px 48px",fontSize:16,fontWeight:800,cursor:"pointer",boxShadow:`0 8px 32px ${BRAND.gold}44`}}>
            Begin Assessment →
          </button>
          <p style={{color:BRAND.slate,fontSize:12,marginTop:20}}>Your results will be revealed at the team meeting. No right or wrong answers.</p>
        </div>
      </div>
      <div style={{textAlign:"center",padding:16,borderTop:`1px solid rgba(255,255,255,0.05)`}}>
        <span style={{color:BRAND.slate,fontSize:11,cursor:"pointer",letterSpacing:1}} onClick={onAdmin}>Admin Access</span>
      </div>
    </div>
  );
}

function Registration({onSubmit}){
  const [form,setForm]=useState({name:"",email:"",department:"AEDA Marketing Team"});
  const [errors,setErrors]=useState({});
  function validate(){const e={};if(!form.name.trim())e.name="Please enter your full name";if(!form.email.includes("@"))e.email="Please enter a valid email";return e;}
  function handleSubmit(){const e=validate();if(Object.keys(e).length){setErrors(e);return;}onSubmit(form);}
  const inp={width:"100%",padding:"14px 16px",borderRadius:12,border:`1.5px solid ${BRAND.mist}`,fontSize:15,background:BRAND.white,color:BRAND.navy,outline:"none",boxSizing:"border-box"};
  return(
    <div style={{minHeight:"100vh",background:BRAND.offWhite,display:"flex",flexDirection:"column"}}>
      <nav style={{padding:"18px 32px",background:BRAND.navy}}><AEDALogo/></nav>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 20px"}}>
        <div style={{background:BRAND.white,borderRadius:24,padding:"48px 40px",maxWidth:480,width:"100%",boxShadow:"0 8px 48px rgba(10,22,40,0.10)"}}>
          <div style={{fontSize:36,marginBottom:8,textAlign:"center"}}>👋</div>
          <h2 style={{color:BRAND.navy,fontSize:26,fontWeight:900,marginBottom:8,textAlign:"center"}}>Let's get started</h2>
          <p style={{color:BRAND.slate,fontSize:14,textAlign:"center",marginBottom:36,lineHeight:1.6}}>Just a couple of quick details before your assessment.</p>
          {[{key:"name",label:"Full Name",placeholder:"e.g. Jane Smith",type:"text"},{key:"email",label:"Email Address",placeholder:"e.g. jane@aeda.com.au",type:"email"},{key:"department",label:"Team / Department",placeholder:"AEDA Marketing Team",type:"text"}].map(({key,label,placeholder,type})=>(
            <div key={key} style={{marginBottom:20}}>
              <label style={{display:"block",fontSize:13,fontWeight:700,color:BRAND.navy,marginBottom:8}}>{label}</label>
              <input type={type} placeholder={placeholder} value={form[key]} onChange={e=>{setForm(f=>({...f,[key]:e.target.value}));setErrors(er=>({...er,[key]:undefined}));}} style={{...inp,borderColor:errors[key]?BRAND.danger:BRAND.mist}}/>
              {errors[key]&&<p style={{color:BRAND.danger,fontSize:12,marginTop:4}}>{errors[key]}</p>}
            </div>
          ))}
          <button onClick={handleSubmit} style={{width:"100%",padding:15,background:`linear-gradient(135deg,${BRAND.navy},${BRAND.navyLight})`,color:BRAND.white,border:"none",borderRadius:12,fontSize:16,fontWeight:700,cursor:"pointer",marginTop:8}}>
            Start Assessment →
          </button>
        </div>
      </div>
    </div>
  );
}

function Survey({user,onComplete}){
  const [current,setCurrent]=useState(0);
  const [answers,setAnswers]=useState({});
  const [selected,setSelected]=useState(null);
  const [fading,setFading]=useState(false);
  const q=QUESTIONS[current];
  const LABELS=["Strongly Disagree","Disagree","Neutral","Agree","Strongly Agree"];
  function handleSelect(val){
    const na={...answers,[q.id]:val};setSelected(val);setAnswers(na);
    setTimeout(()=>{
      if(current<QUESTIONS.length-1){setFading(true);setTimeout(()=>{const n=current+1;setCurrent(n);setSelected(na[QUESTIONS[n].id]||null);setFading(false);},280);}
      else{onComplete(scoreAnswers(na));}
    },380);
  }
  return(
    <div style={{minHeight:"100vh",background:BRAND.navy,display:"flex",flexDirection:"column"}}>
      <nav style={{padding:"18px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid rgba(201,168,76,0.1)`}}>
        <AEDALogo/><span style={{color:BRAND.slate,fontSize:13}}>Hi, {user.name.split(" ")[0]} 👋</span>
      </nav>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 20px"}}>
        <div style={{maxWidth:600,width:"100%"}}>
          <ProgressBar current={current+1} total={QUESTIONS.length}/>
          <div style={{background:"rgba(255,255,255,0.04)",borderRadius:24,padding:"40px 36px",border:`1px solid rgba(201,168,76,0.12)`,marginTop:20,opacity:fading?0:1,transition:"opacity 0.28s ease"}}>
            <div style={{color:BRAND.gold,fontSize:12,letterSpacing:2,textTransform:"uppercase",marginBottom:20}}>Statement {current+1}</div>
            <h2 style={{color:BRAND.white,fontSize:"clamp(17px,3vw,22px)",fontWeight:700,lineHeight:1.55,marginBottom:36}}>"{q.text}"</h2>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {[1,2,3,4,5].map((val,i)=>(
                <button key={val} onClick={()=>handleSelect(val)} style={{padding:"13px 18px",borderRadius:12,border:"1.5px solid",borderColor:selected===val?BRAND.gold:"rgba(255,255,255,0.1)",background:selected===val?`${BRAND.gold}22`:"rgba(255,255,255,0.03)",color:selected===val?BRAND.goldLight:BRAND.slate,fontSize:14,cursor:"pointer",textAlign:"left",transition:"all 0.15s",fontWeight:selected===val?700:400,display:"flex",alignItems:"center",gap:12}}>
                  <span style={{width:22,height:22,borderRadius:"50%",border:"2px solid",borderColor:selected===val?BRAND.gold:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {selected===val&&<span style={{width:10,height:10,borderRadius:"50%",background:BRAND.gold,display:"block"}}/>}
                  </span>
                  {LABELS[i]}
                </button>
              ))}
            </div>
          </div>
          {current>0&&<button onClick={()=>{setCurrent(c=>c-1);setSelected(answers[QUESTIONS[current-1].id]||null);}} style={{marginTop:18,background:"transparent",border:"none",color:BRAND.slate,cursor:"pointer",fontSize:13}}>← Back</button>}
        </div>
      </div>
    </div>
  );
}

function Confirmation({user,result}){
  const p=result.personality;
  const traits=[
    {label:result.EI.dir==="E"?"Extraverted":"Introverted",pct:result.EI.pct,color:BRAND.navyLight},
    {label:result.NS.dir==="N"?"Intuitive":"Observant",pct:result.NS.pct,color:"#4A9B6F"},
    {label:result.TF.dir==="T"?"Thinking":"Feeling",pct:result.TF.pct,color:"#7B5EA7"},
    {label:result.JP.dir==="J"?"Judging":"Prospecting",pct:result.JP.pct,color:"#4A7FC1"},
    {label:result.AT.dir==="A"?"Assertive":"Turbulent",pct:result.AT.pct,color:BRAND.gold},
  ];
  return(
    <div style={{minHeight:"100vh",background:BRAND.offWhite,display:"flex",flexDirection:"column"}}>
      <nav style={{padding:"18px 32px",background:BRAND.navy}}><AEDALogo/></nav>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 20px"}}>
        <div style={{maxWidth:520,width:"100%",textAlign:"center"}}>
          <div style={{background:BRAND.white,borderRadius:24,padding:"48px 36px",boxShadow:"0 8px 48px rgba(10,22,40,0.10)",marginBottom:20}}>
            <div style={{fontSize:56,marginBottom:16}}>✅</div>
            <h2 style={{color:BRAND.navy,fontSize:26,fontWeight:900,marginBottom:12}}>Assessment Complete!</h2>
            <p style={{color:BRAND.slate,fontSize:15,lineHeight:1.7,marginBottom:32}}>
              Thank you, <strong style={{color:BRAND.navy}}>{user.name}</strong>. Your responses have been recorded. Your personality profile will be revealed at the Monday team meeting. 🎉
            </p>
            <div style={{background:BRAND.navy,borderRadius:16,padding:"28px 24px",textAlign:"left"}}>
              <p style={{color:BRAND.gold,fontSize:11,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>Your Type · {result.fullCode}</p>
              <h3 style={{color:BRAND.white,fontSize:28,fontWeight:900,marginBottom:4}}>{p.emoji} {p.title}</h3>
              <p style={{color:BRAND.slate,fontSize:13,marginBottom:20}}>{p.group} · {p.summary}</p>
              {traits.map(t=><TraitBar key={t.label} {...t}/>)}
            </div>
          </div>
          <p style={{color:BRAND.slate,fontSize:13}}>You can close this window. See you Monday! 🚀</p>
        </div>
      </div>
    </div>
  );
}

function AdminLogin({onLogin,onBack}){
  const [pw,setPw]=useState("");const [err,setErr]=useState("");
  return(
    <div style={{minHeight:"100vh",background:BRAND.navy,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"rgba(255,255,255,0.05)",border:`1px solid rgba(201,168,76,0.2)`,borderRadius:24,padding:"48px 40px",maxWidth:400,width:"100%",textAlign:"center"}}>
        <AEDALogo/>
        <div style={{fontSize:40,marginTop:28,marginBottom:8}}>🔐</div>
        <h2 style={{color:BRAND.white,fontSize:22,fontWeight:800,marginBottom:8}}>Admin Access</h2>
        <p style={{color:BRAND.slate,fontSize:13,marginBottom:28}}>Enter your admin password to view all team results.</p>
        <input type="password" placeholder="Password" value={pw} onChange={e=>{setPw(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&(pw===ADMIN_PASSWORD?onLogin():setErr("Incorrect password."))}
          style={{width:"100%",padding:"13px 16px",borderRadius:10,border:`1.5px solid rgba(255,255,255,0.1)`,background:"rgba(255,255,255,0.06)",color:BRAND.white,fontSize:15,outline:"none",boxSizing:"border-box",marginBottom:8}}/>
        {err&&<p style={{color:BRAND.danger,fontSize:12,marginBottom:10}}>{err}</p>}
        <button onClick={()=>pw===ADMIN_PASSWORD?onLogin():setErr("Incorrect password.")} style={{width:"100%",padding:14,background:`linear-gradient(135deg,${BRAND.gold},${BRAND.goldLight})`,color:BRAND.navy,border:"none",borderRadius:10,fontSize:15,fontWeight:800,cursor:"pointer",marginTop:4}}>Login</button>
        <button onClick={onBack} style={{marginTop:16,background:"transparent",border:"none",color:BRAND.slate,cursor:"pointer",fontSize:12}}>← Back to Survey</button>
      </div>
    </div>
  );
}
function AdminDashboard({onExit}){
  const [submissions,setSubmissions]=useState([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState("");
  const [expanded,setExpanded]=useState(null);

  useEffect(()=>{fetchSubmissions().then(d=>{setSubmissions(d);setLoading(false);});},[]);

  const filtered=submissions.filter(s=>s.name.toLowerCase().includes(search.toLowerCase())||s.email.toLowerCase().includes(search.toLowerCase()));

  async function handleDelete(id,name){
    if(!window.confirm(`Delete submission for ${name}? This cannot be undone.`))return;
    await removeSubmission(id);
    setSubmissions(p=>p.filter(s=>s.id!==id));
    if(expanded===id)setExpanded(null);
  }

  function teamAvg(k,pos){
    if(!submissions.length)return 50;
    return Math.round(submissions.map(s=>{const d=s.result_data?.[k];return d?(d.dir===pos?d.pct:100-d.pct):50;}).reduce((a,b)=>a+b,0)/submissions.length);
  }

  const groupCounts=submissions.reduce((a,s)=>{const g=s.result_data?.personality?.group||"Other";a[g]=(a[g]||0)+1;return a;},{});
  const topType=submissions.length?Object.entries(submissions.reduce((a,s)=>{const t=s.result_data?.personality?.title||"—";a[t]=(a[t]||0)+1;return a;},{})).sort((a,b)=>b[1]-a[1])[0]?.[0]||"—":"—";
  const gCol={Analyst:"#7B5EA7",Diplomat:"#4A9B6F",Sentinel:"#4A7FC1",Explorer:"#D4892A"};

  function DimBar({labelA,labelB,pctA,colorA,colorB}){
    return(<div style={{marginBottom:14}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
        <span style={{fontSize:12,fontWeight:700,color:colorA}}>{labelA} {pctA}%</span>
        <span style={{fontSize:12,fontWeight:700,color:colorB}}>{labelB} {100-pctA}%</span>
      </div>
      <div style={{height:10,borderRadius:99,overflow:"hidden",display:"flex"}}>
        <div style={{width:`${pctA}%`,background:colorA,transition:"width 0.8s"}}/>
        <div style={{flex:1,background:colorB,opacity:0.45}}/>
      </div>
    </div>);
  }

  function RadarChart({data,size=240}){
    const cx=size/2,cy=size/2,r=size*0.35,n=data.length;
    const ang=i=>(Math.PI*2*i)/n-Math.PI/2;
    const pt=(i,pct)=>{const a=ang(i),d=(pct/100)*r;return[cx+d*Math.cos(a),cy+d*Math.sin(a)];};
    const lpt=i=>{const a=ang(i),d=r+30;return[cx+d*Math.cos(a),cy+d*Math.sin(a)];};
    const poly=pct=>Array.from({length:n},(_,i)=>pt(i,pct).join(",")).join(" ");
    return(
      <svg width={size} height={size} style={{overflow:"visible"}}>
        {[25,50,75,100].map(p=><polygon key={p} points={poly(p)} fill="none" stroke={p===50?"rgba(201,168,76,0.3)":"rgba(107,127,163,0.15)"} strokeWidth={p===50?1.5:1}/>)}
        {data.map((_,i)=>{const[x,y]=pt(i,100);return<line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(107,127,163,0.2)" strokeWidth={1}/>;},[])}
        <polygon points={data.map((d,i)=>pt(i,d.avg).join(",")).join(" ")} fill="rgba(201,168,76,0.15)" stroke={BRAND.gold} strokeWidth={2.5} strokeLinejoin="round"/>
        {data.map((d,i)=>{const[x,y]=pt(i,d.avg);return<circle key={i} cx={x} cy={y} r={5} fill={d.color} stroke={BRAND.white} strokeWidth={2}/>;},[])}
        {data.map((d,i)=>{const[lx,ly]=lpt(i);const a=lx<cx-5?"end":lx>cx+5?"start":"middle";return(
          <g key={i}><text x={lx} y={ly-6} textAnchor={a} fontSize={11} fontWeight={700} fill={d.color} fontFamily="Georgia,serif">{d.label}</text>
          <text x={lx} y={ly+8} textAnchor={a} fontSize={11} fill={BRAND.slate} fontFamily="Georgia,serif">{d.avg}%</text></g>
        );},[])}
        <text x={cx} y={cy+4} textAnchor="middle" fontSize={10} fill="rgba(107,127,163,0.4)" fontFamily="Georgia,serif">TEAM</text>
      </svg>
    );
  }

  const radarData=[
    {label:"Extraverted",key:"EI",pos:"E",color:"#4A9B6F"},
    {label:"Intuitive",key:"NS",pos:"N",color:"#7B5EA7"},
    {label:"Thinking",key:"TF",pos:"T",color:"#4A7FC1"},
    {label:"Judging",key:"JP",pos:"J",color:BRAND.gold},
    {label:"Assertive",key:"AT",pos:"A",color:"#D4892A"},
  ].map(d=>({...d,avg:teamAvg(d.key,d.pos)}));

  const quadrants=[
    {key:"BLUE",label:"Cool Blue",sub:"Analytical · Precise",emoji:"🔵",hex:"#2F6FBF",light:"#EAF1FB"},
    {key:"RED",label:"Fiery Red",sub:"Driven · Decisive",emoji:"🔴",hex:"#D94040",light:"#FDEAEA"},
    {key:"GREEN",label:"Earth Green",sub:"Caring · Supportive",emoji:"🟢",hex:"#3A9E6B",light:"#EAFAF3"},
    {key:"YELLOW",label:"Sunshine Yellow",sub:"Enthusiastic · Creative",emoji:"🟡",hex:"#D4A800",light:"#FFFBEA"},
  ];

  if(loading)return(
    <div style={{minHeight:"100vh",background:BRAND.navy,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}><div style={{fontSize:48,marginBottom:16}}>⏳</div><p style={{color:BRAND.slate}}>Loading submissions…</p></div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:BRAND.offWhite}}>
      <div style={{background:BRAND.navy,padding:"20px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <AEDALogo/>
        <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{color:BRAND.slate,fontSize:13}}>{submissions.length} submission{submissions.length!==1?"s":""}</span>
          <button onClick={()=>exportCSV(submissions)} style={{padding:"8px 18px",background:`linear-gradient(135deg,${BRAND.gold},${BRAND.goldLight})`,color:BRAND.navy,border:"none",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer"}}>Export CSV ↓</button>
          <button onClick={onExit} style={{padding:"8px 14px",background:"rgba(255,255,255,0.08)",color:BRAND.slate,border:"none",borderRadius:8,fontSize:12,cursor:"pointer"}}>← Exit</button>
        </div>
      </div>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"32px 20px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14,marginBottom:28}}>
          {[{label:"Total Submissions",value:submissions.length,icon:"📊"},{label:"Most Common Type",value:topType,icon:"🏆"},{label:"Extraverts",value:submissions.filter(s=>s.result_data?.EI?.dir==="E").length,icon:"⚡"},{label:"Introverts",value:submissions.filter(s=>s.result_data?.EI?.dir==="I").length,icon:"🧘"}].map(({label,value,icon})=>(
            <div key={label} style={{background:BRAND.white,borderRadius:16,padding:"22px 18px",boxShadow:"0 2px 12px rgba(10,22,40,0.06)"}}>
              <div style={{fontSize:26,marginBottom:8}}>{icon}</div>
              <div style={{color:BRAND.navy,fontSize:24,fontWeight:900}}>{value}</div>
              <div style={{color:BRAND.slate,fontSize:12,marginTop:4}}>{label}</div>
            </div>
          ))}
        </div>
        {submissions.length>0&&(
          <div style={{background:BRAND.white,borderRadius:16,padding:"20px 24px",marginBottom:24,boxShadow:"0 2px 12px rgba(10,22,40,0.06)"}}>
            <h3 style={{color:BRAND.navy,fontSize:14,fontWeight:800,marginBottom:12}}>Personality Group Distribution</h3>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {Object.entries(groupCounts).map(([g,c])=>(
                <div key={g} style={{background:BRAND.offWhite,borderRadius:10,padding:"7px 14px",display:"flex",alignItems:"center",gap:8}}>
                  <span style={{color:BRAND.navy,fontWeight:700,fontSize:14}}>{g}</span>
                  <span style={{background:gCol[g]||BRAND.navy,color:BRAND.white,borderRadius:20,padding:"2px 10px",fontSize:12,fontWeight:700}}>{c}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {submissions.length>0&&(
          <div style={{marginBottom:28}}>
            <h3 style={{color:BRAND.navy,fontSize:16,fontWeight:800,marginBottom:16}}>📡 Team Insights</h3>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
              <div style={{background:BRAND.white,borderRadius:20,padding:"28px 24px",boxShadow:"0 2px 16px rgba(10,22,40,0.07)",display:"flex",flexDirection:"column",alignItems:"center"}}>
                <p style={{color:BRAND.navy,fontSize:14,fontWeight:800,marginBottom:4,alignSelf:"flex-start"}}>Team Radar</p>
                <p style={{color:BRAND.slate,fontSize:12,marginBottom:20,alignSelf:"flex-start"}}>Average trait scores across the whole team.</p>
                <RadarChart data={radarData} size={240}/>
              </div>
              <div style={{background:BRAND.white,borderRadius:20,padding:"24px",boxShadow:"0 2px 16px rgba(10,22,40,0.07)"}}>
                <p style={{color:BRAND.navy,fontSize:14,fontWeight:800,marginBottom:4}}>Dimension Splits</p>
                <p style={{color:BRAND.slate,fontSize:12,marginBottom:20}}>Where does the team land on each spectrum?</p>
                <DimBar labelA="Extraverted" labelB="Introverted" pctA={teamAvg("EI","E")} colorA="#4A9B6F" colorB={BRAND.slate}/>
                <DimBar labelA="Intuitive" labelB="Observant" pctA={teamAvg("NS","N")} colorA="#7B5EA7" colorB={BRAND.slate}/>
                <DimBar labelA="Thinking" labelB="Feeling" pctA={teamAvg("TF","T")} colorA="#4A7FC1" colorB="#D4892A"/>
                <DimBar labelA="Judging" labelB="Prospecting" pctA={teamAvg("JP","J")} colorA={BRAND.navy} colorB={BRAND.slate}/>
                <DimBar labelA="Assertive" labelB="Turbulent" pctA={teamAvg("AT","A")} colorA={BRAND.gold} colorB={BRAND.slate}/>
              </div>
              <div style={{background:BRAND.white,borderRadius:20,padding:"24px",boxShadow:"0 2px 16px rgba(10,22,40,0.07)",gridColumn:"1 / -1"}}>
                <p style={{color:BRAND.navy,fontSize:14,fontWeight:800,marginBottom:4}}>🎨 Colour Energy Quadrant Map</p>
                <p style={{color:BRAND.slate,fontSize:12,marginBottom:20}}>Where does each team member sit?</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:3,maxWidth:700,margin:"0 auto"}}>
                  <div style={{gridColumn:"1/-1",textAlign:"center",marginBottom:6}}><span style={{fontSize:11,color:BRAND.slate,letterSpacing:1,textTransform:"uppercase"}}>← Introverted · · · · · · · · · Extraverted →</span></div>
                  {quadrants.map(q=>{
                    const people=submissions.filter(s=>getColourEnergy(s.result_data).primaryKey===q.key);
                    return(
                      <div key={q.key} style={{background:q.light,border:`2px solid ${q.hex}33`,borderRadius:16,padding:"16px",minHeight:110}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
                          <span style={{fontSize:18}}>{q.emoji}</span>
                          <div style={{flex:1}}><div style={{fontSize:12,fontWeight:800,color:q.hex}}>{q.label}</div><div style={{fontSize:11,color:BRAND.slate}}>{q.sub}</div></div>
                          <span style={{background:q.hex,color:"#fff",borderRadius:20,padding:"2px 8px",fontSize:12,fontWeight:700}}>{people.length}</span>
                        </div>
                        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                          {people.length===0?<span style={{fontSize:11,color:BRAND.slate,fontStyle:"italic"}}>No one here yet</span>:people.map(s=>(
                            <span key={s.id} style={{background:q.hex,color:"#fff",borderRadius:20,padding:"4px 10px",fontSize:12,fontWeight:600}}>{s.result_data?.personality?.emoji} {s.name.split(" ")[0]}</span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  <div style={{gridColumn:"1/-1",textAlign:"center",marginTop:6}}><span style={{fontSize:11,color:BRAND.slate,letterSpacing:1,textTransform:"uppercase"}}>← Feeling · · · · · · · · · · · · Thinking →</span></div>
                </div>
              </div>
            </div>
          </div>
        )}
        {submissions.length>0&&(
          <div style={{background:BRAND.white,borderRadius:20,padding:"24px",boxShadow:"0 2px 16px rgba(10,22,40,0.07)",marginBottom:28,overflowX:"auto"}}>
            <p style={{color:BRAND.navy,fontSize:15,fontWeight:800,marginBottom:2}}>📋 Full Team Table</p>
            <p style={{color:BRAND.slate,fontSize:12,marginBottom:16}}>Live view — put this on screen at the meeting.</p>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:900}}>
              <thead>
                <tr style={{background:BRAND.navy}}>
                  {["Name","Type","Code","House","HP Character","Colour","E%","N%","T%","J%","A%","Top Strength"].map(h=>(
                    <th key={h} style={{padding:"10px 14px",color:BRAND.gold,fontWeight:700,textAlign:"left",fontSize:11,letterSpacing:0.5,textTransform:"uppercase",whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {submissions.map((s,idx)=>{
                  const r=s.result_data,ce=getColourEnergy(r),hp=getHPData(r.code,s.id),house=HP_HOUSES[hp.house];
                  return(
                    <tr key={s.id} style={{background:idx%2===0?BRAND.white:BRAND.offWhite,borderBottom:`1px solid ${BRAND.mist}`}}>
                      <td style={{padding:"10px 14px",fontWeight:700,color:BRAND.navy,whiteSpace:"nowrap"}}>
                        <span style={{display:"inline-flex",alignItems:"center",gap:7}}><span style={{width:8,height:8,borderRadius:"50%",background:ce.primary.hex,display:"inline-block",flexShrink:0}}/>{s.name}</span>
                      </td>
                      <td style={{padding:"10px 14px",whiteSpace:"nowrap"}}>{r.personality.emoji} {r.personality.title}</td>
                      <td style={{padding:"10px 14px"}}><span style={{background:BRAND.navy,color:BRAND.gold,borderRadius:6,padding:"3px 8px",fontSize:11,fontWeight:700}}>{r.fullCode}</span></td>
                      <td style={{padding:"10px 14px",whiteSpace:"nowrap"}}><span style={{background:house.light,color:house.hex,border:`1px solid ${house.hex}44`,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700}}>{house.emoji} {house.name}</span></td>
                      <td style={{padding:"10px 14px",color:BRAND.slate,fontSize:12,whiteSpace:"nowrap"}}>{hp.character}</td>
                      <td style={{padding:"10px 14px",whiteSpace:"nowrap"}}><span style={{background:ce.primary.light,color:ce.primary.hex,borderRadius:20,padding:"2px 8px",fontSize:11,fontWeight:700}}>{ce.primary.emoji} {ce.primary.name}</span></td>
                      {[{d:r.EI,p:"E"},{d:r.NS,p:"N"},{d:r.TF,p:"T"},{d:r.JP,p:"J"},{d:r.AT,p:"A"}].map(({d,p})=>(
                        <td key={p} style={{padding:"10px 14px",textAlign:"center",whiteSpace:"nowrap"}}><b style={{color:BRAND.navy}}>{d.dir}</b><span style={{color:BRAND.slate,fontSize:11}}> {d.pct}%</span></td>
                      ))}
                      <td style={{padding:"10px 14px",color:BRAND.slate,fontSize:12}}>{r.personality.strengths[0]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div style={{display:"flex",gap:10,marginBottom:18}}>
          <input placeholder="Search by name or email…" value={search} onChange={e=>setSearch(e.target.value)} style={{flex:1,padding:"10px 14px",borderRadius:10,border:`1.5px solid ${BRAND.mist}`,fontSize:14,outline:"none",background:BRAND.white,color:BRAND.navy}}/>
        </div>
        {filtered.length===0?(
          <div style={{background:BRAND.white,borderRadius:16,padding:"60px 24px",textAlign:"center"}}>
            <div style={{fontSize:48,marginBottom:12}}>📭</div>
            <p style={{color:BRAND.slate,fontSize:15}}>{submissions.length===0?"No submissions yet — share this link with your team!":"No results match your search."}</p>
          </div>
        ):(
          <div style={{display:"grid",gap:12}}>
            {filtered.map(s=>{
              const isOpen=expanded===s.id,r=s.result_data;
              const ce=getColourEnergy(r),hp=getHPData(r.code,s.id),house=HP_HOUSES[hp.house];
              const traits=[
                {label:r.EI.dir==="E"?"Extraverted":"Introverted",pct:r.EI.pct,color:BRAND.navyLight},
                {label:r.NS.dir==="N"?"Intuitive":"Observant",pct:r.NS.pct,color:"#4A9B6F"},
                {label:r.TF.dir==="T"?"Thinking":"Feeling",pct:r.TF.pct,color:"#7B5EA7"},
                {label:r.JP.dir==="J"?"Judging":"Prospecting",pct:r.JP.pct,color:"#4A7FC1"},
                {label:r.AT.dir==="A"?"Assertive":"Turbulent",pct:r.AT.pct,color:BRAND.gold},
              ];
              return(
                <div key={s.id} style={{background:BRAND.white,borderRadius:16,boxShadow:"0 2px 12px rgba(10,22,40,0.06)",border:`1.5px solid ${isOpen?BRAND.gold:"transparent"}`,overflow:"hidden"}}>
                  <div style={{padding:"20px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
                    <div onClick={()=>setExpanded(isOpen?null:s.id)} style={{display:"flex",alignItems:"center",gap:14,flex:1,cursor:"pointer"}}>
                      <div style={{position:"relative",flexShrink:0}}>
                        <div style={{width:46,height:46,borderRadius:"50%",background:BRAND.navy,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,border:`3px solid ${ce.primary.hex}`}}>{r.personality.emoji}</div>
                        <div style={{position:"absolute",bottom:-4,right:-4,fontSize:13,background:BRAND.white,borderRadius:"50%",width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 1px 4px rgba(0,0,0,0.15)"}}>{house.emoji}</div>
                      </div>
                      <div>
                        <div style={{color:BRAND.navy,fontWeight:800,fontSize:16}}>{s.name}</div>
                        <div style={{color:BRAND.slate,fontSize:12,marginTop:2}}>{s.email} · {s.department||"—"}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                      <span style={{background:ce.primary.light,color:ce.primary.hex,border:`1.5px solid ${ce.primary.hex}`,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700}}>{ce.primary.emoji} {ce.primary.name}</span>
                      <div onClick={()=>setExpanded(isOpen?null:s.id)} style={{textAlign:"right",cursor:"pointer"}}>
                        <div style={{color:BRAND.navy,fontWeight:700,fontSize:14}}>{r.personality.title}</div>
                        <div style={{color:BRAND.gold,fontSize:12,fontWeight:600}}>{r.fullCode}</div>
                      </div>
                      <span onClick={()=>setExpanded(isOpen?null:s.id)} style={{color:BRAND.slate,fontSize:14,cursor:"pointer"}}>{isOpen?"▲":"▼"}</span>
                      <button onClick={()=>handleDelete(s.id,s.name)} style={{background:"#FFF0F0",border:"1px solid #E05A5A44",color:BRAND.danger,borderRadius:8,padding:"5px 10px",fontSize:12,cursor:"pointer",fontWeight:600}}>🗑️</button>
                    </div>
                  </div>
                  {isOpen&&(
                    <div style={{borderTop:`1px solid ${BRAND.mist}`,padding:"24px"}}>
                      <div style={{background:house.light,border:`1px solid ${house.hex}33`,borderRadius:12,padding:"14px 18px",marginBottom:14,display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
                        <div style={{fontSize:30}}>{house.emoji}</div>
                        <div><div style={{fontSize:12,fontWeight:800,color:house.hex}}>{house.name} · {hp.character}</div><div style={{fontSize:12,color:BRAND.slate,marginTop:3,lineHeight:1.5}}>{hp.houseReason}</div></div>
                      </div>
                      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
                        {[ce.primary,ce.secondary].map((c,i)=>(
                          <div key={i} style={{flex:1,minWidth:160,background:c.light,border:`1px solid ${c.hex}44`,borderRadius:12,padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
                            <div style={{width:30,height:30,borderRadius:"50%",background:c.hex,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>{c.emoji}</div>
                            <div><div style={{fontSize:11,fontWeight:800,color:c.hex}}>{i===0?"Primary":"Secondary"} · {c.name}</div><div style={{fontSize:11,color:BRAND.slate}}>{c.desc}</div></div>
                          </div>
                        ))}
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:24}}>
                        <div>
                          <p style={{color:BRAND.navy,fontSize:13,fontWeight:700,marginBottom:12}}>Trait Percentages</p>
                          {traits.map(t=><TraitBar key={t.label} {...t}/>)}
                        </div>
                        <div>
                          <p style={{color:BRAND.navy,fontSize:13,fontWeight:700,marginBottom:10}}>Strengths</p>
                          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>{r.personality.strengths.map(st=><span key={st} style={{background:BRAND.offWhite,color:BRAND.navy,borderRadius:20,padding:"4px 12px",fontSize:12}}>{st}</span>)}</div>
                          <p style={{color:BRAND.navy,fontSize:13,fontWeight:700,marginBottom:6}}>Communication Style</p>
                          <p style={{color:BRAND.slate,fontSize:13,lineHeight:1.6,marginBottom:14}}>{r.personality.communication}</p>
                          <p style={{color:BRAND.navy,fontSize:13,fontWeight:700,marginBottom:6}}>Watch-Outs</p>
                          <ul style={{margin:0,paddingLeft:16}}>{r.personality.watchouts.map(w=><li key={w} style={{color:BRAND.slate,fontSize:13,marginBottom:4}}>{w}</li>)}</ul>
                        </div>
                        <div style={{gridColumn:"1 / -1"}}>
                          <div style={{background:BRAND.navy,borderRadius:12,padding:"18px 20px"}}>
                            <p style={{color:BRAND.gold,fontSize:11,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>✨ Creative Summary</p>
                            <p style={{color:BRAND.white,fontSize:14,lineHeight:1.7,fontStyle:"italic",margin:0}}>"{r.personality.creativeSummary}"</p>
                          </div>
                        </div>
                      </div>
                      <p style={{color:BRAND.slate,fontSize:11,marginTop:16,textAlign:"right"}}>Submitted: {new Date(s.created_at).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App(){
  const [screen,setScreen]=useState("landing");
  const [user,setUser]=useState(null);
  const [result,setResult]=useState(null);
  const [saving,setSaving]=useState(false);
  const [saveError,setSaveError]=useState(false);

  async function handleSurveyComplete(res){
    setSaving(true);setSaveError(false);setResult(res);
    try{
      await saveSubmission({
        name:user.name,email:user.email,department:user.department,
        result_data:{
          code:res.code,fullCode:res.fullCode,EI:res.EI,NS:res.NS,TF:res.TF,JP:res.JP,AT:res.AT,
          personality:{title:res.personality.title,group:res.personality.group,emoji:res.personality.emoji,
            summary:res.personality.summary,strengths:res.personality.strengths,
            communication:res.personality.communication,watchouts:res.personality.watchouts,
            creativeSummary:res.personality.creativeSummary},
        }
      });
      setScreen("confirm");
    }catch(e){setSaveError(true);}
    setSaving(false);
  }

  if(saving)return(
    <div style={{minHeight:"100vh",background:BRAND.navy,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}><div style={{fontSize:48,marginBottom:16}}>💾</div><p style={{color:BRAND.slate,fontSize:16}}>Saving your results…</p></div>
    </div>
  );

  if(saveError)return(
    <div style={{minHeight:"100vh",background:BRAND.navy,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{textAlign:"center",maxWidth:400}}>
        <div style={{fontSize:48,marginBottom:16}}>⚠️</div>
        <h2 style={{color:BRAND.white,marginBottom:12}}>Something went wrong</h2>
        <p style={{color:BRAND.slate,marginBottom:24}}>We could not save your results. Please check your connection and try again.</p>
        <button onClick={()=>setSaveError(false)} style={{background:BRAND.gold,color:BRAND.navy,border:"none",borderRadius:10,padding:"12px 28px",fontSize:15,fontWeight:700,cursor:"pointer"}}>Try Again</button>
      </div>
    </div>
  );

  return(
    <div>
      {screen==="landing"    &&<Landing onStart={()=>setScreen("register")} onAdmin={()=>setScreen("adminLogin")}/>}
      {screen==="register"   &&<Registration onSubmit={u=>{setUser(u);setScreen("survey");}}/>}
      {screen==="survey"     &&<Survey user={user} onComplete={handleSurveyComplete}/>}
      {screen==="confirm"    &&<Confirmation user={user} result={result}/>}
      {screen==="adminLogin" &&<AdminLogin onLogin={()=>setScreen("admin")} onBack={()=>setScreen("landing")}/>}
      {screen==="admin"      &&<AdminDashboard onExit={()=>setScreen("landing")}/>}
    </div>
  );
}
