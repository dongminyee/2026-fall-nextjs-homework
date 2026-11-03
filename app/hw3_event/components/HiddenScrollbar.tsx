"use client";

export default function HiddenScrollbar() {
  return <style jsx global>{`
    * { scrollbar-width: none; -ms-overflow-style: none; }
    *::-webkit-scrollbar { display: none; }
  `}</style>;
}
