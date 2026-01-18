# Cephalopod Creations — Development Guide

## Project Overview

An interactive, animated link directory visualized as a cuttlefish with tentacles. Each tentacle represents a website and is clickable to view more information. Built with vanilla JavaScript/CSS - no frameworks or build tools.

**Key Features:**
- Programmatically generated SVG cuttlefish
- Interactive tentacles and labels with hover effects
- Modal dialogs for site information
- List view for plaintext site directory
- Organic colour shifting, wave, and fin animations
- Full accessibility (WCAG 2.1 AA compliant)
- Mobile responsive design with viewport optimization

## Architecture

### Technology Stack
- **Frontend**: Vanilla JavaScript (ES6 modules)
- **Styling**: CSS3 with custom properties
- **Graphics**: Programmatically generated SVG
- **Data**: JSON configuration file
- **Server**: Python HTTP server (development only)

### Module Structure

```
js/
├── main.js          # Application entry point and initialization
├── cuttlefish.js    # SVG generation (body, tentacles, labels)
├── data-loader.js   # Fetch and validate sites.json
├── modal.js         # Modal dialog functionality
├── animation.js     # Animation controls and colour shifting
└── list-view.js     # List view toggle and population
```

## Development Server

**CRITICAL**: This project MUST be served via HTTP server due to CORS restrictions on `fetch()` API.

### Quick Start

```bash
# Start development server
python3 -m http.server 8000

# Open in browser
# http://localhost:8000
```

### Background Server (Recommended for Development)

```bash
# Start server in background
python3 -m http.server 8000 > /dev/null 2>&1 &

# Check if running
curl -s -o /dev/null -w "%{http_code}" http://localhost:8000
# Expected: 200

# Stop server when done
lsof -ti :8000 | xargs kill -9
```

### Alternative Ports

```bash
# If port 8000 is busy
python3 -m http.server 8080
```

## Data Configuration

All website data is in `data/sites.json`. This file controls which tentacles appear and their properties.

### JSON Schema

```json
{
  "settings": {
    "animationEnabled": true
  },
  "sites": [
    {
      "id": "unique-id",
      "title": "Display Name",
      "url": "https://example.com",
      "description": "Full description for modal (1-2 sentences)",
      "colour": "#3498db"
    }
  ]
}
```

