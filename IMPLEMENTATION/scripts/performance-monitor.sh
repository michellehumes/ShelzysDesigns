#!/bin/bash
# =============================================================================
# Shelzy's Designs - Performance Monitoring Script
# =============================================================================
# Monitors site performance metrics and generates reports
# Can be run manually or via cron job
#
# Prerequisites:
# - curl
# - jq (brew install jq)
# - bc (usually pre-installed)
# =============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
SITE_URL="${SITE_URL:-https://shelzysdesigns.com}"
REPORT_DIR="${REPORT_DIR:-./performance-reports}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
REPORT_FILE="$REPORT_DIR/report_$TIMESTAMP.json"

# Thresholds
RESPONSE_TIME_WARN=2.0    # seconds
RESPONSE_TIME_CRIT=5.0    # seconds
TTFB_WARN=0.8             # seconds (Time to First Byte)
TTFB_CRIT=1.5             # seconds

# Pages to test
PAGES=(
    "/"
    "/collections/all"
    "/pages/contact"
    "/cart"
)

# Initialize report
init_report() {
    mkdir -p "$REPORT_DIR"
    echo "{" > "$REPORT_FILE"
    echo "  \"timestamp\": \"$(date -Iseconds)\"," >> "$REPORT_FILE"
    echo "  \"site_url\": \"$SITE_URL\"," >> "$REPORT_FILE"
    echo "  \"pages\": [" >> "$REPORT_FILE"
}

# Test single page
test_page() {
    local page="$1"
    local url="$SITE_URL$page"

    echo -e "${BLUE}Testing: $url${NC}"

    # Get timing metrics
    local metrics=$(curl -s -o /dev/null -w '{
        "url": "%{url_effective}",
        "http_code": %{http_code},
        "time_namelookup": %{time_namelookup},
        "time_connect": %{time_connect},
        "time_appconnect": %{time_appconnect},
        "time_pretransfer": %{time_pretransfer},
        "time_redirect": %{time_redirect},
        "time_starttransfer": %{time_starttransfer},
        "time_total": %{time_total},
        "size_download": %{size_download},
        "speed_download": %{speed_download}
    }' "$url")

    # Parse metrics
    local http_code=$(echo "$metrics" | jq -r '.http_code')
    local time_total=$(echo "$metrics" | jq -r '.time_total')
    local ttfb=$(echo "$metrics" | jq -r '.time_starttransfer')
    local size=$(echo "$metrics" | jq -r '.size_download')

    # Status indicators
    local status="OK"
    local color=$GREEN

    if [ "$http_code" != "200" ]; then
        status="ERROR"
        color=$RED
    elif (( $(echo "$time_total > $RESPONSE_TIME_CRIT" | bc -l) )); then
        status="CRITICAL"
        color=$RED
    elif (( $(echo "$time_total > $RESPONSE_TIME_WARN" | bc -l) )); then
        status="WARNING"
        color=$YELLOW
    fi

    # Display results
    echo -e "  HTTP: $http_code | Time: ${time_total}s | TTFB: ${ttfb}s | Size: $(numfmt --to=iec-i --suffix=B $size 2>/dev/null || echo "${size}B") | ${color}${status}${NC}"

    # Return JSON
    echo "$metrics"
}

# Check SSL certificate
check_ssl() {
    local domain=$(echo "$SITE_URL" | sed -e 's|https://||' -e 's|/.*||')

    echo -e "\n${BLUE}Checking SSL Certificate...${NC}"

    local expiry=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)

    if [ -n "$expiry" ]; then
        local expiry_epoch=$(date -d "$expiry" +%s 2>/dev/null || date -j -f "%b %d %T %Y %Z" "$expiry" +%s 2>/dev/null)
        local now_epoch=$(date +%s)
        local days_left=$(( ($expiry_epoch - $now_epoch) / 86400 ))

        if [ "$days_left" -lt 30 ]; then
            echo -e "  SSL Expires: $expiry (${RED}$days_left days left!${NC})"
        else
            echo -e "  SSL Expires: $expiry (${GREEN}$days_left days left${NC})"
        fi

        echo "  \"ssl_days_remaining\": $days_left"
    else
        echo -e "  ${YELLOW}Could not check SSL certificate${NC}"
        echo "  \"ssl_days_remaining\": null"
    fi
}

# Check DNS response time
check_dns() {
    local domain=$(echo "$SITE_URL" | sed -e 's|https://||' -e 's|/.*||')

    echo -e "\n${BLUE}Checking DNS...${NC}"

    local dns_time=$(curl -s -o /dev/null -w "%{time_namelookup}" "$SITE_URL")
    echo -e "  DNS lookup time: ${dns_time}s"

    if (( $(echo "$dns_time > 0.1" | bc -l) )); then
        echo -e "  ${YELLOW}DNS lookup is slow, consider DNS optimization${NC}"
    fi
}

