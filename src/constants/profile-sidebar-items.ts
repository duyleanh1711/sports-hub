import {
  ClockIcon,
  UserCircleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export const PROFILE_SIDEBAR_ITEMS = [
  {
    key: "account",
    href: "/profile/account",
    icon: UserCircleIcon,
  },
  {
    key: "security",
    href: "/profile/security",
    icon: ShieldCheckIcon,
  },
  {
    key: "loginHistory",
    href: "/profile/login-history",
    icon: ClockIcon,
  },
];
