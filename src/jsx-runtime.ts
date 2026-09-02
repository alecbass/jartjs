/**
 * Types
 */

type FunctionComponent = (props: unknown) => JsxNode;

/** Raw strings like "div", or a function component. */
type ElementType = string | FunctionComponent;

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

/*
 * Functions
 */

function* keyGeneratorFunction(): Generator<number, void, unknown> {
  let id = 0;

  while (true) {
    yield ++id;
  }
}

const applyProps = (element: Element, props: Record<string, unknown>): void => {
  const { style, ...rest } = props;
  Object.assign(element, rest);

  if (element instanceof HTMLElement || element instanceof SVGElement) {
    // Inline styles must be added via a props spread like `element.style = props.style`;
    Object.assign(element.style, style);
  }
};

const createOrUseExistingNode = (
  key: string,
  tagName: keyof HTMLElementTagNameMap,
  parent: ParentNode,
): Element => {
  const existingChild = parent.querySelector(`[jsx-key="${key}"]`);

  if (existingChild) {
    return existingChild;
  }

  const newElement = document.createElement(tagName);
  newElement.setAttribute("jsx-key", key);

  return newElement;
};

/**
 * Turns a single JSX element into a real DOM element, or text node.
 * Recursively calls createRealNode on this element's children to create real DOM nodes from them too.
 *
 * @example
 * createRealElement("hello"); === "hello" text node
 * createRealElement(<div />); === HTMLDivElement instance
 */
const createDomNode = (
  virtualElement: JsxNode,
  parentNode: ParentNode,
  key: string,
): Node[] => {
  if (virtualElement === null || virtualElement === undefined) {
    return [];
  }

  const isNumberNode = typeof virtualElement === "number";

  if (isNumberNode) {
    return [document.createTextNode(virtualElement.toString())];
  }

  const isTextNode = typeof virtualElement === "string";

  if (isTextNode) {
    return [document.createTextNode(virtualElement)];
  }

  const keyGenerator = keyGeneratorFunction();
  const isArray = Array.isArray(virtualElement);

  if (isArray) {
    return virtualElement.flatMap((e) => {
      const nextKey = keyGenerator.next().value!;
      return createDomNode(e, parentNode, nextKey.toString());
    });
  }

  if (typeof virtualElement.type === "function") {
    // Special case: render function component children. The component itself exists in the virtual DOM, but all real
    // DOM elements will become children of its parent
    const fcResult = virtualElement.type({
      ...virtualElement.props,
      children: virtualElement.children,
    });

    return createDomNode(fcResult, parentNode, "0");
  }

  const element = createOrUseExistingNode(
    key,
    virtualElement.tagName as keyof HTMLElementTagNameMap,
    parentNode,
  );

  // Copy props over
  applyProps(element, virtualElement.props);

  //
  // TODO(alec): Find the diff between new and existing elements, and update existing ones
  //

  const virtualChildren = Array.isArray(virtualElement.children)
    ? virtualElement.children
    : [virtualElement.children];
  const childElements = virtualChildren.flatMap((virtualElement) => {
    const nextKey = keyGenerator.next().value!;
    return createDomNode(virtualElement, element, nextKey.toString());
  });
  element.replaceChildren(...childElements);

  return [element];
};

/**
 * Top-level function used to turn JSX into child nodes of a parent.
 * Recursively goes through each JSX child element and adds it as a real DOM element as a child of rootElement, or updates an existing one in-place.
 */
export const createOrUpdateRoot = (
  jsxNode: JsxNode,
  rootElement: Element,
): void => {
  const key = rootElement.getAttribute("jsx-key") ?? "0";
  const domRootNodes = createDomNode(jsxNode, rootElement, key);

  rootElement.replaceChildren(...domRootNodes);
};

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

export const jsx = (
  type: ElementType,
  props: { type: string; children?: JsxChildren },
): VirtualElement<string> => createVirtualElement(type, props);

export const jsxs = (
  type: ElementType,
  props: { type: string; children?: JsxChildren },
): VirtualElement<string> => jsx(type, props);

export const jsxDEV = jsx;
