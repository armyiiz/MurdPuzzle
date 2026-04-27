const fs = require('fs');
const path = require('path');
const csvParse = require('csv-parse/sync');

const normalizeString = (str) => {
  if (!str) return '';
  return str.replace(/\s*\(.*?\)\s*/g, '').trim();
};

const csvFiles = [
  'src/data/MurdPuzzle Data(LV1 1-50).csv',
  'src/data/MurdPuzzle Data(LV3 51-55).csv',
  'src/data/MurdPuzzle Data(LV3 56-75).csv',
  'src/data/MurdPuzzle Data(LV4 76-100).csv',
];

const parsedData = [];

csvFiles.forEach((file) => {
  const fileContent = fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');
  // We need to parse it line by line or handle the multiple tables in each CSV
  // Look at how the CSV is structured: there are sections like "👤 1. ผู้ต้องสงสัย (Suspects),,"
  // We can just parse the whole file assuming it's a simple CSV and extract anything that has an icon.

  const records = csvParse.parse(fileContent, {
    skip_empty_lines: true,
    relax_column_count: true,
  });

  // Since the CSV has different headers, we'll look for rows where one column has a fontawesome class (e.g., 'fa-')
  // Usually, the first column is the name and a later column is the icon. Let's find the header indices.
  let nameCol = -1;
  let iconCol = -1;

  records.forEach((row) => {
    // Detect headers
    const nameMatch = row.findIndex(c => c.includes('ชื่อ') && (c.includes('ไทย') || c.includes('ผู้ต้องสงสัย') || c.includes('อาวุธ') || c.includes('สถานที่')));
    const iconMatch = row.findIndex(c => c.includes('Font Awesome Pro Icon'));

    if (nameMatch !== -1 && iconMatch !== -1) {
      nameCol = nameMatch;
      iconCol = iconMatch;
    } else if (nameCol !== -1 && iconCol !== -1 && row[iconCol] && row[iconCol].includes('fa-')) {
      // It's a data row
      const name = row[nameCol];
      // Sometimes multiple names are joined by ' / ' e.g., 'โค้ช แรสเบอร์รี / คาวบอย แรสเบอร์รี'
      const names = name.split('/').map(n => n.trim());
      const icon = row[iconCol].trim();

      names.forEach(n => {
         parsedData.push({
           name: normalizeString(n),
           icon
         });
      });
    }
  });
});

// Remove duplicates, preferring the first encountered
const iconMap = new Map();
parsedData.forEach(item => {
  if (!iconMap.has(item.name)) {
    iconMap.set(item.name, item.icon);
  }
});

// Now read JSON
const jsonPath = path.resolve(__dirname, '../src/data/dailymasterdata.json');
const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const mapCategory = (items) => {
  items.forEach(item => {
    const normalizedName = normalizeString(item.name);
    let icon = iconMap.get(normalizedName);

    // If not found, try to find a partial match just in case, but fallback is preferred.
    if (!icon) {
      icon = "fa-solid fa-circle-question"; // Fallback
      console.log(`No icon found for: ${item.name} (normalized: ${normalizedName}), using fallback.`);
    }

    item.icon = icon;
  });
};

if (jsonData.suspects) mapCategory(jsonData.suspects);
if (jsonData.weapons) mapCategory(jsonData.weapons);
if (jsonData.locations) mapCategory(jsonData.locations);
if (jsonData.motives) {
  // Motives aren't in the CSVs, use a default fallback or map manually if needed
  // Based on the task, fallback is fine. Let's give motives a default icon like 'fa-solid fa-comment-dots' or fallback
  jsonData.motives.forEach(item => {
    item.icon = "fa-solid fa-comment-dots"; // A better default for motives, or just the fallback. Let's use fallback as requested.
  });
}

fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), 'utf8');
console.log('Successfully updated dailymasterdata.json with icons.');
