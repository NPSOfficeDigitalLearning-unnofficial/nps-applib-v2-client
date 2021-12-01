import React from "react";
import { Trans, Translation } from "react-i18next";
import { Link } from "react-router-dom";
import Application from "../../../data-structures/app/Application";
import i18n from "../../../i18n";
import { XSVCodec } from "../../../util/encoding/xsv-codec";
import WidthLimiter from "../../leaf-component/WidthLimiter/WidthLimiter";
import "./ExportPage.scss";

type ExportType = "csv"|"tsv"|"json";
const exportMIMEType:{[t in ExportType]:string} = {
    csv: "text/csv", tsv: "text/tab-separated-values",
    json: "application/json"
},
    exportAcceptExtensions = ".json,.csv,.tsv";

// Create the csv and tsv encoders.
const csvCodec = XSVCodec.csv(), tsvCodec = XSVCodec.tsv();


export default class ExportPage extends React.Component<{apps:Application[],canEdit:boolean},{exportType:ExportType}> {
    constructor(props:ExportPage["props"]) {
        super(props);
        this.state = {exportType:"csv"};
    }

    readonly downloadLinkRef = React.createRef<HTMLAnchorElement>();
    readonly uploadFileRef = React.createRef<HTMLInputElement>();
    


    /** Export the data */
    async exportAs(type:ExportType):Promise<void> {
        const downloader = this.downloadLinkRef.current;
        if (!downloader) throw new Error("should not happen, attempt to export before mount likely");

        let stringData:string;

        if (type === "json") {
            const jsonData = this.props.apps.map(v=>v.toJSON());
            stringData = JSON.stringify(jsonData);
        } else {
            // *true in toJSON specifies to join arrays.
            const jsonData = this.props.apps.map(v=>v.toJSON(true));
            const keys:(keyof typeof jsonData[number])[] = Object.keys(jsonData[0]??{}) as never[],
                table:string[][] = [keys];
            for (const app of jsonData)
                table.push(keys.map(key=>app[key]??""));
            switch (type) {
            case "csv": stringData = csvCodec.encode(table); break;
            case "tsv": stringData = tsvCodec.encode(table); break;
            }
        }

        downloader.href = URL.createObjectURL(new Blob(
            [ stringData ],
            { type: exportMIMEType[type] }
        ));
        downloader.download = `${i18n.t("page.export.filename")}.${type}`;
        downloader.click();
    }

    /** Import data of any type. */
    async import():Promise<void> {
        const uploader = this.uploadFileRef.current;
        if (!uploader) throw new Error("should not happen, attempt to import before mount likely");
        if (!uploader.files) throw new Error("uploader input was not of type file, or files field was broken");
        uploader.click();
    }
    async onSelectImportFile():Promise<void> {
        const uploader = this.uploadFileRef.current;
        if (!uploader) throw new Error("should not happen, attempt to import before mount likely");
        if (!uploader.files) throw new Error("uploader input was not of type file, or files field was broken");


        if (uploader.files?.length !== 1) {
            console.warn("No file was selected");
            return;
        }
        
        console.log(uploader.files.item(0));
        // TODO read, parse, and upload
    }

    onDownloadClick:React.MouseEventHandler = e=>{
        if (!e.isTrusted) return;
        this.exportAs(this.state.exportType);
    };
    onUploadClick:React.MouseEventHandler = e=>{
        if (!e.isTrusted) return;
        this.import();
    };
    onUploadInputChange:React.ChangeEventHandler = e=>{
        if (!e.isTrusted) return;
        this.onSelectImportFile();
    };
    onExportTypeChange:React.ChangeEventHandler<HTMLSelectElement> = e=>{
        if (!e.isTrusted) return;
        this.setState({exportType: e.target.value as ExportType});
    };

    render() {
        const { canEdit } = this.props;

        // If the user attempting to access the page can't edit go back to the main page.
        if (!canEdit) {
            return (
                <main className="ExportPage-noEdit">
                    <p><Trans>page.export.noEdit</Trans></p>
                </main>
            );
        }

        return (<Translation>{t=>(
            <main className="ExportPage">
                <a className="hidden" ref={this.downloadLinkRef}></a>
                <input className="hidden" ref={this.uploadFileRef} type="file" accept={exportAcceptExtensions} onChange={this.onUploadInputChange}/>
                <WidthLimiter>
                    <Link to="/" className="-backBtn">{t("page.export.backToMain")}</Link>
                    <h1><Trans>page.export.name</Trans></h1>
                    <button onClick={this.onDownloadClick}>{t("page.export.download")}</button>
                    <select value={this.state.exportType} onChange={this.onExportTypeChange} aria-label={t("page.export.selectExportType")}>
                        {["csv","tsv","json"].map(type=>(
                            // Not including translations here because file extension names don't really translate
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                    <button onClick={this.onUploadClick} className="-upload">{t("page.export.upload")} <code>[csv|tsv|json]</code></button>
                </WidthLimiter>
            </main>
        )}</Translation>);
    }
}