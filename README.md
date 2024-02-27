# typescript-toolbox README

# Implement Interface Extension for Visual Studio Code

This Visual Studio Code extension provides a convenient way to implement an interface in your TypeScript files using a file explorer context menu.

## Features

- Adds a context menu item titled "Implement Interface" in the file explorer.
- Automatically generates a new TypeScript file ({interfacename}Impl.ts) implementing the selected interface.

## Usage

1. Open the file explorer in Visual Studio Code.
2. Right-click on the TypeScript file containing the interface you want to implement.
3. Select the "Implement Interface" option from the context menu.

The extension will create a new file named "{interfacename}Impl.ts" and implement the selected interface.

## Installation

1. Open Visual Studio Code.
2. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window or use the keyboard shortcut `Ctrl+Shift+X`.
3. Search for "Implement Interface" and install the extension.

## Configuration

No additional configuration is required. The extension automatically detects and implements the selected interface.

## Issues and Contributions

If you encounter any issues or have suggestions for improvement, please feel free to open an issue on the [GitHub repository](https://github.com/ahmad-shoja/typescript).

Pull requests are also welcome!

## License

This extension is licensed under the [MIT License](LICENSE.md).
