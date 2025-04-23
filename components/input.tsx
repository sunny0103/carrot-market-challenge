import SVG from "@/components/svg";
import { InputHTMLAttributes } from "react";

interface InputProps {
  name: string;
  errors?: string[];
  svgPath: string;
  svgClassname: string;
}
export default function Input({
  name,
  errors = [],
  svgPath,
  svgClassname,
  ...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col items-center w-full gap-2 relative">
      <input
        name={name}
        className="bg-transparent w-full border-2 h-13 pl-10 rounded-2xl text-white 
        focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500 transition-colors"
        {...rest}
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
