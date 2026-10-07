import { JartComponent } from "../components";
import type { JsxNode } from "../types";

const applyProps = (element: Element, props: Record<string, unknown>): void => {
  const { style, ...rest } = props;
  Object.assign(element, rest);

  if (element instanceof HTMLElement || element instanceof SVGElement) {
    // Inline styles must be added via a props spread like `element.style = props.style`;
    Object.assign(element.style, style);
  }
};

const createOrUseExistingNode = (
  tagName: keyof HTMLElementTagNameMap,
  props: Record<string, unknown>,
): Element => {
  const newElement = document.createElement(tagName);

  if (newElement instanceof JartComponent) {
    // Generic components have generic props, which we don't know here. The compile-time type checking should catch
    // any issues
    newElement.initialiseFromProps(props as any);
  }

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

  const isArray = Array.isArray(virtualElement);

  if (isArray) {
    return virtualElement.flatMap((e) => createDomNode(e, parentNode));
  }

  if (typeof virtualElement.type === "function") {
    // Special case: render function component children. The component itself exists in the virtual DOM, but all real
    // DOM elements will become children of its parent
    const fcResult = virtualElement.type({
      ...virtualElement.props,
      // The rendered JSX needs to know of this component's children in case it uses them
      children: virtualElement.children,
    });

    return createDomNode(fcResult, parentNode);
  }

  const element = createOrUseExistingNode(
    virtualElement.tagName as keyof HTMLElementTagNameMap,
    virtualElement.props,
  );

  // Copy props over
  applyProps(element, virtualElement.props);

  //
  // TODO(alec): Find the diff between new and existing elements, and update existing ones
  //

  const virtualChildren = Array.isArray(virtualElement.children)
    ? virtualElement.children
    : [virtualElement.children];
  const childElements = virtualChildren.flatMap((virtualElement) =>
    createDomNode(virtualElement, element),
  );
  element.replaceChildren(...childElements);

  return [element];
};

/**
 * Top-level function used to turn JSX into child nodes of a parent.
 * Recursively goes through each JSX child element and adds it as a real DOM element as a child of rootElement, or updates an existing one in-place.
 */
export const createOrUpdateRoot = (
  jsxNode: JsxNode,
  rootNode: ParentNode,
): void => {
  const domRootNodes = createDomNode(jsxNode, rootNode);

  rootNode.replaceChildren(...domRootNodes);
};
