# CLAUDE.md – GoldenWeb Website
> Dieses Dokument enthält alle Projektinformationen für den Website-Build mit Claude Code.
> Lies es vollständig bevor du anfängst zu bauen.

---

## PROJEKT-ÜBERSICHT

**Projekt:** GoldenWeb – vollständige Agentur-Website
**Tech Stack:** HTML5 + CSS3 (Custom Properties) + Vanilla JavaScript
**Ziel:** Eine production-ready, responsive Website die Claude Code section-by-section baut
**Struktur:** Single-Page (index.html) mit modularen CSS- und JS-Dateien

### Was GoldenWeb ist
GoldenWeb ist eine Webdesign-Agentur für Handwerker und lokale Dienstleister in Deutschland.
Schwestermarke von GoldenPost (Social Media Agentur).
**Kern-Differenzierer:** GoldenWeb verkauft kein Webdesign — sondern ein Anfragen-System:
Website + KI-Chatbot + Speed-to-Lead + CRM. Kein Lead geht verloren. Automatisch.

### Tagline (final, unveränderlich)
> „Deine Website arbeitet 24/7, damit du es nicht mehr musst."

### Tonalität
- Du-Form durchgehend
- Direkt, keine Buzzwords, kein Agentur-Speak
- Zahlen statt Adjektive: „12 neue Anfragen" schlägt „deutlich mehr Kunden"
- Kurze Sätze. Starke Aussagen.

---

## DATEISTRUKTUR

```
goldenweb/
├── index.html
├── CLAUDE.md                  ← diese Datei
├── assets/
│   ├── css/
│   │   ├── design-system.css  ← CSS Custom Properties (alle Tokens)
│   │   ├── components.css     ← Buttons, Cards, Tags, Inputs, Badges
│   │   ├── sections.css       ← Section-spezifische Styles
│   │   └── animations.css     ← Keyframes, Transitions
│   ├── js/
│   │   ├── main.js            ← Init, Scroll-Events, Nav-Behavior
│   │   ├── animations.js      ← Count-Up, Scroll-Trigger, Fade-In
│   │   ├── carousel.js        ← Case Study Carousel
│   │   ├── accordion.js       ← FAQ Accordion
│   │   ├── flowchart.js       ← System-Diagramm Animation
│   │   └── timer.js           ← Countdown (falls verwendet)
│   └── media/
│       ├── logo.svg
│       └── placeholder/       ← Platzhalter-Bilder während Build
└── pages/                     ← Optionale Unterseiten später
```

---

## DESIGN SYSTEM

### Farben (CSS Custom Properties)

```css
:root {
  /* Hintergründe – warm, nicht kalt-schwarz */
  --color-bg-base:     #0C0B09;
  --color-bg-elevated: #161411;
  --color-bg-raised:   #1E1B17;
  --color-bg-overlay:  #252119;

  /* Gold – Primärfarbe */
  --color-gold:        #C8A96E;
  --color-gold-light:  #E2C990;
  --color-gold-dark:   #A07840;
  --color-gold-muted:  rgba(200, 169, 110, 0.12);

  /* Text */
  --color-text-primary:   #F0EDE8;
  --color-text-secondary: #9A9188;
  --color-text-tertiary:  #5A5248;
  --color-text-inverse:   #0C0B09;

  /* Borders */
  --color-border-subtle:  #1E1B17;
  --color-border-default: #2C2820;
  --color-border-strong:  #3E3830;
  --color-border-gold:    rgba(200, 169, 110, 0.35);

  /* Semantisch */
  --color-success: #4CAF7D;
  --color-error:   #E05252;

  /* Gradienten */
  --gradient-gold: linear-gradient(135deg, #C8A96E 0%, #E2C990 50%, #A07840 100%);
  --gradient-hero-glow: radial-gradient(ellipse 70% 50% at 50% -5%, rgba(200,169,110,0.15) 0%, transparent 70%);
  --gradient-card-shine: linear-gradient(135deg, rgba(200,169,110,0.08) 0%, transparent 50%);
}
```

### Typografie

