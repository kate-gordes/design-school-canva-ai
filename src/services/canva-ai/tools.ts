import type { ToolDefinition } from '@canva-ct/genai';

// Notify tool - for progress updates
export const notifyTool: ToolDefinition = {
  name: 'notify',
  description:
    'Send a progress notification to the user. Use this to communicate what you are doing or planning to do.',
  parameters: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'The notification message to display to the user',
      },
    },
    required: ['message'],
  },
};

// Update element style tool
export const updateElementStyleTool: ToolDefinition = {
  name: 'update_element_style',
  description:
    'Update CSS styles of an element. Changes apply immediately. Use this to modify colors, sizes, positions, fonts, and other visual properties.',
  parameters: {
    type: 'object',
    properties: {
      elementId: {
        type: 'string',
        description: 'The ID of the element to update',
      },
      style: {
        type: 'object',
        description:
          'CSS style properties to update (e.g., { color: "#ff0000", fontSize: "24px", backgroundColor: "#ffffff" })',
      },
      description: {
        type: 'string',
        description:
          'Brief description of the change for the changes list (e.g., "Changed text color to red")',
      },
    },
    required: ['elementId', 'style', 'description'],
  },
};

// Update element content tool
export const updateElementContentTool: ToolDefinition = {
  name: 'update_element_content',
  description:
    'Update the text content of a text element. Changes apply immediately. Use this to modify text, headings, or labels.',
  parameters: {
    type: 'object',
    properties: {
      elementId: {
        type: 'string',
        description: 'The ID of the text element to update',
      },
      content: {
        type: 'string',
        description: 'The new text content',
      },
      description: {
        type: 'string',
        description: 'Brief description of the change (e.g., "Updated heading text")',
      },
    },
    required: ['elementId', 'content', 'description'],
  },
};

// Update canvas background tool
export const updateCanvasBackgroundTool: ToolDefinition = {
  name: 'update_canvas_background',
  description:
    'Update the background color or gradient of a canvas/slide. Changes apply immediately.',
  parameters: {
    type: 'object',
    properties: {
      canvasId: {
        type: 'number',
        description: 'The ID of the canvas to update (optional, defaults to active canvas)',
      },
      color: {
        type: 'string',
        description: 'Background color (e.g., "#E8E0F0" or "rgb(232, 224, 240)")',
      },
      gradient: {
        type: 'object',
        description: 'Gradient configuration',
        properties: {
          type: {
            type: 'string',
            enum: ['linear', 'radial'],
            description: 'Type of gradient',
          },
          colors: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array of colors for the gradient',
          },
          angle: {
            type: 'number',
            description: 'Angle for linear gradients (in degrees)',
          },
        },
      },
      description: {
        type: 'string',
        description: 'Brief description of the change (e.g., "Changed slide to purple gradient")',
      },
    },
    required: ['description'],
  },
};

// Generate image tool
export const generateImageTool: ToolDefinition = {
  name: 'generate_image',
  description:
    'Generate a NEW image using AI and add it to the CURRENT canvas/slide. Use this when adding an image to an existing slide. DO NOT use this for creating new slides - use generate_slide instead.',
  parameters: {
    type: 'object',
    properties: {
      prompt: {
        type: 'string',
        description:
          'Detailed description of the image to generate. Be specific about style, colors, composition.',
      },
      elementId: {
        type: 'string',
        description: 'Optional: ID of an existing image element to replace',
      },
      width: {
        type: 'number',
        description: 'Width of the generated image in pixels (default: 1024)',
      },
      height: {
        type: 'number',
        description: 'Height of the generated image in pixels (default: 768)',
      },
      description: {
        type: 'string',
        description: 'Brief description for the changes list (e.g., "Generated forest landscape")',
      },
    },
    required: ['prompt', 'description'],
  },
};

// Edit image tool
export const editImageTool: ToolDefinition = {
  name: 'edit_image',
  description:
    'Edit an EXISTING image using AI. Use this when you want to transform or modify an image that already exists in the canvas (e.g., "make it more colorful", "add a vintage filter", "make it cartoon style").',
  parameters: {
    type: 'object',
    properties: {
      elementId: {
        type: 'string',
        description: 'The ID of the existing image element to edit',
      },
      prompt: {
        type: 'string',
        description:
          'Description of how to edit/transform the image (e.g., "make it look like a watercolor painting")',
      },
      description: {
        type: 'string',
        description:
          'Brief description for the changes list (e.g., "Applied cartoon style to image")',
      },
    },
    required: ['elementId', 'prompt', 'description'],
  },
};

