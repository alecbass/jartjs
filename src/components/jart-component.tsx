import { createOrUpdateRoot } from "../dom";
import type { JsxNode } from "../types";

export class JartComponent<Props, State> extends HTMLElement {
  static observedAttributes = [];

  /** The current props value. */
  protected props: Props = {} as Props;

  /** Initial state, should be implemented on a class-wide basis so every instance starts with this state. */
  protected initialState: State = {} as State;

  /** The current state value. */
  protected state: State = {} as State;

  constructor() {
    // Always call super first in constructor
    super();
  }

  /** This should not be overriden. It sets up the initial props and state values. */
  public initialiseFromProps(props: Props) {
    this.props = props;
    this.state = { ...this.initialState };
  }

  protected connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
    }

    this.update();
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
