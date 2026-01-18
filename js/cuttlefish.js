// SVG generation for cuttlefish body and tentacles

const SVG_WIDTH = 800;
const SVG_HEIGHT = 600;
const BODY_CENTER_X = 400;
const BODY_CENTER_Y = 200;

// Mobile-optimized viewBox: crop to actual cuttlefish content area
// Content bounds: X ~250-550, Y ~50-570 (including labels below tentacles)
const MOBILE_VIEWBOX_X = 200;
const MOBILE_VIEWBOX_Y = 30;
const MOBILE_VIEWBOX_WIDTH = 400;
const MOBILE_VIEWBOX_HEIGHT = 560;

/**
 * Generate the undulating mantle fin that wraps around the entire body
 */
function generateMantleFin(phase = 0) {
    const mantleWidth = 80;   // Narrow (horizontal)
    const mantleHeight = 140; // Tall (vertical) - rotated 90°
    const finAmplitude = 10;  // Gentler waves
    const waveCount = 6;      // Fewer waves for smoother look

    const points = 100;  // More points for smoother curves
    const finPoints = [];

    // Generate wavy outline around the ENTIRE mantle (full 360°)
    for (let i = 0; i <= points; i++) {
        const t = i / points;
        const angle = t * Math.PI * 2;  // Full circle

        // Base ellipse position (slightly larger than body)
        const baseX = BODY_CENTER_X + Math.cos(angle) * (mantleWidth + 8);
        const baseY = BODY_CENTER_Y + Math.sin(angle) * (mantleHeight + 8);

        // Smooth sinusoidal wave displacement
        const wave = Math.sin(t * waveCount * Math.PI * 2 + phase) * finAmplitude;

        // Normal direction (outward from center)
        const normalX = Math.cos(angle);
        const normalY = Math.sin(angle);

        const x = baseX + normalX * wave;
        const y = baseY + normalY * wave;

        finPoints.push({ x, y });
    }

    // Build smooth path using quadratic curves for flowing appearance
    let pathD = `M ${finPoints[0].x} ${finPoints[0].y}`;

    for (let i = 1; i < finPoints.length; i++) {
        const prev = finPoints[i - 1];
        const curr = finPoints[i];
        // Use midpoints as control points for smooth curves
        const midX = (prev.x + curr.x) / 2;
        const midY = (prev.y + curr.y) / 2;
        pathD += ` Q ${prev.x} ${prev.y}, ${midX} ${midY}`;
    }

    pathD += ' Z';

    return `<path d="${pathD}" class="cuttlefish-fin" />`;
}

/**
 * Generate the main mantle (body) of the cuttlefish
 * Elongated vertically (tall, not wide)
 */
function generateMantle() {
    const mantleWidth = 80;    // Narrow
    const mantleHeight = 140;  // Tall - vertical orientation

    return `
        <ellipse cx="${BODY_CENTER_X}" cy="${BODY_CENTER_Y}"
                 rx="${mantleWidth}" ry="${mantleHeight}"
                 class="cuttlefish-body" />
    `;
}

/**
 * Generate the head region (between mantle and arms)
 * Smooth organic shape that blends into the body
 */
function generateHead() {
    const headTop = BODY_CENTER_Y + 115;   // Overlap slightly with body for smooth blend
    const headBottom = BODY_CENTER_Y + 185;
    const headWidth = 55;

    // Smooth curved head that tapers from body to arms
    return `
        <path d="M ${BODY_CENTER_X - headWidth} ${headTop}
                 C ${BODY_CENTER_X - headWidth - 5} ${headTop + 30},
                   ${BODY_CENTER_X - headWidth + 10} ${headBottom - 20},
                   ${BODY_CENTER_X - 35} ${headBottom}
                 Q ${BODY_CENTER_X} ${headBottom + 8},
                   ${BODY_CENTER_X + 35} ${headBottom}
                 C ${BODY_CENTER_X + headWidth - 10} ${headBottom - 20},
                   ${BODY_CENTER_X + headWidth + 5} ${headTop + 30},
                   ${BODY_CENTER_X + headWidth} ${headTop}
                 Q ${BODY_CENTER_X} ${headTop - 10},
                   ${BODY_CENTER_X - headWidth} ${headTop}
                 Z"
              class="cuttlefish-head" />
    `;
}

