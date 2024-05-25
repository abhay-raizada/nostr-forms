import { AnswerSettings, FormSpec } from "@formstr/sdk/dist/interfaces";
import { IDraft } from "../../../MyForms/components/Drafts/typeDefs";
import { Field } from ".";
import { IFormSettings } from "../../components/FormSettings/types";
import { Tag } from "@formstr/sdk/dist/formstr/nip101";

export interface ILocalForm {
  key: string;
  name: string;
  createdAt: string;
  publicKey: string;
  privateKey: string;
  formCredentials?: Array<string>;
  formId?: string;
}

export interface IFormBuilderContext {
  initializeForm: (draft: IDraft) => void;
  questionsList: Field[];
  saveForm: () => void;
  closeSettingsOnOutsideClick: () => void;
  closeMenuOnOutsideClick: () => void;
  editQuestion: (question: Field, tempId: string) => void;
  addQuestion: (
    primitive?: string,
    label?: string,
    answerSettings?: AnswerSettings
  ) => void;
  deleteQuestion: (tempId: string) => void;
  questionIdInFocus?: string;
  setQuestionIdInFocus: (tempId?: string) => void;
  formSettings: IFormSettings;
  updateFormSetting: (settings: IFormSettings) => void;
  updateFormTitleImage: (e: React.FormEvent<HTMLInputElement>) => void;
  isRightSettingsOpen: boolean;
  isLeftMenuOpen: boolean;
  setIsLeftMenuOpen: (isOpen: boolean) => void;
  toggleSettingsWindow: () => void;
  formName: string;
  updateFormName: (formName: string) => void;
  updateQuestionsList: (list: Field[]) => void;
  getFormSpec: () => Tag[];
  saveDraft: () => void;
  setFormTempId: (formTempId: string) => void;
  formTempId: string;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  bottomElementRef: React.RefObject<HTMLDivElement> | null;
  relayList: { url: string; tempId: string }[];
  setRelayList: (list: { url: string; tempId: string }[]) => void;
  editList: Set<string> | null;
  setEditList: (keys: Set<string>) => void;
  viewList: Set<string> | null;
  setViewList: (keys: Set<string>) => void;
}