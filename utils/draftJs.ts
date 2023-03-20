import { convertToRaw, ContentState, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import dynamic from 'next/dynamic'
// const htmlToDraft = dynamic(
// 	() => import('html-to-draftjs').then((mod) => mod.Editor),
// 	{ ssr: false }
// )

export const htmlToDraftJs = (html: string) => {
	let htmlToDraft = null
	if (typeof window === 'object') {
		htmlToDraft = require('html-to-draftjs').default
	}
	const contentBlock = htmlToDraft(html)
	if (contentBlock) {
		const contentState = ContentState.createFromBlockArray(
			contentBlock.contentBlocks
		)
		const editorState = EditorState.createWithContent(contentState)
		return editorState
	}
	return undefined
}

export const draftJsToHtml = (editor: EditorState | undefined) => {
	let htmlFromEditor = ''
	if (editor)
		htmlFromEditor = draftToHtml(convertToRaw(editor.getCurrentContent()))
	return htmlFromEditor
}
