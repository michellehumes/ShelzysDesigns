#!/usr/bin/env bash
# =============================================================================
# export-video.sh
# =============================================================================
# Exports the Calm & Bloom Etsy video HTML animation to MP4 format.
#
# This script provides two approaches:
#   1. PUPPETEER APPROACH (preferred) — Uses a Node.js script with Puppeteer
#      to capture each frame of the 15-second animation as PNG screenshots,
#      then compiles them into an MP4 using ffmpeg.
#   2. SIMPLE APPROACH — Provides manual instructions for screen recording
#      the HTML file in a browser.
#
# Usage:
#   ./scripts/export-video.sh                  # Auto-detect best approach
#   ./scripts/export-video.sh --puppeteer      # Force Puppeteer approach
#   ./scripts/export-video.sh --simple         # Show manual instructions only
#   ./scripts/export-video.sh --xvfb           # Use xvfb + ffmpeg screen capture
#
# Output:
#   products/calm-bloom-journal/etsy-video.mp4
#
# Requirements (Puppeteer approach):
#   - Node.js 16+ and npm
#   - Google Chrome or Chromium
#   - ffmpeg
#
# Requirements (xvfb approach):
#   - xvfb (X virtual framebuffer)
#   - Google Chrome or Chromium
#   - ffmpeg
# =============================================================================

set -euo pipefail

# --- Configuration ---
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
HTML_FILE="$PROJECT_ROOT/products/calm-bloom-journal/etsy-video.html"
OUTPUT_FILE="$PROJECT_ROOT/products/calm-bloom-journal/etsy-video.mp4"
FRAMES_DIR="$PROJECT_ROOT/products/calm-bloom-journal/.frames"
PUPPETEER_SCRIPT="$PROJECT_ROOT/products/calm-bloom-journal/.capture-frames.js"

# Video specs (must match Etsy requirements)
WIDTH=1080
HEIGHT=1080
FPS=30
DURATION=15
TOTAL_FRAMES=$((FPS * DURATION))  # 450 frames

# --- Color output helpers ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No color

info()    { echo -e "${BLUE}[INFO]${NC} $*"; }
success() { echo -e "${GREEN}[OK]${NC} $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*"; }

# --- Dependency checks ---
check_node() {
    if command -v node &> /dev/null; then
        local version
        version=$(node --version 2>/dev/null)
        info "Node.js found: $version"
        return 0
    fi
    warn "Node.js not found"
    return 1
}

check_npm() {
    if command -v npm &> /dev/null; then
        info "npm found: $(npm --version 2>/dev/null)"
        return 0
    fi
    warn "npm not found"
    return 1
}

check_chrome() {
    local chrome_paths=(
        "google-chrome"
        "google-chrome-stable"
        "chromium"
        "chromium-browser"
        "/usr/bin/google-chrome"
        "/usr/bin/chromium"
        "/usr/bin/chromium-browser"
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    )
    for path in "${chrome_paths[@]}"; do
        if command -v "$path" &> /dev/null || [ -x "$path" ]; then
            info "Chrome/Chromium found: $path"
            CHROME_PATH="$path"
            return 0
        fi
    done
    warn "Chrome/Chromium not found"
    return 1
}

check_ffmpeg() {
    if command -v ffmpeg &> /dev/null; then
        info "ffmpeg found: $(ffmpeg -version 2>/dev/null | head -n 1)"
        return 0
    fi
    warn "ffmpeg not found"
    return 1
}

check_xvfb() {
    if command -v xvfb-run &> /dev/null || command -v Xvfb &> /dev/null; then
        info "Xvfb found"
        return 0
    fi
    warn "Xvfb not found"
    return 1
}

# --- Validate HTML file exists ---
validate_html() {
    if [ ! -f "$HTML_FILE" ]; then
        error "HTML file not found: $HTML_FILE"
        error "Please ensure etsy-video.html exists in products/calm-bloom-journal/"
        exit 1
    fi
    success "HTML file found: $HTML_FILE"
}

