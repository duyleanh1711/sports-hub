import {
  ClockIcon,
  XCircleIcon,
  NoSymbolIcon,
  CheckCircleIcon,
  PauseCircleIcon,
} from "@heroicons/react/24/solid";

import type { UserStatus } from "@/types/user";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const STATUS_ICON: Record<UserStatus, React.ComponentType<any>> = {
  active: CheckCircleIcon,
  inactive: XCircleIcon,
  pending: ClockIcon,
  suspended: PauseCircleIcon,
  banned: NoSymbolIcon,
};
