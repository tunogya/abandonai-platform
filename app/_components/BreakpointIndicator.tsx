const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl']

const BreakpointIndicator = () => {
  return (
    <div className={"z-100 fixed top-0 left-0 pointer-events-none z-20 flex items-center justify-center bg-black/20 w-full text-white"}>
      <div>width:</div>
      {breakpoints.map((bp) => (
        <div
          key={bp}
          className={`
              hidden
              ${bp === 'sm' && 'sm:block md:hidden'}
              ${bp === 'md' && 'md:block lg:hidden'}
              ${bp === 'lg' && 'lg:block xl:hidden'}
              ${bp === 'xl' && 'xl:block 2xl:hidden'}
              ${bp === '2xl' && '2xl:block'}
            `}
          data-breakpoint={bp}
        >
          {bp}
        </div>
      ))}
    </div>
  )
}

export default BreakpointIndicator