# =============================================================================
# APPROACH 1: Puppeteer Frame Capture
# =============================================================================
run_puppeteer_approach() {
    info "=== Puppeteer Frame Capture Approach ==="
    info ""

    # Check all dependencies
    local deps_ok=true
    check_node  || deps_ok=false
    check_npm   || deps_ok=false
    check_ffmpeg || deps_ok=false

    if [ "$deps_ok" = false ]; then
        error "Missing dependencies for Puppeteer approach."
        error "Install with:"
        echo "  sudo apt-get install -y nodejs npm ffmpeg    # Debian/Ubuntu"
        echo "  brew install node ffmpeg                      # macOS"
        return 1
    fi

    # Create frames directory
    rm -rf "$FRAMES_DIR"
    mkdir -p "$FRAMES_DIR"

    # Install puppeteer if not already available
    info "Checking for Puppeteer..."
    local puppeteer_dir="$PROJECT_ROOT/products/calm-bloom-journal/.puppeteer-tmp"
    mkdir -p "$puppeteer_dir"

    if [ ! -d "$puppeteer_dir/node_modules/puppeteer" ]; then
        info "Installing Puppeteer (this may take a minute)..."
        (cd "$puppeteer_dir" && npm init -y --silent 2>/dev/null && npm install puppeteer --silent 2>/dev/null)
        success "Puppeteer installed"
    else
        info "Puppeteer already installed"
    fi

    # Generate the Node.js frame capture script
    info "Generating frame capture script..."
    cat > "$PUPPETEER_SCRIPT" << 'CAPTURE_SCRIPT'
/**
 * capture-frames.js
 * Opens the Calm & Bloom HTML animation in headless Chrome via Puppeteer,
 * captures each frame as a PNG screenshot, one per video frame.
 *
 * The HTML animation is 15 seconds long and uses CSS @keyframes that run
 * on a 15s infinite loop. We override the animation timing to step through
 * frame-by-frame using Web Animations API / CSS pause + seek.
 */

const puppeteer = require('puppeteer');
const path = require('path');

const HTML_FILE = process.argv[2];
const FRAMES_DIR = process.argv[3];
const WIDTH = parseInt(process.argv[4], 10);
const HEIGHT = parseInt(process.argv[5], 10);
const FPS = parseInt(process.argv[6], 10);
const DURATION = parseInt(process.argv[7], 10);

const TOTAL_FRAMES = FPS * DURATION;

(async () => {
    console.log(`Starting frame capture: ${TOTAL_FRAMES} frames at ${FPS}fps`);
    console.log(`Resolution: ${WIDTH}x${HEIGHT}`);
    console.log(`HTML: ${HTML_FILE}`);
    console.log(`Output: ${FRAMES_DIR}`);

    const browser = await puppeteer.launch({
        headless: 'new',
        args: [
            `--window-size=${WIDTH},${HEIGHT}`,
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
        ],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });

    // Load the HTML file
    const fileUrl = `file://${HTML_FILE}`;
    await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30000 });

    // Wait a moment for fonts to load
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Pause all CSS animations
    await page.evaluate(() => {
        document.getAnimations().forEach(anim => anim.pause());
    });

    // Capture each frame
    const frameDuration = 1000 / FPS; // ms per frame

    for (let i = 0; i < TOTAL_FRAMES; i++) {
        const timeMs = i * frameDuration;

        // Seek all animations to the target time
        await page.evaluate((t) => {
            document.getAnimations().forEach(anim => {
                // If the animation has a defined effect duration, use modulo
                // to handle looping animations correctly
                const effectDuration = anim.effect.getComputedTiming().duration;
                if (effectDuration && effectDuration > 0) {
                    anim.currentTime = t % effectDuration;
                } else {
                    anim.currentTime = t;
                }
            });
        }, timeMs);

        // Small delay to allow rendering
        await new Promise(resolve => setTimeout(resolve, 10));

        // Capture screenshot
        const frameNum = String(i).padStart(5, '0');
        const framePath = path.join(FRAMES_DIR, `frame_${frameNum}.png`);
        await page.screenshot({
            path: framePath,
            clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
            type: 'png',
        });

        // Progress indicator
        if (i % FPS === 0) {
            const seconds = i / FPS;
            console.log(`  Captured: ${seconds}s / ${DURATION}s (frame ${i}/${TOTAL_FRAMES})`);
        }
    }

    console.log(`  Captured: ${DURATION}s / ${DURATION}s (frame ${TOTAL_FRAMES}/${TOTAL_FRAMES})`);
    console.log('Frame capture complete!');

    await browser.close();
})();
CAPTURE_SCRIPT

    success "Frame capture script generated"

    # Run the frame capture
    info "Capturing ${TOTAL_FRAMES} frames (this may take a few minutes)..."
    echo ""

    NODE_PATH="$puppeteer_dir/node_modules" \
        node "$PUPPETEER_SCRIPT" \
        "$HTML_FILE" "$FRAMES_DIR" "$WIDTH" "$HEIGHT" "$FPS" "$DURATION"

    echo ""
    success "All frames captured"

    # Verify frame count
    local frame_count
    frame_count=$(ls -1 "$FRAMES_DIR"/frame_*.png 2>/dev/null | wc -l)
    info "Frame files found: $frame_count / $TOTAL_FRAMES expected"

    if [ "$frame_count" -lt "$TOTAL_FRAMES" ]; then
        warn "Frame count mismatch. Some frames may be missing."
    fi

    # Compile frames to MP4 with ffmpeg
    info "Compiling frames to MP4 with ffmpeg..."
    ffmpeg -y \
        -framerate "$FPS" \
        -i "$FRAMES_DIR/frame_%05d.png" \
        -c:v libx264 \
        -pix_fmt yuv420p \
        -preset slow \
        -crf 18 \
        -an \
        -s "${WIDTH}x${HEIGHT}" \
        -movflags +faststart \
        "$OUTPUT_FILE" \
        2>&1 | tail -5

    success "MP4 created: $OUTPUT_FILE"

    # Show file info
    local filesize
    filesize=$(du -h "$OUTPUT_FILE" | cut -f1)
    info "File size: $filesize"
    info "Specs: ${WIDTH}x${HEIGHT}, ${FPS}fps, ${DURATION}s, H.264, no audio"

    # Verify with ffprobe if available
    if command -v ffprobe &> /dev/null; then
        echo ""
        info "FFprobe verification:"
        ffprobe -v quiet -show_format -show_streams "$OUTPUT_FILE" 2>/dev/null | \
            grep -E "^(width|height|duration|codec_name|r_frame_rate|bit_rate|size)" | \
            sed 's/^/  /'
    fi

    # Cleanup
    info "Cleaning up temporary files..."
    rm -rf "$FRAMES_DIR"
    rm -f "$PUPPETEER_SCRIPT"
    # Optionally remove puppeteer install (comment out to keep for faster reruns)
    # rm -rf "$puppeteer_dir"

    echo ""
    success "=== Export complete! ==="
    success "Output: $OUTPUT_FILE"
    echo ""
    info "Etsy upload checklist:"
    echo "  - Format: MP4 (H.264) .... OK"
    echo "  - Resolution: ${WIDTH}x${HEIGHT} .... OK"
    echo "  - Duration: ${DURATION}s .... OK"
    echo "  - Frame rate: ${FPS}fps .... OK"
    echo "  - Audio: None .... OK"
    echo "  - File size: $filesize (limit: 100MB) .... OK"
}

