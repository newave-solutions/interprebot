# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  channel = "stable-24.05"; # or "unstable"
  # Use https://search.nixos.org/packages to  find packages
  packages = [
    pkgs.nodejs_20
  ];
  # Sets environment variables in the workspace
  env = {    
    #TODO Get a API key from https://g.co/ai/idxGetGeminiKey 
    GOOGLE_GENAI_API_KEY = "AIzaSyAAfcmiqwLgiAquc_TO7Wexqk5Jpq6CT3Y"; 
  };
  # search for the extension on https://open-vsx.org/ and use "publisher.id"
  idx.extensions = [
    "ms-toolsai.jupyter"
    "ms-toolsai.jupyter-keymap"
    "esbenp.prettier-vscode"
    "fabioz.vscode-pydev-python-debugger"
    "franneck94.vscode-python-config"
    "google.geminicodeassist"
    "googlecloudtools.cloudcode"
    "ms-python.debugpy"
    "ms-python.python"
    "ms-toolsai.jupyter-renderers"
    "ms-toolsai.vscode-jupyter-cell-tags"
    "ms-toolsai.vscode-jupyter-slideshow"
    "antfu.browse-lite"
    "antfu.vite"
    "fabioz.vscode-pydev"
    "hashicorp.terraform"
    "project-accelerate.pythoninstaller"
    "tht13.python"
    "vitest.explorer"
  ];
  idx.workspace = {
    # Runs when a workspace is first created with this `dev.nix` file
    onCreate = {
      npm-install = "npm ci --no-audit --prefer-offline --no-progress --timing";
      default.openFiles = [ "README.md" "static/index.html" "server.ts" ];
    };
    # To run something each time the workspace is (re)started, use the `onStart` hook
    onStart = {
          # Authenticate gcloud
          gcloud-auth = "gcloud auth application-default login";
      };
 
  };
  # preview configuration, identical to monospace.json
  idx.previews = {
    enable = true;
    previews = {
      web = {
        command = [ "npm" "run" "dev" ];
        manager = "web";
        env = {
          PORT = "$PORT";
          GENKIT_ENV = "dev";
        };
      };
    };
  };
}
