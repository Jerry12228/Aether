'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {edid,edidHeader}=require('../scripts/helios-display-inputs.cjs');
test('independent EDID has exact 1080p60 and separate SDR/HDR advertised capabilities',()=>{
 const sdr=edid(),hdr=edid(true);
 for(const b of [sdr,hdr]){
  assert.equal(b.length,256);assert.equal(b[126],1);
  for(const offset of [0,128])assert.equal(b.subarray(offset,offset+128).reduce((a,x)=>a+x,0)%256,0);
  assert.equal(b[18],1);assert.equal(b[19],4);
  const d=54,h=b[d+2]+((b[d+4]>>4)<<8),hb=b[d+3]+((b[d+4]&15)<<8),v=b[d+5]+((b[d+7]>>4)<<8),vb=b[d+6]+((b[d+7]&15)<<8);
  assert.equal(h,1920);assert.equal(v,1080);assert.equal(b.readUInt16LE(d)*10000,60*(h+hb)*(v+vb));
  assert.equal(b[130]<=127,true);assert.equal(b[131],0);
 }
 assert.equal(sdr[130],4);assert.equal(sdr.subarray(132,255).every(x=>x===0),true);
 const blocks=[];for(let at=132;at<128+hdr[130];){const length=hdr[at]&31;assert.ok(at+length+1<=128+hdr[130]);blocks.push([...hdr.subarray(at+1,at+length+1)]);at+=length+1;}
 assert.deepEqual(blocks,[[5,128,0],[6,5,1]]);
 assert.equal(hdr.readUInt16BE(8),(26<<10)|(26<<5)|26); // Explicit research vendor placeholder.
});
test('generated C++ EDID arrays match the validated semantic buffers',()=>{
 const header=edidHeader();const arrays=[...header.matchAll(/\[\] = \{([0-9a-fx,]+)\}/g)];
 assert.equal(arrays.length,2);
 for(let i=0;i<2;i++)assert.deepEqual(Buffer.from(arrays[i][1].split(',').map(x=>Number(x))),edid(i===1));
});
