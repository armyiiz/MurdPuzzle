const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'src', 'data', 'dailymasterdata.json');
let masterData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const iconDictionary = {
  // --- Special Characters & Shared ---
  "หลวงพ่อ แมงโก้": "fa-solid fa-cross",
  "นายพล คอฟฟี่": "fa-solid fa-star",
  "เอเจนท์ อาร์ไกล์": "fa-solid fa-user-secret",
  "ประธาน มิดไนท์": "fa-solid fa-crown",
  "ลานจอดรถ A": "fa-solid fa-a",
  "ลานจอดรถ B": "fa-solid fa-b",
  "บังกะโล 1": "fa-solid fa-1",
  "บังกะโล 2": "fa-solid fa-2",
  "บังกะโล 3": "fa-solid fa-3",
  "บังกะโล 4": "fa-solid fa-4",

  // --- Motives Dictionary ---
  "การหลอกลวงด้านอสังหาริมทรัพย์": "fa-solid fa-house-crack",
  "ขณะกำลังมึนเมา": "fa-solid fa-beer-mug-empty",
  "ความบ้าคลั่งจากอวกาศ": "fa-solid fa-meteor",
  "ด้วยความกระหายเลือด": "fa-solid fa-droplet",
  "ด้วยความหึงหวง": "fa-solid fa-heart-crack",
  "ด้วยเหตุผลเชิงแนวคิด": "fa-solid fa-brain",
  "ด้วยเหตุผลทางศาสนา": "fa-solid fa-place-of-worship",
  "ตามคำสั่งของลัทธิ": "fa-solid fa-users-viewfinder",
  "ทำตามคำท้า": "fa-solid fa-hand-fist",
  "ทำไปตอนหน้ามืดตามัว": "fa-solid fa-eye-slash",
  "ทำไปเพราะความคุ้มคลั่ง": "fa-solid fa-face-dizzy",
  "ทำไปเพราะความหงุดหงิด": "fa-solid fa-face-angry",
  "ในนามของวงการ": "fa-solid fa-masks-theater",
  "เป็นการทดลองทางวิทยาศาสตร์": "fa-solid fa-flask",
  "เป็นส่วนหนึ่งของแผนโกงอสังหาริมทรัพย์": "fa-solid fa-house-lock",
  "ผีบังคับให้ทำ": "fa-solid fa-ghost",
  "แผนโกงอสังหาริมทรัพย์": "fa-solid fa-house-chimney-crack",
  "เพราะกำลังรีบ": "fa-solid fa-person-running",
  "เพราะคลื่นพลังงานไม่ดี": "fa-solid fa-bolt",
  "เพราะความบ้าคลั่ง": "fa-solid fa-face-flushed",
  "เพราะความหงุดหงิด": "fa-solid fa-face-tired",
  "เพราะความหึงหวง": "fa-solid fa-heart-crack",
  "เพราะทำได้": "fa-solid fa-thumbs-up",
  "เพราะพวกเขากำลังกลายเป็นเหมือนพ่อแม่ตัวเอง": "fa-solid fa-people-arrows",
  "เพราะพวกเขาทำได้": "fa-solid fa-thumbs-up",
  "เพราะพวกเขาทำลายรหัส": "fa-solid fa-user-secret",
  "เพราะมันสมเหตุสมผล": "fa-solid fa-scale-balanced",
  "เพื่อก่อตั้งสตูดิโอ": "fa-solid fa-film",
  "เพื่อการปฏิวัติ": "fa-solid fa-flag",
  "เพื่อการยอมรับที่สมควรได้รับ": "fa-solid fa-award",
  "เพื่อแก้แค้น": "fa-solid fa-fire",
  "เพื่อแก้แค้นให้พ่อ": "fa-solid fa-fire-flame-curved",
  "เพื่อขโมยคริสตัล": "fa-solid fa-gem",
  "เพื่อขโมยคฤหาสน์": "fa-solid fa-house-chimney",
  "เพื่อขโมยทับทิม": "fa-solid fa-gem",
  "เพื่อขโมยบทบาท": "fa-solid fa-masks-theater",
  "เพื่อขโมยแผนที่ขุมทรัพย์": "fa-solid fa-map",
  "เพื่อขโมยศพ": "fa-solid fa-skull",
  "เพื่อขโมยหนังสือล้ำค่า": "fa-solid fa-book-open",
  "เพื่อขโมยไอเดีย": "fa-solid fa-lightbulb",
  "เพื่อขโมย UFO": "fa-solid fa-alien",
  "เพื่อขอส่วนแบ่งที่สูงขึ้น": "fa-solid fa-chart-line",
  "เพื่อขึ้นเป็นกษัตริย์": "fa-solid fa-crown",
  "เพื่อขุดเจาะน้ำมัน": "fa-solid fa-oil-well",
  "เพื่อเข้าร่วมลัทธิ": "fa-solid fa-user-group",
  "เพื่อเงิน": "fa-solid fa-money-bill-wave",
  "เพื่อเงินสด": "fa-solid fa-money-bills",
  "เพื่อเงินสดก้อนโต": "fa-solid fa-sack-dollar",
  "เพื่อจุดประสงค์ทางการเมือง": "fa-solid fa-landmark",
  "เพื่อแจ้งเกิดในวงการ": "fa-solid fa-star",
  "เพื่อชนะรางวัล": "fa-solid fa-trophy",
  "เพื่อช่วยขายบทภาพยนตร์": "fa-solid fa-file-video",
  "เพื่อช่วยขายบทหนัง": "fa-solid fa-clapperboard",
  "เพื่อช่วยให้ชนะสงคราม": "fa-solid fa-shield-halved",
  "เพื่อซ่อนความลับเรื่องชู้สาว": "fa-solid fa-user-ninja",
  "เพื่อซ่อนเรื่องชู้สาว": "fa-solid fa-mask",
  "เพื่อดูว่าการฆ่าคนจะรู้สึกอย่างไร": "fa-solid fa-eye",
  "เพื่อดูว่าตัวเองจะทำได้ไหม": "fa-solid fa-vial",
  "เพื่อตอบโต้คำสบประมาท": "fa-solid fa-comment-slash",
  "เพื่อต่อรองสัญญาใหม่": "fa-solid fa-file-signature",
  "เพื่อต่อสู้เพื่อความรัก": "fa-solid fa-heart",
  "เพื่อทดสอบพล็อตหนัง": "fa-solid fa-video",
  "เพื่อทำลายสหภาพแรงงาน": "fa-solid fa-hammer",
  "เพื่อทำลายอาชีพคู่แข่ง": "fa-solid fa-arrow-trend-down",
  "เพื่อทำให้ปาร์ตี้สนุกขึ้น": "fa-solid fa-party-horn",
  "เพื่อทำให้เลดี้ประทับใจ": "fa-solid fa-face-smile-wink",
  "เพื่อที่จอดรถที่ดีกว่า": "fa-solid fa-square-parking",
  "เพื่อเบี่ยงเบนความสนใจ": "fa-solid fa-arrows-split-up-and-left",
  "เพื่อปกป้องความลับ": "fa-solid fa-lock",
  "เพื่อปกป้องความลับทางมายากล": "fa-solid fa-hat-wizard",
  "เพื่อประโยชน์สุขส่วนรวม": "fa-solid fa-hands-holding-child",
  "เพื่อปล้นสุสาน": "fa-solid fa-tombstone",
  "เพื่อปล้นเหยื่อ": "fa-solid fa-mask",
  "เพื่อปลอบใจโลจิโก": "fa-solid fa-hand-holding-heart",
  "เพื่อป้องกันการเปลี่ยนพินัยกรรม": "fa-solid fa-file-shield",
  "เพื่อปิดดีลธุรกิจ": "fa-solid fa-handshake",
  "เพื่อปิดปากพยาน": "fa-solid fa-comment-slash",
  "เพื่อเป็นการทดลองทางวิทยาศาสตร์": "fa-solid fa-microscope",
  "เพื่อเป็นการฝึกฝน": "fa-solid fa-dumbbell",
  "เพื่อโปรโมตเมือง": "fa-solid fa-city",
  "เพื่อโปรโมตเรื่องลี้ลับ": "fa-solid fa-magnifying-glass-chart",
  "เพื่อโปรโมตหนัง": "fa-solid fa-bullhorn",
  "เพื่อฝึกฝนฝีมือ": "fa-solid fa-pen-nib",
  "เพื่อพบดารา": "fa-solid fa-camera",
  "เพื่อพิสูจน์ความแข็งแกร่ง": "fa-solid fa-hand-fist",
  "เพื่อพิสูจน์ประเด็น": "fa-solid fa-check-double",
  "เพื่อพิสูจน์รัก": "fa-solid fa-heart",
  "เพื่อพิสูจน์ว่าตัวเองแกร่ง": "fa-solid fa-hand-fist",
  "เพื่อเพิ่มยอดขายหนังสือ": "fa-solid fa-book-medical",
  "เพื่อฟุตเทจดีๆ": "fa-solid fa-film",
  "เพื่อยึดครองสตูดิโอ": "fa-solid fa-building",
  "เพื่อยึดครองฮอลลีวูด": "fa-solid fa-star",
  "เพื่อยึดอำนาจ": "fa-solid fa-crown",
  "เพื่อแย่งที่นั่งที่ดีกว่า": "fa-solid fa-chair",
  "เพื่อรักษาหน้า": "fa-solid fa-mask",
  "เพื่อรักษาอำนาจ": "fa-solid fa-chess-king",
  "เพื่อรับมรดก": "fa-solid fa-file-invoice-dollar",
  "เพื่อรับมรดกกองโต": "fa-solid fa-sack-dollar",
  "เพื่อล้างแค้นให้พ่อ": "fa-solid fa-fire",
  "เพื่อเลื่อนตำแหน่ง": "fa-solid fa-arrow-up-right-dots",
  "เพื่อไล่หมีไป": "fa-solid fa-paw",
  "เพื่อส่งเสริมเรื่องลี้ลับ": "fa-solid fa-ghost",
  "เพื่อสร้างความไขว้เขว": "fa-solid fa-shuffle",
  "เพื่อสร้างความประทับใจให้หญิงสาว": "fa-solid fa-face-grin-hearts",
  "เพื่อสร้างแรงจูงใจให้โลจิโก": "fa-solid fa-magnifying-glass",
  "เพื่อสร้างสรรค์ศิลปะ": "fa-solid fa-palette",
  "เพื่อสั่งสอนบทเรียน": "fa-solid fa-chalkboard-user",
  "เพื่อหนีการถูกแบล็กเมล์": "fa-solid fa-person-running",
  "เพื่อหนีจากการถูกแบล็กเมล์": "fa-solid fa-person-running",
  "เพื่อหนีจากหนังห่วยๆ": "fa-solid fa-video-slash",
  "เพื่อหยุดการปฏิวัติ": "fa-solid fa-shield",
  "เพื่อหยุดยั้งการปฏิวัติ": "fa-solid fa-shield",
  "เพื่อหยุดโลจิโก": "fa-solid fa-hand",
  "เพื่อหลอกให้หมีหนีไป": "fa-solid fa-paw",
  "เพื่อให้ได้ที่นั่งที่ดีกว่า": "fa-solid fa-couch",
  "เพื่อให้ได้บทพูดเพิ่ม": "fa-solid fa-microphone",
  "เพื่อให้ปาร์ตี้สนุกขึ้น": "fa-solid fa-party-horn",
  "เพื่อให้ภาพยนตร์ได้รับการสร้าง": "fa-solid fa-clapperboard",
  "เพื่อให้ภาพยนตร์เสร็จสมบูรณ์": "fa-solid fa-film"
};

let fixCount = 0;

// Execute name matching and icon assignment
['suspects', 'weapons', 'locations', 'motives'].forEach(category => {
  masterData[category].forEach(item => {
    // Logic for Suspects with (Marine) suffixes
    let baseName = item.name.replace(/\s*\(.*?\)\s*/g, '').trim();

    let newIcon = iconDictionary[item.name] || iconDictionary[baseName];

    if (newIcon) {
      if (item.icon !== newIcon) {
        item.icon = newIcon;
        fixCount++;
      }
    } else if (!item.icon || item.icon.includes("fa-circle-question")) {
      // Fallback
      item.icon = category === 'suspects' ? 'fa-solid fa-user' :
                  category === 'motives' ? 'fa-solid fa-circle-info' : 'fa-solid fa-map-pin';
      fixCount++;
    }
  });
});

fs.writeFileSync(dataPath, JSON.stringify(masterData, null, 2), 'utf-8');
console.log(`✅ Fixed ${fixCount} icons across all categories.`);
