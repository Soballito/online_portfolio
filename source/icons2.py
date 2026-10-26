import os, json
S=os.environ['S']
def R(s): return [r for r in s.strip('\n').split('\n')]
icons={}
icons['person']=R("""
...XXX...
..X.X.X..
...XXX...
.........
..XXXXX..
.XX.X.XX.
XX.....XX
""")
icons['book']=R("""
XXXXXXXXX
.X.....X.
..XX.XX..
....X....
..X...X..
.X.X.X.X.
XXXXXXXXX
""")
icons['bars']=R("""
..X.X.X...
..X.X.X.X.
X.X.X.X.X.
X.X.X.X.X.
X.XXXXXXX.
.XX.X.XX..
..XXXXX...
...X.X....
""")
icons['mail']=R("""
...XX.XX...
.XX.....XX.
X..XXXXX..X
.XX.....XX.
...XXXXX...
""")
icons['eye']=R("""
...XXXXX...
.XX.....XX.
X...XXX...X
X..X.X.X..X
.XX.XXX.XX.
...XXXXX...
""")
icons['burger']=R("""
.XX....XX..
X..X..X..X.
....XX....X
.XX....XX..
X..X..X..X.
....XX....X
""")
icons['arrow-down']=R("""
...X...
.......
...X...
...X...
X..X..X
.X.X.X.
..X.X..
...X...
""")
icons['close']=R("""
X.....X
.X...X.
..X.X..
.......
..X.X..
.X...X.
X.....X
""")
icons['chevron']=R("""
X..
.X.
..X
.X.
X..
""")
def path(bm):
    d=[]
    for y,r in enumerate(bm):
        x=0
        while x<len(r):
            if r[x]=='X':
                x0=x
                while x<len(r) and r[x]=='X': x+=1
                d.append(f"M{x0} {y}h{x-x0}v1h-{x-x0}z")
            else: x+=1
    return ''.join(d)
for g,c in (('Icons','#0E0E10'),('IconsOnDark','#FFFFFF')):
    os.makedirs(f"{S}/up2/{g}",exist_ok=True)
    for n,bm in icons.items():
        w,h=len(bm[0]),len(bm)
        open(f"{S}/up2/{g}/{n}.svg",'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w*4}" height="{h*4}" shape-rendering="crispEdges"><path fill="{c}" d="{path(bm)}"/></svg>\n')
open(f"{S}/src/00_icons.js",'w').write("var ICON_BITMAPS="+json.dumps({k:'|'.join(v) for k,v in icons.items()})+";\n")
from PIL import Image, ImageDraw
labels={'person':'PERSONAL INFORMATION','book':'PORTFOLIO','bars':'SKILLS','mail':'CONTACT','burger':'BURGER','arrow-down':'SCROLL','close':'CLOSE','chevron':'CHEVRON','eye':'DISCLAIMER'}
im=Image.new('RGB',(900,90*4+40),(20,20,22)); d=ImageDraw.Draw(im); s=8
for i,(n,bm) in enumerate(icons.items()):
    ox=40+(i%2)*440; oy=30+(i//2)*90
    for y,r in enumerate(bm):
        for x,c in enumerate(r):
            if c=='X': d.rectangle([ox+x*s,oy+y*s,ox+x*s+s-1,oy+y*s+s-1],fill=(225,225,225))
    d.text((ox+100,oy+20),labels[n],fill=(225,225,225))
im.save(f"{S}/frames/icons2.png")
