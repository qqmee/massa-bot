export function formatter(input: string, escapeAll = false) {
  let result = input
    .replaceAll('!', '\\!')
    .replaceAll('{', '\\{')
    .replaceAll('}', '\\}')
    .replaceAll('=', '\\=')
    .replaceAll('<', '\\<')
    .replaceAll('>', '\\>')
    .replaceAll('-', '\\-')
    .replaceAll(':', '\\:')
    .replaceAll('+', '\\+')
    .replaceAll('(', '\\(')
    .replaceAll(')', '\\)')
    .replaceAll('[', '\\[')
    .replaceAll(']', '\\]')
    .replaceAll('.', '\\.')
    .replaceAll('/', '\\/')
    .replaceAll('|', '\\|');

  if (escapeAll) {
    result = result
      .replaceAll('_', '\\_') // это
      .replaceAll('*', '\\*') // форматирование
      .replaceAll('`', '\\`') // MarkdownV2
      .replaceAll('#', '\\#'); // MarkdownV2
  }

  return result;
}
