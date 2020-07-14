import React from "react";
// import { useForm } from "react-hook-form"

import Form from "components/common/Form"
import { Submit, Input } from "components/common/Inputs"

function onSubmitForm() {
    // To be implemented
}

export default function SearchBar() {
    return (
        <Form onSubmit={onSubmitForm()}>
            <Input name="search-bar" />
            <Submit value="Search" />
        </Form>  
    );
}