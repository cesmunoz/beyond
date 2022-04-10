export const capitalize = (s: string): string =>
  s.substr(0, 1).toUpperCase() + s.substr(1).toLowerCase();

export const getInitials = (text: string): string => {
  const splitted = text.split(' ');

  if (splitted.length === 1) {
    return text.replace('-', '').replace('.', '').replace('_', '').substring(0, 2).toUpperCase();
  }

  const [first, second] = splitted;

  return `${first[0]}${second[0]}`.toUpperCase();
};
