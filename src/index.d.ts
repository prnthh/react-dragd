import { FC } from 'react';

export interface DragDropItem {
  id: string;
  pos: { x: number; y: number };
  rot: { deg: number };
  zIndex: number;
  type: string;
  size: { width: number; height: number };
  [key: string]: any;
}

export interface DragDropProps {
  immutable?: boolean;
  saveCallback?: (items: Record<string, DragDropItem>) => void;
  onChangedCallback?: (items: Record<string, DragDropItem>) => void;
  initialState?: Record<string, DragDropItem>;
  pending?: boolean;
}

export const EditorModes: {
  EDIT: 'edit';
  VIEW: 'view';
};

declare const DragDrop: FC<DragDropProps>;
export default DragDrop;
