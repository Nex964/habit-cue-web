import '../../css/tiptap.css'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor, type Editor } from '@tiptap/react'
import { type Level } from '@tiptap/extension-heading';
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect, useState } from 'react'


// const blockTags = [
// 	"address",
// 	"article",
// 	"aside",
// 	"blockquote",
// 	"canvas",
// 	"dd",
// 	"div",
// 	"dl",
// 	"dt",
// 	"fieldset",
// 	"figcaption",
// 	"figure",
// 	"footer",
// 	"form",
// 	"h1",
// 	"h2",
// 	"h3",
// 	"h4",
// 	"h5",
// 	"h6",
// 	"header",
// 	"hr",
// 	"li",
// 	"main",
// 	"nav",
// 	"noscript",
// 	"ol",
// 	"output",
// 	"p",
// 	"pre",
// 	"section",
// 	"table",
// 	"tfoot",
// 	"ul",
// 	"video",
// 	"caption",
// 	"col",
// 	"colgroup",
// 	"tbody",
// 	"td",
// 	"tfoot",
// 	"th",
// 	"thead",
// 	"tr",
// 	"p",
// 	"br"
// ];

// const inlineTags = [
// 	"a",
// 	"abbr",
// 	"acronym",
// 	"audio",
// 	"b",
// 	"bdi",
// 	"bdo",
// 	"big",
// 	"cite",
// 	"code",
// 	"data",
// 	"datalist",
// 	"del",
// 	"dfn",
// 	"em",
// 	"i",
// 	"ins",
// 	"kbd",
// 	"map",
// 	"mark",
// 	"noscript",
// 	"output",
// 	"picture",
// 	"q",
// 	"ruby",
// 	"s",
// 	"samp",
// 	"script",
// 	"slot",
// 	"small",
// 	"span",
// 	"strong",
// 	"sub",
// 	"sup",
// 	"svg",
// 	"template",
// 	"time",
// 	"tt",
// 	"u",
// 	"var",
// 	"video",
// 	"wbr",
// 	"iframe",
// 	"source",
// 	"track"
// ];

// const inlineBlockTags = [
// 	"input",
// 	"textarea",
// 	"button",
// 	"select",
// 	"label",
// 	"progress",
// 	"meter",
// 	"embed",
// 	"object"
// ];

// const attributes = [
// 	"style",
// 	"align",
// 	"width",
// 	"height",
// 	"border",
// 	"cellspacing",
// 	"alt",
// 	"src",
// 	"srcset",
// 	"href",
// 	"rel",
// 	"target"
// ];

// const CustomElement = Node.create({
// 	name: "attributesPreserver",
// 	defining: true,

// 	addOptions() {
// 		const options = { tagname: null };
// 		attributes.forEach(attribute => {
// 			options[attribute] = null;
// 		});
// 		return options;
// 	},

// 	group() {
// 		const { tagname } = this.options;
// 		try {
// 			if (blockTags.includes(tagname)) return "block";
// 			if (inlineTags.includes(tagname)) return "inline";
// 			if (inlineBlockTags.includes(tagname)) return "inline";
// 		} catch (error) {
// 			console.warn(`Unknown tag encountered: ${tagname}`);
// 		}
// 		return "block";
// 	},

// 	content() {
// 		const { tagname } = this.options;
// 		try {
// 			if (inlineTags.includes(tagname)) return "inline*";
// 			if (blockTags.includes(tagname)) return "block*";
// 			if (inlineBlockTags.includes(tagname)) return "inline*";
// 		} catch (error) {
// 			console.warn(`Unknown tag encountered: ${tagname}`);
// 		}
// 		return "block*"; // Default to block content
// 	},

// 	addAttributes() {
// 		const attributesSet = { tagname: { default: null } };
// 		attributes.forEach(attribute => {
// 			attributesSet[attribute] = { default: null };
// 		});
// 		return attributesSet;
// 	},

