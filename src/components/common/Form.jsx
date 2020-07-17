/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Form as SemanticForm, Message } from "semantic-ui-react";

import { Submit } from "components/common/Inputs";

const FORMERRORS = "form";

const propTypes = {
  defaultValues: PropTypes.objectOf(PropTypes.any),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
  onSubmit: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

const defaultProps = {
  defaultValues: {},
  children: [],
};

export function FormGroup({ children, ...rest }) {
  return <SemanticForm.Group {...rest}>{children}</SemanticForm.Group>; // eslint-disable-line react/jsx-props-no-spreading
}

export default function Form({ defaultValues, children, onSubmit, onSuccess }) {
  const { handleSubmit, control, errors, setError, clearErrors } = useForm({
    defaultValues,
  });

  const onSubmitWithHandlers = async (data) => {
    const submissionError = await onSubmit(data);
    if (submissionError) {
      setError(FORMERRORS, { type: "server", message: submissionError });
    } else {
      onSuccess(data);
    }
  };

  const handleSubmitWithErrors = async () => {
    clearErrors(FORMERRORS);
    await handleSubmit(onSubmitWithHandlers)();
  };

  const getErrors = (name) => {
    const error = errors[name];
    return error ? { content: error.message } : null;
  };

  // react-hook-forms supports uncontrolled components whereas semantic-ui exposes
  // controlled components. In order to integrate both, we use the Controller
  // component from react-hook-forms to facilitate the interaction.
  const registerControlledComponents = (controlledComponents) => {
    return React.Children.map(controlledComponents, (child) => {
      if (React.isValidElement(child) && child.type !== Submit) {
        if (child.type === FormGroup) {
          return (
            <child.type {...child.props}>
              {registerControlledComponents(child.props.children)}
            </child.type>
          );
        }
        const { name, rules, ...rest } = child.props;
        return (
          <Controller
            as={child}
            name={name}
            control={control}
            rules={rules}
            {...rest}
            error={getErrors(name)}
            defaultValue=""
          />
        );
      }
      return child;
    });
  };

  return (
    <SemanticForm error={!!errors.form} onSubmit={handleSubmitWithErrors}>
      <Message error header="Login Error" content={errors?.form?.message} />
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

Form.propTypes = propTypes;
Form.defaultProps = defaultProps;

FormGroup.propTypes = propTypesFormGroup;
FormGroup.defaultProps = defaultPropsFormGroup;
