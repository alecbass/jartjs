/**
 * Types
 */

export type FunctionComponent<Props = unknown> = (props: Props) => JsxNode;

/** Raw strings like "div", or a function component. */
export type ElementType = string | FunctionComponent;

/** A single JSX node. */
export type JsxNode = string | number | VirtualElement<string>;

/** One or multiple JSX nodes that can be used as an element's children. */
export type JsxChildren = JsxNode | JsxNode[];

interface JsxChildrenProps {
  /** Direct child text, a single JSX element or multiple JSX elements. */
  children?: JsxChildren;

  /** Specific style override to allow partial style declarations. */
  style?: Partial<CSSStyleDeclaration>;
}

export interface VirtualElement<Key> {
  type: ElementType;
  tagName: Key;
  props: Key extends keyof HTMLElementTagNameMap
    ? HTMLElementTagNameMap[Key]
    : Key extends keyof SVGElementTagNameMap
      ? SVGElementTagNameMap[Key]
      : Record<string, unknown>;
  children: JsxChildren;
}

export type Fragment = VirtualElement<"fragment">;

/** Normal HTML or SVG element props, with manual JSX ones pruned out. Children are handled explicitly. */
type JsxProps<ElementTag> = Partial<Omit<ElementTag, "children" | "style">> &
  JsxChildrenProps;

type HTMLElementIntrinsicElements = {
  [Key in keyof HTMLElementTagNameMap]: JsxProps<HTMLElementTagNameMap[Key]>;
};

type SVGElementIntrinsicElements = {
  [Key in keyof SVGElementTagNameMap]: JsxProps<SVGElementTagNameMap[Key]>;
};

declare global {
  export namespace JSX {
    type IntrinsicElements = HTMLElementIntrinsicElements &
      SVGElementIntrinsicElements;
  }
}
