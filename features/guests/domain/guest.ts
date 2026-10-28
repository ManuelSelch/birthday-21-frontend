import type { GuestAssignments } from "./assignments";

export type Guest = GuestAssignments & {
  _id: string;
  name: string;
  invited?: boolean;
  companion?: boolean;
  accepted?: boolean | null;
  checked_in?: boolean | null;
};
