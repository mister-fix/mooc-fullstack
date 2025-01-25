import { icons } from "lucide-react";

const Icon = ({ name, size, color }) => {
  const LucideIcon = icons[name];

  return <LucideIcon size={size} color={color} />;
};

export default Icon;
