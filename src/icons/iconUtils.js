export const getClassName = ({className, sizeClass, colorClass, extraClass}) => {
  if (className) {
    return className;
  } else {
    let cls = `${sizeClass || "w-6 h-6"} ${colorClass || "text-zinc-200"}`;
    if (extraClass) {
      cls = `${cls} ${extraClass}`;
    }
    return cls;
  }
}