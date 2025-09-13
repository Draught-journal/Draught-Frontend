# UI Components

This directory contains reusable UI components that can be used across the application.

## LazyImage

The `LazyImage` component is a reusable component for lazy loading images. It uses the Intersection Observer API to detect when an image is about to enter the viewport and only loads the image at that point.

### Usage

```svelte
<script>
  import LazyImage from '$lib/components/ui/LazyImage.svelte';
</script>

<LazyImage
  src="path/to/image.jpg"
  alt="Description of the image"
  objectFit="cover"
  className="my-custom-class"
  srcset="image-480w.jpg 480w, image-800w.jpg 800w"
  sizes="(max-width: 600px) 480px, 800px"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | string | required | The source URL of the image |
| `alt` | string | required | Alternative text for the image |
| `objectFit` | string | 'cover' | CSS object-fit property ('cover', 'contain', etc.) |
| `className` | string | '' | Additional CSS class(es) to apply to the image |
| `srcset` | string | '' | Optional srcset attribute for responsive images |
| `sizes` | string | '' | Optional sizes attribute for responsive images |

### Features

- Uses Intersection Observer API for efficient lazy loading
- Smooth fade-in transition when images load
- Supports responsive images with srcset and sizes
- Customizable through props
- Falls back gracefully when JavaScript is disabled

### Implementation

The component handles three states:
1. Before entering viewport: Shows placeholder or nothing
2. In viewport but loading: Shows a placeholder or loading indicator
3. Loaded: Shows the actual image with a fade-in transition

### Browser Support

This component uses the Intersection Observer API, which is supported in all modern browsers. For older browsers, the image will be loaded immediately without lazy loading functionality.