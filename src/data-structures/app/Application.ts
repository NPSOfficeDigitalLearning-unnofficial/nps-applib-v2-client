import ApplicationInit from "./ApplicationInit";
import { ApprovalStatusEnum, PrivacyStatusEnum, PlatformEnum, GradeLevelEnum, SubjectEnum } from "./application-enums";

const DEFAULT_APP_DATA:Required<ApplicationInit> = { id: null, name: "", url: "", approval: "UNK", privacy: "UNK", grades: [], platforms: [], subjects: [] };

export default class Application {
    private _id: string|null;
    private _name: string;
    private _url: string;
    private _approval: ApprovalStatusEnum;
    private _privacy: PrivacyStatusEnum;
    private _platforms: Set<PlatformEnum>;
    private _grades: Set<GradeLevelEnum>;
    private _subjects: Set<SubjectEnum>;

    public readonly _reactInstanceKey:string = new Array(4).fill(null).map(()=>Math.random().toString(16).substr(2)).join("");

    constructor(init?: ApplicationInit) {
        let { id, approval, grades, name, platforms, privacy, subjects, url } = { ...DEFAULT_APP_DATA, ...(init || {}) };
        this._id = id;
        this._name = name;
        this._url = url;
        this._approval = approval;
        this._privacy = privacy;
        this._subjects = new Set(subjects);
        this._platforms = new Set(platforms);
        this._grades = new Set(grades);
    }

    public get id       () { return this._id        }
    public get name     () { return this._name      }
    public get url      () { return this._url       }
    public get approval () { return this._approval  }
    public get privacy  () { return this._privacy   }
    public get platforms() { return this._platforms }
    public get grades   () { return this._grades    }
    public get subjects () { return this._subjects  }

    public set name(v) { this._name = v }
    public set url(v) { this._url = v }
    public set approval(v) { this._approval = v }
    public set privacy(v) { this._privacy = v }
    
    public setId(v:string) {
        if (this._id) throw new Error("Application id can only be set once.");
        else if (v) this._id = v;
    }


    toJSON():ApplicationInit {
        const { id, name, url, approval, privacy, platforms:platformsSet, grades:gradesSet, subjects:subjectsSet } = this;
        const platforms = [...platformsSet], grades = [...gradesSet], subjects = [...subjectsSet];
        return { id, name, url, approval, privacy, platforms, grades, subjects };
    }
    toString():string {
        return `[ApplicationData "${this.name}" (id: ${this.id})]`;
    }
}
