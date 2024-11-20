import React, { useState, useRef, useEffect } from 'react';
import { message } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import { ReactComponent as Asterisk } from "../../../../Images/asterisk.svg";
import StyledWrapper from "./CardHeader.style";
import useFormBuilderContext from "../../hooks/useFormBuilderContext";
import useDeviceType from "../../../../hooks/useDeviceType";
import { classNames } from "../../../../utils/utility";
import { Field } from "../../providers/FormBuilder";

interface CardHeaderProps {
  required?: boolean;
  onRequired: (required: boolean) => void;
  question: Field;
  onReorderKey: (keyType: "UP" | "DOWN", tempId: string) => void;
  firstQuestion: boolean;
  lastQuestion: boolean;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  required,
  onRequired,
  onReorderKey,
  question,
  firstQuestion,
  lastQuestion,
}) => {
  const { MOBILE } = useDeviceType();
  const { toggleSettingsWindow, deleteQuestion, setQuestionIdInFocus } = useFormBuilderContext();
  const [showUndo, setShowUndo] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const timeoutRef = useRef<number>();
  const intervalRef = useRef<number>();
  const messageKeyRef = useRef<string>();
  
  const handleDelete = () => {
    setShowUndo(true);
    let count = 2;
    
    messageKeyRef.current = `delete-${Date.now()}`;
    messageApi.loading({ 
      content: `Question will be deleted in ${count}s`,
      key: messageKeyRef.current,
      duration: 0 
    });
    
    intervalRef.current = window.setInterval(() => {
      count -= 1;
      messageApi.loading({ 
        content: `Question will be deleted in ${count}s`,
        key: messageKeyRef.current,
        duration: 0 
      });
    }, 1000);
    
    timeoutRef.current = window.setTimeout(() => {
      deleteQuestion(question[1]);
      setQuestionIdInFocus(undefined);
      setShowUndo(false);
      messageApi.destroy(messageKeyRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }, 2000);
  };

  const handleUndo = () => {
    window.clearTimeout(timeoutRef.current);
    window.clearInterval(intervalRef.current);
    setShowUndo(false);
    if (messageKeyRef.current) {
      messageApi.success({ 
        content: 'Deletion cancelled',
        key: messageKeyRef.current,
        duration: 2 
      });
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (messageKeyRef.current) messageApi.destroy(messageKeyRef.current);
    };
  }, []);

  return (
    <StyledWrapper>
      {contextHolder}
      <div className="action-wrapper">
        <div style={{ display: "flex" }}>
          {!firstQuestion && (
            <div className="action-icon">
              <ArrowUpOutlined
                className="icon-svg"
                onClick={() => onReorderKey("UP", question[1])}
              />
            </div>
          )}
          {!lastQuestion && (
            <div className="action-icon">
              <ArrowDownOutlined
                className="icon-svg"
                onClick={() => onReorderKey("DOWN", question[1])}
              />
            </div>
          )}
          <div className="action-icon">
            <Asterisk
              className={classNames("asterisk", { asteriskSelected: required })}
              onClick={() => {
                onRequired(!required);
              }}
            />
          </div>
          {showUndo ? (
            <button className="action-icon" style={{ color: "red" }} onClick={handleUndo}>↶</button>
          ) : (
            <DeleteOutlined className="action-icon" style={{ color: "red" }} onClick={handleDelete} />
          )}
        </div>

        {MOBILE && (
          <div className="action-icon">
            <MoreOutlined onClick={toggleSettingsWindow} />
          </div>
        )}
      </div>
    </StyledWrapper>
  );
};

export default CardHeader;