import React, { useRef, useState } from "react";
import { AnswerSettings, FormSpec } from "@formstr/sdk/dist/interfaces";
import { IFormBuilderContext, ILocalForm } from "./typeDefs";
import { generateQuestion } from "../../utils";
import { getDefaultRelays } from "@formstr/sdk";
import { createForm } from "@formstr/sdk/dist/formstr/nip101/createForm";
import {
  LOCAL_STORAGE_KEYS,
  getItem,
  setItem,
} from "../../../../utils/localStorage";
import { makeTag } from "../../../../utils/utility";
import { useNavigate } from "react-router-dom";
import { IDraft } from "../../../MyForms/components/Drafts/typeDefs";
import { HEADER_MENU_KEYS } from "../../components/Header/config";
import { IFormSettings } from "../../components/FormSettings/types";

export type Field = [
  placeholder: string,
  fieldId: string,
  dataType: string,
  label: string,
  options: string,
  config: string,
];

export const FormBuilderContext = React.createContext<IFormBuilderContext>({
  questionsList: [],
  initializeForm: (draft: IDraft) => null,
  saveForm: () => null,
  editQuestion: (question: Field, tempId: string) => null,
  addQuestion: (primitive?: string, label?: string) => null,
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
  updateQuestionsList: (list: Field[]) => null,
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
  const [questionsList, setQuestionsList] = useState<Array<Field>>([
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

  const getFormSpec = (): any => {
    let formSpec = [];
    formSpec.push(["d", formSettings.formId]);
    formSpec.push(["name", formName]);
    formSpec.push(["settings", JSON.stringify(formSettings)]);
    formSpec = [...formSpec, ...questionsList];
    return formSpec;
  };

  const deleteDraft = (formTempId: string) => {
    type Draft = { formSpec: unknown; tempId: string };
    let draftArr = getItem<Draft[]>(LOCAL_STORAGE_KEYS.DRAFT_FORMS) || [];
    draftArr = draftArr.filter((draft: Draft) => draft.tempId !== formTempId);
    setItem(LOCAL_STORAGE_KEYS.DRAFT_FORMS, draftArr);
  };

  function storeLocally(
    formCredentials: Array<string>,
    formIdentifier?: string
  ) {
    const saveObject: ILocalForm = {
      key: formCredentials[0],
      publicKey: formCredentials[0],
      privateKey: formCredentials[1],
      formId: formIdentifier,
      name: formName,
      createdAt: new Date().toString(),
    };
    const forms =
      getItem<Array<ILocalForm>>(LOCAL_STORAGE_KEYS.LOCAL_FORMS) || [];

    const existingKeys = forms.map((form) => form.publicKey);
    if (existingKeys.includes(saveObject.publicKey)) {
      return;
    }
    forms.push(saveObject);
    setItem(LOCAL_STORAGE_KEYS.LOCAL_FORMS, forms);
  }

  const saveForm = async () => {
    console.log("CALLLED!!!");
    const formToSave = getFormSpec();
    console.log("CALLLED!!! saving form", formToSave);
    if (!formSettings.formId) {
      alert("Form ID is required");
      return;
    }
    const relayUrls = relayList.map((relay) => relay.url);
    await createForm(formToSave, null, relayUrls).then(
      (value) => {
        deleteDraft(formTempId);
        setFormTempId(""); // to avoid creating a draft
        navigate("/myForms/local");
      },
      (error) => {
        console.log("Error creating form", error);
        alert("error creating the form: " + error);
      }
    );
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

  const editQuestion = (question: Field, tempId: string) => {
    const editedList = questionsList.map((existingQuestion: Field) => {
      if (existingQuestion[1] === tempId) {
        return question;
      }
      return existingQuestion;
    });
    setQuestionsList(editedList);
  };

  const addQuestion = (
    primitive?: string,
    label?: string,
    answerSettings?: AnswerSettings
  ) => {
    console.log("called with,", primitive, label, answerSettings);
    console.log("question list was", questionsList);
    setIsLeftMenuOpen(false);
    setQuestionsList([
      ...questionsList,
      generateQuestion(primitive, label, [], answerSettings),
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
      return preQuestions.filter((question) => question[1] !== tempId);
    });
  };

  const updateQuestionsList = (newQuestionsList: Field[]) => {
    setQuestionsList(newQuestionsList);
  };

  const updateFormSetting = (settings: IFormSettings) => {
    setFormSettings((preSettings) => ({ ...preSettings, ...settings }));
  };

  const updateFormTitleImage = (e: React.FormEvent<HTMLInputElement>) => {
    const imageUrl = e.currentTarget.value;
    if (imageUrl) {
      updateFormSetting({
        titleImageUrl: imageUrl,
      });
    }
  };

  const initializeForm = (draft: IDraft) => {
    // const formSpec = draft.formSpec;
    // setFormName(formSpec.name);
    // if (formSpec.settings) setFormSettings(formSpec.settings);
    // setQuestionsList(
    //   formSpec.fields?.map((field) => {
    //     return {
    //       ...field,
    //       tempId: makeTag(6),
    //     };
    //   }) || []
    // );
    // setFormTempId(draft.tempId);
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