```css
:root {
  --font-display: 'Syne', sans-serif;
  --font-body:    'Inter', sans-serif;

  /* Scale */
  --text-display-2xl: clamp(3rem, 7vw, 6rem);     /* Hero Headline */
  --text-display-xl:  clamp(2.5rem, 5vw, 4.5rem); /* Section Headline */
  --text-display-lg:  clamp(2rem, 4vw, 3.5rem);   /* Sub-Headline */
  --text-display-md:  clamp(1.5rem, 3vw, 2.5rem); /* Card Headline */
  --text-xl:  1.5rem;
  --text-lg:  1.25rem;
  --text-md:  1rem;
  --text-sm:  0.875rem;
  --text-xs:  0.75rem;

  /* Weights */
  --weight-regular: 400;
  --weight-medium:  500;
  --weight-semibold: 600;
  --weight-bold:    700;

  /* Leading */
  --leading-tight:   1.1;
  --leading-snug:    1.3;
  --leading-normal:  1.5;
  --leading-relaxed: 1.7;

  /* Tracking */
  --tracking-tight:  -0.03em;
  --tracking-normal: 0em;
  --tracking-wide:   0.06em;
  --tracking-wider:  0.12em;
}
```

### Spacing (8px Base)

```css
:root {
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
  --space-32: 128px;
}
```

### Border Radius & Shadows

```css
:root {
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-xl:   16px;
  --radius-2xl:  24px;
  --radius-full: 9999px;

  --shadow-md: 0 4px 12px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.3);
  --shadow-lg: 0 10px 30px rgba(0,0,0,0.6);
  --glow-gold-sm: 0 0 20px rgba(200,169,110,0.2);
  --glow-gold-md: 0 0 40px rgba(200,169,110,0.3);
  --glow-button:  0 0 30px rgba(200,169,110,0.5), 0 4px 15px rgba(200,169,110,0.3);
}
```

### Animationen

```css
:root {
  --ease-default:  cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out:      cubic-bezier(0, 0, 0.2, 1);
  --ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-expo-out: cubic-bezier(0.16, 1, 0.3, 1);

  --duration-fast:   100ms;
  --duration-normal: 200ms;
  --duration-slow:   300ms;
  --duration-xslow:  500ms;
  --duration-stagger: 80ms;
}
```

---

## WEBSITE STRUKTUR (9 Sections)

### SECTION 1 – Navigation

**HTML-Struktur:**
```html
<nav class="nav" id="nav">
  <div class="nav__container">
    <a href="#" class="nav__logo">GoldenWeb</a>
    <ul class="nav__links">
      <li><a href="#leistungen">Leistungen</a></li>
      <li><a href="#referenzen">Referenzen</a></li>
      <li><a href="#ueber-uns">Über uns</a></li>
      <li><a href="#faq">FAQ</a></li>
    </ul>
    <a href="#kontakt" class="btn btn--primary btn--sm">Kostenloses Erstgespräch</a>
    <button class="nav__hamburger" aria-label="Menü"><!-- Icon --></button>
  </div>
</nav>
```

**Verhalten:**
- `position: fixed`, `z-index: 1000`
- Startet transparent, wechselt bei `scrollY > 80` zu `backdrop-filter: blur(20px)` + `background: rgba(12,11,9,0.9)`
- Mobile: Hamburger → Fullscreen-Overlay-Menü
- Aktiver Link: `color: var(--color-gold)`

---

### SECTION 2 – Hero

**Headline:** „Deine Website arbeitet 24/7, damit du es nicht mehr musst."
**Subline:** „Wir bauen ein System aus Website, KI und Automatisierung – das planbar neue Anfragen bringt. Für Handwerker und lokale Dienstleister. Deutschlandweit."

**CTAs:**
- Primär: „Kostenloses Erstgespräch buchen" → `#kontakt`
- Sekundär: „Referenzen ansehen" → `#referenzen`

**Trust-Zeile direkt unter CTAs:**
```
✓ Kein technisches Vorwissen nötig   ✓ Fertig in 30 Tagen   ✓ Geld-zurück-Garantie
```

**Interaktive Elemente:**
1. **Hintergrund-Glow:** `var(--gradient-hero-glow)` – statisch, dezent pulsierend (CSS-Animation)
2. **Animiertes Grid:** Sehr feines CSS-Grid-Muster das sich langsam nach unten bewegt
3. **Branchen-Marquee** direkt unter Hero-Content:
   Endlos scrollende Chips: `Elektriker · Dachdecker · Schreiner · Sanitär · Immobilien · Physiotherapeut · Rechtsanwalt · Steuerberater · KFZ-Betrieb · Maler · Gartenbau · Fahrschule ·`

**Animations-Klassen (Scroll-Trigger):**
- `.fade-up` auf Headline, Subline, CTAs — mit Stagger-Delay

---

### SECTION 3 – Sozialer Beweis / Zahlen

**Headline (klein, Eyebrow):** „Bereits vertrauen uns"

