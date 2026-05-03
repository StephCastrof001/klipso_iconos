import { useCallback } from 'react'

interface DragDropTree {
  onDragStart: (elementId: string, componentType: string, sourceId: string | null) => void
  onDragOver: (elementId: string | null) => void
  onDrop: (targetId: string | null, draggedId: string, componentType: string | null) => void
}

export function useDragDropTree(nodeId: string): DragDropTree {
  return {
    onDragStart: useCallback(
      (elementId: string, componentType: string, sourceId: string | null) => {
        console.log('Drag start:', elementId, componentType, sourceId)
      },
      [nodeId]
    ),
    onDragOver: useCallback(
      (elementId: string | null) => {
        if (elementId) {
          console.log('Drag over:', elementId)
        }
      },
      [nodeId]
    ),
    onDrop: useCallback(
      (targetId: string | null, draggedId: string, componentType: string | null) => {
        if (targetId && componentType) {
          console.log('Drop:', targetId, draggedId)
        }
      },
      [nodeId]
    )
  }
}

export default useDragDropTree