// Add element tool
export const addElementTool: ToolDefinition = {
  name: 'add_element',
  description:
    'Add a new element (text, image, or shape) to the CURRENT canvas/slide. This does NOT create new slides - use generate_slide for that.',
  parameters: {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        enum: ['text', 'image', 'shape'],
        description: 'Type of element to add',
      },
      style: {
        type: 'object',
        description:
          'CSS style properties for the element (must include position, top, left, width, height)',
      },
      content: {
        type: 'string',
        description: 'Text content (for text elements)',
      },
      canvasId: {
        type: 'number',
        description: 'Canvas ID to add the element to (optional, defaults to active canvas)',
      },
      description: {
        type: 'string',
        description: 'Brief description of the change (e.g., "Added subtitle text")',
      },
    },
    required: ['type', 'style', 'description'],
  },
};

// Delete element tool
export const deleteElementTool: ToolDefinition = {
  name: 'delete_element',
  description: 'Delete an element from the canvas. Changes apply immediately.',
  parameters: {
    type: 'object',
    properties: {
      elementId: {
        type: 'string',
        description: 'The ID of the element to delete',
      },
      description: {
        type: 'string',
        description: 'Brief description of the change (e.g., "Removed old header")',
      },
    },
    required: ['elementId', 'description'],
  },
};

// Batch update tool
export const batchUpdateTool: ToolDefinition = {
  name: 'batch_update',
  description:
    'Update multiple elements at once. Use this for consistent changes across many elements (e.g., changing all headings to the same color). Changes apply immediately.',
  parameters: {
    type: 'object',
    properties: {
      updates: {
        type: 'array',
        description: 'Array of updates to apply',
        items: {
          type: 'object',
          properties: {
            elementId: {
              type: 'string',
              description: 'The ID of the element to update',
            },
            style: {
              type: 'object',
              description: 'CSS style properties to update',
            },
            content: {
              type: 'string',
              description: 'New text content (for text elements)',
            },
          },
          required: ['elementId'],
        },
      },
      description: {
        type: 'string',
        description:
          'Brief description of the batch change (e.g., "Changed all headings to purple")',
      },
    },
    required: ['updates', 'description'],
  },
};

// Generate slide tool
export const generateSlideTool: ToolDefinition = {
  name: 'generate_slide',
  description:
    'Create a NEW SLIDE/PAGE in the presentation. This adds a completely new canvas to the presentation. ALWAYS use this when the user asks to "create a slide", "add a slide", "make a new slide", "generate a slide", or wants a new page added. This is the ONLY tool that creates new slides.',
  parameters: {
    type: 'object',
    properties: {
      prompt: {
        type: 'string',
        description:
          'Detailed description of the slide to generate (layout, content, style, colors)',
      },
      position: {
        type: ['string', 'number'],
        description:
          'Where to insert the new slide. Use "end" to append at the end of the presentation, "beginning" to insert at the start, or a specific slide number (1-based) to insert after that slide. If not specified, inserts after the current active slide.',
      },
      description: {
        type: 'string',
        description:
          'Brief description for the changes list (e.g., "Generated team introduction slide")',
      },
    },
    required: ['prompt', 'description'],
  },
};

// Create presentation tool - used in creation mode to load a complete presentation
export const createPresentationTool: ToolDefinition = {
  name: 'create_presentation',
  description:
    'Creates a complete presentation with multiple slides. This tool loads a professionally designed presentation template.',
  parameters: {
    type: 'object',
    properties: {
      description: {
        type: 'string',
        description: 'Brief description of the presentation being created (for the changes list)',
      },
    },
    required: ['description'],
  },
};