/**
 * Generate the prominent cuttlefish eyes
 */
function generateEyes() {
    const eyeY = BODY_CENTER_Y + 145;  // Positioned on the head
    const eyeSpacing = 32;
    const eyeRadius = 12;
    
    return `
        <!-- Left eye -->
        <ellipse cx="${BODY_CENTER_X - eyeSpacing}" cy="${eyeY}"
                 rx="${eyeRadius}" ry="${eyeRadius * 1.3}"
                 class="cuttlefish-eye-outer" />
        <ellipse cx="${BODY_CENTER_X - eyeSpacing}" cy="${eyeY}"
                 rx="${eyeRadius * 0.5}" ry="${eyeRadius * 0.9}"
                 class="cuttlefish-eye-pupil" />
        <circle cx="${BODY_CENTER_X - eyeSpacing - 3}" cy="${eyeY - 5}"
                r="4" class="cuttlefish-eye-highlight" />
        
        <!-- Right eye -->
        <ellipse cx="${BODY_CENTER_X + eyeSpacing}" cy="${eyeY}"
                 rx="${eyeRadius}" ry="${eyeRadius * 1.3}"
                 class="cuttlefish-eye-outer" />
        <ellipse cx="${BODY_CENTER_X + eyeSpacing}" cy="${eyeY}"
                 rx="${eyeRadius * 0.5}" ry="${eyeRadius * 0.9}"
                 class="cuttlefish-eye-pupil" />
        <circle cx="${BODY_CENTER_X + eyeSpacing - 3}" cy="${eyeY - 5}"
                r="4" class="cuttlefish-eye-highlight" />
    `;
}

/**
 * Generate mantle pattern (stripes like in photos)
 */
function generateMantlePattern() {
    const stripes = [];
    const stripeCount = 10;  // Fewer stripes for narrower body

    for (let i = 0; i < stripeCount; i++) {
        const offset = (i - stripeCount/2) * 12;
        const curve = Math.abs(offset) * 0.2;

        stripes.push(`
            <path d="M ${BODY_CENTER_X + offset} ${BODY_CENTER_Y - 120 + curve}
                     Q ${BODY_CENTER_X + offset * 0.9} ${BODY_CENTER_Y},
                       ${BODY_CENTER_X + offset * 0.8} ${BODY_CENTER_Y + 120 - curve}"
                  class="cuttlefish-stripe" />
        `);
    }

    return `<g class="mantle-pattern">${stripes.join('')}</g>`;
}

/**
 * Generate a single arm with proper width and taper
 * Arms are the 8 shorter appendages
 */
