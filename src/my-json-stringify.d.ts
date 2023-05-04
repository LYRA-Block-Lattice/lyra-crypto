// customStringify.d.ts
declare function customStringify(
  obj: any,
  opts?: {
    cmp?: (
      a: { key: string; value: any },
      b: { key: string; value: any }
    ) => number;
    space?: number | string;
    cycles?: boolean;
    replacer?: (key: string, value: any) => any;
  }
): string;

export = customStringify;
