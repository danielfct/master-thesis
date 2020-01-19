export function modalStatusChanged(boolState: boolean) {
  return {
    type: 'MODAL_STATUS_CHANGED',
    modalStatus: boolState
  };
}
