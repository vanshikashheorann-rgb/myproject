const fs = require('fs');
const vm = require('vm');

const signLibCode = fs.readFileSync('js/sign-library.js', 'utf8');
const sandbox = { window: {}, console };
vm.createContext(sandbox);
vm.runInContext(signLibCode, sandbox);

console.log('--- Test 1: English Question Translation ---');
const res1 = sandbox.window.translateToISL('Where is the hospital?');
console.log('Input: "Where is the hospital?"');
console.log('Signs:', res1.signs.map(s => s.id));
console.log('Grammar Summary:', res1.grammarSummary);

console.log('\n--- Test 2: Hindi Phrase Translation ---');
const res2 = sandbox.window.translateToISL('नमस्ते आप कैसे हैं?');
console.log('Input: "नमस्ते आप कैसे हैं?"');
console.log('Signs:', res2.signs.map(s => s.id));
console.log('Grammar Summary:', res2.grammarSummary);

console.log('\n--- Test 3: Unknown Word Fingerspelling Fallback ---');
const res3 = sandbox.window.translateToISL('Ajay');
console.log('Input: "Ajay"');
console.log('Signs:', res3.signs.map(s => s.id));
console.log('Grammar Summary:', res3.grammarSummary);

console.log('\n--- Test 4: Emergency Assistance ---');
const res4 = sandbox.window.translateToISL('I need doctor emergency');
console.log('Input: "I need doctor emergency"');
console.log('Signs:', res4.signs.map(s => s.id));
console.log('Grammar Summary:', res4.grammarSummary);
