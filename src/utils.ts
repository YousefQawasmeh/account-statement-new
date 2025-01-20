export const objectToFormData = (obj: { [x: string]: any }, form = new FormData(), namespace = '') => {
    for (const key in obj) {
      const value = obj[key];
  
      if (value === undefined) {
        continue;
      }
      const formKey = namespace ? `${namespace}[${key}]` : key;
  
      if (value instanceof File || value instanceof Blob) {
        form.append(formKey, value);
      } else if (Array.isArray(value)) {
        value.forEach((v, i) => {
          objectToFormData(v, form, `${formKey}[${i}]`);
        });
      } else if (typeof value === 'object' && value !== null) {
        objectToFormData(value, form, formKey);
      } else {
        form.append(formKey, value);
      }
    }
    return form;
  };