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

  /** Specific style override to allow partial style declarations. */
  style?: Partial<CSSStyleDeclaration>;
}

export interface VirtualElement<Key> {
  type: ElementType;
  tagName: Key;
  props: Key extends keyof HTMLElementTagNameMap
    ? HTMLElementTagNameMap[Key]
    : Record<string, unknown>;
  children: JsxChildren;
}

/** Normal HTML or SVG element props, with manual JSX ones pruned out. Children are handled explicitly. */
type JsxProps<ElementTag> = Partial<Omit<ElementTag, "children" | "style">> &
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

export type Fragment = VirtualElement<"fragment">;

const applyProps = (element: Element, props: Record<string, unknown>): void => {
  const { style, ...rest } = props;
  Object.assign(element, rest);

  if (element instanceof HTMLElement) {
    // Inline styles must be added via a props spread like `element.style = props.style`;
    Object.assign(element.style, style);
  }
};

/**
 * Turns a single JSX element into a real DOM element, or text node.
 * Recursively calls createRealNode on this element's children to create real DOM nodes from them too.
 *
 * @example
 * createRealElement("hello"); === "hello" text node
 * createRealElement(<div />); === HTMLDivElement instance
 */
export const createRealNode = (virtualElement: JsxNode): Node => {
  const isTextNode = typeof virtualElement === "string";

  if (isTextNode) {
    return document.createTextNode(virtualElement);
  }

  const element = document.createElement(
    virtualElement.tagName as keyof HTMLElementTagNameMap,
  );

  // Copy props over
  applyProps(element, virtualElement.props);

  if (Array.isArray(virtualElement.children)) {
    const childElements = virtualElement.children.map(createRealNode);
    element.append(...childElements);
  } else {
    const childElement = createRealNode(virtualElement.children);
    element.appendChild(childElement);
  }

  console.debug(element, virtualElement);

  return element;
};

/*
 * Functions
 */

/** Turns a raw parsed JSX object into a virtual element. */
export const createVirtualElement = (
  type: string,
  props: { type: string; children?: JsxChildren },
): VirtualElement<string> => {
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
