// src/utils/dailyGenerator.ts

// Type definitions อ้างอิงจากโครงสร้างข้อมูลของคุณพี่
export interface DailyEntity {
  name: string;
  detail: string;
  emoji?: string; // ถ้ามี
}

export interface MasterData {
  suspects: DailyEntity[];
  weapons: DailyEntity[];
  locations: DailyEntity[];
  motives: DailyEntity[];
}

export interface GeneratedCase {
  id: string;
  level_name: string;
  difficulty: number;
  story_intro: string;
  profiles: {
    suspects: DailyEntity[];
    weapons: DailyEntity[];
    locations: DailyEntity[];
    motives: DailyEntity[];
  };
  categories: { id: string; name: string; items: string[] }[];
  clues: string[];
  testimonies: never[]; // Daily case ไม่มีคนโกหก ให้เป็น array ว่าง
  solution_grid: any[];
  correct_accusation: {
    suspect: string;
    weapon: string;
    location: string;
    motive: string;
  };
}

// 1. PRNG Generator (Mulberry32) สุ่มตัวเลขจาก Seed วันที่
function splitmix32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x9e3779b9) | 0;
    let t = a ^ (a >>> 16);
    t = Math.imul(t, 0x21f0aaad);
    t = t ^ (t >>> 15);
    t = Math.imul(t, 0x735a2d97);
    return ((t = t ^ (t >>> 15)) >>> 0) / 4294967296;
  };
}

// Helper: ดึงข้อมูล Trait จากข้อความ Detail
const extractTrait = (detail: string, type: 'hand' | 'eye' | 'hair' | 'sign' | 'weight' | 'material' | 'indoors') => {
  if (!detail) return null;
  const traits = detail.split(',').map((s) => s.trim());

  switch (type) {
    case 'hand': return traits.find((t) => t.includes('ถนัด'));
    case 'eye': return traits.find((t) => t.includes('ตาสี'));
    case 'hair': return traits.find((t) => t.includes('ผม') || t.includes('ศีรษะล้าน'));
    case 'sign': return traits.find((t) => t.includes('ราศี'));
    case 'weight': return traits.find((t) => t.includes('น้ำหนัก'));
    case 'material': return traits.find((t) => t.includes('ทำจาก') || t.includes('โลหะ') || t.includes('พลาสติก') || t.includes('กระดาษ') || t.includes('แร่ธาตุ'));
    case 'indoors': return traits.find((t) => t.includes('ในร่ม') || t.includes('กลางแจ้ง'));
    default: return null;
  }
};

export class DailyMurdleEngine {
  private rng: () => number;

