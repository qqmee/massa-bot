export async function importMenu(path: string) {
  const { default: menu } = await import(path);
  return menu;
}
