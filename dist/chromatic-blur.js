/**
 * ChromaticBlur - A vanilla JavaScript plugin for creating chromatic aberration blur effects
 *
 * Modern best practices implemented:
 * - ES6+ module pattern with class-based architecture
 * - No external dependencies
 * - Declarative API with sensible defaults
 * - Method chaining support
 * - Automatic cleanup and memory management
 * - Accessible (doesn't interfere with screen readers)
 * - Performance optimized (reuses SVG filters)
 * - TypeScript-friendly JSDoc comments
 *
 * @version 1.0.0
 * @license MIT
 */

class ChromaticBlur {
  /**
   * @typedef {Object} ChromaticBlurOptions
   * @property {number} [redOffset=5] - Red channel offset in pixels (positive = right)
   * @property {number} [blueOffset=-5] - Blue channel offset in pixels (negative = left)
   * @property {number} [blurAmount=3] - Gaussian blur standard deviation
   * @property {number} [turbulenceFrequency=0.001] - Turbulence noise frequency
   * @property {number} [displacementScale=50] - Displacement map scale
   * @property {string} [borderColor='rgba(156, 156, 156, 0.2)'] - Border color
   * @property {boolean} [addOverlay=true] - Add gradient overlay layer
   * @property {boolean} [addNoise=true] - Add noise overlay layer
   */

  /**
   * Default configuration
   * @type {ChromaticBlurOptions}
   */
  static defaults = {
    redOffset: 5,
    blueOffset: -5,
    blurAmount: 3,
    turbulenceFrequency: 0.001,
    displacementScale: 50,
    borderColor: 'rgba(156, 156, 156, 0.2)',
    addOverlay: true,
    addNoise: true
  };

  /**
   * Track all instances for global cleanup
   * @type {Set<ChromaticBlur>}
   */
  static instances = new Set();

