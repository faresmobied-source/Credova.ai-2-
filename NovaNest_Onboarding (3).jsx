import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════
   DESIGN TOKENS
   ═══════════════════════════════════════════════════ */
const C = {
  skyTop:"#5C9BE6",skyMid:"#89B8F0",skyLight:"#EAF4FF",skyLightest:"#F0F9FF",
  mint:"#34D399",mintLight:"#ECFDF5",mintGlow:"rgba(52,211,153,0.35)",mintSoft:"rgba(52,211,153,0.08)",
  peach:"#FF9A8A",peachGrad:"linear-gradient(135deg,#FF9E8C 0%,#FF7F6A 100%)",peachShadow:"rgba(255,154,138,0.30)",
  charcoal:"#1A1A1A",gray:"#6B7280",grayLight:"#9CA3AF",grayBorder:"#E5E7EB",
  white:"#FFFFFF",surface:"rgba(255,255,255,0.95)",blue:"#60A5FA",amber:"#F59E0B",purple:"#A78BFA",
};
const F = { d:"'Plus Jakarta Sans','DM Sans',sans-serif", b:"'DM Sans',sans-serif" };

/* ═══════════════════════════════════════════════════
   BRAND CONFIG — centralized, change once everywhere
   ═══════════════════════════════════════════════════ */
const BRAND = {
  name: "Credova",
  domain: "credova.ai",
  tagline: "Your calm, smart guide to money in Canada.",
  assistant: "Nova",
  assistantFull: "Nova from Credova",
  assistantRole: "Your financial guide",
};

/* Credova "C" Logo — clean gradient arc, fixed blending */
function CredovaLogo({size=80,style:sx}){
  const R=40,CIRC=2*Math.PI*R,GAP=Math.round(CIRC*0.30),ARC=Math.round(CIRC-GAP);
  const Ri=36,CIRCi=2*Math.PI*Ri,GAPi=Math.round(CIRCi*0.30),ARCi=Math.round(CIRCi-GAPi);
  return <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={sx}>
    <defs>
      <linearGradient id="clg" x1="75" y1="8" x2="30" y2="92" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#86EFAC"/><stop offset="18%" stopColor="#4ADE80"/>
        <stop offset="40%" stopColor="#22C55E"/><stop offset="65%" stopColor="#15803D"/>
        <stop offset="85%" stopColor="#166534"/><stop offset="100%" stopColor="#14532D"/>
      </linearGradient>
      <linearGradient id="clh" x1="62" y1="14" x2="42" y2="55" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFF" stopOpacity="0.35"/><stop offset="100%" stopColor="#FFF" stopOpacity="0"/>
      </linearGradient>
    </defs>
    <circle cx="50" cy="53" r={R} fill="none" stroke="#14532D" strokeWidth="13" strokeLinecap="round" opacity="0.09"
      strokeDasharray={`${ARC} ${GAP}`} style={{filter:"blur(5px)",transform:"rotate(55deg)",transformOrigin:"50px 53px"}}/>
    <circle cx="50" cy="50" r={R} fill="none" stroke="url(#clg)" strokeWidth="13" strokeLinecap="round"
      strokeDasharray={`${ARC} ${GAP}`} style={{transform:"rotate(55deg)",transformOrigin:"50px 50px"}}/>
    <circle cx="50" cy="50" r={Ri} fill="none" stroke="url(#clh)" strokeWidth="4" strokeLinecap="round"
      strokeDasharray={`${ARCi} ${GAPi}`} style={{transform:"rotate(55deg)",transformOrigin:"50px 50px"}}/>
  </svg>;
}

/* ── Animated Credova Intro — full circle draws → morphs to C ── */
function AnimatedCredovaIntro({size=140,onComplete}){
  const [phase,setPhase]=useState(0);
  // 0: blank (initial render)
  // 1: drawing circle (stroke-dashoffset animates circ → 0)
  // 2: circle complete, brief hold
  // 3: gap opens — circle morphs into C
  // 4: settled — fire onComplete

  useEffect(()=>{
    const timers = [
      setTimeout(()=>setPhase(1), 60),     // start draw after paint
      setTimeout(()=>setPhase(2), 1100),    // circle complete
      setTimeout(()=>setPhase(3), 1350),    // begin morph
      setTimeout(()=>{setPhase(4); onComplete&&onComplete()}, 2000), // settled
    ];
    return ()=>timers.forEach(clearTimeout);
  },[]);

  const R = 40;
  const CIRC = 2 * Math.PI * R;                // 251.33
  const GAP_FRAC = 0.30;                       // 30% gap matches logo geometry
  const GAP = Math.round(CIRC * GAP_FRAC);     // ~75
  const ARC = Math.round(CIRC - GAP);          // ~176

  // Inner highlight ring
  const Ri = 36;
  const CIRCi = 2 * Math.PI * Ri;
  const GAPi = Math.round(CIRCi * GAP_FRAC);
  const ARCi = Math.round(CIRCi - GAPi);

  /* Rotation: 55° places the dash-start at the lower tip of the C.
     The visible arc draws clockwise from lower-right → down → left → up → upper-right.
     The gap falls naturally on the right side. */
  const ROT = 55;

  const drawing = phase >= 1;
  const complete = phase >= 2;
  const morphing = phase >= 3;
  const settled = phase >= 4;

  return <div style={{position:"relative",width:size,height:size,display:"flex",alignItems:"center",justifyContent:"center"}}>

    {/* Ambient glow — breathes in when circle completes */}
    <div style={{
      position:"absolute",inset:-30,borderRadius:"50%",
      background:"radial-gradient(circle, rgba(52,211,153,0.15) 0%, transparent 70%)",
      filter:"blur(18px)",
      opacity: complete ? 1 : 0,
      transition: "opacity 0.8s ease-out",
    }}/>

    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={{position:"relative",zIndex:1}}>
      <defs>
        {/* Main green gradient — smooth 6-stop */}
        <linearGradient id="cag" x1="75" y1="8" x2="30" y2="92" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#86EFAC"/>
          <stop offset="18%" stopColor="#4ADE80"/>
          <stop offset="40%" stopColor="#22C55E"/>
          <stop offset="65%" stopColor="#15803D"/>
          <stop offset="85%" stopColor="#166534"/>
          <stop offset="100%" stopColor="#14532D"/>
        </linearGradient>
        {/* Inner depth highlight */}
        <linearGradient id="cah" x1="62" y1="14" x2="42" y2="55" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="#FFF" stopOpacity="0"/>
        </linearGradient>
      </defs>

      {/* Layer 1: Soft shadow (slightly offset, blurred) */}
      <circle cx="50" cy="53" r={R} fill="none" stroke="#14532D" strokeWidth="13" strokeLinecap="round"
        strokeDasharray={morphing ? `${ARC} ${GAP}` : `${CIRC} 0.1`}
        strokeDashoffset={drawing ? 0 : CIRC}
        opacity={complete ? 0.09 : 0}
        style={{
          transform:`rotate(${ROT}deg)`, transformOrigin:"50px 53px",
          filter:"blur(5px)",
          transition: drawing
            ? `stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1), stroke-dasharray 0.6s cubic-bezier(0.4,0,0.2,1) ${morphing?"0s":"9s"}, opacity 0.6s ease`
            : "none",
        }}/>

      {/* Layer 2: Main green stroke — draws full circle, then morphs to C */}
      <circle cx="50" cy="50" r={R} fill="none" stroke="url(#cag)" strokeWidth="13" strokeLinecap="round"
        strokeDasharray={morphing ? `${ARC} ${GAP}` : `${CIRC} 0.1`}
        strokeDashoffset={drawing ? 0 : CIRC}
        style={{
          transform:`rotate(${ROT}deg)`, transformOrigin:"50px 50px",
          transition: drawing
            ? `stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1), stroke-dasharray 0.6s cubic-bezier(0.4,0,0.2,1) ${morphing?"0s":"9s"}`
            : "none",
        }}/>

      {/* Layer 3: Traveling energy highlight — short bright dash that chases the draw */}
      {drawing && !settled && (
        <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={`28 ${CIRC - 28}`}
          style={{
            transform:`rotate(${ROT}deg)`, transformOrigin:"50px 50px",
            animation: `hlChase 1s cubic-bezier(0.4,0,0.2,1) forwards`,
            opacity: morphing ? 0 : undefined,
            transition: "opacity 0.4s ease",
          }}/>
      )}

      {/* Layer 4: Inner 3D highlight ring — appears after complete, morphs with main */}
      <circle cx="50" cy="50" r={Ri} fill="none" stroke="url(#cah)" strokeWidth="4" strokeLinecap="round"
        strokeDasharray={morphing ? `${ARCi} ${GAPi}` : `${CIRCi} 0.1`}
        strokeDashoffset={drawing ? 0 : CIRCi}
        style={{
          transform:`rotate(${ROT}deg)`, transformOrigin:"50px 50px",
          opacity: complete ? 1 : 0,
          transition: drawing
            ? `stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1), stroke-dasharray 0.6s cubic-bezier(0.4,0,0.2,1) ${morphing?"0s":"9s"}, opacity 0.5s ease 0.6s`
            : "none",
        }}/>
    </svg>

    <style>{`
      @keyframes hlChase {
        0% { stroke-dashoffset: ${CIRC}; opacity: 0; }
        4% { opacity: 0.7; }
        80% { opacity: 0.45; }
        100% { stroke-dashoffset: 0; opacity: 0; }
      }
    `}</style>
  </div>;
}

/* ═══════════════════════════════════════════════════
   PERSISTENCE (window.storage API)
   ═══════════════════════════════════════════════════ */
const DB = {
  async get(k){ try{ const r=await window.storage.get(k); return r?JSON.parse(r.value):null; }catch{ return null; } },
  async set(k,v){ try{ await window.storage.set(k,JSON.stringify(v)); }catch{} },
  async del(k){ try{ await window.storage.delete(k); }catch{} },
};

/* ═══════════════════════════════════════════════════
   MISSION DATA — 15 missions, filtered by user type
   ═══════════════════════════════════════════════════ */
const MISSIONS_ALL = [
  { id:1,day:1,title:"Get your SIN number",desc:"Your Social Insurance Number is your first step to working and banking in Canada.",cat:"essentials",icon:"📋",time:"5 min",for:["student","worker"],
    steps:["Visit a Service Canada office or apply online","Bring your study/work permit and passport","You'll receive your SIN immediately or by mail","Keep it private — never share it casually"],
    why:"You need a SIN for employment, taxes, and many banking services in Canada." },
  { id:2,day:3,title:"Open your first Canadian bank account",desc:"Compare no-fee newcomer accounts and set one up.",cat:"banking",icon:"🏦",time:"5 min",for:["student","worker"],
    steps:["Compare Scotiabank StartRight, CIBC Newcomer, or TD New to Canada","Bring passport, study/work permit, and proof of address","Ask about no-fee periods for newcomers (1-3 years)","Set up online/mobile banking right away"],
    why:"A Canadian bank account is essential for receiving pay, paying rent, and building your financial identity." },
  { id:3,day:5,title:"Understand debit vs credit cards",desc:"Learn the key differences and when to use each one.",cat:"credit",icon:"💳",time:"3 min",for:["student","worker"],
    steps:["Debit = your own money, withdrawn from your bank account","Credit = borrowed money you must pay back monthly","Use debit for everyday purchases and ATM withdrawals","Use credit for building credit history and online purchases"],
    why:"Many newcomers confuse debit and credit. Understanding the difference helps you avoid debt." },
  { id:4,day:8,title:"Check your credit score",desc:"Find out where you stand — even with no history.",cat:"credit",icon:"📊",time:"2 min",for:["student","worker"],
    steps:["Sign up free at Borrowell or Credit Karma Canada","As a newcomer you may have no score yet — that's normal","Score ranges from 300-900 (aim for 660+)","Check monthly to track your progress"],
    why:"Your credit score affects renting apartments, getting phone plans, and accessing loans in Canada." },
  { id:5,day:12,title:"Apply for your first credit card",desc:"Start building Canadian credit history with a secured card.",cat:"credit",icon:"✨",time:"5 min",for:["student","worker"],
    steps:["Apply for a secured credit card (deposit $300-500 as collateral)","Good options: Home Trust Secured Visa, Capital One Secured","Set a small recurring bill to auto-pay on it","Pay the full balance every month — never just the minimum"],
    why:"A credit card used responsibly is the fastest way to build credit history in Canada." },
  { id:6,day:15,title:"Set up a simple budget",desc:"A zero-stress template for tracking your spending.",cat:"budget",icon:"📱",time:"4 min",for:["student","worker"],
    steps:["List your monthly income (after taxes)","Allocate: 50% needs, 30% wants, 20% savings","Track for one month using a free app or spreadsheet","Adjust categories to fit your actual spending"],
    why:"Budgeting helps you avoid running out of money and builds good financial habits." },
  { id:7,day:20,title:"Set up automatic savings",desc:"Automate small weekly deposits to grow your safety net.",cat:"banking",icon:"🏦",time:"3 min",for:["student","worker"],
    steps:["Open a free savings account (separate from chequing)","Set up a weekly auto-transfer ($10-25 to start)","Treat it like a bill — don't touch it","Aim for 3 months of expenses as emergency fund"],
    why:"Automated savings removes willpower from the equation. Even small amounts add up." },
  { id:8,day:25,title:"Learn about TFSA",desc:"Discover Canada's tax-free savings account.",cat:"banking",icon:"📈",time:"3 min",for:["student","worker"],
    steps:["TFSA = Tax-Free Savings Account — earnings grow tax-free","You get contribution room starting the year you arrive","2024 limit: $7,000/year (unused room carries forward)","Great for emergency fund or short-term savings goals"],
    why:"A TFSA is one of Canada's best financial tools. Starting early maximizes your growth." },
  { id:9,day:30,title:"Send your first remittance",desc:"Compare services to send money home affordably.",cat:"remittance",icon:"💸",time:"4 min",for:["student","worker"],
    steps:["Compare rates on Wise, Remitly, and your bank","Check: exchange rate, transfer fee, and delivery speed","Wise usually offers the best real exchange rate","Set up a recurring transfer if you send regularly"],
    why:"Choosing the right service can save you hundreds per year on international transfers." },
  { id:10,day:35,title:"Understand your pay stub",desc:"Know exactly what's being deducted and why.",cat:"taxes",icon:"📄",time:"3 min",for:["worker"],
    steps:["Gross pay = before deductions, Net pay = what you receive","CPP (Canada Pension Plan) — mandatory retirement savings","EI (Employment Insurance) — protection if you lose your job","Federal & provincial tax — varies by income bracket"],
    why:"Understanding deductions helps you plan your budget and catch payroll errors." },
  { id:11,day:35,title:"Budget for tuition and living costs",desc:"Plan your finances around the academic year.",cat:"budget",icon:"🎓",time:"4 min",for:["student"],
    steps:["Map out tuition payment dates and amounts","Calculate monthly living costs: rent, food, transit, phone","Factor in textbooks, supplies, and social activities","Build a buffer for unexpected expenses each semester"],
    why:"International students often underestimate living costs. Planning ahead prevents stress." },
  { id:12,day:40,title:"Learn about common newcomer scams",desc:"Real examples of fraud targeting new residents.",cat:"safety",icon:"🛡️",time:"3 min",for:["student","worker"],
    steps:["CRA phone scam — government never threatens arrest by phone","Rental scams — never pay deposit before seeing the place","Job scams — legitimate employers don't ask for upfront fees","SIN scams — no one can 'suspend' your SIN by phone"],
    why:"Newcomers are frequent targets for scams. Knowing the common ones protects you." },
  { id:13,day:50,title:"Set up direct deposit",desc:"Get paid faster by connecting your bank to payroll.",cat:"banking",icon:"🏦",time:"2 min",for:["worker"],
    steps:["Ask your employer for a direct deposit form","Provide your bank's institution, transit, and account number","Find these on a void cheque or in your banking app","Funds typically arrive 1-2 days faster"],
    why:"Direct deposit is standard in Canada and ensures you get paid on time." },
  { id:14,day:60,title:"Understand your first tax return",desc:"A simple guide to filing taxes as a newcomer.",cat:"taxes",icon:"📋",time:"6 min",for:["student","worker"],
    steps:["Tax season: February to April each year","Use free software: Wealthsimple Tax or TurboTax free tier","Report worldwide income from your arrival date onward","Students: claim tuition credits for a tax refund!"],
    why:"Filing taxes is mandatory in Canada. You may even get money back!" },
  { id:15,day:75,title:"Review and optimize your finances",desc:"Check in on your progress and adjust your plan.",cat:"essentials",icon:"🔄",time:"5 min",for:["student","worker"],
    steps:["Review your credit score (should be improving)","Check your savings progress","Review your budget — any categories need adjusting?","Set 3 financial goals for the next 90 days"],
    why:"Regular check-ins keep you on track and help you catch problems early." },
];

/* ═══════════════════════════════════════════════════
   MISSION LEARNING CONTENT — deep knowledge, tips, quizzes
   ═══════════════════════════════════════════════════ */
