"use client";

import { useTranslations } from "next-intl";

import { useDeleteUser } from "@/react-query/mutation/user";

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

type DeleteUserModalProps = {
  open: boolean;
  userId: string;
  onOpenChange: (open: boolean) => void;
};

export function DeleteUserModal({
  open,
  userId,
  onOpenChange,
}: DeleteUserModalProps) {
  const t = useTranslations("admin.account.modals.delete");

  const { mutate, isPending } = useDeleteUser(t, () => onOpenChange(false));

  const handleDelete = () => {
    mutate(userId);
  };

  return (
    <Modal isOpen={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-md!">
        <ModalHeader>
          <ModalTitle>{t("title")}</ModalTitle>
          <ModalDescription>{t("description")}</ModalDescription>
        </ModalHeader>

        <ModalFooter className="flex justify-end gap-2">
          <ModalClose>{t("actions.cancel")}</ModalClose>

          <Button intent="danger" onPress={handleDelete} isDisabled={isPending}>
            {isPending && <Loader variant="ring" className="size-4" />}
            {t("actions.confirm")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
