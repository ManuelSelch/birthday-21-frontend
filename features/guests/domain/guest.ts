export type Guest = {
  _id: string;
  name: string;
  invited?: boolean;
  accepted?: boolean | null;
  checked_in?: boolean | null;
};
