import {
  AnswerSettings,
  AnswerTypes,
  FormSpec,
  IFormSettings,
} from "@formstr/sdk/dist/interfaces";
import { IDraft } from "../../../MyForms/components/Drafts/typeDefs";

type Field = [string, string, string, string, string[][] | null, string];

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
  getFormSpec: () => FormSpec;
  saveDraft: () => void;
  setFormTempId: (formTempId: string) => void;
  formTempId: string;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  bottomElementRef: React.RefObject<HTMLDivElement> | null;
  relayList: { url: string; tempId: string }[];
  setRelayList: (list: { url: string; tempId: string }[]) => void;
}
