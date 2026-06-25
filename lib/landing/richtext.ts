// Convert stored rich-text content into an HTML string.
// Accepts: HTML string, plain string, { html }, or a TipTap/ProseMirror JSON doc.

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function nodeToHtml(node: any): string {
  if (!node) return ''
  if (node.type === 'text') {
    let text = escapeHtml(node.text || '')
    for (const mark of node.marks || []) {
      if (mark.type === 'bold') text = `<strong>${text}</strong>`
      else if (mark.type === 'italic') text = `<em>${text}</em>`
      else if (mark.type === 'link') text = `<a href="${mark.attrs?.href || '#'}" target="_blank" rel="noopener">${text}</a>`
    }
    return text
  }
  const inner = (node.content || []).map(nodeToHtml).join('')
  switch (node.type) {
    case 'doc': return inner
    case 'paragraph': return `<p>${inner}</p>`
    case 'heading': return `<h${node.attrs?.level || 2}>${inner}</h${node.attrs?.level || 2}>`
    case 'bulletList': return `<ul>${inner}</ul>`
    case 'orderedList': return `<ol>${inner}</ol>`
    case 'listItem': return `<li>${inner}</li>`
    case 'blockquote': return `<blockquote>${inner}</blockquote>`
    case 'hardBreak': return '<br/>'
    default: return inner
  }
}

export function toHtml(content: unknown): string {
  if (!content) return ''
  if (typeof content === 'string') {
    // already HTML, or plain text
    return /<[a-z][\s\S]*>/i.test(content) ? content : `<p>${escapeHtml(content)}</p>`
  }
  if (typeof content === 'object') {
    const c = content as any
    if (typeof c.html === 'string') return c.html
    if (c.type === 'doc' || Array.isArray(c.content)) return nodeToHtml(c)
  }
  return ''
}
