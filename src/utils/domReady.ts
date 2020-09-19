/**
 * @param {Function} cb 
 */
export const domReady = (cb) => {
    if( document.readyState === 'complete' || document.readyState === 'interactive' ){
        cb()
    }else{
        document.addEventListener('DOMContentLoaded', () => cb())
    }
}
