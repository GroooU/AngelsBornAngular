const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../src/app/features/breeding/pomet-detail/pomet-detail.component.html');
const outPath = path.join(__dirname, '../src/app/features/breeding/data/litter-headers-by-letter.ts');
const html = fs.readFileSync(htmlPath, 'utf8');

const caseRegex = /@case\s*\(\s*'([A-Z])'\s*\)\s*\{\s*/g;
const cases = [];
let m;
while ((m = caseRegex.exec(html)) !== null) {
  cases.push({ letter: m[1], start: m.index + m[0].length });
}

const results = {};
for (let i = 0; i < cases.length; i++) {
  const letter = cases[i].letter;
  const chunkStart = cases[i].start;
  const chunkEnd = i + 1 < cases.length ? cases[i + 1].start - 20 : html.length;
  let chunk = html.substring(chunkStart, chunkEnd);
  const forMatch = chunk.match(/@for\s*\(p of puppiesByLetter/);
  if (forMatch) chunk = chunk.substring(0, forMatch.index);
  chunk = chunk.replace(/\s+/g, ' ').trim();

  const introMatch = chunk.match(/parents_info"><p>([^<]*)<\/p>/);
  const introText = introMatch ? introMatch[1].trim() : '';

  const parentsName = [];
  const greenMatch = chunk.match(/parents_name[^>]*>[\s\S]*?<span class="text-green">([^<]*)<\/span>/);
  if (greenMatch) {
    parentsName.push({ text: greenMatch[1].trim(), isLink: false });
    parentsName.push({ text: ' & ', isLink: false });
  }
  const linkMatch = chunk.match(/<a routerLink="([^"]*)"><span class="text-green_a">([^<]*)<\/span><\/a>/);
  if (linkMatch) {
    parentsName.push({ text: linkMatch[2].replace(/<[^>]+>/g, '').trim(), routerLink: linkMatch[1], isLink: true });
  } else if (greenMatch && !chunk.includes('routerLink')) {
    const secondGreen = chunk.match(/text-green_a">([^<]*)<\/span>/);
    if (secondGreen) parentsName.push({ text: secondGreen[1].trim(), isLink: false });
  }

  const hasTwoColumns = /table__box-father/.test(chunk) && /table__box-mother/.test(chunk);
  const hasTableBox = /table_box/.test(chunk);
  const hasPublicImg = /public-img/.test(chunk);
  const hasPuppyPhotos = /puppy-photos/.test(chunk);

  let variant = 'parents-only';
  let mainImage = null;
  let mainImageTitle = null;
  let mainImageFatherTitle = null;
  let mainImageMotherTitle = null;
  let mainImageMotherLink = null;
  let father = null;
  let mother = null;
  let publicImages = null;

  if (hasTwoColumns) {
    variant = 'two-columns';
    const ptitles = chunk.match(/<p class="p_titles">([^<]*)<\/p>/g);
    const allTitles = (ptitles || []).map(x => x.replace(/<[^>]+>/g, '').trim()).filter(Boolean);
    const motherStart = chunk.indexOf('table__box-mother');
    const fatherChunk = motherStart > 0 ? chunk.slice(0, motherStart) : chunk;
    const motherChunk = motherStart > 0 ? chunk.slice(motherStart) : '';
    const fatherTitles = (fatherChunk.match(/<p class="p_titles">([^<]*)<\/p>/g) || []).map(x => x.replace(/<[^>]+>/g, '').trim()).filter(Boolean);
    const motherTitles = (motherChunk.match(/<p class="p_titles">([^<]*)<\/p>/g) || []).map(x => x.replace(/<[^>]+>/g, '').trim()).filter(Boolean);
    const fatherTitleMatch = fatherChunk.match(/table-p">([^<]+)</);
    const motherTitleMatch = motherChunk.match(/table-p">(?:<a[^>]*>)?([^<]+)</);
    const motherLinkMatch = motherChunk.match(/routerLink="([^"]*)"/);
    const fImgUrls = (chunk.match(/assets\/images\/nashe-razvedenie\/pomet-[a-z]\/Father\/[^"'\s]+/g) || []).map(s => s.replace(/&amp;/g, '&'));
    const mImgUrls = (chunk.match(/assets\/images\/nashe-razvedenie\/pomet-[a-z]\/Mother\/[^"'\s]+/g) || []).map(s => s.replace(/&amp;/g, '&'));
    father = {
      title: fatherTitleMatch ? fatherTitleMatch[1].trim() : 'ОТЕЦ',
      photoUrls: [...new Set(fImgUrls)],
      titles: fatherTitles
    };
    mother = {
      title: motherTitleMatch ? motherTitleMatch[1].trim() : 'МАТЬ',
      titleRouterLink: motherLinkMatch ? motherLinkMatch[1] : undefined,
      photoUrls: [...new Set(mImgUrls)],
      titles: motherTitles
    };
  } else if (hasTableBox) {
    variant = 'single-image';
    const imgMatch = chunk.match(/<img src="(assets\/images\/nashe-razvedenie\/pomet-[^"]+)" alt="([^"]*)"/);
    if (imgMatch) {
      mainImage = { src: imgMatch[1], alt: imgMatch[2].replace(/&amp;/g, '&') };
    }
    const titlePappy = chunk.match(/table_pappy-p">([^<]+)</);
    if (titlePappy) mainImageTitle = titlePappy[1].trim();
    const titleFather = chunk.match(/title_father[\s\S]*?table-p">([^<]+)</);
    const titleMother = chunk.match(/title_mother[\s\S]*?(?:routerLink="([^"]*)")?[^>]*>([^<]+)</);
    if (titleFather) mainImageFatherTitle = titleFather[1].trim();
    if (titleMother) {
      mainImageMotherTitle = titleMother[2].trim();
      mainImageMotherLink = titleMother[1] || undefined;
    }
    if (hasPublicImg) {
      const pubImgs = chunk.match(/assets\/images\/nashe-razvedenie\/pomet-[a-z]\/dogs\/[^"'\s]+\.(?:jpg|jpeg|png|JPG)/gi) || chunk.match(/assets\/images\/nashe-razvedenie\/pomet-[a-z]\/[^"'\s]+\.(?:jpg|jpeg|png|JPG)/g);
      const pubTitle = chunk.match(/public-img[\s\S]*?table_pappy-p">([^<]+)</);
      publicImages = {
        title: pubTitle ? pubTitle[1].trim() : undefined,
        photoUrls: pubImgs ? [...new Set(pubImgs)] : [],
        altText: introText ? introText.slice(0, 50) : 'Помёт'
      };
    }
  } else if (hasPublicImg && hasPuppyPhotos) {
    variant = 'public-photos-only';
    const pubImgs = chunk.match(/assets\/images\/nashe-razvedenie\/pomet-[a-z]\/[^"'\s]+\.(?:jpg|jpeg|png|JPG)/gi) || [];
    const pubTitle = chunk.match(/table_pappy-p">([^<]+)</);
    publicImages = {
      title: pubTitle ? pubTitle[1].trim() : undefined,
      photoUrls: [...new Set(pubImgs)],
      altText: 'Помёт'
    };
  }

  if (parentsName.length === 0 && introText) {
    parentsName.push({ text: introText.slice(0, 30), isLink: false });
  }
  if (parentsName.length === 0) parentsName.push({ text: '', isLink: false });

  results[letter] = {
    introText,
    parentsName,
    variant,
    mainImage: mainImage || undefined,
    mainImageTitle: mainImageTitle || undefined,
    mainImageFatherTitle: mainImageFatherTitle || undefined,
    mainImageMotherTitle: mainImageMotherTitle || undefined,
    mainImageMotherLink: mainImageMotherLink || undefined,
    father: father || undefined,
    mother: mother || undefined,
    publicImages: publicImages || undefined
  };
}

function escape(s) {
  return (s || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}
function tsVal(v) {
  if (v === undefined || v === null) return 'undefined';
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (typeof v === 'number') return String(v);
  if (Array.isArray(v)) {
    return '[' + v.map(tsVal).join(', ') + ']';
  }
  if (typeof v === 'object') {
    const entries = Object.entries(v).filter(([, val]) => val !== undefined && val !== null);
    return '{ ' + entries.map(([k, val]) => k + ': ' + tsVal(val)).join(', ') + ' }';
  }
  return "'" + escape(String(v)) + "'";
}

let out = `import { LitterHeaderData } from '../models/litter-header-data';

export const litterHeaderByLetter: Record<string, LitterHeaderData> = {\n`;
for (const letter of Object.keys(results).sort()) {
  const r = results[letter];
  out += `  '${letter}': {\n`;
  out += `    introText: ${tsVal(r.introText)},\n`;
  out += `    parentsName: ${tsVal(r.parentsName)},\n`;
  out += `    variant: '${r.variant}',\n`;
  if (r.mainImage) out += `    mainImage: { src: ${tsVal(r.mainImage.src)}, alt: ${tsVal(r.mainImage.alt)} },\n`;
  if (r.mainImageTitle) out += `    mainImageTitle: ${tsVal(r.mainImageTitle)},\n`;
  if (r.mainImageFatherTitle) out += `    mainImageFatherTitle: ${tsVal(r.mainImageFatherTitle)},\n`;
  if (r.mainImageMotherTitle) out += `    mainImageMotherTitle: ${tsVal(r.mainImageMotherTitle)},\n`;
  if (r.mainImageMotherLink) out += `    mainImageMotherLink: ${tsVal(r.mainImageMotherLink)},\n`;
  if (r.father) out += `    father: ${JSON.stringify(r.father).replace(/"([^"]+)":/g, '$1:')},\n`;
  if (r.mother) out += `    mother: ${JSON.stringify(r.mother).replace(/"([^"]+)":/g, '$1:')},\n`;
  if (r.publicImages) out += `    publicImages: ${JSON.stringify(r.publicImages).replace(/"([^"]+)":/g, '$1:')},\n`;
  out += `  },\n`;
}
out += '};\n';

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, out);
console.log('Done. Letters:', Object.keys(results).length);