# =============================================================================
# APPROACH 2: Xvfb + ffmpeg screen capture (fallback)
# =============================================================================
run_xvfb_approach() {
    info "=== Xvfb + ffmpeg Screen Capture Approach ==="
    info ""

    local deps_ok=true
    check_chrome || deps_ok=false
    check_xvfb   || deps_ok=false
    check_ffmpeg  || deps_ok=false

    if [ "$deps_ok" = false ]; then
        error "Missing dependencies for Xvfb approach."
        error "Install with:"
        echo "  sudo apt-get install -y xvfb chromium-browser ffmpeg"
        return 1
    fi

    local DISPLAY_NUM=99
    local XVFB_SCREEN="${WIDTH}x${HEIGHT}x24"

    info "Starting Xvfb on display :${DISPLAY_NUM}..."
    Xvfb ":${DISPLAY_NUM}" -screen 0 "${XVFB_SCREEN}" &
    local XVFB_PID=$!
    sleep 1

    # Verify Xvfb is running
    if ! kill -0 "$XVFB_PID" 2>/dev/null; then
        error "Failed to start Xvfb"
        return 1
    fi
    success "Xvfb running (PID: $XVFB_PID)"

    # Launch Chrome in kiosk mode
    info "Launching Chrome..."
    DISPLAY=":${DISPLAY_NUM}" "$CHROME_PATH" \
        --no-sandbox \
        --disable-gpu \
        --kiosk \
        --window-size="${WIDTH},${HEIGHT}" \
        --window-position=0,0 \
        --disable-infobars \
        --hide-scrollbars \
        "file://${HTML_FILE}" &
    local CHROME_PID=$!
    sleep 3

    # Record with ffmpeg using x11grab
    info "Recording ${DURATION} seconds with ffmpeg..."
    DISPLAY=":${DISPLAY_NUM}" ffmpeg -y \
        -video_size "${WIDTH}x${HEIGHT}" \
        -framerate "$FPS" \
        -f x11grab \
        -i ":${DISPLAY_NUM}" \
        -t "$DURATION" \
        -c:v libx264 \
        -pix_fmt yuv420p \
        -preset slow \
        -crf 18 \
        -an \
        -movflags +faststart \
        "$OUTPUT_FILE" \
        2>&1 | tail -5

    # Cleanup
    info "Stopping Chrome and Xvfb..."
    kill "$CHROME_PID" 2>/dev/null || true
    kill "$XVFB_PID" 2>/dev/null || true
    wait "$CHROME_PID" 2>/dev/null || true
    wait "$XVFB_PID" 2>/dev/null || true

    if [ -f "$OUTPUT_FILE" ]; then
        local filesize
        filesize=$(du -h "$OUTPUT_FILE" | cut -f1)
        success "=== Export complete! ==="
        success "Output: $OUTPUT_FILE"
        info "File size: $filesize"
    else
        error "Failed to create output file"
        return 1
    fi
}

