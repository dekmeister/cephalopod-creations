// SVG generation for cuttlefish body and tentacles

const SVG_WIDTH = 800;
const SVG_HEIGHT = 600;
const BODY_CENTER_X = 400;
const BODY_CENTER_Y = 200;

/**
 * Generate the undulating mantle fin that wraps around the body
 */
function generateMantleFin(phase = 0) {
    const mantleWidth = 140;
    const mantleHeight = 100;
    const finAmplitude = 18;
    const waveCount = 8;
    
    let pathD = '';
    const points = 60;
    
    // Generate wavy outline around the mantle
    for (let i = 0; i <= points; i++) {
        const t = i / points;
        const angle = Math.PI + t * Math.PI; // Bottom half arc (back of cuttlefish)
        
        // Base ellipse position
        const baseX = BODY_CENTER_X + Math.cos(angle) * mantleWidth;
        const baseY = BODY_CENTER_Y + Math.sin(angle) * mantleHeight * 0.7;
        
        // Add wave displacement outward from center
        const wave = Math.sin(t * waveCount * Math.PI * 2 + phase) * finAmplitude;
        const normalX = Math.cos(angle);
        const normalY = Math.sin(angle) * 0.7;
        
        const x = baseX + normalX * wave;
        const y = baseY + normalY * wave;
        
        if (i === 0) {
            pathD += `M ${x} ${y}`;
        } else {
            pathD += ` L ${x} ${y}`;
        }
    }
    
    // Close back to start along the body edge
    pathD += ' Z';
    
    return `<path d="${pathD}" class="cuttlefish-fin" />`;
}

/**
 * Generate the main mantle (body) of the cuttlefish
 */
function generateMantle() {
    const mantleWidth = 130;
    const mantleHeight = 90;
    
    // Rounded rectangular mantle shape
    return `
        <ellipse cx="${BODY_CENTER_X}" cy="${BODY_CENTER_Y}"
                 rx="${mantleWidth}" ry="${mantleHeight}"
                 class="cuttlefish-body" />
    `;
}

/**
 * Generate the head region (between mantle and arms)
 */
function generateHead() {
    const headY = BODY_CENTER_Y + 100;

    // Trapezoidal head connecting mantle to arms
    return `
        <path d="M ${BODY_CENTER_X - 90} ${BODY_CENTER_Y + 60}
                 Q ${BODY_CENTER_X - 80} ${headY + 20}, ${BODY_CENTER_X - 50} ${headY + 40}
                 L ${BODY_CENTER_X + 50} ${headY + 40}
                 Q ${BODY_CENTER_X + 80} ${headY + 20}, ${BODY_CENTER_X + 90} ${BODY_CENTER_Y + 60}
                 Z"
              class="cuttlefish-head" />
    `;
}

/**
 * Generate the prominent cuttlefish eyes
 */
function generateEyes() {
    const eyeY = BODY_CENTER_Y + 110;
    const eyeSpacing = 55;
    const eyeRadius = 18;
    
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
    const stripeCount = 12;
    
    for (let i = 0; i < stripeCount; i++) {
        const offset = (i - stripeCount/2) * 18;
        const curve = Math.abs(offset) * 0.3;
        
        stripes.push(`
            <path d="M ${BODY_CENTER_X + offset} ${BODY_CENTER_Y - 70 + curve}
                     Q ${BODY_CENTER_X + offset * 0.8} ${BODY_CENTER_Y}, 
                       ${BODY_CENTER_X + offset * 0.6} ${BODY_CENTER_Y + 60 - curve}"
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
    const armBaseY = BODY_CENTER_Y + 145;
    
    // Distribute arms in a fan pattern
    const fanSpread = 140; // total spread in pixels
    const spacing = fanSpread / (totalArms - 1 || 1);
    const baseX = BODY_CENTER_X - fanSpread/2 + index * spacing;
    
    // Add slight variation
    const variation = Math.sin(index * 1.7) * 8;
    const startX = baseX + variation;
    
    // Arm properties
    const length = isLongTentacle ? 220 + Math.random() * 30 : 140 + Math.random() * 40;
    const baseWidth = isLongTentacle ? 8 : 12;
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
    const armBaseY = BODY_CENTER_Y + 145;
    
    // Two long tentacles, positioned among the arms
    const positions = [
        { x: BODY_CENTER_X - 30, angle: -0.3 },
        { x: BODY_CENTER_X + 30, angle: 0.3 }
    ];
    
    positions.forEach((pos, i) => {
        if (i >= sites.length) return;
        
        const site = sites[i];
        const length = 200 + Math.random() * 40;
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
 */
function generateLabel(tentacle) {
    const { endX, endY, angle, title } = tentacle;
    
    const labelOffset = 20;
    const labelX = endX + angle * labelOffset;
    const labelY = endY + 15;
    
    // Rotate label to follow tentacle direction
    let rotation = angle * 40;
    
    const textAnchor = Math.abs(angle) < 0.2 ? 'middle' :
                      (angle < 0 ? 'end' : 'start');
    
    return `
        <text x="${labelX}" y="${labelY}"
              class="tentacle-label"
              text-anchor="${textAnchor}"
              transform="rotate(${rotation}, ${labelX}, ${labelY})">
            ${title}
        </text>
    `;
}

/**
 * Main function to generate complete cuttlefish SVG
 */
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
    const svg = `
        <svg viewBox="0 0 ${SVG_WIDTH} ${SVG_HEIGHT}"
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
