export class XSVCodec {
    constructor(
        readonly separator:string,
        readonly separatorEscaper:(entry:string)=>string
    ) {}

    /** Encode a list of identical rows into this xsv-based format. */
    encode<T extends string[]>(rows:T[]) {
        return rows
            .map(row=>row // escape all entries in the rows.
                .map(this.separatorEscaper)
                .join(this.separator)) // then join the rows with the separator.
            .join("\n"); // Then join the rows with line breaks.
    }


    static csv():XSVCodec {
        return new XSVCodec(",",ent=>{
            if (ent.includes(","))
                return `"${ent.replace(/"/g,"\"\"")}"`;
            else return ent;
        });
    }
    static tsv():XSVCodec {
        return new XSVCodec("\t",ent=>{
            if (ent.includes("\t"))
                return `"${ent.replace(/"/g,"\"\"")}"`;
            else return ent;
        });
    }
}
