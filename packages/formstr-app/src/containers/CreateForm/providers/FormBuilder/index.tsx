import React, { useRef, useState } from "react";
import {
  AnswerSettings,
  AnswerTypes,
  FormSpec,
  IFormSettings,
} from "@formstr/sdk/dist/interfaces";
import { IFormBuilderContext } from "./typeDefs";
import { IQuestion } from "../../typeDefs";
import { areArraysSame, generateQuestion } from "../../utils";
import { createForm, getDefaultRelays } from "@formstr/sdk";
import {
  LOCAL_STORAGE_KEYS,
  getItem,
  setItem,
} from "../../../../utils/localStorage";
import { makeTag } from "../../../../utils/utility";
import { useNavigate } from "react-router-dom";
import { ILocalForm } from "../../../MyForms/components/Local/typeDefs";
import { IDraft } from "../../../MyForms/components/Drafts/typeDefs";
import { HEADER_MENU_KEYS } from "../../components/Header/config";

export const FormBuilderContext = React.createContext<IFormBuilderContext>({
  questionsList: [],
  initializeForm: (draft: IDraft) => null,
  saveForm: () => null,
  editQuestion: (question: IQuestion, tempId: string) => null,
  addQuestion: (answerType?: AnswerTypes, label?: string) => null,
  deleteQuestion: (tempId: string) => null,
  questionIdInFocus: undefined,
  setQuestionIdInFocus: (tempId?: string) => null,
  formSettings: { titleImageUrl: "" },
  updateFormSetting: (settings: IFormSettings) => null,
  updateFormTitleImage: (e: React.FormEvent<HTMLInputElement>) => null,
  closeSettingsOnOutsideClick: () => null,
  closeMenuOnOutsideClick: () => null,
  isRightSettingsOpen: false,
  isLeftMenuOpen: false,
  setIsLeftMenuOpen: (open: boolean) => null,
  toggleSettingsWindow: () => null,
  formName: "",
  updateFormName: (name: string) => null,
  updateQuestionsList: (list: IQuestion[]) => null,
  getFormSpec: () => {
    return { name: "", schemaVersion: "v1" };
  },
  saveDraft: () => null,
  setFormTempId: (formTempId: string) => "",
  formTempId: "",
  selectedTab: HEADER_MENU_KEYS.BUILDER,
  setSelectedTab: (tab: string) => "",
  bottomElementRef: null,
  relayList: [],
  setRelayList: (relayList: { url: string; tempId: string }[]) => null,
});

const InitialFormSettings: IFormSettings = {
  titleImageUrl:
    "https://images.pexels.com/photos/733857/pexels-photo-733857.jpeg",
  description:
    "This is the description, you can use markdown while editing it!" +
    " tap anywhere on the form to edit, including this description.",
  thankYouPage: true,
};

