from pathlib import Path
from urllib.parse import unquote
import base64, gzip, hashlib, json

root = Path(__file__).resolve().parent
chunk_dir = root / 'gzchunks'
manifest = json.loads((chunk_dir / 'manifest.json').read_text('utf-8'))

packed = bytearray()
for name in manifest['chunks']:
    packed.extend(base64.b64decode((chunk_dir / name).read_text('ascii').strip()))

packed_sha = hashlib.sha256(packed).hexdigest()
if packed_sha != manifest['gzip_sha256']:
    raise SystemExit(f'GZIP SHA256 mismatch: {packed_sha} != {manifest["gzip_sha256"]}')

source = gzip.decompress(bytes(packed))
source_sha = hashlib.sha256(source).hexdigest()
if source_sha != manifest['source_sha256']:
    raise SystemExit(f'SOURCE SHA256 mismatch: {source_sha} != {manifest["source_sha256"]}')
if len(source) != manifest['source_bytes']:
    raise SystemExit(f'SOURCE SIZE mismatch: {len(source)} != {manifest["source_bytes"]}')

bookmark = source.decode('utf-8').strip()
if not bookmark.startswith('javascript:'):
    raise SystemExit('Source is not a bookmarklet')

js = unquote(bookmark[len('javascript:'):])
header = """/* XBookmark / SWIR Cloud
 * Generated automatically from verified SWIR bookmark source.
 * Repository: Swir/XBookmark
 */
"""
(root / 'swir.js').write_text(header + js + '\n', 'utf-8')
print('Built swir.js:', len(js), 'chars; source sha256:', source_sha)
