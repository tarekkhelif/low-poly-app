export const executeOnPlainMouseDown = (fn) => (e) => {
    const correctModifiers =
        !e.ctrlKey && !e.altKey && !e.shiftKey && !e.button;

    if (correctModifiers) {
        fn(e);
    }
};
