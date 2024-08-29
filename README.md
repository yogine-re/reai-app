# REAI-APP 
React app written in Typescript
(scaffolded from https://github.com/bfeist/vite-express-ts)

## Description

This is a web application for AI document management.
see https://docs.google.com/document/d/125ul91LyH6FOSfdfFCPnAuwxbJytRhJ7MumdKS3Mk5U/edit?usp=drive_link

It integrates React, Vite, Express, and TypeScript. This setup provides a robust development environment with hot module replacement for the frontend and an efficient build system for both frontend and backend.


## Features

- Sign up / Log in
- Profile update

### Notes

### TODO:

### Pre-requisites:



### Pre-requisites:

## Install Homebrew
```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## Install npm
```
brew install npm
```

## Install Visual Studio Code

1. Open your web browser and go to the [Visual Studio Code download page](https://code.visualstudio.com/Download).
2. Click on the "Mac" download button to download the `.dmg` file.
3. Once the download is complete, open the `.dmg` file.
4. Drag the Visual Studio Code application to the Applications folder.
5. Open the Applications folder and double-click on Visual Studio Code to launch it.

## Install GitHub Copilot Extension

Follow the instructions at [GitHub Copilot Setup](https://code.visualstudio.com/docs/copilot/setup).

see
https://www.youtube.com/watch?v=jXp5D5ZnxGM

## Installation

1. To get started, clone the repository and install the dependencies:

   ```bash
   git clone https://github.com/yogine-re/reai-app.git
   cd reai-app
   npm install
   ```

## Usage

### Development

To start in development mode, run:

```bash
npm run dev
```

This will start the Vite development server for the frontend.

Available at `http://localhost:9000`

### Build

To build the application for production:

```bash
npm run build
```

This script builds the application. The result is put in `.local/vite/dist`and `.local/express/dist` respectively.

