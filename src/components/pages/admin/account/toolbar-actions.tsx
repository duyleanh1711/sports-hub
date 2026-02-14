"use client";

import { TrashIcon, PlusIcon, FunnelIcon } from "@heroicons/react/24/outline";

import { AccountFilters } from "./filters";

import { Button } from "@/components/ui/button";
import { Menu, MenuContent, MenuItem } from "@/components/ui/menu";

import { CreateUserModal } from "@/components/modals/admin/user/create";

type AccountToolbarActionsProps = {
  selectedCount: number;
  onBulkDelete: () => void;
  t: (key: string, values?: Record<string, any>) => string;
};

export function AccountToolbarActions({
  t,
  onBulkDelete,
  selectedCount,
}: AccountToolbarActionsProps) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden items-center gap-2 lg:flex">
        <AccountFilters />

        {selectedCount > 0 && (
          <Button intent="danger" onPress={onBulkDelete} className="gap-2">
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

      {/* Mobile */}
      <div className="flex lg:hidden">
        <Menu>
          <Button intent="outline">
            <FunnelIcon className="size-4" />
          </Button>

          <MenuContent
            popover={{ placement: "bottom end" }}
            className="min-w-48"
          >
            <MenuItem>
              <AccountFilters />
            </MenuItem>

            <MenuItem>
              <CreateUserModal>
                <Button className="shrink-0 gap-2">
                  <PlusIcon className="size-4" />
                  {t("actions.addAccount")}
                </Button>
              </CreateUserModal>
            </MenuItem>

            {selectedCount > 0 && (
              <MenuItem onAction={onBulkDelete}>
                <div className="flex items-center gap-2 text-red-500">
                  <TrashIcon className="size-4" />
                  {t("actions.deleteSelected", { count: selectedCount })}
                </div>
              </MenuItem>
            )}
          </MenuContent>
        </Menu>
      </div>
    </>
  );
}
