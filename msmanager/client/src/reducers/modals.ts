export function modalStatusChanged(state = false, action: any) {
    return action.type === 'MODAL_STATUS_CHANGED' ? action.modalStatus : state;
}
