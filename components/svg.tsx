interface SVGProps {
  classname?: string;
  path: string;
}

export default function SVG({ classname, path }: SVGProps) {
  return (
    <svg
      className={classname}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}
