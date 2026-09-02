import type { JsxChildren, ElementType, VirtualElement } from "./types";

/** Turns a raw parsed JSX object into a virtual element. */
export const createVirtualElement = (
  type: ElementType,
  props: { type: string; children?: JsxChildren },
): VirtualElement<string> => {
  const { children, ...rest } = props;
  const tagName =
    typeof type === "function"
      ? type.name
      : (type as keyof HTMLElementTagNameMap);

  return {
    type,
    tagName,
    props: rest,
    children: children ?? [],
  };
};
