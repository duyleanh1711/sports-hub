"use client";

import { useTranslations } from "next-intl";

import type { DataTableProps } from "@/types/table";

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
  TableColumn,
} from "@/components/ui/table";
import { Loader } from "@/components/ui/loader";

export function DataTable<T extends object>({
  data,
  columns,
  isPending,
  getRowKey,
  selectedKeys,
  onSelectionChange,
  selectionMode = "none",
}: DataTableProps<T>) {
  const t = useTranslations("admin.account.table");

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

        <TableBody
          items={data}
          renderEmptyState={
            isPending
              ? () => null
              : () => (
                  <div className="flex min-h-56 items-center justify-center sm:min-h-96">
                    {t("empty")}
                  </div>
                )
          }
        >
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

      {isPending && (
        <div className="absolute inset-0 z-10 grid place-content-center bg-bg/60 backdrop-blur-[1px]">
          <div className="flex items-center gap-2 text-muted-fg text-[15px]">
            <Loader variant="ring" className="size-6 text-primary" />
            {t("loading")}
          </div>
        </div>
      )}
    </div>
  );
}
