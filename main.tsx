import * as React from 'react'
import {Plugin, render, View, ViewLeaf} from 'razumai'
import {createContext, useContext} from "react";
import { Root, createRoot } from "react-dom/client";

const PluginContext = createContext<Plugin | undefined>(undefined);

const usePlugin = (): Plugin | undefined => {
  return useContext(PluginContext);
};

const ReactExampleView1: React.FC = () => {
  const plugin = usePlugin();

  const handleClick = () => {
    if (!plugin) return

    plugin.renderView('view_react_example_2')
  }

  return(
    <>
      <h4>View1</h4>
      <button onClick={handleClick}>To View2</button>
    </>
  );
};

const ReactExampleView2: React.FC = () => {
  const plugin = usePlugin();

  const handleClick = () => {
    if (!plugin) return

    plugin.renderView('view_react_example_1')
  }

  return(
    <>
      <h4>View2</h4>
      <button onClick={handleClick}>To View1</button>
    </>
  );
};

class ExampleView1 extends View {
  root: Root | null = null;

  constructor(leaf: ViewLeaf) {
    super(leaf);
  }

  async onOpen() {
    this.root = createRoot(this.leaf.containerEl);
    this.root.render(
      <PluginContext.Provider value={this.leaf.plugin}>
        <ReactExampleView1 />
      </PluginContext.Provider>
    );
  }

  async onClose() {
    this.root?.unmount();
  }
}

class ExampleView2 extends View {
  root: Root | null = null;

  constructor(leaf: ViewLeaf) {
    super(leaf);
  }

  async onOpen() {
    this.root = createRoot(this.leaf.containerEl);
    this.root.render(
      <PluginContext.Provider value={this.leaf.plugin}>
        <ReactExampleView2 />
      </PluginContext.Provider>
    );
  }

  async onClose() {
    this.root?.unmount();
  }
}

class SimplePlugin extends Plugin {
  onload() {
    //Добавляем icon
    this.addIcon('plugin', "<path d=\"M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11\"></path>", () => {
    })

    //Создаем кнопку в левом меню
    this.addRibbonButton('plugin', 'Расширение (React)', (event) => {
      this.renderView('view_react_example_1')
    })

    //Создаем страницы плагина
    this.registerView('view_react_example_1', (leaf) => new ExampleView1(leaf))
    this.registerView('view_react_example_2', (leaf) => new ExampleView2(leaf))
  }

  onunload() {
  }
}

render(new SimplePlugin('simple_react_plugin'))