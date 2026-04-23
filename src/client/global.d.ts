// handles importing scss as modules
declare module '*.scss' {
    const content: string
    export default content
}
declare const snNotification: {
    show: (message: string, type?: 'info' | 'success' | 'error') => void;
};