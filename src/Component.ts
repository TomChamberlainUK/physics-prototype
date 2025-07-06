export default class Component {
  name: string;
  data: Record<string, unknown>;

  constructor(name: string, data: Record<string, unknown>) {
    this.name = name;
    this.data = data;
  }
};
