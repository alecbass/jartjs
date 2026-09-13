import type { JsxNode } from "../types";
import { JartComponent } from "./jart-component";

interface Props {
  userId: number;
  name: string;
}

interface State {
  clicks: number;
}

export class UserAvatar extends JartComponent<Props, State> {
  protected initialState: State = {
    clicks: 0,
  };

  private handleClick = (): void => {
    const { clicks } = this.state;
    this.setState({ clicks: clicks + 1 });
  };

  render(): JsxNode {
    const { userId, name } = this.props;
    const { clicks } = this.state;

    return (
      <div
        style={{ border: "2px solid #FFFFFF", padding: "1rem" }}
        onclick={this.handleClick}
      >
        User {userId} - {name} - {clicks}
      </div>
    );
  }
}

customElements.define("user-avatar", UserAvatar);

declare global {
  interface HTMLElementTagNameMap {
    "user-avatar": UserAvatar;
  }
}
