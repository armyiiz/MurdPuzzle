"use client";

import React, { useEffect, useState } from "react";

// ดึงข้อมูล
import level1 from "../../data/level1.json";
import level2 from "../../data/level2.json";
import level3 from "../../data/level3.json";
import level4 from "../../data/level4.json";
import masterData from "../../data/dailymasterdata.json";

export default function DebugIconsPage() {
  const [missingLog, setMissingLog] = useState<string[]>([]);

  // รวมคดีทั้งหมด (ป้องกัน Error ถ้าดึงข้อมูลไม่ได้)
  const allCases: any[] = [
    ...(Array.isArray(level1) ? level1 : []),
    ...(Array.isArray(level2) ? level2 : []),
    ...(Array.isArray(level3) ? level3 : []),
    ...(Array.isArray(level4) ? level4 : []),
  ];

  // ฟังก์ชันสกัดชื่อไอเทมจาก Array "categories" ในแต่ละคดี
  const getUniqueItems = (categoryId: string) => {
    const items = allCases.flatMap((c) => {
      const category = c.categories?.find((cat: any) => cat.id === categoryId);
      return category ? category.items : [];
    });
    return Array.from(new Set(items)); // ตัดตัวซ้ำออก
  };

  const categories = [
    { id: "suspects", title: "ผู้ต้องสงสัย (Suspects)", items: getUniqueItems("suspects") },
    { id: "weapons", title: "อาวุธ (Weapons)", items: getUniqueItems("weapons") },
    { id: "locations", title: "สถานที่ (Locations)", items: getUniqueItems("locations") },
    { id: "motives", title: "แรงจูงใจ (Motives)", items: getUniqueItems("motives") },
  ];

  useEffect(() => {
    const missing: string[] = [];
    categories.forEach((cat) => {
      const masterCatList = (masterData as any)[cat.id] || [];
      
      cat.items.forEach((itemName: any) => {
        // ค้นหาว่าใน dailymasterdata มีชื่อนี้ไหม
        const foundInMaster = masterCatList.find((m: any) => m.name === itemName);
        
        if (!foundInMaster) {
          missing.push(`[${cat.id}] ❌ สะกดชื่อไม่ตรงกัน: "${itemName}"`);
          console.warn(`⚠️ ไม่มีชื่อนี้ใน Master Data:`, itemName);
        } else if (!foundInMaster.icon || foundInMaster.icon.includes("fa-circle-question")) {
          missing.push(`[${cat.id}] ⚠️ ยังไม่ได้ตั้งไอคอน (ใช้ตัวสำรอง): "${itemName}"`);
          console.warn(`⚠️ ไอคอนเป็นตัวสำรอง:`, itemName);
        }
      });
    });
    setMissingLog(missing);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-8 font-mono text-black">
      <div className="max-w-6xl mx-auto">
        
        {/* Header สไตล์ Neo-Brutalism */}
        <div className="bg-[#FF90E8] border-4 border-black p-6 mb-8 shadow-[4px_4px_0_0_#000]">
          <h1 className="text-3xl font-black uppercase tracking-widest mb-2">
            🕵️‍♀️ ศูนย์บัญชาการเช็กไอคอน (Debug V.2)
          </h1>
          <p className="font-bold">
            สแกนจากข้อมูลจริง! <br/>
            <span className="text-white bg-red-600 px-2 border-2 border-black inline-block mt-1">สีแดง</span> = สะกดชื่อในไฟล์คดี ไม่ตรงกับไฟล์ Master Data<br/>
            <span className="text-black bg-yellow-400 px-2 border-2 border-black inline-block mt-1">สีเหลือง</span> = ข้อมูลตรงกัน แต่คุณ Jules เผลอใส่ไอคอนเครื่องหมายคำถามไว้
          </p>
        </div>

        {/* สรุปยอดตัวที่พัง */}
        {missingLog.length > 0 ? (
          <div className="bg-red-400 border-4 border-black p-4 mb-8 shadow-[4px_4px_0_0_#000]">
            <h2 className="font-bold text-xl mb-2">🚨 พบปัญหา {missingLog.length} รายการ!</h2>
            <div className="max-h-64 overflow-y-auto bg-white border-2 border-black p-4">
              <ul className="list-disc pl-6 space-y-1">
                {missingLog.map((log, i) => (
                  <li key={i} className="font-bold text-sm">{log}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="bg-green-400 border-4 border-black p-4 mb-8 shadow-[4px_4px_0_0_#000]">
            <h2 className="font-bold text-xl">✅ เยี่ยมมาก! ข้อมูลเป๊ะ ไอคอนครบทุกตัว!</h2>
          </div>
        )}

        {/* Grid แสดงผลแต่ละหมวดหมู่ */}
        {categories.map((cat) => (
          <div key={cat.id} className="mb-12">
            <h2 className="text-2xl font-black mb-4 border-b-4 border-black inline-block pb-1">
              {cat.title} ({cat.items.length} รายการในเกม)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {cat.items.map((itemName: any, index) => {
                const masterCatList = (masterData as any)[cat.id] || [];
                const foundInMaster = masterCatList.find((m: any) => m.name === itemName);
                
                const isNotFound = !foundInMaster;
                const isPlaceholder = foundInMaster?.icon?.includes("fa-circle-question");
                const iconClass = foundInMaster?.icon || "fa-solid fa-circle-question";

                let boxStyle = "bg-white text-black";
                if (isNotFound) boxStyle = "bg-red-500 text-white";
                else if (isPlaceholder) boxStyle = "bg-yellow-300 text-black";

                return (
                  <div
                    key={index}
                    className={`flex flex-col items-center justify-center p-4 border-4 border-black shadow-[4px_4px_0_0_#000] transition-transform hover:-translate-y-1 ${boxStyle}`}
                  >
                    <i className={`${iconClass} text-4xl mb-3`}></i>
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