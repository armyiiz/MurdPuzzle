const fs = require('fs');
const path = require('path');

// ชี้เป้าไปที่ไฟล์ dailymasterdata.json
const dataPath = path.join(__dirname, 'src', 'data', 'dailymasterdata.json');
let masterData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// 💡 พจนานุกรมไอคอนฉบับอลิซ (อัปเกรดใหม่ ครอบคลุม 100%)
const iconDictionary = {
  // --- 1. กลุ่มพังเงียบ (เปลี่ยนไปใช้ไอคอนที่รันขึ้นชัวร์) ---
  "หลวงพ่อ แมงโก้": "fa-solid fa-cross",
  "นายพล คอฟฟี่": "fa-solid fa-star",
  "เอเจนท์ อาร์ไกล์": "fa-solid fa-user-secret",
  "ประธาน มิดไนท์": "fa-solid fa-crown",

  // --- 2. กลุ่มสถานที่แบ่งพาร์ทิชัน ---
  "ลานจอดรถ A": "fa-solid fa-a",
  "ลานจอดรถ B": "fa-solid fa-b",
  "บังกะโล 1": "fa-solid fa-1",
  "บังกะโล 2": "fa-solid fa-2",
  "บังกะโล 3": "fa-solid fa-3",
  "บังกะโล 4": "fa-solid fa-4",

  // --- 3. จัดการตัวสำรองที่เหลือ ---
  // ผู้ต้องสงสัย
  "นายกเทศมนตรี ฮันนี่": "fa-solid fa-user-tie",
  "เลดี้ ไวโอเล็ต": "fa-solid fa-user-crown",
  "ดยุคแห่งเวอร์มิลเลียน": "fa-solid fa-user-tie",
  "มิสเตอร์ แชโดว์": "fa-solid fa-user-ninja",
  "มิสเตอร์ออร์ดินารี่ บลูสกาย": "fa-solid fa-user",
  "คณบดี กลอคัส": "fa-solid fa-user-graduate",
  "เบบี้เฟซ บลู": "fa-solid fa-baby",
  "เทพธิดาคริสตัล": "fa-solid fa-gem",
  "จอมเทพโคบอลต์": "fa-solid fa-user-crown",
  "ดร. ซีเชลล์": "fa-solid fa-user-doctor",
  "ดาราดัง อะบาลอน": "fa-solid fa-star",
  "มิดไนท์ วัยทีน": "fa-solid fa-user",
  
  // อาวุธ
  "หนังสือเล่มหนา": "fa-solid fa-book",
  "เทียนไขผสมยาพิษ": "fa-solid fa-candle-holder",
  "ใบปริญญาจากวิทยาลัยสืบสวน": "fa-solid fa-scroll",
  "รูปปั้นครึ่งตัวหินอ่อน": "fa-solid fa-monument",
  "ขวดหมึกผสมยาพิษ": "fa-solid fa-bottle-droplet",
  "ทนายความค่าตัวสองแสนห้าหมื่นดอลลาร์": "fa-solid fa-scale-balanced",
  "เชือกที่ทำจากเสื้อผ้าแบรนด์เนม": "fa-solid fa-shirt",
  "ที่เปิดจดหมาย": "fa-solid fa-envelope-open-text",
  "ตราประทับ": "fa-solid fa-stamp",
  "พัสดุหนัก": "fa-solid fa-box",
  "พลั่ว": "fa-solid fa-trowel",
  "กริชต้องคำสาป": "fa-solid fa-dagger",
  "หม้อต้มยา": "fa-solid fa-flask",
  "ท่อนไม้": "fa-solid fa-tree",
  "ไม้กวาด": "fa-solid fa-broom",
  "ขวดยาพิษร้ายแรง": "fa-solid fa-flask-poison",
  "มีดทาเนย": "fa-solid fa-knife",
  "หม้อต้มเดือด": "fa-solid fa-pot-food",
  "สูจิบัตรอาบยาพิษ": "fa-solid fa-scroll",
  "ปลาปักเป้าพิษ": "fa-solid fa-fish",
  "พวงมาลัยเรือ": "fa-solid fa-dharmachakra",
  "ปลาปักเป้าเน่าพิษ": "fa-solid fa-fish-bones",
  "วัตถุมงคล": "fa-solid fa-ankh",
  "หม้อต้มขนาดใหญ่": "fa-solid fa-cauldron",
  "เครื่องตรวจจับวิญญาณ": "fa-solid fa-ghost",
  "ลูกแก้วพยากรณ์": "fa-solid fa-crystal-ball",
  "ไม้พาย": "fa-solid fa-spoon",
  "กรรไกรตัดแต่งกิ่ง": "fa-solid fa-scissors",
  "ธนูและลูกศร": "fa-solid fa-bow-arrow",
  "ขวานปีนเขา": "fa-solid fa-mountain",
  "ปืนคาบศิลาโบราณ": "fa-solid fa-gun",
  "ไม้นิตติ้ง": "fa-solid fa-wand-magic",
  "วัตถุโบราณเอเลี่ยน": "fa-solid fa-alien",
  "ไวน์ศักดิ์สิทธิ์": "fa-solid fa-wine-glass",
  "ขวดน้ำมันศักดิ์สิทธิ์": "fa-solid fa-bottle-droplet",
  "สายเกียรติยศ": "fa-solid fa-medal",
  "ดินสอแหลม": "fa-solid fa-pencil",
  "เป้หนังสือหนัก": "fa-solid fa-backpack",
  "คอมพิวเตอร์เครื่องเก่า": "fa-solid fa-computer-classic",
  "ตำราการเมือง": "fa-solid fa-book",
  "หีบบัตรเลือกตั้ง": "fa-solid fa-box-ballot",
  "คบเพลิง": "fa-solid fa-fire-flame-curved",
  "คทาศักดิ์สิทธิ์": "fa-solid fa-wand-magic",
  "หมวกเกราะโบราณ": "fa-solid fa-helmet-battle",
  "เอกซ์คาลิเบอร์": "fa-solid fa-sword",
  "จอกศักดิ์สิทธิ์": "fa-solid fa-goblet",
  "ถังออกซิเจน": "fa-solid fa-cylinder",
  "แบตเตอรี่ก้อนใหญ่": "fa-solid fa-battery-full",
  "กะโหลกมนุษย์": "fa-solid fa-skull",
  "หินดวงจันทร์": "fa-solid fa-meteor",
  "ไพ่เอซโพดำ": "fa-solid fa-spade",
  "เลื่อย": "fa-solid fa-screwdriver-wrench",
  "กระต่ายที่ฝึกมาอย่างดีแต่อันตราย": "fa-solid fa-rabbit",
  "เหล้าเถื่อนราคาถูก": "fa-solid fa-jug",
  "ปลาเฮอริ่งแดง": "fa-solid fa-fish",
  "ช้อนงอ": "fa-solid fa-spoon",
  "บันทึกสื่อวิญญาณ": "fa-solid fa-book-journal-whills",
  "ของประดับผนัง": "fa-solid fa-shield",
  "ช้อน": "fa-solid fa-spoon",
  "กระดูกยักษ์": "fa-solid fa-bone",
  "เข็มโบท็อกซ์": "fa-solid fa-syringe",
  "ม้วนฟิล์ม": "fa-solid fa-film-canister",
  "ไม้กอล์ฟ": "fa-solid fa-golf-club",
  "บทภาพยนตร์ขนาดยักษ์": "fa-solid fa-scroll",
  "จานหรู": "fa-solid fa-plate-wheat",
  "ตะเกียบ": "fa-solid fa-utensils",
  "ขนมแท่งค้างคืน": "fa-solid fa-candy-bar",
  "ผ้าพันคอสังหาร": "fa-solid fa-scarf",
  "นกทองคำ": "fa-solid fa-bird",
  "ไปป์ระเบิด": "fa-solid fa-smoking",
  "หนังสือปกแข็งฉบับภาพยนตร์": "fa-solid fa-book",
  "ถังดับเพลิง": "fa-solid fa-fire-extinguisher",
  "รถกอล์ฟ": "fa-solid fa-golf-cart",
  "มีดประกอบฉาก": "fa-solid fa-knife",
  "ถุงทราย": "fa-solid fa-sack",
  "ขาตั้งไฟ": "fa-solid fa-lightbulb",
  "สายไฟ": "fa-solid fa-plug",
  "หมวกสักหลาดติดกับดัก": "fa-solid fa-hat-cowboy",
  "ชุดดีวีดีบ็อกซ์เซ็ต": "fa-solid fa-compact-disc",
  "กุหลาบปลอม": "fa-solid fa-rose",
  "ยาสกัดปนเปื้อนพิษ": "fa-solid fa-vial",
  "แถบฟิล์ม": "fa-solid fa-film",
  "ไมโครโฟน ADR": "fa-solid fa-microphone",
  "มีดเหล็ก": "fa-solid fa-knife",
  "สัญญาหนึ่งพันหน้า": "fa-solid fa-file-contract",
  "กระเป๋าใส่เงินสด": "fa-solid fa-sack-dollar",
  "เหล้าวิสกี้หนึ่งจอก": "fa-solid fa-glass-whiskey",
  "ไฟผี": "fa-solid fa-ghost",
  "ไม้เท้าดาบ": "fa-solid fa-staff",
  "ธงรูปดอกกุหลาบ": "fa-solid fa-flag",
  "เครื่องพิมพ์": "fa-solid fa-print"
};

