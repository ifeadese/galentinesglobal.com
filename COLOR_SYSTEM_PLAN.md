# Color System Refactoring Plan
## Brand Colors for "The Love of God Conference" - Annual Ladies' Christian Faith Event

## Brand Identity & Color Philosophy

### Theme: God's Love, Femininity, Grace, and Faith
The color palette reflects:
- **Warmth & Love**: Soft coral, rose, and pink tones representing God's unconditional love
- **Grace & Elegance**: Light, airy backgrounds and sophisticated neutrals
- **Femininity**: Gentle, nurturing colors appropriate for a ladies' gathering
- **Spiritual Depth**: Rich burgundy and deep rose for meaningful moments

---

## Brand Color Palette

### Primary Colors (Love & Warmth)
```scss
// Primary Accent - Warm Coral (God's Love)
$color-primary: rgb(255, 107, 107);          // Warm coral - represents love and warmth
$color-primary-light: rgb(255, 182, 193);    // Light pink - soft, feminine
$color-primary-dark: rgb(255, 99, 99);       // Deeper coral for emphasis

// Secondary - Deep Rose/Burgundy (Spiritual Depth)
$color-secondary: rgb(54, 5, 8);             // Deep burgundy - elegant, meaningful
$color-secondary-light: rgb(139, 69, 85);    // Muted rose - sophisticated
```

### Background Colors (Grace & Peace)
```scss
// Light Backgrounds (Grace, Peace, Light)
$color-bg-primary: #ffffff;                   // Pure white - clean, holy
$color-bg-secondary: #ffb6c1;                 // Light pink - soft, feminine
$color-bg-cream: #fffaf5;                     // Warm cream - welcoming
$color-bg-light: #fef7f7;                     // Very light pink tint
$color-bg-muted: #f5f5f5;                     // Soft gray for subtle sections
```

### Text Colors (Readability & Elegance)
```scss
// Text Colors
$color-text-primary: rgb(54, 5, 8);          // Deep burgundy - elegant, readable
$color-text-secondary: #666666;               // Medium gray - secondary text
$color-text-light: #999999;                   // Light gray - muted text
$color-text-on-dark: #ffffff;                 // White text on dark backgrounds
$color-text-accent: rgb(255, 107, 107);      // Primary color for emphasis
```

### Accent Colors (Supporting Tones)
```scss
// Soft Pinks & Roses (Feminine, Gentle)
$color-accent-pink-light: #ffe4e6;            // Very light pink
$color-accent-pink-medium: #ffb6c1;           // Light pink
$color-accent-rose: #e5bcbc;                  // Soft rose
$color-accent-rose-dark: #d7a3a3;             // Deeper rose
```

### Dark Backgrounds (Contrast & Depth)
```scss
// Dark Backgrounds (for hero sections, depth)
$color-bg-dark: #0b0b0b;                      // Near black - sophisticated
$color-bg-darker: #151515;                    // Slightly lighter black
$color-border-dark: rgb(76, 76, 76);          // Medium gray borders
```

---

## Semantic Color Mapping

```scss
// ============================================
// SEMANTIC COLORS (Purpose-based names)
// ============================================

// Primary Actions & Emphasis
$primary: $color-primary;                      // Use for CTAs, icons, highlights
$primary-hover: $color-primary-dark;           // Hover states

// Text Hierarchy
$text-primary: $color-text-primary;            // Main text color
$text-secondary: $color-text-secondary;        // Secondary/subtle text
$text-accent: $color-text-accent;              // Accented text (brand color)

// Background Hierarchy
$bg-primary: $color-bg-primary;                // Main background
$bg-secondary: $color-bg-secondary;            // Alternative background
$bg-elevated: $color-bg-cream;                 // Elevated sections
$bg-subtle: $color-bg-light;                   // Very subtle background tint

// Borders & Dividers
$border-light: rgba(255, 107, 107, 0.2);      // Light border (primary tint)
$border-medium: $color-border-dark;            // Medium border
$border-dark: rgba(255, 107, 107, 0.4);       // Darker border (on hover)

// Shadows (Brand-appropriate soft shadows)
$shadow-subtle: rgba(255, 107, 107, 0.05);    // Very subtle shadow
$shadow-soft: rgba(255, 107, 107, 0.1);       // Soft shadow
$shadow-medium: rgba(255, 107, 107, 0.15);    // Medium shadow
```

