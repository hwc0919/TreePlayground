import hashlib
import os
import re
import time

html_sha = ''
js_sha = ''

while True:
    files = os.listdir('dist')
    for filename in files:
        filename = os.path.join('dist', filename)
        if filename.endswith('.html'):
            with open(filename, 'rb') as f:
                html_txt = f.read()
        if filename.endswith('.js'):
            with open(filename, 'rb') as f:
                js_txt = f.read()
                js_txt = js_txt.replace(b'\\', b'/placeholder/')
    new_html_sha = hashlib.sha256(html_txt).hexdigest()
    new_js_sha = hashlib.sha256(js_txt).hexdigest()
    if (new_html_sha != html_sha or new_js_sha != js_sha):
        print('Detect change. Packing...')
        new_html_txt = re.sub(rb'<script.*?></script>',
                              b'<script>\n' + js_txt + b'\n</script>',
                              html_txt)
        new_html_txt = new_html_txt.replace(b'/placeholder/', b'\\')
        with open('TreePlaygroundPackup.html', 'wb') as f:
            f.write(new_html_txt)
        print('Packed...')
    html_sha = new_html_sha
    js_sha = new_js_sha
    time.sleep(1)