**4 Stat-Karten:**
```
+340%              30 Tage           50+              100%
Mehr Anfragen      Bis zur           Betriebe         Zufriedenheits-
im Schnitt         fertigen Website   erfolgreich      garantie
                                     umgesetzt
```

**Interaktiv:** Count-Up Animation (JS Intersection Observer) — Zahlen starten bei 0 sobald Section sichtbar.

**Darunter:** Kundenlogo-Reihe (Belitz + Platzhalter)
- Belitz: Logo + „Aktuell in Umsetzung"
- Weitere Slots: ausgegraut mit „Dein Unternehmen?"

---

### SECTION 4 – Das Problem

**Headline:** „Deine Konkurrenz ist schon online. Du noch nicht."

**Copy (große Typografie, Scroll-animiert):**
```
Du machst gute Arbeit.
Deine Kunden sind zufrieden.

Aber wenn jemand googelt —
findet er dich nicht.

Stattdessen: die Konkurrenz.
Mit einer besseren Website.
Und deinen potenziellen Kunden.

Das muss nicht so bleiben.
```

**Design:** Nur Typografie. Viel Whitespace. Jede Zeile faded einzeln ein beim Scrollen (JS Intersection Observer mit Stagger).

---

### SECTION 5 – Das System (KERN-DIFFERENZIERER)

**Headline:** „Wie das System funktioniert"
**Sub:** „Wir bauen keine Website. Wir bauen ein System, das 24/7 für dich arbeitet."

**4 Bausteine als animiertes Flowchart:**

```
[1. Website]  →→→  [2. KI-Chatbot]  →→→  [3. Speed-to-Lead]  →→→  [4. CRM]
Conversion-        Antwortet sofort       Sofort-Rückruf             Kein Lead
optimiert          auf Anfragen           automatisch                geht verloren
```

**Ergebnis-Statement:** „Das Ergebnis: Du verpasst keine Anfrage mehr. Automatisch."

**Interaktiv (JS):**
- Beim Einscroll: Nodes erscheinen nacheinander (Stagger 300ms)
- Verbindungspfeile „zeichnen" sich von links nach rechts
- Hover auf Node: Tooltip mit Detail-Info öffnet sich
- Verbindungslinien: animierte SVG-Pfeile in Gold

**Technischer Aufbau:**
```html
<div class="flowchart">
  <div class="flowchart__node" data-index="0">...</div>
  <div class="flowchart__arrow">→</div>
  <div class="flowchart__node" data-index="1">...</div>
  <!-- etc. -->
</div>
```

---

### SECTION 6 – Pakete / Preise

**Headline:** „Das richtige Paket für dein Business"

**3 Pakete:**

| | Starter | Growth ⭐ | System |
|--|---------|-----------|--------|
| Preis | **Ab 2.500 €** | **Ab 4.500 €** | **Ab 6.000 € + Retainer** |
| Website | ✓ 5 Seiten | ✓ Bis 10 Seiten | ✓ Unbegrenzt |
| KI-Chatbot | — | ✓ | ✓ |
| Speed-to-Lead | — | — | ✓ |
| CRM-Integration | — | — | ✓ |
| SEO | Grundlage | Lokal optimiert | Vollständig |
| Support | E-Mail | E-Mail + Call | Direkt-Ansprechpartner |
| CTA | „Starter anfragen" | „Growth anfragen" | „System anfragen" |

- Growth-Karte: hervorgehoben mit Badge „Beliebteste Wahl", goldener Border
- Darunter: „Nicht sicher welches Paket? Kostenloses Erstgespräch →"

---

### SECTION 7 – Case Studies / Referenzen

**Headline:** „Ergebnisse, die für sich sprechen."

**3 Case-Study-Karten (Carousel auf Mobile, Grid auf Desktop):**

**Karte 1 – Belitz Unternehmensgruppe**
```
Branche:    Unternehmensgruppe (Bau / Immobilien)
Status:     Aktuell in Umsetzung
Leistung:   Website + System-Integration
Preview:    [Screenshot Placeholder + „Launch: Q3 2026"]
```

**Karte 2 – Demo: Elektrobetrieb**
```
Branche:    Elektro / Handwerk
Ergebnis:   +18 Anfragen im ersten Monat
            12 Keywords auf Seite 1
Zeitraum:   30 Tage bis Launch
Kennzeichnung: [Konzept-Website für die Branche]
```

**Karte 3 – Demo: Physiotherapie**
```
Branche:    Gesundheit / Praxis
Ergebnis:   +220% organischer Traffic
            Warteliste nach 90 Tagen
Zeitraum:   28 Tage bis Launch
Kennzeichnung: [Konzept-Website für die Branche]
```

