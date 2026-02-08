"use client";

import type { DataTableProps } from "@/types/table";

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
  TableColumn,
} from "@/components/ui/table";

export function DataTable<T extends object>({
  data,
  columns,
  getRowKey,
  selectedKeys,
  onSelectionChange,
  selectionMode = "none",
}: DataTableProps<T>) {
  return (
    <div className="flex-1 overflow-y-auto">
      <Table
        selectionMode={selectionMode}
        selectedKeys={selectedKeys}
        onSelectionChange={onSelectionChange}
      >
        <TableHeader>
          {columns.map((col) => (
            <TableColumn
              key={col.key}
              isRowHeader={col.isRowHeader}
              className={col.className}
            >
              {col.title}
            </TableColumn>
          ))}
        </TableHeader>

        <TableBody items={data}>
          {(item) => (
            <TableRow key={getRowKey(item)}>
              {columns.map((col) => (
                <TableCell key={col.key}>
                  {/** biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                  {col.render ? col.render(item) : (item as any)[col.key]}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
