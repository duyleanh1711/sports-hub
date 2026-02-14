"use client";

import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";
import type { Selection } from "react-aria-components";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

import { useDebounce } from "@/hooks/use-debounce";
import { getPageRange } from "@/utils/get-page-range";
import { useAccountParams } from "@/nuqs/use-account-params";

import { useUsers } from "@/react-query/query/user";

import { Button } from "@/components/ui/button";
import { Description } from "@/components/ui/field";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";

import { AccountFilters } from "@/components/pages/admin/account/filters";
import { getAccountColumns } from "@/components/pages/admin/columns/account";

import { CreateUserModal } from "@/components/modals/admin/user/create";
import { BulkDeleteUsersModal } from "@/components/modals/admin/user/bulk-delete";

import { DataTable } from "@/components/shared/data-table/data-table";
import { DataTableToolbar } from "@/components/shared/data-table/data-table-toolbar";
import { DataTablePagination } from "@/components/shared/data-table/data-table-pagination";

export default function AccountPage() {
  const t = useTranslations("admin.account");

  const { page, limit, search, filters, setPage, updateSearch } =
    useAccountParams();

  const [searchInput, setSearchInput] = useState(search);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

  const [openBulkDelete, setOpenBulkDelete] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    updateSearch(debouncedSearch);
  }, [debouncedSearch, updateSearch]);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const { data } = useUsers({
    page,
    limit,
    filters,
    search: search || undefined,
    search_in: "fullname,email",
  });

  const {
    results: users = [],
    page: currentPage = 1,
    has_next: hasNext = false,
    has_prev: hasPrev = false,
    total_pages: totalPages = 1,
  } = data?.data ?? {};

  const columns = getAccountColumns(t);
  const pages = getPageRange(currentPage, totalPages);

  const selectedCount =
    selectedKeys === "all" ? users.length : selectedKeys.size;

  const selectedUserIds: string[] =
    selectedKeys === "all"
      ? users.map((u) => u.id)
      : Array.from(selectedKeys).map(String);

  return (
    <>
      <Card className="h-[calc(100vh-65px)] flex flex-col gap-2 p-4">
        <CardHeader className="p-0 flex">
          <DataTableToolbar
            title={t("title")}
            searchValue={searchInput}
            description={t("description")}
            onSearchChange={setSearchInput}
            searchPlaceholder={t("searchPlaceholder")}
            actions={
              <div className="flex items-center gap-2">
                <AccountFilters />

                {selectedCount > 0 && (
                  <Button
                    intent="danger"
                    onPress={() => setOpenBulkDelete(true)}
                    className="gap-2"
                  >
                    <TrashIcon className="size-4" />
                    {t("actions.deleteSelected", { count: selectedCount })}
                  </Button>
                )}

                <CreateUserModal>
                  <Button className="shrink-0 gap-2">
                    <PlusIcon className="size-4" />
                    {t("actions.addAccount")}
                  </Button>
                </CreateUserModal>
              </div>
            }
          />
        </CardHeader>

        <DataTable
          data={users}
          columns={columns}
          getRowKey={(u) => u.id}
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        />

        <CardFooter className="flex items-center justify-center sm:justify-between border-0! mt-auto pt-2! px-0!">
          <Description className="flex-1 hidden sm:block text-muted-fg [&>strong]:text-fg">
            {selectedCount > 0
              ? t.rich("selection.selected", {
                  count: selectedCount,
                  strong: (c) => <strong>{c}</strong>,
                })
              : t("selection.none")}
          </Description>

          <DataTablePagination
            pages={pages}
            hasNext={hasNext}
            hasPrev={hasPrev}
            page={currentPage}
            onPageChange={setPage}
            totalPages={totalPages}
          />
        </CardFooter>
      </Card>

      <BulkDeleteUsersModal
        open={openBulkDelete}
        userIds={selectedUserIds}
        onOpenChange={setOpenBulkDelete}
        onSuccess={() => setSelectedKeys(new Set())}
      />
    </>
  );
}
