"use client";

import { useState } from "react";

import {
  TrashIcon,
  PencilSquareIcon,
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";

import {
  useDemoteUser,
  usePromoteUser,
  useUpdateUserStatus,
} from "@/react-query/mutation/user";
import type { User, UserStatus } from "@/types/user";
import { STATUS_OPTIONS } from "@/constants/status/status-options";

import {
  Menu,
  MenuItem,
  MenuTrigger,
  MenuContent,
  MenuSeparator,
} from "@/components/ui/menu";

import { UpdateUserModal } from "@/components/modals/admin/user/update";
import { DeleteUserModal } from "@/components/modals/admin/user/delete";

type AccountRowActionsProps = {
  user: User;
  t: (key: string) => string;
};

export function AccountRowActions({ user, t }: AccountRowActionsProps) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const tToast = (key: string) => t(`updateStatus.${key}`);
  const tRoleToast = (key: string) => t(`updateRole.${key}`);

  const { mutate: updateStatus, isPending: isStatusPending } =
    useUpdateUserStatus(tToast);

  const { mutate: promoteUser, isPending: isPromotePending } =
    usePromoteUser(tRoleToast);

  const { mutate: demoteUser, isPending: isDemotePending } =
    useDemoteUser(tRoleToast);

  const isPending = isStatusPending || isPromotePending || isDemotePending;

  const handleUpdateStatus = (status: UserStatus) => {
    if (status === user.status) return;

    updateStatus({
      userId: user.id,
      status,
    });
  };

  const handlePromote = () => {
    if (user.is_superuser) return;
    promoteUser(user.id);
  };

  const handleDemote = () => {
    if (!user.is_superuser) return;
    demoteUser(user.id);
  };

  return (
    <>
      <Menu>
        <MenuTrigger className="size-6">
          <EllipsisVerticalIcon />
        </MenuTrigger>

        <MenuContent placement="left top">
          <MenuItem onAction={() => setOpenEdit(true)}>
            <PencilSquareIcon className="size-4" />
            {t("actions.edit")}
          </MenuItem>

          <MenuSeparator />

          {STATUS_OPTIONS.map((status) => {
            const Icon = status.icon;
            const isCurrent = user.status === status.key;

            return (
              <MenuItem
                key={status.key}
                isDisabled={isCurrent || isPending}
                onAction={() => handleUpdateStatus(status.key as UserStatus)}
              >
                {Icon && <Icon className="size-4" />}
                {t(`status.${status.i18nKey}`)}
              </MenuItem>
            );
          })}

          <MenuSeparator />

          <MenuItem
            isDisabled={user.is_superuser || isPending}
            onAction={handlePromote}
          >
            <ArrowUpCircleIcon className="size-4" />
            {t("actions.promote")}
          </MenuItem>

          <MenuItem
            isDisabled={!user.is_superuser || isPending}
            onAction={handleDemote}
          >
            <ArrowDownCircleIcon className="size-4" />
            {t("actions.demote")}
          </MenuItem>

          <MenuSeparator />

          <MenuItem intent="danger" onAction={() => setOpenDelete(true)}>
            <TrashIcon className="size-4" />
            {t("actions.delete")}
          </MenuItem>
        </MenuContent>
      </Menu>

      <UpdateUserModal
        open={openEdit}
        userId={user.id}
        onOpenChange={setOpenEdit}
      />

      <DeleteUserModal
        open={openDelete}
        userId={user.id}
        onOpenChange={setOpenDelete}
      />
    </>
  );
}