---

## Gradient System (God's Love Theme)

### Background Gradients
```scss
// Main Background Gradient (Light & Graceful)
@mixin gradient-bg-primary {
  background-image: linear-gradient(90deg, $color-bg-secondary 0%, $color-bg-primary 100%);
  // Soft pink to white - represents grace and light
}

// Subtle Section Gradient (Gentle Warmth)
@mixin gradient-bg-subtle {
  background: linear-gradient(180deg, 
    rgba(255, 182, 193, 0.1) 0%, 
    transparent 50%, 
    rgba(255, 182, 193, 0.05) 100%);
  // Very subtle pink tint - soft, welcoming
}

// Card Background Gradient (Elevated, Warm)
@mixin gradient-card-default {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.9) 0%, 
    rgba(255, 240, 240, 0.5) 100%);
  // White to soft pink tint - warm, feminine
}

// Card Hover Gradient (Love & Warmth)
@mixin gradient-card-hover {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 1) 0%, 
    rgba(255, 245, 245, 0.8) 100%);
  // Slightly more pronounced pink on hover
}

// Hero/Dark Section Gradient (Depth with Love)
@mixin gradient-primary-accent {
  background: linear-gradient(to bottom right, 
    $color-primary 0%, 
    $color-primary-light 50%, 
    $color-primary-light 100%);
  // Coral to light pink - warm, inviting
}

// Muted Section Background
@mixin gradient-bg-muted {
  background: linear-gradient(to bottom right, 
    $color-bg-muted 0%, 
    $color-bg-primary 50%, 
    $color-bg-muted 100%);
  // Soft gray to white - neutral, professional
}
```

### Text Gradients (Elegant, Meaningful)
```scss
// Primary Text Gradient (Love & Depth)
@mixin gradient-text-primary {
  background: linear-gradient(135deg, 
    $color-text-primary 0%, 
    $color-primary 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  // Burgundy to coral - elegant, meaningful
}

// Accent Line Gradient (Subtle Elegance)
@mixin gradient-line-accent {
  background: linear-gradient(90deg, 
    transparent 0%, 
    $color-primary 50%, 
    transparent 100%);
  // Subtle accent line for hover effects
}
```

---

## CSS Custom Properties (For React/Inline Styles)

```scss
:root {
  // Primary Colors
  --color-primary: #{$color-primary};
  --color-primary-light: #{$color-primary-light};
  --color-primary-dark: #{$color-primary-dark};
  
  // Secondary Colors
  --color-secondary: #{$color-secondary};
  --color-secondary-light: #{$color-secondary-light};
  
  // Background Colors
  --color-bg-primary: #{$color-bg-primary};
  --color-bg-secondary: #{$color-bg-secondary};
  --color-bg-cream: #{$color-bg-cream};
  --color-bg-light: #{$color-bg-light};
  --color-bg-muted: #{$color-bg-muted};
  
  // Text Colors
  --color-text-primary: #{$color-text-primary};
  --color-text-secondary: #{$color-text-secondary};
  --color-text-light: #{$color-text-light};
  --color-text-on-dark: #{$color-text-on-dark};
  --color-text-accent: #{$color-text-accent};
  
  // Borders
  --color-border-light: #{$border-light};
  --color-border-medium: #{$color-border-dark};
  
  // Shadows (as rgba strings for inline styles)
  --shadow-subtle: rgba(255, 107, 107, 0.05);
  --shadow-soft: rgba(255, 107, 107, 0.1);
  --shadow-medium: rgba(255, 107, 107, 0.15);
}
```

---

## Color Usage Guidelines

