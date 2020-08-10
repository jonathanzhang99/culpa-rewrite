/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Form as SemanticForm, Message, Divider } from "semantic-ui-react";

import { Submit, SubmitConfirm } from "components/common/Inputs";

const FORMERRORS = "form";

const propTypes = {
  defaultValues: PropTypes.objectOf(PropTypes.any),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
  onSubmit: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(["onSubmit", "onChange"]),
};

const defaultProps = {
  defaultValues: {},
  children: [],
  mode: "onSubmit",
};

export function FormGroup({ children, ...rest }) {
  return <SemanticForm.Group {...rest}>{children}</SemanticForm.Group>; // eslint-disable-line react/jsx-props-no-spreading
}

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
      setError(FORMERRORS, { type: "server", message: result.error });
    } else {
      onSuccess(result, data);
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

  const excludedTypes = [Submit, Divider];
  // react-hook-forms supports uncontrolled components whereas semantic-ui exposes
  // controlled components. In order to integrate both, we use the Controller
  // component from react-hook-forms to facilitate the interaction.
  const registerControlledComponents = (controlledComponents) => {
    return React.Children.map(controlledComponents, (child) => {
      if (React.isValidElement(child) && !excludedTypes.includes(child.type)) {
        if (child.type === FormGroup) {
          return (
            <child.type {...child.props}>
              {registerControlledComponents(child.props.children)}
            </child.type>
          );
        }
        if (child.type === SubmitConfirm) {
          return React.cloneElement(child, {
            trigger,
            handleSubmit: handleSubmitWithErrors,
          });
        }

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
      return child;
    });
  };

  return (
    <SemanticForm error={!!errors.form} onSubmit={handleSubmitWithErrors}>
      <Message error content={errors?.form?.message} header="Login Error" />
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
