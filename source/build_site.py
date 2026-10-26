import json, re
S = '/tmp/claude-0/-home-claude/d3397021-79e0-535a-bd87-ff3e01d1fffd/scratchpad'
t = json.load(open(S + '/ds/project/tokens.json'))
themes = [x['id'] for x in t['color']['themes']]
def val(k, th):
    v = k['value']; return v if isinstance(v, str) else v.get(th, v[themes[0]])
conv = lambda v: 'var(--%s)' % v[1:-1] if v.startswith('{') else v
def colors(th): return ''.join('--%s:%s;' % (k['name'], conv(val(k, th))) for k in t['color']['tokens'])
other = ''.join('--font-%s:%s;' % (k, v) for k, v in t['type']['families'].items())
for key in ('spacing', 'radius', 'layout', 'duration', 'opacity', 'zIndex'):
    other += ''.join('--%s:%s;' % (k['name'], k['value']) for k in t[key]['tokens'])
styles = ''
for g in t['type']['groups']:
    for s in g['styles']:
        styles += '.%s{font-family:var(--font-%s);font-size:%s;line-height:%s;font-weight:%s;%s}\n' % (
            s['name'], g['family'], s['fontSize'], s['lineHeight'], s['fontWeight'],
            ('letter-spacing:%s;' % s['letterSpacing']) if 'letterSpacing' in s else '')
tokens_css = (
    '/* tokens: Nico Soballa design system */\n'
    ':root{' + colors('light') + other + '}\n'
    '@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){' + colors('dark') + 'color-scheme:dark}}\n'
    ':root[data-theme="dark"]{' + colors('dark') + 'color-scheme:dark}\n' + styles)
bundle_css = open(S + '/ds/project/components/bundle.css').read()
bundle_css = re.sub(r'^@import[^\n]*\n', '', bundle_css)
site_css = open(S + '/src/site.css').read()
js = '(function(){\n"use strict";\n' + open(S + '/src/00_icons.js').read() + open(S + '/src/10_engines.js').read() + open(S + '/src/site_app.js').read() + open(S + '/src/i18n_de.js').read() + open(S + '/src/i18n.js').read() + '\n})();'
assert '</script' not in js
body = open(S + '/src/site_body.html').read()
page = f'''<title>Nico Soballa</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="Portfolio of Nico Soballa">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;700&family=Roboto:wght@400;500&family=Roboto+Mono:wght@400;500&display=swap">
<style>
{tokens_css}
{bundle_css}
{site_css}
</style>
{body}
<script>
{js}
</script>
'''
open(S + '/site/index.html', 'w').write(page)
print(len(page))
