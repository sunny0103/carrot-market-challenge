import SVG from "@/components/svg";
import { SVG_PATHS } from "@/components/svg-path";

interface FormInputProps {
  name: string;
  type: string;
  placeholder: string;
  required: boolean;
  errors: string[];
  svgPath: string;
  svgClassname: string;
}
export default function FormInput({
  name,
  type,
  placeholder,
  required,
  errors,
  svgPath,
  svgClassname,
}: FormInputProps) {
  return (
    <div className="flex items-center w-full gap-2 relative">
      <input
        name={name}
        className="bg-transparent w-full border-2 h-13 pl-10 rounded-2xl text-white "
        type={type}
        placeholder={placeholder}
        required={required}
      />
      <SVG classname={svgClassname} path={svgPath} />
      {errors.map((error, index) => (
        <span key={index} className="text-red-500 font-medium">
          {error}
        </span>
      ))}
    </div>
  );
}
