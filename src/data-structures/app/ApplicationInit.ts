import { ApprovalStatusEnum, PrivacyStatusEnum, PlatformEnum, GradeLevelEnum, SubjectEnum } from "./application-enums";

export default interface ApplicationInit {
    id?: string | null;
    name?: string;
    url?: string;
    approval?: ApprovalStatusEnum;
    privacy?: PrivacyStatusEnum;
    platforms?: PlatformEnum[];
    grades?: GradeLevelEnum[];
    subjects?: SubjectEnum[];
}
