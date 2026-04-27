const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data/dailymasterdata.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(rawData);

// Keyword to icon mapping. The script will try to find keywords in names and lore.
const keywordIconMap = {
  // Suspects / Professions
  "กัปตัน": "fa-solid fa-user-astronaut",
  "แกรนด์มาสเตอร์": "fa-solid fa-chess",
  "คณบดี": "fa-solid fa-user-graduate",
  "คริปโตซูโอโลจิสต์": "fa-solid fa-paw",
  "ครูใหญ่": "fa-solid fa-chalkboard-user",
  "คาวบอย": "fa-solid fa-hat-cowboy",
  "โค้ช": "fa-solid fa-whistle",
  "จอมเทพ": "fa-solid fa-bolt",
  "เจ้าหน้าที่": "fa-solid fa-user-police",
  "เชฟ": "fa-solid fa-hat-chef",
  "ซิสเตอร์": "fa-solid fa-cross",
  "ดร.": "fa-solid fa-user-doctor",
  "ทนาย": "fa-solid fa-scale-balanced",
  "เทพธิดา": "fa-solid fa-star",
  "นักปรัชญา": "fa-solid fa-brain",
  "นักภาษาศาสตร์": "fa-solid fa-language",
  "นักเลขศาสตร์": "fa-solid fa-calculator",
  "นักสมุนไพร": "fa-solid fa-leaf",
  "นักสังคมวิทยา": "fa-solid fa-users",
  "นักสืบ": "fa-solid fa-user-secret",
  "นักโหราศาสตร์": "fa-solid fa-moon",
  "นายกเทศมนตรี": "fa-solid fa-building-columns",
  "นายพล": "fa-solid fa-medal",
  "บรรณาธิการ": "fa-solid fa-pen-nib",
  "ประธาน": "fa-solid fa-user-tie",
  "ประธานาธิบดี": "fa-solid fa-flag",
  "ผู้กำกับ": "fa-solid fa-clapperboard",
  "ผู้ช่วย": "fa-solid fa-user-pen",
  "ผู้พิพากษา": "fa-solid fa-gavel",
  "ผู้อำนวยการ": "fa-solid fa-briefcase",
  "พลเรือเอก": "fa-solid fa-anchor",
  "มนุษย์อวกาศ": "fa-solid fa-rocket",
  "สารวัตร": "fa-solid fa-magnifying-glass",
  "เอเจนท์": "fa-solid fa-id-badge",
  "เคราดำ": "fa-solid fa-skull-crossbones",
  "เคราน้ำเงิน": "fa-solid fa-skull-crossbones",
  "ดาราดัง": "fa-solid fa-star",
  "ดิ อะเมซิ่ง": "fa-solid fa-wand-magic-sparkles",
  "เดม": "fa-solid fa-crown",
  "ตัวประกอบ": "fa-solid fa-masks-theater",
  "บอส": "fa-solid fa-user-ninja",
  "โจรสลัด": "fa-solid fa-skull-crossbones",
  "นักบวช": "fa-solid fa-place-of-worship",
  "มาเฟีย": "fa-solid fa-gun",

  // Weapons
  "กรรไกร": "fa-solid fa-scissors",
  "กระดานผีถ้วยแก้ว": "fa-solid fa-ghost",
  "กระดาษ": "fa-solid fa-file-lines",
  "กระดูก": "fa-solid fa-bone",
  "กระต่าย": "fa-solid fa-rabbit",
  "กระถาง": "fa-solid fa-seedling",
  "กระบอง": "fa-solid fa-gavel",
  "กระบองเพชร": "fa-solid fa-tree",
  "กระเป๋า": "fa-solid fa-suitcase",
  "กริช": "fa-solid fa-dagger",
  "กล้อง": "fa-solid fa-microscope",
  "กองหนังสือ": "fa-solid fa-book",
  "ก้อนหิน": "fa-solid fa-hill-rockslide",
  "กะโหลก": "fa-solid fa-skull",
  "กับดัก": "fa-solid fa-trap",
  "กุญแจมือ": "fa-solid fa-handcuffs",
  "กุหลาบ": "fa-solid fa-rose",
  "ขนม": "fa-solid fa-candy-cane",
  "ขวด": "fa-solid fa-bottle-droplet",
  "ขวาน": "fa-solid fa-axe",
  "ของประดับ": "fa-solid fa-image",
  "ขาตั้งไฟ": "fa-solid fa-lightbulb",
  "เข็ม": "fa-solid fa-syringe",
  "แขนโครงกระดูก": "fa-solid fa-bone",
  "คทา": "fa-solid fa-wand-magic",
  "คบเพลิง": "fa-solid fa-fire",
  "ค้อน": "fa-solid fa-hammer",
  "คอมพิวเตอร์": "fa-solid fa-computer",
  "เครื่อง": "fa-solid fa-microchip",
  "จอก": "fa-solid fa-wine-glass",
  "จาน": "fa-solid fa-plate-wheat",
  "แจกัน": "fa-solid fa-vase",
  "ฉมวก": "fa-solid fa-anchor",
  "ช็อกโกแลต": "fa-solid fa-mug-hot",
  "ช้อน": "fa-solid fa-spoon",
  "ชะแลง": "fa-solid fa-crowbar",
  "ชุดดีวีดี": "fa-solid fa-compact-disc",
  "เชือก": "fa-solid fa-ring",
  "เซกซ์แทนท์": "fa-solid fa-compass",
  "ดาบ": "fa-solid fa-sword",
  "ดินสอ": "fa-solid fa-pencil",
  "ตราประทับ": "fa-solid fa-stamp",
  "ตะเกียบ": "fa-solid fa-utensils",
  "ตาชั่ง": "fa-solid fa-scale-balanced",
  "ตำรา": "fa-solid fa-book-open",
  "เตา": "fa-solid fa-fire-burner",
  "ตุ๊กตา": "fa-solid fa-child-reaching",
  "ตู้เซฟ": "fa-solid fa-vault",
  "ทอง": "fa-solid fa-coins",
  "ธนู": "fa-solid fa-bow-arrow",
  "ปืน": "fa-solid fa-gun",
  "มีด": "fa-solid fa-knife",
  "ระเบิด": "fa-solid fa-bomb",
  "ยาพิษ": "fa-solid fa-flask-vial",

  // Locations
  "ประภาคาร": "fa-solid fa-lighthouse",
  "ถ้ำ": "fa-solid fa-dungeon",
  "ภูเขาไฟ": "fa-solid fa-volcano",
  "ป่า": "fa-solid fa-tree",
  "ป้าย": "fa-solid fa-sign-hanging",
  "เวที": "fa-solid fa-masks-theater",
  "สตูดิโอ": "fa-solid fa-video",
  "โกดัง": "fa-solid fa-warehouse",
  "แม่น้ำ": "fa-solid fa-water",
  "ยาน": "fa-solid fa-rocket",
  "รถ": "fa-solid fa-car",
  "ระเบียง": "fa-solid fa-archway",
  "ร้าน": "fa-solid fa-shop",
  "โรงแรม": "fa-solid fa-hotel",
  "โรงงาน": "fa-solid fa-industry",
  "โรงพยาบาล": "fa-solid fa-hospital",
  "โรงหนัง": "fa-solid fa-film",
  "เรือ": "fa-solid fa-ship",
  "สนาม": "fa-solid fa-golf-ball-tee",
  "สวน": "fa-solid fa-leaf",
  "สุสาน": "fa-solid fa-tombstone",
  "หอคอย": "fa-solid fa-tower-observation",
  "ห้อง": "fa-solid fa-door-open",
  "ห้องครัว": "fa-solid fa-kitchen-set",
  "ห้องน้ำ": "fa-solid fa-restroom",
  "ห้องนอน": "fa-solid fa-bed",
  "ห้องทำงาน": "fa-solid fa-briefcase",
  "ออฟฟิศ": "fa-solid fa-briefcase",
  "คฤหาสน์": "fa-solid fa-house-chimney",
  "บ้าน": "fa-solid fa-house",
  "ปราสาท": "fa-solid fa-chess-rook",
  "โบสถ์": "fa-solid fa-church",
  "มหาวิทยาลัย": "fa-solid fa-graduation-cap",

  // Motives
  "อสังหาริมทรัพย์": "fa-solid fa-building",
  "มึนเมา": "fa-solid fa-beer-mug-empty",
  "อวกาศ": "fa-solid fa-user-astronaut",
  "เลือด": "fa-solid fa-droplet",
  "หึงหวง": "fa-solid fa-heart-crack",
  "ศาสนา": "fa-solid fa-hands-praying",
  "ลัทธิ": "fa-solid fa-users",
  "บ้าคลั่ง": "fa-solid fa-face-dizzy",
  "หงุดหงิด": "fa-solid fa-face-angry",
  "วงการ": "fa-solid fa-film",
  "วิทยาศาสตร์": "fa-solid fa-flask",
  "ผี": "fa-solid fa-ghost",
  "เงิน": "fa-solid fa-sack-dollar",
  "รางวัล": "fa-solid fa-trophy",
  "บทภาพยนตร์": "fa-solid fa-scroll",
  "สงคราม": "fa-solid fa-jet-fighter",
  "ชู้สาว": "fa-solid fa-heart-crack",
  "แบล็กเมล์": "fa-solid fa-envelope",
  "แก้แค้น": "fa-solid fa-hand-fist",
  "ความลับ": "fa-solid fa-user-secret",
  "ขโมย": "fa-solid fa-mask",
  "ศิลปะ": "fa-solid fa-palette"
};

const assignIcon = (item, type) => {
  let matchedIcon = null;
  const searchString = (item.name + " " + (item.lore || item.detail || "")).toLowerCase();

  for (const [keyword, icon] of Object.entries(keywordIconMap)) {
    if (searchString.includes(keyword)) {
      matchedIcon = icon;
      break;
    }
  }

  // Fallbacks by type
  if (!matchedIcon) {
    if (type === 'suspects') matchedIcon = 'fa-solid fa-user';
    else if (type === 'weapons') matchedIcon = 'fa-solid fa-gun';
    else if (type === 'locations') matchedIcon = 'fa-solid fa-house';
    else if (type === 'motives') matchedIcon = 'fa-solid fa-comment-dots';
    else matchedIcon = 'fa-solid fa-circle-question';
  }

  item.icon = matchedIcon;
};

let updatedCount = 0;

['suspects', 'weapons', 'locations', 'motives'].forEach(type => {
  if (data[type]) {
    data[type].forEach(item => {
      assignIcon(item, type);
      updatedCount++;
    });
  }
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');

console.log(`Updated ${updatedCount} items with FA icons in ${dataPath}`);
