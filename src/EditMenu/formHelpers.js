import { jsxToJson } from 'jsx-to-json';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';

export const submitHelper = (e) => {};

export const formTransformer = (elemDataText) => {
    console.log('---pre transform', elemDataText);
    const formChildren = [''];
    const jsonArray = jsxToJson(elemDataText);
    console.log('---post transform', jsonArray);

    return formChildren;
};

export const FormExpander = (props) => {
    const { formChildren } = props;
    const { register } = useFormContext(); // retrieve all hook methods

    return formChildren.map((eachChild) => {
        // console.log(eachChild);
        return <input {...register(eachChild.name)} />;
    });
};
