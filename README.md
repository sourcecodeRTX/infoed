# 🖼️ Infographic Editor

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Built%20with-Next.js-000?logo=nextdotjs)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![Radix UI](https://img.shields.io/badge/UI%20Components-Radix%20UI-6E56CF?logo=radixui)](https://www.radix-ui.com/)
[![Zustand](https://img.shields.io/badge/State%20Management-Zustand-000?logo=zustand)](https://zustand-demo.pmnd.rs/)

---

## ✨ Overview

**Infographic Editor** is a modern, interactive web application for creating, editing, and exporting infographics. It features a drag-and-drop canvas, customizable nodes and edges, context menus, keyboard shortcuts, and export/import functionality. Built with Next.js, Tailwind CSS, Radix UI, and Zustand for state management, it offers a seamless and beautiful user experience.

---

## 🚀 Features

- 🎨 **Drag-and-Drop Canvas**: Easily add, move, and connect nodes.
- 🟢 **Customizable Nodes**: Support for different shapes (circle, rectangle, ellipse), colors, and styles.
- 🧩 **Context Menus**: Right-click for quick actions on nodes and canvas.
- ⌨️ **Keyboard Shortcuts**: Undo, redo, add, and delete nodes with your keyboard.
- 🗂️ **Sidebar**: Edit node properties and global styles.
- 📤 **Export**: Download your infographic as JSON or image (PNG/SVG).
- 📥 **Import**: Load infographics from JSON files.
- 🕹️ **Toolbar**: Undo/redo, fit view, and center canvas controls.
- 🌗 **Theme Support**: Light and dark mode with theme switcher.
- 🧩 **Radix UI Components**: Accessible, beautiful UI elements.

---


## 📺 Demo Video

<p align="center">
  <video src="public/demo.mp4" controls width="600">
    Your browser does not support the video tag.
  </video>
</p>


---

## 🏗️ Project Structure

```
├── app/                  # Next.js app directory
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # App layout
│   └── page.tsx          # Main page
├── components/           # UI and editor components
│   ├── infographic-editor.tsx  # Main editor logic
│   ├── canvas.tsx        # Canvas rendering
│   ├── custom-node.tsx   # Node rendering
│   ├── context-menu.tsx  # Context menu logic
│   ├── sidebar.tsx       # Sidebar for node/global editing
│   ├── toolbar.tsx       # Toolbar controls
│   └── ui/               # Radix UI-based components
├── hooks/                # Custom React hooks
│   ├── use-infographic-store.ts # Zustand store
│   ├── use-keyboard-shortcuts.ts
│   └── use-toast.ts
├── lib/                  # Utility functions
│   ├── export-utils.ts   # Export/import helpers
│   ├── graph-utils.ts    # Node/edge helpers
│   └── utils.ts          # Misc utilities
├── public/               # Static assets (images, video)
├── styles/               # Additional styles
├── types/                # TypeScript types
│   └── graph.ts          # Node/edge types
├── package.json          # Project metadata & scripts
└── ...
```

---

## 🛠️ Getting Started

### 1. **Clone the Repository**

```sh
git clone https://github.com/your-username/infographic-editor.git
cd infographic-editor_2
```

### 2. **Install Dependencies**

```sh
pnpm install
```

### 3. **Run the Development Server**

```sh
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📝 Usage

- **Add Nodes**: Click the canvas or use the sidebar to add root nodes.
- **Edit Nodes**: Select a node to edit its label, shape, and styles in the sidebar.
- **Connect Nodes**: Drag from one node's handle to another.
- **Context Menu**: Right-click nodes or canvas for quick actions.
- **Export/Import**: Use the sidebar to export as JSON/image or import from JSON.
- **Undo/Redo**: Use toolbar buttons or keyboard shortcuts (Ctrl+Z / Ctrl+Y).

---

## ⌨️ Keyboard Shortcuts

| Shortcut         | Action         |
|------------------|---------------|
| Ctrl + Z         | Undo          |
| Ctrl + Y         | Redo          |
| Delete           | Delete Node   |
| N                | Add Node      |
| B                | Toggle Sidebar|

---

## 🧑‍💻 Technologies Used

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [TypeScript](https://www.typescriptlang.org/)

---

## 📦 Scripts

| Command        | Description              |
|----------------|--------------------------|
| `pnpm dev`     | Start development server |
| `pnpm build`   | Build for production     |
| `pnpm start`   | Start production server  |
| `pnpm lint`    | Lint code                |

---

## 📁 Where to Place the Demo Video

- Place your demo video file (e.g., `demo.mp4`) in the `public/` directory.
- Reference it in the README using:

  ```markdown
  <video src="/demo.mp4" controls width="100%" />
  ```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- [Radix UI](https://www.radix-ui.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 💡 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📬 Contact

For questions or feedback, please open an issue or contact the maintainer.
