import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const root=path.resolve(import.meta.dirname,'..'),native=createRequire(path.join(root,'package.json')),ts=native('typescript');
function load(relative,mocks={},globals={}){
  const cache=new Map();
  function read(filename){
    if(cache.has(filename))return cache.get(filename).exports;
    const module={exports:{}};cache.set(filename,module);
    if(filename.endsWith('.json'))return JSON.parse(fs.readFileSync(filename,'utf8'));
    const code=ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
    const require=id=>id in mocks?mocks[id]:id==='server-only'?{}:id.startsWith('.')?read(['','.ts','.tsx','.json'].map(ext=>path.resolve(path.dirname(filename),id)+ext).find(file=>fs.existsSync(file)&&fs.statSync(file).isFile())):native(id);
    vm.runInNewContext(`(function(require,module,exports){${code}\n})`,{URL,URLSearchParams,Date,Map,Set,Response,Request,console,...globals})(require,module,module.exports);
    return module.exports;
  }
  return read(path.join(root,relative));
}
const body={firstName:'Mara',lastName:'Beispiel',email:'customer@example.invalid',phone:'12345',departure:'Hamburg',startDate:'2027-07-01',endDate:'2027-07-08',travelers:4,budget:1200,preferences:['Wellness'],selectedIdea:'wellness',additionalWishes:'Mit Hund, möglichst ruhig',privacyAccepted:true};
const {buildSurpriseEmail}=load('app/lib/surprise-email.ts');

test('Internal notification has exactly the confirmed recipient and three planning links',()=>{
  const message=buildSurpriseEmail('request-123',body);
  assert.equal(message.to,'info@ludigo-travel.com');assert.equal(message.messageId,'<surprise-request-123@ludigo-travel.com>');assert.ok(!('html' in message));
  assert.ok(message.text.includes(body.email));assert.ok(message.text.includes(body.additionalWishes));assert.ok(message.text.includes('keine von Booking gelieferten oder geprüften Angebote'));
  const links=message.text.split('\n').filter(line=>line.startsWith('https://www.jdoqocy.com/'));
  assert.equal(links.length,3);
  for(const link of links){const target=new URL(new URL(link).searchParams.get('url'));assert.equal(target.searchParams.get('checkin'),body.startDate);assert.equal(target.searchParams.get('checkout'),body.endDate);assert.ok(!target.searchParams.has('group_adults'));assert.ok(!target.searchParams.has('age'));assert.ok(!link.includes('customer'));assert.ok(!link.includes('Hamburg'));assert.ok(!link.includes('12345'));assert.ok(!target.searchParams.has('price'));assert.ok(target.searchParams.get('nflt').includes('hotelfacility=54'));}
});
test('Every supported theme has three editorial starting points; no price promises or fake inventory',()=>{
  for(const selectedIdea of ['meer','natur','city','wellness','aktiv']){const message=buildSurpriseEmail('abc',{...body,selectedIdea});assert.equal(message.text.split('\n').filter(line=>line.startsWith('https://www.jdoqocy.com/')).length,3);assert.ok(message.text.includes('Es wurde keine Reise oder Unterkunft gebucht.'));assert.ok(message.text.includes('kein Hotelbudget')||message.text.includes('nicht als Unterkunftspreisfilter'));}
});
test('Day trips omit invalid zero-night dates',()=>{
  const message=buildSurpriseEmail('abc',{...body,endDate:body.startDate});assert.ok(message.text.includes('Tagesausflug'));
  for(const link of message.text.split('\n').filter(line=>line.startsWith('https://www.jdoqocy.com/'))){assert.ok(!new URL(new URL(link).searchParams.get('url')).searchParams.has('checkin'));}
});

