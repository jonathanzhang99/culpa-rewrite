import PropTypes from "prop-types";
import React from "react";
import { useForm } from "react-hook-form";
import { Form as SemanticForm, Message } from "semantic-ui-react";

const FORM_ERRORS = "form";

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

export default function Form({ defaultValues, children, onSubmit, onSuccess }) {
  const { handleSubmit, register, errors, setError, clearErrors } = useForm({
    defaultValues,
  });

  const onSubmitWithHandlers = async (data) => {
    const submissionError = await onSubmit(data);
    if (submissionError) {
      setError(FORM_ERRORS, { type: "server", message: submissionError });
    } else {
      onSuccess(data);
    }
  };

  const handleSubmitWithErrors = async () => {
    clearErrors(FORM_ERRORS);
    await handleSubmit(onSubmitWithHandlers)();
  };

  const registeredChildren = React.Children.map(children, (child) => {
    const childError = errors[child.props.name];

    let childErrorContent;
    if (childError) {
      childErrorContent = { content: childError.message };
    }

    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        register,
        key: child.props.id,
        error: childErrorContent,
      });
    }
    return child;
  });

  return (
    <SemanticForm error={!!errors.form} onSubmit={handleSubmitWithErrors}>
      <Message error header="Login Error" content={errors?.form?.message} />
      {registeredChildren}
    </SemanticForm>
  );
}

Form.propTypes = propTypes;
Form.defaultProps = defaultProps;
