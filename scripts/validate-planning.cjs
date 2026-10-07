const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const errors=[];
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const requirements=read('.planning/REQUIREMENTS.md');
const roadmap=read('.planning/ROADMAP.md');
const ids=[...requirements.matchAll(/^- \[ \] \*\*([A-Z]+-\d+)\*\*:/gm)].map(m=>m[1]);
const rows=[...requirements.matchAll(/^\| ([A-Z]+-\d+) \| Phase (\d+) \| Pending \|$/gm)].map(m=>({id:m[1],phase:+m[2]}));
const phases=[...roadmap.matchAll(/^### Phase (\d+): ([^\n]+)\n([\s\S]*?)(?=^### Phase |^## Progress|$(?![\s\S]))/gm)].map(m=>({n:+m[1],name:m[2],body:m[3]}));
if(new Set(ids).size!==ids.length) errors.push('duplicate requirement IDs');
if(!ids.length||!phases.length) errors.push('missing requirements or phases');
const mappings=[];
for(const p of phases){
 const reqLine=p.body.match(/^\*\*Requirements:\*\* (.+)$/m);
 if(!reqLine) errors.push(`Phase ${p.n} missing requirements`);
 for(const id of reqLine?.[1].split(/,\s*/)||[]) mappings.push({id,phase:p.n});
 const deps=p.body.match(/^\*\*Depends on:\*\* (.+)$/m);
 if(!deps) errors.push(`Phase ${p.n} missing dependencies`);
 for(const d of deps?.[1].matchAll(/Phase (\d+)/g)||[]) if(+d[1]>=p.n||!phases.some(q=>q.n===+d[1]))errors.push(`Phase ${p.n} invalid dependency ${d[1]}`);
 const count=[...p.body.matchAll(/^\d+\. /gm)].length;
 if(count<2||count>5)errors.push(`Phase ${p.n} has ${count} criteria`);
 if(!/\*\*Success Criteria\*\*[^\n]*:\s*\n((?:\n*[ \t]*\d+\.[^\n]*\n?(?:[ \t]+(?!\d+\.)[^\n]*\n?)*)+)/i.test(p.body))errors.push(`Phase ${p.n} criteria are not GSD-parseable`);
 if(!p.body.includes('**Plans:**'))errors.push(`Phase ${p.n} missing plans`);
}
for(const [i,p]of phases.entries())if(p.n!==i+1)errors.push('non-contiguous phase IDs');
for(const id of ids){
 const m=mappings.filter(r=>r.id===id), t=rows.filter(r=>r.id===id);
 if(m.length!==1||t.length!==1||m[0]?.phase!==t[0]?.phase)errors.push(`${id} mapping mismatch`);
}
for(const r of [...mappings,...rows])if(!ids.includes(r.id))errors.push(`unknown requirement ${r.id}`);
const config=JSON.parse(read('.planning/config.json'));
if(config.mode!=='interactive'||config.granularity!=='fine'||!config.commit_docs)errors.push('workflow config differs from confirmed choices');
const lock=JSON.parse(read('references/upstream-lock.json'));
for(const r of lock.repositories)if(!/^[0-9a-f]{40}$/.test(r.commit)||!r.path.startsWith('references/upstream/'))errors.push(`invalid lock ${r.name}`);
const dirs=['docs','.planning/research'];
const files=['README.md','AGENTS.md','references/UPSTREAM.md','.planning/PROJECT.md','.planning/REQUIREMENTS.md','.planning/ROADMAP.md','.planning/STATE.md',...dirs.flatMap(d=>fs.readdirSync(path.join(root,d)).filter(n=>n.endsWith('.md')).map(n=>d+'/'+n))];
for(const f of files){
 for(const m of read(f).matchAll(/\[[^\]]+\]\(([^)]+)\)/g)){
  const target=m[1];
  if(/^(https?:|#)/.test(target))continue;
  const resolved=path.resolve(root,path.dirname(f),target.split('#')[0]);
  if(!fs.existsSync(resolved))errors.push(`${f} broken link ${target}`);
 }
}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
else console.log(JSON.stringify({status:'PASS',phases:phases.length,v1Requirements:ids.length,mapped:mappings.length,unmapped:0,referenceRepositories:lock.repositories.length,localLinks:'valid'}));