const LEARN = {
  1:{ intro:"Your SIN (Social Insurance Number) is a 9-digit number that is your key to working, filing taxes, and accessing government services in Canada. Think of it like a financial passport — you can't do much without it.",
    sections:[
      {title:"What exactly is a SIN?",body:"A Social Insurance Number is issued by Service Canada. It's used by your employer to report your earnings, by the CRA (Canada Revenue Agency) to process your taxes, and by banks to verify your identity. Every person who works or receives government benefits in Canada needs one."},
      {title:"How to apply",body:"You can apply in person at a Service Canada office (bring your passport + study/work permit) or online through the Service Canada website. In-person applications give you the number immediately. Online applications take 10-15 business days by mail."},
      {title:"SIN starting with 9",body:"If your SIN starts with the number 9, it means it was issued to a temporary resident. This is completely normal for international students and workers on permits. When your status changes (e.g., you get permanent residency), you'll receive a new SIN starting with a different digit."},
      {title:"Protecting your SIN",body:"Never carry your SIN card in your wallet. Only share it when legally required — employers, banks, and the CRA may ask for it. Landlords, phone companies, and random forms should NOT need it. If someone steals your SIN, they can commit identity theft."}],
    tips:[{text:"Write your SIN down and store it in a secure place at home. If you lose it, you'll need it to apply for a replacement.",emoji:"📝"},{text:"Some employers ask for your SIN before you start working. Have it ready on your first day to avoid delays in getting paid.",emoji:"⏰"}],
    quiz:{q:"Who should you share your SIN with?",opts:["Your landlord","Your employer","A phone company","All of the above"],correct:1,explain:"Your employer needs your SIN for tax reporting. Landlords and phone companies generally do not need it."}},
  2:{ intro:"Opening a bank account is one of the first things you should do after arriving in Canada. Without one, you can't receive a paycheque, pay rent electronically, or build a financial history.",
    sections:[
      {title:"Top 3 newcomer accounts",body:"Scotiabank StartRight: Free for 3 years, unlimited transactions, free Interac e-Transfers. CIBC Newcomer Banking: Free chequing for 1 year, bundled credit card, no minimum balance. TD New to Canada: Free for 6 months, 25 free transactions/month, lots of branch locations. All three don't require Canadian credit history."},
      {title:"What to bring",body:"You'll need: your passport, your study or work permit, proof of Canadian address (a lease, utility bill, or even a letter from your school), and your SIN (if you have it — some banks let you add it later). Some banks also accept international ID."},
      {title:"Chequing vs Savings",body:"A chequing account is for daily spending — debit card purchases, paying bills, receiving direct deposits. A savings account is for money you want to set aside. It usually earns a small amount of interest. Most people open both: chequing for spending, savings for goals."},
      {title:"Online & mobile banking",body:"Set up the mobile app immediately. You'll use it for Interac e-Transfers (Canada's most popular way to send money to friends), checking your balance, paying bills, and depositing cheques by taking a photo. Enable notifications so you see every transaction in real time."}],
    tips:[{text:"Open your account within the first week of arriving. Many newcomer promotions have time limits (e.g., 'within 1 year of arrival').",emoji:"🗓️"},{text:"Ask the bank about a secured credit card at the same time. Bundling makes the application easier.",emoji:"💳"}],
    quiz:{q:"Which of these is NOT typically required to open a newcomer bank account?",opts:["Passport","Canadian credit history","Study or work permit","Proof of address"],correct:1,explain:"Newcomer accounts are specifically designed for people without Canadian credit history. That's the whole point!"}},
  3:{ intro:"Debit and credit cards look almost identical, but they work very differently. Understanding this distinction is crucial — it affects your spending, your debt, and your ability to build credit.",
    sections:[
      {title:"How debit cards work",body:"A debit card is connected directly to your bank account. When you tap or swipe, the money comes out of your chequing account immediately. You can only spend what you have. It's like digital cash. In Canada, most debit cards use the Interac network."},
      {title:"How credit cards work",body:"A credit card gives you a line of credit — the bank lends you money up to a limit. At the end of each month, you get a statement showing what you owe. If you pay the full balance by the due date, you pay zero interest. If you only pay the minimum, you'll be charged 19-22% interest on the remaining balance."},
      {title:"When to use which",body:"Use debit for: everyday purchases (groceries, coffee, transit), ATM withdrawals, situations where you want to stay strictly within budget. Use credit for: online purchases (better fraud protection), building credit history, travel bookings, and any recurring subscriptions you set to autopay."},
      {title:"The credit trap to avoid",body:"Many newcomers treat credit cards like free money. It's not. If you carry a balance month to month, the 20%+ interest adds up fast. A $1,000 balance at 20% interest costs you $200/year in charges alone. Golden rule: only charge what you can pay off in full each month."}],
    tips:[{text:"Set your credit card limit low ($500-$1,000) when starting out. This prevents overspending while you build habits.",emoji:"🔒"},{text:"Use your credit card for one small recurring bill (like your phone) and set it to autopay. This builds credit automatically without any effort.",emoji:"🔄"}],
    quiz:{q:"What happens if you only pay the minimum balance on your credit card?",opts:["Nothing — your balance is cleared","You avoid interest entirely","You're charged 19-22% interest on the remaining balance","Your credit score goes up faster"],correct:2,explain:"Paying only the minimum means you carry a balance, and the bank charges high interest on it. Always pay the full balance if you can."}},
  4:{ intro:"Your credit score is a 3-digit number (300-900) that tells lenders, landlords, and even phone companies how trustworthy you are with money. It's one of the most important numbers in your financial life in Canada.",
    sections:[
      {title:"What is a credit score?",body:"Equifax and TransUnion are the two credit bureaus in Canada. They collect data about your borrowing and payment habits and calculate a score. 300-559: Poor. 560-659: Fair. 660-724: Good. 725-759: Very Good. 760-900: Excellent. Most newcomers start with no score at all — which is different from a bad score."},
      {title:"What affects your score",body:"Payment history (35%): Do you pay bills on time? Credit utilization (30%): How much of your available credit are you using? Credit history length (15%): How long have your accounts been open? Credit mix (10%): Do you have different types of credit? New inquiries (10%): Have you applied for lots of credit recently?"},
      {title:"How to check it free",body:"Borrowell: Free, updates weekly, uses Equifax score. Credit Karma Canada: Free, updates weekly, uses TransUnion score. Both are completely free and do NOT affect your credit score. Checking your own score is called a 'soft inquiry' and is harmless. Check at least once a month."},
      {title:"Building credit from zero",body:"Step 1: Get a secured credit card. Step 2: Use it for small purchases (under 30% of limit). Step 3: Pay the full balance every month, on time. Step 4: Don't close old accounts. Step 5: Wait — it typically takes 6-12 months to build a decent score from scratch."}],
    tips:[{text:"Your credit score affects more than loans. Landlords check it before renting to you. Phone companies check it before giving you a plan.",emoji:"🏠"},{text:"Set calendar reminders to check your score on the 1st of every month. Watching it grow is motivating!",emoji:"📈"}],
    quiz:{q:"What is the single biggest factor affecting your credit score?",opts:["How much money you earn","Your payment history","How many credit cards you have","Your age"],correct:1,explain:"Payment history accounts for about 35% of your credit score. Paying on time is the most important thing you can do."}},
  5:{ intro:"A credit card is the primary tool for building credit history in Canada. For newcomers, a secured credit card is the easiest and safest way to start.",
    sections:[
      {title:"Secured vs unsecured cards",body:"A secured credit card requires a security deposit ($300-$500) that becomes your credit limit. This deposit protects the bank if you can't pay. An unsecured card doesn't need a deposit but requires existing credit history. As a newcomer, start with secured — you can upgrade to unsecured after 6-12 months of good history."},
      {title:"Best starter cards for newcomers",body:"Home Trust Secured Visa: No annual fee, reports to both credit bureaus, 1% cash back on all purchases. Capital One Secured Mastercard: No annual fee, low deposit ($75 min), automatic upgrade path after 6 months. Refresh Financial Secured Visa: Designed for credit building, $200 minimum deposit, reports monthly."},
      {title:"The 30% rule",body:"Never use more than 30% of your credit limit. If your limit is $500, keep your balance under $150 at any time. Why? Credit utilization is the second biggest factor in your score (30%). Using less signals to lenders that you're responsible and not desperate for credit."},
      {title:"Autopay setup",body:"The best strategy: Set one small recurring bill to your credit card (phone bill, Netflix, Spotify). Set up autopay for the FULL BALANCE through your bank. This way you build credit every month automatically without ever carrying a balance or paying interest. Set it and forget it."}],
    tips:[{text:"Your security deposit is NOT a fee — you get it back when you close the card or upgrade to an unsecured card.",emoji:"💰"},{text:"Don't apply for multiple cards at once. Each application creates a 'hard inquiry' that temporarily lowers your score.",emoji:"⚠️"}],
    quiz:{q:"What is the recommended maximum credit utilization ratio?",opts:["10%","30%","50%","75%"],correct:1,explain:"Keeping utilization under 30% is the standard recommendation. Under 10% is even better for your score, but 30% is the target to aim for."}},
  6:{ intro:"Budgeting isn't about restricting yourself — it's about knowing where your money goes so you can spend on what actually matters to you.",
    sections:[
      {title:"The 50/30/20 rule",body:"50% Needs: Rent, groceries, transit, phone, insurance — things you must pay. 30% Wants: Dining out, entertainment, shopping, subscriptions — things you enjoy. 20% Savings: Emergency fund, TFSA, future goals. This is a starting framework. Adjust the percentages to fit your reality."},
      {title:"Track before you budget",body:"Before setting limits, track everything you spend for 2-4 weeks. Use a free app (Mint, YNAB free trial, or even a spreadsheet). You'll be surprised where your money actually goes. Most people discover they spend more on food delivery and subscriptions than they thought."},
      {title:"Canadian cost reality check",body:"Typical monthly costs in a Canadian city: Rent (shared): $800-1,200. Groceries: $300-500. Transit pass: $100-150. Phone plan: $40-70. Internet (your share): $20-40. Fun money: $150-300. Total: roughly $1,400-2,200+ depending on city."},
      {title:"Free budgeting tools",body:"YNAB (free trial): Best for zero-based budgeting. Mint: Free, connects to Canadian banks, auto-categorizes. Wealthsimple: Tracks spending if you bank with them. Google Sheets: Most flexible — create your own template. The best tool is the one you'll actually use consistently."}],
    tips:[{text:"Pay yourself first: transfer savings on payday BEFORE you start spending. What you don't see, you don't miss.",emoji:"🏦"},{text:"Track your spending for just one month before creating strict rules. Data first, decisions second.",emoji:"📊"}],
    quiz:{q:"In the 50/30/20 rule, what does the 20% represent?",opts:["Needs like rent and food","Wants like entertainment","Savings and debt repayment","Taxes"],correct:2,explain:"The 20% allocation goes to savings (emergency fund, TFSA, future goals) and extra debt repayment if applicable."}},
  7:{ intro:"Automatic savings is the single most effective financial habit. When you automate it, saving becomes effortless — your money grows while you focus on living your life.",
    sections:[
      {title:"Why automation works",body:"Willpower is unreliable. If you try to save 'what's left' at the end of each month, you'll almost never save anything. By automating transfers on payday, you adapt your spending to what remains. Behavioural scientists call this 'paying yourself first' — it's the #1 recommended savings strategy."},
      {title:"How to set it up",body:"Step 1: Open a high-interest savings account (separate from chequing). Step 2: In your banking app, go to Transfers → Set Up Recurring. Step 3: Choose your payday frequency (weekly or bi-weekly). Step 4: Start with $25-50 per transfer — you can increase later. Step 5: Set the destination to your savings account."},
      {title:"How much to save",body:"The standard emergency fund target is 3 months of essential expenses. For a newcomer spending $1,500/month on needs, that's $4,500. Starting at $25/week, you'll reach $1,300 in a year. At $50/week, you'll hit $2,600. Don't aim for perfection — any amount is better than zero."},
      {title:"Best savings accounts",body:"Look for high-interest savings accounts (HISAs). EQ Bank: 2.5%+ interest, no fees, no minimum. Wealthsimple Cash: 4%+ interest on deposits. Tangerine: 2.5%+ promotional rates for new customers. Avoid regular big bank savings accounts — they often pay only 0.01% interest."}],
    tips:[{text:"Start with an amount so small it feels painless. $10/week is fine. The habit matters more than the amount.",emoji:"🌱"},{text:"Name your savings account something motivating, like 'Emergency Freedom Fund' or 'Safety Net'. It makes you less likely to raid it.",emoji:"✨"}],
    quiz:{q:"What is the recommended emergency fund size?",opts:["1 month of expenses","3 months of expenses","6 months of expenses","12 months of expenses"],correct:1,explain:"3 months of essential expenses is the standard starter goal. Some advisors recommend 6 months, but for newcomers, 3 months is a solid first target."}},
  8:{ intro:"The TFSA (Tax-Free Savings Account) is one of Canada's most powerful financial tools. Any money you earn inside it — interest, dividends, or investment growth — is completely tax-free. Forever.",
    sections:[
      {title:"How a TFSA works",body:"Think of a TFSA as a container. Inside it, you can hold cash, GICs, stocks, ETFs, or mutual funds. Any growth inside this container is never taxed — not when it grows, not when you withdraw. Compare this to a regular account where investment gains are taxed. Over decades, this tax-free growth can be worth tens of thousands of dollars."},
      {title:"Contribution limits",body:"Each year, the government sets a contribution limit (2024: $7,000). Unused room carries forward. Since you accumulate room starting from the year you become a Canadian tax resident (not from age 18 like citizens), your room starts from your arrival year. If you over-contribute, there's a 1% per month penalty on the excess."},
      {title:"TFSA vs RRSP",body:"TFSA: Contribute after-tax money, withdrawals are tax-free, re-contribute withdrawn amounts next year. Best for: short/medium-term goals, emergency fund, flexibility. RRSP: Contribute pre-tax money (tax deduction now), withdrawals are taxed as income. Best for: retirement, high-income earners, buying first home (HBP). As a newcomer, start with TFSA."},
      {title:"Where to open one",body:"Your existing bank can open a TFSA in minutes. For higher interest: EQ Bank TFSA Savings (2.5%+), Wealthsimple TFSA (invest in ETFs with no fees). For beginners: a TFSA savings account is simplest. Once comfortable, you can open a TFSA investment account for higher long-term returns."}],
    tips:[{text:"Even if you can only contribute $50/month, start now. Unused room carries forward, so you can 'catch up' later when you earn more.",emoji:"📈"},{text:"A TFSA isn't just for savings — it's often better used for investing. A TFSA holding index ETFs can grow significantly faster than a savings account.",emoji:"💡"}],
    quiz:{q:"What happens when you withdraw money from your TFSA?",opts:["You pay tax on the amount","Your contribution room is permanently lost","You can re-contribute the amount next calendar year","You pay a penalty fee"],correct:2,explain:"When you withdraw from a TFSA, that contribution room is added back the following January 1st. No tax, no penalty, full flexibility."}},
  9:{ intro:"Sending money back home is one of the most common financial needs for newcomers. The difference between a good and bad transfer service can be hundreds of dollars a year.",
    sections:[
      {title:"The hidden cost: exchange rates",body:"Most services make money not from the visible 'fee' but from the exchange rate markup. If the real rate is 1 CAD = 60 INR, a service might give you 58 INR — that 2 INR per dollar is their hidden profit. On a $1,000 transfer, that's $33 you lose invisibly. Always compare the rate you're offered to the real mid-market rate on Google."},
      {title:"Service comparison",body:"Wise (formerly TransferWire): Uses the real mid-market rate, charges a small transparent fee (0.5-1.5%), arrives in 1-2 days. Remitly: Good rates, fast delivery, promotional rates for first transfer, good for popular corridors. Bank wire: Most expensive ($25-45 flat fee PLUS a bad exchange rate), takes 3-5 days. Western Union: Convenient but usually the most expensive option overall."},
      {title:"How to send smartly",body:"Send larger amounts less frequently instead of small amounts often (each transfer has a fee). Set up recurring transfers if you send the same amount regularly. Compare rates on the exact day you plan to send — they fluctuate. Use Wise's rate alerts feature to get notified when the rate is favorable."},
      {title:"Receiving side",body:"Make sure your recipient has a bank account for direct deposit (cheapest option). Mobile money works well in some countries (M-Pesa, GCash). Cash pickup is convenient but usually costs more. Ask your family which method they prefer and what works in their location."}],
    tips:[{text:"Do a small test transfer first ($50-100) to make sure everything works before sending a large amount.",emoji:"🧪"},{text:"Never use your credit card to fund a transfer — it counts as a cash advance and triggers immediate high interest charges.",emoji:"🚫"}],
    quiz:{q:"Where do most money transfer services make the bulk of their profit?",opts:["The transfer fee","The exchange rate markup","Monthly subscription fees","Account maintenance charges"],correct:1,explain:"While fees are visible, the biggest hidden cost is the exchange rate markup. Always compare the offered rate to the real mid-market rate."}},
  10:{ intro:"Your pay stub might look confusing at first, but understanding those deductions helps you budget accurately and spot any errors.",
    sections:[
      {title:"Gross vs Net pay",body:"Gross pay is your total earnings before any deductions. Net pay (take-home pay) is what actually lands in your bank account. The difference between these two can be 25-35% depending on your income level and province. Always budget based on your net pay, not your gross."},
      {title:"CPP and EI deductions",body:"CPP (Canada Pension Plan): You contribute about 5.95% of pensionable earnings. This funds your retirement pension. EI (Employment Insurance): You contribute about 1.63% of insurable earnings. This provides income if you lose your job involuntarily. Both are mandatory — your employer also matches a portion."},
      {title:"Income tax withholdings",body:"Your employer estimates your annual tax and withholds it from each paycheque. Federal tax: 15% on the first $55,867 of income (2024), increasing for higher brackets. Provincial tax: varies by province (5.05% to 21% depending on province and income). Together these usually take 20-30% for most newcomer income levels."},
      {title:"Checking for errors",body:"Compare each pay stub to your expected hours × hourly rate. Verify vacation pay is accruing (minimum 4% in most provinces). Check that your tax deductions match your TD1 form elections. If something looks wrong, ask your payroll department — errors happen and are usually fixed quickly."}],
    tips:[{text:"Keep every pay stub. You'll need them for tax season and they're useful proof of income when renting an apartment.",emoji:"📂"},{text:"If you earn tips, they may not appear on your pay stub but are still taxable income you need to report.",emoji:"💰"}],
    quiz:{q:"What does CPP stand for?",opts:["Canadian Payment Plan","Canada Pension Plan","Credit Protection Program","Cash Payment Process"],correct:1,explain:"CPP stands for Canada Pension Plan. It's a mandatory retirement savings program — both you and your employer contribute."}},
  11:{ intro:"As an international student, your financial calendar revolves around tuition deadlines and academic terms. Planning ahead prevents the most common source of student financial stress.",
    sections:[
      {title:"Mapping tuition deadlines",body:"Most schools have tuition due dates at the start of each semester (September, January, May). Late payment can result in dropped courses or late fees. Mark these dates in your calendar 2 weeks ahead. Many schools offer payment plans that split tuition into monthly installments — ask your registrar."},
      {title:"Realistic monthly costs",body:"Rent (shared room/apartment): $700-1,200 depending on city. Groceries: $250-400 if you cook at home. Transit: $80-150 (many cities offer student discounts). Phone: $30-60 for a basic plan. Textbooks: $200-500/semester. Social/personal: $100-200. Total: roughly $1,400-2,400/month beyond tuition."},
      {title:"Saving on food",body:"Cook at home — it's 3-5x cheaper than eating out. Buy in bulk at Costco or No Frills. Use the Flashfood app for discounted near-expiry groceries. Many campuses have food banks available to students (no shame — they exist for you). Meal prep on Sundays to avoid expensive weekday impulse buys."},
      {title:"Student discounts everywhere",body:"Always carry your student ID. Many stores, restaurants, and services offer 10-15% off. Get an ISIC card for international discounts. Use UNiDAYS and Student Beans apps for online discounts. Public transit often has student monthly passes. Museums and cultural events frequently have student pricing."}],
    tips:[{text:"Apply for on-campus jobs. They understand student schedules, and the commute is zero.",emoji:"🏫"},{text:"Check if your school offers emergency bursaries for unexpected expenses. Many students don't know these exist.",emoji:"🆘"}],
    quiz:{q:"What's the most effective way to reduce food costs as a student?",opts:["Eat out during lunch specials","Cook at home and meal prep","Skip meals to save money","Only eat campus food"],correct:1,explain:"Cooking at home is 3-5x cheaper than eating out. Sunday meal prep for the week saves both money and time during busy school days."}},
  12:{ intro:"Newcomers are frequently targeted by scammers because they're unfamiliar with how Canadian systems work. Knowing the most common scams makes you much harder to fool.",
    sections:[
      {title:"CRA / Government scams",body:"The scam: You receive a threatening phone call or email claiming to be from the CRA (Canada Revenue Agency). They say you owe money and will be arrested if you don't pay immediately via gift cards or cryptocurrency. The truth: The CRA never threatens arrest by phone, never demands gift cards, and never calls out of the blue demanding immediate payment. Always verify by calling the CRA directly at their official number."},
      {title:"Rental scams",body:"The scam: You find an amazing rental listing at a low price. The 'landlord' says they're out of the country and asks you to wire a deposit to secure it. The truth: Never pay a deposit before seeing the place in person. Never wire money to someone you haven't met. If the deal seems too good to be true, it is. Use verified platforms and always meet the landlord at the property."},
      {title:"Job scams",body:"The scam: You get an unsolicited job offer or see a posting promising high pay for easy work. They ask you to pay for training materials, equipment, or a 'background check' upfront. The truth: Legitimate employers never charge you to start working. If a job requires you to pay money before earning money, it's a scam. Research the company on Google and LinkedIn before proceeding."},
      {title:"What to do if targeted",body:"Don't panic — scammers use urgency and fear as weapons. Hang up or close the message. Never share your SIN, bank details, or passwords. Report the scam to the Canadian Anti-Fraud Centre (1-888-495-8501 or antifraudcentre-centreantifraude.ca). Tell friends and family so they don't fall for the same scam."}],
    tips:[{text:"The #1 red flag: urgency. If someone demands you act RIGHT NOW or face consequences, that's almost always a scam.",emoji:"🚩"},{text:"Save the Canadian Anti-Fraud Centre number in your phone contacts. You might need it someday, and having it ready helps.",emoji:"📱"}],
    quiz:{q:"The CRA calls and says you'll be arrested unless you pay via gift cards immediately. What should you do?",opts:["Buy the gift cards to avoid arrest","Ask for their employee ID and call back","Hang up — it's a scam","Transfer money from your bank instead"],correct:2,explain:"This is a textbook CRA phone scam. The real CRA never threatens arrest, never demands gift cards, and never calls demanding immediate payment. Hang up."}},
  13:{ intro:"Direct deposit means your employer sends your pay electronically straight to your bank account. It's faster, safer, and the standard way people get paid in Canada.",
    sections:[
      {title:"How it works",body:"Instead of receiving a paper cheque, your employer transfers your pay directly into your bank account on payday. The money appears automatically — no trips to the bank, no waiting for cheques to clear. Most Canadian employers use direct deposit as their default payment method."},
      {title:"Information you need",body:"You'll need to provide three numbers: Institution number (3 digits — identifies your bank), Transit number (5 digits — identifies your branch), Account number (7-12 digits — your specific account). Find these in your banking app under 'Account Details' or 'Direct Deposit Info'. You can also find them on a void cheque."},
      {title:"Setting it up",body:"Ask your employer or HR department for a direct deposit enrollment form. Fill in your banking information. Some employers also accept a void cheque or a direct deposit letter from your bank (available through your banking app). Setup usually takes 1-2 pay periods to activate."},
      {title:"Benefits",body:"Faster access to your money (often 1-2 days earlier than cheques). No risk of lost or stolen cheques. Automatic — no action needed each payday. Easier budgeting since you know exactly when money arrives. Required for many automatic bill payments and savings transfers."}],
    tips:[{text:"Double-check every digit of your bank information. One wrong number means your pay goes to the wrong account.",emoji:"🔢"},{text:"Ask if you can split your direct deposit between two accounts — e.g., 80% to chequing, 20% to savings. Automatic saving!",emoji:"💡"}],
    quiz:{q:"How many pieces of banking information do you need for direct deposit?",opts:["Just your account number","Institution number, transit number, and account number","Your credit card number","Your SIN and bank name"],correct:1,explain:"You need three numbers: institution number (3 digits), transit number (5 digits), and account number (7-12 digits). Find all three in your banking app."}},
  14:{ intro:"Filing taxes in Canada is mandatory — even for international students and workers who earned very little. The good news? Many newcomers actually get money BACK from the government.",
    sections:[
      {title:"Tax season basics",body:"The tax year runs January 1 to December 31. You file your return between February and April 30 of the following year. As a newcomer, you report income from your arrival date in Canada onward. Even if you earned zero Canadian income, filing can qualify you for benefits like the GST/HST credit (free money!)."},
      {title:"What you need to file",body:"T4 slip: Your employer sends this by end of February — it summarizes your earnings and deductions. T2202: If you're a student, your school provides this for tuition tax credits. Receipts: Moving expenses (if you moved 40+ km for work/school), medical expenses, charitable donations. SIN: Required on your return."},
      {title:"Free filing options",body:"Wealthsimple Tax: Completely free for simple returns, supports all common situations. TurboTax Free: Free tier handles basic returns. StudioTax: Free desktop software, popular with Canadians. Tax clinics: Many community organizations offer free tax preparation for newcomers and low-income individuals during tax season."},
      {title:"Refunds & credits for newcomers",body:"GST/HST credit: Quarterly payments to offset sales tax — worth $300-500/year for low-income individuals. Canada Workers Benefit: If you earned employment income, you may qualify. Tuition credits (students): Your tuition can reduce your tax to zero or carry forward to future years. Climate Action Incentive: Quarterly payment based on your province."}],
    tips:[{text:"File your taxes even if you earned nothing. It registers you for the GST/HST credit, which is free money deposited quarterly.",emoji:"💵"},{text:"Keep all your receipts organized throughout the year — a simple folder or photo album on your phone works great.",emoji:"📂"}],
    quiz:{q:"As a newcomer who earned very little this year, should you file a tax return?",opts:["No — there's no point if you earned nothing","Yes — it can qualify you for free government credits","Only if your employer requires it","Only after 2 years in Canada"],correct:1,explain:"Filing even with zero or low income qualifies you for the GST/HST credit and other benefits. It's literally free money you'd miss out on."}},
  15:{ intro:"A quarterly financial check-in takes 15 minutes and can prevent small problems from becoming expensive mistakes. Think of it as a tune-up for your money.",
    sections:[
      {title:"Review your credit score",body:"Log into Borrowell or Credit Karma. Has your score gone up? If yes, your habits are working — keep going. If it dropped, check for: missed payments, high credit utilization, or any accounts you don't recognize (possible fraud). A score of 660+ after 6-12 months is great progress."},
      {title:"Audit your spending",body:"Look at last month's bank and credit card statements. Calculate your actual spending vs your budget categories. Where did you overspend? Where did you underspend? Are there any subscriptions you forgot about or no longer use? Cancel anything you haven't used in 30 days."},
      {title:"Check your savings progress",body:"How close are you to your emergency fund goal (3 months of expenses)? Is your automatic savings still running? Should you increase the amount? If you had any unexpected expenses, rebuild your fund before increasing lifestyle spending."},
      {title:"Set new goals",body:"Write down 3 specific financial goals for the next 90 days. Examples: 'Increase credit score to 700', 'Save $500 in emergency fund', 'Reduce food spending by $100/month'. Make them measurable and time-bound. Review them at your next quarterly check-in."}],
    tips:[{text:"Put a recurring calendar event for financial check-ins every 3 months. The consistency matters more than perfection.",emoji:"📅"},{text:"Celebrate progress! If your credit score went up or your savings grew, acknowledge it. Positive reinforcement builds lasting habits.",emoji:"🎉"}],
    quiz:{q:"How often should you do a financial check-in?",opts:["Every week","Every month","Every quarter (3 months)","Once a year"],correct:2,explain:"A quarterly check-in (every 3 months) is the sweet spot — frequent enough to catch problems early, but not so frequent that it feels like a chore."}},
};