function generateArm(site, index, totalArms, isLongTentacle = false) {
    const armBaseY = BODY_CENTER_Y + 170;  // Attach at actual bottom of head curve

    // Distribute arms in a fan pattern
    const fanSpread = 70; // narrower spread to match narrower head
    const spacing = fanSpread / (totalArms - 1 || 1);
    const baseX = BODY_CENTER_X - fanSpread/2 + index * spacing;

    // Add slight variation
    const variation = Math.sin(index * 1.7) * 5;
    const startX = baseX + variation;

    // Arm properties - shorter arms
    const length = isLongTentacle ? 120 + Math.random() * 20 : 80 + Math.random() * 30;
    const baseWidth = isLongTentacle ? 6 : 10;
    const tipWidth = 2;
    
    // Calculate curve direction (fan outward)
    const fanAngle = ((index / (totalArms - 1 || 1)) - 0.5) * 0.8;
    const endX = startX + fanAngle * length * 0.7;
    const endY = armBaseY + length;
    
    // Control points for natural curve
    const ctrl1X = startX + fanAngle * length * 0.2 + Math.sin(index * 2.3) * 15;
    const ctrl1Y = armBaseY + length * 0.35;
    const ctrl2X = startX + fanAngle * length * 0.5 + Math.sin(index * 1.9) * 20;
    const ctrl2Y = armBaseY + length * 0.7;
    
    // Generate tapered arm shape using two curves (left and right edges)
    const path = `
        <path id="tentacle-${site.id}"
              class="tentacle"
              data-site-id="${site.id}"
              d="M ${startX - baseWidth/2} ${armBaseY}
                 C ${ctrl1X - baseWidth/2 * 0.7} ${ctrl1Y},
                   ${ctrl2X - tipWidth/2} ${ctrl2Y},
                   ${endX} ${endY}
                 C ${ctrl2X + tipWidth/2} ${ctrl2Y},
                   ${ctrl1X + baseWidth/2 * 0.7} ${ctrl1Y},
                   ${startX + baseWidth/2} ${armBaseY}
                 Z"
              fill="${site.colour || '#8b7fc7'}"
              tabindex="0"
              role="button"
              aria-label="View ${site.title}" />
    `;
    
    return { 
        path, 
        endX, 
        endY, 
        angle: fanAngle, 
        id: site.id, 
        title: site.title,
        index 
    };
}

/**
 * Generate the two long feeding tentacles
 */
function generateFeedingTentacles(sites) {
    if (sites.length < 2) return { paths: [], labels: [] };

    const tentacles = [];
    const armBaseY = BODY_CENTER_Y + 185;  // Attach at actual bottom of head curve

    // Two long tentacles, positioned among the arms
    const positions = [
        { x: BODY_CENTER_X - 20, angle: -0.25 },
        { x: BODY_CENTER_X + 20, angle: 0.25 }
    ];

    positions.forEach((pos, i) => {
        if (i >= sites.length) return;

        const site = sites[i];
        const length = 120 + Math.random() * 30;  // Shorter tentacles
        const endX = pos.x + pos.angle * length;
        const endY = armBaseY + length;
        
        // Club-shaped end (wider tip for feeding tentacles)
        const baseWidth = 6;
        const midWidth = 4;
        const clubWidth = 14;
        
        const ctrl1X = pos.x + pos.angle * length * 0.3;
        const ctrl1Y = armBaseY + length * 0.3;
        const ctrl2X = pos.x + pos.angle * length * 0.7;
        const ctrl2Y = armBaseY + length * 0.7;
        
        const path = `
            <path id="tentacle-${site.id}"
                  class="tentacle feeding-tentacle"
                  data-site-id="${site.id}"
                  d="M ${pos.x - baseWidth/2} ${armBaseY}
                     C ${ctrl1X - midWidth/2} ${ctrl1Y},
                       ${ctrl2X - midWidth/2} ${ctrl2Y},
                       ${endX - clubWidth/2} ${endY - 15}
                     L ${endX - clubWidth/2} ${endY}
                     Q ${endX} ${endY + 8}, ${endX + clubWidth/2} ${endY}
                     L ${endX + clubWidth/2} ${endY - 15}
                     C ${ctrl2X + midWidth/2} ${ctrl2Y},
                       ${ctrl1X + midWidth/2} ${ctrl1Y},
                       ${pos.x + baseWidth/2} ${armBaseY}
                     Z"
                  fill="${site.colour || '#a99bd4'}"
                  tabindex="0"
                  role="button"
                  aria-label="View ${site.title}" />
        `;
        
        tentacles.push({
            path,
            endX,
            endY: endY + 5,
            angle: pos.angle,
            id: site.id,
            title: site.title
        });
    });
    
    return tentacles;
}

