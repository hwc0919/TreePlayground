# Watch file changes in './Docs' and auto packup html with js

import hashlib
import os
import re
import time

# Detect difference by comparing MD5
html_md5 = ''
js_md5 = ''
css_md5 = ''

# Loop forever
while True:
    files = os.listdir('docs')

    # Read html, bundle.js and style.js
    for filename in files:
        filename = os.path.join('docs', filename)
        if filename.endswith('.html'):
            with open(filename, 'rb') as f:
                html_txt = f.read()
        if filename.endswith('bundle.js'):
            with open(filename, 'rb') as f:
                js_txt = f.read()
        if filename.endswith('style.js'):
            with open(filename, 'rb') as f:
                css_txt = f.read()

    # '\' will cause error, replace them
    js_txt = js_txt.replace(b'\\', b'/@placeholder@/')
    css_txt = css_txt.replace(b'\\', b'/@placeholder@/')

    # Calculate MD5
    new_html_md5 = hashlib.md5(html_txt).hexdigest()
    new_js_md5 = hashlib.md5(js_txt).hexdigest()
    new_css_md5 = hashlib.md5(css_txt).hexdigest()

    # Check for difference and packup
    if (new_html_md5 != html_md5 or new_js_md5 != js_md5 or new_css_md5 != css_md5):
        print('Detect change. Packing...')
        html_txt = re.sub(rb'<script .*?bundle.*?"></script>',
                          b'<script>\n' + js_txt + b'\n</script>',
                          html_txt)
        html_txt = re.sub(rb'<script .*?style.*?"></script>',
                          b'<script>\n' + css_txt + b'\n</script>',
                          html_txt)
        html_txt = html_txt.replace(b'/@placeholder@/', b'\\')
        with open('TreePlaygroundPackup.html', 'wb') as f:
            f.write(html_txt)
        print('Packed...')

    # Update MD5 value
    html_md5 = new_html_md5
    js_md5 = new_js_md5
    css_md5 = new_css_md5

    time.sleep(1)