let fixCount = 0;

// โลจิกแก้ไข 3 จุดสีแดง (สร้างร่างแยกให้มันแมตช์กับในเกม)
const fixRedErrors = () => {
  const redErrors = [
    { cat: 'suspects', name: 'พลเรือเอก มารีน', copyFrom: 'พลเรือเอก มารีน (Marine)' },
    { cat: 'weapons', name: 'เซกซ์แทนท์', copyFrom: 'เซกซ์แทนท์ (เครื่องมือวัดมุมดาว)' },
    { cat: 'locations', name: 'โคลัมบาเรียม', copyFrom: 'โคลัมบาเรียม (ที่เก็บอัฐิ)' }
  ];

  redErrors.forEach(err => {
    const catList = masterData[err.cat];
    if (!catList.find(m => m.name === err.name)) {
      const template = catList.find(m => m.name === err.copyFrom);
      if (template) {
        catList.push({ ...template, name: err.name });
        fixCount++;
      }
    }
  });
};

fixRedErrors();

// โลจิกจับคู่ไอคอน (รวมถึงการตัดวงเล็บในใจ)
['suspects', 'weapons', 'locations'].forEach(category => {
  masterData[category].forEach(item => {
    // ตัดวงเล็บออกเพื่อหาชื่อตั้งต้น (เช่น พลเรือเอก มารีน)
    let baseName = item.name.replace(/\s*\(.*?\)\s*/g, '').trim();

    // หาไอคอนจากพจนานุกรม (เทียบชื่อเต็มก่อน ถ้าไม่เจอค่อยเทียบชื่อที่ตัดวงเล็บ)
    let newIcon = iconDictionary[item.name] || iconDictionary[baseName];

    if (newIcon) {
      if (item.icon !== newIcon) {
        item.icon = newIcon;
        fixCount++;
      }
    } else if (!item.icon || item.icon.includes("fa-circle-question")) {
      // 💡 Fallback อัจฉริยะ: ถ้ายังหลุดรอดไปได้อีก อลิซจะแจกไอคอนหมวดหมู่ให้
      if (category === 'suspects') item.icon = 'fa-solid fa-user';
      else if (category === 'weapons') item.icon = 'fa-solid fa-gavel';
      else if (category === 'locations') item.icon = 'fa-solid fa-location-dot';
      fixCount++;
    }
  });
});

fs.writeFileSync(dataPath, JSON.stringify(masterData, null, 2), 'utf-8');
console.log(`✅ อลิซจัดการอัปเดตไอคอนให้เรียบร้อยแล้ว จำนวน ${fixCount} จุด!`);