const TOOLS_DATA = [
  { id:"bank",icon:"🏦",title:"Open Bank Account",desc:"Compare no-fee newcomer accounts from Canada's top banks.",color:C.mint,cat:"Banking",
    what:"A Canadian bank account lets you receive paycheques via direct deposit, send money instantly with Interac e-Transfer, pay bills online, build a banking history, and use a debit card for everyday purchases. It's the foundation of your financial life in Canada.",
    whyCA:"Without a bank account, you can't receive a salary, pay rent electronically, set up automatic bill payments, or build the financial footprint needed for things like renting an apartment or getting a phone plan. Most employers require direct deposit.",
    steps:["Gather your documents: passport, study/work permit, and proof of Canadian address (a lease, utility bill, or letter from your school)","Compare newcomer-friendly banks: Scotiabank StartRight (free 3 years), CIBC Newcomer Bundle (free 1 year + credit card), TD New to Canada (free 6 months, most branches)","Visit a branch in person or start the application online — some banks let you open remotely before arriving","Ask about bundled offers: many newcomer packages include a free credit card, which helps you build credit simultaneously","Download the mobile app immediately and set up e-Transfer, notifications, and Face ID / fingerprint login"],
    tip:"Apply within your first year of arriving in Canada. Most newcomer promotions are time-limited, and you don't want to miss the free banking period.",tipEmoji:"🗓️",
    actionLabel:"Compare newcomer bank accounts",novaQ:"What's the best bank account for a newcomer in Canada?",
    resources:[{name:"Scotiabank StartRight",desc:"Free for 3 years, unlimited transactions"},{name:"CIBC Newcomer Banking",desc:"Free chequing + bundled credit card"},{name:"TD New to Canada",desc:"Free 6 months, 1,100+ branches"}]},
  { id:"credit",icon:"📊",title:"Check Credit Score",desc:"Free credit monitoring through Borrowell or Credit Karma.",color:C.blue,cat:"Credit",
    what:"Your credit score is a 3-digit number (300–900) that measures how reliably you handle borrowed money. Equifax and TransUnion are the two credit bureaus in Canada that track and calculate this score based on your payment habits, credit usage, and history length.",
    whyCA:"Your credit score affects far more than loans. Landlords check it before renting to you. Phone companies check it before giving you a plan. Insurance companies may use it to set rates. Even some employers check credit for certain positions. Building good credit is essential for life in Canada.",
    steps:["Sign up for a free account at Borrowell (uses Equifax score) — takes 2 minutes, just need your name, address, and SIN","Sign up at Credit Karma Canada (uses TransUnion score) for a second perspective — both are completely free forever","Verify your identity through the online prompts — they may ask questions about your financial history to confirm it's really you","Check your score and review your full credit report for any errors or accounts you don't recognize","Set a monthly calendar reminder to check — both services update weekly, but a monthly review is the sweet spot"],
    tip:"Checking your own credit score is a 'soft inquiry' and does NOT lower your score. Check it as often as you want — it's completely free and harmless.",tipEmoji:"✅",
    actionLabel:"Check your score for free",novaQ:"How do credit scores work in Canada and how can I build mine?",
    resources:[{name:"Borrowell",desc:"Free Equifax score, weekly updates, credit coaching"},{name:"Credit Karma Canada",desc:"Free TransUnion score, financial product recommendations"},{name:"Equifax Canada",desc:"Official bureau — one free report per mail request/year"}]},
  { id:"interac",icon:"📲",title:"Learn About Interac",desc:"How e-Transfers work — Canada's most popular way to send money.",color:"#8B5CF6",cat:"Banking",
    what:"Interac e-Transfer is Canada's instant money transfer system. It lets you send money directly from your bank account to anyone in Canada using just their email address or phone number. Over 800 million transfers happen per year — it's how Canadians split bills, pay rent to roommates, and reimburse friends.",
    whyCA:"Unlike Venmo or Zelle (common in the US), Interac e-Transfer is the standard in Canada and works across all major banks. You'll use it constantly: splitting dinner, paying rent to a roommate, receiving refunds, paying for secondhand purchases. It's as essential as having a debit card.",
    steps:["Open your banking app and look for 'Send Money' or 'Interac e-Transfer' in the menu","Add a recipient by entering their email address or Canadian phone number","Enter the amount and add an optional message (e.g., 'March rent' or 'dinner split')","The recipient gets an email/text notification and deposits the money into their own bank","Enable Auto-Deposit in your own settings so money sent to you arrives instantly without needing to accept"],
    tip:"Enable Auto-Deposit in your banking app under e-Transfer settings. This means any money sent to your registered email goes directly into your account — no security questions, no delays.",tipEmoji:"⚡",
    actionLabel:"Learn to send your first e-Transfer",novaQ:"How does Interac e-Transfer work in Canada?",
    resources:[{name:"Interac e-Transfer",desc:"Bank-to-bank instant transfers, works at all major banks"},{name:"Auto-Deposit",desc:"Automatic receiving — no security questions needed"},{name:"Request Money",desc:"Send a payment request to someone who owes you"}]},
  { id:"remit",icon:"🌍",title:"Send Money Home",desc:"Compare Wise, Remitly, and bank wire rates side by side.",color:C.amber,cat:"Remittance",
    what:"Remittance services let you send money from Canada to family or accounts in another country. The key factors are the exchange rate (how much your recipient gets), the transfer fee, and the delivery speed. The difference between services can be hundreds of dollars per year.",
    whyCA:"Sending money home is one of the most common financial needs for newcomers. Banks charge $25–45 per wire plus a hidden exchange rate markup. Fintech services like Wise use the real mid-market rate and charge transparent fees of 0.5–1.5%, saving you significantly on every transfer.",
    steps:["Check the real mid-market exchange rate on Google (search 'CAD to [your currency]') — this is your benchmark","Compare the rate and total fees on Wise, Remitly, and your bank's international wire transfer","Create an account on your chosen service — you'll need ID verification (passport photo + selfie)","Add your recipient's bank details (account number, bank name, branch code / SWIFT / IFSC)","Send a small test transfer first ($50–100) to confirm everything works before sending larger amounts","Set up recurring transfers if you send the same amount regularly — saves time and sometimes gets better rates"],
    tip:"The visible 'transfer fee' is often small, but the real cost is hidden in the exchange rate markup. Always compare the rate you're offered to the Google mid-market rate. A 2% markup on $1,000 means you're paying $20 invisibly.",tipEmoji:"🔍",
    actionLabel:"Compare transfer services",novaQ:"What's the cheapest way to send money home from Canada?",
    resources:[{name:"Wise",desc:"Real exchange rate, 0.5–1.5% fee, 1–2 day delivery"},{name:"Remitly",desc:"Fast transfers, promotional first-transfer rates"},{name:"Western Union",desc:"Wide network but usually the most expensive option"}]},
  { id:"cra",icon:"📋",title:"CRA My Account",desc:"Set up your Canada Revenue Agency account for taxes.",color:"#EC4899",cat:"Taxes",
    what:"CRA My Account is your online portal to the Canada Revenue Agency — the government agency that handles taxes. Through it you can file taxes, view your tax returns, check benefit payments (like the GST/HST credit), see your TFSA/RRSP contribution room, and manage your tax affairs entirely online.",
    whyCA:"Filing taxes is mandatory in Canada, even for international students with low or zero income. Through CRA My Account you can access refunds, government credits (GST/HST credit worth $300–500/year), and verify your tax situation. It's also how you prove your income for applications like permanent residency.",
    steps:["Visit canada.ca/my-cra-account and click 'Register'","Choose a sign-in method: Sign in with your bank (easiest — select your bank and log in normally) or create a GCKey username/password","Enter your SIN (Social Insurance Number), date of birth, and current address","Verify your identity — CRA may mail you a security code to your address (takes 5–10 business days) or you can verify instantly through your bank","Once logged in, explore: Notice of Assessment, TFSA room, benefit payments, and tax return status"],
    tip:"Choose the 'Sign in with your bank' option when registering — it's the fastest way and skips the mailed security code. Most major Canadian banks support this.",tipEmoji:"🏦",
    actionLabel:"Set up your CRA account",novaQ:"How do I set up my CRA My Account and file taxes in Canada?",
    resources:[{name:"CRA My Account",desc:"Official government tax portal"},{name:"Wealthsimple Tax",desc:"Free tax filing software for simple returns"},{name:"TurboTax Free",desc:"Free tier for basic returns, guided experience"}]},
  { id:"rent",icon:"🏠",title:"Rent Reporting",desc:"Report rent payments to build your credit score faster.",color:"#14B8A6",cat:"Credit",
    what:"Rent reporting services report your monthly rent payments to credit bureaus (Equifax and/or TransUnion), so that your on-time rent payments count toward building your credit score. Since rent is likely your biggest monthly expense, getting credit for it can meaningfully boost your score.",
    whyCA:"As a newcomer, you have little or no credit history. Traditional credit-building methods (credit cards, loans) take time. Rent reporting adds a major positive data point to your credit file immediately. Since you're already paying rent every month, this is 'free' credit building — you don't change your behaviour, you just get rewarded for what you're already doing.",
    steps:["Choose a service: Chexy (reports to Equifax, $2/month) or Borrowell Rent Advantage (reports to Equifax, free tier available)","Sign up and verify your identity and rental information (landlord name, address, monthly amount)","Connect your payment method — the service pays your landlord on your behalf and reports the payment to the credit bureau","Your landlord receives rent on time (they don't need to change anything), and you get credit bureau reporting","Check your credit report in 30–60 days — you should see a new 'trade line' for rent appearing on your file"],
    tip:"Rent reporting works best as a complement to a credit card, not a replacement. The combination of on-time rent payments plus responsible credit card use can build your score significantly faster than either alone.",tipEmoji:"📈",
    actionLabel:"Start reporting your rent",novaQ:"How does rent reporting work and can it help build my credit score?",
    resources:[{name:"Chexy",desc:"Reports to Equifax, $2/month, pay rent by credit card"},{name:"Borrowell Rent Advantage",desc:"Reports to Equifax, free tier available"},{name:"FrontLobby",desc:"Free for tenants, landlord-initiated reporting"}]},
];

const COUNTRIES = [
  {code:"IN",flag:"🇮🇳",name:"India"},{code:"CN",flag:"🇨🇳",name:"China"},{code:"NG",flag:"🇳🇬",name:"Nigeria"},
  {code:"PH",flag:"🇵🇭",name:"Philippines"},{code:"BR",flag:"🇧🇷",name:"Brazil"},{code:"PK",flag:"🇵🇰",name:"Pakistan"},
  {code:"BD",flag:"🇧🇩",name:"Bangladesh"},{code:"EG",flag:"🇪🇬",name:"Egypt"},{code:"KR",flag:"🇰🇷",name:"South Korea"},
  {code:"MX",flag:"🇲🇽",name:"Mexico"},{code:"VN",flag:"🇻🇳",name:"Vietnam"},{code:"CO",flag:"🇨🇴",name:"Colombia"},
  {code:"TR",flag:"🇹🇷",name:"Türkiye"},{code:"SA",flag:"🇸🇦",name:"Saudi Arabia"},{code:"LK",flag:"🇱🇰",name:"Sri Lanka"},
  {code:"KE",flag:"🇰🇪",name:"Kenya"},{code:"GH",flag:"🇬🇭",name:"Ghana"},{code:"JO",flag:"🇯🇴",name:"Jordan"},
  {code:"LB",flag:"🇱🇧",name:"Lebanon"},{code:"SY",flag:"🇸🇾",name:"Syria"},{code:"UA",flag:"🇺🇦",name:"Ukraine"},
];

const INTENTS = [
  {id:"bank",emoji:"🏦",label:"Open my first bank account",desc:"I need help choosing and setting one up"},
  {id:"credit",emoji:"💳",label:"Understand credit scores",desc:"What they are, how to build mine"},
  {id:"remit",emoji:"💸",label:"Send money back home",desc:"Find the cheapest and safest way"},
  {id:"scams",emoji:"🛡️",label:"Avoid scams & fraud",desc:"Learn what to watch out for"},
  {id:"budget",emoji:"📱",label:"Manage a budget",desc:"Track what I spend, save more"},
  {id:"explore",emoji:"🤔",label:"I'm just exploring",desc:"Not sure yet — show me everything"},
];

/* ═══════════════════════════════════════════════════
   INTELLIGENCE LAYER 1 — Knowledge Routing System
   Classifies user questions → routes to knowledge set
   ═══════════════════════════════════════════════════ */
const KNOWLEDGE_ROUTES = {
  credit:    { keywords:["credit score","credit card","credit history","credit limit","utilization","secured card","equifax","transunion","borrowell","credit karma","credit check","build credit","credit rating","fico"],
               missionIds:[3,4,5], toolIds:["credit","rent"] },
  banking:   { keywords:["bank account","bank","chequing","savings account","debit","atm","interac","e-transfer","etransfer","direct deposit","void cheque","branch","td","cibc","scotiabank","rbc","bmo"],
               missionIds:[1,2,7,8,13], toolIds:["bank","interac"] },
  taxes:     { keywords:["tax","taxes","cra","tax return","filing","t4","t2202","gst","hst","rrsp","tfsa","income tax","tax credit","tuition credit","tax season","cpp","ei","deduction","pay stub","payroll"],
               missionIds:[10,14], toolIds:["cra"] },
  remittance:{ keywords:["send money","remit","remittance","transfer","wire","wise","remitly","western union","exchange rate","money home","family money","international transfer"],
               missionIds:[9], toolIds:["remit"] },
  budget:    { keywords:["budget","budgeting","save","saving","spending","expenses","cost","afford","50/30/20","living cost","rent","groceries","emergency fund","automatic savings","ynab","mint"],
               missionIds:[6,7,11], toolIds:[] },
  housing:   { keywords:["rent","rental","apartment","housing","landlord","lease","roommate","rent reporting","moving"],
               missionIds:[12], toolIds:["rent"] },
  scams:     { keywords:["scam","fraud","phishing","identity theft","sin scam","cra scam","rental scam","job scam","safe","protect"],
               missionIds:[12], toolIds:[] },
  student:   { keywords:["student","tuition","university","college","campus","isic","scholarship","bursary","international student","study permit","student job"],
               missionIds:[11], toolIds:[] },
};

function classifyTopic(text) {
  const t = text.toLowerCase();
  let bestRoute = null, bestScore = 0;
  for (const [topic, route] of Object.entries(KNOWLEDGE_ROUTES)) {
    const score = route.keywords.filter(kw => t.includes(kw)).length;
    if (score > bestScore) { bestScore = score; bestRoute = topic; }
  }
  return bestRoute;
}

/* ═══════════════════════════════════════════════════
   INTELLIGENCE LAYER 2 — Smart Suggestion Engine
   Generates contextual next-step cards from mission state
   ═══════════════════════════════════════════════════ */
const SUGGESTION_MAP = {
  1:  { emoji:"🏦", text:"Now that you have your SIN, you're ready to open a bank account.", next:"Open your first Canadian bank account", actionId:2 },
  2:  { emoji:"💳", text:"Great — you have a bank account! Next, learn the difference between debit and credit cards.", next:"Understand debit vs credit", actionId:3 },
  3:  { emoji:"📊", text:"You understand debit vs credit. Now check where your credit score stands.", next:"Check your credit score", actionId:4 },
  4:  { emoji:"✨", text:"You know your score. Time to start building it with your first credit card.", next:"Apply for a secured credit card", actionId:5 },
  5:  { emoji:"📱", text:"You're building credit! Set up a budget to keep your finances on track.", next:"Create a simple budget", actionId:6 },
  6:  { emoji:"🏦", text:"Budget set! Automate your savings so your money grows without effort.", next:"Set up automatic savings", actionId:7 },
  7:  { emoji:"📈", text:"Savings are growing. Learn about the TFSA — Canada's best tax-free tool.", next:"Discover the TFSA", actionId:8 },
  8:  { emoji:"💸", text:"TFSA done! If you send money home, learn how to save on transfer fees.", next:"Compare remittance services", actionId:9 },
  9:  { emoji:"🛡️", text:"Smart transfers set up. Protect yourself by learning about common scams.", next:"Learn about newcomer scams", actionId:12 },
  12: { emoji:"📋", text:"You know the risks. Now learn how to file your taxes and get refunds.", next:"Understand your tax return", actionId:14 },
  14: { emoji:"🔄", text:"Amazing progress! Time for a full financial review and new goals.", next:"Review and optimize", actionId:15 },
  15: { emoji:"🎉", text:"You've completed your financial settlement journey! Keep building on your foundation.", next:null, actionId:null },
};

