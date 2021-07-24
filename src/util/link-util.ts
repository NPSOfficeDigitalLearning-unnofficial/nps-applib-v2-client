export function prependHttpsToURL(url:string):string {
    return !/^https?:\/\//i.test(url) ? `https://${url}` : url;
}
export function urlIsValid(url:string):boolean {
    try { // new URL will throw error if url is invalid.
        new URL(url); 
        return true;
    } catch(e) {
        return false;
    }
}; 