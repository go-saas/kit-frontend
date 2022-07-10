export class FriendlyError extends Error {
  public reason: string;
  public message: string;
  public wrap: any;

  constructor(reason: string, message: string, wrap?: any) {
    super(message || reason || wrap);
    this.reason = reason;
    this.message = message;
    this.wrap = wrap;
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, FriendlyError.prototype);
  }
}
