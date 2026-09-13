import { createOrUpdateRoot } from "../dom";
import type { JsxNode } from "../types";

export class JartComponent<Props, State> extends HTMLElement {
  static observedAttributes = [];

  protected props: Props = {} as Props;
  protected initialState: State = {} as State;
  protected state: State = {} as State;

  constructor() {
    // Always call super first in constructor
    super();
  }

  public setInitialProps(props: Props) {
    this.props = props;
    this.state = { ...this.initialState };
  }

  protected connectedCallback() {
    console.log("Custom element added to page.");

    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
    }

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

  protected setState(state: Partial<State>): void {
    this.state = { ...this.state, ...state };
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
    throw new Error("Jart components must implement a render() method.");
  }
}
