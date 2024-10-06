"use client";

import { Toaster } from "@/components/ui/toaster";

const Template = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="min-h-screen">
      <Toaster />
      {children}
    </div>
  );
};

export default Template;

{
  /* <div className="min-h-screen w-full overflow-hidden relative transition-colors duration-300 
bg-gradient-to-br from-white-50 to-white-100 
dark:from-gray-900 dark:to-black-950">
<div className="absolute inset-0 z-0 pointer-events-none">
<div className="w-full h-full opacity-5 dark:opacity-10" 
style={{
backgroundImage: `
linear-gradient(to right, ${theme === 'dark' ? 'gray' : 'navy'} 1px, transparent 1px),
linear-gradient(to bottom, ${theme === 'dark' ? 'gray' : 'navy'} 1px, transparent 1px)
`,
backgroundSize: '20px 20px'
}} />
</div>

<div className="absolute inset-0">
<Book className="absolute top-1/4 left-1/4 text-indigo-300 dark:text-gray-600 opacity-20 w-40 h-40 animate-float" />
<GraduationCap className="absolute top-1/3 right-1/4 text-blue-300 dark:text-gray-600 opacity-20 w-40 h-40 animate-float-delayed" />
<PenTool className="absolute bottom-1/4 left-1/3 text-indigo-300 dark:text-gray-600 opacity-20 w-40 h-40 animate-float" />
<Calculator className="absolute bottom-1/3 right-1/3 text-blue-300 dark:text-gray-600 opacity-20 w-40 h-40 animate-float-delayed" />
</div>

<div className="relative z-10">
</div>
</div> */
}
