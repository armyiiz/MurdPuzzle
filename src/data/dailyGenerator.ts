/* eslint-disable @typescript-eslint/no-explicit-any */
// src/utils/dailyGenerator.ts

// Type definitions อ้างอิงจากโครงสร้างข้อมูลของคุณพี่
export interface DailyEntity {
  name: string;
  lore?: string;
  detail?: string;
  height?: string;
  hand?: string;
  eye?: string;
  hair?: string;
  zodiac?: string;
  weight?: string;
  material?: string;
  type?: string;
  emoji?: string;
}

export interface MasterData {
  suspects: DailyEntity[];
  weapons: DailyEntity[];
  locations: DailyEntity[];
  motives: DailyEntity[];
}

export interface Testimony {
  suspect: string;
  statement: string;
}

export interface GeneratedCase {
  id: string;
  level_name: string;
  difficulty: number;
  story_intro: string;
  profiles: {
    suspects: { name: string, detail: string }[];
    weapons: { name: string, detail: string }[];
    locations: { name: string, detail: string }[];
    motives?: { name: string, detail: string }[];
  };
  categories: { id: string; name: string; items: string[] }[];
  clues: string[];
  testimonies: Testimony[];
  solution_grid: any[];
  correct_accusation: {
    suspect: string;
    weapon: string;
    location: string;
    motive?: string;
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
const extractTrait = (entity: DailyEntity, type: 'hand' | 'eye' | 'hair' | 'sign' | 'weight' | 'material' | 'indoors') => {
  if (!entity) return null;

  switch (type) {
    case 'hand': return entity.hand && entity.hand !== '-' ? entity.hand : null;
    case 'eye': return entity.eye && entity.eye !== '-' ? entity.eye : null;
    case 'hair': return entity.hair && entity.hair !== '-' ? entity.hair : null;
    case 'sign': return entity.zodiac && entity.zodiac !== '-' ? entity.zodiac : null;
    case 'weight': return entity.weight && entity.weight !== '-' ? entity.weight : null;
    case 'material': return entity.material && entity.material !== '-' ? entity.material : null;
    case 'indoors': return entity.type && entity.type !== '-' ? entity.type : null;
    default: return null;
  }
};

export class DailyMurdleEngine {
  private rng: () => number;
  private difficulty: number;

  constructor(seedStr: string) {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = (Math.imul(31, hash) + seedStr.charCodeAt(i)) | 0;
    }
    this.rng = splitmix32(hash);

    // Date seed is usually YYYY-MM-DD
    const date = new Date(seedStr.split('x')[0]); // ignore modifiers
    let day = 0;
    if (!isNaN(date.getTime())) {
      day = date.getDay(); // 0 is Sunday, 6 is Saturday
    } else {
      // fallback if seed is not date
      day = this.randomInt(7);
    }

    if (day === 0 || day === 6) {
      this.difficulty = 4;
    } else {
      this.difficulty = this.randomInt(4) + 1;
    }
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

  private getNumItems() {
    return this.difficulty < 3 ? 3 : 4;
  }

  private selectEntities(masterData: MasterData) {
    const numItems = this.getNumItems();
    return {
      suspects: this.shuffle(masterData.suspects).slice(0, numItems),
      weapons: this.shuffle(masterData.weapons).slice(0, numItems),
      locations: this.shuffle(masterData.locations).slice(0, numItems),
      motives: this.difficulty >= 3 ? this.shuffle(masterData.motives).slice(0, numItems) : [],
    };
  }

  private generateTruthTable() {
    const numItems = this.getNumItems();
    const indices = Array.from({length: numItems}, (_, i) => i);
    const wIdx = this.shuffle([...indices]);
    const lIdx = this.shuffle([...indices]);
    const mIdx = this.difficulty >= 3 ? this.shuffle([...indices]) : [];

    const table = [];
    for (let i = 0; i < numItems; i++) {
      const entry: any = { suspect: i, weapon: wIdx[i], location: lIdx[i] };
      if (this.difficulty >= 3) {
        entry.motive = mIdx[i];
      }
      table.push(entry);
    }
    return { table, culpritIndex: this.randomInt(numItems) };
  }

  private generateCluePool(entities: ReturnType<typeof this.selectEntities>, truthTable: any[]) {
    const pool: any[] = [];
    const numItems = this.getNumItems();
    const categories = ['suspect', 'weapon', 'location'];
    const names = [entities.suspects, entities.weapons, entities.locations];

    if (this.difficulty >= 3) {
      categories.push('motive');
      names.push(entities.motives);
    }

    const addClue = (cat1: number, id1: number, cat2: number, id2: number, isTrue: boolean, text: string) => {
      pool.push({ cat1, id1, cat2, id2, isTrue, text });
    };

    // 1. Direct & Negative Clues
    for (let c1 = 0; c1 < categories.length - 1; c1++) {
      for (let c2 = c1 + 1; c2 < categories.length; c2++) {
        for (let i = 0; i < numItems; i++) {
          for (let j = 0; j < numItems; j++) {
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

      const traitSign = extractTrait(sus, 'sign');
      const traitHand = extractTrait(sus, 'hand');
      const traitWeight = extractTrait(wea, 'weight');
      const traitIndoors = extractTrait(loc, 'indoors');

      if (traitSign) {
        addClue(0, t.suspect, 1, t.weapon, true, `ชาว${traitSign} ครอบครองอาวุธคือ ${wea.name}`);
        addClue(0, t.suspect, 2, t.location, true, `ชาว${traitSign} อยู่ที่ ${loc.name}`);
      }
      if (traitHand && this.difficulty >= 3) {
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
    const numItems = this.getNumItems();
    const hasMotives = this.difficulty >= 3;

    const grids: Record<string, number[][]> = {
      '0_1': Array(numItems).fill(null).map(() => Array(numItems).fill(0)),
      '0_2': Array(numItems).fill(null).map(() => Array(numItems).fill(0)),
      '1_2': Array(numItems).fill(null).map(() => Array(numItems).fill(0)),
    };

    if (hasMotives) {
      grids['0_3'] = Array(numItems).fill(null).map(() => Array(numItems).fill(0));
      grids['1_3'] = Array(numItems).fill(null).map(() => Array(numItems).fill(0));
      grids['2_3'] = Array(numItems).fill(null).map(() => Array(numItems).fill(0));
    }

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
        for (let r = 0; r < numItems; r++) {
          let posCount = 0, negCount = 0, emptyIdx = -1;
          for (let c = 0; c < numItems; c++) {
            if (g[r][c] === 1) posCount++;
            else if (g[r][c] === -1) negCount++;
            else emptyIdx = c;
          }
          if (posCount === 1 && negCount < numItems - 1) {
            for (let c = 0; c < numItems; c++) if (g[r][c] === 0) { g[r][c] = -1; changed = true; }
          }
          if (negCount === numItems - 1 && emptyIdx !== -1) {
            g[r][emptyIdx] = 1; changed = true;
          }
        }
        for (let c = 0; c < numItems; c++) {
          let posCount = 0, negCount = 0, emptyIdx = -1;
          for (let r = 0; r < numItems; r++) {
            if (g[r][c] === 1) posCount++;
            else if (g[r][c] === -1) negCount++;
            else emptyIdx = r;
          }
          if (posCount === 1 && negCount < numItems - 1) {
            for (let r = 0; r < numItems; r++) if (g[r][c] === 0) { g[r][c] = -1; changed = true; }
          }
          if (negCount === numItems - 1 && emptyIdx !== -1) {
            g[emptyIdx][c] = 1; changed = true;
          }
        }
      });

      // Rule 2: Transitivity (Cross-referencing)
      const cats = hasMotives ? [0, 1, 2, 3] : [0, 1, 2];
      for (const c1 of cats) {
        for (const c2 of cats) {
          if (c1 >= c2) continue;
          for (const c3 of cats) {
            if (c2 === c3 || c1 === c3) continue;

            const { g: g12, swap: s12 } = getGrid(c1, c2);
            const { g: g23, swap: s23 } = getGrid(c2, c3);

            for (let i = 0; i < numItems; i++) {
              for (let j = 0; j < numItems; j++) {
                const val12 = s12 ? g12[j][i] : g12[i][j];
                if (val12 !== 0) {
                  for (let k = 0; k < numItems; k++) {
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
      for (let r = 0; r < numItems; r++) {
        for (let c = 0; c < numItems; c++) {
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

      const selectedClues: any[] = [];
      let isSolved = false;

      // generate testimonies if difficulty > 1
      const testimonies: Testimony[] = [];
      const numItems = this.getNumItems();

      let liarIndex = -1;
      if (this.difficulty > 1) {
        // difficulty 2, 3, 4: Select 1 liar
        liarIndex = this.randomInt(numItems);
      }

      // Need to pick testimony clues out of the pool for the suspects
      const testimonyCluesForSuspect = Array.from({length: numItems}, () => [] as any[]);
      const normalCluesPool: any[] = [];

      for (const clue of pool) {
        if (clue.cat1 === 0 && clue.isTrue) {
          testimonyCluesForSuspect[clue.id1].push(clue);
        } else if (clue.cat2 === 0 && clue.isTrue) {
          testimonyCluesForSuspect[clue.id2].push(clue);
        } else {
          normalCluesPool.push(clue);
        }
      }

      let hasValidTestimonies = true;
      if (this.difficulty > 1) {
        for (let i = 0; i < numItems; i++) {
          if (i !== liarIndex && testimonyCluesForSuspect[i].length === 0) {
            hasValidTestimonies = false;
            break;
          }
        }
      }

      if (this.difficulty > 1 && !hasValidTestimonies) {
        continue;
      }

      const combinedSelectedClues: any[] = [];

      if (this.difficulty > 1) {
        for (let i = 0; i < numItems; i++) {
          if (i === liarIndex) {
            // Generate a false statement
            // Find a true fact about i
            const trueFact = table.find((t: any) => t.suspect === i);
            // Change it to another category id
            const wrongWeapon = (trueFact.weapon + 1) % numItems;
            const wName = entities.weapons[wrongWeapon].name;
            testimonies.push({
              suspect: entities.suspects[i].name,
              statement: `ฉันไม่ได้ทำ ฉันเห็นว่าฉันอยู่กับ ${wName}`
            });
            // We add the OPPOSITE (the real truth) to combinedSelectedClues to evaluate if solvable
            // Because if they are a liar, "I was with W" means "I was NOT with W" (true)
            combinedSelectedClues.push({ cat1: 0, id1: i, cat2: 1, id2: wrongWeapon, isTrue: false, text: '' });
          } else {
            // True statement
            const clue = this.shuffle(testimonyCluesForSuspect[i])[0];
            if (clue) {
              testimonies.push({
                suspect: entities.suspects[i].name,
                statement: clue.text
              });
              combinedSelectedClues.push(clue);
            } else {
               hasValidTestimonies = false;
            }
          }
        }
      }

      if (this.difficulty > 1 && !hasValidTestimonies) {
        continue;
      }

      const shuffledNormalPool = this.shuffle(pool); // mix all

      for (const clue of shuffledNormalPool) {
        if (this.difficulty > 1 && combinedSelectedClues.includes(clue)) continue;

        selectedClues.push(clue);
        combinedSelectedClues.push(clue);

        // 5-7 clues constraint. Let's aim for 5-7 normal clues.
        if (selectedClues.length >= 5 && selectedClues.length <= 7) {
          if (this.canSolve(combinedSelectedClues)) {
            isSolved = true;
            break;
          }
        }
        if (selectedClues.length > 7) break;
      }

      if (isSolved) {
        const finalCluesText = this.shuffle(selectedClues).map((c) => c.text);

        const generatedCats = [
          { id: "suspects", name: "ผู้ต้องสงสัย", items: entities.suspects.map((s: any) => s.name) },
          { id: "weapons", name: "อาวุธ", items: entities.weapons.map((w: any) => w.name) },
          { id: "locations", name: "สถานที่", items: entities.locations.map((l: any) => l.name) }
        ];

        if (this.difficulty >= 3) {
           generatedCats.push({ id: "motives", name: "แรงจูงใจ", items: entities.motives.map((m: any) => m.name) });
        }

        const generatedCase: GeneratedCase = {
          id: `daily_${dateSeed.replace(/-/g, '')}`,
          level_name: `Daily Case: ${dateSeed} (ปริศนาประจำวัน)`,
          difficulty: this.difficulty,
          story_intro: "ยินดีต้อนรับสู่คดีประจำวัน! ฆาตกรสุดเจ้าเล่ห์ได้ลงมือก่อเหตุอีกครั้ง ใช้อุปกรณ์ในมือคุณและคำใบ้ด้านล่าง เพื่อค้นหาว่าใครคือฆาตกรตัวจริงของวันนี้!",
          profiles: {
            suspects: entities.suspects.map(s => ({ name: s.name, detail: `${s.lore || s.detail || ''} ${s.hand && s.hand !== '-' ? 'ถนัด' + s.hand : ''} ${s.zodiac && s.zodiac !== '-' ? 'ราศี' + s.zodiac : ''}` })),
            weapons: entities.weapons.map(w => ({ name: w.name, detail: `${w.lore || w.detail || ''} ${w.weight && w.weight !== '-' ? 'น้ำหนัก' + w.weight : ''}` })),
            locations: entities.locations.map(l => ({ name: l.name, detail: `${l.lore || l.detail || ''} ${l.type && l.type !== '-' ? l.type : ''}` })),
            ...(this.difficulty >= 3 ? { motives: entities.motives.map(m => ({ name: m.name, detail: m.detail || m.lore || '' })) } : {})
          },
          categories: generatedCats,
          clues: finalCluesText,
          testimonies: testimonies,
          solution_grid: table.map((t: any) => {
            const res: any = {
              suspects: entities.suspects[t.suspect].name,
              weapons: entities.weapons[t.weapon].name,
              locations: entities.locations[t.location].name,
            };
            if (this.difficulty >= 3) {
              res.motives = entities.motives[t.motive].name;
            }
            return res;
          }),
          correct_accusation: {
            suspect: entities.suspects[table[culpritIndex].suspect].name,
            weapon: entities.weapons[table[culpritIndex].weapon].name,
            location: entities.locations[table[culpritIndex].location].name,
            ...(this.difficulty >= 3 ? { motive: entities.motives[table[culpritIndex].motive].name } : {})
          }
        };

        return generatedCase;
      }
    }
    return null; // Fallback ถ้ารอบนั้นสุ่มไม่ลงล็อก
  }
}
