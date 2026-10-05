export const component =
  <Component extends CustomElementConstructor>(
    tagName: string,
  ): ((comp: Component) => Component) =>
  (comp: Component): Component => {
    customElements.define(tagName, comp);
    return comp;
  };
