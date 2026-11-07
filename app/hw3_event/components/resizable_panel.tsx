"use client";

import React, { useEffect, useRef, useState, type ReactNode } from "react";

interface ResizablePanelProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}

export default function ResizablePanel({
  leftPanel,
  rightPanel,
  initialWidth = 600,
  minWidth = 320,
  maxWidth = 850,
}: ResizablePanelProps) {
  const [width, setWidth] = useState(initialWidth);

  // ----------- implement here -----------
  const [isDragging, setIsDragging] = useState(false);
  const dragX = useRef(0);
  const dragWidth = useRef(initialWidth);

  useEffect(() =>{
    if(!isDragging) return;

    const handlePtrMove = (event: PointerEvent) =>{
      const nextWidth = dragWidth.current + event.clientX - dragX.current;
      const w = Math.min(maxWidth, Math.max(minWidth, nextWidth));

      setWidth(w);
    };

    const handlePtrUp = ()=>{
      setIsDragging(false);
    };

    window.addEventListener("pointermove", handlePtrMove);
    window.addEventListener("pointerup", handlePtrUp);


    return ()=>{
      window.removeEventListener("pointermove", handlePtrMove);
      window.removeEventListener("pointerup", handlePtrUp);
    }
  }, [isDragging, maxWidth, minWidth]);

  const handlePtrDn = (event: React.PointerEvent<HTMLDivElement>) =>{
    event.preventDefault();
    dragX.current = event.clientX;
    dragWidth.current = width;
    setIsDragging(true);
  }

  // ------------------------------------

  return (
    <div
      // ----------- implement here -----------

      // ------------------------------------
      className="flex h-full"
    >
      <div style={{ width, background: '#ffffff', overflow: 'auto' }} className="p-4">
        {leftPanel}
      </div>
      <div
        // ----------- implement here -----------
        onPointerDown={handlePtrDn}
        // ------------------------------------
        style={{
          width: "5px",
          cursor: "col-resize",
          background: '#f0f0f0',
          margin: "0",
          position: "relative",
          userSelect: "none",
          touchAction: "none",
          transition: "all 0.2s ease"
        }}
        className="group"
      >
        {/* 기본 상태의 중앙 드래그 라인 */}
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-[#cccccc] transform -translate-x-1/2 group-hover:bg-transparent transition-all"></div>

        {/* 호버/드래그 시 나타나는 핫핑크 라인 */}
        <div className="absolute top-0 bottom-0 left-1/2 w-0 bg-[#e54c65] transform -translate-x-1/2 group-hover:w-[3px] transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-[0_0_4px_rgba(229,76,101,0.5)] group-hover:shadow-[0_0_4px_rgba(229,76,101,0.5)]"></div>

      </div>
      <div style={{ flex: 1, background: '#ffffff', overflow: 'auto' }} className="p-4">
        {rightPanel}
      </div>
    </div>
  );
}
