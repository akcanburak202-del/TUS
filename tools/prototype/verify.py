"""Validate local assets + generated standalone scripts without claiming browser QA."""
from pathlib import Path
from html.parser import HTMLParser
import json,re,subprocess,tempfile
root=Path(__file__).resolve().parents[2]
src=root/'prototype'
class Links(HTMLParser):
 def __init__(self): super().__init__();self.links=[]
 def handle_starttag(self,tag,attrs):
  for k,v in attrs:
   if k in ('src','href') and v and not v.startswith('#'): self.links.append(v)
p=Links();p.feed((src/'index.html').read_text())
for x in p.links:
 assert '://' not in x, f'External runtime reference: {x}'
 assert (src/x).is_file(), f'Missing asset: {x}'
manifest=json.loads((src/'manifest.webmanifest').read_text())
for icon in manifest['icons']:assert (src/icon['src']).is_file()
sw=(src/'sw.js').read_text();assets=re.search(r'const ASSETS=\[(.*?)\];',sw).group(1)
for asset in re.findall(r"'([^']+)'",assets):assert (src/asset).exists(),asset
for name in ['core.js','app.js','sw.js']:subprocess.run(['node','--check',str(src/name)],check=True)
html=(root/'release/TUS-Android-Prototip.html').read_text()
p=Links();p.feed(html);assert not p.links, p.links
scripts=re.findall(r'<script>(.*?)</script>',html,re.S);assert len(scripts)==2
with tempfile.TemporaryDirectory() as temp:
 for i,s in enumerate(scripts):
  path=Path(temp)/f'inline-{i}.js';path.write_text(s);subprocess.run(['node','--check',str(path)],check=True)
assert 'lang="tr"' in html and 'name="viewport"' in html
print('PASS: split local assets, manifest icons, service-worker cache list, 3 source scripts and 2 bundled scripts; no standalone external references. Physical Android/browser/offline restart NOT_RUN.')
