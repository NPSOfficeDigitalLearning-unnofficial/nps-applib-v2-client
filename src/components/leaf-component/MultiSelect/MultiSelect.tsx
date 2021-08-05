import React, { FocusEvent, RefObject } from "react";
import { Translation } from "react-i18next";
import "./MultiSelect.scss";
import MultiSelectOption from "./Option";

const VD = 300;

export type OptionData<T> = {[key:string]:{name:string,value:T}};

export default class MultiSelect<T> extends React.Component<{text:string,ariaLabel:string,options:OptionData<T>,value:OptionData<T>,onChange:(value:OptionData<T>)=>void},{open:boolean,focused:boolean,optionRefs:RefObject<MultiSelectOption<unknown>>[],visibleTimerId?:NodeJS.Timeout,visible:boolean,focusOption?:number},{}> {
    containerRef:RefObject<HTMLDivElement> = React.createRef();
    constructor(props: MultiSelect<T>["props"]) {
        super(props);
        this.state = {open:false,focused:false,visible:false,optionRefs:Object.keys(props.options).map(()=>React.createRef())};
    }

    get valueKeys() { return Object.entries(this.props.value).map(([key,])=>key) }

    onOptionChange = (key:string, sel:boolean) => {
        if ((key in this.props.value) === sel) return;
        let newValue = {...this.props.value};
        if (sel) newValue[key] = this.props.options[key];
        else delete newValue[key];
        this.props.onChange(newValue);
    };
    isChanging:boolean = false;
    willBeOpen:boolean = false;
    setOpen(newOpen: boolean) {
        let open = this.isChanging?this.willBeOpen:this.state.open, visibleTimerId:NodeJS.Timeout|undefined = undefined;
        if (open === newOpen) return;
        if (this.state.visibleTimerId !== undefined)
            clearTimeout(this.state.visibleTimerId);
        if (newOpen) this.setState({visible:true});
        else visibleTimerId = setTimeout(()=>this.setState({visible:false}),VD);
        this.willBeOpen = newOpen; this.isChanging = true;
        this.setState({open:newOpen,visibleTimerId},()=>this.isChanging=false);
    }
    onToggleOpen = () => this.setOpen(!this.state.open);
    onClose = () => this.setOpen(false);

    onKeyPress = (e:KeyboardEvent):void => {
        if (!e.isTrusted) return;
        const containerElt = this.containerRef.current;
        if (this.state.open) {
            switch (e.key) {
                case "ArrowUp":
                case "ArrowLeft":
                    this.incrementSubFocus(-1);
                    break;
                case "ArrowDown":
                case "ArrowRight":
                    this.incrementSubFocus(1);
                    break;
                case "Enter":
                    if (containerElt && containerElt === document.activeElement)
                        this.setOpen(false);
                    else
                        this.state.optionRefs[this.state.focusOption!].current?.keyboardClick();
                    break;
                case "Escape":
                    containerElt?.focus();
                    this.setOpen(false);
                    break;
                default: break;
            }
        } else {
            switch (e.key) {
                case "ArrowUp":
                case "ArrowLeft":
                case "ArrowDown": // @ts-ignore Fallthrough is intended
                case "ArrowRight":
                    this.setState({focusOption:0});
                    // vvv Continues through Enter case vvv
                case "Enter":
                    if (containerElt && containerElt === document.activeElement)
                        this.setOpen(true);
                    break;
                default: break;
            }
        }
    };

    // Register mouse events globally because they don't work when applied directly to the component.
    componentDidMount() {
        window.addEventListener("keydown",this.onKeyPress);
    }
    componentWillUnmount() {
        window.removeEventListener("keydown",this.onKeyPress);
    }

    /** Check if an element is contained inside this component. */
    hasThisAsParent(eltIn:HTMLElement) {
        if (this.containerRef.current === null)
            return false;
        let elt:HTMLElement|null = eltIn;
        while (elt) {
            if (elt === this.containerRef.current)
                return true;
            elt = elt.parentElement;
        }
        return false;
    }

    onFocus = (e:FocusEvent):void => {
        if (!e.isTrusted) return;
        this.setOpen(true);
        this.setState({focused:true});
    };
    onUnfocus = (e:FocusEvent):void => {
        if (!e.isTrusted) return;
        const {relatedTarget: targetNew} = e;
        if (targetNew === null || targetNew instanceof HTMLElement && !this.hasThisAsParent(targetNew)) {
            this.setOpen(false);
            this.setState({focused:false});
        }
    };
    /** Handler for arrow key navigation inside the select. */
    incrementSubFocus(amount:number):void {
        const currentFocus = this.state.focusOption,
            numOptions = Object.keys(this.props.options).length,
            newFocus = ((currentFocus ?? 0) + amount + numOptions) % numOptions;
        this.setState({focusOption:newFocus},()=>{
            this.state.optionRefs[this.state.focusOption!].current?.focus();
        });
    }

    static getDerivedStateFromProps<T>(props: MultiSelect<T>["props"], state: MultiSelect<T>["state"]): Partial<MultiSelect<T>["state"]> {
        // Ensure that when options are added and removed, the refs stay intact.
        return { optionRefs:Object.keys(props.options).map(()=>React.createRef()) };
    }

    render() {
        const open = this.state.open;
        return (
            <Translation>{t=>(
                <div className={"MultiSelect"+(open?" -open":"")} tabIndex={0} onMouseLeave={this.onClose} onFocus={this.onFocus} onBlur={this.onUnfocus}
                        aria-label={t(this.props.ariaLabel)} aria-expanded={open} role="combobox" ref={this.containerRef}>
                    <div className="-content" onMouseDown={this.onToggleOpen} role="textbox" aria-label={t(this.props.ariaLabel)}>
                        {t(this.props.text)}
                    </div>
                    { this.state.visible && <div className="-options-aligner"><div className="-hover-break-protector">
                        <div className="-options" role="listbox">
                            {Object.entries(this.props.options).map(([key,{name,value}],i)=>(
                                <MultiSelectOption
                                    key={key} ref={this.state.optionRefs[i]}
                                    value={{key,value}} name={name}
                                    selected={key in this.props.value}
                                    focused={i === this.state.focusOption}
                                    onChange={this.onOptionChange.bind(this,key)}/>
                            ))}
                        </div>
                    </div></div>}
                </div>
            )}</Translation>
        );
    }
}