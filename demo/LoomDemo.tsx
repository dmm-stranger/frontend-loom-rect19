// @ts-nocheck
// @ts-ignore

import { useState, useEffect } from "react";

// ─── Breakpoints (CSS px values, not physical pixels) ────────────────────────
// Samsung M36:   ~393px  (1080px physical / DPR 2.75)
// Samsung Tab S9: ~800px portrait / ~1280px landscape
// Large Desktop:  1280px+
const BP = { mobile: 393, tablet: 800, desktop: 1280 };

function useBreakpoint() {
  const [ width, setWidth ] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1440
  );
  useEffect(() => {
    const fn = () => setWidth(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return {
    width,
    isMobile: width < BP.tablet,
    isTablet: width >= BP.tablet && width < BP.desktop,
    isDesktop: width >= BP.desktop,
  };
}

// ─── Design Tokens ────────────────────────────────────────────────────────────
const T = {
  bg: "#08080e",
  bgCard: "#0f0f18",
  bgEl: "#14141f",
  border: "#1c1c2e",
  borderHi: "#2a2a40",
  accent: "#00cfff",
  accentDim: "#00cfff18",
  accentBorder: "#00cfff33",
  accentGlow: "0 0 28px #00cfff38",
  gold: "#f59e0b",
  success: "#00e599",
  danger: "#ff4d6a",
  text: "#eaeaf4",
  textSub: "#a0a0c0",
  textMuted: "#5a5a78",
  fontMono: "'DM Mono', 'Courier New', monospace",
  fontSans: "'Outfit', 'Segoe UI', sans-serif",
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ico = {
  Search: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>,
  Cart: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>,
  User: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  Heart: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>,
  Menu: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>,
  X: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  Star: ({ on }) => <svg width="13" height="13" viewBox="0 0 24 24" fill={on ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
  Zap: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
  Filter: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" /></svg>,
  Chip: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></svg>,
  ChevDown: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>,
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const NAV = [ "Laptops", "GPUs", "Monitors", "CPUs", "Storage", "Deals" ];
const CATS = [
  { id: 1, icon: "⚙️", label: "CPUs", n: 248 },
  { id: 2, icon: "🎮", label: "GPUs", n: 134 },
  { id: 3, icon: "💻", label: "Laptops", n: 312 },
  { id: 4, icon: "🖥️", label: "Monitors", n: 189 },
  { id: 5, icon: "💾", label: "Storage", n: 97 },
  { id: 6, icon: "🖱️", label: "Peripherals", n: 421 },
];
const PRODUCTS = [
  { id: 1, name: "NVIDIA RTX 5090", cat: "GPU", price: 1999, orig: 2199, stars: 4.9, rev: 1247, badge: "HOT", stock: 3, img: "🎮" },
  { id: 2, name: "MacBook Pro M4 Max", cat: "Laptop", price: 3499, orig: 3699, stars: 4.8, rev: 892, badge: "NEW", stock: 12, img: "💻" },
  { id: 3, name: 'Samsung 4K OLED 32"', cat: "Monitor", price: 899, orig: 1099, stars: 4.7, rev: 563, badge: "SALE", stock: 7, img: "🖥️" },
  { id: 4, name: "Intel Core Ultra 9", cat: "CPU", price: 589, orig: 649, stars: 4.6, rev: 334, badge: null, stock: 15, img: "⚙️" },
  { id: 5, name: "Corsair DDR5 64GB", cat: "RAM", price: 299, orig: 349, stars: 4.5, rev: 218, badge: "DEAL", stock: 22, img: "🔩" },
  { id: 6, name: "WD Black SN850X 4TB", cat: "NVMe", price: 249, orig: 299, stars: 4.8, rev: 445, badge: null, stock: 9, img: "💾" },
];
const FILTERS = {
  Brand: [ "NVIDIA", "AMD", "Intel", "Apple", "Samsung", "Corsair" ],
  Price: [ "Under $200", "$200–$500", "$500–$1,000", "$1,000–$2,000", "$2,000+" ],
  Rating: [ "4★ & up", "3★ & up" ],
};
const CART_SEED = [
  { id: 1, name: "RTX 5090", price: 1999, qty: 1, img: "🎮" },
  { id: 5, name: "Corsair DDR5 64GB", price: 299, qty: 2, img: "🔩" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const badgeColor = { HOT: "#ff4d6a", NEW: T.accent, SALE: T.gold, DEAL: T.success };
function Pill({ type }) {
  if (!type) return null;
  const c = badgeColor[ type ];
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", padding: "2px 7px",
      borderRadius: 4, background: `${c}18`, color: c, border: `1px solid ${c}33`,
      fontFamily: T.fontMono
    }}>
      {type}
    </span>
  );
}
function Stars({ n }) {
  return <span style={{ display: "flex", gap: 1 }}>{[ 1, 2, 3, 4, 5 ].map(i => <Ico.Star key={i} on={i <= Math.round(n)} />)}</span>;
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function Card({ p, onAdd, wishlisted, onWish, compact }) {
  const [ hov, setHov ] = useState(false);
  const disc = Math.round((1 - p.price / p.orig) * 100);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? T.bgEl : T.bgCard,
        border: `1px solid ${hov ? T.borderHi : T.border}`,
        borderRadius: 12, padding: compact ? 14 : 18,
        transition: "all 0.2s", cursor: "pointer",
        boxShadow: hov ? `0 8px 32px #00000066,${T.accentGlow}` : "0 2px 8px #00000044",
        display: "flex", flexDirection: "column", gap: compact ? 10 : 12
      }}>

      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Pill type={p.badge} />
        <button onClick={() => onWish(p.id)} style={{
          background: wishlisted ? "#ff4d6a18" : "transparent",
          border: `1px solid ${wishlisted ? "#ff4d6a44" : T.border}`,
          borderRadius: 7, padding: "3px 5px", cursor: "pointer",
          color: wishlisted ? "#ff4d6a" : T.textMuted
        }}>
          <Ico.Heart />
        </button>
      </div>

      {/* Image */}
      <div style={{
        height: compact ? 72 : 90, display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: compact ? 36 : 44,
        background: T.accentDim, borderRadius: 8, border: `1px solid ${T.border}`
      }}>
        {p.img}
      </div>

      {/* Meta */}
      <div>
        <p style={{
          fontSize: 9, color: T.accent, fontFamily: T.fontMono, margin: "0 0 3px",
          textTransform: "uppercase", letterSpacing: "0.1em"
        }}>{p.cat}</p>
        <h3 style={{
          fontSize: compact ? 12 : 13, fontWeight: 600, color: T.text,
          fontFamily: T.fontSans, margin: 0, lineHeight: 1.3
        }}>{p.name}</h3>
      </div>

      {/* Stars */}
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <Stars n={p.stars} />
        <span style={{ fontSize: 10, color: T.textMuted, fontFamily: T.fontMono }}>({p.rev.toLocaleString()})</span>
      </div>

      {/* Price */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
        <span style={{ fontSize: compact ? 16 : 18, fontWeight: 700, color: T.text, fontFamily: T.fontSans }}>
          ${p.price.toLocaleString()}
        </span>
        <span style={{ fontSize: 11, color: T.textMuted, textDecoration: "line-through" }}>
          ${p.orig.toLocaleString()}
        </span>
        <span style={{ fontSize: 10, color: T.success, fontFamily: T.fontMono }}>-{disc}%</span>
      </div>

      {p.stock < 10 && (
        <p style={{ fontSize: 10, color: T.gold, fontFamily: T.fontMono, margin: 0 }}>⚠ Only {p.stock} left</p>
      )}

      <button onClick={() => onAdd(p)} style={{
        background: hov ? T.accent : T.accentDim,
        color: hov ? "#08080e" : T.accent,
        border: `1px solid ${T.accent}`, borderRadius: 8,
        padding: compact ? "8px 0" : "10px 0",
        fontWeight: 700, fontFamily: T.fontMono,
        fontSize: 11, letterSpacing: "0.08em",
        cursor: "pointer", transition: "all 0.2s",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 5
      }}>
        <Ico.Zap /> ADD TO CART
      </button>
    </div>
  );
}

// ─── Sidebar Filters ──────────────────────────────────────────────────────────
function Sidebar({ active, onToggle, onClose, asDrawer }) {
  const inner = (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{
          fontFamily: T.fontMono, fontSize: 10, color: T.accent,
          letterSpacing: "0.15em", textTransform: "uppercase"
        }}>FILTERS</span>
        {asDrawer && (
          <button onClick={onClose} style={{
            background: "transparent",
            border: `1px solid ${T.border}`, borderRadius: 7, padding: "4px 6px",
            cursor: "pointer", color: T.textMuted
          }}><Ico.X /></button>
        )}
      </div>
      {Object.entries(FILTERS).map(([ g, opts ]) => (
        <div key={g}>
          <p style={{
            fontFamily: T.fontMono, fontSize: 9, color: T.textMuted,
            letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 10px"
          }}>{g}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {opts.map(o => {
              const on = active.includes(o);
              return (
                <label key={o} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
                  <div onClick={() => onToggle(o)} style={{
                    width: 13, height: 13, borderRadius: 3, flexShrink: 0,
                    border: `1.5px solid ${on ? T.accent : T.border}`,
                    background: on ? T.accent : "transparent", transition: "all 0.15s"
                  }} />
                  <span style={{ fontSize: 12, color: on ? T.text : T.textSub, fontFamily: T.fontSans }}>{o}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  if (asDrawer) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex" }}>
        <div onClick={onClose} style={{ flex: 1, background: "#00000070", backdropFilter: "blur(3px)" }} />
        <div style={{
          width: 260, background: T.bgEl, borderLeft: `1px solid ${T.border}`,
          padding: 24, overflowY: "auto"
        }}>
          {inner}
        </div>
      </div>
    );
  }

  return (
    <aside style={{
      width: 210, flexShrink: 0, background: T.bgCard,
      border: `1px solid ${T.border}`, borderRadius: 12, padding: 20,
      position: "sticky", top: 80, alignSelf: "flex-start"
    }}>
      {inner}
    </aside>
  );
}

// ─── Cart Drawer ──────────────────────────────────────────────────────────────
function CartDrawer({ open, onClose, items }) {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <>
      {open && <div onClick={onClose} style={{
        position: "fixed", inset: 0,
        background: "#00000080", zIndex: 40, backdropFilter: "blur(2px)"
      }} />}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: "min(340px, 92vw)",
        background: T.bgEl, borderLeft: `1px solid ${T.border}`, zIndex: 50,
        padding: 24, transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column", gap: 18
      }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: T.fontSans, color: T.text, margin: 0, fontSize: 17, fontWeight: 700 }}>
            Cart <span style={{ color: T.accent, fontFamily: T.fontMono, fontSize: 12 }}>({items.length})</span>
          </h2>
          <button onClick={onClose} style={{
            background: "transparent",
            border: `1px solid ${T.border}`, borderRadius: 8, padding: "6px 8px",
            cursor: "pointer", color: T.textMuted
          }}><Ico.X /></button>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, overflowY: "auto" }}>
          {items.map(it => (
            <div key={it.id} style={{
              background: T.bgCard, borderRadius: 10,
              border: `1px solid ${T.border}`, padding: 14,
              display: "flex", gap: 12, alignItems: "center"
            }}>
              <span style={{ fontSize: 26 }}>{it.img}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: T.fontSans, fontSize: 13, color: T.text, margin: "0 0 3px" }}>{it.name}</p>
                <p style={{ fontFamily: T.fontMono, fontSize: 10, color: T.textMuted, margin: 0 }}>Qty: {it.qty}</p>
              </div>
              <span style={{ fontFamily: T.fontSans, fontWeight: 700, color: T.text, fontSize: 13 }}>
                ${(it.price * it.qty).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <div style={{
          borderTop: `1px solid ${T.border}`, paddingTop: 18,
          display: "flex", flexDirection: "column", gap: 12
        }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: T.fontMono, color: T.textMuted, fontSize: 11 }}>TOTAL</span>
            <span style={{ fontFamily: T.fontSans, fontWeight: 700, color: T.text, fontSize: 20 }}>
              ${total.toLocaleString()}
            </span>
          </div>
          <button style={{
            background: T.accent, color: "#08080e", border: "none",
            borderRadius: 10, padding: "14px 0", fontFamily: T.fontMono, fontWeight: 700,
            fontSize: 12, letterSpacing: "0.1em", cursor: "pointer", boxShadow: T.accentGlow
          }}>
            CHECKOUT →
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Mobile Bottom Nav ────────────────────────────────────────────────────────
function BottomNav({ cartCount, onCartOpen }) {
  const items = [
    { icon: "🏠", label: "Home" },
    { icon: "🔍", label: "Search" },
    { icon: "💡", label: "Deals" },
    { icon: "♡", label: "Wishlist" },
  ];
  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 30,
      background: `${T.bgEl}f5`, backdropFilter: "blur(16px)",
      borderTop: `1px solid ${T.border}`,
      display: "flex", alignItems: "stretch", height: 60
    }}>
      {items.map((it, i) => (
        <button key={i} style={{
          flex: 1, background: "transparent", border: "none",
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", gap: 2, cursor: "pointer",
          color: i === 0 ? T.accent : T.textMuted
        }}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>{it.icon}</span>
          <span style={{
            fontSize: 9, fontFamily: T.fontMono, letterSpacing: "0.06em",
            color: i === 0 ? T.accent : T.textMuted
          }}>{it.label}</span>
        </button>
      ))}
      <button onClick={onCartOpen} style={{
        flex: 1, background: "transparent", border: "none",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", gap: 2, cursor: "pointer", position: "relative"
      }}>
        <span style={{ fontSize: 18, lineHeight: 1 }}>🛒</span>
        {cartCount > 0 && (
          <span style={{
            position: "absolute", top: 6, right: "calc(50% - 18px)",
            background: T.accent, color: "#08080e", borderRadius: 100,
            width: 16, height: 16, fontSize: 9, fontWeight: 900,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: T.fontMono
          }}>{cartCount}</span>
        )}
        <span style={{ fontSize: 9, fontFamily: T.fontMono, letterSpacing: "0.06em", color: T.textMuted }}>Cart</span>
      </button>
    </nav>
  );
}

// ─── Responsive Breakpoint Badge (dev helper) ─────────────────────────────────
function BPBadge({ bp, width }) {
  const label = bp.isMobile ? `📱 Mobile (${width}px)` : bp.isTablet ? `📋 Tablet (${width}px)` : `🖥 Desktop (${width}px)`;
  const color = bp.isMobile ? T.danger : bp.isTablet ? T.gold : T.success;
  return (
    <div style={{
      position: "fixed", top: 72, right: 12, zIndex: 100,
      background: `${color}18`, border: `1px solid ${color}44`,
      color, borderRadius: 6, padding: "4px 10px",
      fontFamily: T.fontMono, fontSize: 10, letterSpacing: "0.08em",
      pointerEvents: "none"
    }}>
      {label}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function LoomDemo() {
  const bp = useBreakpoint();
  const [ cartOpen, setCartOpen ] = useState(false);
  const [ filterOpen, setFilterOpen ] = useState(false);
  const [ mobileMenu, setMobileMenu ] = useState(false);
  const [ wishlist, setWishlist ] = useState([]);
  const [ cartItems, setCartItems ] = useState(CART_SEED);
  const [ filters, setFilters ] = useState([]);
  const [ toast, setToast ] = useState(null);
  const [ searchOpen, setSearchOpen ] = useState(false);

  const toggleWish = id => setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [ ...w, id ]);
  const toggleFilter = f => setFilters(a => a.includes(f) ? a.filter(x => x !== f) : [ ...a, f ]);

  const addToCart = p => {
    setCartItems(prev => {
      const ex = prev.find(i => i.id === p.id);
      return ex ? prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i)
        : [ ...prev, { id: p.id, name: p.name, price: p.price, qty: 1, img: p.img } ];
    });
    setToast(p.name);
    setTimeout(() => setToast(null), 1800);
  };

  // Grid columns by breakpoint
  const cols = bp.isMobile ? "repeat(2, 1fr)"
    : bp.isTablet ? "repeat(3, 1fr)"
      : "repeat(auto-fill, minmax(210px, 1fr))";

  const HEADER_H = 60;
  const innerPad = bp.isMobile ? "0 14px" : bp.isTablet ? "0 20px" : "0 28px";

  return (
    <div style={{
      minHeight: "100vh", background: T.bg, color: T.text,
      fontFamily: T.fontSans,
      paddingBottom: bp.isMobile ? 68 : 0
    }}>

      {/* ── DEV BREAKPOINT BADGE ── */}
      <BPBadge bp={bp} width={bp.width} />

      {/* ════════════════════════════════════════════
          HEADER
      ════════════════════════════════════════════ */}
      <header style={{
        position: "sticky", top: 0, zIndex: 30, height: HEADER_H,
        background: `${T.bg}ee`, backdropFilter: "blur(16px) saturate(180%)",
        borderBottom: `1px solid ${T.border}`
      }}>
        <div style={{
          maxWidth: 1320, margin: "0 auto", height: "100%",
          padding: innerPad, display: "flex", alignItems: "center", gap: 14
        }}>

          {/* Hamburger — mobile only */}
          {bp.isMobile && (
            <button onClick={() => setMobileMenu(v => !v)} style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: T.textSub, padding: "4px 0", flexShrink: 0
            }}>
              <Ico.Menu />
            </button>
          )}

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
            <div style={{
              width: 30, height: 30, background: T.accent, borderRadius: 7,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: T.accentGlow
            }}>
              <Ico.Chip />
            </div>
            {!bp.isMobile && (
              <span style={{
                fontFamily: T.fontMono, fontWeight: 700, fontSize: 15,
                color: T.text, letterSpacing: "0.05em"
              }}>
                TECH<span style={{ color: T.accent }}>STORE</span>
              </span>
            )}
          </div>

          {/* Desktop Nav */}
          {bp.isDesktop && (
            <nav style={{ display: "flex", gap: 2, marginLeft: 8 }}>
              {NAV.map(n => (
                <button key={n} style={{
                  background: "transparent", border: "none",
                  color: T.textSub, fontFamily: T.fontSans, fontSize: 13, fontWeight: 500,
                  padding: "6px 10px", borderRadius: 6, cursor: "pointer"
                }}>{n}</button>
              ))}
            </nav>
          )}

          {/* Tablet Nav — icon labels only */}
          {bp.isTablet && (
            <nav style={{ display: "flex", gap: 2, marginLeft: 4 }}>
              {NAV.slice(0, 4).map(n => (
                <button key={n} style={{
                  background: "transparent", border: "none",
                  color: T.textSub, fontFamily: T.fontSans, fontSize: 12,
                  padding: "5px 8px", borderRadius: 6, cursor: "pointer"
                }}>{n}</button>
              ))}
            </nav>
          )}

          {/* Search — expands on mobile */}
          {(bp.isDesktop || bp.isTablet || searchOpen) ? (
            <div style={{
              flex: 1, maxWidth: bp.isDesktop ? 380 : "none",
              position: "relative", marginLeft: bp.isMobile ? 0 : "auto"
            }}>
              <span style={{
                position: "absolute", left: 10, top: "50%",
                transform: "translateY(-50%)", color: T.textMuted
              }}>
                <Ico.Search />
              </span>
              <input placeholder={bp.isMobile ? "Search…" : "Search GPUs, laptops…"}
                style={{
                  width: "100%", padding: "8px 10px 8px 34px",
                  background: T.bgCard, border: `1px solid ${T.border}`,
                  borderRadius: 9, color: T.text, fontFamily: T.fontSans, fontSize: 13,
                  outline: "none", boxSizing: "border-box"
                }} />
            </div>
          ) : (
            <button onClick={() => setSearchOpen(true)} style={{
              marginLeft: "auto", background: "transparent",
              border: `1px solid ${T.border}`, borderRadius: 8,
              padding: "7px 9px", cursor: "pointer", color: T.textMuted
            }}>
              <Ico.Search />
            </button>
          )}

          {/* Desktop: User icon */}
          {!bp.isMobile && (
            <button style={{
              background: "transparent", border: `1px solid ${T.border}`,
              borderRadius: 8, padding: "7px 9px", cursor: "pointer", color: T.textMuted
            }}>
              <Ico.User />
            </button>
          )}

          {/* Cart button — desktop/tablet */}
          {!bp.isMobile && (
            <button onClick={() => setCartOpen(true)} style={{
              background: T.accentDim, border: `1px solid ${T.accentBorder}`,
              borderRadius: 8, padding: "7px 14px", cursor: "pointer",
              color: T.accent, display: "flex", alignItems: "center", gap: 7,
              fontFamily: T.fontMono, fontWeight: 700, fontSize: 11,
              letterSpacing: "0.08em", flexShrink: 0
            }}>
              <Ico.Cart />
              <span style={{
                background: T.accent, color: "#08080e", borderRadius: 100,
                width: 17, height: 17, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 9, fontWeight: 900
              }}>
                {cartItems.length}
              </span>
            </button>
          )}
        </div>
      </header>

      {/* ── Mobile Menu Drawer ── */}
      {mobileMenu && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}>
          <div style={{
            width: 240, background: T.bgEl, borderRight: `1px solid ${T.border}`,
            padding: 24, display: "flex", flexDirection: "column", gap: 6
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: 16
            }}>
              <span style={{
                fontFamily: T.fontMono, fontSize: 11, color: T.accent,
                letterSpacing: "0.1em"
              }}>MENU</span>
              <button onClick={() => setMobileMenu(false)} style={{
                background: "transparent", border: "none", cursor: "pointer", color: T.textMuted
              }}>
                <Ico.X />
              </button>
            </div>
            {NAV.map(n => (
              <button key={n} onClick={() => setMobileMenu(false)} style={{
                background: "transparent", border: "none",
                color: T.text, fontFamily: T.fontSans, fontSize: 15,
                padding: "12px 0", textAlign: "left", cursor: "pointer",
                borderBottom: `1px solid ${T.border}`
              }}>{n}</button>
            ))}
          </div>
          <div onClick={() => setMobileMenu(false)}
            style={{ flex: 1, background: "#00000070", backdropFilter: "blur(2px)" }} />
        </div>
      )}

      {/* ════════════════════════════════════════════
          CATEGORY STRIP
      ════════════════════════════════════════════ */}
      <div style={{
        borderBottom: `1px solid ${T.border}`,
        overflowX: "auto", scrollbarWidth: "none"
      }}>
        <div style={{
          maxWidth: 1320, margin: "0 auto",
          padding: innerPad, display: "flex", gap: 2,
          width: bp.isMobile ? "max-content" : "auto"
        }}>
          {CATS.map((c, i) => (
            <button key={c.id} style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "transparent", border: "none",
              padding: bp.isMobile ? "12px 12px" : "14px 14px",
              cursor: "pointer", whiteSpace: "nowrap",
              color: i === 2 ? T.accent : T.textSub,
              fontFamily: T.fontSans, fontSize: bp.isMobile ? 12 : 13,
              borderBottom: i === 2 ? `2px solid ${T.accent}` : "2px solid transparent"
            }}>
              <span style={{ fontSize: bp.isMobile ? 14 : 16 }}>{c.icon}</span>
              {!bp.isMobile && c.label}
              {bp.isMobile && <span style={{ fontSize: 10 }}>{c.label.slice(0, 4)}</span>}
              <span style={{
                fontSize: 9, fontFamily: T.fontMono, color: T.textMuted,
                background: T.bgCard, border: `1px solid ${T.border}`,
                borderRadius: 100, padding: "1px 5px"
              }}>{c.n}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════════════════ */}
      <main style={{
        maxWidth: 1320, margin: "0 auto",
        padding: bp.isMobile ? "20px 14px" : bp.isTablet ? "24px 20px" : "32px 28px"
      }}>

        {/* ── Toolbar: Title + Filter/Sort ── */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: bp.isMobile ? "flex-start" : "center",
          flexDirection: bp.isMobile ? "column" : "row",
          gap: bp.isMobile ? 12 : 0, marginBottom: 20
        }}>

          <div>
            <h2 style={{
              fontFamily: T.fontSans, fontWeight: 700,
              fontSize: bp.isMobile ? 18 : 22, margin: "0 0 3px"
            }}>
              Electronics Catalog
            </h2>
            <p style={{ fontFamily: T.fontMono, fontSize: 10, color: T.textMuted, margin: 0 }}>
              {PRODUCTS.length} products{filters.length ? ` · ${filters.length} filters` : ""}
            </p>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            {/* Filter button — mobile/tablet shows drawer */}
            {(bp.isMobile || bp.isTablet) && (
              <button onClick={() => setFilterOpen(true)} style={{
                display: "flex", alignItems: "center", gap: 6,
                background: T.accentDim, border: `1px solid ${T.accentBorder}`,
                color: T.accent, borderRadius: 8,
                padding: bp.isMobile ? "8px 12px" : "7px 12px",
                fontFamily: T.fontMono, fontSize: 11,
                letterSpacing: "0.08em", cursor: "pointer"
              }}>
                <Ico.Filter />
                {filters.length > 0 ? `FILTERS (${filters.length})` : "FILTERS"}
              </button>
            )}
            {/* Sort */}
            {[ "Featured", "Price ↑", "Rating" ].map(s => (
              <button key={s} style={{
                background: s === "Featured" ? T.accentDim : "transparent",
                border: `1px solid ${s === "Featured" ? T.accentBorder : T.border}`,
                color: s === "Featured" ? T.accent : T.textMuted,
                borderRadius: 8,
                padding: bp.isMobile ? "8px 10px" : "7px 12px",
                fontFamily: T.fontMono, fontSize: 10, cursor: "pointer",
                letterSpacing: "0.06em",
                display: bp.isMobile && s !== "Featured" ? "none" : "block"
              }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* ── Active Filter Chips ── */}
        {filters.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {filters.map(f => (
              <div key={f} style={{
                display: "flex", alignItems: "center", gap: 5,
                background: T.accentDim, border: `1px solid ${T.accentBorder}`,
                borderRadius: 6, padding: "3px 9px",
                fontFamily: T.fontMono, fontSize: 10, color: T.accent
              }}>
                {f}
                <span onClick={() => toggleFilter(f)}
                  style={{ cursor: "pointer", opacity: 0.7 }}>✕</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Layout: Desktop has inline sidebar, mobile/tablet uses drawer ── */}
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>

          {/* Desktop Sidebar */}
          {bp.isDesktop && (
            <Sidebar active={filters} onToggle={toggleFilter} asDrawer={false} />
          )}

          {/* Product Grid */}
          <div style={{ flex: 1 }}>
            <div style={{
              display: "grid", gridTemplateColumns: cols,
              gap: bp.isMobile ? 12 : 16
            }}>
              {PRODUCTS.map(p => (
                <Card key={p.id} p={p} onAdd={addToCart}
                  wishlisted={wishlist.includes(p.id)} onWish={toggleWish}
                  compact={bp.isMobile} />
              ))}
            </div>

            {/* Pagination */}
            <div style={{
              display: "flex", justifyContent: "center", gap: 6, marginTop: 36,
              flexWrap: "wrap"
            }}>
              {[ 1, 2, 3, "…", 8 ].map((p, i) => (
                <button key={i} style={{
                  width: 34, height: 34, borderRadius: 8,
                  background: p === 1 ? T.accent : T.bgCard,
                  border: `1px solid ${p === 1 ? T.accent : T.border}`,
                  color: p === 1 ? "#08080e" : T.textSub,
                  fontFamily: T.fontMono, fontSize: 12, cursor: "pointer",
                  fontWeight: p === 1 ? 700 : 400
                }}>{p}</button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ════════════════════════════════════════════
          FOOTER — hidden on mobile (replaced by bottom nav)
      ════════════════════════════════════════════ */}
      {!bp.isMobile && (
        <footer style={{
          borderTop: `1px solid ${T.border}`, background: T.bgCard,
          padding: bp.isTablet ? "32px 20px" : "44px 28px", marginTop: 48
        }}>
          <div style={{ maxWidth: 1320, margin: "0 auto" }}>
            <div style={{ display: "flex", gap: 40, flexWrap: "wrap", marginBottom: 36 }}>
              {/* Brand */}
              <div style={{ minWidth: 180 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                  <div style={{
                    width: 26, height: 26, background: T.accent, borderRadius: 6,
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <Ico.Chip />
                  </div>
                  <span style={{
                    fontFamily: T.fontMono, fontWeight: 700, fontSize: 13,
                    letterSpacing: "0.05em"
                  }}>
                    TECH<span style={{ color: T.accent }}>STORE</span>
                  </span>
                </div>
                <p style={{
                  fontSize: 12, color: T.textMuted, lineHeight: 1.65,
                  margin: 0, maxWidth: 180
                }}>
                  Premium tech for enthusiasts and professionals.
                </p>
              </div>

              {[
                { t: "Shop", l: [ "Laptops", "GPUs", "Monitors", "Peripherals" ] },
                { t: "Support", l: [ "Track Order", "Returns", "Warranty", "Contact" ] },
                { t: "Company", l: [ "About", "Blog", "Careers", "Partners" ] },
              ].map(col => (
                <div key={col.t} style={{ minWidth: 110 }}>
                  <p style={{
                    fontFamily: T.fontMono, fontSize: 9, color: T.accent,
                    letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 10px"
                  }}>
                    {col.t}
                  </p>
                  {col.l.map(lnk => (
                    <p key={lnk} style={{
                      fontSize: 12, color: T.textSub,
                      marginBottom: 7, cursor: "pointer"
                    }}>{lnk}</p>
                  ))}
                </div>
              ))}

              {/* Newsletter */}
              <div style={{ flex: 1, minWidth: 200 }}>
                <p style={{
                  fontFamily: T.fontMono, fontSize: 9, color: T.accent,
                  letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 10px"
                }}>
                  NEWSLETTER
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  <input placeholder="your@email.com" style={{
                    flex: 1,
                    padding: "9px 12px", background: T.bg,
                    border: `1px solid ${T.border}`, borderRadius: 8,
                    color: T.text, fontFamily: T.fontSans, fontSize: 12, outline: "none"
                  }} />
                  <button style={{
                    background: T.accent, color: "#08080e", border: "none",
                    borderRadius: 8, padding: "9px 14px", fontFamily: T.fontMono,
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
                    cursor: "pointer"
                  }}>JOIN</button>
                </div>
              </div>
            </div>

            <div style={{
              borderTop: `1px solid ${T.border}`, paddingTop: 18,
              display: "flex", justifyContent: "space-between",
              flexWrap: "wrap", gap: 10
            }}>
              <p style={{ fontFamily: T.fontMono, fontSize: 10, color: T.textMuted, margin: 0 }}>
                © 2026 TechStore Inc.
              </p>
              <div style={{ display: "flex", gap: 16 }}>
                {[ "Privacy", "Terms", "Cookies" ].map(l => (
                  <span key={l} style={{
                    fontFamily: T.fontMono, fontSize: 10,
                    color: T.textMuted, cursor: "pointer"
                  }}>{l}</span>
                ))}
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* ── Mobile Bottom Nav ── */}
      {bp.isMobile && (
        <BottomNav cartCount={cartItems.length} onCartOpen={() => setCartOpen(true)} />
      )}

      {/* ── Filter Drawer (mobile + tablet) ── */}
      {filterOpen && (bp.isMobile || bp.isTablet) && (
        <Sidebar active={filters} onToggle={toggleFilter}
          asDrawer onClose={() => setFilterOpen(false)} />
      )}

      {/* ── Cart Drawer ── */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cartItems} />

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: "fixed", bottom: bp.isMobile ? 76 : 24,
          left: "50%", transform: "translateX(-50%)",
          background: T.success, color: "#08080e", borderRadius: 10,
          padding: "11px 22px", fontFamily: T.fontMono, fontWeight: 700,
          fontSize: 12, letterSpacing: "0.08em", zIndex: 200,
          boxShadow: "0 8px 32px #00e59960", whiteSpace: "nowrap"
        }}>
          ✓ ADDED — {toast.length > 20 ? toast.slice(0, 20) + "…" : toast}
        </div>
      )}
    </div>
  );
}