  /**
   * Creates a new ChromaticBlur instance
   * @param {HTMLElement|string} element - Target element or CSS selector
   * @param {ChromaticBlurOptions} options - Configuration options
   */
  constructor(element, options = {}) {
    // Resolve element
    this.element = typeof element === 'string'
      ? document.querySelector(element)
      : element;

    if (!this.element) {
      throw new Error('ChromaticBlur: Invalid element provided');
    }

    // Merge options with defaults
    this.options = { ...ChromaticBlur.defaults, ...options };

    // Generate unique ID for this instance
    this.id = `chromatic-blur-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Store original styles for cleanup
    this.originalStyles = {
      backdropFilter: this.element.style.backdropFilter,
      WebkitBackdropFilter: this.element.style.WebkitBackdropFilter,
      position: this.element.style.position,
      overflow: this.element.style.overflow
    };

    // Initialize
    this._init();

    // Register instance
    ChromaticBlur.instances.add(this);
  }

  /**
   * Initialize the effect
   * @private
   */
  _init() {
    // Ensure SVG container exists
    this._ensureSVGContainer();

    // Create and inject the filter
    this._createFilter();

    // Apply styles to element
    this._applyStyles();

    // Add overlay layers if enabled
    if (this.options.addOverlay || this.options.addNoise) {
      this._addOverlays();
    }
  }

  /**
   * Ensure global SVG container exists in document
   * @private
   */
  _ensureSVGContainer() {
    let container = document.getElementById('chromatic-blur-filters');

    if (!container) {
      container = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      container.id = 'chromatic-blur-filters';
      container.style.cssText = 'position:absolute;width:0;height:0;pointer-events:none';
      container.setAttribute('aria-hidden', 'true');

      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      container.appendChild(defs);

      document.body.insertBefore(container, document.body.firstChild);
    }

    this.svgContainer = container;
    this.defs = container.querySelector('defs');
  }

  /**
   * Create SVG filter for chromatic aberration effect
   * @private
   */
  _createFilter() {
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.id = this.id;
    filter.setAttribute('x', '-50%');
    filter.setAttribute('y', '-50%');
    filter.setAttribute('width', '200%');
    filter.setAttribute('height', '200%');

    filter.innerHTML = `
      <!-- Turbulence for organic noise -->
      <feTurbulence
        baseFrequency="${this.options.turbulenceFrequency}"
        numOctaves="1"
        type="turbulence"
        result="turbulence" />

      <!-- RED CHANNEL: Offset to the right -->
      <feOffset
        in="SourceGraphic"
        dx="${this.options.redOffset}"
        dy="0"
        result="redOffset" />
      <feColorMatrix
        in="redOffset"
        type="matrix"
        values="1 0 0 0 0
                0 0 0 0 0
                0 0 0 0 0
                0 0 0 1 0"
        result="red" />

      <!-- GREEN CHANNEL: No offset -->
      <feColorMatrix
        in="SourceGraphic"
        type="matrix"
        values="0 0 0 0 0
                0 1 0 0 0
                0 0 0 0 0
                0 0 0 1 0"
        result="green" />

      <!-- BLUE CHANNEL: Offset to the left -->
      <feOffset
        in="SourceGraphic"
        dx="${this.options.blueOffset}"
        dy="0"
        result="blueOffset" />
      <feColorMatrix
        in="blueOffset"
        type="matrix"
        values="0 0 0 0 0
                0 0 0 0 0
                0 0 1 0 0
                0 0 0 1 0"
        result="blue" />

      <!-- Combine red and green -->
      <feComposite
        in="red"
        in2="green"
        operator="arithmetic"
        k2="1"
        k3="1"
        result="redGreen" />

      <!-- Combine with blue -->
      <feComposite
        in="redGreen"
        in2="blue"
        operator="arithmetic"
        k2="1"
        k3="1"
        result="colorSplit" />

      <!-- Apply displacement for wavy distortion -->
      <feDisplacementMap
        in="colorSplit"
        in2="turbulence"
        scale="${this.options.displacementScale}"
        result="displacement" />

      <!-- Final blur -->
      <feGaussianBlur
        in="displacement"
        stdDeviation="${this.options.blurAmount}"
        result="blurred" />
    `;

    this.defs.appendChild(filter);
    this.filter = filter;
  }

  /**
   * Apply styles to the target element
   * @private
   */
  _applyStyles() {
    const filterUrl = `url(#${this.id})`;

    // Get computed position to check CSS rules, not just inline styles
    const currentPosition = window.getComputedStyle(this.element).position;
    const needsPosition = currentPosition === 'static';

    Object.assign(this.element.style, {
      backdropFilter: filterUrl,
      WebkitBackdropFilter: filterUrl,
      overflow: 'hidden',
      boxShadow: `0 0 0 1px ${this.options.borderColor} inset`
    });

    // Only set position if element is static (needs positioning context for overlays)
    if (needsPosition) {
      this.element.style.position = 'relative';
    }

    // Firefox fallback: detect if backdrop-filter is not supported
    this._addFirefoxFallback();
  }

  /**
   * Add Firefox fallback using regular filter on background layer
   * @private
   */
  _addFirefoxFallback() {
    // Test if backdrop-filter with SVG filters is supported
    // Firefox supports backdrop-filter: blur() but NOT backdrop-filter: url(#id)
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    const testElement = document.createElement('div');
    testElement.style.backdropFilter = 'blur(1px)';
    const backdropFilterSupported = testElement.style.backdropFilter !== '';

    // If Firefox, always use fallback (it doesn't support SVG filters in backdrop-filter)
    if (isFirefox || !backdropFilterSupported) {
      console.log('ChromaticBlur: Using fallback mode', { isFirefox, backdropFilterSupported });

      // Set semi-transparent white background
      this.element.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
      this.element.style.boxShadow = `
        0 0 0 1px ${this.options.borderColor} inset,
        0 4px 12px rgba(0, 0, 0, 0.15)
      `;

      // Create blurred background layer
      const firefoxBg = document.createElement('div');
      firefoxBg.className = 'chromatic-blur-firefox-bg';
      firefoxBg.style.cssText = `
        position: absolute;
        top: -10px;
        left: -10px;
        right: -10px;
        bottom: -10px;
        background: rgba(255, 255, 255, 0.3);
        filter: blur(10px);
        pointer-events: none;
        z-index: 0;
        border-radius: inherit;
      `;

      // Ensure content stays above background
      const children = Array.from(this.element.children);
      this.element.insertBefore(firefoxBg, this.element.firstChild);

      // Make sure all other children have position relative
      children.forEach(child => {
        if (window.getComputedStyle(child).position === 'static') {
          child.style.position = 'relative';
        }
        if (!child.style.zIndex || child.style.zIndex === 'auto') {
          child.style.zIndex = '1';
        }
      });

      this.firefoxBg = firefoxBg;
    }
  }

  /**
   * Add overlay layers for additional depth
   * @private
   */
  _addOverlays() {
    // Create container for overlays
    const overlayContainer = document.createElement('div');
    overlayContainer.className = 'chromatic-blur-overlays';
    overlayContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      border-radius: inherit;
    `;

    // Noise overlay
    if (this.options.addNoise) {
      const noise = document.createElement('div');
      noise.className = 'chromatic-blur-noise';
      noise.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        mix-blend-mode: overlay;
        background-color: rgba(255, 255, 255, 0);
        opacity: 0.05;
        border-radius: inherit;
      `;
      overlayContainer.appendChild(noise);
    }

    // Gradient overlay
    if (this.options.addOverlay) {
      const gradient = document.createElement('div');
      gradient.className = 'chromatic-blur-gradient';
      gradient.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: linear-gradient(225deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
        mix-blend-mode: screen;
        pointer-events: none;
        border-radius: inherit;
      `;
      overlayContainer.appendChild(gradient);
    }

    this.element.insertBefore(overlayContainer, this.element.firstChild);
    this.overlayContainer = overlayContainer;
  }

  /**
   * Update effect options dynamically
   * @param {Partial<ChromaticBlurOptions>} newOptions - Options to update
   * @returns {ChromaticBlur} Returns this for chaining
   */
  update(newOptions) {
    this.options = { ...this.options, ...newOptions };

    // Remove and recreate filter
    if (this.filter) {
      this.filter.remove();
    }

    this._createFilter();
    this._applyStyles();

    return this;
  }

  /**
   * Destroy the effect and cleanup
   */
  destroy() {
    // Remove filter
    if (this.filter) {
      this.filter.remove();
    }

    // Remove overlays
    if (this.overlayContainer) {
      this.overlayContainer.remove();
    }

    // Remove Firefox fallback
    if (this.firefoxBg) {
      this.firefoxBg.remove();
    }

    // Restore original styles
    Object.assign(this.element.style, this.originalStyles);

    // Unregister instance
    ChromaticBlur.instances.delete(this);

    // Cleanup SVG container if no more instances
    if (ChromaticBlur.instances.size === 0) {
      const container = document.getElementById('chromatic-blur-filters');
      if (container) {
        container.remove();
      }
    }
  }

  /**
   * Enable the effect (if previously disabled)
   * @returns {ChromaticBlur} Returns this for chaining
   */
  enable() {
    this.element.style.backdropFilter = `url(#${this.id})`;
    this.element.style.WebkitBackdropFilter = `url(#${this.id})`;
    return this;
  }

  /**
   * Disable the effect temporarily
   * @returns {ChromaticBlur} Returns this for chaining
   */
  disable() {
    this.element.style.backdropFilter = 'none';
    this.element.style.WebkitBackdropFilter = 'none';
    return this;
  }

  /**
   * Cleanup all instances (useful for SPA cleanup)
   * @static
   */
  static destroyAll() {
    ChromaticBlur.instances.forEach(instance => instance.destroy());
  }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChromaticBlur;
}

if (typeof define === 'function' && define.amd) {
  define([], () => ChromaticBlur);
}

// Global export
if (typeof window !== 'undefined') {
  window.ChromaticBlur = ChromaticBlur;
}

export default ChromaticBlur;
