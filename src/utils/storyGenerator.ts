export function generateFlavorText(subject: string, relation: 'WITH' | 'NOT_WITH', object: string): string {
  const positiveTemplates = [
    `มีคนเห็น ${subject} อยู่กับ ${object} อย่างแน่นอน`,
    `พยานยืนยันว่า ${subject} สนิทสนมกับ ${object} มาก`,
    `หลักฐานชี้ชัดว่า ${subject} เข้าถึง ${object} ได้`,
  ];

  const negativeTemplates = [
    `${subject} ไม่มีทางอยู่ใกล้กับ ${object} ได้เลย`,
    `${subject} ปฏิเสธเสียงแข็งว่าไม่เกี่ยวข้องกับ ${object}`,
    `เป็นไปไม่ได้ที่ ${subject} จะมี ${object} ไว้ในครอบครอง`,
  ];

  const templates = relation === 'WITH' ? positiveTemplates : negativeTemplates;
  const randomIndex = Math.floor(Math.random() * templates.length);

  return templates[randomIndex];
}