function getSmartSuggestion(missions) {
  if (!missions || missions.length === 0) return null;
  const doneIds = missions.filter(m => m.status === "done").map(m => m.id);
  if (doneIds.length === 0) return null;
  const lastDone = Math.max(...doneIds);
  const suggestion = SUGGESTION_MAP[lastDone];
  if (!suggestion) return null;
  if (suggestion.actionId && missions.find(m => m.id === suggestion.actionId)) {
    return suggestion;
  }
  if (!suggestion.actionId) return suggestion; // journey complete
  return null;
}

function getContextualSuggestions(missions, profile) {
  const suggestions = [];
  const doneIds = new Set((missions || []).filter(m => m.status === "done").map(m => m.id));
  const current = (missions || []).find(m => m.status === "current");

  // Primary: next step from last completion
  const primary = getSmartSuggestion(missions);
  if (primary) suggestions.push({ type: "next", ...primary });

  // Secondary: user-type specific suggestions
  if (profile?.userType === "student" && !doneIds.has(11) && !suggestions.find(s => s.actionId === 11)) {
    suggestions.push({ type: "persona", emoji: "🎓", text: "As a student, budgeting around tuition deadlines is crucial.", next: "Budget for tuition and living costs", actionId: 11 });
  }
  if (profile?.userType === "worker" && !doneIds.has(13) && !suggestions.find(s => s.actionId === 13)) {
    suggestions.push({ type: "persona", emoji: "💼", text: "Set up direct deposit so you get paid faster.", next: "Set up direct deposit", actionId: 13 });
  }

  return suggestions.slice(0, 2);
}

/* ═══════════════════════════════════════════════════
   INTELLIGENCE LAYER 3 — Context-Aware Nova AI
   Full user context → smarter, non-repetitive responses
   ═══════════════════════════════════════════════════ */
function novaRespond(text, profile, missions) {
  const t = text.toLowerCase();
  const name = profile?.name || "there";
  const isStu = profile?.userType === "student";
  const doneIds = new Set((missions||[]).filter(m=>m.status==="done").map(m=>m.id));
  const current = (missions||[]).find(m=>m.status==="current");
  const donePct = missions?.length > 0 ? Math.round((doneIds.size / missions.length) * 100) : 0;

  // Route to knowledge category
  const topic = classifyTopic(text);

  // Context-aware progress acknowledgment for greetings
  if (t.includes("hello") || t.includes("hi ") || t.match(/^hey\b/) || t.match(/^hi$/)) {
    let greeting = `Hey ${name}! 👋 `;
    if (donePct > 0 && donePct < 100) greeting += `You're ${donePct}% through your financial journey — great progress! `;
    else if (donePct >= 100) greeting += `You've completed your entire financial journey — amazing work! `;
    if (current) greeting += `Your current mission is "${current.title}". Want to dive into that, or is something else on your mind?`;
    else greeting += `What can I help you with today?`;
    return greeting;
  }

  // ── CREDIT knowledge route ──
  if (topic === "credit") {
    // Check what user already knows
    const knowsDebitVsCredit = doneIds.has(3);
    const checkedScore = doneIds.has(4);
    const hasCard = doneIds.has(5);

    if (t.includes("build credit") || t.includes("credit history")) {
      if (hasCard) return `You're already on track, ${name}! Since you've got your credit card set up, here's how to maximize your score:\n\n• Keep utilization under **30%** of your limit\n• **Always pay the full balance** by the due date\n• Don't apply for new credit cards right now\n• Check your score monthly on Borrowell\n\nYou should start seeing score improvements in 2-3 months. 📈`;
      if (checkedScore) return `Great timing! You've already checked your score. The next step is **applying for a secured credit card** — that's Mission ${missions?.find(m=>m.id===5)?"Day "+missions.find(m=>m.id===5).day:""} on your roadmap.\n\nA secured card is the fastest way to start building credit. Want me to explain how it works?`;
      if (knowsDebitVsCredit) return `Since you already understand debit vs credit, you're ready for the next steps:\n\n1. **Check your credit score** (free on Borrowell)\n2. **Apply for a secured credit card**\n3. Use it for one small bill and pay in full monthly\n\nStart with checking your score — it's on your roadmap!`;
      return `Building credit in Canada starts with these steps:\n\n1. **Get a bank account** (needed first)\n2. **Understand how credit cards work** — they're different from debit\n3. **Check your credit score** for free\n4. **Get a secured credit card** and use it responsibly\n\n${isStu ? "As a student, some banks offer student credit cards with lower limits — perfect for starting out." : "As a worker, your regular income makes it easier to get approved."}\n\nYour roadmap has missions for each step!`;
    }
    if (t.includes("credit score") || t.includes("credit work") || t.includes("credit check")) {
      if (checkedScore) return `You've already set up credit monitoring — nice work, ${name}! 📊\n\nRemember, your score is affected by:\n• **Payment history (35%)** — pay on time, always\n• **Utilization (30%)** — use less than 30% of your limit\n• **History length (15%)** — keep old accounts open\n\nKeep checking monthly. ${hasCard ? "With your credit card active, you should see movement within 2-3 months." : "Once you get a credit card, your score will start building."}`;
      return `A credit score in Canada ranges from **300 to 900**:\n\n• **Pay bills on time** → score goes up\n• **Use less than 30% of your limit** → score goes up\n• **Too many applications** → score goes down\n\nAs a newcomer, you start with no score (not a bad one). Check yours free on **Borrowell** or **Credit Karma**.\n\n${current?.id===4 ? "This is actually your current mission! Tap 'Start Now' on the home screen." : "It's coming up on your roadmap."}`;
    }
    if (t.includes("credit card")) {
      if (hasCard) return `You've already set up your credit card — well done! Here are ongoing best practices:\n\n• **Pay the full balance** every month (not just minimum)\n• **Keep usage under 30%** of your limit\n• Set up **autopay** through your bank so you never miss\n• **Don't close this card** — length of history matters\n\nYou're building credit every month automatically. 💪`;
      return `**Debit** = spends your own money directly.\n**Credit** = borrows money you pay back monthly.\n\n${isStu ? "For students, a **secured credit card** with a $300-500 deposit is the best starting point." : "Many newcomer workers can qualify for a basic unsecured card after 3-6 months with a bank."}\n\n**Key rule:** Only charge what you can pay off in full each month. The 30% utilization rule is critical.`;
    }
  }

  // ── BANKING knowledge route ──
  if (topic === "banking") {
    const hasBank = doneIds.has(2);
    if (t.includes("bank account") || t.includes("best bank") || t.includes("open bank")) {
      if (hasBank) return `You've already opened your bank account — great job, ${name}! 🏦\n\nNow make sure you:\n• Set up **mobile banking** and enable notifications\n• Learn **Interac e-Transfer** for sending money to friends\n• Consider opening a **separate savings account** for your emergency fund\n\nWant to know about any of these?`;
      return `Great options for newcomers:\n\n• **Scotiabank StartRight** — free for 3 years\n• **CIBC Newcomer Bundle** — free chequing + credit card\n• **TD New to Canada** — lots of branches\n\n${isStu?"As a student, Scotiabank and CIBC have great student bundles too!":"TD's extended hours might be most convenient for workers."}\n\n${current?.id===2?"This is your current mission — start it from the home screen!":"Check your roadmap for this mission."}`;
    }
    if (t.includes("interac") || t.includes("e-transfer") || t.includes("etransfer")) {
      return `**Interac e-Transfer** is how Canadians send money to each other:\n\n1. Open your banking app → Send Money\n2. Enter the recipient's **email or phone number**\n3. Enter the amount and send\n4. They receive it **instantly** (if Auto-Deposit is on)\n\n${hasBank?"Since you have your bank account, you can do this right now in your banking app!":"You'll be able to use this once you open your bank account."}\n\n**Pro tip:** Enable Auto-Deposit in your settings so money sent to you arrives automatically.`;
    }
    if (t.includes("tfsa") || t.includes("tax free") || t.includes("tax-free")) {
      const knowsTFSA = doneIds.has(8);
      if (knowsTFSA) return `You've already learned about TFSAs — nice! Quick refresher:\n\n• 2024 limit: **$7,000/year**\n• Your room started when you became a tax resident\n• Best options: **EQ Bank** (savings), **Wealthsimple** (investing)\n\nAre you looking to open one, or do you have a specific question?`;
      return `**TFSA** = Tax-Free Savings Account:\n\n• Earnings grow **completely tax-free**\n• 2024 limit: **$7,000/year**\n• Unused room carries forward\n• Withdraw anytime, no penalty\n\nStart early to maximize growth! ${current?.id===8?"This is your current mission!":"It's on your roadmap."}`;
    }
  }

  // ── TAXES knowledge route ──
  if (topic === "taxes") {
    const knowsTax = doneIds.has(14);
    if (knowsTax) return `Since you've completed the tax mission, here's a refresher, ${name}:\n\n• File between **February and April** each year\n• Use **Wealthsimple Tax** (free) or **TurboTax Free**\n• ${isStu?"Claim **tuition credits** — they can carry forward to future years!":"Check your T4 slip matches your actual earnings."}\n• Even with low income, file to get **GST/HST credits** (free money!)\n\nAnything specific about taxes you want to know?`;
    return `Taxes in Canada:\n\nTax season runs **February to April**. ${isStu?"As a student, claim **tuition tax credits** for a nice refund!":"Your employer deducts taxes automatically from each paycheque."}\n\nFree filing: **Wealthsimple Tax** or **TurboTax Free**.\n\n**Important for newcomers:** File even with zero income — it qualifies you for the GST/HST credit (worth $300-500/year).`;
  }

  // ── REMITTANCE knowledge route ──
  if (topic === "remittance") {
    const doneRemit = doneIds.has(9);
    if (doneRemit) return `You've already set up remittances — smart move! A few ongoing tips:\n\n• **Compare rates each time** — they fluctuate daily\n• Use **Wise rate alerts** to send when rates are favorable\n• **Send larger amounts less often** to minimize per-transfer fees\n• Never use a **credit card** to fund transfers (counts as cash advance)\n\nWant me to help estimate a specific transfer?`;
    return `Sending money home affordably:\n\n• **Wise** — usually cheapest, real exchange rate, 1-2 days\n• **Remitly** — fast, good for popular corridors\n• **Bank wire** — reliable but expensive ($25-45)\n\nThe biggest hidden cost is the **exchange rate markup**, not the fee. Always compare to the Google rate.\n\n${current?.id===9?"This is your current mission!":"Check your roadmap when you're ready."}`;
  }

  // ── BUDGET knowledge route ──
  if (topic === "budget") {
    return `Try the **50/30/20 rule**, ${name}:\n• 50% needs (rent, food, transit)\n• 30% wants (dining, entertainment)\n• 20% savings\n\nEven $25/week = $1,300/year!\n\n${isStu?"**Student tip:** Track your spending for one month before setting strict limits. Check if your campus has a food bank — no shame in using it.":"**Worker tip:** Set up auto-transfer to savings on payday so you save before you spend."}\n\n${doneIds.has(6)?"Since you've set up your budget, focus on sticking to it for 30 days before adjusting.":"Budgeting is on your roadmap — you'll get step-by-step guidance."}`;
  }

  // ── SCAMS knowledge route ──
  if (topic === "scams") {
    return `Common newcomer scams to watch for:\n\n🚨 **CRA phone scam** — government never threatens arrest by phone\n🚨 **Rental scam** — never pay deposit before seeing the place\n🚨 **Job scam** — real employers don't charge upfront fees\n🚨 **SIN scam** — no one can "suspend" your SIN\n\n**#1 red flag: urgency.** If someone demands you act RIGHT NOW, it's almost always a scam.\n\nReport scams: **Canadian Anti-Fraud Centre** (1-888-495-8501).`;
  }

  // ── STUDENT-specific route ──
  if (topic === "student" && isStu) {
    return `Here's what matters most for students in Canada:\n\n• **Open a student bank account** — Scotiabank & CIBC have great options\n• **Budget around tuition deadlines** — mark payment dates early\n• **Apply for on-campus jobs** — they work around your schedule\n• **Get an ISIC card** for international student discounts\n• **File your taxes** — tuition credits can mean a refund!\n\n${doneIds.has(11)?"You've already completed the tuition budgeting mission — well done!":"Tuition budgeting is on your roadmap."}`;
  }

  // ── Fallback with context ──
  let fallback = `Good question, ${name}! `;
  if (current) fallback += `You're currently on "${current.title}" (Day ${current.day}). `;
  if (donePct > 0) fallback += `You've completed ${donePct}% of your journey so far. `;
  fallback += `\n\nI can help with:\n• 💳 Credit scores & cards\n• 🏦 Banking & accounts\n• 💸 Sending money home\n• 📱 Budgeting\n• 📋 Taxes\n• 🛡️ Scam protection\n\nWhat topic interests you?`;
  return fallback;
}

/* ═══════════════════════════════════════════════════
   SHARED UI COMPONENTS + MICRO-INTERACTION SYSTEM
   ═══════════════════════════════════════════════════ */

/* ── Haptic Feedback Utility ── */
function haptic(style="light"){
  try{
    if(navigator?.vibrate){
      const patterns={light:[8],medium:[15],heavy:[25],success:[10,40,15],double:[8,30,8]};
      navigator.vibrate(patterns[style]||patterns.light);
    }
  }catch{}
}

/* ── Global Keyframes (injected once) ── */
function MicroStyles(){
  return <style>{`
    @keyframes microBounce{0%{transform:scale(0.94)}40%{transform:scale(1.02)}70%{transform:scale(0.99)}100%{transform:scale(1)}}
    @keyframes microSpring{0%{transform:scale(0.96)}50%{transform:scale(1.015)}100%{transform:scale(1)}}
    @keyframes navBounce{0%{transform:scale(0.85) translateY(2px)}50%{transform:scale(1.08) translateY(-1px)}75%{transform:scale(0.97)}100%{transform:scale(1) translateY(0)}}
    @keyframes glowPulse{0%{box-shadow:0 4px 20px var(--glow-color,rgba(255,154,138,0.30))}50%{box-shadow:0 6px 28px var(--glow-color,rgba(255,154,138,0.45))}100%{box-shadow:0 4px 20px var(--glow-color,rgba(255,154,138,0.30))}}
    @keyframes sendPop{0%{transform:scale(0.8) rotate(-15deg)}50%{transform:scale(1.1) rotate(5deg)}100%{transform:scale(1) rotate(0deg)}}
  `}</style>;
}

/* ── Pressable: reusable button interaction wrapper ── */
function Pressable({children,onClick,disabled,hapticStyle="light",scaleDown=0.96,glowOnPress,as="button",style:sx,...rest}){
  const [pressed,setPressed]=useState(false);
  const [released,setReleased]=useState(false);
  const handleDown=()=>{if(!disabled){setPressed(true);setReleased(false)}};
  const handleUp=()=>{if(pressed){setPressed(false);setReleased(true);haptic(hapticStyle);setTimeout(()=>setReleased(false),350)}};
  const handleLeave=()=>{if(pressed){setPressed(false)}};
  const handleClick=(e)=>{if(!disabled&&onClick)onClick(e)};
  const Tag=as;
  return <Tag onClick={handleClick} disabled={disabled}
    onMouseDown={handleDown} onMouseUp={handleUp} onMouseLeave={handleLeave}
    onTouchStart={handleDown} onTouchEnd={handleUp}
    style={{
      ...sx,
      transform:pressed?`scale(${scaleDown})`:released?"scale(1)":"scale(1)",
      animation:released?"microSpring 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards":"none",
      transition:pressed?"transform 0.12s cubic-bezier(0.2,0,0.4,1)":"transform 0.1s ease",
      cursor:disabled?"default":"pointer",
      ...(glowOnPress&&pressed?{"--glow-color":glowOnPress,boxShadow:`0 6px 28px ${glowOnPress}`}:{}),
    }} {...rest}>{children}</Tag>;
}

/* ── PressableCard: card interaction wrapper with lift effect ── */
function PressableCard({children,onClick,disabled,style:sx,...rest}){
  const [pressed,setPressed]=useState(false);
  const [released,setReleased]=useState(false);
  const handleDown=()=>{if(!disabled){setPressed(true);setReleased(false)}};
  const handleUp=()=>{if(pressed){setPressed(false);setReleased(true);haptic("light");setTimeout(()=>setReleased(false),400)}};
  const handleLeave=()=>{setPressed(false)};
  return <div onClick={disabled?undefined:onClick}
    onMouseDown={handleDown} onMouseUp={handleUp} onMouseLeave={handleLeave}
    onTouchStart={handleDown} onTouchEnd={handleUp}
    style={{
      ...sx,
      transform:pressed?"scale(0.975) translateY(1px)":"scale(1) translateY(0)",
      boxShadow:pressed?
        "0 1px 4px rgba(0,0,0,0.06)":
        (sx?.boxShadow||"0 2px 16px rgba(0,0,0,0.045)"),
      animation:released?"microBounce 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards":"none",
      transition:pressed?"transform 0.12s cubic-bezier(0.2,0,0.4,1), box-shadow 0.12s ease":"transform 0.15s ease, box-shadow 0.25s ease",
      cursor:disabled?"default":"pointer",
    }} {...rest}>{children}</div>;
}

/* ── Standard Components (now with micro-interactions) ── */
function FadeIn({delay=0,children,style:sx}){
  const [v,setV]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setV(true),delay);return()=>clearTimeout(t)},[delay]);
  return <div style={{opacity:v?1:0,transform:v?"translateY(0)":"translateY(14px)",transition:"opacity 0.5s ease-out,transform 0.5s ease-out",...sx}}>{children}</div>;
}
function SkyBg({intensity=1,children}){
  return <div style={{position:"relative",width:"100%",height:"100%",overflow:"hidden",
    background:`linear-gradient(180deg,rgba(92,155,230,${0.25*intensity}) 0%,rgba(137,184,240,${0.12*intensity}) 30%,#EAF4FF ${60+(1-intensity)*20}%,#F0F9FF 85%,#FFF 100%)`}}>{children}</div>;
}
function Glow(){
  return <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:0}}>
    <div style={{position:"absolute",top:-40,left:-60,width:220,height:220,background:"radial-gradient(circle,rgba(79,209,165,0.10) 0%,transparent 70%)",filter:"blur(40px)"}}/>
    <div style={{position:"absolute",top:-30,right:-50,width:200,height:200,background:"radial-gradient(circle,rgba(183,243,227,0.12) 0%,transparent 70%)",filter:"blur(35px)"}}/>
    <div style={{position:"absolute",bottom:60,left:-40,width:180,height:180,background:"radial-gradient(circle,rgba(255,158,140,0.08) 0%,transparent 70%)",filter:"blur(35px)"}}/>
    <div style={{position:"absolute",bottom:40,right:-30,width:160,height:160,background:"radial-gradient(circle,rgba(245,225,200,0.10) 0%,transparent 70%)",filter:"blur(30px)"}}/>
  </div>;
}

function Btn({children,onClick,disabled,variant="primary",style:sx}){
  const pri=variant==="primary";
  return <Pressable onClick={onClick} disabled={disabled} hapticStyle={pri?"medium":"light"} scaleDown={0.955}
    glowOnPress={pri&&!disabled?C.peachShadow:null}
    style={{width:"100%",padding:pri?"17px 24px":"12px 24px",borderRadius:100,border:"none",
      background:pri?(disabled?`${C.peach}66`:C.peach):"transparent",
      color:pri?"#FFF":C.grayLight,fontFamily:F.d,fontWeight:600,fontSize:pri?16:14,
      boxShadow:pri&&!disabled?`0 4px 20px ${C.peachShadow}`:"none",
      opacity:disabled?0.5:1,...sx}}>{children}</Pressable>;
}

