interface Props {
  title: string;
}

export const Component = ({ title }: Props) => (
  <div title={title}>
    <div>Function component</div>
    <span>Function span</span>
  </div>
);
