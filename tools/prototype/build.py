"""Build standalone Android HTML; retain split PWA as authoritative source."""
from pathlib import Path
import hashlib
root=Path(__file__).resolve().parents[2]
src=root/'prototype'
html=(src/'index.html').read_text()
html=html.replace('<link rel="manifest" href="manifest.webmanifest">','').replace('<link rel="icon" href="icon.svg" type="image/svg+xml">','')
html=html.replace('<link rel="stylesheet" href="style.css">','<style>\n'+(src/'style.css').read_text()+'\n</style>')
for name in ['core.js','app.js']:
    body=(src/name).read_text().replace('</script','<\\/script')
    html=html.replace(f'<script src="{name}"></script>','<script>\n'+body+'\n</script>')
out=root/'release';out.mkdir(exist_ok=True)
(out/'TUS-Android-Prototip.html').write_text(html)
print(f'Built {len(html.encode())} bytes; SHA256 {hashlib.sha256(html.encode()).hexdigest()}')
