/**
 * Base class for all components.
 */
export default abstract class Component {
  /** The name of the component. */
  name: string;

  /**
   * Creates an instance of the Component class.
   * @param name - The name of the component.
   */
  constructor(name: string) {
    this.name = name;
  }
};
