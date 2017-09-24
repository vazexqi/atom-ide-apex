const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const { AutoLanguageClient } = require('atom-languageclient');

const UBER_JAR_NAME = 'apex-jorje-lsp.jar';
const JDWP_DEBUG_PORT = 2739;
const APEX_LANGUAGE_SERVER_MAIN = 'apex.jorje.lsp.ApexLanguageServerLauncher';

class ApexLanguageClient extends AutoLanguageClient {
  getGrammarScopes() {
    return ['source.apex'];
  }

  getLanguageName() {
    return 'Apex';
  }

  getServerName() {
    return 'Apex LSP';
  }

  // shouldStartForEditor(atomTextEditor) {
  //   Need to detect this for the project level
  //   return atom.project.contains('sfdx-project.json');
  // }

  startServerProcess(projectPath) {
    const command = this.getJavaCommand();
    const uberJar = path.resolve(__dirname, UBER_JAR_NAME);

    const args = [
      '-cp',
      uberJar,
      '-Ddebug.internal.errors=true',
      '-Ddebug.semantic.errors=false',
      APEX_LANGUAGE_SERVER_MAIN
    ];

    this.logger.debug(`starting "${command} ${args.join(' ')}"`);

    const childProcess = cp.spawn(command, args);
    return childProcess;
  }

  getJavaCommand() {
    const javaPath = this.getJavaPath();
    return javaPath == null ? 'java' : path.join(javaPath, 'bin', 'java');
  }

  getJavaPath() {
    return new Array(
      atom.config.get('ide-java.javaHome'),
      process.env['JDK_HOME'],
      process.env['JAVA_HOME']
    ).find(j => j);
  }

  deleteDbIfExists() {
    if (atom.project.rootPath) {
      const dbPath = path.join(
        atom.project.rootPath,
        '.sfdx',
        'tools',
        'apex.db'
      );
      if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
      }
    }
  }
}

module.exports = new ApexLanguageClient();
