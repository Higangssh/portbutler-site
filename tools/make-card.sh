#!/bin/bash
# 소셜 카드(1200x630)를 다시 굽는다.  사용법:  tools/make-card.sh
#
# **왜 전용 그림이 필요한가.** og:image 에 스크린샷을 그대로 걸면 슬랙·레딧·
# 페이스북이 1.91:1 로 잘라낸다. 3400x1400 짜리 hero.png 는 창 가운데만 남고
# 제품 이름도 가격도 안 보이는 그림이 된다. 링크를 나누는 자리에서 그것이
# 첫인상이다.
#
# **그림을 data: 로 박아 넣는 이유**는 헤드리스 크롬이 파일 두 개를 서로 다른
# 시점에 읽어서, 사진이 도착하기 전에 찍히는 일이 있기 때문이다. 한 파일이면
# 그 경합이 없다.
set -euo pipefail
cd "$(dirname "$0")/.."
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[ -x "$CHROME" ] || { echo "크롬이 없다: $CHROME" >&2; exit 1; }
OUT="${TMPDIR:-/tmp}/portbutler-card"
mkdir -p "$OUT"

python3 - "$OUT/card.html" <<'PY'
import base64, pathlib, sys
def b64(p): return "data:image/png;base64," + base64.b64encode(pathlib.Path(p).read_bytes()).decode()
html = pathlib.Path("tools/card.template.html").read_text(encoding="utf-8")
html = html.replace("{{SHOT}}", b64("public/images/hero.png")).replace("{{ICON}}", b64("public/images/icon.png"))
pathlib.Path(sys.argv[1]).write_text(html, encoding="utf-8")
PY

"$CHROME" --headless --disable-gpu --hide-scrollbars \
  --screenshot="$OUT/card.png" --window-size=1200,630 \
  --default-background-color=0f1418ff "file://$OUT/card.html" 2>/dev/null
cp "$OUT/card.png" public/images/card.png
echo "▸ public/images/card.png  ($(stat -f%z public/images/card.png) bytes)"
echo "  hero.png 를 다시 구웠으면 이것도 다시 구울 것."
