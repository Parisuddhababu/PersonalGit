import FormValidationError from "@components/FormValidationError";
import { useRef, useState } from "react";

const ReactTagInput = (props: any) => {
  const [tagsValue, setTagsValue] = useState<any>([]);
  const [text, setText] = useState("");
  const inputEl = useRef<HTMLInputElement>(null);

  const addTag = (val: any) => {
    if (val !== "") {
      if (!tagsValue.includes(val)) {
        tagsValue?.push(val);
        props.setValueFunctionInReactHookForm(props?.name, tagsValue);
        setTagsValue(tagsValue);
        setText("");
      } else {
        setText("");
      }
    }
  };

  const handleKeyEvent = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const { keyCode } = event;

    if (keyCode == 13) {
      addTag(text);
    }

    if (keyCode == 8 && !text) {
      removeTag(tagsValue?.length - 1);
    }
  };

  const removeTag = (index: number) => {
    const tags = tagsValue.filter((_: any, i: number) => i !== index);
    setTagsValue(tags);
    if (props?.onChange) {
      props?.onChange && props?.onChange(tags);
    }

    (inputEl.current as HTMLInputElement).focus();
  };

  const RemoveSpecificIndex = (val: number) => {
    const array = tagsValue.filter((ele: any) => ele !== val);
    setTagsValue(array);
  };

  return (
    <div>
      <div className="tag-input">
        {tagsValue?.length > 0 &&
          tagsValue.map((tag: any, index: number) => (
            <div className="tag-input__tag" key={index}>
              <span className="tag-input__tag-content">
                {tag}
                <i onClick={() => RemoveSpecificIndex(tag)}>(×)</i>
              </span>
            </div>
          ))}
        <input
          name={props?.name}
          ref={inputEl}
          className={props?.className}
          value={text}
          onBlur={(event) => addTag(event.target.value)}
          onKeyUp={(event) => handleKeyEvent(event)}
          onChange={(e) => setText(e.target.value)}
        />
        <FormValidationError errors={props?.errors} name={props?.name} />
      </div>
    </div>
  );
};

export default ReactTagInput;