function MintBtn({children,onClick,style:sx}){
  return <Pressable onClick={onClick} hapticStyle="medium" scaleDown={0.955}
    glowOnPress="rgba(52,211,153,0.40)"
    style={{width:"100%",padding:"13px 0",borderRadius:100,border:"none",
      background:"linear-gradient(135deg,#34D399,#4FD1A5)",color:"#FFF",fontFamily:F.d,fontWeight:700,fontSize:14,
      boxShadow:"0 3px 14px rgba(52,211,153,0.28)",...sx}}>{children}</Pressable>;
}

function PeachCTAInline({children,onClick,style:sx}){
  return <Pressable onClick={onClick} hapticStyle="medium" scaleDown={0.96}
    glowOnPress="rgba(255,127,106,0.40)"
    style={{width:"100%",padding:"14px 0",borderRadius:100,border:"none",
      background:C.peachGrad,color:"#FFF",fontFamily:F.d,fontWeight:700,fontSize:15,
      boxShadow:"0 4px 16px rgba(255,127,106,0.28)",...sx}}>{children}</Pressable>;
}

function SendButton({onClick,active}){
  const [popped,setPopped]=useState(false);
  const handle=()=>{if(active){haptic("success");setPopped(true);setTimeout(()=>setPopped(false),400);onClick&&onClick()}};
  return <button onClick={handle} style={{width:38,height:38,borderRadius:19,border:"none",cursor:active?"pointer":"default",
    background:active?"linear-gradient(135deg,#34D399,#4FD1A5)":"#E5E7EB",
    display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
    boxShadow:active?"0 2px 10px rgba(52,211,153,0.30)":"none",
    transition:"all 0.25s ease",
    animation:popped?"sendPop 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards":"none"}}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active?"#FFF":"#9CA3AF"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2z"/></svg>
  </button>;
}

