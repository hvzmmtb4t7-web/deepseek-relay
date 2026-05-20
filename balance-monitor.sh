#!/usr/bin/env bash
# DeepSeek balance monitor — alert when funds run low
# Usage: Add to crontab: 0 */6 * * * /opt/deepseek-relay/balance-monitor.sh
set -euo pipefail

THRESHOLD="${1:-10}"  # Alert when below $10
API_KEY="${DEEPSEEK_API_KEY:-}"
ALERT_EMAIL="${ALERT_EMAIL:-admin@example.com}"

if [ -z "$API_KEY" ]; then
  echo "Set DEEPSEEK_API_KEY env var or pass as: $0 <threshold> <api_key>"
  exit 1
fi

# Check balance via DeepSeek API
RESP=$(curl -s -H "Authorization: Bearer $API_KEY" \
  "https://api.deepseek.com/user/balance" 2>/dev/null || echo '{"balance":-1}')

BALANCE=$(echo "$RESP" | grep -o '"balance":[0-9.]*' | cut -d: -f2)

if [ "$BALANCE" = "" ] || [ "$BALANCE" = "-1" ]; then
  echo "[$(date)] WARNING: Could not fetch DeepSeek balance"
  exit 0
fi

# Compare with integer math (balance is in USD cents)
BALANCE_CENTS=$(printf "%.0f" "$(echo "$BALANCE * 100" | bc -l 2>/dev/null || echo 0)")
THRESHOLD_CENTS=$(printf "%.0f" "$(echo "$THRESHOLD * 100" | bc -l)")

echo "[$(date)] DeepSeek balance: \$$BALANCE (threshold: \$$THRESHOLD)"

if [ "$BALANCE_CENTS" -lt "$THRESHOLD_CENTS" ]; then
  MSG="⚠️ DeepSeek balance is \$$BALANCE — below \$$THRESHOLD threshold. Add funds at https://platform.deepseek.com"
  echo "$MSG"
  if command -v mail &>/dev/null; then
    echo "$MSG" | mail -s "DeepSeek Balance Alert" "$ALERT_EMAIL"
  fi
  # Also write to a file that can be checked by monitoring tools
  echo "$(date -Iseconds) LOW_BALANCE $BALANCE" >> /var/log/deepseek-balance.log
fi
