/**
 * Control scheme for inputs.
 */
export type ControlScheme = {
  /** The key to listen for. */
  key: string;
  /** The action to perform when the key is pressed. */
  action: string;
}[];
