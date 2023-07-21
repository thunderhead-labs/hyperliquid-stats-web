export const ModalHeader = {
  baseStyle: {
    fontWeight: 700,
  },
};

const Modal = {
  variants: {
    default: {
      dialogContainer: {},
    },
    full: {
      dialogContainer: {
        position: 'absolute',
        height: 'auto',
        bottom: '0',
        left: '0',
        right: '0',
        width: 'auto',
      },
    },
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
    transactionPanel: {
      dialogContainer: {
        position: 'absolute',
        height: 'auto',
        bottom: '0',
        left: '0',
        right: '0',
        width: 'auto',
      },
    },
  },
};

export default Modal;
