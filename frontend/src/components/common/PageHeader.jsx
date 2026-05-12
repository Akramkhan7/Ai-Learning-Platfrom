import React from "react";
import { Trash2 } from "lucide-react";

const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div className="flex items-center justify-between mb-4 ">
      <div className="flex justify-between w-screen">
        <h1 className="text-2xl font-medium text-slate-900 tracking-tight mb-2">
          {title}

        </h1>
      
       
        {subtitle && (<p className="text-sm text-slate-500">{subtitle}</p>)}
      </div>
      {children && <div> {children} </div>}
    </div>
  );
};

export default PageHeader;
