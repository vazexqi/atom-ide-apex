'use babel';

import IdeApexView from './ide-apex-view';
import { CompositeDisposable } from 'atom';

export default {

  ideApexView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.ideApexView = new IdeApexView(state.ideApexViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.ideApexView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'ide-apex:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.ideApexView.destroy();
  },

  serialize() {
    return {
      ideApexViewState: this.ideApexView.serialize()
    };
  },

  toggle() {
    console.log('IdeApex was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
