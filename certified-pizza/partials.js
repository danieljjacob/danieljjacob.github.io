// Shared nav + footer + tweak panel for all pages.
// Each page sets window.__page = 'home' | 'menu' | 'story' | 'contact' | 'order' | 'gallery' before this script runs.

(function () {
  const page = window.__page || 'home';

  const nav = `
    <nav class="nav">
      <div class="nav-inner">
        <a class="brand" href="index.html">
          <span class="brand-mark">CP</span>
          <span>Certified Pizza</span>
        </a>
        <ul class="nav-links">
          <li><a href="index.html" class="${page==='home'?'active':''}">Home</a></li>
          <li><a href="menu.html" class="${page==='menu'?'active':''}">Menu</a></li>
          <li><a href="story.html" class="${page==='story'?'active':''}">Our Story</a></li>
          <li><a href="gallery.html" class="${page==='gallery'?'active':''}">Gallery</a></li>
          <li><a href="contact.html" class="${page==='contact'?'active':''}">Contact</a></li>
        </ul>
        <div class="nav-cta">
          <a href="tel:0286057558" class="mono" style="opacity:.8">(02) 8605 7558</a>
          <a href="order.html" class="btn btn-light">Order online →</a>
        </div>
      </div>
    </nav>`;

  const footer = `
    <footer class="footer">
      <div class="footer-inner">
        <div>
          <h4>Certified Pizza</h4>
          <p style="font-size:14px;line-height:1.6;opacity:.85;max-width:380px">
            Family-owned pizzeria in the heart of St Marys. Hand-stretched, made fresh, named after the streets that built the Nepean.
          </p>
          <div style="display:flex;gap:6px;margin-top:24px">
            <span style="display:inline-block;width:24px;height:6px;background:var(--green)"></span>
            <span style="display:inline-block;width:24px;height:6px;background:var(--bg)"></span>
            <span style="display:inline-block;width:24px;height:6px;background:var(--red)"></span>
          </div>
        </div>
        <div>
          <h4>Visit</h4>
          <ul>
            <li>5 Crana Street</li>
            <li>St Marys NSW 2760</li>
            <li>&nbsp;</li>
            <li><a href="tel:0286057558">(02) 8605 7558</a></li>
          </ul>
        </div>
        <div>
          <h4>Hours</h4>
          <ul>
            <li>Tue–Thu&nbsp;&nbsp;5pm – 9pm</li>
            <li>Fri–Sat&nbsp;&nbsp;&nbsp;5pm – 10pm</li>
            <li>Sunday&nbsp;&nbsp;&nbsp;&nbsp;5pm – 9pm</li>
            <li>Monday&nbsp;&nbsp;&nbsp;Closed</li>
          </ul>
        </div>
        <div>
          <h4>Sitemap</h4>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="menu.html">Menu</a></li>
            <li><a href="story.html">Our Story</a></li>
            <li><a href="gallery.html">Gallery</a></li>
            <li><a href="contact.html">Contact</a></li>
            <li><a href="order.html">Order online</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-mega">
        <span>Certified</span>
        <span style="color:var(--red)">●</span>
        <span>Pizza</span>
      </div>
      <div class="footer-meta">
        <span>© 2026 Certified Pizza Pty Ltd</span>
        <span>St Marys · NSW · Australia</span>
        <span>Made with flour, fire & family</span>
      </div>
    </footer>`;

  // Inject placeholders
  const navEl = document.getElementById('nav-slot');
  const footEl = document.getElementById('footer-slot');
  if (navEl) navEl.outerHTML = nav;
  if (footEl) footEl.outerHTML = footer;

  // Tweaks panel — accent intensity + dark mode
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "accentIntensity": "balanced",
    "displayFont": "Anton"
  }/*EDITMODE-END*/;

  let state = { ...TWEAK_DEFAULTS };
  try {
    const saved = JSON.parse(localStorage.getItem('cp-tweaks') || '{}');
    state = { ...state, ...saved };
  } catch (e) {}

  function applyTweaks() {
    const root = document.documentElement;
    if (state.accentIntensity === 'subtle') {
      root.style.setProperty('--green', 'oklch(0.45 0.06 145)');
      root.style.setProperty('--red', 'oklch(0.50 0.10 25)');
    } else if (state.accentIntensity === 'loud') {
      root.style.setProperty('--green', '#009246');
      root.style.setProperty('--red', '#ce2b37');
    } else {
      root.style.setProperty('--green', 'oklch(0.55 0.15 145)');
      root.style.setProperty('--red', 'oklch(0.58 0.20 25)');
    }
    document.querySelectorAll('.display, h1, h2, h3, .brand, .brand-mark, .marquee, .footer-mega').forEach(el => {
      el.style.fontFamily = `'${state.displayFont}', 'Oswald', 'Bebas Neue', sans-serif`;
    });
  }
  applyTweaks();

  // Tweak panel UI
  let panelOpen = false;
  const panel = document.createElement('div');
  panel.id = 'tweaks-panel';
  panel.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; z-index: 200;
    background: #0a0a0a; color: #f5f1ea; border: 1px solid #222;
    width: 280px; padding: 20px; display: none;
    font-family: 'Inter', sans-serif; font-size: 13px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.4);
  `;
  panel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">
      <span class="mono" style="font-size:11px;letter-spacing:.16em">Tweaks</span>
      <button id="tweak-close" style="color:#f5f1ea;font-size:18px;line-height:1">×</button>
    </div>
    <div style="display:flex;flex-direction:column;gap:18px">
      <div>
        <div class="mono" style="font-size:10px;opacity:.6;margin-bottom:8px">Accent intensity</div>
        <div style="display:flex;gap:0;border:1px solid #333">
          ${['subtle','balanced','loud'].map(v=>`<button data-tk="accentIntensity" data-val="${v}" style="flex:1;padding:8px;font-size:11px;text-transform:uppercase;letter-spacing:.1em;background:${state.accentIntensity===v?'#f5f1ea':'transparent'};color:${state.accentIntensity===v?'#0a0a0a':'#f5f1ea'};border:none;font-family:'JetBrains Mono',monospace">${v}</button>`).join('')}
        </div>
      </div>
      <div>
        <div class="mono" style="font-size:10px;opacity:.6;margin-bottom:8px">Display font</div>
        <select id="tk-font" style="width:100%;padding:10px;background:#1a1a1a;color:#f5f1ea;border:1px solid #333;font-family:inherit">
          <option value="Anton">Anton (default)</option>
          <option value="Bebas Neue">Bebas Neue</option>
          <option value="Oswald">Oswald</option>
          <option value="Archivo Black">Archivo Black</option>
        </select>
      </div>
      <div style="border-top:1px solid #222;padding-top:14px">
        <div class="mono" style="font-size:10px;opacity:.5;line-height:1.6">
          Pages: Home · Menu · Story · Gallery · Contact · Order
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(panel);
  panel.querySelector('#tk-font').value = state.displayFont;

  // Toggle button
  const toggle = document.createElement('button');
  toggle.className = 'tweaks-toggle';
  toggle.innerHTML = '⚙';
  toggle.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; z-index: 199;
    width: 48px; height: 48px; border-radius: 50%;
    background: #0a0a0a; color: #f5f1ea; border: 1px solid #333;
    font-size: 20px; display: grid; place-items: center;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    transition: transform 0.15s;
  `;
  toggle.onmouseenter = () => toggle.style.transform = 'scale(1.05)';
  toggle.onmouseleave = () => toggle.style.transform = 'scale(1)';
  document.body.appendChild(toggle);

  function setPanel(open) {
    panelOpen = open;
    panel.style.display = open ? 'block' : 'none';
    toggle.style.display = open ? 'none' : 'grid';
    if (open) {
      try { window.parent.postMessage({type:'__edit_mode_available'}, '*'); } catch (e) {}
    }
  }

  toggle.onclick = () => setPanel(true);
  panel.querySelector('#tweak-close').onclick = () => {
    setPanel(false);
    try { window.parent.postMessage({type:'__edit_mode_dismissed'}, '*'); } catch (e) {}
  };

  panel.querySelectorAll('[data-tk]').forEach(btn => {
    btn.onclick = () => {
      const k = btn.dataset.tk; const v = btn.dataset.val;
      state[k] = v;
      localStorage.setItem('cp-tweaks', JSON.stringify(state));
      applyTweaks();
      // Re-render swatch states
      panel.querySelectorAll(`[data-tk="${k}"]`).forEach(b => {
        const active = b.dataset.val === v;
        b.style.background = active ? '#f5f1ea' : 'transparent';
        b.style.color = active ? '#0a0a0a' : '#f5f1ea';
      });
      try { window.parent.postMessage({type:'__edit_mode_set_keys', edits:{[k]:v}}, '*'); } catch(e){}
    };
  });
  panel.querySelector('#tk-font').onchange = (e) => {
    state.displayFont = e.target.value;
    localStorage.setItem('cp-tweaks', JSON.stringify(state));
    applyTweaks();
    try { window.parent.postMessage({type:'__edit_mode_set_keys', edits:{displayFont: state.displayFont}}, '*'); } catch(e2){}
  };

  // Listen for host activation
  window.addEventListener('message', (e) => {
    const t = e.data && e.data.type;
    if (t === '__activate_edit_mode') setPanel(true);
    if (t === '__deactivate_edit_mode') setPanel(false);
  });
  try { window.parent.postMessage({type:'__edit_mode_available'}, '*'); } catch(e){}
})();