**Interaktiv:**
- Desktop: 3-Spalten Grid
- Mobile: Swipeable Carousel (Touch-Events)
- Hover: Card leicht heben + Gold-Glow

---

### SECTION 8 – Prozess

**Headline:** „So einfach läuft es ab."
**Sub:** „Dein Zeitaufwand: ca. 2–3 Stunden. Den Rest übernehmen wir."

**4 Steps (Horizontal Timeline Desktop / Vertikal Mobile):**

```
01 Gespräch        02 Strategie       03 Umsetzung       04 Live & Anfragen
───────────────    ───────────────    ───────────────    ───────────────────
15 Min.            Wir analysieren    Du gibst           Deine Website geht
Kennenlernen.      Branche,           Feedback.          live. Anfragen
Wir schauen ob     Konkurrenz und     Wir setzen um.     kommen rein.
wir passen.        erstellen den      1× Freigabe.       Automatisch.
                   Plan.
```

**Interaktiv (JS):**
- Beim Scrollen: Steps aktivieren sich nacheinander
- Verbindungslinie füllt sich in Gold von Step zu Step
- Aktiver Step: goldener Kreis, Detail-Box öffnet sich
- Abgeschlossene Steps: Haken-Icon in Gold

---

### SECTION 9 – Abschluss-CTA + Footer

**Headline:** „Deine Konkurrenz schläft nicht. Aber deine Website tut es gerade."
**Sub:** „Lass uns das ändern. 15 Minuten Erstgespräch — kostenlos, unverbindlich, konkreter Plan."

**CTA:** „Jetzt Erstgespräch buchen" (groß, Gold-Button, pulsiert dezent)

**4 Trust-Bullets:**
```
✓ Kostenlos & unverbindlich    ✓ Antwort innerhalb von 24h
✓ Fertig in 30 Tagen           ✓ Geld-zurück-Garantie
```

**Hintergrund:** Warmer Gold-Glow von oben (CSS radial-gradient)

---

**Footer:**
```
Logo GoldenWeb
───────────────────────────────────────────
Leistungen | Referenzen | Über uns | FAQ | Kontakt
───────────────────────────────────────────
Schwestermarke: Content & Social Media? → GoldenPost
Social: LinkedIn · Instagram · YouTube
───────────────────────────────────────────
© 2026 GoldenWeb | Impressum | Datenschutz | AGB
```

---

## KOMPONENTEN-SPEZIFIKATIONEN

### Buttons

```css
/* Primär */
.btn--primary {
  background: var(--gradient-gold);
  color: var(--color-text-inverse);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  padding: 12px 28px;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-default);
}
.btn--primary:hover {
  box-shadow: var(--glow-button);
  transform: translateY(-1px);
}

/* Ghost */
.btn--ghost {
  background: transparent;
  color: var(--color-gold);
  border: 1px solid var(--color-border-gold);
  /* gleiche padding/radius wie primary */
}
.btn--ghost:hover {
  background: var(--color-gold-muted);
  border-color: var(--color-gold);
}

/* Größen */
.btn--sm { padding: 8px 16px; font-size: var(--text-xs); }
.btn--lg { padding: 16px 36px; font-size: var(--text-lg); }
```

### Cards

```css
.card {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  transition: all var(--duration-slow) var(--ease-default);
}
.card:hover {
  border-color: var(--color-border-gold);
  box-shadow: var(--glow-gold-sm);
  transform: translateY(-4px);
}

/* Hervorgehobene Karte */
.card--featured {
  border-color: var(--color-border-gold);
  background: linear-gradient(135deg, rgba(200,169,110,0.06), var(--color-bg-elevated));
}
```

### Eyebrow / Tags

```css
.eyebrow {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: var(--color-gold);
  margin-bottom: var(--space-4);
  display: block;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  background: var(--color-bg-overlay);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  color: var(--color-text-secondary);
}
```

---

## INTERAKTIVE ELEMENTE (JS-Spezifikationen)

### Scroll-Trigger Animations (animations.js)

```javascript
// Intersection Observer für alle .fade-up Elemente
// threshold: 0.15
// Klasse .is-visible hinzufügen → CSS-Transition
// Stagger: animation-delay: calc(index * 80ms)
```

### Count-Up (animations.js)

```javascript
// Ziel: .stat-number Elemente
// data-target="340" → zählt von 0 auf 340
// Easing: easeOutExpo
// Dauer: 2000ms
// Startet wenn Section sichtbar (Intersection Observer)
```

