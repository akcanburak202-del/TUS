"""Build the synthetic preview's HTTPS package and explicitly temporary HTML demo."""
from pathlib import Path
import hashlib
import json
import re
import shutil
import zipfile

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'prototype'
OUT = ROOT / 'release' / 'learning-preview'

# This shim is used ONLY in the labelled, temporary file preview. The HTTPS
# package retains the real IndexedDB adapter. It never touches legacy storage.
MEMORY_STORE = r'''
(function () {
  var records = Object.create(null);
  window.TUS_PORTABLE_DEMO = true;
  window.TusSessionStore = {
    persistence: 'memory',
    open: async function (options) {
      var catalog = JSON.parse(JSON.stringify(options.catalog));
      TusSessionCore.validateCatalog(catalog);
      return {
        persistence: 'memory',
        load: async function (id) {
          return JSON.parse(JSON.stringify(records[id] || TusSessionCore.createState()));
        },
        dispatch: async function (id, commands) {
          var state = records[id] || TusSessionCore.createState();
          var next = TusSessionCore.dispatchBatch(state, catalog, commands);
          records[id] = JSON.parse(JSON.stringify(next));
          return JSON.parse(JSON.stringify(next));
        },
        close: function () {}
      };
    }
  };
}());
'''


def build():
    OUT.mkdir(parents=True, exist_ok=True)
    package = OUT / 'https'
    if package.exists():
        shutil.rmtree(package)
    package.mkdir()
    for name in ('session-core.js', 'session-store.js'):
        shutil.copy2(SOURCE / name, package / name)
    shutil.copytree(SOURCE / 'preview', package / 'preview')
    asset_digest = hashlib.sha256(b''.join(p.read_bytes() for p in sorted(package.rglob('*')) if p.is_file() and p.name != 'sw.js')).hexdigest()[:16]
    worker = package / 'preview' / 'sw.js'
    worker.write_text(re.sub(r'const CACHE_VERSION = [^;]+;', 'const CACHE_VERSION = '+json.dumps(asset_digest)+';', worker.read_text()))
    html = (SOURCE / 'preview' / 'index.html').read_text()
    def inline_script(match):
        path = (SOURCE / 'preview' / match[1]).resolve()
        if not path.is_relative_to(SOURCE.resolve()):
            raise ValueError('external script not allowed')
        body = MEMORY_STORE if path.name == 'session-store.js' else path.read_text()
        return '<script>\n' + body.replace('</script', '<\\/script') + '\n</script>'
    html = re.sub(r'<script\s+src=["\']([^"\']+)["\'][^>]*>\s*</script>', inline_script, html)
    def inline_style(match):
        path = (SOURCE / 'preview' / match[1]).resolve()
        if not path.is_relative_to(SOURCE.resolve()):
            raise ValueError('external style not allowed')
        return '<style>\n' + path.read_text() + '\n</style>'
    html = re.sub(r'<link\s+rel="stylesheet"\s+href="([^"]+)"\s*/?>', inline_style, html)
    html = re.sub(r'<link\s+rel="(?:manifest|icon)"[^>]*>', '', html)
    html = html.replace('<body>', '<body><aside role="note" style="padding:12px;text-align:center;background:#fff0c2;color:#332800;font:16px system-ui">Geçici ekran denemesi · Kapatınca kayıtlar silinir. Tıbbi eğitim içeriği değildir.</aside>')
    if re.search(r'<script[^>]+src=', html):
        raise ValueError('portable preview still has external scripts')
    html = re.sub(r'(?m)^[ \t]+$', '', html)
    artifact = OUT / 'TUS-Ogrenme-Akisi-Deneme.html'
    artifact.write_text(html)
    with zipfile.ZipFile(OUT / 'TUS-Ogrenme-Akisi-HTTPS.zip', 'w', zipfile.ZIP_DEFLATED) as z:
        for p in sorted(package.rglob('*')):
            if p.is_file():
                z.write(p, p.relative_to(package))
    manifest = {str(p.relative_to(OUT)): hashlib.sha256(p.read_bytes()).hexdigest()
                for p in sorted(OUT.rglob('*')) if p.is_file() and p.name != 'manifest.json'}
    (OUT / 'manifest.json').write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + '\n')
    print(json.dumps({'portable': str(artifact), 'sha256': manifest[artifact.name], 'files': len(manifest)}))


if __name__ == '__main__':
    build()
