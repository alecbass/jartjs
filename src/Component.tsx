import type { JsxNode, JsxChildren } from "./jsx-runtime";

interface Props {
  title: string;
  children: JsxChildren;
  renderLastChild: () => JsxNode;
}

export const Component = ({ title, children, renderLastChild }: Props) => (
  <div title={title}>
    <span>
      {children}
      <span>HEHE</span>
    </span>
    {renderLastChild()}
  </div>
);
