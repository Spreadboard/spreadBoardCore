import MainMenu from './main-menu';
import NodeMenu from './node-menu';
import VueItem from './menu/Item.vue';
import VueMenu from './menu/Menu.vue';
import VueSearch from './menu/Search.vue';
import { Component, NodeEditor } from 'rete';
import menu from './menu';


interface Plugin {
    name: string;
    install: (context: any, options?: any) => void;
}
declare type PluginParams<T extends Plugin> = T['install'] extends (arg1: unknown, arg2: infer U) => void ? U : void;



function install(editor: NodeEditor, {
    searchBar = true,
    searchKeep = () => false,
    delay = 1000,
    items = {},
    nodeItems = {
        delete: {
            title: "Delete",
        },
        clone: {
            title: "Clone"
        }
    },
    allocate = (comp: Component) => {return [] as string[]},
    rename = (component: Component) => component.name,
    vueComponent = null
}) {
    editor.bind('hidecontextmenu');
    editor.bind('showcontextmenu');

    let mainMenu: MainMenu;
    let currentMenu: menu;

    //@ts-ignore
    editor.on('hidecontextmenu', () => {
        if (currentMenu) currentMenu.hide();
    });

    //@ts-ignore
    editor.on('click contextmenu', () => {
        //@ts-ignore
        editor.trigger('hidecontextmenu');
    });

    editor.on('contextmenu', ({ e, node }) => {
        e.preventDefault();
        e.stopPropagation();

        //@ts-ignore
        if (!editor.trigger('showcontextmenu', { e, node })) return;

        const [x, y] = [e.clientX, e.clientY];
        let args;

        if(node) {
            currentMenu = new NodeMenu(editor, { searchBar: false, delay }, vueComponent, nodeItems);
            args = { node };
        } else {
            if (!mainMenu)
                mainMenu = new MainMenu(editor, { searchBar, searchKeep, delay }, vueComponent, { items, allocate, rename })
            currentMenu = mainMenu
            args = {}
        }
        currentMenu.show(x, y, args);
    });
}

export const Menu = VueMenu;
export const Item = VueItem;
export const Search = VueSearch;

export default {
    name: 'context-menu',
    install
} as Plugin
