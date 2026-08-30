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
  key: string;
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

const parentKeyGenerator = keyGeneratorFunction();

const setOrUseKey = (element: Element): string => {
  const existingKey = element.getAttribute("jsx-key")!;

  if (existingKey) {
    return existingKey;
  }

  const key = parentKeyGenerator.next().value!.toString();
  element.setAttribute("jsx-key", key);

  return key;
};

const applyProps = (element: Element, props: Record<string, unknown>): void => {
  const { style, ...rest } = props;
  Object.assign(element, rest);

  if (element instanceof HTMLElement) {
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
const createRealNode = (virtualElement: JsxNode, parentNode: ParentNode) => {
  const isTextNode = typeof virtualElement === "string";

  if (isTextNode) {
    return document.createTextNode(virtualElement);
  }

  const element = createOrUseExistingNode(
    virtualElement.key,
    virtualElement.tagName as keyof HTMLElementTagNameMap,
    parentNode,
  );
  console.debug(element, virtualElement);

  // Copy props over
  applyProps(element, virtualElement.props);

  //
  // TODO(alec): Find the diff between new and existing elements, and update existing ones
  //

  const virtualChildren = Array.isArray(virtualElement.children)
    ? virtualElement.children
    : [virtualElement.children];

  const childElements = virtualChildren.map((virtualElement) =>
    createRealNode(virtualElement, element),
  );
  element.append(...childElements);

  return element;
};

/**
 * Top-level function used to turn JSX into child nodes of a parent.
 * Recursively goes through each JSX child element and adds it as a real DOM element as a child of rootElement, or updates an existing one in-place.
 */
export const createOrUpdateRoot = (
  jsxNode: JsxNode,
  rootElement: Element,
): void => {
  const realNodeRoot = createRealNode(jsxNode, rootElement);

  rootElement.appendChild(realNodeRoot);
};

/** Turns a raw parsed JSX object into a virtual element. */
export const createVirtualElement = (
  type: string,
  props: { type: string; children?: JsxChildren },
): VirtualElement<string> => {
  const { children, ...rest } = props;
  const key = parentKeyGenerator.next().value!.toString();

  return {
    type,
    tagName: type as keyof HTMLElementTagNameMap,
    props: rest,
    key,
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