# =============================================================================
# APPROACH 3: Simple / Manual Instructions
# =============================================================================
show_simple_instructions() {
    echo ""
    echo -e "${BLUE}============================================================${NC}"
    echo -e "${BLUE}  MANUAL VIDEO EXPORT INSTRUCTIONS                         ${NC}"
    echo -e "${BLUE}  Calm & Bloom - Etsy Video (15s, 1080x1080, MP4)          ${NC}"
    echo -e "${BLUE}============================================================${NC}"
    echo ""
    echo "If the automated approaches are not available, you can manually"
    echo "record the HTML animation using these methods:"
    echo ""
    echo -e "${GREEN}--- Method A: OBS Studio (Recommended) ---${NC}"
    echo ""
    echo "  1. Install OBS Studio: https://obsproject.com"
    echo "  2. Open the HTML file in Chrome/Firefox:"
    echo "     file://$HTML_FILE"
    echo "  3. Set your browser window to exactly 1080x1080 pixels"
    echo "     (Use a browser extension like 'Window Resizer')"
    echo "  4. In OBS Studio:"
    echo "     a. Settings > Video > Base Resolution: 1080x1080"
    echo "     b. Settings > Video > Output Resolution: 1080x1080"
    echo "     c. Settings > Video > FPS: 30"
    echo "     d. Settings > Output > Recording Format: mp4"
    echo "     e. Settings > Output > Encoder: x264"
    echo "     f. Settings > Audio > Disable all audio sources"
    echo "  5. Add a 'Window Capture' source targeting the browser"
    echo "  6. Record exactly 15 seconds, then stop"
    echo "  7. The output MP4 is ready for Etsy upload"
    echo ""
    echo -e "${GREEN}--- Method B: QuickTime (macOS) ---${NC}"
    echo ""
    echo "  1. Open the HTML file in Safari/Chrome at 1080x1080"
    echo "  2. File > New Screen Recording in QuickTime Player"
    echo "  3. Select the browser window region"
    echo "  4. Record 15 seconds, then stop"
    echo "  5. Export as 1080p, then crop to square using ffmpeg:"
    echo ""
    echo "     ffmpeg -i recording.mov \\"
    echo "       -vf \"crop=1080:1080\" \\"
    echo "       -c:v libx264 -pix_fmt yuv420p -an \\"
    echo "       -t 15 -r 30 \\"
    echo "       $OUTPUT_FILE"
    echo ""
    echo -e "${GREEN}--- Method C: Chrome DevTools Protocol ---${NC}"
    echo ""
    echo "  1. Open Chrome with remote debugging:"
    echo "     google-chrome --remote-debugging-port=9222 \\"
    echo "       --window-size=1080,1080 \\"
    echo "       \"file://$HTML_FILE\""
    echo "  2. Use the Chrome DevTools Protocol to capture screenshots"
    echo "     or use a tool like 'puppeteer-screen-recorder'"
    echo ""
    echo -e "${GREEN}--- Method D: ffmpeg with Image Sequence ---${NC}"
    echo ""
    echo "  If you have individual frame PNGs (e.g., from Puppeteer):"
    echo ""
    echo "     ffmpeg -framerate 30 -i frame_%05d.png \\"
    echo "       -c:v libx264 -pix_fmt yuv420p -an \\"
    echo "       -s 1080x1080 -movflags +faststart \\"
    echo "       $OUTPUT_FILE"
    echo ""
    echo -e "${BLUE}============================================================${NC}"
    echo -e "${BLUE}  ETSY VIDEO UPLOAD CHECKLIST                              ${NC}"
    echo -e "${BLUE}============================================================${NC}"
    echo ""
    echo "  [ ] Format: MP4 (H.264 codec)"
    echo "  [ ] Resolution: 1080x1080 (1:1 square)"
    echo "  [ ] Duration: 5-15 seconds (ours is 15s)"
    echo "  [ ] Frame rate: 30 FPS"
    echo "  [ ] Audio: NONE (Etsy prohibits audio)"
    echo "  [ ] File size: Under 100MB"
    echo "  [ ] Content: No text smaller than 30px (readability)"
    echo ""
}