// Create slide with data tool - creates a slide from JSON structure with self-updating image elements
export const createSlideWithDataTool: ToolDefinition = {
  name: 'create_slide_with_data',
  description:
    'Create a new slide by specifying its complete structure as JSON. For image elements, provide the "content" field with a description of what the image should show - images will be generated automatically in the background. The slide appears IMMEDIATELY with text elements visible and image placeholders that fill in as generation completes. Use this when you want precise control over slide layout.',
  parameters: {
    type: 'object',
    properties: {
      slideData: {
        type: 'object',
        description: 'The complete slide structure',
        properties: {
          backgroundColor: {
            type: 'string',
            description: 'Background color for the slide (e.g., "#FFFFFF", "#F5F5F5")',
          },
          gradient: {
            type: 'object',
            description: 'Optional gradient background',
            properties: {
              type: {
                type: 'string',
                enum: ['linear', 'radial'],
                description: 'Type of gradient',
              },
              colors: {
                type: 'array',
                items: { type: 'string' },
                description: 'Array of colors for the gradient',
              },
              angle: {
                type: 'number',
                description: 'Angle for linear gradients (in degrees)',
              },
            },
          },
          elements: {
            type: 'array',
            description: 'Array of elements to add to the slide',
            items: {
              type: 'object',
              properties: {
                type: {
                  type: 'string',
                  enum: ['text', 'image', 'shape'],
                  description: 'Type of element',
                },
                content: {
                  type: 'string',
                  description:
                    'For text: the text to display. For image: a description of the image to generate (e.g., "Professional photo of a mountain landscape at sunset")',
                },
                style: {
                  type: 'object',
                  description:
                    'CSS style properties. Must include top, left. For images, include width and height.',
                  properties: {
                    top: { type: 'string', description: 'Position from top (e.g., "50px")' },
                    left: { type: 'string', description: 'Position from left (e.g., "50px")' },
                    width: { type: 'string', description: 'Element width (e.g., "400px")' },
                    height: { type: 'string', description: 'Element height (e.g., "300px")' },
                    fontSize: { type: 'string', description: 'Font size (e.g., "48px")' },
                    fontFamily: {
                      type: 'string',
                      description: 'Font family (e.g., "Georgia, serif")',
                    },
                    fontWeight: { type: 'string', description: 'Font weight (e.g., "bold")' },
                    color: { type: 'string', description: 'Text color (e.g., "#333333")' },
                    backgroundColor: {
                      type: 'string',
                      description: 'Background color for shapes',
                    },
                    borderRadius: { type: 'string', description: 'Border radius (e.g., "8px")' },
                    textAlign: {
                      type: 'string',
                      description: 'Text alignment (e.g., "center")',
                    },
                    lineHeight: { type: 'string', description: 'Line height (e.g., "1.5")' },
                    letterSpacing: {
                      type: 'string',
                      description: 'Letter spacing (e.g., "1px")',
                    },
                  },
                  required: ['top', 'left'],
                },
              },
              required: ['type', 'style'],
            },
          },
        },
        required: ['elements'],
      },
      position: {
        type: ['string', 'number'],
        description:
          'Where to insert the new slide. Use "end" to append at the end of the presentation, "beginning" to insert at the start, or a specific slide number (1-based) to insert after that slide. If not specified, inserts after the current active slide.',
      },
      description: {
        type: 'string',
        description:
          'Brief description for the changes list (e.g., "Created product launch slide")',
      },
    },
    required: ['slideData', 'description'],
  },
};

