export const getAppUrl = (path: string) => {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
};
