import Image from "next/image";

interface TrendProps {
  trend_type: string;
  src: string;
  alt: string;
  desc: string;
  trend_info: string;
}

export default function Trends({
  trend_type,
  src,
  alt,
  desc,
  trend_info,
}: TrendProps) {
  return (
    <div className="m-3">
      <span className="font-bold text-sm">{trend_type} </span>
      <div className="flex overflow-hidden relative w-full h-30 bg-neutral-200 rounded-md mt-3">
        <div className="relative w-1/3 h-full">
          <Image src={src} alt={alt} fill className="object-center" />
        </div>
        <div className="flex-1 p-3 w-2/3 h-full  flex items-center">
          <p className="text-sm text-gray-800">{desc}</p>
        </div>
      </div>
      <p className="flex items-center text-sm text-neutral-300 mt-3">
        {trend_info}
      </p>
    </div>
  );
}
