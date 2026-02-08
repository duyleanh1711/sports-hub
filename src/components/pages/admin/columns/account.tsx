import type { useTranslations } from "next-intl";

import type { User } from "@/types/user";
import type { DataTableColumn } from "@/types/table";

import { STATUS_ICON } from "@/constants/status/status-icon";
import { STATUS_BADGE } from "@/constants/status/status-badge";

import { Badge } from "@/components/ui/badge";

import { AccountRowActions } from "../account/actions";

export function getAccountColumns(
  t: ReturnType<typeof useTranslations>,
): DataTableColumn<User>[] {
  return [
    {
      key: "fullname",
      title: t("table.fullname"),
      isRowHeader: true,
      render: (u) => (
        <span className="font-medium max-w-45 truncate block">
          {u.fullname}
        </span>
      ),
    },
    {
      key: "email",
      title: t("table.email"),
      render: (u) => <span className="max-w-55 truncate block">{u.email}</span>,
    },
    {
      key: "phone",
      title: t("table.phone"),
      render: (u) => u.phone || "-",
    },
    {
      key: "role",
      title: t("table.role"),
      render: (u) => (u.is_superuser ? t("role.admin") : t("role.user")),
    },
    {
      key: "status",
      title: t("table.status"),
      render: (u) => {
        const Icon = STATUS_ICON[u.status];

        return (
          <Badge intent={STATUS_BADGE[u.status]}>
            <span className="flex items-center gap-1.5">
              <Icon className="size-4" />
              {t(`status.${u.status}`)}
            </span>
          </Badge>
        );
      },
    },
    {
      key: "created_at",
      title: t("table.createdAt"),
      render: (u) => new Date(u.created_at).toLocaleDateString("vi-VN"),
    },
    {
      key: "actions",
      title: "",
      render: (u) => <AccountRowActions user={u} t={t} />,
    },
  ];
}
