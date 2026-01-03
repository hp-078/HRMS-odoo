---
agent: agent
---

You are GitHub Copilot acting as a SENIOR ODOO WEBSITE THEME DESIGNER.

Your task is to generate a COMPLETE, PRODUCTION-READY **Odoo website theme module** that visually matches the **look & feel** of https://www.odoo.com.

⚠️ IMPORTANT:
This is **ONLY a frontend theme**.
❌ No Odoo business logic
❌ No app features
❌ No backend functionality
❌ No database usage

Focus ONLY on:
- Visual design
- Layout
- SCSS styling
- QWeb templates
- Responsive behavior
- Accessibility

────────────────────────────────────────
1. OBJECTIVE
────────────────────────────────────────

Create an installable Odoo theme module named:

website_odoo_clone

The theme must be:
- Clean
- Modern SaaS-style
- Professional
- Responsive
- Accessible
- Easily customizable

────────────────────────────────────────
2. DESIGN SYSTEM (MANDATORY)
────────────────────────────────────────

COLORS:
- Primary:   #714B67
- Secondary: #017E84
- Dark text: #2A2A2A
- Muted text:#8F8F8F
- Background:#FFFFFF
- Surface:   #F7F8FA

TYPOGRAPHY:
- Font: Inter, system-ui, sans-serif
- Base: 16px
- Line height: 1.5

Headings:
- H1: 48px / 700
- H2: 36px / 700
- H3: 28px / 600
- Body: 16px / 400

Buttons:
- Border radius: 6px
- Font weight: 600
- Hover + focus states
- Visible focus outline

────────────────────────────────────────
3. REQUIRED FILE STRUCTURE
────────────────────────────────────────

Generate ALL files with COMPLETE content:

website_odoo_clone/
├── __manifest__.py
├── views/
│   ├── assets.xml
│   └── templates.xml
├── static/
│   └── src/
│       ├── scss/
│       │   ├── primary_variables.scss
│       │   ├── theme.scss
│       │   └── utilities.scss
│       ├── js/
│       │   └── theme.js
│       └── img/
│           └── placeholder-hero.jpg
└── README.md

DO NOT omit any file.

────────────────────────────────────────
4. TECHNICAL RULES
────────────────────────────────────────

- QWeb templates only
- Inherit `website.assets_frontend`
- SCSS only (no CSS)
- Prefix ALL custom classes with `ooc-`
- Use Bootstrap grid
- Compatible with Odoo 14+

No controllers unless strictly required for demo rendering.

────────────────────────────────────────
5. REQUIRED THEME SECTIONS
────────────────────────────────────────

HEADER
- Sticky
- Logo left
- Navigation right
- Primary CTA button
- Mobile hamburger menu

HERO
- Large headline
- Subtitle
- Two CTA buttons
- Background image with overlay

FEATURES
- 3 cards
- Icon, title, description
- Hover elevation

PRICING
- 3 cards
- Middle plan highlighted
- CTA buttons only

FOOTER
- 4 columns
- Bottom copyright bar

────────────────────────────────────────
6. SCSS RULES
────────────────────────────────────────

- Mobile-first
- Breakpoints: 576 / 768 / 992 / 1200
- Use variables
- Subtle transitions
- Support `prefers-reduced-motion`

────────────────────────────────────────
7. JAVASCRIPT RULES
────────────────────────────────────────

- Vanilla JS only
- Only for:
  - Mobile menu toggle
  - Minor UX polish
- Keep minimal

────────────────────────────────────────
8. ACCESSIBILITY
────────────────────────────────────────

- Semantic HTML
- Proper heading order
- Alt text on images
- Keyboard navigation
- Focus-visible styles

────────────────────────────────────────
9. OUTPUT FORMAT
────────────────────────────────────────

Output files EXACTLY like:

=== file: website_odoo_clone/__manifest__.py ===
<content>

Generate EVERY file.
NO explanations.
NO partial output.

────────────────────────────────────────
END
────────────────────────────────────────
