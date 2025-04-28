export function helperFunctionSample(param: number) {
  return 10 * param;
}
export const getUsername = (user?: { firstName: string; lastName: string }, firstCharacter: boolean = false) => {
  const { firstName = '', lastName = '' } = user ?? {};
  let fullName = `${firstName} ${lastName}`;
  if (firstName && !lastName) fullName = firstName;
  if (fullName.trim()) {
    return firstCharacter ? firstName?.charAt(0) || lastName?.charAt(0) : fullName;
  }

  return '-';
};
