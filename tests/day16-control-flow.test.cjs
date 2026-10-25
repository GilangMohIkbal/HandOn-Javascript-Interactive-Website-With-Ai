// Node built-in tests: no extra npm dependency for Day 16.
// Simulated DOM for product-interaction.js; browser E2E still needed on local machine.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const script = fs.readFileSync(path.resolve(__dirname, '../project-AI/product-interaction.js'), 'utf8');

function makeElement(extra = {}) {
  return {
    dataset: {}, value: '', textContent: '', hidden: false,
    children: [], listeners: {}, options: [],
    addEventListener(name, fn) { this.listeners[name] = fn; },
    replaceChildren(...items) { this.children = items; },
    appendChild(child) { this.children.push(child); },
    ...extra,
  };
}

function launch({ source = 'demo', variant = 'S', quantity = '2', price = '150000', stock = '3', variants = ['Merah','Biru'], mode = 'for' } = {}) {
  const elements = {
    '#productForm': makeElement(),
    '#productPrice': makeElement({dataset: {price, stockSource: source, stock}}),
    '#variant': makeElement({value: variant, options: variants.map(value=>({value,disabled:false}))}),
    '#quantity': makeElement({value: quantity}),
    '#selectionSummary': makeElement(),
    '#unitList': makeElement(),
    '#selectionFeedback': makeElement(),
    '#subtotalText': makeElement(),
    '#checkoutBar': makeElement({hidden: true}),
    '#checkoutButton': makeElement(),
  };
  const document = { querySelector(s) {if(!elements[s]) throw Error('Unexpected selector: '+s); return elements[s];}, createElement() {return makeElement();} };
  const window = { location: {search: mode==='while'?'?loop=while':''}, alert() {} };
  vm.runInNewContext(script,{document,window,URLSearchParams,Number,Array}, {filename:'product-interaction.js'});
  function submit(){ elements['#productForm'].listeners.submit({preventDefault(){}}); }
  function summary(){return elements['#selectionSummary'].textContent;}
  function error(){return elements['#selectionFeedback'].textContent;}
  function units(){return elements['#unitList'].children.map(item=>item.textContent);}
  function visible(){return !elements['#checkoutBar'].hidden;}
  return {elements,submit,summary,error,units,visible};
}

test('Product 1: S quantity 2 -> 300000 and 2 units', () => {
  const app=launch(); app.submit();
  assert.match(app.summary(),/300\.000/); assert.equal(app.units().length,2); assert.equal(app.visible(),true);
});
test('Product 1: M quantity 3 at stock boundary', () => {
  const app=launch({variant:'M',quantity:'3'}); app.submit();
  assert.match(app.summary(),/450\.000/); assert.equal(app.units().length,3);
});
test('Product 1: M quantity 4 exceeds stock', () => {
  const app=launch({variant:'M',quantity:'4'}); app.submit();
  assert.equal(app.error(),'Jumlah melebihi stok varian.'); assert.deepEqual(app.units(),[]); assert.equal(app.visible(),false);
});
test('Product 1: L stock zero', () => {
  const app=launch({variant:'L',quantity:'1'}); app.submit();
  assert.equal(app.error(),'Varian sedang habis.');assert.equal(app.visible(),false);
});
for (const invalid of ['0','-1','1.5']) {
 test('Product 1: invalid quantity '+invalid,()=>{
   const app=launch({quantity:invalid});app.submit();assert.equal(app.error(),'Jumlah harus bilangan bulat positif.');assert.equal(app.units().length,0);
 });
}
test('Unknown variant is rejected',()=>{
 const app=launch({variant:'XL'});app.submit();assert.equal(app.error(),'Varian tidak valid.');
});
test('Failure clears last valid subtotal and old units',()=>{
 const app=launch();app.submit();assert.equal(app.units().length,2);
 app.elements['#quantity'].value='0';app.submit();assert.equal(app.units().length,0);assert.equal(app.elements['#subtotalText'].textContent,'');assert.equal(app.visible(),false);
});
test('For and while generate identical units',()=>{
 const forApp=launch({variant:'M',quantity:'3'});const whileApp=launch({variant:'M',quantity:'3',mode:'while'});
 forApp.submit();whileApp.submit();assert.deepEqual(forApp.units(),whileApp.units());
});
test('API variants are dynamic and use total stock, not mock S/M/L stock',()=>{
 const app=launch({source:'api',variant:'Merah',quantity:'4',price:'450000',stock:'5'});app.submit();
 assert.match(app.summary(),/1\.800\.000/);assert.equal(app.units().length,4);
});
test('API unknown variant rejected even if not empty',()=>{
 const app=launch({source:'api',variant:'Ungu',quantity:'1',stock:'5'});app.submit();assert.equal(app.error(),'Varian tidak valid.');
});
test('API stock zero and API overflow',()=>{
 const sold=launch({source:'api',variant:'Biru',quantity:'1',stock:'0'}); sold.submit();assert.equal(sold.error(),'Varian sedang habis.');
 const over=launch({source:'api',variant:'Biru',quantity:'6',stock:'5'});over.submit();assert.equal(over.error(),'Jumlah melebihi stok varian.');
});
test('Invalid API price cannot be used',()=>{
 const app=launch({source:'api',variant:'Merah',quantity:'2',price:'',stock:'5'});app.submit();assert.equal(app.error(),'Harga product belum tersedia.');
});
