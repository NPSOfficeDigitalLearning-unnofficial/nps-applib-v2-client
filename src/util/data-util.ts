type HasId = {id:string|null};

/** Check for changes from `last` to `current`, if there have been additions deletions or edits. */
export function findChanges<T extends HasId>(last:T[],current:T[],isUnchanged:(a:T,b:T)=>boolean):{added:T[],changed:T[],removed:T[]} {
    type TById = {[id:string]:T};
    const added:TById = {}, removed:TById = {}, changed:TById = {};

    // Compute changes
    for (const app of current) // Things we have now could have been added.
        if (app.id) added[app.id] = app;
    for (const app of last) {
        if (app.id) {
            if (added[app.id]) { // Things we had before can't be new
                if (!isUnchanged(app,added[app.id]))
                    changed[app.id] = app; // Check for edits.
                delete added[app.id];
            }
            removed[app.id] = app;
        }
    }
    for (const app of current) // If it still exists it wasn't deleted.
        if (app.id) delete removed[app.id];

    // Return changes.
    return {
        added: Object.values(added),
        removed: Object.values(removed),
        changed: Object.values(changed)
    };
}

/** Replace the contents of `to` with the contents of `from`. */
export function copySetContents<T>(from:Set<T>,to:Set<T>,copy?:(a:T)=>T):void {
    to.clear();
    if (copy) from.forEach(v=>to.add(copy(v)));
    else from.forEach(v=>to.add(v));
}