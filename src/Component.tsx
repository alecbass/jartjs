import type { JsxNode, JsxChildren, FunctionComponent } from "./types";

interface Props {
  title: string;
  children: JsxChildren;
  renderLastChild: () => JsxNode;
}

export const Component: FunctionComponent<Props> = ({
  title,
  children,
  renderLastChild,
}: Props) => (
  <div title={title}>
    <span>
      {children}
      <span>HEHE</span>
    </span>
    {renderLastChild()}
  </div>
);
