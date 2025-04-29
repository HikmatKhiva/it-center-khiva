import { Node, mergeAttributes } from "@tiptap/core";

// Declare the type for your custom commands
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    iframe: {
      /**
       * Set an iframe
       */
      setIframe: (options: { src: string }) => ReturnType;
    };
  }
}

// Helper function to convert YouTube URLs to embed URLs
function convertToEmbedUrl(url: string): string {
  try {
    const urlObj = new URL(url);

    // Handle YouTube URLs
    if (
      urlObj.hostname.includes("youtube.com") ||
      urlObj.hostname.includes("youtu.be")
    ) {
      // Extract video ID
      let videoId = "";

      if (urlObj.hostname.includes("youtube.com")) {
        // Handle youtube.com URLs
        const searchParams = new URLSearchParams(urlObj.search);
        videoId = searchParams.get("v") || "";
      } else if (urlObj.hostname.includes("youtu.be")) {
        // Handle youtu.be short URLs
        videoId = urlObj.pathname.slice(1);
      }

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    // Return original URL if it's not a recognized format
    return url;
  } catch (e) {
    console.log(e);
    // If URL parsing fails, return the original string
    return url;
  }
}

const CustomIFrame = Node.create({
  name: "iframe",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: "560",
      },
      height: {
        default: "315",
      },
      frameborder: {
        default: "0",
      },
      allow: {
        default:
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
      },
      allowfullscreen: {
        default: true,
      },
      margin: {
        default: "0 auto",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "iframe",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["iframe", mergeAttributes(HTMLAttributes)];
  },

  addCommands() {
    return {
      setIframe:
        (options: { src: string }) =>
        ({ commands }) => {
          // Convert URLs to embed URLs where applicable
          const embedUrl = convertToEmbedUrl(options.src);

          return commands.insertContent({
            type: this.name,
            attrs: {
              ...options,
              src: embedUrl,
              margin: "0 auto",
            },
          });
        },
    };
  },
});

export default CustomIFrame;
