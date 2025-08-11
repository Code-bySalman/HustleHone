import React from "react"

type StarBorderProps<T extends React.ElementType> = {
  as?: T
  className?: string
  color?: string
  speed?: string
  thickness?: number
  children?: React.ReactNode
} & React.ComponentPropsWithoutRef<T>

const StarBorder = <T extends React.ElementType = "button">({
  as,
  className = "",
  color = "white",
  speed = "6s",
  thickness = 2,
  children,
  ...rest
}: StarBorderProps<T>) => {
    const Component = as || "button"
  return (
    <Component
      className={`
        relative inline-block overflow-hidden rounded-[20px] p-[2px]
        bg-gradient-to-r from-black via-blue-500 to-white
        hover:from-white hover:via-black hover:to-blue-500
        transition-all duration-500
        ${className}
      `}
      style={{
        ...(rest.style || {}),
      }}
      {...rest}
    >
      {/* Star trails */}
      <div
        className="absolute w-[300%] h-[50%] opacity-70 bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      ></div>
      <div
        className="absolute w-[300%] h-[50%] opacity-70 top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      ></div>

      {/* Inner content box */}
    <div className="relative z-10 bg-gradient-to-b from-white to-gray-500 text-gray-900 text-center text-[16px] py-[16px] px-[26px] rounded-[18px] shadow-md hover:shadow-lg transition-all duration-300">
  {children}
</div>
    </Component>
  )
}

export default StarBorder