  constructor(seedStr: string) {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = (Math.imul(31, hash) + seedStr.charCodeAt(i)) | 0;
    }
    this.rng = splitmix32(hash);
  }

  private randomInt(max: number) {
    return Math.floor(this.rng() * max);
  }

  private shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = this.randomInt(i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // เลือก 4 ไอเทมแบบสุ่มไม่ซ้ำ
  private selectEntities(masterData: MasterData) {
    return {
      suspects: this.shuffle(masterData.suspects).slice(0, 4),
      weapons: this.shuffle(masterData.weapons).slice(0, 4),
      locations: this.shuffle(masterData.locations).slice(0, 4),
      motives: this.shuffle(masterData.motives).slice(0, 4),
    };
  }

  // สร้างกระดานเฉลย
  private generateTruthTable() {
    const wIdx = this.shuffle([0, 1, 2, 3]);
    const lIdx = this.shuffle([0, 1, 2, 3]);
    const mIdx = this.shuffle([0, 1, 2, 3]);

    const table = [];
    for (let i = 0; i < 4; i++) {
      table.push({ suspect: i, weapon: wIdx[i], location: lIdx[i], motive: mIdx[i] });
    }
    return { table, culpritIndex: this.randomInt(4) };
  }

  // สร้างคลังคำใบ้ทั้งหมดที่เป็นไปได้ (100% True)
  private generateCluePool(entities: ReturnType<typeof this.selectEntities>, truthTable: any[]) {
    const pool: any[] = [];
    const categories = ['suspect', 'weapon', 'location', 'motive'];
    const names = [entities.suspects, entities.weapons, entities.locations, entities.motives];

    const addClue = (cat1: number, id1: number, cat2: number, id2: number, isTrue: boolean, text: string) => {
      pool.push({ cat1, id1, cat2, id2, isTrue, text });
    };

    // 1. Direct & Negative Clues
    for (let c1 = 0; c1 < 3; c1++) {
      for (let c2 = c1 + 1; c2 < 4; c2++) {
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            const isTrue = truthTable.find((t) => t[categories[c1]] === i)[categories[c2]] === j;
            const name1 = names[c1][i].name;
            const name2 = names[c2][j].name;

            if (isTrue) {
              if (c1 === 0 && c2 === 1) addClue(c1, i, c2, j, true, `${name1} พก ${name2} มาด้วย`);
              if (c1 === 0 && c2 === 2) addClue(c1, i, c2, j, true, `${name1} ถูกพบเห็นที่ ${name2}`);
              if (c1 === 0 && c2 === 3) addClue(c1, i, c2, j, true, `แรงจูงใจของ ${name1} คือ ${name2}`);
              if (c1 === 1 && c2 === 2) addClue(c1, i, c2, j, true, `พบ ${name1} ตกอยู่ใน ${name2}`);
              if (c1 === 1 && c2 === 3) addClue(c1, i, c2, j, true, `ใครก็ตามที่ ${name2} พก ${name1} มาด้วย`);
              if (c1 === 2 && c2 === 3) addClue(c1, i, c2, j, true, `คนที่มีแรงจูงใจ ${name2} อยู่ใน ${name1}`);
            } else {
              if (c1 === 0 && c2 === 1) addClue(c1, i, c2, j, false, `${name1} ไม่ได้เป็นคนใช้ ${name2}`);
              if (c1 === 0 && c2 === 2) addClue(c1, i, c2, j, false, `${name1} ไม่เคยเฉียดไปใกล้ ${name2} เลย`);
              if (c1 === 0 && c2 === 3) addClue(c1, i, c2, j, false, `แรงจูงใจของ ${name1} ไม่ใช่ ${name2} แน่นอน`);
              if (c1 === 1 && c2 === 2) addClue(c1, i, c2, j, false, `ไม่มีใครนำ ${name1} เข้าไปใน ${name2}`);
            }
          }
        }
      }
    }

    // 2. Trait Clues (ใช้ข้อมูลจาก Detail)
    truthTable.forEach((t) => {
      const sus = entities.suspects[t.suspect];
      const wea = entities.weapons[t.weapon];
      const loc = entities.locations[t.location];

      const traitSign = extractTrait(sus.detail, 'sign');
      const traitHand = extractTrait(sus.detail, 'hand');
      const traitWeight = extractTrait(wea.detail, 'weight');
      const traitIndoors = extractTrait(loc.detail, 'indoors');

      if (traitSign) {
        addClue(0, t.suspect, 1, t.weapon, true, `ชาว${traitSign} ครอบครองอาวุธคือ ${wea.name}`);
        addClue(0, t.suspect, 2, t.location, true, `ชาว${traitSign} อยู่ที่ ${loc.name}`);
      }
      if (traitHand) {
        addClue(0, t.suspect, 3, t.motive, true, `ใครบางคนที่${traitHand} ต้องการที่จะ ${entities.motives[t.motive].name}`);
      }
      if (traitWeight) {
        addClue(1, t.weapon, 2, t.location, true, `อาวุธที่มี${traitWeight} ถูกพบที่ ${loc.name}`);
      }
      if (traitIndoors) {
        addClue(2, t.location, 0, t.suspect, true, `${sus.name} ถูกพบเห็นในสถานที่${traitIndoors}`);
      }
    });

    return this.shuffle(pool);
  }

  // ตัวจำลองการไขคดีของ AI เพื่อเช็คว่าคำใบ้มี Unique Solution หรือไม่
  private canSolve(cluesSelected: any[]): boolean {
    const grids: Record<string, number[][]> = {
      '0_1': Array(4).fill(null).map(() => Array(4).fill(0)),
      '0_2': Array(4).fill(null).map(() => Array(4).fill(0)),
      '0_3': Array(4).fill(null).map(() => Array(4).fill(0)),
      '1_2': Array(4).fill(null).map(() => Array(4).fill(0)),
      '1_3': Array(4).fill(null).map(() => Array(4).fill(0)),
      '2_3': Array(4).fill(null).map(() => Array(4).fill(0)),
    };

    const getGrid = (c1: number, c2: number) => {
      return c1 < c2 ? { g: grids[`${c1}_${c2}`], swap: false } : { g: grids[`${c2}_${c1}`], swap: true };
    };

    let changed = false;
    const setCell = (c1: number, i: number, c2: number, j: number, val: number) => {
      const { g, swap } = getGrid(c1, c2);
      const x = swap ? j : i;
      const y = swap ? i : j;
      if (g[x][y] !== 0 && g[x][y] !== val) return false;
      if (g[x][y] === 0) {
        g[x][y] = val;
        changed = true;
      }
      return true;
    };

    for (const clue of cluesSelected) {
      if (!setCell(clue.cat1, clue.id1, clue.cat2, clue.id2, clue.isTrue ? 1 : -1)) return false;
    }

    changed = true;
    let iterations = 0;
    while (changed && iterations < 30) {
      changed = false;
      iterations++;

      // Rule 1: Row/Col logic
      Object.values(grids).forEach((g) => {
        for (let r = 0; r < 4; r++) {
          let posCount = 0, negCount = 0, emptyIdx = -1;
          for (let c = 0; c < 4; c++) {
            if (g[r][c] === 1) posCount++;
            else if (g[r][c] === -1) negCount++;
            else emptyIdx = c;
          }
          if (posCount === 1 && negCount < 3) {
            for (let c = 0; c < 4; c++) if (g[r][c] === 0) { g[r][c] = -1; changed = true; }
          }
          if (negCount === 3 && emptyIdx !== -1) {
            g[r][emptyIdx] = 1; changed = true;
          }
        }
        for (let c = 0; c < 4; c++) {
          let posCount = 0, negCount = 0, emptyIdx = -1;
          for (let r = 0; r < 4; r++) {
            if (g[r][c] === 1) posCount++;
            else if (g[r][c] === -1) negCount++;
            else emptyIdx = r;
          }
          if (posCount === 1 && negCount < 3) {
            for (let r = 0; r < 4; r++) if (g[r][c] === 0) { g[r][c] = -1; changed = true; }
          }
          if (negCount === 3 && emptyIdx !== -1) {
            g[emptyIdx][c] = 1; changed = true;
          }
        }
      });

      // Rule 2: Transitivity (Cross-referencing)
      const cats = [0, 1, 2, 3];
      for (const c1 of cats) {
        for (const c2 of cats) {
          if (c1 >= c2) continue;
          for (const c3 of cats) {
            if (c2 === c3 || c1 === c3) continue;

            const { g: g12, swap: s12 } = getGrid(c1, c2);
            const { g: g23, swap: s23 } = getGrid(c2, c3);

            for (let i = 0; i < 4; i++) {
              for (let j = 0; j < 4; j++) {
                const val12 = s12 ? g12[j][i] : g12[i][j];
                if (val12 !== 0) {
                  for (let k = 0; k < 4; k++) {
                    const val23 = s23 ? g23[k][j] : g23[j][k];
                    if (val23 !== 0) {
                      let inferredVal = 0;
                      if (val12 === 1 && val23 === 1) inferredVal = 1;
                      else if (val12 === 1 && val23 === -1) inferredVal = -1;
                      else if (val12 === -1 && val23 === 1) inferredVal = -1;

                      if (inferredVal !== 0) {
                        if (!setCell(c1, i, c3, k, inferredVal)) return false;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    // ไขสำเร็จไหม?
    for (const key in grids) {
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (grids[key][r][c] === 0) return false; // ยังมีช่องว่าง
        }
      }
    }
    return true; // สำเร็จ 100%
  }

  // -------------------------------------------------------------
  // MAIN GENERATOR
  // -------------------------------------------------------------
  public generate(masterData: MasterData, dateSeed: string): GeneratedCase | null {
    let attempts = 0;

    while (attempts < 100) {
      attempts++;
      const entities = this.selectEntities(masterData);
      const { table, culpritIndex } = this.generateTruthTable();
      const pool = this.generateCluePool(entities, table);

      const selectedClues = [];
      let isSolved = false;

      for (const clue of pool) {
        selectedClues.push(clue);
        // ตรวจสอบความสมบูรณ์หลังจากมีคำใบ้อย่างน้อย 5 ข้อ
        if (selectedClues.length >= 5) {
          if (this.canSolve(selectedClues)) {
            isSolved = true;
            break;
          }
        }
      }

      // ถ้าแก้ได้ และคำใบ้กำลังดี (ไม่เกิน 12 ข้อ) ให้แปลงเป็น Format เกมของคุณพี่
      if (isSolved && selectedClues.length <= 12) {
        // จัดเรียง Clues ใหม่ (สลับ Negative ให้กระจายตัว ไม่กองรวมกัน)
        const finalCluesText = this.shuffle(selectedClues).map((c) => c.text);

        const generatedCase: GeneratedCase = {
          id: `daily_${dateSeed.replace(/-/g, '')}`,
          level_name: `Daily Case: ${dateSeed} (ปริศนาประจำวัน)`,
          difficulty: 4,
          story_intro: "ยินดีต้อนรับสู่คดีประจำวัน! ฆาตกรสุดเจ้าเล่ห์ได้ลงมือก่อเหตุอีกครั้ง ใช้อุปกรณ์ในมือคุณและคำใบ้ด้านล่าง เพื่อค้นหาว่าใครคือฆาตกรตัวจริงของวันนี้!",
          profiles: {
            suspects: entities.suspects,
            weapons: entities.weapons,
            locations: entities.locations,
            motives: entities.motives
          },
          categories: [
            { id: "suspects", name: "ผู้ต้องสงสัย", items: entities.suspects.map(s => s.name) },
            { id: "weapons", name: "อาวุธ", items: entities.weapons.map(w => w.name) },
            { id: "locations", name: "สถานที่", items: entities.locations.map(l => l.name) },
            { id: "motives", name: "แรงจูงใจ", items: entities.motives.map(m => m.name) }
          ],
          clues: finalCluesText,
          testimonies: [], // ไม่มีคนโกหก
          solution_grid: table.map((t) => ({
            suspects: entities.suspects[t.suspect].name,
            weapons: entities.weapons[t.weapon].name,
            locations: entities.locations[t.location].name,
            motives: entities.motives[t.motive].name
          })),
          correct_accusation: {
            suspect: entities.suspects[table[culpritIndex].suspect].name,
            weapon: entities.weapons[table[culpritIndex].weapon].name,
            location: entities.locations[table[culpritIndex].location].name,
            motive: entities.motives[table[culpritIndex].motive].name
          }
        };

        return generatedCase;
      }
    }
    return null; // Fallback ถ้ารอบนั้นสุ่มไม่ลงล็อก
  }
}

/**
 * -------------------------------------------------------------
 * วิธีนำไปใช้ใน Component ของคุณพี่ (เช่น src/app/daily/page.tsx)
 * -------------------------------------------------------------
 * * import masterData from '@/data/masterdata.json';
 * import { DailyMurdleEngine, GeneratedCase } from '@/utils/dailyGenerator';
 * import { useGameLogic } from '@/hooks/useGameLogic';
 * * export default function DailyCasePage() {
 * const [dailyCase, setDailyCase] = useState<GeneratedCase | null>(null);
 * * useEffect(() => {
 * const today = new Date().toISOString().slice(0, 10);
 * * // ลูปจนกว่าจะเจนสำเร็จ (ปกติครั้งสองครั้งก็สำเร็จแล้ว)
 * let result = null;
 * let seedModifier = "";
 * while (!result) {
 * const engine = new DailyMurdleEngine(today + seedModifier);
 * result = engine.generate(masterData, today);
 * seedModifier += "x"; // ปรับ seed เล็กน้อยถ้าโชคร้ายสุ่มไม่เจอ 
 * }
 * * setDailyCase(result);
 * }, []);
 * * // ส่งเข้า useGameLogic ของคุณพี่ได้เลย
 * // const { ... } = useGameLogic(dailyCase);
 * * if (!dailyCase) return <div>กำลังเตรียมคดี...</div>;
 * * // Render UI เดิมของคุณพี่ตรงนี้
 * return <LogicGrid caseData={dailyCase} ... />
 * }
 */