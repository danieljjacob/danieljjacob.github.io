/* ====== TOBY'S MILKBAR — APP ====== */
const { useState, useEffect, useMemo, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroVariant": "yellow",
  "showStickers": true,
  "marqueeOn": true
}/*EDITMODE-END*/;

const MENU = [
  { id: "tj",  cat: "Sambos",  name: "The Toby Jr.",   price: 14, desc: "Mortadella, hot honey, stracciatella, pickled chilli. Classic with a kick.", badge: "BEST SELLER", badgeYellow: false, img: "MORTADELLA SAMBO" },
  { id: "rb",  cat: "Sambos",  name: "Reuben Wreck",   price: 18, desc: "House pastrami, kraut, swiss, Russian dressing. Held together by hope.", badge: "HOT", img: "REUBEN" },
  { id: "es",  cat: "Sambos",  name: "Eggplant Stack", price: 16, desc: "Crispy eggplant, smoked provolone, basil, sugo. The veg one that bites back.", badge: "VEG", badgeYellow: true, img: "EGGPLANT SUB" },
  { id: "pm",  cat: "Sambos",  name: "Porchetta Bomb", price: 19, desc: "Slow-roasted pork, salsa verde, crackling. No napkins, no apologies.", img: "PORCHETTA" },
  { id: "ms",  cat: "Sambos",  name: "Milkbar Special",price: 17, desc: "Ask Toby. Different every week. Probably has cheese.", badge: "NEW", img: "??? SAMBO" },
  { id: "lf",  cat: "Sides",   name: "Loaded Fries",   price: 12, desc: "Beef ragu, parm, gremolata, chilli oil. Eat them fast.", badge: "BEST SELLER", img: "LOADED FRIES" },
  { id: "ow",  cat: "Sides",   name: "Onion Wreckers", price: 9,  desc: "Beer-battered, smoked salt, ranch. Crunch level: criminal.", img: "ONION RINGS" },
  { id: "sl",  cat: "Sides",   name: "Slaw Job",       price: 8,  desc: "Cabbage, fennel, lemon, dill. Cuts through the chaos.", img: "SLAW BOWL" },
  { id: "mt",  cat: "Drinks",  name: "Iced Matcha",    price: 8,  desc: "Ceremonial grade, oat milk, brown sugar. Toby's hangover cure.", badge: "CULT FAVE", badgeYellow: true, img: "ICED MATCHA" },
  { id: "fl",  cat: "Drinks",  name: "Filter Coffee",  price: 5,  desc: "Single origin. Black. No nonsense.", img: "FILTER BLACK" },
  { id: "sp",  cat: "Drinks",  name: "Sicilian Soda",  price: 7,  desc: "Blood orange, rosemary, soda. Made in-house, batch of 20.", img: "BLOOD ORANGE" },
  { id: "tr",  cat: "Drinks",  name: "Tiramisu Shake", price: 11, desc: "Espresso, mascarpone, cocoa. Dessert disguised as a drink.", badge: "NEW", img: "TIRAMISU SHAKE" },
];

const CATEGORIES = ["All", "Sambos", "Sides", "Drinks"];

const HOURS = [
  { day: "MON", h: "Closed",       idx: 1, closed: true },
  { day: "TUE", h: "11:30 — 21:00", idx: 2 },
  { day: "WED", h: "11:30 — 21:00", idx: 3 },
  { day: "THU", h: "11:30 — 22:00", idx: 4 },
  { day: "FRI", h: "11:30 — 23:00", idx: 5 },
  { day: "SAT", h: "11:00 — 23:00", idx: 6 },
  { day: "SUN", h: "11:00 — 21:00", idx: 0 },
];

function getOpenStatus() {
  const d = new Date();
  const day = d.getDay();
  const h = d.getHours() + d.getMinutes()/60;
  // Mon closed
  if (day === 1) return { open: false, label: "CLOSED MONDAYS" };
  let openH = 11.5, closeH = 21;
  if (day === 4) closeH = 22;
  if (day === 5 || day === 6) closeH = 23;
  if (day === 6 || day === 0) openH = 11;
  if (h >= openH && h < closeH) return { open: true, label: `OPEN · TILL ${Math.floor(closeH).toString().padStart(2,'0')}:00` };
  return { open: false, label: "CLOSED · BACK SOON" };
}

