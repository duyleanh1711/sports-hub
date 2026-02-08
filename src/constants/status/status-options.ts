import {
  ClockIcon,
  NoSymbolIcon,
  CheckCircleIcon,
  PauseCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export const STATUS_OPTIONS = [
  { key: "active", i18nKey: "active", icon: CheckCircleIcon },
  { key: "inactive", i18nKey: "inactive", icon: PauseCircleIcon },
  { key: "pending", i18nKey: "pending", icon: ClockIcon },
  { key: "suspended", i18nKey: "suspended", icon: ExclamationTriangleIcon },
  { key: "banned", i18nKey: "banned", icon: NoSymbolIcon },
];
