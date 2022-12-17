import { Editor, MarkdownView, Menu, Workspace } from "obsidian";

type ContextMenuClickHandler<T = unknown> = (evt: MouseEvent | KeyboardEvent, editor: Editor, view: MarkdownView) => T | Promise<T>;

export class ContextMenu {
    title: string;
    icon: string;
    onClick: ContextMenuClickHandler

    constructor(title: string, icon: string, onClick: ContextMenuClickHandler) {
        this.title = title;
        this.icon = icon;
        this.onClick = onClick
    }

    private createMenuItem(menu: Menu, editor: Editor, view: MarkdownView) {
        return menu.addItem(item =>
            item.setIcon(this.icon)
                .setTitle(this.title)
                .onClick((evt) => this.onClick(evt, editor, view)))
    }

    register(workspace: Workspace) {
        return workspace.on("editor-menu", this.createMenuItem.bind(this));
    }
}