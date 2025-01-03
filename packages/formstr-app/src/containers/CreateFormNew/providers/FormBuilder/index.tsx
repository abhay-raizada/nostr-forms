import React, { useRef, useState } from "react";
import { AnswerSettings, FormSpec } from "@formstr/sdk/dist/interfaces";
import { IFormBuilderContext, ILocalForm } from "./typeDefs";
import { generateQuestion } from "../../utils";
import { getDefaultRelays } from "@formstr/sdk";
import { makeTag } from "../../../../utils/utility";
import { IDraft } from "../../../../old/containers/MyForms/components/Drafts/typeDefs";
import { HEADER_MENU_KEYS } from "../../components/Header/config";
import { IFormSettings } from "../../components/FormSettings/types";
import { Tag } from "@formstr/sdk/dist/formstr/nip101";
import { bytesToHex } from "@noble/hashes/utils";
import { getPublicKey, nip04, nip19 } from "nostr-tools";
import { useNavigate } from "react-router-dom";
import { useProfileContext } from "../../../../hooks/useProfileContext";
import { createForm } from "../../../../nostr/createForm";
import {
  getItem,
  LOCAL_STORAGE_KEYS,
  setItem,
} from "../../../../utils/localStorage";

interface ConditionRule {
  questionId: string;
  value: string;
}

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
  initializeForm: (draft: { formSpec: Tag[]; tempId: string }) => {},
  saveForm: (onRelayAccepted?: (url: string) => void) => Promise.resolve(),
  editQuestion: (question: Field, tempId: string) => null,
  addQuestion: (primitive?: string, label?: string) => null,
  deleteQuestion: (tempId: string) => null,
  questionIdInFocus: undefined,
  setQuestionIdInFocus: (tempId?: string) => null,
  formSettings: { titleImageUrl: "", formId: "" },
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
  getFormSpec: () => [],
  saveDraft: () => null,
  selectedTab: HEADER_MENU_KEYS.BUILDER,
  setSelectedTab: (tab: string) => "",
  bottomElementRef: null,
  relayList: [],
  setRelayList: (relayList: { url: string; tempId: string }[]) => null,
  editList: null,
  setEditList: (keys: Set<string>) => null,
  viewList: null,
  setViewList: (keys: Set<string>) => null,
  formAnswers: {},
  updateFormAnswer: (questionId: string, answer: string) => null,
  shouldShowQuestion: (question: Field) => true
});

const InitialFormSettings: IFormSettings = {
  titleImageUrl:
    "https://images.pexels.com/photos/733857/pexels-photo-733857.jpeg",
  description:
    "This is the description, you can use markdown while editing it!" +
    " tap anywhere on the form to edit, including this description.",
  thankYouPage: true,
  formId: makeTag(6),
};

export default function FormBuilderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [questionsList, setQuestionsList] = useState<Array<Field>>([
    generateQuestion(),
  ]);
  const [questionIdInFocus, setQuestionIdInFocus] = useState<
    string | undefined
  >();
  const [formAnswers, setFormAnswers] = useState<Record<string, string>>({});
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
  const { pubkey: userPubkey, requestPubkey } = useProfileContext();
  const [editList, setEditList] = useState<Set<string>>(
    new Set(userPubkey ? [userPubkey] : [])
  );
  const [viewList, setViewList] = useState<Set<string>>(new Set([]));
  const [selectedTab, setSelectedTab] = useState<string>(
    HEADER_MENU_KEYS.BUILDER
  );
  const navigate = useNavigate();

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

  const getFormSpec = (): Tag[] => {
    let formSpec: Tag[] = [];
    formSpec.push(["d", formSettings.formId || ""]);
    formSpec.push(["name", formName]);
    formSpec.push(["settings", JSON.stringify(formSettings)]);
    formSpec = [...formSpec, ...questionsList];
    return formSpec;
  };

  const saveForm = async (onRelayAccepted?: (url: string) => void) => {
    const formToSave = getFormSpec();
    if (!formSettings.formId) {
      alert("Form ID is required");
      return;
    }
    const relayUrls = relayList.map((relay) => relay.url);
    await createForm(
      formToSave,
      relayUrls,
      viewList,
      editList,
      formSettings.encryptForm,
      onRelayAccepted
    ).then(
      (artifacts: {
        signingKey: Uint8Array;
        viewKey: Uint8Array;
        acceptedRelays: string[];
      }) => {
        const { signingKey, viewKey, acceptedRelays } = artifacts;
        navigate("/dashboard", {
          state: {
            pubKey: getPublicKey(signingKey),
            formId: formSettings.formId,
            secretKey: bytesToHex(signingKey),
            viewKey: formSettings.viewKeyInUrl ? bytesToHex(viewKey) : null,
            name: formName,
            relay: acceptedRelays[0],
          },
        });
      },
      (error) => {
        console.log("Error creating form", error);
        alert("error creating the form: " + error);
      }
    );
};
  
  const saveDraft = () => {
    if (formSettings.formId === "") return;
    type Draft = { formSpec: Tag[]; tempId: string };
    const formSpec = getFormSpec();
    const draftObject = { formSpec, tempId: formSettings.formId! };
    let draftArr = getItem<Draft[]>(LOCAL_STORAGE_KEYS.DRAFT_FORMS) || [];
    const draftIds = draftArr.map((draft: Draft) => draft.tempId);
    if (!draftIds.includes(draftObject.tempId)) {
      draftArr.push(draftObject);
    } else {
      draftArr = draftArr.map((draft: Draft) => {
        if (draftObject.tempId === draft.tempId) {
          return draftObject;
        }
        return draft;
      });
    }
    console.log("setting", LOCAL_STORAGE_KEYS.DRAFT_FORMS, draftArr);
    setItem(LOCAL_STORAGE_KEYS.DRAFT_FORMS, draftArr);
    // console.log(
    //   "current local storage",
    //   getItem(LOCAL_STORAGE_KEYS.DRAFT_FORMS)
    // );
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

  const updateFormAnswer = (questionId: string, answer: string) => {
    setFormAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const shouldShowQuestion = (question: Field): boolean => {
    try {
      const answerSettings = JSON.parse(question[5] || '{}');
      const conditions = answerSettings.conditions as {
        rules: ConditionRule[];
      } | undefined;
  
      if (!conditions || !conditions.rules || conditions.rules.length === 0) {
        return true;
      }
  
      return conditions.rules.every((rule: ConditionRule) => {
        const parentAnswer = formAnswers[rule.questionId];
        return parentAnswer === rule.value;
      });
    } catch {
      return true;
    }
  };

  return (
    <FormBuilderContext.Provider
      value={{
        initializeForm: (draft: { formSpec: Tag[]; tempId: string }) => {
          const formSpec = draft.formSpec;
          setFormName(draft.formSpec.filter((f) => f[0] === "name")?.[0][1] || "");
          let settings = JSON.parse(
            draft.formSpec.filter((f) => f[0] === "settings")?.[0][1] || "{}"
          );
          settings = { ...InitialFormSettings, ...settings };
          let fields = draft.formSpec.filter((f) => f[0] === "field") as Field[];
          setFormSettings(settings);
          setQuestionsList(fields);
        },
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
        selectedTab,
        setSelectedTab,
        bottomElementRef: bottomElement,
        relayList,
        setRelayList,
        editList,
        setEditList,
        viewList,
        setViewList,
        formAnswers,
        updateFormAnswer,
        shouldShowQuestion,
      }}
    >
      {children}
    </FormBuilderContext.Provider>
  );
}
