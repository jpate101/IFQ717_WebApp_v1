import { Col, Form, FormGroup } from "react-bootstrap";

export default function TextField({
  label,
  placeholder,
  type,
  size,
  Component = Form.Control,
  value,
  onChange,
  id,
  className,
  width,
  error
}) {
  const hasError = error ? true : false;

  return (
    <Col md={size}>
      <FormGroup className="form-group">
        <Form.Label htmlFor={id} block className="login-labels">
          {label}
        </Form.Label>
        <Component
          type={type}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
          }}
          className={`${className} text-field-component ${hasError ? "border-red-500" : ""}`}
          style={{ width: `${width}` }}
        />
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
      </FormGroup>
    </Col>
  );
}

