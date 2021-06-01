const {
  borderColors,
  borderRadius,
  borderWidth,
  boxShadow,
  colors,
  fontFamily,
  fontSize,
  fontWeight,
  height,
  letterSpacing,
  lineHeight,
  margin,
  maxHeight,
  maxWidth,
  minWidth,
  padding,
  width,
  willChange,
  zIndex,
} = require('./tailwind');

module.exports = {
  plugins: [],
  purge: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    backgroundColor: colors,
    borderColor: borderColors,
    borderRadius,
    borderWidth,
    boxShadow,
    colors,
    fontFamily,
    fontSize,
    fontWeight,
    gap: padding,
    height,
    letterSpacing,
    lineHeight,
    margin,
    maxHeight,
    maxWidth,
    minHeight: height,
    minWidth,
    padding,
    screens: {},
    textColor: colors,
    width,
    willChange,
    zIndex,
    extend: {
      transitionProperty: {
        input: ['border-color', 'box-shadow', 'color'],
      },
    },
  },
  variants: {
    extend: {
      display: ['group-hover', 'group-focus'],
      placeholderColor: ['focus-within'],
      visibility: ['group-hover'],
    },
    willChange: ['responsive'],
  },
};
