type RouteResult<TSuccess, TError> = { ok: true; data: TSuccess } | { ok: false; error: TError };

export const mapRouteResult = <TSuccess, TError, TSuccessResult, TErrorResult>(
  response: RouteResult<TSuccess, TError>,
  {
    onError,
    onSuccess,
  }: {
    onError: (error: TError) => TErrorResult;
    onSuccess: (data: TSuccess) => TSuccessResult;
  },
): TErrorResult | TSuccessResult => {
  if (!response.ok) {
    return onError(response.error);
  }

  return onSuccess(response.data);
};
