import type {
  Fragment,
  JsxChildren,
  ElementType,
  VirtualElement,
} from "./types";
import { createVirtualElement } from "./virtual-element";

/*
 * Functions
 */

export const jsx = (
  type: ElementType,
  props: { type: string; children?: JsxChildren },
): VirtualElement<string> => createVirtualElement(type, props);

export const jsxs = (
  type: ElementType,
  props: { type: string; children?: JsxChildren },
): VirtualElement<string> => jsx(type, props);

export const jsxDEV = jsx;

export type { Fragment };
