interface UserName {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  suffix?: string;
}

export function getFullName(user: UserName): string {
  if (!user) return "";

  const { firstName = "", middleName = "", lastName = "", suffix = "" } = user;

  // Filter out empty parts and join them with spaces
  return [firstName, middleName, lastName, suffix].filter(Boolean).join(" ");
}
