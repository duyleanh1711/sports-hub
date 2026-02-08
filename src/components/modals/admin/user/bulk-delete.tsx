"use client";

import { useTranslations } from "next-intl";

import { useBulkDeleteUsers } from "@/react-query/mutation/user";

import {
  Modal,
  ModalTitle,
  ModalClose,
  ModalHeader,
  ModalFooter,
  ModalContent,
  ModalDescription,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";

type BulkDeleteUsersModalProps = {
  open: boolean;
  userIds: string[];
  onSuccess?: () => void;
  onOpenChange: (open: boolean) => void;
};

export function BulkDeleteUsersModal({
  open,
  userIds,
  onSuccess,
  onOpenChange,
}: BulkDeleteUsersModalProps) {
  const t = useTranslations("admin.account.modals.bulkDelete");

  const { mutate, isPending } = useBulkDeleteUsers(t, () => {
    onOpenChange(false);
    onSuccess?.();
  });

  const handleConfirm = () => {
    if (userIds.length === 0) return;
    mutate(userIds);
  };

  return (
    <Modal isOpen={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-md!">
        <ModalHeader>
          <ModalTitle>{t("title", { count: userIds.length })}</ModalTitle>
          <ModalDescription>{t("description")}</ModalDescription>
        </ModalHeader>

        <ModalFooter className="flex justify-end gap-2">
          <ModalClose>{t("actions.cancel")}</ModalClose>

          <Button
            intent="danger"
            onPress={handleConfirm}
            isDisabled={isPending}
            className="gap-2"
          >
            {isPending && <Loader variant="ring" className="size-4" />}
            {t("actions.confirm")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
