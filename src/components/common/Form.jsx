/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Form as SemanticForm,
  Icon,
  Message,
  Button,
  Modal,
} from "semantic-ui-react";

import * as Inputs from "components/common/Inputs";

const FORM_ERRORS = "form";

export function Submit(props) {
  return (
    <Button name="submit" type="submit" {...props}>
      SUBMIT
    </Button>
  );
}

const propTypesSubmitConfirm = {
  clearErrors: PropTypes.func,
  trigger: PropTypes.func,
  handleSubmit: PropTypes.func,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  header: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  formHasError: PropTypes.bool,
};

const defaultPropsSubmitConfirm = {
  clearErrors: () => {},
  trigger: () => {},
  handleSubmit: () => {},
  content: "",
  header: "",
  formHasError: false,
};

export function SubmitConfirm({
  clearErrors,
  trigger,
  handleSubmit,
  content,
  header,
  formHasError,
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  // clicking the open modal button should clear all errors otherwise formHasError
  // prevents the modal from ever opening.
  const openConfirm = async () => {
    clearErrors(FORM_ERRORS);
    if (!confirmOpen) {
      const validated = await trigger();
      if (validated) setConfirmOpen(true);
    }
  };

  const closeConfirm = () => setConfirmOpen(false);

  return (
    <>
      <Button
        name="confirmModal"
        size="huge"
        type="button"
        onClick={openConfirm}
      >
        SUBMIT
      </Button>
      <Modal
        open={!formHasError && confirmOpen}
        onClose={closeConfirm}
        onOpen={openConfirm}
      >
        <Modal.Header>
          <Icon color="red" name="warning circle" size="large" /> {header}
        </Modal.Header>
        <Modal.Content>{content}</Modal.Content>
        <Modal.Actions>
          {/* TODO: Currently gives no options to specify custom buttons/text */}
          <Button color="pink" size="large" onClick={closeConfirm}>
            EDIT REVIEW
          </Button>
          <Submit size="large" onClick={handleSubmit} />
        </Modal.Actions>
      </Modal>
    </>
  );
}

export function FormGroup({ children, ...rest }) {
  return <SemanticForm.Group {...rest}>{children}</SemanticForm.Group>; // eslint-disable-line react/jsx-props-no-spreading
}

const propTypesForm = {
  defaultValues: PropTypes.objectOf(PropTypes.any),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  onSubmit: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(["onSubmit", "onChange"]),
};

const defaultPropsForm = {
  defaultValues: {},
  children: [],
  mode: "onSubmit",
};

export default function Form({
  defaultValues,
  children,
  onSubmit,
  onSuccess,
  mode,
}) {
  const {
    handleSubmit,
    control,
    errors,
    setError,
    clearErrors,
    trigger,
  } = useForm({
    defaultValues,
    mode,
  });
  const onSubmitWithHandlers = async (data) => {
    const result = await onSubmit(data);
    if (result.error) {
      setError(FORM_ERRORS, { type: "server", message: result.error });
    } else {
      onSuccess(result, data);
    }
  };

  const handleSubmitWithErrors = async () => {
    clearErrors(FORM_ERRORS);
    await handleSubmit(onSubmitWithHandlers)();
  };

  const getErrors = (name) => {
    const error = errors[name];
    return error ? { content: error.message } : null;
  };

  // This function contains the main functionality of the Form component:
  // passing the proper react-hook-form props to all form elements.
  const registerControlledComponents = (childComponents) => {
    return React.Children.map(childComponents, (child) => {
      if (!React.isValidElement(child)) return child;

      // If the child is a supported input, wrap in a Controller. Controller component
      // are helper functions defined in react-hook-forms and support controlled
      // components such as Semantic UI components.
      if (Object.keys(Inputs).includes(child.type.name)) {
        const { name, rules } = child.props;
        return (
          <Controller
            as={child}
            control={control}
            defaultValue=""
            error={getErrors(name)}
            name={name}
            rules={rules}
          />
        );
      }

      // The SubmitConfirm Modal component contains a nested submit button, requiring
      // the handleSubmitWithErrors function in order to submit programatically.
      if (child.type === SubmitConfirm) {
        return React.cloneElement(child, {
          trigger,
          formHasError: !!getErrors(FORM_ERRORS),
          clearErrors,
          handleSubmit: handleSubmitWithErrors,
        });
      }

      // If child is not directly supported, we do not pass any additional props
      // and recurse on its children.
      return (
        <child.type {...child.props}>
          {registerControlledComponents(child.props.children)}
        </child.type>
      );
    });
  };
  return (
    <SemanticForm error={!!errors.form} onSubmit={handleSubmitWithErrors}>
      <Message error content={errors?.form?.message} header="Error" />
      {registerControlledComponents(children)}
    </SemanticForm>
  );
}

const propTypesFormGroup = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
};

const defaultPropsFormGroup = {
  children: [],
};

Form.propTypes = propTypesForm;
Form.defaultProps = defaultPropsForm;

FormGroup.propTypes = propTypesFormGroup;
FormGroup.defaultProps = defaultPropsFormGroup;

SubmitConfirm.propTypes = propTypesSubmitConfirm;
SubmitConfirm.defaultProps = defaultPropsSubmitConfirm;
