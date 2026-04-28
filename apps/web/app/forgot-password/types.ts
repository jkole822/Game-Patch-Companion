export interface ForgotPasswordActionState {
  error: string | null;
  success: string | null;
}

export const INITIAL_FORGOT_PASSWORD_STATE: ForgotPasswordActionState = {
  error: null,
  success: null,
};
