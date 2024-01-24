export const log = (...args: unknown[]) => {
    if(window.location.pathname.includes("local") || window.location.search.includes("debug=true")) {
        console.log(...args)
    }
}