export default function FormBuilderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const [questionsList, setQuestionsList] = useState<IQuestion[]>([
    generateQuestion(),
  ]);
  const [questionIdInFocus, setQuestionIdInFocus] = useState<
    string | undefined
  >();
  const [formSettings, setFormSettings] =
    useState<IFormSettings>(InitialFormSettings);

  const [isRightSettingsOpen, setIsRightSettingsOpen] = useState(false);
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(false);
  const [formName, setFormName] = useState<string>(
    "This is the title of your form! Tap to edit."
  );
  const bottomElement = useRef<HTMLDivElement>(null);
  const [relayList, setRelayList] = useState(
    getDefaultRelays().map((relay) => {
      return { url: relay, tempId: makeTag(6) };
    })
  );

  const [formTempId, setFormTempId] = useState<string>(makeTag(6));
  const [selectedTab, setSelectedTab] = useState<string>(
    HEADER_MENU_KEYS.BUILDER
  );

  const toggleSettingsWindow = () => {
    setIsRightSettingsOpen((open) => {
      return !open;
    });
  };

  const closeSettingsOnOutsideClick = () => {
    isRightSettingsOpen && toggleSettingsWindow();
  };

  const closeMenuOnOutsideClick = () => {
    isLeftMenuOpen && setIsLeftMenuOpen(false);
  };

  const getFormSpec = (): FormSpec => {
    return {
      name: formName,
      schemaVersion: "v1",
      settings: formSettings,
      fields: questionsList.map((question) => {
        return {
          question: question.question,
          answerType: question.answerType,
          answerSettings: question.answerSettings,
        };
      }),
    };
  };

  const deleteDraft = (formTempId: string) => {
    type Draft = { formSpec: unknown; tempId: string };
    let draftArr = getItem<Draft[]>(LOCAL_STORAGE_KEYS.DRAFT_FORMS) || [];
    draftArr = draftArr.filter((draft: Draft) => draft.tempId !== formTempId);
    setItem(LOCAL_STORAGE_KEYS.DRAFT_FORMS, draftArr);
  };

  function storeLocally(formCredentials: Array<string>) {
    let saveObject: ILocalForm = {
      key: formCredentials[0],
      publicKey: formCredentials[0],
      privateKey: formCredentials[1],
      name: formName,
      createdAt: new Date().toString(),
    };
    let forms =
      getItem<Array<ILocalForm>>(LOCAL_STORAGE_KEYS.LOCAL_FORMS) || [];

    const existingKeys = forms.map((form) => form.publicKey);
    if (existingKeys.includes(saveObject.publicKey)) {
      return;
    }
    forms.push(saveObject);
    setItem(LOCAL_STORAGE_KEYS.LOCAL_FORMS, forms);
  }

  const saveForm = async () => {
    let formToSave = getFormSpec();
    let tags: Array<Array<string>> = [];
    if (formSettings.publicForm === true) {
      tags = [["l", "formstr"]];
    }
    let relayUrls = relayList.map((relay) => relay.url);

    const formCreds = await createForm(
      formToSave,
      false,
      null,
      tags,
      relayUrls,
      !areArraysSame(relayUrls, getDefaultRelays())
    );
    deleteDraft(formTempId);
    setFormTempId(""); // to avoid creating a draft
    storeLocally(formCreds);
    navigate("/myForms/local", { state: formCreds });
  };

  const saveDraft = () => {
    if (formTempId === "") return;
    type V1Draft = { formSpec: FormSpec; tempId: string };
    const formSpec = getFormSpec();
    const draftObject = { formSpec, tempId: formTempId };
    let draftArr = getItem<V1Draft[]>(LOCAL_STORAGE_KEYS.DRAFT_FORMS) || [];
    const draftIds = draftArr.map((draft: V1Draft) => draft.tempId);
    if (!draftIds.includes(draftObject.tempId)) {
      draftArr.push(draftObject);
    } else {
      draftArr = draftArr.map((draft: V1Draft) => {
        if (draftObject.tempId === draft.tempId) {
          return draftObject;
        }
        return draft;
      });
    }
    setItem(LOCAL_STORAGE_KEYS.DRAFT_FORMS, draftArr);
  };

  const editQuestion = (question: IQuestion, tempId: string) => {
    let editedList = questionsList.map((existingQuestion: IQuestion) => {
      if (existingQuestion.tempId === tempId) {
        return question;
      }
      return existingQuestion;
    });
    setQuestionsList(editedList);
  };

  const addQuestion = (
    answerType?: AnswerTypes,
    label?: string,
    answerSettings?: AnswerSettings
  ) => {
    setIsLeftMenuOpen(false);
    setQuestionsList([
      ...questionsList,
      generateQuestion(answerType, label, answerSettings),
    ]);
    setTimeout(() => {
      bottomElement?.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  const deleteQuestion = (tempId: string) => {
    if (questionIdInFocus === tempId) {
      setQuestionIdInFocus(undefined);
    }
    setQuestionsList((preQuestions) => {
      return preQuestions.filter((question) => question.tempId !== tempId);
    });
  };

  const updateQuestionsList = (newQuestionsList: IQuestion[]) => {
    setQuestionsList(newQuestionsList);
  };

  const updateFormSetting = (settings: IFormSettings) => {
    setFormSettings((preSettings) => ({ ...preSettings, ...settings }));
  };

  const updateFormTitleImage = (e: React.FormEvent<HTMLInputElement>) => {
    let imageUrl = e.currentTarget.value;
    if (imageUrl) {
      updateFormSetting({
        titleImageUrl: imageUrl,
      });
    }
  };

  const initializeForm = (draft: IDraft) => {
    let formSpec = draft.formSpec;
    setFormName(formSpec.name);
    if (formSpec.settings) setFormSettings(formSpec.settings);
    setQuestionsList(
      formSpec.fields?.map((field) => {
        return {
          ...field,
          tempId: makeTag(6),
        };
      }) || []
    );
    setFormTempId(draft.tempId);
  };

  return (
    <FormBuilderContext.Provider
      value={{
        initializeForm,
        questionsList,
        saveForm,
        editQuestion,
        addQuestion,
        deleteQuestion,
        questionIdInFocus,
        setQuestionIdInFocus,
        formSettings,
        updateFormSetting,
        updateFormTitleImage,
        closeSettingsOnOutsideClick,
        closeMenuOnOutsideClick,
        toggleSettingsWindow,
        isRightSettingsOpen,
        isLeftMenuOpen,
        setIsLeftMenuOpen,
        formName,
        updateFormName: setFormName,
        updateQuestionsList,
        getFormSpec,
        saveDraft,
        setFormTempId,
        formTempId,
        selectedTab,
        setSelectedTab,
        bottomElementRef: bottomElement,
        relayList,
        setRelayList,
      }}
    >
      {children}
    </FormBuilderContext.Provider>
  );
}
