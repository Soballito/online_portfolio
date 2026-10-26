# usage: set_meta.py NO ctx|role VALUE  -> sets a project's context or role in the index row and the project block
import re, sys
no, field, val = sys.argv[1], sys.argv[2], sys.argv[3]
p='/tmp/claude-0/-home-claude/d3397021-79e0-535a-bd87-ff3e01d1fffd/scratchpad/src/site_body.html'; b=open(p).read()
# index row
li=re.compile(r'(<li><a href="#p-%s">.*?<span class="mono-12 i-%s">)([^<]*)(</span>)' % (no, field))
b,n1=li.subn(lambda m:m.group(1)+val+m.group(3),b,count=1)
# project block
s=b.index('id="p-%s"' % no); nxt=b.find('id="p-', s+10); e=nxt if nxt>0 else len(b)
blk=b[s:e]
if field=='year':
    blk,n2=re.subn(r'(ns-project-year">)([^<]*)(<)', lambda m:m.group(1)+val+m.group(3), blk, count=1)
    blk,k=re.subn(r'(<dt>Year</dt><dd>)([^<]*)(</dd>)', lambda m:m.group(1)+val+m.group(3), blk, count=1); n2+=k
    blk,k=re.subn(r'(<p class="mono-12">%s / [^<]*? / )([^<]*)(</p>)' % no, lambda m:m.group(1)+val+m.group(3), blk, count=1); n2+=k
elif field=='ctx': blk,n2=re.subn(r'(<p class="mono-12 muted">%s / )([^<]*)(</p>)' % no, lambda m:m.group(1)+val+m.group(3), blk, count=1)
else: blk,n2=re.subn(r'(<dt>Role</dt><dd>)([^<]*)(</dd>)', lambda m:m.group(1)+val+m.group(3), blk, count=1)
b=b[:s]+blk+b[e:]; open(p,'w').write(b); print('index',n1,'block',n2)
