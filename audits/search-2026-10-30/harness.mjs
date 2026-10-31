import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';

export const root=path.resolve(import.meta.dirname,'../..');
const nativeRequire=createRequire(path.join(root,'package.json'));
const ts=nativeRequire('typescript');
const compiled=new Map();
const NativeDate=Date;
class AuditDate extends NativeDate {
  constructor(...args){super(...(args.length?args:['2026-10-30T12:00:00Z']));}
  static now(){return new NativeDate('2026-10-30T12:00:00Z').getTime();}
}
function loader(mocks,globals={}) {
  const modules=new Map();
  function load(filename) {
    if(modules.has(filename))return modules.get(filename).exports;
    if(filename.endsWith('.json')){const value=JSON.parse(fs.readFileSync(filename,'utf8'));modules.set(filename,{exports:value});return value;}
    const module={exports:{}};modules.set(filename,module);
    if(!compiled.has(filename))compiled.set(filename,ts.transpileModule(fs.readFileSync(filename,'utf8'),{fileName:filename,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText);
    const localRequire=(id)=>{
      if(id in mocks)return mocks[id];
      if(id.startsWith('.')) {
        const base=path.resolve(path.dirname(filename),id);
        const resolved=['','.ts','.tsx','.js'].map(ext=>base+ext).find(f=>fs.existsSync(f)&&fs.statSync(f).isFile());
        if(!resolved)throw Error(`Missing local module ${id}`);
        return load(resolved);
      }
      return nativeRequire(id);
    };
    const sandbox={URLSearchParams,URL,Request,Response,Error,Map,Set,AbortSignal,Date:AuditDate,console:{log(){},warn(){},error(){}},setTimeout(){},...globals};
    vm.runInNewContext(`(function(require,module,exports){${compiled.get(filename)}\n})`,sandbox,{filename})(localRequire,module,module.exports);
    return module.exports;
  }
  return load;
}

export async function parseSearch(query,options={}) {
  let index=0;const updates=[],calls=[],logs=[];
  const initial={0:options.type??null,1:options.adults??2,2:options.children??0,3:options.babies??0,4:query,9:options.checkIn??'2027-07-01',10:options.checkOut??'2027-07-08',11:options.guestsChanged??(['adults','children','babies'].some(key=>Object.hasOwn(options,key)))};
  const react={...nativeRequire('react'),useState(value){const i=index++;return [Object.hasOwn(initial,i)?initial[i]:(typeof value==='function'?value():value),(v)=>updates.push({index:i,value:v})];}};
  const load=loader({'react':react,'./components/AccommodationPage':{__esModule:true,default:()=>null}},{
    console:{log(...args){logs.push(args)},warn(...args){logs.push(args)},error(...args){logs.push(args)}},
    fetch:async(url,init)=>{calls.push(String(url));return String(url)==='/api/search'?Response.json({criteria:options.criteria??{}},{status:options.aiStatus??200}):Response.json({accommodations:[]});}
  });
  const SearchBox=load(path.join(root,'app/SearchBox.tsx')).default;
  const element=SearchBox();await element.props.onSubmit({preventDefault(){}});
  const url=calls.find(x=>x.startsWith('/api/accommodations?'));
  const params=url?new URL(url,'https://audit.invalid').searchParams:new URLSearchParams();
  return {query,params:Object.fromEntries([...new Set(params.keys())].map(k=>[k,params.getAll(k)])),url,aiCalls:calls.filter(x=>x==='/api/search').length,normalized:logs.find(x=>x[0]==='NORMALISIERTER TEXT:')?.[1],beforeCleanup:logs.find(x=>x[0]==='VOR CLEANUP:')?.[1],dropped:logs.filter(x=>x[0]==='SEMANTISCHER PARAMETER NICHT AN API GESENDET:').map(x=>x[1]),messages:updates.filter(x=>x.index===6).map(x=>x.value)};
}

export function makeDatabase(tables,options={}) {
  const calls=[];
  class Query {
    constructor(table){this.table=table;this.filters=[];this.selectColumns='*';this.bounds=null;this.sort=null;}
    select(cols){this.selectColumns=cols;return this;}
    eq(k,v){this.filters.push(['eq',k,v]);return this;}
    gte(k,v){this.filters.push(['gte',k,v]);return this;}
    lte(k,v){this.filters.push(['lte',k,v]);return this;}
    in(k,v){this.filters.push(['in',k,v]);return this;}
    ilike(k,v){this.filters.push(['ilike',k,v]);return this;}
    contains(k,v){this.filters.push(['contains',k,v]);return this;}
    not(k,op,v){this.filters.push(['not',k,op,v]);return this;}
    order(k,settings){this.sort=[k,settings];return this;}
    range(from,to){this.bounds=[from,to];return this;}
    then(resolve,reject){
      calls.push({table:this.table,columns:this.selectColumns,filters:this.filters,range:this.bounds});
      if(options.errors?.[this.table])return Promise.resolve({data:null,error:{message:options.errors[this.table]}}).then(resolve,reject);
      let data=[...(tables[this.table]??[])].filter(row=>this.filters.every(([op,k,v,extra])=>{
        const value=row[k];
        if(op==='eq')return value===v;
        if(op==='not')return value!==extra&&value!==undefined;
        if(value===null||value===undefined)return false;
        if(op==='gte')return value>=v;
        if(op==='lte')return value<=v;
        if(op==='in')return v.includes(value);
        if(op==='contains')return Array.isArray(value)&&v.every(x=>value.includes(x));
        if(op==='ilike'){const escaped=String(v).replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/%/g,'.*').replace(/_/g,'.');return new RegExp(`^${escaped}$`,'i').test(String(value));}
        throw Error(`Unsupported mock operator ${op}`);
      }));
      if(this.sort)data.sort((a,b)=>(a[this.sort[0]]>b[this.sort[0]]?1:-1)*(this.sort[1].ascending?1:-1));
      if(this.bounds)data=data.slice(this.bounds[0],this.bounds[1]+1);
      if(options.defaultLimit)data=data.slice(0,options.defaultLimit);
      if(this.selectColumns!=='*'){const columns=this.selectColumns.split(',').map(x=>x.trim()).filter(Boolean);data=data.map(row=>Object.fromEntries(columns.map(k=>[k,row[k]??null])));}
      return Promise.resolve({data,error:null}).then(resolve,reject);
    }
  }
  return {client:{from:(table)=>new Query(table)},calls};
}

export async function queryAccommodations(params,tables,options={}) {
  const db=makeDatabase(tables,options);
  const load=loader({'@/utils/supabase/server':{createClient:async()=>db.client},'@/app/lib/camping-supabase':{getCampingSupabase:()=>db.client}});
  const {GET}=load(path.join(root,'app/api/accommodations/route.ts'));
  const response=await GET(new Request(`https://audit.invalid/api/accommodations?${params}`));
  return {status:response.status,body:await response.json(),calls:db.calls};
}

export function loadSearchModule(relativePath,globals={}){return loader({},globals)(path.join(root,relativePath));}
export function createSearchController(query,respond){
 let index=0;const values=[],calls=[];
 const initial={0:null,1:2,2:0,3:0,4:query,9:'2027-07-01',10:'2027-07-08'};
 const react={...nativeRequire('react'),useState(value){const i=index++;if(!(i in values))values[i]=Object.hasOwn(initial,i)?initial[i]:typeof value==='function'?value():value;return[values[i],next=>{values[i]=typeof next==='function'?next(values[i]):next;}];}};
 const load=loader({'react':react,'./components/AccommodationPage':{__esModule:true,default:()=>null}},{fetch:async(url,init)=>{calls.push(String(url));return respond(String(url),init);}});
 const Component=load(path.join(root,'app/SearchBox.tsx')).default;
 return {calls,render(){index=0;return Component().props;}};
}
export function createAiEndpoint(options={}){
 const calls=[];
 const database=makeDatabase(options.tables??{});
 class MockOpenAI {
  constructor(config){calls.push({kind:'client',config});}
  responses={create:async request=>{calls.push({kind:'response',request});if(options.error)throw new Error('Simulated provider error');return options.response??{status:'completed',output_text:JSON.stringify(options.criteria??{})};}};
 }
 const {POST}=loader({'openai':{__esModule:true,default:MockOpenAI},'@/utils/supabase/server':{createClient:async()=>database.client},'@/app/lib/camping-supabase':{getCampingSupabase:()=>database.client}},{process:{env:options.noKey?{}:{OPENAI_API_KEY:'test-only-placeholder'}}})(path.join(root,'app/api/search/route.ts'));
 return {POST,calls,databaseCalls:database.calls};
}

export async function inspectCoverage(){
 const seen=new Set();const inventory={};
 function visit(file){
  if(seen.has(file))return;seen.add(file);
  const source=ts.createSourceFile(file,fs.readFileSync(path.join(root,file),'utf8'),ts.ScriptTarget.Latest,true);
  function walk(node){
   if(ts.isCallExpression(node)&&ts.isPropertyAccessExpression(node.expression)&&['append','set'].includes(node.expression.name.text)){
    const [key,value]=node.arguments;
    if(key&&ts.isStringLiteral(key)){const entry=inventory[key.text]??={values:new Set(),files:new Set()};entry.files.add(file);if(value&&ts.isStringLiteral(value))entry.values.add(value.text);}
   }
   ts.forEachChild(node,walk);
  }walk(source);
 }
 visit('app/SearchBox.tsx');for(const file of fs.readdirSync(path.join(root,'app/lib/parsers')))if(file.endsWith('.ts'))visit('app/lib/parsers/'+file);
 return Object.fromEntries(Object.entries(inventory).map(([k,v])=>[k,{values:[...v.values],files:[...v.files]}]));
}
