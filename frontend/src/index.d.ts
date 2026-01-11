type NotificationType = "info" | "error" | "warn" | "success" | "progress"


type NotificationRef= {
    close:() => void
}
type NotificationProvider = {
    add: (msg:string,t:NotificationType) => NotificationRef
}

type DeleteStatus = {isDeleted?: bool}

type FileTreeProvider = {
    getRoot: () => HTMLUListElement | null
    textAsk: (type: string) => Promise<string>
}


type ContextMenuOption = {
    id: string,
    txt: string,
    ico: string
} | false;

type ContextMenuOptions = ContextMenuOption[];
type ContextMenuCallback = (id:string) => value;

type ContextMenuProvider = {
    open(opt:ContextMenuOptions,callback:ContextMenuCallback,target?:Element | EventTarget | null): void
}

type SimpleModalProvider = {
    
    ask(title: string, placeholder?: string):Promise<text | null> ,

    confirm(title: string,msg:string):Promise<boolean>,

    alert(title: string,msg:string):Promise<null>

}