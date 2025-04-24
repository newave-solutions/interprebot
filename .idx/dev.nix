
{ pkgs, ... }: {
  channel = "stable-24.05"; # or "unstable"

  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20 # Node.js runtime environment
    pkgs.google-cloud-sdk # Needed for the 'gcloud' command in onStart
    pkgs.terraform # Needed for the hashicorp.terraform extension
    pkgs.python3 # Added: Needed for the new Python web preview command
  ];

  # Sets environment variables in the workspace
  env = {
    # TODO Get a API key from https://g.co/ai/idxGetGeminiKey
    # Consider using IDX secrets for this API key instead of hardcoding it. See: https://developers.google.com/idx/guides/secrets
    GOOGLE_GENAI_API_KEY = "AIzaSyAAfcmiqwLgiAquc_TO7Wexqk5Jpq6CT3Y";
  };

  # search for the extension on https://open-vsx.org/ and use "publisher.id"
  idx.extensions = [
    # Formatting: Prettier for code formatting
    "esbenp.prettier-vscode" 
    # Google Cloud & AI: Gemini Code Assist and Cloud Code
    "google.geminicodeassist" 
    "googlecloudtools.cloudcode" 
    # Web Dev / Preview / Testing: Browse Lite, Vite, and Vitest Explorer
    "antfu.browse-lite" 
    "antfu.vite" # Kept assuming 'npm run dev' might use Vite
    "vitest.explorer" # Kept assuming Vitest might be used for testing
    # Infrastructure (Optional - remove if not using Terraform): Terraform support
    "hashicorp.terraform" 
  ];

  # Workspace lifecycle hooks
  idx.workspace = {
    # Runs when a workspace is first created with this `dev.nix` file
    onCreate = {
      npm-install = "npm ci --no-audit --prefer-offline --no-progress --timing";
    };
    # Runs every time the workspace is (re)started
    onStart = {
      # Authenticate gcloud: Logs in to Google Cloud using application default credentials
      gcloud-auth = "gcloud auth application-default login";
    };
  };

  # preview configuration (Updated from input)
  idx.previews = {
    enable = true;
    previews = {
      web = {
        # Serves the current directory using Python's simple HTTP server: Starts a Python HTTP server
        command = ["python3" "-m" "http.server" "$PORT" "--bind" "0.0.0.0"];
        manager = "web";
        # Note: The previous env vars (PORT, GENKIT_ENV) are removed as they are not typically used by Python's http.server
      };
    };
  };
} # <- Added missing closing brace for the main attribute set
