"use client";

// ดึงข้อมูล
import level1 from "../../data/level1.json";
import level2 from "../../data/level2.json";
import level3 from "../../data/level3.json";
import level4 from "../../data/level4.json";
import masterData from "../../data/dailymasterdata.json";
import { Category, LevelData } from "../../types/level";

type IconMasterItem = {
  name: string;
  icon?: string;
};

type IconCategory = {
  id: keyof typeof masterData;
  title: string;
  items: string[];
};

const typedCases = [
  ...(Array.isArray(level1) ? level1 : []),
  ...(Array.isArray(level2) ? level2 : []),
  ...(Array.isArray(level3) ? level3 : []),
  ...(Array.isArray(level4) ? level4 : []),
] as LevelData[];

const getUniqueItems = (categoryId: string) => {
  const items = typedCases.flatMap((currentCase) => {
    const category = currentCase.categories?.find((cat: Category) => cat.id === categoryId);
    return category ? category.items : [];
  });
  return Array.from(new Set(items));
};

const categories: IconCategory[] = [
  { id: "suspects", title: "ผู้ต้องสงสัย (Suspects)", items: getUniqueItems("suspects") },
  { id: "weapons", title: "อาวุธ (Weapons)", items: getUniqueItems("weapons") },
  { id: "locations", title: "สถานที่ (Locations)", items: getUniqueItems("locations") },
  { id: "motives", title: "แรงจูงใจ (Motives)", items: getUniqueItems("motives") },
];

const getMasterList = (categoryId: keyof typeof masterData): IconMasterItem[] => masterData[categoryId] as IconMasterItem[];

const missingLog = categories.flatMap((cat) => {
  const masterCatList = getMasterList(cat.id);

  return cat.items.flatMap((itemName) => {
    const foundInMaster = masterCatList.find((masterItem) => masterItem.name === itemName);

    if (!foundInMaster) {
      return [`[${cat.id}] ❌ สะกดชื่อไม่ตรงกัน: "${itemName}"`];
    }

    if (!foundInMaster.icon || foundInMaster.icon.includes("fa-circle-question")) {
      return [`[${cat.id}] ⚠️ ยังไม่ได้ตั้งไอคอน (ใช้ตัวสำรอง): "${itemName}"`];
    }

    return [];
  });
});

export default function DebugIconsPage() {
  return (
    <div className="min-h-screen bg-murdle-bg p-5 sm:p-8 font-mono text-black">
      <div className="max-w-6xl mx-auto">
        <div className="murdle-card mb-8">
          <h1 className="murdle-section-title uppercase tracking-widest mb-2">
            🕵️‍♀️ ศูนย์บัญชาการเช็กไอคอน (Debug V.2)
          </h1>
          <p className="font-bold">
            สแกนจากข้อมูลจริง! <br/>
            <span className="text-white bg-red-600 px-2 border-2 border-black inline-block mt-1">สีแดง</span> = สะกดชื่อในไฟล์คดี ไม่ตรงกับไฟล์ Master Data<br/>
            <span className="text-black bg-yellow-400 px-2 border-2 border-black inline-block mt-1">สีเหลือง</span> = ข้อมูลตรงกัน แต่คุณ Jules เผลอใส่ไอคอนเครื่องหมายคำถามไว้
          </p>
        </div>

        {missingLog.length > 0 ? (
          <div className="murdle-card mb-8 !bg-murdle-error">
            <h2 className="font-bold text-xl mb-2">🚨 พบปัญหา {missingLog.length} รายการ!</h2>
            <div className="max-h-64 overflow-y-auto bg-white border-2 border-black p-4">
              <ul className="list-disc pl-6 space-y-1">
                {missingLog.map((log, index) => (
                  <li key={index} className="font-bold text-sm">{log}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="murdle-card mb-8 !bg-murdle-success">
            <h2 className="font-bold text-xl">✅ เยี่ยมมาก! ข้อมูลเป๊ะ ไอคอนครบทุกตัว!</h2>
          </div>
        )}

        {categories.map((cat) => (
          <div key={cat.id} className="mb-12">
            <h2 className="text-2xl font-bold mb-4 border-b-4 border-black inline-block pb-1">
              {cat.title} ({cat.items.length} รายการในเกม)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {cat.items.map((itemName, index) => {
                const masterCatList = getMasterList(cat.id);
                const foundInMaster = masterCatList.find((masterItem) => masterItem.name === itemName);

                const isNotFound = !foundInMaster;
                const isPlaceholder = foundInMaster?.icon?.includes("fa-circle-question");
                const iconClass = foundInMaster?.icon || "fa-solid fa-circle-question";

                let boxStyle = "bg-murdle-bg text-black";
                if (isNotFound) boxStyle = "bg-murdle-error text-black";
                else if (isPlaceholder) boxStyle = "bg-murdle-paper text-black";

                return (
                  <div
                    key={index}
                    className={`flex flex-col items-center justify-center p-4 border-[5px] border-black rounded-[5px] shadow-[4px_4px_0_#1DACD6] transition-transform hover:-translate-y-1 ${boxStyle}`}
                  >
                    <i aria-hidden="true" className={`${iconClass} text-4xl mb-3`}></i>
                    <span className="text-center font-bold text-sm leading-tight">
                      {itemName}
                    </span>

                    {isNotFound && (
                      <span className="mt-2 text-xs bg-black text-white px-2 py-1 font-bold uppercase">
                        หาชื่อไม่เจอ
                      </span>
                    )}
                    {isPlaceholder && !isNotFound && (
                      <span className="mt-2 text-xs bg-black text-white px-2 py-1 font-bold uppercase">
                        รอใส่ไอคอน
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
