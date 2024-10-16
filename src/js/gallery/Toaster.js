export const Toaster = {
  error(message) {
    iziToast.error({ message, position: 'topRight' });
  },
  info(message) {
    iziToast.info({ message, position: 'topRight' });
  },
};
