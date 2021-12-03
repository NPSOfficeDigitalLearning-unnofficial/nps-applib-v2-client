import React from "react";
import { Trans, Translation } from "react-i18next";
import { Link, Redirect } from "react-router-dom";
import Application from "../../../data-structures/app/Application";
import ApplicationInit from "../../../data-structures/app/ApplicationInit";
import ApplicationsManager from "../../../data-structures/app/ApplicationsManager";
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


export default class ExportPage extends React.Component<{appsManager:ApplicationsManager,apps:Application[],canEdit:boolean},{exportType:ExportType,isDroppingFile:boolean,justImported:boolean}> {
    constructor(props:ExportPage["props"]) {
        super(props);
        this.state = {exportType:"csv",isDroppingFile:false,justImported:false};
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
        this.importFile(uploader.files.item(0)!);
    }
    async importFile(file:File):Promise<void> {
        console.log(file.type);
        
        if (!Object.values(exportMIMEType).includes(file.type)&&!file.name.endsWith(".tsv"))
            console.warn("file type wrong, filetype \"%s\" not in %o", file.type, Object.values(exportMIMEType));
        
        
        console.log(file);

        const textData = await file.text();
        let jsonData:Required<Omit<ApplicationInit, "id">>[];

        console.log(textData);
        

        if (file.type === "application/json") 
            jsonData = JSON.parse(textData);
            // TODO verify
        else if (file.type === "text/csv") {
            // TODO
            jsonData = [];
        } else {
            // TODO
            jsonData = [];
        }
        this.props.appsManager.bulkCreateApps(jsonData);
        this.setState({justImported:true});
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


    onFileDragHover:React.DragEventHandler<HTMLElement> = e=>{
        e.stopPropagation();
        e.preventDefault();
        // Style the drag-and-drop as a "copy file" operation.
        e.dataTransfer.dropEffect = "copy";
        this.setState({isDroppingFile:true});
    };
    onFileDragExit:React.DragEventHandler<HTMLElement> = e=>{
        this.setState({isDroppingFile:false});
    };
    onFileDrop:React.DragEventHandler<HTMLElement> = e=>{
        e.stopPropagation();
        e.preventDefault();
        this.setState({isDroppingFile:false});
        const fileList = e.dataTransfer.files;
        for (let i = 0; i < fileList.length; i++)
            this.importFile(fileList.item(i)!);
    };

    onRawSql:React.MouseEventHandler = e=>{
        // TODO
    };

    render() {
        const { canEdit } = this.props;

        if (this.state.justImported)
            return <Redirect to="/"/>;

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
                    <button
                        onClick={this.onUploadClick} className={"-upload"+(this.state.isDroppingFile?" -dropping":"")}
                        onDragOver={this.onFileDragHover}
                        onDragLeave={this.onFileDragExit}
                        onDrop={this.onFileDrop}
                    >{t("page.export.upload")} <code>[csv|tsv|json]</code></button>
                </WidthLimiter>
            </main>
        )}</Translation>);
    }
}