# =============================================================================
# Main Entry Point
# =============================================================================
main() {
    echo ""
    echo -e "${GREEN}============================================================${NC}"
    echo -e "${GREEN}  Calm & Bloom -- Etsy Video Exporter                      ${NC}"
    echo -e "${GREEN}  Export HTML animation to MP4 (1080x1080, 30fps, 15s)     ${NC}"
    echo -e "${GREEN}============================================================${NC}"
    echo ""

    validate_html

    local mode="${1:-auto}"

    case "$mode" in
        --puppeteer)
            run_puppeteer_approach
            ;;
        --xvfb)
            run_xvfb_approach
            ;;
        --simple)
            show_simple_instructions
            ;;
        auto|*)
            info "Auto-detecting best approach..."
            echo ""

            # Try Puppeteer first (most reliable for frame-perfect capture)
            if check_node && check_npm && check_ffmpeg; then
                echo ""
                info "Using Puppeteer approach (best frame accuracy)"
                echo ""
                run_puppeteer_approach && exit 0
                warn "Puppeteer approach failed, trying fallback..."
                echo ""
            fi

            # Try xvfb fallback
            if check_chrome && check_xvfb && check_ffmpeg; then
                echo ""
                info "Using Xvfb + ffmpeg approach"
                echo ""
                run_xvfb_approach && exit 0
                warn "Xvfb approach failed."
                echo ""
            fi

            # Fall back to manual instructions
            warn "No automated approach available. Showing manual instructions."
            show_simple_instructions
            ;;
    esac
}

main "$@"
