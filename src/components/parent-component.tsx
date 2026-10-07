import type { JsxNode } from "../types";
import { component } from "./decorators";
import { JartComponent } from "./jart-component";

interface State {
  count: number;
}

@component("parent-component")
export class ParentComponent extends JartComponent<{}, State> {
  protected initialState: State = { count: 0 };

  protected connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener("click", () => {
      const { count } = this.state;

      this.setState({ count: count + 1 });
    });
  }

  protected render(): JsxNode {
    const { count } = this.state;

    return (
      <div
        style={{
          display: "flex",
          flexFlow: "column",
          border: "1px solid white",
        }}
      >
        My parent component
        <child-component count={count} />
      </div>
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "parent-component": ParentComponent;
  }
}
