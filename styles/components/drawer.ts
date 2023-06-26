const Drawer = {
  baseStyle: {
    bg: 'blue.1000',
  },
  variants: {
    tokenList: {
      dialogContainer: {
        position: 'absolute',
        height: 'auto',
        bottom: '0',
        left: '0',
        right: '0',
        width: 'auto',
      },
    },
    failModal: {
      dialogContainer: {
        position: 'absolute',
        height: 'auto',
        bottom: '50px',
        left: '0',
        right: '0',
        top: '50px',
        width: 'auto',
      },
    },
  },
};

export default Drawer;
