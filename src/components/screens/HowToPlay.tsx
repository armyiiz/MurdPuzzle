import React from 'react';

export function HowToPlay() {
  return (
    <div className="animate-fadeIn max-w-4xl mx-auto pb-24 px-4">
      <div className="murdle-card">
        <h2 className="murdle-section-title mb-6 border-b-[4px] border-black pb-4 flex items-center gap-3">
          <span className="text-4xl">🔍</span> คู่มือการสืบสวน: วิธีไขคดี Murdle
        </h2>

        <p className="murdle-body font-bold mb-8">
          สวมบทเป็น <strong className="bg-murdle-paper px-2 py-1 border-[2px] border-black">&quot;นักสืบโลจิโก&quot;</strong> แล้วออกไปลากคอคนร้ายมาลงโทษ! ในแต่ละคดี คุณต้องไขปริศนาให้ได้ว่า <strong className="text-murdle-accent">ใคร</strong> คือคนร้าย, ใช้ <strong className="text-murdle-accent">อาวุธ</strong> ชิ้นไหน และลงมือที่ <strong className="text-murdle-accent">สถานที่</strong> ใด
        </p>

        <section className="murdle-panel mb-10">
          <h3 className="text-xl font-bold mb-4 text-black border-b-[2px] border-black pb-2 inline-block">1. เครื่องมือทำมาหากิน: ตารางตรรกะ</h3>
          <p className="text-black mb-4 font-bold">หัวใจของเกมนี้คือการเชื่อมโยงข้อมูล 3 หมวดหมู่ (ผู้ต้องสงสัย, อาวุธ, สถานที่) เข้าด้วยกัน</p>
          <ul className="space-y-3 text-black font-bold list-disc list-inside marker:text-black">
            <li><strong>แตะ 1 ครั้ง (❌):</strong> เพื่อตัดความเป็นไปได้ทิ้ง (เมื่อมั่นใจว่า &quot;ไม่ใช่&quot;)</li>
            <li><strong>แตะ 2 ครั้ง (✅):</strong> เพื่อยืนยันความถูกต้อง (เมื่อมั่นใจว่า &quot;ใช่!&quot;)</li>
            <li className="mt-4 p-3 bg-murdle-error border-[2px] border-black">
              <strong>🚨 กฎเหล็ก:</strong> ในหนึ่งแถวหรือคอลัมน์ จะมี ✅ ได้เพียงช่องเดียวเท่านั้น ถ้าคุณพี่ใส่ ✅ แล้ว ระบบจะช่วยตัดช่องอื่นในแถวนั้นเป็น ❌ ให้ทันทีค่ะ
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h3 className="text-2xl font-bold mb-6 text-black border-b-[3px] border-black pb-2">2. ตัวอย่างประเภทคำใบ้และการตีความ</h3>
          <p className="text-black mb-6 font-bold">ใน Murdle คำใบ้จะไม่บอกตรงๆ เสมอไป คุณพี่ต้องหัดอ่านใจคนร้ายและสังเกตสิ่งแวดล้อม ดังนี้ค่ะ:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="murdle-card-compact">
              <h4 className="text-lg font-bold mb-3 text-black flex items-center gap-2"><span className="text-2xl">📌</span> คำใบ้จากประวัติ</h4>
              <p className="text-black mb-2">บางครั้งคำใบ้จะพูดถึง &quot;ลักษณะทางกายภาพ&quot; ของผู้ต้องสงสัย</p>
              <div className="bg-murdle-paper p-3 border-[2px] border-black mb-2 text-sm italic">
                <strong>ตัวอย่าง:</strong> &quot;ผู้ต้องสงสัยที่ตัวสูงที่สุดไม่เคยเฉียดเข้าไปในตู้โดยสารท้ายขบวนเลย&quot;
              </div>
              <p className="text-black text-sm">
                <strong>วิธีคิด:</strong> เปิดดู Profile เพื่อเช็คส่วนสูง (เช่น รองประธานมอฟ สูง 5&#39;8&quot; ซึ่งสูงที่สุด) แล้วไปกา ❌ ที่ช่อง รองประธานมอฟ + ตู้โดยสารท้ายขบวน
              </p>
            </div>

            <div className="murdle-card-compact">
              <h4 className="text-lg font-bold mb-3 text-black flex items-center gap-2"><span className="text-2xl">📌</span> คำใบ้จากสถานที่และวัตถุพยาน</h4>
              <div className="bg-murdle-paper p-3 border-[2px] border-black mb-2 text-sm italic">
                <strong>ตัวอย่าง:</strong> &quot;ศพถูกพบอยู่ภายในอ่างอาบน้ำหินอ่อน&quot;
              </div>
              <p className="text-black text-sm">
                <strong>วิธีคิด:</strong> มองหา &quot;สถานที่&quot; ที่มีอ่างอาบน้ำ (เช่น ห้องน้ำขนาดมหึมา) สถานที่นี้แหละคือ <strong>สถานที่เกิดเหตุจริง</strong> ของคดีนั้น!
              </p>
            </div>

            <div className="murdle-card-compact">
              <h4 className="text-lg font-bold mb-3 text-black flex items-center gap-2"><span className="text-2xl">📌</span> คำใบ้แบบ &quot;ถ้า...ไม่ใช่...ก็คือ...&quot;</h4>
              <div className="bg-murdle-paper p-3 border-[2px] border-black mb-2 text-sm italic">
                <strong>ตัวอย่าง:</strong> &quot;ไม่เชือกก็ลูกดอกอาบยาพิษนี่แหละที่ถูกพบอยู่ใกล้กำแพงกราฟฟิตี้&quot;
              </div>
              <p className="text-black text-sm">
                <strong>วิธีคิด:</strong> ถ้าคุณพี่รู้จากคำใบ้อื่นแล้วว่าเชือกไม่ได้อยู่ที่นั่น แสดงว่าลูกดอกต้องอยู่ที่กำแพงกราฟฟิตี้แน่นอน
              </p>
            </div>

            <div className="murdle-panel">
              <h4 className="text-lg font-bold mb-3 text-black flex items-center gap-2"><span className="text-2xl">📌</span> คำใบ้รหัสลับ - ระดับยาก!</h4>
              <p className="text-murdle-muted mb-2">บางครั้งชมรมนักสืบจะส่งรหัสลับมาให้ ซึ่งมักจะเป็นรหัสแบบแทนที่ตัวอักษร หรือผสมคำในชุดเดียวกัน</p>
              <div className="bg-murdle-bg p-3 border-[2px] border-black mb-2 text-sm font-mono text-murdle-accent">
                <strong>ตัวอย่าง:</strong> &quot;ZTVMG RMP SZW Z NVWRFN-DVRTSG DVZKLM&quot;
              </div>
              <p className="text-murdle-muted text-sm">
                <strong>วิธีคิด:</strong> เมื่อถอดรหัสออกมาจะได้ความว่า <em>&quot;AGENT INK HAD A MEDIUM-WEIGHT WEAPON&quot;</em> (เอเยนต์อิงค์พกอาวุธน้ำหนักปานกลาง) คุณพี่ต้องลองสังเกตตัวอักษรที่สลับกันดูนะคะ!
              </p>
            </div>
          </div>
        </section>

        <section className="murdle-card mb-10">
          <h3 className="text-xl font-bold mb-4 text-black border-b-[2px] border-black pb-2 inline-block">3. ขั้นตอนการลงมือสืบ</h3>
          <ol className="space-y-4 text-black font-bold list-decimal list-inside marker:font-bold marker:text-lg">
            <li className="pl-2 border-l-[3px] border-black mb-2"><strong className="text-lg">อ่านเนื้อเรื่อง:</strong> เพื่อหาจุดเริ่มต้น (เช่น พบศพที่ไหน หรือใครทำอะไรอยู่)</li>
            <li className="pl-2 border-l-[3px] border-black mb-2"><strong className="text-lg">เก็บข้อมูลประวัติ:</strong> ดูว่าใครสูงเท่าไหร่, ถนัดข้างไหน หรือตาสีอะไร ข้อมูลพวกนี้ใช้ร่วมกับคำใบ้ได้บ่อยมาก</li>
            <li className="pl-2 border-l-[3px] border-black mb-2"><strong className="text-lg">เติมตาราง:</strong> ค่อยๆ ไล่จากคำใบ้ที่ชัดเจนที่สุดไปหาจุดที่ซับซ้อน</li>
            <li className="pl-2 border-l-[3px] border-black mb-2"><strong className="text-lg">กล่าวหา:</strong> เมื่อตารางสมบูรณ์และได้ข้อสรุป &quot;ใคร-อะไร-ที่ไหน&quot; ที่เชื่อมโยงกันแล้ว ให้กดฟ้องศาลได้เลย!</li>
          </ol>
        </section>

        <section className="murdle-card !bg-murdle-accent text-white">
          <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">✨ ทริคจากอลิซ:</h3>
          <p className="text-lg font-bold italic leading-relaxed">
            &quot;อย่าลืมดู <strong className="bg-murdle-paper text-black px-2 py-1 border border-black">น้ำหนักอาวุธ</strong> (เบา, ปานกลาง, มาก) ในรายละเอียดอาวุธนะคะ บางคำใบ้จะบอกแค่น้ำหนัก ไม่บอกชื่ออาวุธโดยตรง เป็นจุดที่คนร้ายมักจะพลาดทิ้งร่องรอยไว้บ่อยๆ ค่ะ!&quot;
          </p>
        </section>

      </div>
    </div>
  );
}