// 	parseHTML() {
// 		return [
// 			// ...blockTags.map(tag => ({
// 			// 	tag,
// 			// 	priority: 100,
// 			// 	getAttrs: dom => {
// 			// 		const attributesSet = {
// 			// 			tagname: dom.nodeName.toLowerCase() || this.options.tagname
// 			// 		};
// 			// 		attributes.forEach(attribute => {
// 			// 			attributesSet[attribute] =
// 			// 				dom.getAttribute(attribute) || this.options[attribute];
// 			// 		});
// 			// 		return attributesSet;
// 			// 	}
// 			// })),
// 			...inlineTags.map(tag => ({
// 				tag,
// 				priority: 1,
// 				getAttrs: dom => {
// 					const attributesSet = {
// 						tagname: dom.nodeName.toLowerCase() || this.options.tagname
// 					};
// 					attributes.forEach(attribute => {
// 						attributesSet[attribute] =
// 							dom.getAttribute(attribute) || this.options[attribute];
// 					});
// 					return attributesSet;
// 				}
// 			})),
// 			// ...inlineBlockTags.map(tag => ({
// 			// 	tag,
// 			// 	priority: 100,
// 			// 	getAttrs: dom => {
// 			// 		const attributesSet = {
// 			// 			tagname: dom.nodeName.toLowerCase() || this.options.tagname
// 			// 		};
// 			// 		attributes.forEach(attribute => {
// 			// 			attributesSet[attribute] =
// 			// 				dom.getAttribute(attribute) || this.options[attribute];
// 			// 		});
// 			// 		return attributesSet;
// 			// 	}
// 			// }))
// 		];
// 	},

// 	renderHTML({ HTMLAttributes, node }) {
// 		return [
// 			node.attrs.tagname,
// 			mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
// 			0
// 		];
// 	}
// });

// CustomElement;


const MenuBar = ({editor}: { editor: Editor | null }) => {
  // const { editor } = useCurrentEditor()

  if (!editor) {
    return null
  }

  return (
    <div className="control-group m-2">
  <div className="button-group mx-2">
    {/* <button
      onClick={() => editor.chain().focus().toggleTaskList().run()}
      className={`mx-2 ${editor.isActive("taskList") ? "is-active" : ""}`}
    >
      ✅
    </button> */}
    <button
      onClick={() => editor.chain().focus().toggleBold().run()}
      disabled={!editor.can().chain().focus().toggleBold().run()}
      className={`mx-2 ${editor.isActive("bold") ? "is-active" : ""}`}
    >
      <strong>B</strong>
    </button>
    <button
      onClick={() => editor.chain().focus().toggleItalic().run()}
      disabled={!editor.can().chain().focus().toggleItalic().run()}
      className={`mx-2 ${editor.isActive("italic") ? "is-active" : ""}`}
    >
      <em>I</em>
    </button>
    <button
      onClick={() => editor.chain().focus().toggleStrike().run()}
      disabled={!editor.can().chain().focus().toggleStrike().run()}
      className={`mx-2 ${editor.isActive("strike") ? "is-active" : ""}`}
    >
      <s>S</s>
    </button>
    <button
      onClick={() => editor.chain().focus().toggleCode().run()}
      disabled={!editor.can().chain().focus().toggleCode().run()}
      className={`mx-2 ${editor.isActive("code") ? "is-active" : ""}`}
    >
      {"</>"}
    </button>
    <button onClick={() => editor.chain().focus().unsetAllMarks().run()} className="mx-2">
      ✖️ Marks
    </button>
    <button onClick={() => editor.chain().focus().clearNodes().run()} className="mx-2">
      ✖️ Nodes
    </button>
    <button
      onClick={() => editor.chain().focus().setParagraph().run()}
      className={`mx-2 ${editor.isActive("paragraph") ? "is-active" : ""}`}
    >
      ¶
    </button>
    {[1, 2, 3, 4, 5].map((level) => (
      <button
        key={level}
        onClick={() => editor.chain().focus().toggleHeading({ level } as { level: Level }).run()}
        className={`mx-2 ${editor.isActive("heading", { level }) ? "is-active" : ""}`}
      >
        H{level}
      </button>
    ))}
    <button
      onClick={() => editor.chain().focus().toggleBulletList().run()}
      className={`mx-2 ${editor.isActive("bulletList") ? "is-active" : ""}`}
    >
      • List
    </button>
    <button
      onClick={() => editor.chain().focus().toggleOrderedList().run()}
      className={`mx-2 ${editor.isActive("orderedList") ? "is-active" : ""}`}
    >
      1. List
    </button>
    <button
      onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      className={`mx-2 ${editor.isActive("codeBlock") ? "is-active" : ""}`}
    >
      {"</>"} Block
    </button>
    <button
      onClick={() => editor.chain().focus().toggleBlockquote().run()}
      className={`mx-2 ${editor.isActive("blockquote") ? "is-active" : ""}`}
    >
      ❝
    </button>
    <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className="mx-2">
      ───
    </button>
    <button onClick={() => editor.chain().focus().setHardBreak().run()} className="mx-2">
      ↵
    </button>
    <button
      onClick={() => editor.chain().focus().undo().run()}
      disabled={!editor.can().chain().focus().undo().run()}
      className="mx-2"
    >
      ↺
    </button>
    <button
      onClick={() => editor.chain().focus().redo().run()}
      disabled={!editor.can().chain().focus().redo().run()}
      className="mx-2"
    >
      ↻
    </button>
    <button
      onClick={() => editor.chain().focus().setColor("#958DF1").run()}
      className={`mx-2 ${editor.isActive("textStyle", { color: "#958DF1" }) ? "is-active" : ""}`}
    >
      🔵
    </button>
  </div>
</div>

  )
}

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  Underline,
  TaskItem.configure({
    nested: true,
  }),
  TaskList,
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: true, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: true, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
  // CustomElement,
  TextStyle.configure({ 
    // @ts-ignore
    types: [ListItem.name]
  }),
]

