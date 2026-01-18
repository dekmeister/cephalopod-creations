// SVG generation for cuttlefish body and tentacles

const SVG_WIDTH = 800;
const SVG_HEIGHT = 600;
const BODY_CENTER_X = 400;
const BODY_CENTER_Y = 250;

/**
 * Generate the main body of the cuttlefish
 */
function generateBody() {
    const bodyParts = [];

    // Main mantle (body) - elongated oval with organic shape
    const mantle = `
        <ellipse cx="${BODY_CENTER_X}" cy="${BODY_CENTER_Y}"
                 rx="80" ry="120"
                 class="cuttlefish-body" />
    `;
    bodyParts.push(mantle);

    // Side fins (decorative wavy shapes)
    const leftFin = `
        <path d="M ${BODY_CENTER_X - 80} ${BODY_CENTER_Y - 40}
                 Q ${BODY_CENTER_X - 110} ${BODY_CENTER_Y - 20}, ${BODY_CENTER_X - 90} ${BODY_CENTER_Y}
                 Q ${BODY_CENTER_X - 110} ${BODY_CENTER_Y + 20}, ${BODY_CENTER_X - 80} ${BODY_CENTER_Y + 40}
                 L ${BODY_CENTER_X - 80} ${BODY_CENTER_Y - 40} Z"
              class="cuttlefish-fin" />
    `;
    bodyParts.push(leftFin);

    const rightFin = `
        <path d="M ${BODY_CENTER_X + 80} ${BODY_CENTER_Y - 40}
                 Q ${BODY_CENTER_X + 110} ${BODY_CENTER_Y - 20}, ${BODY_CENTER_X + 90} ${BODY_CENTER_Y}
                 Q ${BODY_CENTER_X + 110} ${BODY_CENTER_Y + 20}, ${BODY_CENTER_X + 80} ${BODY_CENTER_Y + 40}
                 L ${BODY_CENTER_X + 80} ${BODY_CENTER_Y - 40} Z"
              class="cuttlefish-fin" />
    `;
    bodyParts.push(rightFin);

    // Eyes
    const leftEye = `
        <circle cx="${BODY_CENTER_X - 30}" cy="${BODY_CENTER_Y - 80}" r="12" class="cuttlefish-eye" />
        <circle cx="${BODY_CENTER_X - 27}" cy="${BODY_CENTER_Y - 82}" r="4" class="cuttlefish-eye-highlight" />
    `;
    bodyParts.push(leftEye);

    const rightEye = `
        <circle cx="${BODY_CENTER_X + 30}" cy="${BODY_CENTER_Y - 80}" r="12" class="cuttlefish-eye" />
        <circle cx="${BODY_CENTER_X + 27}" cy="${BODY_CENTER_Y - 82}" r="4" class="cuttlefish-eye-highlight" />
    `;
    bodyParts.push(rightEye);

    return bodyParts.join('\n');
}

/**
 * Generate a single tentacle using cubic Bézier curves
 */
function generateTentacle(site, index, totalTentacles) {
    // Calculate base angle - distribute in a fan pattern (roughly 180° arc)
    const fanStart = -90; // Start angle (degrees)
    const fanEnd = 90;    // End angle (degrees)
    const fanRange = fanEnd - fanStart;

    // Add organic variation to spacing
    const noise = (Math.sin(index * 2.7) * 0.1); // Organic variation
    const normalizedPosition = (index / (totalTentacles - 1 || 1)) + noise;
    const angle = (fanStart + normalizedPosition * fanRange) * (Math.PI / 180);

    // Tentacle attachment point (bottom of the head)
    const attachX = BODY_CENTER_X + Math.sin(angle) * 60;
    const attachY = BODY_CENTER_Y + 100;

    // Tentacle end point (extends outward)
    const length = 200 + Math.random() * 50; // Varied length
    const endX = attachX + Math.sin(angle) * length;
    const endY = attachY + Math.cos(angle) * length;

    // Control points for natural S-curve
    const ctrl1X = attachX + Math.sin(angle) * (length * 0.3) + Math.cos(angle) * 20;
    const ctrl1Y = attachY + Math.cos(angle) * (length * 0.3) - Math.sin(angle) * 20;

    const ctrl2X = attachX + Math.sin(angle) * (length * 0.7) - Math.cos(angle) * 15;
    const ctrl2Y = attachY + Math.cos(angle) * (length * 0.7) + Math.sin(angle) * 15;

    // Create path with cubic Bézier curve
    const path = `
        <path id="tentacle-${site.id}"
              class="tentacle"
              data-site-id="${site.id}"
              d="M ${attachX} ${attachY}
                 C ${ctrl1X} ${ctrl1Y}, ${ctrl2X} ${ctrl2Y}, ${endX} ${endY}"
              stroke="${site.colour || '#8b7fc7'}"
              tabindex="0"
              role="button"
              aria-label="View ${site.title}" />
    `;

    return { path, endX, endY, angle, id: site.id, title: site.title };
}

/**
 * Generate a label for a tentacle
 */
function generateLabel(tentacle) {
    const { endX, endY, angle, title } = tentacle;

    // Calculate text position (slightly beyond tentacle tip)
    const labelOffset = 15;
    const labelX = endX + Math.sin(angle) * labelOffset;
    const labelY = endY + Math.cos(angle) * labelOffset;

    // Determine rotation to keep text readable (no upside-down text)
    let rotation = (angle * 180 / Math.PI);
    if (rotation > 90) rotation -= 180;
    if (rotation < -90) rotation += 180;

    // Text anchor based on position
    const textAnchor = Math.abs(angle) < Math.PI / 4 ? 'middle' :
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

    // Generate body
    const body = generateBody();

    // Generate tentacles and labels
    const tentacles = [];
    const labels = [];

    sites.forEach((site, index) => {
        const tentacle = generateTentacle(site, index, sites.length);
        tentacles.push(tentacle.path);
        labels.push(generateLabel(tentacle));
    });

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

            <!-- Background layer: fins -->
            ${body}

            <!-- Foreground layer: tentacles -->
            <g class="tentacles-layer">
                ${tentacles.join('\n')}
            </g>

            <!-- Labels layer -->
            <g class="labels-layer">
                ${labels.join('\n')}
            </g>
        </svg>
    `;

    container.innerHTML = svg;
    console.log('Cuttlefish generated with', sites.length, 'tentacles');
}