### Flowchart Animation (flowchart.js)

```javascript
// Nodes: erscheinen nacheinander mit 300ms Stagger
// Pfeile: SVG stroke-dashoffset Animation (zeichnen sich)
// Hover: Tooltip öffnet sich (position: absolute)
// Trigger: Intersection Observer bei Section-Eintritt
```

### Marquee (main.js)

```javascript
// CSS animation: marquee 30s linear infinite
// Pause bei hover: animation-play-state: paused
// Duplizierten Content für nahtlosen Loop
```

### Accordion FAQ (accordion.js)

```javascript
// max-height: 0 → max-height: scrollHeight transition
// Icon rotate(180deg) bei aktiv
// Nur ein Item gleichzeitig offen (optional)
// Goldener left-border bei aktivem Item
```

### Nav Scroll (main.js)

```javascript
// window.scrollY > 80 → nav.classList.add('nav--scrolled')
// Hamburger → Mobile-Menü toggle
```

---

## FAQ INHALTE

1. **Was kostet eine Website bei GoldenWeb?**
   Unsere Websites starten ab 2.500 €. Im kostenlosen Erstgespräch bekommst du ein konkretes Angebot für dein Projekt.

2. **Wie lange dauert es, bis meine Website fertig ist?**
   In der Regel 30 Tage vom ersten Gespräch bis zum Launch — vorausgesetzt du bist für Feedback erreichbar.

3. **Wie viel Zeit muss ich selbst investieren?**
   Ca. 2–3 Stunden gesamt: Erstgespräch, Feedback auf den Entwurf, Freigabe. Den Rest übernehmen wir.

4. **Was ist der Unterschied zu einer normalen Webdesign-Agentur?**
   Wir bauen kein Design — wir bauen ein System. Website + KI-Chatbot + automatisierte Anfragenbearbeitung. Dein Mitbewerber hat eine hübsche Website. Du hast eine die arbeitet.

5. **Ich hatte schon eine Agentur — hat nicht funktioniert. Warum soll das anders sein?**
   Weil wir Ergebnisse garantieren. Wenn nach 90 Tagen keine messbaren Verbesserungen da sind, arbeiten wir kostenlos weiter.

6. **Brauche ich technisches Vorwissen?**
   Null. Wir erklären alles in normaler Sprache und du hast einen direkten Ansprechpartner nach dem Launch.

7. **Was ist mit Hosting und Wartung?**
   Hosting ist im Paket enthalten. Laufende Wartung und Updates können als Retainer dazugebucht werden.

---

## WICHTIGE HINWEISE FÜR DEN BUILD

### Mach das
- Mobile-First entwickeln — Handwerker surfen überwiegend mit Smartphone
- `clamp()` für responsive Schriftgrößen nutzen
- Alle Animationen hinter `@media (prefers-reduced-motion: reduce)` absichern
- Semantisches HTML: `<section>`, `<nav>`, `<main>`, `<footer>`, `aria-label`
- Performance: Bilder lazy-loaden, JS defer, CSS critical inline
- Smooth scroll: `scroll-behavior: smooth` auf `html`

### Mach das nicht
- Kein jQuery, kein Bootstrap — nur Vanilla JS und eigenes CSS
- Keine Stock-Fotos einbauen (Platzhalter verwenden)
- Keine externen CSS-Frameworks
- Keine `!important` Overrides im CSS
- Kein `alert()` oder `console.log` im finalen Code

### Google Fonts einbinden
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

### Meta Tags (SEO)
```html
<title>GoldenWeb – Websites die Aufträge bringen. Automatisch.</title>
<meta name="description" content="GoldenWeb baut Websites für Handwerker und lokale Dienstleister, die 24/7 neue Anfragen bringen. Mit KI, Speed-to-Lead und CRM. Fertig in 30 Tagen.">
<meta name="robots" content="index, follow">
<!-- kein noindex! -->
```

---

## NOCH OFFEN (vor Launch klären)

- [ ] Professionelle Fotos von Bruno & Partner (für Über-uns-Section)
- [ ] Belitz-Website Launch-Datum (für Case Study)
- [ ] Echte Kundenzahlen sobald verfügbar
- [ ] Domain: `goldenweb.de` prüfen und registrieren
- [ ] Calendly-Link für Erstgespräch einsetzen
- [ ] Impressum / Datenschutz Texte einfügen

---

*Erstellt: Mai 2026 | GoldenWeb Website-Projekt*
*Alle strategischen Entscheidungen sind final — direkt mit dem Build beginnen.*