# Generate summary
generate_summary() {
    local results="$1"

    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}Performance Summary${NC}"
    echo -e "${BLUE}========================================${NC}"

    # Calculate averages
    local total_time=0
    local total_ttfb=0
    local count=0

    for page in "${PAGES[@]}"; do
        local url="$SITE_URL$page"
        local metrics=$(curl -s -o /dev/null -w '%{time_total},%{time_starttransfer}' "$url" 2>/dev/null)
        local time=$(echo "$metrics" | cut -d',' -f1)
        local ttfb=$(echo "$metrics" | cut -d',' -f2)

        total_time=$(echo "$total_time + $time" | bc)
        total_ttfb=$(echo "$total_ttfb + $ttfb" | bc)
        count=$((count + 1))
    done

    if [ "$count" -gt 0 ]; then
        local avg_time=$(echo "scale=3; $total_time / $count" | bc)
        local avg_ttfb=$(echo "scale=3; $total_ttfb / $count" | bc)

        echo -e "\nAverage Response Time: ${avg_time}s"
        echo -e "Average TTFB: ${avg_ttfb}s"
        echo -e "Pages Tested: $count"
    fi
}

# Compare with previous report
compare_previous() {
    local latest=$(ls -t "$REPORT_DIR"/report_*.json 2>/dev/null | head -2 | tail -1)

    if [ -n "$latest" ] && [ "$latest" != "$REPORT_FILE" ]; then
        echo -e "\n${BLUE}Comparing with previous report...${NC}"

        local prev_time=$(jq -r '.pages[0].time_total' "$latest" 2>/dev/null || echo "0")
        local curr_time=$(jq -r '.pages[0].time_total' "$REPORT_FILE" 2>/dev/null || echo "0")

        if [ "$prev_time" != "0" ] && [ "$curr_time" != "0" ]; then
            local diff=$(echo "scale=3; $curr_time - $prev_time" | bc)
            if (( $(echo "$diff > 0" | bc -l) )); then
                echo -e "  Homepage: ${RED}+${diff}s slower${NC}"
            else
                echo -e "  Homepage: ${GREEN}${diff}s faster${NC}"
            fi
        fi
    fi
}

# Finalize report
finalize_report() {
    # Remove trailing comma and close JSON
    sed -i'' -e '$ s/,$//' "$REPORT_FILE" 2>/dev/null || sed -i '' -e '$ s/,$//' "$REPORT_FILE"
    echo "  ]" >> "$REPORT_FILE"
    echo "}" >> "$REPORT_FILE"

    echo -e "\n${GREEN}Report saved: $REPORT_FILE${NC}"
}

# Clean old reports (keep last 30)
clean_old_reports() {
    local count=$(ls -1 "$REPORT_DIR"/report_*.json 2>/dev/null | wc -l | tr -d ' ')
    if [ "$count" -gt 30 ]; then
        ls -t "$REPORT_DIR"/report_*.json | tail -n +31 | xargs rm -f
        echo -e "${YELLOW}Cleaned old reports (keeping last 30)${NC}"
    fi
}

# Main execution
main() {
    echo ""
    echo "============================================"
    echo "  Shelzy's Designs - Performance Monitor"
    echo "============================================"
    echo ""
    echo "Site: $SITE_URL"
    echo "Time: $(date)"
    echo ""

    init_report

    # Test each page
    local first=true
    for page in "${PAGES[@]}"; do
        if [ "$first" = true ]; then
            first=false
        else
            echo "," >> "$REPORT_FILE"
        fi

        metrics=$(test_page "$page")
        echo "    $metrics" >> "$REPORT_FILE"
    done

    check_ssl
    check_dns
    generate_summary
    finalize_report
    compare_previous
    clean_old_reports

    echo ""
    echo -e "${GREEN}Performance check complete!${NC}"
}

# Run with options
case "${1:-}" in
    --json)
        # Output JSON only
        for page in "${PAGES[@]}"; do
            test_page "$page"
        done
        ;;
    --quick)
        # Quick check (homepage only)
        PAGES=("/")
        main
        ;;
    --help)
        echo "Usage: $0 [--json|--quick|--help]"
        echo ""
        echo "Options:"
        echo "  --json   Output JSON results only"
        echo "  --quick  Quick check (homepage only)"
        echo "  --help   Show this help"
        ;;
    *)
        main
        ;;
esac
