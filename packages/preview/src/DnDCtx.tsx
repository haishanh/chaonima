import { DndContext, useDraggable } from "@dnd-kit/core";
import { useState } from "react";

type Coordinates = {
  x: number;
  y: number;
};
const defaultCoordinates = {
  x: 0,
  y: 0,
};

function Draggable({
  children,
  top,
  left,
}: {
  children: React.ReactNode;
  top: number;
  left: number;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "draggable",
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      className="border border-sky-400 relative w-40"
      ref={setNodeRef}
      style={{ ...style, top, left }}
    >
      <button
        {...listeners}
        {...attributes}
        className="cursor-grab inline-flex w-3 p-4 rounded-md"
        style={{
          touchAction: "none",
        }}
      >
        <svg
          viewBox="0 0 20 20"
          width="12"
          fill="#919eab"
          style={{
            flex: "0 0 auto",
          }}
        >
          <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
        </svg>
      </button>
      {children}
    </div>
  );
}

export function DnDCtx() {
  const [{ x, y }, setCoordinates] = useState<Coordinates>(defaultCoordinates);

  return (
    <DndContext
      onDragEnd={({ delta }) => {
        setCoordinates(({ x, y }) => {
          return {
            x: x + delta.x,
            y: y + delta.y,
          };
        });
      }}
    >
      <Draggable top={y} left={x}>
        Drag me
      </Draggable>
    </DndContext>
  );
}
