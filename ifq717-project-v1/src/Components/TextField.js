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
  width
}) {
  return (
    <Col md={size}>
      <FormGroup className="form-group">
      <Form.Label htmlFor={id} block>
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
        className={`${className} text-field-component`}
        style={{ width: `${width}`}}
      />
      </FormGroup>
    </Col>
  );
}