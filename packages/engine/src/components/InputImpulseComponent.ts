import Component from './Component.js';

/**
 * A component that flags an entity to receive input impulses.
 */
export default class InputImpulseComponent extends Component {
  /**
   * Creates an instance of the InputImpulseComponent.
   */
  constructor() {
    super('InputImpulse');
  }
}