/**
 * Generate a label for a tentacle
 * Wraps long text into multiple lines for compact display
 */
function generateLabel(tentacle) {
    const { endX, endY, angle, title, id } = tentacle;

    const labelOffset = 20;
    const labelX = endX + angle * labelOffset;
    const labelY = endY + 15;

    // Rotate label to follow tentacle direction
    let rotation = angle * 40;

    const textAnchor = Math.abs(angle) < 0.2 ? 'middle' :
                      (angle < 0 ? 'end' : 'start');

    // Split title into words and wrap if too long
    const maxCharsPerLine = 10; // Compact for mobile
    const words = title.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (testLine.length > maxCharsPerLine && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    });
    if (currentLine) lines.push(currentLine);

    // Generate tspan elements for each line
    const lineHeight = 18; // Match font size on mobile
    const tspans = lines.map((line, i) => {
        const dy = i === 0 ? 0 : lineHeight;
        return `<tspan x="${labelX}" dy="${dy}">${line}</tspan>`;
    }).join('\n            ');

    return `
        <text id="label-${id}"
              x="${labelX}" y="${labelY}"
              class="tentacle-label"
              text-anchor="${textAnchor}"
              transform="rotate(${rotation}, ${labelX}, ${labelY})"
              data-site-id="${id}"
              tabindex="0"
              role="button"
              aria-label="View ${title}">
            ${tspans}
        </text>
    `;
}

/**
 * Main function to generate complete cuttlefish SVG
 */
export { generateMantleFin };

export function generateCuttlefish(container, sites) {
    if (!sites || sites.length === 0) {
        container.innerHTML = '<div class="error-message">No sites to display</div>';
        return;
    }
    
    // Split sites between feeding tentacles (first 2) and arms (rest)
    const feedingSites = sites.slice(0, 2);
    const armSites = sites.slice(2);
    
    // Generate feeding tentacles
    const feedingTentacles = generateFeedingTentacles(feedingSites);
    
    // Generate arms
    const arms = [];

    armSites.forEach((site, index) => {
        const arm = generateArm(site, index, armSites.length);
        arms.push(arm);
    });
    
    // Collect all labels
    const allTentacles = [...feedingTentacles, ...arms];
    const labels = allTentacles.map(t => generateLabel(t));
    
    // Assemble complete SVG
    // On mobile, use a cropped viewBox that focuses on the cuttlefish content
    const isMobile = window.innerWidth <= 768;
    const viewBox = isMobile
        ? `${MOBILE_VIEWBOX_X} ${MOBILE_VIEWBOX_Y} ${MOBILE_VIEWBOX_WIDTH} ${MOBILE_VIEWBOX_HEIGHT}`
        : `0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`;

    const svg = `
        <svg viewBox="${viewBox}"
             preserveAspectRatio="xMidYMid meet"
             xmlns="http://www.w3.org/2000/svg"
             role="img"
             aria-label="Interactive cuttlefish link directory">
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            <!-- Layer 1: Undulating fin (behind body) -->
            ${generateMantleFin()}
            
            <!-- Layer 2: Arms and tentacles (behind head) -->
            <g class="tentacles-layer">
                ${feedingTentacles.map(t => t.path).join('\n')}
                ${arms.map(a => a.path).join('\n')}
            </g>
            
            <!-- Layer 3: Main mantle body -->
            ${generateMantle()}
            
            <!-- Layer 4: Mantle pattern -->
            ${generateMantlePattern()}
            
            <!-- Layer 5: Head -->
            ${generateHead()}
            
            <!-- Layer 6: Eyes (on top) -->
            ${generateEyes()}
            
            <!-- Layer 7: Labels -->
            <g class="labels-layer">
                ${labels.join('\n')}
            </g>
        </svg>
    `;
    
    container.innerHTML = svg;
    console.log('Cuttlefish generated with', sites.length, 'tentacles');
}
