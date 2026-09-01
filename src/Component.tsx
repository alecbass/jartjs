import type { JsxNode, JsxChildren } from "./jsx-runtime";

interface Props {
  title: string;
  children: JsxChildren;
  renderLastChild: () => JsxNode;
}

export const Component = ({ title, children, renderLastChild }: Props) => (
  <div title={title}>
    <div>Function component</div>
    <span>Function span</span>
    <div title="Children will render here">
      <span> {children}</span>
    </div>
    {renderLastChild()}
  </div>
);
