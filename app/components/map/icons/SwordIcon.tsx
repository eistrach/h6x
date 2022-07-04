export const SwordIcon = (props: React.ComponentProps<"svg">) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      role="img"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M21 3v5l-11 9l-4 4l-3 -3l4 -4l9 -11z"></path>
      <path d="M5 13l6 6"></path>
      <path d="M14.32 17.32l3.68 3.68l3 -3l-3.365 -3.365"></path>
      <path d="M10 5.5l-2 -2.5h-5v5l3 2.5"></path>
    </svg>
  );
};
