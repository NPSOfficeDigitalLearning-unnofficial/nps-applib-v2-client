export const setEquals = (s1:Set<any>, s2:Set<any>):boolean => {
    if (s1.size !== s2.size)
        return false;
    return [...s1].every(i => s2.has(i));
};
export const castSetEltsToEnum = <Enum extends unknown>(enumAll:readonly Enum[],set:Set<string>):Set<Enum> => {
    // @ts-ignore
    const setIsOfEnum = [...set].every(v=>enumAll.includes(v));
    if (!setIsOfEnum)
        throw new Error("Could not cast Set to specified enum, not all elements were from the enum.");
    // @ts-ignore
    else return set;
};