import type { JsxNode } from "../types";
import { component } from "./decorators";
import { JartComponent } from "./jart-component";

interface State {
  count: number;
}

@component("child-component")
export class ParentComponent extends JartComponent<{}, State> {
  protected render(): JsxNode {
    const { count } = this.state;

    return <child-component count={count} />;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "parent-component": ParentComponent;
  }
}
