export type Guest = {
  _id: string;
  name: string;
  invited?: boolean;
  accepted?: boolean;
  checked_in?: boolean;
};
