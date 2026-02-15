const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../src/app/features/breeding/pomet-detail/pomet-detail.component.html');
const outDataPath = path.join(__dirname, '../src/app/features/breeding/data/puppies-by-letter.ts');
const html = fs.readFileSync(htmlPath, 'utf8');

/** Find matching closing </div> for <div class="pappy"> at start index */
function findPappyBlockEnd(html, start) {
  let depth = 0;
  let i = start;
  while (i < html.length) {
    const openMatch = html.substring(i).match(/^<div[^>]*>/);
    const closeMatch = html.substring(i).match(/^<\/div>/);
    if (openMatch) {
      depth++;
      i += openMatch[0].length;
    } else if (closeMatch) {
      depth--;
      i += closeMatch[0].length;
      if (depth === 0) return i;
    } else {
      i++;
    }
  }
  return -1;
}

function extractPappyBlock(blockHtml) {
  const titleMatch = blockHtml.match(/table_pappy-p">([^<]*)<\/p>/);
  const title = titleMatch ? titleMatch[1].trim() : '';
  const srcRegex = /<img[^>]+src="([^"]+)"/g;
  const photoUrls = [];
  let m;
  while ((m = srcRegex.exec(blockHtml)) !== null) {
    photoUrls.push(m[1]);
  }
  const altMatch = blockHtml.match(/<img[^>]+alt="([^"]*)"/);
  const altText = altMatch ? altMatch[1] : '';
  const ownerMatch = blockHtml.match(/pappy-info-p">([^<]*)<\/p>/);
  const ownerInfo = ownerMatch ? ownerMatch[1].trim() : '';
  return { title, photoUrls, altText, ownerInfo };
}

// Split by @case ('X') {
const caseRegex = /@case\s*\(\s*'([A-Z])'\s*\)\s*\{\s*/g;
const puppiesByLetter = {};
let lastIndex = 0;
let caseMatch;
const caseStarts = [];
const caseLetters = [];
while ((caseMatch = caseRegex.exec(html)) !== null) {
  caseStarts.push(caseMatch.index);
  caseLetters.push(caseMatch[1]);
  lastIndex = caseMatch.index + caseMatch[0].length;
}

// For each case, find content until next @case or end of switch
let newHtml = html;
const replacements = []; // { letter, start, end, puppies, caseContentStart, caseContentEnd }

for (let c = 0; c < caseLetters.length; c++) {
  const letter = caseLetters[c];
  const caseStart = caseStarts[c] + (html.substring(caseStarts[c]).match(/@case\s*\(\s*'[A-Z]'\s*\)\s*\{\s*/)[0].length);
  const nextCaseStart = c + 1 < caseStarts.length ? caseStarts[c + 1] : html.length;
  let caseContent = html.substring(caseStart, nextCaseStart);
  const contentStartInFull = caseStart;
  const contentEndInFull = nextCaseStart;

  const puppies = [];
  let searchStart = 0;
  let pappyStart = caseContent.indexOf('<div class="pappy">');
  const blockOffsets = [];
  while (pappyStart !== -1) {
    const absStart = contentStartInFull + pappyStart;
    const blockEnd = findPappyBlockEnd(html, absStart);
    if (blockEnd === -1) break;
    const blockHtml = html.substring(absStart, blockEnd);
    const data = extractPappyBlock(blockHtml);
    puppies.push(data);
    blockOffsets.push({ start: absStart, end: blockEnd });
    const relEnd = blockEnd - contentStartInFull;
    pappyStart = caseContent.indexOf('<div class="pappy">', relEnd);
  }
  if (puppies.length > 0) {
    puppiesByLetter[letter] = puppies;
    replacements.push({ letter, blockOffsets, puppies });
  }
}

// Build new HTML: replace each pappy block with placeholder, then replace placeholders with @for
// We'll do reverse order so indices don't shift
replacements.reverse().forEach(({ letter, blockOffsets, puppies }) => {
  // Replace blocks from last to first with placeholder
  blockOffsets.reverse().forEach(({ start, end }) => {
    const before = newHtml.substring(0, start);
    const after = newHtml.substring(end);
    newHtml = before + '\n          <!--PUPPY_PLACEHOLDER_' + letter + '-->\n          ' + after;
  });
});

// Now replace <!--PUPPY_PLACEHOLDER_X--> (repeated) with @for
Object.keys(puppiesByLetter).forEach((letter) => {
  const placeholder = '\n          <!--PUPPY_PLACEHOLDER_' + letter + '-->\n          ';
  const forBlock = `@for (p of puppiesByLetter['${letter}']; track p.title) {
            <app-puppy-card [puppy]="p" />
          }`;
  const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\n\s*/g, '\\s*'));
  let count = puppiesByLetter[letter].length;
  let search = newHtml;
  let idx = search.indexOf('<!--PUPPY_PLACEHOLDER_' + letter + '-->');
  if (idx === -1) return;
  let firstIdx = idx;
  let lastIdx = idx;
  for (let i = 0; i < count - 1; i++) {
    const next = search.indexOf('<!--PUPPY_PLACEHOLDER_' + letter + '-->', lastIdx + 1);
    if (next === -1) break;
    lastIdx = next;
  }
  const before = newHtml.substring(0, firstIdx);
  const after = newHtml.substring(lastIdx + ('<!--PUPPY_PLACEHOLDER_' + letter + '-->').length);
  const middle = forBlock;
  newHtml = before + middle + after;
  // Remove remaining placeholders for this letter
  const restPlaceholder = new RegExp('\\s*<!--PUPPY_PLACEHOLDER_' + letter + '-->\\s*', 'g');
  newHtml = newHtml.replace(restPlaceholder, '');
});

// Generate TS data file
const json = JSON.stringify(puppiesByLetter, null, 2);
const tsContentFixed = `import { PuppyCardData } from '../models/puppy-card-data';

/** Данные по щенкам по буквам литер (для раздела «Наше разведение»). */
export const puppiesByLetter: Record<string, PuppyCardData[]> = ${json
  .replace(/^  "([A-Z])":/gm, "  '$1':")
  .replace(/,\s*(\n\s*[}\]])/g, '$1')};
`;

fs.mkdirSync(path.dirname(outDataPath), { recursive: true });
fs.writeFileSync(outDataPath, tsContentFixed);
fs.writeFileSync(htmlPath, newHtml);
console.log('Done. Extracted', Object.keys(puppiesByLetter).length, 'letters, total puppies:', Object.values(puppiesByLetter).reduce((s, arr) => s + arr.length, 0));
