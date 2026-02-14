import type { Key, Selection } from "react-aria-components";

export type DataTableColumn<T> = {
  key: Key;
  title: string;
  isRowHeader?: boolean;
  className?: string;
  render?: (item: T) => React.ReactNode;
};

export type DataTableProps<T> = {
  data: T[];
  isPending?: boolean;
  selectedKeys?: Selection;
  getRowKey: (item: T) => Key;
  columns: DataTableColumn<T>[];
  onSelectionChange?: (keys: Selection) => void;
  selectionMode?: "none" | "single" | "multiple";
};
