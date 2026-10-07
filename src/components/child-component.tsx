import type { JsxNode } from "../types";
import { component } from "./decorators";
import { JartComponent } from "./jart-component";

interface Props {
  count: number;
}

@component("child-component")
export class ChildComponent extends JartComponent<Props, {}> {
  protected render(): JsxNode {
    const { count } = this.props;

    return <div>Count is {count}</div>;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "child-component": ChildComponent;
  }
}
