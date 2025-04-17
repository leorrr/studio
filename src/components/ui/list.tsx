import * as React from "react";
import { cn } from "@/lib/utils";

const List = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
    ({ className, ...props }, ref) => {
        return (
            <ul className={cn("list-none p-0", className)} ref={ref} {...props} />
        );
    }
);

List.displayName = "List";

const ListItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
    ({ className, ...props }, ref) => {
        return (
            <li className={cn("py-2", className)} ref={ref} {...props} />
        );
    }
);

ListItem.displayName = "ListItem";

export { List, ListItem };
