import { useTranslations } from "next-intl";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Pagination,
  PaginationList,
  PaginationItem,
  PaginationNext,
  PaginationLast,
  PaginationFirst,
  PaginationPrevious,
} from "@/components/ui/pagination";

type DataTablePaginationProps = {
  page: number;
  pages: number[];
  hasNext: boolean;
  hasPrev: boolean;
  totalPages: number;
  onPageChange: (p: number | ((p: number) => number)) => void;
};

export function DataTablePagination({
  page,
  pages,
  hasNext,
  hasPrev,
  totalPages,
  onPageChange,
}: DataTablePaginationProps) {
  const t = useTranslations("admin.pagination");

  return (
    <Pagination className="flex-1 justify-end">
      <PaginationList>
        <Tooltip delay={0}>
          <TooltipTrigger>
            <PaginationFirst
              onPress={() => onPageChange(1)}
              isDisabled={!hasPrev}
            />
          </TooltipTrigger>
          <TooltipContent>{t("first")}</TooltipContent>
        </Tooltip>

        <Tooltip delay={0}>
          <TooltipTrigger>
            <PaginationPrevious
              onPress={() => onPageChange((p) => p - 1)}
              isDisabled={!hasPrev}
            />
          </TooltipTrigger>
          <TooltipContent>{t("prev")}</TooltipContent>
        </Tooltip>

        {pages.map((p) => (
          <PaginationItem
            key={p}
            isCurrent={p === page}
            onPress={() => onPageChange(p)}
          >
            {p}
          </PaginationItem>
        ))}

        <Tooltip delay={0}>
          <TooltipTrigger>
            <PaginationNext
              onPress={() => onPageChange((p) => p + 1)}
              isDisabled={!hasNext}
            />
          </TooltipTrigger>
          <TooltipContent>{t("next")}</TooltipContent>
        </Tooltip>

        <Tooltip delay={0}>
          <TooltipTrigger>
            <PaginationLast
              onPress={() => onPageChange(totalPages)}
              isDisabled={!hasNext}
            />
          </TooltipTrigger>
          <TooltipContent>{t("last")}</TooltipContent>
        </Tooltip>
      </PaginationList>
    </Pagination>
  );
}
