export type Province = {
  code: number;
  name: string;
};

export type Ward = {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  district_code: number;
};

export type District = {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  province_code: number;
};

export type AreaOption = {
  code: number;
  name: string;
};

export type SelectedArea = {
  province?: AreaOption;
  district?: AreaOption;
  ward?: AreaOption;
};

export type LocationItem = {
  label: string;
  value: string;
  icon?: React.ReactNode;
};

export type Country = {
  code: string;
  name: string;
  flag: string;
  callingCode: string;
};

export type RestCountry = {
  cca2: string;
  name: {
    common: string;
  };
  flags: {
    png?: string;
    svg?: string;
  };
  idd?: {
    root?: string;
    suffixes?: string[];
  };
};
