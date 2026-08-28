/**
 * Types
 */

type ElementType = string;

/** A single JSX node. */
type JsxNode = string | VirtualElement<string>;

/** One or multiple JSX nodes that can be used as an element's children. */
type JsxChildren = JsxNode | JsxNode[];

interface JsxChildrenProps {
  /** Direct child text, a single JSX element or multiple JSX elements. */
  children?: JsxChildren;
}

export interface VirtualElement<Key> {
  type: ElementType;
  tagName: Key;
  props: Key extends keyof HTMLElementTagNameMap
    ? HTMLElementTagNameMap[Key]
    : unknown;
  children: JsxChildren;
}

/** Normal HTML or SVG element props, with manual JSX ones pruned out. Children are handled explicitly. */
type JsxProps<ElementTag> = Partial<Omit<ElementTag, "children">> &
  JsxChildrenProps;

declare global {
  export namespace JSX {
    type ElementIntrinsicElements = {
      // TODO(alec): Handle SVGs
      [Key in keyof HTMLElementTagNameMap]: JsxProps<
        HTMLElementTagNameMap[Key]
      >;
    };

    type IntrinsicElements = ElementIntrinsicElements;
  }
}

export type Fragment = VirtualElement<"fragment">; // TODO(alec): Don't hardcode to a div

const createRealElement = <Key>(
  virtualElement: VirtualElement<Key>,
): Element => {
  const element = document.createElement(
    virtualElement.tagName as keyof HTMLElementTagNameMap,
  );

  // Copy props over
  Object.assign(element, virtualElement.props);

  return element;
};

/*
 * Functions
 */
export const createVirtualElement = (
  type: string,
  props: { type: string; children?: JsxChildren },
): VirtualElement<string> => {
  console.debug(type, props);
  const { children, ...rest } = props;

  return {
    type,
    tagName: type as keyof HTMLElementTagNameMap,
    props: rest,
    children: children ?? [],
  };
};

export const jsx = (
  type: ElementType,
  props: { type: string; children?: JsxChildren },
): VirtualElement<string> => {
  return createVirtualElement(type, props);
};

export const jsxs = (
  type: ElementType,
  props: { type: string; children?: JsxChildren },
): VirtualElement<string> => {
  return jsx(type, props);
};

export const jsxDEV = jsx;