### Primary Color (Coral - rgb(255, 107, 107))
- **Use for**: CTAs, icons, accent elements, hover states
- **Represents**: God's love, warmth, invitation
- **Avoid**: Large text blocks (use for emphasis only)

### Deep Burgundy (rgb(54, 5, 8))
- **Use for**: Primary text, headings, important content
- **Represents**: Spiritual depth, elegance, meaningfulness
- **Provides**: Excellent readability and sophistication

### Light Pink Backgrounds (#ffb6c1)
- **Use for**: Hero sections, featured areas, card backgrounds
- **Represents**: Grace, femininity, softness
- **Creates**: Warm, welcoming atmosphere

### White Backgrounds
- **Use for**: Main content areas, cards (with subtle pink tints)
- **Represents**: Purity, light, clarity
- **Provides**: Clean, professional appearance

---

## Implementation Phases

### **Phase 1: Foundation Setup** ⭐ (Start Here)
**Goal**: Create comprehensive brand-appropriate color system

**Tasks**:
1. Update `common.scss` with complete brand color palette
2. Define all semantic color mappings
3. Create gradient mixins reflecting brand theme
4. Add CSS custom properties for React components

**Files to modify**:
- `common.scss` - Complete color system expansion

**Brand Considerations**:
- Ensure all colors reflect warmth, love, femininity, and grace
- Maintain elegance and sophistication
- Keep accessibility in mind (contrast ratios)

---

### **Phase 2: SCSS Files Refactoring**
**Goal**: Apply brand colors consistently across all stylesheets

**Priority Files**:
1. `globals.scss` - Main background gradients
2. `components/hero.module.scss` - Hero section (dark bg with light accents)
3. `components/button.module.scss` - CTAs using primary color
4. `pages/about.module.scss` - Elegant card gradients
5. `pages/support.module.scss` - Warm section backgrounds
6. `components/card.module.scss` - Card styling
7. `components/footer.module.scss` - Footer colors

---

### **Phase 3: Inline Styles Migration**
**Goal**: Replace inline styles with CSS variables

**Strategy**: 
- Use CSS custom properties for React inline styles
- Create TypeScript constants for type safety
- Maintain brand consistency across all components

**Key Components**:
- `pages/about.tsx` - Gradient text, backgrounds
- `pages/support.tsx` - Section backgrounds, text colors
- `components/hero.tsx` - Icon colors
- All components using Material-UI `sx` props

---

### **Phase 4: Brand Consistency Review**
**Goal**: Ensure all colors reflect the brand identity

**Checklist**:
- [ ] All colors align with brand theme (love, grace, femininity)
- [ ] Gradients are cohesive and elegant
- [ ] Text has proper contrast for accessibility
- [ ] No harsh or conflicting colors
- [ ] Brand colors create emotional connection (warmth, love)

---

## Color Harmony Rules

1. **Warm Tones**: Stick to warm colors (coral, pink, rose, burgundy)
2. **Soft Contrasts**: Avoid harsh black/white contrasts; use burgundy for text
3. **Feminine Palette**: Gentle, nurturing colors throughout
4. **Graceful Gradients**: Smooth transitions, never jarring
5. **Spiritual Depth**: Deep burgundy for meaningful content, coral for love/action

---

## Quick Reference

### Most Used Colors:
- **Primary Action**: `rgb(255, 107, 107)` - Coral
- **Main Text**: `rgb(54, 5, 8)` - Burgundy  
- **Background**: `#ffb6c1` - Light Pink OR `#ffffff` - White
- **Secondary Text**: `#666666` - Gray

### Most Used Gradients:
- Main BG: Light pink → White (90deg)
- Text Accent: Burgundy → Coral (135deg)
- Card BG: White → Soft pink tint (135deg)

---

## Next Steps

**Recommended**: Start with Phase 1 to establish the complete brand color foundation, then progressively migrate files to use these brand-appropriate colors.

The color system will ensure every element reflects the warm, loving, graceful, and feminine nature of "The Love of God Conference."