// const content = `
// <h2>
//   Hi there,
// </h2>
// <p>
//   this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
// </p>
// <ul>
//   <li>
//     That’s a bullet list with one …
//   </li>
//   <li>
//     … or two list items.
//   </li>
// </ul>
// <p>
//   Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
// </p>
// <pre><code class="language-css">body {
//   display: none;
// }</code></pre>
// <p>
//   I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
// </p>
// <blockquote>
//   Wow, that’s amazing. Good work, boy! 👏
//   <br />
//   — Mom
// </blockquote>
// `

export default ({content, onSave, loading}: {content: string, loading: boolean, onSave: (newNote: string) => void}) => {

  const [isEdited, setIsEdited] = useState(false);
  
  const editor = useEditor({
    extensions: extensions,
    content: '',
  })

  useEffect(() => {
    editor?.commands.setContent(content);
    setIsEdited(false);
  }, [content, editor]);

  useEffect(() => {
    setIsEdited(false);
  }, [loading])

  return (
    <>
    {/* <EditorProvider 
      editorContainerProps={{
        className: ""
      }}
      slotBefore={<MenuBar />} 
      extensions={extensions}
      // content={content}
      > */}
      <MenuBar editor={editor}/>
      <EditorContent onFocus={() => setIsEdited(true)} className='bg-zinc-700 rounded-sm m-2 p-2' editor={editor}>
      </EditorContent>

      {loading && <span className="loader"></span>}
      {isEdited && <button onClick={() => onSave(editor?.getHTML() || "")} className='px-4 py-2 m-2 mt-1 transition duration-300 
        hover:shadow-lg hover:bg-blue-400
        
        active:shadow-none active:bg-blue-600 active:text-gray-200
        shadow-md text-sm bg-blue-500 text-gray-800 font-medium w-fit rounded-sm'>Save</button>}

    {/* </EditorProvider> */}
    </>
  )
}