/* ===== NAV ===== */
function Nav({ status, onOrder }) {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href="#top" className="nav-logo">
          <img src="assets/logo.png" alt="Toby's" />
          <span className="word">Toby's Milkbar</span>
        </a>
        <ul className="nav-links">
          <li><a href="#story">Story</a></li>
          <li><a href="#menu">Menu</a></li>
          <li><a href="#find">Find Us</a></li>
          <li><a href="#catering">Catering</a></li>
          <li><a href="#feed">Feed</a></li>
        </ul>
        <div style={{display:'flex', alignItems:'center', gap:18}}>
          <div className="nav-status">
            <span className={"status-dot" + (status.open ? "" : " closed")}></span>
            <span>{status.label}</span>
          </div>
          <button className="nav-cta" onClick={onOrder}>Order Pickup ↗</button>
        </div>
      </div>
    </nav>
  );
}

/* ===== MARQUEE ===== */
function Marquee() {
  const items = ["Sambos that hit", "Built in a carpark", "Open late", "No fluff. Just food.", "Sydney Food Bros", "Industrial. Serious flavour."];
  return (
    <div className="marquee">
      <div className="marquee-track">
        {[...Array(2)].map((_,k) => (
          <span key={k}>
            {items.map((it, i) => (
              <React.Fragment key={i}>
                <span>{it}</span>
                <span className="dot"></span>
              </React.Fragment>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ===== HERO ===== */
function Hero({ variant, showStickers, onOrder }) {
  return (
    <section id="top" className={"hero v-" + variant}>
      <div className="grain-soft"></div>
      {variant === "yellow" && (
        <div className="hero-bg-text">SAMBOS · SAMBOS · SAMBOS</div>
      )}
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="hero-eyebrow">CARPARK / MARRICKVILLE / EST. 2023</div>
            <h1 className="hero-headline">
              <span className="row1">SAMBOS</span>
              <span className="row2">THAT <em>hit</em></span>
              <span className="row3">THE SPOT.</span>
            </h1>
            <p className="hero-sub">
              Toby's Milkbar. A food trailer in a Sydney carpark, surrounded by murals and the noise of the inner-west. Hearty sambos, loud tunes, no fuss.
            </p>
            <div className="hero-ctas">
              <button className="btn-primary" onClick={onOrder}>Order Pickup →</button>
              <a href="#menu" className="btn-ghost">View Menu</a>
            </div>
          </div>
          <div className="hero-mascot-wrap">
            <img src="assets/logo.png" alt="Toby's mascot" className="hero-mascot" />
          </div>
        </div>
        {showStickers && (
          <div className="hero-stickers">
            <div className="sticker sticker-round s1">
              <div>
                <div style={{fontSize: 18, fontFamily:'Anton, sans-serif'}}>OPEN</div>
                <div>'TIL LATE</div>
                <div style={{fontSize: 9, marginTop: 4, opacity: .8}}>FRI / SAT</div>
              </div>
            </div>
            <div className="sticker sticker-stamp s2">
              ★ MADE IN A CARPARK ★
            </div>
            <div className="sticker sticker-tag s3">
              NO BS · NO FLUFF
            </div>
          </div>
        )}
      </div>
      <div className="hero-meta">
        <span>SCROLL ↓</span>
        <span>BY SYDNEY FOOD BROS</span>
        <span>04 / EST 2023</span>
      </div>
    </section>
  );
}

/* ===== STORY ===== */
function Story() {
  return (
    <section id="story" className="story">
      <div className="grain-soft"></div>
      <div className="wrap">
        <div className="story-grid">
          <div className="story-img">
            <div className="stripes"></div>
            <div className="story-tape"></div>
            <div className="placeholder-label">
              <span>{"// PHOTO //"}</span>
              <span className="big">CARPARK · NIGHT</span>
              <span>SHOT BY @SFB</span>
            </div>
          </div>
          <div className="story-body">
            <div className="section-eyebrow">CH. 01 — THE STORY</div>
            <h2 className="section-title">
              Built in a <em>carpark.</em><br/>
              Tastes better<br/>because of it.
            </h2>
            <p className="lead">
              "We weren't trying to open a restaurant. We had a trailer, a corner of concrete, and an idea about sambos."
            </p>
            <p>
              Toby's Milkbar sits in the back of an industrial corner of Marrickville, walls covered in murals and the smell of slow-roasted pork. Barrel tables, outdoor umbrellas, mid-range speakers playing something better than you'd expect.
            </p>
            <p>
              Brought to you by Sydney Food Bros — the same lot behind half the food you've been talking about.
            </p>
            <div className="story-stats">
              <div className="story-stat">
                <div className="num">12</div>
                <div className="lbl">Sambos on rotation</div>
              </div>
              <div className="story-stat">
                <div className="num">2</div>
                <div className="lbl">Carparks reclaimed</div>
              </div>
              <div className="story-stat">
                <div className="num">∞</div>
                <div className="lbl">Hot honey, applied</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===== MENU ===== */
function Menu({ cat, setCat, onAdd }) {
  const filtered = useMemo(() => cat === "All" ? MENU : MENU.filter(m => m.cat === cat), [cat]);
  return (
    <section id="menu" className="menu">
      <div className="grain-soft"></div>
      <div className="wrap">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:24, marginBottom:8}}>
          <div>
            <div className="section-eyebrow">CH. 02 — THE MENU</div>
            <h2 className="section-title">
              The <em>good</em><br/>stuff.
            </h2>
          </div>
          <div className="mono" style={{fontSize:13, color:'var(--yellow)', maxWidth:280, textAlign:'right'}}>
            // MENU CHANGES WEEKLY <br/>// CASH OR CARD <br/>// NO BOOKINGS
          </div>
        </div>
        <div className="menu-tabs">
          {CATEGORIES.map(c => (
            <button key={c} className={"menu-tab" + (c === cat ? " active" : "")} onClick={() => setCat(c)}>
              {c} <span style={{opacity:.5, marginLeft:6}}>{c === "All" ? MENU.length : MENU.filter(m=>m.cat===c).length}</span>
            </button>
          ))}
        </div>
        <div className="menu-grid">
          {filtered.map(item => (
            <div key={item.id} className="menu-card">
              {item.badge && <div className={"badge" + (item.badgeYellow ? " yellow" : "")}>{item.badge}</div>}
              <div className="menu-card-img">
                <div className="stripes"></div>
                <div className="lbl-big">{item.img}</div>
                <div className="lbl-small">// food shot</div>
              </div>
              <h3 className="menu-card-title">{item.name}</h3>
              <p className="menu-card-desc">{item.desc}</p>
              <div className="menu-card-foot">
                <div className="menu-card-price">${item.price}</div>
                <button className="menu-card-add" onClick={() => onAdd(item)}>+ Add</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== FIND US ===== */
function FindUs({ status }) {
  const today = new Date().getDay();
  return (
    <section id="find" className="find">
      <div className="grain-soft"></div>
      <div className="wrap">
        <div style={{marginBottom: 40}}>
          <div className="section-eyebrow">CH. 03 — FIND US</div>
          <h2 className="section-title">
            Behind the <em>roller</em> door.
          </h2>
        </div>
        <div className="find-grid">
          <div>
            <div className="find-info-block">
              <h4>// ADDRESS</h4>
              <p>
                42 SMITH ST<br/>
                MARRICKVILLE NSW 2204<br/>
                <span style={{fontFamily:'JetBrains Mono, monospace', fontSize:12, textTransform:'none', letterSpacing:0}}>"the carpark behind the muffler shop"</span>
              </p>
            </div>
            <div className="find-info-block">
              <h4>// HOURS</h4>
              <div className="find-hours">
                {HOURS.map(d => (
                  <React.Fragment key={d.day}>
                    <div className={"day" + (d.idx === today ? " today" : "")}>{d.day} {d.idx === today && "← today"}</div>
                    <div className={d.idx === today ? "today" : ""}>{d.h}</div>
                  </React.Fragment>
                ))}
              </div>
              <div style={{marginTop: 16, paddingTop: 12, borderTop: "2px dashed var(--ink)", fontFamily:'Archivo Black, sans-serif', fontSize:14, textTransform:'uppercase'}}>
                STATUS: <span style={{color: status.open ? '#1a8e54' : 'var(--tomato)'}}>{status.label}</span>
              </div>
            </div>
            <div className="find-info-block">
              <h4>// HOLLER</h4>
              <p style={{fontSize:20}}>(02) 9555 0420<br/>HEY@TOBYSMILKBAR.COM.AU</p>
            </div>
          </div>
          <div className="find-map">
            {/* hand-drawn map */}
            <svg viewBox="0 0 400 520" style={{width:'100%', height:'100%', display:'block'}}>
              <rect width="400" height="520" fill="#F4EAD5"/>
              {/* grid */}
              <g stroke="#0E0E0C" strokeOpacity="0.08" strokeWidth="1">
                {[40,80,120,160,200,240,280,320,360].map(x => <line key={"vx"+x} x1={x} y1="0" x2={x} y2="520"/>)}
                {[40,80,120,160,200,240,280,320,360,400,440,480].map(y => <line key={"hy"+y} x1="0" y1={y} x2="400" y2={y}/>)}
              </g>
              {/* roads */}
              <path d="M0 200 L400 220" stroke="#0E0E0C" strokeWidth="22" fill="none"/>
              <path d="M0 200 L400 220" stroke="#FFD60A" strokeWidth="2" strokeDasharray="8 8" fill="none"/>
              <path d="M120 0 L150 520" stroke="#0E0E0C" strokeWidth="18" fill="none"/>
              <path d="M120 0 L150 520" stroke="#FFD60A" strokeWidth="2" strokeDasharray="8 8" fill="none"/>
              <path d="M280 0 L300 520" stroke="#0E0E0C" strokeWidth="14" fill="none"/>
              {/* blocks */}
              <rect x="170" y="240" width="100" height="80" fill="#FFD60A" stroke="#0E0E0C" strokeWidth="2"/>
              <rect x="40" y="40" width="60" height="120" fill="#E63946" stroke="#0E0E0C" strokeWidth="2"/>
              <rect x="320" y="60" width="60" height="100" fill="#0A1F44" stroke="#0E0E0C" strokeWidth="2"/>
              <rect x="40" y="350" width="70" height="100" fill="#0A1F44" stroke="#0E0E0C" strokeWidth="2"/>
              <rect x="320" y="380" width="60" height="80" fill="#FFD60A" stroke="#0E0E0C" strokeWidth="2"/>
              {/* X marks the spot */}
              <g transform="translate(220 280)">
                <circle r="28" fill="#E63946" stroke="#0E0E0C" strokeWidth="3"/>
                <text x="0" y="6" textAnchor="middle" fill="#F4EAD5" fontFamily="Archivo Black" fontSize="22" fontWeight="900">X</text>
                <circle r="44" fill="none" stroke="#0E0E0C" strokeWidth="2" strokeDasharray="4 4">
                  <animate attributeName="r" values="44;52;44" dur="2.5s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="1;0.3;1" dur="2.5s" repeatCount="indefinite"/>
                </circle>
              </g>
              {/* arrow + label */}
              <g transform="translate(60 410) rotate(-8)">
                <rect x="-8" y="-22" width="170" height="44" fill="#0E0E0C"/>
                <text x="76" y="6" textAnchor="middle" fill="#FFD60A" fontFamily="Archivo Black" fontSize="14">YOU'RE HERE</text>
              </g>
              <path d="M150 410 Q 190 360 215 305" stroke="#0E0E0C" strokeWidth="3" fill="none" strokeDasharray="6 6"/>
              <polygon points="215,305 208,318 222,316" fill="#0E0E0C"/>
              {/* labels */}
              <text x="20" y="216" fontFamily="JetBrains Mono" fontSize="10" fill="#0E0E0C" letterSpacing="1">SMITH ST →</text>
              <text x="160" y="20" fontFamily="JetBrains Mono" fontSize="10" fill="#0E0E0C" letterSpacing="1">↑ ILLAWARRA RD</text>
              <text x="220" y="290" fontFamily="JetBrains Mono" fontSize="10" fill="#0E0E0C" letterSpacing="1">CARPARK</text>
            </svg>
            <div className="sticker sticker-stamp" style={{position:'absolute', top:14, right:14, transform:'rotate(6deg)'}}>
              ★ FOUND IT ★
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===== CATERING ===== */
function Catering() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <section id="catering" className="catering">
      <div className="grain-soft"></div>
      <div className="wrap">
        <div className="catering-grid">
          <div>
            <div className="section-eyebrow">CH. 04 — CATERING & TRAILER HIRE</div>
            <h2 className="section-title">
              Hire the <em>trailer.</em><br/>
              Feed the crew.
            </h2>
            <p className="lead">
              Got a wedding, warehouse party, film set, or a reason to feed 50+ humans? We'll roll the trailer in and cook on-site.
            </p>
            <p>
              We've fed weddings in warehouses, fashion launches in alleyways, and one wrap party in a literal hangar. Tell us where, when, and how many. We'll handle the food and the playlist.
            </p>
            <p style={{fontFamily:'JetBrains Mono, monospace', fontSize:13, textTransform:'uppercase', opacity:.7, marginTop:24}}>
              MIN. 40 PEOPLE · BOOK 3 WEEKS OUT · SYDNEY METRO
            </p>
          </div>
          <form className="catering-form" onSubmit={(e) => {e.preventDefault(); setSubmitted(true); setTimeout(()=>setSubmitted(false), 3000);}}>
            <h3>Get the trailer.</h3>
            <p style={{fontSize:13, fontFamily:'JetBrains Mono, monospace', textTransform:'uppercase', marginBottom:8}}>// We get back within 24h.</p>
            <label>Your name</label>
            <input type="text" placeholder="Toby Maguire" required />
            <label>Email</label>
            <input type="email" placeholder="you@somewhere.com" required />
            <label>Heads</label>
            <select defaultValue="">
              <option value="" disabled>How many?</option>
              <option>40 — 80</option>
              <option>80 — 150</option>
              <option>150 — 300</option>
              <option>300+</option>
            </select>
            <label>When</label>
            <input type="text" placeholder="Sat 18 May, evening" />
            <button className="submit" type="submit">{submitted ? "✓ Sent — we'll holler back" : "Send it →"}</button>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ===== SOCIAL ===== */
function Social() {
  const tiles = [
    { lbl: "TRAILER · DUSK", cap: "Service starts. Lights up." },
    { lbl: "REUBEN STACK",   cap: "The wreck, in profile." },
    { lbl: "HOT HONEY POUR", cap: "Slow motion, every time." },
    { lbl: "CARPARK CROWD",  cap: "Friday, around 8pm." },
    { lbl: "TOBY @ GRILL",   cap: "Mid-flip." },
    { lbl: "MATCHA POUR",    cap: "Cult fave, on ice." },
    { lbl: "FRIES, LOADED",  cap: "Don't share these." },
    { lbl: "MURAL WALL",     cap: "By @inkbros, Marrickville." },
  ];
  return (
    <section id="feed" className="social">
      <div className="grain-soft"></div>
      <div className="wrap">
        <div className="social-head">
          <div>
            <div className="section-eyebrow">CH. 05 — THE FEED</div>
            <h2 className="section-title">
              Follow the <em>noise.</em>
            </h2>
          </div>
          <a href="#" className="btn-ghost">@TOBYSMILKBAR ↗</a>
        </div>
        <div className="social-grid">
          {tiles.map((t,i) => (
            <div key={i} className="social-tile">
              <div className="stripes"></div>
              <div className="label">
                <span>// IG</span>
                <span style={{fontFamily:'Archivo Black, sans-serif', fontSize:13, letterSpacing:'0.04em'}}>{t.lbl}</span>
              </div>
              <div className="caption">{t.cap}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== FOOTER ===== */
function Footer() {
  return (
    <footer className="footer">
      <div className="grain-soft"></div>
      <div className="wrap">
        <div className="footer-huge">
          TOBY'S<br/>
          <em>milkbar.</em>
        </div>
        <div className="footer-grid">
          <div>
            <h5>// THE PLACE</h5>
            <p>42 Smith St<br/>Marrickville NSW 2204</p>
            <p style={{marginTop:10, opacity:.7, fontSize:12}}>Carpark behind the muffler shop. You'll smell it first.</p>
          </div>
          <div>
            <h5>// HOLLER</h5>
            <a href="#">hey@tobysmilkbar.com.au</a>
            <a href="#">(02) 9555 0420</a>
          </div>
          <div>
            <h5>// FOLLOW</h5>
            <a href="#">Instagram ↗</a>
            <a href="#">TikTok ↗</a>
            <a href="#">Spotify (the playlist) ↗</a>
          </div>
          <div>
            <h5>// FAMILY</h5>
            <a href="#">Sydney Food Bros ↗</a>
            <a href="#">Norma's ↗</a>
            <a href="#">The Trailer ↗</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 TOBY'S MILKBAR · NO BOOKINGS · CASH OR CARD</span>
          <span>BUILT IN A CARPARK ★</span>
        </div>
      </div>
    </footer>
  );
}

/* ===== MODAL ===== */
function PickupModal({ cart, onClose, onCheckout, onRemove }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="section-eyebrow" style={{margin:0, marginBottom:14}}>// PICKUP</div>
        <h2>Order<br/>pickup.</h2>
        <p style={{fontFamily:'DM Serif Display, serif', fontStyle:'italic', fontSize:20, marginTop:12}}>
          Ready in ~20 min. Walk up to the trailer. Say "Toby sent me." (Don't actually.)
        </p>
        <div className="modal-cart">
          {cart.length === 0 ? (
            <div className="empty">// CART EMPTY — ADD A SAMBO</div>
          ) : (
            <>
              {cart.map(i => (
                <div key={i.id} className="row">
                  <span>{i.qty}× {i.name}</span>
                  <span>
                    ${i.price * i.qty}
                    <button onClick={() => onRemove(i.id)} style={{marginLeft:10, color:'var(--tomato)', background:'transparent', fontFamily:'JetBrains Mono, monospace', fontSize:11}}>REMOVE</button>
                  </span>
                </div>
              ))}
              <div className="row total">
                <span>TOTAL</span>
                <span>${total}</span>
              </div>
            </>
          )}
        </div>
        <button className="btn-primary" style={{width:'100%', justifyContent:'center'}} onClick={onCheckout} disabled={cart.length === 0}>
          {cart.length === 0 ? "ADD SOMETHING FIRST" : `PAY ${"$" + total} →`}
        </button>
      </div>
    </div>
  );
}

/* ===== APP ===== */
function App() {
  const tw = useTweaks(TWEAK_DEFAULTS);
  const [tweak, , setTweak] = tw;
  const [cat, setCat] = useState("All");
  const [cart, setCart] = useState([]);
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState("");
  const [status, setStatus] = useState(getOpenStatus());

  useEffect(() => {
    const t = setInterval(() => setStatus(getOpenStatus()), 60000);
    return () => clearInterval(t);
  }, []);

  const addItem = (item) => {
    setCart(prev => {
      const found = prev.find(i => i.id === item.id);
      if (found) return prev.map(i => i.id === item.id ? {...i, qty: i.qty+1} : i);
      return [...prev, {...item, qty: 1}];
    });
    setToast(`+ ${item.name.toUpperCase()}`);
    setTimeout(() => setToast(""), 1800);
  };
  const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const checkout = () => {
    setModal(false);
    setToast("✓ ORDER IN. SEE YOU IN 20.");
    setCart([]);
    setTimeout(() => setToast(""), 2500);
  };

  return (
    <>
      <div className="grain"></div>
      <Nav status={status} onOrder={() => setModal(true)} />
      <Hero
        variant={tweak.heroVariant}
        showStickers={tweak.showStickers}
        onOrder={() => setModal(true)}
      />
      {tweak.marqueeOn && <Marquee />}
      <Story />
      <Menu cat={cat} setCat={setCat} onAdd={addItem} />
      <FindUs status={status} />
      <Catering />
      <Social />
      <Footer />

      {cart.length > 0 && (
        <button className="fab-cart" onClick={() => setModal(true)}>
          🥪 CART <span className="count">{cart.reduce((s,i)=>s+i.qty,0)}</span>
        </button>
      )}
      {modal && (
        <PickupModal
          cart={cart}
          onClose={() => setModal(false)}
          onCheckout={checkout}
          onRemove={removeItem}
        />
      )}
      {toast && <div className="toast">{toast}</div>}

      <TweaksPanel title="Tweaks">
        <TweakSection title="Hero variant">
          <TweakRadio
            value={tweak.heroVariant}
            onChange={v => setTweak('heroVariant', v)}
            options={[
              { value: 'yellow', label: 'Yellow Wall' },
              { value: 'blue',   label: 'Blue Night' },
              { value: 'split',  label: 'Split Poster' },
            ]}
          />
        </TweakSection>
        <TweakSection title="Cheeky details">
          <TweakToggle label="Hero stickers" value={tweak.showStickers} onChange={v => setTweak('showStickers', v)} />
          <TweakToggle label="Marquee ticker" value={tweak.marqueeOn} onChange={v => setTweak('marqueeOn', v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