### Field Requirements

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (lowercase, hyphens, no spaces) |
| `title` | string | Yes | Displayed on tentacle label |
| `url` | string | Yes | Full URL including protocol (https://) |
| `description` | string | Yes | Shown in modal dialog |
| `colour` | string | No | Hex color for tentacle (default: `#8b7fc7`) |

### Data Validation

The application automatically:
- Validates JSON structure on load
- Filters out entries missing required fields
- Logs warnings for malformed entries to console
- Provides fallback defaults for optional fields

## Code Organization

### Entry Point: `js/main.js`

```javascript
// Initialization sequence:
1. Load and validate sites.json
2. Generate SVG cuttlefish
3. Initialize modal event listeners
4. Attach click handlers to tentacles and labels
5. Initialize list view toggle
6. Start animation controls
7. Handle errors gracefully
```

### SVG Generation: `js/cuttlefish.js`

**Key Functions:**
- `generateBody()` - Creates mantle, animated fins, eyes
- `generateTentacle(site, index, total)` - Bézier curve paths
- `generateLabel(tentacle, site)` - Rotated clickable text labels
- `generateCuttlefish(container, sites)` - Assembles complete SVG

**Tentacle Algorithm:**
- Distributes in 180° fan pattern from head
- Adds organic variation using sine-based noise
- Creates S-curves with cubic Bézier control points
- Applies per-site colors from JSON
- Labels are interactive and trigger same modal as tentacles

**Responsive Scaling:**
- Adjusts viewBox dimensions based on viewport
- Mobile viewports use smaller, optimized layout
- Desktop viewports use full-size layout

### Modal System: `js/modal.js`

**Features:**
- Focus trap (Tab cycles within modal)
- Focus restoration (returns to triggering element)
- Multiple close methods (X button, overlay click, Escape key)
- Animation pause while open
- Keyboard accessible

### Animation System: `js/animation.js`

**Three Animation Types:**

1. **CSS Animations** (tentacle waves)
   - Defined in `css/styles.css`
   - Staggered delays for organic effect
   - Controlled via `.animations-disabled` class

2. **JavaScript Animation** (colour shifting)
   - Updates `--cuttlefish-hue` CSS variable
   - Runs on 100ms interval
   - Smoothly cycles through HSL spectrum

3. **SVG Fin Animation**
   - Programmatically animates fin `d` attribute
   - Creates organic waving motion
   - Pauses when modal opens or animations disabled

**Toggle Button:**
- Shows ⏸ (pause) when animations enabled
- Shows ▶ (play) when disabled
- Respects `prefers-reduced-motion` media query

### List View System: `js/list-view.js`

**Features:**
- Alternative plaintext view of all sites
- Accessible via toggle button (☰)
- Focus management and keyboard navigation
- Close via X button, Escape key, or overlay click
- Displays titles, descriptions, and direct links

## Customization Guide

### Changing Colors

Edit CSS custom properties in `css/styles.css`:

```css
:root {
    --cuttlefish-hue: 280;        /* Base hue for colour shift */
    --bg-color: #0a0e27;          /* Background */
    --text-color: #e0e6f0;        /* Text */
    --tentacle-base: #8b7fc7;     /* Default tentacle */
    --glow-color: #b8a9ff;        /* Hover glow */
}
```

### Adjusting Animation Speed

```css
:root {
    --animation-duration: 3s;     /* Wave animation period */
    --transition-speed: 0.3s;     /* Hover transition duration */
}
```

### Modifying Cuttlefish Shape

In `js/cuttlefish.js`:

```javascript
// Body dimensions
const BODY_CENTER_X = 400;
const BODY_CENTER_Y = 250;

// generateBody() - Edit ellipse, fins, eyes
// generateTentacle() - Adjust Bézier control points, length
```

### Changing Tentacle Distribution

```javascript
// In generateTentacle():
const fanStart = -90;  // Left angle (degrees)
const fanEnd = 90;     // Right angle (degrees)
const length = 200 + Math.random() * 50;  // Length range
```

## Testing

### Validation Commands

```bash
# JavaScript syntax check
for f in js/*.js; do
  node --check "$f" && echo "$f: ✓" || echo "$f: ✗"
done

# JSON validation
python3 -m json.tool data/sites.json > /dev/null && echo "✓ JSON valid"

# Server check
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:8000
```

### Browser Testing Checklist

Interactive features:
- [ ] Tentacles render (correct count matches sites.json)
- [ ] Hover shows glow effect
- [ ] Hover pauses individual tentacle animation
- [ ] Click tentacle opens modal with correct site data
- [ ] Click label opens modal with same site data
- [ ] Modal displays title, description, link
- [ ] Modal close: X button works
- [ ] Modal close: click overlay works
- [ ] Modal close: Escape key works
- [ ] Animation toggle button changes icon
- [ ] Animations pause/resume when toggled
- [ ] List view toggle opens/closes plaintext directory
- [ ] List view displays all sites correctly
- [ ] Fin animation is visible and smooth

Keyboard navigation:
- [ ] Tab navigates between tentacles and labels
- [ ] Enter/Space opens modal from tentacle or label
- [ ] Tab cycles through modal elements
- [ ] Shift+Tab cycles backward in modal
- [ ] Focus returns to triggering element after modal closes
- [ ] List view closes with Escape key
- [ ] Visible focus indicators present

Responsive/Accessibility:
- [ ] Resize window - SVG scales proportionally
- [ ] Mobile viewport - layout adapts correctly
- [ ] NoScript popup displays when JavaScript disabled
- [ ] Enable OS reduced motion - animations disabled
- [ ] Screen reader - ARIA labels present
- [ ] High contrast mode - elements visible

## Common Issues

### CORS Error / "Failed to fetch"

**Symptom:** Error in console about cross-origin request or failed fetch.

**Cause:** Opened `index.html` directly as file (`file:///...`)

**Solution:** Must use HTTP server. URL should be `http://localhost:8000`

### Tentacles Not Appearing

**Check:**
1. Browser console for errors
2. `data/sites.json` exists and is valid JSON
3. Sites array has at least one valid entry
4. HTTP server is running
5. Inspect DOM - SVG element inserted?

**Debug:**
```bash
# Validate JSON
python3 -m json.tool data/sites.json

# Check server
curl http://localhost:8000/data/sites.json
```

### Port Already in Use

**Error:** `OSError: [Errno 48] Address already in use`

**Solution:**
```bash
# Find and kill process on port 8000
lsof -ti :8000 | xargs kill -9

# Or use different port
python3 -m http.server 8080
```

### Animations Not Working

**Check:**
1. Browser console for errors in `animation.js`
2. Toggle button state (should show ⏸ when enabled)
3. Check for `.animations-disabled` class on container
4. OS reduced motion setting (disables animations)
5. Modal not open (pauses animations)

### Modal Not Opening

**Check:**
1. Browser console for errors
2. Tentacle has correct `id` attribute
3. Click handler attached (check console logs)
4. Modal element exists in DOM
5. JavaScript loaded (check Network tab)

### Performance Issues

**If animations lag:**
- Reduce number of sites in `sites.json`
- Disable colour shifting (comment out interval in `animation.js`)
- Use animation toggle button to disable all animations
- Close other browser tabs
- Update to latest browser version

## Code Style Guidelines

### JavaScript
- ES6 modules with explicit imports/exports
- No external dependencies
- Clear function names describing purpose
- Comments for complex algorithms (Bézier curves, focus trap)
- Error handling with user-friendly messages

### CSS
- Custom properties for all themeable values
- Mobile-first responsive approach
- Accessibility: focus states, reduced motion support
- Semantic class names (`.tentacle`, `.modal-content`)

### SVG
- Programmatically generated, not static markup
- Semantic grouping (`<g>` for layers)
- Accessibility: ARIA labels, roles
- viewBox for responsive scaling

## Accessibility Features

### Keyboard Support
- All interactive elements keyboard accessible
- Tab order logical and predictable
- Enter/Space activate tentacles
- Escape closes modal
- Focus trap in modal
- Focus restoration after modal close

### Screen Readers
- ARIA labels on SVG and buttons
- Semantic HTML structure
- Alt text and descriptions
- Role attributes on interactive paths

### Motion Preferences
- Respects `prefers-reduced-motion`
- Manual animation toggle available
- Reduced motion disables both CSS and JS animations

### Visual
- High contrast support
- Visible focus indicators
- Sufficient color contrast ratios
- Scalable text and graphics

## Browser Requirements

**Supported:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

**Required Features:**
- ES6 modules
- CSS custom properties
- SVG 1.1
- Fetch API
- CSS Grid/Flexbox

## Project File Reference

| File | Purpose | Key Exports/Elements |
|------|---------|---------------------|
| `index.html` | HTML shell | `#cuttlefish-container`, `#modal`, `#animation-toggle`, `#list-toggle`, `#list-view` |
| `css/styles.css` | All styling | CSS custom properties, animations, responsive, mobile viewports |
| `js/main.js` | Entry point | `init()`, `attachTentacleHandlers()` |
| `js/cuttlefish.js` | SVG generation | `generateCuttlefish()`, responsive viewBox |
| `js/data-loader.js` | Data loading | `loadSites()` |
| `js/modal.js` | Modal system | `initModal()`, `openModal()`, `closeModal()` |
| `js/animation.js` | Animations | `initAnimation()`, colour shifting, fin animation |
| `js/list-view.js` | List view | `initListView()`, `populateListView()` |
| `data/sites.json` | Site data | Configuration object |

## Quick Reference Commands

| Task | Command |
|------|---------|
| Start server | `python3 -m http.server 8000` |
| Start background | `python3 -m http.server 8000 > /dev/null 2>&1 &` |
| Stop server | `lsof -ti :8000 \| xargs kill -9` |
| Validate JSON | `python3 -m json.tool data/sites.json` |
| Check JS syntax | `node --check js/*.js` |
| Test server | `curl -I http://localhost:8000` |
| View site | Open `http://localhost:8000` in browser |

## Best Practices for Development

1. **Always test via HTTP server** - Never open `index.html` directly
2. **Validate JSON after edits** - Syntax errors break everything
3. **Check console regularly** - Errors and warnings logged there
4. **Test keyboard navigation** - Accessibility is not optional
5. **Test with animations disabled** - Some users prefer reduced motion
6. **Validate all JS changes** - Run `node --check` before testing
7. **Test in multiple browsers** - Cross-browser compatibility matters

## Additional Notes

- No build process required - edit and refresh
- All state managed in vanilla JS, no frameworks
- CSS animations preferred over JS for performance
- Focus management crucial for accessibility
- Error handling prioritizes user experience
- Console logs help debugging during development
