'use strict';
// Independently authored research inputs. No upstream EDID/template or helper code.
const fs=require('node:fs'),path=require('node:path');
function checksum(b,start){let sum=0;for(let i=start;i<start+127;i++)sum+=b[i];b[start+127]=(-sum)&255;}
function descriptor(b,offset,tag,value){b[offset+3]=tag;b.fill(32,offset+5,offset+18);const s=value.slice(0,12);b.write(s,offset+5,'ascii');b[offset+5+s.length]=10;}
function edid(hdr=false){
 const b=Buffer.alloc(256);b.set([0,255,255,255,255,255,255,0]);
 // ZZZ is an explicit research placeholder, not a claimed assigned vendor ID.
 const vendor=(26<<10)|(26<<5)|26;b.writeUInt16BE(vendor,8);b.writeUInt16LE(1,10);
 b[16]=1;b[17]=36;b[18]=1;b[19]=4;b[20]=128;b[23]=120;b[24]=2;
 // sRGB chromaticity coordinates, encoded as EDID 10-bit fractions.
 const coords=[.640,.330,.300,.600,.150,.060,.3127,.3290].map(x=>Math.round(x*1024));
 b[25]=((coords[0]&3)<<6)|((coords[1]&3)<<4)|((coords[2]&3)<<2)|(coords[3]&3);
 b[26]=((coords[4]&3)<<6)|((coords[5]&3)<<4)|((coords[6]&3)<<2)|(coords[7]&3);
 coords.forEach((x,i)=>b[27+i]=x>>2);b.fill(1,38,54);
 // Preferred 1920x1080 60Hz: 148.5MHz / (2200 * 1125), positive H/V sync.
 const d=54;b.writeUInt16LE(14850,d);b[d+2]=1920&255;b[d+3]=280&255;b[d+4]=((1920>>8)<<4)|(280>>8);
 b[d+5]=1080&255;b[d+6]=45;b[d+7]=(1080>>8)<<4;b[d+8]=88;b[d+9]=44;b[d+10]=(4<<4)|5;b[d+17]=30;
 descriptor(b,72,252,'AetherHelios');descriptor(b,90,255,'00000000');b[111]=16;
 b[126]=1;b[128]=2;b[129]=3;b[130]=hdr?12:4;
 if(hdr)b.set([227,5,128,0,227,6,5,1],132); // BT.2020 RGB; SDR + PQ; static metadata type 1.
 checksum(b,0);checksum(b,128);return b;
}
function edidHeader(){
 const array=b=>Array.from(b).map(x=>'0x'+x.toString(16).padStart(2,'0')).join(',');
 return `// Independently authored Aether research EDID; ZZZ vendor is unassigned.
#pragma once
#include <cstdint>
#include <cstdlib>
#include <cstring>
static const uint8_t edid_base[] = {${array(edid(false))}};
static const uint8_t helios_hdr_edid[] = {${array(edid(true))}};
inline uint8_t* generate_edid(uint32_t serial, const char* serialText, const char* name, bool hdr) {
 auto* data = static_cast<uint8_t*>(std::malloc(sizeof(edid_base)));
 if (!data) return nullptr;
 std::memcpy(data, hdr ? helios_hdr_edid : edid_base, sizeof(edid_base));
 for (unsigned i=0; i<4; ++i) data[12+i] = static_cast<uint8_t>(serial >> (i*8));
 const char* strings[] = {serialText, name};
 const unsigned offsets[] = {95, 77};
 for (unsigned field=0; field<2; ++field) {
  if (!strings[field]) continue;
  unsigned n=0;
  while (n<12 && strings[field][n]) {
   const auto c=static_cast<unsigned char>(strings[field][n]);
   data[offsets[field]+n] = (c>=32 && c<=126) ? c : static_cast<uint8_t>('?');
   ++n;
  }
  data[offsets[field]+n]=10;
  for (++n; n<13; ++n) data[offsets[field]+n]=32;
 }
 unsigned sum=0; for (unsigned i=0; i<127; ++i) sum+=data[i];
 data[127]=static_cast<uint8_t>(0u-sum);
 return data;
}
`;
}
function adapterHeader(){return fs.readFileSync(path.join(__dirname,'../tools/helios-display-research/AdapterOption.h'),'utf8');}
module.exports={edid,edidHeader,adapterHeader};
