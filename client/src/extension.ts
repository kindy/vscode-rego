/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import { ExtensionContext, window } from "vscode";

import {
  CloseAction,
  ErrorAction,
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
} from "vscode-languageclient/node";

let client: LanguageClient;

export function activate(context: ExtensionContext) {
  // The server is implemented in node
  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  const serverOptions: ServerOptions = {
    command: "regols",
  };
  const documentSelector = [{ language: "rego", scheme: "file" }];

  const outChan = window.createOutputChannel("rego");

  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    // Register the server for plain text documents
    documentSelector,
    outputChannel: outChan,
    errorHandler: {
      error(error, message, count) {
        outChan.appendLine(`error: ${error.message} name: ${error.name}`);

        return ErrorAction.Continue;
      },
      closed() {
        return CloseAction.Restart;
      },
    },
  };

  // Create the language client and start the client.
  client = new LanguageClient("rego", "Rego", serverOptions, clientOptions);

  // Start the client. This will also launch the server
  client.start();
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
