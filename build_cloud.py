from pathlib import Path
from urllib.parse import unquote
import base64, hashlib, json

root = Path(__file__).resolve().parent
manifest = json.loads((root / 'chunks' / 'manifest.json').read_text('utf-8'))
out = bytearray()
for name in manifest['chunks']:
    out.extend(base64.b64decode((root / 'chunks' / name).read_text('ascii').strip()))

expected = manifest['source_sha256']
actual = hashlib.sha256(out).hexdigest()
if actual != expected:
    raise SystemExit(f'SHA256 mismatch: {actual} != {expected}')

bookmark = out.decode('utf-8').strip()
if not bookmark.startswith('javascript:'):
    raise SystemExit('Source is not a bookmarklet')

js = unquote(bookmark[len('javascript:'):])
header = """/* XBookmark / SWIR Cloud\n * Generated automatically from verified bookmark source.\n * Do not edit swir.js directly — update chunks instead.\n */\n"""
(root / 'swir.js').write_text(header + js + '\n', 'utf-8')
print('Built swir.js:', len(js), 'chars; source sha256:', actual)
