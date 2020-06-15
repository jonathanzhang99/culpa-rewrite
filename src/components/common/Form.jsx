import PropTypes from "prop-types";
import React from "react";
import { useForm } from "react-hook-form";

const propTypes = {
  defaultValues: PropTypes.objectOf(PropTypes.any),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
  onSubmit: PropTypes.func.isRequired,
};

const defaultProps = {
  defaultValues: {},
  children: [],
};

export default function Form({ defaultValues, children, onSubmit }) {
  const { handleSubmit, register } = useForm({ defaultValues });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          register,
          key: child.props.name,
          ...child.props,
        });
      })}
    </form>
  );
}

Form.propTypes = propTypes;
Form.defaultProps = defaultProps;
