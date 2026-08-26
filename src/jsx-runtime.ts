export type Fragment = unknown;

export const createElement = (type: string, props: unknown): any => {
  return {};
};

export const jsx = (type: string, props: unknown): any => {
  return {};
};

export const jsxs = (type: string, props: unknown): any => {
  return {};
};

export const jsxDEV = jsx;

declare global {
  export namespace JSX {
    // …
    interface IntrinsicElements {
      foo: unknown;
      div: Partial<HTMLDivElement>;
    }
  }
}
