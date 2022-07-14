export class FriendlyError extends Error {
  public code: number;
  public reason: string;
  public message: string;
  public wrap: any;

  constructor(code: number, reason: string, message: string, wrap?: any) {
    super(message || reason || wrap);
    this.code = code;
    this.reason = reason;
    this.message = message;
    this.wrap = wrap;
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, FriendlyError.prototype);
  }
}