function endpoint(options={}){
  const scheduled=[],sent=[],inserts=[],events=[];
  const client={from:table=>({insert:row=>{inserts.push({table,row});return{select:()=>({single:async()=>{events.push('saved');return options.dbError?{data:null,error:{code:'TEST'}}:options.noId?{data:null,error:null}:{data:{id:'request-123'},error:null};}})};}})};
  const env=options.noConfig?{}:{NEXT_PUBLIC_SUPABASE_URL:'https://example.invalid',SUPABASE_SECRET_KEY:'test-only'};
  const {POST}=load('app/api/surprise/request/route.ts',{'next/server':{NextResponse:{json:Response.json},after:callback=>scheduled.push(callback)},'@supabase/supabase-js':{createClient:()=>client},'@/app/lib/surprise-notification':{sendSurpriseNotification:async(id,data)=>{events.push('mail');sent.push({id,data});return 'accepted';}}},{process:{env},console:{error(){}}});
  return{POST,scheduled,sent,inserts,events};
}
const request=value=>new Request('https://example.invalid/api/surprise/request',{method:'POST',headers:{'content-type':'application/json'},body:typeof value==='string'?value:JSON.stringify(value)});
test('Only a successfully saved submission schedules one background email, after the response',async()=>{
  const e=endpoint(),response=await e.POST(request(body));assert.equal(response.status,201);assert.equal(e.inserts.length,1);assert.equal(e.scheduled.length,1);assert.equal(e.sent.length,0);assert.equal((await response.json()).requestId,'request-123');
  await e.scheduled[0]();assert.equal(e.sent.length,1);assert.equal(e.sent[0].id,'request-123');assert.equal(e.sent[0].data.email,body.email);assert.deepEqual(e.events,['saved','mail']);
});
for(const [name,value] of [['missing consent',{...body,privacyAccepted:false}],['invalid travelers',{...body,travelers:0}],['header injection',{...body,email:'a@example.invalid\r\nBcc:other@example.invalid'}],['honeypot',{...body,website:'spam'}],['theme mismatch',{...body,selectedIdea:'meer'}],['malformed JSON','{']])test(`${name} cannot send or save an inquiry`,async()=>{
  const e=endpoint(),response=await e.POST(request(value));assert.equal(response.status,400);assert.equal(e.inserts.length,0);assert.equal(e.scheduled.length,0);
});
for(const option of ['dbError','noConfig','noId'])test(`${option}: no notification is scheduled`,async()=>{
  const e=endpoint({[option]:true}),response=await e.POST(request(body));assert.ok(response.status>=500);assert.equal(e.scheduled.length,0);assert.equal(e.sent.length,0);
});

function mailer(env,result={accepted:['info@ludigo-travel.com']},error){
  const options=[],messages=[],logs=[];let closed=0;
  const module=load('app/lib/surprise-notification.ts',{nodemailer:{createTransport:config=>{options.push(config);return{sendMail:async message=>{messages.push(message);if(error)throw error;return result;},close:()=>closed++};}}},{process:{env},console:{error:message=>logs.push(message)}});
  return{...module,options,messages,logs,closed:()=>closed};
}
test('Missing SMTP password never attempts an unauthenticated send',async()=>{
  const m=mailer({});assert.equal(await m.sendSurpriseNotification('abc',body),'not_configured');assert.equal(m.options.length,0);
});
for(const port of ['465','587'])test(`IONOS SMTP ${port} encrypts delivery and fixes the recipient`,async()=>{
  const m=mailer({SURPRISE_SMTP_PASSWORD:'test-secret',SURPRISE_SMTP_PORT:port,SURPRISE_SMTP_TO:'evil@example.invalid'});assert.equal(await m.sendSurpriseNotification('abc',body),'accepted');
  assert.equal(m.options[0].host,'smtp.ionos.de');assert.equal(m.options[0].secure,port==='465');assert.equal(m.options[0].requireTLS,true);assert.equal(m.options[0].tls.rejectUnauthorized,true);assert.equal(m.options[0].debug,false);
  assert.equal(m.messages[0].to,'info@ludigo-travel.com');assert.equal(m.messages[0].from.address,'info@ludigo-travel.com');assert.ok(!('cc' in m.messages[0]));assert.ok(!('bcc' in m.messages[0]));assert.equal(m.closed(),1);
});
test('Mail failure is isolated and logs never expose credentials or customer details',async()=>{
  const m=mailer({SURPRISE_SMTP_PASSWORD:'test-secret'},undefined,new Error('test-secret customer@example.invalid'));
  assert.equal(await m.sendSurpriseNotification('abc',body),'failed');assert.ok(m.logs.every(line=>!line.includes('test-secret')&&!line.includes('customer@')));assert.equal(m.closed(),1);
});
test('An SMTP rejection is not reported as an accepted message',async()=>{
  const m=mailer({SURPRISE_SMTP_PASSWORD:'test-secret'},{accepted:[],rejected:['info@ludigo-travel.com']});assert.equal(await m.sendSurpriseNotification('abc',body),'failed');
});