// Create multiple slides at once - efficient for multi-slide requests
export const createMultipleSlidesTool: ToolDefinition = {
  name: 'create_multiple_slides',
  description:
    'Create MULTIPLE new slides in a single call. Use this when the user asks for several slides at once (e.g., "create 5 slides about...", "make a presentation with slides for X, Y, and Z"). This is more efficient than calling create_slide_with_data multiple times. Each slide in the array will be created in order, appearing sequentially in the presentation.',
  parameters: {
    type: 'object',
    properties: {
      slides: {
        type: 'array',
        description: 'Array of slide specifications to create',
        items: {
          type: 'object',
          properties: {
            slideData: {
              type: 'object',
              description: 'The complete slide structure',
              properties: {
                backgroundColor: {
                  type: 'string',
                  description: 'Background color for the slide (e.g., "#FFFFFF", "#F5F5F5")',
                },
                gradient: {
                  type: 'object',
                  description: 'Optional gradient background',
                  properties: {
                    type: {
                      type: 'string',
                      enum: ['linear', 'radial'],
                      description: 'Type of gradient',
                    },
                    colors: {
                      type: 'array',
                      items: { type: 'string' },
                      description: 'Array of colors for the gradient',
                    },
                    angle: {
                      type: 'number',
                      description: 'Angle for linear gradients (in degrees)',
                    },
                  },
                },
                elements: {
                  type: 'array',
                  description: 'Array of elements to add to the slide',
                  items: {
                    type: 'object',
                    properties: {
                      type: {
                        type: 'string',
                        enum: ['text', 'image', 'shape'],
                        description: 'Type of element',
                      },
                      content: {
                        type: 'string',
                        description:
                          'For text: the text to display. For image: a description of the image to generate.',
                      },
                      style: {
                        type: 'object',
                        description: 'CSS style properties. Must include top, left.',
                        properties: {
                          top: { type: 'string', description: 'Position from top (e.g., "50px")' },
                          left: {
                            type: 'string',
                            description: 'Position from left (e.g., "50px")',
                          },
                          width: { type: 'string', description: 'Element width (e.g., "400px")' },
                          height: { type: 'string', description: 'Element height (e.g., "300px")' },
                          fontSize: { type: 'string', description: 'Font size (e.g., "48px")' },
                          fontFamily: { type: 'string', description: 'Font family' },
                          fontWeight: { type: 'string', description: 'Font weight (e.g., "bold")' },
                          color: { type: 'string', description: 'Text color (e.g., "#333333")' },
                          backgroundColor: { type: 'string', description: 'Background color' },
                          borderRadius: { type: 'string', description: 'Border radius' },
                          textAlign: { type: 'string', description: 'Text alignment' },
                          lineHeight: { type: 'string', description: 'Line height' },
                          letterSpacing: { type: 'string', description: 'Letter spacing' },
                        },
                        required: ['top', 'left'],
                      },
                    },
                    required: ['type', 'style'],
                  },
                },
              },
              required: ['elements'],
            },
            description: {
              type: 'string',
              description:
                'Brief description for this specific slide (e.g., "Title slide", "Market analysis slide")',
            },
          },
          required: ['slideData', 'description'],
        },
      },
      position: {
        type: ['string', 'number'],
        description:
          'Where to insert the slides. Use "end" to append at the end, "beginning" to insert at the start, or a slide number (1-based) to insert after that slide. All slides will be inserted sequentially starting from this position.',
      },
    },
    required: ['slides'],
  },
};

// Get tools for creation mode (only notify and create_presentation)
export const getCreationModeTools = (): ToolDefinition[] => {
  return [notifyTool, createPresentationTool];
};

// Request slide selection tool - used when deck styles are inconsistent
export const requestSlideSelectionTool: ToolDefinition = {
  name: 'request_slide_selection',
  description:
    'Show the user slide thumbnails so they can pick which slide this one should match. Use ONLY when all slides have noticeably different styles and you cannot identify a consistent deck style. Do NOT use this if slides share a common style — just match to that style directly.',
  parameters: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description:
          'The message to show the user above the thumbnails (e.g., "Your slides all have different styles. Which one should I match this slide to?")',
      },
      currentCanvasId: {
        type: 'number',
        description:
          'The canvasId of the slide being matched — it will be excluded from the picker',
      },
    },
    required: ['message', 'currentCanvasId'],
  },
};

// Get all tools for a specific scope
export const getToolsForScope = (scope: 'presentation' | 'page' | 'element'): ToolDefinition[] => {
  const baseTool = [notifyTool];

  switch (scope) {
    case 'presentation':
      return [
        ...baseTool,
        updateElementStyleTool,
        updateElementContentTool,
        updateCanvasBackgroundTool,
        generateImageTool,
        editImageTool,
        addElementTool,
        deleteElementTool,
        batchUpdateTool,
        generateSlideTool,
        createSlideWithDataTool,
        createMultipleSlidesTool,
        requestSlideSelectionTool,
      ];

    case 'page':
      return [
        ...baseTool,
        updateElementStyleTool,
        updateElementContentTool,
        updateCanvasBackgroundTool,
        generateImageTool,
        editImageTool,
        addElementTool,
        deleteElementTool,
        generateSlideTool, // Always allow creating new slides
        createSlideWithDataTool,
        createMultipleSlidesTool,
        requestSlideSelectionTool,
      ];

    case 'element':
      return [
        ...baseTool,
        updateElementStyleTool,
        updateElementContentTool,
        generateImageTool,
        editImageTool,
        deleteElementTool,
        generateSlideTool, // Always allow creating new slides
        createSlideWithDataTool,
        createMultipleSlidesTool,
      ];

    default:
      return baseTool;
  }
};

// Export all tools as an array
export const allTools: ToolDefinition[] = [
  notifyTool,
  updateElementStyleTool,
  updateElementContentTool,
  updateCanvasBackgroundTool,
  generateImageTool,
  editImageTool,
  addElementTool,
  deleteElementTool,
  batchUpdateTool,
  generateSlideTool,
  createPresentationTool,
  createSlideWithDataTool,
  createMultipleSlidesTool,
  requestSlideSelectionTool,
];