function SelectCard({emoji,label,desc,selected,onClick,style:sx}){
  return <Pressable onClick={onClick} scaleDown={0.975} hapticStyle="light"
    style={{width:"100%",display:"flex",alignItems:"center",gap:14,padding:"16px 18px",borderRadius:16,
      background:selected?C.mintLight:C.surface,border:`1.5px solid ${selected?C.mint:C.grayBorder}`,textAlign:"left",...sx}}>
    <span style={{fontSize:26,lineHeight:1,flexShrink:0}}>{emoji}</span>
    <div style={{flex:1}}><div style={{fontFamily:F.d,fontWeight:600,fontSize:15,color:C.charcoal,lineHeight:1.3}}>{label}</div>
      {desc&&<div style={{fontFamily:F.b,fontSize:13,color:C.gray,marginTop:3,lineHeight:1.3}}>{desc}</div>}</div>
    {selected&&<div style={{width:22,height:22,borderRadius:11,background:C.mint,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>}
  </Pressable>;
}

/* Nova Smart Suggestion Card — with press interaction */
function NovaSuggestionCard({suggestion,onAction,style:sx}){
  if(!suggestion) return null;
  const isComplete = !suggestion.actionId;
  return <PressableCard onClick={suggestion.actionId?()=>onAction&&onAction(suggestion.actionId):undefined}
    disabled={isComplete}
    style={{background:"linear-gradient(135deg,rgba(52,211,153,0.06) 0%,rgba(167,243,208,0.08) 100%)",borderRadius:20,padding:"16px 18px",
      border:"1px solid rgba(52,211,153,0.15)",display:"flex",gap:14,alignItems:"flex-start",boxShadow:"0 1px 8px rgba(52,211,153,0.06)",...sx}}>
    <div style={{width:40,height:40,borderRadius:12,background:"linear-gradient(135deg,#A7F3D0,#34D399)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
      <span style={{fontSize:18}}>{suggestion.emoji}</span></div>
    <div style={{flex:1,minWidth:0}}>
      <p style={{fontFamily:F.d,fontWeight:600,fontSize:11.5,color:C.mint,margin:"0 0 4px",textTransform:"uppercase",letterSpacing:"0.04em"}}>{BRAND.assistant} suggests</p>
      <p style={{fontFamily:F.b,fontSize:13.5,color:C.charcoal,lineHeight:1.45,margin:0}}>{suggestion.text}</p>
      {suggestion.next && !isComplete && <div style={{marginTop:10,padding:"8px 16px",borderRadius:100,display:"inline-block",
        background:C.mint,color:"#FFF",fontFamily:F.d,fontWeight:600,fontSize:12.5,boxShadow:"0 2px 8px rgba(52,211,153,0.25)"}}>
        {suggestion.next} →</div>}
      {isComplete && <p style={{fontFamily:F.b,fontSize:12,color:C.mint,margin:"6px 0 0",fontWeight:600}}>🎉 Journey complete!</p>}
    </div>
  </PressableCard>;
}

/* ── Bottom Nav with bounce + haptic ── */
const NAV=[{id:"home",label:"Home",d:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1"},
  {id:"chat",label:"Chat",d:"M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"},
  {id:"roadmap",label:"Roadmap",d:"M22 12l-4 0-3 9-6-18-3 9-4 0"},
  {id:"tools",label:"Tools",d:"M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"},
  {id:"profile",label:"Profile",d:"M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 110 8 4 4 0 010-8z"}];

function BottomNav({active,onNav}){
  const [tapped,setTapped]=useState(null);
  const handleTap=(id)=>{
    if(id!==active){haptic("light");setTapped(id);setTimeout(()=>setTapped(null),450);}
    onNav(id);
  };
  return <div style={{position:"absolute",bottom:0,left:0,right:0,zIndex:20,background:"rgba(255,255,255,0.92)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",borderTop:"1px solid rgba(0,0,0,0.04)",padding:"8px 12px 22px",display:"flex",justifyContent:"space-around",alignItems:"center"}}>
    {NAV.map(n=>{const a=active===n.id;const justTapped=tapped===n.id;
      return <button key={n.id} onClick={()=>handleTap(n.id)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"4px 8px",minWidth:48,
        animation:justTapped?"navBounce 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards":"none",
        transition:"transform 0.15s ease"}}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill={a&&n.id==="home"?C.mint:"none"} stroke={a?C.mint:"#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{transition:"transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",transform:a?"scale(1.1)":"scale(1)"}}><path d={n.d}/></svg>
        <span style={{fontFamily:F.b,fontSize:10.5,fontWeight:a?600:400,color:a?C.mint:"#9CA3AF",transition:"color 0.2s ease"}}>{n.label}</span>
        {a&&<div style={{width:4,height:4,borderRadius:2,background:C.mint,marginTop:1}}/>}
      </button>})}</div>;
}

/* ═══════════════════════════════════════════════════
   ONBOARDING (5 steps)
   ═══════════════════════════════════════════════════ */
function OnboardingFlow({onComplete}){
  const [step,setStep]=useState(0);
  const [d,setD]=useState({name:"",country:"",userType:"",intents:[]});
  const [trans,setTrans]=useState(false);const [dir,setDir]=useState("f");
  const go=(t,direction="f")=>{setDir(direction);setTrans(true);setTimeout(()=>{setStep(t);setTrans(false)},300)};
  const next=()=>go(step+1,"f"); const back=()=>go(step-1,"b");
  const finish=async()=>{
    const profile={name:d.name.trim(),country:d.country,userType:d.userType,goals:d.intents,arrivalDate:new Date().toISOString().slice(0,10)};
    const missions=MISSIONS_ALL.filter(m=>m.for.includes(d.userType)).map((m,i)=>({...m,status:i===0?"current":"locked"}));
    await DB.set("nn-profile",profile); await DB.set("nn-missions",missions);
    await DB.set("nn-onboarded",true); await DB.set("nn-chat",[]);
    onComplete(profile,missions);
  };

  // Screen 1: Welcome — animated Credova intro
  const S1=()=>{
    const [logoReady,setLogoReady]=useState(false);
    return <SkyBg><div style={{display:"flex",flexDirection:"column",alignItems:"center",height:"100%",padding:"80px 28px 40px"}}>

      {/* Animated logo entrance */}
      <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <AnimatedCredovaIntro size={140} onComplete={()=>setLogoReady(true)}/>
      </div>

      {/* Content reveals after logo settles */}
      <div style={{marginTop:32,opacity:logoReady?1:0,transform:logoReady?"translateY(0)":"translateY(18px)",transition:"opacity 0.6s cubic-bezier(0.4,0,0.2,1) 0.1s, transform 0.6s cubic-bezier(0.4,0,0.2,1) 0.1s"}}>
        <h1 style={{fontFamily:F.d,fontWeight:700,fontSize:28,color:C.charcoal,textAlign:"center",margin:0}}>Welcome to {BRAND.name}</h1>
      </div>

      <div style={{marginTop:14,opacity:logoReady?1:0,transform:logoReady?"translateY(0)":"translateY(14px)",transition:"opacity 0.6s cubic-bezier(0.4,0,0.2,1) 0.3s, transform 0.6s cubic-bezier(0.4,0,0.2,1) 0.3s"}}>
        <p style={{fontFamily:F.b,fontSize:16,color:C.gray,textAlign:"center",lineHeight:1.55,maxWidth:280,margin:"0 auto"}}>{BRAND.tagline}<br/>No jargon. No pressure. Just clarity.</p>
      </div>

      <div style={{flex:1}}/>

      <div style={{width:"100%",opacity:logoReady?1:0,transform:logoReady?"translateY(0)":"translateY(12px)",transition:"opacity 0.6s cubic-bezier(0.4,0,0.2,1) 0.5s, transform 0.6s cubic-bezier(0.4,0,0.2,1) 0.5s"}}>
        <Btn onClick={next}>Let's get started</Btn>
        <p style={{fontFamily:F.b,fontSize:13,color:C.grayLight,textAlign:"center",marginTop:14}}>Takes about 3 minutes · Skip anytime</p>
      </div>
    </div></SkyBg>};

  // Screen 2: Name + Country
  const S2=()=>{const [sp,setSp]=useState(false);const [sr,setSr]=useState("");const fl=COUNTRIES.filter(c=>c.name.toLowerCase().includes(sr.toLowerCase()));const sel=COUNTRIES.find(c=>c.code===d.country);
    return <SkyBg intensity={0.85}><div style={{display:"flex",flexDirection:"column",height:"100%",padding:"12px 28px 40px"}}>
      <button onClick={back} style={{position:"absolute",top:14,left:8,zIndex:10,width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",background:"none",border:"none",cursor:"pointer"}}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke={C.gray} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      <div style={{paddingTop:4}}><div style={{width:"100%",height:4,borderRadius:2,background:C.grayBorder,overflow:"hidden"}}><div style={{height:"100%",borderRadius:2,background:C.mint,width:"20%",transition:"width 0.6s ease"}}/></div></div>
      <div style={{paddingTop:28}}/>
      <h2 style={{fontFamily:F.d,fontWeight:700,fontSize:26,color:C.charcoal,margin:0}}>What should we call you?</h2>
      <p style={{fontFamily:F.b,fontSize:15,color:C.gray,margin:"8px 0 22px"}}>Just a first name — we like to keep things friendly.</p>
      <input type="text" placeholder="Your first name" value={d.name} onChange={e=>setD(s=>({...s,name:e.target.value}))}
        style={{width:"100%",padding:"16px 20px",borderRadius:14,fontSize:16,fontFamily:F.b,color:C.charcoal,border:`1.5px solid ${C.grayBorder}`,outline:"none",background:C.white,boxSizing:"border-box"}}
        onFocus={e=>{e.target.style.borderColor=C.mint;e.target.style.boxShadow=`0 0 0 3px rgba(52,211,153,0.12)`}} onBlur={e=>{e.target.style.borderColor=C.grayBorder;e.target.style.boxShadow="none"}}/>
      <h3 style={{fontFamily:F.d,fontWeight:600,fontSize:18,color:C.charcoal,margin:"30px 0 0"}}>Where are you coming from?</h3>
      <button onClick={()=>setSp(true)} style={{width:"100%",padding:"16px 20px",borderRadius:14,fontSize:16,fontFamily:F.b,color:sel?C.charcoal:C.grayLight,border:`1.5px solid ${C.grayBorder}`,background:C.white,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",justifyContent:"space-between",boxSizing:"border-box",marginTop:16}}>
        <span>{sel?`${sel.flag}  ${sel.name}`:"Select your country"}</span><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6L8 10L12 6" stroke={C.grayLight} strokeWidth="2" strokeLinecap="round"/></svg></button>
      {sp&&<div style={{position:"absolute",inset:0,zIndex:50,background:"rgba(0,0,0,0.25)",display:"flex",flexDirection:"column",justifyContent:"flex-end"}} onClick={()=>setSp(false)}>
        <div onClick={e=>e.stopPropagation()} style={{background:"#FFF",borderRadius:"24px 24px 0 0",maxHeight:"65%",display:"flex",flexDirection:"column",padding:"20px 20px 0"}}>
          <div style={{width:40,height:4,borderRadius:2,background:C.grayBorder,margin:"0 auto 16px"}}/>
          <input type="text" placeholder="Search country..." value={sr} onChange={e=>setSr(e.target.value)} autoFocus style={{width:"100%",padding:"14px 16px",borderRadius:12,fontSize:15,fontFamily:F.b,border:`1.5px solid ${C.grayBorder}`,outline:"none",marginBottom:12,boxSizing:"border-box"}}/>
          <div style={{overflowY:"auto",flex:1,paddingBottom:20}}>{fl.map(c=><button key={c.code} onClick={()=>{setD(s=>({...s,country:c.code}));setSp(false);setSr("")}}
            style={{width:"100%",padding:"14px 16px",display:"flex",alignItems:"center",gap:12,background:d.country===c.code?C.mintLight:"transparent",border:"none",borderRadius:12,cursor:"pointer",fontSize:15,fontFamily:F.b,color:C.charcoal,textAlign:"left"}}>
            <span style={{fontSize:22}}>{c.flag}</span><span>{c.name}</span></button>)}</div></div></div>}
      <div style={{flex:1}}/><Btn onClick={next} disabled={!d.name.trim()}>Continue</Btn>
      <p style={{fontFamily:F.b,fontSize:13,color:C.grayLight,textAlign:"center",marginTop:14}}>🔒 Your info stays on your device.</p>
    </div></SkyBg>};

  // Screen 3: User Type
  const S3=()=><SkyBg intensity={0.8}><div style={{display:"flex",flexDirection:"column",height:"100%",padding:"12px 28px 40px"}}>
    <button onClick={back} style={{position:"absolute",top:14,left:8,zIndex:10,width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",background:"none",border:"none",cursor:"pointer"}}><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke={C.gray} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
    <div style={{paddingTop:4}}><div style={{width:"100%",height:4,borderRadius:2,background:C.grayBorder,overflow:"hidden"}}><div style={{height:"100%",borderRadius:2,background:C.mint,width:"40%",transition:"width 0.6s ease"}}/></div></div>
    <div style={{paddingTop:28}}/>
    <h2 style={{fontFamily:F.d,fontWeight:700,fontSize:26,color:C.charcoal,margin:0}}>What brings you to Canada?</h2>
    <p style={{fontFamily:F.b,fontSize:15,color:C.gray,margin:"8px 0 0"}}>This helps us personalize your financial roadmap.</p>
    <div style={{marginTop:24,display:"flex",flexDirection:"column",gap:12}}>
      {[{id:"student",emoji:"🎓",label:"I'm a student",desc:"Studying at a college or university"},
        {id:"worker",emoji:"💼",label:"I'm a worker",desc:"Employed or looking for work"}].map(i=>
        <SelectCard key={i.id} emoji={i.emoji} label={i.label} desc={i.desc} selected={d.userType===i.id} onClick={()=>setD(s=>({...s,userType:i.id}))} style={{padding:"20px 18px"}}/>)}
    </div><div style={{flex:1}}/><Btn onClick={next} disabled={!d.userType}>Continue</Btn>
  </div></SkyBg>;

  // Screen 4: Goals
  const S4=()=>{const toggle=id=>setD(s=>({...s,intents:s.intents.includes(id)?s.intents.filter(i=>i!==id):[...s.intents,id]}));
    return <SkyBg intensity={0.75}><div style={{display:"flex",flexDirection:"column",height:"100%",padding:"12px 28px 40px"}}>
      <button onClick={back} style={{position:"absolute",top:14,left:8,zIndex:10,width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",background:"none",border:"none",cursor:"pointer"}}><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke={C.gray} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      <div style={{paddingTop:4}}><div style={{width:"100%",height:4,borderRadius:2,background:C.grayBorder,overflow:"hidden"}}><div style={{height:"100%",borderRadius:2,background:C.mint,width:"60%",transition:"width 0.6s ease"}}/></div></div>
      <div style={{paddingTop:28}}/>
      <h2 style={{fontFamily:F.d,fontWeight:700,fontSize:26,color:C.charcoal,margin:0}}>What brought you to {BRAND.name}?</h2>
      <p style={{fontFamily:F.b,fontSize:15,color:C.gray,margin:"8px 0 0"}}>Pick as many as you like — no wrong answers.</p>
      <div style={{marginTop:22,display:"flex",flexDirection:"column",gap:10,flex:1,overflowY:"auto",paddingBottom:12}}>
        {INTENTS.map(i=><SelectCard key={i.id} emoji={i.emoji} label={i.label} desc={i.desc} selected={d.intents.includes(i.id)} onClick={()=>toggle(i.id)}/>)}
      </div><Btn onClick={next} disabled={d.intents.length===0}>Continue</Btn>
    </div></SkyBg>};

  // Screen 5: Success
  const S5=()=>{const [ck,setCk]=useState(false);useEffect(()=>{setTimeout(()=>setCk(true),800)},[]);const nm=d.name?.trim()||"";
    return <div style={{width:"100%",height:"100%",background:`radial-gradient(circle at 50% 40%,${C.mintSoft} 0%,transparent 60%),linear-gradient(180deg,#F0F9FF 0%,#FFF 100%)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 28px"}}>
      <FadeIn delay={200}><div style={{width:120,height:120,borderRadius:60,background:C.mintLight,border:`3px solid ${C.mint}`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 40px ${C.mintSoft}`}}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M12 24L21 33L36 15" stroke={C.mint} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="50" strokeDashoffset={ck?0:50} style={{transition:"stroke-dashoffset 0.8s ease-out"}}/></svg></div></FadeIn>
      <FadeIn delay={600} style={{marginTop:32}}><h1 style={{fontFamily:F.d,fontWeight:700,fontSize:28,color:C.charcoal,textAlign:"center",margin:0}}>{nm?`You're all set, ${nm}!`:"You're all set!"}</h1></FadeIn>
      <FadeIn delay={800} style={{marginTop:14}}><p style={{fontFamily:F.b,fontSize:16,color:C.gray,textAlign:"center",lineHeight:1.55,maxWidth:280,margin:"0 auto"}}>{BRAND.name} is ready to help you feel confident with money in Canada.</p></FadeIn>
      <FadeIn delay={1100} style={{marginTop:48,width:"100%"}}><Btn onClick={finish}>Enter {BRAND.name}</Btn></FadeIn>
    </div>};

  const screens=[<S1/>,<S2/>,<S3/>,<S4/>,<S5/>];
  return <div style={{width:"100%",height:"100%",position:"relative"}}>
    <div style={{position:"absolute",inset:0,opacity:trans?0:1,transform:trans?(dir==="f"?"translateX(-6%)":"translateX(6%)"):"translateX(0)",transition:"opacity 0.3s ease,transform 0.3s ease"}}>{screens[step]}</div></div>;
}

/* ═══════════════════════════════════════════════════
   HOME SCREEN
   ═══════════════════════════════════════════════════ */
function HomeScreen({profile,missions,onStartMission}){
  const nm=profile.name||"there";const done=missions.filter(m=>m.status==="done").length;const total=missions.length;
  const pct=total>0?Math.round((done/total)*100):0;const cur=missions.find(m=>m.status==="current");
  const circ=2*Math.PI*68;const [ra,setRa]=useState(0);useEffect(()=>{setTimeout(()=>setRa(pct),500)},[pct]);
  const QT=[{icon:<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4FD1A5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M3 10h18"/><path d="M12 3l9 7H3z"/><path d="M5 10v8"/><path d="M9 10v8"/><path d="M15 10v8"/><path d="M19 10v8"/></svg>,label:"Open Bank\nAccount",color:C.mint},
    {icon:<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20"/><path d="M6 15h4"/></svg>,label:"Credit\nReport",color:C.blue},
    {icon:<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,label:"Remittance\nTips",color:C.purple}];
  return <><Glow/><div style={{position:"relative",zIndex:1,height:"100%",overflowY:"auto",overflowX:"hidden",paddingBottom:90}}>
    <FadeIn delay={200} style={{padding:"24px 28px 0"}}><h1 style={{fontFamily:F.d,fontWeight:700,fontSize:27,color:C.charcoal,margin:0}}>Hey {nm}!</h1><p style={{fontFamily:F.b,fontSize:15,color:C.gray,margin:"6px 0 0"}}>Welcome back ✨</p></FadeIn>
    <FadeIn delay={400} style={{display:"flex",justifyContent:"center",padding:"28px 0 8px"}}><div style={{position:"relative",width:172,height:172,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{position:"absolute",inset:-16,borderRadius:"50%",background:"radial-gradient(circle,rgba(79,209,165,0.10) 0%,transparent 65%)",filter:"blur(12px)"}}/>
      <svg width="172" height="172" viewBox="0 0 172 172" style={{position:"absolute",transform:"rotate(-90deg)"}}>
        <circle cx="86" cy="86" r="68" fill="none" stroke="#E5E7EB" strokeWidth="7" opacity=".5"/>
        <circle cx="86" cy="86" r="68" fill="none" stroke={C.mint} strokeWidth="8" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ-(ra/100)*circ} style={{transition:"stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)",filter:"drop-shadow(0 0 8px rgba(79,209,165,0.30))"}}/></svg>
      <div style={{position:"relative",textAlign:"center",zIndex:2}}><div style={{fontFamily:F.d,fontWeight:700,fontSize:28,color:C.charcoal,lineHeight:1}}>{pct}%</div><div style={{fontFamily:F.b,fontSize:12,color:C.gray,marginTop:5,fontWeight:500}}>{done} of {total} done</div></div>
    </div></FadeIn>
    {cur&&<FadeIn delay={650} style={{padding:"20px 24px 0"}}><div style={{background:"#FFF",borderRadius:22,padding:"22px 22px 20px",boxShadow:"0 2px 20px rgba(0,0,0,0.045)",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:24,right:24,height:3,borderRadius:"0 0 3px 3px",background:"linear-gradient(90deg,#4FD1A5,#34D399,#B7F3E3)"}}/>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><span style={{fontFamily:F.d,fontWeight:700,fontSize:13,color:C.mint,textTransform:"uppercase",letterSpacing:"0.06em"}}>Today's Mission</span><span style={{fontFamily:F.b,fontSize:11.5,color:C.grayLight,background:"#F3F4F6",padding:"3px 9px",borderRadius:100,fontWeight:500}}>Day {cur.day}</span></div>
      <div style={{display:"flex",gap:14,alignItems:"flex-start"}}><div style={{width:44,height:44,borderRadius:14,flexShrink:0,background:C.mintLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{cur.icon}</div>
        <div style={{flex:1}}><h3 style={{fontFamily:F.d,fontWeight:700,fontSize:16.5,color:C.charcoal,margin:0,lineHeight:1.3}}>{cur.title}</h3><p style={{fontFamily:F.b,fontSize:13.5,color:C.gray,margin:"6px 0 0",lineHeight:1.4}}>{cur.desc}</p></div></div>
      <PeachCTAInline onClick={()=>onStartMission(cur.id)}>Start Now</PeachCTAInline>
    </div></FadeIn>}
    <FadeIn delay={850} style={{padding:"24px 24px 0"}}><p style={{fontFamily:F.d,fontWeight:600,fontSize:14,color:C.gray,margin:"0 0 14px 2px"}}>Quick Tools</p>
      <div style={{display:"flex",gap:12}}>{QT.map((t,i)=><div key={i} style={{flex:1,background:"#FFF",borderRadius:18,padding:"18px 8px 14px",boxShadow:"0 1px 10px rgba(0,0,0,0.035)",display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
        <div style={{width:48,height:48,borderRadius:14,background:`${t.color}10`,display:"flex",alignItems:"center",justifyContent:"center"}}>{t.icon}</div>
        <span style={{fontFamily:F.b,fontSize:12,fontWeight:500,color:C.charcoal,textAlign:"center",lineHeight:1.3,whiteSpace:"pre-line"}}>{t.label}</span></div>)}</div></FadeIn>
    {(()=>{const sg=getSmartSuggestion(missions); return sg ? (
      <FadeIn delay={1000} style={{padding:"22px 24px 0"}}><NovaSuggestionCard suggestion={sg} onAction={onStartMission}/></FadeIn>
    ) : (
      <FadeIn delay={1000} style={{padding:"22px 24px 0"}}><div style={{background:"linear-gradient(135deg,#ECFDF5 0%,#F0FDFA 100%)",borderRadius:18,padding:"16px 18px",border:"1px solid rgba(52,211,153,0.15)",display:"flex",gap:12,alignItems:"center"}}>
        <span style={{fontSize:24}}>💡</span><div><p style={{fontFamily:F.d,fontWeight:600,fontSize:13.5,color:C.charcoal,margin:0}}>Did you know?</p><p style={{fontFamily:F.b,fontSize:12.5,color:C.gray,margin:"4px 0 0",lineHeight:1.4}}>Building credit early can save you thousands on your first car or apartment in Canada.</p></div></div></FadeIn>
    )})()}
  </div></>;
}

/* ═══════════════════════════════════════════════════
   CHAT SCREEN
   ═══════════════════════════════════════════════════ */
function ChatScreen({profile,missions,chatHistory,setChatHistory,prefill}){
  const nm=profile.name||"there";
  const donePct = missions?.length>0?Math.round(missions.filter(m=>m.status==="done").length/missions.length*100):0;
  const current = (missions||[]).find(m=>m.status==="current");
  const [msgs,setMsgs]=useState(()=>chatHistory&&chatHistory.length>0?chatHistory:[{from:"nova",text:`Hi ${nm} 👋\nI'm ${BRAND.assistantFull} — your financial guide in Canada.\n${profile.userType==="student"?"Since you're studying here, I can help with student banking, budgeting, and credit.":"I can help with banking, credit, taxes, and more."}\n${donePct>0?`You're ${donePct}% through your financial journey — nice progress! `:""}${current?`Your current mission: "${current.title}".`:""}\nAsk me anything — no question is too small.`,id:"g"}]);
  const [input,setInput]=useState(prefill||"");const [typing,setTyping]=useState(false);const chatRef=useRef(null);

  // Dynamic suggestions based on mission progress and user type
  const dynamicSuggs = (()=>{
    const base = [];
    const doneIds = new Set((missions||[]).filter(m=>m.status==="done").map(m=>m.id));
    if(current) base.push(`What should I know about "${current.title}"?`);
    if(!doneIds.has(4)&&!doneIds.has(5)) base.push("How do credit scores work in Canada?");
    else if(doneIds.has(4)&&!doneIds.has(5)) base.push("How do I apply for my first credit card?");
    if(!doneIds.has(2)) base.push("What's the best bank account for newcomers?");
    else base.push("How do I use Interac e-Transfer?");
    if(profile?.userType==="student"&&!doneIds.has(11)) base.push("How should I budget as a student?");
    else if(!doneIds.has(9)) base.push("How can I send money home cheaply?");
    return base.slice(0,3);
  })();
  const suggs=dynamicSuggs;
  const showS=msgs.length===1&&!prefill;
  const scroll=()=>{if(chatRef.current)setTimeout(()=>{chatRef.current.scrollTop=chatRef.current.scrollHeight},50)};
  const send=(text)=>{if(!text.trim())return;const um={from:"user",text:text.trim(),id:Date.now()};const nx=[...msgs,um];setMsgs(nx);setInput("");setTyping(true);scroll();
    setTimeout(()=>{const r=novaRespond(text,profile,missions);const full=[...nx,{from:"nova",text:r,id:Date.now()+1}];setMsgs(full);setTyping(false);scroll();setChatHistory(full)},1000+Math.random()*800)};
  useEffect(()=>{if(prefill)setTimeout(()=>send(prefill),600)},[]);
  const [gp,setGp]=useState(0);useEffect(()=>{const iv=setInterval(()=>setGp(p=>(p+1)%360),50);return()=>clearInterval(iv)},[]);const go=0.35+Math.sin(gp*Math.PI/180)*0.2;

  return <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",background:"#FAFAFA",position:"relative"}}>
    <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:0}}><div style={{position:"absolute",top:-30,left:-40,width:180,height:180,background:"radial-gradient(circle,rgba(79,209,165,0.08) 0%,transparent 70%)",filter:"blur(35px)"}}/></div>
    <div style={{padding:"16px 24px 14px",textAlign:"center",position:"relative",zIndex:2,borderBottom:"1px solid rgba(0,0,0,0.03)",background:"rgba(250,250,250,0.85)",backdropFilter:"blur(12px)"}}>
      <div style={{width:40,height:40,borderRadius:20,margin:"0 auto 8px",background:"radial-gradient(circle at 40% 35%,#A7F3D0,#34D399 50%,#059669 100%)",boxShadow:`0 0 ${16+go*10}px rgba(52,211,153,${go})`,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2C6.48 2 2 6 2 11c0 2.5 1.1 4.8 2.9 6.4L4 22l4.3-2.2c1.1.4 2.4.6 3.7.6 5.52 0 10-4 10-9S17.52 2 12 2z"/></svg></div>
      <h2 style={{fontFamily:F.d,fontWeight:700,fontSize:17,color:C.charcoal,margin:0,letterSpacing:"0.03em"}}>{BRAND.assistant.toUpperCase()}</h2>
      <p style={{fontFamily:F.b,fontSize:12,color:C.grayLight,margin:"2px 0 0"}}>{BRAND.assistantRole} · {BRAND.domain}</p></div>
    <div ref={chatRef} style={{flex:1,overflowY:"auto",padding:"16px 16px 8px",position:"relative",zIndex:1,display:"flex",flexDirection:"column",gap:10}}>
      {msgs.map((m,i)=><div key={m.id} style={{display:"flex",justifyContent:m.from==="user"?"flex-end":"flex-start",opacity:0,animation:`ci 0.35s ease-out ${i===msgs.length-1?"0.05s":"0s"} forwards`}}>
        {m.from==="nova"&&<div style={{width:28,height:28,borderRadius:14,flexShrink:0,marginRight:8,marginTop:2,background:"linear-gradient(135deg,#A7F3D0,#34D399)",display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2C6.48 2 2 6 2 11c0 2.5 1.1 4.8 2.9 6.4L4 22l4.3-2.2c1.1.4 2.4.6 3.7.6 5.52 0 10-4 10-9S17.52 2 12 2z"/></svg></div>}
        <div style={{maxWidth:"78%",padding:"12px 16px",borderRadius:m.from==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",
          background:m.from==="user"?C.peachGrad:"#E6F7F2",color:m.from==="user"?"#FFF":C.charcoal,fontFamily:F.b,fontSize:14,lineHeight:1.5,
          boxShadow:m.from==="user"?"0 2px 8px rgba(255,136,120,0.20)":"0 1px 6px rgba(0,0,0,0.04)",whiteSpace:"pre-line",wordBreak:"break-word"}}>
          {m.text.split(/(\*\*.*?\*\*)/).map((p,j)=>p.startsWith("**")&&p.endsWith("**")?<strong key={j}>{p.slice(2,-2)}</strong>:<span key={j}>{p}</span>)}</div></div>)}
      {typing&&<div style={{display:"flex",alignItems:"flex-end",gap:8,opacity:0,animation:"ci 0.3s ease-out forwards"}}><div style={{width:28,height:28,borderRadius:14,background:"linear-gradient(135deg,#A7F3D0,#34D399)",display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2C6.48 2 2 6 2 11c0 2.5 1.1 4.8 2.9 6.4L4 22l4.3-2.2c1.1.4 2.4.6 3.7.6 5.52 0 10-4 10-9S17.52 2 12 2z"/></svg></div>
        <div style={{padding:"14px 20px",borderRadius:"18px 18px 18px 4px",background:"#E6F7F2",display:"flex",gap:5}}>{[0,1,2].map(d=><div key={d} style={{width:7,height:7,borderRadius:"50%",background:C.mint,animation:`td 1.2s ease-in-out ${d*0.2}s infinite`}}/>)}</div></div>}
      {showS&&<div style={{display:"flex",flexDirection:"column",gap:8,marginTop:6,marginLeft:36}}>{suggs.map((q,i)=><button key={i} onClick={()=>send(q)} style={{padding:"10px 16px",borderRadius:100,border:`1.5px solid rgba(52,211,153,0.3)`,background:"rgba(255,255,255,0.8)",cursor:"pointer",fontFamily:F.b,fontSize:13,color:C.charcoal,textAlign:"left",opacity:0,animation:`ci 0.35s ease-out ${0.3+i*0.12}s forwards`}}>{q}</button>)}</div>}
    </div>
    <div style={{padding:"10px 14px 14px",position:"relative",zIndex:2,borderTop:"1px solid rgba(0,0,0,0.04)",background:"rgba(255,255,255,0.9)",backdropFilter:"blur(12px)"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,background:"#FFF",borderRadius:100,border:`1.5px solid ${C.grayBorder}`,padding:"5px 5px 5px 18px",boxShadow:"0 1px 8px rgba(0,0,0,0.04)"}}>
        <input type="text" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")send(input)}} placeholder={`Ask ${BRAND.assistant} anything...`}
          style={{flex:1,border:"none",outline:"none",background:"transparent",fontFamily:F.b,fontSize:14.5,color:C.charcoal,padding:"8px 0"}}/>
        <SendButton onClick={()=>send(input)} active={!!input.trim()}/></div></div>
    <style>{`@keyframes ci{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@keyframes td{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-5px);opacity:1}}`}</style>
  </div>;
}

/* ═══════════════════════════════════════════════════
   ROADMAP SCREEN
   ═══════════════════════════════════════════════════ */
function RoadmapTab({missions,onOpen}){
  const done=missions.filter(m=>m.status==="done").length;const total=missions.length;const pct=total>0?Math.round((done/total)*100):0;
  return <div style={{width:"100%",height:"100%",position:"relative",background:"#FAFAFA",overflow:"hidden"}}><Glow/>
    <div style={{position:"relative",zIndex:1,height:"100%",overflowY:"auto",overflowX:"hidden",paddingBottom:90}}>
      <FadeIn delay={100} style={{padding:"20px 28px 0"}}><h1 style={{fontFamily:F.d,fontWeight:700,fontSize:24,color:C.charcoal,margin:0}}>Your Financial Journey</h1><p style={{fontFamily:F.b,fontSize:14,color:C.gray,margin:"6px 0 0"}}>Step-by-step guidance for your first months in Canada</p></FadeIn>
      <FadeIn delay={250} style={{padding:"20px 28px 0"}}><div style={{background:"#FFF",borderRadius:18,padding:"16px 20px",boxShadow:"0 1px 12px rgba(0,0,0,0.04)"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontFamily:F.b,fontSize:13.5,color:C.charcoal,fontWeight:500}}>{pct}% complete</span><span style={{fontFamily:F.b,fontSize:12,color:C.grayLight}}>{done}/{total} steps</span></div>
        <div style={{width:"100%",height:8,borderRadius:4,background:"#E5E7EB",overflow:"hidden"}}><div style={{height:"100%",borderRadius:4,width:`${pct}%`,background:`linear-gradient(90deg,${C.mint},#4FD1A5)`,boxShadow:"0 0 12px rgba(52,211,153,0.30)",transition:"width 1s cubic-bezier(0.4,0,0.2,1)"}}/></div></div></FadeIn>
      {(()=>{const sg=getSmartSuggestion(missions); return sg ? <FadeIn delay={320} style={{padding:"14px 28px 0"}}><NovaSuggestionCard suggestion={sg} onAction={onOpen}/></FadeIn> : null})()}
      <div style={{padding:"24px 20px 0 28px",position:"relative"}}>
        <div style={{position:"absolute",left:44,top:24,bottom:0,width:2,background:`linear-gradient(180deg,${C.mint} 0%,${C.mint} ${pct}%,#E5E7EB ${pct}%,#E5E7EB 100%)`,borderRadius:1,zIndex:0}}/>
        {missions.map((m,i)=>{const d=m.status==="done",cu=m.status==="current",lk=m.status==="locked";
          return <FadeIn key={m.id} delay={350+i*50}><div onClick={()=>!lk&&onOpen(m.id)} style={{display:"flex",gap:16,marginBottom:16,position:"relative",zIndex:1,cursor:lk?"default":"pointer"}}>
            <div style={{width:34,height:34,borderRadius:17,flexShrink:0,marginTop:2,display:"flex",alignItems:"center",justifyContent:"center",
              background:d?C.mint:cu?"#FFF":"#F3F4F6",border:cu?`2.5px solid ${C.mint}`:d?"none":"2px solid #E5E7EB",boxShadow:cu?`0 0 16px rgba(52,211,153,0.30)`:d?`0 0 8px rgba(52,211,153,0.15)`:"none"}}>
              {d?<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3.5 8L6.5 11L12.5 5" stroke="#FFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                :cu?<div style={{width:12,height:12,borderRadius:6,background:C.mint}}/>
                :<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M5 6l3-3 3 3" stroke="#C0C0C0" strokeWidth="1.8" strokeLinecap="round" opacity=".5"/></svg>}</div>
            <div style={{flex:1,borderRadius:18,padding:cu?"16px 18px":"14px 16px",background:cu?"#FFF":d?"rgba(255,255,255,0.7)":"rgba(255,255,255,0.5)",border:cu?`1.5px solid rgba(52,211,153,0.30)`:"1px solid rgba(0,0,0,0.03)",boxShadow:cu?"0 2px 16px rgba(52,211,153,0.12)":"none",opacity:lk?0.55:1,overflow:"hidden",position:"relative"}}>
              {cu&&<div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,#34D399,#4FD1A5,#B7F3E3)"}}/>}
              <div style={{display:"flex",justifyContent:"space-between",gap:8}}><div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4}}><span style={{fontSize:16}}>{m.icon}</span><h4 style={{fontFamily:F.d,fontWeight:d?600:700,fontSize:cu?15:14,color:d?C.gray:C.charcoal,margin:0,lineHeight:1.3}}>{m.title}</h4></div>
                <p style={{fontFamily:F.b,fontSize:12.5,color:d?C.grayLight:C.gray,margin:0,lineHeight:1.35}}>{m.desc}</p></div>
                <span style={{fontFamily:F.b,fontSize:11,fontWeight:500,color:d?C.mint:C.grayLight,background:d?C.mintLight:"#F3F4F6",padding:"3px 8px",borderRadius:100,whiteSpace:"nowrap",flexShrink:0,marginTop:2}}>{d?"Done":m.time}</span></div>
              {cu&&<MintBtn onClick={e=>{e.stopPropagation();onOpen(m.id)}} style={{marginTop:14}}>Start Mission</MintBtn>}</div>
          </div></FadeIn>})}
      </div></div></div>;
}

/* ═══════════════════════════════════════════════════
   MISSION DETAIL — Structured Learning Module
   ═══════════════════════════════════════════════════ */

function Collapsible({title,icon,children,defaultOpen=false,accentColor=C.charcoal}){
  const [open,setOpen]=useState(defaultOpen);
  return <div style={{background:"#FFF",borderRadius:18,overflow:"hidden",boxShadow:"0 1px 8px rgba(0,0,0,0.04)",border:`1px solid ${open?"rgba(52,211,153,0.18)":"rgba(0,0,0,0.03)"}`,transition:"border-color 0.3s ease",marginBottom:10}}>
    <button onClick={()=>setOpen(!open)} style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"16px 18px",background:"none",border:"none",cursor:"pointer",textAlign:"left"}}>
      {icon&&<span style={{fontSize:18,flexShrink:0}}>{icon}</span>}
      <span style={{fontFamily:F.d,fontWeight:600,fontSize:14.5,color:accentColor,flex:1,lineHeight:1.3}}>{title}</span>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{flexShrink:0,transform:open?"rotate(180deg)":"rotate(0)",transition:"transform 0.3s ease"}}>
        <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke={C.grayLight} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </button>
    <div style={{maxHeight:open?1200:0,overflow:"hidden",transition:"max-height 0.4s cubic-bezier(0.4,0,0.2,1)"}}>
      <div style={{padding:"0 18px 16px",borderTop:`1px solid ${C.grayBorder}`}}>
        <div style={{paddingTop:14}}>{children}</div>
      </div>
    </div>
  </div>;
}

function NovaTip({text,emoji="💡"}){
  return <div style={{display:"flex",gap:12,alignItems:"flex-start",padding:"14px 16px",borderRadius:16,
    background:"linear-gradient(135deg,rgba(52,211,153,0.06) 0%,rgba(167,243,208,0.08) 100%)",
    border:"1px solid rgba(52,211,153,0.12)",marginBottom:10}}>
    <div style={{width:32,height:32,borderRadius:10,background:"linear-gradient(135deg,#A7F3D0,#34D399)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
      <span style={{fontSize:15}}>{emoji}</span></div>
    <div style={{flex:1}}><p style={{fontFamily:F.d,fontWeight:600,fontSize:11.5,color:C.mint,margin:"0 0 3px",textTransform:"uppercase",letterSpacing:"0.05em"}}>{BRAND.assistant} Tip</p>
      <p style={{fontFamily:F.b,fontSize:13.5,color:C.charcoal,lineHeight:1.45,margin:0}}>{text}</p></div>
  </div>;
}

function MiniQuiz({quiz}){
  const [sel,setSel]=useState(null);
  const [submitted,setSubmitted]=useState(false);
  const correct = submitted && sel===quiz.correct;
  const wrong = submitted && sel!==quiz.correct;

  return <div style={{background:"#FFF",borderRadius:20,padding:"20px 20px 18px",boxShadow:"0 1px 10px rgba(0,0,0,0.04)",border:`1.5px solid ${submitted?(correct?"rgba(52,211,153,0.4)":"rgba(239,68,68,0.25)"):C.grayBorder}`,transition:"border-color 0.3s ease"}}>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
      <div style={{width:28,height:28,borderRadius:8,background:"rgba(96,165,250,0.12)",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <svg width="15" height="15" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke={C.blue} strokeWidth="2"/><path d="M8 7.5c0-1.1.9-2 2-2s2 .9 2 2c0 .74-.4 1.38-1 1.73V10.5" stroke={C.blue} strokeWidth="1.8" strokeLinecap="round"/><circle cx="10" cy="13" r="0.8" fill={C.blue}/></svg>
      </div>
      <span style={{fontFamily:F.d,fontWeight:700,fontSize:13,color:C.blue,textTransform:"uppercase",letterSpacing:"0.04em"}}>Quick Check</span>
    </div>
    <p style={{fontFamily:F.d,fontWeight:600,fontSize:15,color:C.charcoal,lineHeight:1.35,margin:"0 0 14px"}}>{quiz.q}</p>
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {quiz.opts.map((o,i)=>{
        const isThis = sel===i;
        const isCorrectAnswer = i===quiz.correct;
        let bg=C.white, border=C.grayBorder, textCol=C.charcoal, iconBg="transparent";
        if(submitted){
          if(isCorrectAnswer){ bg="#ECFDF5"; border=C.mint; iconBg=C.mint; }
          else if(isThis && !isCorrectAnswer){ bg="#FEF2F2"; border="#EF4444"; iconBg="#EF4444"; }
        } else if(isThis){ bg=C.mintLight; border=C.mint; }
        return <button key={i} onClick={()=>{if(!submitted)setSel(i)}} disabled={submitted}
          style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"13px 14px",borderRadius:14,
            background:bg,border:`1.5px solid ${border}`,cursor:submitted?"default":"pointer",textAlign:"left",
            transition:"all 0.2s ease",opacity:submitted&&!isCorrectAnswer&&!isThis?0.45:1}}>
          <div style={{width:24,height:24,borderRadius:12,border:`2px solid ${submitted?(isCorrectAnswer?C.mint:isThis?"#EF4444":C.grayBorder):(isThis?C.mint:C.grayBorder)}`,
            display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,background:iconBg,transition:"all 0.2s ease"}}>
            {submitted && isCorrectAnswer && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            {submitted && isThis && !isCorrectAnswer && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 2.5L7.5 7.5M7.5 2.5L2.5 7.5" stroke="#FFF" strokeWidth="2" strokeLinecap="round"/></svg>}
            {!submitted && isThis && <div style={{width:10,height:10,borderRadius:5,background:C.mint}}/>}
          </div>
          <span style={{fontFamily:F.b,fontSize:14,color:textCol,lineHeight:1.3,flex:1}}>{o}</span>
        </button>;
      })}
    </div>
    {!submitted && sel!==null && <Pressable onClick={()=>setSubmitted(true)} hapticStyle="medium" scaleDown={0.96}
      glowOnPress="rgba(59,130,246,0.35)"
      style={{width:"100%",marginTop:14,padding:"12px 0",borderRadius:100,border:"none",
        background:"linear-gradient(135deg,#60A5FA,#3B82F6)",color:"#FFF",fontFamily:F.d,fontWeight:700,fontSize:14,
        boxShadow:"0 3px 12px rgba(59,130,246,0.25)"}}>
      Check Answer</Pressable>}
    {submitted && <div style={{marginTop:14,padding:"12px 14px",borderRadius:14,
      background:correct?"rgba(52,211,153,0.08)":"rgba(239,68,68,0.06)",
      border:`1px solid ${correct?"rgba(52,211,153,0.15)":"rgba(239,68,68,0.12)"}`}}>
      <p style={{fontFamily:F.d,fontWeight:600,fontSize:13,color:correct?C.mint:"#DC2626",margin:"0 0 4px"}}>
        {correct?"✓ Correct!":"✗ Not quite"}</p>
      <p style={{fontFamily:F.b,fontSize:13,color:C.gray,lineHeight:1.4,margin:0}}>{quiz.explain}</p>
    </div>}
  </div>;
}

function MissionDetail({mission,onBack,onComplete,onAskNova}){
  const done = mission.status==="done";
  const content = LEARN[mission.id];
  const totalSections = 3 + (content?.sections?.length||0) + (content?.quiz?1:0);
  const [stepsChecked, setStepsChecked] = useState(mission.steps.map(()=>done));
  const checkedCount = stepsChecked.filter(Boolean).length;
  const allChecked = checkedCount === mission.steps.length;
  const toggleStep = i => { if(!done) setStepsChecked(p=>{const n=[...p];n[i]=!n[i];return n}) };
  const scrollRef = useRef(null);

  // Reading progress
  const [scrollPct, setScrollPct] = useState(0);
  const handleScroll = e => {
    const el = e.target;
    const pct = el.scrollHeight <= el.clientHeight ? 100 : Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    setScrollPct(pct);
  };

  return <div style={{width:"100%",height:"100%",position:"relative",background:"#FAFAFA",overflow:"hidden"}}><Glow/>

    {/* Reading progress bar */}
    <div style={{position:"absolute",top:0,left:0,right:0,height:3,zIndex:10,background:"rgba(0,0,0,0.04)"}}>
      <div style={{height:"100%",background:`linear-gradient(90deg,${C.mint},#4FD1A5)`,width:`${scrollPct}%`,transition:"width 0.15s ease",borderRadius:"0 2px 2px 0"}}/>
    </div>

    <div ref={scrollRef} onScroll={handleScroll} style={{position:"relative",zIndex:1,height:"100%",overflowY:"auto",paddingBottom:50}}>

      {/* Header */}
      <div style={{padding:"18px 24px 0",display:"flex",alignItems:"center",gap:10}}>
        <button onClick={onBack} style={{width:40,height:40,borderRadius:12,border:"none",background:"#FFF",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 1px 6px rgba(0,0,0,0.06)",flexShrink:0}}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke={C.gray} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <div style={{flex:1,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <span style={{fontFamily:F.b,fontSize:12,color:C.grayLight,fontWeight:500,background:"#F3F4F6",padding:"3px 10px",borderRadius:100}}>Day {mission.day}</span>
          <span style={{fontFamily:F.b,fontSize:12,color:C.grayLight,fontWeight:500,background:"#F3F4F6",padding:"3px 10px",borderRadius:100}}>{mission.time}</span>
        </div>
        {done&&<span style={{fontFamily:F.b,fontSize:12,color:C.mint,background:C.mintLight,padding:"4px 12px",borderRadius:100,fontWeight:600,flexShrink:0}}>✓ Complete</span>}
      </div>

      {/* Title block */}
      <div style={{padding:"18px 24px 0"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
          <div style={{width:48,height:48,borderRadius:16,background:C.mintLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{mission.icon}</div>
          <h1 style={{fontFamily:F.d,fontWeight:700,fontSize:21,color:C.charcoal,margin:0,lineHeight:1.25,flex:1}}>{mission.title}</h1>
        </div>
      </div>

      {/* ── Section 1: Quick Overview ── */}
      <div style={{padding:"10px 24px 0"}}>
        <div style={{background:"linear-gradient(135deg,rgba(92,155,230,0.06),rgba(96,165,250,0.04))",borderRadius:18,padding:"18px 18px 16px",border:"1px solid rgba(96,165,250,0.10)"}}>
          <p style={{fontFamily:F.d,fontWeight:700,fontSize:13,color:C.blue,margin:"0 0 8px",textTransform:"uppercase",letterSpacing:"0.04em"}}>📖 Quick Overview</p>
          <p style={{fontFamily:F.b,fontSize:14.5,color:C.charcoal,lineHeight:1.55,margin:0}}>{content?.intro || mission.desc}</p>
        </div>
      </div>

      {/* ── Section 2: Why This Matters ── */}
      <div style={{padding:"14px 24px 0"}}>
        <div style={{background:"linear-gradient(135deg,#ECFDF5,#F0FDFA)",borderRadius:18,padding:"16px 18px",border:"1px solid rgba(52,211,153,0.12)"}}>
          <p style={{fontFamily:F.d,fontWeight:700,fontSize:13,color:C.mint,margin:"0 0 6px",textTransform:"uppercase",letterSpacing:"0.04em"}}>💡 Why This Matters</p>
          <p style={{fontFamily:F.b,fontSize:14,color:C.charcoal,lineHeight:1.5,margin:0}}>{mission.why}</p>
        </div>
      </div>

      {/* ── Section 3: Deep Knowledge (collapsible) ── */}
      {content?.sections && content.sections.length > 0 && (
        <div style={{padding:"18px 24px 0"}}>
          <p style={{fontFamily:F.d,fontWeight:700,fontSize:15,color:C.charcoal,margin:"0 0 12px"}}>📚 Deep Dive</p>
          {content.sections.map((s,i)=>
            <Collapsible key={i} title={s.title} defaultOpen={i===0}>
              <p style={{fontFamily:F.b,fontSize:14,color:C.gray,lineHeight:1.55,margin:0}}>{s.body}</p>
            </Collapsible>
          )}
        </div>
      )}

      {/* ── Section 4: Nova Tips ── */}
      {content?.tips && content.tips.length > 0 && (
        <div style={{padding:"14px 24px 0"}}>
          {content.tips.map((t,i)=><NovaTip key={i} text={t.text} emoji={t.emoji}/>)}
        </div>
      )}

      {/* ── Section 5: Action Steps (interactive checklist) ── */}
      <div style={{padding:"18px 24px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <p style={{fontFamily:F.d,fontWeight:700,fontSize:15,color:C.charcoal,margin:0}}>✅ Action Steps</p>
          <span style={{fontFamily:F.b,fontSize:12,color:allChecked?C.mint:C.grayLight,fontWeight:600,background:allChecked?C.mintLight:"#F3F4F6",padding:"3px 10px",borderRadius:100}}>{checkedCount}/{mission.steps.length}</span>
        </div>
        {/* Mini progress for steps */}
        <div style={{width:"100%",height:4,borderRadius:2,background:C.grayBorder,overflow:"hidden",marginBottom:14}}>
          <div style={{height:"100%",borderRadius:2,background:`linear-gradient(90deg,${C.mint},#4FD1A5)`,width:`${mission.steps.length>0?(checkedCount/mission.steps.length)*100:0}%`,transition:"width 0.4s ease"}}/>
        </div>
        {mission.steps.map((s,i)=>{
          const checked = stepsChecked[i];
          return <button key={i} onClick={()=>toggleStep(i)} disabled={done}
            style={{width:"100%",display:"flex",gap:12,alignItems:"flex-start",padding:"14px 16px",marginBottom:8,borderRadius:16,
              background:checked?"rgba(52,211,153,0.05)":"#FFF",
              border:`1.5px solid ${checked?"rgba(52,211,153,0.20)":"rgba(0,0,0,0.04)"}`,
              cursor:done?"default":"pointer",textAlign:"left",transition:"all 0.2s ease"}}>
            <div style={{width:26,height:26,borderRadius:8,flexShrink:0,marginTop:1,display:"flex",alignItems:"center",justifyContent:"center",
              background:checked?C.mint:C.white,border:`2px solid ${checked?C.mint:C.grayBorder}`,transition:"all 0.2s ease"}}>
              {checked&&<svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M3 7L6 10L11 4" stroke="#FFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <div style={{flex:1}}>
              <span style={{fontFamily:F.d,fontWeight:600,fontSize:11,color:C.grayLight,letterSpacing:"0.03em"}}>STEP {i+1}</span>
              <p style={{fontFamily:F.b,fontSize:14,color:checked?C.gray:C.charcoal,lineHeight:1.45,margin:"3px 0 0",
                textDecoration:checked&&!done?"line-through":"none",transition:"color 0.2s ease"}}>{s}</p>
            </div>
          </button>;
        })}
      </div>

      {/* ── Section 6: Mini Quiz ── */}
      {content?.quiz && (
        <div style={{padding:"18px 24px 0"}}>
          <p style={{fontFamily:F.d,fontWeight:700,fontSize:15,color:C.charcoal,margin:"0 0 12px"}}>🧠 Test Your Knowledge</p>
          <MiniQuiz quiz={content.quiz}/>
        </div>
      )}

      {/* ── Bottom CTAs ── */}
      <div style={{padding:"24px 24px 10px",display:"flex",flexDirection:"column",gap:10}}>
        {!done && <MintBtn onClick={onComplete} style={{opacity:allChecked?1:0.5,pointerEvents:allChecked?"auto":"none"}}>
          {allChecked ? "Mark as Complete ✓" : `Complete all ${mission.steps.length} steps first`}</MintBtn>}
        <Pressable onClick={onAskNova} hapticStyle="light" scaleDown={0.97}
          style={{width:"100%",padding:"13px 0",borderRadius:100,display:"flex",alignItems:"center",justifyContent:"center",gap:8,
            border:`1.5px solid rgba(52,211,153,0.3)`,background:"transparent",fontFamily:F.d,fontWeight:600,fontSize:14,color:C.mint}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.mint} strokeWidth="2" strokeLinecap="round"><path d="M12 2C6.48 2 2 6 2 11c0 2.5 1.1 4.8 2.9 6.4L4 22l4.3-2.2c1.1.4 2.4.6 3.7.6 5.52 0 10-4 10-9S17.52 2 12 2z"/></svg>
          Ask Nova about this
        </Pressable>
      </div>

    </div>
  </div>;
}

/* ═══════════════════════════════════════════════════
   TOOLS SCREEN — Financial Resource Hub
   ═══════════════════════════════════════════════════ */
const TOOL_CATS = ["All","Banking","Credit","Remittance","Taxes"];

function ToolDetailScreen({tool,onBack,onAskNova}){
  const scrollRef=useRef(null);const [scrollPct,setScrollPct]=useState(0);
  const handleScroll=e=>{const el=e.target;setScrollPct(el.scrollHeight<=el.clientHeight?100:Math.round((el.scrollTop/(el.scrollHeight-el.clientHeight))*100))};
  const [stepsChecked,setStepsChecked]=useState(tool.steps.map(()=>false));
  const checkedCount=stepsChecked.filter(Boolean).length;
  const toggleStep=i=>setStepsChecked(p=>{const n=[...p];n[i]=!n[i];return n});

  return <div style={{width:"100%",height:"100%",position:"relative",background:"#FAFAFA",overflow:"hidden"}}><Glow/>
    {/* Reading progress */}
    <div style={{position:"absolute",top:0,left:0,right:0,height:3,zIndex:10,background:"rgba(0,0,0,0.04)"}}>
      <div style={{height:"100%",background:`linear-gradient(90deg,${tool.color},${tool.color}cc)`,width:`${scrollPct}%`,transition:"width 0.15s ease",borderRadius:"0 2px 2px 0"}}/></div>

    <div ref={scrollRef} onScroll={handleScroll} style={{position:"relative",zIndex:1,height:"100%",overflowY:"auto",paddingBottom:50}}>

      {/* Header */}
      <div style={{padding:"18px 24px 0",display:"flex",alignItems:"center",gap:10}}>
        <button onClick={onBack} style={{width:40,height:40,borderRadius:12,border:"none",background:"#FFF",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 1px 6px rgba(0,0,0,0.06)",flexShrink:0}}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke={C.gray} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <span style={{fontFamily:F.b,fontSize:12,color:tool.color,background:`${tool.color}15`,padding:"4px 12px",borderRadius:100,fontWeight:600}}>{tool.cat}</span>
      </div>

      {/* Title */}
      <div style={{padding:"18px 24px 0"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:6}}>
          <div style={{width:52,height:52,borderRadius:18,background:`${tool.color}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0}}>{tool.icon}</div>
          <h1 style={{fontFamily:F.d,fontWeight:700,fontSize:21,color:C.charcoal,margin:0,lineHeight:1.25,flex:1}}>{tool.title}</h1>
        </div>
      </div>

      {/* Section 1: What This Is */}
      <div style={{padding:"16px 24px 0"}}>
        <div style={{background:"linear-gradient(135deg,rgba(92,155,230,0.06),rgba(96,165,250,0.04))",borderRadius:18,padding:"18px 18px 16px",border:"1px solid rgba(96,165,250,0.10)"}}>
          <p style={{fontFamily:F.d,fontWeight:700,fontSize:13,color:C.blue,margin:"0 0 8px",textTransform:"uppercase",letterSpacing:"0.04em"}}>📖 What This Is</p>
          <p style={{fontFamily:F.b,fontSize:14,color:C.charcoal,lineHeight:1.55,margin:0}}>{tool.what}</p>
        </div>
      </div>

      {/* Section 2: Why It Matters */}
      <div style={{padding:"12px 24px 0"}}>
        <div style={{background:"linear-gradient(135deg,#ECFDF5,#F0FDFA)",borderRadius:18,padding:"16px 18px",border:"1px solid rgba(52,211,153,0.12)"}}>
          <p style={{fontFamily:F.d,fontWeight:700,fontSize:13,color:C.mint,margin:"0 0 6px",textTransform:"uppercase",letterSpacing:"0.04em"}}>🇨🇦 Why This Matters in Canada</p>
          <p style={{fontFamily:F.b,fontSize:14,color:C.charcoal,lineHeight:1.5,margin:0}}>{tool.whyCA}</p>
        </div>
      </div>

      {/* Section 3: Step-by-Step Guide */}
      <div style={{padding:"18px 24px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <p style={{fontFamily:F.d,fontWeight:700,fontSize:15,color:C.charcoal,margin:0}}>📋 Step-by-Step Guide</p>
          <span style={{fontFamily:F.b,fontSize:12,color:checkedCount===tool.steps.length?C.mint:C.grayLight,fontWeight:600,background:checkedCount===tool.steps.length?C.mintLight:"#F3F4F6",padding:"3px 10px",borderRadius:100}}>{checkedCount}/{tool.steps.length}</span>
        </div>
        <div style={{width:"100%",height:4,borderRadius:2,background:C.grayBorder,overflow:"hidden",marginBottom:14}}>
          <div style={{height:"100%",borderRadius:2,background:`linear-gradient(90deg,${tool.color},${tool.color}cc)`,width:`${tool.steps.length>0?(checkedCount/tool.steps.length)*100:0}%`,transition:"width 0.4s ease"}}/></div>
        {tool.steps.map((s,i)=>{
          const checked=stepsChecked[i];
          return <button key={i} onClick={()=>toggleStep(i)} style={{width:"100%",display:"flex",gap:12,alignItems:"flex-start",padding:"14px 16px",marginBottom:8,borderRadius:16,
            background:checked?"rgba(52,211,153,0.05)":"#FFF",border:`1.5px solid ${checked?"rgba(52,211,153,0.20)":"rgba(0,0,0,0.04)"}`,cursor:"pointer",textAlign:"left",transition:"all 0.2s ease"}}>
            <div style={{width:26,height:26,borderRadius:8,flexShrink:0,marginTop:1,display:"flex",alignItems:"center",justifyContent:"center",
              background:checked?C.mint:C.white,border:`2px solid ${checked?C.mint:C.grayBorder}`,transition:"all 0.2s ease"}}>
              {checked&&<svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M3 7L6 10L11 4" stroke="#FFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <div style={{flex:1}}>
              <span style={{fontFamily:F.d,fontWeight:600,fontSize:11,color:C.grayLight,letterSpacing:"0.03em"}}>STEP {i+1}</span>
              <p style={{fontFamily:F.b,fontSize:14,color:checked?C.gray:C.charcoal,lineHeight:1.45,margin:"3px 0 0",
                textDecoration:checked?"line-through":"none",transition:"color 0.2s ease"}}>{s}</p>
            </div>
          </button>;
        })}
      </div>

      {/* Section 4: Nova Tip */}
      <div style={{padding:"14px 24px 0"}}>
        <NovaTip text={tool.tip} emoji={tool.tipEmoji}/>
      </div>

      {/* Section 5: Recommended Resources */}
      {tool.resources&&tool.resources.length>0&&<div style={{padding:"14px 24px 0"}}>
        <p style={{fontFamily:F.d,fontWeight:700,fontSize:15,color:C.charcoal,margin:"0 0 12px"}}>🔗 Recommended Services</p>
        {tool.resources.map((r,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",marginBottom:8,borderRadius:16,background:"#FFF",border:"1px solid rgba(0,0,0,0.04)",boxShadow:"0 1px 4px rgba(0,0,0,0.02)"}}>
            <div style={{width:36,height:36,borderRadius:10,background:`${tool.color}10`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:16}}>{tool.icon}</span></div>
            <div style={{flex:1,minWidth:0}}>
              <p style={{fontFamily:F.d,fontWeight:600,fontSize:14,color:C.charcoal,margin:0,lineHeight:1.25}}>{r.name}</p>
              <p style={{fontFamily:F.b,fontSize:12.5,color:C.gray,margin:"3px 0 0",lineHeight:1.3}}>{r.desc}</p>
            </div>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke={C.grayLight} strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
        ))}
      </div>}

      {/* Section 6: Action CTAs */}
      <div style={{padding:"22px 24px 10px",display:"flex",flexDirection:"column",gap:10}}>
        <Pressable hapticStyle="medium" scaleDown={0.96} glowOnPress={`${tool.color}50`}
          style={{width:"100%",padding:"14px 0",borderRadius:100,border:"none",
            background:`linear-gradient(135deg,${tool.color},${tool.color}dd)`,color:"#FFF",fontFamily:F.d,fontWeight:700,fontSize:14,
            boxShadow:`0 3px 14px ${tool.color}40`}}>
          {tool.actionLabel}</Pressable>
        <Pressable onClick={onAskNova} hapticStyle="light" scaleDown={0.97}
          style={{width:"100%",padding:"13px 0",borderRadius:100,display:"flex",alignItems:"center",justifyContent:"center",gap:8,
            border:`1.5px solid rgba(52,211,153,0.3)`,background:"transparent",fontFamily:F.d,fontWeight:600,fontSize:14,color:C.mint}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.mint} strokeWidth="2" strokeLinecap="round"><path d="M12 2C6.48 2 2 6 2 11c0 2.5 1.1 4.8 2.9 6.4L4 22l4.3-2.2c1.1.4 2.4.6 3.7.6 5.52 0 10-4 10-9S17.52 2 12 2z"/></svg>
          Ask Nova about this
        </Pressable>
      </div>

    </div>
  </div>;
}

function ToolsScreen({onAskNova}){
  const [sel,setSel]=useState(null);
  const [search,setSearch]=useState("");
  const [activeCat,setActiveCat]=useState("All");

  const tool=TOOLS_DATA.find(t=>t.id===sel);

  if(tool) return <ToolDetailScreen tool={tool} onBack={()=>setSel(null)} onAskNova={()=>onAskNova(tool.novaQ)}/>;

  const filtered=TOOLS_DATA.filter(t=>{
    const matchCat=activeCat==="All"||t.cat===activeCat;
    const matchSearch=!search.trim()||t.title.toLowerCase().includes(search.toLowerCase())||t.desc.toLowerCase().includes(search.toLowerCase())||t.cat.toLowerCase().includes(search.toLowerCase());
    return matchCat&&matchSearch;
  });

  return <div style={{width:"100%",height:"100%",position:"relative",background:"#FAFAFA",overflow:"hidden"}}><Glow/>
    <div style={{position:"relative",zIndex:1,height:"100%",overflowY:"auto",overflowX:"hidden",paddingBottom:90}}>
      <FadeIn delay={100} style={{padding:"20px 24px 0"}}>
        <h1 style={{fontFamily:F.d,fontWeight:700,fontSize:24,color:C.charcoal,margin:0}}>Financial Tools</h1>
        <p style={{fontFamily:F.b,fontSize:14,color:C.gray,margin:"6px 0 0"}}>Everything you need to get set up in Canada</p>
      </FadeIn>

      {/* Search bar */}
      <FadeIn delay={180} style={{padding:"16px 24px 0"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,background:"#FFF",borderRadius:14,border:`1.5px solid ${C.grayBorder}`,padding:"5px 14px",boxShadow:"0 1px 6px rgba(0,0,0,0.03)",transition:"border-color 0.2s ease"}}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="6" stroke={C.grayLight} strokeWidth="2"/><path d="M14 14l4 4" stroke={C.grayLight} strokeWidth="2" strokeLinecap="round"/></svg>
          <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tools..."
            style={{flex:1,border:"none",outline:"none",background:"transparent",fontFamily:F.b,fontSize:14.5,color:C.charcoal,padding:"9px 0"}}
            onFocus={e=>{e.target.parentElement.style.borderColor=C.mint}} onBlur={e=>{e.target.parentElement.style.borderColor=C.grayBorder}}/>
          {search&&<button onClick={()=>setSearch("")} style={{background:"none",border:"none",cursor:"pointer",padding:4,display:"flex"}}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke={C.grayLight} strokeWidth="2" strokeLinecap="round"/></svg></button>}
        </div>
      </FadeIn>

      {/* Category filters */}
      <FadeIn delay={250} style={{padding:"14px 24px 0"}}>
        <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>
          {TOOL_CATS.map(cat=>{
            const active=activeCat===cat;
            return <button key={cat} onClick={()=>setActiveCat(cat)} style={{padding:"8px 16px",borderRadius:100,border:`1.5px solid ${active?C.mint:C.grayBorder}`,
              background:active?C.mint:C.white,color:active?"#FFF":C.gray,fontFamily:F.b,fontSize:13,fontWeight:active?600:500,
              cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.2s ease",flexShrink:0,
              boxShadow:active?"0 2px 8px rgba(52,211,153,0.20)":"none"}}>{cat}</button>;
          })}
        </div>
      </FadeIn>

      {/* Tool cards */}
      <div style={{padding:"16px 24px 0",display:"flex",flexDirection:"column",gap:12}}>
        {filtered.length===0&&<div style={{padding:"40px 20px",textAlign:"center"}}>
          <span style={{fontSize:32,display:"block",marginBottom:12}}>🔍</span>
          <p style={{fontFamily:F.d,fontWeight:600,fontSize:16,color:C.charcoal,margin:"0 0 6px"}}>No tools found</p>
          <p style={{fontFamily:F.b,fontSize:14,color:C.grayLight,margin:0}}>Try a different search or category</p>
        </div>}
        {filtered.map((t,i)=>
          <FadeIn key={t.id} delay={300+i*70}>
            <PressableCard onClick={()=>setSel(t.id)}
              style={{width:"100%",display:"flex",alignItems:"center",gap:16,padding:"18px 20px",borderRadius:20,
                background:"#FFF",border:"none",boxShadow:"0 1px 10px rgba(0,0,0,0.04)",textAlign:"left",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",left:0,top:14,bottom:14,width:4,borderRadius:2,background:t.color}}/>
              <div style={{width:48,height:48,borderRadius:15,background:`${t.color}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{t.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <h4 style={{fontFamily:F.d,fontWeight:600,fontSize:15,color:C.charcoal,margin:0,lineHeight:1.3}}>{t.title}</h4>
                <p style={{fontFamily:F.b,fontSize:12.5,color:C.gray,margin:"4px 0 0",lineHeight:1.3}}>{t.desc}</p>
                <span style={{display:"inline-block",marginTop:6,fontFamily:F.b,fontSize:11,color:t.color,background:`${t.color}10`,padding:"2px 8px",borderRadius:100,fontWeight:500}}>{t.cat}</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{flexShrink:0}}><path d="M6 4L10 8L6 12" stroke={C.grayLight} strokeWidth="2" strokeLinecap="round"/></svg>
            </PressableCard>
          </FadeIn>
        )}
      </div>
    </div>
  </div>;
}

/* ═══════════════════════════════════════════════════
   PROFILE SCREEN
   ═══════════════════════════════════════════════════ */
function ProfileScreen({profile,missions,onReset}){const done=missions.filter(m=>m.status==="done").length;const country=COUNTRIES.find(c=>c.code===profile.country);
  return <div style={{width:"100%",height:"100%",position:"relative",background:"#FAFAFA",overflow:"hidden"}}><Glow/>
    <div style={{position:"relative",zIndex:1,height:"100%",overflowY:"auto",paddingBottom:90}}>
      <FadeIn delay={100} style={{padding:"20px 28px 0",textAlign:"center"}}>
        <div style={{width:80,height:80,borderRadius:40,background:`linear-gradient(135deg,${C.mintLight},#D1FAE5)`,margin:"0 auto 14px",display:"flex",alignItems:"center",justifyContent:"center",border:`3px solid ${C.mint}`,boxShadow:`0 0 24px ${C.mintSoft}`}}>
          <span style={{fontFamily:F.d,fontWeight:800,fontSize:32,color:C.mint}}>{(profile.name||"N")[0].toUpperCase()}</span></div>
        <h1 style={{fontFamily:F.d,fontWeight:700,fontSize:24,color:C.charcoal,margin:0}}>{profile.name}</h1>
        <p style={{fontFamily:F.b,fontSize:14,color:C.gray,margin:"4px 0 0"}}>{profile.userType==="student"?"🎓 Student":"💼 Worker"} · {country?`${country.flag} ${country.name}`:""}</p></FadeIn>
      <FadeIn delay={250} style={{padding:"24px 24px 0"}}><div style={{background:"#FFF",borderRadius:20,padding:20,boxShadow:"0 1px 10px rgba(0,0,0,0.04)"}}>
        <h3 style={{fontFamily:F.d,fontWeight:700,fontSize:15,color:C.charcoal,margin:"0 0 16px"}}>Journey Progress</h3>
        <div style={{display:"flex",justifyContent:"space-around",textAlign:"center"}}>
          <div><div style={{fontFamily:F.d,fontWeight:700,fontSize:24,color:C.mint}}>{done}</div><div style={{fontFamily:F.b,fontSize:12,color:C.gray}}>Done</div></div>
          <div style={{width:1,background:C.grayBorder}}/>
          <div><div style={{fontFamily:F.d,fontWeight:700,fontSize:24,color:C.charcoal}}>{missions.length-done}</div><div style={{fontFamily:F.b,fontSize:12,color:C.gray}}>Left</div></div>
          <div style={{width:1,background:C.grayBorder}}/>
          <div><div style={{fontFamily:F.d,fontWeight:700,fontSize:24,color:C.charcoal}}>{missions.length>0?Math.round((done/missions.length)*100):0}%</div><div style={{fontFamily:F.b,fontSize:12,color:C.gray}}>Total</div></div>
        </div></div></FadeIn>
      <FadeIn delay={400} style={{padding:"16px 24px 0"}}><div style={{background:"#FFF",borderRadius:20,padding:20,boxShadow:"0 1px 10px rgba(0,0,0,0.04)"}}>
        <h3 style={{fontFamily:F.d,fontWeight:700,fontSize:15,color:C.charcoal,margin:"0 0 16px"}}>Your Goals</h3>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{(profile.goals||[]).map(g=>{const it=INTENTS.find(i=>i.id===g);
          return <span key={g} style={{fontFamily:F.b,fontSize:13,color:C.charcoal,background:C.mintLight,padding:"6px 14px",borderRadius:100,fontWeight:500}}>{it?`${it.emoji} ${g.charAt(0).toUpperCase()+g.slice(1)}`:g}</span>})}</div></div></FadeIn>
      <FadeIn delay={550} style={{padding:"16px 24px 0"}}><div style={{background:"#FFF",borderRadius:20,padding:20,boxShadow:"0 1px 10px rgba(0,0,0,0.04)"}}>
        <h3 style={{fontFamily:F.d,fontWeight:700,fontSize:15,color:C.charcoal,margin:"0 0 12px"}}>Details</h3>
        {[["Arrived",profile.arrivalDate||"Not set"],["Type",profile.userType==="student"?"Student":"Worker"],["Country",country?country.name:"Not set"]].map(([k,v])=>
          <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.grayBorder}`}}>
            <span style={{fontFamily:F.b,fontSize:14,color:C.gray}}>{k}</span><span style={{fontFamily:F.b,fontSize:14,color:C.charcoal,fontWeight:500}}>{v}</span></div>)}</div></FadeIn>
      <FadeIn delay={700} style={{padding:"24px 24px 0"}}><button onClick={onReset} style={{width:"100%",padding:"14px 0",borderRadius:100,border:"1.5px solid #EF4444",background:"transparent",cursor:"pointer",fontFamily:F.d,fontWeight:600,fontSize:14,color:"#EF4444"}}>Reset & Restart Onboarding</button>
        <p style={{fontFamily:F.b,fontSize:12,color:C.grayLight,textAlign:"center",marginTop:10}}>Clears all data and starts fresh.</p></FadeIn>
    </div></div>;
}

/* ═══════════════════════════════════════════════════
   MAIN APP — orchestrates everything
   ═══════════════════════════════════════════════════ */
export default function NovaNestApp(){
  const [loading,setLoading]=useState(true);
  const [onboarded,setOnboarded]=useState(false);
  const [profile,setProfile]=useState(null);
  const [missions,setMissions]=useState([]);
  const [chatHistory,setChatHistory]=useState([]);
  const [tab,setTab]=useState("home");
  const [missionId,setMissionId]=useState(null);
  const [chatPrefill,setChatPrefill]=useState(null);

  useEffect(()=>{(async()=>{
    const ob=await DB.get("nn-onboarded");
    if(ob){const p=await DB.get("nn-profile");const m=await DB.get("nn-missions");const ch=await DB.get("nn-chat");
      setProfile(p);setMissions(m||[]);setChatHistory(ch||[]);setOnboarded(true);}
    setLoading(false);
  })()},[]);

  const onOnboard=(p,m)=>{setProfile(p);setMissions(m);setOnboarded(true);setChatHistory([])};
  const onReset=async()=>{await DB.del("nn-onboarded");await DB.del("nn-profile");await DB.del("nn-missions");await DB.del("nn-chat");
    setOnboarded(false);setProfile(null);setMissions([]);setChatHistory([]);setTab("home");setMissionId(null)};
  const completeMission=async(id)=>{
    const up=[...missions];const idx=up.findIndex(m=>m.id===id);if(idx<0)return;up[idx]={...up[idx],status:"done"};
    for(let i=idx+1;i<up.length;i++){if(up[i].status==="locked"){up[i]={...up[i],status:"current"};break;}}
    setMissions(up);await DB.set("nn-missions",up);setMissionId(null);
  };
  const openMission=id=>setMissionId(id);
  const closeMission=()=>setMissionId(null);
  const askNova=title=>{setChatPrefill(`Tell me more about: ${title}`);setMissionId(null);setTab("chat")};
  const saveChat=async h=>{setChatHistory(h);await DB.set("nn-chat",h)};
  useEffect(()=>{if(tab!=="chat")setChatPrefill(null)},[tab]);

  const curMission=missionId?missions.find(m=>m.id===missionId):null;

  if(loading)return <div style={{display:"flex",justifyContent:"center",alignItems:"center",minHeight:"100vh",background:"linear-gradient(160deg,#d4ede8 0%,#dceee8 25%,#eee9e4 50%,#e8cfc5 100%)"}}>
    <div style={{width:393,height:852,borderRadius:55,background:"#FAFAFA",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 12px 40px rgba(0,0,0,0.08)"}}>
      <div style={{textAlign:"center"}}><CredovaLogo size={60}/><p style={{fontFamily:F.b,fontSize:13,color:C.grayLight,marginTop:12}}>Loading...</p></div></div></div>;

  return <div style={{display:"flex",justifyContent:"center",alignItems:"center",minHeight:"100vh",padding:20,background:"linear-gradient(160deg,#d4ede8 0%,#dceee8 25%,#eee9e4 50%,#e8cfc5 100%)",fontFamily:F.d}}>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
    <MicroStyles/>
    <div style={{width:393,height:852,borderRadius:55,position:"relative",overflow:"hidden",flexShrink:0,background:"#FAFAFA",
      boxShadow:"0 0 0 1px rgba(0,0,0,0.06),0 2px 8px rgba(0,0,0,0.04),0 12px 40px rgba(0,0,0,0.08),0 40px 80px rgba(0,0,0,0.06),inset 0 0 0 1.5px rgba(255,255,255,0.5)"}}>
      <div style={{position:"absolute",top:12,left:"50%",transform:"translateX(-50%)",width:126,height:36,background:"#1a1a1a",borderRadius:20,zIndex:100}}/>
      <div style={{position:"absolute",top:0,left:0,right:0,height:54,zIndex:90,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 30px 0"}}>
        <span style={{fontFamily:F.b,fontWeight:600,fontSize:15,color:C.charcoal}}>9:41</span>
        <div style={{display:"flex",alignItems:"center",gap:5}}>
          <svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="6" width="3" height="6" rx=".8" fill={C.charcoal}/><rect x="5" y="4" width="3" height="8" rx=".8" fill={C.charcoal}/><rect x="10" y="2" width="3" height="10" rx=".8" fill={C.charcoal}/><rect x="15" y="0" width="3" height="12" rx=".8" fill={C.charcoal}/></svg>
          <svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 2.4C5.6 2.4 3.4 3.4 1.8 5L0 3.2C2.1 1.2 4.9 0 8 0s5.9 1.2 8 3.2L14.2 5C12.6 3.4 10.4 2.4 8 2.4z" fill={C.charcoal}/><path d="M8 6.4c-1.6 0-3 .6-4.1 1.7L2 6.2C3.6 4.8 5.7 4 8 4s4.4.8 6 2.2L12.1 8.1C11 7 9.6 6.4 8 6.4z" fill={C.charcoal}/><circle cx="8" cy="11" r="1.8" fill={C.charcoal}/></svg>
          <svg width="28" height="13" viewBox="0 0 28 14"><rect x="0" y="1" width="23" height="12" rx="3.5" stroke={C.charcoal} strokeWidth="1.2" fill="none"/><rect x="24" y="4.5" width="2.5" height="5" rx="1" fill={C.charcoal} opacity=".4"/><rect x="1.8" y="2.8" width="15" height="8.4" rx="2" fill={C.charcoal}/></svg></div></div>
      <div style={{position:"absolute",top:54,left:0,right:0,bottom:0}}>
        {!onboarded?<OnboardingFlow onComplete={onOnboard}/>
          :curMission?<MissionDetail mission={curMission} onBack={closeMission} onComplete={()=>completeMission(curMission.id)} onAskNova={()=>askNova(curMission.title)}/>
          :<div style={{width:"100%",height:"100%",position:"relative"}}>
            <div style={{position:"absolute",inset:0}}>
              {tab==="home"&&<HomeScreen profile={profile} missions={missions} onStartMission={openMission}/>}
              {tab==="chat"&&<ChatScreen profile={profile} missions={missions} chatHistory={chatHistory} setChatHistory={saveChat} prefill={chatPrefill}/>}
              {tab==="roadmap"&&<RoadmapTab missions={missions} onOpen={openMission}/>}
              {tab==="tools"&&<ToolsScreen onAskNova={q=>{setChatPrefill(q);setTab("chat")}}/>}
              {tab==="profile"&&<ProfileScreen profile={profile} missions={missions} onReset={onReset}/>}
            </div><BottomNav active={tab} onNav={setTab}/></div>}
      </div>
      <div style={{position:"absolute",bottom:10,left:"50%",transform:"translateX(-50%)",width:134,height:5,background:C.charcoal,borderRadius:3,opacity:0.2,zIndex:100}}/>
    </div></div>;
}
