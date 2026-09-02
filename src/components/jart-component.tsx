import { createOrUpdateRoot } from "../dom";
import type { JsxNode } from "../types";

export class JartComponent extends HTMLElement {
  static observedAttributes = [];

  constructor() {
    // Always call super first in constructor
    super();
  }

  protected connectedCallback() {
    console.log("Custom element added to page.");
    this.attachShadow({ mode: "open" });
    this.update();
  }

  protected disconnectedCallback() {
    console.log("Custom element removed from page.");
  }

  protected connectedMoveCallback() {
    console.log("Custom element moved with moveBefore()");
  }

  protected adoptedCallback() {
    console.log("Custom element moved to new page.");
  }

  protected attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string,
  ) {
    console.log(
      `Attribute ${name} has changed from ${oldValue} to ${newValue}.`,
    );
    this.update();
  }

  private update() {
    if (!this.shadowRoot) {
      throw new Error("Tried to update JartJS element with no shadow root");
    }

    const jsx = this.render();
    createOrUpdateRoot(jsx, this.shadowRoot);
  }

  protected render(): JsxNode {
    return <div>Jart component</div>;
  }
}

customElements.define("jart-component", JartComponent);

declare global {
  interface HTMLElementTagNameMap {
    "jart-component": JartComponent;
  }
}
